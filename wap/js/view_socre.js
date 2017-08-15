/**
 *description:浏览送积分
 *author:fanwei
 *date:2014/09/17
 */
define(function(require, exports, module){
		
	var bodyParse = require('./widget/http/bodyParse');
	var pageInfo = bodyParse();

	$.post('../activity/browseInfo', pageInfo);
	
});