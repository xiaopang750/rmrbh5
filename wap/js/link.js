define(function(require, exports, module){
	
	var oTip = require('./widget/dom/tip');
	var bodyParse = require('./widget/http/bodyParse');
	var pageInfo = bodyParse();

	$(document).on('click', '[linker]', function(){

		var url = $(this).attr('linker');
		var pkSite = pageInfo.pkSite;

		if(!url || !pkSite){

			oTip.say('亲! 求您别点了，已经没有了!');
			return;
		}

		$.post('/rmrbh5/mobilesite/mobilesitefindModelCode', {pkPage:url, pkSite: pkSite}, function(data){

			var info = JSON.parse(data.outJson).data;

			if(info.content.isCustom == 'custom') {

				window.location = info.content.pageUrl;

			}

			if(!info) {

				oTip.say('亲! 求您别点了，已经没有了!');
				return;
			}

			switch(info.content.modelcode) {

				case 'indexModelOne':
					pageName = 'index';
				break;

				case 'indexModelTwo':
					pageName = 'index2';
				break;

				case 'indexModelThree':
					pageName = 'index3';
				break;

				case 'pageModelOne':
					pageName = 'card1';
				break;

				case 'pageModelTwo':
					pageName = 'card2';
				break;

				case 'pageModelThree':
					pageName = 'card3';
				break;

				case 'pageModelFour':
					pageName = 'card4';
				break;
			}

			window.location = '/rmrbh5/wap/'+ pageName +'.html' + '?pkSite=' + pkSite + '&pkPage=' + info.content.pageId;

		},'json');

	});
	
});