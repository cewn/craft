var unfoldSelector = document.getElementsByClassName('accordion__trigger');
Array.prototype.forEach.call(unfoldSelector, function(unfoldItem) {
    unfoldItem.addEventListener('click', function() {
        var child = unfoldItem.parentNode.querySelector('.accordion__content');
        if (child.style.height.indexOf('%') === -1) {
            unfoldItem.parentNode.classList.add('is-open');
            child.style.height = child.scrollHeight+'px';
        } else {
            unfoldItem.parentNode.classList.remove('is-open');
            child.style.transition = 'none';
            child.style.height = child.scrollHeight+'px';
            setTimeout(function () {
                child.style.transition = null;
                child.style.height = '0px';
            }, 1);
        }

        child.addEventListener('transitionend', function () {
            if (child.style.height !== '0px' && child.offsetHeight !== 0) {
                child.style.height = '100%';
            } else {
                child.removeAttribute('style');
            }
        });
    });
});
