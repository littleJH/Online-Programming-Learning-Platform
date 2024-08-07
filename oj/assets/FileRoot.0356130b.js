import{_ as e,a as t,A as a,j as n,S as l,l as i,co as r,cz as c,c as o,b as s,bz as d,aZ as p,d as u,R as m,t as f,n as h,P as y,M as k,cn as v,bG as x,F as b}from"./index.5c064301.js";import{E as w,a as S}from"./index.a45f76a6.js";import{P as g}from"./PlusOutlined.787b1bb7.js";import{D as M}from"./index.699f9875.js";import{M as D}from"./index.6891d53f.js";import{I as C}from"./index.7d75d2c2.js";import{D as E}from"./Dragger.eac806ba.js";import{G as L}from"./GeneralTable.8195648c.js";import{C as _}from"./index.9225dd62.js";import{S as I}from"./index.edecf03d.js";import{R as N}from"./RedoOutlined.947dad1c.js";import"./context.aa52cc0c.js";import"./List.6e377c69.js";import"./PurePanel.bec90387.js";import"./index.4e624168.js";import"./useLocale.07149357.js";import"./CheckOutlined.363c4795.js";import"./Dropdown.acaf0b68.js";import"./ActionButton.76c967e9.js";import"./useClosable.e9e9bb76.js";import"./fade.9766c3a1.js";import"./BaseInput.01760c9b.js";import"./progress.2cf02846.js";import"./Table.f08b7a7b.js";import"./index.ec27075f.js";import"./index.4d9ca8d6.js";import"./Pagination.855f4d50.js";import"./Skeleton.ed2cb458.js";const R={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 000 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"}}]},name:"arrow-left",theme:"outlined"};var j=function(e,n){return t(a,{...e,ref:n,icon:R})};const z=e.exports.forwardRef(j);const F={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 000-48.4z"}}]},name:"arrow-right",theme:"outlined"};var T=function(e,n){return t(a,{...e,ref:n,icon:F})};const $=e.exports.forwardRef(T);const P={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M868 545.5L536.1 163a31.96 31.96 0 00-48.3 0L156 545.5a7.97 7.97 0 006 13.2h81c4.6 0 9-2 12.1-5.5L474 300.9V864c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V300.9l218.9 252.3c3 3.5 7.4 5.5 12.1 5.5h81c6.8 0 10.5-8 6-13.2z"}}]},name:"arrow-up",theme:"outlined"};var Y=function(e,n){return t(a,{...e,ref:n,icon:P})};const H=e.exports.forwardRef(Y);const W={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 00-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"}}]},name:"upload",theme:"outlined"};var U=function(e,n){return t(a,{...e,ref:n,icon:W})};const B=e.exports.forwardRef(U),A=e=>{const{onMkdir:a,onUpload:r}=e;return t(w,{image:t("svg",{children:t("use",{href:"#icon-nodata"})}),imageStyle:{height:"20rem",margin:"2rem 0"},description:"",children:n(l,{children:[t(i,{icon:t(B,{}),onClick:r,children:"上传文件"}),t(i,{icon:t(g,{}),onClick:a,children:"新建文件夹"})]})})},V={viewTypeState:r({key:"viewType",default:"list"}),fileListState:r({key:"fileList",default:[]}),backStackState:r({key:"backStack",default:[]}),forwardStackState:r({key:"forwardStack",default:["/"]}),currentPathState:r({key:"currentPath",default:"/"}),inputTextState:r({key:"inputText",default:""}),openUploadModalState:r({key:"openUploadModal",default:!1}),fileIconSizeState:r({key:"fileIconSize",default:75}),selectedFileState:r({key:"selectedFile",default:[]}),copyFileState:r({key:"copyFile",default:[]}),cutFileState:r({key:"cutFile",default:[]})},G=c({key:"fileStoreSelector",get:({get:e})=>({viewType:e(V.viewTypeState),fileList:e(V.fileListState),backStack:e(V.backStackState),forwardStack:e(V.forwardStackState),currentPath:e(V.currentPathState),inputText:e(V.inputTextState),openUploadModal:e(V.openUploadModalState),fileIconSize:e(V.fileIconSizeState),selectedFile:e(V.selectedFileState),copyFile:e(V.copyFileState),cutFile:e(V.cutFileState)})}),O="_bodyCtn_7vs9x_215",K="_tableCtn_7vs9x_224",Z="_listCtn_7vs9x_228",q="_listGridCtn_7vs9x_233",J="_listItem_7vs9x_242",Q="_fileItem_7vs9x_257",X="_ellipsisName_7vs9x_271",ee="_name_7vs9x_279",te=o({baseURL:"file",type:"file"}),ae=e=>te.get(`/download?path=${e}`,s()),ne=e=>te.delete(`/rm?id=${e}`,s()),le=a=>{const{file:i,fetchFileList:r,onlyMenu:c,onlyNew:o}=a,{viewType:d,copyFile:x,currentPath:b,fileList:w,fileIconSize:g,selectedFile:E,cutFile:L}=u(G),_=m(V.fileListState),I=m(V.backStackState),N=m(V.forwardStackState),R=m(V.currentPathState),j=m(V.inputTextState),z=m(V.selectedFileState),F=m(V.copyFileState),T=m(V.cutFileState),[$,P]=e.exports.useState(!1),Y=e.exports.useRef(null),H=e.exports.useRef(null),{token:W}=f.useToken(),U=u(h);e.exports.useEffect((()=>(H.current&&(H.current.focus(),H.current.setSelectionRange(0,i.name.length)),Y.current&&Y.current.addEventListener("contextmenu",A.handleContextMenu),()=>{Y.current&&Y.current.removeEventListener("contextmenu",A.handleContextMenu)})),[E]);const B=e.exports.useMemo((()=>"NEW_DIR"===i.type?"DIR":i.type.includes("RENAME")?i.type.replace("RENAME_",""):i.type),[i]),A={handleMakeDirectory:async(e,t)=>{if("NEW_DIR"===e){const e=w.findIndex((e=>e.name===t))<0?t:`${t}(1)`;try{await(l=b,c=e,te.put(`/mkdir?id=${l}${c}`,{},s()))}catch{}}else if(e.includes("RENAME"))try{await(a=i.path,n=t,te.put("/rename",{first:a,second:n},p()))}catch{}var a,n,l,c;r&&r()},handleClick:e=>{e.stopPropagation(),e.ctrlKey?z((e=>{const t=[...e],a=t.findIndex((e=>e.name===i.name));return a<0?[...e,i]:[...t.slice(0,a),...t.slice(a+1,t.length-1)]})):z([i])},handleDoubleClick:async e=>{if("dir"===i.type.toLowerCase()&&r){await r(i.path.replace(/\.\/file/g,""))&&(I([]),N((e=>[...e,i.path])),R(i.path))}else await ae("./file"+i.path)},handleContextMenu:e=>{e.preventDefault(),E.findIndex((e=>e.name===i.name))<0&&z([i])}},O=()=>t("div",{style:{maxWidth:"min-content"},children:[{label:"文件名",children:i.name,render:e=>e.replace(/\.[^.]+$/,"")},{label:"文件路径",children:i.path},{label:"文件大小",children:i.size},{label:"修改时间",children:i.lastWriteTime,render:e=>v(e).format("YYYY-MM-DD HH:mm:ss")},{label:"文件类型",children:i.type}].map((e=>n("p",{style:{fontSize:"0.9rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",margin:"0.5rem 0"},children:[t("span",{children:`${e.label}：`}),t("span",{children:`${e.render?e.render(e.children):e.children}`})]},e.label)))}),K=()=>[{key:"download",label:"下载",onclick:async()=>{await ae(i.path)}},{key:"copy",label:"复制",onclick:()=>{F([...E]),T([])}},{key:"cut",label:"剪切",onclick:()=>{T([...E]),F([])}},{key:"sticky",label:"粘贴",disabled:0===x.length&&0===L.length,onclick:async()=>{}},{key:"unzip",label:"解压",disabled:"zip"!==i.type.toLowerCase(),onclick:async()=>{try{200===(await(e=i.path,t=b,te.put("/unzip",{first:e,second:t},p()))).data.code&&await ne(i.path)}catch{}var e,t;r&&r()}},{key:"rename",label:"重命名",onclick:e=>{e.domEvent.stopPropagation();const t=[...w].map((e=>e.name===i.name?{...e,type:`RENAME_${i.type}`}:e));j(i.name),_(t),setTimeout((()=>{var e,t;null==(e=H.current)||e.focus(),null==(t=H.current)||t.setSelectionRange(0,i.name.length)}),0)}},{key:"detail",label:"详细信息",onclick:()=>{P(!0)}},{key:"delete",label:"删除",danger:!0,onclick:async()=>{for(let t of E){let a=null;try{a="dir"===t.type.toLowerCase()?(await(e=t.path,te.delete(`/all/rm?id=${e}`,s()))).data.code:(await ne(t.path)).data.code,200===a&&U&&U.success({message:`${t.name} 删除成功`})}catch{}}var e;r&&r()}}].map((e=>({key:e.key,label:t("span",{children:e.label}),danger:(null==e?void 0:e.danger)||!1,disabled:(null==e?void 0:e.disabled)||!1,onClick:t=>e.onclick(t)}))),Z=e=>t(C,{size:"small",ref:H,onPressEnter:t=>A.handleMakeDirectory(e,t.currentTarget.value),onBlur:t=>A.handleMakeDirectory(e,t.currentTarget.value),defaultValue:i.name});return n("div",{ref:Y,children:["list"===d&&t(y,{mouseEnterDelay:1,content:O(),children:t(M,{trigger:["contextMenu"],arrow:!1,placement:"bottom",menu:{items:K()},children:n("div",{id:"fileItem",className:Q,style:{backgroundColor:E.find((e=>e.name===i.name))?W.colorInfoBg:""},onDoubleClick:A.handleDoubleClick,onClick:A.handleClick,children:[t(k,{href:B,size:`${g}px`}),t("div",{className:E.find((e=>e.name===i.name))?ee:X,children:t("span",{children:i.type.includes("RENAME")||"NEW_DIR"===i.type?Z(i.type):i.name})})]})})}),o&&t("div",{children:Z("NEW_DIR")}),c&&t(M,{arrow:!1,placement:"bottom",menu:{items:K()},children:t("a",{onClick:e=>e.preventDefault(),style:{fontSize:"0.9rem"},children:n(l,{children:[t("span",{children:"操作"}),t(S,{})]})})}),t(D,{open:$,title:"文件信息",footer:[],onCancel:()=>P(!1),children:O()})]})},ie=()=>{const{viewType:a,fileList:r,currentPath:c,openUploadModal:o,fileIconSize:p,backStack:y,forwardStack:w,copyFile:S,cutFile:R}=u(G),j=m(V.viewTypeState),F=m(V.fileListState),T=m(V.backStackState),P=m(V.forwardStackState),Y=m(V.currentPathState),W=m(V.inputTextState),U=m(V.openUploadModalState),B=m(V.fileIconSizeState),Q=m(V.selectedFileState);m(V.copyFileState),m(V.cutFileState);const[X,ee]=e.exports.useState(0),ne=e.exports.useRef(null),ie=e.exports.useRef(null),{token:re}=f.useToken();u(h);const ce=e.exports.useMemo((()=>r.map((e=>({...e,key:`${e.path}/${e.name}`,action:""})))),[r]);e.exports.useEffect((()=>{var e,t;const a=null!=(t=null==(e=ie.current)?void 0:e.clientHeight)?t:0;ee(a-56)}),[a,r,c]),e.exports.useEffect((()=>{document.documentElement.style.setProperty("--file-item-width",p+"px")}),[p]),e.exports.useEffect((()=>(oe(),ne.current&&ne.current.addEventListener("wheel",pe,{passive:!1}),document.addEventListener("contextmenu",se),document.addEventListener("resize",de),()=>{document.removeEventListener("contextmenu",se),document.removeEventListener("resize",de)})),[]);const oe=async e=>{var t,a;try{const n=await(e=>te.get(`/path?id=${e}`,s()))(e||c);return F(200===n.data.code?null==(a=null==(t=n.data.data)?void 0:t.files)?void 0:a.map((e=>({...e,path:e.path.replace(/\.\/file/g,""),type:e.type.replace(/\./g,"").toUpperCase(),openMenu:!1}))):[]),Q([]),200===n.data.code}catch{return!1}},se=e=>{e.preventDefault()},de=()=>{var e,t;const a=null!=(t=null==(e=ie.current)?void 0:e.clientHeight)?t:0;ee(a-56)},pe=e=>{if(e.ctrlKey){e.preventDefault();const t=10;B((a=>e.deltaY>=0?a-t:a+t))}},ue=async(e,t)=>{const{type:a}=e;switch(a){case"contextmenu":break;case"dblclick":if("dir"===t.type.toLowerCase()&&oe){await oe(t.path.replace(/\.\/file/g,""))&&(T([]),P((e=>[...e,t.path])),Y(t.path))}else await ae("./file"+t.path)}},me=e=>{e.preventDefault();const t=document.getElementById("bodyCtn"),a=[];if("drop"===e.type)for(let n of e.dataTransfer.items)a.push(n);"dragleave"!==e.type&&"drop"!==e.type||t&&t.style.setProperty("border",`1px solid ${re.colorBorder}`),"dragenter"!==e.type&&"dragover"!==e.type||t&&t.style.setProperty("border",`2px dashed ${re.colorErrorBorderHover}`)};return n("div",{className:"w-full h-full flex items-center justify-center select-none",children:[t("div",{ref:ne,style:{width:"75%",height:"100%"},children:n(_,{title:"文件系统",style:{display:"flex",flexDirection:"column"},className:"w-full h-full",styles:{body:{flexGrow:1,display:"flex",flexDirection:"column"}},children:[n("div",{className:"flex justify-between items-center",children:[n(l,{style:{minWidth:"max-content"},children:[t(i,{disabled:1===w.length&&w.includes("/"),type:"text",onClick:async()=>{const e=[...w],t=e.pop();await oe(e[e.length-1])&&(P(e),T((e=>t?[...e,t]:[...e])),Y((t=>e[e.length-1]||t)),Q([]))},children:t(z,{style:{color:1===w.length&&w.includes("/")?"#ccc":""}})}),t(i,{disabled:0===y.length,type:"text",onClick:async()=>{const e=[...y],t=e.pop();await oe(t)&&(P((e=>t?[...e,t]:[...e])),T(e),Y((e=>t||e)),Q([]))},children:t($,{style:{color:y.length>0?"":"#ccc"}})}),t(i,{disabled:"/"===c,type:"text",onClick:async()=>{const e=x.getPathArray(c),t=e.slice(0,e.length-1).join("/");await oe(`/${t}`)&&(Y(`/${t}`),Q([]))},children:t(H,{style:{color:"/"!==c?"":"#ccc"}})}),t(i,{type:"text",onClick:()=>{oe()},children:t(N,{})}),t(M,{placement:"bottom",menu:{items:[{key:"new",label:"新建文件夹",onClick:()=>{W("新建文件夹"),F((e=>[...e,{name:"新建文件夹",path:c,type:"NEW_DIR",lastWriteTime:v().format("YYYY-MM-DD HH:mm:ss")}]))}},{key:"upload",label:"上传文件",onClick:()=>U(!0)}]},children:t(i,{type:"dashed",icon:t(g,{})})})]}),t("div",{className:"ml-8 mr-12 w-full",children:t(C,{prefix:"当前路径：",value:`${c}`,onChange:e=>Y(e.target.value),onPressEnter:()=>{oe()}})}),t(I,{options:[{label:"平铺",value:"list"},{label:"表格",value:"table"}],value:a,onChange:e=>j(e)})]}),n("div",{ref:ie,id:"bodyCtn",className:`${O}`,onClick:e=>{Q([]),F((e=>e.map((e=>({...e,openMenu:!1})))))},onDrop:me,onDragOver:me,onDragLeave:me,onDragEnter:me,children:["list"===a&&t("div",{className:Z,children:t("div",{className:q,children:r.map(((e,a)=>t("div",{id:`fileitem${a}`,className:J,children:t(le,{file:e,fetchFileList:oe})},e.path+e.name)))})}),"table"===a&&t("div",{className:K,children:t(L,{scroll:{y:X},dataSource:ce,onRow:e=>({onClick:t=>ue(t,e),onDoubleClick:t=>ue(t,e),onContextMenu:t=>ue(t,e)}),columns:[{title:"名称",dataIndex:"name",key:"name",render:(e,a)=>{return n("div",{className:"flex items-center",children:[t(k,{href:(l=a,"NEW_DIR"===l.type?"DIR":l.type.includes("RENAME")?l.type.replace("RENAME_",""):l.type),size:2}),t("span",{className:"ml-4",children:"NEW_DIR"===a.type?t(le,{file:a,onlyNew:!0}):e.replace(/\.[^.]+$/,"")})]});var l}},{title:"修改日期",dataIndex:"lastWriteTime",key:"lastWriteTime",width:200,render:e=>v(e).format("YYYY-MM-DD HH:mm:ss")},{title:"类型",dataIndex:"type",key:"type",width:100},{title:"大小",dataIndex:"size",key:"size",width:100,render:e=>x.formatFileSize(Number(e))},{title:"",dataIndex:"action",key:"action",width:80,render:(e,a)=>t(b,{children:"NEW_DIR"!==a.type&&t(le,{file:a,onlyMenu:!0})})}],emptyText:t(A,{onUpload:()=>U(!0),onMkdir:()=>{"table"===a&&F((e=>[...e,{name:"新建文件夹",path:c,type:"dir",lastWriteTime:v().format("YYYY-MM-DD HH:mm:ss")}]))}})})})]})]})}),t(D,{title:"上传文件/压缩包",open:o,onCancel:()=>U(!1),footer:[],style:{translate:"0 50%"},children:t("div",{className:"pt-8",children:t(E,{showUploadList:{showDownloadIcon:!1,showRemoveIcon:!1,showPreviewIcon:!1},height:200,beforeUpload:async(e,t)=>{const a=new FormData;a.append("file",e);let n=0;try{n=(await((e,t)=>te.post(`/upload?path=${e}`,t,d()))(c+"/",a)).data.code}catch{}return oe(),!1}})})})]})};export{ie as default};