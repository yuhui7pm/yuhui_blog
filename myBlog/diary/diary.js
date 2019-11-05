//这一块的代码写的有问题，dot应该和三角形放在一块

$(document).ready(()=>{	
	//后台获取日记
	getDiary();
})

function getDiary(){
	$.ajax({
		url:'/api/blog/getDiary',
		type:'GET',
		dataType:'json',
		contentType: "application/json",
		success:(result)=>{
			const data = result.data;
			if(result.errNum ==0){
				data.forEach((value,index)=>{
					$('#line').after(`
						<div class="diaryWrapper">
							<div class="pic_arrow">
								<div class='pic'></div>
								<div class="arrow"></div>
							</div>
							<div class="diary">
								${value.context}
								<span class="createTime">${(value.createtime).split('T')[0]}</span>
							</div>
							<div class="dotWrapper">
								<div class="bigDot">
									<div class="smallDot"></div>
								</div>
							</div>
						</div>
					`)
					console.log((value.createtime).split('T')[0])
				})
				
				//日记的图片
				for(var i=0;i<data.length;i++){			
					$('.pic').eq(i).css('background-image','url(/static'+(data[i].diaryIcon)+')')
				}
				//撑开高度
				$('#diarysWrapper').height(170*data.length);	
				
				hoverDiary();//1.触碰文章，开始变色
				hoverPic();//2.触摸图片,箭头和圆点一起变色
				hoverDot();//3.触摸圆点,箭头和圆点一起变色
			}
		}
	})	
}


function hoverDiary(){
	$(".diaryWrapper .diary").hover(function() {
            $(this).css('background','whitesmoke');
			$(this).prev().find('.arrow').css('border-color','gray white white white')
        	$(this).next().find('.smallDot').css('background','darkgray');
	}, function() {
            $(this).css('background','white');
			$(this).prev().find('.arrow').css('border-color','lightgray white white white')
        	$(this).next().find('.smallDot').css('background','lightgrey');
	});
}

function hoverPic(){
	 $(".diaryWrapper .pic_arrow").hover(function() {
			$(this).find('.arrow').css('border-color','gray white white white')
        	$(this).next().next().find('.smallDot').css('background','darkgray');
	}, function() {
			$(this).find('.arrow').css('border-color','lightgray white white white')
        	$(this).next().next().find('.smallDot').css('background','lightgrey');
	});
}

function hoverDot(){
	 $(".dotWrapper").hover(function() {
			$(this).prev().prev().find('.arrow').css('border-color','gray white white white')
        	$(this).find('.smallDot').css('background','darkgray');
	 }, function() {
			$(this).prev().prev().find('.arrow').css('border-color','lightgray white white white')
        	$(this).find('.smallDot').css('background','lightgrey');
	 });
}