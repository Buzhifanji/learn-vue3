import {
  extend,
  hasChanged,
  hasOwn,
  isArray,
  isIntegerKey,
  isObject,
  isSymbol,
  makeMap,
} from "@vue/shared";
import {
  ITERATE_KEY,
  pauseTracking,
  resetTracking,
  track,
  trigger,
} from "./effect";
import { TrackOpTypes, TriggerOpTypes } from "./operations";
import {
  isReadonly,
  isShallow,
  reactive,
  ReactiveFlags,
  reactiveMap,
  readonly,
  readonlyMap,
  shallowReactiveMap,
  shallowReadonlyMap,
  Target,
  toRaw,
} from "./reactive";
import { isRef } from "./ref";
import { warn } from "./warning";

const isNonTrackableKeys = /*#__PURE__*/ makeMap(`__proto__,__v_isRef,__isVue`);

const builtInSymbols = new Set(
  /*#__PURE__*/
  Object.getOwnPropertyNames(Symbol)
    // ios10.x Object.getOwnPropertyNames(Symbol) can enumerate 'arguments' and 'caller'
    // but accessing them on Symbol leads to TypeError because Symbol is a strict mode
    // function
    .filter((key) => key !== "arguments" && key !== "caller")
    .map((key) => (Symbol as any)[key])
    .filter(isSymbol)
);

const get = /*#__PURE__*/ createGetter();
const shallowGet = /*#__PURE__*/ createGetter(false, true);
const readonlyGet = /*#__PURE__*/ createGetter(true);
const shallowReadonlyGet = /*#__PURE__*/ createGetter(true, true);

const arrayInstrumentations = /*#__PURE__*/ createArrayInstrumentations();

/**
 * 处理响应式数组：重写数组'includes', 'indexOf', 'lastIndexOf'，'push', 'pop', 'shift', 'unshift', 'splice'七个api
 *
 */
function createArrayInstrumentations() {
  const instrumentations: Record<string, Function> = {};
  // instrument identity-sensitive Array methods to account for possible reactive
  // values

  /**
   *  为什么此处对这个三个方法重写包装呢？
   *  这里需要注意 这三个api用法里的第二个参数，由于这个参数存在，可能会导致数组遍历不是索引0开始，在这种情况下，就会出现数组中的元素不是响应式。
   *  所以为了全部数组中的数据都是响应式的，从头遍历一次数据。
   */
  (["includes", "indexOf", "lastIndexOf"] as const).forEach((key) => {
    instrumentations[key] = function (this: unknown[], ...args: unknown[]) {
      // 获取数组数据
      const arr = toRaw(this) as any;
      // 遍历数组，并收集 get 依赖
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, TrackOpTypes.GET, i + "");
      }
      // we run the method using the original args first (which may be reactive)
      // 执行 查找
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        // if that didn't work, run it again using raw values.
        // 如果没有找到，就尝试把参数转变成 原始数据，重新查找一次
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  // instrument length-altering mutation methods to avoid length being tracked
  // which leads to infinite loops in some cases (#2137)

  /**
   * 'push', 'pop', 'shift', 'unshift', 'splice' 会改变数组，重写为了确保修改后的数组也是响应式的
   *
   */
  (["push", "pop", "shift", "unshift", "splice"] as const).forEach((key) => {
    instrumentations[key] = function (this: unknown[], ...args: unknown[]) {
      // 开启 依赖收集
      pauseTracking();
      // 执行 数组api方法
      const res = (toRaw(this) as any)[key].apply(this, args);
      // 执行完后重置依赖收集
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}

/**
 * 创建 getter
 * @param isReadonly 是否只读
 * @param shallow  是否浅代理
 * @returns
 */
function createGetter(isReadonly = false, shallow = false) {
  return function get(target: Target, key: string | symbol, receiver: object) {
    //此处结合 isReactive 这个 api 一起来看会更容易理解
    // 当 调用 isReactive api的时候，如果不是只读，会读取 key 为 ReactiveFlags.IS_REACTIVE的属性，然后会执行get，进入此函数
    if (key === ReactiveFlags.IS_REACTIVE) {
      // 判断 是不是 isReactive
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      // 判断 是不是 isReadonly
      return isReadonly;
    } else if (key === ReactiveFlags.IS_SHALLOW) {
      // 判断 是不是 isShallow
      return shallow;
    } else if (
      // 原始值
      key === ReactiveFlags.RAW &&
      // 避免从原型上获取不属于自己的对象
      receiver ===
        (isReadonly
          ? shallow
            ? shallowReadonlyMap
            : readonlyMap
          : shallow
          ? shallowReactiveMap
          : reactiveMap
        ).get(target)
    ) {
      return target;
    }

    const targetIsArray = isArray(target);

    // 处理 数组
    if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }

    // 通过 Reflect.get 读取对象属性
    const res = Reflect.get(target, key, receiver);

    //  不拦截内置Symbol属性和__proto__,__v_isRef和__isVue属性
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }

    if (!isReadonly) {
      // 收集 target对象 key对应的依赖
      track(target, TrackOpTypes.GET, key);
    }

    // 如果是创建 shallowReactive、或是 shallowReadonly，转换就到此结束了，就不会继续处理嵌套数据了
    if (shallow) {
      return res;
    }

    if (isRef(res)) {
      // ref unwrapping - skip unwrap for Array + integer key.

      // 处理 reactivity 属性值 为 Ref 实例
      // eg: const name = 'v', info = reactive({name})
      // console.log(info.name) // v
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }

    if (isObject(res)) {
      // Convert returned value into a proxy as well. we do the isObject check
      // here to avoid invalid value warning. Also need to lazy access readonly
      // and reactive here to avoid circular dependency.
      // 如果 属性值 是个对象，继续把 属性值 res 转换成响应式对象
      // 这里惰性转换，只有读取的res 的时候，会触发转换
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  };
}

const set = /*#__PURE__*/ createSetter();
const shallowSet = /*#__PURE__*/ createSetter(true);

/**
 * 创建 setter
 */
function createSetter(shallow = false) {
  return function set(
    target: object,
    key: string | symbol,
    value: unknown,
    receiver: object
  ): boolean {
    // 读取旧属性值
    let oldValue = (target as any)[key];
    // 如果 旧属性值是只读并且是Ref,而新值不是Ref，就返回false，意味着不会更新
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow) {
      // 既不是 浅代理，又不是只读
      if (!isShallow(value) && !isReadonly(value)) {
        // 获取原始值
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      // 目标target 不是数组，并且 旧值是Ref，新值不是 Ref，则直接把把新值赋值到旧属性值上
      // 因为旧属性值为 Ref类型，Ref对象也是一个响应式对象，更新value时，会触发收集副作用函数压入调度器中
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    } else {
      // in shallow mode, objects are set as-is regardless of reactive or not
    }

    // 用于判断是新增还是修改属性
    const hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key);

    // 通过 Reflect.set 更新属性
    const result = Reflect.set(target, key, value, receiver);
    // don't trigger if target is something up in the prototype chain of original
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        // 触发 新增属性 的副作用函数压入调度器中
        trigger(target, TriggerOpTypes.ADD, key, value);
      } else if (hasChanged(value, oldValue)) {
        // 触发 更改属性 的副作用函数压入调度器中
        trigger(target, TriggerOpTypes.SET, key, value, oldValue);
      }
    }
    return result;
  };
}

/**
 * 拦截删除属性
 * 调用  Reflect.deleteProperty 删除属性，然后将触发 删除属性的副作用函数压入调度器中
 */
function deleteProperty(target: object, key: string | symbol): boolean {
  const hadKey = hasOwn(target, key);
  const oldValue = (target as any)[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, TriggerOpTypes.DELETE, key, undefined, oldValue);
  }
  return result;
}

/**
 * 拦截 has 判断是否有某个属性
 * 调用 Reflect.has，过滤内置Symbol属性，然后将触发 has属性的副作用函数压入调度器中
 */
function has(target: object, key: string | symbol): boolean {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, TrackOpTypes.HAS, key);
  }
  return result;
}

/**
 * 拦截遍历操作
 * 如果是数组，则追踪数组的length属性，反之是有effect模块提供的 ITERATE_KEY
 */
function ownKeys(target: object): (string | symbol)[] {
  track(target, TrackOpTypes.ITERATE, isArray(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}

export const mutableHandlers: ProxyHandler<object> = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys,
};

// 只读 没有 setter，也没有 deleteProperty
export const readonlyHandlers: ProxyHandler<object> = {
  get: readonlyGet,
  set(target, key) {
    if (__DEV__) {
      warn(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  },
  deleteProperty(target, key) {
    if (__DEV__) {
      warn(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  },
};

export const shallowReactiveHandlers = /*#__PURE__*/ extend(
  {},
  mutableHandlers,
  {
    get: shallowGet,
    set: shallowSet,
  }
);

// Props handlers are special in the sense that it should not unwrap top-level
// refs (in order to allow refs to be explicitly passed down), but should
// retain the reactivity of the normal readonly object.
export const shallowReadonlyHandlers = /*#__PURE__*/ extend(
  {},
  readonlyHandlers,
  {
    get: shallowReadonlyGet,
  }
);
