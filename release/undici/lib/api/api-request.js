"use strict";const Readable=require("./readable"),{InvalidArgumentError,RequestAbortedError}=require("../core/errors"),util=require("../core/util"),{AsyncResource}=require("async_hooks"),{addSignal,removeSignal}=require("./abort-signal");class RequestHandler extends AsyncResource{constructor(e,t){if(!e||"object"!=typeof e)throw new InvalidArgumentError("invalid opts");const{signal:r,method:o,opaque:n,body:s,onInfo:i}=e;try{if("function"!=typeof t)throw new InvalidArgumentError("invalid callback");if(r&&"function"!=typeof r.on&&"function"!=typeof r.addEventListener)throw new InvalidArgumentError("signal must be an EventEmitter or EventTarget");if("CONNECT"===o)throw new InvalidArgumentError("invalid method");if(i&&"function"!=typeof i)throw new InvalidArgumentError("invalid onInfo callback");super("UNDICI_REQUEST")}catch(e){throw util.isStream(s)&&util.destroy(s.on("error",util.nop),e),e}this.opaque=n||null,this.callback=t,this.res=null,this.abort=null,this.body=s,this.trailers={},this.context=null,this.onInfo=i||null,util.isStream(s)&&s.on("error",(e=>{this.onError(e)})),addSignal(this,r)}onConnect(e,t){if(!this.callback)throw new RequestAbortedError;this.abort=e,this.context=t}onHeaders(e,t,r){const{callback:o,opaque:n,abort:s,context:i}=this;if(e<200)return void(this.onInfo&&this.onInfo({statusCode:e,headers:util.parseHeaders(t)}));const a=util.parseHeaders(t),l=new Readable(r,s,a["content-type"]);this.callback=null,this.res=l,this.runInAsyncScope(o,null,null,{statusCode:e,headers:a,trailers:this.trailers,opaque:n,body:l,context:i})}onData(e){const{res:t}=this;return t.push(e)}onComplete(e){const{res:t}=this;removeSignal(this),util.parseHeaders(e,this.trailers),t.push(null)}onError(e){const{res:t,callback:r,body:o,opaque:n}=this;removeSignal(this),r&&(this.callback=null,queueMicrotask((()=>{this.runInAsyncScope(r,null,e,{opaque:n})}))),t&&(this.res=null,queueMicrotask((()=>{util.destroy(t,e)}))),o&&(this.body=null,util.destroy(o,e))}}function request(e,t){if(void 0===t)return new Promise(((t,r)=>{request.call(this,e,((e,o)=>e?r(e):t(o)))}));try{this.dispatch(e,new RequestHandler(e,t))}catch(r){if("function"!=typeof t)throw r;const o=e&&e.opaque;queueMicrotask((()=>t(r,{opaque:o})))}}module.exports=request;