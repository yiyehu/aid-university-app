var vm = new Vue({
	el: '#rrapp',
	data: {
		title: null,
		list: [],
		userAddress: {}
	},
	methods: {
		pulldownRefresh: function() {
			mui.getJSON(baseURL + "app/useraddress/listOfLogin", {
				token: commonUtils.getToken()
			}, function(r) {
				if(r.code === 0) {
					vm.list = r.list;
					mui('#rrapp').pullRefresh().endPulldownToRefresh();
				} else {
					mui.toast(r.msg);
					mui('#rrapp').pullRefresh().endPulldownToRefresh();
				}
			});
		},
		delete: function(addressId) {
			if(addressId == null&&addressId=="") {
				return;
			}
			var btnArray = ['否', '是'];
			mui.confirm('确定要删除选中的记录？', '地址删除', btnArray, function(e) {
				if(e.index == 1) {
					mui.ajax({
						url: baseURL + "app/useraddress/"+addressId, //delete请求路径；
						headers: {
							token: commonUtils.getToken()
						},
						type: 'delete', //表示调用get方法请求；
						dataType: 'json', //表示以json形式接受返回参数
						success: function(r) { //请求成功，返回函数
							if(r.code === 0) {
								vm.reload();
								mui.toast('删除成功');
							} else {
								mui.toast(r.msg);
							}
						}
					});
				}
			});
		},
		setDefault: function(addressId) {
			if(addressId == null&&addressId=="") {
				return;
			}
			var btnArray = ['否', '是'];
			mui.confirm('确定要设选中的记录为默认地址？', '设置默认地址', btnArray, function(e) {
				if(e.index == 1) {
					mui.ajax({
						url: baseURL + "app/useraddress/setDefault", //delete请求路径；
						headers: {
							token: commonUtils.getToken()
						},
						data:{
							addressId:addressId
						},
						type: 'put', //表示调用get方法请求；
						dataType: 'json', //表示以json形式接受返回参数
						success: function(r) { //请求成功，返回函数
							if(r.code === 0) {
								vm.reload();
								mui.toast('设为默认成功');
							} else {
								mui.toast(r.msg);
							}
						}
					});
				}
			});
		},
		getInfo: function(addressId) {
			$.get(baseURL + "app/useraddress/" + addressId, function(r) {
				vm.userAddress = r.userAddress;
			});
		},
		reload: function(event) {
			window.location.reload();
		}
	}
});