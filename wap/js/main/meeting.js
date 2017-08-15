/**
 *description:会议邀约
 *author:fanwei
 *date:2014/10/12
 */

define(function(require, exports, module){
	
	require('../global/sum');
	var hammer = require('../lib/hammer/hammer');
	var template = require('../lib/template/template');
	var bodyParse = require('../widget/http/bodyParse');
	var changeParam = require('../global/changeParam');
	//var viewScore = require('../view_socre');
	
	function Chat() {

		this.iNow = 0;
		this.speed = 700;
		this.scaleHeadSpeed = 500;
		this.oPageWrap = $('[page-wrap]');
		this.oPageInfo = bodyParse();
		this.timer = null;

	}

	Chat.prototype = {

		init: function() {

			var _this = this;

			this.loadPage(function(){

				_this.aLayer = $('[data-role = layer]');
				_this.max = _this.aLayer.length;
				_this.oUp = $('[data-role = up]');
				_this.oDown = $('[data-role = down]');
				_this.oSign = $('[sign]');
				_this.lock = false;
				_this.firstLoad = false;

				if(_this.model == 'model_01') {
					_this.type1();
				} else if(_this.model == 'model_02') {
					_this.type2();
				}	
				
			});
		},
		type1: function() {

			this.initLay();
			this.events();
			this.createPersonInfo();

		},
		type2: function() {

			var _this = this;

			$('body').attr('ontouchmove', '');

			this.oSign.on('click', function(){

				_this.sign($(this));

			});	

		},
		loadPage: function(cb) {

			var _this = this;
			var info,
				id,
				param;

			id = this.oPageInfo.pkActivity || 445;
			param = {
				pkActivity:id, 
				openid:this.oPageInfo.openid, 
				accountid:this.oPageInfo.accountid
			};	

			$.post('/rmrbh5/activity/findMeetingFile', changeParam(param), function(data){

				info = JSON.parse(data.outJson).data;

				_this.model = info.model;
				
				var html = template(info.model, info);

				_this.oPageWrap.html(html);

				cb && cb();

			},'json');

		},
		events: function() {

			var _this = this;
			var oNow,
				dis,
				dir;

			$('[data-role = layer]').hammer().on('dragup', function(e){
				
				if(_this.iNow == (_this.max-1) || _this.iNow == 0) {
					_this.lock = false;
				}

				if(!_this.lock) {

					_this.lock = true;

					dis = e.gesture.distance;
					dir = e.gesture.direction;
					_this.pageNext( $(this) );

				}

				return false;

			});	


			$('[data-role = layer]').hammer().on('dragdown', function(e){
				
				if(_this.iNow == (_this.max-1) || _this.iNow == 0) {
					_this.lock = false;
				}

				if(!_this.lock) {

					_this.lock = true;

					dis = e.gesture.distance;
					dir = e.gesture.direction;
					_this.pagePrev( $(this) );

				}

				return false;

			});	

			//sign
			this.oSign.on('click', function(){

				_this.sign($(this));

			});	

			//up-click
			this.oUp.on('touchstart', function(){

				_this.pageNext( _this.aLayer.eq(_this.iNow) );

			});

			//down-click
			this.oDown.on('touchstart', function(){

				_this.pagePrev( _this.aLayer.eq(_this.iNow) );	

			});

			//头像放大
			$(document).on('touchstart', '[scale-head]', function(){

				_this.scaleBigHead($(this));

			});				

		},
		scaleBigHead: function(oThis) {

			var l,
				t,
				src,
				w,
				h,
				mt,
				ml,
				realWidth,
				realHeight,
				scale,
				winWidth,
				winHeight,
				_this,
				name,
				content;

			_this = this;
			l = oThis.offset().left;
			t = oThis.offset().top;
			src = oThis.attr('src');

			w = oThis.width();
			h = oThis.height();
			winWidth = $(window).width();
			winHeight = $(window).height();
			name = oThis.attr('name');
			content = oThis.attr('content');

			scale = w/h;	
			realWidth = winWidth;
			realHeight = realWidth / scale;
			mt = (winHeight - realHeight)/2;
			ml = 0;

			this.createImage(src, l, t, w, h);

			this.firstLoad = true;

			setTimeout(function(){

				_this.oSacleImage.css({
					width: realWidth,
					height: realHeight,
					opacity: 1
				});

				$.css3(_this.oSacleImage, {
					transform: 'translateX(0) translateY('+ mt +'px)'
				});

			},0);

			this.oUp.hide();
			this.oDown.hide();

			this.oPersonInfo.html(name);
			this.oPersonContent.html(content);
			this.oPersonInfo.show();
			this.oPersonContent.show();

		},
		createPersonInfo: function() {

			this.oPersonInfo = $('<div></div>');
			this.oPersonContent = $('<div></div>');

			this.oPersonInfo.css({
				position: 'absolute',
				left: 0,
				top: '10px',
				width: '100%',
				textAlign: 'center',
				zIndex: 5000,
				color:'#fff',
				display: 'none',
				fontSize: '18px'
			});

			this.oPersonContent.css({
				position: 'absolute',
				left: 0,
				top: '40px',
				width: '90%',
				textAlign: 'left',
				textIndent: '24px',
				zIndex: 5000,
				color:'#fff',
				display: 'none',
				marginLeft: '-45%',
				left: '50%',
				lineHeight: '23px'
			});


			$('body').append(this.oPersonInfo);
			$('body').append(this.oPersonContent);

		},
		scaleSmallHead: function() {

			var l,
				t,
				w,
				h,
				_this;

			_this = this;
			l = parseInt( this.oSacleImage.attr('orgLeft') );
			t = parseInt( this.oSacleImage.attr('orgTop') );
			w = parseInt( this.oSacleImage.attr('orgWidth') );
			h = parseInt( this.oSacleImage.attr('orgHeight') );

			setTimeout(function(){

				_this.oSacleImage.css({
					width: w,
					height: h,
					opacity: 0
				});

				$.css3(_this.oSacleImage, {
					transform: 'translateX('+ l +'px) translateY('+ t +'px)'
				});

			},1);

			setTimeout(function(){

				_this.oSacleImage.hide();
				_this.oUp.show();
				_this.oDown.show();
				_this.oHeadLayer.hide();

			}, this.scaleHeadSpeed);

			this.oPersonInfo.hide();
			this.oPersonContent.hide();

		},
		createImage: function(src,l,t, w, h) {

			var _this,
				oImage;

			_this = this;
			oImage = new Image();

			if(!this.firstLoad) {

				this.oSacleImage = $('<img></img>');

				this.oSacleImage.on('touchstart', function(){

					_this.scaleSmallHead($(this));

				});

				$('body').append(this.oSacleImage);

				$.css3(this.oSacleImage, {
					transition: this.scaleHeadSpeed + 'ms'
				});

				this.createHeadLayer();

			}

			this.oHeadLayer.show();
			this.oSacleImage.attr('src', src);
			this.oSacleImage.show();
			this.oSacleImage.css({
				width: w,
				height: h,
				zIndex: 10,
				position: 'absolute'
			});

			$.css3(this.oSacleImage, {
				transform: 'translateX('+ l +'px) translateY('+ t +'px)'
			});

			this.oSacleImage.attr({
				orgLeft: l,
				orgTop: t,
				orgWidth: w,
				orgHeight: h
			});

		},
		createHeadLayer: function() {

			this.oHeadLayer = $('<div></div>');

			this.oHeadLayer.css({
				width: '100%',
				height: '100%',
				position: 'absolute',
				left: 0,
				top: 0,
				zIndex: 9,
				background: 'rgba(0, 0 , 0, 0.8)',
				display: 'none'
			});

			$('body').append(this.oHeadLayer);

		},
		sign: function(oThis) {

			var aInput = oThis.parents('[data-role = layer]').find('[sub]');
			var i,
				num,
				result,
				param;

			num = aInput.length;
			result = true;
			param = {};

			for (i=0; i<num; i++) {

				if(!aInput[i].value) {
					result = false;
				} else {
					param['sign.' + aInput.eq(i).attr('name')] = aInput[i].value;
				}
			}

			if(!result) {
				alert('请完整填写');
				return;
			} else {

				param['sign.signChannel'] = this.oPageInfo.channel;
				param['sign.pkActivity'] = this.oPageInfo.pkActivity;
				param['pkActivity'] = this.oPageInfo.pkActivity;
				
			}

			$.post('/rmrbh5/activity/addSign', changeParam(param), function(data){

				alert(JSON.parse(data.outJson).msg);

			}, 'json');

		},
		pageNext: function(oNow) {

			var _this = this;
			var oNext = oNow.next();

			this.iNow ++;

			if( this.iNow > this.max - 1 ) {

				this.iNow = this.max - 1;

				return;

			}

			this.move(oNow, '-100%', function(){

				_this.judge(oNext);

			});

			if( this.iNow == this.max - 1 ) {

				this.oDown.show();
				this.oUp.hide();

			} else {

				this.oUp.show();
				this.oDown.show();
			}
			
		},
		pagePrev: function(oNow) {

			var _this = this;

			this.iNow --;

			if( this.iNow < 0 ) {

				this.iNow = 0;

				return;

			}

			var oPrev = oNow.prev();

			this.move(oPrev, 0, function(){

				_this.judge(oPrev);

			});

			if( this.iNow == 0 ) {

				this.oUp.show();
				this.oDown.hide();

			} else {

				this.oUp.show();
				this.oDown.show();
			}

		},
		initLay: function() {

			var _this,
				nowIndex;

			_this = this;
			this.aLayer.each(function(i){

				nowIndex = _this.aLayer.eq(i).attr('pageIndex');
				_this.aLayer.eq(i).css('zIndex', nowIndex);
				_this.aLayer.eq(i).show();

			});

			this.startTransition();
			this.oDown.hide();

		},
		move: function(obj, dis, cb) {

			var _this = this;

			setTimeout(function(){

				$.css3(obj, {
					transform:'translateY('+ dis +')'
				});

			},1);

			setTimeout(function(){

				cb && cb();

				_this.lock = false;

			},this.speed);

		},
		startTransition: function() {

			var _this = this;

			this.aLayer.each(function(i){

				$.css3( _this.aLayer.eq(i), {

					'transition': _this.speed + 'ms'

				});

			});

		},
		stopTransition: function() {

			var _this = this;

			this.aLayer.each(function(i){

				$.css3( this.aLayer.eq(i), {

					'transition': 'none'

				});

			});

		},
		judge: function(oNow) {

			var _this = this;

			if(this.model == 'model_01') {

				clearTimeout(this.timer);
				this.timer = setTimeout(function(){

					oLayEffect.page2Init();
					oLayEffect.page3Init();

					if( oNow.attr('pageIndex') == 5 ) {

						oLayEffect.page2();

					} else if( oNow.attr('pageIndex') == 4 ) {

						oLayEffect.page3();

					}

				},10);
				
			}

		}

	};


	function LayEffect() {

		this.aFade = $('[sc = fadeList]');
		this.oPage3Left = $('[sc = page3-left]');
		this.oPage3Right = $('[sc = page3-right]');
	}

	LayEffect.prototype = {

		page2: function() {
			
			var i,
				num,
				timer,
				count,
				_this;

			this.aFade.css('opacity', '0');
			num = this.aFade.length;
			count = 0;
			_this = this;

			timer = setInterval(function(){

				_this.aFade.eq(count).animate({opacity: 1});
				count ++;

				if( count > num -1 ) {

					clearInterval(timer);
					return;
				}

			},100);

		},
		page2Init: function() {

			this.aFade = $('[sc = fadeList]');

			this.aFade.css('opacity', '0');
		},
		page3: function() {
			
			$.css3(this.oPage3Right, {
				'transform': 'translateX(0)',
				'transition': '1s'
			});

			$.css3(this.oPage3Left, {
				'transform': 'translateX(0)',
				'transition': '1s'
			});

		},
		page3Init: function() {

			this.oPage3Left = $('[sc = page3-left]');
			this.oPage3Right = $('[sc = page3-right]');

			$.css3(this.oPage3Right, {
				'transition': 'none'
			});

			$.css3(this.oPage3Left, {
				'transition': 'none'
			});

			$.css3(this.oPage3Right, {
				'transform': 'translateX(200%)'
			});

			$.css3(this.oPage3Left, {
				'transform': 'translateX(-200%)'
			});

		}

	};

	var oChat = new Chat();
	var oLayEffect = new LayEffect();

	oChat.init();

});