## 分页组件使用说明

### 依赖 jQuery 1.9.1+

## 引入方式

### ES6

```
import Paging from '@cnpm/list';
```

### 普通引入方式

*引入之前需要引入jquery*

#### .shtml格式数据引入路径

`<script type="text/javascript" src="node_modules/@cnpm/list/dist/cms_list_js.js">`

#### jsonp格式数据引入路径

`<script type="text/javascript" src="node_modules/@cnpm/list/dist/roll_list_js.js">`

### AMD
```
require(['@cnpm/list'], function(List){

})
```

## 调用方式

#### .shtml格式数据调用方式

```
//创建分页实例
var rollList = new List({
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
  pageNoStart: 0
});
//分页方法调用
rollList.init();
```
#### jsonp格式数据调用方式

```
/**
 * 创建分页实例
 * @params cur 当前存放data-contentid的元素
 * @params content 当前存放内容的元素
 */
var normalList = new List(cur, content);
//分页方法调用
normalList.init();
```

## 更新参数方法(两种类型接口调用一致)

```
/**
 * 创建分页实例
 * @params params 请求参数
 * @params cur 当前存放data-contentid的元素
 * @params content 当前存放内容的元素
 */
chinasoPage.updateParams(params, cur, content);
```
