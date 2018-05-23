var vm = new Vue({
	el: '#myGoodsDiv',
	data: {
		goodsStatus: [],
		/**
		 * 当前商品的各个不同的状态
		 */
		currGoodsSta: 0,
		/**
		 * 当前指定的商品,菜单点击时更新
		 */
		currGoodsItem: {},
		showList: true,
		title: null,
		list: [],
		totalCount: 0,
		pageSize: 1,
		totalPage: 0,
		currPage: 0,
		uptodateGoodsId: 0,
		lastId: 0,
		banner: {}
	},
	methods: {
		pulldownRefresh: function() {
			var url = "app/goodsInfo/listOfLogin";
			var goodsStatusUrl = "app/goods/goodsStatus";
			mui.getJSON(
				baseURL + goodsStatusUrl, {
					token: commonUtils.getToken(),
				},
				function(r) {
					if(r.code === 0) {
						vm.goodsStatus = r.goodsStatus;
						vm.queryRelevantGoodsInfoViewByGoodsStatus(vm.currGoodsSta);
						mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
					} else {
						mui.toast(r.msg)
					}
				}
			);
		},
		pullupRefresh: function(status) {
			var url = "app/goodsInfo/listOfLogin";
			vm.currGoodsSta = status;
			mui.getJSON(baseURL + url, {
				_search: false,
				limit: 3,
				page: vm.currPage + 1,
				order: "asc",
				status: status,
				token: commonUtils.getToken()
			}, function(r) {
				if(r.code === 0) {
					vm.currGoodsSta = status;
					vm.totalCount = r.page.totalCount;
					vm.pageSize = r.page.pageSize;
					vm.totalPage = r.page.totalPage;
					vm.currPage = r.page.currPage;
					if(r.page.list && r.page.list.length > 0) {
						vm.lastId = r.page.list[0].id; //保存最新消息的id，方便下拉刷新时使用

						if(!vm.uptodateGoodsId) { //首次拉取列表时保存最后一条消息的id，方便上拉加载时使用
							vm.uptodateGoodsId = r.page.list[r.page.list.length - 1].goodsId;
						}
						vm.list = vm.list.concat(r.page.list);
						mui('#pullrefresh').pullRefresh().endPullupToRefresh();
					}
				} else {
					mui.toast(r.msg);
					mui('#pullrefresh').pullRefresh().endPullupToRefresh();
				}
			});
		},
		queryRelevantGoodsInfoViewByGoodsStatus: function(status) {
			var url = "app/goodsInfo/listOfLogin";
			vm.currGoodsSta = status;
			mui.getJSON(baseURL + url, {
				_search: false,
				limit: 3,
				page: 1,
				order: "asc",
				status: status,
				token: commonUtils.getToken()
			}, function(r) {
				if(r.code === 0) {
					vm.currGoodsSta = status;
					vm.totalCount = r.page.totalCount;
					vm.pageSize = r.page.pageSize;
					vm.totalPage = r.page.totalPage;
					vm.currPage = r.page.currPage;
					if(r.page.list && r.page.list.length > 0) {
						vm.lastId = r.page.list[0].id; //保存最新消息的id，方便下拉刷新时使用

						if(!vm.uptodateGoodsId) { //首次拉取列表时保存最后一条消息的id，方便上拉加载时使用
							vm.uptodateGoodsId = r.page.list[r.page.list.length - 1].goodsId;
						}

					}
					vm.list = r.page.list;
				} else {
					mui.toast(r.msg);
				}
			});
		},
		delete: function() {
			mui.ajax({
				url: baseURL + "app/goods/" + vm.currGoodsItem.goodsId, //delete请求路径；
				headers: {
					token: commonUtils.getToken()
				},
				type: 'delete', //表示调用get方法请求；
				dataType: 'json', //表示以json形式接受返回参数
				success: function(r) { //请求成功，返回函数
					if(r.code === 0) {
						mui.toast("删除成功");
						vm.pulldownRefresh();
					} else {
						mui.toast(r.msg);
					}
				}
			});
		},confirmTheDelivery:function(){
			mui.ajax({
				url: baseURL + "app/order/confirmTheDelivery",
				data:{
					goodsId:vm.currGoodsItem.goodsId
				},
				headers: {
					token: commonUtils.getToken()
				},
				type: 'put', //表示调用get方法请求；
				dataType: 'json', //表示以json形式接受返回参数
				success: function(r) { //请求成功，返回函数
					if(r.code === 0) {
						mui.toast("已经确认发货");
						vm.pulldownRefresh();
					} else {
						mui.toast(r.msg);
					}
				}
			});
		}
	}
});