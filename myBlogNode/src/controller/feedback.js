const {exec} = require('../db/mysql');

//1.获取详情页表情数目
const saveFeedback = (clickType,title,content)=>{
    const sql = `insert into feedback (title,content,clickType) values ('${title}','${content}','${clickType}')`
    return exec(sql);
}

module.exports = {saveFeedback};