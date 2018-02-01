var template = require('art-template');
var Tools = require('./tools');

//Roll接口列表数据展示：
//主要功能:地方新闻数据展示,城市周边数据展示等.
var RollList = function (options) {
  var T = this;
  T.def = {
    cur: null,
    content: null,
    URL: 'http://rollpc.news.chinaso.com/newsQuery/query/getNewsList.htm?',
    params: '',
    cb: null,
    maxScrollNum: 5,
    tmplID: 'roll_list_tmpl',
    pageNoStart: 0,
    isGoTop: false
  }
  T.def = $.extend(T.def, options);

  T.lock = false;
  T.loadNextPageFlag;
  T.loadXHR;
  T.totalPage;
  T.scollLoadMargin = 600;
  T.clientHeight = document.documentElement.clientHeight;
  T.before = '';
}
RollList.prototype.init = function () {
  var T = this;
  //若当前tab标签上自定义属性data-oneloadstatus的值为1/true,则从第二页开始加载数据.
  if (~~T.def.cur.data('oneloadstatus')) {
    this.setPageNo(this.def.cur);
  }
  if (!~~T.def.cur.data('oneloadstatus')) {
    this.send();
  }

  var $loadMore = T.def.content.siblings('.load_more');
  this.def.cur.on('scrollLoad', function (e) {
    T.getPageFlag();
    if (T.loadNextPageFlag) {
      var flagTop = 0;
      try {
        flagTop = T.loadNextPageFlag.getBoundingClientRect().top;
      } catch (e) { }
      if (flagTop - T.clientHeight - T.scollLoadMargin <= 0) {
        var cur_page_no = ~~T.def.cur.data('pageno');
        if (cur_page_no < T.def.maxScrollNum) {
          T.send();
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
      T.def.cur.trigger('scrollLoad');
    }, time);
  }).on('resize', function () {
    T.clientHeight = document.documentElement.clientHeight;
  });

  //点击加载更多.
  $loadMore.on('click', function () {
    T.getPageFlag();
    T.send();
  });
}

RollList.prototype.setPageNo = function (channel) {
  channel.data('oneloadstatus', '1');
  channel.data('pageno', ~~channel.data('pageno') + 1);
}

RollList.prototype.getUrl = function (pageno) {
  var T = this;
  var url = T.def.URL + T.def.params + '&pageNo='
  url = pageno ? url + pageno : url + '0';
  if (pageno > this.totalPage) {
    return false;
  }
  if (this.before) {
    url += '&before=' + encodeURIComponent(this.before);
  }

  return url;
}

//发送请求
RollList.prototype.send = function () {
  var T = this;
  var url = this.getUrl(this.def.cur.data('pageno'));
  var tools = new Tools();
  var $load = T.def.content.siblings('.loading');
  var $more = T.def.content.siblings('.load_more');
  if (!url) {
    return false;
  }
  if (this.lock) {
    return false;
  }

  this.lock = true;
  tools.showLoading($load, $more);

  this.loadXHR && this.loadXHR.abort();
  this.loadXHR = tools.sendJSONP(url, 'jsonpcallback', true, true);
  this.loadXHR.done(function (data) {
    T.loadXHR = null;
    T.def.content.append(T.buildHtml(data));
    T.curPageNo++;
    T.getPageFlag();
    T.setPageNo(T.def.cur);
    if (typeof T.def.cb == 'function') {
      T.def.cb(); //渲染成功后回调.
    }
  }).always(function (e) {
    tools.hideLoading($load);
    if (e.statusText !== 'abort') {
      T.lock = false;
    }
  });
}

// 拼接及滚动列表数据结构
RollList.prototype.buildHtml = function (data) {
  var str = template(this.def.tmplID, data);
  // str += '<div class="listpage" style="height: 0;border:0;margin:0;padding:0;overflow: hidden;display:none;">' + data.totalPage + '</div>';
  return str;
}

//获取到页面最底下的元素，用来判断滚动条距离底部的位置
RollList.prototype.getPageFlag = function () {
  this.loadNextPageFlag = this.def.content.find('.listpage').last()[0];
  if (this.loadNextPageFlag) {
    this.totalPage = ~~this.loadNextPageFlag.innerHTML;
  }
}

RollList.prototype.updateParams = function (params) {
  var T = this;
  var defs = T.def;

  defs.cur.data('pageno', defs.pageNoStart); //更新页码
  defs.params = params; //更新参数
  defs.content.html(''); //删除现有的html数据
  if(defs.isGoTop) {
    $('body').scrollTop(defs.content.offset().top || 0); //滚动到顶部
  }
  T.send(); //发送新的请求
}

module.exports = RollList;
