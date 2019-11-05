const crypto = require('crypto');

//1.初始化一个个人秘钥
const personalKey = "ThisIsMyPersonalKey";

//2.进行MD5加密
function genPassword(pass){
    //传进来用户密码，然后密码和个人秘钥进行MD5加密
    const codeModel = `password=${pass}&personalKey=${personalKey}`
    let md5 = crypto.createHash('md5');//创建一个hash实例
      //update里面加上一个utf8，可以避免中文加密结果不同的情况
    return md5.update(codeModel).digest('hex');//开始加密，并以hex格式输出
}

module.exports = genPassword;