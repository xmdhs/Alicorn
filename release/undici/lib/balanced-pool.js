"use strict";const{BalancedPoolMissingUpstreamError}=require("./core/errors"),Dispatcher=require("./dispatcher"),Pool=require("./pool"),kPools=Symbol("kPools"),kPoolOpts=Symbol("kPoolOpts"),kUpstream=Symbol("kUpstream"),kNeedDrain=Symbol("kNeedDrain");class BalancedPool extends Dispatcher{constructor(s=[],e={}){super(),this[kPools]=[],this[kPoolOpts]=e,this[kNeedDrain]=!1,Array.isArray(s)||(s=[s]);for(const e of s)this.addUpstream(e)}addUpstream(s){if(this[kPools].find((e=>e[kUpstream]===s)))return this;const e=new Pool(s,Object.assign({},this[kPoolOpts]));return e[kUpstream]=s,e.on("connect",((...s)=>{this.emit("connect",...s)})),e.on("disconnect",((...s)=>{this.emit("disconnect",...s)})),e.on("drain",((...s)=>{e[kNeedDrain]=!1,this[kNeedDrain]&&(this[kNeedDrain]=!1,this.emit("drain",...s))})),this[kPools].push(e),this}dispatch(s,e){if(0===this[kPools].length)throw new BalancedPoolMissingUpstreamError;const o=this[kPools].find((s=>!s[kNeedDrain]))||this[kPools][0];return o.dispatch(s,e)||(o[kNeedDrain]=!0,this[kNeedDrain]=!0),this[kPools].splice(this[kPools].indexOf(o),1),this[kPools].push(o),!this[kNeedDrain]}removeUpstream(s){const e=this[kPools].find((e=>e[kUpstream]===s)),o=this[kPools].indexOf(e);return this[kPools].splice(o,1),e.close(),this}get upstreams(){return this[kPools].map((s=>s[kUpstream]))}get destroyed(){return this[kPools].reduce(((s,e)=>s&&e.destroyed),!0)}get closed(){return this[kPools].reduce(((s,e)=>s&&e.closed),!0)}close(s){const e=Promise.all(this[kPools].map((s=>s.close())));if(!s)return e;e.then((()=>process.nextTick(s)),(e=>process.nextTick(s,e)))}destroy(s,e){const o=Promise.all(this[kPools].map((e=>e.destroy(s))));if(!e)return o;o.then((()=>process.nextTick(e)))}}module.exports=BalancedPool;