var createtime;
var num;
var numNew=0;
var id;//博客Id
var uFirstName;//根评论人
var kkkk = -1;
var status = false;
var firstcommenter;

//二级评论
var	rootComment,
	secondComment,
	secondCreatetime,
	secondCommentContext,
	secondCommentPraise;
	
var firstCommentor,firstTime;

//一级评论点赞
var getclickNum = 0;
var praiseNumber = 0;
var lastPraise;//记录上一个点击事件

//二级评论点赞
var getclickSecondNum = 0;
var praiseSecondNumber = 0;
var lastSecondPraise;//记录上一个点击事件

window.onload = function(){
	//从数据库中读取一级评论
	getComments();
	
	// 绑定表情,评论的时候可以点击sina表情
	$('.face').SinaEmotion($('.emotion'));
		
	//gif表情的显示与隐藏
	showGif();
	
	//评论高度自适应
	commentsAdaption();
	
	//撑开评论
	magnifyPage();
	
	//从数据库中获取读者的Icon
	$('.userIconComment').css('background-image','url(/static/'+readerIcon+')');
}

//删除一级评论的模板
function deleteFirstCommentModel(firstcommenter,firstcommenttime,commenter){
		if(firstcommenter==username()){
			$this = $('.'+firstcommenttime).next().find('.deleteComment');
			$this.show();
			$this.click((e)=>{
				var parentNode =e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
				var childNode = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
				parentNode.removeChild(childNode);
				
				$.ajax({
					type:"POST",
					url:"/api/blog/deleteFirstComments",
					data:JSON.stringify({
						id,
						rootCommentor:firstcommenter,  //根评论的用户名
						rootCommentTime:firstcommenttime,	   //根评论的时间
						commenter
					}),
					dataType:"json",
					contentType:"application/json",
					success:(res)=>{
//						console.log(res);
					}
				});
			})
		}
}


//发表一级评论。
function out(){
	var time = Date.now();//获取评论的时间
	var timeFormat = getMyDate(time);//时间毫秒数格式化
	createtime = time;
    let commenterFirst = username();
	//将评论的内容显示到评论区来
	var inputText = $('.emotion').val();
	var icon = $(".textRight").prev().clone();//克隆图片
	var blogId = window.location.href.split('?')[1].split('&')[1].split('=')[1];//通过url获取blogId
	if(username()=="undefined"){
		alert('请先登录,再发表评论');
		return;
	}else{
		$(".readerComment").after(
		`<div class="commentContextWrapper" style="width:100%;overflow:hidden;border-bottom: 1px solid #d9d9d9;margin-bottom: 20px;padding-bottom:20px;position:realative">
			<div class="testClass" style:"float:right;min-height:50px;width:100%" onclick="addComments('${commenterFirst}',${createtime})">
				<div>  <!--这里改过,在这里多加了一层div-->
					<div class="commentContext" style="overflow:hidden;margin-bottom:5px;margin-left:60px;max-width:100%;">
						<span class="uName" style="color:#eb7350">${commenterFirst}</span> <span class='${time}'>${timeFormat}</span>
						<span style="display:inline-block;float:right">
							<a class="deleteComment">删除</a>
							<span class="clickPraise" onclick="uploadPraise(${blogId},'${commenterFirst}',${createtime},0)">
								<span class="iconfont">&#xe505;</span>
								<span class="praiseNum">0</span>
							</span>
						</span>
					</div>
					<div style="overflow:hidden;margin-left:60px">
						${AnalyticEmotion(inputText)}
					</div>
				</div>
				<!--追加一级评论到这里的后面-->	
			</div>
		</div>`)
		
		deleteFirstCommentModel(commenterFirst,time,username());//一级评论
	
		$("."+time).parent().parent().parent().prepend(icon);//头像	
		$('.emotion').val("");//每提交一次，内容清空
		
		//撑开评论区的高度
		magnifyPage();
		
		//step1.获取博客数据
		var _bk = icon.css('backgroundImage');
		var icon = _bk.split('(')[1].split(')')[0]; //icon地址
		var author = username();  //评论人
		var context = inputText;
		var praise = $('.praiseNum').html();
		//step2.发送ajax请求,将数据保存到数据库
		uploadComments(blogId,icon,author,createtime,context,praise);
	}
}

//上传评论到数据库
function uploadComments(blogId,icon,author,createtime,context,praise){
	$.ajax({
		type:"POST",
		url:"/api/blog/saveComments",
		data:JSON.stringify({
			blogId,
			icon,
			author,
			createtime,
			context,
			praise
		}),
		dataType:"json",
		contentType:"application/json",
		success:(res)=>{
//			console.log(res)
		}
	});
}

//从数据库中获取一级评论
function getComments(){
	id = window.location.href.split('?')[1].split('&')[1].split('=')[1];//通过url获取blogId
	
	$.ajax({
		type:"GET",
		url:"/api/blog/getComments",
		data:({
			id
		}),
		dataType:"json",
		contentType:"application/json",
		success:(res)=>{
			const data = res.data;
			
			data.forEach(item=>{
				commentTemplate(item.blogid,item.firsticon,item.firstcommentor,item.firstcommenttime,item.firstcontext,item.firstpraise);
			});
		}
	});
}

//评论的模板	
function commentTemplate(blogid,firsticon,firstcommenter,firstcommenttime,firstcontext,firstpraise){
	var timeFormated = getMyDate(firstcommenttime);//时间毫秒数格式化
	firstCommentor = firstcommenter;
	firstTime = firstcommenttime;
	var time = Date.now();//获取评论的时间
	
	//这里是从数据库取出显示的第一级评论
	$(".readerComment").after(`
		<div class="commentContextWrapper" style="overflow:hidden;border-bottom: 1px solid #d9d9d9;margin-bottom: 20px;
												padding-bottom:20px;position:realative">
		<div class="firstComment" onclick="addComments('${firstcommenter}',${firstcommenttime})">
			<div class="userIconComment" style='width: 50px;height: 50px;background: url(${firsticon}) no-repeat;background-size: contain;float: left;'></div>
			<div style:"float:right;min-height:50px">
				<div class="commentContext" style="overflow:hidden;margin-left:60px;margin-bottom:5px">
					<span class="uNameFirst" style="color:#eb7350">${firstcommenter}</span> <span class='${firstcommenttime}'>${timeFormated}</span>
					<span style="display:inline-block;float:right">
						<a class="deleteComment")">删除</a>
						<span class="clickPraise" onclick="uploadPraise(${blogid},'${firstcommenter}',${firstcommenttime},${firstpraise})">
							<span class="iconfont">&#xe505;</span>
							<span class="praiseNum">${firstpraise}</span>
						</span>
					</span>
				</div>
				<div style="overflow:hidden;margin-left:60px">
					${AnalyticEmotion(firstcontext)}
				</div>
			</div>
		</div>
		<!--这里后面显示文本框,用于追加一级评论-->
	</div>`);		
	//删除一级评论的操作	
	deleteFirstCommentModel(firstcommenter,firstcommenttime,username());
	
	//获取二级评论
	getSecondComments(firstcommenter,firstcommenttime);
	
	//撑开评论区的高度
	magnifyPage();
	
	//从数据库中获取到的一级评论的点赞事件
//	uploadPraise(id,firstcommenter,firstcommenttime,firstpraise);
}

//一级评论的点赞功能
function uploadPraise(id,firstcommenter,firstcommenttime,praise){
	event.cancelBubble=true;//取消onclick事件的冒泡
	const _this = event.currentTarget;

	//判断是不是还是同一个评论的点赞
	if(lastPraise&&(lastPraise!=_this)){
		getclickNum = 0;
	}
	//只取最开始读到的数值
	if(getclickNum==0){
		praiseNumber = praise;
		getclickNum++;
		console.log('getclickNum:',getclickNum,'praiseNumber:',praiseNumber)
	}
	
	//游客不允许点赞,只允许登录之后点赞
	if(username()=="undefined"||username()==null){
		alert("请登陆之后在点赞");
		return
	}else{
		if(praiseNumber!=$(_this).find('.praiseNum').html()){
			$(_this).find('.praiseNum').html(praiseNumber);
		}else if(praiseNumber==$(_this).find('.praiseNum').html()){
			$(_this).find('.praiseNum').html(praiseNumber+1);
		}
		let nnnnnn = $(_this).find('.praiseNum').html();
			
		$.ajax({
			type:"POST",
			url:"/api/blog/uploadPraise",
			data:JSON.stringify({
				id,
				rootCommentor:firstcommenter,  //根评论的用户名
				rootCommentTime:firstcommenttime,	   //根评论的时间
				firstpraise:nnnnnn			//点赞数目
			}),
			dataType:"json",
			contentType:"application/json",
			success:(res)=>{
				console.log(res);
				lastPraise = _this;
			}
		})
	}
}


//从数据库中获取二级评论
function getSecondComments(firstcommenter,firstcommenttime){
	id = window.location.href.split('?')[1].split('&')[1].split('=')[1];//通过url获取blogId
	$.ajax({
		type:"GET",
		url:"/api/blog/getSecondComments",
		dataType:"json",
		data:{
			blogId:id,
			rootCommentor:firstcommenter,
			rootCommentTime:firstcommenttime
		},
		contentType:"application/json",
		async: false,
		success:(res)=>{
			const data = res.data;
			addSecondComments(firstcommenter,firstcommenttime,data);//数据库获取二级评论
		}
	});
}

//从数据库读取二级评论的数据
function addSecondComments(firstcommenter,firstcommenttime,data){
	data.forEach(item=>{
		$('.firstComment').eq(kkkk).after(`
			<div class="commentContextWrapper" style="overflow:hidden;position:realative;margin: 30px 0 0px 60px">
				<div>
					<div class="userIconComment" style='width: 50px;height: 50px;background: url(${item.secondCommentorIcon}) no-repeat;background-size: contain;float: left;'>
					</div>
					<div class="testClass" style="min-height:50px;margin-left:60px" onclick="replySecondComment('${firstcommenter}',${firstcommenttime})">
						<div class="commentContext">
							<span class="uNameSecond" style="color:#eb7350">${item.secondCommentor}</span>
							<span class='${item.secondCommentCreatetime}'>${getMyDate(item.secondCommentCreatetime)}</span>
							<span style="display:inline-block;float:right">
								<a class="deleteComment">删除</a>
								<span class="clickPraise" onclick="uploadSecondPraise(${id},'${item.secondCommentor}',${item.secondCommentCreatetime},${item.secondCommentPraise})">
									<span class="iconfont" >&#xe505;</span>
									<span class="praiseNum">${item.secondCommentPraise}</span>
								</span>
							</span>
						</div>
						<div style="overflow:hidden;">
							${AnalyticEmotion(item.secondCommentContext)}
						</div>
					</div>
				</div>
			</div>	
		`)
		
		if(item.secondCommentor.split(":回复@")){
			secondCommer = item.secondCommentor.split(":回复@")[0];
		}else{
			secondCommer = item.secondCommentor;
		}
		
		//删除评论
		deleteCommentModel(firstcommenter,firstcommenttime,secondCommer,item.secondCommentCreatetime);
	});
	
	//撑开评论区的高度
	magnifyPage();
	kkkk = kkkk-1;
}

//删除二级评论的模板
function deleteCommentModel(firstcommenter,firstcommenttime,commenter,timeSecond){
		if(commenter==username()){
			$this = $('.'+timeSecond).next().find('.deleteComment');
			$this.show();
			$this.click((e)=>{
				e.stopPropagation();
				const parentNode =e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
				const childNode = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
				parentNode.removeChild(childNode);
		
				$.ajax({
					type:"POST",
					url:"/api/blog/deleteSecondComments",
					data:JSON.stringify({
						id,
						rootCommentor:firstcommenter,  //根评论的用户名
						rootCommentTime:firstcommenttime,	   //根评论的时间
						secondCommentor:username(),//当前评论人的名字
						secondCreatetime:timeSecond//当前评论的时间
					}),
					dataType:"json",
					contentType:"application/json",
					success:(res)=>{
//						console.log(res);
					}
				});
			})
		}
}

//gif图的显示与隐藏
function showGif(){
	//点击所有地方，gif表情隐藏
	$(document).click(function(){
	   $('.gifWrapper').css("display","none");
	});
	
	$("#funcButton .gif").click(function(event){
	    event.stopPropagation(); //不在派发事件,否则触发上面click的事件,一直处于隐藏状态;
	    if($('.gifWrapper').css("display")=="none"){
	 	    $('.gifWrapper').css("display","block");
	    }
	});
}

//二级评论的文本框:对第一级评论进行回复
function addComments(commentorFirst,commentTime){
	if(username()=="undefined"){
		alert("请先登录,再对评论进行回复!");
		return;
	}
	num = num + 1;
	var that=event.currentTarget;//监听器触发事件的节点
	firstcommenttime = $(that).find('.uNameFirst').next().attr('class');//获取时间
	
	if(num%2==1){
		$(that).append(`
			<div class="textRight" style="margin: 30px 0 0px 60px;">
				<textarea  class="newEmotion" style="resize: none;width:100%;min-height: 80px;box-sizing: border-box;font-size: 18px;"></textarea>	
				<div id="funcButtonNew" style="width:100%;height: 40px;font-size: 25px;line-height: 25px;">
					<span class="iconfont faceNew">&#xe608;</span>
					<span class="iconfont gifNew">&#xe64d;</span>
					<span class="iconfont">&#xe613;</span>
					<input class="submitComment" type="button" value="发布" onclick="secondComment(${commentTime},'${commentorFirst}')" style="float: right;width: 60px;font-size: 18px;height: 25px;"></input>
				</div>
			</div>	
			<!--这里显示二级评论内容-->
		`);
	}else if(num%2==0){
		$(that).find('.textRight').remove();
	}

	// 绑定表情,评论的时候可以点击sina表情
	$('.faceNew').SinaEmotion($('.newEmotion'));
	
	//撑开页面
	magnifyPage();
	
	$(that).find('textarea').click(()=>{  //阻止触发父元素事件
		return false;
	});
}

//二级评论内容显示出来
function secondComment(firstcommenttime,firstcommenter){
	//将评论的内容显示到评论区来
	var inputTextSecond = $('.newEmotion').val();

	var iconclon = $(".userIconComment").clone();//克隆图片
	var _bkSecond = iconclon.css('backgroundImage');
	var iconSecond = _bkSecond.split('(')[1].split(')')[0]; //icon地址
	
	let timeSecond = Date.now();//获取评论的时间
	let timeFormatSecond = getMyDate(timeSecond);//时间毫秒数格式化
	createtimeSecond = timeSecond;

	var that=event.currentTarget;//监听器触发事件的节点
	
	$(that).parent().parent().after(`
		<div class="commentContextWrapper" style="overflow:hidden;position:realative;margin: 30px 0 0px 60px">
			<div>
				<div class="userIconComment" style='width: 50px;height: 50px;background: url(${iconSecond}) no-repeat;background-size: contain;float: left;'>
				</div>
				<div class="testClass" style="min-height:50px;margin-left:60px" onclick="replySecondComment(firstcommenter,firstcommenttime)">
					<div class="commentContext">
						<span class="uNameSecond" style="color:#eb7350">${username()}</span><span class='${timeSecond}'>${timeFormatSecond}</span>
						<span style="display:inline-block;float:right">
							<a class="deleteComment">删除</a>
							<span class="clickPraise" onclick="uploadSecondPraise(${id},'${username()}',${timeSecond},0)">
								<span class="iconfont">&#xe505;</span>
								<span class="praiseNum">0</span>
							</span>
						</span>
					</div>
					<div style="overflow:hidden;">
						${AnalyticEmotion(inputTextSecond)}
					</div>
				</div>
			</div>
		</div>	
	`);
	
	//删除评论
	deleteCommentModel(firstcommenter,firstcommenttime,username(),timeSecond);
	
	//撑开页面
	magnifyPage();
	
	$(that).parent().parent().parent().find('.commentContextWrapper').click(()=>{
		return false;
	});
	
	//发送ajax请求,把二级评论的内容存储到数据库
	$.ajax({
		type:"POST",
		url:"/api/blog/saveSecondComments",
		data:JSON.stringify({
			id,
			rootCommentor:firstcommenter,
			rootCommentTime:firstcommenttime,
			secondCommentorIcon:iconSecond,
			secondCommentor:username(),
			secondCreatetime:timeSecond,
			secondCommentContext:inputTextSecond,
			secondCommentPraise:0,
		}),
		dataType:"json",
		contentType:"application/json",
		success:(res)=>{
//			console.log(res);
		}
	});
}

//二级评论的点赞功能
function uploadSecondPraise(id,secondcommentor,secondcommenttime,praise){
	event.cancelBubble=true;//取消onclick事件的冒泡
	const _secondThis = event.currentTarget;
	
	//判断是不是还是同一个评论的点赞
	if(lastSecondPraise&&(lastSecondPraise!=_secondThis)){
		getclickSecondNum = 0;//说明点击的不是同一个赞
	}
	//只取最开始读到的数值
	if(getclickSecondNum==0){
		praiseSecondNumber = praise;
		getclickSecondNum++;
		console.log('getclickSecondNum:',getclickSecondNum,'praiseSecondNumber:',praiseSecondNumber)
	}
	
	//只允许登录之后点赞
	if(username()=="undefined"||username()==null){
		alert("请登陆之后在点赞");
		return
	}else{
		if(praiseSecondNumber!=$(_secondThis).find('.praiseNum').html()){
			$(_secondThis).find('.praiseNum').html(praiseSecondNumber);
		}else if(praiseSecondNumber==$(_secondThis).find('.praiseNum').html()){
			$(_secondThis).find('.praiseNum').html(praiseSecondNumber+1);
		}
		let nnnnnn = $(_secondThis).find('.praiseNum').html();
			
		$.ajax({
			type:"POST",
			url:"/api/blog/uploadSecondPraise",
			data:JSON.stringify({
				id,
				secondCommentor:secondcommentor,  //根评论的用户名
				secondCommentCreatetime:secondcommenttime,	   //根评论的时间
				secondCommentPraise:nnnnnn			//点赞数目
			}),
			dataType:"json",
			contentType:"application/json",
			success:(res)=>{
				console.log(res);
				lastSecondPraise = _secondThis;
			}
		})
	}
}


//二级评论的回复
function replySecondComment(firstcommenter,firstcommenttime){
	numNew = numNew +1;	
	var that=event.currentTarget;//监听器触发事件的节点
	if(numNew%2==1){
		$(that).parent().append(`
			<div class="textSecondReply" style="margin: 30px 0px 0px 0px;">
				<textarea  class="newEmotion2" style="resize: none;width:100%;min-height: 80px;box-sizing: border-box;font-size: 18px;"></textarea>	
				<div id="funcButtonNew" style="width:100%;height: 40px;font-size: 25px;line-height: 25px;">
					<span class="iconfont faceNew2">&#xe608;</span>
					<span class="iconfont gifNew2">&#xe64d;</span>
					<span class="iconfont">&#xe613;</span>
					<input class="secondCommentReply" type="button" value="发布" onclick="replySecondDisplay('${firstcommenter}',${firstcommenttime})" style="float: right;width: 60px;font-size: 18px;height: 25px;"></input>
				</div>
			</div>	
		`);
		// 绑定表情,评论的时候可以点击sina表情
		$('.faceNew').SinaEmotion($('.newEmotion2'));
	}else if(numNew%2==0){
		$(that).parent().find('.textSecondReply').remove();
	}

	//撑开评论区的高度
	magnifyPage();
}

//二级评论回复之后的内容显示
function replySecondDisplay(firstcommenter,firstcommenttime){
	var inputTextSecond = $('.newEmotion2').val();

	var iconclon = $(".userIconComment").clone();//克隆图片
	var _bkSecond = iconclon.css('backgroundImage');
	var iconSecond = _bkSecond.split('(')[1].split(')')[0]; //icon地址
	
	let timeSecond = Date.now();//获取评论的时间
	let timeFormatSecond = getMyDate(timeSecond);//时间毫秒数格式化
	createtimeSecond = timeSecond;
	
	var that=event.currentTarget;//监听器触发事件的节点
	var uName = $(that).parent().parent().parent().find('.uNameSecond').html();
	if(uName.split(':回复@')){
		uName = uName.split(':回复@')[0];
	}
	
	$(that).parent().parent().parent().after(`
		<div style="overflow:hidden;position:realative;margin: 30px 0 0px 0px;">
			<div class="userIconComment" style='width: 50px;height: 50px;margin-left:0;background: url(${iconSecond}) no-repeat;background-size: contain;float: left;'></div>
			<div class="test222" style="min-height:50px;width:100%;" onclick="replySecondComment()">
				<div class="commentContext" style="margin-left:60px">
					<span class="uNameSecond" style="color:#eb7350">${username()}:回复@${uName}</span> <span class='${timeSecond}'>${timeFormatSecond}</span>
					<span style="display:inline-block;float:right">
						<a class="deleteComment">删除</a>
						<span class="clickPraise" onclick="uploadSecondPraise(${id},'${username()}:回复@${uName}',${timeSecond},0)">
							<span class="iconfont">&#xe505;</span>
							<span class="praiseNum">0</span>
						</span>
					</span>
				</div>
				<div style="overflow:hidden;margin-left:60px">
					${AnalyticEmotion(inputTextSecond)}
				</div>
			</div>
		</div>	
	`);
	deleteCommentModel(firstcommenter,firstcommenttime,username(),timeSecond);//删除
	$(that).parent().parent().remove();//删除textarea框
	numNew = 0;
	
	//撑开评论区的高度
	magnifyPage();
	
	//发送ajax请求,把二级评论的内容存储到数据库
	$.ajax({
		type:"POST",
		url:"/api/blog/saveSecondComments",
		data:JSON.stringify({
			id,			
			rootCommentor:firstcommenter,
			rootCommentTime:firstcommenttime,
			secondCommentorIcon:iconSecond,
			secondCommentor:username()+':回复@'+uName,
			secondCreatetime:timeSecond,
			secondCommentContext:AnalyticEmotion(inputTextSecond),
			secondCommentPraise:parseInt($('.praiseNum').html())
		}),
		dataType:"json",
		contentType:"application/json",
		success:(res)=>{
//			console.log(res);
		}
	});
}

function username(){
	//首先我要获取username
	detailBlogUrl = window.location.href;
	//解析url获取usernmae
	const pat = detailBlogUrl.split('?')[1];
	user = pat.split('&')[0].split('=')[1];
	return user;
}

//撑开页面的高度
function magnifyPage(){
	$('#commentsWrapper').height($('.readersComment').height());
}

//textarea高度自适应
function setHeight(element) {
  $(element).css({'height':'auto','overflow-y':'hidden'}).height(element.scrollHeight);
}

function commentsAdaption(){
	//评论模块所有textarea高度自适应
	$('textarea').each(function () {
	  setHeight(this);
	}).on('input', function () {
	  setHeight(this);
	});
}
