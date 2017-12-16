# requirejs-vue Sample

This sample demonstrates way to load Vue components with RequireJS

## Prepare

Run ```bower install```

This will download necessary libraries into `bower_components`.

## Run

Due to browser's XMLHttpRequest CSRF limitations use a local server to serve files from current directory, 
for example with Python built-in module:

```bash
python -m SimpleHTTPServer 8008 & open http://localhost:8008/index.html
```

## Build with r.js

To create production-ready js bundle we suggest to use [r.js optimizer](http://requirejs.org/docs/optimization.html).

0. Install r.js optimizer:
	
	```bash
	npm install -g requirejs
	```

1. Make `app.dist.js` by calling
	
	```bash
	r.js -o app.build.js
	```
	
	The combined and minified bundle will be generated for standalone usage.

2. And then simply open `app.dist.html`.

Note: *currently Vue-component's styles will omitted during build – use standard css instead*.
