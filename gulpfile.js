const { spawn } = require('child_process');
const gulp = require('gulp');

function buildTypeScript() {
    return spawn('npx', ['tsc', '-p', '.'], { stdio: 'inherit' });
}

function buildStatic() {
    const globs = [
        './src/**/*.css',
        './src/**/*.html',
    ];

    return gulp.src(globs)
        .pipe(gulp.dest('./dist'));
}

function clean() {
    return spawn('rm', ['-rf', './dist'], { stdio: 'inherit' });
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