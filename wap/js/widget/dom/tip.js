/*
 *description:提示框
 *author:fanwei
 *date:2014/05/19
 */

/*
	提供一个say方法供外部调用;

	oTip = new Tip();

	oTip.say("哈哈");
*/ 

define(function(require, exports, module){
	
	 function Tip() {

	 	this.timer = null;
	 	this.hideTime = 3000;

	 }

	 Tip.prototype = {

	 	create: function() {

	 		this.oWrap = $('<div><span></span></div>');
	 		this.oWrap.css({
	 			
	 			position:'fixed',
	 			left:'0',
	 			bottom:'30px',
	 			width:'100%',
	 			height:'32px',
	 			textAlign:'center',
	 			zIndex:8000,
	 			display:'none'
	 		});

	 		this.oTip = this.oWrap.children().eq(0);

	 		this.oTip.css({
	 			height:'32px',
	 			lineHeight:'32px',
	 			borderTop:'1px solid #aaaaab',
	 			borderBottom:'1px solid #b98710',
	 			borderLeft:'1px solid #b98710',
	 			borderRight:'1px solid #b98710',
	 			borderRadius: '5px',
	 			color:'#fff',
	 			fontSize:'14px',
	 			padding:'0 20px',
	 			background:'#eaa000',
	 			display:'none'
	 		});

	 		$('body').append( this.oWrap );

	 	},
	 	say: function(str) {

	 		var _this = this;

	 		clearTimeout( this.timer );
	 		this.oTip.html( str );
	 		this.show();
	 		this.timer = setTimeout(function(){

	 			_this.hide();

	 		},this.hideTime);

	 	},
	 	show: function() {

	 		this.oWrap.show();
	 		this.oTip.css('opacity', '1');
	 		this.oTip.css('display','inline-block');

	 	},
	 	hide: function() {

	 		var _this = this;

	 		/*this.oTip.fadeOut(function(){

	 			

	 		});*/
	 		this.oTip.animate({
	 			opacity: 0
	 		}, function(){
	 			_this.oWrap.hide();
	 		});

	 	}

	 }

	 var oTip = new Tip();

	 oTip.create();

	 module.exports = oTip;

});



