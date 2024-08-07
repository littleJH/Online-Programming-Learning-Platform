import{_ as e,a6 as t,bq as r,br as n,a9 as o,ag as l,a7 as i,an as a,bs as s,W as c,a as d,as as u,v as p,bt as m,ap as f,a8 as h,ao as g,bu as b,az as x,bv as v,a3 as y,aP as $,I as w,aE as C,j as O,F as S,A as j,bw as k,aO as I,aH as M,aG as F,aj as E,al as N,bx as P,Z as T,a1 as _,by as W,bi as R,bj as q,aV as H}from"./index.5c064301.js";import{a as z,u as A,V as L,b as D,c as V,R as B,F as X,d as G,C as Y,L as K,W as U,e as Z,f as J}from"./context.aa52cc0c.js";import{C as Q,R as ee}from"./row.e491f7a6.js";import{u as te}from"./useLocale.07149357.js";const re=e=>"object"==typeof e&&null!=e&&1===e.nodeType,ne=(e,t)=>(!t||"hidden"!==e)&&"visible"!==e&&"clip"!==e,oe=(e,t)=>{if(e.clientHeight<e.scrollHeight||e.clientWidth<e.scrollWidth){const r=getComputedStyle(e,null);return ne(r.overflowY,t)||ne(r.overflowX,t)||(e=>{const t=(e=>{if(!e.ownerDocument||!e.ownerDocument.defaultView)return null;try{return e.ownerDocument.defaultView.frameElement}catch(t){return null}})(e);return!!t&&(t.clientHeight<e.scrollHeight||t.clientWidth<e.scrollWidth)})(e)}return!1},le=(e,t,r,n,o,l,i,a)=>l<e&&i>t||l>e&&i<t?0:l<=e&&a<=r||i>=t&&a>=r?l-e-n:i>t&&a<r||l<e&&a>r?i-t+o:0,ie=e=>{const t=e.parentElement;return null==t?e.getRootNode().host||null:t},ae=(e,t)=>{var r,n,o,l;if("undefined"==typeof document)return[];const{scrollMode:i,block:a,inline:s,boundary:c,skipOverflowHiddenElements:d}=t,u="function"==typeof c?c:e=>e!==c;if(!re(e))throw new TypeError("Invalid target");const p=document.scrollingElement||document.documentElement,m=[];let f=e;for(;re(f)&&u(f);){if(f=ie(f),f===p){m.push(f);break}null!=f&&f===document.body&&oe(f)&&!oe(document.documentElement)||null!=f&&oe(f,d)&&m.push(f)}const h=null!=(n=null==(r=window.visualViewport)?void 0:r.width)?n:innerWidth,g=null!=(l=null==(o=window.visualViewport)?void 0:o.height)?l:innerHeight,{scrollX:b,scrollY:x}=window,{height:v,width:y,top:$,right:w,bottom:C,left:O}=e.getBoundingClientRect(),{top:S,right:j,bottom:k,left:I}=(e=>{const t=window.getComputedStyle(e);return{top:parseFloat(t.scrollMarginTop)||0,right:parseFloat(t.scrollMarginRight)||0,bottom:parseFloat(t.scrollMarginBottom)||0,left:parseFloat(t.scrollMarginLeft)||0}})(e);let M="start"===a||"nearest"===a?$-S:"end"===a?C+k:$+v/2-S+k,F="center"===s?O+y/2-I+j:"end"===s?w+j:O-I;const E=[];for(let N=0;N<m.length;N++){const e=m[N],{height:t,width:r,top:n,right:o,bottom:l,left:c}=e.getBoundingClientRect();if("if-needed"===i&&$>=0&&O>=0&&C<=g&&w<=h&&$>=n&&C<=l&&O>=c&&w<=o)return E;const d=getComputedStyle(e),u=parseInt(d.borderLeftWidth,10),f=parseInt(d.borderTopWidth,10),S=parseInt(d.borderRightWidth,10),j=parseInt(d.borderBottomWidth,10);let k=0,I=0;const P="offsetWidth"in e?e.offsetWidth-e.clientWidth-u-S:0,T="offsetHeight"in e?e.offsetHeight-e.clientHeight-f-j:0,_="offsetWidth"in e?0===e.offsetWidth?0:r/e.offsetWidth:0,W="offsetHeight"in e?0===e.offsetHeight?0:t/e.offsetHeight:0;if(p===e)k="start"===a?M:"end"===a?M-g:"nearest"===a?le(x,x+g,g,f,j,x+M,x+M+v,v):M-g/2,I="start"===s?F:"center"===s?F-h/2:"end"===s?F-h:le(b,b+h,h,u,S,b+F,b+F+y,y),k=Math.max(0,k+x),I=Math.max(0,I+b);else{k="start"===a?M-n-f:"end"===a?M-l+j+T:"nearest"===a?le(n,l,t,f,j+T,M,M+v,v):M-(n+t/2)+T/2,I="start"===s?F-c-u:"center"===s?F-(c+r/2)+P/2:"end"===s?F-o+S+P:le(c,o,r,u,S+P,F,F+y,y);const{scrollLeft:i,scrollTop:d}=e;k=0===W?0:Math.max(0,Math.min(d+k/W,e.scrollHeight-t/W+T)),I=0===_?0:Math.max(0,Math.min(i+I/_,e.scrollWidth-r/_+P)),M+=d-k,F+=i-I}E.push({el:e,top:k,left:I})}return E},se=e=>{return!1===e?{block:"end",inline:"nearest"}:(t=e)===Object(t)&&0!==Object.keys(t).length?e:{block:"start",inline:"nearest"};var t};function ce(t){const[r,n]=e.exports.useState(t);return e.exports.useEffect((()=>{const e=setTimeout((()=>{n(t)}),t.length?0:10);return()=>{clearTimeout(e)}}),[t]),r}const de=e=>{const{componentCls:t}=e,r=`${t}-show-help-item`;return{[`${t}-show-help`]:{transition:`opacity ${e.motionDurationSlow} ${e.motionEaseInOut}`,"&-appear, &-enter":{opacity:0,"&-active":{opacity:1}},"&-leave":{opacity:1,"&-active":{opacity:0}},[r]:{overflow:"hidden",transition:`height ${e.motionDurationSlow} ${e.motionEaseInOut},\n                     opacity ${e.motionDurationSlow} ${e.motionEaseInOut},\n                     transform ${e.motionDurationSlow} ${e.motionEaseInOut} !important`,[`&${r}-appear, &${r}-enter`]:{transform:"translateY(-5px)",opacity:0,"&-active":{transform:"translateY(0)",opacity:1}},[`&${r}-leave-active`]:{transform:"translateY(-5px)"}}}}},ue=e=>({legend:{display:"block",width:"100%",marginBottom:e.marginLG,padding:0,color:e.colorTextDescription,fontSize:e.fontSizeLG,lineHeight:"inherit",border:0,borderBottom:`${l(e.lineWidth)} ${e.lineType} ${e.colorBorder}`},'input[type="search"]':{boxSizing:"border-box"},'input[type="radio"], input[type="checkbox"]':{lineHeight:"normal"},'input[type="file"]':{display:"block"},'input[type="range"]':{display:"block",width:"100%"},"select[multiple], select[size]":{height:"auto"},"input[type='file']:focus,\n  input[type='radio']:focus,\n  input[type='checkbox']:focus":{outline:0,boxShadow:`0 0 0 ${l(e.controlOutlineWidth)} ${e.controlOutline}`},output:{display:"block",paddingTop:15,color:e.colorText,fontSize:e.fontSize,lineHeight:e.lineHeight}}),pe=(e,t)=>{const{formItemCls:r}=e;return{[r]:{[`${r}-label > label`]:{height:t},[`${r}-control-input`]:{minHeight:t}}}},me=e=>{const{componentCls:t}=e;return{[e.componentCls]:Object.assign(Object.assign(Object.assign({},o(e)),ue(e)),{[`${t}-text`]:{display:"inline-block",paddingInlineEnd:e.paddingSM},"&-small":Object.assign({},pe(e,e.controlHeightSM)),"&-large":Object.assign({},pe(e,e.controlHeightLG))})}},fe=e=>{const{formItemCls:t,iconCls:r,componentCls:l,rootPrefixCls:i,labelRequiredMarkColor:a,labelColor:s,labelFontSize:c,labelHeight:d,labelColonMarginInlineStart:u,labelColonMarginInlineEnd:p,itemMarginBottom:m}=e;return{[t]:Object.assign(Object.assign({},o(e)),{marginBottom:m,verticalAlign:"top","&-with-help":{transition:"none"},[`&-hidden,\n        &-hidden.${i}-row`]:{display:"none"},"&-has-warning":{[`${t}-split`]:{color:e.colorError}},"&-has-error":{[`${t}-split`]:{color:e.colorWarning}},[`${t}-label`]:{flexGrow:0,overflow:"hidden",whiteSpace:"nowrap",textAlign:"end",verticalAlign:"middle","&-left":{textAlign:"start"},"&-wrap":{overflow:"unset",lineHeight:e.lineHeight,whiteSpace:"unset"},"> label":{position:"relative",display:"inline-flex",alignItems:"center",maxWidth:"100%",height:d,color:s,fontSize:c,[`> ${r}`]:{fontSize:e.fontSize,verticalAlign:"top"},[`&${t}-required:not(${t}-required-mark-optional)::before`]:{display:"inline-block",marginInlineEnd:e.marginXXS,color:a,fontSize:e.fontSize,fontFamily:"SimSun, sans-serif",lineHeight:1,content:'"*"',[`${l}-hide-required-mark &`]:{display:"none"}},[`${t}-optional`]:{display:"inline-block",marginInlineStart:e.marginXXS,color:e.colorTextDescription,[`${l}-hide-required-mark &`]:{display:"none"}},[`${t}-tooltip`]:{color:e.colorTextDescription,cursor:"help",writingMode:"horizontal-tb",marginInlineStart:e.marginXXS},"&::after":{content:'":"',position:"relative",marginBlock:0,marginInlineStart:u,marginInlineEnd:p},[`&${t}-no-colon::after`]:{content:'"\\a0"'}}},[`${t}-control`]:{"--ant-display":"flex",flexDirection:"column",flexGrow:1,[`&:first-child:not([class^="'${i}-col-'"]):not([class*="' ${i}-col-'"])`]:{width:"100%"},"&-input":{position:"relative",display:"flex",alignItems:"center",minHeight:e.controlHeight,"&-content":{flex:"auto",maxWidth:"100%"}}},[t]:{"&-explain, &-extra":{clear:"both",color:e.colorTextDescription,fontSize:e.fontSize,lineHeight:e.lineHeight},"&-explain-connected":{width:"100%"},"&-extra":{minHeight:e.controlHeightSM,transition:`color ${e.motionDurationMid} ${e.motionEaseOut}`},"&-explain":{"&-error":{color:e.colorError},"&-warning":{color:e.colorWarning}}},[`&-with-help ${t}-explain`]:{height:"auto",opacity:1},[`${t}-feedback-icon`]:{fontSize:e.fontSize,textAlign:"center",visibility:"visible",animationName:n,animationDuration:e.motionDurationMid,animationTimingFunction:e.motionEaseOutBack,pointerEvents:"none","&-success":{color:e.colorSuccess},"&-error":{color:e.colorError},"&-warning":{color:e.colorWarning},"&-validating":{color:e.colorPrimary}}})}},he=e=>{const{componentCls:t,formItemCls:r}=e;return{[`${t}-horizontal`]:{[`${r}-label`]:{flexGrow:0},[`${r}-control`]:{flex:"1 1 0",minWidth:0},[`${r}-label[class$='-24'], ${r}-label[class*='-24 ']`]:{[`& + ${r}-control`]:{minWidth:"unset"}}}}},ge=e=>{const{componentCls:t,formItemCls:r}=e;return{[`${t}-inline`]:{display:"flex",flexWrap:"wrap",[r]:{flex:"none",marginInlineEnd:e.margin,marginBottom:0,"&-row":{flexWrap:"nowrap"},[`> ${r}-label,\n        > ${r}-control`]:{display:"inline-block",verticalAlign:"top"},[`> ${r}-label`]:{flex:"none"},[`${t}-text`]:{display:"inline-block"},[`${r}-has-feedback`]:{display:"inline-block"}}}}},be=e=>({padding:e.verticalLabelPadding,margin:e.verticalLabelMargin,whiteSpace:"initial",textAlign:"start","> label":{margin:0,"&::after":{visibility:"hidden"}}}),xe=e=>{const{componentCls:t,formItemCls:r,rootPrefixCls:n}=e;return{[`${r} ${r}-label`]:be(e),[`${t}:not(${t}-inline)`]:{[r]:{flexWrap:"wrap",[`${r}-label, ${r}-control`]:{[`&:not([class*=" ${n}-col-xs"])`]:{flex:"0 0 100%",maxWidth:"100%"}}}}}},ve=e=>{const{componentCls:t,formItemCls:r,rootPrefixCls:n}=e;return{[`${t}-vertical`]:{[r]:{"&-row":{flexDirection:"column"},"&-label > label":{height:"auto"},[`${t}-item-control`]:{width:"100%"}}},[`${t}-vertical ${r}-label,\n      .${n}-col-24${r}-label,\n      .${n}-col-xl-24${r}-label`]:be(e),[`@media (max-width: ${l(e.screenXSMax)})`]:[xe(e),{[t]:{[`.${n}-col-xs-24${r}-label`]:be(e)}}],[`@media (max-width: ${l(e.screenSMMax)})`]:{[t]:{[`.${n}-col-sm-24${r}-label`]:be(e)}},[`@media (max-width: ${l(e.screenMDMax)})`]:{[t]:{[`.${n}-col-md-24${r}-label`]:be(e)}},[`@media (max-width: ${l(e.screenLGMax)})`]:{[t]:{[`.${n}-col-lg-24${r}-label`]:be(e)}}}},ye=(e,t)=>i(e,{formItemCls:`${e.componentCls}-item`,rootPrefixCls:t}),$e=t("Form",((e,t)=>{let{rootPrefixCls:o}=t;const l=ye(e,o);return[me(l),fe(l),de(l),he(l),ge(l),ve(l),r(l),n]}),(e=>({labelRequiredMarkColor:e.colorError,labelColor:e.colorTextHeading,labelFontSize:e.fontSize,labelHeight:e.controlHeight,labelColonMarginInlineStart:e.marginXXS/2,labelColonMarginInlineEnd:e.marginXS,itemMarginBottom:e.marginLG,verticalLabelPadding:`0 0 ${e.paddingXS}px`,verticalLabelMargin:0})),{order:-1e3}),we=[];function Ce(e,t,r){return{key:"string"==typeof e?e:`${t}-${arguments.length>3&&void 0!==arguments[3]?arguments[3]:0}`,error:e,errorStatus:r}}const Oe=t=>{let{help:r,helpStatus:n,errors:o=we,warnings:l=we,className:i,fieldId:f,onVisibleChanged:h}=t;const{prefixCls:g}=e.exports.useContext(z),b=`${g}-item-explain`,x=a(g),[v,y,$]=$e(g,x),w=e.exports.useMemo((()=>s(g)),[g]),C=ce(o),O=ce(l),S=e.exports.useMemo((()=>null!=r?[Ce(r,"help",n)]:[].concat(c(C.map(((e,t)=>Ce(e,"error","error",t)))),c(O.map(((e,t)=>Ce(e,"warning","warning",t)))))),[r,n,C,O]),j={};return f&&(j.id=`${f}_help`),v(d(u,{motionDeadline:w.motionDeadline,motionName:`${g}-show-help`,visible:!!S.length,onVisibleChanged:h,children:e=>{const{className:t,style:r}=e;return d("div",{...Object.assign({},j,{className:p(b,t,$,x,i,y),style:r,role:"alert"}),children:d(m,{...Object.assign({keys:S},s(g),{motionName:`${g}-show-help-item`,component:!1}),children:e=>{const{key:t,error:r,errorStatus:n,className:o,style:l}=e;return d("div",{className:p(o,{[`${b}-${n}`]:n}),style:l,children:r},t)}})})}}))},Se=["parentNode"],je="form_item";function ke(e){return void 0===e||!1===e?[]:Array.isArray(e)?e:[e]}function Ie(e,t){if(!e.length)return;const r=e.join("_");if(t)return`${t}_${r}`;return Se.includes(r)?`${je}_${r}`:r}function Me(e,t,r,n,o,l){let i=n;return void 0!==l?i=l:r.validating?i="validating":e.length?i="error":t.length?i="warning":(r.touched||o&&r.validated)&&(i="success"),i}function Fe(e){return ke(e).join("_")}function Ee(t){const[r]=A(),n=e.exports.useRef({}),o=e.exports.useMemo((()=>null!=t?t:Object.assign(Object.assign({},r),{__INTERNAL__:{itemRef:e=>t=>{const r=Fe(e);t?n.current[r]=t:delete n.current[r]}},scrollToField:function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const r=Ie(ke(e),o.__INTERNAL__.name),n=r?document.getElementById(r):null;n&&function(e,t){if(!e.isConnected||!(e=>{let t=e;for(;t&&t.parentNode;){if(t.parentNode===document)return!0;t=t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}return!1})(e))return;const r=(e=>{const t=window.getComputedStyle(e);return{top:parseFloat(t.scrollMarginTop)||0,right:parseFloat(t.scrollMarginRight)||0,bottom:parseFloat(t.scrollMarginBottom)||0,left:parseFloat(t.scrollMarginLeft)||0}})(e);if("object"==typeof(n=t)&&"function"==typeof n.behavior)return t.behavior(ae(e,t));var n;const o="boolean"==typeof t||null==t?void 0:t.behavior;for(const{el:l,top:i,left:a}of ae(e,se(t))){const e=i-r.top+r.bottom,t=a-r.left+r.right;l.scroll({top:e,left:t,behavior:o})}}(n,Object.assign({scrollMode:"if-needed",block:"nearest"},t))},getFieldInstance:e=>{const t=Fe(e);return n.current[t]}})),[t,r]);return[o]}var Ne=globalThis&&globalThis.__rest||function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]])}return r};const Pe=(t,r)=>{const n=e.exports.useContext(f),{getPrefixCls:o,direction:l,form:i}=e.exports.useContext(h),{prefixCls:s,className:c,rootClassName:u,size:m,disabled:y=n,form:$,colon:w,labelAlign:C,labelWrap:O,labelCol:S,wrapperCol:j,hideRequiredMark:k,layout:I="horizontal",scrollToFirstError:M,requiredMark:F,onFinishFailed:E,name:N,style:P,feedbackIcons:T,variant:_}=t,W=Ne(t,["prefixCls","className","rootClassName","size","disabled","form","colon","labelAlign","labelWrap","labelCol","wrapperCol","hideRequiredMark","layout","scrollToFirstError","requiredMark","onFinishFailed","name","style","feedbackIcons","variant"]),R=g(m),q=e.exports.useContext(b),H=e.exports.useMemo((()=>void 0!==F?F:!k&&(!i||void 0===i.requiredMark||i.requiredMark)),[k,F,i]),z=null!=w?w:null==i?void 0:i.colon,A=o("form",s),X=a(A),[G,Y,K]=$e(A,X),U=p(A,`${A}-${I}`,{[`${A}-hide-required-mark`]:!1===H,[`${A}-rtl`]:"rtl"===l,[`${A}-${R}`]:R},K,X,Y,null==i?void 0:i.className,c,u),[Z]=Ee($),{__INTERNAL__:J}=Z;J.name=N;const Q=e.exports.useMemo((()=>({name:N,labelAlign:C,labelCol:S,labelWrap:O,wrapperCol:j,vertical:"vertical"===I,colon:z,requiredMark:H,itemRef:J.itemRef,form:Z,feedbackIcons:T})),[N,C,S,j,I,z,H,Z,T]);e.exports.useImperativeHandle(r,(()=>Z));const ee=(e,t)=>{if(e){let r={block:"nearest"};"object"==typeof e&&(r=e),Z.scrollToField(t,r)}};return G(d(L.Provider,{value:_,children:d(x,{disabled:y,children:d(v.Provider,{value:R,children:d(D,{validateMessages:q,children:d(V.Provider,{value:Q,children:d(B,{...Object.assign({id:N},W,{name:N,onFinishFailed:e=>{if(null==E||E(e),e.errorFields.length){const t=e.errorFields[0].name;if(void 0!==M)return void ee(M,t);i&&void 0!==i.scrollToFirstError&&ee(i.scrollToFirstError,t)}},form:Z,style:Object.assign(Object.assign({},null==i?void 0:i.style),P),className:U})})})})})})}))},Te=e.exports.forwardRef(Pe);const _e=()=>{const{status:t,errors:r=[],warnings:n=[]}=e.exports.useContext(X);return{status:t,errors:r,warnings:n}};_e.Context=X;const We=_e;const Re=e=>{const{formItemCls:t}=e;return{"@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none)":{[`${t}-control`]:{display:"flex"}}}},qe=C(["Form","item-item"],((e,t)=>{let{rootPrefixCls:r}=t;const n=ye(e,r);return[Re(n)]})),He=t=>{const{prefixCls:r,status:n,wrapperCol:o,children:l,errors:i,warnings:a,_internalItemRender:s,extra:c,help:u,fieldId:m,marginBottom:f,onErrorVisibleChanged:h}=t,g=`${r}-item`,b=e.exports.useContext(V),x=o||b.wrapperCol||{},v=p(`${g}-control`,x.className),y=e.exports.useMemo((()=>Object.assign({},b)),[b]);delete y.labelCol,delete y.wrapperCol;const $=d("div",{className:`${g}-control-input`,children:d("div",{className:`${g}-control-input-content`,children:l})}),w=e.exports.useMemo((()=>({prefixCls:r,status:n})),[r,n]),C=null!==f||i.length||a.length?O("div",{style:{display:"flex",flexWrap:"nowrap"},children:[d(z.Provider,{value:w,children:d(Oe,{fieldId:m,errors:i,warnings:a,help:u,helpStatus:n,className:`${g}-explain-connected`,onVisibleChanged:h})}),!!f&&d("div",{style:{width:0,height:f}})]}):null,j={};m&&(j.id=`${m}_extra`);const k=c?d("div",{...Object.assign({},j,{className:`${g}-extra`}),children:c}):null,I=s&&"pro_table_render"===s.mark&&s.render?s.render(t,{input:$,errorList:C,extra:k}):O(S,{children:[$,C,k]});return O(V.Provider,{value:y,children:[d(Q,{...Object.assign({},x,{className:v}),children:I}),d(qe,{prefixCls:r})]})};const ze={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"}},{tag:"path",attrs:{d:"M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z"}}]},name:"question-circle",theme:"outlined"};var Ae=function(e,t){return d(j,{...e,ref:t,icon:ze})};const Le=e.exports.forwardRef(Ae);var De=globalThis&&globalThis.__rest||function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]])}return r};const Ve=t=>{let{prefixCls:r,label:n,htmlFor:o,labelCol:l,labelAlign:i,colon:a,required:s,requiredMark:c,tooltip:u}=t;var m;const[f]=te("Form"),{vertical:h,labelAlign:g,labelCol:b,labelWrap:x,colon:v}=e.exports.useContext(V);if(!n)return null;const y=l||b||{},$=`${r}-item-label`,w=p($,"left"===(i||g)&&`${$}-left`,y.className,{[`${$}-wrap`]:!!x});let C=n;const j=!0===a||!1!==v&&!1!==a;j&&!h&&"string"==typeof n&&""!==n.trim()&&(C=n.replace(/[:|：]\s*$/,""));const M=function(t){return t?"object"!=typeof t||e.exports.isValidElement(t)?{title:t}:t:null}(u);if(M){const{icon:t=d(Le,{})}=M,n=De(M,["icon"]),o=d(k,{...Object.assign({},n),children:e.exports.cloneElement(t,{className:`${r}-item-tooltip`,title:"",onClick:e=>{e.preventDefault()},tabIndex:null})});C=O(S,{children:[C,o]})}const F="optional"===c,E="function"==typeof c;E?C=c(C,{required:!!s}):F&&!s&&(C=O(S,{children:[C,d("span",{className:`${r}-item-optional`,title:"",children:(null==f?void 0:f.optional)||(null===(m=I.Form)||void 0===m?void 0:m.optional)})]}));const N=p({[`${r}-item-required`]:s,[`${r}-item-required-mark-optional`]:F||E,[`${r}-item-no-colon`]:!j});return d(Q,{...Object.assign({},y,{className:w}),children:d("label",{htmlFor:o,className:N,title:"string"==typeof n?n:"",children:C})})},Be={success:M,warning:F,error:E,validating:N};function Xe(t){let{children:r,errors:n,warnings:o,hasFeedback:l,validateStatus:i,prefixCls:a,meta:s,noStyle:c}=t;const u=`${a}-item`,{feedbackIcons:m}=e.exports.useContext(V),f=Me(n,o,s,null,!!l,i),{isFormItemInput:h,status:g,hasFeedback:b,feedbackIcon:x}=e.exports.useContext(X),v=e.exports.useMemo((()=>{var e;let t;if(l){const r=!0!==l&&l.icons||m,i=f&&(null===(e=null==r?void 0:r({status:f,errors:n,warnings:o}))||void 0===e?void 0:e[f]),a=f&&Be[f];t=!1!==i&&a?d("span",{className:p(`${u}-feedback-icon`,`${u}-feedback-icon-${f}`),children:i||d(a,{})}):null}const r={status:f||"",errors:n,warnings:o,hasFeedback:!!l,feedbackIcon:t,isFormItemInput:!0};return c&&(r.status=(null!=f?f:g)||"",r.isFormItemInput=h,r.hasFeedback=!!(null!=l?l:b),r.feedbackIcon=void 0!==l?r.feedbackIcon:x),r}),[f,l,c,h,g]);return d(X.Provider,{value:v,children:r})}var Ge=globalThis&&globalThis.__rest||function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]])}return r};function Ye(t){const{prefixCls:r,className:n,rootClassName:o,style:l,help:i,errors:a,warnings:s,validateStatus:c,meta:u,hasFeedback:m,hidden:f,children:h,fieldId:g,required:b,isRequired:x,onSubItemMetaChange:v}=t,y=Ge(t,["prefixCls","className","rootClassName","style","help","errors","warnings","validateStatus","meta","hasFeedback","hidden","children","fieldId","required","isRequired","onSubItemMetaChange"]),$=`${r}-item`,{requiredMark:w}=e.exports.useContext(V),C=e.exports.useRef(null),S=ce(a),j=ce(s),k=null!=i,I=!!(k||a.length||s.length),M=!!C.current&&P(C.current),[F,E]=e.exports.useState(null);T((()=>{if(I&&C.current){const e=getComputedStyle(C.current);E(parseInt(e.marginBottom,10))}}),[I,M]);const N=function(){let e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return Me(e?S:u.errors,e?j:u.warnings,u,"",!!m,c)}(),W=p($,n,o,{[`${$}-with-help`]:k||S.length||j.length,[`${$}-has-feedback`]:N&&m,[`${$}-has-success`]:"success"===N,[`${$}-has-warning`]:"warning"===N,[`${$}-has-error`]:"error"===N,[`${$}-is-validating`]:"validating"===N,[`${$}-hidden`]:f});return O("div",{className:W,style:l,ref:C,children:[O(ee,{...Object.assign({className:`${$}-row`},_(y,["_internalItemRender","colon","dependencies","extra","fieldKey","getValueFromEvent","getValueProps","htmlFor","id","initialValue","isListField","label","labelAlign","labelCol","labelWrap","messageVariables","name","normalize","noStyle","preserve","requiredMark","rules","shouldUpdate","trigger","tooltip","validateFirst","validateTrigger","valuePropName","wrapperCol","validateDebounce"])),children:[d(Ve,{...Object.assign({htmlFor:g},t,{requiredMark:w,required:null!=b?b:x,prefixCls:r})}),d(He,{...Object.assign({},t,u,{errors:S,warnings:j,prefixCls:r,status:N,help:i,marginBottom:F,onErrorVisibleChanged:e=>{e||E(null)}}),children:d(G.Provider,{value:v,children:d(Xe,{prefixCls:r,meta:u,errors:u.errors,warnings:u.warnings,hasFeedback:m,validateStatus:N,children:h})})})]}),!!F&&d("div",{className:`${$}-margin-offset`,style:{marginBottom:-F}})]})}const Ke=e.exports.memo((e=>{let{children:t}=e;return t}),((e,t)=>function(e,t){const r=Object.keys(e),n=Object.keys(t);return r.length===n.length&&r.every((r=>{const n=e[r],o=t[r];return n===o||"function"==typeof n||"function"==typeof o}))}(e.control,t.control)&&e.update===t.update&&e.childProps.length===t.childProps.length&&e.childProps.every(((e,r)=>e===t.childProps[r]))));const Ue=function(t){const{name:r,noStyle:n,className:o,dependencies:l,prefixCls:i,shouldUpdate:s,rules:u,children:m,required:f,label:g,messageVariables:b,trigger:x="onChange",validateTrigger:v,hidden:C,help:O}=t,{getPrefixCls:S}=e.exports.useContext(h),{name:j}=e.exports.useContext(V),k=function(e){if("function"==typeof e)return e;const t=y(e);return t.length<=1?t[0]:t}(m),I="function"==typeof k,M=e.exports.useContext(G),{validateTrigger:F}=e.exports.useContext(Y),E=void 0!==v?v:F,N=!(null==r),P=S("form",i),T=a(P),[_,z,A]=$e(P,T);W();const L=e.exports.useContext(K),D=e.exports.useRef(),[B,X]=function(t){const[r,n]=e.exports.useState(t),o=e.exports.useRef(null),l=e.exports.useRef([]),i=e.exports.useRef(!1);return e.exports.useEffect((()=>(i.current=!1,()=>{i.current=!0,$.cancel(o.current),o.current=null})),[]),[r,function(e){i.current||(null===o.current&&(l.current=[],o.current=$((()=>{o.current=null,n((e=>{let t=e;return l.current.forEach((e=>{t=e(t)})),t}))}))),l.current.push(e))}]}({}),[Z,J]=R((()=>({errors:[],warnings:[],touched:!1,validating:!1,name:[],validated:!1}))),Q=(e,t)=>{X((r=>{const n=Object.assign({},r),o=[].concat(c(e.name.slice(0,-1)),c(t)).join("__SPLIT__");return e.destroy?delete n[o]:n[o]=e,n}))},[ee,te]=e.exports.useMemo((()=>{const e=c(Z.errors),t=c(Z.warnings);return Object.values(B).forEach((r=>{e.push.apply(e,c(r.errors||[])),t.push.apply(t,c(r.warnings||[]))})),[e,t]}),[B,Z.errors,Z.warnings]),re=function(){const{itemRef:t}=e.exports.useContext(V),r=e.exports.useRef({});return function(e,n){const o=n&&"object"==typeof n&&n.ref,l=e.join("_");return r.current.name===l&&r.current.originRef===o||(r.current.name=l,r.current.originRef=o,r.current.ref=w(t(e),o)),r.current.ref}}();function ne(e,r,l){return n&&!C?d(Xe,{prefixCls:P,hasFeedback:t.hasFeedback,validateStatus:t.validateStatus,meta:Z,errors:ee,warnings:te,noStyle:!0,children:e}):d(Ye,{...Object.assign({key:"row"},t,{className:p(o,A,T,z),prefixCls:P,fieldId:r,isRequired:l,errors:ee,warnings:te,meta:Z,onSubItemMetaChange:Q}),children:e})}if(!N&&!I&&!l)return _(ne(k));let oe={};return"string"==typeof g?oe.label=g:r&&(oe.label=String(r)),b&&(oe=Object.assign(Object.assign({},oe),b)),_(d(U,{...Object.assign({},t,{messageVariables:oe,trigger:x,validateTrigger:E,onMetaChange:e=>{const t=null==L?void 0:L.getKey(e.name);if(J(e.destroy?{errors:[],warnings:[],touched:!1,validating:!1,name:[],validated:!1}:e,!0),n&&!1!==O&&M){let r=e.name;if(e.destroy)r=D.current||r;else if(void 0!==t){const[e,n]=t;r=[e].concat(c(n)),D.current=r}M(e,r)}}}),children:(n,o,i)=>{const a=ke(r).length&&o?o.name:[],p=Ie(a,j),m=void 0!==f?f:!(!u||!u.some((e=>{if(e&&"object"==typeof e&&e.required&&!e.warningOnly)return!0;if("function"==typeof e){const t=e(i);return t&&t.required&&!t.warningOnly}return!1}))),h=Object.assign({},n);let g=null;if(Array.isArray(k)&&N)g=k;else if(I&&(!s&&!l||N));else if(!l||I||N)if(e.exports.isValidElement(k)){const e=Object.assign(Object.assign({},k.props),h);if(e.id||(e.id=p),O||ee.length>0||te.length>0||t.extra){const r=[];(O||ee.length>0)&&r.push(`${p}_help`),t.extra&&r.push(`${p}_extra`),e["aria-describedby"]=r.join(" ")}ee.length>0&&(e["aria-invalid"]="true"),m&&(e["aria-required"]="true"),q(k)&&(e.ref=re(a,k));new Set([].concat(c(ke(x)),c(ke(E)))).forEach((t=>{e[t]=function(){for(var e,r,n,o,l,i=arguments.length,a=new Array(i),s=0;s<i;s++)a[s]=arguments[s];null===(n=h[t])||void 0===n||(e=n).call.apply(e,[h].concat(a)),null===(l=(o=k.props)[t])||void 0===l||(r=l).call.apply(r,[o].concat(a))}}));const r=[e["aria-required"],e["aria-invalid"],e["aria-describedby"]];g=d(Ke,{control:h,update:k,childProps:r,children:H(k,e)})}else g=I&&(s||l)&&!N?k(i):k;else;return ne(g,p,m)}}))};Ue.useStatus=We;const Ze=Ue;var Je=globalThis&&globalThis.__rest||function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]])}return r};const Qe=t=>{var{prefixCls:r,children:n}=t,o=Je(t,["prefixCls","children"]);const{getPrefixCls:l}=e.exports.useContext(h),i=l("form",r),a=e.exports.useMemo((()=>({prefixCls:i,status:"error"})),[i]);return d(Z,{...Object.assign({},o),children:(e,t,r)=>d(z.Provider,{value:a,children:n(e.map((e=>Object.assign(Object.assign({},e),{fieldKey:e.key}))),t,{errors:r.errors,warnings:r.warnings})})})};const et=Te;et.Item=Ze,et.List=Qe,et.ErrorList=Oe,et.useForm=Ee,et.useFormInstance=function(){const{form:t}=e.exports.useContext(V);return t},et.useWatch=J,et.Provider=D,et.create=()=>{};const tt=et;export{tt as F};