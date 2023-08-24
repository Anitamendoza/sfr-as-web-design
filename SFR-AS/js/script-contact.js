$(document).ready(function() {
    var errorTimeout; // Variable para almacenar el temporizador del mensaje de error
    var formSubmitted = false; // Variable para indicar si el formulario se ha enviado

    // Mensajes de error en español
    var errorMessagesES = {
        nombre: "Ingrese nombre.",
        email: "Ingrese correo.",
        telefono: "Ingrese teléfono.",
        comentarios: "Ingrese mensaje.",
        recaptcha: "Por favor, verifica que no eres un robot."
    };

    // Mensajes de error en inglés
    var errorMessagesEN = {
        nombre: "Name is required.",
        email: "Email is required.",
        telefono: "Phone number is required.",
        comentarios: "Message is required.",
        recaptcha: "Please verify that you are not a robot."
    };

    $("#form1").submit(function(event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto
        clearTimeout(errorTimeout); // Limpiar el temporizador del mensaje de error
        // Limpiar mensajes de error anteriores
        $(".error-messages").remove();

        var form = $(this);
        var formData = form.serialize();

        // Obtener el idioma del formulario
        var formLanguage = form.attr("lang");
        var errorMessages = formLanguage === "en" ? errorMessagesEN : errorMessagesES;

        // Validar cada campo antes de enviar el formulario
        var nombre = $("input[name='nombre']").val();
        var email = $("input[name='email']").val();
        var telefono = $("input[name='telefono']").val();
        var comentarios = $("textarea[name='mensaje']").val(); // Cambio de 'comentarios' a 'mensaje'
        var recaptchaResponse = grecaptcha.getResponse(); // Obtener el valor del reCAPTCHA

        var camposVacios = [];

        if (nombre === "") {
            camposVacios.push("nombre");
        }
        if (email === "") {
            camposVacios.push("email");
        }
        if (telefono === "") {
            camposVacios.push("telefono");
        }
        if (comentarios === "") {
            camposVacios.push("mensaje");
        }
        if (recaptchaResponse === "") {
            camposVacios.push("recaptcha");
        }

        if (camposVacios.length > 0) {
            camposVacios.forEach(function(inputName) {
                showError(inputName, errorMessages[inputName]);
            });
            if (recaptchaResponse === "") {
                showRecaptchaError(recaptchaResponse, errorMessages.recaptcha);
            } else {
                hideRecaptchaError(); // Ocultar el mensaje de error del reCAPTCHA si hay otros campos vacíos
            }
            return;
        }

        if (!formSubmitted) {
            // Deshabilitar el botón de enviar para evitar envíos múltiples
            $("button[type='submit']").attr("disabled", true);
            $(".loading-icon-button").show(); // Mostrar el ícono giratorio
            $(".form-field-button").hide(); // Ocultar el botón de enviar

            $.ajax({
                type: "POST",
                url: form.attr("action"),
                data: formData,
                dataType: "json", // Indicar que se espera recibir una respuesta JSON del servidor
                success: function(response) {
                    formSubmitted = true;
                    handleFormResponse(response, formLanguage);
                },
                error: function() {
                    formSubmitted = true;
                    handleFormResponse({ status: "error" }, formLanguage);
                }
            });
        }
    });
    function handleFormResponse(response, language) {
        if (response.status === "success") {
            showSuccessMessage("Mensaje enviado", "Message sent", language);
            $(".loading-icon-button").hide(); // Ocultar el ícono giratorio
            resetForm(); // Resetear el formulario después de 3 segundos
        } else {
            showErrorMessage("Hubo un error. Inténtalo de nuevo más tarde.", "An error occurred. Please try again later.", language);
            $(".loading-icon-button").hide(); // Ocultar el ícono giratorio
            resetForm(); // Resetear el formulario después de 3 segundos
        }
    }

    // Función para mostrar un mensaje de éxito o error debajo del formulario
    function showMessage(message, isSuccess) {
        var messageDiv = $("<div class='" + (isSuccess ? "success-message" : "error-message") + "'></div>");
        messageDiv.text(message);
        $("#form-messages").html(messageDiv);
    }

    // Función para mostrar un mensaje de error debajo del campo correspondiente
    function showError(inputName, errorMessage) {
        var errorDiv = $("<div class='error-messages'></div>").text(errorMessage);
        $("input[name='" + inputName + "'], textarea[name='" + inputName + "']").after(errorDiv);
    }

    // Función para mostrar un mensaje de éxito debajo del formulario
    function showSuccessMessage(successMessageES, successMessageEN, language) {
        var successMessage = language === "en" ? successMessageEN : successMessageES;
        var successDiv = $("<div class='success-message'></div>").text(successMessage);
        $("#form-messages").html(successDiv);
    }


    // Evento "captcha" que se dispara cuando el reCAPTCHA se completa correctamente
    $(document).on("captcha", function(event, response) {
        hideRecaptchaError(); // Ocultar el mensaje de error del reCAPTCHA
    });

    // Función para mostrar un mensaje de error del reCAPTCHA debajo del formulario
    function showRecaptchaError(response, errorMessage) {
        var errorDiv = $("<div class='error-messages'></div>").text(errorMessage);
        $(".g-recaptcha").after(errorDiv);
    }

    // Función para ocultar el mensaje de error del reCAPTCHA
    function hideRecaptchaError() {
        $(".g-recaptcha + .error-messages").remove();
    }

    // Función para mostrar un mensaje de error debajo del formulario
    function showErrorMessage(errorMessageES, errorMessageEN, language) {
        var errorMessage = language === "en" ? errorMessageEN : errorMessageES;
        showMessage(errorMessage, false);
    }

    // Evento "captcha" que se dispara cuando el reCAPTCHA se completa correctamente
    $(document).on("captcha", function(event, response) {
        hideRecaptchaError(); // Ocultar el mensaje de error del reCAPTCHA
    });

    // Función para mostrar un mensaje de error del reCAPTCHA debajo del formulario
    function showRecaptchaError(response, errorMessage) {
        var errorDiv = $("<div class='error-messages'></div>").text(errorMessage);
        $(".g-recaptcha").after(errorDiv);
    }

    // Función para ocultar el mensaje de error del reCAPTCHA
    function hideRecaptchaError() {
        $(".g-recaptcha + .error-messages").remove();
    }

    // Función para ocultar el mensaje de error al enfocar otro campo
    $("input, textarea").on("focus", function() {
        hideErrorMessage($(this).attr("name"));
    });

    // Función para ocultar el mensaje de error de un campo específico
    function hideErrorMessage(inputName) {
        var errorMessages = $("input[name='" + inputName + "'] + .error-messages, textarea[name='" + inputName + "'] + .error-messages");
        errorMessages.remove();
    }

    // Función para resetear el formulario después de 3 segundos
    function resetForm() {
        setTimeout(function() {
            $("#form1")[0].reset(); // Resetear el formulario
            grecaptcha.reset(); // Resetear el reCAPTCHA
            $(".error-messages").remove(); // Eliminar los mensajes de error
            $(".success-message, .error-message").remove(); // Eliminar los mensajes de éxito y error
            $("#form-messages").empty(); // Eliminar el contenido del div #form-messages
            $("button[type='submit']").attr("disabled", false); // Habilitar el botón de enviar nuevamente
            $(".loading-icon-button").hide(); // Ocultar el ícono giratorio
            $(".form-field-button").show(); // Mostrar el botón de enviar nuevamente
        }, 5000); // Reiniciar el formulario después de 5 segundos
    }
    // Resto del código (manejo de mensajes, eventos, etc.) se mantiene igual

});
