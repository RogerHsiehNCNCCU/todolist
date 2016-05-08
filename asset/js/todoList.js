var todoList = ( _ => {
	var $list;

	function init() {
		_cacheDOM();
		_bindEvent();
	}

	function _cacheDOM() {
		$list = $('#todoList');
		//這樣給這個變數 以後要用可以比較精簡
	}

	function _bindEvent() {
		$list.on('click.del', '.btn-del', _handleDel);
		$list.on('click.changeStatus', '.btn-status', _handleChangeStatus);
	}

	function _handleDel() {
		//console.log('XXXXXX');//可利用console測試有無成功 可在網頁console那看到
		var $this = $(this); //代表這個函數所指到的那個 按鈕物件
		var id = $this.parents('.tasks').attr('id'); //可利用.parents找到上層('輸入要找的那個')
		$.ajax({
			url: `${BASE_URL}tasks/${id}`, //利用 jQuery es6的格式連接字串 ‵`${}`
			type: 'delete', 
			dataType: 'json', 
			contentType: "application/json; charset=utf-8",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true, 
			success: function(data) {
				console.log(data);
				$list.find(`#${id}`).remove();
				//$this.parents('.tasks').remove(); //把整個刪除掉
			}, 
			error: function(jqXHR) {
				console.dir(jqXHR);
			}
		});
	}
	function _handleChangeStatus() {
		//console.log('XXX'); //用console.log測試事件有無成功綁入
		var $this = $(this);
		var id = $this.parents('.tasks').attr('id');//要找父母的attribute的id
		var status = $this.attr('data-status');
		var isDone = status == 'done' ? false : true;
		$.ajax({
			url: `${BASE_URL}tasks/${id}`, 
			type: 'patch', //html verb
			dataType: 'json', 
			contentType: "application/json; charset=utf-8",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true, 
			data: JSON.stringify({
				isDone
				//等於寫成 isDone : isDone
			}), 
			success: function(data) {
				console.log(data);
				//var status = isDone == 'done' ? 'Yet' : 'Done';
				$this
					.text((isDone ? 'Done' : 'Yet')) //.text(status)
					.attr('data-status', (isDone ? 'done' : 'det'))
					.parents('.tasks')
					.removeClass('danger success')
					.addClass(`${isDone ? 'success' : 'danger'}`)
			}, 
			error: function(jqXHR) {
				console.dir(jqXHR);
			}
		});
	}
    //.find() : Return all <span> elements that are descendants of <ul>:
	function addTask(data) {
		console.dir(data);
		$list
			.find('tbody') 
			.append(//把新的task append上去
				`<tr id=${data.id} class="tasks danger">
					<td class="taskStatus">
						<button data-status="yet" type="button" class="btn btn-default btn-status">Yet</button>
					</td>
					<td class="taskName">
						${$('<textarea>').text(data.text).html()}
						<span class="glyphicon glyphicon-remove btn-del pull-right" aria-hidden="true"></span>
					</td>
				</tr>`
			);
	}

	function render(list) {
		$list.find('tbody').html('');//.html 代表要塞甚麼格式html進去 塞''代表空的(清空)
		list.forEach(function(val, i) {
			$list
				.find('tbody')
				.append(//放置tr在後面  ${} 是ex6的template string   舊:var 'abc' + val; 新:var b = `abc${val}`
					`<tr id=${val.id} class="tasks ${val.isDone ? 'success' : 'danger'}">
						<td class="taskStatus">
							<button data-status=${val.isDone ? 'done' : 'yet'} type="button" class="btn btn-default btn-status">${val.isDone ? 'Done' : 'Yet'}</button>
						</td>
						<td class="taskName">
							${$('<textarea>').text(val.text).html()}
							<span class="glyphicon glyphicon-remove btn-del pull-right" aria-hidden="true"></span>
						</td>
					</tr>`
				);
		});
	}

	//return init addTask render
	return {
		init, //init:init, 因為是同名可省略  回傳物件 把它public
		addTask, 
		render
	}
})();
//用小括弧把函數包起來，再在後面加小括弧，代表可以立即執行，在page load 時就會執行