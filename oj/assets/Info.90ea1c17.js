import{bM as e,e as l,_ as t,d as a,n,j as s,a as i,o as r,bm as d,D as o,bw as c,l as u,bN as m,bl as p,bO as f}from"./index.5c064301.js";import{u as v}from"./img.76472ab1.js";import{s as g}from"./style.module.b5b5c35b.js";import{F as h}from"./index.0c9dd83b.js";import{U as b}from"./index.48fb18bd.js";import{S as x}from"./index.77ceaa6f.js";import{I as j}from"./index.7d75d2c2.js";import{S as y}from"./index.edecf03d.js";import{R as S,C as I}from"./row.e491f7a6.js";import{M as A,W as k}from"./WomanOutlined.2213c8b5.js";import"./context.aa52cc0c.js";import"./useLocale.07149357.js";import"./Dragger.eac806ba.js";import"./fade.9766c3a1.js";import"./progress.2cf02846.js";import"./CheckOutlined.363c4795.js";import"./Skeleton.ed2cb458.js";import"./index.4e624168.js";import"./BaseInput.01760c9b.js";const w=()=>{const[w,_]=e(l),[N]=h.useForm(),[V,$]=t.exports.useState([]),[C,D]=t.exports.useState(null==w?void 0:w.icon),F=a(n);return s("div",{className:g.info,children:[i("div",{className:"flex justify-center",children:i("div",{children:i(b,{beforeUpload:e=>{(async e=>{e.status="uploading",$([e]);const l=new FormData;l.append("file",e);const{data:{code:t,data:a,msg:n}}=await v(l);200===t&&(e.status="done",e.url=`${d}/${a.Icon}`,D(`${a.Icon}`),$([e]))})(e)},fileList:V,onRemove:()=>{},children:i(r,{src:`${d}/${C}`,size:128})})})}),i(o,{}),s("div",{style:{textAlign:"center",letterSpacing:"1px"},children:[i("span",{children:" ID："}),i(c,{title:`${null==w?void 0:w.id} 点击复制`,placement:"bottom",children:i("span",{onClick:()=>{if(!(null==w?void 0:w.id))return;f(null==w?void 0:w.id)&&F&&F.success({message:"已复制到剪切板"})},style:{userSelect:"none"},children:null==w?void 0:w.id})})]}),i(o,{}),s(S,{children:[i(I,{style:{textAlign:"center"},span:8,children:i(x,{title:"权限等级",value:String(null==w?void 0:w.level)})}),i(I,{style:{textAlign:"center"},span:8,children:i(x,{title:"竞赛分数",value:String(null==w?void 0:w.score)})}),i(I,{style:{textAlign:"center"},span:8,children:i(x,{title:"被游览数",value:String(null==w?void 0:w.visit_num)})})]}),s(S,{children:[i(I,{style:{textAlign:"center"},span:8,children:i(x,{title:"收到点赞",value:String(null==w?void 0:w.like_num)})}),i(I,{style:{textAlign:"center"},span:8,children:i(x,{title:"收到收藏",value:String(null==w?void 0:w.collect_num)})}),i(I,{style:{textAlign:"center"},span:8,children:i(x,{title:"收到点踩",value:String(null==w?void 0:w.unlike_num)})})]}),i(o,{}),s(h,{layout:"vertical",title:"基本信息",form:N,children:[s(S,{className:"w-full",children:[i(I,{span:8,children:i(h.Item,{name:"name",label:"昵称",children:i(j,{defaultValue:null==w?void 0:w.name})})}),i(I,{span:1}),i(I,{span:6,children:i(h.Item,{name:"address",label:"城市",children:i(j,{defaultValue:null==w?void 0:w.address})})}),i(I,{span:1}),i(I,{span:8,children:i(h.Item,{name:"sex",label:"性别",children:i(y,{block:!0,defaultValue:String(null==w?void 0:w.sex),options:[{label:s("span",{children:[i(A,{}),"男"]}),value:"false"},{label:s("span",{children:[i(k,{}),"女"]}),value:"true"}]})})})]}),i(h.Item,{name:"blog",label:"个人网站",validateTrigger:"onBlur",rules:[{type:"url",message:"请输入正确的网址"}],children:i(j,{defaultValue:null==w?void 0:w.blog})}),i(h.Item,{name:"res_long",label:"个人介绍",children:i(j.TextArea,{defaultValue:null==w?void 0:w.res_long,placeholder:"关于你的个性、兴趣或经验"})}),i("div",{className:"text-end",children:i(u,{type:"primary",onClick:async()=>{const e=N.getFieldsValue(!0),l={...w,...e};"string"==typeof l.sex&&("true"===l.sex&&(l.sex=!0),"false"===l.sex&&(l.sex=!1));const{data:t}=await m(JSON.stringify(l));if(200===t.code){const e=await p();_(e.data.data.user),F&&F.success({message:"保存成功"})}},children:"保存"})})]})]})};export{w as default};
