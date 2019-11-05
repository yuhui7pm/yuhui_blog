var fs = require('fs'); // 引入fs模块
var path = require('path');
var num = 0;

//删除文件以及文件夹
function delPath(path){
    // if(path.indexOf('./')!==0||path.indexOf('../')!==0){
    //     return "为了安全仅限制使用相对定位..";
    // }
    if(!fs.existsSync(path)){
        console.log("路径不存在");
        return "路径不存在";
    }
    var info=fs.statSync(path);
    if(info.isDirectory()){//目录
        var data=fs.readdirSync(path);
        if(data.length>0){
            for (var i = 0; i < data.length; i++) {
                delPath(`${path}/${data[i]}`); //使用递归
                if(i==data.length-1){ //删了目录里的内容就删掉这个目录
                    delPath(`${path}`);
                }
            }
        }else{
            fs.rmdirSync(path);//删除空目录
        }
    }else if(info.isFile()){
        fs.unlinkSync(path);//删除文件
    }
}

//1.博客简介图片的url经过处理之后保存到本地
const blogIcon = (base64head,author,createtime)=>{    
    //过滤data:URL
    var base64Data = base64head.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64'); // 解码图片,被弃用，暂时找不到好的方法
    // var dataBuffer = Buffer.from(base64Data).toString('base64');
    
    var imgUrl = "/yuhuiBlog_HTML/blogImage/blogIcon/image_"+ author +"_" + createtime +".jpg";
    fs.writeFile(imgUrl, dataBuffer, function(err) {
        // if(err){
        //     console.log(err);
        // }else{
        //     console.log('保存成功');
        // }
    });
    return imgUrl;
}

//2.将博客内容图片base64格式转换为正常的图片，并保存在本地
const blogPic = (author,createtime,sHTML)=>{
    console.log('createtime',createtime);
    //博客内容的图片url经过处理之后，保存到本地
    var picArr = sHTML.split('" data-filename=').slice(0,-1);
    let documentUrl = '/yuhuiBlog_HTML/blogImage/blogContextPic/'+author+'_'+createtime;
    //存在就删除文件夹
    delPath(documentUrl);
    //删除完文件夹之后就重新创建文件夹存放图片
    fs.mkdir(documentUrl,(err)=>{
        console.log('-------------------------------------------------------');
        if (err) {
            return console.error(err);
        }
        picArr.forEach((e,index) => {
            let picUrl = e.split(';base64,')[1];
            // let picPostfix = e.split(';base64,')[0].split('/')[1];//图片后缀格式
            // var contextPic = Buffer.from(picUrl).toString('base64');
            var contextPic = new Buffer(picUrl, 'base64'); // 解码图片,被弃用，暂时找不到好的方法
            // var contextPic = Buffer.from(e).toString('base64');
            
            //图片都保存为jpg格式
            fs.writeFile(documentUrl+'/'+index+".jpg", contextPic, function(err) {
                if(err){
                    console.log(err);
                }else{
                    console.log('保存成功');
                }
            });
        });
    })
}

//3.修改前端传递过来的文本，将img标签的src改为本地的url
const changeImgUrl = (sHTML,author,createtime)=>{
    let documentUrl = '/static/blogContextPic/'+author+'_'+createtime+'/';
    var newContent= sHTML.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi,function(match,capture){
        num ++;
        match = match.replace(capture,documentUrl+(num-1)+".jpg");
        return match;
   });
    num=0;
    return newContent;
}

module.exports = {blogIcon,blogPic,changeImgUrl};
