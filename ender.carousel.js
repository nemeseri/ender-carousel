(function ($) {

	// from valentine
	var is = {
		fun: function (f) {
			return typeof f === 'function';
		},
		arr: function (ar) {
			return ar instanceof Array;
		},
		obj: function (o) {
			return o instanceof Object && !is.fun(o) && !is.arr(o);
		}
	};

	function extend() {
		// based on jQuery deep merge
		var options, name, src, copy, clone,
			target = arguments[0], i = 1, length = arguments.length;

		for (; i < length; i += 1) {
			if ((options = arguments[i]) !== null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];
					if (target === copy) {
						continue;
					}
					if (copy && (is.obj(copy))) {
						clone = src && is.obj(src) ? src : {};
						target[name] = extend(clone, copy);
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}
		return target;
	}

	function clone(obj) {
		if (null === obj || "object" !== typeof obj) {
			return obj;
		}
		var copy = obj.constructor(),
			attr;
		for (attr in obj) {
			if (obj.hasOwnProperty(attr)) {
				copy[attr] = obj[attr];
			}
		}
		return copy;
	}

	/*
		Masking jQuery and Morpheus differences
	*/
	function animate(el, animationSettins) {
		if (window.ender) {
			// use morpheus
			el.animate(animationSettins);
		} else {
			// convert animation properties
			var duration = animationSettins.duration,
				easing = animationSettins.easing,
				onComplete = animationSettins.complete;

			el.animate(animationSettins, duration, easing, onComplete);
		}
	}

	// from jquery
	function proxy(fn, context) {
		var slice = Array.prototype.slice,
			args = slice.call(arguments, 2);
		return function () {
			return fn.apply(context, args.concat(slice.call(arguments)));
		};
	}

	/*
		Carousel Constructor
	*/
	function Carousel(el, options) {
		this.init(el, options);

		// only return the API
		// instead of this
		return {
			getPageSize: proxy(this.getPageSize, this),
			getCursor: proxy(this.getCursor, this),
			nextPage: proxy(this.nextPage, this),
			prevPage: proxy(this.prevPage, this),
			isVisibleItem: proxy(this.isVisibleItem, this),
			scrollToItem: proxy(this.scrollToItem, this),
			getOptions: proxy(this.getOptions, this),
			setOptions: proxy(this.setOptions, this)
		};
	}

	Carousel.prototype = {
		init: function (el, options) {
			var $secondItem;

			this.options = {
				window: ".window",
				items: "li",
				nextPager: "a.next",
				prevPager: "a.prev",
				duration: 400,
				keyboard: false,
				extraOffset: 0
			};
			this.setOptions(options);

			this.$el = $(el);
			this.$window = this.$el.find(
				this.options.window
			);
			this.$itemWrapper = this.$window.children().first();
			this.$items = this.$el.find(
				this.options.items
			);
			this.$nextPager = this.$el.find(
				this.options.nextPager
			);
			this.$prevPager = this.$el.find(
				this.options.prevPager
			);

			$secondItem = this.$items.first().next();
			this.itemMargin = parseInt($secondItem.css("margin-left"), 10) +
				parseInt($secondItem.css("margin-right"), 10);
			this.itemWidth = $secondItem.width() + this.itemMargin;

			this.windowWidth = this.$window.width();
			this.pageSize = Math.floor((this.windowWidth + this.itemMargin) / this.itemWidth);
			this.pageWidth = this.pageSize * this.itemWidth;
			this.lastPosition = this.$items.length - this.pageSize;

			if (this.$items.length <= this.pageSize) {
				this.hidePrevPager();
				this.hideNextPager();
				return;
			}

			this.cursor = this.getActiveIndex();
			if (this.cursor < 0) {
				this.$items.first().addClass("active");
				this.cursor = 0;
			}

			if (this.cursor > this.lastPosition) {
				this.cursor = this.lastPosition;
			}

			if (this.cursor > 0) {
				this.scrollToItem(this.cursor, true);
			}

			if (this.cursor === 0) {
				this.hidePrevPager();
			}

			if (this.cursor >= this.lastPosition) {
				this.hideNextPager();
			}

			this.$nextPager.click(proxy(this.nextPage, this));
			this.$prevPager.click(proxy(this.prevPage, this));

			if (this.options.keyboard) {
				$(document).bind("keyup", proxy(this.onKeyUp, this));
			}

			this.$el.addClass("carousel-inited");
		},

		nextPage: function (e) {
			if (typeof(e) !== "undefined") {
				e.preventDefault();
			}

			if (this.cursor >= this.lastPosition) {
				return;
			}

			var itemIdx = this.cursor + this.pageSize;
			if (itemIdx > this.lastPosition) {
				itemIdx = this.lastPosition;
			}

			this.scrollToItem(itemIdx);
		},

		prevPage: function (e) {
			if (typeof(e) !== "undefined") {
				e.preventDefault();
			}

			if (this.cursor === 0) {
				return;
			}

			var itemIdx = this.cursor - this.pageSize;
			if (itemIdx < 0) {
				itemIdx = 0;
			}

			this.scrollToItem(itemIdx);
		},

		nextItem: function () {
			if (this.cursor >= this.lastPosition) {
				return;
			}

			this.scrollToItem(this.cursor + 1);
		},

		prevItem: function () {
			if (this.cursor === 0) {
				return;
			}
			this.scrollToItem(this.cursor - 1);
		},

		scrollToItem: function (idx, doNotAnimate) {
			var animateTo,
				scrollTo;

			this.cursor = idx;

			if (this.cursor === 0) {
				this.hidePrevPager();
			} else {
				this.showPrevPager();
			}

			if (this.cursor >= this.lastPosition) {
				this.hideNextPager();
			} else {
				this.showNextPager();
			}

			scrollTo = this.cursor * this.itemWidth;
			if (this.cursor === this.lastPosition) {
				scrollTo = scrollTo - (this.windowWidth - this.pageWidth + this.itemMargin) +
					this.options.extraOffset;
			}

			scrollTo *= -1;
			if (doNotAnimate) {
				this.$itemWrapper.css({
					left: scrollTo
				});
			} else {
				animate(this.$itemWrapper, {
					left: scrollTo,
					duration: this.options.duration
				});
			}
		},

		onKeyUp: function (e) {
			if (e.keyCode === 39) {
				this.nextPage();
			} else if (e.keyCode === 37) {
				this.prevPage();
			}
		},

		getActiveIndex: function () {
			var i = 0,
				il = this.$items.length;

			for (; i < il; i += 1) {
				if ($(this.$items.get(i)).hasClass("active")) {
					return i;
				}
			}

			return -1;
		},

		hideNextPager: function () {
			this.$nextPager.css({
				display: "none"
			});
		},

		hidePrevPager: function () {
			this.$prevPager.css({
				display: "none"
			});
		},

		showNextPager: function () {
			this.$nextPager.css({
				display: ""
			});
		},

		showPrevPager: function () {
			this.$prevPager.css({
				display: ""
			});
		},

		getPageSize: function () {
			return this.pageSize;
		},

		getCursor: function () {
			return this.cursor;
		},

		isVisibleItem: function (idx) {
			if (this.cursor + this.pageSize <= idx || this.cursor > idx) {
				return false;
			}
			return true;
		},

		getOptions: function () {
			return this.options;
		},

		setOptions: function (options) {
			extend(this.options, options || {});
		}
	};

	$.fn.carousel = function (options) {
		return new Carousel(this.first(), options);
	};
}(window.ender || window.jQuery));