const {exec,escape} = require('../db/mysql');

//1.获取详情页表情数目
const getEomojis = (author,createtime)=>{
    const sql = `select applaus,praise,caonima,angry,despise from emojis 
                where author='${author}' and createtime=${createtime}`

    return exec(sql);
}

//2.更新博客表情数目
const setEmojis = (applaus,praise,caonima,angry,despise,author,createtime,user,blogId)=>{
    const sql = `update emojis set applaus='${applaus}',praise='${praise}',caonima='${caonima}',angry='${angry}',despise='${despise}',blogId=${blogId}
                where author='${author}' and createtime=${createtime} and reader='${user}'`;
    return exec(sql).then(dat=>{
        if(dat.affectedRows==0){//也就是说没有影响到数据库，即不存在
            const insert = `insert into emojis (applaus,praise,caonima,angry,despise,author,createtime,reader)
            values ('${applaus}','${praise}','${caonima}','${angry}','${despise}','${author}',${createtime},'${user}')`;
            return exec(insert);
        }
    });
}

module.exports = {getEomojis,setEmojis};