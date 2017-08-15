
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>404</title>

</head>
<body style="background-color:#9fa7b1">
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<div class="main-header-wrap clearfix">
	<h1 class="fl ml-23 mt-8">
		<a href="#">
			<img src="<%=basePath%>/statics/assets/lib/logo/snail.png" alt="金蜗牛互联网的营销推广专家" title="金蜗牛互联网的营销推广专家">
		</a>
	</h1>
	
</div>
 <h1>对不起！你访问的地址不存在...</h1>
</body>
</html>