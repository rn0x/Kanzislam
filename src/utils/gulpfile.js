// gulpfile.js
import gulp from 'gulp';
import concat from 'gulp-concat';
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import path from "node:path";

const root = path.resolve(process.cwd());
const cssFolder = path.join(root, "src/public/static/css");

// Concatenate and minify CSS files
gulp.task('styles', () => {

    const mainCss = [
        "main.css", "header.css", "footer.css", "fonts.css", "variables.css"
    ];
    const fullCssPaths = mainCss.map(e => path.join(cssFolder, e));
    return gulp.src(fullCssPaths)
        .pipe(concat('styles.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(cssFolder + "/dist"));
});

// // Concatenate and minify JS files
// gulp.task('scripts', () => {
//     return gulp.src([
//         'path/to/your/js/file1.js',
//         'path/to/your/js/file2.js',
//         // Add more JS files here
//     ])
//         .pipe(concat('scripts.min.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest('public/js'));
// });


// // Run all tasks

gulp.task('default', gulp.parallel('styles')); // gulp.parallel('styles', 'scripts')

// تشغيل المهام عند تشغيل هذا الملف
gulp.series('default')();
