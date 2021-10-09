# 从组件按需引入深入前端打包构建

***Author 张柯雨***



## 一、一段失败的面试

让我们先来看一段Element-UI使用者典型的面试问答

> 面：什么是组件的按需引入？
>
> 回：按需引入就是在项目中只引入并打包自己所需要使用到的组件，将其它无需使用的组件代码剔除出去从而缩小项目体积，提升页面加载速度。（简单简单）
>
> 面：那怎么实现组件按需引入呢？
>
> 回：貌似是有一个babel配置，balabala。。。（有一点心慌，细节记不清了）
>
> 面：什么原理呢？
>
> 回：嗯。。。（没看过啊）
>
> 面：知道Tree-Shaking么?为什么不直接用Tree-Shaking来做呢？
>
> 回：嗯，知道是知道。。。（对啊，为什么不用呢？）
>
> 面：那你对Monorepo有了解么？
>
> 回： 听过。。。（也只是听过）
>
> 面： 感谢你参加今天的面试，再见。
>
> 回： 再见。😭

大家可以在阅读文章之前先自行回答一下上面所提到的问题，看看自己知道多少。如果发现自己并不比上面的面试者懂得更多的话，那么你需要深入研究一下组件按需引入这个话题了。

可以看到在使用组件库进行前端页面开发的过程中，组件按需引入是每个前端程序员在开发过程中都或多或少了解过的功能。但与此同时，它又是一个很多同学没有深入研究，只停留在复制粘贴组件库官方文档所提供的方法到自己项目中使用的功能。这篇文章将从组件库按需引入方式的介绍入手，进一步加深读者对前端工程化中遇到的问题和概念的理解。

> ***注意：文章中的代码写法仅为讲解示例使用，并非为真正组件库的开发设计。示例组件库并未上传NPM，通过本地`npm link`来模拟安装。另外，相关代码已经全部上传至https://github.com/Owen9511/OnDemandImport*

## 二、没有按需引入的世界

那是一个混沌的时代，大地上熔岩遍地，天空中电闪雷鸣，世界上只存在WEB程序员。在那个前端程序员还处在襁褓之中的年代，JS还只是玩具语言，用户页面的交互也非常有限。与庞大的JAVA后端代码相比，没有人能够想到前端代码的体积还需要被优化缩减。

停一下。。。这里我们不再深入研究过去的历史，但是我们可以通过现代的手段来展示一下没有按需引入的组件库是如何工作的（当然现在大部分前端程序员在使用组件库时也是这样做的）。

### **虚构一个最最简单的组件库**

my-compo-test这个组件库由两个只返回一段字符串的组件构成。

```javascript
// mycompotest/lib/components/Alert/index.js 
import './style/index.css'

export default function alert(){
    return 'alert'
}
```



```javascript
// mycompotest/lib/components/Button/index.js 
import './style/index.css'

export default function button(){
    return 'button'
}
```

作为组件库的作者，我们决定使用Webpack来对其进行打包构建，同时为了打包出的代码可以以多种方式被不同的使用者使用，我们采取了umd输出的方式。

```javascript
// mycompotest/webpack.config.js
module.exports = {
    mode: 'none',
    entry: './lib/index.js',
    output: {
        filename: 'index.js',
        path: __dirname + '/dist',
        library: {
            name: 'myCompoTest',
          	// 注意：这里为了使组件库能被不同引入方式的使用者使用，我们输出了UMD格式
            type: 'umd'
        },
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        },{
            test: /\.js$/,
          	// 注意：同上，为了通用性，我们通过babel转译了我们的语法,babel配置如下
            use: 'babel-loader'
        },]
    }
}

=========================================================================
// mycompotest/.babelrc
{
    "presets": [
      "@babel/preset-env"
    ]
}
```

之后，我们打包这个组件库并且配置package.json中的main字段将打包后的文件暴露给组件库使用者。

```javascript
// mycompotest/package.json
{
  "name": "my-compo-test",
  "version": "1.0.0",
  "description": "",
  "main": "dist/index.js",
  // 省略之后的....
}
```

### 如何引用组件库

从组件使用者的角度，我们需要在工程中引入my-compo-test中的Button组件。

```javascript
// test/index.js
import {Button} from 'my-compo-test'

console.log(Button)
```

之后我们配置webpack以及babel并对这个项目进行打包。

```javascript
// test/webpack.config.js
module.exports = {
    mode: 'none',
    entry: './index.js',
    output: {
        filename: 'index.js',
        path: __dirname + '/dist',
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        },{
            test: /\.js$/,
            use: 'babel-loader'
        },]
    }
}

// test/.babelrc
{
    "presets": [
      "@babel/preset-env"
    ]
}
```

观察打包结果，在dist目录下的index.js文件中可以看到打包出来的代码不仅包含了Button按钮组件及其相关样式，同时也将Alert组件及其相关样式一同打包进去了。

```javascript
// test/dist/index.js

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// =======省略中间内容=========
var css_248z$1 = ".button{\n    background-color: white;\n}";
styleInject(css_248z$1);

function button() {
  return 'button';
}

var css_248z = ".alert{\n    background-color: black;\n}";
styleInject(css_248z);

function alert() {
  return 'alert';
}

var index = {
  Button: button,
  Alert: alert
};

// =======省略之后内容=========
```

### 结论

这样整体引入的做法在我们这个虚构的小组件库中当然可以。但是一旦组件库变得庞大起来，这种只为了使用组件库中的某一个组件从而打包全部组件库代码的行为就开始变得不可接受了起来。从这时开始，聪明的程序员们为了缩减代码体积提出了组件按需引入的概念，也就是下面我们所要重点讲解的内容。

## 三. 最原始的方式 —— 手动引入

先停下来代入那个还没有任何辅助手段的年代思考一下，如果让你实现上面组件库的按需引入，你会怎么做？

没错，第一反应就是我只引用我需要使用的文件而不引用其它组件不就可以了么？

### 如何实现手动引入

找到my-compo-test组件库的代码，可以看到Button组件的目录为`my-compo-test/lib/components/Button`

```javascript
// test/index.js
import Button from 'my-compo-test/lib/components/Button'

console.log(Button)
```

我们再重新运行`npm run build`打包看一下结果，可以看到Alert组件相关的代码及样式已经被移除了。

```javascript
// test/dist/index.js

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
  
// =======省略中间内容=========
function button() {
  return 'button';
}
  
// =======省略中间内容=========
var ___CSS_LOADER_EXPORT___ = _test_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_test_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".button{\n    background-color: white;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);
  
 
// =======省略之后内容=========
```

### 结论

通过手动引入需要的组件文件，我们初步实现了组件的按需引入。但是，从使用者的角度出发，这样的方式需要深入了解组件库代码，如组件放在哪里、应该引用哪些文件都需要被思考，十分不便。因此，现在大部分组件库已经放弃了这种方式。



## 四. 进阶模式 —— Babel-plugin-import

既然我们靠手动引入的方式能够实现组件的按需引入，那么只需要再往前走一步，让程序自动帮助我们把第二节中的代码转换成第三节中的代码不就可以了嘛。那怎么实现自动转换呢？如果你对前端工程化比较了解的话，那么你一定会想到Babel。通常我们使用Babel是为了将ES6的一些语法转换从而让低版本浏览器也能运行我们的代码，Babel之所以能够做到这点是通过分析代码得到AST(Abstract Syntax Tree)并对其进行修改。换个思路，我们的`import {Button} from 'my-compo-test'`语句同样可以通过Babel的解析和修改最终成为`import Button from 'my-compo-test/lib/components/Button'`的样子。没错，这就是Element-UI、iView等组件库实现组件按需引入的方式。

当然，你可以自己写一个Babel插件来实现这样的转换，不过没有必要再造一个轮子了——Babel-plugin-import这个插件已经能够实现我们大部分需要了。

### 如何使用Babel-plugin-import

重新调整组件引入代码为第二节中没有特殊处理过的。

```javascript
// test/index.js
import {Button} from 'my-compo-test'

console.log(Button)
```

在.babelrc中配置该组件的使用。

```javascript
// test/.babelrc
{
    "presets": [
      "@babel/preset-env"
    ],
    // 注意：借助babel-plugin-import引入
    "plugins": [["import",{
      	// 组件库名称
        "libraryName": "my-compo-test",
      	// 组件位置
        "libraryDirectory": "lib/components",
      	// 组件样式位置
        "style": "style/index.css"
    }]]
}
```

再次打包观察结果，可以看到同样Alert组件相关的代码及样式已经被移除了。

```javascript
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ button)
/* harmony export */ });
/* harmony import */ var _style_index_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);

function button() {
  return 'button';
}
  
// =======省略中间内容=========
var ___CSS_LOADER_EXPORT___ = _test_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_test_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".button{\n    background-color: white;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);

// =======省略之后内容=========
```

### 结论

Babel-plugin-import借助Babel解析编辑ATS的能力实现了一种成熟的组件按需引入方式，目前很多的组件库都是依靠这种方式进行了实现，例如Element-UI等。这种方式的优点是不需要库使用者了解原理，只需按照文档说明配置即可。缺点是使用者仍旧需要为了按需引入来增加可能本来无需使用的Babel及其相关配置（这点也是目前仍然有大量程序员不使用组件按需引入功能的原因，不是所有人都想触碰Babel配置的，尤其当他还不够了解Babel机制的时候）。



## 五. Tree-Shaking能够实现吗？

跳出之前的解决方案，让我们来思考一下还有别的方案能够实现么？

用过Lodash等函数库的同学可能知道，在很多时候，我们引入Lodash只是为了使用其中的一两个函数，因此我们需要通过Tree-Shaking来摇掉其他不必要的函数（当然很多程序员也是不做这一步的，谢天谢地，高速的网络基建拯救了你们的项目）。

### 什么是Tree-Shaking

这里首先简单介绍一下什么是Tree-Shaking以及它大概的原理，以便于还没有深入了解过这个概念的同学建立一个初步的映像。

其实早在编译原理中就有DCE(dead code eliminnation)的概念，作用是消除不可能执行的代码，它的工作原理是使用编辑器判断出某些代码是不可能执行的，然后清除。所谓Tree-shaking就是“摇”的意思，也是为了消除项目中不必要的JS模块或JS模块内代码，从而缩减项目的体积。可以说Tree-Shaking是DCE的一种实现。

需要明白的是Tree-shaking是依赖ESM这种模块引入方式的：

> ES6模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，从而构成了tree-shaking的基础。所谓静态分析就是不执行代码，从字面量上对代码进行分析，可以想一下在commonjs的模块化中我们可以动态require一个模块，只有执行后才知道引用的什么模块，这个就不能通过静态分析去做优化。总之就是一句话——代码是否有用只有在编译时分析，才不会影响运行时的状态。

Rollup最早实现了Tree-Shaking，后来Webpack2也实现了这个功能。网上已经有大量的文章对其进行了讲解，这里我们就不再对其进行深入研究了。

### 说起来容易做起来难

说起来容易做起来难是我对Tree-Shaking功能的看法。虽然我们只需要在webpack中配置几个相关的参数就可以开启Tree-Shaking的功能，但是最终无用的代码是否能被删除掉却完全是一个难以掌控的事情。主要难点在于以下几个方面：

1. **Webpack不支持ESM输出**

   上面说过Tree-shaking是依赖ESM模块引入机制才能实现的，但是很遗憾，查看Webpack文档可以发现，控制输出的字段`output.library.type`并不支持ESM模块的导出。不过从webpack5文档来看，未来是有希望支持的。

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gvbec5a9qxj60n407ggm202.jpg" alt="image-20211009155935527" style="zoom: 67%;" />

   因此，目前所有只通过Webpack打包的库就直接告别了Tree-Shaking。

2. **代码副作用难以掌控**

   Tree-Shaking更麻烦的一点是它只能删除没有副作用的无用代码，如果你不小心在代码中引入了副作用，那么同样你的这段代码也告别了Tree-Shaking。

   关于什么是代码副作用，我们这里有必要说明一下。下面给出了一个例子：

   ```javascript
   // deep会被保留因为String.prototype这个全局变量依赖了deep
   let deep = 'old';
   // count会被删除，因为导出的函数以及全局变量中并没有使用count
   let count = 0;
   
   function withSideEffect() {
     // 有副作用的函数，部分被保留
     count ++;
     String.prototype.addOneMethod = () => {
       return deep;
     };
     window.newProp = "new";
   }
   
   function withoutSideEffect() {
     // 没有副作用的函数，被全部删除
     count ++;
     deep = 'new';
     return count;
   }
   withoutSideEffect();
   withSideEffect();
   count++;
   
   export default function() {
   }
   ```

   Tree-Shaking打包后：

   ```javascript
   [
       function (e, t, n) {
           "use strict";
           n.r(t);
           let o = "old";
           o = "new", String.prototype.addOneMethod = () => o, window.newProp = "new";
           (async() => {
               console.log(">>>in index.js")
           })()
       }
   ]
   ```

   可以看到有副作用的代码有可能会对import该模块之后的代码运行产生影响（比如import该文件后调用`''.addOneMethod()`），而影响是否产生不能够通过静态分析确定，只能在运行时知道，因此Tree-Shaking不能删除这段代码。

   当然，有的同学可能会说，我的组件代码并不存在副作用啊，比如很多写React的同学可能会编写一个类似于以下这样的一个Class组件。

   ```javascript
   export class Person {
     constructor ({ name, age, sex }) {
       this.className = 'Person'
       this.name = name
       this.age = age
       this.sex = sex
     }
     getName () {
       return this.name
     }
     //....
   }
   ```

   看起来这段代码完全运行在一个类之中，没有对全局变量产生任何的影响，但是当你打包完组件库引入的时候会发现它***依然不会***被Tree-Shaking删除掉。这其实是因为我们为了兼容ES5而引入了Babel，Babel会将ES6的Class翻译成ES5也能理解的prototype方式，从而引入了额外的副作用。

   可以看一下Babel编译后的结果：

   ```javascript
   function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
   var _createClass = function() {
     function defineProperties(target, props) {
       for (var i = 0; i < props.length; i++) {
         var descriptor = props[i];
         descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0,
     		//以下Object.defineProperty产生了副作用，这个函数只有在运行时才知道target是什么（target有可能是window），无法静态				//分析其是否有用
         "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
       }
     }
     return function(Constructor, protoProps, staticProps) {
       return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps),
       Constructor;
     };
   }()
   var Person = function () {
     function Person(_ref) {
       var name = _ref.name, age = _ref.age, sex = _ref.sex;
       _classCallCheck(this, Person);
       this.className = 'Person';
       this.name = name;
       this.age = age;
       this.sex = sex;
     }
     //以下函数产生了副作用
     _createClass(Person, [{
       key: 'getName',
       value: function getName() {
         return this.name;
       }
     }]);
     return Person;
   }();
   ```

   当然，这其实是可以通过设置babel配置`"loose": false`来避免（https://blog.csdn.net/qiwoo_weekly/article/details/108891773 感兴趣的同学可以阅读这篇文章），但是这足以说明代码副作用是多难以掌控了。

### 没办法用Tree-Shaking了吗

当然不是！我们如果能够避免上面提到的问题不就可以重新回到Tree-Shaking了嘛。

1. 使用支持ESM模块导出的Rollup进行打包。
2. 放弃或限制Babel的使用，毕竟能导入ESM代码的项目应该是支持ES6语法的。
3. 对于需要使用非ESM模式引入或不支持ES6模块引入的项目，我们继续采用上述的webpack打包方式。

我们在组件库的打包中引入rollup的配置文件如下：

```javascript
// mycompotest/rollup.config.js
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'lib/index.js',
    output: {
      file: 'es/index.js',
      format: 'esm'
    },
    plugins: [
        postcss()
    ]
}
```

修改我们的package.json文件使得打包后的ESM模块暴露出去。

```javascript
// mycompotest/package.json
{
  "name": "my-compo-test",
  "version": "1.0.0",
  "description": "",
    
  //注意： commonjs,amd,cmd方式引入我们的包时会将main中配置的文件作为入口
  "main": "dist/index.js",
    
  //注意： import方式引入我们的包时会将module中配置的文件作为入口
  "module": "es/index.js",
    
  //注意： 需要声明sideEffects字段，表示我们的模块是没有副作用的。sideEffects不是npm的标准字段，它是供webpack读取以了解能否使用tree-shaking的
  "sideEffects": false,
  
  // ....
}
```

在使用的时候，我们需要增加Webpack的一些配置项（这里是演示使用，在实际开发中，Webpack在production模式下会自动开启这些字段，不需要使用者关心）。

```javascript
// test/webpack.config.js
module.exports = {
    mode: 'none',
    entry: './index.js',
    output: {
        filename: 'index.js',
        path: __dirname + '/dist',
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        },{
            test: /\.js$/,
            use: 'babel-loader'
        },]
    },
    // webpack开启tree-shaking需要的配置
    optimization: {
        usedExports: true,
        minimize: true,
    }
}
```

再次打包我们的工程可以得到如下代码（由于minimize配置默认使用了Terser进行代码压缩，因此下面的文件难以读懂）。

```javascript
(()=>{"use strict";var e,t=[,(e,t,o)=>{function r(e,t){void 0===t&&(t={});var o=t.insertAt;if(e&&"undefined"!=typeof document){var r=document.head||document.getElementsByTagName("head")[0],n=document.createElement("style");n.type="text/css","top"===o&&r.firstChild?r.insertBefore(n,r.firstChild):r.appendChild(n),n.styleSheet?n.styleSheet.cssText=e:n.appendChild(document.createTextNode(e))}}r(".button{\n    background-color: white;\n}"),r(".alert{\n    background-color: black;\n}")}],o={};function r(e){var n=o[e];if(void 0!==n)return n.exports;var d=o[e]={exports:{}};return t[e](d,d.exports,r),d.exports}r.d=(e,t)=>{for(var o in t)r.o(t,o)&&!r.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e=r(1),console.log(e.Button)})();
```

可以看到我们的代码中关于Alert组件的js逻辑已经被Tree-Shaking删除了。不过细心的同学应该发现了Alert的样式代码并没有被剔除！这是因为Tree-Shaking只对JS代码起作用。

### 结论

Tree-Shaking可以做到组件库逻辑代码的按需引入，实际上著名代码库AntD目前就是通过Tree-Shaking实现的。不过与我们的测试结果一样，它对CSS并没有办法处理，这也是其文档中对于CSS按需引入丝毫不提的原因！

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvbechrssgj60lw058dfy02.jpg" alt="截屏2021-10-09 16.57.42" style="zoom: 67%;" />

不过我们其实是可以通过其它手段来去除非必要的CSS代码，例如通过配置purgecss-webpack-plugin抛弃所有未使用的CSS，不过这并不在本文的讨论范围内。

可以看到，通过使用Tree-Shaking我们实现了组件库JS代码的按需引入，相比于Babel-plugin-import的方式，我们更近一步的减少了用户的负担，使用者甚至根本就不需要更改一行代码！但是它的缺点也是明显的，不支持ESM以外的导入方式（不过现在看来这不是什么大问题，谁还在用其它方式呢？），不支持CSS的按需引入。

## 六. 终极手段 —— Monorepo

最后，我们进入到实现按需引入的终极方式——Monorepo！为什么说它是终极方式呢？因为通过Monorepo形式组织的组件库在发布时每个组件都是一个单独的NPM包，用户可以自己选择希望使用的组件并安装（你没听错，甚至都不用安装整个组件库），这样自然做到了完完全全的按需引入（甚至可以说从根本上干掉了这个概念）！

不过，不要理解错了，Monorepo的出现并不是为了解决组件按需引入的问题的。

### Monorepo OR Multirepo?

虽然很多同学可能并不了解上面这两个词，但是我们在实际的开发中肯定使用过这其中的概念！简单地说，Multirepo就是指不同项目的代码放在不同的git代码仓库中（说用过没骗你吧？），而Monorepo则是与其相反，将不同项目的代码放在同一个仓库之中。

在具体的开发实践中，这两种代码组织方式其实各有利弊。目前在大多企业中，我们的项目代码都是遵循Multirepo的原则。你可能会想，我们为什么需要Monorepo呢？不同项目的代码不就应该隔离开么？其实不然，我们假设存在这样的一个场景，公司里有A、B两个项目同时在开发，但是在开发过程中项目人员发现这两个项目都会使用一个C组件。这时就有两种解决思路：

> 1. 继续使用Multirepo：产品突然提出了一个对C组件的新需求，这时我们需要先拉取C的代码，更新C组件，在私有NPM源中发布（为了不泄漏公司机密。不过很多公司可能还没有搭建自己的NPM源，这样的话就更麻烦了，需要频繁拉取各文件并执行npm link），再拉取并打开A项目更新A项目的依赖，重新打包A项目并发布，之后拉取并打开B项目更新B项目的依赖，重新打包B项目并发布（光描述这个过程就足够让人感到头疼了！）。
> 2. 使用Monorepo：产品突然提出了一个对C组件的新需求，这时我们拉取整个项目的代码，更新C组件，然后运行神奇的`lerna build`指令。奇迹发生了，我们的A、B两个项目都自动更新了C包的依赖并且打包成功了！我们只需要最后发布一下它们就可以了。

其实使用Monorepo的优势远不止上述的这一种场景，网上已经存在大量讲述其好处并介绍其使用方式的文章了。不过同时也要记住Monorepo并不是银弹，它同样是有缺陷的——如增加代码体积及初次配置的复杂性、不同packages之间的访问权限难以控制等问题，因此并不适用于所有场景。这里我们不再深入对比起优劣，我们只是希望使用它来帮助我们实现组件按需引入的需求。

### 改造组件库

为了更贴近于Monorepo的代码组织形式，我们来改造一下第二节中虚构组件库的代码。

首先要明白，对于Monorepo形式的组件库来说，我们应该将每个组件都抽取出来作为一个单独的package存在，也就是说每个组件都应该有自己独立的源文件以及package.json。另外，作为一个组件库，我们当然不能只支持按需引入，也需要存在一个能够让用户一次性引入全部组件的包。

组件库的代码组织形式如下：

```
┌ packages              子项目库
| | Main                全部组件的集合
| | Alert               Alert组件
| ├ Button             	Button组件
| | | dist              打包后的组件
| | ├ lib               组件源文件
| | | ├ style           
| | | | └ index.css   
| | └ index.js
| └ package.json      
| lerna.json            Lerna配置
| package.json         
└ rollup.config.js      Rollup打包配置
```

对于Button和Alert来说，其内部代码与之前并无不同。有同学可能会好奇Main代码是如何编写的。其实非常简单，就是把组件库中的所有组件都作为dependency引入，然后再导出即可。

```javascript
// mycompotest-mono/packages/Main/lin/index.js
import Button from '@my-compo-test/button'
import Alert from '@my-compo-test/alert'

export default {
    Button,
    Alert
};
```

### Yarn + Lerna的魔法

搜索Monorepo实践，可以看到大部分解决方案都是基于Yarn+Lerna的方式（其实也存在PNPM等其它实现方式）。

深入研究可以看出为了实现一个Monorepo组织方式的组件库，我们不仅需要依赖相比NPM而言对Monorepo支持更好的Yarn作为包管理工具（当然使用NPM也不是不行，不过稍麻烦一些），还需要依赖Lerna为我们提供自动化的包版本升级及发布的支持。

首先我们建立一个包含所有组件的目录packages并将其路径作为package.json文件中workspaces字段的值，这是为了告诉Yarn我们使用了Monorepo的代码组织方式。Yarn在拿到这个字段后，会将该目录中的每个子文件夹都作为一个单独的包处理。这样做的主要好处有以下两点：

> 1. 帮助你更好地管理多个子package的repo，这样你可以在每个子package里使用独立的package.json管理其依赖，又不用分别进到每一个子package里去`yarn install/upgrade`安装/升级依赖，而是使用一条yarn命令在根目录下去处理所有依赖。简单说就是能够让你像管理一个package一样去管理多个packages。
> 2. Yarn会根据依赖关系帮助你分析所有子packages的共用依赖，保证packages共用的依赖只会被下载和安装一次（具体做法是将其共同依赖提升至根目录下的node_modules），从而缩减依赖的安装时间，减少依赖的占用空间。

```javascript
// mycompotest-mono/package.json
{
  "name": "mycompotest-mono",
  // 标记根目录为私有
  "private": true,
  // 注意： Monorepo重要字段
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
     // 如果使用了NPM作为包管理工具，需要以下指令
    "postinstall": "lerna bootstrap",
    // 可以看到子package的打包和发布由Lerna接手了
    "build": "lerna run --stream --sort build",
    "pub": "lerna publish ----include-merged-tags"
  },
  "devDependencies": {
    "postcss": "^8.3.9",
    "postcss-cli": "^9.0.1",
    "rollup": "^2.58.0",
    "rollup-plugin-postcss": "^4.0.1"
  },
  "dependencies": {
    "@rollup/plugin-commonjs": "^21.0.0",
    "@rollup/plugin-node-resolve": "^13.0.5"
  },
  "author": "",
  "license": "ISC"
}

```

接下来，我们还需要对Lerna进行一些配置。与大多数的工具一样，Lerna的配置文件默认也在根目录下。

```javascript
// mycompotest-mono/lerna.json
{
  	// 包管理模式
    "version": "independent",
    // 包管理工具
    "npmClient": "yarn",
    "useWorkspaces": true,
    // 子包目录
    "packages": [
      "packages/*"
    ]
}
```

之后我们加入Rollup的配置文件。

```javascript
// mycompotest-mono/rollup.config.js
import postcss from 'rollup-plugin-postcss';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const fs = require('fs');
const pkJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

export default {
    input: 'lib/index.js',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: pkJson._globalName
    },
    plugins: [
        nodeResolve(),
        postcss(),
        commonjs(),
    ]
}
```

运行`yarn build`可以看到如下提示，证明我们将Alert/Button/Main全部打包成功。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvbeg0s1z5j60ua0hwq7b02.jpg" alt="截屏2021-10-11 15.23.37" style="zoom:45%;" />

之后运行`yarn pub`，这个指令会帮助我们以一种问答的方式自动更新子packages的版本号及其依赖并发布到NPM源之中（为了NPM源的干净，这里不再演示发布流程）。

### Lerna是怎么做到的

你可能会好奇一个Lerna究竟是如何在我们的项目中施放“咒语”的，这里我们简单的讲解一下其大致原理。

- Lerna如何进行全部打包

  你可能会想，这个很简单，不就是进入每个子package中依次执行它们的build指令么。没错，Lerna大体上就是这么做的。不过需要注意的是这个“依次”可能并不像你想象的那么简单。要明白，在我们的项目中，Main包是依赖于Alert和Button两个组件包之上的，因此在打包Main包时需要注意，一定要先完成Alert/Button组件的打包才能够打包Main。这个顺序是非常重要的，违反顺序的打包会造成不可预料的错误。为了能够按序打包，Lerna内置了能够分析包之间依赖关系的逻辑，这使得我们只需要加上--sort参数便可以控制以拓扑排序规则执行子package中的命令。

- Lerna pub如何自动更新包版本

  Lerna的这点使其显得更加神秘了，不过我们只需要稍稍深入一点，就可以知道实现这个功能并没有那么复杂。在Git管理的项目中，Lerna在每次发布包时会添加一条commit记录并且自动打上相关的tag信息。在下次再运行`lerna pub`指令时，Lerna会找到上次打标的tag信息，拿出其中的文件与当前文件做对比。如果前后文件一致，则Lerna默认其没有更改，不需要重新发布。如果前后文件不同，则Lerna就会判断这个文件所在的包需要更新版本号并重新发布。

- Lerna如何自动更新依赖

  其实有了对以上“魔法”的研究，这个“魔法”只不过是水到渠成的能力罢了。Lerna先找出需要更新包版本的packages,然后找出依赖这些packages的其它packages并修改它们所依赖的版本，不断递归这一过程，最终Lerna就可以自动更新相关依赖了。

### 引入组件库

言归正传，至此我们作为组件库开发者的工作已经全部完成。换个角度，作为组件库使用者，我们应该如何使用这个已经发布的组件库呢？（注意：上述组件库并未发布，使用`npm link`模拟引入）

来看我们的首要目标，Button组件的按需引入。

```javascript
// test/index.js
import Button from '@my-compo-test/button'

console.log(Button)
```

可以看到，项目只关注于引入组件库中的Button组件。由于使用了Monorepo的形式组织了组件库，使用者可以单纯的不止可以单纯的只引入Button这个组件的逻辑和样式，而且相比于Babel-plugin-import而言，甚至都不用下载Alert组件的任何代码！（这里我们不再打包观察dist中的文件，任何一个有实际开发经验的前端程序员都应该都明白为什么没有这个必要！）

当然，如果使用者固执的认为你会用到组件库中的全部组件，那么我们也为他提供了Main包。

```javascript
// test/index.js
import {Button} from '@my-compo-test/main'

console.log(Button)
```

### 结论

通过Monorepo的代码组织形式，我们同样实现了组件按需引入的需求。而且相比于以上几种方式，由Monorepo实现的组件按需引入更加纯粹，使用者不仅不会引入其它组件的JS以及CSS代码，甚至连下载这一步都省略了！另外，这种方式也避免了对于使用者代码的侵入，无需为按需引入功能增加其它复杂的配置。

## 七、总结

恭喜坚持读到这里的你，这篇冗长的文章终于要结束了！在最后，我们把之前提到的几种方式做一个对比，相信我，下面这个表格和上面几节的内容一样重要！

|                              | 手动引入               | Babel-plugin-import                | Tree-Shaking                      | Monorepo |
| ---------------------------- | ---------------------- | ---------------------------------- | --------------------------------- | -------- |
| 能否只引入需要的JS           | 能                     | 能                                 | 能                                | 能       |
| 能否只引入需要的CSS          | 能                     | 能                                 | 不能                              | 能       |
| 用户是否需要额外的配置或了解 | 需要了解组件库目录结构 | 需要配置Babel                      | 不需要（webpack生产模式默认配置） | 不需要   |
| 有背书的著名组件库么         | Vant                   | Element-UI/Element-Plus/iView/Vant | AntD/Element-Plus                 | 暂无     |

最后的最后，你可以重新回到第一节，再次回答一下文章开头面试官所提到的问题！

学习前端工程化的道路是漫长且枯燥的，希望这篇文章能帮到正在前进的你。