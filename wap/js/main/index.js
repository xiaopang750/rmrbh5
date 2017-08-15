/**
 *description:首页
 *author:fanwei
 *date:2014/07/26
 */
define(function(require, exports, module){
	
	var focus = require('../widget/focus/focus');
	var tmepalte = require('../lib/template/template');
	require('../link');
	require('../share');
	
	var bodyParse = require('../widget/http/bodyParse');
	var info = bodyParse();

	$.get('/rmrbh5/mobilesite/mobilesitereadSiteContent', {pkSite:info.pkSite, pkPage: info.pkPage}, function(data){

		var realData = JSON.parse(data.outJson);	
		console.log(realData);
		var oWrap = $('[page-wrap]');

		var info = realData.data.content;

		if(info.isused != 1) {

			oWrap.html('<div class="tc pt_20 font_18">该页面未启用</div>');
			return;
		}
		console.log(info);
		$('title').html(realData.data.siteName);

		info.pkSite = data.pkSite;

		var html = template('page', info);


		oWrap.html(html);

		/* foc */
		var foc = new focus({
			cycle: true,
			auto: true,
			oWrap: $('[widget-role = focus-wrap]')
		});

		foc.init();

		require('../nav');

	}, 'json');

});