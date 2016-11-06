# tack

[![NPM version][npm-image]][npm-url]

On the fly pseudo-class generation for functional CSS.

This package allows you to generate pseudo-class variations of CSS classes at runtime. When used
with [Tachyons](http://tachyons.io/) or [Basscss](http://basscss.com/), it entirely alleviates
the need for pseudo-class specific selectors.


## Installation

```sh
$ npm install --save tack-css
```


## Usage

First, import `tack`:

```javascript
import tack from 'tack-css';
```

After your functional styles are loaded, call `tack.hash` to seed the style index:

```javascript
tack.hash();
```

The `tack` function takes a pseudo-class and a list of classes and returns a list of generated
classes with the pseudo-class targeted.


```javascript
tack('hover', 'b--blue', 'blue') // => 'b--blue--tack-hover blue--tack-hover'
```

The permutations of pseudo-class and classes are generated and added to the DOM the first time
`tack` sees them. They are re-used afterwards.


## Limitations

Because `tack` uses the `Document.styleSheets` API to index styles, the style sheets with the
classes you wish to augment must adhere to the browser's same-origin policy and reside on the page's
domain or have appropriate CORS headers set.


## How does it work?

`tack.hash()` builds an index of simple CSS selectors to rules. Then, `tack` uses the index to
generate derivative classes that are injected into the document.


## License

MIT © [Justin Vaillancourt](mailto:justin@dooly.ai)


[npm-image]: https://badge.fury.io/js/tack-css.svg
[npm-url]: https://npmjs.org/package/tack-css
