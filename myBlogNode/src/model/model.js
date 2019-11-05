class baseMode{
    constructor(data,message){
        //传递的第一个参数为字符串,执行第一个
        if(typeof data == "String"){
            this.message = data;
            message = null;
            data = null;
        }
        //否则我就执行下面的
        if(data){
            this.data = data;
        }
        if(message){
            this.message = message;
        }
    }
}

class successModel extends baseMode{
    constructor(data,message){
        super(data,message);
        this.errNum = 0;
    }
}

class errorModel extends baseMode{
    constructor(data,message){
        super(data,message);
        this.errNum = -1;
    }
}

module.exports = {
    successModel,
    errorModel
}