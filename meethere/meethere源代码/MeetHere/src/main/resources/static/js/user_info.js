$(function(){
    $.ajaxSettings.async = false;
    var userName;
    var userId;  
    $.get(
        "/system/username",
        function(data){
            userName = data;
        $(".username").text(data);
        $("#myName").append(userName);
        });
 
    $.get(
        "/system/userId",
        function(data){
            userId = data;
        $("#myId").append(userId);
        }
        );
    $.get(
            "/system/authentication",
            function(data){
            	if(data == 1){
            		$(".usernum").text("用户");
            	}
            	else if(data == 2){
            		$(".usernum").text("管理员");
            	}
            }
            );
    
    var userRole;
    $.get(
    "/system/authentication",
    function(data){
        userRole=data;
    }
    );
    $.get(
        "/user/center/"+userName,
        function(data)
        {
            var jsonObj = JSON.parse(data);
            var email = document.getElementsByClassName("email")[0];
            var telephone = document.getElementsByClassName("phone")[0];
            email.setAttribute("value",jsonObj.email);
            telephone.setAttribute("value",jsonObj.telephone);
        }
        );                   
    
    if(userRole == 1)
    {
        $.get(
        "/user/orders/username/"+userName,
        function(data)
        {
            var jsonObj = new Array();
            jsonObj = JSON.parse(data);
            for(var i =0;i<jsonObj.length;++i)
            {                   
            	var st=stampToDate(jsonObj[i].startTime);
            	var ed=stampToDate(jsonObj[i].endTime);
            	var state = jsonObj[i].state;
            	if(state == 0)
            	{
            		state='未审核';
            	}
            	else if(state == 1)
            	{
            		state='已审核';
            	}
                $("#myReservation").append("<tr><td>"+jsonObj[i].orderId+"</td><td>"+jsonObj[i].siteId+"</td><td>"+
                    st+"</td><td>"+ed+"</td><td>"+state+
                    "</td><td><input type='button' value='删除' onclick = 'deleteit()'></td></tr>");
            }
        }
        );  
        $(".admin").hide();
    }
    else if(userRole == 2)
    {
        $.get(
        "/admin/orders",
        function(data)
        {
            var jsonObj = new Array();
            jsonObj = JSON.parse(data);
            for(var i=0;i<jsonObj.length;++i)
            {
            	var st=stampToDate(jsonObj[i].startTime);
            	var ed=stampToDate(jsonObj[i].endTime);
            	var state = jsonObj[i].state;
            	if(state == 0)
            	{
            		state='未审核';
            	}
            	else if(state == 1)
            	{
            		state='已审核';
            	}
                $("#myReservation").append("<tr><td>"+jsonObj[i].orderId+"</td><td>"+jsonObj[i].siteId+"</td><td>"+
                		st+"</td><td>"+ed+"</td><td>"+state+
                    "</td><td><input type='button' value='删除' onclick = 'deleteit(this)'>"+
                    "<input type='button' value='审核' onclick = 'check(this)'>"+"</td></tr>");
            }
        }
        );
        $.get(
        	"/admin/users",
        	function(data){
        		var jsonObj = new Array();
        		jsonObj = JSON.parse(data);
        		for(var i=0;i<jsonObj.length;++i)
        		{
        			$('.userInfoTable').append("<tr><td>"+jsonObj[i].userId+"</td><td>"+jsonObj[i].username+"</td><td>"+
        					jsonObj[i].email+"</td>"+
        			"<td>"+jsonObj[i].telephone+"</td><td><input type='button' value='删除' onclick = 'deleteUser(this)'></td></tr>");
        		}
        	}
        );
    }

    $.ajaxSettings.async = true;
})

function deleteit(e)
{
    $.ajax({
    type : 'delete',
        //data : JSON.stringify(recordInfo),
    url : "/admin/orders/delete/" + e.parentNode.parentNode.getElementsByTagName("td")[0].innerHTML,
                //contentType : 'application/json;charset=UTF-8',
                //dataType : 'json',
    success : function(data){
        if(data == 'success')
        {
        	alert("删除成功！");
        }
        else
        {
        	alert("发送失败，请重试");
        }  
        window.location.reload();
    }
    }
    );   
}

function deleteUser(e)
{
    $.ajax({
    type : 'delete',
        //data : JSON.stringify(recordInfo),
    url : "/admin/users/delete/" + e.parentNode.parentNode.getElementsByTagName("td")[1].innerHTML,
                //contentType : 'application/json;charset=UTF-8',
                //dataType : 'json',
    success : function(data){
        if(data == 'success')
        {
        	alert("删除成功！");
        }
        else
        {
        	alert("失败，请重试");
        }  
        window.location.reload();
    }
    }
    );   
}

function stampToDate(a)
{
	var date1=new Date(a);
	var y = date1.getFullYear(); //getFullYear方法以四位数字返回年份
	var M = date1.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
	var d = date1.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
	var h = date1.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
	var m = date1.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
	var s = date1.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
	return y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;	
}

function check(e)
{
	var data = e.parentNode.parentNode.getElementsByTagName("td");
	var orderId = data[0].innerHTML;
	var st = data[2].innerHTML;
	var et = data[3].innerHTML;
	var state;
	var r = confirm("是否审核通过");
	if(r==true)
	{
		state = 1;
		$.post(
			"/user/orders/update/"+orderId,
			{
				startTime:st,
				endTime:et,
				state:state
			},
			function(data)
			{
                if(data == 'success')
                {
                	alert("审核成功！");
                }
                else
                {
                	alert("提交失败，请重试");
                }
			}
		);
	}
}

function updateInfo(e)
{
	$.ajaxSettings.async = false;
	var userid = $("#myId").text();
	var name = $("#myName").text();
	var email = $(".email").val();
	var telephone = $(".phone").val();
	if(!$(".email").val().match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/))
	{
		$("#confirmMsg").html("<font color='red'>邮箱格式不正确！请重新输入！</font>");  
        $(".email").focus();
	}
	else if(!$(".phone").val().match(/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/))
	{
        $("#telMsg").html("<font color='red'>手机号码格式不正确！请重新输入！</font>");  
        $(".phone").focus();  
	}
	else{
	$.post(
		"/user/center/update/"+name,
		{
			email:email,
			telephone:telephone
		},
		function(data)
		{
            if(data == 'success')
            {
            	alert("更新成功！");
            }
            else
            {
            	alert("提交失败，请重试");
            }
		}
	);
	}
	$.ajaxSettings.async = true;
}