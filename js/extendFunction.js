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