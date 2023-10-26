const { spawn } = require('child_process');
const gulp = require('gulp');
const { rm } = require('fs/promises');

function buildTypeScript() {
    return spawn('npx', ['tsc', '-p', '.'], { shell: true, stdio: 'inherit' });
}

function buildStatic() {
    const globs = [
        './src/**/*.css',
        './src/**/*.html',
        './src/**/*.svg',
    ];

    return gulp.src(globs)
        .pipe(gulp.dest('./dist'));
}

function clean() {
    return rm("./dist", { force: true, recursive: true });
}

const build = gulp.series(
    clean,
    gulp.parallel(
        buildTypeScript,
        buildStatic,
    ),
);

module.exports = {
    default: build,
};