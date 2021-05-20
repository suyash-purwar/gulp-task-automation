const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass");
const prefix = require("gulp-autoprefixer");
const minify = require("gulp-clean-css");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const imagewebp = require("gulp-webp");
const browsersync = require("browser-sync").create();

function sendhtml() {
    return src()
}

function compilesass() {
    return src('src/sass/*.scss')
        .pipe(sass())
        .pipe(prefix('last 2 versions'))
        .pipe(minify())
        .pipe(dest('dist/css'));
}

function jsmin() {
    return src('src/js/*.js')
        .pipe(terser())
        .pipe(dest('dist/js'));
}

function optimizeimg() {
    return src('src/assets/img/*.{jpg, png}')
        .pipe(imagemin([
            imagemin.mozjpeg({ quality:80, progressive: true}),
            imagemin.optipng({ optimizationLevel: 2})
        ]))
        .pipe(dest('dist/assets/img'));
}

function webpImages() {
    return src('dist/assets/img/*.{jpg, png}')
        .pipe(imagewebp())
        .pipe(dest('dist/img/webp'));
}

function watchTask() {
    watch('src/scss/*.scss', series[compilesass(), browsersyncReload()]);
    watch('src/js/*.js', series[jsmin(), browsersyncReload()]);
    watch('src/assets/img/*.{jpg, png}', series[optimizeimg(), browsersyncReload()]);
    watch('dist/assets/img/*.{jpg, png}', series[webpImages(), browsersyncReload()]);
}

function browsersyncServe(cb) {
    browsersync.init({
        server: {
            baseDir: './dist'
        }
    });

    cb();
}

function browsersyncReload(cb){
    browsersync.reload();
    cb();
}

exports.default = series(
    compilesass,
    jsmin,
    optimizeimg,
    webpImages,
    browsersyncServe,
    watchTask
);