'use strict';

(function () {
	if (!Array.prototype.filter) {
		Array.prototype.filter = function (func, thisArg) {
			// noinspection JSTypeOfValues
			if (!((typeof func === 'Function' || typeof func === 'function') && this))
				throw new TypeError();
			
			let len = this.length >>> 0,
				res = new Array(len),
				t = this, c = 0, i = -1;
			
			let kValue;
			if (thisArg === undefined) {
				while (++i !== len) {
					if (i in this) {
						kValue = t[i];
						if (func(t[i], i, t))
							res[c++] = kValue;
					}
				}
			} else {
				while (++i !== len) {
					if (i in this) {
						kValue = t[i];
						if (func.call(thisArg, t[i], i, t))
							res[c++] = kValue;
					}
				}
			}
			
			res.length = c;
			return res;
		};
	}
})();

(function () {
	
	class EricQuery {
		
		static MODE_SELECT = 0;
		static MODE_PUSH = 1;
		static MODE_STRIP = 2;
		
		constructor(eric) {
			this.eric = eric;
			this.mode = EricQuery.MODE_SELECT;
			this.classname = this.className;
		}
		
		get select() {
			this.mode = EricQuery.MODE_SELECT;
			return this;
		}
		
		get push() {
			this.mode = EricQuery.MODE_PUSH;
			return this;
		}
		
		get strip() {
			this.mode = EricQuery.MODE_STRIP;
			return this;
		}
		
		first(query) {
			this._submit([document.querySelector(query)]);
			return this.eric;
		}
		
		all(query) {
			this._submit(document.querySelectorAll(query));
			return this.eric;
		}
		
		id(query) {
			this._submit([document.getElementById(query)]);
			return this.eric;
		}
		
		className(query) {
			this._submit(document.getElementsByClassName(query));
			return this.eric;
		}
		
		_submit(selection) {
			selection = Array.from(selection).filter(elm => elm);
			if (this.mode === EricQuery.MODE_STRIP) {
				for (let i = 0; i < selection.length; i++) {
					const elm = selection[i],
						index = this.eric.elements.indexOf(elm);
					if (index > -1) {
						this.eric.elements.splice(index, 1);
					}
				}
			} else if (this.mode === EricQuery.MODE_PUSH) {
				this.eric.elements.push(...selection);
			} else {
				this.eric.elements = selection;
			}
		}
		
	}
	
	function Eric(arg) {
		
		if (!(this instanceof Eric)) {
			return new Eric(arg);
		}
		
		let _elements_ = [];
		let _raw_ = false;
		function unraw() { _raw_ = false; }
		
		Object.defineProperties(this, {
			elements: {
				get: function () {
					return _elements_;
				},
				set: function (v) {
					_elements_ = Array.from(v);
				}
			},
			length: {
				get: function () {
					return _elements_.length;
				}
			},
			query: {
				get: function () {
					return new EricQuery(this);
				}
			},
			raw: {
				get: function () {
					_raw_ = true;
					return this;
				},
				set: function (v) {
					_raw_ = Boolean(v);
				}
			}
		});
		
		function init(self) {
			if (arg instanceof Eric)
				return self.elements = arg.elements;
			
			if (typeof arg === "string")
				return self.query.all(arg);
			
			if (typeof arg === "object")
				return self.elements = arg;
			
			if (typeof arg === "function") {
				if (typeof document === "undefined") return undefined;
				else if (document.readyState === "complete") arg();
				else document.addEventListener("DOMContentLoaded", arg);
			}
		}
		
		init(this);
		
	}
	
	window.Eric = Eric;
	
}());
