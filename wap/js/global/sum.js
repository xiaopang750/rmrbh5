/**
 *description:活动统计
 *author:fanwei
 *date:2014/10/17
 */
define(function(require, exports, module){
	
	var bodyParse = require('../widget/http/bodyParse');
	var changeParam = require('./changeParam');

	$.post('/rmrbh5/activity/browseInfo', changeParam(bodyParse()));
	
});