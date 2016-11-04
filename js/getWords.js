//因为过滤广告后只有标题，正文和配图，所以页面上的单词就是标题和正文的单词，暂时先这么处理
function wrapSpan() {
	var paragrah = document.querySelectorAll('p');
	for (var i=0; i<paragrah.length; i++) {
		var words = paragrah[i].innerHTML.split(' ');
		for (var j=0; j<words.length; j++) {
			if (words[j] != '') {
				words[j]= '<span class="words">'+ words[j] +'</span>';
			}
		}
		paragrah[i].innerHTML = words.join(' ');
	}
	var article = document.querySelector('.content_article-body');
	article.addEventListener('click', function (e) {
		var event = e || window.event;
		//达到点击下一个词，上一个选中颜色取消的效果
		var cliWords = document.querySelectorAll('.words');
		for (var i=0; i<cliWords.length; i++) {
			cliWords[i].style.backgroundColor = '#ffffff';
		}
		event.target.style.backgroundColor = '#66cc99';

		var searchLink = 'https://api.shanbay.com/bdc/search/?word=' + event.target.innerHTML;
		makeHttpRequest('get', searchLink,
			null, function (res) {
				if (res.status_code == 0) {
					console.log(res.msg);
					//测试api
					console.log(res.data.definition.trim());
				}
			});
		event.stopPropagation();
	}, false);
}
wrapSpan();

//封装ajax请求
function makeHttpRequest(method, url, data, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			callback(JSON.parse(xhr.responseText));
		}
	}
	xhr.onerror = function () {
		console.log('something wrong!');
	}
	xhr.open(method, url ,true);
	xhr.send(data);
}