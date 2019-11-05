 /*定义全局变量存贮图片信息*/
var base64head="";

//发送post请求
function post(url,data={}){
	return $.ajax({
		type:'post',
		url,
		data:JSON.stringify(data),
		contentType:"application/json"
	})
}

window.onload = ()=>{
	// 获取 dom 元素
	$textTitle = $('#text-title');
	$textContent = $('#text-content');
	$btnCreate = $('#btn-create');
	
	//summernote初始化
	$('#summernote').summernote( { placeholder: '请输入公告内容', height: 400,width:720 });

	//textarea高度自适应
	commentsAdaption();
	
	//base64	
	$("#headPortraitUpload").on("change",headPortraitListener);
	
	// 提交数据
    $btnCreate.click(() => {
    	var sHTML = $('.note-editable').html();
      	const title = $textTitle.val().trim();
        const introduction = $textContent.val().trim();
        const classification = $('#state_list option:selected').text();//选中选项的文本
//  	console.log(title,
//				classification,
//				base64head,
//				introduction,
//				sHTML)
    	
    	$.ajax({
    		url:'/api/blog/new',
			type:'post',
			dataType:'json',
			contentType: "application/json",
			data:JSON.stringify({
				title,
				classification,
				base64head,
				introduction,
				sHTML
			}),
			success:(data)=>{
				if(data.errNum==0){
					window.location.href = '/index.html';
				}
			}
    	})
    });
}

//textarea高度自适应
function setHeight(element){
	$(element).css({'height':'auto','overflow-y':'hidden'}).height(element.scrollHeight);
}

function commentsAdaption(){
	//on后面必须用function不能用()=>，否则报错。
	$('textarea').each(()=>{
		setHeight(this);
	}).on('input',function(){
		setHeight(this);
	})
	
}
/*头像上传监听*/
function headPortraitListener(e) {
    var img = document.getElementById('headPortraitImgShow');
      if(window.FileReader) {
          var file  = e.target.files[0];
          //FileReader对象允许异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，
          var reader = new FileReader();
          if (file && file.type.match('image.*')) {
//        	  读取到的文件编码成Data URL。
              reader.readAsDataURL(file);
          } else {
//            $(img).attr('src', './img/writeBlog/uploadPic.png');
          }
          reader.onloadend = function (e) {
	          img.setAttribute('src', reader.result);
	          $(img).css('margin-top','-20px');
	          base64head = reader.result;
          }
      }
}

////点击按钮，查看图片
//function removeImage(){
//	$('#img_driver').remove();
//	$('table tr').eq(1).children('td').append('<img style="width:150px;height: 150px;" id="img_driver">');
//}
////图片上传
//function driverUpload() {
//  $('#input_upload_driver').click(); // 模拟文件上传按钮点击操作
//}
///**
// * 缩略图预览
// * @param file
// * @param container
// */
//var preview = function(file, container){
//  //缩略图类定义
//  var Picture  = function(file, container){
//      var height = 0,
//          width  = 0,
//          ext    = '',
//          size   = 0,
//          name   = '',
//          path   =  '';
//      var self   = this;
//      if(file){
//          name = file.value;
//          //第一个是IE浏览器
//          if(window.navigator.userAgent.indexOf("MSIE")>=1){
//              file.select();
//              path = document.selection.createRange().text;
//          }else {
//              if(file.files){
//                  path = window.URL.createObjectURL(file.files[0]);	
//                  console.log(path);
//              }else{
//                  path = file.value;
//              }
//          }
//			
//			
//			
//      }else{
//          throw '无效的文件';
//      }
//      ext = name.substr(name.lastIndexOf("."), name.length);
//      if(container.tagName.toLowerCase() != 'img'){
//          throw '不是一个有效的图片容器';
//          container.visibility = 'hidden';
//      }
//      container.src = path;
//      container.alt = name;
//      container.style.visibility = 'visible';
//      height = container.height;
//      width  = container.width;
//      size   = container.fileSize;
//      this.get = function(name){
//          return self[name];
//      };
//      this.isValid = function(){
//          if(allowExt.indexOf(self.ext) !== -1){
//              throw '不允许上传该文件类型';
//              return false;
//          }
//      }
//  };
//
//  try{
//      var pic =  new Picture(file, document.getElementById('' + container));
//  }catch(e){
//      alert(e);
//  }
//};
