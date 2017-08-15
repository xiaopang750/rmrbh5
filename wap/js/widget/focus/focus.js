/*
 *description:focus
 *author:fanwei
 *date:2014/2/19
 */
define(function(require, exports, module){
	
	require('../../lib/hammer/hammer');
	require('../../lib/underscore/underscore');


	function Focus( opts ) {

		opts = opts || {};
		this.oWrap = opts.oWrap || null;
		this.oDataWrap = this.oWrap.find('[widget-role = focus-data-wrap]') || null;
		this.oDotWrap = this.oWrap.find('[widget-role = focus-dot-wrap]') || null;
		this.requestType = opts.requestType || 'post';
		this.speed = opts.speed || 500;
		this.auto = opts.auto ? true : false;
		this.cycle = opts.cycle ? true : false;
		this.roudTime = opts.roudTime || 5000;
		this.url = opts.url || '';
		this.param = opts.param || null;
		this.type = opts.type || 'get';
		this.compailed = opts.compailed || '<%_.each(data, function(focus){%><li><img src="<%=focus.slide_pic%>" link="<%=focus.slide_url%>"/></li><%})%>';
		this.orgWidth = this.oWrap.attr('widget-width') == '100%' ? document.documentElement.clientWidth : this.oWrap.attr('widget-width');
		this.orgHeight = this.oWrap.attr('widget-height') == '100%'? document.documentElement.clientHeight : this.oWrap.attr('widget-height');
		this.scale = this.oWrap.attr('widget-scale');
		this.sensity = opts.sensity || 50;
		this._start = 0;
		this._iNow = 0;
		this._wrapWidth = 0;
		this.timer = null;
		this.roundTimer = null;
		this._ORIENT_DELAY = 500;
		this._ORGDOTBG = "#fff";
		this._ACTDOTBG = "#ff5000";
		this.lock = false;

	}

	Focus.prototype = {

		init: function() {
			
			this.load();
		},
		addEvent: function() {
			
			var _this = this;

			this.oWrap.hammer().on('touch dragleft dragright dragend tap', function(e){

				if ( _this.lock ) return;

				switch( e.type ) {

					case 'touch' :

						clearInterval( _this.roundTimer );

						_this.css3(_this.oDataWrap, {

							transition: 'none'

						});

					break;

					case 'dragleft' :

						var dir;
						dir = e.gesture.direction;
						e.gesture.preventDefault();
						_this.dragmove(_this.oDataWrap, e, dir);
					break;

					case 'dragright' :

						if( _this.num == 2 ) return;
						var dir;
						dir = e.gesture.direction;
						e.gesture.preventDefault();
						_this.dragmove(_this.oDataWrap, e, dir);
					break;

					case 'dragend' :
							_this.lock = true;

							var ev,
								delta,
								dir;

							ev = e.gesture;
							delta = ev.deltaX;
							dir = ev.direction;	

							_this.judge(delta, dir);
							if( _this.auto ) _this.autoPlay();	
						
					break;

					case 'tap' :

						if( e.srcElement ) {

							var url = e.srcElement.getAttribute('link');						

							if ( url ) {

								window.location = url;	

							}	

						}
						 
					break;
				}

			});

			window.onorientationchange = function(){

				clearTimeout(_this.timer);

				_this.timer = setTimeout(function(){

					_this.setStyle(_this.num);

					_this.setDotWrap();

					_this.css3(_this.oDataWrap, {
						'transition': 'none',
						'transform': 'translateX(0)'

					});

					if( _this.auto ) _this.autoPlay();

				}, _this._ORIENT_DELAY);
				
			};
		},
		dragmove: function(obj, event, dir) {

			if( !this.cycle ) {

				if( dir == 'left' ) {

					if( this._iNow >= this._aLi.length - 1 ) {

						return;

					} 

				} else if( dir == 'right' ) {

					if( this._iNow == 0 ) {

						return;

					}

				}

			}

			var dis,
			delta;

			delta = event.gesture.deltaX;
			dis = delta;

			this.css3(obj, {

				transform: 'translateX('+ dis +'px)'

			});
			
		},
		autoPlay: function() {

			var _this = this;

			clearInterval( this.roundTimer );

			this.roundTimer = setInterval(function(){

				_this.judge( _this.sensity+1, 'left' );

			}, this.roudTime);

		},
		judge: function(delta, dir) {

			if( Math.abs(delta) > this.sensity ) {

				if ( dir=="left" ) {

					this._iNow ++;

					if( this._iNow == this._aLi.length ) {

						if( !this.cycle ) {

							this._iNow = this._aLi.length - 1;

							this.lock = false;

							return;

						} else {

							this._iNow = 0;

						}

					}

					this.animate( -this._wrapWidth );

				} else {

					this._iNow --;

					if( this._iNow == -1 ) {

						if( !this.cycle ) {

							this._iNow = 0;

							this.lock = false;

							return;

						} else {

							this._iNow = this._aLi.length-1;

						}
						
					}

					this.animate( this._wrapWidth );

				} 
			} else {

				this.animate( 0 );

			}

		},
		animate: function(dis){

			var _this = this;

			_this.css3(this.oDataWrap, {

				transition : this.speed + 'ms',
				transform: 'translateX('+ dis + 'px)'

			});

			setTimeout(function(){

				_this._aDot.eq( _this._iNow ).css('background', _this._ACTDOTBG).siblings().css('background', _this._ORGDOTBG);

				_this.postion( _this._aLi );

				_this.lock = false;

			},this.speed);

		},
		setStyle: function(num) {

			var wrapData,
				wrapWidth,
				wrapHeight;

			wrapData = this.calc();	
			wrapWidth = wrapData.w;
			wrapHeight = wrapData.h;
			this._wrapWidth = wrapWidth;
			this._aLi = this.oDataWrap.children();

			this.oWrap.css({
				width: wrapWidth + 'px',
				height: wrapHeight + 'px',
				position: 'relative',
				overflow: 'hidden'
			});

			this._aLi.css({
				width: wrapWidth + 'px',
				height: wrapHeight + 'px',
				position: 'absolute',
				top: 0
			});

			this.oDataWrap.find('img').css({
				width: '100%',
				height: '100%',
				display: 'block'
			});

			this.oDataWrap.css({
				position: 'relative'
			});

			if ( num == 1 ) return;

			this.postion( this._aLi );
		},
		postion: function(aLi) {

			this.css3(this.oDataWrap, {

				transition : 'none',
				transform: 'translateX(0)'

			});

			aLi.hide();

			aLi.eq(this._iNow%aLi.length).show();
			aLi.eq(this._iNow%aLi.length).css({
				left: 0
			});

			this.getPrev(aLi).css({
				left: -this._wrapWidth + 'px',
				display: 'block'
			});

			this.getNext(aLi).css({
				left: this._wrapWidth + 'px',
				display: 'block'
			});

		},
		getPrev: function(aLi) {

			return aLi.eq( (this._iNow + aLi.length - 1) % aLi.length ) ;

		},
		getNext: function(aLi) {

			return aLi.eq( (this._iNow + 1) % aLi.length );

		},
		calc: function() {

			var deviceWidth,
				wrapHeight;

			deviceWidth = document.documentElement.clientWidth * this.scale;

			wrapHeight = deviceWidth/this.orgWidth * this.orgHeight;

			return {w:deviceWidth, h:wrapHeight};

		},
		load: function() {
			
			var _this = this;

			if( this.url ) {

				$.ajax({

					url: this.url,

					dataType: 'text',

					type: this.type,

					data: this.param,

					success: function(data) {

						var data = eval('(' + data + ')');

						//need modify

						_this.num = data.data.length;

						_this.createDomList(data);

						_this.setStyle(_this.num);

						if ( _this.num == 1 ) return;

						_this.createDot();

						_this.addEvent();

						_this.auto ? _this.autoPlay() : null;	
						
					}

				});

			} else {

				_this.num = _this.oDataWrap.children().length;

				_this.setStyle(_this.num);

				if ( _this.num == 1 ) return;

				_this.createDot();

				_this.addEvent();

				_this.auto ? _this.autoPlay() : null;

			}

		},
		createDomList:function(data) {
		
			var html = _.template(this.compailed, data);

			this.oDataWrap.html(html);
		},
		createDot: function() {

			var i,
				num;

			num = this._aLi.length;

			this.setDotWrap();

			for (i=0; i<num; i++) {

				var oA = $('<a href="javascript:;"></a>');

				oA.css({
					width: '0.5rem',
					height: '0.5rem',
					display: 'inline-block',
					background: this._ORGDOTBG,
					margin: '0.3rem',
					borderRadius: '0.5rem'
				});

				this.oDotWrap.append(oA);
			}

			this._aDot = this.oDotWrap.children();

			this._aDot.eq(0).css('background', this._ACTDOTBG);	

		},
		setDotWrap: function() {

			this.oDotWrap.css({
				textAlign: 'center',
				position: 'absolute',
				bottom: 0,
				width: this._wrapWidth
			});	
		},
		css3: function(obj, json) {

			obj = obj.get(0);

			for (var name in json) {

		      var bigName = name.charAt(0).toUpperCase()+name.substring(1);
		      
		      obj.style['Webkit'+bigName] = json[name];
		      obj.style['Moz'+bigName] = json[name];
		      obj.style['ms'+bigName] = json[name];
		      obj.style['O'+bigName] = json[name];
		      obj.style[name] = json[name];

		    }

		}

	}

	module.exports = Focus;

});