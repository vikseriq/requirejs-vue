# requirejs-vue

A Vue.js [Single File Components](https://vuejs.org/v2/guide/single-file-components.html) loader plugin for RequireJS.
One-file, browser or server, no additional fats, no babels, gluten-free.

On browser-side it uses XMLHttpRequest to fetch the .vue files, so you can only fetch files 
that are on the same domain as the html page. Most browsers place restrictions on using 
XMLHttpRequest from local file URLs, so use a web server to serve your ```.vue``` files.

The server-side building with RequireJS Optimizer [r.js](https://github.com/requirejs/r.js) also available and works well.

Currently no plans to support templating engines (like pug) nor css preprocessors (less/sass) until they became available 
as browser-side dependency for RequireJS.

## Install <a name="install"></a>

### Via package manager

To install with [Bower](http://bower.io/):

```
  bower install requirejs-vue
```

With [yarn](https://github.com/yarnpkg/yarn)

```
yarn add requirejs-vue
```

Or good ol' ```npm```:
```
npm install --save requirejs-vue
```


### Manual download

Download the [latest version](https://rawgit.com/vikseriq/requirejs-vue/master/requirejs-vue.js).

## Usage <a name="usage"></a>

Setup loader in RequireJS path like this:

    ...
        paths: {
            'Vue': 'path to Vue.js',
            'vue': 'path to requirejs-vue'
        }
    ...
    

Reference Vue file via the ```vue!```. 
For example, to load the `component.vue` file that is in your ```baseUrl``` directory:

    require(['vue!component'], function (component) {
		//
    });
    
You can specify any alias for loader but update paths alias too.

Loader support ```.vue``` and ```.html``` files.

Inside loaded file reference template by ```template``` variable. 
Stylesheets will applied to ```document.body``` automatically. Currently only global styles supported.
Content of template will be cleared from whitespaces and comments.

Sample .vue file supported by loader:

```html
<template>
    <div v-cloak>Vue-demo component root</div>
</template>
<style>
    /* global styles */
    [v-cloak] {
        display: none;
    }
</style>
<script>
define(['Vue'], function(vue){
  Vue.component('vue-demo', {
    template: template
  })
});
</script>
```

### Server-side building with r.js

Plugin supports RequireJS Optimizer. Follow the usual r.js workflow: specify build config in ```build.js``` like:

```js
{
	baseUrl: './',
	name: 'init',
	out: './dist.js',
	findNestedDependencies: true,
	optimize: 'none',
	paths: {
	  Vue: 'node_modules/vue/dist/vue.min',
	  vue: 'node_modules/requirejs-vue/requirejs-vue',
	  app: 'your-entry-point'
}
  }
```

and then run builder:

```
r.js -o build.js
```

For advanced usage see [demo project](/demo/).

## License

MIT &copy; 2017 vikseriq