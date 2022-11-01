import { ReactiveEffect } from "./effect";
import { warn } from "./warning";

let activeEffectScope: EffectScope | undefined;

// 创建组件实例的时候，会用上
export class EffectScope {
  /**
   * @internal
   */
  active = true; // 是否被激活
  /**
   * @internal
   */
  effects: ReactiveEffect[] = []; // 存储副作用函数
  /**
   * @internal
   */
  cleanups: (() => void)[] = [];

  /**
   * only assigned by undetached scope
   * @internal
   */
  parent: EffectScope | undefined; // 父作用域
  /**
   * record undetached scopes
   * @internal
   */
  scopes: EffectScope[] | undefined; // 当前作用域
  /**
   * track a child scope's index in its parent's scopes array for optimized
   * removal
   * @internal
   */
  private index: number | undefined;

  constructor(public detached = false) {
    this.parent = activeEffectScope; // 赋值上一个 activeEffectScope
    if (!detached && activeEffectScope) {
      // 把当前作用域记录到上一个 activeEffectScope 的scopes中
      this.index =
        (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this
        ) - 1;
    }
  }

  run<T>(fn: () => T): T | undefined {
    if (this.active) {
      // 缓存 activeEffectScope
      const currentEffectScope = activeEffectScope;
      try {
        // 把当前作用域 暴露出去
        activeEffectScope = this;
        return fn();
      } finally {
        // 重新 更新activeEffectScope，确保activeEffectScope为根作用域
        activeEffectScope = currentEffectScope;
      }
    } else if (__DEV__) {
      warn(`cannot run an inactive effect scope.`);
    }
  }

  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }

  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }

  stop(fromParent?: boolean) {
    if (this.active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      // nested scope, dereference from parent to avoid memory leaks
      if (!this.detached && this.parent && !fromParent) {
        // optimized O(1) removal
        const last = this.parent.scopes!.pop();
        if (last && last !== this) {
          this.parent.scopes![this.index!] = last;
          last.index = this.index!;
        }
      }
      this.parent = undefined;
      this.active = false;
    }
  }
}

export function effectScope(detached?: boolean) {
  return new EffectScope(detached);
}

// 记录当前作用域
export function recordEffectScope(
  effect: ReactiveEffect,
  scope: EffectScope | undefined = activeEffectScope
) {
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}

export function getCurrentScope() {
  return activeEffectScope;
}

export function onScopeDispose(fn: () => void) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn);
  } else if (__DEV__) {
    warn(
      `onScopeDispose() is called when there is no active effect scope` +
        ` to be associated with.`
    );
  }
}
