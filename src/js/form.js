var $ = require('jquery');


// al hacer click eb el botón de guardar
// enviamos una petición AJAX para almacenar la canción
$('.new-song-form button').on("click", function(){
	
	// Validación de inputs
	var inputs = $(".new-song-form input");
	for (var i = 0; i < inputs.length; i++){
		var input = inputs[i];
		if (input.checkValidity() == false) {
			alert(input.validationMessage);
			input.focus();
			return false;
		}
	};

	// cancion que quiero crear
	var song = {
		artist:$("#artist").val(),
		title: $("#title").val(),
		audio_url: $("#audio_url").val(),
		cover_url: $("#cover_url").val()
	};

	// petición AJAX para guardar la información en el backend
	$.ajax({
		url: "/api/songs/",
		method: "post",
		data: song,
		beforeSend: function() { // antes de enviar la petición
			$(inputs).attr("disabled", true); //deshabilitar todos los inputs
			// cambio el texto del botón y lo deshabilito
			$('.new-song-form button').text("Saving song...").attr("disabled", true);
		},
		success: function(response) {
			$("form")[0].reset(); // borro todos los campos del formulario
			$("#artist").focus(); // pongo el foco en el campo artist 
		},
		error: function() {
			console.log("ERROR", arguments);
		},
		complete: function() {
			$(inputs).attr("disabled", false); //habilitar todos los inputs
			// cambio el texto del botón y lo deshabilito
			$('.new-song-form button').text("Save Song").attr("disabled", false);
		}
	});

	return false; // == e.preventDefault();
});