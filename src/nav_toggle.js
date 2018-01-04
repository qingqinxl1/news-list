//导航更多频道切换.
Chinaso.MoreNavs = {
    /**
     * 二级导航更多频道切换.
     * @param hasMoreTab 是否有【更多】按钮.
     * @param hasPushTip 是否有推送数据更新提示.
     * @param normalListCB 普通列表回调函数.
     */
    init: function (hasMoreTab, hasPushTip, normalListCB) {
        var T = this;

        T.listContent = $('.news_index_v1_con_list_con');
        T.tabmenu = $('.tabmenu');

        T.tabmenu.on('click', function () {
            T._tabChange(this, hasPushTip, normalListCB);
        });

        if (hasMoreTab) {
            T.moreTabChange(normalListCB);
        }

        //若URL中含有#锚点，则定位到对定的二级模块.
        var hashElement = T.tabmenu.find('a[href="' + window.location.hash + '"]');
        if (hashElement.length) {
            hashElement.trigger('click');
        } else {
            T.tabmenu.eq(0).trigger('click');
        }
    },

    _tabChange: function (trigger, hasPushTip, normalListCB) {
        var T = this;
        $('.share-scroll-box').hide();
        T.tabmenu.off('scrollLoad');

        var cur = $(trigger);
        var type = cur.data("type");
        var curIndex = cur.index();

        if (type === 'more') {
            return false;
        }
        cur.addClass('cur').siblings().removeClass('cur');
        content = T.listContent.hide().eq(curIndex).show();
        var listContent = content.find('.news-sum-list');

        //默认为普通列表,type为recommend时走推荐列表,为around时走Roll接口.
        if (type === 'recommend') {
            Chinaso.RecomendList.redirectModel(cur, listContent);
        } else if (type === 'around') {
            Chinaso.RollList.init(cur, listContent, cur.data('params'), normalListCB);
        } else {
            Chinaso.NormalList.init(cur, listContent, normalListCB);
        }

        if (hasPushTip) {
            Chinaso.PushList.resetPushReq(cur, listContent);
        }
    },

    /**
     * 更多展示与频道切换
     */
    moreTabChange: function (normalListCB) {
        var tabMoreContainer = $('.news_index_tab_more');
        var tabMoreTrigger = tabMoreContainer.children('a');
        var tabMoreContent = tabMoreContainer.find('.news_index_tab_more_con');
        var clearTimeId;
        var tabMoreShowClass = 'news_index_tab_more_hover';
        var T = this;
        tabMoreContainer.on({
            mouseenter: function () {
                clearTimeout(clearTimeId);
                clearTimeId = setTimeout(function () {
                    tabMoreContent.show();
                    tabMoreContainer.addClass(tabMoreShowClass);
                }, 200);
            },
            mouseleave: function () {
                clearTimeout(clearTimeId);
                clearTimeId = setTimeout(function () {
                    tabMoreContent.hide();
                    tabMoreContainer.removeClass(tabMoreShowClass);
                }, 200);
            }
        });
        tabMoreContent.find('a').on('click', function () {
            var cur = $(this);
            var type = cur.data('type');
            tabMoreContainer.data('oneloadstatus', 0);
            tabMoreContainer.data('pageno', 0);
            tabMoreContainer.data({
                'url': cur.data('url'),
                'type': type
            });
            tabMoreTrigger.find('span').text(cur.text());

            var curIndex = tabMoreContainer.index();
            tabMoreContainer.addClass('cur').siblings().removeClass('cur');
            T.listContent.hide().eq(curIndex).show();
            var content = T.listContent.eq(curIndex).find('.news-sum-list');

            content.html('');

            //默认为普通列表,type为recommend时走推荐列表,为around时走Roll接口.
            if (type === 'recommend') {
                Chinaso.RecomendList.redirectModel(tabMoreContainer, content);
            } else if (type === 'around') {
                Chinaso.RollList.init(tabMoreContainer, content, cur.data('params'), normalListCB);
            } else {
                Chinaso.NormalList.init(tabMoreContainer, content, normalListCB);
            }
            return false;
        });
    }

};
