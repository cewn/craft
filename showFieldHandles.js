if( typeof window.Craft !== 'undefined' && window.Craft.username ) {
	var fields = document.querySelectorAll('.fld-field');
	var fieldHeadings = document.querySelectorAll('#fields .field:not(#title-field) .heading');
	
	if( fields.length > 0 || fieldHeadings.length > 0 ){
		console.log('Craft Field Handles initialized');
		cpFieldHandles();
	}
}

function cpFieldHandles() {
	
	toggleButton();
	
	fetch(window.Craft.baseCpUrl+'/settings/fields')
  .then(function(response) {
      return response.text()
  })
  .then(function(html) {
      var parser = new DOMParser();
      var fieldsPageHTML = parser.parseFromString(html, 'text/html');
			var fields = fieldsPageHTML.querySelectorAll('#fields tbody tr');
			if( fields.length ) {
				var fieldData = [];
				fields.forEach(function(field) {
					var handle = field.querySelector('code').textContent;
					var id = field.getAttribute('data-id');
					fieldData.push([handle, id]);
				});
				
				if( fieldData ) { 
					localStorage.setItem('fieldData', JSON.stringify(fieldData));
				}
			}
	
  })
  .then(function() {
		renderEntryHandles();
		renderSectionHandles();

  })
  .then(function() {
  	createFieldLink();
  	updateHandles();
  	copyHandles();
  })
  .catch(function() {
  	console.log('fieldHandles Error: Failed to fetch fieldData');
  })
}

function createFieldLink() {
	var fieldStorage = localStorage.getItem('fieldData');
	if( fieldStorage ) {
		var parsedFieldStorage = JSON.parse(fieldStorage);
		var handles = document.querySelectorAll('.fieldHandle');
		
		parsedFieldStorage.forEach(function(parsedField) {
			handles.forEach(function(handle) {
				if( parsedField[0] == handle.value ) {
					var fieldLink = '<a class="handleIcon" data-icon="settings" href="'+window.Craft.baseCpUrl+'/settings/fields/edit/'+parsedField[1]+'" target="_blank"></a>';
					handle.parentNode.querySelector('legend').insertAdjacentHTML('beforeEnd', fieldLink);
		        }
		    });
		});
	} else {
		console.log('fieldHandles: fields not found in localStorage');
	}
}

function renderSectionHandles() {
  fields.forEach(function(field) {
    var childNodes = field.childNodes;
    childNodes.forEach(function(childNode) {
    	if( ! field.querySelector('.fieldset') ) {
	      if( childNode.tagName === "SPAN" ) {
	        var fieldHandle = childNode.getAttribute("title");
	        childNode.parentNode.insertAdjacentHTML('beforeEnd', renderHandleHTML(fieldHandle));
	      } else {
	      	console.log('fieldHandles cannot render due to Craft DOM change.');
	      }
    	}
    });
  });
  
  document.querySelectorAll('.fld-tab').forEach(function(tab) {
      tab.style.cssText = "height: auto;";
  });
}

function renderEntryHandles() {
	fields = document.querySelectorAll('.fld-field');
	fieldHeadings = document.querySelectorAll('#fields .field:not(#title-field) .heading');

  fieldHeadings.forEach(function(fieldHeading) {
    var fieldNodes = fieldHeading.childNodes;
    fieldNodes.forEach(function(fieldNode) {
    	if( ! fieldHeading.querySelector('.fieldset') ) {
	      if( fieldNode.tagName == "LABEL" ) {
	        var fieldHandle = fieldNode.getAttribute("for").split('-').pop();
	        fieldNode.parentNode.insertAdjacentHTML('beforeEnd', renderHandleHTML(fieldHandle));
	      }
    	}
    }); 
  });
}

function copyHandles() {
	var legendLabel = "Handle";
  var fieldHandles = document.querySelectorAll('.fieldHandle');
	
	fieldHandles.forEach(function(fieldHandle) {
	    document.addEventListener('click', function(e) {
	    	if( e.target && e.target.className === fieldHandle.className ) {
					var legend = e.target.parentNode.querySelector('.legendLabel');
					var legendText = legend.textContent;
					
					e.target.select();
					document.execCommand('copy');
					legend.textContent = "Copied";
					
					setTimeout(function() {
						legend.textContent = legendLabel;
					}, 300);
	    	}
	    });
	});
}

function renderHandleHTML(value) {
	return '<fieldset class="fieldset text"><legend><span class="legendLabel">Handle</span></legend><input class="fieldHandle" value="'+value+'" title="Click to copy" readonly="readonly"></fieldset>';
}

function toggleButton() {
	var buttonVar = '<div class="handleButton btn submit">fieldHandles</div>';
	document.querySelector('.btn.submit').insertAdjacentHTML('beforeBegin', buttonVar);
	var showButton = document.querySelector('.handleButton');
	
	if( window.localStorage.getItem('cpShowHandles') ) {
		document.body.classList.add('showHandles');
		showButton.classList.add('is-active');
	}
	
	showButton.addEventListener('click', function() {
		document.body.classList.toggle('showHandles');
		if( ! window.localStorage.getItem('cpShowHandles') ) {
			localStorage.setItem('cpShowHandles', true);
			showButton.classList.add('is-active');
			renderEntryHandles();
		} else {
			localStorage.removeItem('cpShowHandles');
			showButton.classList.remove('is-active');
		}
	});
}

function updateHandles() {
	var addButtons = document.querySelectorAll('.field .btn');
	addButtons.forEach(function(addButton) {
		addButton.addEventListener('click', function() {
			setTimeout(function() {
				renderEntryHandles();
			}, 1);
		});
	});
}
