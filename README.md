# eric.js

`eric.js` is a fast and tiny DOM navigation and manipulation library.

Many similar libraries add so many features, that they have become bloated and slow, creating noticable data traffic for your servers and your users.

`eric.js` aims to replace the most utilised features of jQuery and is of similar usage.

This library is by far not extensive yet, but the most necessary features are already implemented and ready for you to be used.

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

Valid `object` types are `Eric`, `Array`, `HTMLCollection`, `NodeList`, `HTMLElement` and `Node`.

If `query` is of an invalid object type, the selection will be empty instead.

<!--Type checks on `Array` elements are not performed, hence you should ensure given arrays to only include valid
`HTMLElement`s or `Nodes`.-->

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
[More on query selectors and pushing elements to `eric` instances &hellip;](#query-query)
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

### `e().set(elements)`

> Set the current selection of elements of an __`eric` *instance*__.

Valid `elements` parameter types are `Array`, `HTMLCollection`, `NodeList`, `HTMLElement` and `Node`.

### `e().select(query)`

> Change the current selection of an __`eric` *instance*__.

Here, `query` has to be a `String`.

Equivalent to `e(query)` or `eric.query(query).all().select()`.

### `e().push(query)`

> Append elements to the current selection of an __`eric` *instance*__.

Valid `query` types are `String`, `Array`, `HTMLCollection`, `NodeList`, `HTMLElement` and `Node`.

If `typeof query === 'string'`, this is equivalent to `eric.query(query).all().push()`.

### <span name="query-query" id="query-query"></span>`e().query(query)`

> Change the current selection of an __`eric` *instance*__.

Here, only a `string` is expected as `query` parameter.

`eric.query(query)` returns an object with the following methods. Each of these methods returns an object of options to
either `select()` queried elements or `push()` them to the existing selection of elements; these two methods return
the modified `eric` instance.

#### `eric.query(query).first().select()` and<br>`eric.query(query).first().push()`

Equivalent to `e(document.querySelector(query))`.

#### `eric.query(query).all().select()` and<br>`eric.query(query).all().push()`

Equivalent to `e(document.querySelectorAll(query))` and `e(query)`.

#### `eric.query(query).id().select()` and<br>`eric.query(query).id().push()`

Equivalent to `e(document.getElementById(query))`.

#### `eric.query(query).classname().select()` and<br>`eric.query(query).classname().push()`

Equivalent to `e(document.getElementsByClassName(query))`.

### `e().first(nullable = true)`

> Returns the first of the selected elements.

If `nullable = false`, an empty `HTMLElement` is returned instead of `null`, if no elements are selected.

### `e().last(nullable = true)`

> Returns the last of the selected elements.

If `nullable = false`, an empty `HTMLElement` is returned instead of `null`, if no elements are selected.

### `e().each(callback)`

> Executes the `callback` function for each selected element.

Calls `e.forEach(elements, callback)` with the given `callback` on the selected elements.

### `e().find(query)`

> Change the selection to any child elements of the current selection matching the given query. 

### `e().on(event, callback, whileCapture = false)`

> Bind a callback function to an event of every selected element.

Example:

```javascript
e('button').on('click', function (event) {
    alert('button clicked')
});
```

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

> If the first selected element’s `classList` contains the given `classnames`, it will be added to the others. If it does
> not contain them, they will be removed from all others.

Example:
```javascript
e('nav .menu-item').class('is-active').unify();
```
```javascript
// Ensures, that all selected elements either do or do not have the desired class before toggling.
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

#### `e().class(classnames).somewhere()`

> Returns a boolean, whether any of the selected element’s `classList`s contain the given `classnames`.

Example:
```javascript
if (e('nav .menu-item').class('is-active').somewhere()) {
    // At least one of the selected elements has class 'is-active'.
}
```

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
myInput.data('old', undefined);
myInput.data('info', 'example value');
```
```html
<!-- => results in: -->
<input id="my-input" data-info="example value" />
```

### `e().text(value = null)`

> Get the `innerText` property of the first selected element or change it on all.

### `e().html(value = null)`

> Get the `innerHTML` property of the first selected element or change it on all.

### `e().val(value = null)`

> Get the `value` attribute of the first selected element or change it on all.

### `e().focus()`

> Focus the first selected element.

## Static methods
These can be used independently of `eric` instances.

### `e.forEach(array, callback)`

> **[static]** Call a function for each element of a given array.

### `e.isNode(o)`

> **[static]** Check if `o` actually is an instance of `Node`. Returns boolean.

### `e.isElement(o)`

> **[static]** Check if `o` actually is an instance of `HTMLElement`. Returns boolean.

### `e.mix(controller, mix)`

> **[static]** Add all properties of `mix` as properties to `controller`.

### `e.elementList(elements = [])`

> **[static]** Create an array from a given `HTMLCollection`, `NodeList`, `Array`, `HTMLElement` or `Node`.