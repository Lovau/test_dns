(this.webpackJsonpurl_app=this.webpackJsonpurl_app||[]).push([[0],{48:function(e){e.exports=JSON.parse('{"Doesn\'t exist":"Doesn\'t exist","d2tgrthycnydha.cloudfront.net.":"EU - AEM RC","d7jfzlujcu3eu.cloudfront.net.":"EU - AEM RC","d3mn2vqiz3ym21.cloudfront.net.":"EU - AEM staging","d99wsl52rc9kd.cloudfront.net.":"EU - AEM Tech prod","djt946bb0danl.cloudfront.net.":"EU - AEM Public prod","dh80sbhfv2zfi.cloudfront.net.":"EU - AEM Public prod","qr-staging-lingyun.aptamil.lyuncloud.com.":"CN - AEM staging","danone-stage64china-elb1cnnorth1-950695756.cn-north-1.elb.amazonaws.com.cn.":"CN - AEM staging","danone-prod64-china-elb1cnnorth1-208829668.cn-north-1.elb.amazonaws.com.cn.":"CN - AEM Tech prod","danone.lyuncloud.com.":"CN - AEM Public prod"}')},56:function(e,t,n){},57:function(e,t,n){},58:function(e,t,n){},67:function(e,t){},69:function(e,t){},86:function(e,t,n){"use strict";n.r(t);var r,a=n(0),s=n.n(a),i=n(10),c=n.n(i),o=(n(56),n(57),n(58),n(50)),l=n(31),h=n(17),u=n(18),d=n(8),p=n(20),j=n(19),m=n(26),b=n(11),v=n(49),f=n(9),g=n(51),x=n(6),O=n.n(x),C=n(12),y=n(32),S=n(47),k=n.n(S),E={_randomstring:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n="",r="0123456789";t&&(r+="ABCDEFGHIJKLMNOPQRSTUVWXYZ");for(var a=r.length,s=0;s<e;s++)n+=r.charAt(Math.floor(Math.random()*a));return n},getRandomSGTIN:function(){return this._randomstring(3,!1)},_removeDomainProtocol:function(e){return e.includes("https://")?e=e.replace("https://",""):e.includes("http://")&&(e=e.replace("http://","")),"/"===e.slice(e.length-1)&&(e=e.slice(0,-1)),e}},w=n(2),L=n(33),F=(n(61),"Doesn't exist"),D="Unknown server",N="https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/dnslookup?DNS=",R="https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/getsslexpirydate?DNS=",U="https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/getredirect?URL=",P=function(e){Object(p.a)(n,e);var t=Object(j.a)(n);function n(e){var r;return Object(h.a)(this,n),(r=t.call(this,e)).state={updateInProgress:!1,sgtin:E.getRandomSGTIN()},r.state={url:e.domain+"/"+r.state.sgtin},r}return Object(u.a)(n,[{key:"componentDidUpdate",value:function(){!this.props.update||this.state.updateInProgress||this.state.cname||(this.setState({updateInProgress:!0}),this.getDNSDetails(this.props.domain))}},{key:"dnsExist",value:function(){var e=Object(C.a)(O.a.mark((function e(t){return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,n){L(N+t,{method:"GET"}).then((function(e){return e.json()})).then((function(t){return e(t.CNAME[0])})).catch((function(e){console.log("getDNS err",N+t,e),n(e)}))})));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"getSSLExpiryDate",value:function(){var e=Object(C.a)(O.a.mark((function e(t){return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,n){L(R+t,{method:"GET"}).then((function(e){return e.json()})).then((function(t){return e(t.daysRemaining)})).catch((function(e){console.log("getSSL err",R+t,e),n(e)}))})));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"getRedirect",value:function(){var e=Object(C.a)(O.a.mark((function e(t){return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,n){L(U+t,{method:"GET"}).then((function(e){return e.json()})).then((function(t){return e(t.redirect)})).catch((function(e){console.log("getRedirect err",U+t,e),n(e)}))})));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"getDNSDetails",value:function(){var e=Object(C.a)(O.a.mark((function e(t){var n,r,a,s,i,c;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={},e.prev=1,e.next=4,this.dnsExist(E._removeDomainProtocol(t));case 4:if(r=e.sent,this.setState({cname:r}),a=this.props.cnameMapping[r]?this.props.cnameMapping[r]:D,this.setState({server:a}),n[E._removeDomainProtocol(t)]=r+" "+a,this.props.parentCallback(n),!r){e.next=46;break}return e.prev=11,e.next=14,this.getSSLExpiryDate(E._removeDomainProtocol(t));case 14:s=e.sent,this.setState({SSLExpiryDate:s}),e.next=22;break;case 18:e.prev=18,e.t0=e.catch(11),this.setState({SSLExpiryDate:"Unable to get SSL"}),console.log(t+": Error",e.t0);case 22:return e.prev=22,e.next=25,this.getRedirect(t);case 25:(i=e.sent)===t+"/"&&(i="No redirection"),this.setState({redirectWithoutSGTIN:i}),e.next=34;break;case 30:e.prev=30,e.t1=e.catch(22),this.setState({redirectWithoutSGTIN:"Unable to get the redirection"}),console.log(t+": Error",e.t1);case 34:return e.prev=34,e.next=37,this.getRedirect(this.state.url);case 37:(c=e.sent)===this.state.url&&(c="No redirection"),this.setState({redirectWithSGTIN:c}),e.next=46;break;case 42:e.prev=42,e.t2=e.catch(34),this.setState({redirectWithSGTIN:"Unable to get the redirection"}),console.log(t+": Error",e.t2);case 46:e.next=54;break;case 48:e.prev=48,e.t3=e.catch(1),this.setState({cname:F}),n[E._removeDomainProtocol(t)]=F,this.props.parentCallback(n),console.log(t+": Error",e.t3);case 54:case"end":return e.stop()}}),e,this,[[1,48],[11,18],[22,30],[34,42]])})));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=E._removeDomainProtocol(this.props.domain),t="";this.state.server===D&&(t="warningCell"),this.state.cname===F&&(t="errorCell");var n=Object(w.jsx)("td",{className:t,children:this.state.cname});return"server"in this.state&&(n=Object(w.jsxs)("td",{className:t,children:[this.state.cname,Object(w.jsx)("br",{}),this.state.server]})),this.props.display?Object(w.jsxs)("tr",{children:[Object(w.jsx)("td",{children:this.props.site}),Object(w.jsx)("td",{children:this.props.environment}),Object(w.jsx)("td",{children:e}),n,Object(w.jsx)("td",{children:this.state.SSLExpiryDate}),Object(w.jsx)("td",{children:this.state.redirectWithoutSGTIN}),Object(w.jsx)("td",{children:this.state.redirectWithSGTIN})]}):null}}]),n}(s.a.Component),T=n.p+"static/media/Rolex_URL_working_copy.6d109af0.csv",M=n(48),I=n(33),A=function(e){Object(p.a)(n,e);var t=Object(j.a)(n);function n(e){var r;return Object(h.a)(this,n),(r=t.call(this,e)).state={domainsToCnames:{}},r.handleCallback=r.handleCallback.bind(Object(d.a)(r)),r}return Object(u.a)(n,[{key:"handleCallback",value:function(e){var t=Object(y.a)(Object(y.a)({},this.state.domainsToCnames),e);this.setState({domainsToCnames:t})}},{key:"getURLs",value:function(){var e=Object(C.a)(O.a.mark((function e(){var t;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.readCSV();case 2:for(r=e.sent,t=0;t<r.length;t++)r[t].update=!1;this.setState({urls:r});case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"readCSV",value:function(){var e=Object(C.a)(O.a.mark((function e(){return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",I(T).then((function(e){return e.text()})).then((function(e){return k.a.parse(e,{header:!0,skipEmptyLines:!0}).data})));case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){this.getURLs()}},{key:"URLisFiltered",value:function(e){if(this.props.siteFilter.length>0&&!e.Brand.toLowerCase().includes(this.props.siteFilter.toLowerCase()))return!0;if(this.props.environmentFilter.length>0&&!e.Environment.toLowerCase().includes(this.props.environmentFilter.toLowerCase()))return!0;if(this.props.domainFilter.length>0&&!e.URL.toLowerCase().includes(this.props.domainFilter.toLowerCase()))return!0;var t=E._removeDomainProtocol(e.URL);return this.props.cnameFilter.length>0&&(!(t in this.state.domainsToCnames)||!this.state.domainsToCnames[t].toLowerCase().includes(this.props.cnameFilter.toLowerCase()))}},{key:"render",value:function(){var e=this;if(!this.state||!("urls"in this.state)||this.state.urls.length<1)return Object(w.jsx)(m.a,{children:Object(w.jsx)(b.a,{sm:4,children:"No URLs provided."})});var t=this.state.urls.map((function(t){var n=e.props.update,r=!0;return e.URLisFiltered(t)&&(n=!1,r=!1),Object(w.jsx)(P,{site:t.Brand,environment:t.Environment,domain:t.URL,cnameMapping:M,update:n,display:r,parentCallback:e.handleCallback},t.URL)}));return Object(w.jsx)("tbody",{children:t})}}]),n}(s.a.Component),G=function(e){Object(p.a)(n,e);var t=Object(j.a)(n);function n(e){var r;return Object(h.a)(this,n),(r=t.call(this,e)).handleURLsVerifications=r.handleURLsVerifications.bind(Object(d.a)(r)),r.handleFilterSiteChange=r.handleFilterSiteChange.bind(Object(d.a)(r)),r.handleFilterEnvironmentChange=r.handleFilterEnvironmentChange.bind(Object(d.a)(r)),r.handleFilterDomainChange=r.handleFilterDomainChange.bind(Object(d.a)(r)),r.handleFilterCnameChange=r.handleFilterCnameChange.bind(Object(d.a)(r)),r}return Object(u.a)(n,[{key:"handleKeyPress",value:function(e){"Enter"===e.key&&e.preventDefault()}},{key:"handleFilterSiteChange",value:function(e){this.setState({site:e.target.value,update:!1})}},{key:"handleFilterEnvironmentChange",value:function(e){this.setState({environment:e.target.value,update:!1})}},{key:"handleFilterDomainChange",value:function(e){this.setState({domain:e.target.value,update:!1})}},{key:"handleFilterCnameChange",value:function(e){this.setState({cname:e.target.value,update:!1})}},{key:"componentDidMount",value:function(){this.setState({site:"",environment:"",domain:"",update:!1})}},{key:"handleURLsVerifications",value:function(){this.setState({update:!0})}},{key:"render",value:function(){var e="";null!=this.state&&"site"in this.state&&(e=this.state.site);var t="";null!=this.state&&"environment"in this.state&&(t=this.state.environment);var n="";null!=this.state&&"domain"in this.state&&(n=this.state.domain);var r="";null!=this.state&&"cname"in this.state&&(r=this.state.cname);var a=!1;return null!=this.state&&"update"in this.state&&(a=this.state.update),Object(w.jsxs)(m.a,{children:[Object(w.jsx)(b.a,{sm:10}),Object(w.jsx)(b.a,{sm:2,children:Object(w.jsx)(g.a,{variant:"primary",onClick:this.handleURLsVerifications,className:"mt-2 mb-2",children:"Verify the URLs"})}),Object(w.jsx)(b.a,{sm:12,children:Object(w.jsxs)(v.a,{striped:!0,bordered:!0,hover:!0,responsive:!0,size:"sm",className:"stubLinks",children:[Object(w.jsxs)("thead",{children:[Object(w.jsxs)("tr",{children:[Object(w.jsx)("td",{children:"Site"}),Object(w.jsx)("td",{children:"Environment"}),Object(w.jsx)("td",{children:"Domain"}),Object(w.jsx)("td",{children:"CNAME"}),Object(w.jsx)("td",{children:"SSL expiry date"}),Object(w.jsx)("td",{children:"Redirect without SGTIN"}),Object(w.jsx)("td",{children:"Redirect with SGTIN"})]}),Object(w.jsxs)("tr",{children:[Object(w.jsx)("td",{children:Object(w.jsx)(f.a,{children:Object(w.jsx)(f.a.Control,{size:"sm",type:"text",placeholder:"Site",value:e,onChange:this.handleFilterSiteChange,onKeyPress:this.handleKeyPress})})}),Object(w.jsx)("td",{children:Object(w.jsx)(f.a,{children:Object(w.jsx)(f.a.Control,{size:"sm",type:"text",placeholder:"Envt",value:t,onChange:this.handleFilterEnvironmentChange,onKeyPress:this.handleKeyPress})})}),Object(w.jsx)("td",{children:Object(w.jsx)(f.a,{children:Object(w.jsx)(f.a.Control,{size:"sm",type:"text",placeholder:"Domain",value:n,onChange:this.handleFilterDomainChange,onKeyPress:this.handleKeyPress})})}),Object(w.jsx)("td",{children:Object(w.jsx)(f.a,{children:Object(w.jsx)(f.a.Control,{size:"sm",type:"text",placeholder:"CNAME & server",value:r,onChange:this.handleFilterCnameChange,onKeyPress:this.handleKeyPress})})}),Object(w.jsx)("td",{}),Object(w.jsx)("td",{}),Object(w.jsx)("td",{})]})]}),Object(w.jsx)(A,{siteFilter:e,environmentFilter:t,domainFilter:n,cnameFilter:r,update:a})]})})]})}}]),n}(s.a.Component);var _=function(){var e=Object(w.jsxs)(o.a,{fluid:!0,children:[Object(w.jsx)(l.a,{expand:"lg",variant:"dark",bg:"dark",children:Object(w.jsx)(l.a.Brand,{href:"#",children:"Rolex - URLs verification tool"})}),Object(w.jsx)(G,{})]});return c.a.render(e,document.getElementById("root"))},z=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,88)).then((function(t){var n=t.getCLS,r=t.getFID,a=t.getFCP,s=t.getLCP,i=t.getTTFB;n(e),r(e),a(e),s(e),i(e)}))};c.a.render(Object(w.jsx)(s.a.StrictMode,{children:Object(w.jsx)(_,{})}),document.getElementById("root")),z()}},[[86,1,2]]]);
//# sourceMappingURL=main.d083c06e.chunk.js.map