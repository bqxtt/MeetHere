$("#outerdiv").hide();
$(function(){
    var userName;    
    var userId;  
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
    $.get(
    	"/system/authentication",
    	function(data){
    		var admin=document.getElementsByClassName("admin");
    		if(data!=2)
    		{
    			for(var i =0;i<admin.length;++i)
    			{
    				admin[i].style.display='none';
    			}
    		}
    		
    	}
    );
    $("#roomInput").hide();
     $("#addaRoom").click(function(){
        $("#roomInput").fadeIn();
     })
     var imagePath = "";
         
		$('#chooseImage').on('change',function(e){
		      // 检查是否是图片
		      var filePath = $(this).val(),
		      fileFormat = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();//获取文件后缀名
		      //检查后缀名
		      if( !fileFormat.match(/.png|.jpg|.jpeg/) ) {
		            showError('文件格式必须为：png/jpg/jpeg');//showError是另外写的一个显示错误信息的function
		            return;  
		      }
		
		      //获取并记录图片的base64编码
		      var reader = new FileReader();
		      reader.readAsDataURL(e.target.files[0]); // 读出 base64
		      reader.onloadend = function () {
		            // 图片的 base64 格式, 可以直接当成 img 的 src 属性值        
		           var dataURL = reader.result;//base64
		           // 显示图片
		           $('#showImg').attr('src',dataURL);
				   //alert($('#showImg').attr('src'));
		           alert("上传成功");
				   imagePath = $('#showImg').attr('src');
		      };
		});

     $(".submit").click(function(){
        var name = $(".roomName").val();
        var dis = $(".roomDis").val();
        var locate = $(".roomLoca").val();
        var price = parseFloat($(".roomPrice").val());
        if(name.length>20)
        {
        	alert("场馆名过长");
        }
        else if(dis.length>30)
        {
        	alert("描述过长");
        }
        else if(locate.length>30)
        {
        	alert("位置信息过长");
        }
        else if($.trim(name)=='')
        {
        	alert("场馆名不能为空！");
        }
        else if($.trim(dis)=='')
        {
        	alert("场馆描述不能为空！");
        }
        else if($.trim(locate)=='')
        {
        	alert("场馆地点不能为空！");
        }
        else if(isNaN(price))
        {
        	alert("请输入正确的价格！");
        }
        else{
        $.post(
            "/admin/sites/add",
            {
                name:name,
                imagePath:imagePath,
                description:dis,
                location:locate,
                price:price
            },
            function(data)
            {
                
                if(data == "success")
            	{
                	alert("添加成功");
            	}
                else
                {
                	alert("添加失败");
                }
                window.location.reload();
            }
            )
        }
     })
    $.ajaxSettings.async = false;
    var userRole;
    $.get(
        "/system/authentication",
        function(data){
            userRole=data;
        }
        ); 
                  
     $.get(
        "/public/sites",
        function(data){
            var jsonObj = new Array();
            jsonObj=JSON.parse(data);
            if(userRole == 1){
                for(i=0;i<jsonObj.length;i++) {
                var img = jsonObj[i].imagePath;
                	
                $("tbody").append("<tr><td>"+jsonObj[i].siteId+"</td><td>"+jsonObj[i].name+"</td><td>"
            +jsonObj[i].description+"</td><td>"+jsonObj[i].location+"</td><td>"+jsonObj[i].price+"</td><td><img src="+jsonObj[i].imagePath+
            " class='img' width=50 height=50/></td></tr>");
            }
            }
            else if(userRole == 2)
            {
                for(i=0;i<jsonObj.length;i++) {
                $("tbody").append("<tr><td>"+jsonObj[i].siteId+"</td><td>"+jsonObj[i].name+"</td><td>"
            +jsonObj[i].description+"</td><td>"+jsonObj[i].location+"</td><td>"+jsonObj[i].price+"</td><td><img src="+jsonObj[i].imagePath+
            " class='img' width=50 height=50/></td><td><input type='button' value='删除' onclick = 'deleteit(this)'></td></tr>");
            }               
            }
            else 
            {
                alert("未登录");
            }

        
        }
        );
     $.ajaxSettings.async = true;
     //$("tbody").append("<tr><td>jsonObj[i].siteId</td><td>jsonObj[i].name</td><td>jsonObj[i].description</td><td>jsonObj[i].location</td><td>jsonObj[i].price</td><td><img src="+img.src+" /></td></tr>");
     $(".img").mouseover(function(){
         $(this).css("cursor","pointer");
     });

     $(".img").click(function(){
         var _this = $(this);//将当前的pimg元素作为_this传入函数
         imgShow("#outerdiv", "#bigimg", _this);
     });
})

function dataURLtoFile(dataurl, filename = 'file') {
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let suffix = mime.split('/')[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
    })
}

function deleteit(e)
{
    $.ajax({
    type : 'delete',
        //data : JSON.stringify(recordInfo),
    url : "/admin/sites/delete/" + e.parentNode.parentNode.getElementsByTagName("td")[0].innerHTML,
                //contentType : 'application/json;charset=UTF-8',
                //dataType : 'json',
    success : function(data){
        
        if(data == "success")
        {
        	alert("删除成功");
        }
        else
        {
        	alert("删除失败");
        }
        window.location.reload();
    }
    }
    );  
}

function imgShow(outerdiv, bigimg, _this) {
    var src = _this.attr("src");//获取当前点击的pimg元素中的src属性
    $("#outerdiv").attr("display", "block");
    $("#bigimg").attr("src", src);//设置#bigimg元素的src属性
    $("#outerdiv").fadeIn("fast");

    $("#outerdiv").click(function () {//再次点击淡出消失弹出层
        $(this).fadeOut("fast");
    });
}