import{c as e,aZ as a,b as s}from"./index.5c064301.js";const t=e({baseURL:"problem"}),$=(e,s=a())=>t.post("/create",e,s),g=e=>t.get(`/show/${e}`),l=e=>t.delete(`/delete/${e}`,s()),i=(e=1,a=20)=>t.get(`/list?pageNum=${e}&pageSize=${a}`),p=(e,a)=>t.get(`/like/number/${e}?like=${a}`),o=e=>t.get(`/like/show/${e}`,s()),b=e=>t.get(`/collect/show/${e}`,s()),c=e=>t.get(`/collect/number/${e}`),m=e=>t.get(`/visit/number/${e}`,s()),r=(e,a=1,s=20)=>t.get(`/search/${e}?pageNum=${a}&pageSize=${s}`),u=(e,a=1,s=20)=>t.get(`/search/label?pageNum=${a}&pageSize=${s}&labels=${e}`),h=(e,a,s=1,$=20)=>t.get(`/search/with/label/${e}?pageNum=${s}&pageSize=${$}&labels=${a}`),n=(e,a)=>t.post(`/label/${e}/${a}`,{},s()),d=e=>t.get(`/label/${e}`),z=(e,a=1,s=20)=>t.get(`/user/list/${e}?pageNum=${a}&pageSize=${s}`),N=e=>t.get(`/test/num/${e}`),S=e=>t.post("create/vjudge",e,a());export{d as a,N as b,o as c,l as d,p as e,b as f,z as g,c as h,m as i,i as j,r as k,u as l,h as m,n,$ as o,g as s,S as u};