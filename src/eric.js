const Eric = (function () {
	
	if (!Array.prototype.filter) {
		Array.prototype.filter = function(func, thisArg) {
			'use strict';
			
			// noinspection JSTypeOfValues
			if (!((typeof func === 'Function' || typeof func === 'function') && this) )
				throw new TypeError();

			let len = this.length >>> 0,
				res = new Array(len),
				t = this, c = 0, i = -1;

			let kValue;
			if (thisArg === undefined)
				while (++i !== len)
					if (i in this) {
						kValue = t[i];
						if (func(t[i], i, t))
							res[c++] = kValue;
					}
			else
				while (++i !== len)
					if (i in this) {
						kValue = t[i];
						if (func.call(thisArg, t[i], i, t))
							res[c++] = kValue;
					}
			
			res.length = c;
			return res;
		};
	}
	
    'use strict';
    
	let Eric = function (query = null) {
		
		if (!(this instanceof Eric)) {
			return new Eric(query);
		}
		
		this.elements = [];
		
		this.init = function (query) {
			
			if (query instanceof Eric)
				return this.set(query.elements);
			
			if (typeof query === "string")
				return this.select(query);
			
			if (typeof query === "object")
				return this.set(query);
			
			if (typeof query === "function")
				document.addEventListener("DOMContentLoaded", query);
			
		};
		
		this.first = function (nullable = true) {
			if (this.elements.hasOwnProperty(0))
				return this.elements[0];
			return nullable ? null : document.createTextNode('');
		};
		
		this.last = function (nullable = true) {
			if (this.elements.hasOwnProperty(this.elements.length - 1))
				return this.elements[this.elements.length - 1];
			return nullable ? null : document.createTextNode('');
		};
		
		this.query = function (query) {
			let self = this,
				selection = null,
				options = {
					select() {
						self.set(selection);
						return self;
					},
					append() {
						self.append(selection);
						return self;
					}
				};
			options.selection = selection;
			return {
				first() {
					selection = document.querySelector(query);
					return options;
				},
				all() {
					selection = document.querySelectorAll(query);
					return options;
				},
				id() {
					selection = document.getElementById(query);
					return options;
				},
				classname() {
					selection = document.getElementsByClassName(query);
					return options;
				}
			}
		};
		
		this.set = function (elements) {
			this.elements = this.createList(elements);
			return this;
		};
		
		this.append = function (query) {
			if (typeof query === "string")
				return this.query(query).all().append();
			this.elements = this.elements.concat(this.createList(query));
			return this;
		};
		
		this.select = function (query) {
			return this.query(query).all().select();
		};
		
		this.each = function(callback) {
			Eric.forEach(this.elements, callback);
			return this;
		};
		
		this.find = function (query) {
			let found = [];
			this.each((elm) => {
				let inner = elm.querySelectorAll(query);
				inner = Array.prototype.slice.call(inner);
				found = found.concat(inner);
			});
			return this.set(found);
		};
		
		this.on = function(event, callback, whileCapture = false) {
			return this.each(function (elm) {
				elm.addEventListener(event, callback, whileCapture);
			});
		};
		
		this.class = function (classnames) {
			let self = this;
			return {
				
				add(returnClass = false) {
					self.each(function (elm) {
						elm.classList.add(classnames);
					});
					return returnClass ? this : self;
				},
				
				remove(returnClass = false) {
					self.each((elm) => {
						elm.classList.remove(classnames);
					});
					return returnClass ? this : self;
				},
				
				toggle(returnClass = false) {
					self.each(function (elm) {
						if (elm.classList.contains(classnames))
							elm.classList.remove(classnames);
						else
							elm.classList.add(classnames);
					});
					return returnClass ? this : self;
				},
				
				unify(returnClass = false) {
					if (this.has()) this.add();
					else this.remove();
					return returnClass ? this : self;
				},
				
				has() {
					return self.elements[0].classList.contains(classnames);
				},
				
				have() {
					let contain = true;
					self.each((elm) => {
						if (!elm.classList.contains(classnames))
							return contain = false;
					});
					return contain;
				},
				
				somewhere() {
					let found = false;
					self.each((elm) => {
						if (e(elm).class(classnames).has())
							return found = true;
					});
					return found;
				}
			}
		};
		
		this.attr = function(key, value = null) {
			
			if (typeof key !== "string")
				return null;
			
			if (value === null)
				return this.first(false).getAttribute(key);
			
			if (value === false) {
				return this.each((elm) => {
					elm.removeAttribute(key);
				});
			}
			
			this.each((elm) => {
				elm.setAttribute(key, value);
			});
			
			return this;
			
		};
		
		this.data = function (key, value = null) {
			if (typeof key !== "string")
				return null;
			let name = 'data-' + key;
			return this.attr(name, value);
		};
		
		this.text = function (value = null) {
			
			if (value === null)
				return this.first(false).innerText;
			
			return this.each(function (elm) {
				elm.innerText = value;
			});
			
		};
		
		this.html = function (value = null) {
			
			if (value === null)
				return this.first(false).innerHTML;
			
			return this.each(function (elm) {
				elm.innerHTML = value;
			});
		};
		
		this.val = function (value = null) {
			return this.attr('value', value);
		};
		
		this.focus = function () {
			let that = this.first();
			that.focus();
			setTimeout(function () {
				that.selectionStart = that.selectionEnd = 100000;
			}, 0);
			return this;
		};
		
		this.init(query);
	};
	
	Eric.prototype.forEach = function(elements, callback) {
		Array.prototype.forEach.call(elements, callback);
	};
	
	Eric.prototype.isNode = function(o) {
		return (
			(typeof Node === "object") ? (o instanceof Node) :
				o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string"
		);
	};
	
	Eric.prototype.isElement = function(o) {
		return (
			(typeof Element === "object") ? (o instanceof Element) :
				o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName === "string"
		);
	};
	
	Eric.prototype.isHTMLElement = function(o) {
		return (
			(typeof HTMLElement === "object") ? (o instanceof HTMLElement) :
				o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName === "string"
		);
	};
	
	Eric.prototype.mix = function(controller, mix) {
		for (let i in mix)
			if (mix.hasOwnProperty(i))
				controller[i] = mix[i];
	};
	
	Eric.prototype.createList = function(elements = []) {
		let self = this, list;
		
		if (HTMLCollection.prototype.isPrototypeOf(elements)
			|| NodeList.prototype.isPrototypeOf(elements)
			|| Array.isArray(elements))
			list = Array.from(elements);
		else
			list = [elements];
		
		return list.filter(function (value) {
			return self.isNode(value);
		});
	};
	
	Eric.__proto__ = Eric.prototype;
    
    return Eric;
	
})();

if (typeof module !== 'undefined')
	module.exports = Eric;

if (typeof window !== 'undefined')
	window.e = Eric;
