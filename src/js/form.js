var $ = require('jquery');
var apiClient = require('./api-client');
var songsListManager = require('./songs-list-manager');

var newSongFormButton = $('.new-song-form button');
var inputs = $(".new-song-form input");

function setLoading(){ // antes de enviar la petición
    $(inputs).attr("disabled", true); // deshabilito todos los inputs
    // Cambio el texto del botón y lo deshabilito
    newSongFormButton.text("Saving song...").attr("disabled", true);
}

function unsetLoading(){
    $(inputs).attr("disabled", false); // habilito todos los inputs
    // Cambio el texto del botón y lo habilito
    newSongFormButton.text("Save Song").attr("disabled", false);
}


// al enviar formulario pulsando enter o haciendo click en el botón
// enviamos una petición AJAX para almacenar la canción
$('.new-song-form').on("submit", function(){

    // Validación de inputs
    var inputs = $(".new-song-form").find("input, .drop-zone");
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        if (input.checkValidity() == false) {
            alert(input.validationMessage);
            input.focus();
            return false;
        }
    }

    var audio_file_input = $("#audio_file")[0];
    var audio_file = null;
    if (audio_file_input.file != null) {
        audio_file = audio_file_input.file;
    }

    var cover_file_input = $("#cover_file")[0];
    var cover_file = null;
    if (cover_file_input.file) {
        cover_file = cover_file_input.file;
    }

    // cancion que quiero crear
    var song = {
        artist: $("#artist").val(), // document.getElementById("artsit").value
        title: $("#title").val(),
        audio_file: audio_file,
        cover_file: cover_file
    };

    setLoading(); // deshabilito el formulario

    apiClient.save(song, function(response) {
        $("form")[0].reset(); // borro todos los campos del formulario
        $("#artist").focus(); // pongo el foco en el campo artist
        songsListManager.load();
        unsetLoading();
    }, function() {
        console.error("ERROR", arguments);
        unsetLoading();
    });

    return false; // == e.preventDefault();
});

// Anulo el comportamiento por defecto del navegador en el drop
$('body').on("drop dragover", function(event){
    event.preventDefault();
    return false;
});


// Manejamos el evento de cuando ponen el archivo encima
$('.drop-zone').on("dragover dragleave", function(event){
    event.preventDefault();
    if (event.type == "dragover") {
        $(this).addClass("drop-here");
    } else {
        $(this).removeClass("drop-here");    
    }    
    return false;

}).on("drop", function(event){ // Manejamos el evento de cuando sueltan el archivo
    var files = event.originalEvent.dataTransfer.files;
    if (files.length > 0 ) {
        var file = files[0];
        console.log("Archivo seleccionado: ", files[0]);
        $(this).text(file.name);
        this.file = file; 
    }
    event.preventDefault();
    return false;

}).each(function () {
    var self = this;

    this.file = null; // creo un atributo file en el div.drop-zone con valor nulo

    this.validationMessage = "Invalid file type";

    this.checkValidity = function() {
        // si el atributo file no es null y el tipo de archivo coincide  con el 
        // valor de la expresión regular del atributo filetype, es válido
        var regexp = $(self).attr("filetype");
        return self.file != null && self.file.type.match(regexp);
    };

});