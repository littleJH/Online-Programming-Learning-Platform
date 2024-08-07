import{d as e,i as t,m as a,_ as i,bI as r,t as s,a as o,bG as l,j as n,cn as d,M as c,F as m}from"./index.5c064301.js";import{g as u,s as p,a as v,b as f,c as h}from"./competition.7cff66b2.js";import{C as g}from"./CompetitionTypeLabel.59429231.js";import{G as x}from"./GeneralTable.8195648c.js";import{a as b}from"./competitionMixture.e039dd24.js";import{M as y}from"./MyTag.a4f82d92.js";import{S as j}from"./index.7d75d2c2.js";import{s as w}from"./style.module.9ce82fca.js";import{S}from"./index.a45f76a6.js";import{S as N}from"./Skeleton.ed2cb458.js";import"./Table.f08b7a7b.js";import"./context.aa52cc0c.js";import"./List.6e377c69.js";import"./index.ec27075f.js";import"./index.4d9ca8d6.js";import"./index.699f9875.js";import"./Dropdown.acaf0b68.js";import"./PurePanel.bec90387.js";import"./Pagination.855f4d50.js";import"./index.4e624168.js";import"./useLocale.07149357.js";import"./useClosable.e9e9bb76.js";import"./BaseInput.01760c9b.js";import"./CheckOutlined.363c4795.js";const z=[{text:"个人赛",value:"single"},{text:"OI赛",value:"OI"},{text:"组队赛",value:"group"},{text:"匹配赛",value:"match"}],k=()=>{const k=e(t),I=a.useNavTo(),[C,O]=i.exports.useState(!1),[_,T]=r(),[L,M]=i.exports.useState([]),[P,B]=i.exports.useState(0),{token:G}=s.useToken(),[H,D]=i.exports.useState({pageNum:Number(_.get("pageNum"))||1,pageSize:Number(_.get("pageSize"))||20,text:_.get("text")||"",label:_.get("label")||"",type:""}),E=i.exports.useMemo((()=>k?"middle":"large"),[k]);i.exports.useEffect((()=>{M([]),F()}),[H]);const F=async()=>{var e,t,a,i;O(!0);const{text:r,label:s,pageNum:n,pageSize:c,type:m}=H;let g,x=[],y=0;const j=[];r||s?r&&!s?g=await p(r,n,c):!r&&s?g=await v(s,n,c):r&&s&&(g=await f(r,s,n,c)):g=await u(m,n,c),x=g&&(null==(e=g.data.data)?void 0:e.competitions)||[],y=g&&(null==(t=g.data.data)?void 0:t.total)||0;for(let u of x){const e=await b(u.type,u.id),t=await h(u.id);j.push({id:u.id,title:{value:u.title,label:o("div",{className:"hover:cursor-pointer",onClick:()=>V(u),children:u.title})},type:u.type,start_time:u.start_time,duration:l.getDuration(u.start_time,u.end_time),state:(w=u.start_time,S=u.end_time,d(w).valueOf()>d().valueOf()?"notStart":d(w).valueOf()<d().valueOf()&&d(S).valueOf()>d().valueOf()?"underway":"finished"),key:u.id,enter:(null==(a=e.data.data)?void 0:a.enter)||!1,labels:((null==(i=t.data.data)?void 0:i.competitionLabels)||[]).map((e=>e.label))})}var w,S;B(y),M(j),O(!1)},V=e=>{I(`/competition/common/${e.id}/overview`)},W={columns:[{key:"state",title:"状态",align:"center",dataIndex:"state",filters:[{text:"未开始",value:"notStart"},{text:"进行中",value:"underway"},{text:"已结束",value:"finished"}],render:e=>{switch(e){case"notStart":return o(c,{href:"#icon-weikaishi",size:3,color:G.colorInfoTextHover});case"underway":return o(c,{href:"#icon-jinhangzhong",size:3,color:G.colorSuccessTextHover});case"finished":return o(c,{href:"#icon-yijieshu",size:3,color:G.colorErrorTextHover});default:return}}},{key:"title",title:"比赛名称",dataIndex:["title","label"],render:(e,t)=>{var a;return n("div",{className:w.title,children:[o("span",{children:e}),o("span",{children:null==(a=t.labels)?void 0:a.map(((e,t)=>o("span",{children:t<=1&&o(y,{children:e})},t)))})]})}},{key:"type",title:"比赛类型",dataIndex:"type",filters:z,onFilter:(e,t)=>e.toLowerCase()===t.type.toLowerCase(),render:e=>o(g,{type:"OI"===e?e:e.toLowerCase(),size:1})},{key:"start_time",title:"开始时间",align:"center",sorter:(e,t)=>d(e.start_time).valueOf()-d(t.start_time).valueOf(),dataIndex:"start_time"},{key:"duration",title:"时长",align:"center",dataIndex:"duration"},{key:"enter",title:"报名状态",dataIndex:"enter",align:"center",render:e=>n(m,{children:[!e&&o(c,{href:"#icon-weibaoming",color:G.colorWarning,size:3}),e&&o(c,{href:"#icon-yibaoming",color:G.colorInfo,size:3})]})}],dataSource:L,pageProps:{...H,total:P,onPageChange:(e,t)=>{D((a=>({...a,pageNum:e,pageSize:t}))),T((a=>(a.set("pageNum",String(e)),a.set("pageSize",String(t)),a)))}}};return n("div",{className:w.commonset,children:[n("div",{className:w.header,children:[o("div",{className:w.item,children:o(j,{style:{width:"100%"},size:E,defaultValue:H.text,placeholder:"名称",enterButton:!0,onSearch:()=>{},onChange:e=>{return t=e.target.value,D((e=>({...e,text:t}))),void T((e=>(e.set("text",t),e)));var t}})}),o("div",{className:"w-8"}),o("div",{className:w.item,children:o(j,{style:{width:"100%"},size:E,defaultValue:H.text,placeholder:"标签",enterButton:!0,onSearch:F,onChange:e=>{return t=e.target.value,D((e=>({...e,label:t}))),void T((e=>(e.set("label",t),e)));var t}})}),o("div",{className:"w-8"}),o("div",{className:w.item,children:o(S,{size:E,placeholder:"类型",style:{width:"100%"},options:[{value:"",label:"全部"},...z.map((e=>({label:e.text,value:e.value})))],onChange:e=>D((t=>({...t,type:e})))})})]}),n("div",{className:w.content,children:[C&&o(N,{active:!0,paragraph:{rows:10}}),o("div",{className:w.table,children:!C&&o(x,{...W})})]})]})};export{k as default};
