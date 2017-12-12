//公共方法.
var ListTools = function() {

};

/**
 * 发送ajax请求.
 * @param url 请求路径
 * @param dataType 响应数据类型:包括html,json
 * @returns {*}
 */
ListTools.prototype.sendXHR = function(url, dataType) {
  return $.ajax({
    type: 'GET',
    url: url,
    dataType: dataType || 'html'
  });
}

/**
 * 发送jsonp请求.
 * @param url 请求路径
 * @param jsonpName 回调参数名称,默认为jsonpcallback
 * @param asy 是否异步, 默认为ture
 * @param iscache 是否缓存数据，默认为否
 * @param jsonpCallbackName 回调函数名称,默认为jsonpcallback
 */
ListTools.prototype.sendJSONP = function(url, jsonpName, asy, iscache, jsonpCallbackName) {
  return $.ajax({
    type: 'get',
    url: url,
    dataType: 'jsonp',
    contentType: 'application/x-www-form-urlencoded;charset=utf-8',
    timeout: 30000,
    jsonp: jsonpName || 'jsonpcallback',
    jsonpCallback: jsonpCallbackName || 'callback',
    async: asy || true,
    cache: iscache || false
  });
}

/**
 * 图片裁切.
 * @param imageUrl 图片原始路径
 * @param width 裁切后宽度
 * @param height 裁切后高度
 * @param type 裁切类型，默认为c3
 * @returns 裁切后的图片路径.
 */
ListTools.prototype.getCutImageUrl = function(imageUrl, width, height, type) {
  type = type || 'c3';
  var mapCutUrl = '/w' + width + '/h' + height + '/' + type;
  var cmsCutUrl = '?enable=&w=' + width + '&h=' + height + '&cut=';
  var mapHost = 'map.pg0.cn';
  var newsHost = 'news.pg0.cn';
  var cmsHost = 'cmsfile.pg0.cn';
  var resultUrl = imageUrl;
  if (imageUrl.indexOf(mapHost) !== -1 || imageUrl.indexOf(newsHost) !== -1) {
    resultUrl = imageUrl + mapCutUrl;
  } else if (imageUrl.indexOf(cmsHost) !== -1) {
    resultUrl = imageUrl + cmsCutUrl;
  }
  return resultUrl;
}

/**
 * 展示正在加载图标.
 */
ListTools.prototype.showLoading = function($load, $more) {
  if (!$more || !$more.length) {
    $more = $('.load_more');
  }
  if (!$load || !$load.length) {
    $load = $('.loading');
  }
  $load.show();
  $more.hide();
}

/**
 * 隐藏正在加载图标.
 */
ListTools.prototype.hideLoading = function($load) {
  if (!$load || !$load.length) {
    $load = $('.loading');
  }
  $('.loading').hide();
}

module.exports = ListTools;
