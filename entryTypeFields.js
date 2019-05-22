var entryTypeUrls = [];
var fields = {};
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
            var fieldTabsEl = htmlResponse.querySelectorAll('.fld-tabs .fld-tab');
			var fieldTabs = {};

			if (fieldTabsEl.length) {
              fieldTabsEl.forEach(function(fieldTab) {

			var tabFields = [];
                fieldTabs = {
					...fieldTabs,
					[fieldTab.querySelector('.tab span').textContent]: tabFields 
                }
				fieldTab.querySelectorAll('.fld-field > span').forEach(field => {
					tabFields.push(field.title);
                });

              });

			if(handle) {
				fields = {
					...fields,
					[handle.value]: fieldTabs
                }
    		}

            
            }
          })
		.then(ready => {				
            responses.length === entryTypeUrls.length && responses.map((response, idx) => {
                if( response === 200 && idx === entryTypeUrls.length-1 ) {
                  var reponseEl = document.createElement("code"); 
                  reponseEl.innerHTML = fields;
                  document.body.appendChild(reponseEl); 
				  reponseEl.style = `
					position: fixed;
					padding: 32px;
					top: 0;
					z-index: 500;
					background: black;
					color: white;
					max-height: calc(100vh - 64px);
					overflow: auto;
					`;
					console.log(fields.sort());
                }
            });
    	});
}
