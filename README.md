# requirejs-vue

A Vue.js [Single File Components](https://vuejs.org/v2/guide/single-file-components.html) loader plugin for RequireJS.
One-file, browser-only, no additional fats, babels, gluten-free.

It uses XMLHttpRequest to fetch the .vue files, so you can only fetch files 
that are on the same domain as the HTML page, and most browsers place restrictions on using 
XMLHttpRequest from local file URLs, so use a web server to serve your .vue files.


## Install <a name="install"></a>

### Bower

To install with [Bower](http://bower.io/):

```
  bower install requirejs-vue
```

### Manual Download

Download the [latest version](https://raw.github.com/vikseriq/requirejs-vue/latest/requirejs-vue.js).

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

## License

MIT