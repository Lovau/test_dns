(this.webpackJsonpurl_app=this.webpackJsonpurl_app||[]).push([[0],{54:function(t,e,n){},55:function(t,e,n){},64:function(t,e){},66:function(t,e){},83:function(t,e,n){"use strict";n.r(e);var r,i=n(0),a=n.n(i),s=n(9),c=n.n(s),o=(n(54),n(55),n(48)),h=n(31),l=n(17),u=n(18),d=n(8),p=n(20),j=n(19),v=n(26),b=n(13),f=n(47),m=n(14),g=n(49),x=n(6),O=n.n(x),S=n(10),k=n(46),y=n.n(k),C=n(2),F=n(32),w=n(58),D=function(t){Object(p.a)(n,t);var e=Object(j.a)(n);function n(t){var r;return Object(l.a)(this,n),(r=e.call(this,t)).state={sgtin:r.getRandomSGTIN()},r.state={url:t.domain+"/"+r.state.sgtin},r}return Object(u.a)(n,[{key:"componentDidMount",value:function(){this.props.update&&!this.state.cname&&this.getDNSDetails(this.props.domain)}},{key:"componentDidUpdate",value:function(){this.props.update&&!this.state.cname&&this.getDNSDetails(this.props.domain)}},{key:"_randomstring",value:function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n="",r="0123456789";e&&(r+="ABCDEFGHIJKLMNOPQRSTUVWXYZ");for(var i=r.length,a=0;a<t;a++)n+=r.charAt(Math.floor(Math.random()*i));return n}},{key:"getRandomSGTIN",value:function(){return this._randomstring(3,!1)}},{key:"_removeDomainProtocol",value:function(t){return t.includes("https://")?t=t.replace("https://",""):t.includes("http://")&&(t=t.replace("http://","")),t}},{key:"dnsExist",value:function(){var t=Object(S.a)(O.a.mark((function t(e){var n=this;return O.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",new Promise((function(t,r){e=n._removeDomainProtocol(e),F("https://dns.google/resolve?name="+e).then((function(t){return t.json()})).then((function(e){if(e.Answer){var n=e.Answer[0].data;t(n)}r(e)})).catch((function(t){console.log(t),r(t)}))})));case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},{key:"getSSLExpiryDate",value:function(){var t=Object(S.a)(O.a.mark((function t(e){var n=this;return O.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",new Promise((function(t,r){e=n._removeDomainProtocol(e),w.get(e).then((function(e){t(e.valid_to)})).catch((function(t){console.log("SSL domain for "+e,t),r(t)}))})));case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},{key:"getRedirect",value:function(){var t=Object(S.a)(O.a.mark((function t(e){return O.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",new Promise((function(t,n){F(e,{method:"GET"}).then((function(e){t(e.url)})).catch((function(t){console.log("getRedirect err",e,t),n(t)}))})));case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},{key:"getDNSDetails",value:function(){var t=Object(S.a)(O.a.mark((function t(e){var n,r,i,a;return O.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,this.dnsExist(e);case 3:if(n=t.sent,this.setState({cname:n}),!n){t.next=41;break}return t.prev=6,t.next=9,this.getSSLExpiryDate(e);case 9:r=t.sent,this.setState({SSLExpiryDate:r}),t.next=17;break;case 13:t.prev=13,t.t0=t.catch(6),this.setState({SSLExpiryDate:"Unable to get SSL"}),console.log(e+": Error",t.t0);case 17:return t.prev=17,t.next=20,this.getRedirect(e);case 20:(i=t.sent)===e+"/"&&(i="No redirection"),this.setState({redirectWithoutSGTIN:i}),t.next=29;break;case 25:t.prev=25,t.t1=t.catch(17),this.setState({redirectWithoutSGTIN:"Unable to get the redirection"}),console.log(e+": Error",t.t1);case 29:return t.prev=29,t.next=32,this.getRedirect(this.state.url);case 32:(a=t.sent)===this.state.url&&(a="No redirection"),this.setState({redirectWithSGTIN:a}),t.next=41;break;case 37:t.prev=37,t.t2=t.catch(29),this.setState({redirectWithSGTIN:"Unable to get the redirection"}),console.log(e+": Error",t.t2);case 41:t.next=47;break;case 43:t.prev=43,t.t3=t.catch(0),this.setState({cname:"Doesn't exist"}),console.log(e+": Error",t.t3);case 47:case"end":return t.stop()}}),t,this,[[0,43],[6,13],[17,25],[29,37]])})));return function(e){return t.apply(this,arguments)}}()},{key:"render",value:function(){return this.props.siteFilter.length>0&&!this.props.site.toLowerCase().includes(this.props.siteFilter.toLowerCase())||this.props.environmentFilter.length>0&&!this.props.environment.toLowerCase().includes(this.props.environmentFilter.toLowerCase())||this.props.domainFilter.length>0&&!this.state.url.toLowerCase().includes(this.props.domainFilter.toLowerCase())?null:Object(C.jsxs)("tr",{children:[Object(C.jsx)("td",{children:this.props.site}),Object(C.jsx)("td",{children:this.props.environment}),Object(C.jsx)("td",{children:this.props.domain}),Object(C.jsx)("td",{children:this.state.cname}),Object(C.jsx)("td",{children:this.state.SSLExpiryDate}),Object(C.jsx)("td",{children:this.state.redirectWithoutSGTIN}),Object(C.jsx)("td",{children:this.state.redirectWithSGTIN})]})}}]),n}(a.a.Component),L=n.p+"static/media/Rolex_URL_working_copy.a3fd6124.csv",E=n(32),T=function(t){Object(p.a)(n,t);var e=Object(j.a)(n);function n(t){var r;return Object(l.a)(this,n),(r=e.call(this,t)).handleTriggerClick=r.handleTriggerClick.bind(Object(d.a)(r)),r}return Object(u.a)(n,[{key:"getURLs",value:function(){var t=Object(S.a)(O.a.mark((function t(){var e;return O.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.readCSV();case 2:for(r=t.sent,e=0;e<r.length;e++)r[e].update=!1;this.setState({urls:r});case 5:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"readCSV",value:function(){var t=Object(S.a)(O.a.mark((function t(){return O.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",E(L).then((function(t){return t.text()})).then((function(t){return y.a.parse(t,{header:!0,skipEmptyLines:!0}).data})));case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){this.getURLs()}},{key:"handleTriggerClick",value:function(){console.log("click !");for(var t=this.state.urls,e=0;e<t.length;e++)t[e].update=!0;this.setState({urls:t})}},{key:"render",value:function(){var t=this;if(!this.state||!("urls"in this.state)||this.state.urls.length<1)return Object(C.jsx)(v.a,{children:Object(C.jsx)(b.a,{sm:4,children:"No URLs provided."})});var e=this.state.urls.map((function(e){return Object(C.jsx)(D,{site:e.Brand,environment:e.Environment,domain:e.URL,update:t.props.update,siteFilter:t.props.siteFilter,environmentFilter:t.props.environmentFilter,domainFilter:t.props.domainFilter},e.URL)}));return Object(C.jsx)("tbody",{children:e})}}]),n}(a.a.Component),N=function(t){Object(p.a)(n,t);var e=Object(j.a)(n);function n(t){var r;return Object(l.a)(this,n),(r=e.call(this,t)).handleTriggerVerification=r.handleTriggerVerification.bind(Object(d.a)(r)),r.handleFilterSiteChange=r.handleFilterSiteChange.bind(Object(d.a)(r)),r.handleFilterEnvironmentChange=r.handleFilterEnvironmentChange.bind(Object(d.a)(r)),r.handleFilterDomainChange=r.handleFilterDomainChange.bind(Object(d.a)(r)),r}return Object(u.a)(n,[{key:"handleFilterSiteChange",value:function(t){this.setState({site:t.target.value})}},{key:"handleFilterEnvironmentChange",value:function(t){this.setState({environment:t.target.value})}},{key:"handleFilterDomainChange",value:function(t){this.setState({domain:t.target.value})}},{key:"componentDidMount",value:function(){this.setState({site:"",environment:"",domain:"",update:!1})}},{key:"handleTriggerVerification",value:function(){this.setState({update:!0})}},{key:"render",value:function(){var t="";null!=this.state&&"site"in this.state&&(t=this.state.site);var e="";null!=this.state&&"environment"in this.state&&(e=this.state.environment);var n="";null!=this.state&&"domain"in this.state&&(n=this.state.domain);var r=!1;return null!=this.state&&"update"in this.state&&(r=this.state.update),Object(C.jsxs)(v.a,{children:[Object(C.jsx)(b.a,{sm:{span:2,offset:10},children:Object(C.jsx)(g.a,{variant:"light",onClick:this.handleTriggerVerification,children:"Verify the URLs"})}),Object(C.jsx)(b.a,{sm:12,children:Object(C.jsxs)(f.a,{striped:!0,bordered:!0,hover:!0,responsive:!0,size:"sm",className:"stubLinks",children:[Object(C.jsxs)("thead",{children:[Object(C.jsxs)("tr",{children:[Object(C.jsx)("td",{children:"Site"}),Object(C.jsx)("td",{children:"Environment"}),Object(C.jsx)("td",{children:"Domain"}),Object(C.jsx)("td",{children:"CNAME"}),Object(C.jsx)("td",{children:"SSL expiry date"}),Object(C.jsx)("td",{children:"Redirect without SGTIN"}),Object(C.jsx)("td",{children:"Redirect with SGTIN"})]}),Object(C.jsxs)("tr",{children:[Object(C.jsx)("td",{children:Object(C.jsx)(m.a,{children:Object(C.jsx)(m.a.Control,{size:"sm",type:"text",placeholder:"Site",value:t,onChange:this.handleFilterSiteChange})})}),Object(C.jsx)("td",{children:Object(C.jsx)(m.a,{children:Object(C.jsx)(m.a.Control,{size:"sm",type:"text",placeholder:"Envt",value:e,onChange:this.handleFilterEnvironmentChange})})}),Object(C.jsx)("td",{children:Object(C.jsx)(m.a,{children:Object(C.jsx)(m.a.Control,{size:"sm",type:"text",placeholder:"Domain",value:n,onChange:this.handleFilterDomainChange})})}),Object(C.jsx)("td",{}),Object(C.jsx)("td",{}),Object(C.jsx)("td",{}),Object(C.jsx)("td",{})]})]}),Object(C.jsx)(T,{siteFilter:t,environmentFilter:e,domainFilter:n,update:r})]})})]})}}]),n}(a.a.Component);var R=function(){var t=Object(C.jsxs)(o.a,{fluid:!0,children:[Object(C.jsx)(h.a,{expand:"lg",variant:"dark",bg:"dark",children:Object(C.jsx)(h.a.Brand,{href:"#",children:"Rolex - URLs verification tool"})}),Object(C.jsx)(N,{})]});return c.a.render(t,document.getElementById("root"))},I=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,85)).then((function(e){var n=e.getCLS,r=e.getFID,i=e.getFCP,a=e.getLCP,s=e.getTTFB;n(t),r(t),i(t),a(t),s(t)}))};c.a.render(Object(C.jsx)(a.a.StrictMode,{children:Object(C.jsx)(R,{})}),document.getElementById("root")),I()}},[[83,1,2]]]);
//# sourceMappingURL=main.89037b4b.chunk.js.map