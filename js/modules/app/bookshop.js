var vm = new Vue({
	el: '#bookshopDiv',
	data: {
		bookCategorys:[],
		/**
		 * 当前商品的各个不同的状态
		 */
		currBookCategory: null,
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
			var bookCategoryUrl = "app/category/bookCategorys";
			var token = commonUtils.getToken();
			mui.getJSON(
				baseURL + bookCategoryUrl, {
					token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNTI1NTk2NDk2LCJleHAiOjE1MjYyMDEyOTZ9.cawUKbzIglXPjB_G5rxN_qkM1ADLIjmuuK1mHcjH8_4vGr7792qyfNz0uXt9kmyrlOu61-nhq71IggF6x09TSQ"
				},
				function(r) {
					if(r.code === 0) {
						vm.bookCategorys = r.bookCategorys;
						if(vm.currBookCategory == null) {
							vm.currBookCategory = vm.bookCategorys[0].categoryId;
						}
						vm.queryRelevantGoodsInfoViewBybookCategoryId(vm.currBookCategory);
					} else {
						mui.toast(r.msg);
					}
				}
			);
		},
		pullupRefresh: function(bookCategory){
			var url = "app/goodsInfo/booklist";
			mui.getJSON(baseURL + url, {
				_search: false,
				limit: 6,
				page: vm.currPage + 1,
				order: "asc",
				categoryId: bookCategory,
			}, function(r) {
				if(r.code === 0) {
					vm.currBookCategory = bookCategory;
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
					}
				} else {
					mui.toast(r.msg);
				}
			});
		},
		queryRelevantGoodsInfoViewBybookCategoryId: function(bookCategory) {
			var url = "app/goodsInfo/booklist";
			mui.getJSON(baseURL + url, {
				_search: false,
				limit: 6,
				page: 1,
				order: "asc",
				categoryId: bookCategory,
			}, function(r) {
				if(r.code === 0) {
					vm.currBookCategory = bookCategory;
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
		}
	}
});