const {successModel,errorModel} = require('../model/model');
const {userRegister,userLogin,getIcon} = require('../controller/user');
const {set,get} = require('../db/redis');
const {sendReq,cancleReq,checkReq} = require('../controller/messageVerify');

const userMsg = (req,res)=>{
    const method = req.method;//POST或者Get

    //1.新注册的用户
    if(method == "POST" && req.path=="/api/user/register"){
        let {code,requestId} = req.body;
        let checkRequest = checkReq(requestId,code);
        return checkRequest.then(data=>{
            if(data.status==0){
                //短信验证码正确
                // cancleReq(requestId);
                const result = userRegister(req.body);
                return result.then((newUser)=>{
                    if(newUser!='该手机号已经被注册'&&newUser!='该用户名已经被注册'){
                        return "注册成功";
                    }else{
                        return newUser;
                    }
                })
            }else{
                return new errorModel('验证码错误');
            }
        })
    }

    //2.用户登录
    if(method == "POST" && req.path=="/api/user/login"){
        const {username,pass} = req.body;
        const result = userLogin(username,pass);
        return result.then(userLogin=>{
            userLogin = JSON.parse(JSON.stringify(userLogin))[0];
            // console.log('------------',userLogin); 
            if(userLogin!='用户名不存在'&&userLogin!='密码不正确,请重新输入'){
                //登录之后，把账号密码存到session中
                req.session.username = userLogin.username;
                req.session.pass = userLogin.pass;
                req.session.phone = userLogin.phone;
                // 同步到 redis
                set(req.sessionId, req.session);
                // console.log('req:',req.sessionId, req.session);
                return new successModel(userLogin);
            }
            return new errorModel(userLogin);
        })
    }

    //3.获取用户Icon
    if(method == "GET" && req.path=="/api/user/userIcon"){
        const {username} = req.query;
        const result = getIcon(username);
        return result.then(icon=>{
            return new successModel(icon);
        })
    }
}

module.exports = {userMsg};