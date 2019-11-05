const mysql = require('mysql');
const {MYSQL_CONF} = require('../conf/db');//引入mysql数据库的基本配置
//第一步：创建连接对象
const con = mysql.createConnection(MYSQL_CONF);
//第二步：连接数据库
con.connect();
//第三步：将mysql语句进行封装
const exec = (sql)=>{  
    const promise = new Promise((resolve,reject)=>{
        // console.log('这里呢？')
        con.query(sql,(err,result)=>{
            if(err){
                reject(err);
                return;
            }
            resolve(result);
        })
    })
    return promise;
}
//第四步：导出封装函数
module.exports = {
    exec,
    escape:mysql.escape
};

