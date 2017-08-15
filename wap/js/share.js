/**
 *description:分享
 *author:fanwei
 *date:2014/09/07
 */
define(function(require, exports, module){
	
	var bodyParse = require('./widget/http/bodyParse');
	var info = bodyParse();

	var accountid = info.accountid ? info.accountid : '';
	var openid = info.openid ? info.openid : '';

	function Share(opts) {

		opts = opts || {};
		this.speed = 500;
		this.btnUrl = 'img/global/more.png';
		this.shareUrl = 'img/global/fenxiang.png';
		this.infoUrl = 'img/global/info.png';

		this.targetOpa = 1;
		this.layHeight = 100;
		this.opaTime = 500;
		this.isSlide = false;
		this.linkInfo = '/rmrbh5/wap/info.html?accountid='+ accountid +'&openid=' + openid;

	}

	Share.prototype = {

		init: function() {

			this.aDo = [];
			this.oImage = this.createImage(this.btnUrl, '10px', '10%', 3, 0.5, '0', '0', '');
			this.oShare = this.createImage(this.shareUrl, '12px', '10%', 2, 0, '30px','30px', 'share');
			this.oInfo = this.createImage(this.infoUrl, '5px', '10%', 1, 0, '37px','-34px', 'info');
			
			this.oInfo.css('width', 28);
			this.oImage.show();
			this.events();
			this.postSum();	

		},
		createImage: function(url, l, b, index, opa, moveX, moveY, name) {

			var _this = this;

			var oImage = new Image();

			oImage.onload = function() {

				_this.setBtn(oImage, _this.width, _this.height, l, b, index, opa, moveX, moveY, name)
			};

			oImage.src = url;
			oImage = $(oImage);

			$('body').append(oImage);
			oImage.hide();

			this.aDo.push(oImage);

			return oImage;

		},
		setBtn: function(oImage, w, h, l, b, index, opa, moveX, moveY, name) {

			$(oImage).css({
				position: 'fixed',
				left: l,
				bottom: b,
				w: w,
				h: h,
				zIndex: index,
				marginTop: -h/2,
				opacity: opa
			});

			$(oImage).attr({
				'orgopa': opa,
				'moveX': moveX,
				'moveY': moveY,
				"do": "yes",
				"link": name
			});

			$.css3(oImage, {
				'transition': this.opaTime + 'ms'
			});

		},
		events: function() {

			var _this = this;

			this.oImage.on('touchstart', function(){
				
				if(!_this.isSlide) {
					_this.showShareLay();
				} else {
					_this.hideShareLay();
				}
				return false;

			});

			$(document).on('touchstart', function(e){

				var isLay = e.target.hasAttribute('show-lay');

				if(isLay) return;

				if(_this.isSlide) {
					_this.hideShareLay();
					_this.hideImage();	
				}

			});

			//share
			$(document).on('touchstart', '[link = share]', function(e){

				var title = $('title').html();
				var rLink = window.location.href;

				_this.shareTSina(title, rLink, '', '');

				return false;

			});

			$(document).on('touchstart', '[link = info]', function(e){
				
				window.location = _this.linkInfo;

				return false;

			});

		},
		hideImage: function() {

			this.oImage.css({
				opacity: this.orgOpa
			});

		},
		showShareLay: function() {

			this.oShare.show();
			this.oInfo.show();

			var moveX,
				moveY,
				_this,
				i,
				num;

			num = this.aDo.length;

			for (i=0; i<num; i++) {
				moveX = this.aDo[i].attr('moveX');
				moveY = this.aDo[i].attr('moveY');

				$.css3(this.aDo[i], {
					transform : 'translateX('+ moveX +') translateY('+ moveY +')'
				});

				this.aDo[i].css({
					opacity: this.targetOpa
				});
			}


			this.isSlide = true;

		},
		hideShareLay: function() {

			var orgOpa,
				_this,
				i,
				num;

			num = this.aDo.length;
			_this = this;
			
			for (i=0; i<num; i++) {
				orgOpa = this.aDo[i].attr('orgopa');

				$.css3(this.aDo[i], {
					transform : 'translateX(0) translateY(0)'
				});

				this.aDo[i].css({
					opacity: orgOpa
				});
			}

			setTimeout(function(){

				_this.oShare.hide();
				_this.oInfo.hide();
				_this.isSlide = false;

			}, this.opaTime)

		},
		shareTSina: function(title,rLink,site,pic){

			window.open('http://service.weibo.com/share/share.php?title='+encodeURIComponent(title)+'&url='+encodeURIComponent(rLink)+'&appkey='+encodeURIComponent(site)+'&pic='+encodeURIComponent(pic),'_blank','scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes')
		},
		postSum: function() {

			//统计流量
			var info;
			info = bodyParse();

			$.post('/rmrbh5/mobilesite/mobileVisit', {pageId: info.pkPage, accountid: info.accountid, openid:info.openid});

		} 

	}
	
	var oSharea = new Share();
	oSharea.init();
});