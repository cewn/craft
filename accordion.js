let accordionCollection = document.getElementsByClassName('accordion__trigger');
let accordionItems = Array.from(accordionCollection);
let accordionTransition = 'transition: all .6s cubic-bezier(.5, .5, 0, 1)';

accordionItems.forEach(function(accordionItem) {
    accordionItem.addEventListener('click', function() {
    let child = accordionItem.parentNode.querySelector('.accordion__content');
        if( child.style.height.indexOf('%') === -1 ) {
            accordionItem.parentNode.classList.add('is-open');
            child.style = 'height: '+child.scrollHeight+'px; '+accordionTransition+'';
        } else {
            accordionItem.parentNode.classList.remove('is-open');
            child.style = 'height: '+child.scrollHeight+'px; transition: none;';
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
