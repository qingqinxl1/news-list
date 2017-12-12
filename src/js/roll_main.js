var RollList = require('./roll_list');
var opt = {
  cur: $('.tab').eq(0),
  content: $('.content').eq(0),
  params: 'fields=PublishedAt,SourceUrl,TitleCN,ImageUrl,Summary,SourceName&channel=3297556&queryId=&pageNo=0&type=title&sourceType=0,2,3,4,5&IsRoll=0,1&tableName=news&date=&pageSize=20'
};

var rollList = new RollList(opt);
rollList.init();
