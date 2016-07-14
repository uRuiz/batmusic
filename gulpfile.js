// Importamos gulp
var gulp = require ('gulp');
var sass = require ('gulp-sass');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');

// variables de patrones de arhcivos
var jsFiles = ["src/js/*js", "src/**/*.js"];

// Definimos tarea por defecto
gulp.task("default", ["concat-js","compile-sass"], function(){

	//Iniciar BrowserSync
	browserSync.init({
		server: "./",  // levanta un servidor web en la carperta actual
		browser: "google chrome"
	});

	// observa cambios en archivos SASS y ejecuta la tarea de compilación
	gulp.watch("src/scss/*.scss", ["compile-sass"]);

	// observa cambios en archivos HTML y recargue el navegador
	gulp.watch("*.html").on("change", browserSync.reload);

	//observar cambios en archivos JS para concatenar
	gulp.watch(jsFiles, ["concat-js"]);
});

// Definimos la tarea para compilar SASS
gulp.task("compile-sass", function(){
	gulp.src("./src/scss/style.scss") // cargamos el archivo
	.pipe(sass().on('error', sass.logError)) // compilamos el archivo SASS y controlamos errores SASS
	.pipe(gulp.dest("./dist/css")) // guardamos el archivo en dist/css
	.pipe(notify({
		title: "SASS",
		message: "Compiled"
	}))
	.pipe(browserSync.stream());
});

// definimos la tarea para concatenar JS
gulp.task("concat-js", function(){
	gulp.src(jsFiles)
	.pipe(concat("app.js"))
	.pipe(gulp.dest("dist/js/"))
	.pipe(notify({
		title: "JS",
		message: "Concatenated"
	}))
	.pipe(browserSync.stream());
});