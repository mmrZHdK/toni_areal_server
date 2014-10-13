/**
 * Define paths and file names
 */
var paths = {
  assets: './app/assets',
  build: './app/build',
  bower: './app/bower_components'
};

module.exports = {
  /**
   * Define paths and file names
   */
  paths: {
    base: {
      assets: './app/assets',
      build: './app/build',
      bower: './app/bower_components'
    },
    assets: {
      js: {
        folder: paths.assets  + '/js',
        main:   paths.assets  + '/js/main.js',
        vendor: paths.assets  + '/js/vendor',
        bower: []
      },
      sass: {
        folder: paths.assets  + '/sass',
        main:   paths.assets  + '/sass/main.scss'
      },
      img: {
        folder: paths.assets  + '/img'
      }
    },
    build: {
      css:            paths.build   + '/css',
      cssTemp:        paths.build   + '/css/temp/',
      js:             paths.build   + '/js',
      img:            paths.build   + '/img',
      scriptsName:    'main.js',
      scriptsNameMin: 'main.min.js',
      vendorName:     'vendor.min.js',
      bowerName:      'bower.min.js'
    },
  },
  browserify: {
    // Enable source maps
    debug: true,
    // Additional files extension to make optional
    extensions: ['.hbs'],
    bundleConfigs: [{
      entries: paths.assets + '/js/app.js',
      dest: paths.build + '/js/',
      outputName: 'app.js'
    }/*, {
      entries: paths.assets + '/js/head.js',
      dest: paths.build + '/js/',
      outputName: 'head.js'
    }*/]
  }
};
