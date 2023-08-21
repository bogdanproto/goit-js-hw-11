import { pixabayApi } from './js/api-service';
import { MarkUpInterface } from './js/interface-service';

let totalImg = 0; //saved value "how many img founded"

const ref = {
  form: '.search-form',
  gallery: '.gallery',
  buttonMore: '.load-more',
};

const interFace = new MarkUpInterface(ref);
interFace.setNewElement('checkBox', '.infinity-check');

interFace.form.addEventListener('submit', onShowResult);
interFace.buttonMore.addEventListener('click', loadMorelResult);
interFace.checkBox.addEventListener('change', switchInfiniteScroll);

//switchOn or switchOff infinite scroll
function switchInfiniteScroll(evt) {
  const { checked } = evt.currentTarget;

  if (checked) {
    interFace.hiddenButtonLoadMore();
    interFace.onListenerScroll(loadMorelResult);
  } else {
    interFace.offListenerScroll();
    if (totalImg) {
      interFace.showButtonLoadMore();
    }
  }
}

//First download images
function onShowResult(evt) {
  evt.preventDefault();
  interFace.hiddenButtonLoadMore();
  interFace.clearGallery();

  const { searchQuery, onScroll } = evt.currentTarget.elements;

  if (!searchQuery.value) {
    interFace.showNotification('notFound');
    return;
  }
  pixabayApi
    .fetchImages(searchQuery.value)
    .then(data => {
      const { totalHits, hits } = data;
      totalImg = totalHits;

      if (!totalHits) {
        interFace.showNotification('notFound');
      } else {
        interFace.markUpGallery(hits);
        interFace.showNotification('foundedImages', totalHits);
        totalImg -= hits.length;

        if (totalImg && !onScroll.checked) {
          interFace.showButtonLoadMore();
        }
      }
    })
    .catch(error => console.log(error));
}

//next download images
function loadMorelResult() {
  const heightGallery = interFace.gallery.scrollHeight;
  const { height: cardHeigth } =
    interFace.gallery.firstElementChild.getBoundingClientRect();
  const currentScroll = window.scrollY;

  const isEndOfPage = currentScroll > heightGallery - cardHeigth * 3;

  if (isEndOfPage && !totalImg) {
    interFace.offListenerScroll();
    return;
  } else if (isEndOfPage) {
    pixabayApi
      .fetchMoreImages()
      .then(data => {
        const { hits } = data;

        interFace.markUpGallery(hits);
        interFace.smoothScroll();
        totalImg -= hits.length;

        if (!totalImg) {
          interFace.hiddenButtonLoadMore();
          interFace.showNotification('notMoreImages');
        }
      })
      .catch(error => console.log(error));
  }
}
