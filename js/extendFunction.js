Element.prototype.remove = function () {
	this.parentNode.removeChild(this);
}

Element.prototype.siblings = function () {
	var ret = document.createElement('div');
	var childrenList = this.parentNode.children;

	for (var k=0; k<childrenList.length; k++) {
		if (childrenList[k].nodeType === 1 && childrenList[k] !== this) {
			ret.appendChild(childrenList[k]);
		}
	}

	return ret.childNodes;
}

Element.prototype.removeSiblings = function () {
	var parent = this.parentNode;
	//不用之前的remove，因为dom操作太多
	while(parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
	parent.appendChild(this);
}

Element.prototype.removeOthers = function (parent) {
	//保存this引用
	var that = this.cloneNode(true);

	while(parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
	parent.appendChild(that);
}

//扩展classList方法，一次可以添加多个类名,classList本质上是DOMTokenList
DOMTokenList.prototype.adds = function (str) {
	str.split(' ').forEach(function (s) {
		this.add(s);
	}.bind(this));

	return this;
}

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