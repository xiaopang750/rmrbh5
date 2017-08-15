/**
 *description:问卷
 *author:fanwei
 *date:2014/09/19
 */
define(function(require, exports, module){
	
	require('../global/sum');	
	var bodyParse = require('../widget/http/bodyParse');
	var tmepalte = require('../lib/template/template');
	var oTip = require('../widget/dom/tip');
	var changeParam = require('../global/changeParam');
	var pageInfo = bodyParse();
	var all = [];
	var pkObject;

	getDdata();
	events();

	function getDdata() {

		$.post('../survey/findSurveyObject', changeParam(pageInfo), function(data){

			var info = JSON.parse( JSON.parse(data).outJson );
			
			if(info.code == 's001') {

				pkObject = info.data.question[0].pkObject;
			
				var oWrap = $('[wrap]');
				var html = template('page', info.data);
				oWrap.html(html);

				//init-data
				var i,
					num;

				num = $('[list-wrap]').length;

				for (i=0; i<num; i++) {
					all[i] = {
						pkQuestion: '',
						pkSelect: '',
						isBlank: true
					}
				}

			} else {

				oTip.say(info.msg);
				answered();

			}

		});

	}

	function answered() {

		var oCommit = $('[commit]');

		oCommit.html('已答题');
		oCommit.attr('disabled', 'disabled');
		oCommit.css('opacity', '0.5');

	}

	function events() {

		$(document).on('click', '[select]', function(){

			var type,
				aid,
				arr,
				i,
				num,
				index,
				oCheckWrap,
				aSelect,
				oListWrap,
				json,
				result;

			type = $(this).attr('type');
			aid = $(this).attr('aid');	
			oListWrap = $(this).parents('[list-wrap]');
			oCheckWrap = $(this).parents('[check-wrap]');
			index = oListWrap.attr('index');

			json = {};
			arr = [];
			aSelect = oCheckWrap.find('[select]');
			num = aSelect.length;

			for (i=0; i<num; i++) {

				if(aSelect.eq(i).attr('checked')) {

					arr.push(aSelect.eq(i).attr('aid'));	
				}

			}
			result = arr.join(',');

			json.pkQuestion = oListWrap.attr('qid');
			json.pkSelect = result;
			json.isBlank = arr.length ? false : true;
			all[index] = json;

		});

		$(document).on('click', '[commit]', function(){

			var result = judge();

			if(!result) {
				oTip.say('所有项为必填');
			} else {

				var data,
					param;
				data = JSON.stringify(all);
				param = {
					content: data,
					pkObject: pkObject,
					pkActivity: pageInfo.pkActivity
				};

				$.post('../survey/addSurveyReplay', changeParam(param), function(data){
					
					var info = JSON.parse( JSON.parse(data).outJson );

					if(info.code == 'a001') {
						answered();
					} 
					oTip.say(info.msg);

				});
			}

		});

	}

	function judge() {

		var i,
			num,
			result;

		num = all.length;
		result = true;
		
		for (i=0; i<num; i++) {

			if(all[i].isBlank) {
				result = false;
			}

		}

		return result;	

	}
	
});