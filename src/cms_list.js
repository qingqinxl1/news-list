var Tools = require('./tools');

//普通列表数据展示：
//第一页数据通过模版配置展示，从第二页开始取发布出的.shtml数据展示.
var NormalList = function (cur, content, isGoTop, successCB) {
  this.cur = cur;
  this.content = content;
  this.successCB = successCB;
  this.isGoTop = isGoTop || false;
};

/**
 * @param cur 存放请求数据的元素
 * @param content 展示数据列表的外层容器
 * @param successCB 数据请求成功后的回调函数
 * @description cur上绑定的数据说明：
 * data-oneloadstatus:第一屏数据加载状态 1已经存在 0不存在
 * data-url: 请求路径，.shtml文件放路径
 * data-arrid: 已经显示的列表id，用来清除滚动加载时的重复数据。 js操作，无需页面初始化设置
 * data-pageno: 当前加载到第几页 js操作。无需页面初始化设置
 */
NormalList.prototype.init = function () {
  var T = this,
    MAX_SCROLL_PAGE = 5;

  this.lock = false;
  this.loadNextPageFlag;
  this.loadXHR;
  this.totalPage;
  this.cur = T.cur;
  this.content = T.content;
  this.scollLoadMargin = 600;
  this.clientHeight = document.documentElement.clientHeight;

  //切换标签后清空重复列表项id.
  this.cur.data('arrid', '');
  //若当前tab标签上自定义属性data-oneloadstatus的值为1/true,则从第二页开始加载数据.
  if (~~this.cur.data('oneloadstatus')) {
    this.setPageNo(this.cur);
  }
  if (!~~this.cur.data('oneloadstatus')) {
    this.send(T.successCB);
  }

  var $loadMore = T.content.siblings('.load_more');
  this.cur.on('scrollLoad', function (e) {
    T.getPageFlag();
    if (T.loadNextPageFlag) {
      var flagTop = 0;
      try {
        flagTop = T.loadNextPageFlag.getBoundingClientRect().top;
      } catch (e) { }
      if (flagTop - T.clientHeight - T.scollLoadMargin <= 0) {
        var cur_page_no = ~~T.cur.data('pageno');
        if (cur_page_no < MAX_SCROLL_PAGE) {
          T.send(T.successCB);
        } else if (cur_page_no < T.totalPage) {
          $loadMore.show();
        }
      }
    }
  });

  // 滚动加载
  var clearScrollLoadId;
  var scrollNum = 0;
  var clearTime = 200;
  var maxScrollNum = 10;
  $(window).on('scroll', function () {
    var time = clearTime;
    scrollNum++;
    if (scrollNum > maxScrollNum) {
      time = 0;
    }
    clearTimeout(clearScrollLoadId);
    clearScrollLoadId = setTimeout(function () {
      scrollNum = 0;
      T.cur.trigger('scrollLoad');
    }, time);
  }).on('resize', function () {
    T.clientHeight = document.documentElement.clientHeight;
  });

  //点击加载更多.
  $loadMore.on('click', function () {
    T.getPageFlag();
    T.send(T.successCB);
  });
}

NormalList.prototype.setPageNo = function (channel) {
  channel.data('oneloadstatus', '1');
  channel.data('pageno', ~~channel.data('pageno') + 1);
}
NormalList.prototype.getUrl = function (url, pageno) {
  var suffix = '.shtml';
  pageno = +pageno + 1;
  if (pageno > this.totalPage) {

    return false;
  }
  if (pageno > 1) {
    pageno = '_' + pageno;
    url = url.replace(suffix, pageno + suffix);
  }
  return url;
}
NormalList.prototype.send = function (successCB) {
  var T = this;
  var url = this.getUrl(this.cur.data('url'), this.cur.data('pageno'));
  var $load = T.content.siblings('.loading');
  var $more = T.content.siblings('.load_more');
  var tools = new Tools();
  if (!url) {
    return false;
  }
  if (this.lock) {
    return false;
  }

  this.lock = true;
  tools.showLoading($load, $more);

  this.loadXHR && this.loadXHR.abort();
  this.loadXHR = tools.sendXHR(url);
  this.loadXHR.done(function (html) {
    T.loadXHR = null;
    T.setPageNo(T.cur);

    var htmlDoc = T.str2DocElement(html),
      $htmlDoc = $(htmlDoc);

    T.content.append($htmlDoc);
    T.removeRepeatItem($htmlDoc.filter('.toutiao_l_list'));

    if (typeof successCB == 'function') {
      successCB(); //渲染成功后回调.
    }
  }).fail(function (e) {
    if (e.statusText === 'abort') {
      loadXHR = null;
      return false;
    }
  }).always(function (e) {
    if (e.statusText !== 'abort') {
      tools.hideLoading($load);
      T.lock = false;
    }
  });
}
NormalList.prototype.getPageFlag = function () {
  this.loadNextPageFlag = this.content.find('.listpage').last()[0];
  if (this.loadNextPageFlag) {
    this.totalPage = ~~this.loadNextPageFlag.innerHTML;
  }
}

/**
 * 删除重复项.
 * 翻到下一页的时候cms已经重新发布，会出现前几条数据和上一页数据有重复.
 * @param $items
 */
NormalList.prototype.removeRepeatItem = function ($items) {
  var T = this,
    arrTCurID = T.cur.data('arrid');

  for (var i = 0, len = $items.length; i < len; i++) {
    var cur = $items.eq(i),
      _ID = cur.data('id');

    if (!_ID) break; //若当前行没有'data-id'属性则直接返回.

    if (arrTCurID.indexOf(_ID) >= 0) {
      cur.remove();
    } else {
      arrTCurID += _ID + ',';
    }
  }

  T.cur.data('arrid', arrTCurID);
}

/**
 * 将dom格式的字符串转换为Dom类型.
 * @param str dom格式字符串.
 */
NormalList.prototype.str2DocElement = function (str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  return div.children;
}

NormalList.prototype.updateParams = function ($cur, $content) {
  var T = this;

  T.cur = $cur; //更新页码
  T.content = $content; //更新参数
  if(T.isGoTop) {
    $('body').scrollTop(T.content.offset().top || 0); //滚动到顶部
  }
  T.send(T.successCB); //发送新的请求
}

module.exports = NormalList;
