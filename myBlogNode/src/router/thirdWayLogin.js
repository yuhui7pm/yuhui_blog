const {GITHUB_CONF} = require('../conf/githubConf');
const githubTwo = require('../controller/githubOAuth');
const {set,get} = require('../db/redis');


const thirdWayLogin = (req,res)=>{
    let method = req.method;//POST还是GET
    //1.验证github登录
    if(method == "GET" && req.path == '/api/login/github'){
        const {clientID} = GITHUB_CONF;
        return clientID;
    }
}

const getGithub  = (req,res)=>{
    let method = req.method;//POST还是GET
    //2.获取github返回的信息
    if(method=="POST"&&req.path=='/api/blog/githubTwo'){
        const {clientID,clientSecret} = GITHUB_CONF;
        const {code} = req.body;
        const testsss = githubTwo(clientID,clientSecret,code);
        return testsss.then(data=>{
            //返回的数据为json字符串

            //将github的数据同步到 redis,保存在cookie中
            req.session.username = data.login;
            req.session.pass = data.id;
            req.session.phone = "";
            set(req.sessionId, req.session);
            return data;
        })
    }
}

module.exports = {thirdWayLogin,getGithub};