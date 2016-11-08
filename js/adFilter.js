;(function () {
	//从页面的主体article标签起，从head到content，从外到里，逐层处理广告过滤
	var docEle = document.body;
	var article = document.getElementById('article');
	article.removeOthers(docEle);

	var h1tag = document.getElementsByTagName('h1')[0];
	h1tag.removeSiblings();

	var content_head = document.getElementsByClassName('content__main-column--article')[0];
	content_head.removeSiblings();

	var content_meta_ad = document.getElementsByClassName('content__meta-container')[0];
	content_meta_ad.remove();

	var aside_ad = document.getElementsByTagName('aside');
	for (var i=0; i<aside_ad.length; i++) {
		aside_ad[i].remove();
	}

	var sub_meta = document.getElementsByClassName('submeta')[0];
	sub_meta.remove();
})();