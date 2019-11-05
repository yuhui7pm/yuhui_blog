var flag = true;//直执行一次
var firstLoad = 8;
var end;
var addHeight;
var dat;

window.onload = ()=>{
	if(getUrl()){
		otherTechnique(getUrl());//点击C++、Python、Java、机器学习、其他
	}else{
		All();//获取技术杂谈的全部文章
	}
}

//最开始显示文章的列表
function allLists(item){
	$('#articlesWrapper').append(`
		<div class="article ${item.id}">
			<div class="picture" style="background-image:url(/static/blogIcon/image_${item.author}_${item.createtime}.jpg)"></div>
			<div class="artical_right">
				<div class="title">${item.title}</div>
				<p class="articleDiscription"></p>
				<div class="articleBottom">
					<span class="item" style="height:16px;line-height:16px" style="position:relative;">
						<img src='../img/home/label.svg' height="16px" style="position:absolute;"/>
						<span style="margin-left:20px;text-align:left;display:inline-block;width:40px">${item.classification}</span>
					</span>
					<span class="item" class="">
						<span class="author iconfont">&#xe620;</span><span style="color:#00a67c">${item.author}</span>
					</span>
					<span class="item">
						<span class="time iconfont">&#xe60d;</span><span>${getMyDate(item.createtime)}</span>
					</span>
					<span class="item">
						<span class="observers iconfont">&#xe65d;</span><span style="color:#00a67c">${item.readers}浏览</span>
					</span>
					<span class="item">
						<span class="comments iconfont">&#xe613;</span><span style="color:#00a67c">${item.comments}评论</span>
					</span>
				</div>
			</div>
			</div>
		</div>
	`);
	wrapEllipsis(item);
}

//追加文章列表，有淡入动画
function addLists(item){
	$('#articlesWrapper').append(`
		<div class="article ${item.id}">
			<div class="picture" style="background-image:url(/static/blogIcon/image_${item.author}_${item.createtime}.jpg)"></div>
			<div class="artical_right">
				<div class="title">${item.title}</div>
				<p class="articleDiscription"></p>
				<div class="articleBottom">
					<span class="item" style="height:16px;line-height:16px" style="position:relative;">
						<img src='../img/home/label.svg' height="16px" style="position:absolute;"/>
						<span style="margin-left:20px;text-align:left;display:inline-block;width:40px">${item.classification}</span>
					</span>
					<span class="item" class="">
						<span class="author iconfont">&#xe620;</span><span style="color:#00a67c">${item.author}</span>
					</span>
					<span class="item">
						<span class="time iconfont">&#xe60d;</span><span>${getMyDate(item.createtime)}</span>
					</span>
					<span class="item">
						<span class="observers iconfont">&#xe65d;</span><span style="color:#00a67c">${item.readers}浏览</span>
					</span>
					<span class="item">
						<span class="comments iconfont">&#xe613;</span><span style="color:#00a67c">${item.comments}评论</span>
					</span>
				</div>
			</div>
			</div>
		</div>
	`).hide().fadeIn(200);
	wrapEllipsis(item);
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

//懒加载
function lazyLoad(dat){
	var index = Math.ceil(datLength/firstLoad);//可以加载多少次
	if(datLength>firstLoad){
		$(window).scroll(()=>{
			var scrollTop = (window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop)-200;
			var articlesHeight = ($('#articlesWrapper').height())-200;		
			for(var j=1;j<index;j++){
				if((scrollTop>articlesHeight)&&flag){
					for(var k=0;k<firstLoad-1;k++){
						if(j*firstLoad+k<datLength-1){
							addLists(dat[j*firstLoad+k]);
						}else{
							//要是到底了,我就停止追加
							flag=false;
						}
					}
			 	 }
			}
		})
	}
	$('.bottomTip').html('我已经到底了~~~');
}

//文章懒加载
//function lazyLoad(dat){
//	var index = Math.ceil(datLength/firstLoad);//可以加载多少次
//	$(window).scroll(throttle(lazy,0));	   //滚动时间 在100ms内只执行一次
//}

 // 用户频繁操作 scroll,不免造成页面性能不佳 此刻当然需要配合节流使页面性能更加优化
//function throttle(fn, delay) {  // 定义的参数函数和延迟时间
//  var begin = new Date();
//  return function () {
//      var curtimer = new Date();
//      var contxt = this,
//          args = arguments;
//      if (curtimer - begin > delay) {  // 时间间隔 > 定义时间 才执行
//          fn.apply(contxt, args);
//          begin = curtimer;
//      }
//  }
//}

//function lazy(){
//	if(datLength>firstLoad){
//			var scrollTop = (window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop)-200;
//			var articlesHeight = ($('#articlesWrapper').height())-200;
//			console.log(scrollTop-200,articlesHeight-200)
//			
//			for(var j=1;j<index;j++){
//				if((scrollTop>articlesHeight)&&flag){
//					for(var k=0;k<firstLoad-1;k++){
//						if(j*firstLoad+k<datLength-1){
//							addLists(dat[j*firstLoad+k]);
//						}else{
//							//要是到底了,我就停止追加
//							flag=false;
//						}
//					}
//			 	 }
//			}
//		}
//}

//点击某一选项，跳转到指定页面
function detailClick(user){
	$(".article").on('click',function(){		
		var articleClass = $(this).attr('class');
		var regId = /\d+/gi;//取出文章Id
		var passageId = articleClass.match(regId);
		window.parent.location.href = "./blogDetail.html?username="+user+"&blogId="+passageId;
	});			
}

function getUsername(){
	if(window.location.href.split('?username=').length>1){
		var user = window.location.href.split('?username=')[1].split('&')[0];
		return user;
	}else{
		return "用户";
	}
}

//获取技术杂谈的type
function getUrl(){
	const getURL = window.location.href;
	if(getURL.split('?type=')){
		let result = getURL.split('?type=')[1];
		let classification;
		switch(result){
			case 'CC':
				classification="C++";
				break;
			case 'Python':
				classification="Python";
				break;
			case 'Java':
				classification="Java";
				break;
			case 'AI':
				classification="机器学习";
				break;
			case 'Other':
				classification="其他";
				break;
		}
		return classification;
	}else{
		return All();
	}
}

function All(){
	$.ajax({
		url:'/api/blog/lists',
		type:'GET',
		dataType:'json',
		contentType: "application/json",
		success:(result)=>{
			dat = result.data;
			loadBlogs(dat);
		},
		error:(err)=>{
			console.error(err);
		}
	})	
}

function otherTechnique(type){
	$.ajax({
		url:'/api/blog/otherTechnique',
		type:'GET',
		dataType:'json',
		contentType: "application/json",
		data:{
			classification:type
		},
		success:(result)=>{
			dat = result.data;
			datLength = Object.keys(dat).length;
			end = datLength>firstLoad?firstLoad:datLength;
			
			//首屏加载最多8个list
			for(var i=0;i<end-1;i++){
				allLists(dat[i]);
			}
			//进行懒加载
			lazyLoad(dat);
			
			//跳转到详情页
			detailClick(getUsername());
			
			//获取读者的用户名
			const reader = dat.userid.usernameAuto;
			if(reader){
				$('.loginStatus').html('退出');
				$('.username').html(reader);
			}
		}
	})	
}

//将加载的模块独立出来,为首页关键词搜索提供模板.
function loadBlogs(datTemplate){
	datLength = Object.keys(datTemplate).length;
	end = datLength>firstLoad?firstLoad:datLength;
	
	//首屏加载最多8个list
	for(var i=0;i<end-1;i++){
		allLists(datTemplate[i]);
	}
	//进行懒加载
	lazyLoad(datTemplate);
	
	//跳转到详情页
	detailClick(getUsername());
	
	//获取读者的用户名
	const reader = datTemplate.userid.usernameAuto;
	if(reader){
		$('.loginStatus').html('退出');
		$('.username').html(reader);
	}
}

//下面是博客简介多行省略
function wrapEllipsis(item){
	var context = item.introduction;//博客简介
	var rowNum = 35;//规定每行最多显示多少个	
	if(context){
		var index = Math.ceil(context.length/rowNum);//得到行数
		//超出5行，最多显示5行
		if(index>5){
			context = context.substring(0,rowNum*5-3)+'...';
			index = 5;
		}
		for(var i =0;i<index;i++){
			var end = context.length<(i+1)*rowNum?context.length:(i+1)*rowNum;
			var con = context.substring(i*rowNum,end);
			$('.'+item.id).find('.articleDiscription').append(con+'<br/>');
		}
	}
}
