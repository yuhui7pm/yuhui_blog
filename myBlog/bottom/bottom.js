var workWith = ["Python.","C++.","Java.","Matlab.","Vue.","Node.","React."];//定义要改变的字母
//var workWith = ["Python"];//定义要改变的字母
var i=0,j=0;	
var arr = [];//拓展运算符,获取每个字符串
var workWithLength = workWith.length;
var num=0;
var index =0;
var test = 0;
var delay = 1000;//字体删除的时候先暂停1s

$(()=>{
	$('body').append(`
		<div id="bottom" style="width:100%;clear:both;">
			<div class="aboutWebWrapper">
				<div class="aboutWeb">
					<h3>关于本站</h3>
					<p>白小晖个人博客是关注互联网以及分享人工智能相关知识的个人网站，主要涵盖了网络爬虫、机器学习、深度学习等经验教程。网站宗旨：把最实用的经验，分享给最需要的读者，希望每一个来访的朋友都能有所收获！</p>
				</div>
				<div class="aboutWebRight">
					<div class="dynamicLetters">
						<span>I work with </span>
						<span class="changeLetters"></span><span class="randomLetters"></span>
					</div>
					<img src="./bottom/girl_bottom.gif" height="50px" width="50px">
				</div>
			</div>
			<div class="copyrightWrapper">
				<div class="copyright">
					Copyright © 2019 白小晖个人博客 版权所有   备案号：苏ICP备15003834号
				</div>
				<div class="days">
					<span class="shaky">(๑￫ܫ￩)</span>
					<span id="existingTime" style="font-size:'楷体'"></span>
				</div>
			</div>
		</div>	
	`);	
	
	addLetter();//这是底部的字体增加与删除部分
	show_date_time(); //显示网站运行时间
})

//生成随机颜色
function randomColor(){
	var colorStr="";//颜色字符串
    var randomArr=['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];//字符串的每一字符的范围
    for(var i=0;i<6;i++){//产生一个六位的字符串,因为RGB为6位
	    //15是范围上限，0是范围下限，两个函数保证产生出来的随机数是整数
	    colorStr+=randomArr[Math.ceil(Math.random()*(15-0)+0)];
    }
    return '#'+colorStr;
}

//生成随机字符
function randomChar(index){
	const str = "abcdefghijklmnopqrstuvwxyz0123456789!~`#@$%^&*()?,.";
	const randomStr = str.charAt(Math.ceil(Math.random()*(str.length)));//生成随机的字符
	setInterval(()=>{
		$('.rgbFont'+index).html(str.charAt(Math.ceil(Math.random()*(str.length))));
		$('.rgbFont'+index).css('color',randomColor());
	},70)
}

//删除字符串
function disappear(i){
	var disappear = setInterval(()=>{		//一个个的消除字母
		if(index>=i){
			index = 0;
			clearInterval(disappear);
			addLetter();
		}else if(index<i){
			$('.changeLetters').find(`span:eq(${i-1-index})`).remove();	
			$('.randomLetters').append(`<span class="rgbFont${i-1-index}"></span>`);
			randomChar(i-1-index);
			index++;
		}
	},150)
}

//添加字符串
function addLetter(arr){
	var appear = setInterval(()=>{	//一个个的显示字母
		arr = [...workWith[j]];//拓展运算符,获取每个字符串
		var len = arr.length;	//每一个字符串的长度
		
		if(i>=len){
			clearInterval(appear);//清楚生成字母的定时器
			$('.randomLetters').find('span').remove();
			
			setTimeout(`disappear(${i});`,delay);
			
			i=0;//重新设定初始值
			j=(j+1)%workWithLength;//重新设定初始值
		}else if(i<len){
			$('.randomLetters').find(`span:eq(${i+1})`).remove();
			$('.changeLetters').append(`<span>${arr[i]}</span>`);
			i=i+1;
		}
	},150);
}	

<!--时间计算-->   
<!--时间计算-->  
function show_date_time(){  
	window.setTimeout("show_date_time()", 1000);  
	BirthDay=new Date("08/12/2019 00:00:00");//这个日期是可以修改的  
	today=new Date();  
	timeold=(today.getTime()-BirthDay.getTime());  
	sectimeold=timeold/1000  
	secondsold=Math.floor(sectimeold);  
	msPerDay=24*60*60*1000  
	e_daysold=timeold/msPerDay  
	daysold=Math.floor(e_daysold);  
	e_hrsold=(e_daysold-daysold)*24;  
	hrsold=Math.floor(e_hrsold);  
	e_minsold=(e_hrsold-hrsold)*60;  
	minsold=Math.floor((e_hrsold-hrsold)*60);  
	seconds=Math.floor((e_minsold-minsold)*60);
	var showtime = document.getElementById('existingTime')
	showtime.innerHTML="网站稳定运行："+addZero(daysold)+"天 "+addZero(hrsold)+"时 "+addZero(minsold)+"分 "+addZero(seconds)+"秒 ";  
}  

//补零操作。当小于10时，个位数前面要补零
function addZero(data){
	return data<10?'0'+data:data;//三目运算符
}


