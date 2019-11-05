window.onload = ()=>{
	buttonHover();
	$('.bar4').css('background-color','#D56464');//改变tapBar的颜色
	
}

function buttonHover(){
	$('#shareAuthorButton').hover(()=>{
		$('#shareAuthorButton').animate({opacity:'1'});
	},()=>{
		$('#shareAuthorButton').animate({opacity:'0.8'});
	})
}
