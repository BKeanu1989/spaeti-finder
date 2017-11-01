!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n||e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){module.exports=require("./lib/axios")},{"./lib/axios":3}],2:[function(require,module,exports){(function(process){"use strict";var utils=require("./../utils"),settle=require("./../core/settle"),buildURL=require("./../helpers/buildURL"),parseHeaders=require("./../helpers/parseHeaders"),isURLSameOrigin=require("./../helpers/isURLSameOrigin"),createError=require("../core/createError"),btoa="undefined"!=typeof window&&window.btoa&&window.btoa.bind(window)||require("./../helpers/btoa");module.exports=function(config){return new Promise(function(resolve,reject){var requestData=config.data,requestHeaders=config.headers;utils.isFormData(requestData)&&delete requestHeaders["Content-Type"];var request=new XMLHttpRequest,loadEvent="onreadystatechange",xDomain=!1;if(window.XMLHttpRequest||"test"===process.env.NODE_ENV||"undefined"==typeof window||!window.XDomainRequest||"withCredentials"in request||isURLSameOrigin(config.url)||(request=new window.XDomainRequest,loadEvent="onload",xDomain=!0,request.onprogress=function(){},request.ontimeout=function(){}),config.auth){var username=config.auth.username||"",password=config.auth.password||"";requestHeaders.Authorization="Basic "+btoa(username+":"+password)}if(request.open(config.method.toUpperCase(),buildURL(config.url,config.params,config.paramsSerializer),!0),request.timeout=config.timeout,request[loadEvent]=function(){if(request&&(4===request.readyState||xDomain)&&(0!==request.status||request.responseURL&&0===request.responseURL.indexOf("file:"))){var responseHeaders="getAllResponseHeaders"in request?parseHeaders(request.getAllResponseHeaders()):null,response={data:config.responseType&&"text"!==config.responseType?request.response:request.responseText,status:1223===request.status?204:request.status,statusText:1223===request.status?"No Content":request.statusText,headers:responseHeaders,config:config,request:request};settle(resolve,reject,response),request=null}},request.onerror=function(){reject(createError("Network Error",config,null,request)),request=null},request.ontimeout=function(){reject(createError("timeout of "+config.timeout+"ms exceeded",config,"ECONNABORTED",request)),request=null},utils.isStandardBrowserEnv()){var cookies=require("./../helpers/cookies"),xsrfValue=(config.withCredentials||isURLSameOrigin(config.url))&&config.xsrfCookieName?cookies.read(config.xsrfCookieName):void 0;xsrfValue&&(requestHeaders[config.xsrfHeaderName]=xsrfValue)}if("setRequestHeader"in request&&utils.forEach(requestHeaders,function(val,key){void 0===requestData&&"content-type"===key.toLowerCase()?delete requestHeaders[key]:request.setRequestHeader(key,val)}),config.withCredentials&&(request.withCredentials=!0),config.responseType)try{request.responseType=config.responseType}catch(e){if("json"!==config.responseType)throw e}"function"==typeof config.onDownloadProgress&&request.addEventListener("progress",config.onDownloadProgress),"function"==typeof config.onUploadProgress&&request.upload&&request.upload.addEventListener("progress",config.onUploadProgress),config.cancelToken&&config.cancelToken.promise.then(function(cancel){request&&(request.abort(),reject(cancel),request=null)}),void 0===requestData&&(requestData=null),request.send(requestData)})}}).call(this,require("_process"))},{"../core/createError":9,"./../core/settle":12,"./../helpers/btoa":16,"./../helpers/buildURL":17,"./../helpers/cookies":19,"./../helpers/isURLSameOrigin":21,"./../helpers/parseHeaders":23,"./../utils":25,_process:27}],3:[function(require,module,exports){"use strict";function createInstance(defaultConfig){var context=new Axios(defaultConfig),instance=bind(Axios.prototype.request,context);return utils.extend(instance,Axios.prototype,context),utils.extend(instance,context),instance}var utils=require("./utils"),bind=require("./helpers/bind"),Axios=require("./core/Axios"),defaults=require("./defaults"),axios=createInstance(defaults);axios.Axios=Axios,axios.create=function(instanceConfig){return createInstance(utils.merge(defaults,instanceConfig))},axios.Cancel=require("./cancel/Cancel"),axios.CancelToken=require("./cancel/CancelToken"),axios.isCancel=require("./cancel/isCancel"),axios.all=function(promises){return Promise.all(promises)},axios.spread=require("./helpers/spread"),module.exports=axios,module.exports.default=axios},{"./cancel/Cancel":4,"./cancel/CancelToken":5,"./cancel/isCancel":6,"./core/Axios":7,"./defaults":14,"./helpers/bind":15,"./helpers/spread":24,"./utils":25}],4:[function(require,module,exports){"use strict";function Cancel(message){this.message=message}Cancel.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},Cancel.prototype.__CANCEL__=!0,module.exports=Cancel},{}],5:[function(require,module,exports){"use strict";function CancelToken(executor){if("function"!=typeof executor)throw new TypeError("executor must be a function.");var resolvePromise;this.promise=new Promise(function(resolve){resolvePromise=resolve});var token=this;executor(function(message){token.reason||(token.reason=new Cancel(message),resolvePromise(token.reason))})}var Cancel=require("./Cancel");CancelToken.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},CancelToken.source=function(){var cancel;return{token:new CancelToken(function(c){cancel=c}),cancel:cancel}},module.exports=CancelToken},{"./Cancel":4}],6:[function(require,module,exports){"use strict";module.exports=function(value){return!(!value||!value.__CANCEL__)}},{}],7:[function(require,module,exports){"use strict";function Axios(instanceConfig){this.defaults=instanceConfig,this.interceptors={request:new InterceptorManager,response:new InterceptorManager}}var defaults=require("./../defaults"),utils=require("./../utils"),InterceptorManager=require("./InterceptorManager"),dispatchRequest=require("./dispatchRequest");Axios.prototype.request=function(config){"string"==typeof config&&(config=utils.merge({url:arguments[0]},arguments[1])),(config=utils.merge(defaults,this.defaults,{method:"get"},config)).method=config.method.toLowerCase();var chain=[dispatchRequest,void 0],promise=Promise.resolve(config);for(this.interceptors.request.forEach(function(interceptor){chain.unshift(interceptor.fulfilled,interceptor.rejected)}),this.interceptors.response.forEach(function(interceptor){chain.push(interceptor.fulfilled,interceptor.rejected)});chain.length;)promise=promise.then(chain.shift(),chain.shift());return promise},utils.forEach(["delete","get","head","options"],function(method){Axios.prototype[method]=function(url,config){return this.request(utils.merge(config||{},{method:method,url:url}))}}),utils.forEach(["post","put","patch"],function(method){Axios.prototype[method]=function(url,data,config){return this.request(utils.merge(config||{},{method:method,url:url,data:data}))}}),module.exports=Axios},{"./../defaults":14,"./../utils":25,"./InterceptorManager":8,"./dispatchRequest":10}],8:[function(require,module,exports){"use strict";function InterceptorManager(){this.handlers=[]}var utils=require("./../utils");InterceptorManager.prototype.use=function(fulfilled,rejected){return this.handlers.push({fulfilled:fulfilled,rejected:rejected}),this.handlers.length-1},InterceptorManager.prototype.eject=function(id){this.handlers[id]&&(this.handlers[id]=null)},InterceptorManager.prototype.forEach=function(fn){utils.forEach(this.handlers,function(h){null!==h&&fn(h)})},module.exports=InterceptorManager},{"./../utils":25}],9:[function(require,module,exports){"use strict";var enhanceError=require("./enhanceError");module.exports=function(message,config,code,request,response){var error=new Error(message);return enhanceError(error,config,code,request,response)}},{"./enhanceError":11}],10:[function(require,module,exports){"use strict";function throwIfCancellationRequested(config){config.cancelToken&&config.cancelToken.throwIfRequested()}var utils=require("./../utils"),transformData=require("./transformData"),isCancel=require("../cancel/isCancel"),defaults=require("../defaults"),isAbsoluteURL=require("./../helpers/isAbsoluteURL"),combineURLs=require("./../helpers/combineURLs");module.exports=function(config){return throwIfCancellationRequested(config),config.baseURL&&!isAbsoluteURL(config.url)&&(config.url=combineURLs(config.baseURL,config.url)),config.headers=config.headers||{},config.data=transformData(config.data,config.headers,config.transformRequest),config.headers=utils.merge(config.headers.common||{},config.headers[config.method]||{},config.headers||{}),utils.forEach(["delete","get","head","post","put","patch","common"],function(method){delete config.headers[method]}),(config.adapter||defaults.adapter)(config).then(function(response){return throwIfCancellationRequested(config),response.data=transformData(response.data,response.headers,config.transformResponse),response},function(reason){return isCancel(reason)||(throwIfCancellationRequested(config),reason&&reason.response&&(reason.response.data=transformData(reason.response.data,reason.response.headers,config.transformResponse))),Promise.reject(reason)})}},{"../cancel/isCancel":6,"../defaults":14,"./../helpers/combineURLs":18,"./../helpers/isAbsoluteURL":20,"./../utils":25,"./transformData":13}],11:[function(require,module,exports){"use strict";module.exports=function(error,config,code,request,response){return error.config=config,code&&(error.code=code),error.request=request,error.response=response,error}},{}],12:[function(require,module,exports){"use strict";var createError=require("./createError");module.exports=function(resolve,reject,response){var validateStatus=response.config.validateStatus;response.status&&validateStatus&&!validateStatus(response.status)?reject(createError("Request failed with status code "+response.status,response.config,null,response.request,response)):resolve(response)}},{"./createError":9}],13:[function(require,module,exports){"use strict";var utils=require("./../utils");module.exports=function(data,headers,fns){return utils.forEach(fns,function(fn){data=fn(data,headers)}),data}},{"./../utils":25}],14:[function(require,module,exports){(function(process){"use strict";function setContentTypeIfUnset(headers,value){!utils.isUndefined(headers)&&utils.isUndefined(headers["Content-Type"])&&(headers["Content-Type"]=value)}var utils=require("./utils"),normalizeHeaderName=require("./helpers/normalizeHeaderName"),DEFAULT_CONTENT_TYPE={"Content-Type":"application/x-www-form-urlencoded"},defaults={adapter:function(){var adapter;return"undefined"!=typeof XMLHttpRequest?adapter=require("./adapters/xhr"):void 0!==process&&(adapter=require("./adapters/http")),adapter}(),transformRequest:[function(data,headers){return normalizeHeaderName(headers,"Content-Type"),utils.isFormData(data)||utils.isArrayBuffer(data)||utils.isBuffer(data)||utils.isStream(data)||utils.isFile(data)||utils.isBlob(data)?data:utils.isArrayBufferView(data)?data.buffer:utils.isURLSearchParams(data)?(setContentTypeIfUnset(headers,"application/x-www-form-urlencoded;charset=utf-8"),data.toString()):utils.isObject(data)?(setContentTypeIfUnset(headers,"application/json;charset=utf-8"),JSON.stringify(data)):data}],transformResponse:[function(data){if("string"==typeof data)try{data=JSON.parse(data)}catch(e){}return data}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,validateStatus:function(status){return status>=200&&status<300}};defaults.headers={common:{Accept:"application/json, text/plain, */*"}},utils.forEach(["delete","get","head"],function(method){defaults.headers[method]={}}),utils.forEach(["post","put","patch"],function(method){defaults.headers[method]=utils.merge(DEFAULT_CONTENT_TYPE)}),module.exports=defaults}).call(this,require("_process"))},{"./adapters/http":2,"./adapters/xhr":2,"./helpers/normalizeHeaderName":22,"./utils":25,_process:27}],15:[function(require,module,exports){"use strict";module.exports=function(fn,thisArg){return function(){for(var args=new Array(arguments.length),i=0;i<args.length;i++)args[i]=arguments[i];return fn.apply(thisArg,args)}}},{}],16:[function(require,module,exports){"use strict";function E(){this.message="String contains an invalid character"}var chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";E.prototype=new Error,E.prototype.code=5,E.prototype.name="InvalidCharacterError",module.exports=function(input){for(var block,charCode,str=String(input),output="",idx=0,map=chars;str.charAt(0|idx)||(map="=",idx%1);output+=map.charAt(63&block>>8-idx%1*8)){if((charCode=str.charCodeAt(idx+=.75))>255)throw new E;block=block<<8|charCode}return output}},{}],17:[function(require,module,exports){"use strict";function encode(val){return encodeURIComponent(val).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}var utils=require("./../utils");module.exports=function(url,params,paramsSerializer){if(!params)return url;var serializedParams;if(paramsSerializer)serializedParams=paramsSerializer(params);else if(utils.isURLSearchParams(params))serializedParams=params.toString();else{var parts=[];utils.forEach(params,function(val,key){null!==val&&void 0!==val&&(utils.isArray(val)&&(key+="[]"),utils.isArray(val)||(val=[val]),utils.forEach(val,function(v){utils.isDate(v)?v=v.toISOString():utils.isObject(v)&&(v=JSON.stringify(v)),parts.push(encode(key)+"="+encode(v))}))}),serializedParams=parts.join("&")}return serializedParams&&(url+=(-1===url.indexOf("?")?"?":"&")+serializedParams),url}},{"./../utils":25}],18:[function(require,module,exports){"use strict";module.exports=function(baseURL,relativeURL){return relativeURL?baseURL.replace(/\/+$/,"")+"/"+relativeURL.replace(/^\/+/,""):baseURL}},{}],19:[function(require,module,exports){"use strict";var utils=require("./../utils");module.exports=utils.isStandardBrowserEnv()?{write:function(name,value,expires,path,domain,secure){var cookie=[];cookie.push(name+"="+encodeURIComponent(value)),utils.isNumber(expires)&&cookie.push("expires="+new Date(expires).toGMTString()),utils.isString(path)&&cookie.push("path="+path),utils.isString(domain)&&cookie.push("domain="+domain),!0===secure&&cookie.push("secure"),document.cookie=cookie.join("; ")},read:function(name){var match=document.cookie.match(new RegExp("(^|;\\s*)("+name+")=([^;]*)"));return match?decodeURIComponent(match[3]):null},remove:function(name){this.write(name,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}}},{"./../utils":25}],20:[function(require,module,exports){"use strict";module.exports=function(url){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)}},{}],21:[function(require,module,exports){"use strict";var utils=require("./../utils");module.exports=utils.isStandardBrowserEnv()?function(){function resolveURL(url){var href=url;return msie&&(urlParsingNode.setAttribute("href",href),href=urlParsingNode.href),urlParsingNode.setAttribute("href",href),{href:urlParsingNode.href,protocol:urlParsingNode.protocol?urlParsingNode.protocol.replace(/:$/,""):"",host:urlParsingNode.host,search:urlParsingNode.search?urlParsingNode.search.replace(/^\?/,""):"",hash:urlParsingNode.hash?urlParsingNode.hash.replace(/^#/,""):"",hostname:urlParsingNode.hostname,port:urlParsingNode.port,pathname:"/"===urlParsingNode.pathname.charAt(0)?urlParsingNode.pathname:"/"+urlParsingNode.pathname}}var originURL,msie=/(msie|trident)/i.test(navigator.userAgent),urlParsingNode=document.createElement("a");return originURL=resolveURL(window.location.href),function(requestURL){var parsed=utils.isString(requestURL)?resolveURL(requestURL):requestURL;return parsed.protocol===originURL.protocol&&parsed.host===originURL.host}}():function(){return!0}},{"./../utils":25}],22:[function(require,module,exports){"use strict";var utils=require("../utils");module.exports=function(headers,normalizedName){utils.forEach(headers,function(value,name){name!==normalizedName&&name.toUpperCase()===normalizedName.toUpperCase()&&(headers[normalizedName]=value,delete headers[name])})}},{"../utils":25}],23:[function(require,module,exports){"use strict";var utils=require("./../utils"),ignoreDuplicateOf=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];module.exports=function(headers){var key,val,i,parsed={};return headers?(utils.forEach(headers.split("\n"),function(line){if(i=line.indexOf(":"),key=utils.trim(line.substr(0,i)).toLowerCase(),val=utils.trim(line.substr(i+1)),key){if(parsed[key]&&ignoreDuplicateOf.indexOf(key)>=0)return;parsed[key]="set-cookie"===key?(parsed[key]?parsed[key]:[]).concat([val]):parsed[key]?parsed[key]+", "+val:val}}),parsed):parsed}},{"./../utils":25}],24:[function(require,module,exports){"use strict";module.exports=function(callback){return function(arr){return callback.apply(null,arr)}}},{}],25:[function(require,module,exports){"use strict";function isArray(val){return"[object Array]"===toString.call(val)}function isObject(val){return null!==val&&"object"==typeof val}function isFunction(val){return"[object Function]"===toString.call(val)}function forEach(obj,fn){if(null!==obj&&void 0!==obj)if("object"==typeof obj||isArray(obj)||(obj=[obj]),isArray(obj))for(var i=0,l=obj.length;i<l;i++)fn.call(null,obj[i],i,obj);else for(var key in obj)Object.prototype.hasOwnProperty.call(obj,key)&&fn.call(null,obj[key],key,obj)}function merge(){for(var result={},i=0,l=arguments.length;i<l;i++)forEach(arguments[i],function(val,key){"object"==typeof result[key]&&"object"==typeof val?result[key]=merge(result[key],val):result[key]=val});return result}var bind=require("./helpers/bind"),isBuffer=require("is-buffer"),toString=Object.prototype.toString;module.exports={isArray:isArray,isArrayBuffer:function(val){return"[object ArrayBuffer]"===toString.call(val)},isBuffer:isBuffer,isFormData:function(val){return"undefined"!=typeof FormData&&val instanceof FormData},isArrayBufferView:function(val){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(val):val&&val.buffer&&val.buffer instanceof ArrayBuffer},isString:function(val){return"string"==typeof val},isNumber:function(val){return"number"==typeof val},isObject:isObject,isUndefined:function(val){return void 0===val},isDate:function(val){return"[object Date]"===toString.call(val)},isFile:function(val){return"[object File]"===toString.call(val)},isBlob:function(val){return"[object Blob]"===toString.call(val)},isFunction:isFunction,isStream:function(val){return isObject(val)&&isFunction(val.pipe)},isURLSearchParams:function(val){return"undefined"!=typeof URLSearchParams&&val instanceof URLSearchParams},isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product)&&"undefined"!=typeof window&&"undefined"!=typeof document},forEach:forEach,merge:merge,extend:function(a,b,thisArg){return forEach(b,function(val,key){a[key]=thisArg&&"function"==typeof val?bind(val,thisArg):val}),a},trim:function(str){return str.replace(/^\s*/,"").replace(/\s*$/,"")}}},{"./helpers/bind":15,"is-buffer":26}],26:[function(require,module,exports){function isBuffer(obj){return!!obj.constructor&&"function"==typeof obj.constructor.isBuffer&&obj.constructor.isBuffer(obj)}function isSlowBuffer(obj){return"function"==typeof obj.readFloatLE&&"function"==typeof obj.slice&&isBuffer(obj.slice(0,0))}module.exports=function(obj){return null!=obj&&(isBuffer(obj)||isSlowBuffer(obj)||!!obj._isBuffer)}},{}],27:[function(require,module,exports){function defaultSetTimout(){throw new Error("setTimeout has not been defined")}function defaultClearTimeout(){throw new Error("clearTimeout has not been defined")}function runTimeout(fun){if(cachedSetTimeout===setTimeout)return setTimeout(fun,0);if((cachedSetTimeout===defaultSetTimout||!cachedSetTimeout)&&setTimeout)return cachedSetTimeout=setTimeout,setTimeout(fun,0);try{return cachedSetTimeout(fun,0)}catch(e){try{return cachedSetTimeout.call(null,fun,0)}catch(e){return cachedSetTimeout.call(this,fun,0)}}}function runClearTimeout(marker){if(cachedClearTimeout===clearTimeout)return clearTimeout(marker);if((cachedClearTimeout===defaultClearTimeout||!cachedClearTimeout)&&clearTimeout)return cachedClearTimeout=clearTimeout,clearTimeout(marker);try{return cachedClearTimeout(marker)}catch(e){try{return cachedClearTimeout.call(null,marker)}catch(e){return cachedClearTimeout.call(this,marker)}}}function cleanUpNextTick(){draining&&currentQueue&&(draining=!1,currentQueue.length?queue=currentQueue.concat(queue):queueIndex=-1,queue.length&&drainQueue())}function drainQueue(){if(!draining){var timeout=runTimeout(cleanUpNextTick);draining=!0;for(var len=queue.length;len;){for(currentQueue=queue,queue=[];++queueIndex<len;)currentQueue&&currentQueue[queueIndex].run();queueIndex=-1,len=queue.length}currentQueue=null,draining=!1,runClearTimeout(timeout)}}function Item(fun,array){this.fun=fun,this.array=array}function noop(){}var cachedSetTimeout,cachedClearTimeout,process=module.exports={};!function(){try{cachedSetTimeout="function"==typeof setTimeout?setTimeout:defaultSetTimout}catch(e){cachedSetTimeout=defaultSetTimout}try{cachedClearTimeout="function"==typeof clearTimeout?clearTimeout:defaultClearTimeout}catch(e){cachedClearTimeout=defaultClearTimeout}}();var currentQueue,queue=[],draining=!1,queueIndex=-1;process.nextTick=function(fun){var args=new Array(arguments.length-1);if(arguments.length>1)for(var i=1;i<arguments.length;i++)args[i-1]=arguments[i];queue.push(new Item(fun,args)),1!==queue.length||draining||runTimeout(drainQueue)},Item.prototype.run=function(){this.fun.apply(null,this.array)},process.title="browser",process.browser=!0,process.env={},process.argv=[],process.version="",process.versions={},process.on=noop,process.addListener=noop,process.once=noop,process.off=noop,process.removeListener=noop,process.removeAllListeners=noop,process.emit=noop,process.prependListener=noop,process.prependOnceListener=noop,process.listeners=function(name){return[]},process.binding=function(name){throw new Error("process.binding is not supported")},process.cwd=function(){return"/"},process.chdir=function(dir){throw new Error("process.chdir is not supported")},process.umask=function(){return 0}},{}],28:[function(require,module,exports){"use strict";var axios=require("axios");Vue.component("my-spaeti",{props:["spaetkauf"],template:'<div class="single_spaetkauf">\n\n    <a v-bind:href="\'/spaetkauf/\' + spaetkauf.title" target="_blank">\n      {{ spaetkauf.name }}\n    </a>\n    <table>\n    <tr>\n      <td>Bezirk:</td><td>{{ spaetkauf.district }} </td>\n      </tr>\n      <tr>\n        <td>Adresse:</td><td>{{ spaetkauf.address.street }} {{spaetkauf.address.street_number}}</td>\n      </tr>\n      <tr>\n        <td></td><td>{{ spaetkauf.address.postalCode }} </td>\n      </tr>\n    </table>\n  </div>'}),Vue.component("my-test",{template:"<div>test</div>"}),Vue.component("google-map",{props:["name"],template:'\n  <div class="wrapper">\n    <div class="google-map" :id="mapName"></div>\n  </div>',data:function(){return{mapName:this.name+"-map",markerCoordinates:[{latitude:51.501527,longitude:-.1921837},{latitude:51.505874,longitude:-.1838486},{latitude:51.4998973,longitude:-.202432}]}},methods:{},mounted:function(){var _this=this,element=document.getElementById(this.mapName),options={zoom:14,center:new google.maps.LatLng(51.501527,-.1921837)},map=new google.maps.Map(element,options);this.markerCoordinates.forEach(function(coord){var position=new google.maps.LatLng(coord.latitude,coord.longitude);new google.maps.Marker({position:position,map:map})}),eventBus.$on("mapMarkers",function(data){var coordsArray=[];data.forEach(function(single_data){var obj={};obj.latitude=single_data.position.latitude,obj.longitude=single_data.position.longitude,coordsArray.push(obj)});var element=document.getElementById(_this.mapName),options={zoom:14,center:new google.maps.LatLng(coordsArray[0].latitude,coordsArray[0].longitude)},map=new google.maps.Map(element,options);_this.markerCoordinates=coordsArray,_this.markerCoordinates.forEach(function(coord){var position=new google.maps.LatLng(coord.latitude,coord.longitude);new google.maps.Marker({position:position,map:map})})})}});var eventBus=new Vue;new Vue({el:"#vue",data:{spaetKaufs:[{_id:1,name:"BB Test",title:"bb-test",district:"Schöneberg",address:{street:"Badensche Straße",street_number:"50",postalCode:12345}}]},mounted:function(){var _this2=this;axios.get("/json").then(function(response){_this2.spaetKaufs=response.data,eventBus.$emit("mapMarkers",_this2.spaetKaufs)}).catch(function(error){console.log(error)})}}).message="ttt"},{axios:1}]},{},[28]);