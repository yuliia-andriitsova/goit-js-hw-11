import './css/styles.css';
import { BASE_URL, getPhoto } from './api/fetch';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('#search-form');
const moreBtn = document.querySelector('.load-more');
let page = 1;
const itemPerPage = 40;
let searchValue = '';

const totalPages = Math.ceil(500 / 40);

formEl.addEventListener('submit', onSubmit);

async function loadMoreCards(searchValue) {
  page += 1;
  const data = await getPhoto(searchValue, page);
  // data.hits.forEach(photo => {
  //   createCardMarkup(photo);
  // });

  createGalleryMarkup(data.hits);
  if (page === totalPages) {
    moreBtn.classList.add('visually-hidden');
  }
  doLightbox();
}

function onSubmit(event) {
  event.preventDefault();

  clearMarkup(galleryEl);

  searchValue = event.currentTarget[0].value;
  mountData(searchValue);
}

function moreBtnClbc() {
  loadMoreCards(searchValue);
}

async function mountData(searchValue) {
  try {
    const data = await getPhoto(searchValue, page);

    moreBtn.removeEventListener('click', moreBtnClbc);

    moreBtn.classList.remove('visually-hidden');
    moreBtn.addEventListener('click', moreBtnClbc);
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);

    // data.hits.forEach(photo => {
    //   createCardMarkup(photo);
    // });
    createGalleryMarkup(data.hits);
    doLightbox();
  } catch (error) {
    console.log('error', error);
  }
  // let lightbox = new SimpleLightbox('.gallery a', {
  //   // подключаем функции
  //   captionsData: 'alt',
  //   captionDelay: 250,
  // });
}

// console.log(lightbox);

function doLightbox() {
  const linkImg = document.querySelector('.link-img');
  linkImg.addEventListener('click', openModal);

  function openModal(event) {
    event.preventDefault();
  }

  let lightbox = new SimpleLightbox('.photo-card a', {
    captionDelay: 250,
    captionsData: 'alt',
  });
}

function createGalleryMarkup(cardsArr) {
  const markup = cardsArr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
    <a class='link-img' href=${largeImageURL}><img src=${webformatURL} alt=${tags}  height="80%" loading="lazy"  class="card-img"/></a>
  <div class="info">
    <p class="info-item">
      <b class="info-label">Likes </b><span class="info-span">${likes}</span>
    </p>
    <p class="info-item">
      <b class="info-label">Views </b><span class="info-span">${views}</span>
    </p>
    <p class="info-item">
      <b class="info-label">Comments </b><span class="info-span">${comments}</span>
    </p>
    <p class="info-item">
      <b class="info-label">Downloads </b><span class="info-span">${downloads}</span>
    </p>
  </div>
</div>`
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
}

function clearMarkup(element) {
  element.innerHTML = '';
}
