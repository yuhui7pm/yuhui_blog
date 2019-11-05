const xss = require('xss');
const {exec,escape} = require('../db/mysql');
const genPassword = require('../util/crypto');

//1.对注册的账号进行加密
const userRegister = (register)=>{
    //0.为用户生成随机的icon头像
    let iconNum = Math.ceil(Math.random()*14);
    let picFormat = Math.random()>0.5?'.jpeg':'.jpg';
    let icon = 'headIcon/'+(iconNum + picFormat);

    //1.获取前端发送过来的信息
    let {phone,username,password} = register;
    // console.log('电话，用户名，密码:',phone,username,password);

    //2.MD5加密(电话号码和密码)
    password = genPassword(password);

    //3.检测数据库中是否已经注册了该账号
    const phoneSimilarity = `select username from users where phone='${phone}'`;
    const usernameSimilarity = `select pass from users where username='${username}'`;
    const sql = `insert into users (phone,username,pass,icon) values('${phone}','${username}','${password}','${icon}');`;

    //4.判断手机号有无注册
    let phoneNum;
    let usernameNum;
    return exec(phoneSimilarity).then(result=>{
        phoneNum = result.length;
        if(phoneNum>0){
            console.log('检测到手机号重复');
            return "该手机号已经被注册";
        }else{
            return exec(usernameSimilarity).then(result=>{
                usernameNum = result.length;
                if(usernameNum>0){
                    console.log('检测到用户名重复');
                    return "该用户名已经被注册";
                }
                return exec(sql);
            })
        }
    })
}

//2.账号登录
const userLogin = (username,pass)=>{
    // 1.防止xss攻击
    pass = xss(pass);
    //2.md5加密
    pass = genPassword(pass);
    // console.log("type of genPassword(pass):",typeof pass,pass);

    //3.防止sql注入
    pass = escape(pass);
    // console.log("type of escape(pass):",typeof pass,pass);
    // type of genPassword(pass): string 2d9a089848cc5a11842e67768edbc06b
    // type of escape(pass): string '2d9a089848cc5a11842e67768edbc06b'

    //3.从mysql中查询是否有这个账号
    const sql =  `select * from users where username='${username}'`;
    const sql2 =  `select * from users where username='${username}' and pass=${pass}`;
    console.log(username,pass);

    return exec(sql).then((result)=>{
        if(result.length<=0){
            return '用户名不存在'; 
        }else{
            return exec(sql2).then(data=>{
                console.log(data);
                if(data.length>0){
                    return data;
                }else{
                    return '密码不正确,请重新输入';
                }
            })
        }
    })
}

//校验账号，看有没有注册
const checkPhone = (phone)=>{
    const sql =  `select * from users where phone='${phone}'`;
    return exec(sql).then((result)=>{
        if(result.length<=0){
            return '该手机号未注册'; 
        }else{
            return result;//该账号已经注册，里面由用户的信息.       
        }
    })
}

//获取用户icon
const getIcon = (userName)=>{
    const sql =  `select icon from users where username='${userName}'`;
    return exec(sql);
}
module.exports = {userRegister,userLogin,checkPhone,getIcon};