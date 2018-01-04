//推荐列表数据展示.
Chinaso.RecomendList = {
    initialize: function () {
        var T = this;
        this.__TOUTIAO__SORT_TAG_KEY__ = '__TOUTIAO__SORT_TAG_KEY__';

        // 最大缓存时效 六个小时
        this.maxCacheTime = 21600000;
        var maxTagLength = 4;
        var maxQueryTags = 3;
        this.contentId = '';
        this.storage = new StoragePolyfill(this.__TOUTIAO__SORT_TAG_KEY__, 30, 'json');
        this.newSortTabObj = {};
        var values = this.getSortTags();
        $('.news_index_v1_con_list_con').on('click', '.news-sum-div a', function () {
            var cur = $(this);
            var tags = cur.attr('tag');
            if (!tags) {
                return;
            }
            var tagList = tags.split(',');
            var tmpTagList = [];
            for (var i = 0, len = tagList.length, item; i < len; i++) {
                item = $.trim(tagList[i]);
                if (item) {
                    tmpTagList.push(item);
                }
                if (i >= maxTagLength) {
                    break;
                }
            }
            values.unshift(encodeURIComponent(tmpTagList.join(',')));
            if (values.length > maxQueryTags) {
                values.length = maxQueryTags;
            }
            T.newSortTabObj[T.contentId] = {
                value: values,
                expire: new Date().getTime()
            };
            T.storage.set(T.__TOUTIAO__SORT_TAG_KEY__, T.newSortTabObj);
        });
    },
    getSortTags: function () {
        this.newSortTabObj = this.storage.get(this.__TOUTIAO__SORT_TAG_KEY__) || {};
        var values = [];
        var sortTags = this.newSortTabObj[this.contentId];
        if (sortTags) {
            var expire = new Date().getTime() - sortTags.expire;
            if (expire < this.maxCacheTime) {
                values = sortTags.value;
            }
        }
        return values;
    },
    redirectModel: function (cur, content) {
        this.initialize();
        var values = this.getSortTags();
        if (!values.length) {
            return Chinaso.NormalList.init(cur, content);
        }
        cur.data('oneloadstatus', 0);
        cur.data('pageno', 0);
        content.html('');
        this.initializeModel(values, cur, content);
    },
    initializeModel: function (values, cur, content) {
        var T = this,
            _MAX_SCROLL_PAGE = 5;

        this.loadNextPageFlag;
        this.loadXHR;
        this.totalPage;
        this.cur = cur;
        this.content = content;
        this.lock;

        // SourceType是5.原创稿，2.自采稿，4.转发稿，3.编发稿
        this.sourceType = '2,3,4,5';
        this.cid = this.contentId;
        this.tags = values;
        this.curPageNo;
        this.scollLoadMargin = 600;
        this.clientHeight = document.documentElement.clientHeight;

        // 首页特殊判断
        // 首页的栏目 ID 无法获取数据，使用国搜新闻栏目节点 ID
        if (this.cid === 3295420) {
            this.cid = 3295414;
        }

        if (!~~this.cur.data('oneloadstatus')) {
            this.send(T.tags, T.sourceType, T.cid);
        }

        var $more = this.content.siblings('.more');

        //var clearScrollLoadId;
        //滚动加载更多.
        $(window).on('scroll', function () {
            if (T.lock) {
                return false;
            }
            //clearTimeout(clearScrollLoadId);
            //clearScrollLoadId = setTimeout(function () {
            if (T.loadNextPageFlag) {
                if (T.curPageNo < _MAX_SCROLL_PAGE) {
                    var flagTop = 0;
                    try {
                        flagTop = T.loadNextPageFlag.getBoundingClientRect().top;
                    } catch (e) { }
                    if (flagTop - T.clientHeight - T.scollLoadMargin <= 0) {
                        if (!T.content.is(':hidden')) {
                            T.lock = true;
                            T.send(T.tags, T.sourceType, T.cid, T.curPageNo);
                        }
                    }
                } else {
                    if (T.cur.data('pageno') < T.totalPage) {
                        $more.show();
                    }
                }
            }
            //}, 200);
        }).on('resize', function () {
            T.clientHeight = document.documentElement.clientHeight;
        });

        //点击加载更多.
        $more.on('click', function () {
            T.send(T.tags, T.sourceType, T.cid, T.curPageNo);
        });
    },

    // 发送推荐 tab 项数据请求
    send: function (tags, sourceType, cid, pageNo, pageSize) {
        var T = this,
            $load = T.content.siblings('.loading'),
            $more = T.content.siblings('.load_more'),
            ListTools = Chinaso.ListTools;
        ListTools.showLoading($load, $more);
        pageNo = pageNo || 0;
        pageSize = pageSize || 25;
        T.sourceType = sourceType;
        T.tags = tags;
        T.cid = cid;
        T.curPageNo = pageNo;
        var tmpTag = decodeURIComponent(tags.join(','));
        var url = '//recommend.chinaso.com/newsQuery/query/getNewsList.htm?channel=' + cid + '&day=3&isRecommend=1&manulFirst=0&subChannel=&tableName=&tableId=&type=abstract&pageSize=' + pageSize + '&pageNo=' + pageNo + '&sourceType=' + sourceType + '&Tag=' + tmpTag;
        this.loadXHR && this.loadXHR.abort();
        T.loadXHR = ListTools.sendJSONP(url, 'jsonpcallback', false).done(function (data) {
            T.content.append(T.buildHtml(data.results, data.totalPage));
            T.curPageNo++;
            T.getPageFlag();
            T.setPageNo(T.cur);
        }).always(function (e) {
            ListTools.hideLoading($load);
            if (e.statusText !== 'abort') {
                T.lock = false;
            }
        });
    },

    // 拼接及渲染推荐数据结构
    buildHtml: function (arr, totalPage) {
        str = '';
        for (var i = 0; i < (arr.length > 10 ? 10 : arr.length); i++) {
            var title = (arr[i].TitleCN.length >= 28) ? arr[i].TitleCN.substring(0, 28) : arr[i].TitleCN;
            var linkUrl = 'http://news.chinaso.com/stat/a.html?url=' + arr[i].EnSourceUrl;
            var imageUrl = arr[i].ImageUrl;
            var summary = arr[i].Summary;
            //var channelName = arr[i].channelName;
            var channelName = arr[i].SourceName;
            var publishedAt = arr[i].PublishedAt;
            var id = arr[i]._id;
            var imageHtml = '';
            if (publishedAt) {
                publishedAt = publishedAt.split(' ')[0];
            }
            var maxSummaryLength = 65;
            if (summary.length > maxSummaryLength) {
                summary = summary.substring(0, maxSummaryLength) + '...';
            }
            var tag = arr[i].Tag;
            if (typeof tag === 'string') {
                tag = tag.replace(/(\[|\])/g, '');
            }
            if (imageUrl) {
                var imageSrc = Chinaso.ListTools.getCutImageUrl(imageUrl, 135, 92, 'c2');
                imageHtml =
                    '<div class="news-sum-img ">' +
                    '<a href="' + linkUrl + '" target="_blank" tag="' + tag + '">' +
                    '<img src="' + imageSrc + '" alt="' + title + '">' +
                    '</a>' +
                    '</div>';
            }
            str +=
                '<div class="news-sum-div clearb" data-id="' + id + '">' +
                '<h3><a href="' + linkUrl + '" target="_blank" tag="' + tag + '">' + title + '</a></h3>' +
                imageHtml +
                '<div class="news-sum-con list-right">' +
                '<p>' + summary +
                '<span>' +
                '[<a href="' + linkUrl + '" target="_blank" tag="' + tag + '">详细</a>]' +
                '</span>' +
                '</p>' +
                '<div class="news-sum-info">' +
                '<span class="news-sum-source">' + channelName + '</span>' +
                '<span class="news-sum-time">' + publishedAt + '</span>' +
                '<div class="right-toolbar">' +
                '<img src="http://n1.static.pg0.cn/news/static/v1/image/share_bg.png">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
        str += '<div class="listpage" style="height: 0;border:0;margin:0;padding:0;overflow: hidden;display:none;">' + totalPage + '</div>';
        return str;
    },
    setPageNo: function (channel) {
        channel.data('oneloadstatus', '1');
    },
    getPageFlag: function () {
        this.loadNextPageFlag = this.content.find('.listpage').last()[0];
    }
};
