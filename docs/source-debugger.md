# 源码调试

1.克隆代码

```console
git clone git@github.com:vuejs/core.git
```

2. 安装依赖包

```console
pnpm i
```

3. 打开sourcemap

在`package.json`中配置

```console
"dev": "node scripts/dev.js --sourcemap",
```
4.调式`vue`代码

执行`pnpm dev`,此时在`packages/vue`目录下就会多出一个`dist`文件，这就是打包后的文件。

然后可以调试`packages/vue/examples`的代码了。

5. debugger 测试用例
  
在`vscode`商品搜索`Jest Runner`插件，然后点击安装

找到想要调试的测试用例，在`test`上面会多出一行``Run|Debug`,点击`Debug`,就可以调试测试代码