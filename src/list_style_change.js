

/**
 * 列表页图文切换交互.
 * @exec NewsSoList.ListStyle.init();
 */

Chinaso.ListStyle = {
    /**
     * @param options {
     *       smallWidth: 160, //图文列表图片展示宽度
     *       smallHeight: 111, //图文列表图片展示高度
     *       bigWidth: 213, //三列大图图片展示宽度
     *       bigHeight: 148, //三列大图图片展示高度
     *       defaultListStyle: 0 //0代表图文列表模式,1代表三列大图列表模式.
     *   }
     */
    CONS: {
        _CHINASO_LIST_STYLE: 'chinaso_list_style'
    },

    defaults: {
        smallWidth: 160,
        smallHeight: 111,
        bigWidth: 227,
        bigHeight: 158,
        defaultListStyle: 0, //默认列表样式.
        curListStyle: 0 //当前列表样式.
    },

    init: function (options) {
        var T = this;
        $.extend(T.defaults, options);

        T.$wrap = $('.news_index_v1_con_list_con');
        T.$tab = $('.news_index_v1_con_tab');
        T.creteList();
    },

    //创建列表样式切换结构
    creteList: function () {
        var T = this,
            $html = null,
            isGrid = CookieUtils.get(T.CONS._CHINASO_LIST_STYLE), //是否为三列大图显示.
            isAbsoluteBtn = T.isAbsoluteBtn(),
            isAbsoluteCss = isAbsoluteBtn ? ' list-style-add' : '',
            html = '<div class="list-style-button"><div class="list-style' + isAbsoluteCss +
                '"><span' + ' class="icon-btn-switch-grid" title="图文模式"></span>' +
                '<span class="icon-btn-switch-list unable" title="列表模式"></span></div></div>',
            def = T.defaults;

        //若用户没有操作过列表样式,则取页面模版中定义的style值,若模版中也没有则默认为列表样式.
        if (isGrid == undefined || isGrid == 'undefined') {
            isGrid = def.defaultListStyle;
            def.curListStyle = def.defaultListStyle;
        } else {
            def.curListStyle = isGrid;
        }

        $html = $(html);
        var $spans = $html.find('span');

        if (isGrid != 1) {
            $spans.removeClass('unable');
            $html.find('.icon-btn-switch-list').addClass('unable');
            T.$wrap.show();
            T.$wrap.parent().removeClass('style-waterfall');
            T.dealImgs($('.news-sum-img img'), def.smallWidth, def.smallHeight);
        } else {
            T.$wrap.show();
            $spans.removeClass('unable');
            $html.find('.icon-btn-switch-grid').addClass('unable');
            T.$wrap.parent().addClass('style-waterfall');
            T.dealImgs($('.news-sum-img img:not(.news-sum-img-none)'), def.bigWidth, def.bigHeight);
        }

        T.$wrap.eq(0).before($html);
        T.bindChange($html);
    },

    //判断列表切换按钮是否绝对定位.
    isAbsoluteBtn: function () {
        var $tab = this.$tab,
            flag = 0;
        if (!($tab.css('display') == 'none')) {
            flag = 1;
        }
        return flag;
    },

    //绑定样式切换事件.
    bindChange: function ($html) {
        var T = this,
            $spans = $html.find('span'),
            def = T.defaults;
        $spans.on('click', function () {
            var $this = $(this),
                cls = $this.attr('class');

            if (/unable/.test(cls)) {
                return false;
            } else {
                $spans.removeClass('unable');
                $this.addClass('unable');
                if (/grid/.test(cls)) {
                    T.$wrap.parent().addClass('style-waterfall');
                    T.dealImgs($('.news-sum-img img:not(.news-sum-img-none)'), def.bigWidth, def.bigHeight);
                    T.setStyleCookie(1);
                } else {
                    T.$wrap.parent().removeClass('style-waterfall');
                    T.dealImgs($('.news-sum-img img'), def.smallWidth, def.smallHeight);
                    T.setStyleCookie(0);
                }
            }
        });
    },

    //保存设置默认为图片列表的cookie
    setStyleCookie: function (cookieVal) {
        var T = Chinaso.ListStyle,
            expiresDate = new Date();
        expiresDate.setTime(expiresDate.getTime() + 365 * 24 * 60 * 60 * 1000); //设置列表样式切换过期时间为1年.
        CookieUtils.set(T.CONS._CHINASO_LIST_STYLE, cookieVal, expiresDate.toGMTString(), window.location.hostname, '/');
        T.defaults.curListStyle = cookieVal;
    },

    //处理列表中图片的大小
    dealImgs: function ($imgs, w, h) {
        var len = $imgs.length;
        for (var i = 0; i < len; i++) {
            var _curImg = $imgs.eq(i),
                src = _curImg.data('originsrc');
            if (src.indexOf('cmsfile.pg0.cn') !== -1) {
                _curImg.attr('src', src + '?enable=&w=' + w + '&h=' + h + '&cut=');

                // 增加 news.pg0 图片链接裁切判断
            } else if (src.indexOf('map.pg0.cn') !== -1 || src.indexOf('news.pg0.cn') !== -1) {
                _curImg.attr('src', src + '/w' + w + '/h' + h + '/c3');
            }
        }
    },

    //处理图片回调函数.
    //用于滚动加载更多数据后的页面结构处理.
    cutImgsCallback: function ($imgWrap) {
        var T = Chinaso.ListStyle,
            def = T.defaults,
            curStyle = def.curListStyle;
        if (curStyle == 1) {
            T.dealImgs($imgWrap.find('img:not(.news-sum-img-none):not([src])'), def.bigWidth, def.bigHeight);
        } else {
            T.dealImgs($imgWrap.find('img:not([src])'), def.smallWidth, def.smallHeight);
        }
    }

};
