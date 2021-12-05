"use strict";const{PoolBase,kClients,kNeedDrain,kAddClient,kDispatch}=require("./pool-base"),Client=require("./client"),{InvalidArgumentError}=require("./core/errors"),util=require("./core/util"),{kUrl}=require("./core/symbols"),buildConnector=require("./core/connect"),kOptions=Symbol("options"),kConnections=Symbol("connections"),kFactory=Symbol("factory");function defaultFactory(t,n){return new Client(t,n)}class Pool extends PoolBase{constructor(t,{connections:n,factory:e=defaultFactory,connect:o,connectTimeout:i,tls:r,maxCachedSessions:s,socketPath:c,...l}={}){if(super(),null!=n&&(!Number.isFinite(n)||n<0))throw new InvalidArgumentError("invalid connections");if("function"!=typeof e)throw new InvalidArgumentError("factory must be a function.");if(null!=o&&"function"!=typeof o&&"object"!=typeof o)throw new InvalidArgumentError("connect must be a function or an object");"function"!=typeof o&&(o=buildConnector({...r,maxCachedSessions:s,socketPath:c,timeout:null==i?1e4:i,...o})),this[kConnections]=n||null,this[kUrl]=util.parseOrigin(t),this[kOptions]={...util.deepClone(l),connect:o},this[kFactory]=e}[kDispatch](){let t=this[kClients].find((t=>!t[kNeedDrain]));return t||((!this[kConnections]||this[kClients].length<this[kConnections])&&(t=this[kFactory](this[kUrl],this[kOptions]),this[kAddClient](t)),t)}}module.exports=Pool;