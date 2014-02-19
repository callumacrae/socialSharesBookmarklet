# Social shares bookmarklet

This is the repository for a bookmarklet which shows you how many times a link has been shared when you hover the mouse over it.

To use the bookmarklet, add the following as a bookmark:

```
javascript:(function(){var s=document.createElement('script');s.src='http://macr.ae/stuff/ssb/script.min.js';document.body.appendChild(s);})();
```

Unminified, it does the following:

```javascript
(function () {
	var s = document.createElement('script');
	s.src = 'http://macr.ae/stuff/ssb/script.min.js';
	document.body.appendChild(s);
})();
```