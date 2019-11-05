var userIcon;//用户的icon
var iconDefault;
//从数据库中获取数据
window.onload = ()=>{
			$('.bar5').css('background-color','#D56464');//改变tapBar的颜色
			
			//游客模式与账号模式
			modeDecided();
			
			//获取用户的Icon
			getIcon();
	
			//从数据库中读取数据
			$.ajax({
				type:"get",
				url:"/api/commentsWall/getComments",
				async:false,
				dataType:"json",
				contentType:"application/json",
				success:(result)=>{
					const res = result.data;
					res.forEach(item=>{
						let icon = item.icon;
						let author = item.author;
						let context = item.context;
						let praiseNumber = item.praiseNumber;
						let createtime = item.createtime;
						getComments(icon,author,context,praiseNumber,createtime);
					})
				}
			});
			
			//点击爱心
			$('.heart').on("click",function(){
				var C=parseInt($(this).next().html());
				$(this).css("background-position","")
				var D=$(this).attr("rel");
			   
				if(D === 'like') {      
					$(this).next().html(C+1);
					$(this).addClass("heartAnimation").attr("rel","unlike");
				}
				else{
					$(this).next().html(C-1);
					$(this).removeClass("heartAnimation").attr("rel","like");
					$(this).css("background-position","left");
				}
				
				const author = $(this).parent().prev().prev().find('a').html();
				const createtime = $(this).parent().next().find('span').attr('class');
				const praiseNumber = $(this).next().html();
				
				//将点赞数传到数据库
				$.ajax({
					type:"post",
					url:"/api/commentsWall/savePraiseNumber",
					dataType:"json",
					contentType:"application/json",
					data:JSON.stringify({
						author,
						createtime,
						praiseNumber
					})
				});
			});
};


/*-------------------------- +
  获取id, class, tagName
 +-------------------------- */
var get = {
	byId: function(id) {
		return typeof id === "string" ? document.getElementById(id) : id
	},
	byClass: function(sClass, oParent) {
		var aClass = [];
		var reClass = new RegExp("(^| )" + sClass + "( |$)");
		var aElem = this.byTagName("*", oParent);
		for (var i = 0; i < aElem.length; i++) reClass.test(aElem[i].className) && aClass.push(aElem[i]);
		return aClass
	},
	byTagName: function(elem, obj) {
		return (obj || document).getElementsByTagName(elem)
	}
};
/*-------------------------- +
  事件绑定, 删除
 +-------------------------- */
var EventUtil = {
	addHandler: function (oElement, sEvent, fnHandler) {
		oElement.addEventListener ? oElement.addEventListener(sEvent, fnHandler, false) : (oElement["_" + sEvent + fnHandler] = fnHandler, oElement[sEvent + fnHandler] = function () {oElement["_" + sEvent + fnHandler]()}, oElement.attachEvent("on" + sEvent, oElement[sEvent + fnHandler]))
	},
	removeHandler: function (oElement, sEvent, fnHandler) {
		oElement.removeEventListener ? oElement.removeEventListener(sEvent, fnHandler, false) : oElement.detachEvent("on" + sEvent, oElement[sEvent + fnHandler])
	},
	addLoadHandler: function (fnHandler) {
		this.addHandler(window, "load", fnHandler)
	}
};
/*-------------------------- +
  设置css样式
  读取css样式
 +-------------------------- */
function css(obj, attr, value)
{
	switch (arguments.length)
	{
		case 2:
			if(typeof arguments[1] == "object")
			{	
				for (var i in attr) i == "opacity" ? (obj.style["filter"] = "alpha(opacity=" + attr[i] + ")", obj.style[i] = attr[i] / 100) : obj.style[i] = attr[i];
			}
			else
			{	
				return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr]
			}
			break;
		case 3:
			attr == "opacity" ? (obj.style["filter"] = "alpha(opacity=" + value + ")", obj.style[attr] = value / 100) : obj.style[attr] = value;
			break;
	}
};

EventUtil.addLoadHandler(function ()
{
	var oMsgBox = get.byId("msgBox");
	var oUserName = get.byId("userName");
	var oConBox = get.byId("conBox");
	var oSendBtn = get.byId("sendBtn");
	var oMaxNum = get.byClass("maxNum")[0];
	var oCountTxt = get.byClass("countTxt")[0];
	var oList = get.byClass("list")[0];
	var oUl = get.byTagName("ul", oList)[0];
	var aLi = get.byTagName("li", oList);
	var aFtxt = get.byClass("f-text", oMsgBox);
	var aImg = get.byTagName("img", get.byId("face"));
	var bSend = false;
	var timer = null;
	var oTmp = "";
	var i = 0;
	var maxNum = 250;
	
	//禁止表单提交
	EventUtil.addHandler(get.byTagName("form", oMsgBox)[0], "submit", function () {return false});
	
	//为广播按钮绑定发送事件
	EventUtil.addHandler(oSendBtn, "click", fnSend);
	
	//为Ctrl+Enter快捷键绑定发送事件
	EventUtil.addHandler(document, "keyup", function(event)
	{
		var event = event || window.event;
		event.ctrlKey && event.keyCode == 13 && fnSend()
	});
	
	//textarea高度自适应
	commentsAdaption();
	
	//发送广播函数
	function fnSend ()
	{
		var reg = /^\s*$/g;
		if(reg.test(oUserName.value))
		{
			alert("\u8bf7\u586b\u5199\u60a8\u7684\u59d3\u540d");
			oUserName.focus()
		}
		else if(!/^[u4e00-\u9fa5\w]{2,20}$/g.test(oUserName.value))
		{
			alert("\u59d3\u540d\u75312-8\u4f4d\u5b57\u6bcd\u3001\u6570\u5b57\u3001\u4e0b\u5212\u7ebf\u3001\u6c49\u5b57\u7ec4\u6210\uff01");
			oUserName.focus()
		}
		else if(reg.test(oConBox.value))
		{
			alert("\u968f\u4fbf\u8bf4\u70b9\u4ec0\u4e48\u5427\uff01");
			oConBox.focus()
		}
		else if(!bSend)
		{
			alert("\u4f60\u8f93\u5165\u7684\u5185\u5bb9\u5df2\u8d85\u51fa\u9650\u5236\uff0c\u8bf7\u68c0\u67e5\uff01");
			oConBox.focus()
		}
		else
		{
			var oLi = document.createElement("li");
			var oDate = Date.now();
			var dataFormated = getMyDate(oDate);//格式化毫秒数
			
//			<a class="del" href="javascript:;">删除</a>
			if(userIcon){
				iconDefault = '/static/'+userIcon
			}else{
				iconDefault = get.byClass("current", get.byId("face"))[0].src;
			}
			oLi.innerHTML = `
		    	<div class="userPic"><img src="${iconDefault}" height="50px" width:"50px"/></div>
			    <div class="content">
			        <div class="userName"><a href="javascript:;">${oUserName.value}</a>:</div>
			        <div class="msgInfo">${oConBox.value.replace(/<[^>]*>|&nbsp;/ig, "")}</div>
					   	<div class="feed" id="feed2" style="float:right;display: flex;align-items: center;">
								<div class="heart" id="like2" rel="like"></div>
								<div class="likeCount" id="likeCount2" style="min-width: 30px;">0</div>
							</div>
			    		<div class="times">
			    			<span class="${oDate}">${dataFormated}</span>
			    			<a class="del" href="javascript:;"></a>
			    		</div>
	    		</div>
			`
			//点赞的数目
			var praiseNumber = oLi.children[1].children[2].children[1].innerHTML;
//			const path = window.location.href.split('?')[0];
//			window.location.href = path+"?username="+oUserName.value;
			
			//将数据保存到ajax
			$.ajax({
				type:"post",
				url:"/api/commentsWall/saveComment",
				async:true,
				dataType:"json",
				contentType:"application/json",
				data:JSON.stringify({
					icon:iconDefault,
					author:oUserName.value,
					context:oConBox.value,
					createtime:oDate,
					praiseNumber
				})
			});
	
			//插入元素
			aLi.length ? oUl.insertBefore(oLi, aLi[0]) : oUl.appendChild(oLi);
			
			//重置表单
			get.byTagName("form", oMsgBox)[0].reset();
			for (i = 0; i < aImg.length; i++) aImg[i].className = "";
			aImg[0].className = "current";
			
			//将元素高度保存
			var iHeight = oLi.clientHeight - parseFloat(css(oLi, "paddingTop")) - parseFloat(css(oLi, "paddingBottom"));
			var alpah = count = 0;
			css(oLi, {"opacity" : "0", "height" : "0"});	
			timer = setInterval(function ()
			{
				css(oLi, {"display" : "block", "opacity" : "0", "height" : (count += 8) + "px"});
				if (count > iHeight)
				{
					clearInterval(timer);
					css(oLi, "height", iHeight + "px");
					timer = setInterval(function ()
					{
						css(oLi, "opacity", (alpah += 10));
						alpah > 100 && (clearInterval(timer), css(oLi, "opacity", 100))
					},30)
				}
			},30);
			//调用鼠标划过/离开样式
			liHover();
			//调用删除函数
//			delLi()
		}
	};
	
	//事件绑定, 判断字符输入
	EventUtil.addHandler(oConBox, "keyup", confine);	
	EventUtil.addHandler(oConBox, "focus", confine);
	EventUtil.addHandler(oConBox, "change", confine);
	
	//输入字符限制
	function confine ()
	{
		var iLen = 0;		
		for (i = 0; i < oConBox.value.length; i++) iLen += /[^\x00-\xff]/g.test(oConBox.value.charAt(i)) ? 1 : 0.5;
		oMaxNum.innerHTML = Math.abs(maxNum - Math.floor(iLen));	
		maxNum - Math.floor(iLen) >= 0 ? (css(oMaxNum, "color", ""), oCountTxt.innerHTML = "\u8fd8\u80fd\u8f93\u5165", bSend = true) : (css(oMaxNum, "color", "#f60"), oCountTxt.innerHTML = "\u5df2\u8d85\u51fa", bSend = false)
	}
	//加载即调用
	confine();		
	
	//广播按钮鼠标划过样式
	EventUtil.addHandler(oSendBtn, "mouseover", function () {this.className = "hover"});

	//广播按钮鼠标离开样式
	EventUtil.addHandler(oSendBtn, "mouseout", function () {this.className = ""});
	
	//li鼠标划过/离开处理函数
	function liHover()
	{
		for (i = 0; i < aLi.length; i++)
		{
			//li鼠标划过样式
			EventUtil.addHandler(aLi[i], "mouseover", function (event)
			{
				this.className = "hover";
				oTmp = get.byClass("times", this)[0];
				var aA = get.byTagName("a", oTmp);
				if (!aA.length)
				{
					var oA = document.createElement("a");	
//					这里控制删除
//					oA.innerHTML = "删除";
					oA.className = "del";
					oA.href = "javascript:;";
					oTmp.appendChild(oA)
				}
				else
				{
					aA[0].style.display = "block";
				}
			});

			//li鼠标离开样式
			EventUtil.addHandler(aLi[i], "mouseout", function ()
			{
				this.className = "";
				var oA = get.byTagName("a", get.byClass("times", this)[0])[0];
				oA.style.display = "none"	
			})
		}
	}
	liHover();
	
	//删除功能
	function delLi()
	{
		var aA = get.byClass("del", oUl);
		for (i = 0; i < aA.length; i++)
		{
			aA[i].onclick = function ()
			{
				var oParent = this.parentNode.parentNode.parentNode;
				var alpha = 100;
				var iHeight = oParent.offsetHeight;
				timer = setInterval(function ()
				{
					css(oParent, "opacity", (alpha -= 10));
					if (alpha < 0)
					{
						clearInterval(timer);						
						timer = setInterval(function ()
						{
							iHeight -= 10;
							iHeight < 0 && (iHeight = 0);
							css(oParent, "height", iHeight + "px");
							iHeight == 0 && (clearInterval(timer), oUl.removeChild(oParent))
						},30)
					}	
				},30);			
				
				//调用ajax删除数据库留言
				const createtime = $(this).prev().attr('class');
				const author = $(this).parent().parent().children('.userName').find('a').html();
				const reader = window.location.href.split('?')[1].split('=')[1];
				$.ajax({
					type:"post",
					url:"/api/commentsWall/deleteComment",
					dataType:"json",
					contentType:"application/json",
					data:JSON.stringify({
						author,
						createtime,
						reader
					}),
					success:(result)=>{
						console.log(result);
					}
				});
				
				this.onclick = null;
			}			
		}
	}
//	delLi();
	
	//输入框获取焦点时样式
	for (i = 0; i < aFtxt.length; i++)
	{
		EventUtil.addHandler(aFtxt[i], "focus", function ()	{this.className = "active"});		
		EventUtil.addHandler(aFtxt[i], "blur", function () {this.className = ""})
	}
	
	//格式化时间, 如果为一位数时补0
	function format(str)
	{
		return str.toString().replace(/^(\d)$/,"0$1")
	}
	
	//头像
	for (i = 0; i < aImg.length; i++)
	{
		aImg[i].onmouseover = function ()
		{
			this.className += " hover"
		};
		aImg[i].onmouseout = function ()
		{
			this.className = this.className.replace(/\s?hover/,"")
		};
		aImg[i].onclick = function ()
		{
			for (i = 0; i < aImg.length; i++) aImg[i].className = "";
			this.className = "current"	
		}
	}
});

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
//textarea高度自适应
commentsAdaption();


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


//删除所有评论
//<a class="del" href="javascript:;">删除</a>
function getComments(icon,author,context,praiseNumber,createtime){
	$('.list ul').append(`
		<li>
	    <div class="userPic"><img src="${icon}" width="50px" height="50px"/></div>
	    <div class="content">
	        <div class="userName"><a href="javascript:;">${author}</a>:</div>
	        <div class="msgInfo">${context}</div>
	       	<div class="feed" id="feed2" style="float:right;display: flex;align-items: center;">
							<div class="heart" id="like2" rel="like"></div>
							<div class="likeCount" id="likeCount2" style="min-width: 30px;">${praiseNumber}</div>
					</div>
	        <div class="times">
	        	<span class='${createtime}'>${getMyDate(createtime)}</span>
	        	<a class="del" href="javascript:;"></a>
	        </div>
	    </div>
		</li>	
	`)
}

//游客模式与用户模式
function modeDecided(){
	const username = $('.username').html();
	if(username!=undefined&&username!="用户"&&username.length!=0){
		$('#accountMode').css('color',"#0000FF");
		$('#touristMode').css('color',"#999999");
		$('#face').hide();
		$('#userName').val(username).css('margin-right','200px');
	}else{
		$('#touristMode').css('color',"#0000FF");
		$('#accountMode').css('color',"#999999");
		$('#face').show();
	}
}

//从后台获取用户的icon
function getIcon(){
	if($('.username').html()!="undefined"&&$('.username').html()!="用户"){
		$.ajax({
			type:"get",
			url:"/api/commentsWall/getIcon",
			dataType:"json",
			contentType:"application/json",
			data:({
				user:$('.username').html()
			}),
			success:(result)=>{
				userIcon = result.data[0].icon;
			}
		});	
	}
}

