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
    var inputs = $(".new-song-form input");
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
    if (audio_file_input.files.length > 0) {
        audio_file = audio_file_input.files[0];
    }

    var cover_file_input = $("#cover_file")[0];
    var cover_file = null;
    if (cover_file_input.files.length > 0) {
        cover_file = cover_file_input.files[0];
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