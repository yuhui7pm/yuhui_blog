var face = 4;//同一个方向旋转至少四个面 
var num = 0;
var last_num = 0;//用来存储上一个num
var num_negative = 0;//当num为负数时,如果不设置为0的话，最开始点击图片的时候不会滚动。
var num_positive = 0; //当num为负数时，如果不设置为0的话，最开始点击图片的时候不会滚动。
var multiple;
var classname;
var rotateIndex;
var count = 8000;//设定计时器的时间
var lastClickedPic;//储存上一张被点击的图片	
var timer;

$(()=>{
	//控制轮播按钮的hover，hover时高亮
	var imgWrap = document.getElementById('Banner');	
	var bannerWrapper = document.getElementById('bannerWrapper');
	var buttonLeft = document.getElementsByClassName('button_left')[0];
	var buttonRight = document.getElementsByClassName('button_right')[0];

	hasLogined();
	hotBlogs();//获取博客热门排行
	
	timer = window.setInterval(time,count);//转2s，停3秒
	//鼠标进入轮播图，两个按钮就显示出来
	bannerWrapper.onmouseenter = buttonHover;
	bannerWrapper.onmouseleave = buttonLeave;
	//点击按钮，轮播图滚动
	picRoll(buttonLeft,buttonRight);
		
//	visibilitychange 事件判断页面可见性，为了防止轮播图疯狂滚动
    var vibchage="visibilitychange" || "webkitvisibilitychange" || "mozvisibilitychange";
    document.addEventListener(vibchage,function (){
        if(!document.hidden)
        {
            timer = window.setInterval(time,count); //网页可见的时候就启动计时器
        }else{
			clearInterval(timer);//网页不可见的时候就隐藏计时器
        }
    });
})

//博客热门排行
function hotBlogs(){
	$.ajax({
		url:'/api/blog/hotBlogs',
		type:'GET',
		dataType:'json',
		contentType: "application/json",
		success:(result)=>{
			const data = result.data;
			let len = data.length;
			if(result.errNum ==0){
				data.forEach((value,index)=>{
					$('#contextsWrapper').prepend(`
						<div class="context">
							<span id="number">${len-index}</span>
							<span id="article_title">${value.title}</span>
							<span id="like_start" >
								<span class="iconfont">&#xe63b;</span>
								<span id="start_description">
									${value.praisenum}喜欢
								</span>
							</span>
						</div>	
					`)
				})
			}
		}
	})	
}

//判断用户有无登录
function hasLogined(){
	if(window.location.href.split('?').length>1){
		const path = window.location.href.split('?')[1];
		const username = path.split('=')[1];
		document.getElementsByClassName('username')[0].innerHTML = decodeURI(username);
		document.getElementsByClassName('loginStatus')[0].innerHTML = '退出';
	}else{
		$('.username').html('用户');
		$('.loginStatus').html('登录');
	}
}

function changeFrameHeight(){
	var ifm= document.getElementsByClassName("articles")[0];
	ifm.height=document.documentElement.clientHeight;
}

//定义一个定时器，让轮播图自动播放
function time(){
	last_num = num;
	num++;
	
	if(num<0){
		multiple = Math.ceil(Math.abs(num)/4) 
		num_positive = 4*multiple - Math.abs(num);
	}else{
		num_positive = num;
	}
	
	document.getElementsByClassName('bannerClass')[0].style.transform = 'rotateX('+num*90+'deg)';	
	document.getElementById('album').children[(num_positive+3)%4].setAttribute('style','filter: opacity(0.7);'); //让上一张照片恢复透明
	document.getElementById('album').children[num_positive%4].setAttribute('style','filter: opacity(1);');//变亮
	
	//当右边的album对应轮播图的图片时，会高亮
	if(num == 100){ //不能让num已知算下去，到达阈值时要适当地停止
		num = 0;
		last_num = 0;
		num_negative = 0;
		num_positive = 0;
	}
}

//鼠标进入轮播图，按钮显示
function buttonHover(){
		document.getElementsByClassName('button_left')[0].style.display = 'block';
		document.getElementsByClassName('button_right')[0].style.display = 'block';
}
//鼠标离开轮播图，按钮消失
function buttonLeave(){
	document.getElementsByClassName('button_left')[0].style.display = 'none';
	document.getElementsByClassName('button_right')[0].style.display = 'none';
}

//获取cookie
//function getCookie(cookieName){  
//      var cookieValue="";  
//      if (document.cookie && document.cookie != '') {   
//          var cookies = document.cookie.split(';');  
//          for (var i = 0; i < cookies.length; i++) {   
//               var cookie = cookies[i];  
//               if (cookie.substring(0, cookieName.length + 2).trim() == cookieName.trim() + "=") {  
//                     cookieValue = cookie.substring(cookieName.length + 2, cookie.length);   
//                     break;  
//               }  
//           }  
//      }   
//      return cookieValue;  
//  } 


window.onResize=function(){
	changeFrameHeight();
}

function picRoll(buttonLeft,buttonRight){
	//点击左边的按钮时，往上翻页
	buttonLeft.onclick = function(){
		clearInterval(timer);
		num--;
		if(num<0){
			multiple = Math.ceil(Math.abs(num)/4) 
			num_negative = 4*multiple - Math.abs(num);
		}else{
			num_negative = num%4;
		}
		toOpacity();	//全部变透明
		document.getElementById('album').children[num_negative].setAttribute('style','filter: opacity(1);');//变亮
		document.getElementsByClassName('bannerClass')[0].style.transform = 'rotateX('+num*90+'deg)';
		timer = window.setInterval(time,count); //按下按钮之后，再次启动定时器，让轮播图继续动
	}
	
	//点击右边的按钮时，往下翻页
	buttonRight.onclick = function(){
		clearInterval(timer);
		last_num = num;
		num++;
		if(num<0){
			multiple = Math.ceil(Math.abs(num)/4);
			num_positive = 4*multiple - Math.abs(num);
		}else{
			num_positive = num;
		}
		toOpacity();	//全部变透明
		document.getElementById('album').children[num_positive%4].setAttribute('style','filter: opacity(1);');//变亮
		document.getElementsByClassName('bannerClass')[0].style.transform = 'rotateX('+num*90+'deg)';
		timer = window.setInterval(time,count); //按下按钮之后，再次启动定时器，让轮播图继续动
	}
	
	//点击左侧图片，跳转到当前的轮播图
	document.getElementById("album").onclick = function(e){
		clearInterval(timer);
        e = e || window.event;//获取事件对象。IE和Chrome下是window.event FF下是e
        target = e.target||e.srcElement;
        classname = target.className;
		//如果当前被点击的图片和上一张被点击的不是同一张，就执行下一步
    	rotateIndex = parseInt(classname.replace(/[^\d]/g,''));//剔除字符串中的非数字字符
		num = num+rotateIndex-num%4;
		toOpacity();	//全部变透明
		document.getElementsByClassName('bannerClass')[0].style.transform = 'rotateX('+(num)*90+'deg)';
		document.getElementById('album').children[rotateIndex].setAttribute('style','filter: opacity(1);');//变亮
		timer = window.setInterval(time,count); //按下按钮之后，再次启动定时器，让轮播图继续动
	}
}

//点击切换图片时，全部变透明
function toOpacity(){
	var len = $('#album img').length;
	for(var i = 0;i<len;i++){
		document.getElementById('album').children[i].setAttribute('style','filter: opacity(0.7);');//变亮
	}
}


//页面卸载时候，解绑事件
window.onunload = ()=>{
	 //去掉轮播图相关的点击绑定的事件
	buttonLeft.onclick = null;
	buttonRight.onclick = null;
	document.getElementById("album").onclick = null;
}

