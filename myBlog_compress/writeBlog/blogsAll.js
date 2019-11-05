var user;var newFlag=true;var blogIndex=7;var scrollHei;$(()=>{$.ajax({url:'/api/blog/lists',type:'GET',dataType:'json',contentType:"application/json",success:(result)=>{user=result.data["userid"].usernameAuto;console.log('user',user);const userIcon=window.parent.document.getElementsByClassName("contribute")[0];if(user){$(".loginStatus",window.parent.document).html('退出')$(".username",window.parent.document).html(user)}let clickNum=1;addLists(result,clickNum);detailClick(user)},error:(err)=>{console.error(err)}})})function addLists(result,clickNum){let whole=Object.keys(result.data).length-1;for(var i=0;i<Math.min(blogIndex,whole);i++){appendArticle(result.data[i])}$('#more').click(()=>{clickNum++;if(blogIndex*clickNum<whole){for(var i=blogIndex*(clickNum-1);i<blogIndex*clickNum;i++){appendArticle(result.data[i])}window.parent.document.getElementsByClassName('articles')[0].style.height=(200*blogIndex*clickNum)+'px'}else{for(var i=blogIndex*(clickNum-1);i<whole;i++){appendArticle(result.data[i])}window.parent.document.getElementsByClassName('articles')[0].style.height=200*whole+'px';$('.bottomTip').html('我已经到底了~~~');return}detailClick(user)})}function detailClick(user){$(".article").on('click',function(){console.log('点击列表项，跳转到详情页')var articleClass=$(this).attr('class');var regId=/\d+/gi;var passageId=articleClass.match(regId);window.parent.location.href="./blogDetail.html?username="+user+"&blogId="+passageId})}function appendArticle(item){$('#articlesWrapper').append(`<div class="article ${item.id}"><div class="picture"style="background-image:url(/static/blogIcon/image_${item.author}_${item.createtime}.jpg)"></div><div class="artical_right"><div class="title">${item.title}</div><p class="articleDiscription"></p><div class="articleBottom"><span class="item"style="height:16px;line-height:16px"style="position:relative;"><img src='../img/home/label.svg'height="16px"style="position:absolute;"/><span style="margin-left:20px;text-align:left;display:inline-block;width:40px">${item.classification}</span></span><span class="item"class=""><span class="author iconfont">&#xe620;</span><span style="color:#00a67c">${item.author}</span></span><span class="item"><span class="time iconfont">&#xe60d;</span><span>${getMyDate(item.createtime)}</span></span><span class="item"><span class="observers iconfont">&#xe65d;</span><span style="color:#00a67c">${item.readers}浏览</span></span><span class="item"><span class="comments iconfont">&#xe613;</span><span style="color:#00a67c">${item.commentNum}评论</span></span></div></div></div></div>`)var context=item.introduction;var rowNum=35;if(context){var index=Math.ceil(context.length/rowNum);if(index>5){context=context.substring(0,rowNum*5-3)+'...';index=5}for(var i=0;i<index;i++){var end=context.length<(i+1)*rowNum?context.length:(i+1)*rowNum;var con=context.substring(i*rowNum,end);$('.'+item.id).find('.articleDiscription').append(con+'<br/>')}}}function getMyDate(str){var oDate=new Date(str),oYear=oDate.getFullYear(),oMonth=oDate.getMonth()+1,oDay=oDate.getDate(),oHour=oDate.getHours(),oMin=oDate.getMinutes(),oSen=oDate.getSeconds(),oTime=oYear+'-'+addZero(oMonth)+'-'+addZero(oDay)+' '+addZero(oHour)+':'+addZero(oMin)+':'+addZero(oSen);return oTime}function addZero(num){if(parseInt(num)<10){num='0'+num}return num}