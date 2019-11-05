const xss = require('xss');
const {exec,escape} = require('../db/mysql');

//1.获取留言墙全部留言，返回到前端
const getCommentsWall = () =>{
    const sql = `select * from commentswall order by id desc`;
    return exec(sql);
}

//2.将前端留言墙数据保存到数据库中
const saveCommentsWall = (icon,author,context,createtime,praiseNumber) => {
    const sql = `insert into commentswall (icon,author,context,praisenumber,createtime) 
                values ('${icon}','${author}','${context}',${praiseNumber},${createtime})`
    return exec(sql);
}

//3.删除留言墙
const deleteCommentsWall = (author,createtime,currentReader)=>{
    if(author==currentReader){
        const sql = `delete from commentswall where author='${author}' and createtime=${createtime}`;
        return exec(sql);
    }
}

//4.保存点赞数
const savePraiseNumber = (author,createtime,praiseNumber) => {
    const sql = `update commentsWall set praiseNumber=${praiseNumber} where author='${author}' and createtime=${createtime} `
    return exec(sql);
}

//5.获得账号登陆用户的Icon
const getUserIcon = (user) =>{
    console.log(user);
    const sql = `select icon from users where username='${user}'`;
    return exec(sql);
}

module.exports = {
    getCommentsWall,
    saveCommentsWall,
    deleteCommentsWall,
    savePraiseNumber,
    getUserIcon
}