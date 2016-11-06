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
		var tar = event.target;
		tar.style.backgroundColor = '#66cc99';

		var searchLink = 'https://api.shanbay.com/bdc/search/?word=' + tar.innerHTML;
		makeHttpRequest('get', searchLink,
			null, function (res) {
				if (res.status_code == 0) {
					// console.log(res.msg);
					// //测试api
					// console.log(res.data.definition.trim());
					var _bubble = bubbleBox(tar, res.data.definition.trim());
					_bubble();
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

//单例模式, 可用于气泡弹出框
var singleton = function(fn){
    var result;
    return function(){
        return result || (result = fn.apply(this, arguments));
    }
}
var bubble = singleton(function () {
	return document.createElement('span');
});

//element: 气泡框应该贴近的元素  message: 气泡框上显示的消息
function bubbleBox(element, message) {
	this.element = element;
	this.message = message;
	return function show() {
		var bub = bubble();
		//处理前后左右
		bub.classList.adds('bubble bubble-bottom');
		this.element.parentNode.insertBefore(bub, this.element);
		//气泡的位置：指示元素的高度 - 气泡元素自身高度 - 30箭头高度
		bub.style.top = (getElementTop(this.element) - bub.clientHeight - 30) + 'px';
		bub.style.left = (getElementLeft(this.element) - Math.floor(bub.clientWidth/2)) + 'px';
	}
}

function getElementLeft(element) {
	var actualLeft = element.offsetLeft;
	var current = element.offsetParent;

	while (current !== null) {
		actualLeft += current.offsetLeft;
		current = current.offsetParent;
	}

	return actualLeft;
}

function getElementTop (element) {
	var actualTop = element.offsetTop;
	var current = element.offsetParent;

	while(current !== null) {
		actualTop += current.offsetTop;
		current = current.offsetParent;
	}

	return actualTop;
}

//扩展classList方法，一次可以添加多个类名,classList本质上是DOMTokenList
DOMTokenList.prototype.adds = function (str) {
	str.split(' ').forEach(function (s) {
		this.add(s);
	}.bind(this));

	return this;
}