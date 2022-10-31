# reactive的实现原理

执行[reactive](https://cn.vuejs.org/api/reactivity-core.html#reactive)时，会返回一个对象的响应式代理。

`ES6`提供了[Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义。

## 源码函数调用

`reactive`

```mermaid
graph LR;
    A(reactive)-->B{isReadonly}--否-->D[createReactiveObject]-->E{isObject}--是-->F{IS_REACTIVE}--否-->G{existingProxy缓存}--否-->H{targetType}--不是INVALID-->N[new Proxy]-->K[返回proxy];
    B{isReadonly}--只读-->C[结束并返回原对象]
    E{isObject}--否-->C
    F[IS_REACTIVE]--是-->L[结束并返回响应式对象]
    G{existingProxy缓存}--是-->M[结束并返回existingProxy]
    H{targetType}--是INVALID-->C
```
