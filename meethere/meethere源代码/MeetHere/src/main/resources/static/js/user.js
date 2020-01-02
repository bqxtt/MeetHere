

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
        		$("#ii").attr("href","/public/news.html");
        	}
        	else if(data == 2){
        		$(".usernum").text("管理员");
        		$("#ii").attr("href","/admin/newschoose.html");
        	}
        }
        );                   

     
})

