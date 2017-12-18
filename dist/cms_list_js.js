/*! date:Mon Dec 18 2017 17:58:13 GMT+0800 (CST), hash:6b918aa12d94649c3334, chunkhash:4298a29d2671f6bd2acb, name:cms_list_js, filebase:cms_list_js.js, query:, file:cms_list_js.js */
!function(root,factory){"object"==typeof exports&&"object"==typeof module?module.exports=factory():"function"==typeof define&&define.amd?define([],factory):"object"==typeof exports?exports.List=factory():root.List=factory()}(this,function(){return function(modules){function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={i:moduleId,l:!1,exports:{}};return modules[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.l=!0,module.exports}var installedModules={};return __webpack_require__.m=modules,__webpack_require__.c=installedModules,__webpack_require__.d=function(exports,name,getter){__webpack_require__.o(exports,name)||Object.defineProperty(exports,name,{configurable:!1,enumerable:!0,get:getter})},__webpack_require__.n=function(module){var getter=module&&module.__esModule?function(){return module["default"]}:function(){return module};return __webpack_require__.d(getter,"a",getter),getter},__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=11)}({0:function(module,exports){var ListTools=function(){};ListTools.prototype.sendXHR=function(url,dataType){return $.ajax({type:"GET",url:url,dataType:dataType||"html"})},ListTools.prototype.sendJSONP=function(url,jsonpName,asy,iscache,jsonpCallbackName){return $.ajax({type:"get",url:url,dataType:"jsonp",contentType:"application/x-www-form-urlencoded;charset=utf-8",timeout:3e4,jsonp:jsonpName||"jsonpcallback",jsonpCallback:jsonpCallbackName||"callback",async:asy||!0,cache:iscache||!1})},ListTools.prototype.getCutImageUrl=function(imageUrl,width,height,type){var mapCutUrl="/w"+width+"/h"+height+"/"+(type=type||"c3"),cmsCutUrl="?enable=&w="+width+"&h="+height+"&cut=",resultUrl=imageUrl;return-1!==imageUrl.indexOf("map.pg0.cn")||-1!==imageUrl.indexOf("news.pg0.cn")?resultUrl=imageUrl+mapCutUrl:-1!==imageUrl.indexOf("cmsfile.pg0.cn")&&(resultUrl=imageUrl+cmsCutUrl),resultUrl},ListTools.prototype.showLoading=function($load,$more){$more&&$more.length||($more=$(".load_more")),$load&&$load.length||($load=$(".loading")),$load.show(),$more.hide()},ListTools.prototype.hideLoading=function($load){$load&&$load.length||($load=$(".loading")),$(".loading").hide()},module.exports=ListTools},1:function(module,exports,__webpack_require__){var Tools=__webpack_require__(0),NormalList=function(cur,content,successCB){this.cur=cur,this.content=content,this.successCB=successCB};NormalList.prototype.init=function(){var T=this;this.lock=!1,this.loadNextPageFlag,this.loadXHR,this.totalPage,this.cur=T.cur,this.content=T.content,this.scollLoadMargin=600,this.clientHeight=document.documentElement.clientHeight,this.cur.data("arrid",""),~~this.cur.data("oneloadstatus")&&this.setPageNo(this.cur),~~this.cur.data("oneloadstatus")||this.send(T.successCB);var $loadMore=T.content.siblings(".load_more");this.cur.on("scrollLoad",function(e){if(T.getPageFlag(),T.loadNextPageFlag){var flagTop=0;try{flagTop=T.loadNextPageFlag.getBoundingClientRect().top}catch(e){}if(flagTop-T.clientHeight-T.scollLoadMargin<=0){var cur_page_no=~~T.cur.data("pageno");cur_page_no<5?T.send(T.successCB):cur_page_no<T.totalPage&&$loadMore.show()}}});var clearScrollLoadId,scrollNum=0;$(window).on("scroll",function(){var time=200;++scrollNum>10&&(time=0),clearTimeout(clearScrollLoadId),clearScrollLoadId=setTimeout(function(){scrollNum=0,T.cur.trigger("scrollLoad")},time)}).on("resize",function(){T.clientHeight=document.documentElement.clientHeight}),$loadMore.on("click",function(){T.getPageFlag(),T.send(T.successCB)})},NormalList.prototype.setPageNo=function(channel){channel.data("oneloadstatus","1"),channel.data("pageno",1+~~channel.data("pageno"))},NormalList.prototype.getUrl=function(url,pageno){return!((pageno=+pageno+1)>this.totalPage)&&(pageno>1&&(pageno="_"+pageno,url=url.replace(".shtml",pageno+".shtml")),url)},NormalList.prototype.send=function(successCB){var T=this,url=this.getUrl(this.cur.data("url"),this.cur.data("pageno")),$load=T.content.siblings(".loading"),$more=T.content.siblings(".load_more"),tools=new Tools;return!!url&&(!this.lock&&(this.lock=!0,tools.showLoading($load,$more),this.loadXHR&&this.loadXHR.abort(),this.loadXHR=tools.sendXHR(url),void this.loadXHR.done(function(html){T.loadXHR=null,T.setPageNo(T.cur);var htmlDoc=T.str2DocElement(html),$htmlDoc=$(htmlDoc);T.content.append($htmlDoc),T.removeRepeatItem($htmlDoc.filter(".toutiao_l_list")),"function"==typeof successCB&&successCB()}).fail(function(e){if("abort"===e.statusText)return loadXHR=null,!1}).always(function(e){"abort"!==e.statusText&&(tools.hideLoading($load),T.lock=!1)})))},NormalList.prototype.getPageFlag=function(){this.loadNextPageFlag=this.content.find(".listpage").last()[0],this.loadNextPageFlag&&(this.totalPage=~~this.loadNextPageFlag.innerHTML)},NormalList.prototype.removeRepeatItem=function($items){for(var arrTCurID=this.cur.data("arrid"),i=0,len=$items.length;i<len;i++){var cur=$items.eq(i),_ID=cur.data("id");if(!_ID)break;arrTCurID.indexOf(_ID)>=0?cur.remove():arrTCurID+=_ID+","}this.cur.data("arrid",arrTCurID)},NormalList.prototype.str2DocElement=function(str){var div=document.createElement("div");return div.innerHTML=str,div.children},module.exports=NormalList},11:function(module,exports,__webpack_require__){module.exports=__webpack_require__(1)}})});