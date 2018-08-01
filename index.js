//Reddit object
let reddit = {
    search: function(searchTerm, searchLimit, sortBy) {
        return fetch(`http://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`)
            .then(res => res.json())
            .then(data => data.data.children.map(data => data.data))
            .catch(err => console.log(err));
    }
}
//Get elements
const searchForm = document.getElementById('search-form'),
      searchInput = document.getElementById('search-input');
//Form event listener
searchForm.addEventListener('submit', (e) => {
   //Get search term
    const searchTerm = searchInput.value;
   //Get sort
    const sortBy = document.querySelector('input[name="sortby"]:checked').value;
  //Get limit
    const searchLimit = document.getElementById('limit').value;
  //Show message if empty
    if(searchInput.value === '') {
        showMessage('Please insert a search term', 'alert alert-danger');
    }
  //Clear input after submit
    searchInput.value = '';

    //Search reddit
    reddit.search(searchTerm, searchLimit, sortBy)
        .then(results => {
            console.log(results);
            let output = '<div class="card-columns">';
            results.forEach(post => {
                //Check for image
                let image = post.preview ? post.preview.images[0].source.url : 'https://assets.entrepreneur.com/content/3x2/2000/20180301190808-reddit-logo.jpeg?width=700&crop=2:1';
                //Loop through posts
                output += `
                    <div class="card">
                      <img class="card-img-top" src="${image}" alt="Card image cap">
                      <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${truncateText(post.selftext, 75)}</p>
                        <a href="${post.url}" class="btn btn-primary">Read More</a>
                        <hr>
                        <span class="badge badge-secondary mb-2">Subreddit: ${post.subreddit}</span>
                        <br>
                        <span class="badge badge-dark">Score: ${post.score}</span>
                      </div>
                    </div>
                `
            });
            output += '</div>';
            document.getElementById('results').innerHTML = output;
        });

    e.preventDefault();
});
//Show alert message
function showMessage(message, className) {
    //Condition is so that the message doesnt repeat when u spam the submit button
    if(!document.querySelector('.alert')) {
        const div = document.createElement('div');
        div.className = className;
        div.appendChild(document.createTextNode(`${message}`));
        //Get parent element
        const searchContainer = document.getElementById('search-container');
        //Get the element before which to display the message
        const search = document.getElementById('search');
        //Place the div
        searchContainer.insertBefore(div, search);
        //Rmv msg after 2sec
        setTimeout(function() {
            // var alertText = document
           document.querySelector('.alert').remove();
        }, 2000);
    }
}
//Truncate text
function truncateText(text, limit) {
    text = text.split(' ').slice(0, limit);
    return text;
}