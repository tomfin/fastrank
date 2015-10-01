/* Contact Form Script */

/*
(function() {

	'use strict';

	var contactForm = {

		initialized: false,

		initialize: function() {

			if (this.initialized) { return; }
			this.initialized = true;

			this.build();
			this.events();

		},

		build: function() {

			this.validations();

		},

		events: function() {

		},

		validations: function() {

			var contactform = $('#contact-form'), //jshint ignore:line
				url = contactform.attr('action');

			contactform.validate({
				submitHandler: function(form) { //jshint ignore:line

					// Loading State
					var submitButton = $(this.submitButton); //jshint ignore:line
					submitButton.button('loading');

					// Ajax Submit
					$.ajax({ //jshint ignore:line
						type: 'POST',
						url: url,
						data: {
							'name': $('#contact-form #name').val(), //jshint ignore:line
							'email': $('#contact-form #email').val(), //jshint ignore:line
							'url': $('#contact-form #url').val(), //jshint ignore:line
							'message': $('#contact-form #message').val() //jshint ignore:line
						},
						dataType: 'json',
						success: function (data) {
							if (data.response === 'success') {

								$('#contact-alert-success').removeClass('hidden'); //jshint ignore:line
								$('#contact-alert-error').addClass('hidden'); //jshint ignore:line

								// Reset Form
								$('#contact-form .form-control') //jshint ignore:line
									.val('')
									.blur()
									.parent()
									.removeClass('has-success')
									.removeClass('has-error')
									.find('label.error')
									.remove();

								if(($('#contact-alert-success').position().top - 80) < $(window).scrollTop()){ //jshint ignore:line
									$('html, body').animate({ //jshint ignore:line
										 scrollTop: $('#contact-alert-success').offset().top - 80 //jshint ignore:line
									}, 300);
								}

							} else {

								$('#contact-alert-error').removeClass('hidden'); //jshint ignore:line
								$('#contact-alert-success').addClass('hidden'); //jshint ignore:line

								if(($('#contact-alert-error').position().top - 80) < $(window).scrollTop()){ //jshint ignore:line
									$('html, body').animate({ //jshint ignore:line
										scrollTop: $('#contact-alert-error').offset().top - 80 //jshint ignore:line
									}, 300);
								}

							}
						},
						complete: function () {
							submitButton.button('reset');
						}
					});
				},
				rules: {
					name: {
						required: true
					},
					email: {
						required: true,
						email: true
					},
					url: {
						required: false
					},
					message: {
						required: true
					}
				},
				highlight: function (element) {
					$(element) //jshint ignore:line
						.parent()
						.removeClass('has-success')
						.addClass('has-error');
				},
				success: function (element) {
					$(element) //jshint ignore:line
						.parent()
						.removeClass('has-error')
						.addClass('has-success')
						.find('label.error')
						.remove();
				}
			});

		}

	};

	contactForm.initialize();

})();
*/