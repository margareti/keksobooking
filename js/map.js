'use strict';

var hotelConstraints = {
  price: {
    min: 1000,
    max: 1000000
  },
  type: ['flat', 'house', 'bungalow'],
  title: ['Большая уютная квартира', 
          'Маленькая неуютная квартира', 
          'Огромный прекрасный дворец', 
          'Маленький ужасный дворец', 
          'Красивый гостевой домик', 
          'Некрасивый негостеприимный домик', 
          'Уютное бунгало далеко от моря', 
          'Неуютное бунгало по колено в воде'],
  rooms: {
    min: 1,
    max: 5
  },
  checkin: ['12:00', '13:00', '14:00'],
  checkout: ['12:00', '13:00', '14:00'],
  features: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  location: {
    x: {
      min: 300,
      max: 900
    },
    y: {
      min: 100,
      max: 500
    }
  }
}
var pinTemplate = document.querySelector('#pin-template').content;
var pinContainer = document.querySelector('.tokyo__pin-map');
var lodgeTemplate = document.querySelector('#lodge-template').content;
var typeRussian = {
  flat: 'Квартира',
  house: 'Дом',
  bungalow: 'Бунгало'
}
var hotels = generateHotels(hotelConstraints);
var dialogOffer = document.querySelector('.dialog');



dialogOffer.replaceChild(renderLodge(hotels[0]), dialogOffer.querySelector('.dialog__panel'));
pinContainer.appendChild(renderPins(hotels));

function generateHotels(hotelConstraints) {
  var hotelsCount = 8;
  var authorIndexes = generateAuthorsArray(hotelsCount);
  var titles = hotelConstraints.title.slice();
  var hotels = [];
  var hotel;
  var i = 0;

  for (; i < hotelsCount; i++) {
    hotel = {};
    hotel.avatar = userAvatar(getUniqueElementInArray(authorIndexes, genRandomNum(authorIndexes)));

    hotel.offer = {
      title: getUniqueElementInArray(titles, genRandomNum(titles)),
      price: genRandomRange(hotelConstraints.price.min, hotelConstraints.price.max),
      type: hotelConstraints.type[genRandomNum(hotelConstraints.type)],
      rooms: genRandomRange(hotelConstraints.rooms.min, hotelConstraints.rooms.max),
      guests: genRandomRange(1, 20),
      checkin: hotelConstraints.checkin[genRandomNum(hotelConstraints.checkin)],
      checkout: hotelConstraints.checkout[genRandomNum(hotelConstraints.checkout)],
      features: generateUniqueFeaturesArray(),
      description: '',
      photos: []
    };
    hotel.features 
    hotel.location = {
      x: genRandomRange(hotelConstraints.location.x.min, hotelConstraints.location.x.max),
      y: genRandomRange(hotelConstraints.location.y.min, hotelConstraints.location.y.max)
    }

    hotel.offer.address = hotel.location.x + ', ' + hotel.location.y;
    hotels.push(hotel);
  }

  function genRandomNum(arr) {
    return Math.floor(Math.random() * arr.length);
  }

  function genRandomRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function userAvatar(num) {
    return 'img/avatars/user0' + num + '.png';
  }

  function generateAuthorsArray(count) {
    var i = 1;
    var authors = [];
    for (; i <= count; i++) {
      authors.push(i)
    }
    return authors;
  }

  function getUniqueElementInArray(arr, index) {
    var element = arr[index];
    arr.splice(index, 1);
    return element;
  }

  function generateUniqueFeaturesArray() {
    var features = hotelConstraints.features.slice();
    var arrayLength = genRandomNum(features);
    var array = [];
    var item;
    var i = 0;
    for (; i < arrayLength; i++) {
      item = getUniqueElementInArray(features, genRandomNum(features));
      array.push(item);
    }
    return array;
  }
  return hotels;
}

function renderPin(hotel) {
  var pin = pinTemplate.cloneNode(true);
  var pinWidth = 56;
  var pinHeight = 70;
  pin.querySelector('img').src = hotel.avatar;
  pin.querySelector('.pin').style.left = hotel.location.x - (pinWidth / 2) + 'px';
  pin.querySelector('.pin').style.top = hotel.location.y - pinHeight + 'px';
  return pin;
}

function renderPins(hotels) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < hotels.length; i++) {
    fragment.appendChild(renderPin(hotels[i]));
  }
  return fragment;
}

function renderLodge(lodge) {
  var lodgeEl = lodgeTemplate.cloneNode(true);
  var userAvatar = document.querySelector('.dialog__title');
  userAvatar.querySelector('img').setAttribute('src', lodge.avatar);

  lodgeEl.querySelector('.lodge__title').textContent = lodge.offer.title;
  lodgeEl.querySelector('.lodge__address').textContent = lodge.offer.address;
  lodgeEl.querySelector('.lodge__price').textContent = lodge.offer.price + '&#x20bd;/ночь';
  lodgeEl.querySelector('.lodge__type').textContent = typeRussian[lodge.offer.type]; 
  lodgeEl.querySelector('.lodge__features').appendChild(genFeaturesHTML(lodge.offer.features));
  lodgeEl.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + lodge.offer.guests + 'гостей в ' + lodge.offer.rooms + ' комнатах';
  lodgeEl.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + lodge.offer.checkin + ', выезд до ' + lodge.offer.checkout;
  lodgeEl.querySelector('.lodge__description').textContent = lodge.offer.description; 
  return lodgeEl;

  function genFeaturesHTML(features) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < features.length; i++) {
      var spanEl = document.createElement('span');
      spanEl.classList = 'feature__image feature__image--' + features[i];
      fragment.appendChild(spanEl);
    }
    return fragment;
  }
}

var pins = document.querySelectorAll('.pin');
var dialogClose = dialogOffer.querySelector('.dialog__close');
pins[0].setAttribute('tabindex', 0);

pins.forEach(function(pin, index) {
  pin.addEventListener('click', function() {
    deactivatePins(pins);
    this.classList.add('pin--active');
    dialogOffer.style.display = 'block';
    dialogOffer.replaceChild(renderLodge(hotels[index - 1]), dialogOffer.querySelector('.dialog__panel'));
  })
});

dialogClose.addEventListener('click', function() {
  dialogOffer.style.display = 'none';
  deactivatePins(pins);
})

function deactivatePins(pins) {
  pins.forEach(function(pin) {
    pin.classList.remove('pin--active');
  });
}


