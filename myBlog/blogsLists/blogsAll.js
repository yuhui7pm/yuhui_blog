var user;//后端传过来的username
var newFlag = true;
var blogIndex = 7;//初始只有7篇，每点击一次按钮也是7篇;
var scrollHei;

$(()=>{
	$.ajax({
		url:'/api/blog/lists',
		type:'GET',
		dataType:'json',
		contentType: "application/json",
		success:(result)=>{
			console.log(result)
//			user = result.data["userid"].usernameAuto;//从cookie中获得用户名
//			const userIcon = window.parent.document.getElementsByClassName("contribute")[0];
//			if(user&&user!="undefined"){
//				$(".loginStatus", window.parent.document).html('退出')
//				$(".username", window.parent.document).html(user)
//			}
			let clickNum = 1;
			addLists(result,clickNum);//点击按钮，加载更多
//			detailClick(user);//当文章被点击的时候，根据博客Id跳转到详情页
		},
		error:(err)=>{
			console.error(err);
		}
	})	
})

//点击加载按钮，加多7篇显示
function addLists(result,clickNum){
	let whole = Object.keys(result.data).length-1;//原生方法获取对象的长度
	//最开始的时候放7篇文章
	for(var i=0;i<Math.min(blogIndex,whole);i++){
		appendArticle(result.data[i]);
	}
	//每点击一次，加5篇
	$('#more').click(()=>{
		clickNum++;
		if(blogIndex*clickNum<whole){
			for(var i=blogIndex*(clickNum-1);i<blogIndex*clickNum;i++){
				appendArticle(result.data[i]);
			}
			window.parent.document.getElementsByClassName('articles')[0].style.height = (200*blogIndex*clickNum)+'px';
		}else{
			for(var i=blogIndex*(clickNum-1);i<whole;i++){
				appendArticle(result.data[i]);
			}
			window.parent.document.getElementsByClassName('articles')[0].style.height =200*whole+'px';
			$('.bottomTip').html('我已经到底了~~~');
			return;
		}
		detailClick(user);//当文章被点击的时候，根据博客Id跳转到详情页
	})
}

//点击某一选项，跳转到指定页面
function detailClick(user){
	$(".article").on('click',function(){		
		console.log('点击列表项，跳转到详情页')
		var articleClass = $(this).attr('class');
		var regId = /\d+/gi;//取出文章Id
		var passageId = articleClass.match(regId);
		window.parent.location.href = "./blogDetail.html?username="+user+"&blogId="+passageId;
	});			
}

//追加文章
function appendArticle(item){
	//返回留言的个数
	$('#articlesWrapper').append(`
		<div class="article ${item.id}">
			<div class="picture" style="background-image:url(/static/blogIcon/image_${item.author}_${item.createtime}.jpg)"></div>
			<div class="artical_right">
				<div class="title">${item.title}</div>
				<p class="articleDiscription">${item.introduction}</p>
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
						<span class="comments iconfont">&#xe613;</span><span style="color:#00a67c">${item.commentNum}评论</span>
					</span>
				</div>
			</div>
			</div>
		</div>
	`)
	
	//下面是博客简介多行省略
//	var context = item.introduction;//博客简介
//	var rowNum = 35;//规定每行最多显示多少个	
//	if(context){
//		var index = Math.ceil(context.length/rowNum);//得到行数
//		//超出5行，最多显示5行
//		if(index>5){
//			context = context.substring(0,rowNum*5-3)+'...';
//			index = 5;
//		}
//		for(var i =0;i<index;i++){
//			var end = context.length<(i+1)*rowNum?context.length:(i+1)*rowNum;
//			var con = context.substring(i*rowNum,end);
//			$('.'+item.id).find('.articleDiscription').append(con+'<br/>');
//		}
//	}
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

	