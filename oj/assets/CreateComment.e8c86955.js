import{m as e,bI as t,_ as o,j as s,a as r,l as i}from"./index.5c064301.js";import{s as a}from"./style.module.cb8cfc2a.js";import{T as m}from"./TextEditor.53774050.js";import{d as l}from"./comment.ebb40c5a.js";import{P as d}from"./List.9fbede2c.js";import{s as c}from"./problem.1496b552.js";import{F as n}from"./index.0c9dd83b.js";import{D as p}from"./index.79a1b64c.js";import{I as j}from"./index.7d75d2c2.js";import{M as u}from"./index.6891d53f.js";import{R as b}from"./index.4071f4af.js";import"./index.4cc837d4.js";import"./tag.c2520897.js";import"./Readonly.a9ebc692.js";import"./topic.eb4e8577.js";import"./ProblemTable.523975e8.js";import"./record.df22aa8c.js";import"./progress.2cf02846.js";import"./CheckOutlined.363c4795.js";import"./MyTag.a4f82d92.js";import"./useClosable.e9e9bb76.js";import"./context.aa52cc0c.js";import"./GeneralTable.8195648c.js";import"./Table.f08b7a7b.js";import"./List.6e377c69.js";import"./index.a45f76a6.js";import"./PurePanel.bec90387.js";import"./index.4e624168.js";import"./useLocale.07149357.js";import"./index.ec27075f.js";import"./index.4d9ca8d6.js";import"./index.699f9875.js";import"./Dropdown.acaf0b68.js";import"./Pagination.855f4d50.js";import"./style.module.af136287.js";import"./Skeleton.ed2cb458.js";import"./index.bad11826.js";import"./ActionButton.76c967e9.js";import"./MyCollapse.32cc964b.js";import"./Collapse.6714be34.js";import"./index.972659d0.js";import"./row.e491f7a6.js";import"./BaseInput.01760c9b.js";import"./fade.9766c3a1.js";const f=()=>{const f=e.useNavTo(),[x,y]=t(),h=x.get("problem_id"),[C]=n.useForm(),[v,k]=o.exports.useState(""),[F,T]=o.exports.useState(!1),[g,w]=o.exports.useState(),[I,P]=o.exports.useState([]),[S,_]=o.exports.useState(!1),E=o.exports.useMemo((()=>[...I.map((e=>e.key))]),[I]);o.exports.useEffect((()=>{h&&M()}),[]),o.exports.useEffect((()=>{var e,t;C.setFieldsValue({problem:null==(e=I[0])?void 0:e.title,id:null==(t=I[0])?void 0:t.key})}),[I]);const M=async()=>{if(h)try{const e=(await c(h)).data.data.problem;C.setFieldsValue({title:e.title,id:e.id})}catch{}};return s("div",{className:a.commentCreation,children:[r(p,{width:"50vw",open:S,onClose:()=>_(!1),children:r(d,{mode:"radio",selectedProblems:I,setSelectedProblems:P,selectedRowKeys:E})}),s(n,{form:C,name:"commentForm",layout:"vertical",scrollToFirstError:!0,initialValues:{auto_update:!0,auto_pass:!1,pass_re:!1},children:[r(n.Item,{name:"title",label:"题目",rules:[{required:!0}],children:r(j,{disabled:!0,suffix:h?null:r(i,{type:"primary",onClick:()=>_(!0),children:"选择题目"})})}),r(n.Item,{name:"id",label:"题目 ID",rules:[{required:!0}],children:r(j,{disabled:!0})}),r(n.Item,{name:"content",label:"描述",rules:[{required:!0}],children:r(m,{value:v,mode:"markdown",htmlChange:e=>{k(e),C.setFieldValue("content","<p><br></p>"===e||""===e?void 0:e)}})})]}),r("div",{className:"text-center",children:r(i,{type:"primary",style:{margin:"1rem 0"},onClick:()=>{C.validateFields().then((async e=>{try{const t=(await l(e.id,{content:e.content})).data;w({status:200===t.code?"success":"error",title:"创建"+(200===t.code?"成功":"失败"),subTitle:200===t.code?"":t.msg,extra:200===t.code?[r(i,{type:"primary",onClick:()=>f(h?`/problemdetail/${h}/comment`:`/community/comment/${t.data.comment.id}`),children:"查看详情"},"detail"),r(i,{type:"primary",onClick:()=>{y([]),C.resetFields(),T(!1),k("")},children:"继续创建"},"next")]:null}),T(!0)}catch{}})).catch((e=>{}))},children:"发布"})}),r(u,{open:F,footer:null,onCancel:()=>T(!1),style:{translate:"0 50%"},children:r(b,{...g})})]})};export{f as default};
