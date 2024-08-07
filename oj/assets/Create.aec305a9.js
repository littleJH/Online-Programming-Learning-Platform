import{_ as e,a as t,A as a,j as r,F as s,l,S as o,d as i,bQ as n,bG as d,i as c,bI as m,cl as p,bM as u,cm as h,n as g,t as f}from"./index.5c064301.js";import{T as b}from"./TextEditor.53774050.js";import{I as S,T as _}from"./index.7d75d2c2.js";import{F as x}from"./index.0c9dd83b.js";import{I as y}from"./index.7aeb2011.js";import{S as v}from"./index.a45f76a6.js";import{R as j,C}from"./row.e491f7a6.js";import{M as I}from"./MinusCircleOutlined.59c26db9.js";import{P as k}from"./PlusOutlined.787b1bb7.js";import{C as w,c as N}from"./program.7335cc1e.js";import{R as F}from"./index.4d9ca8d6.js";import{u as O,n as H,s as q,o as M,j as z,a as L}from"./problem.1496b552.js";import{c as V}from"./tag.c2520897.js";import{D as E}from"./Dragger.eac806ba.js";import{D as P}from"./index.79a1b64c.js";import{P as J}from"./progress.2cf02846.js";import{R}from"./index.4071f4af.js";import{M as B}from"./index.6891d53f.js";import{S as T}from"./index.59b8fbad.js";import"./index.4cc837d4.js";import"./context.aa52cc0c.js";import"./index.4e624168.js";import"./BaseInput.01760c9b.js";import"./useLocale.07149357.js";import"./UpOutlined.722986ed.js";import"./List.6e377c69.js";import"./PurePanel.bec90387.js";import"./CheckOutlined.363c4795.js";import"./chatGpt.0470686f.js";import"./LanguageList.5e03f3ce.js";import"./CodeEditorConfig.c1285810.js";import"./index.05a8036e.js";import"./Highlight.c2b7293d.js";import"./recordStates.a45efd0a.js";import"./index.699f9875.js";import"./Dropdown.acaf0b68.js";import"./SwapRightOutlined.64619f65.js";import"./fade.9766c3a1.js";import"./useClosable.e9e9bb76.js";import"./ActionButton.76c967e9.js";const D={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M518.3 459a8 8 0 00-12.6 0l-112 141.7a7.98 7.98 0 006.3 12.9h73.9V856c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V613.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 459z"}},{tag:"path",attrs:{d:"M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0152.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7a123.07 123.07 0 01-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z"}}]},name:"cloud-upload",theme:"outlined"};var U=function(e,r){return t(a,{...e,ref:r,icon:D})};const A=e.exports.forwardRef(U),G={title:"",description:"",time_limit:"",time_unit:"",memory_limit:"",memory_unit:"",input:"",output:"",sample_case:{input:"",output:""},test_case:{input:"",output:""},hint:"",source:""};let Q=G;const $=a=>{const{form:o}=a,{Option:i}=v;e.exports.useEffect((()=>{Q=localStorage.getItem("problemForm")?JSON.parse(localStorage.getItem("problemForm")):G,o.setFieldsValue(Q)}),[]);const n=(e,t)=>{o.setFieldValue(t,e)};return r(x,{form:o,name:"problemForm",layout:"vertical",onValuesChange:()=>{const e=o.getFieldsValue();localStorage.setItem("problemForm",JSON.stringify(e))},scrollToFirstError:!0,children:[t(x.Item,{name:"title",label:"标题",rules:[{required:!0}],children:t(S,{})}),t(x.Item,{name:"description",label:"描述",rules:[{required:!0}],children:t(b,{mode:"markdown",htmlChange:e=>n(e,"description"),defaultHtml:Q.description})}),t(x.Item,{label:"限制",name:"limit",rules:[{required:!0}],children:r(j,{gutter:12,children:[t(C,{span:12,children:t(x.Item,{name:"time_limit",noStyle:!0,rules:[{required:!0}],children:t(y,{min:1,placeholder:"时间限制",addonAfter:t(x.Item,{name:"time_unit",rules:[{required:!0}],noStyle:!0,children:r(v,{placeholder:"请选择",style:{width:80},children:[t(i,{value:"s",children:"s"}),t(i,{value:"ms",children:"ms"})]})})})})}),t(C,{span:12,children:t(x.Item,{name:"memory_limit",noStyle:!0,rules:[{required:!0}],children:t(y,{min:1,placeholder:"空间限制",addonAfter:t(x.Item,{name:"memory_unit",rules:[{required:!0}],noStyle:!0,children:r(v,{placeholder:"请选择",style:{width:80},children:[t(i,{value:"kb",children:"kb"}),t(i,{value:"mb",children:"mb"}),t(i,{value:"gb",children:"gb"})]})})})})})]})}),t(x.Item,{name:"input",label:"输入格式",rules:[{required:!0}],children:t(b,{mode:"markdown",defaultHtml:Q.input,htmlChange:e=>n(e,"input")})}),t(x.Item,{name:"output",label:"输出格式",rules:[{required:!0}],children:t(b,{mode:"markdown",defaultHtml:Q.output,htmlChange:e=>n(e,"output")})}),t(x.Item,{label:"示例",required:!0,children:r(j,{gutter:16,children:[t(C,{span:12,children:t(x.Item,{name:["sample_case","input"],noStyle:!0,rules:[{required:!0}],children:t(_,{placeholder:"input",autoSize:!0})})}),t(C,{span:12,children:t(x.Item,{name:["sample_case","output"],noStyle:!0,rules:[{required:!0}],children:t(_,{placeholder:"output",autoSize:!0})})})]})}),t(x.List,{name:"sample_case_expand",children:(e,{add:a,remove:o},{errors:i})=>r(s,{children:[e.map(((e,a,s)=>t(x.Item,{colon:!1,label:t(I,{className:"dynamic-delete-button",onClick:()=>o(e.name)}),children:t(x.Item,{noStyle:!0,children:r(j,{gutter:16,children:[t(C,{span:12,children:t(x.Item,{name:[a,"input"],noStyle:!0,children:t(_,{placeholder:"input",autoSize:!0})})}),t(C,{span:12,children:t(x.Item,{name:[a,"output"],noStyle:!0,children:t(_,{placeholder:"output",autoSize:!0})})})]})})},e.key))),t(x.Item,{colon:!1,style:{width:"100%"},children:t(l,{className:"text-slate-500",type:"dashed",onClick:()=>a(),style:{width:"100%"},icon:t(k,{}),children:"示例"})})]})}),t(x.Item,{label:"用例",required:!0,children:r(j,{gutter:16,children:[t(C,{span:12,children:t(x.Item,{noStyle:!0,name:["test_case","input"],rules:[{required:!0}],children:t(_,{placeholder:"input",autoSize:!0})})}),t(C,{span:12,children:t(x.Item,{noStyle:!0,name:["test_case","output"],rules:[{required:!0}],children:t(_,{placeholder:"output",autoSize:!0})})})]})}),t(x.List,{name:"test_case_expand",children:(e,{add:a,remove:o},{errors:i})=>r(s,{children:[e.map(((e,a,s)=>t(x.Item,{colon:!1,label:t(I,{className:"dynamic-delete-button",onClick:()=>o(e.name)}),children:t(x.Item,{noStyle:!0,children:r(j,{gutter:16,children:[t(C,{span:12,children:t(x.Item,{noStyle:!0,name:[a,"input"],rules:[{required:!0}],children:t(_,{placeholder:"input",autoSize:!0})})}),t(C,{span:12,children:t(x.Item,{noStyle:!0,name:[a,"output"],rules:[{required:!0}],children:t(_,{placeholder:"output",autoSize:!0})})})]})})},e.key))),t(x.Item,{colon:!1,children:t(l,{className:"text-slate-500",type:"dashed",onClick:()=>a(),style:{width:"100%"},icon:t(k,{}),children:"用例"})})]})}),t(x.Item,{name:"hint",label:"提示",children:t(b,{mode:"markdown",defaultHtml:Q.hint,htmlChange:e=>n(e,"hint")})}),t(x.Item,{name:"source",label:"来源",children:t(b,{mode:"markdown",defaultHtml:Q.source,htmlChange:e=>n(e,"source")})})]})},K="_label_1hjvm_1",W="_craeteProblem_1hjvm_11",X="_main_1hjvm_21",Y="_stepsBox_1hjvm_32",Z="_steps_1hjvm_32",ee="_uploadBtnPar_1hjvm_60",te="_uploadbtnBox_1hjvm_60",ae=a=>{const{setcode1:s,setcode2:l,programMode:i,setprogramMode:n,setcodeLanguage:d}=a;return e.exports.useEffect((()=>{const e=localStorage.getItem("code1"),t=localStorage.getItem("code2");s(e||""),l(t||"")}),[]),r(o,{direction:"vertical",className:"w-full",children:[r("div",{children:[t("p",{className:K,children:"类型"}),t(F.Group,{defaultValue:"standard",optionType:"button",onChange:e=>{n(e.target.value)},options:[{label:t("div",{children:"标准程序"}),value:"standard"},{label:t("div",{children:"特判程序"}),value:"special_judge"},{label:t("div",{children:"标准Hack程序"}),value:"standardHack"},{label:t("div",{children:"特判Hack程序"}),value:"specialHack"}]})]}),t("p",{className:K,children:"程序"}),r(e.exports.Fragment,{children:[("specialHack"===i||"standardHack"===i)&&r("div",{className:"flex items-center my-2",children:[t("div",{className:"serial",children:"1"}),t("div",{children:" 创建标准程序"})]}),t(w,{oj:"",value:localStorage.getItem("code1")?localStorage.getItem("code1"):"",codeChange:e=>{s(e),localStorage.setItem("code1",e)},height:512,onLanguageChange:e=>d(e)})]}),("specialHack"===i||"standardHack"===i)&&r(e.exports.Fragment,{children:[r("div",{className:"flex items-center my-2",children:[t("div",{className:"serial",children:"2"}),t("div",{children:" 创建输入检测程序"})]}),t(w,{oj:"",value:localStorage.getItem("code2")?localStorage.getItem("code2"):"",codeChange:e=>{l(e),localStorage.setItem("code2",e)},height:512})]}),t("div",{className:"h-8"})]})},re=e=>{const{originNode:a,name:l,status:o,message:d}=e,c=i(n),m="error"===o?c.colorError:"done"===o?c.colorSuccess:"";return t("div",{children:a?r("div",{className:"flex justify-between items-end",children:[t("span",{children:a}),t("span",{style:{color:m,fontSize:"0.75rem"},children:d||""})]}):r(s,{children:[t("span",{children:l||""}),t("span",{children:d||""}),t("span",{children:o||""})]})})},se=a=>{const{openUploadModal:s,setOpenUploadModal:o}=a,[c,m]=e.exports.useState([]),[p,u]=e.exports.useState(0),[h,g]=e.exports.useState(0),f=e.exports.useMemo((()=>Math.ceil(h/p*100)),[p,h]),b=i(n);e.exports.useEffect((()=>{}),[h,p,f]);const S=async(e,t,a)=>{t&&p!==t.length&&u(t.length),a&&p!==a&&u(a);const r=await d.formatProblemJson(e),{data:{code:s,data:l,msg:o}}=await O(JSON.stringify(r));return 200===s&&_(l),g((e=>e+1)),m((t=>[...t,{uid:e.uid,name:e.name,status:200===s?"done":"error",originFileObj:e,message:o||""}])),!1},_=async e=>{const{description:t,id:a}=e,r=t.replace(/<[^<>]+>/g,""),s=await V(r.slice(0,50)),{code:l,data:{tagCount:o}}=s.data;if(200===l)for(let i of o){await H(a,i.Tag)}},x=()=>{const e=[...c];u(e.length),g(0),m([]);for(let t of e)"error"===t.status&&t.originFileObj&&S(t.originFileObj,void 0,e.length)};return t(P,{title:"上传题目文件",open:s,onClose:()=>{o(!1),m([])},footer:t("div",{children:(()=>{let e=0;const a=[];return c.forEach((t=>"error"===t.status&&e++)),e&&a.push(t(l,{onClick:x,children:"重新上传错误文件"},"btn1")),a})().map((e=>e))}),maskClosable:!1,width:512,keyboard:!1,children:t(E,{maxCount:100,showUploadList:{showDownloadIcon:!1,showRemoveIcon:!1,showPreviewIcon:!1},height:200,fileList:c,multiple:!0,directory:!0,onRemove:e=>{const t=c.findIndex((t=>t.uid===e.uid)),a=c.slice();a.splice(t,1),m(a)},beforeUpload:S,onDrop:()=>{m([])},itemRender:(e,a)=>{const r={...a};return t(re,{originNode:e,message:r.message,status:a.status})},onChange:e=>{},children:0!==h?t(J,{strokeColor:{"0%":"","100%":b.colorSuccess},type:"circle",percent:f}):r("div",{className:"p-2",children:["点击或拖拽",t("br",{}),"批量上传外站题目.json文件"]})})})},le=["test_input","test_output","sample_input","sample_output"],oe=()=>{const a=i(c),[n,d]=m(),b=e.exports.useRef(n.get("id")),[S,_]=e.exports.useState(),[y,v]=e.exports.useState("process"),j=p(),[C]=x.useForm(),[I,k]=e.exports.useState("C++11"),[w,F]=e.exports.useState(""),[O,E]=e.exports.useState(""),[P,J]=e.exports.useState(!1),[D,U]=e.exports.useState(!1),[G,Q]=e.exports.useState("standard"),[K,re]=e.exports.useState(0),[oe,ie]=e.exports.useState(),[ne,de]=e.exports.useState(!1);e.exports.useState(!1);const[ce,me]=u(h),pe=i(g),{token:ue}=f.useToken();e.exports.useEffect((()=>{b.current&&q(b.current).then((e=>{const t=e.data.data.problem;_(t)}))}),[]),e.exports.useEffect((()=>{}),[K,y]);const he=e.exports.useCallback((()=>{C.validateFields().then((()=>{localStorage.setItem("problemForm",JSON.stringify(C.getFieldsValue())),re((e=>e+1))})).catch((()=>{pe&&pe.warning({message:"请完善表单！"})}))}),[C]),ge=e.exports.useCallback((async()=>{const e=JSON.stringify({language:I,code:w}),t=JSON.stringify({language:I,code:O});if("standard"===G||"special_judge"===G){const t=await N(e);if(200!==t.data.code)return void(pe&&pe.warning({message:t.data.msg}));const a=t.data.data.program.id;"standard"===G?C.setFieldValue("standard",a):C.setFieldValue("special_judge",a)}else{const a=await Promise.all([N(e),N(t)]);if(200!==a[0].data.code)return void(pe&&pe.warning({message:a[0].data.msg}));const r=a[0].data.data.program.id,s=a[1].data.data.program.id;"standardHack"===G?C.setFieldValue("standard",r):C.setFieldValue("special_judge",r),C.setFieldValue("input_check",s)}fe()}),[w,O,G,C,I]),fe=async()=>{const e={...C.getFieldsValue(!0)};Object.keys(e).forEach((t=>{var a,r;"sample_case"===t&&((null==(a=e.sample_case_expand)?void 0:a.length)>0?e[t]=[e[t],...e.sample_case_expand]:e[t]=[e[t]]),"test_case"===t&&((null==(r=e.test_case_expand)?void 0:r.length)>0?e[t]=[e[t],...e.test_case_expand]:e[t]=[e[t]]),"string"!=typeof e[t]&&"sample_case"!==t&&"test_case"!==t&&(e[t]=JSON.stringify(e[t])),le.includes(t)&&(e[t]=e[t].split(" ")),["memory_limit","time_limit"].includes(t)&&(e[t]=Number(e[t]))})),delete e.sample_case_expand,delete e.test_case_expand;const t=await M(JSON.stringify(e));re((e=>e+1)),200===t.data.code?(v("finish"),me(t.data.data.problem)):(ie(t.data.msg),v("error"))},be=()=>{switch(K){case 0:he();break;case 1:ge();break;case 2:j(`/problem/${null==ce?void 0:ce.id}`)}},Se=e.exports.useCallback((()=>{let e=0;z(1,10).then((e=>e.data.data.total)).then((async t=>{for(;e<=t+1;){const t=(await z(e,1)).data.data.problems;for(let e of t){if((await L(e.id)).data.data.problemLabels.length<=2){const t=e.description.replace(/<[^<>]+>/g,""),a=(await V(t.slice(0,50))).data.data.tagCount;for(let r of a){await H(e.id,r.Tag)}}}e++}})).catch((e=>{}))}),[]),_e=()=>r("div",{className:Y,style:{backgroundColor:ue.colorBgBase},children:[t(T,{size:"small",className:Z,direction:a?"horizontal":"vertical",progressDot:!0,status:y,current:K,items:[{title:"题目",description:""},{title:"程序",description:""},{title:"结果",description:""}]}),t("div",{className:ee,children:t("div",{className:te,children:t(l,{type:"dashed",style:{height:"6rem",width:"6rem"},onClick:()=>J(!0),children:t(A,{style:{fontSize:"3rem"}})})})})]});return r("div",{className:W,children:[a&&_e(),r("div",{className:X,children:[0===K&&t($,{form:C}),1===K&&t(ae,{codeLanguage:I,setcode1:F,setcode2:E,programMode:G,setprogramMode:Q,setcodeLanguage:k}),2===K&&r(s,{children:["finish"===y&&t(R,{status:"success",title:"题目创建成功！",extra:[t(l,{type:"primary",onClick:()=>{re(0),v("process")},children:"继续创建下一题"},"0"),t(l,{type:"primary",onClick:be,children:"查看题目详情"},"1")]}),"error"===y&&t(R,{status:"error",title:oe,extra:[t(l,{onClick:()=>{re(1),v("process")},children:'返回“创建程序"'},"2"),t(l,{onClick:()=>{re(0),v("process")},children:'返回“创建题目"'},"1")]})]}),"process"===y&&r("div",{className:"text-end",children:[0===K&&t(l,{type:"primary",onClick:()=>be(),children:"下一步"}),1===K&&r(o,{children:[t(l,{onClick:()=>{re((e=>e-1))},children:"上一步"}),t(l,{type:"primary",onClick:()=>be(),loading:ne,children:"下一步"})]})]})]}),t("div",{className:"w-16"}),!a&&_e(),t(se,{openUploadModal:P,setOpenUploadModal:J}),t(B,{title:"自动创建标签",open:D,footer:[],onCancel:()=>U(!1),style:{translate:"0 50%"},children:t(l,{onClick:Se,children:"自动创建标签"})})]})};export{oe as default};