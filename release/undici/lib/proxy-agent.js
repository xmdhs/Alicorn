"use strict";const{kProxy}=require("./core/symbols"),url=require("url"),Agent=require("./agent"),Dispatcher=require("./dispatcher"),{InvalidArgumentError}=require("./core/errors"),kAgent=Symbol("proxy agent");class ProxyAgent extends Dispatcher{constructor(r){super(r),this[kProxy]=buildProxyOptions(r),this[kAgent]=new Agent(r)}dispatch(r,t){const{host:e}=url.parse(r.origin);return this[kAgent].dispatch({...r,origin:this[kProxy].uri,path:r.origin+r.path,headers:{...r.headers,host:e}},t)}async close(){await this[kAgent].close()}}function buildProxyOptions(r){if("string"==typeof r&&(r={uri:r}),!r||!r.uri)throw new InvalidArgumentError("Proxy opts.uri is mandatory");return{uri:r.uri,protocol:r.protocol||"https"}}module.exports=ProxyAgent;