let accordionCollection = document.getElementsByClassName('accordion__item');
let accordionItems = Array.from(accordionCollection);
let accordionTransition = 'transition: all .6s ease';

accordionItems.forEach(function(accordionItem) {
    accordionItem.addEventListener('click', function() {
    let child = accordionItem.querySelector('.accordion__content');

        // Height not set
        if( child.style.height.indexOf('%') === -1 ) {
            child.style = 'height: '+child.scrollHeight+'px; '+accordionTransition+'';
        } else {
            // Set height
            child.style = 'height: '+child.scrollHeight+'px; transition: none;';
            // Wait and clear
            setTimeout(function() {
               child.style = 'height: 0; '+accordionTransition+';';
            }, 1);
        }

        child.addEventListener('transitionend', function () {
            if( child.style.height !== '0px' && child.offsetHeight !== 0 ) {
                child.style = 'height: 100%;';
            } else {
                child.removeAttribute('style');
            }
        });
    });
});
