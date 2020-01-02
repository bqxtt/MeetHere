
$(function(){
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
        $.get(
                "/public/news",
                function(data)
                {
                    var jsonObj = JSON.parse(data)
                    for(var i=0;i<jsonObj.length;++i)
                    {
                        var newsList = document.getElementsByClassName("news-list")[0];
                        
                        var div = document.createElement("div");
                        div.className = 'news-list-item clearfix';
                        newsList.appendChild(div);
                        
                        var div1 = document.createElement("div");
                        div1.className = "col-xs-5";
                        
                        var img = document.createElement("img");
                        img.className='newsImg';
                        img.setAttribute("src",jsonObj[i].imagePath);
                        div1.appendChild(img);
                        div.appendChild(div1);
                        
                        var div2 = document.createElement("div");
                        div2.className="col-xs-7";
                        
                        var title = document.createElement("a");
                        title.className='title';
                        title.setAttribute("href",'/public/news/' + jsonObj[i].newsId);
                        title.innerHTML = jsonObj[i].title;
                        div2.appendChild(title);
                        
                        var div3 = document.createElement("div");
                        div3.className="info";
                        div3.innerHTML = '<span>'+stampToDate(jsonObj[i].releaseTime)+'</span>';
                        div2.appendChild(div3);
                        div.appendChild(div2);
						

                    }
                }
            );

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

                        
})