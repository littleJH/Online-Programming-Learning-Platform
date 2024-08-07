import{_ as e,m as t,t as a,a as s,j as r,S as i,d as o,cb as c,bM as l,bG as n,F as m,M as d,bE as p}from"./index.5c064301.js";import{i as u,j as h,g as y}from"./article.08f59da4.js";import{H as f}from"./GeneralRank.878d63d9.js";import{s as v}from"./style.module.6da86900.js";import{g as x}from"./noticeboard.0189f0d2.js";import{R as b}from"./Readonly.a9ebc692.js";import{s as j}from"./communityStore.399498c1.js";import{C as g}from"./index.9225dd62.js";import{S as k}from"./index.77ceaa6f.js";import{I as S}from"./index.7d75d2c2.js";import{S as N}from"./index.edecf03d.js";import"./Skeleton.ed2cb458.js";import"./index.0ec24622.js";import"./Pagination.855f4d50.js";import"./context.aa52cc0c.js";import"./index.a45f76a6.js";import"./List.6e377c69.js";import"./PurePanel.bec90387.js";import"./index.4e624168.js";import"./useLocale.07149357.js";import"./CheckOutlined.363c4795.js";import"./row.e491f7a6.js";import"./index.4cc837d4.js";import"./PlusOutlined.787b1bb7.js";import"./Dropdown.acaf0b68.js";import"./BaseInput.01760c9b.js";const P=r=>{const{type:i}=r,[o,c]=e.exports.useState([]),l=t.useNavTo();a.useToken(),e.exports.useEffect((()=>{switch(i){case"articleset":n();break;case"userset":m();break;case"commentset":d();break;case"postset":p()}}),[i]);const n=async()=>{const e=(await u(1,10)).data.data.articles;let t=0;for(let a of e){const{data:s}=await h(a.Member);e[t].article=s.data.article,t++}c(e.map((e=>({title:s("div",{style:{padding:"0.75rem 0"},children:e.article.title}),score:e.Score,type:"articleset",id:e.Member}))))},m=async()=>{},d=async()=>{},p=async()=>{};return s(f,{rankList:o,onClick:e=>(e=>o&&l(`/community/${o[e].type.replace("set","")}/${o[e].id}`))(e),icon:"fire"})},w=e=>{const{stats:t}=e;return r(g,{size:"small",title:"全站统计",hoverable:!0,className:"mb-4 flex flex-col justify-center text-xs",children:[s(k,{}),r(i,{size:"large",children:[r(i,{size:6,direction:"vertical",children:[r("div",{children:["文章：",null==t?void 0:t.article]}),s("div",{children:"讨论：10154"}),s("div",{children:"题解：1325"})]}),r(i,{size:6,direction:"vertical",children:[r("div",{children:["题目：",null==t?void 0:t.article]}),s("div",{children:"比赛：10154"}),s("div",{children:"用户：1325"})]})]})]})},z=()=>{var i;const u=t.useNavTo(),h=o(c),[f,k]=e.exports.useState([]),[z,A]=e.exports.useState(!1),[M,C]=l(j),[E,L]=e.exports.useState((null==(i=n.getQuerys(location.search))?void 0:i.text)||""),[R,T]=e.exports.useState({article:0,comment:0,solve:0}),{token:B}=a.useToken(),G=e.exports.useMemo((()=>n.getPathArray(h)[1]),[h]),I=e.exports.useMemo((()=>z?f:f.slice(0,3)),[f,z]),O=e.exports.useMemo((()=>n.getPathArray(h).length>1&&n.getPathArray(h)[1].includes("set")),[h]);e.exports.useEffect((()=>{"/community"===h&&u("/community/articleset"),V()}),[h]),e.exports.useEffect((()=>(F(),window.addEventListener("popstate",V),()=>{window.removeEventListener("popstate",V)})),[]);const V=()=>{n.getPathArray(h).length>1&&n.getPathArray(h)[1].includes("set")&&C(H()),D()},D=async()=>{try{const e=(await x(1,999999)).data.data;k(e.notices)}catch{}},F=async()=>{const e=await Promise.all([y(1,0)]);T((t=>({...t,article:e[0].data.data.total})))},H=()=>r(m,{children:[s(w,{stats:R}),s(P,{type:G})]});return r("div",{className:v.communityRoot,children:[r("div",{className:v.left,children:[O&&s(S.Search,{className:v.search,size:"large",defaultValue:E,placeholder:"搜索用户、公告、文章、讨论、题解",enterButton:!0,onSearch:e=>{L(e),u(`/community/${n.getPathArray(h)[1]}?text=${e}`)},onChange:e=>{""===e.target.value&&(u(`/community/${n.getPathArray(h)[1]}`),L(""))}}),O&&s("div",{className:v.notice,children:I.map(((e,t)=>s("div",{className:v.item,style:{marginRight:2===t?"0px":"1rem"},children:s(g,{styles:{body:{height:"6rem",padding:"0px",marginBottom:"1rem",overflow:"hidden",boxSizing:"border-box"}},title:e.title,size:"small",hoverable:!0,onClick:()=>u(`/community/notice/${e.id}`),children:s(b,{style:{fontSize:"0.8rem"},html:e.content})})},t)))}),O?s(g,{className:v.recommand,title:r("div",{className:v.title,children:[s(d,{color:""===E?"":B.colorPrimary,href:""+(""===E?"recommand":"search"),size:2}),s("span",{className:"ml-2",children:""===E?"每日推荐":`搜索结果：${E}`})]}),extra:s(N,{defaultValue:G,options:$,onChange:e=>{u(`/community/${e}`)}}),children:s("div",{className:v.content,children:s(p,{})})}):s("div",{className:v.content,children:s(p,{})})]}),M&&s("div",{className:v.right,children:M})]})},$=[{key:"articleset",value:"articleset",label:"文章"},{key:"commentset",value:"commentset",label:"讨论"},{key:"postset",value:"postset",label:"题解"},{key:"userset",value:"userset",label:"用户"}];export{z as default};
