;(function () {
	//分页原理：利用修改top属性达到移动页面的效果。同时禁止屏幕scroll。

	document.documentElement.style.overflow = 'hidden';
	document.body.style.overflow = 'hidden';
	// document.body.bind('touchmove', function (e) {
	// 	e.preventDefault()
	// });

	var viewHeight = getViewPort().height;
	var totalHeight = document.body.clientHeight; //用在广告过滤后
	var pageNum = Math.ceil(totalHeight / viewHeight);
	var head = document.getElementsByTagName('header')[0];
	var content = document.getElementsByClassName('content__main')[0];
	//要使修改top属性生效，设为relative
	head.style['position'] = 'relative';
	content.style['position'] = 'relative';

	function getPagenation () {
		var wrapDiv = document.createElement('div');
		var fragment = document.createDocumentFragment();
		var wrapUl = document.createElement('ul');
		var li = null;
		for (var i=0; i<pageNum; i++) {
			li = document.createElement('li');
			li.innerHTML = i + 1;
			fragment.appendChild(li);
		}
		wrapUl.appendChild(fragment);
		wrapDiv.appendChild(wrapUl);
		wrapDiv.classList.add('page');
		document.body.appendChild(wrapDiv);

		wrapUl.addEventListener('click', function (e) {
			var eve = e || window.event;
			var tar = eve.target;
			getSliced(tar.innerHTML);
		}, false);
	}

	function getSliced(index) {
		var indx = parseInt(index) - 1;
		if (indx !== 0) {
			head.style['top'] = '-' + viewHeight + 'px';
			content.style['top'] = '-' + indx * viewHeight + 'px';
		} else {
			head.style['top'] = 0 + 'px';
			content.style['top'] = 0 +'px';
		}
	}

	function getViewPort () {
		return {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight
		}
	}

	getPagenation();
})();