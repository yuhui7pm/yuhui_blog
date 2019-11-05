const {successModel,errorModel} = require('../model/model');
const {
    getCommentsWall,
    saveCommentsWall,
    deleteCommentsWall,
    savePraiseNumber,
    getUserIcon
} = require('../controller/commentsWall');

const commentsWall = (req,res)=>{
    const method = req.method;//POST或者Get

    //1.获取留言墙的数据
    if(method == "GET" && req.path=="/api/commentsWall/getComments"){
        const commentsData = getCommentsWall();
        return commentsData.then((data)=>{
            return new successModel(data,'成功返回留言墙的数据');
        })
    }

    //2.存储留言墙的数据
    if(method == "POST" && req.path=="/api/commentsWall/saveComment"){
        // 解构赋值
        const {icon,author,context,createtime,praiseNumber} = req.body;
        const saveData = saveCommentsWall(icon,author,context,createtime,praiseNumber);
        return saveData.then((data)=>{
            return new successModel(data,'成功保存留言墙的数据');
        })
    }

    //3.删除留言墙的数据
    if(method == "POST" && req.path=="/api/commentsWall/deleteComment"){
        // 解构赋值
        const {author,createtime,reader} = req.body;
        console.log(author,createtime,reader);
        const deleteData = deleteCommentsWall(author,createtime,reader);
        return deleteData.then((data)=>{
            return new successModel(data,'成功删除留言墙的数据');
        })
    }

    //4.存储留言墙的点赞数
    if(method == "POST" && req.path=="/api/commentsWall/savePraiseNumber"){
        // 解构赋值
        const {author,createtime,praiseNumber} = req.body;
        const savePraise = savePraiseNumber(author,createtime,praiseNumber);
        return savePraise.then((data)=>{
            return new successModel(data,'成功删除留言墙的数据');
        })
    }

    //5.获得用户的icon
    if(method == "GET" && req.path=="/api/commentsWall/getIcon"){
        // 解构赋值
        const {user} = req.query;
        const userIcon = getUserIcon(user);
        return userIcon.then((data)=>{
            return new successModel(data,'成功获取用户Icon');
        })
    }
}

module.exports = {commentsWall};