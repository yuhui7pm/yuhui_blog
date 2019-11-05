const {sendReq,cancleReq,checkReq} = require('../controller/messageVerify');
const {successModel,errorModel} = require('../model/model');
const {userRegister,userLogin,checkPhone} = require('../controller/user');
const {set,get} = require('../db/redis');

const loginVerify = (req,res)=>{
    let method = req.method;//POST还是GET
    req.path = req.path.split('?')[0];
    let request_id;

    //1.登录短信验证
    if(method == "POST" && req.path == '/api/login/sendVerification'){
        let requestId;
        const {phone,time} = req.body;
        const result = sendReq(phone,requestId);
        return result.then(data=>{
           return data;
        })
    }

    //2.验证码验证，验证成功之后终止请求
    if(method == "POST" && req.path == '/api/login/codeVerify'){
        const {code,requestId,phone} = req.body;
        console.log(code,requestId,phone);
        const check = checkPhone(phone);//检查手机有没有注册，没有注册就让他先注册。
        return check.then(checkData=>{
            console.log('checkData',checkData);
            // checkData = JSON.stringify(JSON.parse(checkData));
            // console.log('checkData',checkData);
            if(checkData!="该手机号未注册"){
                // console.log('登录的信息：',checkData);
                const checkVerify = checkReq(requestId,code);
                return checkVerify.then(data=>{
                    if(data.status==0){
                        // cancleReq(requestId);//停止请求的服务
                        //登录之后，把账号密码存到session中
                        let newData = JSON.parse(JSON.stringify(checkData));
                        console.log('JSON.parse(JSON.stringify(checkData))',newData);
                        req.session.username = newData.username;
                        req.session.pass = newData.pass;
                        req.session.phone = newData.phone;
                        set(req.sessionId, req.session);
                        console.log('req.sessionId',req.sessionId, 'req.session',req.session);
                        return new successModel('短信验证成功,可以登录',newData);
                    }else{
                        return new errorModel('验证码错误');
                    }
                })
            }else{
                return new errorModel(checkData);
            }
        })
    }
}

module.exports = loginVerify;
