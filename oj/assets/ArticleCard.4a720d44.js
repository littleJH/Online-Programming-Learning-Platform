import{t as e,j as a,F as t,a as l,S as r,D as i,M as o,bm as s,_ as n,bF as c,bG as d}from"./index.5c064301.js";import{a as m,b as h,c as _,e as u,f,h as x}from"./article.08f59da4.js";import{g as p}from"./remark.4a43720f.js";import{M as g}from"./MyTag.a4f82d92.js";import{M as v}from"./MyAvatar.22457dcc.js";import{C as y}from"./index.9225dd62.js";const k={remarkFooter:"_remarkFooter_xhyn3_1",message_right:"_message_right_xhyn3_15",message_left:"_message_left_xhyn3_31",generalCard:"_generalCard_xhyn3_47",tags:"_tags_xhyn3_50",footer:"_footer_xhyn3_59",imgctn:"_imgctn_xhyn3_69",IMCard:"_IMCard_xhyn3_84",header:"_header_xhyn3_89",inputBox:"_inputBox_xhyn3_107",cardBox:"_cardBox_xhyn3_115",cardBody:"_cardBody_xhyn3_115",navCard:"_navCard_xhyn3_123",icon:"_icon_xhyn3_127",title:"_title_xhyn3_132",desc:"_desc_xhyn3_136"},N=n=>{const{user:c,title:d,content:m,img:h,liked:_,collected:u,remarkCount:f,viewCount:x,labels:p,ago:y,onClick:N,header:C,footer:b,extra:w}=n,{token:j}=e.useToken();return a("div",{className:k.generalCard,onClick:N,children:[a("div",{className:"grow",style:{width:"100px"},children:[a("div",{className:"flex items-center",children:[c&&a(t,{children:[l(v,{user:c}),l("span",{className:"card-username",children:null==c?void 0:c.name})]}),y&&l("div",{className:"card-time",children:y}),p&&p.length>0&&l(r,{style:{margin:c||y?"0 1rem":"0"},align:"start",rootClassName:k.tags,children:p.map((e=>l(g,{children:e.label},e.id)))}),C&&l("div",{className:"grow flex justify-end",children:C})]}),a("div",{className:"card-title",children:["string"==typeof d&&d,"function"==typeof d&&d()]}),"string"==typeof m&&l("div",{className:"card-content",style:{width:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:m.replace(/<[^<>]+>/g,"")}),"function"==typeof m&&m(),"object"==typeof m&&m,l("div",{className:"flex items-center mt-2",children:a(r,{split:l(i,{type:"vertical"}),className:`${k.footer} grow flex items-center`,children:[u&&a("div",{children:[l(o,{href:(null==u?void 0:u.isCollected)?"#icon-collected":"#icon-collect",color:(null==u?void 0:u.isCollected)?j.colorPrimaryTextHover:j.colorTextDescription}),l("span",{children:null==u?void 0:u.count})]}),_&&a("div",{children:[l(o,{href:(null==_?void 0:_.isLiked)?"#icon-liked":"#icon-like",color:(null==_?void 0:_.isLiked)?j.colorPrimaryTextHover:j.colorTextDescription}),l("span",{children:null==_?void 0:_.count})]}),"number"==typeof f&&a("div",{children:[l(o,{href:"#icon-comment",color:j.colorTextDescription}),l("span",{children:f})]}),"number"==typeof x&&a("div",{children:[l(o,{href:"#icon-visible",color:j.colorTextDescription}),l("span",{children:x})]}),b&&l("div",{className:"grow flex justify-end",children:b})]})}),w&&l("div",{className:"p-4",children:w})]}),h&&l("div",{className:k.imgctn,children:l("img",{src:`${s}/${h}`,className:`${k.img}`,alt:""})})]})},C=r=>{const{articleProp:i,onclick:o,mode:s="default"}=r,[g,v]=n.exports.useState(i);e.useToken(),n.exports.useEffect((()=>{const e={...i};Promise.all([c(i.user_id),m(i.id),h(i.id,"true"),_(i.id),u(i.id),f(i.id),x(i.id),p(i.id)]).then((a=>{e.user=a[0].data.data.user,e.liked=a[1].data.data.like,e.likeNum=a[2].data.data.total,e.collected=a[3].data.data.collect,e.collectNum=a[4].data.data.total,e.visibleNum=a[5].data.data.total,e.labels=a[6].data.data.articleLabels,e.remark={remarks:a[7].data.data.remarks,total:a[7].data.data.total},v(e)}))}),[]);const k=n.exports.useMemo((()=>{const{num:e,unit:a}=d.getTimeAgo(g.created_at);return`${e}${a}前`}),[g]),C=n.exports.useMemo((()=>g.res_long&&""!==g.res_long&&JSON.parse(g.res_long).img),[g]),b=()=>{var e;return l(N,{user:g.user,content:g.content,title:g.title,img:C,ago:k,labels:g.labels,remarkCount:null==(e=g.remark)?void 0:e.total,liked:{count:g.likeNum,isLiked:g.liked},collected:{count:g.collectNum,isCollected:g.collected},viewCount:g.visibleNum})};return a(t,{children:["default"===s&&l(y,{onClick:()=>o&&o(g),className:"my-2",hoverable:!0,size:"small",children:b()}),"action"===s&&b()]})};export{C as A};