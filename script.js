'use strict';

///////////////////////////////////////////////////
// Select elements

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section')
const h1 = document.querySelector('h1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelector('.nav__links');
const nav = document.querySelector('.nav')
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const slides = document.querySelectorAll('.slide');
const sliderContainer = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

///////////////////////////////////////////////////
//* ................ Modal window .................

const openModal = function (e) {
  e.preventDefault()
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener(
  'click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////////////////////////////
//* ................ Scroll function .................
// btn scrolling
btnScrollTo.addEventListener('click', function (e) {
  //? Modern selosion Scroll
  section1.scrollIntoView({ behavior: 'smooth' });
});

//* ................ Page navigation .................
//! Event Delegation
//1. Add event listener to common parent element
//2. Determine what element originated the event
navLinks.addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
  }
});

//* ................ Tabbed component .................

tabsContainer.addEventListener('click', (e) => {
  const clicked = e.target.closest('.operations__tab')

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove(
    'operations__tab--active'))
  tabsContent.forEach(c => c.classList.remove(
    'operations__content--active'
  ));

  // Active tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document.querySelector(`.operations__content--${clicked.
    dataset.tab}`)
    .classList.add('operations__content--active');

});

//* ................ Menu fade animation .................

const handelHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sinlings = link.closest('.nav')
      .querySelectorAll('.nav__link');
    const logo = link.closest('.nav')
      .querySelector('img');

    sinlings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  };
};
// passing "argument" into handler
nav.addEventListener('mouseover',
  handelHover.bind(0.5));
nav.addEventListener('mouseout',
  handelHover.bind(1));

//* ................ Sticky navigation .................

//! Sticky navigation: Intersection Observer API
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = (entries) => {
  const [entry] = entries;

  if (!entry.isIntersecting)
    nav.classList.add('sticky');
  else
    nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(
  stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});

headerObserver.observe(header);

//* ................ Reveal sections .................

const revealSection = function (entries, observer) {
  const [entry] = entries;

  // Guard clause
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target)
}

const sectionObserver = new IntersectionObserver(
  revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section)
  section.classList.add('section--hidden')
});

//* ................ Lazy loading Images .................

const imgTargets = document.querySelectorAll('img[data-src]')

const loadImage = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with date-src
  entry.target.src = entry.target.dataset.src

  // loading images
  entry.target.addEventListener('load', function (e) {
    entry.target.classList.remove('lazy-img')

  });

  observer.unobserve(entry.target)
};

const imgObserver = new IntersectionObserver(loadImage,
  {
    root: null,
    threshold: 0,
    rootMargin: '200px'
  });

imgTargets.forEach(img => imgObserver.observe(img));

//* ................ Slider component .................

const slider = function () {

  let curSlide = 0;
  const maxSlide = slides.length;

  // create Dots functionality
  const createDots = function () {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // Activate Dot
  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot')
      .forEach(dot => {
        dot.classList.remove('dots__dot--active');

        document
          .querySelector(`.dots__dot[data-slide="${slide}"]`)
          .classList.add('dots__dot--active');
      });
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => s.style.transform =
      `translateX(${100 * (i - slide)}%)`)
  };

  // Next slide function
  const nextSlide = () => {
    curSlide === maxSlide - 1 ? curSlide = 0 : curSlide++;
    // go to slide callBack function 
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Previos slide function
  const prevSlide = () => {
    curSlide === 0 ? curSlide = maxSlide - 1 : curSlide--;
    // go to slide callBack function 
    goToSlide(curSlide);
    activateDot(curSlide);

  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  //............... Event handlers .................
  // addEventListener : Right button 
  btnRight.addEventListener('click', nextSlide);
  // addEventListener : Left button 
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  // event deligation for dots container
  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    };
  });

};
slider();