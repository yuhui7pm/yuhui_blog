const env = process.env.NODE_ENV;//获取项目现今的运行环境
let MYSQL_CONF;//初始化mysql的基本配置
let REDIS_CONF;//初始化redis基本配置

if(env === 'dev'){
    MYSQL_CONF={
        user:"root",
        password:"yuhui7pm",
        host:"127.0.0.1",
        port:'3306', 
        database:"huiblog"
    }
    REDIS_CONF = {
        port:6379,
        host:'127.0.0.1'
    }
}

//环境不同，配置项应该也不同
if(env === 'prd'){
    MYSQL_CONF={
        user:"root",
        password:"yuhui7pm",
        host:"127.0.0.1",
        port:'3306',
        database:"huiblog"
    }
    REDIS_CONF = {
        port:6379,
        host:'127.0.0.1'
    }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
};