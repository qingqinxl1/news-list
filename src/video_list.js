/**
 * 事件订阅中枢
 * @type {Object}
 */
Chinaso.Sub = $({});

/**
 * 头条列表页随机插入视频稿件对象
 * 调用方法：Chinaso.VideoList.load()
 * @type {Object}
 */
Chinaso.VideoList = {
    /**
     * 加载视频列表的入口方法
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    load: function (options) {
        this.default = {
            channel: 'redian',//频道，默认热点
            //数据接口url，如果外部配置未配置则以channel字段取出对应的url
            url: null,
            row: 6, //插入视频稿件行数，
            column: 4, //每组的视频数目
            $wrap: $('.news-sum-list').eq(0),//新闻列表容器
            listSelector: '.toutiao_l_list', //列表内新闻选择器
            minPos: 3, // 插入的最小位置，从1开始
            maxPos: 30, // 插入的最大位置。从1开始
            onload: function () { } //视频加载成功后的回调
        }
        this.conf = $.extend({}, this.default, options);
        this.url = this.conf.url || this.API[this.conf.channel];

        this.getVideoList(this.url);
    },

    getVideoList: function (url) {
        var that = this;
        if (!url) {
            return;
        }

        Chinaso.ListTools.sendJSONP(url, "jsonpcallback", true, true)
            .done(function (data) {
                that.render(data);
                that.conf.onload.call(that);
            })
    },
    API: {
        /*（最新）新闻-视频新闻*/
        zuixin: "http://video.chinaso.com/newsv3/videonews/newslist/odata.json",
        /*（热点）今日热播*/
        redian: "http://video.chinaso.com/newsv3/socialnews/list/odata.json",
        /* 时政 */
        zhengwu: "http://video.chinaso.com/newvideo/xwlb/xwlby/odata.json",
        /* 财经 */
        caijing: "http://video.chinaso.com/newsv3/caijingnews/list/odata.json",
        /* 国际 */
        guoji: "http://video.chinaso.com/newsv3/guojinews/list/odata.json",
        /* 军事 */
        junshi: "http://video.chinaso.com/newsv3/milnews/list/odata.json",
        /*社会*/
        shehui: "http://video.chinaso.com/newsv3/socialnews/list/odata.json",
        /*文娱*/
        wenyu: "http://video.chinaso.com/newsv3/wenyu/list/odata.json",
        /* 科技*/
        keji: "http://video.chinaso.com/newsv3/kejiao/list/odata.json",
        /*体育*/
        tiyu: "http://video.chinaso.com/newsv3/sportnews/list/odata.json"
    },
    /**
     * 生成[min,max)范围内的随机整数
     * @param  {number} min 最小值
     * @param  {number} max 最大值
     * @return {number} 随机数
     */
    getRandom: function (min, max) {
        min = typeof min === 'number' ? min : parseInt(min, 10);
        max = typeof max === 'number' ? max : parseInt(max, 10);

        //确保min是小于等于max的
        if (max < min) {
            max = [min, min = max][0];
        }
        return Math.floor(min + Math.random() * (max - min));
    },

    /**
     * 生成min和max范围内的随机数组,数字不重复且从小到大排列
     * @param  {number} min 最小值
     * @param  {number} max 最大值
     * @param  {number} num 数组个数
     * @return {Array}     [description]
     */
    getRandomArray: function (min, max, num) {
        var arr = [],
            obj = {},
            i = 0,
            rd = 0;
        while (arr.length < num) {
            rd = this.getRandom(min, max);
            if (!obj.hasOwnProperty(rd)) {
                obj[rd] = 1;
                arr.push(rd);
            }
        }
        function compare(a, b) {
            return (a - b);
        }
        return arr.sort(compare);
    },

    Tpl: {
        FRAME: '<div class="toutiao_l_list_video"> <ul> {{VIDEO_ITREM}} </ul> </div>',
        VIDEO_ITREM: '<li>' +
        '    <a href="{{SourceUrl}}" target="_blank" title="{{TitleCN}}">' +
        '        <img src="{{PreviewImage}}?enable=&w=157&h=100&cut=" alt="{{TitleCN}}">' +
        '             <i></i>' +
        '    </a>' +
        '     <p><a href="{{SourceUrl}}" target="_blank" title="{{TitleCN}}">{{TitleCN}}</a></p>' +
        '</li>'

    },

    renderTpl: function (tpl, data) {
        return tpl.replace(/\{\{(.+?)\}\}/g, function (match, $1) {
            //console.log(data.hasOwnProperty($1));
            return data.hasOwnProperty($1) ? data[$1] : "";
        })
    },

    render: function (data) {
        var dlist = data.results,
            i,
            tpl = '',//模板
            fragment = '',
            that = this,
            $list = that.conf.$wrap.find(that.conf.listSelector);//新闻列表
        pos = that.getRandomArray(that.conf.minPos, that.conf.maxPos, that.conf.row);
        console.log(pos);

        for (i = 0; i < that.conf.row; i++) {
            //tpl = that.renderTpl(that.Tpl.FRAME, that.Tpl);
            //获得 dlist[i*4]~dlist[i*4 + 3] 的html
            fragment = that.getGroupHtml(dlist, i, that.conf.column);
            if (fragment !== "") {
                tpl = that.Tpl.FRAME.replace('{{VIDEO_ITREM}}', fragment);
                that.insert($list, pos[i], tpl);
            }
        }
    },

    getGroupHtml: function (dataList, row, column) {
        var html = "";
        for (var j = row * column; j < (row + 1) * column; j++) {
            if (j < dataList.length) {
                html += this.renderTpl(this.Tpl.VIDEO_ITREM, dataList[j]);
            }
        }
        return html;
    },

    insert: function ($list, index, html) {
        if (index < $list.length) {
            $list.eq(index).before(html);
        } else {
            $list.last().after(html);
        }

    }
}

//头条列表加载视频jsonp回调函数
window.ODataCall = function(data) {
    Chinaso.VideoList.render(data);
    Chinaso.VideoList.conf.onload(data);
}
