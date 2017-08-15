/**
 *description:二维码商品展示列表
 *author:fanwei
 *date:2014/10/15
 */
define(function(require, exports, module){
	
	var tmepalte = require('../lib/template/template');
	var bodyParse = require('../widget/http/bodyParse');
	var oTip = require('../widget/dom/tip');
	
	var info = bodyParse();
	var oWrap = $('[page-wrap]');
	var pkCorp = info.pkCorp;

	if(!pkCorp) {
		oTip.say('参数错误');
		return;
	} else {

		$.post('../activity/queryIntegralExchange', {pkCorp: pkCorp}, function(data){

			var realData = JSON.parse( JSON.parse(data).outJson );
			var html = template('page', realData.data);
			oWrap.html(html);

		});

	}

});