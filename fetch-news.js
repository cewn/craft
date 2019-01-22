let app = document.getElementById('app');

function renderNewsItem(title, content) {
    return app.innerHTML += '<div><h4>'+ title +'</h4><article>' + content + '</article></div>';
}

let fetchUrl = 'news.json';
let currentPagination;
let maxPagination;

function getNewsItems() {

    app.innerHTML += '<span id="loading">loading...</span>';

    if( typeof currentPagination !== 'undefined' ) {
        if( currentPagination < maxPagination ) {
            currentPagination++;
            fetchUrl = 'news.json?page='+ currentPagination +'';
        } else {
            alert('end reached');
            return;
        }
    }   

    fetch(fetchUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonData) {
            document.getElementById('loading').remove();

            currentPagination = jsonData.meta.pagination.current_page;
            maxPagination = jsonData.meta.pagination.total_pages;

            for(let i = 0; i < jsonData.data.length; i++) {
                renderNewsItem(jsonData.data[i].title, jsonData.data[i].content);
            }
        })
}

document.addEventListener('DOMContentLoaded', function() {
    getNewsItems();
});

let loadMore = document.getElementById('load-more');
loadMore.addEventListener('click', function(event) {
    event.preventDefault();
    getNewsItems();
});
