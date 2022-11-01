import { extend, isArray, isIntegerKey, isMap, toNumber } from "@vue/shared";
import { ComputedRefImpl } from "./computed";
import {
  createDep,
  Dep,
  finalizeDepMarkers,
  initDepMarkers,
  newTracked,
  wasTracked,
} from "./dep";
import { EffectScope, recordEffectScope } from "./effectScope";
import { TrackOpTypes, TriggerOpTypes } from "./operations";

// The main WeakMap that stores {target -> key -> dep} connections.
// Conceptually, it's easier to think of a dependency as a Dep class
// which maintains a Set of subscribers, but we simply store them as
// raw Sets to reduce memory overhead.
type KeyToDepMap = Map<any, Dep>;
/** 存储原始数据 和 响应式对象 的 映射表 */
const targetMap = new WeakMap<any, KeyToDepMap>();

// The number of effects currently being tracked recursively.
/** 记录 efectt 嵌套深度 */
let effectTrackDepth = 0;

export let trackOpBit = 1;

/**
 * The bitwise track markers support at most 30 levels of recursion.
 * This value is chosen to enable modern JS engines to use a SMI on all platforms.
 * When recursion depth is greater, fall back to using a full cleanup.
 */
const maxMarkerBits = 30;

export type EffectScheduler = (...args: any[]) => any;

export type DebuggerEvent = {
  effect: ReactiveEffect;
} & DebuggerEventExtraInfo;

export type DebuggerEventExtraInfo = {
  target: object;
  type: TrackOpTypes | TriggerOpTypes;
  key: any;
  newValue?: any;
  oldValue?: any;
  oldTarget?: Map<any, any> | Set<any>;
};

/** 当前激活的 effect */
export let activeEffect: ReactiveEffect | undefined;

export const ITERATE_KEY = Symbol(__DEV__ ? "iterate" : "");
export const MAP_KEY_ITERATE_KEY = Symbol(__DEV__ ? "Map key iterate" : "");

/**
 * 副作用对象
 */
export class ReactiveEffect<T = any> {
  active = true; // 标识副作用函数是否响应上下文
  deps: Dep[] = []; // 存储副作用对象的所以依赖数据
  parent: ReactiveEffect | undefined = undefined; // 上一个 ReactiveEffect 的实例

  /**
   * Can be attached after creation
   * @internal
   */
  computed?: ComputedRefImpl<T>;
  /**
   * @internal
   */
  allowRecurse?: boolean; // 是否运行递归
  /**
   * @internal
   */
  private deferStop?: boolean; // 延迟停止

  onStop?: () => void;
  // dev only
  onTrack?: (event: DebuggerEvent) => void;
  // dev only
  onTrigger?: (event: DebuggerEvent) => void;

  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null,
    scope?: EffectScope
  ) {
    // 记录当前 effect 作用域，因为effect 存在嵌套情况
    recordEffectScope(this, scope);
  }

  run() {
    // 当active 为false 的时候，直接执行 fn,并返回
    if (!this.active) {
      return this.fn();
    }

    /**
     * 处理场景:
     * effect(() => {
     *   const a = 'a'
     *  effect(() =>{
     *   const b = 'b'
     *  })
     *  const c = 'c'
     * })
     */
    // 存储上次 ReactiveEffect 对象
    // 下面 并没有使用 parent 这个变量，所以。。。。待定
    let parent: ReactiveEffect | undefined = activeEffect;
    // 缓存 是否可以跟踪依赖 上一次的结果
    let lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      this.parent = activeEffect; // 记录 上一次 ReactiveEffect 对象
      activeEffect = this; // 缓存当前 活跃的   ReactiveEffect 对象
      shouldTrack = true; // 允许追踪依赖

      trackOpBit = 1 << ++effectTrackDepth; // 定义当前的 ReactiveEffect 对象层级

      if (effectTrackDepth <= maxMarkerBits) {
        // 标记 当前的 ReactiveEffect 对象依赖已经收集了
        initDepMarkers(this);
      } else {
        // 超过了 31，也就是满了，清空副作用
        cleanupEffect(this);
      }
      return this.fn();
    } finally {
      // 当前层级没超过最大层级限制，清空标记
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }
      trackOpBit = 1 << --effectTrackDepth;

      activeEffect = this.parent; // 回到上一层 ReactiveEffect
      shouldTrack = lastShouldTrack;
      this.parent = undefined;

      if (this.deferStop) {
        // 延迟停止
        this.stop();
      }
    }
  }

  stop() {
    // stopped while running itself - defer the cleanup
    if (activeEffect === this) {
      // 开启延迟停止
      this.deferStop = true;
    } else if (this.active) {
      // 删除当前 ReactiveEffect 中的dep 依赖数据
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false; // 关闭收集依赖
    }
  }
}

// 清空依赖数据（清除副作用函数effect)
function cleanupEffect(effect: ReactiveEffect) {
  const { deps } = effect;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
    }
    deps.length = 0;
  }
}

export interface DebuggerOptions {
  onTrack?: (event: DebuggerEvent) => void;
  onTrigger?: (event: DebuggerEvent) => void;
}

export interface ReactiveEffectOptions extends DebuggerOptions {
  lazy?: boolean;
  scheduler?: EffectScheduler;
  scope?: EffectScope;
  allowRecurse?: boolean;
  onStop?: () => void;
}

export interface ReactiveEffectRunner<T = any> {
  (): T;
  effect: ReactiveEffect;
}

// 用于包裹 副作用函数
export function effect<T = any>(
  fn: () => T,
  options?: ReactiveEffectOptions
): ReactiveEffectRunner {
  if ((fn as ReactiveEffectRunner).effect) {
    fn = (fn as ReactiveEffectRunner).effect.fn;
  }

  // 实例 化 ReactiveEffect 对象
  const _effect = new ReactiveEffect(fn);
  if (options) {
    // 合并属性
    extend(_effect, options);
    if (options.scope) recordEffectScope(_effect, options.scope); // 记录作用域
  }
  if (!options || !options.lazy) {
    // 不是延迟，就会里面执行 ReactiveEffect 对象 run 方法
    _effect.run();
  }
  // 手动绑定run方法的this
  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner;
  runner.effect = _effect;
  return runner;
}

// 停止副作用函数执行
export function stop(runner: ReactiveEffectRunner) {
  runner.effect.stop();
}
// 控制依赖收集标识
export let shouldTrack = true; // 是否可以发收集依赖
const trackStack: boolean[] = [];

// 暂停依赖收集
export function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}

// 开启依赖收集（此函数还被调用，所以。。。待定）
export function enableTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = true;
}

// 重置依赖收集
// 从 栈中取出 最新一条数据赋值给shouldTrack
export function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === undefined ? true : last;
}

/**
 *
 */
export function track(target: object, type: TrackOpTypes, key: unknown) {
  if (shouldTrack && activeEffect) {
    // 在 targetMap 查找是否有 target对象，没有则设置为一个为空的Map
    // 一个 target 对应着 一个 Map 集合
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    // 在 depsMap 查找是否 key 对应属性，没有则设置为一个空的Set
    // 一个 key 对应着 一个 Set 集合
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = createDep()));
    }

    const eventInfo = __DEV__
      ? { effect: activeEffect, target, type, key }
      : undefined;
    // dep 为 ReactiveEffect，也就是副作用对象
    // 将 dep 压入调度器中
    trackEffects(dep, eventInfo);
  }
}
/**
 * 收集依赖，建立双向引用
 */
export function trackEffects(
  dep: Dep,
  debuggerEventExtraInfo?: DebuggerEventExtraInfo
) {
  let shouldTrack = false;

  // effectTrackDepth 是在 ReactiveEffect中 run 方法中更改
  if (effectTrackDepth <= maxMarkerBits) {
    // 查看是否记录当前依赖
    if (!newTracked(dep)) {
      // 标记为新的依赖
      dep.n |= trackOpBit; // set newly tracked
      shouldTrack = !wasTracked(dep);
    }
  } else {
    // Full cleanup mode.
    // 当前 嵌套的深度依赖超过了 31 就不会继续在收集了
    shouldTrack = !dep.has(activeEffect!);
  }

  if (shouldTrack) {
    // 把 当前激活的 activeEffect对象 添加到dep中
    dep.add(activeEffect!);
    // 当前activeEffect对象 中的deps属性记录 当前dep，这样就建立双向引用
    activeEffect!.deps.push(dep);
    if (__DEV__ && activeEffect!.onTrack) {
      activeEffect!.onTrack({
        effect: activeEffect!,
        ...debuggerEventExtraInfo!,
      });
    }
  }
}

/**
 * 触发依赖更新
 */
export function trigger(
  target: object,
  type: TriggerOpTypes,
  key?: unknown,
  newValue?: unknown,
  oldValue?: unknown,
  oldTarget?: Map<unknown, unknown> | Set<unknown>
) {
  // 没有被收集 target，直接返回
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    // never been tracked
    return;
  }

  // 用于存储将要被触发的副作用对象数据
  let deps: (Dep | undefined)[] = [];
  if (type === TriggerOpTypes.CLEAR) {
    // collection being cleared
    // trigger all effects for target
    // target对象的所有属性被清空，此时target所有依赖副作用函数都会被触发
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target)) {
    // 如果是数组，并且key为length属性，那么依赖lenght属性和索引值大于等于新的length属性值都触发对应的副作用函数
    depsMap.forEach((dep, key) => {
      if (key === "length" || key >= toNumber(newValue)) {
        deps.push(dep);
      }
    });
  } else {
    // schedule runs for SET | ADD | DELETE
    // 此时key 不为 undefined，从depsMap获取deps
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }

    // also run for iteration key on ADD | DELETE | Map.SET
    switch (type) {
      // 新增依赖
      case TriggerOpTypes.ADD:
        if (!isArray(target)) {
          // 集合的 ownKeys，size，forEach 方法,设置了 key为ITERATE_KEY
          // 这些方法都触发依赖更新
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            // 集合的 keys方法里，设置了 key 为 MAP_KEY_ITERATE_KEY
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          // new index added to array -> length changes
          //当前修改的是数组且是新增值
          //例如 arr.length = 3 arr[4] = 8
          //此时数组长度会发生改变所以当前数组的
          //length属性依然需要被放入依赖
          deps.push(depsMap.get("length"));
        }
        break;
      case TriggerOpTypes.DELETE:
        //删除依赖，与新增依赖类似的逻辑
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case TriggerOpTypes.SET:
        // 更改
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }

  const eventInfo = __DEV__
    ? { target, type, key, newValue, oldValue, oldTarget }
    : undefined;

  if (deps.length === 1) {
    // 过滤掉 undefined
    if (deps[0]) {
      if (__DEV__) {
        triggerEffects(deps[0], eventInfo);
      } else {
        triggerEffects(deps[0]);
      }
    }
  } else {
    const effects: ReactiveEffect[] = [];
    for (const dep of deps) {
      if (dep) {
        // 取出副作用对象存储到effects中
        effects.push(...dep);
      }
    }
    if (__DEV__) {
      triggerEffects(createDep(effects), eventInfo);
    } else {
      // 执行所有副作用函数
      triggerEffects(createDep(effects));
    }
  }
}

/**
 *
 */
export function triggerEffects(
  dep: Dep | ReactiveEffect[],
  debuggerEventExtraInfo?: DebuggerEventExtraInfo
) {
  // spread into array for stabilization
  const effects = isArray(dep) ? dep : [...dep];
  // 先执行副作用对象里包含computed 的函数
  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect, debuggerEventExtraInfo);
    }
  }
  // 再执行不含的
  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect, debuggerEventExtraInfo);
    }
  }
}

function triggerEffect(
  effect: ReactiveEffect,
  debuggerEventExtraInfo?: DebuggerEventExtraInfo
) {
  if (effect !== activeEffect || effect.allowRecurse) {
    // 开发环境里，onTrigger声明周期
    if (__DEV__ && effect.onTrigger) {
      effect.onTrigger(extend({ effect }, debuggerEventExtraInfo));
    }
    // 如果有调度器就执行调度器，这个调度器可以上层自行决定执行实际
    // 反之就执行副作用函数
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
