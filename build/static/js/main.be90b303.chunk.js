(this.webpackJsonpurl_app=this.webpackJsonpurl_app||[]).push([[0],{48:function(e){e.exports=JSON.parse('{"Doesn\'t exist":"Doesn\'t exist","d2tgrthycnydha.cloudfront.net.":"EU - AEM RC","d7jfzlujcu3eu.cloudfront.net.":"EU - AEM RC","d3mn2vqiz3ym21.cloudfront.net.":"EU - AEM staging","d99wsl52rc9kd.cloudfront.net.":"EU - AEM Tech prod","djt946bb0danl.cloudfront.net.":"EU - AEM Public prod","dh80sbhfv2zfi.cloudfront.net.":"EU - AEM Public prod","qr-staging-lingyun.aptamil.lyuncloud.com.":"CN - AEM staging","danone-stage64china-elb1cnnorth1-950695756.cn-north-1.elb.amazonaws.com.cn.":"CN - AEM staging","danone-prod64-china-elb1cnnorth1-208829668.cn-north-1.elb.amazonaws.com.cn.":"CN - AEM Tech prod","danone.lyuncloud.com.":"CN - AEM Public prod"}')},56:function(e,t,n){},57:function(e,t,n){},58:function(e,t,n){},67:function(e,t){},69:function(e,t){},86:function(e,t,n){"use strict";n.r(t);var a,r=n(0),s=n.n(r),i=n(10),o=n.n(i),c=(n(56),n(57),n(58),n(50)),l=n(31),h=n(17),d=n(18),u=n(8),p=n(20),j=n(19),m=n(26),b=n(11),v=n(49),f=n(9),g=n(51),O=n(6),x=n.n(O),C=n(12),y=n(32),k=n(47),S=n.n(k),E={_randomstring:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n="",a="0123456789";t&&(a+="ABCDEFGHIJKLMNOPQRSTUVWXYZ");for(var r=a.length,s=0;s<e;s++)n+=a.charAt(Math.floor(Math.random()*r));return n},getRandomSGTIN:function(){return this._randomstring(3,!1)},_removeDomainProtocol:function(e){return e.includes("https://")?e=e.replace("https://",""):e.includes("http://")&&(e=e.replace("http://","")),"/"===e.slice(e.length-1)&&(e=e.slice(0,-1)),e}},w=n(2),F=n(33),L=n(61),D="Doesn't exist",P="Unknown server",R=function(e){Object(p.a)(n,e);var t=Object(j.a)(n);function n(e){var a;return Object(h.a)(this,n),(a=t.call(this,e)).state={updateInProgress:!1,sgtin:E.getRandomSGTIN()},a.state={url:e.domain+"/"+a.state.sgtin},a}return Object(d.a)(n,[{key:"componentDidUpdate",value:function(){!this.props.update||this.state.updateInProgress||this.state.cname||(this.setState({updateInProgress:!0}),this.getDNSDetails(this.props.domain))}},{key:"dnsExist",value:function(){var e=Object(C.a)(x.a.mark((function e(t){return x.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,n){t=E._removeDomainProtocol(t),F("https://dns.google/resolve?name="+t).then((function(e){return e.json()})).then((function(t){if(t.Answer){var a=t.Answer[0].data;e(a)}n(t)})).catch((function(e){console.log(e),n(e)}))})));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"getSSLExpiryDate",value:function(){var e=Object(C.a)(x.a.mark((function e(t){return x.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,n){t=E._removeDomainProtocol(t),L.get(t).then((function(t){e(t.valid_to)})).catch((function(e){console.log("SSL domain for "+t,e),n(e)}))})));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"getRedirect",value:function(){var e=Object(C.a)(x.a.mark((function e(t){return x.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,n){F(t,{method:"GET"}).then((function(t){e(t.url)})).catch((function(e){console.log("getRedirect err",t,e),n(e)}))})));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"getDNSDetails",value:function(){var e=Object(C.a)(x.a.mark((function e(t){var n,a,r;return x.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={},e.prev=1,e.next=4,this.dnsExist(t);case 4:a=e.sent,this.setState({cname:a}),r=this.props.cnameMapping[a]?this.props.cnameMapping[a]:P,this.setState({server:r}),n[E._removeDomainProtocol(t)]=a+" "+r,this.props.parentCallback(n),e.next=18;break;case 12:e.prev=12,e.t0=e.catch(1),this.setState({cname:D}),n[E._removeDomainProtocol(t)]=D,this.props.parentCallback(n),console.log(t+": Error",e.t0);case 18:case"end":return e.stop()}}),e,this,[[1,12]])})));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=E._removeDomainProtocol(this.props.domain),t="";this.state.server===P&&(t="warningCell"),this.state.cname===D&&(t="errorCell");var n=Object(w.jsx)("td",{className:t,children:this.state.cname});return"server"in this.state&&(n=Object(w.jsxs)("td",{className:t,children:[this.state.cname,Object(w.jsx)("br",{}),this.state.server]})),this.props.display?Object(w.jsxs)("tr",{children:[Object(w.jsx)("td",{children:this.props.site}),Object(w.jsx)("td",{children:this.props.environment}),Object(w.jsx)("td",{children:e}),n,Object(w.jsx)("td",{children:this.state.SSLExpiryDate}),Object(w.jsx)("td",{children:this.state.redirectWithoutSGTIN}),Object(w.jsx)("td",{children:this.state.redirectWithSGTIN})]}):null}}]),n}(s.a.Component),U=n.p+"static/media/Rolex_URL_working_copy.2730ce6d.csv",M=n(48),N=n(33),T=function(e){Object(p.a)(n,e);var t=Object(j.a)(n);function n(e){var a;return Object(h.a)(this,n),(a=t.call(this,e)).state={domainsToCnames:{}},a.handleCallback=a.handleCallback.bind(Object(u.a)(a)),a}return Object(d.a)(n,[{key:"handleCallback",value:function(e){var t=Object(y.a)(Object(y.a)({},this.state.domainsToCnames),e);this.setState({domainsToCnames:t})}},{key:"getURLs",value:function(){var e=Object(C.a)(x.a.mark((function e(){var t;return x.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.readCSV();case 2:for(a=e.sent,t=0;t<a.length;t++)a[t].update=!1;this.setState({urls:a});case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"readCSV",value:function(){var e=Object(C.a)(x.a.mark((function e(){return x.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",N(U).then((function(e){return e.text()})).then((function(e){return S.a.parse(e,{header:!0,skipEmptyLines:!0}).data})));case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){this.getURLs()}},{key:"URLisFiltered",value:function(e){if(this.props.siteFilter.length>0&&!e.Brand.toLowerCase().includes(this.props.siteFilter.toLowerCase()))return!0;if(this.props.environmentFilter.length>0&&!e.Environment.toLowerCase().includes(this.props.environmentFilter.toLowerCase()))return!0;if(this.props.domainFilter.length>0&&!e.URL.toLowerCase().includes(this.props.domainFilter.toLowerCase()))return!0;var t=E._removeDomainProtocol(e.URL);return this.props.cnameFilter.length>0&&(!(t in this.state.domainsToCnames)||!this.state.domainsToCnames[t].toLowerCase().includes(this.props.cnameFilter.toLowerCase()))}},{key:"render",value:function(){var e=this;if(!this.state||!("urls"in this.state)||this.state.urls.length<1)return Object(w.jsx)(m.a,{children:Object(w.jsx)(b.a,{sm:4,children:"No URLs provided."})});var t=this.state.urls.map((function(t){var n=e.props.update,a=!0;return e.URLisFiltered(t)&&(n=!1,a=!1),Object(w.jsx)(R,{site:t.Brand,environment:t.Environment,domain:t.URL,cnameMapping:M,update:n,display:a,parentCallback:e.handleCallback},t.URL)}));return Object(w.jsx)("tbody",{children:t})}}]),n}(s.a.Component),A=function(e){Object(p.a)(n,e);var t=Object(j.a)(n);function n(e){var a;return Object(h.a)(this,n),(a=t.call(this,e)).handleURLsVerifications=a.handleURLsVerifications.bind(Object(u.a)(a)),a.handleFilterSiteChange=a.handleFilterSiteChange.bind(Object(u.a)(a)),a.handleFilterEnvironmentChange=a.handleFilterEnvironmentChange.bind(Object(u.a)(a)),a.handleFilterDomainChange=a.handleFilterDomainChange.bind(Object(u.a)(a)),a.handleFilterCnameChange=a.handleFilterCnameChange.bind(Object(u.a)(a)),a}return Object(d.a)(n,[{key:"handleKeyPress",value:function(e){"Enter"===e.key&&e.preventDefault()}},{key:"handleFilterSiteChange",value:function(e){this.setState({site:e.target.value,update:!1})}},{key:"handleFilterEnvironmentChange",value:function(e){this.setState({environment:e.target.value,update:!1})}},{key:"handleFilterDomainChange",value:function(e){this.setState({domain:e.target.value,update:!1})}},{key:"handleFilterCnameChange",value:function(e){this.setState({cname:e.target.value,update:!1})}},{key:"componentDidMount",value:function(){this.setState({site:"",environment:"",domain:"",update:!1})}},{key:"handleURLsVerifications",value:function(){this.setState({update:!0})}},{key:"render",value:function(){var e="";null!=this.state&&"site"in this.state&&(e=this.state.site);var t="";null!=this.state&&"environment"in this.state&&(t=this.state.environment);var n="";null!=this.state&&"domain"in this.state&&(n=this.state.domain);var a="";null!=this.state&&"cname"in this.state&&(a=this.state.cname);var r=!1;return null!=this.state&&"update"in this.state&&(r=this.state.update),Object(w.jsxs)(m.a,{children:[Object(w.jsx)(b.a,{sm:10}),Object(w.jsx)(b.a,{sm:2,children:Object(w.jsx)(g.a,{variant:"primary",onClick:this.handleURLsVerifications,className:"mt-2 mb-2",children:"Verify the URLs"})}),Object(w.jsx)(b.a,{sm:12,children:Object(w.jsxs)(v.a,{striped:!0,bordered:!0,hover:!0,responsive:!0,size:"sm",className:"stubLinks",children:[Object(w.jsxs)("thead",{children:[Object(w.jsxs)("tr",{children:[Object(w.jsx)("td",{children:"Site"}),Object(w.jsx)("td",{children:"Environment"}),Object(w.jsx)("td",{children:"Domain"}),Object(w.jsx)("td",{children:"CNAME"}),Object(w.jsx)("td",{children:"SSL expiry date"}),Object(w.jsx)("td",{children:"Redirect without SGTIN"}),Object(w.jsx)("td",{children:"Redirect with SGTIN"})]}),Object(w.jsxs)("tr",{children:[Object(w.jsx)("td",{children:Object(w.jsx)(f.a,{children:Object(w.jsx)(f.a.Control,{size:"sm",type:"text",placeholder:"Site",value:e,onChange:this.handleFilterSiteChange,onKeyPress:this.handleKeyPress})})}),Object(w.jsx)("td",{children:Object(w.jsx)(f.a,{children:Object(w.jsx)(f.a.Control,{size:"sm",type:"text",placeholder:"Envt",value:t,onChange:this.handleFilterEnvironmentChange,onKeyPress:this.handleKeyPress})})}),Object(w.jsx)("td",{children:Object(w.jsx)(f.a,{children:Object(w.jsx)(f.a.Control,{size:"sm",type:"text",placeholder:"Domain",value:n,onChange:this.handleFilterDomainChange,onKeyPress:this.handleKeyPress})})}),Object(w.jsx)("td",{children:Object(w.jsx)(f.a,{children:Object(w.jsx)(f.a.Control,{size:"sm",type:"text",placeholder:"CNAME & server",value:a,onChange:this.handleFilterCnameChange,onKeyPress:this.handleKeyPress})})}),Object(w.jsx)("td",{}),Object(w.jsx)("td",{}),Object(w.jsx)("td",{})]})]}),Object(w.jsx)(T,{siteFilter:e,environmentFilter:t,domainFilter:n,cnameFilter:a,update:r})]})})]})}}]),n}(s.a.Component);var _=function(){var e=Object(w.jsxs)(c.a,{fluid:!0,children:[Object(w.jsx)(l.a,{expand:"lg",variant:"dark",bg:"dark",children:Object(w.jsx)(l.a.Brand,{href:"#",children:"Rolex - URLs verification tool"})}),Object(w.jsx)(A,{})]});return o.a.render(e,document.getElementById("root"))},I=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,88)).then((function(t){var n=t.getCLS,a=t.getFID,r=t.getFCP,s=t.getLCP,i=t.getTTFB;n(e),a(e),r(e),s(e),i(e)}))};o.a.render(Object(w.jsx)(s.a.StrictMode,{children:Object(w.jsx)(_,{})}),document.getElementById("root")),I()}},[[86,1,2]]]);
//# sourceMappingURL=main.be90b303.chunk.js.map