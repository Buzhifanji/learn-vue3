import { ReactiveEffect, trackOpBit } from "./effect";

export type Dep = Set<ReactiveEffect> & TrackedMarkers;

/**
 * wasTracked and newTracked maintain the status for several levels of effect
 * tracking recursion. One bit per level is used to define whether the dependency
 * was/is tracked.
 */
type TrackedMarkers = {
  /**
   * wasTracked
   */
  w: number; // 大于 0，代表着被收集过了
  /**
   * newTracked
   */
  n: number; // 大于 0，代表着是新的依赖（
};

export const createDep = (effects?: ReactiveEffect[]): Dep => {
  const dep = new Set<ReactiveEffect>(effects) as Dep;
  dep.w = 0;
  dep.n = 0;
  return dep;
};

/** 用于判断是否已经收集过了 */
export const wasTracked = (dep: Dep): boolean => (dep.w & trackOpBit) > 0;

/** 用于判断是否为新的依赖 */
export const newTracked = (dep: Dep): boolean => (dep.n & trackOpBit) > 0;

/** 将当前副作用函数标记 为已经被收集*/
export const initDepMarkers = ({ deps }: ReactiveEffect) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit; // set was tracked
    }
  }
};

/**
 * 副作用执行完，整理effect相关数据
 */
export const finalizeDepMarkers = (effect: ReactiveEffect) => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      if (wasTracked(dep) && !newTracked(dep)) {
        // 如果以前被收集过，并且不是重新收集，清空副作用
        dep.delete(effect);
      } else {
        // 反之添加副作用
        deps[ptr++] = dep;
      }
      // clear bits
      // 标记回归，把 w 和 n标记重置到effect执行前的状态
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
