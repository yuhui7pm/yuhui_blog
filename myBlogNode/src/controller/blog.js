const xss = require('xss');
const {exec,escape} = require('../db/mysql');

//0.获取全部博客
const getAllBlogs = (author,keyword) =>{
    let sql = `select id,title,classification,pic,introduction,createtime,readers,author from blogs order by createtime desc`;
    return exec(sql).then(dat=>{
        const newDat = JSON.parse(JSON.stringify(dat));
        var obj=[];        
        let result;    
        dat.forEach((element,index) => {
            const blogId = element.id;
            const sql2 = `select firstcontext from blogcomments where blogid='${blogId}' order by id desc`;
            result = exec(sql2).then(ddd=>{
                const firstLength = ddd.length;
                const sql3 = `select secondCommentContext from blogsecondcomments where blogId='${blogId}' order by id desc`
                return exec(sql3).then(secDat=>{
                    const secDatLength = secDat.length;
                    var newnew = Object.assign(element,{commentNum:firstLength+secDatLength});
                    obj.push(newnew);
                    if(index==newDat.length-1){
                        return obj;
                    }
                })
            });
        });
        return result;
    });
}

const differentTypeBlog = (classification)=>{
    let sql = `select * from blogs where classification='${classification}'`;
    return exec(sql);
}

//1.新增加一篇博客
let newBlog = (title,classification,blogIconNew,introduction,newHTML,createtime,author)=>{
    // let title = xss(blogData.title);
    // let content = xss(blogData.content);
    // let author = user;
    // let createtime = Date.now();

    // //防止xss攻击
    // title = xss(title);
    // content = xss(content);
    let sql = `insert into blogs (title,classification,pic,introduction,content,author,createtime,readers,comments) 
                 values ('${title}','${classification}','${blogIconNew}','${introduction}','${newHTML}','${author}','${createtime}','0','0')`
    return exec(sql);
}

//2.获取博客详情
const getDetail = (id) => {
    //每获取一次博客详情，我就增加一次
    const sql = `select * from blogs where id=${id}`
    return exec(sql).then(rows => {
        let detail = rows[0];
        let readers = parseInt(detail.readers)+1;
        const sql2 = `update blogs set readers='${readers}' where id=${id}`;
        readers = 0;
        return exec(sql2).then(data=>{
            return detail; 
        })
    })
}

//3.根据username获取这个人的所有博客
const personalBlogs = (username)=>{
    const sql = `select * from blogs where author='${username}' order by createtime desc`;
    return exec(sql);
} 

//4.删除博客
const deleteBlog = (createtime,id)=>{
    const sql = `delete from blogs where createtime=${createtime}`;
    return exec(sql).then(del=>{
        if(del.affectedRows){//删除的时候changedRows: 0 
            const sql2 = `delete from blogcomments where blogid=${id}`
            return exec(sql2).then((dat)=>{
                const sql3 = `delete from blogsecondcomments where blogId=${id}`
                return exec(sql3);
            })
        }else{
            return false;
        }
    })
}

//5.更新博客
const updateBlog = (introduction,content,createtime)=>{
    const sql = `update blogs set introduction='${introduction}',content='${content}' where createtime=${createtime}`;
    return exec(sql);
}

//6.博客的热门排行
const getHotBlogs = ()=>{
    var blogIdArr  = [];
    var praiseNum = [];
    var praiseNum2 = [];
    var blogIndex = [];
    var newPraiseNum = [];

    const sql = 'select blogId from emojis where praise is not null and praise <> "" and blogId is not null;'
    return exec(sql).then(data=>{
        const newData = JSON.parse(JSON.stringify(data));

        newData.forEach(element => {
            blogIdArr.push(element.blogId)
        });

        let newArr = blogIdArr.reduce(function(prev,next){ 
            prev[next] = (prev[next] + 1) || 1; 
            return prev; 
        },{});

        for(key in newArr){
            praiseNum.push(newArr[key]);
            // blogIndex.push(key);
        }

        //每篇文章的点赞数
        newPraiseNum = praiseNum.sort((a,b)=>{
            return a>b?-1:1;
        }).slice(0,5);

        praiseNum2 =  praiseNum.sort((a,b)=>{
            return a>b?-1:1;
        }).slice(0,5);

        for(var i=0;i<5;i++){
            for(key in newArr){
                if(praiseNum2[i]==newArr[key]){
                    blogIndex.push(key); //得到blogId
                    newArr[key] = "";
                    praiseNum2[i] = i+key+newArr;
                }
            }
        }

        var obj = [];
        const sql2 = `select title from blogs where id in (${blogIndex[0]},${blogIndex[1]},${blogIndex[2]},${blogIndex[3]},${blogIndex[4]})`
        return exec(sql2).then(data=>{
            // console.log(newPraiseNum);
            let newData = JSON.parse(JSON.stringify(data)); 
            newData.forEach((value,index)=>{
                var newnew = Object.assign(value,{praisenum:newPraiseNum[4-index]});
                obj.push(newnew);
            });
            return obj;
        });
    });
}

//7.猜你喜欢
const recommendBlog = ()=>{
    // const sql = `SELECT * FROM blogs WHERE id >= ((SELECT MAX(id) FROM blogs)-(SELECT MIN(id) 
    //              FROM blogs)) * RAND() + (SELECT MIN(id) FROM blogs) limit 10;`
    const sql = `SELECT * FROM blogs WHERE id >= (SELECT FLOOR( MAX(id) * RAND()) FROM blogs) ORDER BY id LIMIT 10;`
    return exec(sql);
}

//8.得到文章总数
const getArticlesNum = ()=>{
    const sql = `select title from blogs`;
    return exec(sql).then(dat=>{
        return dat.length;
    })
}

//9.博客浏览总数
const getPageViews = ()=>{
    const sql = `select sum(readers) as totalReaders from blogs`;
    return exec(sql).then(dat=>{
        return dat;
    })
}

//10.根据keyword获取博客
const getKeywordBlogs = (keyword)=>{
    const sql = `select * from blogs where content like '%${keyword}%' or title like '%${keyword}%' or introduction like '%${keyword}%'`;
    return exec(sql).then(dat=>{
        return dat;
    })
}


module.exports = {
    newBlog,
    getAllBlogs,
    differentTypeBlog,
    getDetail,
    personalBlogs,
    deleteBlog,
    updateBlog,
    getHotBlogs,
    recommendBlog,
    getArticlesNum,
    getPageViews,
    getKeywordBlogs
}