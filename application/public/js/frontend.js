function setFlashMessageFadeOut() {
    setTimeout(() => {
        let currentOpacity = 1.0;
        let timer = setInterval(() => {
            if(currentOpacity < 0.05){
                clearInterval(timer);
                flashElement.remove();
            }
            currentOpacity = currentOpacity - .05;
            flashElement.style.opacity = currentOpacity;
        },50);
    },4000);
}

function executeSearch() {
    let searchTerm = document.getElementById('search-text').value;
    if(searchTerm){
        location.replace('/');
        return;
    }
    let mainContent = document.getElementById('main-content');
    let searchURL = `/posts/search?search=${searchTerm}`
    fetch(searchURL)
    .then((data) => {
        console.log.apply(data);
    })
    .catch((err) => console.log(err));
}

let flashElement = docuent.getElementById('flash-message');
if(flashElement){
    setFlashMessageFadeOut();
}

let searchButton = document.getElementById('search-button');
if(searchButton){
    searchButton.onclick = executeSearch;
}