var articlesNum;//文章数
var commentsNum;//评论数
var pageViews;    //浏览量
var clickType="功能建议";	//1表示功能建议，2表示bug反馈
var closeFeedback;
var cancelFeedback;
var feedbackButton;
var feedbackForm;
var mask;

$(document).ready(()=>{
	$('#contentWrapper').after(advertisementModel);
	
	//最新留言
    leavingMessage();
    
    //猜你喜欢
    recommendBlog();
    
    //文章总数
    getArticlesNum();
    
    //浏览总数
    getPageViews();
    
    //评论总数
    getCommentsNum();
    
    //反馈意见的点击
    feedbackTypeChange();
    
    //当hover微信QRCode时，display为block
    var weixin = document.getElementById('wechat');
    var wechatQRCode = document.getElementsByClassName('QrCode')[0];//微信二维码
	weixin.onmouseenter = ()=>{
    	wechatQRCode.style.display = 'block'
    }
    weixin.onmouseleave = ()=>{
    	wechatQRCode.style.display = 'none'
    }
	
	//点击反馈按钮，显示出反馈的方框
	feedbackButton = document.getElementsByClassName('feedback')[0];
	feedbackForm = document.getElementById('feedback');
	mask = document.getElementById('mask');
	
	feedbackButton.onclick = ()=>{
		mask.style.display = 'block';
		var maskHeight = $(document).height();	
		mask.style.height = maskHeight + 'px';
		feedbackForm.style.display = 'block';
	}
	
	//点击关闭，取消按钮，马上关闭反馈页面
	closeFeedback = document.getElementById('closeWindow');
	cancelFeedback = document.getElementById('cancelButton')
	closeFeedback.onclick = closeFeedbackFuc;
	cancelFeedback.onclick = closeFeedbackFuc;
	
	//点击提交反馈意见，显示提交成功
	$('#confirmButton').click(()=>{
		const feedbackType = clickType;
		const title = $('#feedbackTitle input').val();
		const context  = $('#feedbackContent textarea').val();
		uploadFeedback(feedbackType,title,context);
	})

	//回到顶部的按钮
	var toTop = document.getElementsByClassName('up')[0];
	var toDown = document.getElementsByClassName('down')[0];
	
	//回到顶部按钮从隐藏与显示的切换
	document.onscroll = function(){
		if(document.documentElement.scrollTop>600){
			toTop.style.display = 'block';
			//回到顶部的按钮显示出来之后才能执行点击事件
			toTop.onclick = function(){
				window.scrollTo({ 
				    top: 0, 
				    behavior: "instant" 
				});
			}
		}else{
			toTop.style.display = 'none';
		}
	}
	
	//回到底部的按钮
	toDown.onclick = function(){
		window.scrollTo({ 
		    top: document.body.scrollHeight, 
		    behavior: "smooth" 
		});
	};
	
})

//关闭feedback的函数
function closeFeedbackFuc(){
	feedbackForm.style.display = 'none';
	mask.style.display = 'none';
}


//右边广告栏的模板
function advertisementModel(){
	return `
		<div id="advertisements" style="width:25%;float:right">
				<!--右边的每日寄语-->
				<div id="blackBoard">
					<img src="./img/home/blackboard.png" class="boardImg" width="100%"/>
					<h1 id="title">每日一语</h1>
					<span>真正的程序员的程序不会在第一次就正确运行，但是他们愿意守着机器进行若干个30小时的调试改错。</span>
				</div>
				<div id="about">
					<img src="./img/home/2019.jpg" width="100%" height="30%" />
					<div id="myIconWrapper">
						<div id="myIcon">
							<div id="logoV"></div>
						</div>
					</div>
					<div id="name">
						<div>白小晖</div>
						<div id="admin">管理员</div>
					</div>
					<div style="width: 100%;height: 33px;" id="contact">
						<span style="width: 20%;height: 100%;display:block;" id="wechat"></span>
						<span style="width: 20%;height: 100%;display:block;" id="qq"></span>
						<span style="width: 20%;height: 100%;display:block;" id="weibo"></span>
					</div>
					<div id="blogSolution">
						<div id="articlesNum">
							<span>文章</span>
							<span></span>
						</div>
						<div id="comments">
							<span>评论</span>
							<span></span>
						</div>
						<div id="scanNum">
							<span>浏览</span>
							<span></span>
						</div>
					</div>
					<div class="QrCode" style="margin-left: 1%;">
						<img src="./img/home/wechatQrCode.jpg" width="90px" height="90px"/>
						<div style="margin-left: 35%;">
							<img src="./img/home/triangle.png" width="30%" height="10%"/>
						</div>
					</div>
				</div>
			
				<div id="ad1">
					<div class="messWrapper">
						<div class="rightTriangle"></div>
						<div class="messTitle">最新留言</div>
					</div>
					<div class="commentsRight">
						<!--最新留言-->
					</div>
				</div>
				<div id="ad2">
					<div class="messWrapper">
						<div class="rightTriangle"></div>
						<div class="messTitle">猜你喜欢</div>
					</div>
					<div class="recommendArticles">
						<!--猜你喜欢-->
					</div>
				</div>
				
				<div id="redPackets">
					<div class="messWrapper">
						<div class="rightTriangle"></div>
						<div class="messTitle">打赏博主</div>
					</div>
					<div id="wechatPacket"></div>
					<div id="zhifubao"></div>
					<div style="margin:2% 17%;margin-left: 20%;text-indent: 16px;line-height: 22px;">打赏的都是天使，打赏了的人都会变美~</div>
				</div>
			</div>
		</div>
		
		<div id="upDown">
			<span class="iconfont up" title="回到顶部">&#xe601;</span>
			<span class="iconfont feedback" title="反馈意见">&#xe666;</span>
			<span class="iconfont down" title="移到底部">&#xe601;</span>
		</div>
		
		<!--反馈的输入框-->
		<div id="feedback" style="height: 430px;width: 50%;background: white;position: fixed;bottom: 20%;left: 20%;border-radius: 5px;">
			<div style="width: 90%;padding: 0 5%;height: 60px;font-size: 20px;border-bottom: 1px solid lightgray;">
				<span style="display: inline-block;line-height: 60px;">建议反馈</span>
				<span id="closeWindow" class="iconfont" style="margin-left: 80%;">&#xe50c;</span>
			</div>
			<div>
				<div class="feedbackType">
					<span>反馈类型</span>
					<span class="advises">功能建议</span>
					<span class="bugFeedback">Bug反馈</span>
				</div>
				<div id="feedbackTitle">
					<span>标题</span>
					<input placeholder="请输入标题"/>
				</div>
				<div id="feedbackContent">
					<span>内容</span><textarea placeholder="请输入提交内容" rows="7"></textarea>
				</div>
			</div>
			<div id="submitButton">
				<div id="cancelButton">取消</div>
				<div id="confirmButton">确认</div>
			</div>
			
			<p id="successTip" style="position:absolute;z-index:1111111111;height:80px;width:300px;
			background:white;text-align:center;font-size:20px;line-height:80px;top:-100px;left:180px;display:none;">感谢您对本站的大力支持!</p>
		</div>
`}

//将功能建议和bug反馈的数据传送到数据库
function uploadFeedback(feedbackType,title,context){
	$.ajax({
		url:'/api/blog/uploadFeedback',
		type:'POST',
		dataType:'json',
		contentType: "application/json",
		data:JSON.stringify({
			feedbackType,
			title,
			context
		}),
		success:(result)=>{
			if(result.errNum==0){
				$('#successTip').css('display','block');
				setTimeout(()=>{
					closeFeedbackFuc();
					$('#successTip').css('display','none');	
				},1000);
			}
		}
	})	
}

//功能建议和bug反馈
function feedbackTypeChange(){
	$('.advises').click(()=>{
		var _this = event.currentTarget;
		$(_this).css('border-color','deepskyblue');
		$('.bugFeedback').css('border-color','darkgray');
		clickType = "功能建议";
	});
	$('.bugFeedback').click((e)=>{
		var _this = event.currentTarget;
		$(_this).css('border-color','deepskyblue');
		$('.advises').css('border-color','darkgray');
		clickType = "意见反馈";
	})
}

//得到文章总数
function getArticlesNum(){
	$.ajax({
		url:'/api/blog/articlesNum',
		type:'GET',
		dataType:'json',
		contentType: "application/json",
		success:(result)=>{
			if(result.errNum == 0){
				articlesNum = result.data;
				$('#articlesNum span:last').html(articlesNum);
			}
		}
	})	
}

//得到评论总数
function getCommentsNum(){
	$.ajax({
		url:'/api/blog/getCommentsNum',
		type:'GET',
		dataType:'json',
		contentType: "application/json",
		success:(result)=>{
			if(result.errNum==0){
				commentsNum = result.data;
				$('#comments span:last').html(commentsNum);
			}
		}
	})	
}

//得到浏览总数
function getPageViews(){
	$.ajax({
		url:'/api/blog/getPageViews',
		type:'GET',
		dataType:'json',
		contentType: "application/json",
		success:(result)=>{
			if(result.errNum==0){
				pageViews = result.data[0].totalReaders;
				$('#scanNum span:last').html(pageViews);
			}
		}
	})	
}

//最新留言添加ajax请求
function leavingMessage(){
	$.ajax({
		url:'/api/blog/newestComments',
		type:'GET',
		dataType:'json',
		contentType: "application/json",
		success:(result)=>{
			const dat = result.data;
			dat.forEach((value,index)=>{
				let headicon = (value.firsticon).replace(/\"/g,"");
				$('.commentsRight').prepend(`
					<div class="comment">
						<div class="userIcon" style="background-image:url(${headicon})"></div>
						<div class="commentWrapper">
							<div class="userComment">${AnalyticEmotion(value.firstcontext)}</div>
							<div class="UserMess">
								<span>${value.firstcommentor}</span>
								<span>评论于：${dataFormated(value.firstcommenttime)}</span>
							</div>
						</div>
					</div>
				`);
			})
			
			//控制留言区图标的旋转
			$('.comment').hover((e)=>{
				_this = e.target;
				$(_this).find('.userIcon').css('transform','rotateZ(360deg)')
			},()=>{
				$(_this).find('.userIcon').css('transform','rotateZ(-360deg)')
			})
		}
	})	
}

//猜你喜欢
function recommendBlog(){
	$.ajax({
		url:'/api/blog/recommendBlog',
		type:'GET',
		dataType:'json',
		contentType: "application/json",
		success:(result)=>{
			if(result.errNum==0){
				const dat = result.data;
				dat.forEach((value,index)=>{
					$('.recommendArticles').append(`
						<div class="recommendArticle">
							<span class="articleOrder">${index+1}</span>
							<span class="articleTitle">${value.title}</span>
						</div>
					`)
				})
			}
		}
	})	
}

// 毫秒数转换成标准数据格式
function dataFormated(str) {
    var oDate = new Date(str),
    oMonth = oDate.getMonth()+1,
    oDay = oDate.getDate(),
    oTime = addZero(oMonth) +'-'+ addZero(oDay);
    return oTime;
}

//补零操作
function addZero(num){
    if(parseInt(num) < 10){
        num = '0'+num;
    }
    return num;
}
