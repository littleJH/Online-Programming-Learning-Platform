import{m as e,d as a,cb as s,_ as o,bG as l,a as t,j as r,M as m,bE as n}from"./index.5c064301.js";import{s as d}from"./style.module.9ce82fca.js";import{C as i}from"./index.9225dd62.js";import{S as c}from"./index.edecf03d.js";import"./Skeleton.ed2cb458.js";import"./PlusOutlined.787b1bb7.js";import"./Dropdown.acaf0b68.js";const u=()=>{var u;const b=e.useNavTo(),f=a(s),j=o.exports.useMemo((()=>l.getPathArray(f)[1]),[f]);return t(i,{title:r("div",{className:"flex items-center",children:[t(m,{href:"recommand",size:2}),t("span",{className:"ml-2",children:`${null==(u=p.find((e=>e.value===j)))?void 0:u.label}比赛`})]}),extra:t(c,{defaultValue:j,options:p,onChange:e=>{b(`/competition/${e}${"common"===e?"/set":""}`)}}),className:d.root,children:t(n,{})})},p=[{value:"common",label:"普通"},{value:"random",label:"及时"},{value:"standard",label:"标准"}];export{u as default};
