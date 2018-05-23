var messageVue = new Vue({
	el: '#messageDiv',
	data: {
		showList: true,
		title: null,
		topCategory: [],
		users: [],
		currCategoryId: 3

	},
	methods: {
		pulldownRefresh: function() {
			var topCategoryUrl = "app/category/queryTopCategory";
			var queryRelevantChatUsersUrl = "app/user/queryRelevantChatUsers";
			var stateText = localStorage.getItem('$state') || "{}";
			var state = JSON.parse(stateText)

			mui.getJSON(baseURL + topCategoryUrl, {
				token: commonUtils.getToken(),
			}, function(r) {
				if(r.code === 0) {
					messageVue.topCategory = r.topCategory;
					messageVue.queryRelevantChatUsers(messageVue.currCategoryId);
					mui('#itemmobile').pullRefresh().endPulldownToRefresh();
				} else {
					mui.toast(r.msg);
					mui('#itemmobile').pullRefresh().endPulldownToRefresh();
				}
			});

		},
		queryRelevantChatUsers: function(categoryId) {
			messageVue.currCategoryId = categoryId;
			var queryRelevantChatUsersUrl = "app/user/queryRelevantChatUsers";
			mui.getJSON(baseURL + queryRelevantChatUsersUrl, {
				token: commonUtils.getToken(),
				categoryId: categoryId
			}, function(r) {
				if(r.code === 0) {
					messageVue.users = r.users;
					mui.toast(r.msg);
				} else {
					mui.toast(r.msg);
				}
			});
		}
	}
});