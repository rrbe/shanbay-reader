;(function () {
	var searchBase = 'https://api.shanbay.com/bdc/search/?word=';

	function wrapSpan(ele) {
		for (var i=0; i<ele.length; i++) {
			var words = ele[i].innerHTML.split(' ');
			for (var j=0; j<words.length; j++) {
				if (words[j] != '') {
					words[j]= '<span class="words">'+ words[j] +'</span>';
				}
			}
			ele[i].innerHTML = words.join(' ');
		}
	}

	var h1Tag = document.querySelectorAll('h1');
	var fiTags = document.querySelectorAll('figure > figcaption');
	var pTags = document.querySelectorAll('p');
	var liTags = document.querySelectorAll('ul > li');
	var articleTag = document.querySelector('article');
	wrapSpan(h1Tag);
	wrapSpan(fiTags);
	wrapSpan(pTags);
	wrapSpan(liTags);

	article.addEventListener('click', function (e) {
		var event = e || window.event;
		var tar = event.target;
		var cliWords = document.querySelectorAll('.words');

		//达到点击下一个词，上一个选中颜色取消的效果
		for (var i=0; i<cliWords.length; i++) {
			cliWords[i].style.backgroundColor = '#ffffff';
		}
		tar.style.background = 'rgba(75,198,223,0.4)';

		makeHttpRequest('get', searchBase + tar.innerHTML, null,
			function (res) {
				if (res.status_code == 0) {
					var _bubble = bubbleBox(tar, res.data);
					_bubble();
				}
			});
	}, false);

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

	var speakerImg = singleton(function (prop) {
		var img = document.createElement('img');
		img.src = chrome.extension.getURL('static/speaker.png');
		img.id = 'mySpeaker';
		img.appendChild(pron( prop ));

		return img;
	});

	var pron = singleton(function (prop) {
		var pronunciation = document.createElement('audio');
		pronunciation.id = 'myAudio';

		return pronunciation;
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

		//此时speaker已经被创建
		speakerCtrl(document.getElementById('mySpeaker'), bub);
	}

	function bubbleDirectionInit (ele, bub, msg) {
		//初始化位置用arrow in bottom的默认位置，看是否越界或被遮盖
		bub.setAttribute('class', '');
		bub.classList.adds('bubble bubble-bottom');
		var _speaker = speakerImg();
		bub.innerHTML = msg.definition;
		_speaker.childNodes[0].src = msg.audio;
		ele.parentNode.insertBefore(bub, ele);
		ele.parentNode.insertBefore(_speaker, bub);
		bub.style.top = (ele.offsetTop - bub.offsetHeight - 30) + 'px';
		bub.style.left = (ele.offsetLeft - Math.floor(bub.offsetWidth/2)) + 'px';
	}

	function speakerCtrl (spker, bub) {
		spker.style.position = 'absolute';
		spker.style.zIndex = 999;
		spker.style.top = (bub.offsetTop + 10) + 'px';
		spker.style.left = (bub.offsetLeft + 10) + 'px';

		spker.addEventListener('click', function () {
			document.getElementById('myAudio').play();
		});
	}
})();