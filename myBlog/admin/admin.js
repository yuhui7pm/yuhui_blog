var path;
var username;
var arr;
var index;//博客数计算
var items = 10;//初始化每页的博客数
var itemsInPage = new Array();
var num = 0;//用于计数
var pageNumber=1;
var pageOfComments=1;
var page;//博客页数
var pageCom;

var createtime;
var titleUpdated;
var contentUpdated;

//评论页
var userCommentsArr;
let _last;
var changedState = true;
var blogsPagination;
var commentsPagination;
var commentsArr;
var newArr=[];

window.onload = ()=>{
		if(window.location.href.split('?')[1]){
			path = window.location.href.split('?')[1];
			username = path.split('=')[1];
			username=username.replace('#','');//url后面会自动生成#号
			$('.username').html('用户：'+username);
		};
		
		//获取用户的所有博客
		getLists(username);
		
		//文章管理和评论管理的点击切换事件
		toggleClick();
}

//---------------------------这里是博客管理----------------------------------------
//1.获取用户的所有博客
function getLists(username){
	$.ajax({
		url:"/api/blog/personalLists",
		type:"GET",//后台用req.query
		dataType:"json",
		contentType:"application/json",
		data:{
			username:username
		},
		success:(result)=>{
			//part1.显示博客
			arr = result.data;
			arr.forEach(item=>{
				itemsInPage.push(item);//copy到新数组中
			})
			addInForm(itemsInPage,pageNumber);//根据每一页显示出数据
			pages(itemsInPage);//显示出页数
			
			//点击左右按钮换页
			buttonChangePage(itemsInPage);
		}
	})
}

//点击前后按钮进行换页
function buttonChangePage(arr){
	$('.arrowForward').click(()=>{
		if(pageNumber>1){
			$('.blogLists').empty();
			addInForm(itemsInPage,pageNumber-1);
			pageNumber--;
			return;
		}
	})
	
	$('.arrowBackWard').click(()=>{
		if(pageNumber<page){
			$('.blogLists').empty();
			addInForm(itemsInPage,pageNumber+1);
			pageNumber++;
			return;
		}
	})
}

//2.博客列表的展示模板
function addInForm(arr,pageNumber){
	//将数据，分页推入到新数组中，默认是首页的数据
	var Remainder =Math.min(items*pageNumber,arr.length);//取最小值
	for(var i=items*(pageNumber-1);i<Remainder;i++){
		var timeChanged = dataFormat(itemsInPage[i].createtime);//将时间格式转换
		$('.blogLists').append(`
			<tr>
				<td style="width: 5%;">${i+1}</td>
				<td style="width: 10%;">${itemsInPage[i].title}</td>
				<td style="width: 70%;">${itemsInPage[i].introduction}</td>
				<td style="width: 5%;">${timeChanged}</td>
				<td style="width: 5%;" class="updateBlog" onclick="blogEdit(itemsInPage[${i}].title,itemsInPage[${i}].introduction,itemsInPage[${i}].content,${itemsInPage[i].createtime})"><a>修改</a></td>
				<td style="width: 5%;" class="deleteBlog" onclick="deleteBlog(${itemsInPage[i].createtime},${itemsInPage[i].id})"><a>删除</a></td>
			</tr>	
		`)	
	}
}


//4.1每页只能放入10条数据
function pages(arr){
	var blogsLen = arr.length;//博客总数
	page = Math.ceil(blogsLen/10);//博客列表的页数
	for(var j=0;j<page;j++){
		$('.arrowBackWard').before(`
			 <li class="pageNum" onclick="$('.blogLists').empty();addInForm(arr,${j+1});pageNumber=${j+1}"><a>${j+1}</a></li>	
		`)
	}
}


//part2 删除博客数据
function deleteBlog(createtime,id){
	$.ajax({
		url:"/api/blog/delete",
		type:"POST",//后台用req.body
		dataType:"json",
		contentType:"application/json",
		data:JSON.stringify({
			createtime:String(createtime),
			id
		}),
		success:(res)=>{
			if(res.errNum==0){
				$('.panel').empty();
				$('.blogLists').empty();
				itemsInPage  = [];
				//获取用户的所有博客
				blogsManage();
				getLists(username);		
				$('.pages').show();
				$('.pageNum').remove();
			}else{
				console.error("删除出错");
			}
		}
	})	
}

//part3.1 博客编辑
function blogEdit(title,introduction,content,time){
	var panel = $('.panel').detach();//移除的同时，保留原来的方法
	var pages = $('.pages').detach();//移除的同时，保留原来的方法
	var breadcrumb = $('.breadcrumb').detach();//移除的同时，保留原来的方法
	
	$('.adminContentWrapper').append(`
		<ol class="breadcrumb">
		  <li><a href="./index.html">首页</a></li>
		  <li><a href="./admin.html?username=${username}">后台管理</a></li>
		  <li class="active">${title}</li>
		</ol>
		<div class="contentEdit">
			<form role="form" style="width:100%">
			 <div class="form-group" style="width:100%">
			  	<label>简介</label>
			  	<span style="visibility:hidden;" class="createtime">${time}</span>
			    <textarea class="form-control blogTitleUpdate" rows="5" style="width:820px">${introduction}</textarea>
			  </div>
			  <div class="form-group" style="width:100%">
			  	<label>正文</label>
			    <!--富文本编辑器-->   
				<div id="summernote" style="width:100%;margin:0;padding:0"></div>
			  </div>
			</form>   		
			<button type="button" class="btn btn-lg submitButton" onclick="updateBlog()">提交</button>
		</div>
	`)
	//summernote初始化
	$('#summernote').summernote( { placeholder: '请输入公告内容', height: 400,width:820 });
	//从数据库读取内容
	$('#summernote').summernote('code', content);
//	<textarea class="form-control blogContentUpdate" rows="50">${content}</textarea>
	
	//监听输入框的变化
	$('.blogTitleUpdate').bind("input propertychange",function(){
		titleUpdated = $('.blogTitleUpdate').val();	  
	});
	
	$('.blogContentUpdate').bind("input propertychange",function(event){
		contentUpdated = $('.blogContentUpdate').val();	  
	});
}

//part3.2 更新博客
function updateBlog(){
	introductionUpdated = $('.blogTitleUpdate').val();
	createtime = $('.createtime').html();
	contentUpdated = $('#summernote').summernote('code');
//	console.log(introductionUpdated,createtime,contentUpdated)
	$.ajax({
		url:"/api/blog/update",
		type:"POST",//后台用req.body
		dataType:"json",
		contentType:"application/json",
		data:JSON.stringify({
			username:getUsername(),
			createtime:String(createtime),
			introductionUpdated,
			contentUpdated
		}),
		success:(res)=>{
			if(res.errNum==0){
				window.location.reload();//删除数据后自动刷新页面;
			}else{
				console.error("删除出错");
			}
		}
	})	
}

function articleManageClick(){
	$('.articleManage').click(()=>{
		const _this = event.currentTarget;
		$(_this).css('color','orangered');
		$('.commentManage').css('color','#337AB7');
		
		$('.panel').empty();
		$('.blogLists').empty();
		itemsInPage  = [];
		//获取用户的所有博客
		blogsManage();
		getLists(username);		
		$('.pages').show();
		$('.pageNum').remove();
		
	});
}

//---------------------------------------------下面是评论管理------------------------------
//获取博客的一级评论
function getAllComments(){
	$.ajax({
		url:"/api/blogs/getAllComments",
		type:"GET",//后台用req.query
		dataType:"json",
		contentType:"application/json",
		data:{
			username
		},
		success:(result)=>{
			commentsArr = result.data;
			//获取博客的二级评论
			if(result.errNum==0){
				commentsArr.map((value,index,arr)=>{
					newArr.push({'index':index+1,'type':'1','commentId':value.id,'blogId':value.blogid,'title':value.title,'content':value.firstcontext,'time':value.firstcommenttime});
				})
				getSecondComments();
			}
		}
	})
}
//获取博客的二级评论
function getSecondComments(){
	$.ajax({
		url:"/api/blogs/getAllSecondComments",
		type:"GET",
		dataType:"json",
		contentType:"application/json",
		data:{
			username
		},
		success:(result)=>{
			var secondCommentsLists = result.data;
			if(result.errNum==0){
				if(secondCommentsLists){
					secondCommentsLists.map((value,index,arr)=>{
						newArr.push({'index':commentsArr.length+index+1,'type':'2','commentId':value.id,'blogId':value.blogId,'title':value.title,'content':value.secondCommentContext,'time':value.secondCommentCreatetime});
					})			
					//按照时间度评论进行排序
					newArr.sort((a,b)=>{
						return b.time>a.time?1:-1;
					})
				}
				//生成评论列表
				addCommentInForm(newArr,pageOfComments);
				//生成页码
				pagesComments(newArr);
				//前后按钮实现换页
				buttonChangePage2(newArr);
			}
		}
	})
}

//3.评论列表的展示模板
function addCommentInForm(newArr,pageOfComments){
	//将数据，分页推入到新数组中，默认是首页的数据
	var Remainder =Math.min(items*pageOfComments,newArr.length);//取最小值
	for(var i=items*(pageOfComments-1);i<Remainder;i++){
		var timeChanged = dataFormat(newArr[i].createtime);//将时间格式转换
		$('.blogLists').append(`
			<tr>
				<td style="width: 5%;">${i+1}</td>
				<td style="width: 10%;">${newArr[i].title}</td>
				<td style="width: 70%;">${AnalyticEmotion(newArr[i].content)}</td>
				<td style="width: 5%;">${dataFormat(newArr[i].time)}</td>
				<td style="width: 5%;" class="updateBlog" onclick="goBackBlog(${newArr[i].blogId})"><a>查看原文</a></td>
				<td style="width: 5%;" class="deleteBlog" onclick="deleteComments(${newArr[i].type},${newArr[i].commentId},getUsername())"><a>删除</a></td>
			</tr>	
		`)	
	}
}

//评论页码模板
function pagesComments(newArr){
	var blogsLen = newArr.length;//博客总数
	pageCom = Math.ceil(blogsLen/10);//博客列表的页数
	for(var j=0;j<pageCom;j++){
		$('.arrowBackWard').before(`
			 <li class="pageNum" onclick="$('.blogLists').empty();addCommentInForm(newArr,${j+1});pageOfComments=${j+1}"><a>${j+1}</a></li>	
		`)
	}
}

//评论页码前后按钮换页
function buttonChangePage2(newArr){
	$('.arrowForward').click(()=>{
		if(pageOfComments>1){
			$('.blogLists').empty();
			addCommentInForm(newArr,pageOfComments-1);
			pageOfComments--;
			return;
		}
	})
	
	$('.arrowBackWard').click(()=>{
		if(pageOfComments<pageCom){
			$('.blogLists').empty();
			 addCommentInForm(newArr,pageOfComments+1)
			pageOfComments++;
			return;
		}
	})
}

//评论表格的模板
function commentsLists(){
	$('.panel').append(`
		<!-- Default panel contents -->
		<div class="panel-heading"  style="font-weight: bold;">用户评论管理</div>
		<!--斑马表格-->
		<table class="table table-striped" style='table-layout:fixed;'><!--table-layout列宽由表格宽度和列宽度设定。-->
			<thead>
				<tr>
					<td>id</td>
					<td>被评论的博客</td>
					<td>评论内容</td>
					<td>评论时间</td>
					<td colspan="2">操作</td>
				</tr>
			</thead>
			<tbody class="blogLists">
			</tbody>
		</table>	
	`)
}

//博客表格的模板
function blogsManage(){
	$('.panel').append(`
		 <!--Default panel contents--> 
		<div class="panel-heading"  style="font-weight: bold;">博客文章管理</div>
		<!--斑马表格-->
		<table class="table table-striped" style='table-layout:fixed;'><!--table-layout列宽由表格宽度和列宽度设定。-->
			<thead>
				<tr>
					<td>id</td>
					<td>文章标题</td>
					<td>文章简介</td>
					<td>创建时间</td>
					<td colspan="2">操作</td>
				</tr>
			</thead>
			<tbody class="blogLists">
			</tbody>
		</table>		
	`)
}

//点击查看评论
function goBackBlog(blogId){
	window.parent.location.href = "./blogDetail.html?username="+getUsername()+"&blogId="+blogId;
}

//删除评论
function deleteComments(type,commentId,user){
	console.log(type,commentId,user)
	$.ajax({
		url:"/api/blog/deleteComments",
		type:"POST",//后台用req.body
		dataType:"json",
		contentType:"application/json",
		data:JSON.stringify({
			type,
			commentId,
			user
		}),
		success:(res)=>{
			if(res.errNum==0){
				$('.panel').empty();
				$('.blogLists').empty();
				newArr = [];
				
				//获取用户所有的评论
				commentsLists();
				getAllComments(username);	
				$('.pageNum').remove();
			}
		}
	})	
}

function commentManageClick(){
	$('.commentManage').click(()=>{
		const _this = event.currentTarget;
		$(_this).css('color','orangered');
		$('.articleManage').css('color','#337AB7');
		
		$('.panel').empty();
		$('.blogLists').empty();
		newArr = [];
		
		//获取用户所有的评论
		commentsLists();
		getAllComments(username);	
		$('.pageNum').remove();
	});
}

//----------------------------------------时间的格式转换-------------------------------------------
//通过url获取用户名
function getUsername(){
	if(window.location.href.split('?username=').length>1){
		var user = window.location.href.split('?username=')[1].split('&')[0];
		return user;
	}else{
		return false;
	}
}

//博客管理与评论管理的切换
function toggleClick(){
	articleManageClick();
	commentManageClick();
}

//3.1 将毫秒数的日期转换成字符串形式
function dataFormat(time){
	var timeStr = new Date(time);
	var year = timeStr.getFullYear(),
		month = timeStr.getMonth()+1,//月份是从0开始的
		day = timeStr.getDate(),
		hour = timeStr.getHours(),
		minute = timeStr.getMinutes(),
		second = timeStr.getSeconds();
	return year+'-'+ addZero(month)+'-'+addZero(day)+'  '+addZero(hour)+':'+addZero(minute)+':'+addZero(second);
}

//3.2 补零操作。当小于10时，个位数前面要补零
function addZero(data){
	return data<10?'0'+data:data;//三目运算符
}