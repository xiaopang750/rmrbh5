/**
 *description:自适应屏幕
 *author:fanwei
 *date:2014/09/29
 */
define(function(require, exports, module){
	
	var w = document.documentElement.clientWidth;
	var nowWidth = w * 0.95;
	var aChildren = $('[editor-wrap]').children();
	aChildren.css({
		width: nowWidth,
		margin: '0 auto'
	});
	
});