var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var del = require('del');
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var _ = require('lodash');
var jade = require('gulp-jade');
var plumber = require('gulp-plumber');
var gulpif = require('gulp-if');
var config = require('./config');
var merge = require('merge-stream');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var environment = 'development';

// Overrides gulp default error handler so uses notify to display error and keep running
var _gulpsrc = gulp.src;
gulp.src = function() {
    return _gulpsrc.apply(gulp, arguments)
	    .pipe(plumber({
	        errorHandler: function(err) {
	            notify.onError({
	                title:    "Gulp Error",
	                message:  "Error: <%= error.message %>",
	                sound:    "Bottle"
	            })(err);
	            this.emit('end');
	        }
	    }));
};

gulp.task('server', function() {
	browserSync({
		port: 9000,
		server: {
			baseDir: [
				'bower_components',
				'dist/dev', 
				'../files/default',
				'../files/' + config.project
			]
		}
	});
});

gulp.task('templates', function() {
	var jadeDev = gulp.src('src/templates/*.jade')
		.pipe(jade(config.development.jade))
		.pipe(gulp.dest('dist/dev'));

	var jadeProd = gulp.src('src/templates/index.jade')
		.pipe(gulpif(environment == 'production', jade(config.production.jade)))
		.pipe(gulpif(environment == 'production', gulp.dest('dist/prod')));

	return merge(jadeDev, jadeProd)
		.pipe(reload({ stream:true }))
		.pipe(notify({ message: 'Templates done' }));
});

gulp.task('styles', function() {
	return gulp.src('src/styles/main.scss')
		.pipe(sass({ style: 'expanded' }))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('dist/dev/assets/css'))
		.pipe(gulpif(environment == 'production', gulp.dest('dist/prod/assets/css')))
		.pipe(gulpif(environment == 'production', rename({suffix: '.min'})))
		.pipe(gulpif(environment == 'production', minifycss()))
		.pipe(gulpif(environment == 'production', gulp.dest('dist/prod/assets/css')))
		.pipe(reload({ stream:true }))
		.pipe(notify({ message: 'Styles done' }));
});

gulp.task('watch', function() {

	gulp.watch('src/templates/**/*.jade', ['templates']);
	gulp.watch('src/styles/**/*.scss', ['styles']);

});

gulp.task('clean', function(cb) {
	del(['dist/dev/', 'dist/prod/'], cb);
});

gulp.task('js', function() {

	var opts = _.assign({}, watchify.args, config[environment].browserify);
	var b = watchify(browserify(opts));

	b.on('update', bundle);
	b.on('log', gutil.log);

	function bundle() {
		return b.bundle()
			.pipe(source('main.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(gulp.dest('./dist/dev/assets/js/'))
			.pipe(gulpif(environment == 'production', gulp.dest('./dist/prod/assets/js/')))
			.pipe(gulpif(environment == 'production', uglify({compress: {unused: false}})))
			.pipe(gulpif(environment == 'production', rename({suffix: '.min'})))
			.pipe(gulpif(environment == 'production', gulp.dest('./dist/prod/assets/js/')))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('./dist/dev/assets/js/'))
			.pipe(reload({ stream:true }))
			.pipe(notify({ message: 'Scripts done' }));
	}

	return bundle();
});


gulp.task('default', ['clean'], function() {
	gulp.start('templates', 'styles', 'js', 'watch', 'server');
});

gulp.task('build', ['clean'], function() {
	environment = 'production';
	gulp.start('templates', 'styles', 'js', 'watch');
});