'use strict';
(function () {

  // import window.utility: bodyTag, ESCAPE

  var uploadFile = document.querySelector('#upload-file');
  var modalPhotoModification = document.querySelector('.img-upload__overlay');
  var closeButton = modalPhotoModification.querySelector('#upload-cancel');
  var scaleControl = modalPhotoModification.querySelector('.scale');
  var scaleValue = scaleControl.querySelector('.scale__control--value');
  var scaleValuePlus = scaleControl.querySelector('.scale__control--bigger');
  var scaleValueMinus = scaleControl.querySelector('.scale__control--smaller');
  var photoPreview = modalPhotoModification.querySelector('.img-upload__preview img');
  var effectsButtons = modalPhotoModification.querySelectorAll('.effects__radio');
  var effectLevel = modalPhotoModification.querySelector('.effect-level');
  var effectLevelValue = effectLevel.querySelector('.effect-level__value');
  var levelControlLine = effectLevel.querySelector('.effect-level__line');
  var levelControlDepthLine = effectLevel.querySelector('.effect-level__depth');
  var levelControlPin = effectLevel.querySelector('.effect-level__pin');
  var hashtagInput = modalPhotoModification.querySelector('.text__hashtags');
  var commentInput = modalPhotoModification.querySelector('.text__description');

  var checkSpace = function (checkValue) {
    return checkValue !== '';
  };

  var checkHashtagInputHandler = function () {
    var hashtagInputValue = hashtagInput.value;
    var hashtags = hashtagInputValue.trim().toLowerCase().split(' ').filter(checkSpace);
    var removeSymbol = /[^a-zA-Zа-яА-Я0-9ё#]/g;

    var checkUpLowCase = function () {
      var checkCase;
      for (var j = 0; j < hashtags.length; j++) {
        if (hashtags[i] === hashtags[j] && j !== i) {
          checkCase = true;
        }
      }
      return checkCase;
    };

    var checkDoubleHash = function () {
      var checkHash;
      for (var j = 1; j < hashtags[i].length; j++) {
        if (hashtags[i][j] === '#') {
          checkHash = true;
        }
      }
      return checkHash;
    };

    for (var i = 0; i < hashtags.length; i++) {
      if (hashtags[i][0] !== '#') {
        hashtagInput.setCustomValidity('Хэш-тег должен начинаться с решётки (#)');
      } else if (hashtags[i].search(removeSymbol) > 0) {
        hashtagInput.setCustomValidity('После решётки (#) хэш-тег должен состоять только из букв и чисел');
      } else if (checkDoubleHash()) {
        hashtagInput.setCustomValidity('Может быть использована только одна решётка (#)');
      } else if (hashtags[i].length <= 1) {
        hashtagInput.setCustomValidity('Хеш-тег не может состоять только из одного символа');
      } else if (hashtags[i].length > 20) {
        hashtagInput.setCustomValidity('Хеш-тег не может быть длинее 20 символов');
      } else if (checkUpLowCase()) {
        hashtagInput.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды без учёта регистра: #ХэшТег и #хэштег считаются одним и тем же тегом');
      } else if (hashtags.length > 5) {
        hashtagInput.setCustomValidity('Использование больше пяти хэш-тегов невозможно');
      } else {
        hashtagInput.setCustomValidity('');
      }
    }
  };

  hashtagInput.addEventListener('input', checkHashtagInputHandler);

  var checkLevelIntensityHandler = function () {
    var intensity = effectLevelValue.value;
    if (photoPreview.classList.contains('effects__preview--chrome')) {
      photoPreview.style.filter = 'grayscale(' + intensity / 100 + ')';
    } else if (photoPreview.classList.contains('effects__preview--sepia')) {
      photoPreview.style.filter = 'sepia(' + intensity / 100 + ')';
    } else if (photoPreview.classList.contains('effects__preview--marvin')) {
      photoPreview.style.filter = 'invert(' + intensity + '%)';
    } else if (photoPreview.classList.contains('effects__preview--phobos')) {
      photoPreview.style.filter = 'blur(' + 3 * intensity / 100 + 'px)';
    } else if (photoPreview.classList.contains('effects__preview--heat')) {
      photoPreview.style.filter = 'brightness(' + 3 * intensity / 100 + ')';
    }
  };

  var effectUpdate = function (coords, value) {
    levelControlPin.style.left = coords + 'px';
    levelControlDepthLine.style.width = coords + 'px';
    effectLevelValue.value = value;
  };

  levelControlPin.addEventListener('mousedown', function (evt) {
    var startCoords = {
      x: evt.clientX
    };

    var mouseMoveHandler = function (moveEvt) {
      var shift = {
        x: startCoords.x - moveEvt.clientX
      };
      startCoords = {
        x: moveEvt.clientX
      };

      if (levelControlPin.offsetLeft - shift.x <= levelControlLine.clientWidth && levelControlPin.offsetLeft - shift.x >= levelControlLine.clientLeft) {
        var getLevelEffect = levelControlPin.offsetLeft - shift.x;
        var getEffectLevelValue = Math.round(getLevelEffect * 100 / levelControlLine.clientWidth);
        effectUpdate(getLevelEffect, getEffectLevelValue);
        checkLevelIntensityHandler();
      }
    };

    var mouseUpHandler = function () {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  var checkSetAtribute = function (element, elements, atribute) {
    if (element.hasAttribute(atribute) !== true) {
      for (var i = 0; i < elements.length; i++) {
        elements[i].removeAttribute(atribute);
      }
      element.setAttribute(atribute, '');
    }
  };

  var checkClassEffect = function (element, atribute, img) {
    if (element.getAttribute(atribute) === 'effect-chrome') {
      img.removeAttribute('class');
      img.style.filter = '';
      img.classList.add('effects__preview--chrome');
    } else if (element.getAttribute(atribute) === 'effect-sepia') {
      img.removeAttribute('class');
      img.style.filter = '';
      img.classList.add('effects__preview--sepia');
    } else if (element.getAttribute(atribute) === 'effect-marvin') {
      img.removeAttribute('class');
      img.style.filter = '';
      img.classList.add('effects__preview--marvin');
    } else if (element.getAttribute(atribute) === 'effect-phobos') {
      img.removeAttribute('class');
      img.style.filter = '';
      img.classList.add('effects__preview--phobos');
    } else if (element.getAttribute(atribute) === 'effect-heat') {
      img.removeAttribute('class');
      img.style.filter = '';
      img.classList.add('effects__preview--heat');
    } else if (element.getAttribute(atribute) === 'effect-none') {
      img.removeAttribute('class');
      img.style.filter = '';
      img.classList.add('effects__preview--none');
    }
  };

  var addEffectClickHandler = function (effect, effectAll) {
    effect.addEventListener('click', function () {
      checkSetAtribute(effect, effectAll, 'checked');
      checkClassEffect(effect, 'id', photoPreview);
      effectUpdate(levelControlLine.clientWidth || 454, 100);
      if (effect.getAttribute('id') !== 'effect-none') {
        effectLevel.classList.remove('hidden');
      } else {
        effectLevel.classList.add('hidden');
      }
    });
  };

  effectsButtons.forEach(function (effectsButton) {
    addEffectClickHandler(effectsButton, effectsButtons);
  });

  var getScaleValue = function (value) {
    return parseInt(value, 10);
  };

  scaleControl.addEventListener('click', function (evt) {
    if (evt.target === scaleValuePlus) {
      if (getScaleValue(scaleValue.value) >= 0 && getScaleValue(scaleValue.value) < 25) {
        scaleValue.value = 25 + '%';
        photoPreview.style.transform = 'scale(0.25)';
      } else if (getScaleValue(scaleValue.value) >= 25 && getScaleValue(scaleValue.value) < 50) {
        scaleValue.value = 50 + '%';
        photoPreview.style.transform = 'scale(0.50)';
      } else if (getScaleValue(scaleValue.value) >= 50 && getScaleValue(scaleValue.value) < 75) {
        scaleValue.value = 75 + '%';
        photoPreview.style.transform = 'scale(0.75)';
      } else if (getScaleValue(scaleValue.value) >= 75 && getScaleValue(scaleValue.value) < 100) {
        scaleValue.value = 100 + '%';
        photoPreview.style.transform = 'scale(1)';
      }
    } else if (evt.target === scaleValueMinus) {
      if (getScaleValue(scaleValue.value) >= 0 && getScaleValue(scaleValue.value) <= 50) {
        scaleValue.value = 25 + '%';
        photoPreview.style.transform = 'scale(0.25)';
      } else if (getScaleValue(scaleValue.value) > 50 && getScaleValue(scaleValue.value) <= 75) {
        scaleValue.value = 50 + '%';
        photoPreview.style.transform = 'scale(0.50)';
      } else if (getScaleValue(scaleValue.value) > 75 && getScaleValue(scaleValue.value) <= 100) {
        scaleValue.value = 75 + '%';
        photoPreview.style.transform = 'scale(0.75)';
      }
    }
  });

  var modificationPhotoHandler = function () {
    modalPhotoModification.classList.remove('hidden');
    window.utility.bodyTag.classList.add('modal-open');
    effectLevel.classList.add('hidden');
  };

  uploadFile.addEventListener('change', modificationPhotoHandler);

  var setDefaultSettings = function () {
    modalPhotoModification.classList.add('hidden');
    window.utility.bodyTag.classList.remove('modal-open');
    checkSetAtribute(effectsButtons[0], effectsButtons, 'checked');
    photoPreview.removeAttribute('class');
    photoPreview.removeAttribute('style');
    uploadFile.value = '';
  };

  closeButton.addEventListener('click', function () {
    setDefaultSettings();
  });

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.utility.ESCAPE && evt.target !== hashtagInput && evt.target !== commentInput) {
      setDefaultSettings();
    }
  });

})();
