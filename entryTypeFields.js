var entryTypeUrls = [];
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
      .then(function(response) {
            return response.text();
          })
          .then(function(html) {
            var parser = new DOMParser();
            var htmlResponse = parser.parseFromString(html, 'text/html');
			var handle = htmlResponse.querySelector('#handle');
            var fieldTabs = htmlResponse.querySelectorAll('.fld-tabs .fld-tab');

			if(handle) {
				console.log(handle.value);
    		}

            if (fieldTabs.length) {
              fieldTabs.forEach(function(fieldTab) {
                console.log('\xa0' + fieldTab.querySelector('.tab span').textContent);
				fieldTab.querySelectorAll('.fld-field > span').forEach(field => {
					console.log('\xa0\xa0' +field.title);
                });
              });
            }
          })
}
