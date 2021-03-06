var manifest = ['0001', '0002'];

function Blog(postIds, container) {
	this.postIds = postIds;
	this.container = document.querySelector(container);
	this.gatherTemplates();
}

Blog.prototype.gatherTemplates = function () {
	var tmp = this.container.querySelectorAll('.template');
	this.templates = {};
	for (var i = 0; i < tmp.length; ++i) {
		var t = tmp[i];
		t.classList.remove('template');
		this.templates[t.getAttribute('class')] = t.cloneNode(true);
		t.parentNode.removeChild(t);
	}
}

Blog.prototype.render = function () {
	var _this = this;
	this.postVisualizations = this.postIds.map(function(id) {
		var post = _this.templates['item'].cloneNode(true);
		_this.container.insertBefore(post, _this.container.firstChild);

		var canvas = post.querySelector('canvas');
		canvas.setAttribute('id', id);
		var vis = new window['sketch_' + id]();
		post.querySelector('h1').innerHTML = vis.meta.title;
		post.querySelector('h2').innerHTML = vis.meta.displayDate;

		return vis;
	});

	console.log(this.postVisualizations);

	this.logItemHeight();
}

Blog.prototype.logItemHeight = function () {
	var el = this.container.querySelector('.item');
	var baseHeight = el.offsetHeight;
	var styles = window.getComputedStyle(el);
	var top = parseFloat(styles['marginTop']);
	var bottom = parseFloat(styles['marginBottom']);

	this.itemHeight = baseHeight + top + bottom;
}

Blog.prototype.frame = function () {
	var index = (this.postVisualizations.length -1) - Math.round(document.body.scrollTop / this.itemHeight);
	this.postVisualizations[index].frame();
	window.requestAnimationFrame(this.frame.bind(this));
}

var b = new Blog(manifest, '.bloggle');
b.render();
b.frame();