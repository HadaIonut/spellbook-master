const gulp = require('gulp');

const sass = require('gulp-sass');
const concat = require('gulp-concat');
const combine = require('gulp-scss-combine');

const ts = require('gulp-typescript');
const typescript = require('typescript');

const fs = require('fs-extra');
const path = require('path');

const configs = (() => {
    const foundryConfigFileName = 'foundryconfig.json';
    const configPath = path.resolve(process.cwd(), foundryConfigFileName);
    return fs.existsSync(configPath) ? fs.readJSONSync(configPath) : {};
})();

const createTransformer = () => {
    const shouldMutateModuleSpecifier = (node) => {
        if (
            !typescript.isImportDeclaration(node) &&
            !typescript.isExportDeclaration(node)
        )
            return false;
        if (node.moduleSpecifier === undefined) return false;
        if (!typescript.isStringLiteral(node.moduleSpecifier)) return false;
        if (
            !node.moduleSpecifier.text.startsWith('./') &&
            !node.moduleSpecifier.text.startsWith('../')
        )
            return false;
        if (path.extname(node.moduleSpecifier.text) !== '') return false;
        return true;
    }

    return (context) => {
        return (node) => {
            /**
             * @param {typescript.Node} node
             */
            const visitor = (node) => {
                if (shouldMutateModuleSpecifier(node)) {
                    if (typescript.isImportDeclaration(node)) {
                        const newModuleSpecifier = typescript.createLiteral(
                            `${node.moduleSpecifier.text}.js`
                        );
                        return typescript.updateImportDeclaration(
                            node,
                            node.decorators,
                            node.modifiers,
                            node.importClause,
                            newModuleSpecifier
                        );
                    } else if (typescript.isExportDeclaration(node)) {
                        const newModuleSpecifier = typescript.createLiteral(
                            `${node.moduleSpecifier.text}.js`
                        );
                        return typescript.updateExportDeclaration(
                            node,
                            node.decorators,
                            node.modifiers,
                            node.exportClause,
                            newModuleSpecifier
                        );
                    }
                }
                return typescript.visitEachChild(node, visitor, context);
            }

            return typescript.visitNode(node, visitor);
        };
    };
}

const tsProject = ts.createProject('tsconfig.json', {
    getCustomTransformers: (_program) => ({
        after: [createTransformer()],
    }),
});

gulp.task('compile-and-copy-ts', () => {
    return gulp.src('./src/scripts/**/*.ts')
        .pipe(tsProject()).js
        .pipe(gulp.dest('./dist/scripts'));
});

const sassOptions = sass(
    {
        outputStyle: 'compressed'
    }).on('error', sass.logError);

gulp.task('compile-minify-and-copy-sass', () => {
    const { projectName } = configs;

    return gulp.src('./src/styles/**/*.scss')
        .pipe(combine())
        .pipe(concat(projectName))
        .pipe(sassOptions)
        .pipe(gulp.dest('./dist/styles'));
});

gulp.task('move-non-convertible-files', () => {
    return gulp.src([
        './src/**/*.*',
        '!./src/scripts/**/*.ts',
        '!./src/styles/**/*.scss'
    ]).pipe(gulp.dest('./dist'));
});

gulp.task('link', () => {
    const distFolderName = 'dist';
    const distPath = path.resolve(process.cwd(), distFolderName);
    const { projectName, modulesPath } = configs;
    if (!(fs.existsSync(distPath) && modulesPath && projectName)) return;

    return gulp.src(`${distFolderName}/`)
        .pipe(gulp.symlink(`${modulesPath}${projectName}`));
});

gulp.task('build', gulp.series(
    'move-non-convertible-files',
    'compile-and-copy-ts',
    'compile-minify-and-copy-sass'
));

gulp.task('build-watch', () => {
    gulp.watch([
        './src/**/*.*',
        '!./src/scripts/**/*.ts',
        '!./src/styles/**/*.scss'
    ], gulp.series('move-non-convertible-files'));
    gulp.watch('./src/scripts/**/*.ts', gulp.series('compile-and-copy-ts'));
    gulp.watch('./src/styles/**/*.scss', gulp.series('compile-minify-and-copy-sass'));
});