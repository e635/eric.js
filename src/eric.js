const Eric = (function () {
	
	if (!Array.prototype.filter) {
		Array.prototype.filter = function (func, thisArg) {
			'use strict';
			
			// noinspection JSTypeOfValues
			if (!((typeof func === 'Function' || typeof func === 'function') && this))
				throw new TypeError();
			
			let len = this.length >>> 0,
				res = new Array(len),
				t = this, c = 0, i = -1;
			
			let kValue;
			if (thisArg === undefined) {
				while (++i !== len)
					if (i in this) {
						kValue = t[i];
						if (func(t[i], i, t))
							res[c++] = kValue;
					}
			} else {
				while (++i !== len)
					if (i in this) {
						kValue = t[i];
						if (func.call(thisArg, t[i], i, t))
							res[c++] = kValue;
					}
			}
			
			res.length = c;
			return res;
		};
	}
	
	if (!Text.prototype.innerText) {
		Object.defineProperty(Text.prototype, 'innerText', {
			get: function innerText() {
				return this.textContent;
			},
			set: function innerText(value) {
				this.textContent = value;
			}
		});
	}
	
	if (!String.prototype.replaceBetween) {
		String.prototype.replaceBetween = function(start, end, replacement) {
			return this.substr(0, start) + replacement + this.substr(end);
		};
	}
	
	'use strict';
	
	let Eric = function (query = null) {
		
		if (!(this instanceof Eric)) {
			return new Eric(query);
		}
		
		this.elements = [];
		
		Object.defineProperty(this, 'length', {
			enumerable: true,
			configurable: false,
			get: function length() {
				return this.elements.length;
			},
			set: function length(value) {
				throw new SyntaxError('eric.length cannot be overridden.')
			}
		});
		
		this.init = function (query) {
			
			if (query instanceof Eric)
				return this.set(query.elements);
			
			if (typeof query === "string")
				return this.select(query);
			
			if (typeof query === "object")
				return this.set(query);
			
			if (typeof query === "function")
				if (typeof document === 'undefined') return undefined;
				else if (document.readyState !== "loading") query();
				else document.addEventListener("DOMContentLoaded", query);
			
		};
		
		this.query = function (query) {
			let self = this,
				selection = null,
				options = {
					select() {
						self.set(selection);
						return self;
					},
					push() {
						self.push(selection);
						return self;
					},
					unshift() {
						self.unshift(selection);
						return self;
					}
				};
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
			this.elements = this.listElements(elements);
			return this;
		};
		
		this.select = function (query) {
			return this.query(query).all().select();
		};
		
		this.push = function (query) {
			if (typeof query === "string")
				return this.query(query).all().push();
			this.elements = this.elements.concat(this.listElements(query));
			return this;
		};
		
		this.pop = function (getNode = false, empty = true) {
			let node = this.elements.pop();
			if (node === undefined)
				return empty ? (getNode ? this.emptyNode : Eric)() : undefined;
			return getNode ? node : Eric(node);
		};
		
		this.unshift = function (query) {
			if (typeof query === "string")
				this.elements = Eric().query(query).all().select().elements.concat(this.elements);
			else
				this.elements = this.listElements(query).concat(this.elements);
			return this;
		};
		
		this.shift = function (getNode = false, empty = true) {
			let node = this.elements.shift();
			if (node === undefined)
				return empty ? (getNode ? this.emptyNode : Eric)() : undefined;
			return getNode ? node : Eric(node);
		};
		
		this.get = function (n, getNode = false, empty = true) {
			if (this.elements.hasOwnProperty(n))
				return getNode ? this.elements[n] : Eric(this.elements[n]);
			return empty ? (getNode ? this.emptyNode : Eric)() : undefined;
		};
		
		this.first = function (getNode = false, empty = true) {
			return this.get(0, getNode, empty);
		};
		
		this.last = function (getNode = false, empty = true) {
			return this.get(this.elements.length - 1, getNode, empty);
		};
		
		this.each = function (callback, thisArg = undefined) {
			Eric.forEach(this.elements, callback, thisArg);
			return this;
		};
		
		this.find = function (query) {
			let found = [];
			this.each((elm) => {
				let inner = elm.querySelectorAll(query);
				inner = Array.prototype.slice.call(inner);
				found = found.concat(inner);
			});
			return Eric(found);
		};
		
		this.bind = function (event, callback, whileCapture = false) {
			return this.each(function (elm) {
				elm.addEventListener(event, callback, whileCapture);
			});
		};
		
		this.trigger = function (event) {
			event = event instanceof Event ? event : new Event(event.toString());
			this.each(elm => elm.dispatchEvent(event));
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
				
				any() {
					let found = false;
					self.each((elm) => {
						if (e(elm).class(classnames).has())
							return found = true;
					});
					return found;
				}
			}
		};
		
		this.attr = function (key, value = null) {
			if (typeof key !== "string") return null;
			
			if (value === null)
				return this.first(true).getAttribute(key);
			
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
				return this.first(true).innerText;
			return this.each(function (elm) {
				elm.textContent = value;
			});
		};
		
		this.getTextContent = function () {
			return this.first(true).textContent;
		};
		
		this.html = function (value = null) {
			if (value === null)
				return this.first(true).innerHTML;
			return this.each(function (elm) {
				elm.innerHTML = value;
			});
		};
		
		this.val = function (value = null) {
			return this.attr('value', value);
		};
		
		this.create = function (tag, options = {}) {
			let elm = document.createElement(tag);
			if (options)
				this.mix(elm, options);
			if (options.attributes)
				for (const key in options.attributes)
					if (options.attributes.hasOwnProperty(key))
						elm.setAttribute(key, options.attributes[key]);
			if (options.prepend)
				this.unshift(elm);
			else
				this.push(elm);
			return this;
		};
		
		this.attach = function (parent, cloneAttach = false) {
			if (!parent instanceof Eric)
				parent = Eric(parent);
			if (cloneAttach) {
				this.each((elm) => {
					parent.each((p) => {
						p.appendChild(elm.cloneNode(true));
					}, this);
				}, this);
			} else {
				let p = parent.first(true);
				this.each((elm) => {
					p.appendChild(elm);
				});
			}
			return this;
		};
		
		this.append = function (elements, cloneAppend = false) {
			if (!elements instanceof Eric)
				elements = Eric(elements);
			if (cloneAppend) {
				this.each((p) => {
					elements.each((elm) => {
						p.appendChild(elm.cloneNode(true));
					}, this);
				});
			} else {
				let p = this.first(true);
				elements.each((elm) => {
					p.appendChild(elm);
				});
			}
			return this;
		};
		
		this.parents = function (getNodes = false) {
			let parents = [];
			this.each((elm) => {
				if (elm.parentElement)
					parents.push(elm.parentElement);
			});
			return getNodes ? parents : Eric(parents);
		}
		
		this.remove = function (retain = false) {
			this.each((elm) => {
				if (!elm)
					throw new TypeError(elm + ' does not exist.');
				
				let removable = !!elm.remove,
					hasParent = !!elm.parentNode;
				
				if (!removable && !hasParent)
					throw new TypeError(elm + ' cannot be removed.');
				
				if (removable && (retain || !hasParent))
					elm.remove();
				else
					elm.parentNode.removeChild(elm);
			});
			if (!retain) this.elements = [];
			return this;
		};
		
		this.empty = function (textContentMode = true, retainText = false) {
			if (retainText)
				this.each((elm) => {
					while (elm.lastElementChild)
						elm.removeChild(elm.lastElementChild);
				});
			else
				if (textContentMode)
					this.each(elm => elm.textContent = '');
				else
					this.each(elm => elm.innerHTML = '');
			return this;
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
	
	Eric.prototype.forEach = function (elements, callback, thisArg = undefined) {
		if (Array.prototype.forEach)
		 	return Array.prototype.forEach.call(elements, callback, thisArg);
		
		if (typeof callback !== "function")
			throw new TypeError(callback + ' is not a function');
		
		let T, k, O = Object(elements), len = O.length >>> 0;
		
		if (arguments.length > 2) T = thisArg;
		
		k = 0;
		while (k < len) if (k in O) callback.call(T, O[k], k, O) || k++;
	};
	
	Eric.prototype.isNode = function (o) {
		return (
			(typeof Node === "object") ? (o instanceof Node) :
				o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string"
		);
	};
	
	Eric.prototype.isElement = function (o, prototype = Element) {
		return (
			(typeof prototype === "object") ? (o instanceof prototype) :
				o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName === "string"
		);
	};
	
	Eric.prototype.isHTMLElement = function (o) {
		return Eric.prototype.isElement(o, HTMLElement);
	};
	
	Eric.prototype.mix = function (controller, mix) {
		for (let i in mix)
			if (mix.hasOwnProperty(i))
				controller[i] = mix[i];
	};
	
	Eric.prototype.listElements = function (elements = []) {
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
	
	Eric.prototype.emptyNode = function () {
		return document.createTextNode('');
	};
	
	Eric.prototype.create = function (tag, options = {}) {
		return Eric().create(tag, options);
	};
	
	let ericonf = {
		__proto__: {
			windowIndex: 'e'
		},
		get windowIndex() {
			return this.__proto__.windowIndex;
		},
		set windowIndex(val) {
			this.__proto__.windowIndex = val;
			if (typeof window !== 'undefined' && !window.hasOwnProperty(val))
				window[val.toString()] = Eric;
		},
	};
	
	Object.defineProperty(Eric, 'config', {
		get: function config() {
			return ericonf;
		},
		set: function config(value) {
			Eric.mix(ericonf, value);
		}
	});
	
	Object.defineProperty(Eric, 'vw', {
		get: function vw() {
			return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
		}
	});
	
	Object.defineProperty(Eric, 'vh', {
		get: function vh() {
			return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
		}
	});
	
	Eric.__proto__ = Eric.prototype;
	
	return Eric;
	
})();

Eric(() => {
	if (typeof window !== 'undefined')
		window[Eric.config.windowIndex] = Eric;
});

if (typeof module !== 'undefined')
	module.exports = Eric;
