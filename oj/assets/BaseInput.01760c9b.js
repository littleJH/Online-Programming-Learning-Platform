import{_ as e,v as a,x as n,a as l,L as r,j as o,w as c,H as t}from"./index.5c064301.js";function s(e,a,n){var l=a.cloneNode(!0),r=Object.create(e,{target:{value:l},currentTarget:{value:l}});return l.value=n,"number"==typeof a.selectionStart&&"number"==typeof a.selectionEnd&&(l.selectionStart=a.selectionStart,l.selectionEnd=a.selectionEnd),r}function i(e,a,n,l){if(n){var r=a;"click"!==a.type?"file"===e.type||void 0===l?n(r):n(r=s(a,e,l)):n(r=s(a,e,""))}}function u(e,a){if(e){e.focus(a);var n=(a||{}).cursor;if(n){var l=e.value.length;switch(n){case"start":e.setSelectionRange(0,0);break;case"end":e.setSelectionRange(l,l);break;default:e.setSelectionRange(0,l)}}}}var d=function(s){var i,u,d=s.inputElement,p=s.children,f=s.prefixCls,v=s.prefix,x=s.suffix,m=s.addonBefore,h=s.addonAfter,N=s.className,g=s.style,b=s.disabled,y=s.readOnly,w=s.focused,W=s.triggerFocus,E=s.allowClear,S=s.value,k=s.handleReset,C=s.hidden,R=s.classes,j=s.classNames,A=s.dataAttrs,B=s.styles,I=s.components,D=null!=p?p:d,O=(null==I?void 0:I.affixWrapper)||"span",F=(null==I?void 0:I.groupWrapper)||"span",H=(null==I?void 0:I.wrapper)||"span",L=(null==I?void 0:I.groupAddon)||"span",M=e.exports.useRef(null),T=function(e){return!!(e.prefix||e.suffix||e.allowClear)}(s),_=e.exports.cloneElement(D,{value:S,className:a(D.props.className,!T&&(null==j?void 0:j.variant))||null});if(T){var q,z=null;if(E){var G,J=!b&&!y&&S,K="".concat(f,"-clear-icon"),P="object"===n(E)&&null!=E&&E.clearIcon?E.clearIcon:"✖";z=l("span",{onClick:k,onMouseDown:function(e){return e.preventDefault()},className:a(K,(G={},r(G,"".concat(K,"-hidden"),!J),r(G,"".concat(K,"-has-suffix"),!!x),G)),role:"button",tabIndex:-1,children:P})}var Q="".concat(f,"-affix-wrapper"),U=a(Q,(r(q={},"".concat(f,"-disabled"),b),r(q,"".concat(Q,"-disabled"),b),r(q,"".concat(Q,"-focused"),w),r(q,"".concat(Q,"-readonly"),y),r(q,"".concat(Q,"-input-with-clear-btn"),x&&E&&S),q),null==R?void 0:R.affixWrapper,null==j?void 0:j.affixWrapper,null==j?void 0:j.variant),V=(x||E)&&o("span",{className:a("".concat(f,"-suffix"),null==j?void 0:j.suffix),style:null==B?void 0:B.suffix,children:[z,x]});_=o(O,{className:U,style:null==B?void 0:B.affixWrapper,onClick:function(e){var a;null!==(a=M.current)&&void 0!==a&&a.contains(e.target)&&(null==W||W())},...null==A?void 0:A.affixWrapper,ref:M,children:[v&&l("span",{className:a("".concat(f,"-prefix"),null==j?void 0:j.prefix),style:null==B?void 0:B.prefix,children:v}),_,V]})}if(function(e){return!(!e.addonBefore&&!e.addonAfter)}(s)){var X="".concat(f,"-group"),Y="".concat(X,"-addon"),Z="".concat(X,"-wrapper"),$=a("".concat(f,"-wrapper"),X,null==R?void 0:R.wrapper,null==j?void 0:j.wrapper),ee=a(Z,r({},"".concat(Z,"-disabled"),b),null==R?void 0:R.group,null==j?void 0:j.groupWrapper);_=l(F,{className:ee,children:o(H,{className:$,children:[m&&l(L,{className:Y,children:m}),_,h&&l(L,{className:Y,children:h})]})})}return c.cloneElement(_,{className:a(null===(i=_.props)||void 0===i?void 0:i.className,N)||null,style:t(t({},null===(u=_.props)||void 0===u?void 0:u.style),g),hidden:C})};export{d as B,i as r,u as t};