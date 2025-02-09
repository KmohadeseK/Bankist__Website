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
  ))

  // Active tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document.querySelector(`.operations__content--${clicked.
    dataset.tab}`)
    .classList.add('operations__content--active')

});

//* ................ Menu fade animation .................

const handelHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sinlings = link.closest('.nav')
      .querySelectorAll('.nav__link')
    const logo = link.closest('.nav')
      .querySelector('img')

    sinlings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
}
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
}

const headerObserver = new IntersectionObserver(
  stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});

headerObserver.observe(header)


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












/////////////////////////////////////////
//=======================================
// LECTURE
//=======================================
/////////////////////////////////////////

//! Selection Elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// const allSection = document.querySelectorAll('.section')

// const allButtons = document.getElementsByTagName('button')
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));

//! Creating and inserting elements

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML =
//   `We use cookied for improved fanctionality and analytics.
//    <button class="btn btn--close-cookie">Got it!</button>`;

// // header.prepend(message)
// header.append(message)
//! copy element message👇👇
// // header.append(message.cloneNode(true))

// // header.before(message)
// // header.after(message)

//! Delete elements
// document.querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove()
//     //* Old remove() version👇
//     // message.parentElement.removeChild(message)
//   }
//   );


//! Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%'

// console.log(message.style.backgroundColor); // OUTPUT: rgb(55, 56, 61)
// console.log(message.style.height); // <empty string>

// console.log(getComputedStyle(message).height);

// Number.parseFloat(message.style.height =
//   (getComputedStyle(message).height, 10) + 60 + 'px');
// console.log(message.style.height);


//! set color property
// document.documentElement.style
//   .setProperty('--color-primary', 'lightblue')

//! Atrributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.src);
// console.log(logo.alt);
// console.log(logo.className);

// // set alt logo
// logo.alt = 'beautiful minimalist logo';

//! Non-Standard
// console.log(logo.designer); // undefined 

//! GET & SET Atrributes
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company', 'Bankist') // company='Bankist'
// console.log(logo.getAttribute('src')); // img/logo.png


// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

//! Data Attributes
// console.log(logo.dataset.versionNumber);

//! Classes
// logo.classList.add('c', 'd')
// logo.classList.remove('c', 'd')
// logo.classList.toggle('c')

// console.log(
//   logo.classList.contains('c')  // not includes
// );

//! don't use❌
// logo.className = 'momo';

// Select elements
// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function (e) {
//   const sec1Coords = section1.getBoundingClientRect()
//   console.log(sec1Coords);

//   console.log(e.target.getBoundingClientRect());

//   console.log('Current Scroll', window.pageXOffset,
//     window.pageYOffset);

//   console.log(
//     'hight/width viewport',
//     document.documentElement.clientWidth,
//     document.documentElement.clientHeight
//   );

//   // Scrolling
//   // window.scrollTo(
//   //   sec1Coords.left + window.pageXOffset,
//   //   sec1Coords.top + window.pageYOffset
//   // )

//   //! Old selotion Scroll
//   // window.scrollTo({
//   //   left: sec1Coords.left + window.pageXOffset,
//   //   top: sec1Coords.top + window.pageYOffset,
//   //   behavior: 'smooth'
//   // });

//   //? Modern selosion Scroll
//   section1.scrollIntoView({ behavior: 'smooth' });

// });

//! 

// const alertH1 = function () {
//   alert('addEventListener: Great! you are reading the heading :D');

//* ................ Alert heading .................
// //! remove eventListener 
//   //   h1.removeEventListener('mouseenter',alertH1);
// }
// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => h1.removeEventListener('mouseenter',
//  alertH1), 7000)

// h1.onmouseenter = function () {
//   alert('onmouseenter: Great! you are reading the heading :D')
// }

//! Capturing and Bubbling DOM propagation

// rgb(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`

// console.log(randomColor());

// document.querySelector('.nav__link')
//   .addEventListener('click', function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('LINK', e.target, e.currentTarget);
//     console.log(e.currentTarget === this);

//     // Stop propagation
//     // e.stopPropagation()

//   });

// document.querySelector('.nav__links')
//   .addEventListener('click', function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('CONTAINER', e.target, e.currentTarget);

//   });

// document.querySelector('.nav')
//   .addEventListener('click', function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('NAV', e.target, e.currentTarget);
//   });


//! Going downWards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'blue';

//! Going upWards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

//! Going sibWays: siblings
// console.log(h1.previousElementSibling); // null
// console.log(h1.nextElementSibling); // h4

//! for Nodes
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (ele) {
//   if (ele !== h1) ele.style.fontSize = '10px'
// })

//! Sticky navigation 
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function (e) {
//   if (window.scrollY > initialCoords.top)
//     nav.classList.add('sticky');
//   else
//     nav.classList.remove('sticky');
// });

//! Sticky navigation: Intersection Observer API
// const obsCallback = function (entries, observer) {
// entries => ها به ما میدهدthreshold یک آرایه از
//   entries.forEach(entry => {
//     console.log(entry);

//   });
// }

// const obsOptions = {
//   root: null, // view port
//   threshold: [0, 0.2]  // number%
// }

// const observer = new IntersectionObserver(
//   obsCallback, obsOptions);
// observer.observe(section1);

//! Lifecycle DOM Events
// document.addEventListener('DOMContentLoaded', function
//   (e) {
//   console.log('hello domiii', e);
// })

// window.addEventListener('load', function (e) {
//   console.log(`page fully loaded`, e);
// });

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   e.returnValue = '';
// });

