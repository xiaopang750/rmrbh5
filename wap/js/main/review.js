var pageInfo;
define(function(require, exports, module){
	
	var bodyParse = require('../widget/http/bodyParse');
	var template = require('../lib/template/template');
	var oTip = require('../widget/dom/tip');
	var changeParam = require('../global/changeParam');
	pageInfo = bodyParse();

	var oDataWrap = $('[data-wrap]');
	var nowWrap,
		nowLoc;

	$.post('/rmrbh5/activity/findAllReviews.action',{pkActivity:pageInfo.pkActivity},function(data){

		var info = JSON.parse(data.outJson).data;

		render(oDataWrap, 'list', info);
		
	},'json');


	var oSendArea = $("[name=review_content]");
	var sendType;

	window.addTopReview = function(){

		var reviewName=$("[name=reviewName]").val();
		var info = judge();
		var result = info.result;
		var content = info.content;
		sendType = info.type;

		if(!result) {

			if(sendType == 'add') {

				oTip.say('请填写评论内容');

			} else if(sendType == 'edit') {

				oTip.say('请填写回复内容');
			}

			return;
		}

		var parentId=$("[name=parentId]").val();
		var _param = {
			'review.pkActivity':pageInfo.pkActivity,
			'review.reviewContent':content,
			'review.reviewLevel':parentId=="0"?"1":"2",
			'review.reviewParentId':parentId=="0"?"0":parentId,
			'review.reviewSource':pageInfo.channel,
			'review.reviewTarget':parentId=="0"?"":reviewName
		};

		var param = changeParam(_param);

		$.post('/rmrbh5/activity/addReview.action',
				param,
				function(data){
					var info=JSON.parse(data.outJson);
					if(info.code=="a001"){

						appendList(info.data);

						//window.location=window.location;
					}else{
						oTip.say(info.msg);
					}
					
				},'json')
		
	}

	oSendArea.on('keypress', judge);
	oSendArea.on('keyup', judge);

	function judge() {

		var len,
			nowLen,
			sValue,
			result,
			content;

		len = oSendArea.attr('length');
		nowLen = oSendArea.val().length;
		result = true;

		if(len) {

			if(nowLen < len) {

				sendType = 'add';
				oSendArea.val('');
				oSendArea.attr('length', '');
				sValue = oSendArea.val(); 

				if(!sValue) {
					result = false;
				}

			} else if(nowLen == len) {

				sendType = 'edit';
				result = false;

			} else {

				sValue = oSendArea.val(); 
				sValue = sValue.substring(len);

			}

		} else {

			sendType = 'add';
			sValue = oSendArea.val(); 

			if(!sValue) {
				result = false;
			}

		}

		return {
			result: result,
			type: sendType,
			content: sValue
		}

	}

	window.reviewCh = function(oThis, name,pk){

		var num;

		$("[name=reviewName]").val(name);
		$("[name=parentId]").val(pk);
		//$("[name=reviewLabel]").show();
		//$("[name=reviewLabel]").val("回复:"+name);

		oSendArea.val("回复 "+name+":");
		num = oSendArea.val().length;
		oSendArea[0].select();
		oSendArea[0].setSelectionRange( num, num );
		oSendArea.attr('length', num);

		document.documentElement.scrollTop = 0;
		document.body.scrollTop = 0;
		nowWrap = $(oThis).parents('[child-wrap]').find('[list-wrap]');

		//alert(name);
	}


	function render(oWrap, id, data, way) {

		if(!way) {
			way = 'append';
		}

		var html = template(id, data);
		var oNew = $(html);

		if(way == 'append') {
			oWrap.append(oNew);	
		} else {
			oWrap.prepend(oNew);
		}
	}

	function appendList(data) {

		if(sendType == 'add') {

			render(oDataWrap, 'list', data, 'prepend');

		} else if(sendType == 'edit') {

			render(nowWrap, 'child', data, 'prepend');

			nowLoc = nowWrap.parents('[child-wrap]').offset().top;

			document.documentElement.scrollTop = nowLoc;
			document.body.scrollTop = nowLoc;

		}

		oSendArea.val('');
		oSendArea.attr('length', '');

	}
	

});

