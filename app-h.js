$("#form-flashshortner").on("submit",function(e){
	e.preventDefault();

	/* get input value */
	var url = $("input[name=url]").val();

	/* animation */
	$("#result-flashshortner").html(`<div class="text-center"><div class="spinner-border text-primary" role="status"></div></div>`);

	/* get feed */
	$.ajax({
		url : '/feeds/posts/summary?alt=json-in-script',
		type: 'get',
		dataType: 'jsonp',
		success: function(data) {
			var link,
			content = data.feed.entry,
			links =new Array();	
			if (content !== undefined) {
				for (var i = 0; i < content.length; i++) {
					for (var j = 0; j < content[i].link.length; j++) {
						if (content[i].link[j].rel == "alternate") {
							link = content[i].link[j].href;
							break;
						}
					}
					links[i] = link;
					var randomIndex = parseInt(Math.random() * links.length);
				}

				// Generate the long flashshortner URL
				var longFlashshortnerLink = `${links[randomIndex]}#?${safeLinkConfig.parameterName}=${aesCrypto.encrypt(trimString(url),trimString(safeLinkConfig.secretKey))}&step=1`;

				// Use is.gd API to shorten the URL
				$.ajax({
					url: `https://is.gd/create.php?format=simple&url=${encodeURIComponent(longFlashshortnerLink)}`,
					type: 'get',
					dataType: 'text',
					success: function(shortenedUrl) {
						let displayLink = shortenedUrl;
						// Check if the response is a valid URL or an error message
						if (shortenedUrl.startsWith('http')) {
							displayLink = shortenedUrl;
						} else {
							// If is.gd returns an error, display the original long link
							console.error("is.gd shortening failed: ", shortenedUrl);
							displayLink = longFlashshortnerLink;
						}

						$("#result-flashshortner").html(`
							<div class="mb-3">
							<input id="resultLink" class="form-control" value="${displayLink}" onclick="this.focus();this.select()" readonly="readonly" type="text"/>
							</div>
							<div class="text-center">
							<button id="copyLink" type="button" class="btn btn-primary btn-sm">
							<i class="bi bi-clipboard"></i> Copy Link
							</button>
							</div>
						`);
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.error("is.gd AJAX error: ", textStatus, errorThrown);
						// On AJAX error, display the original long link
						$("#result-flashshortner").html(`
							<div class="mb-3">
							<input id="resultLink" class="form-control" value="${longFlashshortnerLink}" onclick="this.focus();this.select()" readonly="readonly" type="text"/>
							</div>
							<div class="text-center">
							<button id="copyLink" type="button" class="btn btn-primary btn-sm">
							<i class="bi bi-clipboard"></i> Copy Link
							</button>
							</div>
						`);
					}
				});

			}else {
				/* no feed found */
				$("#result-flashshortner").html(`<div class="alert alert-warning" role="alert">no Post Found, please create Post first and remember feed status must full or summary</div>`);
			}
		},
		error: function() {
			/* fail get feed */
			$("#result-flashshortner").html('<div class="alert alert-warning" role="alert">fail get Feed, please try again or check your feed !</div>');
		}
	});
});

/* copy button */
$(document).on('click', '#copyLink', function(element){
	$("#resultLink").select();
	document.execCommand("copy");
	$(this).html(`<i class="bi bi-clipboard-check"></i> Link Copied to Clipboard`);
	/* reset text to default */
	setTimeout(function(){
		$("#copyLink").html(`<i class="bi bi-clipboard"></i> Copy Link`);
	},1000);
});
