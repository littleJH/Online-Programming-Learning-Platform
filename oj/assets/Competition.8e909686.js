import{m as e,bI as a,_ as t,d as l,n as i,cn as s,j as r,a as n,S as o,l as m}from"./index.5c064301.js";import{T as d}from"./TextEditor.53774050.js";import{d as c,c as u,u as p,f as h,h as b,i as f,j as _}from"./competition.7cff66b2.js";import{F as g}from"./index.0c9dd83b.js";import{I as j}from"./index.7d75d2c2.js";import{R as v}from"./index.4d9ca8d6.js";import{I as k}from"./index.7aeb2011.js";import{S as w}from"./index.a45f76a6.js";import{S as x}from"./index.05a8036e.js";import{D as y}from"./index.75d3f4b2.js";import{R as I,C as Y}from"./row.e491f7a6.js";import"./index.4cc837d4.js";import"./context.aa52cc0c.js";import"./useLocale.07149357.js";import"./index.4e624168.js";import"./BaseInput.01760c9b.js";import"./UpOutlined.722986ed.js";import"./List.6e377c69.js";import"./PurePanel.bec90387.js";import"./CheckOutlined.363c4795.js";import"./SwapRightOutlined.64619f65.js";const H=[{label:"单人赛",value:"Single"},{label:"组队赛",value:"Group"},{label:"匹配赛",value:"Match"},{label:"OI赛",value:"OI"}],S=()=>{const S=e.useNavTo(),[q]=a(),F=q.get("competition_id"),[O,C]=t.exports.useState(),[D]=g.useForm(),[M,R]=t.exports.useState(!1),[T,N]=t.exports.useState(!1),{RangePicker:E}=y,L=l(i);t.exports.useEffect((()=>{F&&P()}),[]);const P=async()=>{var e,a;if(!F)return;const t=await c(F),l=await u(F),i=t.data.data.competition;i.labels=((null==(e=l.data.data)?void 0:e.competitionLabels)||[]).map((e=>({id:e.id,label:e.label,competition_id:e.compeition_id}))),C(i);let r={title:i.title,type:i.type,content:i.content,less_num:i.less_num,up_num:i.up_num,Hack:i.hack_score>0,timeRange:[s(i.start_time),s(i.end_time)],labels:((null==(a=l.data.data)?void 0:a.competitionLabels)||[]).map((e=>e.label))};i.hack_score>0&&(r={...r,hack_time:i.hack_time,hack_score:i.hack_score,hack_num:i.hack_num}),D.setFieldsValue(r)},V=e=>{200===e.code?L&&L.success({message:e.msg}):L&&L.warning({message:e.msg})};return r(g,{scrollToFirstError:!0,name:"problemForm",form:D,onFinish:()=>{D.validateFields().then((async e=>{var a,t,l,i,r;const n=D.getFieldsValue();Object.keys(n).forEach(((e,a)=>{switch(e){case"timeRange":Object.assign(n,{start_time:s(n[e][0]).format("YYYY-MM-DD HH:mm:ss"),end_time:s(n[e][1]).format("YYYY-MM-DD HH:mm:ss")}),delete n.timeRange;break;case"hack_time":n[e]=s(n.end_time).add(n[e],"minute").format("YYYY-MM-DD HH:mm:ss")}}));let o,m=F;if(F?o=await p(F,JSON.stringify(n)):(o=await h(JSON.stringify(n)),m=(null==(t=null==(a=o.data.data)?void 0:a.competition)?void 0:t.id)||""),V(o.data),m&&(null==n?void 0:n.passwd)&&b(m,JSON.stringify({passwd:n.passwd})),m&&n.labels){const e=n.labels.filter((e=>{var a;return!(null==(a=null==O?void 0:O.labels)?void 0:a.find((a=>e===a.label)))})),a=(null==(l=null==O?void 0:O.labels)?void 0:l.filter((e=>{var a;return!(null==(a=n.labels)?void 0:a.find((a=>a===e.label)))})))||[];for(let t of e)f(m,t);for(let t of a)_(m,t.id)}if(m&&0===(null==(i=n.labels)?void 0:i.length)&&(null==O?void 0:O.labels)&&O.labels.length>0)for(let s of O.labels)_(m,s.id);200===(null==(r=o.data)?void 0:r.code)&&S(`/creation/competition/problem?competition_id=${m}`)}))},layout:"vertical",children:[n(g.Item,{name:"title",label:"标题",required:!0,rules:[{required:!0}],children:n(j,{})}),n(g.Item,{name:"type",label:"比赛类型",required:!0,rules:[{required:!0}],children:n(v.Group,{optionType:"button",options:H,onChange:e=>{"Group"===e.target.value?N(!0):N(!1)}})}),T&&n(g.Item,{noStyle:!0,children:r(I,{gutter:16,children:[n(Y,{children:n(g.Item,{name:"less_num",label:"人数下限",rules:[{required:!0}],children:n(k,{min:1})})}),n(Y,{children:n(g.Item,{name:"up_num",label:"人数上限",dependencies:["less_num"],rules:[{required:!0}],children:n(k,{})})})]})}),n(g.Item,{name:"timeRange",label:"比赛时间",rules:[{required:!0}],children:n(E,{showTime:{format:"HH:mm"},format:"YYYY-MM-DD HH:mm",onChange:(e,a)=>{D.setFieldValue("timeRange",[s(a[0]),s(a[1])])}})}),n(g.Item,{name:"content",label:"描述",required:!0,rules:[{required:!0}],children:n(d,{mode:"markdown",htmlChange:e=>((e,a)=>{D.setFieldValue(a,e)})(e,"content")})}),n(g.Item,{name:"passwd",label:"密码",children:n(j.Password,{autoComplete:"new-password",style:{width:"200px"}})}),n(g.Item,{name:"labels",label:"标签",children:n(w,{allowClear:!0,mode:"tags",style:{display:"block",width:"200px"}})}),n(g.Item,{label:"Hack",children:n(x,{onChange:e=>R(e)})}),M&&n(g.Item,{noStyle:!0,children:r(I,{gutter:16,children:[n(Y,{span:6,children:n(g.Item,{name:"hack_time",label:"Hack时长",rules:[{required:!0}],children:n(k,{addonAfter:"min"})})}),n(Y,{children:n(g.Item,{name:"hack_score",label:"Hack分数",tooltip:n("span",{children:"黑客成功后的奖励分数"}),rules:[{required:!0}],children:n(k,{})})}),n(Y,{children:n(g.Item,{name:"hack_num",label:"Hack次数",tooltip:n("span",{children:"最多可以获得分数的黑客次数"}),rules:[{required:!0}],children:n(k,{})})})]})}),r(o,{className:"flex justify-center",children:[n(m,{onClick:()=>S(`/creation/competition/declare?competition_id=${F}`),children:"上一步"}),n(m,{htmlType:"submit",type:"primary",children:"保存，下一步"})]})]})};export{S as default};