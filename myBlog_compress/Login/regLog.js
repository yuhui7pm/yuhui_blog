var phoneResult=false;var accountResult=false;var pass1Result=false;var pass2Result=false;let verifyCode;let requestId;let requestId_Code;var countdown=60;var flag=true;let _this;let $_this;function sendemail(){_this=event.currentTarget;settime(_this)}function settime(_this){if(countdown==0){_this.onclick=sendemail;_this.innerHTML="获取验证码";countdown=60;return}else{_this.onclick=null;_this.innerHTML="重新发送"+countdown;countdown--;if(_this.classList[0]=="getVerification"){getVerifyNumber($('#account input').val(),countdown)}else{registerVerify($('.phone input').val(),countdown)}}setTimeout(function(){settime(_this)},1000)}function getVerifyNumber(phone,time){if(flag){console.log('手机短信验证登录',phone);$.ajax({url:'/api/login/sendVerification',type:'post',dataType:'json',contentType:"application/json",data:JSON.stringify({phone,time}),success:(data)=>{requestId_Code=data.request_id}})flag=false}else{return}}function loginWithVerifyCode(){$('.logResButton').click(e=>{e.stopPropagation();let accountVal=$('#account input').val();let passVal=$('#verification input').val();if(accountVal.length==0&&passVal.length==0){$('.registerResult').html("账号密码不能为空")}else if(accountVal.length==0){$('.registerResult').html("账号不能为空")}else if(passVal.length==0){$('.registerResult').html("密码不能为空")}else{$.ajax({url:'/api/login/codeVerify',type:'post',dataType:'json',contentType:"application/json",data:JSON.stringify({phone:$('#account input').val(),requestId:requestId_Code,code:$('#verification input').val()}),success:(data)=>{console.log(data)const resData=data.message[0];if(data.errNum==0){$('.registerResult').html('手机验证登录成功');window.location.href=`./index.html?username=${resData.username}`;return}else{$('.registerResult').html('手机验证登录失败')}}})}})}function registerVerify(phone,time){if(flag){console.log(phone,time)$.ajax({url:'/api/login/sendVerification',type:'post',dataType:'json',contentType:"application/json",data:JSON.stringify({phone,time}),success:(data)=>{requestId=data.request_id}})flag=false}else{return}}function registerWithVerifyCode(){$('.regButton').on('click',(e)=>{e.stopPropagation();console.log('我已经点击注册按钮了。')if(phoneResult&&accountResult&&pass1Result&&pass2Result){console.log('注册界面:发送ajax',verifyCode,requestId)$.ajax({url:'/api/user/register',type:'post',dataType:'json',contentType:"application/json",data:JSON.stringify({phone:$('.phone').find('input').val(),username:$('.account').find('input').val(),password:$('.pass').find('input').val(),code:verifyCode,requestId}),success:(data)=>{if(data!="该手机号已经被注册"&&data!="该用户名已经被注册"){setTimeout(()=>{$('#Login').show();$('#register').hide()},1000);$('.registerResult').html('注册成功,跳转到登录页面');$('#loginTip').css('background-color','deeppink');$('#registerTip').css('background-color','goldenrod')}else{$('.registerResult').html(data)}}})}else{$('.registerResult').html('注册失败')}})}window.onload=()=>{loginConfig();registerConfig();accountLogin();loginWithVerifyCode();$('.github').click(()=>{console.log('这里是GitHub点击前');$.ajax({type:"GET",url:'/api/login/github',dataType:'json',contentType:'application/json',success:function(result){console.log(result);window.location.href='https://github.com/login/oauth/authorize?client_id='+result}})})}function accountLogin(){$('.logResButton').on('click',()=>{$.ajax({url:'/api/user/login',type:'post',dataType:'json',contentType:"application/json",data:JSON.stringify({username:$('#account').find('input').val(),pass:$('#pass').find('input').val(),}),success:(result)=>{const data=result.data;console.log(result,data)if(result.errNum==0){$('.registerResult').html('登录成功');window.location.href=`./index.html?username=${data.username}`;return}else{$('.registerResult').html(result.data);return}},error:(err)=>{console.error(err)}})})}function pass(password){const passReg=/^(?=.*[0-9]+)(?=.*[a-zA-Z]+)[0-9a-zA-Z]+$/;if(password==''){message="密码不能为空"}else if(password.length<6){message="密码必须大于6位"}else if(!passReg.test(password)){message="请输入有效的密码"}else{message=true}return message}function phoneValue(){let value;value=$('#phoneInput').val();return value}function phoneRegister(phone){let message;var str=/^1[34578]\d{9}$/ig;if(phone==''){message="号码不能为空"}else if(phone.length!=11){message="号码必须为11位"}else if(!str.test(phone)){message="请输入有效的号码！"}else{message=true}return message}function accountVerify(){let account=$('#regAccount').val();const accountReg=/^[0-9a-zA-Z]+$/;if(account.length>0){if(account.length<=6){return"账号必须大于6位"}else if(!accountReg.test(account)){return"账号不符合规范"}else{return true}}return}function inputChange(element){var value;$(element).bind("input propertychange",function(event){value=$(element).val();console.log(value)return value})}function loginConfig(){$('.regVerify input').bind("input propertychange",function(event){verifyCode=$('.regVerify input').val()});registerWithVerifyCode();$('#registerTip').on('click',function(){$('#Login input').val('');$('#Login').hide();$('#register').show();$('#loginTip').css('background-color','goldenrod');$(this).css('background-color','deeppink')})$('#loginTip').on('click',function(){$('#Login').show();$('#register').hide();$('#registerTip').css('background-color','goldenrod');$(this).css('background-color','deeppink')})$('#verifyLogin').on('click',()=>{$('#verifyLogin').css('color','red');$('#accountLogin').css('color','black');$('#pass').hide();$('#verification').show();$('#account input').val("");$('#pass input').val("");$('#account input').attr('placeholder','手机号')})$('#accountLogin').on('click',()=>{$('#verifyLogin').css('color','black');$('#accountLogin').css('color','red');$('#pass').show();$('#verification').hide();$('#account input').attr('placeholder','账号');$('#account input').val("");$('#verification input').val("")})}function registerConfig(){$('#phoneInput').blur(()=>{phoneResult=phoneRegister(phoneValue());if(phoneResult!="号码不能为空"&&phoneResult!=true){$('.resTip1').html(phoneResult)}});$('#phoneInput').keydown((e)=>{var keycode=e.keyCode?e.keyCode:e.which;if(keycode=='8'){$('.resTip1').html("")}})$('#regAccount').blur(()=>{accountResult=accountVerify();if(accountResult!=true){$('.resTip3').html(accountResult)}})$('#regAccount').keydown((e)=>{var keycode=e.keyCode?e.keyCode:e.which;if(keycode=='8'){$('.resTip3').html("")}})$('.pass1Value').blur(()=>{pass1Result=pass($('.pass1Value').val());if(pass1Result!=true&&pass1Result!="密码不能为空"){$('.resTip4').html(pass1Result)}});$('.pass1Value').keydown((e)=>{var keycode=e.keyCode?e.keyCode:e.which;if(keycode=='8'){$('.resTip4').html("")}})$('.pass2Value').blur(()=>{pass2Result=pass($('.pass2Value').val());if(pass2Result!=true&&pass2Result!="密码不能为空"){$('.resTip5').html(pass2Result)}if(pass2Result==true){if($('.pass2Value').val()!=$('.pass1Value').val()){$('.resTip5').html("两次的密码不一致")}}})$('.pass2Value').keydown((e)=>{var keycode=e.keyCode?e.keyCode:e.which;if(keycode=='8'){$('.resTip5').html("")}})}