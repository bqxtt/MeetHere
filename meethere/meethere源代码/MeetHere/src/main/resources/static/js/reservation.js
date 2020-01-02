$(function(){
    var userName;
    var userRole;
    var userId;  
    $.get(
        "/system/username",
        function(data){
            $(".username").text(data);
        });
    $.get(
        "/system/authentication",
        function(data){
            userRole=data;
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
    $.get(
    	"/public/sites",
    	function(data){
    		var jsonObj = new Array();
    		jsonObj = JSON.parse(data);
    		for(var i=0;i<jsonObj.length;++i)
    		{
    			var option = document.createElement("option");
    			option.setAttribute("value",jsonObj[i].siteId);
    			option.innerHTML = jsonObj[i].name;
    			var roomSelect = document.getElementById("roomSelect");
    			roomSelect.appendChild(option);
    		}
    	}
    );
    modal.initDate("STInp","ETInp");
})



    $("button").click(function()
    {
        $.ajaxSettings.async = false;
        var st=$("#STInp").val()+':00';
        var et=$("#ETInp").val()+':00'; 
        var se = document.getElementById("roomSelect");
        var roomId=se.options[se.selectedIndex].value;
        if(roomId=="")
        {
            $("#RconfirmMsg").html("<font color='red'>场馆id不能为空！</font>"); 
        } 
        else if(!st.match(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/)) 
        {
            $("#STconfirmMsg").html("<font color='red'>请输入正确的日期格式！</font>");
        } 
        else if(!et.match(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/)) 
        {
            $("#ETconfirmMsg").html("<font color='red'>请输入正确的日期格式！</font>");
        }
        else{
            var userId;
            $.get(
                "/system/userId",
                function(data){
                    userId = data;
                }
            );
            $.post(
                "/user/reverse",
                {
                    userId:userId,
                    siteId:roomId,
                    startTime:st,
                    endTime:et,
                    state:0
                },
                function(data)
                {
                    if(data == 'success')
                    {
                    	alert("预约成功！");
                    }
                    else
                    {
                    	alert("预订失败，请重试");
                    }
                    window.location.reload();
                }
            );
        }
        $.ajaxSettings.async = true;
    })        
           

