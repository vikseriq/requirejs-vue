/**
 * Vue loader for RequireJS
 *
 * @version 1.1.1
 * @author vikseriq
 * @license MIT
 */
define([], function(){
  'use strict';

  var fetchContent = null,
    masterConfig = {
      isBuild: false
    },
    buildMap = {};

  if (typeof window !== 'undefined' && window.document){
    // browser-side
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
    // probably server-side
    var fs = require.nodeRequire('fs');
    if (!fs || !fs.readFileSync)
      throw new Error('requirejs-vue: Unsupported platform');

    fetchContent = function(url, callback){
      try {
        var file = fs.readFileSync(url, 'utf8');
        // remove BOM 😜
        if (file[0] === '\uFEFF'){
          file = file.substring(1);
        }
        callback(file);
      } catch (e) {
        throw new Error('requirejs-vue: Can not load file ' + url);
      }
    };
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
        text = text.replace(/[\n]+/g, '').replace(/\s{2,}/g, '');

      if (options.escape)
        text = text.replace(/([^\\])'/g, "$1\\'");

      return text;
    },

    /**
     * Cleanup HTML
     */
    cleanup: function(text){
      return text.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*|<!--[\s\S]*?-->$/, '');
    },

    /**
     * Vue template extractor
     */
    template: function(text){
      var start = text.indexOf('<template');
      if (start < 0)
        return '';
      var content;
      // check for `pug` template engine mark
      if (/^<template\s+lang="(pug|jade)"/.test(text.substring(start))){
        var pug = require('browser-pug');
        content = this._wrapped_content(text, 'template', {lastIndex: true, escape: false, whitespaces: true});
        content = pug.render(content);
      } else {
        // generic html
        content = this._wrapped_content(text, 'template', {lastIndex: true, escape: true})
          .trim();
      }

      return content;
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
      if (masterConfig.isBuild || typeof document === 'undefined')
        return;
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
    version: '1.1.1',

    fetchContent: fetchContent,

    load: function(name, require, load, config){
      masterConfig.isBuild = config.isBuild;

      var fullName = name + (/\.(vue|html)$/.test(name) ? '' : '.vue');
      var path = require.toUrl(fullName);

      fetchContent(path, function(text){
        var data = parse(text);
        buildMap[name] = data;
        try {
          load.fromText(data);
        } catch (err){
          if (typeof console !== 'undefined'){
            console.warn('requirejs-vue: can not load module; check for typos in component', path);
            console.error(err);
          }
        }
      });
    },

    write: function(plugin, module, write){
      if (buildMap.hasOwnProperty(module)){
        write.asModule(plugin + '!' + module, buildMap[module]);
      }
    }
  }
});