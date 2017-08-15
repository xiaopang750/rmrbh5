define(function(require, exports, module){

	var template = require('../lib/template/template');
	var bodyParse = require('../widget/http/bodyParse');
	var pageInfo = bodyParse();
	require('../link');
	require('../share');

	$.get('/rmrbh5/mobilesite/mobilesitereadSiteContent', {pkSite:pageInfo.pkSite,pkPage:pageInfo.pkPage}, function(data){
		
		var info = JSON.parse(data.outJson).data.content;
		console.log(info);
		var oWrap = $('[page-wrap]');

		if(info.isused != 1) {

			oWrap.html('<div class="tc pt_20 font_18">该页面未启用</div>');
			return;
		}

		var html = template('page', info);

		oWrap.html(html);

		$('title').html(JSON.parse(data.outJson).data.siteName);

		var bg = info.bgImg.modelData.bgImgUrl;

		var oImage = $('<img>');

		var bg = info.bgImg.modelData.bgImgUrl;

		$('body').css({
			backgroundImage: 'url('+ bg +')',
			backgroundSize: '100% 100%',
			backgroundRepeat: 'no-repeat'
		});

		$('html').css('height', '100%');

		require('../nav');

	}, 'json');

});	