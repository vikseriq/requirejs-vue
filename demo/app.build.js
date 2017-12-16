(function(){
  return {
    baseUrl: "./lib",
    // load config from app main file
    mainConfigFile: 'lib/main.js',
    // name of initial file - like `data-main` attr
    name: "main",
    // force include requirejs into bundle
    include: ['requirejs'],
    // relative path to requirejs src
    paths: {
      'requirejs': '../bower_components/requirejs/require'
    },
    // strip comments
    preserveLicenseComments: false,
    // lookup nested - like require component inside component
    findNestedDependencies: true,
    // output file
    out: "app.dist.js"
  }
})();