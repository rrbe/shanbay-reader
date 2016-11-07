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

//ele: 气泡框应该贴近的元素  msg: 气泡框上显示的消息
function bubbleBox(ele, msg) {
	this.element = ele;
	this.message = msg;
	return function show() {
		var _bub = bubble();
		bubblePosCtrl(this.element, _bub, this.message);
	}
}

function getElementViewLeft(ele) {
	var actualLeft = ele.offsetLeft;
	var current = ele.offsetParent;

	while (current !== null) {
		actualLeft += current.offsetLeft;
		current = current.offsetParent;
	}
	var elementScrollLeft = document.documentElement.scrollLeft;

	return actualLeft - elementScrollLeft;
}

function getElementViewTop (ele) {
	var actualTop = ele.offsetTop;
	var current = ele.offsetParent;

	while(current !== null) {
		actualTop += current.offsetTop;
		current = current.offsetParent;
	}
	var elementScrollTop = document.documentElement.scrollTop;

	return actualTop - elementScrollTop;
}

//扩展classList方法，一次可以添加多个类名,classList本质上是DOMTokenList
DOMTokenList.prototype.adds = function (str) {
	str.split(' ').forEach(function (s) {
		console.log(this);
		this.add(s);
	}.bind(this));

	return this;
}

//控制气泡位置
function bubblePosCtrl (ele, bub, msg) {
	
	bubbleDirectionInit(ele, bub, msg);

	var top = getElementViewTop(bub);
	var left = getElementViewLeft(bub);
	var right = document.documentElement.clientWidth - left - bub.clientWidth;

	if (left < 0) {
		//arrow in left
		bub.setAttribute('class', '');
		bub.classList.adds('bubble bubble-left');
		bub.style.left = (getElementViewLeft(ele) + ele.offsetWidth + 30) + 'px';
		bub.style.top = (getElementViewTop(ele)) + 'px';
	} else if (right < 0) {
		//arrow in right
		bub.setAttribute('class', '');
		bub.classList.adds('bubble bubble-right');
		bub.style.left = (getElementViewLeft(ele) - bub.offsetWidth - 30) + 'px';
		bub.style.top = (getElementViewTop(ele)) + 'px';
	} else if (top < 0) {
		//arrow in top
		bub.setAttribute('class', '');
		bub.classList.adds('bubble bubble-top');
		bub.style.top = (getElementViewTop(ele) + 60) + 'px';
		bub.style.left = (getElementViewLeft(ele) - Math.floor(bub.offsetWidth/2)) + 'px';
	} else {
		//arrow in bottom	
	}
}

function bubbleDirectionInit (ele, bub, msg) {
	//初始化位置用arrow in bottom的默认位置，看是否越界或被遮盖
	bub.setAttribute('class', '');
	bub.classList.adds('bubble bubble-bottom');
	bub.innerHTML = message;
	element.parentNode.insertBefore(bub, ele);
	bub.style.top = (ele.offsetTop - bub.offsetHeight - 30) + 'px';
	bub.style.left = (ele.offsetLeft - Math.floor(bub.offsetWidth/2)) + 'px';
}