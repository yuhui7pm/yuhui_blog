const {exec,escape} = require('../db/mysql');

//1.保存一级评论
const commentsInsert = (blogId,icon,author,createtime,context,praise)=>{
    const sql = `insert into blogcomments (blogid,firsticon,firstcommentor,firstcommenttime,firstcontext,firstpraise)
                values (${blogId},'${icon}','${author}',${createtime},'${context}',${praise})`
    return exec(sql);
}

//2.获取一级评论
const getComments = (id)=>{
    const sql = `select * from blogcomments where blogid=${id}`;
    return exec(sql);
}

//3.删除一级评论
const deleteFirstComments = (id,rootCommentor,rootCommentTime,commenter)=>{
    let sql = `delete from blogcomments where blogId=${id} and firstCommentor='${rootCommentor}' and firstcommenttime=${rootCommentTime}`
    return exec(sql);
}

//3.5 一级评论点赞数目
const uploadFirstPraise = (id,rootCommentor,rootCommentTime,firstpraise)=>{
    const sql = `update blogcomments set firstpraise=${firstpraise} where blogid=${id} and 
                firstcommentor='${rootCommentor}' and firstcommenttime=${rootCommentTime}`
    return exec(sql);
}

//4.从数据库获取二级评论数据
const getSecondComments = (blogId,rootCommentor,rootCommentTime)=>{
    const sql = `select * from blogsecondcomments where blogId=${blogId} and firstCommentor='${rootCommentor}' and rootCommentTime=${rootCommentTime}`
    return exec(sql);
}

//5.二级评论插入到数据库
const saveSecondComments = (id,rootCommentor,rootCommentTime,secondCommentorIcon,secondCommentor,secondCreatetime,secondCommentContext,secondCommentPraise)=>{
    const sql = `insert into blogsecondcomments (blogId,firstCommentor,rootCommentTime,secondCommentorIcon,secondCommentor,secondCommentContext,secondCommentCreatetime,secondCommentPraise)
                values (${id},'${rootCommentor}',${rootCommentTime},'${secondCommentorIcon}','${secondCommentor}','${secondCommentContext}',${secondCreatetime},${secondCommentPraise})`
    return exec(sql);
}

//6.删除二级评论
const deleteSecondComments = (id,rootCommentor,rootCommentTime,secondCommentor,secondCreatetime)=>{
    let sql = `delete from blogsecondcomments where blogId=${id} and firstCommentor='${rootCommentor}' and rootCommentTime=
        ${rootCommentTime} and secondCommentor like '${secondCommentor}%' and secondCommentCreatetime=${secondCreatetime}`
    return exec(sql);
}

//7. 二级评论点赞数目
const uploadSecondPraise = (id,secondCommentor,secondCommentCreatetime,secondCommentPraise)=>{
    const sql = `update blogsecondcomments set secondCommentPraise=${secondCommentPraise} where blogId=${id} and 
                    secondCommentor='${secondCommentor}' and secondCommentCreatetime=${secondCommentCreatetime}`
    return exec(sql);
}

//8.获取用户所有的评论
const getAllComments = (username)=>{
    const sql = `select * from blogcomments where firstcommentor='${username}' order by id desc`;
    return exec(sql).then(dat=>{
        dat = JSON.parse(JSON.stringify(dat));
        var obj=[];        
        let result;    
        dat.forEach((element,index) => {
            const blogId = element.blogid;
            const sql2 = `select title from blogs where id='${blogId}' order by id desc`;
            result = exec(sql2).then(ddd=>{
                var ne = JSON.parse(JSON.stringify(ddd));
                var newnew = Object.assign(element,ne[0]);
                obj.push(newnew);
                if(index==dat.length-1){
                    // console.log(obj);
                    return obj;
                }
            });
        });
        return result;
    });
}

//9.获取用户所有的二级评论
const getAllSecondComments = (username)=>{
    const sql = `select * from blogsecondcomments where secondCommentor='${username}' order by id desc`;
    return exec(sql).then(dat=>{
        dat = JSON.parse(JSON.stringify(dat));
        var obj=[];        
        let result;    
        dat.forEach((element,index) => {
            const blogId = element.blogId;
            const sql2 = `select title from blogs where id='${blogId}' order by id desc`;
            result = exec(sql2).then(ddd=>{
                var ne = JSON.parse(JSON.stringify(ddd));
                var newnew = Object.assign(element,ne[0]);
                obj.push(newnew);
                if(index==dat.length-1){
                    return obj;
                }
            });
        });
        return result;
    });
}
//10.删除评论
const deleteUserComments = (type,commentId,user)=>{
    let sql;
    if(type==1){
        sql = `delete from blogcomments where id=${commentId} and firstcommentor='${user}'`
    }else if(type==2){
        sql = `delete from blogsecondcomments where id=${commentId} and secondCommentor like '${user}%'`
    }
    return exec(sql);
}

//11.获取博客的留言数目
const getCommentsNumber = (blogId)=>{
    // console.log('blogId',blogId);
    const sql = `select * from blogcomments where blogid = ${blogId}`
    return exec(sql).then(dat=>{
        // console.log('dat',dat);
        const firstLength = dat.length;
        // console.log('firstLength',firstLength);
        const sql2 = `select secondCommentor from blogsecondcomments where blogId = ${blogId}` 
        return exec(sql2).then(ddd=>{
            const secondLength = ddd.length;
            return (firstLength+secondLength);
        })       
    })
}

//12.获得博客最新的留言
const newestComments = ()=>{
    const sql = 'select * from blogcomments order by firstcommenttime desc limit 5;'
    return exec(sql).then(dat=>{
        const newDat = JSON.parse(JSON.stringify(dat));
        return newDat;
    })
}

//13.获取评论总数
const getCommentsNum = ()=>{
    const sql = 'select blogid from blogcomments';
    return exec(sql).then(dat=>{
        const firstLength = dat.length;
        const sql2 = 'select blogId from blogsecondcomments';
        return exec(sql2).then(dat2=>{
            const secondLength = dat2.length;
            return (firstLength+secondLength)
        })
    })
}
module.exports = {commentsInsert,getComments,deleteFirstComments,uploadFirstPraise,saveSecondComments,
                  getSecondComments,deleteSecondComments,uploadSecondPraise,newestComments,getCommentsNum,
                  getAllComments,getAllSecondComments,deleteUserComments,getCommentsNumber};