# eric.js

`eric.js` is a fast and tiny DOM navigation and manipulation library.

Many similar libraries add so many features, that they have become bloated and slow, creating noticable data traffic for your servers and your users.

`eric.js` aims to replace the most utilised features of jQuery and is of similar usage.

This library is by far not extensive yet, but the most necessary features are already implemented and ready to be used.

We will update this package as required by your suggestions and our own use cases.

## Using `eric` instances

### `e(query)`

> Instantiate an `eric` object.

`query` is either of type `string`, `function` or `object`.

#### `typeof query === 'string'` 

> Select DOM-Elements.

Select elements with `document.querySelectorAll(query)`.

Example:
```javascript
let featureImages = e('main div.feature-image');
```

#### `typeof query === 'function'` 

> The given callback function is called when the `DOMContentLoaded` event is fired.

Example:
```javascript
e(function () {
    alert('DOMContentLoaded fired');
});
```

#### `typeof query === 'object'` 

> Lets you specify a list of elements, or a single one to select and use.

Valid `object` types are `Eric`, `Array`, `HTMLCollection`, `NodeList`, and `Node`.

If `query` is of an invalid object type, the selection will be empty instead.

If `query instanceof Eric`, `query` will be cloned.

Examples:
```javascript
let myApp1 = e(document.querySelectorAll('#app'));
// is equivalent to
let myApp2 = e('#app');
```
```javascript
// only select frist DOM-Element with id 'wrapper'
let myWrapper1 = e(document.getElementById('wrapper'));
// is equivalent to
let myWrapper2 = e().query('wrapper').id().select();

// select *all* DOM-Elements with id 'wrapper'
let myWrappers1 = e('#wrapper');
// which is equivalent to
let myWrappers2 = e().query('#wrapper').all().select();
// and even
let myWrappers3 = e().select('#wrapper');
// cloning it
let myWrappers4 = e(myWrappers3);
```
[More on query selectors and pushing elements to `eric` instances &hellip;](#equeryquery)
```javascript
// select first element of id 'demoid' and all with classname 'exampleclass'
let myElements = [
    document.getElementById('demoid'),
    ...document.getElementsByClassName('exampleclass'),
];

// add all elements with classname 'testclass'
myElements = myElements.concat(document.getElementsByClassName('testclass'));

let mySelection = e(myElements);

// similar (but not identical) to
let myBroaderSelection = e('#demoid, .exampleclass, .testclass');
```


## Selecting elements

### `e().set(elements)`

> Set the current selection of elements of an __`eric` *instance*__.

Valid `elements` parameter types are `Array`, `HTMLCollection`, `NodeList` and `Node`.


### `e().select(query)`

> Change the current selection of an __`eric` *instance*__.

Here, `query` has to be a `String`.

Equivalent to `e(query)` or `eric.query(query).all().select()`.


### <span name="equeryquery" id="equeryquery"></span>`e().query(query)`

> Change the current selection of an __`eric` *instance*__.

Here, only a `string` is expected as `query` parameter.

`eric.query(query)` returns an object with the following methods. Each of these methods returns an object of options to
either `select()` queried elements to replace the current selection, or `push()` them to or `unshift()` them into the
existing selection of elements; these two methods return the modified `eric` instance.

#### `eric.query(query).first().select()`,<br>`eric.query(query).first().push()`,<br>`eric.query(query).first().unshift()`

Uses `document.querySelector(query)` to select elements.

#### `eric.query(query).all().select()`,<br>`eric.query(query).all().push()`,<br>`eric.query(query).all().unshift()`

Uses `document.querySelectorAll(query)` to select elements.

#### `eric.query(query).id().select()`,<br>`eric.query(query).id().push()`,<br>`eric.query(query).id().unshift()`

Uses `document.getElementById(query)` to select elements.

#### `eric.query(query).classname().select()`,<br>`eric.query(query).classname().push()`,<br>`eric.query(query).classname().unshift()`

Uses `document.getElementsByClassName(query)` to select elements.


### `e().find(query)`

> Create a new `eric` instance with any child elements of the current selection matching the given query.

Use a `String` for `query`.

Uses `element.querySelectorAll(query)` foreach selected element to select the new ones.


---


### `e().push(query)`

> Append elements to the current selection of an __`eric` *instance*__.

Valid `query` types are `String`, `Array`, `HTMLCollection`, `NodeList` and `Node`.

If `typeof query === 'string'`, this is equivalent to `eric.query(query).all().push()`.


### `e().pop(getNode = false, empty = true)`

> Pop the last element off of the current selection of an __`eric` *instance*__.

If `getNode = true`, the actual `Node`/`HTMLElement` is returned instead of a new `eric` instance containing the popped element.

__If the current selection is empty__, whereupon no element can be popped:
* An empty eric instance will be returned by default (`empty = true`), on `empty = false`, `undefined` will be
returned instead;
* If `(getNode && empty) == true`, an empty `e.emptyNode()` will be returned.


### `e().unshift(query)`

> Prepend elements to the current selection of an __`eric` *instance*__.

Valid `query` types are `String`, `Array`, `HTMLCollection`, `NodeList` and `Node`.

If `typeof query === 'string'`, this is equivalent to `eric.query(query).all().unshift()`.


### `e().shift(getNode = false, empty = true)`

> Pop the first element off of the current selection of an __`eric` *instance*__.

If `getNode = true`, the actual `Node`/`HTMLElement` is returned instead of a new `eric` instance containing the popped element.

__If the current selection is empty__, whereupon no element can be popped:
* An empty eric instance will be returned by default (`empty == true`), on `empty = false`, `undefined` will be
returned instead;
* If `(getNode && empty) == true`, an empty `e.emptyNode()` will be returned.


### `e().create(tag, options = {})`

> Create an element and push it to the current selection.

Uses `document.createElement(tag)`.

All `options` will be defined as properties of the created element.

If `options.prepend = true`, the created element won't be `push`ed, but `unshift`ed to the selection.

`options.attributes` may be an object of `key: value` pairs to be set as attributes (`Attr`) of the created `HTMLElement`.

### `e().attach(parent, cloneAttach = false)`

> Appends the selected elements as children to one or more parents.

If `cloneAttach = false`, the selected elements will be attached to the first element matching the `parent` query.

If `cloneAttach = true`, the selected elements will be cloned and attached to all elements matching the `parent` query.

If `parent` is not an existing `eric` instance, it will be used in a [new `eric` constructor](#equery).


### `e().append(elements, cloneAppend = false)`

> Appends the given `elements` as children to the currently selected elements.

If `cloneAppend = false`, the given `elements` will be appended to the first currently selected element.

If `cloneAppend = true`, the given `elements` will be cloned and appended to all currently selected elements.

If `elements` is not an existing `eric` instance, it will be used in a [new `eric` constructor](#equery).


### `e().parents(getNodes = false)`

> Get all parents of the currently selected elements.

If `getNodes = true`, an array of Nodes will be returned instead of a new `eric` instance containing the parents. 


## Get selected elements

If `getNode = true` a `Node`/`HTMLElement` will be returned instead of a new `eric` instance containing the first
element of the selection.

If `empty = false` and no elements are currently selected, `undefined` is returned instead of a new empty `eric`
instance (with `getNode = false`), or an empty `e.emptyNode()` (with `getNode = true`).


### `e().first(getNode = false, empty = true)`

> Returns the first of the selected elements.


### `e().last(getNode = false, empty = true)`

> Returns the last of the selected elements.


### `e().get(n, getNode = false, empty = true)`

> Returns the nth selected element.

Where `n` is your wanted index and `typeof n === 'number'`.


## Manipulate elements

### `e().each(callback)`

> Executes the `callback` function for each selected element.

Calls `e.forEach(elements, callback)` with the given `callback` on the selected elements. 


---


### `e().class(classnames)`

> Manipulate classnames of the selected elements.

Returns an object with the following methods. If the `returnClass` parameter is `true`, these methods will return this
same object, instead of the respective `eric` instance, to make method chaining easier.

#### `e().class(classnames).add(returnClass = false)`

> Add the given classnames to each selected element’s `classList`.

Example:
```javascript
e('nav .menu-item').class('is-active').add();
```

#### `e().class(classnames).remove(returnClass = false)`

> Remove the given classnames from each selected element’s `classList`.

Example:
```javascript
e('nav .menu-item').class('is-active').remove();
```

#### `e().class(classnames).toggle(returnClass = false)`

> Toogle the given classnames on each _individual_ selected element’s `classList`.

Example:
```javascript
e('nav .menu-item').class('is-active').toggle();
```

#### `e().class(classnames).unify(returnClass = false)`

> If the first selected element’s `classList` contains the given `classnames`, they will be added to the others. If it
> does not contain them, they will be removed from all other elements.

Example:
```javascript
e('nav .menu-item').class('is-active').unify();
```
```javascript
// Ensures that all selected elements either do or do not have the desired class before toggling.
e('nav .menu-item').class('is-active').unify(true).toggle();
```

#### `e().class(classnames).has()`

> Returns a boolean, whether the first element’s `classList` contains the given `classnames`.

Example:
```javascript
if (e('nav .menu-item').class('is-active').has()) {
    // First selected element has class 'is-active'.
}
```

#### `e().class(classnames).have()`

> Returns a boolean, whether all selected element’s `classList`s contain the given `classnames`.

Example:
```javascript
if (e('nav .menu-item').class('is-active').have()) {
    // All selected elements have class 'is-active'.
}
```

#### `e().class(classnames).any()`

> Returns a boolean, whether any of the selected element’s `classList`s contain the given `classnames`.

Example:
```javascript
if (e('nav .menu-item').class('is-active').any()) {
    // At least one of the selected elements has class 'is-active'.
}
```


---


### `e().attr(key, value = null)`

> Manipulate attributes of the selected elements.

* If only a `key` is given, or `value = null`, the current value of the first selected element’s corresponding attribute
is returned.

Example:
```html
<img id="my-img" alt="An Example Image" src="/images/example.jpg" />
``` 
```javascript
let src = e('#my-img').attr('src');
// src === '/images/example.jpg'
```

* If the given `value` is not `null` or `false`, the attribute’s value is changed accordingly on all selected
elements.

Example: (HTML as above)
```javascript
e('#my-img').attr('alt', 'A Beautiful Picture');
```
Results in:
```html
<img id="my-img" alt="A Beautiful Picture" src="/images/example.jpg" />
```

* If `value = false`, the given attribute is removed from all selected elements.

Example: (HTML as above)
```javascript
e('#my-img').attr('src', false);
```
Results in:
```html
<img id="my-img" alt="A Beautiful Picture" />
```

### `e().data(key, value = null)`

> Manipulate data-attributes of the selected elements.

Same functionality as `eric.attr(key, value)`, but prefixes attribute names with `data-`, to simplify data-attribute
access.

Example:
```html
<input id="my-input" data-old="old input value" />
```
```javascript
let myInput = e('#my-input');
let oldValue = myInput.data('old');
// oldValue === 'old input value'

// => Thus:
myInput.data('old', false);
myInput.data('info', 'example value');
```
```html
<!-- => results in: -->
<input id="my-input" data-info="example value" />
```

### `e().text(value = null)`

> Get the `innerText` property of the first selected element or change `textContent` on all.

### `e().getTextContent()`

> Get the `textContent` property of the first selected element.

### `e().html(value = null)`

> Get the `innerHTML` property of the first selected element or change it on all.

### `e().val(value = null)`

> Get the `value` attribute of the first selected element or change it on all.


## Manipulate the DOM structure


### `e().remove(retain = false)`

> Delete all selected elements from the DOM.

If `retain = true`, the removed elements are not removed from the `eric` instance's selected elements list.


### `e().empty(textContentMode = true, retainText = false)`

> Delete all child elements of the selected elements.

If `textContentMode = true`, each elements `textContent` property is set to an empty `String` (generally faster).
<br>If `textContentMode = false`, each elements `innerHTML` property is set to an empty `String` instead.

If `retainText = true`, direct child `TextNodes` and comments will be retained. In this case `textContentMode` will be
ignored.


## User interactions


### `e().focus()`

> Focus the first selected element.


### `e().bind(event, callback, whileCapture = false)`

> Attach an event handler to the selected elements.
>
```javascript
e('button').bind('click', function (event) {
    alert('button clicked')
});
```

### `e().trigger(event)`

> Trigger an event on the selected elements.

Use an instance of `Event`, or a `String` to create a `new Event(event)` with as parameter. 


## Static methods
These can be used independently of `eric` instances.


### `e.forEach(elements, callback, thisArg = undefined)`

> **[static]** Call a function for each element of a given array.

Signature of `callback`: `function(element, index, array)`


### `e.isNode(o)`

> **[static]** Check if `o` actually is an instance of `Node`. Returns boolean.


### `e.isElement(o)`

> **[static]** Check if `o` actually is an instance of `Element`. Returns boolean.


### `e.isHTMLElement(o)`

> **[static]** Check if `o` actually is an instance of `HTMLElement`. Returns boolean.


### `e.mix(controller, mix)`

> **[static]** Add all properties of `mix` as properties to `controller`.


### `e.listElements(elements = [])`

> **[static]** Create an array from a given `HTMLCollection`, `NodeList`, `Array` or `Node`.


### `e.emptyNode()`
> **[static]** Create an empty `TextNode`.


### `e.create(tag)`
> **[static]** Create an `eric` instance with an element.

Uses `document.createElement(tag)`.
