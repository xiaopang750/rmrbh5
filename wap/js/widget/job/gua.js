/**
 *description:刮刮卡
 *author:fanwei
 *date:2014/10/12
 */

/*
	var oGua = new Gua({
		oWrap: oHaha,
		width: 200,
		height: 30,
		setPrize: function(oPrize) {
			oPrize.style.background = '#f00';
			oPrize.innerHTML = '<p>中奖了</p>';

		} 
	});

	oGua.init();

*/

define(function(require, exports, module){
	
	function Gua(opts) {

		opts = opts || {};

		this.oWrap = opts.oWrap || null;

		this.ele = null;
		this.zIndex = opts.zIndex || 500;
		this.width = opts.width || 200;
		this.height = opts.height || 200;
		this.onComplete = opts.onComplete || null;
		this.lineWidth = opts.lineWidth || 10;
		this.coverColor = opts.coverColor || 'gray';
		this.setPrize = opts.setPrize || null;
		this.firstGuaOver = false;
		this.guaPercent = 0.75 //百分之75为刮开
		this.useragent = window.navigator.userAgent.toLowerCase();
		this.pc = this.isPc();

	}

	Gua.prototype = {

		init: function() {

			this.setWrap();
			this.createCanvas();
			this.setCanvas();
			this.events();

		},
		createCanvas: function() {

			this.ele = document.createElement('canvas');
			this.oWrap.appendChild(this.ele);
			this.gd = this.ele.getContext('2d');

		},
		setWrap: function() {

			this.setStyle(this.oWrap, {
				width: this.width + 'px',
				height: this.height + 'px',
				color: '#333'
			});

			this.l = this.offset( this.oWrap ).left;
			this.t = this.offset( this.oWrap ).top;

		},
		setCanvas: function() {

			this.ele.width = this.width;
	        this.ele.height = this.height;

			this.gd.fillStyle = this.coverColor;
			this.gd.fillRect(0, 0, this.width, this.height);
	        this.gd.lineWidth = this.lineWidth;

			this.setStyle(this.ele, {
				zIndex: this.zIndex,
				position: 'relative',
				left: 0,
				top: 0,
				margin: 0
			});

			var arrColor = this.gd.getImageData(0,0,this.width,this.height).data;
			this.rgbaTarget = arrColor[0] + ',' + arrColor[1] + ',' + arrColor[2] + ',' + arrColor[3];
			this.followPrize();

		},
		followPrize: function() {

			//添加奖品区域;
			this.oPrizeWrap = document.createElement('div');
			this.oPrize = document.createElement('span');
			this.oPrizeWrap.appendChild(this.oPrize);
			this.setStyle(this.oPrizeWrap, {
				width: this.width + 'px',
				height: this.height + 'px',
				left: 0,
				top: 0,
				position: 'absolute',
				zIndex: this.zIndex - 1,
				margin: 0
			});

			this.setPrize && this.setPrize(this.oPrize);

			this.oWrap.appendChild( this.oPrizeWrap );

		},
		events: function() {

			var _this = this;
			var disX,
				disY;

			this.ele.onmousedown =  function(e) {

				_this.fnDown(e);				

				document.onmousemove =  function(e) {

					_this.fnMove(e, _this.l, _this.t);

				};

				document.onmouseup = function(e) {

					_this.fnUp(e);

				};

				return false;

			};

			this.ele.addEventListener('touchstart', function(e){

				_this.fnDown(e);

				_this.ele.addEventListener('touchmove', function(e){
					_this.fnMove(e, _this.l, _this.t);
				}, false);

				_this.ele.addEventListener('touchend', function(e){
					_this.fnUp(e);
				}, false);

				e.preventDefault();
				e.stopPropagation();

			}, false);

		},
		bodyMove: function(e) {

			e.preventDefault();

		},
		fnDown: function(e) {

			document.body.addEventListener('touchmove', this.bodyMove , false);

			var oEvent = e.touches ? e.touches[0] : e;
			var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			var px = this.pc ? oEvent.clientX : oEvent.screenX;
			var py = this.pc ? oEvent.clientY : oEvent.screenY; 

			this.gd.globalCompositeOperation = 'destination-out';
			disX = oEvent.clientX - this.offset(this.oWrap).left + scrollLeft;
			disY = oEvent.clientY - this.offset(this.oWrap).top + scrollTop;

			this.gd.beginPath();
			this.gd.moveTo(disX, disY);

		},
		fnMove: function(e, disX, disY) {

			var oEvent = e.touches ? e.touches[0] : e;
			var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			var px = this.pc ? oEvent.clientX : oEvent.screenX;
			var py = this.pc ? oEvent.clientY : oEvent.screenY; 

			var x,
				y;

			x = oEvent.clientX - disX + scrollLeft;
			y = oEvent.clientY - disY + scrollTop;

			this.gd.lineTo(x, y);
			this.gd.stroke();

			this.fixAndroidbug();

		},
		fixAndroidbug: function() {

			//安卓4.0以上有的手机会有问题，刮不出来
			if (this.useragent.indexOf("android 4") > 0) {
				
				var color = this.getStyle(this.oWrap, 'color');
				
				if (color.indexOf("51") > 0) {

					this.oWrap.style.color = "rgb(50,50,50)";

				} else if(color.indexOf("50") > 0) {

					this.oWrap.style.color = "rgb(51,51,51)";
				}
			}

		},
		fnUp: function(e) {
			
			var _this = this;

			document.onmousemove = null;
			document.onmouseup = null;
			document.body.removeEventListener('touchmove', this.bodyMove , false);
			this.gd.closePath();
			this.judgeClearPercent(function(){
				
				_this.onComplete && _this.onComplete();

			});

		},
		judgeClearPercent: function(cb) {

			var arrColor = this.gd.getImageData(0,0,this.width,this.height).data;
			var i,
				num,
				arr,
				now,
				result,
				x,
				y,
				xJudge,
				yJudge,
				sum;

			num = arrColor.length/4;
			result = [];
			sum = this.recW * this.recH;

			for (i=0; i<num; i++) {

				x = (i % this.width) + 1;
				y = Math.floor(i/this.width) + 1;
				
				arr = [];
				arr.push(arrColor[i*4]);
				arr.push(arrColor[i*4 + 1]);
				arr.push(arrColor[i*4 + 2]);
				arr.push(arrColor[i*4 + 3]);
				now = arr.join(',');
				xJudge = x >= this.recL && x <= (this.recL + this.recW);
				yJudge = y >= this.recT && y <= (this.recT + this.recH);

				if(now != this.rgbaTarget && xJudge && yJudge) {

					result.push(now);
				}
			}

			if(result.length/sum > this.guaPercent) {

				//大于一定的刮开区域则执行刮开的回调函数;
				if(!this.firstGuaOver) {

					this.firstGuaOver = true;

					cb && cb();

				}
			}
		},
		setStyle: function(ele, json) {

			for (var i in json) {
				ele.style[i] = json[i];
			}

		},
		offset: function(ele) {

			var x,
				y;

			x = 0;
			y = 0;	

			while(ele) {

				x += ele.offsetLeft;
				y += ele.offsetTop;
				ele = ele.offsetParent;	
			}

			return  {
				left: x,
				top: y
			};

		},
		getStyle: function(ele, name) {

			if(ele.getCurrentStyle) {

				return ele.getCurrentStyle[name];
			} else {

				return getComputedStyle(ele, false)[name];
			}

		},
		isPc: function() {  

           var userAgentInfo = navigator.userAgent;  
           var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
           var flag = true;  
           for (var v = 0; v < Agents.length; v++) {  
               if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
           }  

           return flag;  
		},
		say: function(str) {

			this.oPrize.innerHTML = str;
			this.recW = this.oPrize.offsetWidth;
			this.recH = this.oPrize.offsetHeight;
			this.recL = this.oPrize.offsetLeft;
			this.recT = this.oPrize.offsetTop;
		}            


	};

	module.exports = Gua;
	
});