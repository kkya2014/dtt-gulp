var gulp = require('gulp'), //基础库
    concat = require('gulp-concat'), //合并文件
    connect = require('gulp-connect'),
    less = require('gulp-less'), //less解析
    minifycss = require('gulp-minify-css'), //css压缩
    jshint = require('gulp-jshint'), //js检查
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    uglify = require('gulp-uglify'), //js压缩
    rename = require('gulp-rename'), //重命名
    clean = require('gulp-clean'), //清空文件夹
    open = require('gulp-open'),
    livereload = require('gulp-livereload'), //livereload
    paths = {
        root: './',
        dist: {
            root: 'examples/dist/',
            styles: 'examples/dist/css/',
            scripts: 'examples/dist/js/',
            ui: 'examples/dist/js/ui/'
        },
        co: {
            root: 'co/',
            styles: 'co/css/',
            scripts: 'co/'
        },
        source: {
            root: 'src/co-modules/',
            styles: 'src/co-modules/less/',
            scripts: 'src/co-modules/js/'
        },
        examples: {
            root: 'examples/',
            index: 'examples/index.html'
        }
    },
    co = {
        filename: 'co',
        jsFiles: [
            'libs/iscroll.js',
            'src/co-modules/js/zepto.extend.js',
            'src/co-modules/js/$extend.js',
            'src/co-modules/js/co.js',
            'src/co-modules/js/widgets/slider/slider.js',
            'src/co-modules/js/widgets/slider/touch.js',
            'src/co-modules/js/widgets/slider/guide.js',
            'src/co-modules/js/widgets/slider/multiview.js',
            'src/co-modules/js/widgets/slider/gestures.js',
            'src/co-modules/js/widgets/accordion.js',
            'src/co-modules/js/widgets/accordionList.js',
            'src/co-modules/js/widgets/fullpage.js',
            'src/co-modules/js/widgets/input.js',
            'src/co-modules/js/widgets/lazyloadimage.js',
            'src/co-modules/js/widgets/navigator.js',
            'src/co-modules/js/widgets/photobrowser.js',
            'src/co-modules/js/widgets/refresh.js',
            'src/co-modules/js/widgets/searchbar.js',
            'src/co-modules/js/widgets/swipelist.js',
            'src/co-modules/js/widgets/swipepage.js',
            'src/co-modules/js/widgets/switch.js',
            'src/co-modules/js/widgets/tabs.js'
            
        ]
    },
    zepto = {
        filename: 'zepto',
        jsFiles: [
            'zepto/zepto.js',
            'zepto/plugins/event.js',
            'zepto/plugins/ajax.js',
            'zepto/plugins/fx.js',
            'zepto/plugins/fx_methods.js',
            'zepto/plugins/data.js',
            'zepto/plugins/highlight.js',
            'zepto/plugins/detect.js',
            'zepto/plugins/touch.js',
            'zepto/plugins/matchMedia.js',
            'zepto/plugins/ex-ortchange.js'
        ]
    },
    banner = {
        header: [
            '/**',
            ' * Released on: <%= date.year %>-<%= date.month %>-<%= date.day %>',
            ' */',
            ''
        ].join('\n'),
        footer: [
            '/**',
            ' * Released on: <%= date.year %>-<%= date.month %>-<%= date.day %>',
            ' */',
            ''
        ].join('\n')
    },
    date = {
        year: new Date().getFullYear(),
        month: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' ')[new Date().getMonth()],
        day: new Date().getDate()
    };

// 清空co
gulp.task('cleanCo', function(cb) {
    gulp.src([paths.co.root], {
            read: false
        })
        .on('error', function(err) {
            console.log(err);
            this.end();
        })
        .pipe(clean())
        .on('finish', function() {
            cb();
        });
});

//co脚本处理
gulp.task('co-scripts', function(cb) {
    gulp.src(co.jsFiles) //要合并的文件
        .pipe(concat(co.filename + ".js")) // 合并匹配到的js文件并命名为 "all.js"
        .pipe(header(banner.header, {
            date: date
        }))
        .pipe(gulp.dest(paths.co.scripts))
        // .pipe(rename({
        //     suffix: '.min'
        // }))
        .pipe(uglify())
        .pipe(header(banner.header, {
            date: date
        }))
        .pipe(gulp.dest(paths.co.scripts))
        .on('finish', function() {
            cb();
        });
});

//dom处理
gulp.task('co-zepto', function(cb) {
    gulp.src(zepto.jsFiles) //要合并的文件
        .pipe(concat(zepto.filename + ".js")) // 合并匹配到的js文件并命名为 "all.js"
        .pipe(header(banner.header, {
            date: date
        }))
        .pipe(gulp.dest(paths.co.scripts))
        // .pipe(rename({
        //     suffix: '.min'
        // }))
        .pipe(uglify())
        .pipe(header(banner.header, {
            date: date
        }))
        .pipe(gulp.dest(paths.co.scripts))
        .on('finish', function() {
            cb();
        });
});

// co样式处理
gulp.task('co-css', function(cb) {
    gulp.src('src/co-modules/less/co.less')
        .pipe(less())
        .pipe(gulp.dest(paths.co.styles))
        .pipe(minifycss({
            advanced: false,
            aggressiveMerging: false,
        }))
        .pipe(header(banner.header, {
            date: date
        }))
        .pipe(gulp.dest(paths.co.styles))
        .on('finish', function() {
            cb();
        });
});

//co字体处理
gulp.task('co-font', function(cb) {
    gulp.src(paths.source.root + 'fonts/*.*')
        .pipe(gulp.dest(paths.co.root + 'fonts/'))
        .on('finish', function() {
            cb();
        });
});

//co处理
gulp.task('build-co', gulp.series('cleanCo', 'co-scripts', 'co-zepto', 'co-css', 'co-font'));

// 清空dist样式
gulp.task('cleanDist', function(cb) {
    gulp.src([paths.dist.root], {
            read: false
        })
        .on('error', function(err) {
            console.log(err);
            this.end();
        })
        .pipe(clean())
        .on('finish', function() {
            cb();
        });
});

// dist样式处理
gulp.task('dist-css', function(cb) {
    gulp.src('src/co-modules/less/co.less')
        .pipe(less())
        .pipe(gulp.dest(paths.dist.styles))
        // .pipe(rename({
        //     suffix: '.min'
        // }))
        // .pipe(minifycss({
        //     advanced: false,
        //     aggressiveMerging: false,
        // }))
        .pipe(gulp.dest(paths.dist.styles))
        .pipe(livereload())
        .on('end', function() {
            cb();
        });
});

//dist字体
gulp.task('dist-font', function(cb) {
    gulp.src(paths.source.root + 'fonts/*.*')
        .pipe(gulp.dest(paths.dist.root + 'fonts/'))
        .on('finish', function() {
            cb();
        });
});

// 样式处理
gulp.task('dist-styles', gulp.series('cleanDist', 'dist-css', 'dist-font'));


// js处理
gulp.task('dist-co', function(cb) {
    gulp.src(co.jsFiles) //要合并的文件
        .pipe(concat(co.filename + ".js")) // 合并匹配到的js文件并命名为 "all.js"
        .pipe(gulp.dest(paths.dist.scripts))
        // .pipe(rename({
        //     suffix: '.min'
        // }))
        // .pipe(uglify())
        .pipe(gulp.dest(paths.dist.scripts))
        .pipe(livereload())
        .on('end', function() {
            cb();
        });
});

// dom处理
gulp.task('dist-zepto', function(cb) {
    gulp.src(zepto.jsFiles) //要合并的文件
        .pipe(concat(zepto.filename + ".js")) // 合并匹配到的js文件并命名为 "all.js"
        .pipe(gulp.dest(paths.dist.scripts))
        // .pipe(rename({
        //     suffix: '.min'
        // }))
        // .pipe(uglify())
        .pipe(gulp.dest(paths.dist.scripts))
        .pipe(livereload())
        .on('end', function() {
            cb();
        });
});



gulp.task('dist-js', gulp.series('dist-co', 'dist-zepto'));

gulp.task('build-dist', gulp.series('dist-styles', 'dist-js'));

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('build', gulp.series('build-co', 'build-dist'));


/* =================================
    Watch
================================= */

gulp.task('watch', function(cb) {
    var server = livereload();
    livereload.listen();
    gulp.watch(paths.source.styles + '*.less', gulp.series('dist-css'));
    gulp.watch(paths.source.scripts + '**/*.*', gulp.series('dist-js'));
    cb();
});



gulp.task('connect', function(cb) {
    connect.server({
        root: [paths.root],
        port: '3003'
    });
    cb();
});

gulp.task('open', function(cb) {
    gulp.src(paths.examples.index).pipe(open('', {
        url: 'http://localhost:3003/' + paths.examples.index
    }));
    cb();
});

gulp.task('default', gulp.series('build', 'connect', 'open', 'watch'));