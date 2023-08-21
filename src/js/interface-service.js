import Notiflix from 'notiflix';
import throttle from 'lodash.throttle';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

class MarkUpInterface {
  constructor({ form, gallery, buttonMore }) {
    this.form = document.querySelector(form);
    this.gallery = document.querySelector(gallery);
    this.buttonMore = document.querySelector(buttonMore);
    this.simpleGallery = new simpleLightbox(`${gallery} a`);
    this.scrollCallback = null;
    this.throttleFoo = null;
  }

  setNewElement(name, id) {
    this[name] = document.querySelector(id);
  }

  onListenerScroll(callback) {
    this.scrollCallback = callback.bind(this);
    this.throttleFoo = throttle(this.scrollCallback, 500);
    window.addEventListener('scroll', this.throttleFoo);
  }

  offListenerScroll() {
    window.removeEventListener('scroll', this.throttleFoo);
  }

  markUpGallery(arr) {
    const markUp = arr
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
         <div class = "img-box" >
       <a class="gallery-link" href="${largeImageURL}">
        <img class="img" src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        </div>   
          <ul class="info">
            <li class="info-item">Likes <p> ${likes} </p></li>
            <li class="info-item">Views <p>${views}</p></li>
            <li class="info-item">Comments <p>${comments}</p></li>
            <li class="info-item">Downloads <p>${downloads}</p></li>
          </ul> 
        </div>
`
      )
      .join('');

    this.gallery.insertAdjacentHTML('beforeend', markUp);
    this.simpleGallery.refresh();
  }

  clearGallery() {
    this.gallery.innerHTML = '';
  }

  showButtonLoadMore() {
    this.buttonMore.classList.remove('is-hidden');
  }

  hiddenButtonLoadMore() {
    this.buttonMore.classList.add('is-hidden');
  }

  smoothScroll() {
    const { height } = this.gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: height * 1.75,
      behavior: 'smooth',
    });
  }

  showNotification(message, addInfo) {
    switch (message) {
      case 'notFound':
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        break;

      case 'notMoreImages':
        Notiflix.Notify.success(
          "We're sorry, but you've reached the end of search results.",
          { position: 'center-bottom' }
        );
        break;

      case 'foundedImages':
        Notiflix.Notify.success(`Hooray! We found ${addInfo} images.`, {
          position: 'rigth-bottom',
        });
        break;
    }
  }
}

export { MarkUpInterface };
