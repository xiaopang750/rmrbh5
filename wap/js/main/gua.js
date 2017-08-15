/**
 *description:刮刮卡
 *author:fanwei
 *date:2014/10/12
 */
define(function(require, exports, module){
	
	require('../global/sum');
	var msgBox = require('../widget/dom/msgBox');
	var guaguaka = require('../widget/job/gua');
	var bodyParse = require('../widget/http/bodyParse');
	var changeParam = require('../global/changeParam');
	var pageInfo = bodyParse();
	var pid = pageInfo.pkActivity ?  pageInfo.pkActivity : "";
	var oid = pageInfo.openid ?  pageInfo.openid : "";
	var aid = pageInfo.accountid ?  pageInfo.accountid : "";
	var pkid,
		oBox;

	//msg-box
	oBox = new msgBox();
	oBox.init();

	function Gua(opts) {

		opts = opts || {};

		this.oPrizeList = $('[prize-list]');
		this.oDetail = $('[prize-issue]');
		this.oPrizeTitle = $('[prize-title]');
		this.oLoading = $('[loading]');
		this.oMain = $('[main]');

	}

	Gua.prototype = {

		start: function() {

			var _this = this;

			if(!pid) {

				oBox.say('参数有误,异常操作!')
			}

			this.reqPrizeInfo(function(data){

				_this.pkid = data.prizeResult.prizeid;
				
				_this.nowPrize = data.prizeResult.prizeName;
				_this.nowPrizeName = data.prizeResult.prize;

				_this.reqPageInfo(data);

				_this.oMain.show();

				_this.oLoading.hide();

				//guaguaka	
				var oGuaguaka = new guaguaka({
					oWrap: $('[prize]')[0],
					width: 150,
					height: 40,
					onComplete: function() {
						_this.onEnd && _this.onEnd.call(_this);
					}
				});
				oGuaguaka.init();

				oGuaguaka.say( _this.nowPrize );

			});

		},
		onEnd: function() {

			//刮开后发请求改变状态
			var _this = this;
			var param = {};
			var info;

			param.pkActivity = pid;
			param.pkPrize = this.pkid;
			oBox.say('恭喜您中了' + _this.nowPrize);

			$.post('/rmrbh5/luckturntable/recordLuckyDraw', changeParam(param), function(data){

				info = JSON.parse(data.outJson);

				if(info.code == 'u001') {
					oBox.say('恭喜您中了' + _this.nowPrize);	
				} else {
					oBox.say(info.msg);
				}			
					
			},'json');

		},
		reqPrizeInfo: function(cb) {

			var _this = this;
			var param;
			param = {
				pkActivity: pid
			}

			$.post('/rmrbh5/luckturntable/luckturntable', changeParam(param), function(data){

				var info = JSON.parse(data.outJson);

				if(info.code == 's002') {
					
					//error
					_this.oLoading.html(info.msg);

				} else {

					console.log(info);

					if(info.data.isLuckyDraw == "Y") {

						var str = 
						'<div>'+
							'<p>已中奖项：'+ info.data.prizeResult.prizeName +'</p>'+
							'<p>对不起!你之前已经抽过奖了,不允许重复抽奖!</p>'+
						'</div>';

						_this.oLoading.html(str);

					}else {

						cb && cb(info.data);

					}
					
				}					

			}, 'json');	

		},
		reqPageInfo: function(data) {
			console.log(data);
			var i,
				num,
				newList,
				info;

			info = 	data.prizes;
			num = info.length;	

			this.oPrizeTitle.html(data.activity.activitytopic);
			this.oDetail.html(data.activity.activitycontent);

			for (i=0; i<num; i++) {
				newList = $('<p>'+ info[i].grade +'<span class="ml-10 mr-10">:</span>'+ info[i].prize +'</p>');
				this.oPrizeList.append(newList);
			}

		}
	}

	var oGua = new Gua();

	oGua.start();
	
});