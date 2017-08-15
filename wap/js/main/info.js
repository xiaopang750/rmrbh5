define(function(require, exports, module){
	
	var template = require('../lib/template/template');
	var bodyParse = require('../widget/http/bodyParse');
	var changeParam = require('../global/changeParam');
	//var viewScore = require('../view_socre');
	
	var info = bodyParse();
	var oWrap = $('#page');	

	var param = changeParam({});

	if(!param.accountid && !param.accountId) {

		$('#page').html('<div style="text-align:center;margin-top:10px">没有获取到用户信息</div>');
		return;

	} else {

		showPage('/rmrbh5/member/findMemberBaseInfo', param, function(data){
		
			var info = JSON.parse(data.outJson);

			renderPage('info-temp', info.data, oWrap);

			tab();

		});	

	}

	
	function showPage(url, param, cb) {

		$.post(url, param, function(data){

			cb && cb(data);

		}, 'json');

	}

	function renderPage(id, data, oWrap) {
		console.log(id);
		console.log(data);
		var html = template(id, data);
		oWrap.html(html);

	}


	function tab() {

		var aContent = $('[tab-content]');

		$(document).on('touchstart', '[tab-head-btn]', function(){

			var index = $(this).index();
			$(this).addClass('active').siblings().removeClass('active');
			aContent.eq(index).show().siblings().hide();

		});	

	}
});