import { capitalize, hasChanged, hasOwn, isMap, toRawType } from "@vue/shared";
import { ITERATE_KEY, MAP_KEY_ITERATE_KEY, track, trigger } from "./effect";
import { TrackOpTypes, TriggerOpTypes } from "./operations";
import { ReactiveFlags, toRaw, toReactive, toReadonly } from "./reactive";

export type CollectionTypes = IterableCollections | WeakCollections;

type IterableCollections = Map<any, any> | Set<any>;
type WeakCollections = WeakMap<any, any> | WeakSet<any>;
type MapTypes = Map<any, any> | WeakMap<any, any>;
type SetTypes = Set<any> | WeakSet<any>;

const toShallow = <T extends unknown>(value: T): T => value;

const getProto = <T extends CollectionTypes>(v: T): any =>
  Reflect.getPrototypeOf(v);

/**
 * 拦截 Map 或者 WeakMap get 方法
 */
function get(
  target: MapTypes,
  key: unknown,
  isReadonly = false,
  isShallow = false
) {
  // #1772: readonly(reactive(Map)) should return readonly + reactive version
  // of the value
  // 获取原始值
  target = (target as any)[ReactiveFlags.RAW];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly) {
    // 这里需要注意的是，key有可能是响应式对象，
    if (key !== rawKey) {
      // 可以为 响应式对象，需要把 响应式对象的副作用函数压入调度器中
      track(rawTarget, TrackOpTypes.GET, key);
    }
    // 把 原始值 key 的副作用函数压入调度器中
    track(rawTarget, TrackOpTypes.GET, rawKey);
  }
  // 获取 原型链上has 方法，用于判断 原始值rawTarget是否在原型链上
  const { has } = getProto(rawTarget);
  // 用于 确定转换成响应式类型
  const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
  if (has.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    // #3602 readonly(reactive(Map))
    // ensure that the nested reactive `Map` can do tracking for itself

    /**
     * 针对readonly(reactive(new Map()))，即使没有匹配的键值对，也要跟踪对响应式对象某键的依赖信息
     * const state = reactive(new Map())
     * const readonlyState = readonly(state)
     *
     * effect(() => {
     *  console.log(readonlyState.get('foo'))
     * })
     * // 回显 undefined
     * state.set('foo', 1)
     * // 回显 1
     */
    target.get(key);
  }
}

/**
 * 拦截 集合 的 has 方法
 */
function has(this: CollectionTypes, key: unknown, isReadonly = false): boolean {
  // 获取原始值
  const target = (this as any)[ReactiveFlags.RAW];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly) {
    // 与 get 逻辑一样，key也可能是响应式数据
    if (key !== rawKey) {
      track(rawTarget, TrackOpTypes.HAS, key);
    }
    track(rawTarget, TrackOpTypes.HAS, rawKey);
  }
  return key === rawKey
    ? target.has(key)
    : target.has(key) || target.has(rawKey);
}

/**
 * 拦截 集合 的 size 方法
 */
function size(target: IterableCollections, isReadonly = false) {
  // 获取原始值
  target = (target as any)[ReactiveFlags.RAW];
  // 不是 只读的情况，追踪effect模块提供的 ITERATE_KEY
  !isReadonly && track(toRaw(target), TrackOpTypes.ITERATE, ITERATE_KEY);
  return Reflect.get(target, "size", target);
}

/**
 * 拦截 set、weakSet 的add 方法
 */
function add(this: SetTypes, value: unknown) {
  // 获取原始值
  value = toRaw(value);
  const target = toRaw(this);
  // 获取原型
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  // Set 集合里不会有重复值的，对于重复的元素，这里只会添加一次。
  if (!hadKey) {
    // 没有对应的key，才执行添加操作
    target.add(value);
    // 触发执行将副作用的函数压入调度器中
    trigger(target, TriggerOpTypes.ADD, value, value);
  }
  return this;
}

/**
 * 拦截 Map WeakMap 的set方法
 */
function set(this: MapTypes, key: unknown, value: unknown) {
  // 获取原始值
  value = toRaw(value);
  const target = toRaw(this);
  // 获取原型上的 has、get 方法
  const { has, get } = getProto(target);

  // 获取 key
  let hadKey = has.call(target, key);
  // 没有hadKey,就代表着第一次添加，需要处理key，因为key有可能是响应式数据
  if (!hadKey) {
    // 获取 key的原始值
    key = toRaw(key);
    // 根据 key的原始值 去判断target是否存在key
    hadKey = has.call(target, key);
  } else if (__DEV__) {
    checkIdentityKeys(target, has, key);
  }
  // 获取旧值
  const oldValue = get.call(target, key);
  // 执行 set，更新集合数据
  target.set(key, value);
  if (!hadKey) {
    // 触发将 集合新增 的副作用函数压入调度器中
    trigger(target, TriggerOpTypes.ADD, key, value);
  } else if (hasChanged(value, oldValue)) {
    // 新旧值不相等，说明值发生了改变，
    // 触发将 集合更改 的副作用函数压入调度器中
    trigger(target, TriggerOpTypes.SET, key, value, oldValue);
  }
  return this;
}

/**
 * 拦截 集合的 delete 方法
 */
function deleteEntry(this: CollectionTypes, key: unknown) {
  // 获取target原始值
  const target = toRaw(this);
  // 获取 target原型上的get、has 方法
  const { has, get } = getProto(target);

  // 这里 与 拦截 set 方法里，处理key的逻辑是一样：处理key有可能是响应式数据情况
  let hadKey = has.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has.call(target, key);
  } else if (__DEV__) {
    checkIdentityKeys(target, has, key);
  }

  // 集合 Set 原型上是没有 get 方法的，所以需要处理
  const oldValue = get ? get.call(target, key) : undefined;
  // forward the operation before queueing reactions
  // 执行 删除 操作
  const result = target.delete(key);
  if (hadKey) {
    // 触发将 集合删除 的副作用函数压入调度器中
    trigger(target, TriggerOpTypes.DELETE, key, undefined, oldValue);
  }
  return result;
}

/**
 * 拦截 集合 的 clear 方法，这方法简单，当集合中的size不为0的时候，触发将副作用的函数压入调度器中
 */
function clear(this: IterableCollections) {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget = __DEV__
    ? isMap(target)
      ? new Map(target)
      : new Set(target)
    : undefined;
  // forward the operation before queueing reactions
  const result = target.clear();
  if (hadItems) {
    trigger(target, TriggerOpTypes.CLEAR, undefined, undefined, oldTarget);
  }
  return result;
}

/**
 * 拦截 集合 的 forEach 方法
 */
function createForEach(isReadonly: boolean, isShallow: boolean) {
  return function forEach(
    this: IterableCollections,
    callback: Function,
    thisArg?: unknown
  ) {
    // 获取原始值
    const observed = this as any;
    const target = observed[ReactiveFlags.RAW];
    const rawTarget = toRaw(target);
    // 用于 确定转换成响应式类型（拦截 get方法中，有类似的操作）
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    // 不是只读的数据，需要触发将集合iterate 副作用函数压入调度器中
    !isReadonly && track(rawTarget, TrackOpTypes.ITERATE, ITERATE_KEY);
    // 遍历 target，然后执行回调函数
    return target.forEach((value: unknown, key: unknown) => {
      // important: make sure the callback is
      // 1. invoked with the reactive map as `this` and 3rd arg
      // 2. the value received should be a corresponding reactive/readonly.
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}

interface Iterable {
  [Symbol.iterator](): Iterator;
}

interface Iterator {
  next(value?: any): IterationResult;
}

interface IterationResult {
  value: any;
  done: boolean;
}

/**
 * 处理 迭代器方法
 * 大体逻辑 和 createForEach类似，差异在于返回值
 */
function createIterableMethod(
  method: string | symbol,
  isReadonly: boolean,
  isShallow: boolean
) {
  return function (
    this: IterableCollections,
    ...args: unknown[]
  ): Iterable & Iterator {
    const target = (this as any)[ReactiveFlags.RAW];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair =
      method === "entries" || (method === Symbol.iterator && targetIsMap);
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly &&
      track(
        rawTarget,
        TrackOpTypes.ITERATE,
        isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
      );
    // 上面这部分逻辑和 createForEach 相似

    // return a wrapped iterator which returns observed versions of the
    // values emitted from the real iterator
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done
          ? { value, done }
          : {
              // entries 数据结构是个 2个元素的元组，所以需要分开处理
              value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
              done,
            };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      },
    };
  };
}

function createReadonlyMethod(type: TriggerOpTypes): Function {
  return function (this: CollectionTypes, ...args: unknown[]) {
    if (__DEV__) {
      const key = args[0] ? `on key "${args[0]}" ` : ``;
      console.warn(
        `${capitalize(type)} operation ${key}failed: target is readonly.`,
        toRaw(this)
      );
    }
    return type === TriggerOpTypes.DELETE ? false : this;
  };
}

// 这里 把 上面的函数组合在一起

function createInstrumentations() {
  const mutableInstrumentations: Record<string, Function> = {
    get(this: MapTypes, key: unknown) {
      return get(this, key);
    },
    get size() {
      return size(this as unknown as IterableCollections);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false),
  };

  const shallowInstrumentations: Record<string, Function> = {
    get(this: MapTypes, key: unknown) {
      return get(this, key, false, true);
    },
    get size() {
      return size(this as unknown as IterableCollections);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true),
  };

  const readonlyInstrumentations: Record<string, Function> = {
    get(this: MapTypes, key: unknown) {
      return get(this, key, true);
    },
    get size() {
      return size(this as unknown as IterableCollections, true);
    },
    has(this: MapTypes, key: unknown) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod(TriggerOpTypes.ADD),
    set: createReadonlyMethod(TriggerOpTypes.SET),
    delete: createReadonlyMethod(TriggerOpTypes.DELETE),
    clear: createReadonlyMethod(TriggerOpTypes.CLEAR),
    forEach: createForEach(true, false),
  };

  const shallowReadonlyInstrumentations: Record<string, Function> = {
    get(this: MapTypes, key: unknown) {
      return get(this, key, true, true);
    },
    get size() {
      return size(this as unknown as IterableCollections, true);
    },
    has(this: MapTypes, key: unknown) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod(TriggerOpTypes.ADD),
    set: createReadonlyMethod(TriggerOpTypes.SET),
    delete: createReadonlyMethod(TriggerOpTypes.DELETE),
    clear: createReadonlyMethod(TriggerOpTypes.CLEAR),
    forEach: createForEach(true, true),
  };

  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations[method as string] = createIterableMethod(
      method,
      false,
      false
    );
    readonlyInstrumentations[method as string] = createIterableMethod(
      method,
      true,
      false
    );
    shallowInstrumentations[method as string] = createIterableMethod(
      method,
      false,
      true
    );
    shallowReadonlyInstrumentations[method as string] = createIterableMethod(
      method,
      true,
      true
    );
  });

  return [
    mutableInstrumentations,
    readonlyInstrumentations,
    shallowInstrumentations,
    shallowReadonlyInstrumentations,
  ];
}

const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations,
] = /* #__PURE__*/ createInstrumentations();

/**
 * 创建 集合 getter 的通用方法
 */
function createInstrumentationGetter(isReadonly: boolean, shallow: boolean) {
  const instrumentations = shallow
    ? isReadonly
      ? shallowReadonlyInstrumentations
      : shallowInstrumentations
    : isReadonly
    ? readonlyInstrumentations
    : mutableInstrumentations;

  return (
    target: CollectionTypes,
    key: string | symbol,
    receiver: CollectionTypes
  ) => {
    // 判断 数据类型
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    } else if (key === ReactiveFlags.RAW) {
      // 用于 获取 target 的 原始值
      return target;
    }

    return Reflect.get(
      hasOwn(instrumentations, key) && key in target
        ? instrumentations
        : target,
      key,
      receiver
    );
  };
}

export const mutableCollectionHandlers: ProxyHandler<CollectionTypes> = {
  get: /*#__PURE__*/ createInstrumentationGetter(false, false),
};

export const shallowCollectionHandlers: ProxyHandler<CollectionTypes> = {
  get: /*#__PURE__*/ createInstrumentationGetter(false, true),
};

export const readonlyCollectionHandlers: ProxyHandler<CollectionTypes> = {
  get: /*#__PURE__*/ createInstrumentationGetter(true, false),
};

export const shallowReadonlyCollectionHandlers: ProxyHandler<CollectionTypes> =
  {
    get: /*#__PURE__*/ createInstrumentationGetter(true, true),
  };

function checkIdentityKeys(
  target: CollectionTypes,
  has: (key: unknown) => boolean,
  key: unknown
) {
  const rawKey = toRaw(key);
  if (rawKey !== key && has.call(target, rawKey)) {
    const type = toRawType(target);
    console.warn(
      `Reactive ${type} contains both the raw and reactive ` +
        `versions of the same object${type === `Map` ? ` as keys` : ``}, ` +
        `which can lead to inconsistencies. ` +
        `Avoid differentiating between the raw and reactive versions ` +
        `of an object and only use the reactive version if possible.`
    );
  }
}
