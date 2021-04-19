let container = document.getElementById('container');
let jSon = "https://jsonplaceholder.typicode.com/albums/2/photos"
fetch(jSon)
    .then(response => response.json())
    .then(photos => {
        console.log(photos)
        photos.forEach((photo) => {
            insert(createPhotoCard(photo))
        })
        count()
    });

function insert(photoCard) {
    container.appendChild(photoCard);
    return container;
}

function count() {
    document.getElementById('items-count').innerHTML = `There are ${container.childElementCount} photo(s) being shown`
}

function createPhotoCard(photo) {
    let photoCard = document.createElement('div');
    photoCard.className = "photoCard";
    photoCard.innerHTML =
        `<div class="photoCard">
            <p>${photo.title}</p>
            <p><img itemprop="img" src='${photo.url}' /></p>
            </div>
            `;
    photoCard.width = "100";
    photoCard.height = "100";

    photoCard.addEventListener('click', (e) => {
        photoCard.classList.toggle('fade-out')
        setTimeout(() => {
            photoCard.remove();
            count();
        }, 200);
    });
    return photoCard;
}
