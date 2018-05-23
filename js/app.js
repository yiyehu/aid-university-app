/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.mobile = loginInfo.mobile || '';
		loginInfo.password = loginInfo.password || '';
		if(loginInfo.mobile.length < 5) {
			return callback('账号最短为 5 个字符');
		}
		if(loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}

		return owner.loginServer(loginInfo, callback);
	};

	//用户登录，并创建$state和$state.token
	owner.loginServer = function(data, callback) {
		var url = baseURL + "app/login";
		$.ajax({
			url: url,
			data: data,
			type: "post", //HTTP请求类型
			contentType: "application/json",
			dataType: "json", //服务器返回json格式数据
			timeout: 10000, //超时时间设置为10秒；
			success: function(r) {
				if(r.code == 0) { //登录成功
					owner.createState(r.name, r.token, r.userId, r.expire, callback);
				} else {
					return callback(data);
				}
			}
		});
	};

	/**
	 * 本地存储token
	 */
	owner.createState = function(name, token, userId, expire, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = token;
		state.userId = userId;
		state.expire = expire;
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册验证
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.mobile = regInfo.mobile || '';
		regInfo.password = regInfo.password || '';
		if(regInfo.mobile.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if(regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		owner.registerServer(regInfo, callback);
		return callback();
	};

	/**
	 * 用户后台注册
	 **/
	owner.registerServer = function(data, callback) {
		var url = baseURL + "app/register";
		$.ajax({
			url: url,
			data: data,
			type: "post",
			contentType: "application/json",
			dataType: "json",
			timeout: 60000,
			success: function(r) {
				if(r.code == 0) { //注册成功
					return callback();
				} else {
					return callback(r.msg);
				}
			}
		});
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if(!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
	/**
	 * 获取本地是否安装客户端
	 **/
	owner.isInstalled = function(id) {
		if(id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if(mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch(e) {}
		} else {
			switch(id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.app = {}));