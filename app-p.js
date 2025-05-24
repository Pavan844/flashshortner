/* function get parameter */
const getParameter = (name) => {
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results == null ? null : decodeURI(results[1]) || 0;
}	

/* flashshortner logic */

/* get urlHash and step from parameter */
const urlHash = getParameter(safeLinkConfig.parameterName);
const currentStep = getParameter("step");

// Select the main blog post content element
const blogPostElement = $("#Blog1");
// Select the flashshortner step sections
const step1Element = $("#main-flashshortner-step1");
const step2Element = $("#main-flashshortner-step2");
const finalRedirectElement = $("#main-final-redirect");

// Initially hide all flashshortner sections
step1Element.addClass('d-none');
step2Element.addClass('d-none');
finalRedirectElement.addClass('d-none');

// Determine which content to show based on the step parameter
if (urlHash != null && currentStep == "1") {
	// Hide the main blog post and show Step 1
	blogPostElement.addClass('d-none');
	step1Element.removeClass('d-none');

	/* show and enable button getlink */
	$("#getlink1").removeClass('d-none');
	$("#getlink1").prop('disabled', false);

	// Initial display of the first timer
	$("#timer1").html(`<div class="countdown">
		<span class="timer">${safeLinkConfig.countDownTimer}</span>
		<span class="seconds">seconds</span>
	</div>`);

	// Start the first countdown
	var timer1Element = $("#timer1");
	var delay1 = safeLinkConfig.countDownTimer;
	var delta = 1000;
	var start1 = 0;

	window.setTimeout(function() {
		var time1 = delay1 * 1000;
		var countDown1;

		countDown1 = setInterval(function() {
			if (!start1) {
				return;
			}
			if (window.blurred) {
				return;
			}

			time1 -= delta;
			timer1Element.find(".timer").text(time1 / 1000);

			if (time1 <= 0) {
				clearInterval(countDown1);
				timer1Element.remove();
				$("#getlink1").text("Go to Next Step"); // Change button text
				$("#getlink1").prop('disabled', false); // Enable the button

				// When button is clicked, navigate to step 2
				$("#getlink1").on("click", function() {
					// Navigate to the same page but with step=2
					window.location.href = location.href.split("#")[0] + `#?${safeLinkConfig.parameterName}=${urlHash}&step=2`;
				});
			}
		}, delta);
	}, 500);

	// Activate timer on button click (like before)
	$("#getlink1").on("click", function() {
		if (!start1) {
			start1 = 1;
		}
	});

} else if (urlHash != null && currentStep == "2") {
	// Hide the main blog post and show Step 2
	blogPostElement.addClass('d-none');
	step2Element.removeClass('d-none');

	// Logic for Step 2 (Loading and automatic redirect after a short delay)
	var delay2 = 3; // Short timer duration for loading
	setTimeout(function() {
		// Perform final redirect
		var urlHashDecode = aesCrypto.decrypt(trimString(urlHash), trimString(safeLinkConfig.secretKey));
		(urlHashDecode) ? window.location.href = urlHashDecode : alert('hash invalid');
	}, delay2 * 1000);

} else {
	/* if urlHash does not exist or step is not 1 or 2, show original post and remove flashshortner sections */
	blogPostElement.removeClass('d-none'); // Show the main blog post content
	step1Element.addClass('d-none'); // Hide step 1
	step2Element.addClass('d-none'); // Hide step 2
	finalRedirectElement.addClass('d-none'); // Hide final redirect
}

// Existing window blur/focus handling
window.onblur = function() {
	window.blurred = true;
};
window.onfocus = function() {
	window.blurred = false;
};			
