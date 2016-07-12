// Importamos gulp
var gulp = require ('gulp');
var sass = require ('gulp-sass');
var notify = require('gulp-notify');

// Definimos tarea por defecto
gulp.task("default", function(){
	gulp.watch("./src/scss/*.scss", ["compile-sass"]);
});

// Definimos la tarea para compilar SASS
gulp.task("compile-sass", function(){
	gulp.src("./src/scss/style.scss") // cargamos el archivo
	.pipe(sass().on('error', sass.logError)) // compilamos el archivo SASS y controlamos errores SASS
	.pipe(gulp.dest("./dist/css")) // guardamos el archivo en dist/css
	.pipe(notify({
		title: "SASS",
		message: "Compiled "
	}));
});
