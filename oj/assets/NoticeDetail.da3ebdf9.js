import{m as e,cc as a,_ as s,d as t,e as o,t as i,n,bF as c,a as r,j as d,S as l,l as m,D as p}from"./index.5c064301.js";import{s as u}from"./style.module.6da86900.js";import{R as h}from"./Readonly.a9ebc692.js";import{a as j,d as f}from"./noticeboard.0189f0d2.js";import{C as x}from"./index.9225dd62.js";import{P as b}from"./index.bad11826.js";import"./index.4cc837d4.js";import"./Skeleton.ed2cb458.js";import"./PlusOutlined.787b1bb7.js";import"./Dropdown.acaf0b68.js";import"./ActionButton.76c967e9.js";import"./useLocale.07149357.js";const y=()=>{var y,v;const k=e.useNavTo(),{notice_id:w=""}=a(),[N,T]=s.exports.useState(),g=t(o),{token:D}=i.useToken(),_=t(n);s.exports.useEffect((()=>{C()}),[]);const C=async()=>{try{const e=(await j(w)).data.data.notice,a=(await c(e.user_id)).data.data.user;e.user=a,T(e)}catch{}};return r("div",{className:u.noticeDetail,children:N&&d(x,{children:[r("h1",{className:u.title,children:N.title}),d("div",{className:u.authorLine,style:{color:D.colorTextDescription},children:[d(l,{children:[r("span",{children:null==(y=N.user)?void 0:y.name}),r("span",{children:N.updated_at})]}),(null==(v=N.user)?void 0:v.name)===(null==g?void 0:g.name)&&r("div",{className:u.editBox,children:d(l,{children:[r(m,{size:"small",type:"dashed",onClick:()=>{k(`/creation/notice?id=${w}`)},children:"编辑"}),r(b,{title:"确认删除？",okText:"确认",cancelText:"取消",onConfirm:async()=>{try{const e=(await f(w)).data;200===e.code?(_&&_.success({message:"删除成功"}),window.history.back()):_&&_.error({message:e.msg})}catch{}},children:r(m,{size:"small",type:"dashed",danger:!0,children:"删除"})})]})})]}),r(p,{}),r(h,{html:N.content})]})})};export{y as default};