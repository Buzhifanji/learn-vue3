(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[479],{6972:(e,t,n)=>{"use strict";n.d(t,{Z:()=>u});var o=n(4911),a=n(9231),r=n(9841),l=n(2527),c=n(8397);const s="anchorWithStickyNavbar_CXSz",i="anchorWithHideOnScrollNavbar_GIdN";function u(e){let{as:t,id:n,...u}=e;const{navbar:{hideOnScroll:m}}=(0,c.L)();return"h1"!==t&&n?a.createElement(t,(0,o.Z)({},u,{className:(0,r.Z)("anchor",m?i:s),id:n}),u.children,a.createElement("a",{className:"hash-link",href:`#${n}`,title:(0,l.I)({id:"theme.common.headingLinkTitle",message:"Direct link to heading",description:"Title for link to heading"})},"\u200b")):a.createElement(t,(0,o.Z)({},u,{id:void 0}))}},5010:(e,t,n)=>{"use strict";n.d(t,{Z:()=>s});var o=n(4911),a=n(9231),r=n(9841),l=n(5835);const c="tableOfContents_wUwg";function s(e){let{className:t,...n}=e;return a.createElement("div",{className:(0,r.Z)(c,"thin-scrollbar",t)},a.createElement(l.Z,(0,o.Z)({},n,{linkClassName:"table-of-contents__link toc-highlight",linkActiveClassName:"table-of-contents__link--active"})))}},5835:(e,t,n)=>{"use strict";n.d(t,{Z:()=>f});var o=n(4911),a=n(9231),r=n(8397);function l(e){const t=e.map((e=>({...e,parentIndex:-1,children:[]}))),n=Array(7).fill(-1);t.forEach(((e,t)=>{const o=n.slice(2,e.level);e.parentIndex=Math.max(...o),n[e.level]=t}));const o=[];return t.forEach((e=>{const{parentIndex:n,...a}=e;n>=0?t[n].children.push(a):o.push(a)})),o}function c(e){let{toc:t,minHeadingLevel:n,maxHeadingLevel:o}=e;return t.flatMap((e=>{const t=c({toc:e.children,minHeadingLevel:n,maxHeadingLevel:o});return function(e){return e.level>=n&&e.level<=o}(e)?[{...e,children:t}]:t}))}function s(e){const t=e.getBoundingClientRect();return t.top===t.bottom?s(e.parentNode):t}function i(e,t){let{anchorTopOffset:n}=t;const o=e.find((e=>s(e).top>=n));if(o){return function(e){return e.top>0&&e.bottom<window.innerHeight/2}(s(o))?o:e[e.indexOf(o)-1]??null}return e[e.length-1]??null}function u(){const e=(0,a.useRef)(0),{navbar:{hideOnScroll:t}}=(0,r.L)();return(0,a.useEffect)((()=>{e.current=t?0:document.querySelector(".navbar").clientHeight}),[t]),e}function m(e){const t=(0,a.useRef)(void 0),n=u();(0,a.useEffect)((()=>{if(!e)return()=>{};const{linkClassName:o,linkActiveClassName:a,minHeadingLevel:r,maxHeadingLevel:l}=e;function c(){const e=function(e){return Array.from(document.getElementsByClassName(e))}(o),c=function(e){let{minHeadingLevel:t,maxHeadingLevel:n}=e;const o=[];for(let a=t;a<=n;a+=1)o.push(`h${a}.anchor`);return Array.from(document.querySelectorAll(o.join()))}({minHeadingLevel:r,maxHeadingLevel:l}),s=i(c,{anchorTopOffset:n.current}),u=e.find((e=>s&&s.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)));e.forEach((e=>{!function(e,n){n?(t.current&&t.current!==e&&t.current.classList.remove(a),e.classList.add(a),t.current=e):e.classList.remove(a)}(e,e===u)}))}return document.addEventListener("scroll",c),document.addEventListener("resize",c),c(),()=>{document.removeEventListener("scroll",c),document.removeEventListener("resize",c)}}),[e,n])}function d(e){let{toc:t,className:n,linkClassName:o,isChild:r}=e;return t.length?a.createElement("ul",{className:r?void 0:n},t.map((e=>a.createElement("li",{key:e.id},a.createElement("a",{href:`#${e.id}`,className:o??void 0,dangerouslySetInnerHTML:{__html:e.value}}),a.createElement(d,{isChild:!0,toc:e.children,className:n,linkClassName:o}))))):null}const p=a.memo(d);function f(e){let{toc:t,className:n="table-of-contents table-of-contents__left-border",linkClassName:s="table-of-contents__link",linkActiveClassName:i,minHeadingLevel:u,maxHeadingLevel:d,...f}=e;const h=(0,r.L)(),g=u??h.tableOfContents.minHeadingLevel,v=d??h.tableOfContents.maxHeadingLevel,y=function(e){let{toc:t,minHeadingLevel:n,maxHeadingLevel:o}=e;return(0,a.useMemo)((()=>c({toc:l(t),minHeadingLevel:n,maxHeadingLevel:o})),[t,n,o])}({toc:t,minHeadingLevel:g,maxHeadingLevel:v});return m((0,a.useMemo)((()=>{if(s&&i)return{linkClassName:s,linkActiveClassName:i,minHeadingLevel:g,maxHeadingLevel:v}}),[s,i,g,v])),a.createElement(p,(0,o.Z)({toc:y,className:n,linkClassName:s},f))}},7456:(e,t,n)=>{"use strict";n.d(t,{Z:()=>Ee});var o=n(9231);const a=o.createContext({});function r(e){const t=o.useContext(a);return o.useMemo((()=>"function"==typeof e?e(t):{...t,...e}),[t,e])}const l={};function c({components:e,children:t,disableParentContext:n}){let c=r(e);return n&&(c=e||l),o.createElement(a.Provider,{value:c},t)}var s=n(4911),i=n(7312);var u=n(4273),m=n(9841),d=n(3932),p=n(8397);function f(){const{prism:e}=(0,p.L)(),{colorMode:t}=(0,d.I)(),n=e.theme,o=e.darkTheme||n;return"dark"===t?o:n}var h=n(4253),g=n(6494),v=n.n(g);const y=/title=(?<quote>["'])(?<title>.*?)\1/,b=/\{(?<range>[\d,-]+)\}/,E={js:{start:"\\/\\/",end:""},jsBlock:{start:"\\/\\*",end:"\\*\\/"},jsx:{start:"\\{\\s*\\/\\*",end:"\\*\\/\\s*\\}"},bash:{start:"#",end:""},html:{start:"\x3c!--",end:"--\x3e"}};function k(e,t){const n=e.map((e=>{const{start:n,end:o}=E[e];return`(?:${n}\\s*(${t.flatMap((e=>{var t,n;return[e.line,null==(t=e.block)?void 0:t.start,null==(n=e.block)?void 0:n.end].filter(Boolean)})).join("|")})\\s*${o})`})).join("|");return new RegExp(`^\\s*(?:${n})\\s*$`)}function N(e,t){let n=e.replace(/\n$/,"");const{language:o,magicComments:a,metastring:r}=t;if(r&&b.test(r)){const e=r.match(b).groups.range;if(0===a.length)throw new Error(`A highlight range has been given in code block's metastring (\`\`\` ${r}), but no magic comment config is available. Docusaurus applies the first magic comment entry's className for metastring ranges.`);const t=a[0].className,o=v()(e).filter((e=>e>0)).map((e=>[e-1,[t]]));return{lineClassNames:Object.fromEntries(o),code:n}}if(void 0===o)return{lineClassNames:{},code:n};const l=function(e,t){switch(e){case"js":case"javascript":case"ts":case"typescript":return k(["js","jsBlock"],t);case"jsx":case"tsx":return k(["js","jsBlock","jsx"],t);case"html":return k(["js","jsBlock","html"],t);case"python":case"py":case"bash":return k(["bash"],t);case"markdown":case"md":return k(["html","jsx","bash"],t);default:return k(Object.keys(E),t)}}(o,a),c=n.split("\n"),s=Object.fromEntries(a.map((e=>[e.className,{start:0,range:""}]))),i=Object.fromEntries(a.filter((e=>e.line)).map((e=>{let{className:t,line:n}=e;return[n,t]}))),u=Object.fromEntries(a.filter((e=>e.block)).map((e=>{let{className:t,block:n}=e;return[n.start,t]}))),m=Object.fromEntries(a.filter((e=>e.block)).map((e=>{let{className:t,block:n}=e;return[n.end,t]})));for(let p=0;p<c.length;){const e=c[p].match(l);if(!e){p+=1;continue}const t=e.slice(1).find((e=>void 0!==e));i[t]?s[i[t]].range+=`${p},`:u[t]?s[u[t]].start=p:m[t]&&(s[m[t]].range+=`${s[m[t]].start}-${p-1},`),c.splice(p,1)}n=c.join("\n");const d={};return Object.entries(s).forEach((e=>{let[t,{range:n}]=e;v()(n).forEach((e=>{d[e]??=[],d[e].push(t)}))})),{lineClassNames:d,code:n}}const C="codeBlockContainer_n15U";function L(e){let{as:t,...n}=e;const a=function(e){const t={color:"--prism-color",backgroundColor:"--prism-background-color"},n={};return Object.entries(e.plain).forEach((e=>{let[o,a]=e;const r=t[o];r&&"string"==typeof a&&(n[r]=a)})),n}(f());return o.createElement(t,(0,s.Z)({},n,{style:a,className:(0,m.Z)(n.className,C,h.k.common.codeBlock)}))}const B={codeBlockContent:"codeBlockContent_NT1R",codeBlockTitle:"codeBlockTitle_N_cg",codeBlock:"codeBlock_d2m5",codeBlockStandalone:"codeBlockStandalone_tE0j",codeBlockLines:"codeBlockLines_CHvd",codeBlockLinesWithNumbering:"codeBlockLinesWithNumbering_lB7c",buttonGroup:"buttonGroup_Pf73"};function x(e){let{children:t,className:n}=e;return o.createElement(L,{as:"pre",tabIndex:0,className:(0,m.Z)(B.codeBlockStandalone,"thin-scrollbar",n)},o.createElement("code",{className:B.codeBlockLines},t))}var T=n(6456);const w={attributes:!0,characterData:!0,childList:!0,subtree:!0};function Z(e,t){const[n,a]=(0,o.useState)(),r=(0,o.useCallback)((()=>{var t;a(null==(t=e.current)?void 0:t.closest("[role=tabpanel][hidden]"))}),[e,a]);(0,o.useEffect)((()=>{r()}),[r]),function(e,t,n){void 0===n&&(n=w);const a=(0,T.zX)(t),r=(0,T.Ql)(n);(0,o.useEffect)((()=>{const t=new MutationObserver(a);return e&&t.observe(e,r),()=>t.disconnect()}),[e,a,r])}(n,(e=>{e.forEach((e=>{"attributes"===e.type&&"hidden"===e.attributeName&&(t(),r())}))}),{attributes:!0,characterData:!1,childList:!1,subtree:!1})}const H={plain:{backgroundColor:"#2a2734",color:"#9a86fd"},styles:[{types:["comment","prolog","doctype","cdata","punctuation"],style:{color:"#6c6783"}},{types:["namespace"],style:{opacity:.7}},{types:["tag","operator","number"],style:{color:"#e09142"}},{types:["property","function"],style:{color:"#9a86fd"}},{types:["tag-id","selector","atrule-id"],style:{color:"#eeebff"}},{types:["attr-name"],style:{color:"#c4b9fe"}},{types:["boolean","string","entity","url","attr-value","keyword","control","directive","unit","statement","regex","atrule","placeholder","variable"],style:{color:"#ffcc99"}},{types:["deleted"],style:{textDecorationLine:"line-through"}},{types:["inserted"],style:{textDecorationLine:"underline"}},{types:["italic"],style:{fontStyle:"italic"}},{types:["important","bold"],style:{fontWeight:"bold"}},{types:["important"],style:{color:"#c4b9fe"}}]};var _={Prism:n(5036).Z,theme:H};function j(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function S(){return S=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},S.apply(this,arguments)}var A=/\r\n|\r|\n/,z=function(e){0===e.length?e.push({types:["plain"],content:"\n",empty:!0}):1===e.length&&""===e[0].content&&(e[0].content="\n",e[0].empty=!0)},I=function(e,t){var n=e.length;return n>0&&e[n-1]===t?e:e.concat(t)},M=function(e,t){var n=e.plain,o=Object.create(null),a=e.styles.reduce((function(e,n){var o=n.languages,a=n.style;return o&&!o.includes(t)||n.types.forEach((function(t){var n=S({},e[t],a);e[t]=n})),e}),o);return a.root=n,a.plain=S({},n,{backgroundColor:null}),a};function O(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&-1===t.indexOf(o)&&(n[o]=e[o]);return n}const R=function(e){function t(){for(var t=this,n=[],o=arguments.length;o--;)n[o]=arguments[o];e.apply(this,n),j(this,"getThemeDict",(function(e){if(void 0!==t.themeDict&&e.theme===t.prevTheme&&e.language===t.prevLanguage)return t.themeDict;t.prevTheme=e.theme,t.prevLanguage=e.language;var n=e.theme?M(e.theme,e.language):void 0;return t.themeDict=n})),j(this,"getLineProps",(function(e){var n=e.key,o=e.className,a=e.style,r=S({},O(e,["key","className","style","line"]),{className:"token-line",style:void 0,key:void 0}),l=t.getThemeDict(t.props);return void 0!==l&&(r.style=l.plain),void 0!==a&&(r.style=void 0!==r.style?S({},r.style,a):a),void 0!==n&&(r.key=n),o&&(r.className+=" "+o),r})),j(this,"getStyleForToken",(function(e){var n=e.types,o=e.empty,a=n.length,r=t.getThemeDict(t.props);if(void 0!==r){if(1===a&&"plain"===n[0])return o?{display:"inline-block"}:void 0;if(1===a&&!o)return r[n[0]];var l=o?{display:"inline-block"}:{},c=n.map((function(e){return r[e]}));return Object.assign.apply(Object,[l].concat(c))}})),j(this,"getTokenProps",(function(e){var n=e.key,o=e.className,a=e.style,r=e.token,l=S({},O(e,["key","className","style","token"]),{className:"token "+r.types.join(" "),children:r.content,style:t.getStyleForToken(r),key:void 0});return void 0!==a&&(l.style=void 0!==l.style?S({},l.style,a):a),void 0!==n&&(l.key=n),o&&(l.className+=" "+o),l})),j(this,"tokenize",(function(e,t,n,o){var a={code:t,grammar:n,language:o,tokens:[]};e.hooks.run("before-tokenize",a);var r=a.tokens=e.tokenize(a.code,a.grammar,a.language);return e.hooks.run("after-tokenize",a),r}))}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.render=function(){var e=this.props,t=e.Prism,n=e.language,o=e.code,a=e.children,r=this.getThemeDict(this.props),l=t.languages[n];return a({tokens:function(e){for(var t=[[]],n=[e],o=[0],a=[e.length],r=0,l=0,c=[],s=[c];l>-1;){for(;(r=o[l]++)<a[l];){var i=void 0,u=t[l],m=n[l][r];if("string"==typeof m?(u=l>0?u:["plain"],i=m):(u=I(u,m.type),m.alias&&(u=I(u,m.alias)),i=m.content),"string"==typeof i){var d=i.split(A),p=d.length;c.push({types:u,content:d[0]});for(var f=1;f<p;f++)z(c),s.push(c=[]),c.push({types:u,content:d[f]})}else l++,t.push(u),n.push(i),o.push(0),a.push(i.length)}l--,t.pop(),n.pop(),o.pop(),a.pop()}return z(c),s}(void 0!==l?this.tokenize(t,o,l,n):[o]),className:"prism-code language-"+n,style:void 0!==r?r.root:{},getLineProps:this.getLineProps,getTokenProps:this.getTokenProps})},t}(o.Component),P="codeLine_iKd2",$="codeLineNumber_CfEQ",D="codeLineContent_K255";function V(e){let{line:t,classNames:n,showLineNumbers:a,getLineProps:r,getTokenProps:l}=e;1===t.length&&"\n"===t[0].content&&(t[0].content="");const c=r({line:t,className:(0,m.Z)(n,a&&P)}),i=t.map(((e,t)=>o.createElement("span",(0,s.Z)({key:t},l({token:e,key:t})))));return o.createElement("span",c,a?o.createElement(o.Fragment,null,o.createElement("span",{className:$}),o.createElement("span",{className:D},i)):i,o.createElement("br",null))}var W=n(2527);const F={copyButtonCopied:"copyButtonCopied_prCb",copyButtonIcons:"copyButtonIcons_M6nT",copyButtonIcon:"copyButtonIcon_GY20",copyButtonSuccessIcon:"copyButtonSuccessIcon_AgLU"};function q(e){let{code:t,className:n}=e;const[a,r]=(0,o.useState)(!1),l=(0,o.useRef)(void 0),c=(0,o.useCallback)((()=>{!function(e,t){let{target:n=document.body}=void 0===t?{}:t;const o=document.createElement("textarea"),a=document.activeElement;o.value=e,o.setAttribute("readonly",""),o.style.contain="strict",o.style.position="absolute",o.style.left="-9999px",o.style.fontSize="12pt";const r=document.getSelection();let l=!1;r.rangeCount>0&&(l=r.getRangeAt(0)),n.append(o),o.select(),o.selectionStart=0,o.selectionEnd=e.length;let c=!1;try{c=document.execCommand("copy")}catch{}o.remove(),l&&(r.removeAllRanges(),r.addRange(l)),a&&a.focus()}(t),r(!0),l.current=window.setTimeout((()=>{r(!1)}),1e3)}),[t]);return(0,o.useEffect)((()=>()=>window.clearTimeout(l.current)),[]),o.createElement("button",{type:"button","aria-label":a?(0,W.I)({id:"theme.CodeBlock.copied",message:"Copied",description:"The copied button label on code blocks"}):(0,W.I)({id:"theme.CodeBlock.copyButtonAriaLabel",message:"Copy code to clipboard",description:"The ARIA label for copy code blocks button"}),title:(0,W.I)({id:"theme.CodeBlock.copy",message:"Copy",description:"The copy button label on code blocks"}),className:(0,m.Z)("clean-btn",n,F.copyButton,a&&F.copyButtonCopied),onClick:c},o.createElement("span",{className:F.copyButtonIcons,"aria-hidden":"true"},o.createElement("svg",{className:F.copyButtonIcon,viewBox:"0 0 24 24"},o.createElement("path",{d:"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"})),o.createElement("svg",{className:F.copyButtonSuccessIcon,viewBox:"0 0 24 24"},o.createElement("path",{d:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}))))}const U="wordWrapButtonIcon_K209",G="wordWrapButtonEnabled_yy8j";function K(e){let{className:t,onClick:n,isEnabled:a}=e;const r=(0,W.I)({id:"theme.CodeBlock.wordWrapToggle",message:"Toggle word wrap",description:"The title attribute for toggle word wrapping button of code block lines"});return o.createElement("button",{type:"button",onClick:n,className:(0,m.Z)("clean-btn",t,a&&G),"aria-label":r,title:r},o.createElement("svg",{className:U,viewBox:"0 0 24 24","aria-hidden":"true"},o.createElement("path",{fill:"currentColor",d:"M4 19h6v-2H4v2zM20 5H4v2h16V5zm-3 6H4v2h13.25c1.1 0 2 .9 2 2s-.9 2-2 2H15v-2l-3 3l3 3v-2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4z"})))}function Q(e){let{children:t,className:n="",metastring:a,title:r,showLineNumbers:l,language:c}=e;const{prism:{defaultLanguage:i,magicComments:u}}=(0,p.L)(),d=c??function(e){const t=e.split(" ").find((e=>e.startsWith("language-")));return null==t?void 0:t.replace(/language-/,"")}(n)??i,h=f(),g=function(){const[e,t]=(0,o.useState)(!1),[n,a]=(0,o.useState)(!1),r=(0,o.useRef)(null),l=(0,o.useCallback)((()=>{const n=r.current.querySelector("code");e?n.removeAttribute("style"):(n.style.whiteSpace="pre-wrap",n.style.overflowWrap="anywhere"),t((e=>!e))}),[r,e]),c=(0,o.useCallback)((()=>{const{scrollWidth:e,clientWidth:t}=r.current,n=e>t||r.current.querySelector("code").hasAttribute("style");a(n)}),[r]);return Z(r,c),(0,o.useEffect)((()=>{c()}),[e,c]),(0,o.useEffect)((()=>(window.addEventListener("resize",c,{passive:!0}),()=>{window.removeEventListener("resize",c)})),[c]),{codeBlockRef:r,isEnabled:e,isCodeScrollable:n,toggle:l}}(),v=function(e){var t;return(null==e||null==(t=e.match(y))?void 0:t.groups.title)??""}(a)||r,{lineClassNames:b,code:E}=N(t,{metastring:a,language:d,magicComments:u}),k=l??function(e){return Boolean(null==e?void 0:e.includes("showLineNumbers"))}(a);return o.createElement(L,{as:"div",className:(0,m.Z)(n,d&&!n.includes(`language-${d}`)&&`language-${d}`)},v&&o.createElement("div",{className:B.codeBlockTitle},v),o.createElement("div",{className:B.codeBlockContent},o.createElement(R,(0,s.Z)({},_,{theme:h,code:E,language:d??"text"}),(e=>{let{className:t,tokens:n,getLineProps:a,getTokenProps:r}=e;return o.createElement("pre",{tabIndex:0,ref:g.codeBlockRef,className:(0,m.Z)(t,B.codeBlock,"thin-scrollbar")},o.createElement("code",{className:(0,m.Z)(B.codeBlockLines,k&&B.codeBlockLinesWithNumbering)},n.map(((e,t)=>o.createElement(V,{key:t,line:e,getLineProps:a,getTokenProps:r,classNames:b[t],showLineNumbers:k})))))})),o.createElement("div",{className:B.buttonGroup},(g.isEnabled||g.isCodeScrollable)&&o.createElement(K,{className:B.codeButton,onClick:()=>g.toggle(),isEnabled:g.isEnabled}),o.createElement(q,{className:B.codeButton,code:E}))))}function X(e){let{children:t,...n}=e;const a=(0,u.Z)(),r=function(e){return o.Children.toArray(e).some((e=>(0,o.isValidElement)(e)))?e:Array.isArray(e)?e.join(""):e}(t),l="string"==typeof r?Q:x;return o.createElement(l,(0,s.Z)({key:String(a)},n),r)}var J=n(7701);var Y=n(3270);const ee="details_b4FE",te="isBrowser_c0R2",ne="collapsibleContent_u_93";function oe(e){return!!e&&("SUMMARY"===e.tagName||oe(e.parentElement))}function ae(e,t){return!!e&&(e===t||ae(e.parentElement,t))}function re(e){let{summary:t,children:n,...a}=e;const r=(0,u.Z)(),l=(0,o.useRef)(null),{collapsed:c,setCollapsed:i}=(0,Y.u)({initialState:!a.open}),[d,p]=(0,o.useState)(a.open);return o.createElement("details",(0,s.Z)({},a,{ref:l,open:d,"data-collapsed":c,className:(0,m.Z)(ee,r&&te,a.className),onMouseDown:e=>{oe(e.target)&&e.detail>1&&e.preventDefault()},onClick:e=>{e.stopPropagation();const t=e.target;oe(t)&&ae(t,l.current)&&(e.preventDefault(),c?(i(!1),p(!0)):i(!0))}}),t??o.createElement("summary",null,"Details"),o.createElement(Y.z,{lazy:!1,collapsed:c,disableSSRStyle:!0,onCollapseTransitionEnd:e=>{i(e),p(!e)}},o.createElement("div",{className:ne},n)))}const le="details_caPc";function ce(e){let{...t}=e;return o.createElement(re,(0,s.Z)({},t,{className:(0,m.Z)("alert alert--info",le,t.className)}))}var se=n(6972);function ie(e){return o.createElement(se.Z,e)}const ue="containsTaskList_fJgl";const me="img_J2lf";const de="admonition_fQc0",pe="admonitionHeading_aAKX",fe="admonitionIcon_yIy7",he="admonitionContent_adlM";const ge={note:{infimaClassName:"secondary",iconComponent:function(){return o.createElement("svg",{viewBox:"0 0 14 16"},o.createElement("path",{fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))},label:o.createElement(W.Z,{id:"theme.admonition.note",description:"The default label used for the Note admonition (:::note)"},"note")},tip:{infimaClassName:"success",iconComponent:function(){return o.createElement("svg",{viewBox:"0 0 12 16"},o.createElement("path",{fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))},label:o.createElement(W.Z,{id:"theme.admonition.tip",description:"The default label used for the Tip admonition (:::tip)"},"tip")},danger:{infimaClassName:"danger",iconComponent:function(){return o.createElement("svg",{viewBox:"0 0 12 16"},o.createElement("path",{fillRule:"evenodd",d:"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"}))},label:o.createElement(W.Z,{id:"theme.admonition.danger",description:"The default label used for the Danger admonition (:::danger)"},"danger")},info:{infimaClassName:"info",iconComponent:function(){return o.createElement("svg",{viewBox:"0 0 14 16"},o.createElement("path",{fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))},label:o.createElement(W.Z,{id:"theme.admonition.info",description:"The default label used for the Info admonition (:::info)"},"info")},caution:{infimaClassName:"warning",iconComponent:function(){return o.createElement("svg",{viewBox:"0 0 16 16"},o.createElement("path",{fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))},label:o.createElement(W.Z,{id:"theme.admonition.caution",description:"The default label used for the Caution admonition (:::caution)"},"caution")}},ve={secondary:"note",important:"info",success:"tip",warning:"danger"};function ye(e){const{mdxAdmonitionTitle:t,rest:n}=function(e){const t=o.Children.toArray(e),n=t.find((e=>{var t;return o.isValidElement(e)&&"mdxAdmonitionTitle"===(null==(t=e.props)?void 0:t.mdxType)})),a=o.createElement(o.Fragment,null,t.filter((e=>e!==n)));return{mdxAdmonitionTitle:n,rest:a}}(e.children);return{...e,title:e.title??t,children:n}}const be={head:function(e){const t=o.Children.map(e.children,(e=>o.isValidElement(e)?function(e){var t;if(null!=(t=e.props)&&t.mdxType&&e.props.originalType){const{mdxType:t,originalType:n,...a}=e.props;return o.createElement(e.props.originalType,a)}return e}(e):e));return o.createElement(i.Z,e,t)},code:function(e){const t=["a","abbr","b","br","button","cite","code","del","dfn","em","i","img","input","ins","kbd","label","object","output","q","ruby","s","small","span","strong","sub","sup","time","u","var","wbr"];return o.Children.toArray(e.children).every((e=>{var n;return"string"==typeof e&&!e.includes("\n")||(0,o.isValidElement)(e)&&t.includes(null==(n=e.props)?void 0:n.mdxType)}))?o.createElement("code",e):o.createElement(X,e)},a:function(e){return o.createElement(J.Z,e)},pre:function(e){var t;return o.createElement(X,(0,o.isValidElement)(e.children)&&"code"===(null==(t=e.children.props)?void 0:t.originalType)?e.children.props:{...e})},details:function(e){const t=o.Children.toArray(e.children),n=t.find((e=>{var t;return o.isValidElement(e)&&"summary"===(null==(t=e.props)?void 0:t.mdxType)})),a=o.createElement(o.Fragment,null,t.filter((e=>e!==n)));return o.createElement(ce,(0,s.Z)({},e,{summary:n}),a)},ul:function(e){return o.createElement("ul",(0,s.Z)({},e,{className:(t=e.className,(0,m.Z)(t,(null==t?void 0:t.includes("contains-task-list"))&&ue))}));var t},img:function(e){return o.createElement("img",(0,s.Z)({loading:"lazy"},e,{className:(t=e.className,(0,m.Z)(t,me))}));var t},h1:e=>o.createElement(ie,(0,s.Z)({as:"h1"},e)),h2:e=>o.createElement(ie,(0,s.Z)({as:"h2"},e)),h3:e=>o.createElement(ie,(0,s.Z)({as:"h3"},e)),h4:e=>o.createElement(ie,(0,s.Z)({as:"h4"},e)),h5:e=>o.createElement(ie,(0,s.Z)({as:"h5"},e)),h6:e=>o.createElement(ie,(0,s.Z)({as:"h6"},e)),admonition:function(e){const{children:t,type:n,title:a,icon:r}=ye(e),l=function(e){const t=ve[e]??e;return ge[t]||(console.warn(`No admonition config found for admonition type "${t}". Using Info as fallback.`),ge.info)}(n),c=a??l.label,{iconComponent:s}=l,i=r??o.createElement(s,null);return o.createElement("div",{className:(0,m.Z)(h.k.common.admonition,h.k.common.admonitionType(e.type),"alert",`alert--${l.infimaClassName}`,de)},o.createElement("div",{className:pe},o.createElement("span",{className:fe},i),c),o.createElement("div",{className:he},t))},mermaid:n(6540).Z};function Ee(e){let{children:t}=e;return o.createElement(c,{components:be},t)}},6494:(e,t)=>{function n(e){let t,n=[];for(let o of e.split(",").map((e=>e.trim())))if(/^-?\d+$/.test(o))n.push(parseInt(o,10));else if(t=o.match(/^(-?\d+)(-|\.\.\.?|\u2025|\u2026|\u22EF)(-?\d+)$/)){let[e,o,a,r]=t;if(o&&r){o=parseInt(o),r=parseInt(r);const e=o<r?1:-1;"-"!==a&&".."!==a&&"\u2025"!==a||(r+=e);for(let t=o;t!==r;t+=e)n.push(t)}}return n}t.default=n,e.exports=n}}]);