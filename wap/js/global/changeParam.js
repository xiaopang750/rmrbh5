/**
 *description:转换传参的openid,accountid有时url上是转换传参的openId
 *author:fanwei
 *date:2014/10/29
 */

define(function(require, exports, module){
	
	var bodyParse = require('../widget/http/bodyParse');
	var info = bodyParse();

	function changeParam(param) {

		var oid,
			aid;	

		if(info.openid) {

			oid = info.openid;
			param.openid = oid;

		} else if(info.openId) {

			oid = info.openId;
			param.openid = oid;

		} else {

			oid = '';
			param.openid = '';

		}

		if(info.accountid) {

			aid = info.accountid;
			param.accountid = aid;

		} else if(info.accountId) {

			aid = info.accountId;
			param.accountid = aid;

		} else {

			aid = '';
			param.accountid = aid;

		}

		console.log(param);

		return param;

	}

	return changeParam;
	
});