import gulp from "gulp";
//Для компиляции sass в css////////
import dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);
////////////////////////////////////////////
import cleanCSS from "gulp-clean-css";
import del from "del";
function delCss(cb) {
  return del("public/style/*.css");
}
function createCss(cb) {
  return gulp
    .src("public/style/style.scss")
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(gulp.dest("public/style"));
}
export default gulp.series(delCss, createCss);
