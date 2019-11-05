const {REDIS_CONF} = require('../conf/db');
const redis = require('redis');

//1.创建redis链接
const redisClient = redis.createClient(REDIS_CONF.port,REDIS_CONF.host);

//2.检测有无错误
redisClient.on('error',(err)=>{
    console.error(err);
})

//3.封装set
const set = (key,value)=>{
    if(typeof value === 'object'){
        value = JSON.stringify(value);
    }
    redisClient.set(key,value,redis.print);
}

//4.封装get
const get = (key) =>{
    const promise = new Promise((resolve,reject)=>{
        redisClient.get(key,(err,result)=>{
            if(err){
                reject(err);
                return;
            }
            if(result==null){
                resolve(null)
                return
            }
            try{
                resolve(JSON.parse(result));
            }catch(err){
                resolve(result);
            }

            //直接resolve出来result不就行了？
        })
    })
    return promise;
}

module.exports = {
    set,
    get
}