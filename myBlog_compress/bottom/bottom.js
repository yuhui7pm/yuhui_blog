var workWith=["Python.","C++.","Java.","Matlab.","Vue.","Node.","React."];var i=0,j=0;var arr=[];var workWithLength=workWith.length;var num=0;var index=0;var test=0;var delay=1000;$(()=>{$('body').append(`<div id="bottom"style="width:100%;clear:both;"><div class="aboutWebWrapper"><div class="aboutWeb"><h3>关于本站</h3><p>白小晖个人博客是关注互联网以及分享人工智能相关知识的个人网站，主要涵盖了网络爬虫、机器学习、深度学习等经验教程。网站宗旨：把最实用的经验，分享给最需要的读者，希望每一个来访的朋友都能有所收获！</p></div><div class="aboutWebRight"><div class="dynamicLetters"><span>I work with</span><span class="changeLetters"></span><span class="randomLetters"></span></div><img src="./bottom/girl_bottom.gif"height="50px"width="50px"></div></div><div class="copyrightWrapper"><div class="copyright">Copyright©2019白小晖个人博客版权所有备案号：苏ICP备15003834号</div><div class="days"><span class="shaky">(๑￫ܫ￩)</span><span id="existingTime"style="font-size:'楷体'"></span></div></div></div>`);addLetter();show_date_time()})function randomColor(){var colorStr="";var randomArr=['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];for(var i=0;i<6;i++){colorStr+=randomArr[Math.ceil(Math.random()*(15-0)+0)]}return'#'+colorStr}function randomChar(index){const str="abcdefghijklmnopqrstuvwxyz0123456789!~`#@$%^&*()?,.";const randomStr=str.charAt(Math.ceil(Math.random()*(str.length)));setInterval(()=>{$('.rgbFont'+index).html(str.charAt(Math.ceil(Math.random()*(str.length))));$('.rgbFont'+index).css('color',randomColor())},70)}function disappear(i){var disappear=setInterval(()=>{if(index>=i){index=0;clearInterval(disappear);addLetter()}else if(index<i){$('.changeLetters').find(`span:eq(${i-1-index})`).remove();$('.randomLetters').append(`<span class="rgbFont${i-1-index}"></span>`);randomChar(i-1-index);index++}},150)}function addLetter(arr){var appear=setInterval(()=>{arr=[...workWith[j]];var len=arr.length;if(i>=len){clearInterval(appear);$('.randomLetters').find('span').remove();setTimeout(`disappear(${i});`,delay);i=0;j=(j+1)%workWithLength}else if(i<len){$('.randomLetters').find(`span:eq(${i+1})`).remove();$('.changeLetters').append(`<span>${arr[i]}</span>`);i=i+1}},150)}<!--时间计算--><!--时间计算-->function show_date_time(){window.setTimeout("show_date_time()",1000);BirthDay=new Date("08/12/2019 00:00:00");today=new Date();timeold=(today.getTime()-BirthDay.getTime());sectimeold=timeold/1000 secondsold=Math.floor(sectimeold);msPerDay=24*60*60*1000 e_daysold=timeold/msPerDay daysold=Math.floor(e_daysold);e_hrsold=(e_daysold-daysold)*24;hrsold=Math.floor(e_hrsold);e_minsold=(e_hrsold-hrsold)*60;minsold=Math.floor((e_hrsold-hrsold)*60);seconds=Math.floor((e_minsold-minsold)*60);var showtime=document.getElementById('existingTime')showtime.innerHTML="网站稳定运行："+addZero(daysold)+"天 "+addZero(hrsold)+"时 "+addZero(minsold)+"分 "+addZero(seconds)+"秒 "}function addZero(data){return data<10?'0'+data:data}