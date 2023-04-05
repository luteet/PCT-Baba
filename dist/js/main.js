
const
	body = document.querySelector('body'),
	html = document.querySelector('html'),
	menu = document.querySelectorAll('.header__burger, .header__nav, body'),
	burger = document.querySelector('.header__burger'),
	header = document.querySelector('.header');


function slideUp(target, duration = 300) {
	target.style.transitionProperty = 'height, margin, padding';
	target.style.transitionDuration = duration + 'ms';
	target.style.boxSizing = 'border-box';
	target.style.height = target.offsetHeight + 'px';
	target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	window.setTimeout(() => {
		target.style.display = 'none';
		target.style.removeProperty('height');
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
	}, duration);
}

function slideDown(target, duration = 300) {
	target.style.removeProperty('display');
	let display = window.getComputedStyle(target).display;

	if (display === 'none')
		display = 'block';

	target.style.display = display;
	let height = target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	target.offsetHeight;
	target.style.boxSizing = 'border-box';
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + 'ms';
	target.style.height = height + 'px';
	target.style.removeProperty('padding-top');
	target.style.removeProperty('padding-bottom');
	target.style.removeProperty('margin-top');
	target.style.removeProperty('margin-bottom');
	window.setTimeout(() => {
		target.style.removeProperty('height');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
	}, duration);
}


// =-=-=-=-=-=-=-=-=-=-=-=- <popup> -=-=-=-=-=-=-=-=-=-=-=-=

function Popup(arg) {

	let body = document.querySelector('body'),
		html = document.querySelector('html'),
		saveHref = (typeof arg == 'object') ? (arg['saveHref']) ? true : false : false,
		popupCheck = true,
		popupCheckClose = true;

	const removeHash = function () {
		let uri = window.location.toString();
		if (uri.indexOf("#") > 0) {
			let clean_uri = uri.substring(0, uri.indexOf("#"));
			window.history.replaceState({}, document.title, clean_uri);
		}
	}

	const open = function (id, initStart) {

		if (popupCheck) {
			popupCheck = false;

			let popup = document.querySelector(id);

			if (popup) {

				body.classList.remove('_popup-active');
				html.style.setProperty('--popup-padding', window.innerWidth - body.offsetWidth + 'px');
				body.classList.add('_popup-active');

				if (saveHref) history.pushState('', "", id);

				setTimeout(() => {
					if (!initStart) {
						popup.classList.add('_active');
						function openFunc() {
							popupCheck = true;
							popup.removeEventListener('transitionend', openFunc);
						}
						popup.addEventListener('transitionend', openFunc)
					} else {
						popup.classList.add('_transition-none');
						popup.classList.add('_active');
						popupCheck = true;
					}

				}, 0)

			} else {
				return new Error(`Not found "${id}"`)
			}
		}
	}

	const close = function (popupClose) {
		if (popupCheckClose) {
			popupCheckClose = false;

			let popup
			if (typeof popupClose === 'string') {
				popup = document.querySelector(popupClose)
			} else {
				popup = popupClose.closest('.popup');
			}

			if (popup.classList.contains('_transition-none')) popup.classList.remove('_transition-none')

			setTimeout(() => {
				popup.classList.remove('_active');
				function closeFunc() {
					const activePopups = document.querySelectorAll('.popup._active');

					if (activePopups.length < 1) {
						body.classList.remove('_popup-active');
						html.style.setProperty('--popup-padding', '0px');
					}

					if (saveHref) {
						removeHash();
						if (activePopups[activePopups.length - 1]) {
							history.pushState('', "", "#" + activePopups[activePopups.length - 1].getAttribute('id'));
						}
					}

					popupCheckClose = true;
					popup.removeEventListener('transitionend', closeFunc)
				}

				popup.addEventListener('transitionend', closeFunc)

			}, 0)

		}
	}

	return {

		open: function (id) {
			open(id);
		},

		close: function (popupClose) {
			close(popupClose)
		},

		init: function () {

			let thisTarget
			body.addEventListener('click', function (event) {

				thisTarget = event.target;

				let popupOpen = thisTarget.closest('.open-popup');
				if (popupOpen) {
					event.preventDefault();
					open(popupOpen.getAttribute('href'))
				}

				let popupClose = thisTarget.closest('.popup-close');
				if (popupClose) {
					close(popupClose)
				}

			});

			if (saveHref) {
				let url = new URL(window.location);
				if (url.hash) {
					open(url.hash, true);
				}
			}
		},

	}
}

const popup = new Popup();

popup.init();

// =-=-=-=-=-=-=-=-=-=-=-=- </popup> -=-=-=-=-=-=-=-=-=-=-=-=


// =-=-=-=-=-=-=-=-=-=-=-=- <click events> -=-=-=-=-=-=-=-=-=-=-=-=

let faqItemCheck = false;
body.addEventListener('click', function (event) {

	function $(elem) {
		return event.target.closest(elem)
	}

	// =-=-=-=-=-=-=-=-=-=- <open menu in header> -=-=-=-=-=-=-=-=-=-=-

	if ($('.header__burger')) {
		menu.forEach(element => {
			element.classList.toggle('_active')
		})
	}

	// =-=-=-=-=-=-=-=-=-=- </open menu in header> -=-=-=-=-=-=-=-=-=-=-


	// =-=-=-=-=-=-=-=-=-=- <header search> -=-=-=-=-=-=-=-=-=-=-

	const headerSearchOpen = $('.header__search--open');
	if (headerSearchOpen) {
		const headerSearch = headerSearchOpen.closest('.header__search');
		headerSearch.classList.add('_active');
		body.classList.add('_active')
	}

	const headerSearchBg = $('.header__search--bg');
	if (headerSearchBg) {
		const headerSearch = headerSearchBg.closest('.header__search');
		headerSearch.classList.remove('_active');
		body.classList.remove('_active')
	}

	// =-=-=-=-=-=-=-=-=-=- </header search> -=-=-=-=-=-=-=-=-=-=-



	// =-=-=-=-=-=-=-=-=-=- <product amount> -=-=-=-=-=-=-=-=-=-=-

	const productAmountBtn = $('.product-amount-btn');
	if (productAmountBtn) {

		const parent = productAmountBtn.closest('.product-amount'),
			length = parent.querySelector('.product-amount-length');

		if (productAmountBtn.classList.contains('_plus')) {
			length.value = Number(length.value) + 1;
		} else if (productAmountBtn.classList.contains('_minus')) {
			length.value = (Number(length.value) - 1) ? Number(length.value) - 1 : 1;
		}
	}

	// =-=-=-=-=-=-=-=-=-=- </product amount> -=-=-=-=-=-=-=-=-=-=-



	// =-=-=-=-=-=-=-=-=-=- <shop categories> -=-=-=-=-=-=-=-=-=-=-

	const shopAsideOpen = $('.shop__aside-open'),
		shopAsideClose = ($('.shop__aside--bg')) ? $('.shop__aside--bg') : ($('.shop__aside--close')) ? $('.shop__aside--close') : false;

	if (shopAsideOpen) {
		const shopAside = document.querySelector('.shop__aside');
		shopAside.classList.add('_active');
		body.classList.add('_scroll-lock');
	}

	if (shopAsideClose) {
		const shopAside = document.querySelector('.shop__aside');
		shopAside.classList.remove('_active');
		body.classList.remove('_scroll-lock');
	}

	// =-=-=-=-=-=-=-=-=-=- </shop categories> -=-=-=-=-=-=-=-=-=-=-


	
	// =-=-=-=-=-=-=-=-=-=- <FAQ> -=-=-=-=-=-=-=-=-=-=-
	
	const faqItem = $('.faq__item');
	if (faqItem) {
	
		if (!faqItemCheck) {
		faqItemCheck = true;
	
		faqItem.classList.add('_animating');
	
		const faqItemContent = faqItem.querySelector('.faq__item--content'),
		activeFaqItem = document.querySelector('.faq__item._active');
	
		if (!faqItem.classList.contains('_active')) {
	
			if (activeFaqItem) {
				activeFaqItem.classList.remove('_active');
				activeFaqItem.querySelector('.faq__item--content').style.display = 'block';
				slideUp(activeFaqItem.querySelector('.faq__item--content'));
			}
	
			faqItem.classList.add('_active');
			slideDown(faqItemContent);
	
		} else {
	
			faqItemContent.style.display = 'block';
			slideUp(faqItemContent);
			faqItem.classList.remove('_active');
	
		}
	
		setTimeout(() => {
			faqItemCheck = false;
		},300)
	
		}

	}
	
	// =-=-=-=-=-=-=-=-=-=- </FAQ> -=-=-=-=-=-=-=-=-=-=-



	// =-=-=-=-=-=-=-=-=-=- <Remove product from cart> -=-=-=-=-=-=-=-=-=-=-

	const cartProductRemove = $('.cart__product--remove');
	if(cartProductRemove) {
		const cartProduct = cartProductRemove.closest('.cart__product');

		slideUp(cartProduct);
		setTimeout(() => {
			cartProduct.remove();
		},500)

	}

	// =-=-=-=-=-=-=-=-=-=- </Remove product from cart> -=-=-=-=-=-=-=-=-=-=-


	// =-=-=-=-=-=-=-=-=-=- <Remove picture from review> -=-=-=-=-=-=-=-=-=-=-

	const removePicture = $('.remove-picture');
	if(removePicture) {
		event.preventDefault();
		const text = removePicture.querySelector('.file-text');

		text.textContent = removePicture.dataset.text;
		removePicture.classList.remove('remove-picture');
	}

	// =-=-=-=-=-=-=-=-=-=- </Remove picture from review> -=-=-=-=-=-=-=-=-=-=-


})

// =-=-=-=-=-=-=-=-=-=-=-=- </click events> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=- <custom select> -=-=-=-=-=-=-=-=-=-=-

document.querySelectorAll('.select').forEach(select => {

	new SlimSelect({

		select: select,

		settings: {
			showSearch: false,
			hideSelected: true,
		},

	})
	
})

// =-=-=-=-=-=-=-=-=-=- </custom select> -=-=-=-=-=-=-=-=-=-=-



const checkboxInputs = document.querySelectorAll('[data-block-id].checkbox__input');

function checkboxInputChange(checkboxInput) {
	const checkboxBlock = document.querySelector(`#${checkboxInput.dataset.blockId}`);
		
	if(checkboxBlock) {
		if(checkboxInput.checked) {
			checkboxBlock.classList.add('_active');
		} else {
			checkboxBlock.classList.remove('_active');
		}
	}
}

checkboxInputs.forEach(checkboxInput => {

	checkboxInputChange(checkboxInput);

	checkboxInput.addEventListener('change', function () {
		checkboxInputChange(checkboxInput)
	})
	
})


const radioInputs = document.querySelectorAll('.radio__input');

function radioInputChange(radioInput) {

	const radioBlock = document.querySelector(`#${radioInput.dataset.blockId}`),
		  radioWrapper = radioInput.closest('.radio-wrapper');
		
	if(radioBlock) {
		if(radioInput.checked) {
			radioBlock.classList.add('_active');
		} else {
			radioBlock.classList.remove('_active');
		}
	}

	if(radioWrapper) {
		const inputs = radioWrapper.querySelectorAll('[data-block-id].radio__input');
		inputs.forEach(input => {
			if(!input.checked) {
				const block = document.querySelector(`#${input.dataset.blockId}`);
				
				if(block) block.classList.remove('_active');
			}
		})
	}
}

radioInputs.forEach(radioInput => {

	radioInputChange(radioInput);

	radioInput.addEventListener('change', function () {
		radioInputChange(radioInput)
	})
	
})


const fileInputs = document.querySelectorAll('.file-input');
fileInputs.forEach(fileInput => {
	const wrapper = fileInput.closest('.file-wrapper'),
		  text = wrapper.querySelector('.file-text');
	
	if(text && fileInput.value.split(/(\\|\/)/g).pop()) text.textContent = fileInput.value.split(/(\\|\/)/g).pop();

	fileInput.addEventListener('change', function () {
		if(text) text.textContent = fileInput.value.split(/(\\|\/)/g).pop();
	})
})


new ClipboardJS('.copy-btn');

// =-=-=-=-=-=-=-=-=-=-=-=- <resize> -=-=-=-=-=-=-=-=-=-=-=-=

function resize() {

	html.style.setProperty("--height-screen", window.innerHeight + "px")
	html.style.setProperty("--height-header", header.offsetHeight + "px")
	if (!html.classList.contains('fslightbox-open')) html.style.setProperty("--width-scrollbar", window.innerWidth - body.offsetWidth + "px")
}

resize();

window.onresize = resize;

// =-=-=-=-=-=-=-=-=-=-=-=- </resize> -=-=-=-=-=-=-=-=-=-=-=-=


// =-=-=-=-=-=-=-=-=-=-=-=- <scroll> -=-=-=-=-=-=-=-=-=-=-=-=

function scroll() {
	if(header.offsetTop >= 50 && !header.classList.contains('_active')) {
		header.classList.add('_active');
	} else if(header.classList.contains('_active') && header.offsetTop < 50) {
		header.classList.remove('_active');
	}
}

scroll()

window.addEventListener('scroll', scroll)

// =-=-=-=-=-=-=-=-=-=-=-=- </scroll> -=-=-=-=-=-=-=-=-=-=-=-=


// =-=-=-=-=-=-=-=-=-=-=-=- <slider> -=-=-=-=-=-=-=-=-=-=-=-=

let reviewsSlider = new Swiper('.reviews__slider', {

	spaceBetween: 20,
	slidesPerView: 1,
	speed: 500,
	//loop: true,
	pagination: {
		el: '.reviews__nav .swiper-pagination',
		clickable: true,
	},
	navigation: {
		nextEl: '.reviews__nav .swiper-button-next',
		prevEl: '.reviews__nav .swiper-button-prev',
	},
	breakpoints: {
		992: {
			slidesPerView: 4,
			speed: 200,
		},
		700: {
			slidesPerView: 3,
			speed: 200,
		},
		550: {
			slidesPerView: 2,
			speed: 200,
		},
	}
});

const reviewsGallery = document.querySelectorAll('.reviews-gallery');
reviewsGallery.forEach((reviewsGallery, index) => {

	const items = reviewsGallery.querySelectorAll('a');
	items.forEach(item => {
		item.dataset.fslightbox = `review-gallery-${index}`;
	})

})

refreshFsLightbox();

// =-=-=-=-=-=-=-=-=-=-=-=- </slider> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <animation> -=-=-=-=-=-=-=-=-=-=-=-=

AOS.init({
	disable: "mobile",
	once: true,
});

// =-=-=-=-=-=-=-=-=-=-=-=- </animation> -=-=-=-=-=-=-=-=-=-=-=-=



