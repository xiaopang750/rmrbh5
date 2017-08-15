/**
 *description:电子优惠券
 *author:fanwei
 *date:2014/10/17
 */

define(function(require, exports, module){

	var template = require('../lib/template/template');
	var bodyParse = require('../widget/http/bodyParse');
	var oTip = require('../widget/dom/tip');
	var changeParam = require('../global/changeParam');
	var pageInfo = bodyParse();
	require('../global/sum');

	var oPage = $('[page-wrap]');
	var lock = false;
	var pkCoupons = null;

	getPageInfo('/rmrbh5/coupons/findCoupons', changeParam(pageInfo), function(data){

		var isRecive;

		pkCoupons = data.coupons.couponsId;
		isRecive = data.recieve;
		renderPage(oPage, 'page', data);
		judgeRecived(isRecive);
		get();

	});


	function renderPage(dataWrap, id, data) {

		var html = template(id, data);

		dataWrap.html(html);

	}

	function judgeRecived(isRecive) {

		var oBtn = $('[get-btn]');

		if(isRecive) {

			oBtn.attr('disabled', 'disabled');
			oBtn.html('已领取');

		}

	}

	function getPageInfo(url, param, cb) {

		var info;

		$.post(url, param, function(data){

			info = JSON.parse(data.outJson);

			if(info.code == 's001') {
				cb && cb(info.data);
			} else {
				oTip.say(info.msg);
			}

		}, 'json');

	}

	function get() {


		$(document).on('click', '[get-btn]', function(){

			if(!lock) {

				lock = true;

				req('/rmrbh5/coupons/receiveCoupons', pkCoupons);

			}

		});

	}

	function req(url, pkCoupons) {

		var param;

		param = {};
		param.pkActivity = pageInfo.pkActivity;
		param.pkCoupons = pkCoupons;
		param.channel = pageInfo.channel;

		$.post(url, changeParam(param), function(data){

			info = JSON.parse(data.outJson);

			if(info.code == 't001') {

				oTip.say(info.msg);

				setTimeout(function(){

					window.location = info.data.url;

				},2000);
			}

			oTip.say(info.msg);

			lock = false;

		}, 'json');

	}

});	