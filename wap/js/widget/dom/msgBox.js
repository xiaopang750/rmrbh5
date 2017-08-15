/**
 *description:消息弹框
 *author:fanwei
 *date:2014/10/12
 */
define(function(require, exports, module){
	
	require('../../../css/widget/msgBox.css');

	function Box(opts) {

		opts = opts || {};

		this.createBox();
		this.oBox = opts.oBox || $('[msg-box]');
		this.oClose = opts.oClose || $('[msg-close]');
		this.oConfirm = opts.oConfirm || $('[msg-confirm]');
		this.oMsg = opts.oMsg || $('[msg-text]');
		this.onshow = opts.onshow || null;
		this.onclose = opts.onclose || null;
		this.speed = opts.speed || 700;
	}

	Box.prototype = {

		init: function() {

			this.events();

		},
		createBox: function() {

			var html = 
			'<div class="window clearfix" msg-box>' +
				'<div id="title" class="title clearfix">' +
					'消息提醒<span class="close" msg-close></span>' +
				'</div>' +
				'<div class="content clearfix">' +
				 	'<div id="txt" msg-text></div>' +
				 	'<input type="button" value="确定" id="windowclosebutton" name="确定" class="txtbtn" msg-confirm>' +
				'</div>' +
			'</div>';

			$('body').append( $(html) );

		},
		say: function(str) {

			this.show();
			this.oMsg.html(str);
		},
		events: function() {

			var _this = this;

			this.oClose.on('touchstart', function(){

				_this.close();
				_this.onshow && _this.onshow();

			});

			this.oConfirm.on('touchstart', function(){

				_this.close();
				_this.onclose && _this.onclose();

			});

		},
		show: function() {

			var	nHeight,
				_this;

			nHeight = 150;
			_this = this;

			this.clearTransition();

			this.oBox.css({
				height: 0,
				opacity: 1
			});

			this.oBox.show();

			this.startTransition();

			setTimeout(function(){

				_this.oBox.css({
					height: nHeight
				});

			},0);
		},
		close: function() {

			var _this = this;

			this.oBox.css({
				opacity:0,
				height:0,
			});

			setTimeout(function(){

				_this.oBox.hide();

			}, this.speed);

		},
		startTransition: function() {

			$.css3(this.oBox, {
				transition: this.speed + 'ms'
			});

		},
		clearTransition: function() {

			$.css3(this.oBox, {
				transition: 'none'
			});

		}

	}

	module.exports = Box;
	
});