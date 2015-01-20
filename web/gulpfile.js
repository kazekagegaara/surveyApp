// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var usemin = require('gulp-usemin');

// tasks
gulp.task('lint', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});
gulp.task('clean', function() {
    gulp.src('./dist/*')
      .pipe(clean({force: true}));
});
gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./dist/'))
});
gulp.task('minify-js', function() {
  gulp.src(['./app/scripts/*.js','!./app/bower_components/**'])
    .pipe(uglify({
      // inSourceMap:
      // outSourceMap: "app.js.map"
    }))
    .pipe(gulp.dest('./dist/scripts/'))
});
gulp.task('minify-controller-js',function(){
  gulp.src(['./app/scripts/controllers/*.js'])
    .pipe(uglify({
      // inSourceMap:
      // outSourceMap: "app.js.map"
    }))
    .pipe(gulp.dest('./dist/scripts/controllers/'))
});
gulp.task('copy-html-files', function () {
  gulp.src('./app/**/*.html')
    .pipe(gulp.dest('dist/'));
});
gulp.task('copy-bower-components', function () {
  gulp.src([
  	'./app/bower_components/angular/angular.min.js',
  	'./app/bower_components/angular-route/angular-route.min.js',
  	'./app/bower_components/bootstrap/dist/css/bootstrap.min.css',
  	'./app/bower_components/bootstrap/dist/js/bootstrap.min.js',
  	'./app/bower_components/fontawesome/css/font-awesome.min.css',
  	'./app/bower_components/jquery/dist/jquery.min.js',
  	'./app/bower_components/jquery/dist/jquery.min.map'
  	])      
    .pipe(gulp.dest('dist/lib/'));    
});
gulp.task('htmlref', function() {
	gulp.src('./app/index.html')	
	.pipe(usemin({
		// nothing to do
	}))
	.pipe(gulp.dest('dist'));
});
gulp.task('connect', function () {
  connect.server({
    root: 'app/',
    port: 8888
  });
});
gulp.task('connectDist', function () {
  connect.server({
    root: 'dist/',
    port: 9999
  });
});
gulp.task('watch',function(){
  gulp.watch('./app/scripts/*.js',['lint','connect']);
  gulp.watch('./app/css/*.css',['connect']);
})


// default task
gulp.task('serve',
  ['lint', 'connect','watch']
);
// build task
gulp.task('build',  
  ['lint', 'minify-css', 'minify-js', 'minify-controller-js','copy-html-files', 'copy-bower-components', 'htmlref']
);
