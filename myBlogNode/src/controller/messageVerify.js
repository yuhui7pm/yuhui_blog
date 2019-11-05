const Nexmo = require('nexmo');
// Initialize the library
const nexmo = new Nexmo({
  apiKey: 'f88efb86',
  apiSecret: 'IlsifOo5zEB1MmmM',
});

// Make a request
const sendReq = (phoneNumber,sendResult)=>{
    const promise = new Promise((resolve,reject)=>{
        nexmo.verify.request({
            number: '86'+phoneNumber,
            brand: 'huiBlog',
            code_length: '4',
            pin_expiry:"60"
            }, (err, result) => {
                // console.log('发送验证码：',err, result,'\n');
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
        });
    })
    return promise;
}

//Cancel a request
const cancleReq = (request_id)=>{
    const promise = new Promise((resolve,reject)=>{
        nexmo.verify.control({
            request_id,
            cmd: 'cancel'
            }, (err, result) => {
                // console.log('取消验证码',err, result,'\n');
                if(err){
                    reject(err);
                    return
                }
                resolve(result);
        });
    })

    return promise;
}

//Check a request
const checkReq = (request_id,code)=>{
    const promise = new Promise((resolve,reject)=>{
        nexmo.verify.check({
            request_id,
            code
            }, (err, result) => {
                // console.log('检查验证码：',err, result,'\n');
                if(err){
                    reject(err);
                    return
                }
                resolve(result);
        });
    })
    return promise;
}

module.exports = {sendReq,cancleReq,checkReq};