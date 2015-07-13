module.exports = function(grunt) {

    var pkg = grunt.file.readJSON('package.json');
    var urlAmazon = "http://infograficos-estaticos.s3.amazonaws.com/"+pkg.name+"/";
    var caminhoDev = 'versions/dev';
    var caminhoBuild = 'versions/build';

    grunt.initConfig({

        watch: {
            options: {
                livereload: true
            },
            jade: {
                files: ['app/jade/*.jade', 'app/jade/**/*.jade'],
                tasks: ['jade']
            },
            sass: {
                files: ['app/sass/*.scss', 'app/sass/**/*.scss'],
                tasks: ['sass', 'autoprefixer']
            },
            scripts: {
                files: [caminhoDev+'/assets/js/*.js', caminhoDev+'/assets/js/**/*.js']
            },
            images: {
                files: [caminhoDev+'/assets/images/*.*', caminhoDev+'/assets/images/**/*.*'],
            }
        },
        jade: {
            dist: {
                options: {
                    pretty: true,
                    data: {
                        dev : true,
                        caminho : ''
                    }
                },
                files: [{
                    expand: true,
                    cwd: 'app/jade/',
                    src: ['*.jade'],
                    dest: caminhoDev+'/',
                    ext: '.html',
                }]
            },
            build: {
                options: {
                    pretty: true,
                    data: {
                        dev : false,
                        caminho : urlAmazon
                    }
                },
                files: [{
                    expand: true,
                    cwd: 'app/jade/',
                    src: ['*.jade'],
                    dest: caminhoBuild+'/',
                    ext: '.html',
                }]
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: 'app/sass/',
                    src: ['*.scss'],
                    dest: caminhoDev+'/assets/css/',
                    ext: '.css'
                }]
            },
            build: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: 'app/sass/',
                    src: ['*.scss'],
                    dest: caminhoBuild+'/assets/css/',
                    ext: '.css'
                }]
            }
        },
        autoprefixer: {
            dist: {
                options: {
                    browsers: ['last 5 versions', 'ie 8', 'ie 9']
                },
                src: caminhoDev+'/assets/css/main.css',
                dest: caminhoDev+'/assets/css/main.css'
            },
            build: {
                options: {
                    browsers: ['last 5 versions', 'ie 8', 'ie 9']
                },
                src: caminhoBuild+'/assets/css/main.css',
                dest: caminhoBuild+'/assets/css/main.css'
            }
        },
        copy: {
            build: {
                files: [
                    {expand: true, cwd: caminhoDev+'/assets/images/', src: ['**'], dest: caminhoBuild+'/assets/images/'},
                    {expand: true, cwd: caminhoDev+'/assets/js/', src: ['**','!jquery-2.1.3.min.js'], dest: caminhoBuild+'/assets/js/'}
                ]   
            },
            fast: {
                files: [
                    {expand: true, cwd: caminhoDev+'/assets/js/', src: ['**','!jquery-2.1.3.min.js'], dest: caminhoBuild+'/assets/js/'}
                ]   
            }
        },
        connect: { 
            server: {
                options: {
                    hostname: '0.0.0.0',
                    port: 9000,
                    middleware: function(connect) {
                        return [
                            connect.static('../recursos'),
                            connect.static('bower_components'),
                            connect.static(caminhoDev)
                        ]
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['jade:dist', 'sass:dist', 'autoprefixer:dist', 'connect', 'watch']);
    grunt.registerTask('build', ['jade:build', 'sass:build', 'autoprefixer:build', 'copy:build']);
    grunt.registerTask('build-fast', ['jade:build', 'sass:build', 'autoprefixer:build', 'copy:fast']);
}