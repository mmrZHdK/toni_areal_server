module.exports = function(grunt){

    "use strict";
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        projectdata: {

            dev_domain: 'exohosting.ch',
            dev_foldername: '/exoperch/',
            local_foldername: '/exoperch/',
            dev_ftpuser: 'exohosting_ftp',
            dev_ftppassword: 'Exoie5mk3n_ftp',

            prod_domain: 'exohosting.ch',
            prod_ftpuser: 'exohosting_ftp',
            prod_ftppassword: 'Exoie5mk3n_ftp',

        },


        pkg: grunt.file.readJSON('package.json'),



        /*
        * ---------------------------------------------------------------------------------------------------
        * INITIALIZING PROJECT
        * ---------------------------------------------------------------------------------------------------
        */
        "file-creator": {
            create_ftppass: {
                ".ftppass": function(fs, fd, done) {
                    fs.writeSync(fd,
'{' + '\n' +
'    "production": {' + '\n' +
'        "username": "produser",' + '\n' +
'        "password": "prodpw"' + '\n' +
'    },' + '\n' +
'' + '\n' +
'    "development": {' + '\n' +
'        "username": "devuser",' + '\n' +
'        "password": "devpw"' + '\n' +
'    }' + '\n' +
'}'
                    );
                    done();
                }
            }
        },

        replace: {
            replace_ftppass: {
                src: ['.ftppass'],
                replacements:
                [

                    //PROD FTP USER
                    {
                        from: '"username": "produser"',
                        to: '"username": "' + '<%= projectdata.prod_ftpuser %>"'
                    },

                    //PROD FTP PW
                    {
                        from: '"password": "prodpw"',
                        to: '"password": "' + '<%= projectdata.prod_ftppassword %>"'
                    },

                    //DEV FTP USER
                    {
                        from: '"username": "devuser"',
                        to: '"username": "' + '<%= projectdata.dev_ftpuser %>"'
                    },

                    //DEV FTP PW
                    {
                        from: '"password": "devpw"',
                        to: '"password": "' + '<%= projectdata.dev_ftppassword %>"'
                    }
                ],
                overwrite: true
            }
        },


        /*
        * ---------------------------------------------------------------------------------------------------
        * BUILDING
        * ---------------------------------------------------------------------------------------------------
        */

        sass: {
            master: {
                options: {                       // Target options
                    compass: true,
                    require: ['companimation'],
                    quiet: true
                },

                files: {
                    'build/css/master.css' :
                    'assets/sass/master.scss'
                }

            },
            grid: {
                options: {                       // Target options
                    compass: true,
                    quiet: true
                },

                files: {
                    'build/css/grid.css' :
                    'assets/sass/grid.scss'
                }

            }
        },

        cssc: {
            build: {
                options: {
                    sortSelectors: true,
                    lineBreaks: false,
                    sortDeclarations:true,
                    consolidateViaDeclarations:false, // --> Crashes?
                    consolidateViaSelectors:true,
                    consolidateMediaQueries:false, // --> Crashes?
                },
                files: [
                {
                    'build/css/master.css' :
                    'build/css/master.css'
                },
                {
                    'build/css/grid.css' :
                    'build/css/grid.css'
                }
                ]
            }
        },

        cssmin: {
            master: {
                src: 'build/css/master.css',
                dest: 'build/css/master.css'
            },
            grid: {
                src: 'build/css/grid.css',
                dest: 'build/css/grid.css'
            }
        },

        copy: {
          img: {
            expand: true,
            cwd: 'assets/img',
            src: '**/*.{jpg,png,gif,ico}',
            dest: 'build/img'
          },
          fonts: {
            expand: true,
            cwd: 'assets/fonts',
            src: '*',
            dest: 'build/fonts'
          },
          templates: {
            expand: true,
            cwd: 'app/modules/',
            src: '**/templates/*.html',
            dest: 'build/templates/'
          },
          views: {
            expand: true,
            cwd: 'app/views/',
            src: '**/*.html',
            dest: 'build/views/'
          },
          maps: {
            expand: true,
            cwd: 'assets/maps/',
            src: '*.{svg,html}',
            dest: 'build/maps/'
          },
          pathmeshes: {
            expand: true,
            cwd: 'assets/pathmeshes/',
            src: '*.{svg,html}',
            dest: 'build/pathmeshes/'
          },
          additionaljslibs: {
            expand: true,
            cwd: 'assets/js/libs',
            src: '*/**',
            dest: 'build/js/libs'
          }
        },

        concat: {
            jslibs: {
                src: [
                      'assets/js/libs/*.js'],
                dest: 'build/js/libs/libs.js'
            },
            customscripts: {
                src: ['app/services/**/*.js','app/modules/**/*.js','app/app.module.js'],
                dest: 'build/js/app.js',
                options: {
                    banner: '(function() {\n\n',
                    footer: '\n\n})();'
                }
            }
        },

        uglify: {
            libs: {
                options: {
                    banner: "/* JS Libs - Compressed and Uglified */ \n",

                    compress: {
                        drop_console: true
                    },
                    mangle: false
                },
                files: {
                    'build/js/libs/libs.js': ['assets/js/libs/*.js']
                }

            },
            customscripts: {
                options: {
                    banner: '/* JS Custom Scripts - Compressed and Uglified */ \n\n(function() {\n\n',
                    footer: '\n\n})();',
                    compress: {
                        drop_console: true
                    },
                    mangle:false
                },
                files: {
                    'build/js/app.js': ['build/js/app.js']
                }
            }

        },

        ngAnnotate: {
            options: {
                singleQuotes: true,
            },
            app: {
                files: [{
                    'build/js/app.js': ['build/js/app.js']
                }],
            },

        },

        imagemin: {
            optimize_images: {
                options: {
                    optimizationLevel: 7,
                    pngquant: true
                },

                files: [{
                    expand: true,
                    cwd: 'build/img',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'build/img'
                },
                {
                    expand: true,
                    cwd: 'perch/resources',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'perch/resources'
                }]

            }
        },

        pngmin: {
            optimize_png: {
                options: {
                    force: true,
                    concurrency: 8,             // specify how many exucutables get spawned in parallel
                    ext: '.png',                // use .png as extension for the optimized files
                    quality: '65-90',           // output quality should be between 65 and 90 like jpeg quality
                    iebug: true,                // optimize image for use in Internet Explorer 6
                    transbug: true
                },
                files: [{
                    expand: true,
                    cwd: 'build/img',
                    src: ['**/*.png'],
                    dest: 'build/img'
                },
                {
                    expand: true,
                    cwd: 'perch/resources',
                    src: ['**/*.png'],
                    dest: 'perch/resources'
                }]
            }
        },

        clean: {
            build: {
                options: {
                    force: true
                },
                src: ["build"]
            },
            stupid_sass_folder: {
                options: {
                    force: true
                },
                src: ['sass']
            }
        },

        mkdir: {
            stupid_sass_folder: {
                options: {
                    create: ['sass']
                },
            },
        },

        /*
        * ---------------------------------------------------------------------------------------------------
        * WATCH & AUTOBUILD
        * ---------------------------------------------------------------------------------------------------
        */


        watch: {
            jslibs: {
                files: ['assets/js/libs/**'],
                tasks: ['concat:jslibs','copy:additionaljslibs'],
                options: {
                    livereload: true,
                }
            },
            jscustom: {
                files: ['app/**/*'],
                tasks: ['concat:customscripts','copyfiles'],
                options: {
                    livereload: true,
                }
            },
            css_master: {
                files: ['assets/sass/**/*.scss'],
                tasks: ['buildcss:dev_nogrid'],
                options: {
                    livereload: true,
                }
            },
            img: {
                files: ['assets/img/**/*.{png,jpg,gif}'],
                tasks: ['buildimg:dev'],
                options: {
                    livereload: true,
                }
            },
            maps: {
                files: ['assets/maps/**/*.{svg,html}'],
                tasks: ['copy:maps'],
                options: {
                    livereload: true,
                }
            },
            pathmeshes: {
                files: ['assets/pathmeshes/**/*.{svg,html}'],
                tasks: ['copy:pathmeshes'],
                options: {
                    livereload: true,
                }
            }
        },



        /*
        * ---------------------------------------------------------------------------------------------------
        * DEPLOYMENT
        * ---------------------------------------------------------------------------------------------------
        */

        ftpush: {
            development: {

                auth: {
                  host: '<%= projectdata.dev_domain %>',
                  port: 21,
                  authKey: 'development'
                },
                src: '',
                dest: 'httpdocs' + '<%= projectdata.dev_foldername %>',
                exclusions:
                [
                    '.gitignore',
                    '.git',
                    '.grunt',
                    '.sass-cache',
                    'node_modules',
                    'grunt_watch.bat',
                    '*.scssc',
                    '.ftppass',
                    'config.rb',
                    'package.json',
                    'gruntfile.js',
                    '.DS_Store',
                    '.DS_Store?',
                    '._*',
                    '.Spotlight-V100',
                    '.Trashes',
                    'ehthumbs.db',
                    'Thumbs.db'
                ],
                keep:
                [

                ],
                simple: true,
                useList: false
            },
            production: {
                auth: {
                  host: '<%= projectdata.prod_domain %>',
                  port: 21,
                  authKey: 'production'
                },
                src: '',
                dest: 'httpdocs' + '<%= projectdata.prod_foldername %>',
                exclusions:
                [
                    '.gitignore',
                    '.git',
                    '.grunt',
                    '.sass-cache',
                    'node_modules',
                    'grunt_watch.bat',
                    '*.scssc',
                    '.ftppass',
                    'config.rb',
                    'package.json',
                    'gruntfile.js',
                    '.DS_Store',
                    '.DS_Store?',
                    '._*',
                    '.Spotlight-V100',
                    '.Trashes',
                    'ehthumbs.db',
                    'Thumbs.db'
                ],
                keep:
                [

                ],
                simple: true,
                useList: false
            }
        }


    });




    /*
    * ---------------------------------------------------------------------------------------------------
    * COMMANDS
    * ---------------------------------------------------------------------------------------------------
    */


    grunt.registerTask('replaceconfig:local',  []);
    grunt.registerTask('replaceconfig:dev',  []);
    grunt.registerTask('replaceconfig:prod',  []);

    //INIT
    grunt.registerTask('init-project',  ['file-creator:create_ftppass', 'replace:replace_ftppass', 'replaceconfig:local','copyfiles']);

    // BUILD
    grunt.registerTask('buildcss:dev_nogrid',  ['mkdir:stupid_sass_folder', 'sass:master', 'clean:stupid_sass_folder']);
    grunt.registerTask('buildcss:dev',  ['mkdir:stupid_sass_folder','sass:grid', 'sass:master', 'clean:stupid_sass_folder'])
    grunt.registerTask('buildjs:dev',  ['concat', 'copy:additionaljslibs']);
    grunt.registerTask('buildimg:dev',  ['copy:img']);

    grunt.registerTask('buildcss:prod',  ['mkdir:stupid_sass_folder', 'sass:grid', 'sass:master', 'cssc', 'cssmin', 'clean:stupid_sass_folder']);
    grunt.registerTask('buildjs:prod',  ['concat:customscripts','ngAnnotate', 'uglify', 'copy:additionaljslibs']);
    grunt.registerTask('buildimg:prod',  ['copy:img', 'copy:templates', 'imagemin:optimize_images', 'pngmin:optimize_png']);

    grunt.registerTask('default', ['']);
    grunt.registerTask('build-dev',  ['clean:build','buildcss:dev', 'buildjs:dev', 'buildimg:dev','copyfiles']);
    grunt.registerTask('build-prod',  ['clean:build','buildcss:prod', 'buildjs:prod','buildimg:prod','copyfiles']);

    grunt.registerTask('copyfiles',  ['copy:templates','copy:views','copy:maps','copy:pathmeshes', 'copy:fonts']);


    // DEPLOYMENT LOCAL
    grunt.registerTask('deploy-local',  ['build-dev', 'copyfiles', 'replaceconfig:local']);

    // DEPLOYMENT DEV
    grunt.registerTask('deploy-dev',  ['build-dev', 'copyfiles', 'replaceconfig:dev', 'ftpush:development','replaceconfig:local']);

    // DEPLOYMENT PROD
    grunt.registerTask('deploy-prod',  ['build-prod', 'copyfiles', 'replaceconfig:prod', 'ftpush:production','replaceconfig:local']);

};
