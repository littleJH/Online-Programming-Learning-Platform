import{Z as e,m as o,c as l,u as a}from"./index.4cc837d4.js";import{t,w as s,_ as r,j as d,a as c}from"./index.5c064301.js";let n=!1;const u=u=>{const{mode:m,value:i,htmlChange:f,placeholder:x,style:h,className:g,defaultHtml:p}=u,{token:b}=t.useToken(),y=s.useMemo((()=>h||{border:`1px solid ${b.colorBorder}`,borderRadius:b.borderRadius}),[h]);n||(e.registerModule(o),n=!0);const[C,k]=r.exports.useState(null),w={placeholder:x||"markdown here ...",autoFocus:!1};r.exports.useEffect((()=>()=>{C&&(C.destroy(),k(null))}),[C]);return d("div",{className:"h-full flex flex-col",style:{zIndex:100},children:["richtext"===m&&c(l,{editor:C,defaultConfig:{},mode:"default",className:"sticky top-0",style:{zIndex:1e3,boxShadow:b.boxShadowTertiary,backgroundColor:b.colorBgBase}}),c(a,{defaultConfig:w,defaultHtml:p,value:i,onCreated:k,onChange:e=>{f(e.getHtml())},mode:"default",style:{minHeight:"300px",flexGrow:"1",backgroundColor:b.colorBgBase,...y},className:g})]})};export{u as T};
