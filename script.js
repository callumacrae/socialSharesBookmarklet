'use strict';

var socialBookmarkletCallbacks = {};

(function () {
	var enc = encodeURIComponent,
		infoDiv = document.createElement('div');
	infoDiv.className = 'socialBookmarkletDiv';
	infoDiv.style.position = 'fixed';
	infoDiv.style.top = infoDiv.style.right = 0;
	infoDiv.style.display = 'none';
	infoDiv.style.background = 'white';
	infoDiv.style.border = '1px black solid';
	infoDiv.style.padding = '2px 5px';
	infoDiv.style.fontSize = '14pt';

	infoDiv.innerHTML = '<a></a><br><span></span>';

	document.body.appendChild(infoDiv);


	document.addEventListener('mouseover', function (e) {
		var target = e.target ? e.target : e.srcElement;

		if (target.tagName !== 'A' || !/^https?:\/\//.test(target.href)) {
			return;
		}

		var counts = {},
			data = target.dataset;

		// If already requested recently, use again
		if (Number(data.countsLastRequest) + 5000 > Date.now()) {
			counts.facebook = data.countsFacebook;
			counts.twitter = data.countsTwitter;

			handleCounts(target, counts, true);
			return;
		}

		var twitterCallback = randomString(16);
		socialBookmarkletCallbacks[twitterCallback] = function (result) {
			counts.twitter = result.count;

			if (typeof counts.facebook !== 'undefined') {
				handleCounts(target, counts);
			}
		};
		injectScript('http://urls.api.twitter.com/1/urls/count.json?url=' +
			enc(target.href) + '&callback=socialBookmarkletCallbacks.' + twitterCallback);

		var facebookCallback = randomString(16);
		socialBookmarkletCallbacks[facebookCallback] = function (result) {
			counts.facebook = result.shares || 0; // Will be undefined if 0

			if (typeof counts.twitter !== 'undefined') {
				handleCounts(target, counts);
			}
		};
		injectScript('https://graph.facebook.com/?id=' + enc(target.href) +
			'&callback=socialBookmarkletCallbacks.' + facebookCallback);
	});

	document.addEventListener('mouseout', function (e) {
		if ((e.target ? e.target : e.srcElement).tagName === 'A') {
			infoDiv.style.display = 'none';
		}
	});

	function handleCounts(target, counts, cached) {
		if (!cached) {
			target.dataset.countsLastRequest = Date.now();
		}

		target.dataset.countsTwitter = counts.twitter;
		target.dataset.countsFacebook = counts.facebook;

		var a = infoDiv.getElementsByTagName('a')[0];
		a.href = target.href;
		a.innerHTML = target.href;

		var span = infoDiv.getElementsByTagName('span')[0];
		span.innerHTML = 'Twitter: ' + counts.twitter + ', Facebook: ' + counts.facebook;

		infoDiv.style.display = 'block';
	}

	function randomString(len) {
		var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		return new Array(len).join().split(',')
			.map(function () {
				return chars.charAt(Math.floor(Math.random() * chars.length));
			}).join('');
	}

	function injectScript(url) {
		var script = document.createElement('script');
		script.async = true;
		script.src = url;
		document.body.appendChild(script);
	}
})();
