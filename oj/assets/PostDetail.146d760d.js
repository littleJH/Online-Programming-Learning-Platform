import{c as a,aZ as t,cc as e,bM as o,ck as s,_ as d,bF as r,a as c}from"./index.5c064301.js";import{G as i}from"./GeneralDetail.d3509c96.js";import{s as l,c as m,g as n,a as p,e as u,f as j,h as k,i as f,l as b,j as x,k as y,m as h}from"./post.12635ac3.js";import"./Readonly.a9ebc692.js";import"./index.4cc837d4.js";import"./MyTag.a4f82d92.js";import"./useClosable.e9e9bb76.js";import"./context.aa52cc0c.js";import"./TextEditor.53774050.js";import"./RemarkCard.b0fdd9fd.js";import"./remark.4a43720f.js";import"./style.module.dc2582af.js";import"./index.9225dd62.js";import"./Skeleton.ed2cb458.js";import"./PlusOutlined.787b1bb7.js";import"./Dropdown.acaf0b68.js";import"./style.module.6da86900.js";import"./index.ec27075f.js";import"./List.6e377c69.js";import"./communityStore.399498c1.js";import"./UserInfo.2df9e32c.js";import"./MyAvatar.22457dcc.js";import"./message.856d7a68.js";import"./WomanOutlined.2213c8b5.js";import"./row.e491f7a6.js";import"./index.77ceaa6f.js";import"./index.6891d53f.js";import"./ActionButton.76c967e9.js";import"./useLocale.07149357.js";import"./fade.9766c3a1.js";import"./PurePanel.bec90387.js";import"./index.7d75d2c2.js";import"./index.4e624168.js";import"./BaseInput.01760c9b.js";import"./index.79a1b64c.js";const C=a({baseURL:"thread"}),w=(a,t=1,e=20)=>C.get(`/list/${a}?pageNum=${t}&pageSize=${e}`),N=()=>{const{post_id:a=""}=e(),[N,g]=o(s),[R,S]=d.exports.useState(""),[v,E]=d.exports.useState(!1);d.exports.useEffect((()=>()=>{g(null)}),[]),d.exports.useEffect((()=>{"number"!=typeof(null==N?void 0:N.likeNum)&&L(),l(a)}),[N]);const L=async()=>{const t=await Promise.all([m(a),n(a),p(a,"true"),u(a),j(a),k(a),f(a),w(a)]),e=t[0].data.data.post;e.liked=t[1].data.data.like,e.likeNum=t[2].data.data.total,e.collected=t[3].data.data.collect,e.collectNum=t[4].data.data.total,e.visibleNum=t[5].data.data.total,e.labels=t[6].data.data.postLabels,e.remark={remarks:t[7].data.data.threads,total:t[7].data.data.total};const o=await r(e.user_id);e.user=o.data.data.user,g(e)};return c(i,{currentObject:N,remarkContent:R,onRemarkChange:a=>S(a),openRemarkModal:v,onRemarkModalChange:a=>E(a),onArrowupClick:()=>{const a=document.createElement("a");a.href="#top",a.click()},onCollectClick:()=>{(null==N?void 0:N.collected)?h(a).then((async t=>{if(200===t.data.code&&N){const{data:t}=await j(a);g((a=>({...a,collected:!1,collectNum:t.data.total})))}})):y(a).then((async t=>{if(200===t.data.code&&N){const{data:t}=await j(a);g((a=>({...a,collected:!0,collectNum:t.data.total})))}}))},onCommentClick:()=>{const a=document.createElement("a");a.href="#remark",a.click()},onLikeClick:()=>{1===(null==N?void 0:N.liked)?x(a).then((async t=>{if(200===t.data.code&&N){const{data:t}=await p(a,"true");g((a=>({...a,liked:0,likeNum:t.data.total})))}})):b(a,"true").then((async t=>{if(200===t.data.code&&N){const{data:t}=await p(a,"true");g((a=>({...a,liked:1,likeNum:t.data.total})))}}))},onSubmitRemarkClick:()=>{var e,o;(e=a,o=JSON.stringify({content:R}),C.post(`/create/${e}`,o,t())).then((async t=>{if(200===t.data.code){E(!1),S("");const{data:t}=await w(a);g((a=>({...a,remark:{remarks:t.data.threads,total:t.data.total}})))}}))}})};export{N as default};