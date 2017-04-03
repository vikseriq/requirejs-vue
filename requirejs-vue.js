/**
 * Vue loader for RequireJS
 *
 * @version 1.0.0
 * @author vikseriq
 * @license MIT
 */
define([], function(){
  'use strict';

  var fetchContent = null;

  if (typeof window !== 'undefined' && window.document){
    if (typeof XMLHttpRequest === 'undefined')
      throw new Error('XMLHttpRequest not available');

    fetchContent = function(url, callback){
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onreadystatechange = function(){
        if (xhr.readyState === 4 && this.status < 400)
          callback(xhr.responseText);
      };
      xhr.send();
    };
  } else {
    throw new Error('Unsupported environment');
  }

  var extractor = {
    /**
     * Extract content surrounded by tag
     */
    _wrapped_content: function(text, tagname, options){
      options = options || {whitespaces: false};
      var start = text.lastIndexOf('<' + tagname);
      if (start < 0)
        return '';
      start = text.indexOf('>', start) + 1;
      var end = text.indexOf('</' + tagname + '>', start);
      if (options.lastIndex)
        end = text.lastIndexOf('</' + tagname + '>');

      text = text.substring(start, end);

      if (!options.whitespaces)
        text = text.replace(/[\n\r]+(\s{2,})/g, '');

      if (options.escape)
        text = text.replace(/([^\\])'/g, "$1\\'");

      return text;
    },

    cleanup: function(text){
      return text.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*|<!--[\s\S]*?-->$/, '');
    },

    /**
     * Vue template extractor
     */
    template: function(text){
      var start = text.indexOf('<template');
      var end = text.lastIndexOf('</template>');
      return this._wrapped_content(text, 'template', {lastIndex: true, escape: true})
        .trim();
    },

    /**
     * Component source code extractor
     */
    style: function(text){
      return this._wrapped_content(text, 'style');
    },

    /**
     * Styles extractor
     */
    script: function(text){
      return this._wrapped_content(text, 'script', {whitespaces: true});
    }
  };

  var injector = {
    /**
     * Inject styles to DOM
     */
    style: function(text){
      var e = document.createElement('style');
      e.type = 'text/css';
      e.appendChild(document.createTextNode(text));
      document.body.appendChild(e);
    }
  };

  /**
   * Rearrange .vue file to executable content
   * @param text raw file content
   * @returns {string} executable js
   */
  var parse = function(text){
    text = extractor.cleanup(text);
    injector.style(extractor.style(text));
    return '(function(template){'
      + extractor.script(text)
      + '})(\''
      + extractor.template(text)
      + '\');'
  };

  return {
    version: '1.0.0',

    fetchContent: fetchContent,

    load: function(name, require, load, config){

      var fullName = name + (/\.(vue|html)$/.test(name) ? '' : '.vue');
      var path = require.toUrl(fullName);

      fetchContent(path, function(text){
        load.fromText(parse(text));
      });
    }
  }
});