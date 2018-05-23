var vm = new Vue({
	el: '#bookshopDiv',
	data: {
		goodsOrderStatus: [],
		/**
		 * 当前商品的各个不同的状态
		 */
		currStatus: 1,
		/**
		 * 当前指定的商品,菜单点击时更新
		 */
		currAidItem: {},
		showList: true,
		title: null,
		list: [],
		totalCount: 0,
		pageSize: 1,
		totalPage: 0,
		currPage: 0,
		uptodateOrderId: 0,
		lastId: 0,
		banner: {}
	},
	methods: {
		pulldownRefresh: function() {
			var aidCategoryUrl = "app/constant/goodsOrderStatus";
			var token = commonUtils.getToken();
			mui.getJSON(
				baseURL + aidCategoryUrl,
				function(r) {
					if(r.code === 0) {
						vm.goodsOrderStatus = r.goodsOrderStatus;
						if(vm.currStatus == null) {
							vm.currStatus = vm.goodsOrderStatus[1].status;
						}
						vm.queryRelevantOrderByStatus(vm.currStatus);
					} else {
						mui.toast(r.msg);
					}
				}
			);
		},
		pullupRefresh: function(status) {
			var url = "app/orderinfoview/listOfLogin";
			var data = {
				_search: false,
				limit: 4,
				page: vm.currPage + 1,
				order: "asc",
				status: status,
				token: commonUtils.getToken()
			};
			mui.getJSON(baseURL + url, data, function(r) {
				if(r.code === 0) {
					vm.currStatus = status;
					vm.totalCount = r.page.totalCount;
					vm.pageSize = r.page.pageSize;
					vm.totalPage = r.page.totalPage;
					vm.currPage = r.page.currPage;
					if(r.page.list && r.page.list.length > 0) {
						vm.lastId = r.page.list[0].id; //保存最新消息的id，方便下拉刷新时使用

						if(!vm.uptodateOrderId) { //首次拉取列表时保存最后一条消息的id，方便上拉加载时使用
							vm.uptodateOrderId = r.page.list[r.page.list.length - 1].aidId;
						}
						vm.list = vm.list.concat(r.page.list);
					}
				} else {
					mui.toast(r.msg);
				}
			});
		},
		queryRelevantOrderByStatus: function(status) {
			var data = {
				_search: false,
				limit: 4,
				page: 1,
				order: "asc",
				status: status,
				token: commonUtils.getToken()
			};
			var url = "app/orderinfoview/listOfLogin";
			mui.getJSON(baseURL + url, data, function(r) {
				if(r.code === 0) {
					vm.currStatus = status;
					vm.totalCount = r.page.totalCount;
					vm.pageSize = r.page.pageSize;
					vm.totalPage = r.page.totalPage;
					vm.currPage = r.page.currPage;
					if(r.page.list && r.page.list.length > 0) {
						vm.lastId = r.page.list[0].id; //保存最新消息的id，方便下拉刷新时使用

						if(!vm.uptodateOrderId) { //首次拉取列表时保存最后一条消息的id，方便上拉加载时使用
							vm.uptodateOrderId = r.page.list[r.page.list.length - 1].aidId;
						}

					}
					vm.list = r.page.list;
				} else {
					mui.toast(r.msg);
				}
			});
		},
		delete: function() {
			
		},
		confirmTheReceived:function(goodsId){
			mui.ajax({
				url: baseURL + "app/order/confirmTheReceived",
				data:{
					goodsId:goodsId
				},
				headers: {
					token: commonUtils.getToken()
				},
				type: 'put', //表示调用get方法请求；
				dataType: 'json', //表示以json形式接受返回参数
				success: function(r) { //请求成功，返回函数
					if(r.code === 0) {
						mui.toast("已经确认收货");
						vm.pulldownRefresh();
					} else {
						mui.toast(r.msg);
					}
				}
			});
		}
	}
});