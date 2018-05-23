var vm = new Vue({
	el: '#marketDiv',
	data: {
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
		pulldownRefresh: function(ajaxdata) {
			var url = "app/goodsInfo/list";
			mui.getJSON(baseURL + url, ajaxdata, function(r) {
				if(r.code === 0) {
					vm.totalCount = r.page.totalCount;
					vm.pageSize = r.page.pageSize;
					vm.totalPage = r.page.totalPage;
					vm.currPage = r.page.currPage;

					mui('#list').pullRefresh().endPulldownToRefresh();
					if(r.page.list && r.page.list.length > 0) {
						vm.lastId = r.page.list[0].id; //保存最新消息的id，方便下拉刷新时使用

						if(!vm.uptodateGoodsId) { //首次拉取列表时保存最后一条消息的id，方便上拉加载时使用
							vm.uptodateGoodsId = r.page.list[r.page.list.length - 1].goodsId;
						}
						vm.list = r.page.list;
					}
				} else {
					mui.toast(r.msg);
					mui('#list').pullRefresh().endPulldownToRefresh();
				}
			});
		},
		pullupRefresh: function(ajaxdata) {
			var url = "app/goodsInfo/list";
			mui.getJSON(baseURL + url, ajaxdata, function(r) {
				if(r.code === 0) {
					vm.totalCount = r.page.totalCount;
					vm.pageSize = r.page.pageSize;
					vm.totalPage = r.page.totalPage;
					vm.currPage = r.page.currPage;

					mui('#list').pullRefresh().endPullupToRefresh();
					if(r.page.list && r.page.list.length > 0) {
						vm.uptodateGoodsId = r.page.list[r.page.list.length - 1].goodsId; //保存最后一条消息的id，上拉加载时使用
						vm.list = convert(vm.list).concat(r.page.list);
					}
				} else {
					mui.toast(r.msg);
					mui('#list').pullRefresh().endPulldownToRefresh();
				}
			});
		},
		banner: function(data) {
			var url = "app/goodsInfo/newestGoods";
			mui.getJSON(baseURL + url, data, function(r) {
				vm.banner = r.goodsInfoView;
				vm.banner.addtime = dateUtils.format(r.goodsInfoView.addtime);

			});
		}
	}
});