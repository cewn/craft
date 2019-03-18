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
					var type = field.querySelector('[data-title="Type"]').innerText.replace(/^\s+|\s+$/g, '');
					
					var id = field.getAttribute('data-id');
					fieldData.push([handle, id, type]);
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
							if(parsedField[2].indexOf('Matrix') !== -1 ) {
								var codeLink = '<span class="codeIcon" data-field-id="'+parsedField[1]+'"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M24 10.935v2.131l-8 3.947v-2.23l5.64-2.783-5.64-2.79v-2.223l8 3.948zm-16 3.848l-5.64-2.783 5.64-2.79v-2.223l-8 3.948v2.131l8 3.947v-2.23zm7.047-10.783h-2.078l-4.011 16h2.073l4.016-16z"/></svg></span>';
								handle.parentNode.querySelector('legend').insertAdjacentHTML('beforeEnd', codeLink);
							}
					
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
    	if( ! field.querySelector('.fieldHandles') ) {
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
	
	codeGenerators = document.querySelectorAll('.codeIcon');
	document.addEventListener('click', function(e) {
		if( e.target && e.target.className === 'codeIcon' ) {
			var target = e.target;
			var blockId = target.getAttribute('data-field-id');
			var blockName = target.parentNode.parentNode.querySelector('.fieldHandle').value;
			if( target.parentNode.parentNode.querySelector('.matrixCode') ) {
				target.parentNode.parentNode.querySelector('.matrixCode').remove();
			} else {
				generateMatrixCode(blockId, blockName, target);	
			}	
		}
	});

  fieldHeadings.forEach(function(fieldHeading) {
    var fieldNodes = fieldHeading.childNodes;
    fieldNodes.forEach(function(fieldNode) {
    	if( ! fieldHeading.querySelector('.fieldHandles') ) {
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
	return '<fieldset class="fieldHandles text"><legend><span class="legendLabel">Handle</span></legend><input class="fieldHandle" value="'+value+'" title="Click to copy" readonly="readonly"></fieldset>';
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

function generateMatrixCode(blockId, blockName, target) {
	var matrixData = [];
	var matrixCode = [];
	
	fetch(window.Craft.baseCpUrl+'/settings/fields/edit/'+ blockId +'')
	  .then(function(response) {
	      return response.text()
	  })
	  .then(function(html) {
	    var parser = new DOMParser();
	    var matrixConfigPage = parser.parseFromString(html, 'text/html');
	    var blockTypeHandles = matrixConfigPage.querySelectorAll('.blocktypes .handle');
	    if( blockTypeHandles.length ) {
	        blockTypeHandles.forEach(function(blockTypeHandle) {
				var blockType = blockTypeHandle.textContent;
	            var blockTypeID = blockTypeHandle.parentNode.getAttribute('data-id');
				var fields = matrixConfigPage.querySelectorAll('.fields [data-id="'+blockTypeID+'"] .handle');
				var fieldData = [];
				fields.forEach(function(field) {
					fieldData.push(field.textContent);
	            });
	            matrixData.push([blockType, fieldData]);
	        });
	    }
	  })
		.then(function() {
		    var blockFieldData;
		    matrixCode += '{% for block in '+blockName+' %} \n';
				matrixData.forEach(function(data, index) {
				var blockType = data[0];
				var blockFields = data[1];
				var blockFieldData = [];
				if( blockFields ) {
					blockFields.forEach(function(blockField) {
						blockFieldData +=  '\xa0\xa0{{ block.' + blockField.replace(/^\s+|\s+$/g, '') + ' }} \n';
		            });
		        }
				if( index === 0 ) {
					matrixCode += '\xa0{% if block.type == \''+blockType+'\' %} \n' + blockFieldData;
		        } else if( index <= data.length ) {
					matrixCode += '\xa0{% elseif block.type == \''+blockType+'\' %} \n' + blockFieldData;
		        }
		    });
			matrixCode += '\xa0{% endif %} \n';
			matrixCode += '{% endfor %}';
		})
		.then(function() {
			if( ! target.parentNode.parentNode.querySelector('.matrixCode') ) {
				target.parentNode.parentNode.insertAdjacentHTML('beforeEnd', '<textarea class="matrixCode" spellcheck="false" readonly="readonly">'+matrixCode+'</textarea>');
			}
		});
}
