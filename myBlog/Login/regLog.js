var phoneResult = false;
var accountResult = false;
var pass1Result = false;
var pass2Result = false;
let verifyCode;
let requestId;//请求的短信验证码ID
let requestId_Code;//登录的短信验证码ID
var countdown=60;
var flag = true;
let _this;
let $_this;//记录上一次点击的div

//短信验证
function sendemail(){
	_this = event.currentTarget;
    settime(_this);
}

function settime(_this) { //发送验证码倒计时
    if (countdown == 0) { 
    	_this.onclick = sendemail;
        _this.innerHTML = "获取验证码";
        countdown = 60; 
        return;
    } else { 
    	_this.onclick = null;
        _this.innerHTML = "重新发送" + countdown;
        countdown--; 
 		if(_this.classList[0]=="getVerification"){
// 			console.log('输入的账号:',$('#account input').val());
        	getVerifyNumber($('#account input').val(),countdown);//登录界面的验证码
 		}else{
// 			console.log('输入的电话号码:',$('.phone input').val());
 			registerVerify($('.phone input').val(),countdown)//注册界面的验证码
 		}
    } 
    
	setTimeout(function() { 
    	settime(_this) 
	},1000)
}

//手机短信验证登陆
function getVerifyNumber(phone,time){
	if(flag){
		//向服务器发送ajax请求
		console.log('手机短信验证登录',phone);
		$.ajax({
			url:'/api/login/sendVerification',
			type:'post',
			dataType:'json',
			contentType: "application/json",
			data:JSON.stringify({
				phone,
				time
			}),
			success:(data)=>{
				requestId_Code = data.request_id;
			}
		})
		flag = false;
	}else{
		return;
	}
}

function loginWithVerifyCode(){
	$('.logResButton').click(e=>{
		e.stopPropagation();
		let accountVal = $('#account input').val();
		let passVal = $('#verification input').val();
		if(accountVal.length==0&&passVal.length==0){
			$('.registerResult').html("账号密码不能为空");	
		}else if(accountVal.length==0){
			$('.registerResult').html("账号不能为空");	
		}else if(passVal.length==0){
			$('.registerResult').html("密码不能为空");	
		}else{
			//验证验证码是否正确，争取就跳转到首页
			$.ajax({
				url:'/api/login/codeVerify',
				type:'post',
				dataType:'json',
				contentType: "application/json",
				data:JSON.stringify({
					phone:$('#account input').val(),
					requestId:requestId_Code,
					code:$('#verification input').val()
				}),
				success:(data)=>{
					console.log(data)
					const resData = data.message[0];
					if(data.errNum==0){
						$('.registerResult').html('手机验证登录成功');
						window.location.href = `./index.html?username=${resData.username}`;
						return;
					}else{
						$('.registerResult').html('手机验证登录失败');
					}
				}
			})
		}
	})
}

//注册界面发送短信
function registerVerify(phone,time){
	if(flag){
		console.log(phone,time)
		//向服务器发送ajax请求
		$.ajax({
			url:'/api/login/sendVerification',
			type:'post',
			dataType:'json',
			contentType: "application/json",
			data:JSON.stringify({
				phone,
				time
			}),
			success:(data)=>{
				requestId = data.request_id;
//				registerWithVerifyCode(requestId);//提交之后判断/
			}
		})
		flag = false;
	}else{
		return;
	}
}

function registerWithVerifyCode(){
	$('.regButton').on('click',(e)=>{
		e.stopPropagation();
		console.log('我已经点击注册按钮了。')
		if(phoneResult&&accountResult&&pass1Result&&pass2Result){
			console.log('注册界面:发送ajax',verifyCode,requestId)
			$.ajax({
				url:'/api/user/register',
				type:'post',
				dataType:'json',
				contentType: "application/json",
				data:JSON.stringify({
					phone:$('.phone').find('input').val(),
					username:$('.account').find('input').val(),
					password:$('.pass').find('input').val(),
					code:verifyCode,
					requestId
				}),
				success:(data)=>{
					if(data!="该手机号已经被注册"&&data!="该用户名已经被注册"){
						setTimeout(()=>{
							$('#Login').show();
							$('#register').hide();
						},1000);
						
						$('.registerResult').html('注册成功,跳转到登录页面');
						$('#loginTip').css('background-color','deeppink');
						$('#registerTip').css('background-color','goldenrod');	
						
					}else{
						$('.registerResult').html(data);
					}
				}
			})
			
		}else{
			$('.registerResult').html('注册失败');
		}
	})
}

window.onload = ()=>{
	//登录页面配置:账号的登陆、手机号码登录
	loginConfig();
	//注册页面的配置
	registerConfig();
	//账号登录
	accountLogin();
	//手机验证码登录
	loginWithVerifyCode();
	
	//github被点击的时候
	$('.github').click(()=>{
		console.log('这里是GitHub点击前');
		$.ajax({
			type:"GET",
			url:'/api/login/github',
			dataType:'json',
			contentType:'application/json',
			success:function(result){
				console.log(result);
				window.location.href = 'https://github.com/login/oauth/authorize?client_id='+result;
			}	
		});
	});
}


//1.用户名登陆
function accountLogin(){
	//登录验证
	$('.logResButton').on('click',()=>{
		$.ajax({	
			url:'/api/user/login',
			type:'post',
			dataType:'json',
			contentType: "application/json",
			data:JSON.stringify({
				username:$('#account').find('input').val(),
				pass:$('#pass').find('input').val(),
			}),
			success:(result)=>{

				const data = result.data;
				console.log(result,data)
				
				if(result.errNum==0){
					$('.registerResult').html('登录成功');
					window.location.href = `./index.html?username=${data.username}`;
					return 
				}else{
					$('.registerResult').html(result.data);	//登陆失败
					return;
				}
				
			},
			error:(err)=>{
				console.error(err);
			}
		})	
	})
}

//	验证密码的合法性
function pass(password){
	const passReg = /^(?=.*[0-9]+)(?=.*[a-zA-Z]+)[0-9a-zA-Z]+$/;//密码必须大于6位,并且英文数字混合
	if(password == ''){
        message = "密码不能为空";
    }else if(password.length<6){
        message = "密码必须大于6位";
    }else if(!passReg.test(password)){
        message = "请输入有效的密码";
    }else{
		message = true;
    }
	return message;
}

//	注册，输入手机号码
function phoneValue(){
	let value;
	value = $('#phoneInput').val();
	return value;
}

function phoneRegister(phone){
	let message;    
	var str = /^1[34578]\d{9}$/ig;//手机号码的格式：全为数字；11位；1开头；第2位是34578中的一个
	if(phone == ''){
        message = "号码不能为空";
    }else if(phone.length !=11){
        message = "号码必须为11位";
    }else if(!str.test(phone)){
        message = "请输入有效的号码！";
    }else{
		message = true;
    }
	return message;
}

//	注册的账号必须大于6位
function accountVerify(){
	let account = $('#regAccount').val();
	const accountReg = /^[0-9a-zA-Z]+$/;
	if(account.length>0){
		if(account.length<=6){
			return "账号必须大于6位";
		}else if(!accountReg.test(account)){
			return "账号不符合规范";
		}else{
			return true;
		}
	}
	return;
}


//监听输入框的变化
function inputChange(element){
	var value;
	$(element).bind("input propertychange",function(event){
       value = $(element).val();
       console.log(value)
	   return value;
	});
}

//登陆配置
function loginConfig(){
	//监听输入框值的变化
	$('.regVerify input').bind("input propertychange",function(event){
       verifyCode = $('.regVerify input').val();
	});
	
	registerWithVerifyCode();//点击按钮注册
	
	//注册页面
	$('#registerTip').on('click',function(){
		$('#Login input').val('');//跳转的时候清空用户名和密码;
		$('#Login').hide();
		$('#register').show();
		$('#loginTip').css('background-color','goldenrod');
		$(this).css('background-color','deeppink');
	})
	//登录页面
	$('#loginTip').on('click',function(){
		$('#Login').show();
		$('#register').hide();
		$('#registerTip').css('background-color','goldenrod');
		$(this).css('background-color','deeppink');
	})
	
	//验证码登录与账号密码登录切换
	$('#verifyLogin').on('click',()=>{
		$('#verifyLogin').css('color','red');
		$('#accountLogin').css('color','black');
		$('#pass').hide();
		$('#verification').show();
		$('#account input').val("");
		$('#pass input').val("");
		$('#account input').attr('placeholder','手机号');	
	})
	
	$('#accountLogin').on('click',()=>{
		$('#verifyLogin').css('color','black');
		$('#accountLogin').css('color','red');
		$('#pass').show();
		$('#verification').hide();
		$('#account input').attr('placeholder','账号');
		$('#account input').val("");
		$('#verification input').val("");
	});
}


//注册页面的配置
function registerConfig(){
	//1.判断手机号输入时是否合法
	$('#phoneInput').blur(()=>{
		phoneResult = phoneRegister(phoneValue());
		if(phoneResult!="号码不能为空"&&phoneResult!=true){
			$('.resTip1').html(phoneResult)//验证手机号码的合法性
		}
	});
	//判断有无按下删除键，按下了让input框内的提示信息消失
	$('#phoneInput').keydown((e)=>{
		var keycode = e.keyCode?e.keyCode:e.which;
		if(keycode == '8'){
			$('.resTip1').html("")//消除提示信息
		}
	})
	
	//2.判断用户账号合法性
	$('#regAccount').blur(()=>{
		accountResult = accountVerify();
		if(accountResult!=true){
			$('.resTip3').html(accountResult)//验证用户账号的合法性
		}
	})
	
	$('#regAccount').keydown((e)=>{
		var keycode = e.keyCode?e.keyCode:e.which;
		if(keycode == '8'){
			$('.resTip3').html("")//消除提示信息
		}
	})
	
	//3.判断密码的合法性
	$('.pass1Value').blur(()=>{
		pass1Result = pass($('.pass1Value').val());	
		if(pass1Result!=true&&pass1Result!="密码不能为空"){
			$('.resTip4').html(pass1Result)//验证用户账号的合法性
		}
	});
	
	$('.pass1Value').keydown((e)=>{
		var keycode = e.keyCode?e.keyCode:e.which;
		if(keycode == '8'){
			$('.resTip4').html("")//消除提示信息
		}
	})

	//4.判断再次输入密码的合法性
	$('.pass2Value').blur(()=>{
		pass2Result = pass($('.pass2Value').val());
		if(pass2Result!=true&&pass2Result!="密码不能为空"){
			$('.resTip5').html(pass2Result)//验证用户账号的合法性
		}
		if(pass2Result==true){
			if($('.pass2Value').val()!=$('.pass1Value').val())
			{
				$('.resTip5').html("两次的密码不一致")//验证用户账号的合法性
			}
		}
	})
	
	$('.pass2Value').keydown((e)=>{
		var keycode = e.keyCode?e.keyCode:e.which;
		if(keycode == '8'){
			$('.resTip5').html("")//消除提示信息
		}
	})
}
