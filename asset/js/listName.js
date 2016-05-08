var listName = ( _ => {
	var $listNameWrap;

	function init() {
		_cacheDOM();//抓要用到的DOM
		_bindEvent();//綁住會觸發的物件及事件
	}

	function _cacheDOM() {
		$listNameWrap = $('#listNameWrap');
	}

	function _bindEvent() {
		//on 是給一個監聽器 (事件,要綁的元素,callback)
		$listNameWrap.on('click.setList', '#btn-setList', handleSetList);
		$listNameWrap.on('keypress.setList', '#listName', _handlePressEnter);
	}

	function _handlePressEnter(e) {
		if(e.which == 13) {
			handleSetList();
		}
	}

	function handleSetList() {
		var listName = $listNameWrap.find('#listName').val();
		//可利用console.log做測試 會反映在網頁console上
		if(listName) {
			$.ajax({
				url: `${BASE_URL}lists`, 
				type: 'post', 
				dataType: 'json', 
				//告訴瀏覽器我們在做甚麼 避免被當成XSS 讓他願意產生這東西
				contentType: "application/json; charset=utf-8",
				//data: JSON.stringify({
				//	listName
				//}),
                data: JSON.stringify({//格式是json 包成json的string格式
					listName: listName
				}),
				//告訴瀏覽器我們在做甚麼 避免被當成XSS				
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true, 
				success: function(data) {
					todoList.render(data.tasks);//使用todoList那寫好的function
					if(!data.tasks.length) {
						alert('Has any task yet.\n Just add one.');
					}
				}, 
				error: function(jqXHR) {
					console.dir(jqXHR);
				}
			});
		}
	}

	return {//函數會傳回值
		init, 
		handleSetList
	}
})();