//列表页广告塞入.
Chinaso.ListAdTuck = {
    init: function (options) {
        var T = this;

        T.defaults = {
            queryID: '3618478478',
            adNum: 16, //广告热搜词条数.
            adGroupNum: 4, //adGroupNum个热搜词为一组广告.
            $wrap: $('.news-sum-list').eq(0), //插入广告的列表外侧容器.
            sepListNum: 10 //每隔sepListNum条数据加载一组广告.
        };

        T.defaults = $.extend(T.defaults, options);
        T.getAdData();
    },

    /**
     * 获取广告数据.
     */
    getAdData: function () {
        var T = this,
            def = T.defaults,
            url = 'http://rollpc.news.chinaso.com/newsQuery/query/getNewsList.htm?channel=&queryId=' +
                def.queryID + '&subChannel=&tableName=&tableId=&pageSize=' + def.adNum + '&pageNo=0&after=&sourceType=1,2,3,4,5',
            jsonpXHR = Chinaso.ListTools.sendJSONP(url, 'jsonpcallback', true, true, 'adCallback');

        jsonpXHR.done(function (data) {
            T.curTruckNum = def.sepListNum - 1; //设置当前插入位置为第sepListNum个.
            T.tuckAd(data.results);
        });
    },

    /**
     * 塞入广告代码.
     * @param data
     */
    tuckAd: function (list) {
        var T = this,
            def = T.defaults;
        T.list = T.list ? T.list : list;

        if (!T.list) return false;

        if (T.list.length >= def.adGroupNum) {
            var $listDiv = def.$wrap.find('>div.toutiao_l_list'),
                html = T._buildAdHtml(T.list.slice(0, def.adGroupNum));
            $listDiv.eq(T.curTruckNum).after(html);
            T.curTruckNum += def.sepListNum;
            T.list = T.list.slice(def.adGroupNum);
        }
    },

    /**
     * 拼接出每条广告的结构.
     * @param list
     * @private
     */
    _buildAdHtml: function (list) {
        var T = this,
            def = T.defaults;

        //若广告数据为空或者不足一组,不进行结构拼接.
        if (!list || list.length != def.adGroupNum) {
            return false;
        }
        var str = '<div class="toutiao_l_list_ad"><div class="toutiao_l_list_ad_title"><img src="http://n1.static.pg0.cn/toutiao/static/v1/image/toutiao_v2_hot_tj.png"></div><div class="toutiao_l_list_ad_con"><ul>';

        for (var i = 0; i < def.adGroupNum; i++) {
            var cur = list[i],
                src = T.dealImgUrl(cur.PreviewImage, 150, 90)
                /*,
                             sign = cur.Sign ? ('<i>' + cur.Sign + '</i>') : ('<i>热搜推荐</i>')*/
                ;

            str += '<li><a href="' + cur.SourceUrl + '" target="_blank"><img src="' + src + '"></a>' +
                '<p><a href="' + cur.SourceUrl + '" target="_blank">' + cur.TitleCN + '</a></p></li>'
        }

        str += '</ul></div></div>';

        return str;
    },

    /**
     * 图片裁切.
     * @param orignURL 原始路径
     * @param w 裁切宽度
     * @param h 裁切高度
     * @returns {string:裁切后的图片路径}
     */
    dealImgUrl: function (orignURL, w, h) {
        if (orignURL.indexOf('cmsfile.pg0.cn') !== -1) {
            return orignURL + '?enable=&w=' + w + '&h=' + h + '&cut=';

            // 增加 news.pg0 图片链接裁切判断
        } else if (orignURL.indexOf('map.pg0.cn') !== -1 || orignURL.indexOf('news.pg0.cn') !== -1) {
            return orignURL + '/w' + w + '/h' + h + '/c3';
        }
    },

    /**
     * 真实广告代码插入.
     * @example
     * Chinaso.ListAdTuck.realAdInit({adIDs:['970', '971', '972'], tuckAfter:[2, 5, 8]});
     * @modify by huangxiaoli at 2017-02-13 09:32:57
     * 广告接口改为图文广告接口：http://adq.chinaso.com/adshow?type=3&adbar=963
     * 返回信息：
     *
     * 调用方式也做了修改:
     * Chinaso.ListAdTuck.realAdInit({adID:'1010'});
     */
    realAdInit: function (options) {
        var T = this;
        T.defs = {
            adID: '', //需要加入广告的ID.
            $wrap: $('.news-sum-list').eq(0),
            // tuckAfter: [5], //广告需加入的列表位置（列表的哪条或哪些条元素之后）.
            getAdURL: 'http://adq.chinaso.com/adshow?type=3' //广告接口地址.
        };

        T.defs = $.extend(T.defs, options);
        if (T.defs.adID.length) {
            T.addRealAd();
        }
    },

    /**
     * 获取真实广告添加位置及广告ID.
     */
    addRealAd: function () {
        var T = this,
            defs = T.defs,
            adID = defs.adID;

        T._buildRealAdHtml(adID);
    },

    /**
     * 广告系统广告代码结构拼接.
     * @param $prev 广告代码需要加入的位置之前.
     * @param adInfo 广告ID和类型.
     */
    _buildRealAdHtml: function (adID) {
        var T = this,
            url = T.defs.getAdURL + '&adbar=' + adID,
            jsonpXHR = Chinaso.ListTools.sendJSONP(url, 'callback', undefined, true, 'realAdCallback');

        jsonpXHR.done(function (data) {
            var list = data.ad;
            if (list && list.length && $.trim(list)) {
                for (var i = 0, len = list.length; i < len; i++) {
                    var curAd = list[i],
                        pos = curAd.position;

                    if (pos === undefined) continue;

                    var $item = T.defs.$wrap.find('.toutiao_l_list').eq(pos),
                        html = '<div class="news-sum-div clearb toutiao_l_list_real_ad">';

                    if (curAd.title) {
                        html += '<h3><a  href="' + curAd.click_url + '" target="_blank">' + curAd.title + '</a></h3>';
                    }

                    html += '<div class="real_ad_img"><a  href="' + curAd.click_url + '" target="_blank"><img src="' +
                        curAd.img_url + '"></a><span>广告</span></div>';
                    html += '</div>';

                    $item.before(html);
                }
            }

        });
    }
};
