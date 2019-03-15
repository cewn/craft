var fields = document.querySelectorAll('.fld-field');
var fieldHeadings = document.querySelectorAll('#fields .field:not(#title-field) .heading');

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
    fieldHeadings.forEach(function(fieldHeading) {
        var fieldNodes = fieldHeading.childNodes;
        fieldNodes.forEach(function(fieldNode) {
            if( fieldNode.tagName == "LABEL" ) {
                var fieldHandle = fieldNode.getAttribute("for").split('-').pop();
                fieldNode.parentNode.insertAdjacentHTML('beforeEnd', renderHandleHTML(fieldHandle));
                
            } 
        }); 
    });
}

function copyHandles() {
	var legendLabel = "Handle";
  var fieldHandles = document.querySelectorAll('.fieldHandle');
	
	fieldHandles.forEach(function(fieldHandle) {
	    fieldHandle.addEventListener('click', function(e) {
				var legend = fieldHandle.parentNode.querySelector('.legendLabel');
				var legendText = legend.textContent;
				
				fieldHandle.select();
				document.execCommand('copy');
				legend.textContent = "Copied";
				
				setTimeout(function() {
					legend.textContent = legendLabel;
				}, 300);
	    });
	});
}

function renderHandleHTML(value) {
	return '<fieldset class="fieldset text"><legend><span class="legendLabel">Handle</span></legend><input class="fieldHandle" value="'+value+'" title="Click to copy" readonly="readonly"></fieldset>';
}

function renderHandleButton() {
	
	if( window.localStorage.getItem('cpShowHandles') ) {
		document.body.classList.add('showHandles');
	}
	
	var buttonVar = '<div class="handleButton btn submit">Handles</div>';
	document.querySelector('.btn.submit').insertAdjacentHTML('beforeBegin', buttonVar);
	
	var showButton = document.querySelector('.handleButton');
	
	showButton.addEventListener('click', function() {
		document.body.classList.toggle('showHandles');
		if( ! window.localStorage.getItem('cpShowHandles') ) {
			localStorage.setItem('cpShowHandles', true);
		} else {
			localStorage.removeItem('cpShowHandles');
		}
	});
}

if( fields.length > 0 || fieldHeadings.length > 0 ){
	renderHandleButton();
	renderEntryHandles();
	renderSectionHandles();
	copyHandles();
	
	window.onload = fetchFieldStorage();
}
