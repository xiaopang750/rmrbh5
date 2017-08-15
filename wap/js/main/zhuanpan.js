/**
 *description:大转盘
 *author:fanwei
 *date:2014/10/15
 */

define(function(require, exports, module){
	require('../global/sum');
	var changeParam = require('../global/changeParam');
	var msgBox = require('../widget/dom/msgBox');
	var oRoll = document.getElementById('circle');
	var oPoint = document.getElementById('point');
	var bodyParse = require('../widget/http/bodyParse');
	var pageInfo = bodyParse();
	var pid = pageInfo.pkActivity ?  pageInfo.pkActivity : "";
	var oid;
	var aid;
	var pkid,
		oBox;

	function Circle(opts) {

		opts = opts || {};
		this.cir = opts.cir;
		this.point = opts.point;
		this.allLevel = opts.allLevel || 12;
		this.nowLevel = null;
		this.speed = opts.speed || 6000;
		this.lock = false;
		this.onEnd = null;
		this.onStart = null;
		this.map = {
			"一等奖": 2,
			"二等奖": 4,
			"三等奖": 6,
			"四等奖": 8,
			"五等奖": 10,
			"六等奖": 12,
			"其他": 1
		}

		this.r = 110;
		this.offset = 150;

		this.oGradeWrap = $('[grade-wrap]');
		this.oPrizeList = $('[prize-list]');
		this.oDetail = $('[prize-issue]');
		this.oPrizeTitle = $('[prize-title]');
		this.oLoading = $('[loading]');
		this.oMain = $('[main]');

	}

	Circle.prototype = {

		start: function() {

			var _this = this;

			if(!pid) {

				oBox.say('参数有误,异常操作!')
			}

			this.reqPrizeInfo(function(data){
				data = {
					prizes: [
						{grade: 1, prize: 2}
					],
					prizeResult: {
						prizeid: 1,
						prizeName: '22',
						prize: '1'
					}
				}
				_this.positionGrade(data.prizes);

				_this.pkid = data.prizeResult.prizeid;
				
				_this.nowPrize = data.prizeResult.prizeName;
				_this.nowPrizeName = data.prizeResult.prize;

				_this.init();

				_this.reqPageInfo(data);

				_this.events();

				_this.oMain.show();

				_this.oLoading.hide();

			});

		},
		reqPrizeInfo: function(cb) {

			var _this = this;
			var _param = {
				pkActivity: pid
			};
			var param = changeParam(_param);
			cb();
			return;

			// $.post('/rmrbh5/luckturntable/luckturntable', param, function(data){

			// 	var info = JSON.parse(data.outJson);

			// 	if(info.code == 's002') {

			// 		//error
			// 		_this.oLoading.html(info.msg);

			// 	} else {

			// 		if(info.data.isLuckyDraw == "Y") {

			// 			var str = 
			// 			'<div>'+
			// 				'<p>已中奖项：'+ info.data.prizeResult.prizeName +'</p>'+
			// 				'<p>对不起!你之前已经抽过奖了,不允许重复抽奖!</p>'+
			// 			'</div>';

			// 			_this.oLoading.html(str);
						
			// 		}else {
			// 			cb && cb(info.data);	
			// 		}
					
			// 	}					

			// 	//$('.grade').eq(0).css('WebkitTransform', 'rotate(30deg)')


			// }, 'json');	

		},
		positionGrade: function(arr){

			var sum = (arr.length - 1);
			var last = arr[arr.length - 1];
			var newArr;

			newArr = [];

			for (var j=0; j<sum; j++) {

				newArr.push(arr[j]);
				newArr.push(last);	
			}

			var i,
				num,
				x,
				y,
				newDiv,
				newList,
				deg;

			num = newArr.length;

			for (i=0; i<num; i++) {

				newDiv = $('<div class="grade"><p>'+ newArr[i].grade +'</p><p>'+ newArr[i].prize +'</p></div>');
				x = this.r * Math.sin( ((360/num*i)+(360/num/2))*(Math.PI/180))  + this.offset - 70/2;
				y = this.r * Math.cos( ((360/num*i)+(360/num/2))*(Math.PI/180))  + this.offset - 50/2;
				deg = 360- ((360/num*i)+(360/num/2));

				$.css3(newDiv, {
					'transform': 'translateX('+ x +'px) translateY('+ y +'px) rotate('+ deg +'deg)'
				});

				this.oGradeWrap.append(newDiv);
			}

		},
		init:function() {

			this.initDeg;

			this.initDeg = - (1/this.allLevel * 360)/2; 

			this.clearTransition();

			this.rotate( this.initDeg );

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

		},
		refresh: function(level) {

			this.nowLevel = level;

		},
		startRoll: function() {

			var targetDeg;

			targetDeg = ( ( this.nowLevel - 1 )/this.allLevel * 360 ) + 1800 + this.initDeg;

			this.rotate( targetDeg );

		},
		events: function() {

			var _this = this;
			var timer;

			$(this.point).on('touchstart', function(){

				if( !_this.lock ) {

					/*
						$.post('提交地址', '参数', function(data){
	
							当后台响应nowlevel后执行以下的所有方法;

						}, 'json');
						
					*/

					_this.nowLevel = _this.map[_this.nowPrize];

					_this.lock = true;

					_this.init();
					
					setTimeout(function(){
						_this.startTransition();
						_this.startRoll();
					},50);
					
					clearTimeout( timer );
					timer = setTimeout(function(){

						//_this.lock = false;

						_this.reqCircleEnd();

						
						_this.onEnd && _this.onEnd();

					},_this.speed);
							

				} else {
					oBox.say('对不起您已抽过奖了');
				}				

			});

		},
		reqCircleEnd: function(cb){

			var _this = this;
			var _param = {};
			var param;
			var info;

			_param.pkActivity = pid;
			_param.pkPrize = this.pkid;
			param = changeParam(_param);

			$.post('/rmrbh5/luckturntable/recordLuckyDraw', param, function(data){

				info = JSON.parse(data.outJson);

				if(info.code == 'u001') {
					oBox.say('恭喜您中了' + _this.nowPrizeName);	
				} else {
					oBox.say(info.msg);
				}			
					
			},'json');

		},
		clearTransition: function() {

			this.cir.style.WebkitTransition = 'none';
			this.cir.style.MozTransition = 'none';
			this.cir.style.OTransition = 'none';
			this.cir.style.msTransition = 'none';
			this.cir.style.transition = 'none';

		},
		startTransition: function() {

			this.cir.style.WebkitTransition = this.speed + 'ms';
			this.cir.style.MozTransition = this.speed + 'ms';
			this.cir.style.OTransition = this.speed + 'ms';
			this.cir.style.msTransition = this.speed + 'ms';
			this.cir.style.transition = this.speed + 'ms';

		},
		rotate: function(deg){

			var _this = this;

			_this.cir.style.WebkitTransform = 'rotate('+ deg +'deg)';
			_this.cir.style.MozTransform = 'rotate('+ deg +'deg)';
			_this.cir.style.OTransform = 'rotate('+ deg +'deg)';
			_this.cir.style.msTransform = 'rotate('+ deg +'deg)';
			_this.cir.style.transform = 'rotate('+ deg +'deg)';

		}
	}


	/*
		@param cir: 装盘容器
			   point: 指针
			   allLevel: 所有种类的奖
			   nowLevel: 当前这次种的奖
			   speed: 转速
			   Circle类提供一个 onstart和onend 的 装盘开始 和转盘结束的函数;
		逻辑：
			
			1.当点击开始时用 ajax 请求后台的一个接口 由后台 根据概率计算 当前得的是 几等奖;

			2.当转盘结束的时候发送 当前 得的是几等奖 传给后台 , 后台验证 前台传的几等奖 与刚才后台计算得到的几等奖 对比是否相同，如果相同则合法，不同则非法操作。
		
			如:
			1.当前转盘有12种类型的奖项,
			2.请求后台接口返回 1-12的整数 代表当前获得的奖项,

			注:
			1.转盘图片的奖项与allLevel对应,
			2.奖项没有重复，全部不相同。
	*/


	

	
	/* 调用 */

	oBox = new msgBox();
	oBox.init();

	var oCircle = new Circle({
		cir: oRoll,
		point: oPoint,
		allLevel: 12,
		speed: 2000
	});

	oCircle.start();

	oCircle.onEnd = function() {

		

	};

	oCircle.onStart = function() {

		oCircle.nowLevel = 1//rnd( 12, 1 );
	};

});