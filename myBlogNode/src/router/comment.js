const {successModel,errorModel} = require('../model/model');
const { commentsInsert,
        getComments,
        deleteFirstComments,
        uploadFirstPraise,
        saveSecondComments,
        getSecondComments,
        deleteSecondComments,
        uploadSecondPraise,
        getAllComments,
        getAllSecondComments,
        deleteUserComments,
        getCommentsNumber,
        newestComments,
        getCommentsNum} = require('../controller/comment');

const blogComments = (req,res)=>{
    const method = req.method;//POST或者Get

    //1.根据详情页的Id获取每篇博客的评论
    if(method == "GET" && req.path=="/api/blog/getComments"){
        const {id} = req.query;
        const result = getComments(id);
        return result.then((commentData)=>{
            return new successModel(commentData,"成功获取表情数据");
        })
    }

    //2.存储一级评论的内容
    if(method == "POST" && req.path=="/api/blog/saveComments"){
        const {blogId,icon,author,createtime,context,praise} = req.body;
        const result = commentsInsert(blogId,icon,author,createtime,context,praise);
        return result.then((commentData)=>{
            return new successModel(commentData,"成功保存表情数据");
        })
    }

    //3.删除一级评论内容
    if(method == "POST" && req.path=="/api/blog/deleteFirstComments"){
        let {id,rootCommentor,rootCommentTime} = req.body;
        if(commenter=rootCommentor){
            let result = deleteFirstComments(id,rootCommentor,rootCommentTime);
            return result.then((firstCommentData)=>{
                return new successModel(firstCommentData,"成功删除一级评论数据");
            })
        }
    }

    //3.5 上传一级评论的点赞数目
    if(method == "POST" && req.path=="/api/blog/uploadPraise"){
        let {id,rootCommentor,rootCommentTime,firstpraise} = req.body;
        console.log(id,rootCommentor,rootCommentTime,firstpraise);
        const result = uploadFirstPraise(id,rootCommentor,rootCommentTime,firstpraise);
        return result.then(data=>{
            return new successModel('成功存储带点赞数目',data);
        })
    }

    //4.获取二级评论的内容
    if(method == "GET" && req.path=="/api/blog/getSecondComments"){
        const {blogId,rootCommentor,rootCommentTime} = req.query;
        const result = getSecondComments(blogId,rootCommentor,rootCommentTime);
        return result.then((secondCommentData)=>{
            return new successModel(secondCommentData,"成功获取二级评论数据");
        })
    }

    //5.存储二级评论的内容
    if(method == "POST" && req.path=="/api/blog/saveSecondComments"){
        const {id,rootCommentor,rootCommentTime,secondCommentorIcon,secondCommentor,secondCreatetime,secondCommentContext,secondCommentPraise} = req.body;
        const result = saveSecondComments(id,rootCommentor,rootCommentTime,secondCommentorIcon,secondCommentor,secondCreatetime,secondCommentContext,secondCommentPraise);
        return result.then((secondCommentData)=>{
            return new successModel(secondCommentData,"成功保存二级评论数据");
        })
    }

    //6.删除二级评论内容
    if(method == "POST" && req.path=="/api/blog/deleteSecondComments"){
        let {id,rootCommentor,rootCommentTime,secondCommentor,secondCreatetime} = req.body;
        let result = deleteSecondComments(id,rootCommentor,rootCommentTime,secondCommentor,secondCreatetime);
        return result.then((secondCommentData)=>{
            return new successModel(secondCommentData,"成功删除二级评论数据");
        })
    }

    //7.更新二级评论的点赞数目
    if(method == "POST" && req.path=="/api/blog/uploadSecondPraise"){
        let {id,secondCommentor,secondCommentCreatetime,secondCommentPraise} = req.body;
        // if(secondCommentor.split(':回复@')){
        //     secondCommentor = secondCommentor.split(':回复@')[0];
        // }
        let result = uploadSecondPraise(id,secondCommentor,secondCommentCreatetime,secondCommentPraise);
        return result.then(secondPhrase=>{
            return new successModel(secondPhrase,"成功保存二级评论的数据");
        })
    }

    //8.后台获取用户所有的一级评论
    if(method == "GET" && req.path=="/api/blogs/getAllComments"){
        const {username} = req.query;
        const result = getAllComments(username);
        return result.then(allCommentData=>{
            return new successModel(allCommentData);
        })
    }

    //9.后台获取用户所有的二级评论
    if(method=="GET"&&req.path=="/api/blogs/getAllSecondComments"){
        const {username} = req.query;
        const result = getAllSecondComments(username);
        return result.then(allCommentSecondData=>{
            // console.log('allCommentSecondData',allCommentSecondData);
            return new successModel(allCommentSecondData);
        })
    }

    //10.后台管理删除评论
    if(method=="POST"&&req.path=="/api/blog/deleteComments"){
        const {type,commentId,user} = req.body;
        // console.log(type,commentId,user);
        const result = deleteUserComments(type,commentId,user);
        return result.then(deleteCom=>{
            return new successModel(deleteCom);
        })
    }

    //11.获取博客的留言数目
    if(method=="GET"&&req.path=="/api/blog/commentsNumber"){
        const {blogId} = req.query;
        const result = getCommentsNumber(blogId);
        return result.then(commentsNumber=>{
            return new successModel(commentsNumber);
        })
    }

    //12.最新留言
    if(method=="GET"&&req.path=="/api/blog/newestComments"){
        const result = newestComments();
        return result.then(newestCommentsData=>{
            return new successModel(newestCommentsData);
        })
    }

    //13.评论总数
    if(method=="GET"&&req.path=="/api/blog/getCommentsNum"){
        const result = getCommentsNum();
        return result.then(commentsNumber=>{
            return new successModel(commentsNumber);
        })
    }
}

module.exports = {blogComments};