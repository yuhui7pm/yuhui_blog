const {successModel,errorModel} = require('../model/model');
const { 
    newBlog,
    getAllBlogs,
    differentTypeBlog,
    getDetail,
    personalBlogs,
    deleteBlog,
    updateBlog,
    getHotBlogs,
    recommendBlog,
    getArticlesNum,
    getPageViews,
    getKeywordBlogs
} = require('../controller/blog');
const {set,get} = require('../db/redis');
const {blogIcon,blogPic,changeImgUrl} =require('../controller/image');

//登录验证函数。只有在登录成功之后才能对博客进行相关操作。
const loginCheck = (user)=>{    
    if(!user){
        return Promise.resolve(
            new errorModel('尚未登录')
    )}
}

const blogRouter = (req,res)=>{
    let method = req.method;//POST还是GET
    req.path = req.path.split('?')[0];

    //0.首页获取全部博客
    if(method === 'GET' && req.path === '/api/blog/lists'){
        // const cookie = req.headers.cookie;
        // let getUserId;
        // if(cookie.split('=')[1]){
        //     getUserId = cookie.split('=')[1];
        // }else{
        //     getUserId = null;
        // };
        // return get(getUserId).then(dat=>{
        //     const usernameAuto = dat.username;
        //     console.log('username:',usernameAuto);
        //     let userid = {"usernameAuto":usernameAuto};
        //     const result = getAllBlogs();
        //     return result.then(lists=>{
        //         return new successModel({...lists,userid});
        //     })
        // });
        const result = getAllBlogs();
        return result.then(lists=>{
            return new successModel({...lists});
        })
    }

    //0.5 获取指定类型的博客
    if(method === "GET" && req.path ==='/api/blog/otherTechnique'){
        const {classification} = req.query;
        const cookie = req.headers.cookie;
        let getUserId;
        if(cookie.split('=')[1]){
            getUserId = cookie.split('=')[1];
        }else{
            getUserId = null;
        };
        return get(getUserId).then(dat=>{
            const usernameAuto = dat.username;
            const userid = {"usernameAuto":usernameAuto};
            const result = differentTypeBlog(classification);
            return result.then(lists=>{
                return new successModel({...lists,userid});
            })
        });
    }

    //1.新增一篇博客
    if(method == "POST" && req.path == "/api/blog/new"){
        //1.1判断是否有登录，有返回说明没有登录。
        let sessionData = req.session;
        return sessionData.then(result=>{
            let user = result.username;
            if(!loginCheck(user)){
                let {title,classification,base64head,introduction,sHTML} = req.body;
                let  createtime = Date.now();//博客创建的时间
                let blogIconNew = blogIcon(base64head,user,createtime);//博客简介图保存本地
                blogPic(user,createtime,sHTML);    //博客文章的图片保存到本地
                let newHTML = changeImgUrl(sHTML,user,createtime);//整理过后的的博客文章代码
                let newBlogData = newBlog(title,classification,blogIconNew,introduction,newHTML,createtime,user);
                return newBlogData.then(result=>{
                    if(result){
                        return new successModel('博客新建成功');
                    }else{
                        return new errorModel('博客新建失败');
                    }
                })
            }
        })
    }

    //2.获取博客详情
    if(method === 'GET' && req.path==='/api/blog/detail'){
        //解构赋值
        const {id} = req.query;
        const result = getDetail(id);
        return result.then(data=>{
            return new successModel(data);
        })
    }

    //3.获取某一个用户的全部博客，用于后台管理的删除和更新
    if(method==="GET" && req.path==='/api/blog/personalLists'){
        const {username} = req.query;
        const result = personalBlogs(username);
        return result.then(data=>{
            return new successModel(data);
        })
    }

    //4.删除博客
    if(method ==="POST"&&req.path==='/api/blog/delete'){
        const {createtime,id} = req.body;
        const result = deleteBlog(createtime,id);
        return result.then(deleData=>{
            if(deleData){
                return new successModel(deleData,"成功删除");
            }else{
                return new errorModel('删除失败')
            }
        })
    }

    //5.修改博客---更新博客
    if(method ==="POST"&&req.path==='/api/blog/update'){
        const {username,createtime,contentUpdated,introductionUpdated} =req.body;
        blogPic(username,createtime,contentUpdated);    //博客文章的图片保存到本地
        let newHTML = changeImgUrl(contentUpdated,username,createtime);//整理过后的的博客文章代码
        console.log('--------------------------',newHTML);
        const result = updateBlog(introductionUpdated,newHTML,createtime);
        return result.then(update=>{
            if(update){
                return new successModel(update,"成功更新博客");
            }else{
                return new errorModel('更新博客失败')
            }
        })
    }

    //6.获取博客的热门排行
    if(method === 'GET' && req.path==='/api/blog/hotBlogs'){
        const result = getHotBlogs();
        return result.then(data=>{
            return new successModel(data);
        })
    }

    //7.随机获取博客
    if(method === 'GET' && req.path==='/api/blog/recommendBlog'){
        const result = recommendBlog();
        return result.then(data=>{
            return new successModel(data);
        })
    }

    //8.得到文章总数
    if(method === 'GET' && req.path==='/api/blog/articlesNum'){
        const result = getArticlesNum();
        return result.then(data=>{
            return new successModel(data);
        })
    }

    //9.博客浏览总数
    if(method === 'GET' && req.path==='/api/blog/getPageViews'){
        const result = getPageViews();
        return result.then(data=>{
            return new successModel(data);
        })
    }

    //10.根据keyword查找相应博客
    if(method === 'GET' && req.path==='/api/blog/keywordSearch'){
        const cookie = req.headers.cookie;
        let getUserId;
        if(cookie.split('=')[1]){
            getUserId = cookie.split('=')[1];
        }else{
            getUserId = null;
        };
        return get(getUserId).then(dat=>{
            const usernameAuto = dat.username;
            const userid = {"usernameAuto":usernameAuto};
            const {keyword} = req.query;
            const result = getKeywordBlogs(keyword);
            return result.then(data=>{
                return new successModel({...data,userid});
            })
        });
    }
}

module.exports = {blogRouter};