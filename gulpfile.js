const gulp = require('gulp');
const livereload = require('gulp-livereload');

gulp.task('watch', function () {
    livereload.listen();
    // app/**/*.*的意思是 app文件夹下的 任何文件夹 的 任何文件
    gulp.watch('views/**/*.*', function (file) {
        livereload.changed(file.path);
    });
});
