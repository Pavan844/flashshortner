/* function get parameter */
const getParameter = (name) => {
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results == null ? null : decodeURI(results[1]) || 0;
}	

/* flashshortner logic */

/* get urlHash and step from parameter */
const urlHash = getParameter(safeLinkConfig.parameterName);
const currentStep = getParameter("step");

// Initially hide all flashshortner sections
$("#main-flashshortner-step1").hide();
$("#main-flashshortner-step2").hide();
$("#main-final-redirect").hide();

// Logic for Step 1 or Step 2 based on parameter
if (urlHash != null && currentStep == "1") {
	// Show Step 1 content
	$("#Blog1").hide(); // Hide the main blog post content
	$("#main-flashshortner-step1").show();

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
	// Show Step 2 content
	$("#Blog1").hide(); // Hide the main blog post content
	$("#main-flashshortner-step2").show();

	// Logic for Step 2 (Loading and automatic redirect after a short delay)
	var delay2 = 3; // Short timer duration for loading
	setTimeout(function() {
		// Perform final redirect
		var urlHashDecode = aesCrypto.decrypt(trimString(urlHash), trimString(safeLinkConfig.secretKey));
		(urlHashDecode) ? window.location.href = urlHashDecode : alert('hash invalid');
	}, delay2 * 1000);

} else {
	/* if urlHash does not exist or step is not 1 or 2, show original post and remove flashshortner sections */
	$("#Blog1").show(); // Show the main blog post content
	$("#main-flashshortner-step1").remove(); // Remove step 1 HTML
	$("#main-flashshortner-step2").remove(); // Remove step 2 HTML
	$("#main-final-redirect").remove(); // Remove final redirect HTML
}

// Existing window blur/focus handling
window.onblur = function() {
	window.blurred = true;
};
window.onfocus = function() {
	window.blurred = false;
};			
