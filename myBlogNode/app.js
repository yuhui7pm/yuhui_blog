const querystring = require('querystring');
const {set,get} = require('./src/db/redis');
const {userMsg} = require('./src/router/user');
const {blogRouter} = require('./src/router/blog');
const {blogEmojis} = require('./src/router/emoji');
const {blogComments} = require('./src/router/comment');
const {commentsWall} = require('./src/router/commentsWall');
const loginVerify = require('./src/router/loginVerify');
const {thirdWayLogin,getGithub} = require('./src/router/thirdWayLogin');
const {diary} = require('./src/router/diary');
const {feedback} = require('./src/router/feedback');

//设置cookie的过期时间
const cookieExpire = ()=>{
    const time = new Date();//初始化一个时间对象
    time.setTime(time.getTime()+(48*60*60*1000));//cookie的过期时间设置为48小时
    return time.toGMTString();
}

//用于处理post data,可以用on('data',callback)的形式实现
//也可以使用promise来实现post的异步操作。
const getPostData = (req)=>{
    const promise = new Promise((resolve,reject)=>{
        if(req.method!=="POST"){
            resolve({});//不满足条件就返回空
            return;
        }
        if(req.headers['content-type']!=='application/json'){
            resolve({});//不满足条件就返回空
            return;
        }

        let postData = '';
        //post请求会触发data事件
        //每当接收到请求体的数据，我就累加到postData里面
        req.on('data',(chunk)=>{
            postData+=chunk.toString();
            // console.log(postData)
        });
        req.on('end',()=>{
            if(!postData){
                resolve({});//不满足条件就返回空
                return;
            }
            resolve(JSON.parse(postData));//解析成JSON格式
        })
    })
    return promise;
}

const serverHandle = (req,res)=>{
    //设置返回JSON格式
    res.setHeader('Content-Type','application/json');
    //获取path
    const url = req.url;
    req.path = url.split('?')[0];

    //解析query，将字符串解析成对象的形式
    req.query = querystring.parse(url.split('?')[1]);
    
    //解析cookie
    req.cookie = {};//初始化cookie
    const cookieStr = req.headers.cookie || '';

    cookieStr.split(';').forEach(element => {
        if(!element){//如果没有cookie
            return;
        }else{
            const arr = element.split('=');//将cookie变成数据的形式存储
            const key = arr[0].trim();//除去空格
            const value = arr[1].trim();//除去空格
            req.cookie[key] = value;
        }
    });

    // 使用redis解析session
    let needSetCookie=false;//初始化cookie需求状态，默认为false。只传送一次。
    let userId = req.cookie.userid;
    if(!userId){
        needSetCookie=true;
        userId = `${Date.now()}`;//初始化userId
        set(userId,{});
    }

    req.sessionId = userId;//这句话觉得可有可无
    // console.log("req.sessionId = ",userId)
    get(req.sessionId).then((sessionData)=>{
        if(sessionData==null){
            // set(req.sessionId,{});
            // req.session = {};
        }else{
            //设置session
            req.session = sessionData;
            // console.log('我要到这里获取session');
        }
    })

    //处理post请求
    getPostData(req).then(postdata=>{
        req.body = postdata;        
        //0.这里是用户登陆注册信息
        const userResult = userMsg(req,res);
        if(userResult){
            userResult.then(userData=>{
                res.setHeader('Set-Cookie',`userid=${userId}; path=/; httpOnly; expires=${cookieExpire()}; '`);
                if(userResult.data!='该手机号已经被注册'&&userResult.data!='该用户名已经被注册'){
                    res.end(JSON.stringify(userData))
                }
            })
            return;
        }

        //1.这里是博客增 删 改 查。
        req.session = get(req.sessionId)//要添加这一句。mmp因为这一句钟找了n久。
        const blogResult = blogRouter(req,res);
        if(blogResult){
            blogResult.then(blogData=>{
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${cookieExpire()}`)
                }

                res.end(
                    JSON.stringify(blogData)
                )
            })
            return;
        }

        //2.这里是博客详情页的表情获取与加一
        const emojiResult = blogEmojis(req,res);
        if(emojiResult){
            emojiResult.then(emojiData=>{
                res.end(
                    JSON.stringify(emojiData)
                )
            })
            return;
        }

        //3.这里是评论的读取与储存
        const commentResult = blogComments(req,res);
        if(commentResult){
            commentResult.then(commentData=>{
                res.end(
                    JSON.stringify(commentData)
                )
            })
            return;
        }

        
        //4.这里是留言墙的读取、存储、删除操作
        const commentsWallResult = commentsWall(req,res);
        if(commentsWallResult){
            commentsWallResult.then(commentsWallData=>{
                res.end(
                    JSON.stringify(commentsWallData)
                )
            })
            return;
        }

        //5.用户登录:账号密码登录；手机验证码登录
        const loginVerification = loginVerify(req,res)
        if(loginVerification){
            loginVerification.then(loginVerification=>{
                res.setHeader('Set-Cookie',`userid=${userId}; path=/; httpOnly; expires=${cookieExpire()}; '`);
                res.end(
                    JSON.stringify(loginVerification)
                )
            })
            return;
        }

        //6.第三方登录
        const otherWayLogin = thirdWayLogin(req,res);
        if(otherWayLogin){
            res.end(
                JSON.stringify(otherWayLogin)
            )
            return;
        }

        //7.获取github的信息
        const github = getGithub(req,res);
        if(github){
            github.then(githubData=>{
                res.setHeader('Set-Cookie',`userid=${userId}; path=/; httpOnly; expires=${cookieExpire()}; '`);
                res.end(
                    JSON.stringify(githubData)
                )
            })
            return;
        }

        //8.获取日记的数据
        const getDiary = diary(req,res);
        if(getDiary){
            getDiary.then(getDiaryData=>{
                res.end(
                    JSON.stringify(getDiaryData)
                )
            })
            return;
        }

        //9.保存feedback
        const feedbackDat = feedback(req,res);
        if(feedbackDat){
            feedbackDat.then(data=>{
                res.end(
                    JSON.stringify(data)
                )
            })
            return;
        }

        //如果处理POST请求不能成功返回信息,我就输出404
        res.writeHead('404',{'Content-Type':'text/plain'});
        res.write('404 not found\n');
        res.end();//返回结果给前端
    })
}

module.exports = serverHandle;