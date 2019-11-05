/*
* 顶部轮播参数说明
* obj : 动画的节点，本例中是ul
* top : 动画的高度，本例中是-35px;注意向上滚动是负数
* time : 动画的速度，即完成动画所用时间，本例中是500毫秒，即marginTop从0到-35px耗时500毫秒
* function : 回调函数，每次动画完成，marginTop归零，并把此时第一条信息添加到列表最后;
* 
*/ 
var keywordBlogs;

function noticeUp(obj,top,time) {
    $(obj).animate({
        marginTop: top
    }, time, function () {
        $(this).css({marginTop:"0"}).find(":first").appendTo(this);
    })
}

//页面顶部栏的html模板
function topModel(path){
	return `
			<div id="banner">
				<span>
					白小晖的个人博客
				</span>
			</div>
			<div id="topBar">
				<div class="wrapper"> 
					<nav id="content" style="position:relative">
						<a href="./index.html" id="default" class="tapBar bar1" >首页</a>
						<ul  class="tapBar bar2" style="height:300px;visibility:visible;">
							<li><a href="./technique.html">技术杂谈</a></li>
							<li><a href="./technique.html?type=CC">C/C++</a></li>
							<li><a href="./technique.html?type=Python">Python</a></li>
							<li><a href="./technique.html?type=Java">Java</a></li>
							<li><a href="./technique.html?type=AI">机器学习</a></li>
							<li><a href="./technique.html?type=Other">其他</a></li>
						</ul>
						<a id="diaryItem" href="./diary.html" class="tapBar bar3" style="margin-left:16%">个人日记</a>
						<a id="authorItem" href="./author.html" class="tapBar bar4">关于作者</a>
						<a href="./messageWall.html" class="tapBar bar5">留言区</a>
					</nav>
					<div class="Input">
						<input type="search" class="searchInfo" placeholder="搜索..." onfocus="keySerach(event)" />
						<i class="searchIcon"></i>
					</div>
				</div>
			</div>
			
			<div id="tipBar">
				<div>
					<span class="iconfont" style="color:#00a67c">&#xe675;</span>
					<span class="explain">欢迎来访&sim;</span>
				</div>
				
				<div class="notice">
				    <ul>
				        <li>欢迎光临白小晖个人博客网站</li>
				        <li>本博客主要用于前端技术以及相关源码的分享</li>
				        <li>博主只是一名学生,所以技术一般,望各位大牛多多指正</li>
				        <li>祝你们在本博客里都有所收获!</li>
				    </ul>
				</div>
				
				<div class="contribute">
					<span class="iconfont">&#xe620;</span>
					<span class="explain username" style="color:#00a67c">${getUsername()}</span>
				</div>
				<div class="hasLogined">
					<span class="iconfont">&#xe728;</span>
					<span class="explain loginStatus" style="color:#00a67c">退出</span>
				</div>
				<div class="writeBlog">
					<span class="iconfont">&#xe6e1;</span>
					<span style="color:#00a67c">发表文章</span>
				</div>
			</div>	
`}

$(()=>{
	let path;
	const urlDecoded = decodeURI( window.location.href);//对url进行解码
	if(urlDecoded.split('?')){
		path =urlDecoded.split('?')[1];
	}
	$('body').prepend(topModel(path));
	
	//登录与退出
	logout();
	
	//用户登录后进入管理后台
	backstage();
	
	//写博客
	writeBlog();
	
	// 调用 公告滚动函数
    setInterval("noticeUp('.notice ul','-31px',1000)", 4000);
    
    //第二个tap栏(技术杂谈)的hover事件
    tapTwo();
})


function tapTwo(){
	$('.bar2').hover(()=>{
		$('#topBar').css('overflow','visible');
		ListHover();//下拉菜单的某一项被hover的时候
	},()=>{
		$('#topBar').css('overflow','hidden');
	})
}

//对li进行hover的时候，变色。
function ListHover(){
	$('.bar2 li a').not(':first').hover((e)=>{
		e = e||window.event;
		e.target.style.backgroundColor = '#CDB79E';
	},(e)=>{
		e.target.style.backgroundColor = '#D56464';
	})
}

//当退出按钮被点击时
 function logout(){
	$('.hasLogined').click(()=>{
 		let txt = $('.loginStatus').html();
		if(txt=="登录"){
			window.location.href =  './login.html';		
		}else{
			$('.loginStatus').html('登录');
			$('.username').html('用户');
		}
 	})
 }

//点击用户名，进入管理后台
function backstage(){
	$('.contribute').click(()=>{
		let txt = $('.username').html();
		if(txt!="用户"){
			window.location.href = './admin.html?username='+txt;		
		}
 	})
}

//登录之后，可以发表文章
function writeBlog(){
	$('.writeBlog').click(()=>{
		const username = $('.username').html();
		if(username==""||username==undefined||username=="用户"){
			window.location.href='./login.html';
		}else{
			window.location.href='./writeBlog.html';
		}
	})
}

//通过url获取用户名
function getUsername(){
	if(window.location.href.split('?username=').length>1&&window.location.href.split('?username=')[1]!="undefined"){
		var user222 = window.location.href.split('?username=')[1].split('&')[0];
		if(user222){
			return user222;
		}else{
			return user;
		}
	}else{
		return "用户"
	}
}

//通过搜索框的关键词搜获取指定文章
function keySerach(evt){
	document.body.onkeyup = function (e) {
	    e = e || window.event
		if(e.keyCode==13){
			let keyWord = evt.target.value;//关键词
			window.location.href = './keywordSearch.html?keyword='+keyWord;
		}
	}
}
