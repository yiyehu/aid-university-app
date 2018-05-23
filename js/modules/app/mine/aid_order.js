var vm = new Vue({
	el: '#bookshopDiv',
	data: {

		/**
		 * 判断请求的人，如果logStatus==0 则请求全部，若为1则请求创建人为用户自己的帮帮订单信息，若为2则请求接单人为用户自己的帮帮订单信息
		 * @param {Object} logStatus
		 */
		logStatus: 0,
		aidCategorys: [],
		/**
		 * 当前商品的各个不同的状态
		 */
		currAidCategory: null,
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
		uptodateAidId: 0,
		lastId: 0,
		banner: {}
	},
	methods: {
		pulldownRefresh: function() {
			var aidCategoryUrl = "app/category/aidCategorys";
			var token = commonUtils.getToken();
			mui.getJSON(
				baseURL + aidCategoryUrl,
				function(r) {
					if(r.code === 0) {
						vm.aidCategorys = r.aidCategorys;
						if(vm.currAidCategory == null) {
							vm.currAidCategory = vm.aidCategorys[0].categoryId;
						}
						vm.queryRelevantAidsByaidCategoryId(vm.currAidCategory);
					} else {
						mui.toast(r.msg);
					}
				}
			);
		},
		pullupRefresh: function(aidCategory) {
			var url = "app/aidorder/listOfLogin";
			var data = {
				_search: false,
				limit: 4,
				page: vm.currPage + 1,
				order: "asc",
				categoryId: aidCategory,
				logStatus: vm.logStatus,
				token: commonUtils.getToken()
			};
			mui.getJSON(baseURL + url, data, function(r) {
				if(r.code === 0) {
					vm.currAidCategory = aidCategory;
					vm.totalCount = r.page.totalCount;
					vm.pageSize = r.page.pageSize;
					vm.totalPage = r.page.totalPage;
					vm.currPage = r.page.currPage;
					if(r.page.list && r.page.list.length > 0) {
						vm.lastId = r.page.list[0].id; //保存最新消息的id，方便下拉刷新时使用

						if(!vm.uptodateAidId) { //首次拉取列表时保存最后一条消息的id，方便上拉加载时使用
							vm.uptodateAidId = r.page.list[r.page.list.length - 1].aidId;
						}
						vm.list = vm.list.concat(r.page.list);
					}
				} else {
					mui.toast(r.msg);
				}
			});
		},
		queryRelevantAidsByaidCategoryId: function(aidCategory) {
			var data = {
				_search: false,
				limit: 4,
				page: 1,
				order: "asc",
				categoryId: aidCategory,
				logStatus: vm.logStatus,
				token: commonUtils.getToken()
			};
			var url = "app/aidorder/listOfLogin";
			mui.getJSON(baseURL + url, data, function(r) {
				if(r.code === 0) {
					vm.currAidCategory = aidCategory;
					vm.totalCount = r.page.totalCount;
					vm.pageSize = r.page.pageSize;
					vm.totalPage = r.page.totalPage;
					vm.currPage = r.page.currPage;
					if(r.page.list && r.page.list.length > 0) {
						vm.lastId = r.page.list[0].id; //保存最新消息的id，方便下拉刷新时使用

						if(!vm.uptodateAidId) { //首次拉取列表时保存最后一条消息的id，方便上拉加载时使用
							vm.uptodateAidId = r.page.list[r.page.list.length - 1].aidId;
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
		getCategorysIcon: function(categoryId) {
			for(var i = 0; i < vm.aidCategorys.length; i++) {
				if(vm.aidCategorys[i].categoryId == categoryId) {
					return vm.aidCategorys[i].icon;
				}
			}
			return '';
		}
	}
});