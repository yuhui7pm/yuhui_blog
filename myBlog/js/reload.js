//如果窗体大小改变,书信页面防止样式错乱
var x = window.innerWidth;
function resizeFresh(){
	if(x!=window.innerWidth){
		location.reload();//使用location.reload实现页面刷新。
	}
}
