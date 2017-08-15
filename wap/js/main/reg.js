define(function(require, exports, module){

	var bodyParse = require('../widget/http/bodyParse');
	var pageInfo = bodyParse();
	var changeParam = require('../global/changeParam');

	var oBg = document.getElementById('bg');

	var nHeight = document.documentElement.clientHeight;

	oBg.style.height = nHeight + 'px';


	var oName,
		oTel,
		oComp,
		oAdd,
		oDec,
		oBtn,

		sName,
		sTel,
		sComp,
		sAdd,
		sDec,
		_result,
		result;


	oName = $('[namer]');
	oTel = $('[tel]');
	oComp = $('[com]');
	oAdd = $('[add]');
	oDec = $('[des]');
	oBtn = $('[btn]');

	oBtn.on('click', function(){

		_result = {};
		sName = oName.val();
		sTel = oTel.val();
		sComp = oComp.val();
		sAdd = oAdd.val();
		sDec = oDec.val();

		_result['sign.pkActivity'] = pageInfo.pkActivity;
		_result['sign.signChannel'] = pageInfo.channel;
		_result['sign.name'] = sName;
		_result['sign.tel'] = sTel;
		_result['sign.corp'] = sComp;
		_result['sign.addr'] = sAdd;
		_result['sign.des'] = sDec;
		_result['pkActivity'] = pageInfo.pkActivity;
		
		result = changeParam(_result);

		$.post('/rmrbh5/activity/addSign', result, function(data){

			var info = JSON.parse(data.outJson);

			alert(info.msg);

		}, 'json');

	});


});	