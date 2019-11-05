const {successModel,errorModel} = require('../model/model');
const {setEmojis,getEomojis} = require('../controller/emojis');
const {set,get} = require('../db/redis');

const blogEmojis = (req,res)=>{
    const method = req.method;//POST或者Get

    //1.获取详情页表情数目
    if(method == "GET" && req.path=="/api/blog/getEmojis"){
        const {author,createtime} = req.query;
        // console.log(author,createtime);
        const result = getEomojis(author,createtime);
        return result.then((emojiData)=>{
            return new successModel(emojiData,"成功返回表情数据");
        })
    }

    //2.设置详情页表情数目
    if(method == "POST" && req.path=="/api/blog/setEmojis"){
        const {applaus,praise,caonima,angry,despise,author,createtime,user,blogId} = req.body;
        const result = setEmojis(applaus,praise,caonima,angry,despise,author,createtime,user,blogId);
        return result.then((emojiData)=>{
            return new successModel(emojiData,"成功保存表情数据");
        })
    }
}

module.exports = {blogEmojis};