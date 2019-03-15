if( typeof window.Craft !== 'undefined' && window.Craft.username ) {
	
	console.log('Craft Field Handles initialized');

	var fields = document.querySelectorAll('.fld-field');
	var fieldHeadings = document.querySelectorAll('#fields .field:not(#title-field) .heading');
	
	if( fields.length > 0 || fieldHeadings.length > 0 ){
		renderHandleButton();
		renderEntryHandles();
		renderSectionHandles();
		copyHandles();
		updateHandles();
		
		window.onload = fetchFieldStorage();
	}
	
	function createFieldStorage() {
		if( window.location.href === window.Craft.baseCpUrl+'/settings/fields' ) {
			var fields = document.querySelectorAll('#fields tbody tr');
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
		}
	}
	
	createFieldStorage();
	
	function fetchFieldStorage() {
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
		}
	}
	
	function renderSectionHandles() {
	  fields.forEach(function(field) {
	    var field = field.childNodes;
	    field.forEach(function(child) {
	      if( child.tagName === "SPAN" ) {
	        var fieldHandle = child.getAttribute("title");
	          child.parentNode.insertAdjacentHTML('beforeEnd', renderHandleHTML(fieldHandle));
	          
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
		    		console.log('yay!')
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
	
	function renderHandleButton() {
		
		var buttonVar = '<div class="handleButton btn submit">devMode</div>';
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
	
}
