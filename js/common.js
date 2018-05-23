//工具集合Tools
window.T = {};

// 获取请求参数
// 使用示例
// location.href = http://localhost/index.html?id=123
// T.p('id') --> 123;
var url = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
};
T.p = url;

//请求前缀
var baseURL = "http://yiyehu.tech:8080/aid-university/";
//var baseURL = "http://192.168.1.102:8080/aid-university/";

function getUUID() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for(var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4";
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);

	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");
	return uuid;
}
var commonUtils = {
	isLogin: function() {
		var stateText = localStorage.getItem('$state') || "{}";
		var state = JSON.parse(stateText);
		if(state.token != '' && state.token != null) {
			return true;
		}
		return false;
	},
	getUserId: function(){
		var stateText = localStorage.getItem('$state') || "{}";
		var state = JSON.parse(stateText);
		return state.userId;
	},
	logout: function() {
		localStorage.removeItem('$state');
		mui.openWindow({
			url: '../../login.html',
			id: 'login.html',
			styles: {
				top: '0px', //新页面顶部位置
				bottom: '0px', //新页面底部位置
			},
			createNew: true, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			show: {
				autoShow: true, //页面loaded事件发生后自动显示，默认为true
				duration: 200 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
			},
			waiting: {
				autoShow: true, //自动显示等待框，默认为true
				title: '正在加载...', //等待对话框上显示的提示内容
				duration: 200,
				options: {
					width: '70px', //等待框背景区域宽度，默认根据内容自动计算合适宽度
					height: '70px', //等待框背景区域高度，默认根据内容自动计算合适高度
				}
			}
		});
		return;
	},
	getToken: function() {
		var stateText = localStorage.getItem('$state') || "{}";
		var state = JSON.parse(stateText);
		return state.token;
	},
	getSubString: function(str,strLength) {
		if(str.length > strLength) {
			return '  ' + str.substring(0, strLength) + '...';
		} else {
			return '  ' + str;
		}
	}
};
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		mui.each(this.UNITS, function(unit, value) {
			if(milliseconds >= value) {
				humanize = Math.floor(milliseconds / value) + unit + '前';
				return false;
			}
			return true;
		});
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if(diff < this.UNITS['天']) {
			return this.humanize(diff);
		}

		var _format = function(number) {
			return(number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' + _format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};