/**
 *description:模板三
 *author:fanwei
 *date:2014/07/26
 */
define(function(require, exports, module){
	
	var tmepalte = require('../lib/template/template');
	require('../link');
	require('../share');

	var bodyParse = require('../widget/http/bodyParse');
	var info = bodyParse();

	$.get('/rmrbh5/mobilesite/mobilesitereadSiteContent', {pkSite:info.pkSite, pkPage: info.pkPage}, function(data){

		var realData = JSON.parse(data.outJson);	
		
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

		require('../updateScreen');
		require('../nav');

	}, 'json');

});