module.exports = function(grunt) {

    "use strict";

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),
        bannercss: '/*!\n' +
            ' * @concat.min.css\n' +
            ' * @CSS Document for Wickenburg Zoning Map Viewer @ MAG\n' +
            ' * @For Production\n' +
            ' * @<%= pkg.name %> - v<%= pkg.version %> | <%= grunt.template.today("mm-dd-yyyy") %>\n' +
            ' * @author <%= pkg.author %>\n' +
            '*/\n',

        bannerjs: '/*!\n' +
            ' * @main.min.js\n' +
            ' * @JavaScript document for Wickenburg Zoning Map Viewer @ MAG\n' +
            ' * @For Production\n' +
            ' * @<%= pkg.name %> - v<%= pkg.version %> | <%= grunt.template.today("mm-dd-yyyy") %>\n' +
            ' * @author <%= pkg.author %>\n' +
            '*/\n',

        jshint: {
            files: ["js/config.js", "js/main.js"],
            options: {
                // strict: true,
                sub: true,
                quotmark: "double",
                trailing: true,
                curly: true,
                eqeqeq: true,
                unused: true,
                scripturl: true, // This option defines globals exposed by the Dojo Toolkit.
                dojo: true, // This option defines globals exposed by the jQuery JavaScript library.
                jquery: true, // Set force to true to report JSHint errors but not fail the task.
                force: true,
                reporter: require("jshint-stylish-ex")
            }
        },

        uglify: {
            options: {
                // add banner to top of output file
                banner: '<%= bannerjs %>\n'
            },
            build: {
                files: {
                    "js/main.min.js": ["js/main.js"],
                    "js/vendor/bootstrapmap.min.js": ["js/vendor/bootstrapmap.js"]
                }
            }
        },

        cssbeautifier: {
            files: ["css/main.css"],
            options: {
                indent: "    ",
                openbrace: "end-of-line",
                autosemicolon: false
            }
        },

        cssmin: {
            add_banner: {
                options: {
                    // add banner to top of output file
                    banner: '/* <%= pkg.name %> - v<%= pkg.version %> | <%= grunt.template.today("mm-dd-yyyy") %> */\n'
                },
                files: {
                    "css/main.min.css": ["css/main.css"],
                    "css/normalize.min.css": ["css/normalize.css"],
                    "css/bootstrapmap.min.css": ["css/bootstrapmap.css"]
                }
            }
        },

        concat: {
            options: {
                stripBanners: true,
                banner: '<%= bannercss %>\n'
            },
            dist: {
                src: ["css/normalize.min.css", "css/bootstrapmap.min.css", "css/main.min.css"],
                dest: "css/concat.min.css"
            }
        },

        watch: {
            scripts: {
                files: ["js/main.js", "js/config.js", "Gruntfile.js"],
                tasks: ["jshint"],
                options: {
                    spawn: false,
                    interrupt: true,
                },
            },
        },

        replace: {
            update_Meta: {
                src: ["index.html", "config.js", "humans.txt", "README.md"], // source files array
                // src: ["README.md"], // source files array
                overwrite: true, // overwrite matched source files
                replacements: [{
                    // html pages
                    from: /(<meta name="revision-date" content=")[0-9]{2}\/[0-9]{2}\/[0-9]{4}(">)/g,
                    to: '<meta name="revision-date" content="' + '<%= pkg.date %>' + '">',
                }, {
                    // html pages
                    from: /(<meta name="version" content=")([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))(">)/g,
                    to: '<meta name="version" content="' + '<%= pkg.version %>' + '">',
                }, {
                    // config.js
                    from: /(v)([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))( \| )[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g,
                    to: 'v' + '<%= pkg.version %>' + ' | ' + '<%= pkg.date %>',
                }, {
                    // humans.txt
                    from: /(Version\: v)([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "Version: v" + '<%= pkg.version %>',
                }, {
                    // humans.txt
                    from: /(Last updated\: )[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g,
                    to: "Last updated: " + '<%= pkg.date %>',
                }, {
                    // README.md
                    from: /(#### `v)([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))( - )[0-9]{2}\/[0-9]{2}\/[0-9]{4}(`)/g,
                    to: "#### `v" + '<%= pkg.version %>' + ' - ' + '<%= pkg.date %>' + '`',
                }]
            }
        }


    });

    // this would be run by typing "grunt test" on the command line
    grunt.registerTask("work", ["jshint"]);
    grunt.registerTask("build", ["report", "uglify", "cssmin", "concat"]);
    grunt.registerTask("workcss", ["cssbeautifier"]);
    grunt.registerTask("change", ["conventionalChangelog"]);

    grunt.registerTask("buildcss", ["cssmin", "concat"]);
    grunt.registerTask("buildjs", ["uglify"]);

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask("default", []);

};

// ref
// http://coding.smashingmagazine.com/2013/10/29/get-up-running-grunt/
// http://csslint.net/about.html
// http://www.jshint.com/docs/options/