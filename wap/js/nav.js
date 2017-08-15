define(function(require, exports, module){
	
	var iScroll = require('./lib/iscroll/iscroll');

	var aNav,
		oUl,
		i,
		num,
		sum,
		winWidth;

	aNav = $('[nav-list]');

	oUl = $('[nav-list-wrap]');
	num = aNav.length;
	sum = 0;
	winWidth = $(window).width();

	for (i=0; i<num; i++) {

		sum += aNav.eq(i).width();
	}

	if(sum > winWidth) {
		oUl.css('width', sum + 1);
		doScroll();
	} else {
		
		noScroll();
	}

	function noScroll() {
		oUl.addClass('box');
		aNav.addClass('noscroll');
		aNav.addClass('flex1');
	}

	function doScroll() {
		var oScroll = new iScroll('nav-wrap', {
			hScroll: true,
			vScroll: false
		});
	}
	
});