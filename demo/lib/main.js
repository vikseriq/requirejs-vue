/**
 * A sample usage of requirejs-vue
 */
require(
  {
    paths: {
      'Vue': '../bower_components/vue/dist/vue',
      'vue': '../../requirejs-vue'
    }
  },
  ['Vue', 'vue!clock.html', 'vue!component-head.vue'],
  function(Vue, clock){
    // init whole vue app
    // component-head placed automatically because of component's pre-registered tag names will found in app template
    var app = new Vue({
      el: '#app'
    });
    // create DOM node for clock
    clock.$mount();
    // dynamically insert
    app.$el.appendChild(clock.$el);
  }
);
