var userName;
var userId;

$(function(){
	var msg = document.getElementById("msg");
	var lists = msg.children;
    $.get(
        "/system/username",
        function(data){
            $(".username").text(data);
        });

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
    //var jsonObj = new Array();
    //var test = '<table border = "1"> <tr><td>ererer</td></tr></table>';
    //var res = document.getElementById("msg");
    //res.innerHTML = test; 
    $.ajaxSettings.async = false;
    var userRole;
    var myName;
    $.get(
        "/system/authentication",
        function(data){
            userRole=data;
        }
    );
    $.get(
            "/system/userId",
            function(data){
                userId=data;
            }
            ); 
    $.get(
    	"/system/getusernamebyid/"+userId,
    	function(data)
    	{
    		myName = data;
    	}
    );
    $.get(
        "/public/messages",
        function(data){
            var jsonObj=JSON.parse(data);

                //遍历本地数据所有内容
                for(var i = 0; i < jsonObj.length; i++) {
                	var reOrDel;
                	var pDel;
                	var userName;
                    $.get(
                        	"/system/getusernamebyid/"+jsonObj[i].userId,
                        	function(data)
                        	{
                        		userName = data;
                        	}
                     );
                	if(userRole == 2 || userId == jsonObj[i].userId)
                	{
                		pDel = 'X';
                	}
                	else 
                	{
                		pDel = '';
                	}
                	var msg = document.getElementById("msg");
                	var lists = msg.children;
                	
                	var li = document.createElement("li");
                	li.className = 'list0';
                	li.setAttribute("msgId",jsonObj[i].messageid);
                	msg.appendChild(li);
                	
                	var del = document.createElement("a");
                	del.className='close';
                	del.setAttribute('href','javascript:;');
                	del.setAttribute('user',userId);
                	del.innerHTML = pDel;
                	li.appendChild(del);
                	
                    var div = document.createElement("div");
                    div.className = 'content';
                    
                    var text = document.createElement("p");
                    text.className = 'text';
                    text.innerHTML = "<span class ='name'>"+userName+"：<span class='msgId'>"+
                    jsonObj[i].messageid+"</span></span>"+jsonObj[i].content;
                    div.appendChild(text);
                    
                    var good = document.createElement("div");
                    good.className = 'good';
                    
/**
                    var commentDiv = document.createElement("div");
                    commentDiv.className = 'comment-list';
                    var comment = document.createElement("div");
                    comment.className = ''
**/
                    var time = document.createElement("span");
                    var date1=new Date(jsonObj[i].time);
                    var y = date1.getFullYear(); //getFullYear方法以四位数字返回年份
                    var M = date1.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
                    var d = date1.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
                    var h = date1.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
                    var m = date1.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
                    var s = date1.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
                    var date2= y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
                    time.innerHTML = date2;
                    good.appendChild(time);
                    div.appendChild(good);
                    
                    var commentlist = document.createElement("div");
                    commentlist.className='comment-list';
                    div.appendChild(commentlist);

                    var hf = document.createElement("div");
                    hf.className = 'hf';
                    hf.innerHTML ="<textarea type='text' class='hf-text' autocomplete='off' maxlength='100'>评论…</textarea>"+
			                "<button class='hf-btn'>回复</button>"+
			                "<span class='hf-nub'>0/100</span>";
                    div.appendChild(hf);
                    li.appendChild(div);
                    $(".msgId").hide();
                    $.get(
                        	"/public/messages/"+jsonObj[i].messageid,
                        	function(data)
                        	{
                        		var jsonObj1 = new Array();
                        		jsonObj1 = JSON.parse(data);
                        		for(var i=0;i<jsonObj1.length;++i)
                        		{
                        			var comment = document.createElement("div");
                        			var name;
                        			comment.className = 'comment';
                        			comment.setAttribute("user",jsonObj1[i].userId);
                        			comment.setAttribute("msgId",jsonObj1[i].messageid);
                        			commentlist.appendChild(comment);
                        			var date3 = new Date(jsonObj1[i].time);
                                    var y = date1.getFullYear(); //getFullYear方法以四位数字返回年份
                                    var M = date1.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
                                    var d = date1.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
                                    var h = date1.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
                                    var m = date1.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
                                    var s = date1.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
                                    var date4= y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
                                    if(userRole == 2||jsonObj1[i].userId == userId){
                                    	reOrDel ='删除';
                                    }
                                    else {
                                    	reOrDel ='回复';
                                    }
                                    $.get(
                                        	"/system/getusernamebyid/"+jsonObj1[i].userId,
                                        	function(data)
                                        	{
                                        		name = data;
                                        	}
                                        );
                        			var html = '<div class="comment-left"></div>'+
			                    '<div class="comment-right">'+
			                        '<div class="comment-text"><span class="user">'+name+'：</span>'+
			                        jsonObj1[i].content+'</div>'+
			                        '<div class="comment-date">'+date4+'<a class="comment-dele" href="javascript:;">'+
			                        reOrDel+'</a> </div>'+
			                    '</div>';
                        			comment.innerHTML = html;
                        		}
                        	}
                        );
                }          
        }
        ); 
    
    $.ajaxSettings.async = true;  
    for (var i = 0; i < lists.length; i++) {
        //全部事件代理
        lists[i].onclick = function(e) {
            //获取当前点击事件
            var e = e || window.event;
            var el = e.srcElement;
            if (!el) {
                el = e.target; //兼容火狐
            }
            //判断点击的类名
            switch (el.className) {
                //关闭整个状态
                case "close":
                    remove(el.parentNode);
                    break;
                    //回复评论
                case "hf-btn hf-btn-on":
                    reply(el.parentNode.parentNode.parentNode);
                    break;
                case "comment-dele":
                    operateReply(el);
                    break;
            }
        }
        var textarea = lists[i].getElementsByClassName("hf-text")[0];
        //焦点事件
        textarea.onfocus = function() {
            this.parentNode.className = 'hf hf-on';
            this.value = this.value == '评论…' ? '' : this.value;
        }
        //失焦事件
        textarea.onblur = function() {
            if (this.value == '') {
                this.parentNode.className = 'hf';
                this.value = '评论…';
            }
        }
        //键盘事件
        textarea.onkeyup = function() {
            var len = this.value.length;
            var textParentNode = this.parentNode;
            var textBtn = textParentNode.children[1];
            var textNub = textParentNode.children[2];
            if (len == 0 ) {
                textBtn.className = "hf-btn";
            } else {
                textBtn.className = "hf-btn hf-btn-on";
                
            }
            textNub.innerHTML = len + "/100";
        }
    }
     
})


function saveStorage(){
    $.ajaxSettings.async = false;
   //alert(end_time);
    $.get(
    "/system/userId",
    function(data){
        var content = $("#memo").val();
        var todaydate = new Date();
        var end_time = format(todaydate,'-');
        if($.trim(content)=='')
        	{
        	alert("请输入有效内容");
        	}
        else if(content.length>100)
        	{
        		alert("字数必须小于100！");
        	}
        else{
        $.post(
            "/user/reply",
            {
                parentId:0,
                userId:data,
                content:content,
                time:end_time
            },
            function(data)
            {
                if(data == 'success')
                {
                	alert("留言成功！");
                }
                else
                {
                	alert("发送失败，请重试");
                }
                window.location.reload();
        }
        );
        }
    }
    );                   
    $.ajaxSettings.async = true;
 
}

function format(Date,str){
    var obj = {
        Y: Date.getFullYear(),
        M: Date.getMonth() + 1,
        D: Date.getDate(),
        H: Date.getHours(),
        Mi: Date.getMinutes(),
        S: Date.getSeconds()
    }
    // 拼接时间 hh:mm:ss
    var time = ' ' +supplement(obj.H) + ':' + supplement(obj.Mi) + ':' + supplement(obj.S);
    // yyyy-mm-dd
    if(str.indexOf('-') > -1){
        return obj.Y + '-' + supplement(obj.M) + '-' + supplement(obj.D) + time;
    }
    // yyyy/mm/dd
    if(str.indexOf('/') > -1){
        return obj.Y + '/' + supplement(obj.M) + '/' + supplement(obj.D) + time;
    }
}
             
// 位数不足两位补全0
function supplement(nn){
    return nn = nn < 10 ? '0' + nn : nn;
}

function deleteit()
{
    $.ajax({
        type : 'delete',
        //data : JSON.stringify(recordInfo),
        url : "/admin/messages/delete/" + this.parentNode.getElementsByTagName("h2")[0].innerHTML,
                //contentType : 'application/json;charset=UTF-8',
                //dataType : 'json',
        success : function(data){
            if(data == 'success')
            {
            	alert("删除成功！");
            }
            else
            {
            	alert("删除失败，请重试");
            }  
            window.location.reload();
        }
    }
    );           
    this.parentNode.remove();
}

function operateReply(el) {
    //每条评论
    var comment = el.parentNode.parentNode.parentNode;
    //整个状态
    var box = comment.parentNode.parentNode.parentNode;
    //评论框
    var textarea = box.getElementsByTagName("textarea")[0];
    //名字
    var user = comment.getElementsByClassName("user")[0];
    //点击的innerHTML
    var txt = el.innerHTML;
    //判断当前点击的是否为回复
    if (txt == "回复") {
        //评论框触发焦点事件 也就是变高
        textarea.onfocus();
        //内容变为回复+当前人的名字
        textarea.value = "回复 " + user.innerHTML;
        //调用键盘事件
        textarea.onkeyup();
    } else {
        //否则就是删除节点
        remove(comment);
    }
}
//遍历所有状态消息


//遍历结束


function reply(box) {
    //获取评论框
    var textarea = box.getElementsByTagName("textarea")[0];
    //获取包含所有评论的容器
    var comment = box.getElementsByClassName("comment-list")[0];
    //创建新的评论div
    var div1 = document.createElement("div");
    var parentId = box.getElementsByClassName("msgId")[0].innerHTML;
    //赋类名
    div1.className = "comment";
    //设置属性
    div1.setAttribute("user", "self");
    //获取每条评论的innerHTML结构，每次只替换textarea的输入内容和 当前发送时间
    var html = '<div class="comment-left">' +  '</div>' +
        '<div class="comment-right">' +
        '<div class="comment-text"><span>我：</span>' + textarea.value + '</div>' +
        '<div class="comment-date">' +
        getTime() +
        '<a class="comment-dele" href="javascript:;">删除</a>' +
        '</div>' +
        '</div>';
    //插入到新建的评论div
    div1.innerHTML = html;
    //把新评论插入到评论列表
    comment.appendChild(div1);
    $.ajaxSettings.async = false;
    var userId;
    if($.trim(textarea.value)=='')
    	{
    	alert("请输入有效内容!");
    	}
    else if(textarea.value.length>100)
    	{
    	alert("输入内容过长！");
    	}
    else{
    $.get(
            "/system/userId",
            function(data){
                userId = data;
            }
            ); 
    $.post(
    	"/user/reply",
    	{
    		parentId:parentId,
    		userId:userId,
    		content:textarea.value,
    		time:getTime()+':00'
    	},
    	function(data)
    	{
            if(data == 'success')
            {
            	alert("回复成功！");
            }
            else
            {
            	alert("发送失败，请重试");
            }
    	}
    );
    }
    //评论后初始化textarea输入框
    textarea.value = "评论…";
    textarea.parentNode.className = "hf";
}
function remove(node) {
    
    $.ajax({
        type : 'delete',
        //data : JSON.stringify(recordInfo),
        url : "/user/reply/delete/" + node.getAttribute('msgid'),
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
            }
        }
    );
    node.parentNode.removeChild(node);
}

function getTime()
{
     var t = new Date();
     var y = t.getFullYear();
     var m = t.getMonth() + 1;
     var d = t.getDate();
     var h = t.getHours();
     var mi = t.getMinutes();
     m = m < 10 ? "0" + m : m;
     d = d < 10 ? "0" + d : d;
     h = h < 10 ? "0" + h : h;
     mi = mi < 10 ? "0" + mi : mi;
     return y + "-" + m + "-" + d + " " + h + ":" + mi;
}
