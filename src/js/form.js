var $ = require('jquery');
var songsListManager = require('./songs-list-manager');


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

    // cancion que quiero crear
    var song = {
        artist: $("#artist").val(), // document.getElementById("artsit").value
        title: $("#title").val(),
        audio_url: $("#audio_url").val(),
        cover_url: $("#cover_url").val()
    };

    // petición AJAX para guardar la información en el backend
    $.ajax({
        url: "/api/songs/",
        method: "post",
        data: song,
        beforeSend: function(){ // antes de enviar la petición
            $(inputs).attr("disabled", true); // deshabilito todos los inputs
            // Cambio el texto del botón y lo deshabilito
            $('.new-song-form button').text("Saving song...").attr("disabled", true);
        },
        success: function(response) {
            $("form")[0].reset(); // borro todos los campos del formulario
            $("#artist").focus(); // pongo el foco en el campo artist
            songsListManager.load();
        },
        error: function() {
            console.error("ERROR", arguments);
        },
        complete: function(){
            $(inputs).attr("disabled", false); // habilito todos los inputs
            // Cambio el texto del botón y lo habilito
            $('.new-song-form button').text("Save Song").attr("disabled", false);
        }
    });

    return false; // == e.preventDefault();
});