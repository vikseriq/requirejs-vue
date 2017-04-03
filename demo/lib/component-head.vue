<!-- Component without template -->
<style>
    h1, h2, h3, h4 {
        font-weight: normal;
    }
    h1 {
        color: cyan;
    }
    h2 {
        color: maroon;
    }
    h3 {
        color: yellow;
    }
    h4 {
        color: black;
    }
    /* comment will stripped */
</style>
<!-- Comment will stripped -->
<script>
  define(['Vue'], function(Vue){
    Vue.component('v-head', {
      //template: template, // yup, there are no template
      props: {
        level: {
          type: String
        },
        text: {
          type: String
        }
      },
      render: function(){
        return this.$createElement('h' + this.level, this.text);
      }
    });
  });
</script>