var entryTypeUrls = [];
var fields = [];
var responses = [];

fetch(window.Craft.baseCpUrl + '/settings/sections/')
	  .then(function(response) {
	    return response.text();
	  })
	  .then(function(html) {
	    var parser = new DOMParser();
	    var htmlResponse = parser.parseFromString(html, 'text/html');
	    var entryTypes = htmlResponse.querySelectorAll('#sections tr a[href*="entrytypes/"]');
	    if (entryTypes.length) {
	      entryTypes.forEach(function(entryType) {
	        entryTypeUrls.push([entryType.href]);
	      });
	    }
	  })
		.then(done => {
			entryTypeUrls.forEach(entryTypeUrl => {
				getEntryTypeFields(entryTypeUrl);
            });
        });

function getEntryTypeFields(url) {
	fetch(url)
      .then(function(response, url) {
			responses.push(response.status);
            return response.text();
          })
          .then(function(html) {
            var parser = new DOMParser();
            var htmlResponse = parser.parseFromString(html, 'text/html');
			var handle = htmlResponse.querySelector('#handle');
            var fieldTabs = htmlResponse.querySelectorAll('.fld-tabs .fld-tab');

			if(handle) {
				fields.push(handle.value);
    		}

            if (fieldTabs.length) {
              fieldTabs.forEach(function(fieldTab) {
                fields.push('\xa0' + fieldTab.querySelector('.tab span').textContent);
				fieldTab.querySelectorAll('.fld-field > span').forEach(field => {
					fields.push('\xa0\xa0' +field.title);
                });
              });
            }
          })
		.then(ready => {				
            responses.length === entryTypeUrls.length && responses.map((response, idx) => {
                if( response === 200 && idx === entryTypeUrls.length-1 ) {
					console.log(fields);
                }
            });
    	});
}
