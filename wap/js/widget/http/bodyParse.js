/**
 *description:bodyParse-把search参数解析成json
 *author:fanwei
 *date:2013/10/04
 */

/*	
	www.baidu.com?aaa=222&bbb=2;
	var param = bodyParse();

	return  {aaa:222, bbb:2};
	alert(param.aaa);
	alert(param.bbb);
*/

define(function(require, exports, module) {
	
	function bodyParse() {	

		var str,
			arr,
			newArr,
			num,
			num2,
			i,
			j,
			newJson;

		if(window.location.search) {

			str = decodeURIComponent(window.location.search.split('?')[1]);

			arr = str.split('&');

			num = arr.length;

			newJson = {};

			for (i=0; i<num; i++) {

				newArr = arr[i].split('=');

				num2 = newArr.length;

				newJson[newArr[0]] = newArr[1];
			}

			return newJson;
		}
		else {

			return '';
		}

	}

	return bodyParse;

});