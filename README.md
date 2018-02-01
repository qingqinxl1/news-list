## 分页组件使用说明

### 依赖 jQuery 1.9.1+

## 引入方式

### ES6

```javascript
//.jsonp格式引入方式
import RollList from '@cnpm/list';

//.shtml格式引入方式
import NormalList from '@cnpm/list/dist/cms-list';
```

### 普通引入方式

*引入之前需要引入jquery*

#### jsonp格式数据引入路径

`<script type="text/javascript" src="http://n3.static.pg0.cn/fp/list/dist/roll-list.js">`

#### .shtml格式数据引入路径

`<script type="text/javascript" src="http://n3.static.pg0.cn/fp/list/dist/cms-list.js">`

### AMD
```javascript
//.jsonp格式数据调用
require(['@cnpm/list'], function(RollList){
  //创建分页实例
  var rollList = new RollList({
    //当前点击的tab元素
    cur: null,
    //当前存放内容的元素
    content: null,
    //请求地址
    URL: 'http://rollpc.news.chinaso.com/newsQuery/query/getNewsList.htm?',
    //请求参数
    params: '',
    //回掉函数
    cb: null,
    //最大滚动加载的椰树
    maxScrollNum: 5,
    //渲染模版id
    tmplID: 'roll_list_tmpl',
    //第一页页码开始是0还是1
    pageNoStart: 0,
    //是否滚动到页面顶部
    isGoTop: false
  });
  //分页方法调用
  rollList.init();
});

//.shtml格式数据调用
require(['@cnpm/list/dist/cms-list'], function(NormalList){
  //cur 当前存放data-contentid的元素
  //content 当前存放内容的元素
  //isGoTop 是否滚动到页面顶部，默认不滚动到顶部
  //successCB 列表渲染成功后回调函数
  var normalList = new NormalList(cur, content);
  normalList.init();
});
```

## 更新参数方法

### jsonp格式数据
```javascript
/**
 * 更新参数
 * @params params 请求参数
 */
rollList.updateParams(params);
```
### .shtml格式数据
```javascript
/**
 * 更新参数
 * @params cur 当前存放data-contentid的元素
 * @params content 当前存放内容的元素
 */
normalList.updateParams(cur, content);
```
