var dat = [];
var datKey =[];
var datValue = [];
var attribute =[];
var path;
var clickCount=0;
var strNum = 0;
var $Last;
var num;
var emojiContent = ["鼓掌","赞","草泥马","愤怒","鄙视"];
var count1=0,
	count2=0,
	count3=0,
	count4=0,
	count5=0;
var count = [];
var emojiStatus = [];
var emojiClass = ["applaus","praise","caonima","angry","despise"];//对应数据库
var indexOriginal;//从数据库中读取的原始数据
var authorWithEmoji = [];
var user;//从url获取的用户名
var author,createtime;
var usernamePath;//前端显示的用户名
var readerIcon;//从数据库读取出来的用户icon

$(()=>{
	//显示登录的用户名
	usernamePath = window.location.href.split('?')[1].split('&')[0].split('=')[1];
	$('.username').html(usernamePath);
	//进行验证获取指定文章的数据
	articleVeritify();
	var blogContext	= $.ajax({
							url:'/api/blog/detail',
							type:'GET',
							dataType:'json',
							contentType: "application/json",
							data:{
								id:datValue,
							},
							success:(result)=>{	
								content(result.data);
								author = result.data.author;
								createtime = result.data.createtime;
								addHeight();//根据内容，自动撑开高度
								getEmojis(author,createtime);//get请求
							},
							error:(err)=>{
								console.error(err);
							}
				});
	
	//读取用户icon
	readerIcon();
})

//读取用户的icon
function readerIcon(){
	$.ajax({
		url:'/api/user/userIcon',
		type:'GET',
		dataType:'json',
		contentType: "application/json",
		data:{
			username:usernamePath
		},
		success:(result)=>{	
			if(result.data.length>1){
				readerIcon = result.data[0].icon;
			}else{
				//游客默认头像
				readerIcon = "headIcon/default.jpg";
			}
		}
	});
}

//获取url上面的username和createtime
function articleVeritify(){
	path = window.location.href.split('?')[1];
	dat = path.split('&')[1].split('=');
	datKey = dat[0];
	datValue = dat[1];//blogId
}

// 毫秒数转换成标准数据格式
function getMyDate(str) {
    var oDate = new Date(str),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth()+1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMin = oDate.getMinutes(),
    oSen = oDate.getSeconds(),
    oTime = oYear +'-'+ addZero(oMonth) +'-'+ addZero(oDay) +' '+ addZero(oHour) +':'+
			addZero(oMin) +':'+addZero(oSen);
    return oTime;
}

//补零操作
function addZero(num){
    if(parseInt(num) < 10){
        num = '0'+num;
    }
    return num;
}

//博客正文的模板
function content(item){
	$('.blogContext').append(`
		<div class="title">${item.title}</div>
		<div class="articleBottom" style="padding-left:0">
			<span class="item">
				<span class="author iconfont">&#xe620;</span><span>${item.author}&nbsp;</span>
			</span>
			<span class="item">
				<span class="time iconfont">&#xe60d;</span><span>${getMyDate(item.createtime)}&nbsp;</span>
			</span>
			<span class="item">
				<span class="observers iconfont">&#xe65d;</span><span>${item.readers}&nbsp;</span>
			</span>
			<span class="item">
				<span class="comments iconfont">&#xe613;</span><span>${item.comments}</span>
			</span>
		</div>
		<div class="articleInBlog">
			<p class="contentHeight">
				${item.content.replace(/\n/g,"<br>")}
			</p>
		</div>
	`)
}

//根据内容，自动撑开高度
function addHeight(){
	var pHeight = $('.contentHeight').height();//当前p的高度
	var emotionHeight = $('.cy-wrapper').height();//表情包栏
}	
		
//获取表情数目
function getEmojis(author,createtime){
	//从数据库查看博客有多少表情
	$.get("/api/blog/getEmojis",
	{
		author,
		createtime
	},
	function(getEmojis){
		emotion(getEmojis.data); //添加表情
	},"json");
}

//博客最后加入：看完这篇文章的心情
function emotion(data){
	//最开始的时候都是为0
	for(var m=1;m<6;m++){
		$('.emojiList').append(`				
			<li class="btn">
				<div><img src="../img/commentEmoji/comment${m}.gif"></div>
				<p class="emojiContent${m}"></p>
				<p class="emoji5">0人</p>
			</li>
		`);
		$(".emojiContent"+m).html(emojiContent[m-1]);	
		$(".emojiContent"+m).next('p').addClass(emojiClass[m-1])
	}
	
	//读取数据,显示到页面上
	const arrRemoveNull = removeNull(data);
	if(data.length>0){//有数据就显示
		for(var n=0;n<data.length;n++){
			if(data[n].applaus){count1++;}
			if(data[n].praise){count2++;}
			if(data[n].caonima){count3++;}
			if(data[n].angry){count4++;}
			if(data[n].despise){count5++;}
		};	
		count = [count1,count2,count3,count4,count5];
		count.forEach((value,index)=>{
			$(".emojiContent"+(index+1)).next('p').html(value+'人');	
		})
	}
	emojiClick(data);//表情点击事件,如果登录前就已经点击了,那么没有点击效果;
}

//详情页点击5个表情
function emojiClick(data){
	authorWithEmoji["applaus"]=null;//返回表情数据的初始化操作
	authorWithEmoji["praise"]=null;//返回表情数据的初始化操作
	authorWithEmoji["caonima"]=null;//返回表情数据的初始化操作
	authorWithEmoji["angry"]=null;//返回表情数据的初始化操作
	authorWithEmoji["despise"]=null;//返回表情数据的初始化操作
	
	//首先我要获取username
	detailBlogUrl = window.location.href;
	//解析url获取usernmae
	const pat = detailBlogUrl.split('?')[1];
	user = pat.split('&')[0].split('=')[1];
	for(var n=0;n<data.length;n++){
		for(var key in data[n]){
			if(data[n][key]==user){
				$('.'+key).parent().css('background','lightgray')//初始背景颜色为暗色,说明之前已经点过了
				authorWithEmoji[key] = author;
			}
		}
	}	
	
	indexOriginal = parseInt($(this).find('.emoji5').html());//获得从数据库中读取的原始数值
	
	//执行点击事件:判断已经点击的表情中是否有该用户本身
	$(".btn").click(function () {
		//首先获得该表情的点赞个数
		const cla = $(this).find(".emoji5").attr('class').split(' ')[1];//获得每个表情的类名
		const background = $('.'+cla).parent().css('background-color');

		var index = parseInt($(this).find('.emoji5').html());//获得从数据库中读取的数值
		if(background=='rgba(0, 0, 0, 0)'){//说明是没点过的
			index=index+1;//评论加1
			authorWithEmoji[cla]=user;
			strNum = "+1";
			$(this).css('background','lightgray')//初始背景颜色为暗色,说明之前已经点过了
		}else if(background=='rgb(211, 211, 211)'){
			authorWithEmoji[cla] = "";
			index=index-1;//评论减一
			strNum = "-1";
			$(this).css('background','rgba(0, 0, 0, 0)')//初始背景颜色为暗色,说明之前已经点过了
		}
		$(this).find('.emoji5').html(index+'人');
		
		$.tipsBox({ 
	        obj: $(this), 
	        str: strNum, 
	        callback: function () { 
	        } 
        }); 
        niceIn($(this)); 
        
        console.log(authorWithEmoji,user);
        newEmojisNum(authorWithEmoji,user);//上传点击之后的值
	})
}

//上传点击之后的值
function newEmojisNum(authorWithEmoji,user){
	$.ajax({
		url:"/api/blog/setEmojis",
		type:"POST",
		data:JSON.stringify({
			applaus:authorWithEmoji.applaus,
			praise:authorWithEmoji.praise,
			caonima:authorWithEmoji.caonima,
			angry:authorWithEmoji.angry,
			despise:authorWithEmoji.despise,
			author,
			createtime,
			user,
			blogId:datValue
		}),
		dataType:"json",
		contentType:"application/json",
		success:function(result){
//			console.log(result);
			if(result.errNum=0){
				console.log('表情数据已经上传')
			}
		}
	})
}


(function ($) { 
    $.extend({ 
        tipsBox: function (options) { 
            options = $.extend({ 
                obj: null,  //jq对象，要在那个html标签上显示 
                str: "+1",  //字符串，要显示的内容;也可以传一段html，如: "<b style='font-family:Microsoft YaHei;'>+1</b>" 
                startSize: "16px",  //动画开始的文字大小 
                endSize: "32px",    //动画结束的文字大小 
                interval: 800,  //动画时间间隔 
                color: "red",    //文字颜色 
                callback: function () { }    //回调函数 
            }, options); 
            $("body").append("<span class='num'>" + options.str + "</span>"); 
            var box = $(".num"); 
            var left = options.obj.offset().left + options.obj.width() / 2; 
            var top = options.obj.offset().top + options.obj.height()/2; 
            box.css({ 
                "position": "absolute", 
                "left": left + "px", 
                "top": top + "px", 
                "z-index": 9999, 
                "font-size": options.startSize, 
                "line-height": options.endSize, 
                "color": options.color,
                 "font-weight":"bold"
            }); 
            box.animate({ 
                "font-size": options.endSize, 
                "opacity": "0", 
                "top": top - parseInt(options.endSize) + "px" 
            }, options.interval, function () { 
                box.remove(); 
                options.callback(); 
            }); 
        } 
    }); 
})(jQuery); 
   
function niceIn(prop){ 
    prop.find('i').addClass('niceIn'); 
    setTimeout(function(){ 
        prop.find('i').removeClass('niceIn');     
    },1000);         
} 


//去除对象中的null值
function removeNull(option){
    if(!option){
        return;
    }
    for(var attr in option){
        if(option[attr] === null){
            delete option[attr];//delete方法（删除对象属性、变量
            continue;
        }
        if(typeof(option[attr]) == "object"){
            removeNull(option[attr]);
        }
    }
}