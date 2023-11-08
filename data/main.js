/******/ (function(modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/ 	var installedModules = {};

    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {

        /******/ 		// Check if module is in cache
        /******/ 		if(installedModules[moduleId])
        /******/ 			return installedModules[moduleId].exports;

        /******/ 		// Create a new module (and put it into the cache)
        /******/ 		var module = installedModules[moduleId] = {
            /******/ 			exports: {},
            /******/ 			id: moduleId,
            /******/ 			loaded: false
            /******/ 		};

        /******/ 		// Execute the module function
        /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        /******/ 		// Flag the module as loaded
        /******/ 		module.loaded = true;

        /******/ 		// Return the exports of the module
        /******/ 		return module.exports;
        /******/ 	}


    /******/ 	// expose the modules object (__webpack_modules__)
    /******/ 	__webpack_require__.m = modules;

    /******/ 	// expose the module cache
    /******/ 	__webpack_require__.c = installedModules;

    /******/ 	// __webpack_public_path__
    /******/ 	__webpack_require__.p = "";

    /******/ 	// Load entry module and return exports
    /******/ 	return __webpack_require__(0);
    /******/ })
/************************************************************************/
/******/ ([
    /* 0 */
    /***/ function(module, exports, __webpack_require__) {

        'use strict';

        var _reelController = __webpack_require__(1);

        var _reelController2 = _interopRequireDefault(_reelController);

        var _filter = __webpack_require__(7);

        var _filter2 = _interopRequireDefault(_filter);

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

        var $ = function $(sel) {
            return document.querySelector(sel);
        };

        (0, _reelController2['default'])({
            main: $('.reel_main'),
            aside: $('.reel_aside'),
            bg: $('.l2-screens')
        });

        (0, _filter2['default'])($('.l2-races'), $('.l2-archetypes'));

        if (typeof requirejs === 'function') {
            requirejs(['packages/jquery', 'packages/che'], function ($, che) {
                var container = $('.l2-container');
                var gamePanelOffset = $('.l2-logo_active .l2-logo__install-btn').offset().top - 10;
                var title = $('.reel_main .reel__screen-content_main').eq(0);
                var titleOffset = title.offset().top + parseInt(title.css('padding-top'), 10);

                che.events.bind('game-panel-rendered', function (partialElement) {
                    var gamePanel, gamePanelHeight, type;
                    if (partialElement) {
                        var gamePanel = partialElement.closest(".jsGamePanel");
                        var gamePanelHeight = gamePanel.height();
                        var type = gamePanel.closest(".l2-logo").data('lineage');
                        container.toggleClass('l2-container--fade_titles-' + type, gamePanelOffset + gamePanelHeight > titleOffset);
                    }
                });
            });
        }

        /***/ },
    /* 1 */
    /***/ function(module, exports, __webpack_require__) {

        'use strict';

        exports.__esModule = true;

        exports['default'] = function (_state) {
            state = _state;
            scroll.init(state);
            reel.init(state);
            document.addEventListener('keyup', handleKeyboard);
            document.addEventListener('click', handleClick);
            wheel.on(handleWheel);
        };

        var _scroll = __webpack_require__(2);

        var scroll = _interopRequireWildcard(_scroll);

        var _reel = __webpack_require__(5);

        var reel = _interopRequireWildcard(_reel);

        var _wheel = __webpack_require__(6);

        var wheel = _interopRequireWildcard(_wheel);

        function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

        var state = {};
        var invertScroll = ~navigator.platform.indexOf('Mac') || ~navigator.userAgent.indexOf('Chrome');
        var scrollBlocked = false;
        var scrollBlockTimeout = null;
        var scrollStack = [];
        var scrollStackClearTimeout = null;

        function handleKeyboard(evt) {
            switch (evt.keyCode) {
                case 38:
                    scroll.prev();
                    evt.preventDefault();
                    break;
                case 32: // space
                case 40:
                    // down
                    scroll.next();
                    evt.preventDefault();
                    break;
            }
        }

        function isAsideReel(elem) {
            return elem.classList.contains('reel_aside');
        }

        function isAsideLogo(elem) {
            return elem.classList.contains('l2-logo') && !elem.classList.contains('l2-logo_active');
        }

        function isArrow(elem) {
            return elem.classList.contains('reel__screen-arrow');
        }
        function isArrowTop(elem) {
            return elem.classList.contains('reel__screen-arrow-top');
        }
        function isArrowDown(elem) {
            return elem.classList.contains('reel__screen-arrow-down');
        }

        function shouldSkipScroll(delta) {
            enqueueScrollStackClear();

            if (scrollBlocked) {
                return true;
            }

            delta = Math.abs(delta);

            // считаем среднюю скорость скролла и сравниваем с текущим
            // значением: если текущее значение сильно больше среднего,
            // значит, во время инерционного затухания пользователь
            // ещё раз поскроллил
            var median = scrollStack.reduce(function (prev, cur) {
                    return prev + cur;
                }, 0) / scrollStack.length;

            scrollStack.push(delta);
            while (scrollStack.length > 10) {
                scrollStack.pop();
            }

            if (!median || median * 2 <= delta) {
                blockScroll();
                return false;
            }

            return true;
        }

        function enqueueScrollStackClear() {
            if (scrollStackClearTimeout) {
                clearTimeout(scrollStackClearTimeout);
            }

            scrollStackClearTimeout = setTimeout(clearScrollStack, 70);
        }

        function clearScrollStack() {
            scrollStack.length = 0;
        }

        function blockScroll() {
            unblockScroll();
            scrollBlocked = true;
            scrollBlockTimeout = setTimeout(unblockScroll, 200);
        }

        function unblockScroll() {
            if (scrollBlockTimeout) {
                clearTimeout(scrollBlockTimeout);
                scrollBlocked = false;
            }
        }

        function handleClick(evt) {
            var elem = evt.target;
            while (elem && elem !== document) {
                if (isArrowTop(elem)) {
                    return scroll.prev();
                }
                if (isArrowDown(elem)) {
                    return scroll.next();
                }
                elem = elem.parentNode;
            }
        }

        function handleWheel(evt) {
            evt.preventDefault();

            var delta = 0;
            if ('wheelDeltaY' in evt) {
                delta = evt.wheelDeltaY;
            } else if ('deltaY' in evt) {
                delta = evt.deltaY;
                if (Math.abs(delta) < 1) {
                    delta *= 100;
                }
            }

            delta *= invertScroll ? -1 : 1;

            if (shouldSkipScroll(delta)) {
                return;
            }

            if (delta > 0) {
                scroll.next();
            } else if (delta < 0) {
                scroll.prev();
            }
        }

        /***/ },
    /* 2 */
    /***/ function(module, exports, __webpack_require__) {

        'use strict';

        exports.__esModule = true;
        exports.init = init;
        exports.destroy = destroy;
        exports.next = next;
        exports.prev = prev;
        exports.swap = swap;

        var _utils = __webpack_require__(3);

        var utils = _interopRequireWildcard(_utils);

        var _tween = __webpack_require__(4);

        var _tween2 = _interopRequireDefault(_tween);

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

        function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

        var animating = false;
        var activeScreenClass = 'reel__active-screen';
        var state = {};

        function init(options) {
            state = {
                mainReel: options.main,
                asideReel: options.aside,
                main: {},
                aside: {},
                bg: {},
                order: [],
                selected: null
            };

            getScreens(options.main).forEach(function (item) {
                state.order.push(item.name);
                state.main[item.name] = item.elem;
                if (item.elem.classList.contains(activeScreenClass)) {
                    state.selected = item.name;
                }
            });
            getScreens(options.aside).forEach(function (item) {
                state.aside[item.name] = item.elem;
                item.elem.classList.remove(activeScreenClass);
            });

            // сохраяняем фоновые картинки
            utils.toArray(options.bg.querySelectorAll('.l2-screen')).forEach(function (elem) {
                var m = elem.className.match(/\bl2-screen_([\w\-]+)/);
                if (m && m[1]) {
                    state.bg[m[1]] = elem;
                }
            });

            state.bgAside = options.bg.querySelector('.l2-screen__aside');

            // находим активный экран
            state.selected = state.selected || state.order[0];

            // убедимся, что активный экран выделен в обоих лентах
            state.main[state.selected].classList.add(activeScreenClass);
            state.aside[state.selected].classList.add(activeScreenClass);
        }

        function destroy() {
            state = null;
        }

        /**
         * Переход к следующему экрану
         */
        function next() {
            var selectedIx = state.order.indexOf(state.selected);
            if (!canAnimate() || selectedIx === state.order.length - 1) {
                // некуда переходить: либо на последнем экране, либо что-то не так
                return false;
            }

            var next = state.order[selectedIx + 1];
            animate(state.selected, state.order[selectedIx + 1], { direction: 'forward' });
            state.selected = next;
            return true;
        }

        /**
         * Переход к предыдущему экрану
         */
        function prev() {
            var selectedIx = state.order.indexOf(state.selected);
            if (!canAnimate() || !selectedIx) {
                // некуда переходить: либо на самом первом экране, либо что-то не так
                return false;
            }

            var next = state.order[selectedIx - 1];
            animate(state.selected, next, { direction: 'backward' });
            state.selected = next;
            return true;
        }

        /**
         * Меняет местами основную и боковую ленту.
         * Меняются только указатели в переменных, сами
         * ленты не перестраиваются
         */
        function swap() {
            var _ref = [state.aside, state.main];
            state.main = _ref[0];
            state.aside = _ref[1];
            var _ref2 = [state.asideReel, state.mainReel];
            state.mainReel = _ref2[0];
            state.asideReel = _ref2[1];
        }

        /**
         * Возвращает список экранов в ленте
         * @param  {Element} reel
         * @return {Array}
         */
        function getScreens(reel) {
            return utils.toArray(reel.querySelectorAll('.reel__screen')).map(function (elem) {
                var m = elem.className.match(/\breel__screen_([\w\-]+)/);
                return {
                    name: m[1],
                    elem: elem
                };
            });
        }

        function prepareAsideScreens(cur, next) {
            var result = {
                cur: cur.cloneNode(true),
                next: next.cloneNode(true)
            };

            var screenWidth = cur.offsetWidth;
            var screenHeight = cur.offsetHeight;
            utils.setStyle(result.cur, {
                width: screenWidth + 'px',
                height: screenHeight + 'px'
            });
            utils.setStyle(result.next, {
                width: screenWidth + 'px',
                height: screenHeight + 'px'
            });

            var viewportWidth = window.innerWidth;
            var asideRect = state.asideReel.getBoundingClientRect();
            if (asideRect.left > viewportWidth / 2) {
                utils.setStyle(state.bgAside, {
                    left: asideRect.left + 'px',
                    width: viewportWidth - asideRect.left + 'px'
                });
                utils.setStyle(result.cur, {
                    left: -asideRect.left + 'px'
                });
                utils.setStyle(result.next, {
                    left: -asideRect.left + 'px'
                });
            } else {
                utils.setStyle(state.bgAside, {
                    left: 0,
                    width: asideRect.right + 'px'
                });
            }

            state.bgAside.appendChild(result.cur);
            state.bgAside.appendChild(result.next);

            return result;
        }

        /**
         * Анимация перехода от одного экрана к другому
         * @param  {String}  cur         Название текущего экрана
         * @param  {String}  next        Название следующего экрана
         * @param  {Object}  options     Параметры анимации
         */
        function animate(cur, next, options) {
            options = options || {};
            var curMainScreen = state.main[cur];
            var nextMainScreen = state.main[next];
            var curAsideScreen = state.aside[cur];
            var nextAsideScreen = state.aside[next];

            var curBg = state.bg[cur];
            var nextBg = state.bg[next];

            var mainDir = options.direction === 'forward' ? 1 : -1;

            nextMainScreen.classList.add(activeScreenClass);
            nextAsideScreen.classList.add(activeScreenClass);
            nextBg.classList.add('l2-active-screen');

            var asideBg = prepareAsideScreens(curBg, nextBg);

            utils.setTransform(nextMainScreen, { translateY: mainDir * 100 + '%' });
            utils.setTransform(nextBg, { translateY: mainDir * 100 + '%' });
            utils.setTransform(nextAsideScreen, { translateY: -mainDir * 100 + '%' });
            utils.setTransform(asideBg.next, { translateY: mainDir * 100 + '%' });

            animating = true;
            (0, _tween2['default'])({
                easing: 'inOutCubic',
                duration: Math.min(Math.max(300, curMainScreen.offsetHeight * 0.9), 1500),
                step: function step(pos) {
                    utils.setTransform(curMainScreen, { translateY: -mainDir * pos * 100 + '%' });
                    utils.setTransform(nextMainScreen, { translateY: (1 - pos) * mainDir * 100 + '%' });
                    utils.setTransform(curBg, { translateY: -mainDir * pos * 100 + '%' });
                    utils.setTransform(nextBg, { translateY: (1 - pos) * mainDir * 100 + '%' });

                    utils.setTransform(curAsideScreen, { translateY: mainDir * pos * 100 + '%' });
                    utils.setTransform(nextAsideScreen, { translateY: (pos - 1) * mainDir * 100 + '%' });
                    utils.setTransform(asideBg.cur, { translateY: mainDir * pos * 100 + '%' });
                    utils.setTransform(asideBg.next, { translateY: (pos - 1) * mainDir * 100 + '%' });
                },
                complete: function complete() {
                    animating = false;
                    curMainScreen.classList.remove(activeScreenClass);
                    curAsideScreen.classList.remove(activeScreenClass);
                    curBg.classList.remove('l2-active-screen');
                    utils.removeElem(asideBg.cur);
                    utils.removeElem(asideBg.next);
                    options.complete && options.complete();
                }
            });
        }

        /**
         * Проверяет, можем ли запустить анимацию смены экранов в данный момент
         * @return {Boolean}
         */
        function canAnimate() {
            return !animating && ~state.order.indexOf(state.selected);
        }

        /***/ },
    /* 3 */
    /***/ function(module, exports) {

        'use strict';

        exports.__esModule = true;

        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

        exports.testProp = testProp;
        exports.getTransformOrigin = getTransformOrigin;
        exports.setStyle = setStyle;
        exports.setTransform = setTransform;
        exports.toArray = toArray;
        exports.extend = extend;
        exports.defaults = defaults;
        exports.removeElem = removeElem;
        exports.elem = elem;
        exports.throttle = throttle;
        exports.toDom = toDom;
        exports.cleanUrl = cleanUrl;
        exports.getBackgroundImage = getBackgroundImage;
        var propCache = {};
        var unitless = ['scale', 'opacity', 'zIndex', 'z-index', 'rotate'];

        var isOldOpera = exports.isOldOpera = Object.prototype.toString.call(window.opera) === '[object Opera]';

        /**
         * Проверяет, поддерживается ли указанное CSS-свойство
         * либо его вендорные вариации в текущем браузере
         * @param  {String} prop CSS-свойство, поддержку которого нужно проверить
         * @return {String}      Вернёт свойство (или его вендорный аналог), если оно
         * доступно, либо `null`
         */
        function testProp(prop) {
            if (prop in propCache) {
                return propCache[prop];
            }

            var el = document.createElement('div');
            var style = el.style;

            var prefixes = ['o', 'ms', 'moz', 'webkit'];
            var props = [prop];
            var capitalize = function capitalize(str) {
                return str.charAt(0).toUpperCase() + str.substr(1);
            };

            prop = prop.replace(/\-([a-z])/g, function (str, ch) {
                return ch.toUpperCase();
            });

            var capProp = capitalize(prop);
            prefixes.forEach(function (prefix) {
                props.push(prefix + capProp, capitalize(prefix) + capProp);
            });

            for (var i = 0, il = props.length; i < il; i++) {
                if (props[i] in style) {
                    return propCache[prop] = props[i];
                }
            }

            return propCache[prop] = null;
        }

        /**
         * Возвращает координаты точки, относительно которой происходят
         * трансформации у указанного элемента
         * @param  {Element} elem
         * @return {Object}
         */
        function getTransformOrigin(elem) {
            var out = { x: 0, y: 0 };
            var style = window.getComputedStyle(elem);
            var origin = style[this.testProp('transform-origin')];

            if (origin) {
                var parts = origin.split(/\s+/);
                if (parts.length == 1) {
                    out.x = out.y = parseFloat(origin.trim());
                } else {
                    out.x = parseFloat(parts[0].trim());
                    out.y = parseFloat(parts[1].trim());
                }
            }

            return out;
        }

        /**
         * Записывает указанный стиль элементу. Стиль задаётся в виде хэша
         * «css-свойство/значение». Дополнительно можно указать хэш
         * `transform`, который сериализуется в правильную CSS-транформацию
         * @param {Element} elem
         * @param {Object} css
         * @param {Object} transform
         */
        function setStyle(elem, css, transform) {
            // if (!updateRequired(elem, css, transform)) {
            // 	return;
            // }

            if (css) {
                Object.keys(css).forEach(function (k) {
                    elem.style[k] = css[k];
                });
            }

            if (transform) {
                this.setTransform(elem, transform);
            }

            return elem;
        }

        function setTransform(elem, transform) {
            var transformProp = this.testProp('transform');
            if ((typeof transform === 'undefined' ? 'undefined' : _typeof(transform)) === 'object') {
                transform = Object.keys(transform).map(function (k) {
                    var val = transform[k];
                    if (typeof val === 'number' && !~unitless.indexOf(k)) {
                        val += 'px';
                    }

                    return k + '(' + val + ')';
                }).join(' ');
            }

            if (!~transform.indexOf('translateZ') && !isOldOpera) {
                transform += ' translateZ(0)';
            }

            elem.style[transformProp] = transform;
        }

        function toArray(obj) {
            var ix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            return Array.prototype.slice.call(obj, ix);
        }

        function extend(obj) {
            return merge(obj, toArray(arguments, 1), function (key, dest, src) {
                dest[key] = src[key];
            });
        }

        function defaults(obj) {
            return merge(obj, toArray(arguments, 1), function (key, dest, src) {
                if (!(key in dest)) {
                    dest[key] = src[key];
                }
            });
        }

        function removeElem(elem) {
            if (elem && elem.parentNode) {
                elem.parentNode.removeChild(elem);
            }
        }

        function elem(name, className) {
            var elem = document.createElement(name);
            if (className) {
                elem.className = className;
            }
            return elem;
        }

        /**
         * Returns a function, that, when invoked, will only be triggered at most once
         * during a given window of time.
         * @param  {Function} func
         * @param  {Number} wait
         */
        function throttle(func, wait) {
            var context, args, timeout, result;
            var previous = 0;
            var later = function later() {
                previous = Date.now();
                timeout = null;
                result = func.apply(context, args);
            };
            return function () {
                var now = Date.now();
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0) {
                    clearTimeout(timeout);
                    previous = now;
                    result = func.apply(context, args);
                } else if (!timeout) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        }

        function toDom(html) {
            var div = document.createElement('div');
            div.innerHTML = html;
            var result = div.firstChild;
            div.removeChild(result);
            return result;
        }

        /**
         * Возвращает «чистую» ссылку на ресурс, полученную из CSS
         * (отрезает `url()` если необходимо)
         * @param  {String} url URL, полученный из CSS
         * @return {String}
         */
        function cleanUrl(url) {
            return url.replace(/url\(['"]?|['"]?\)/g, '');
        }

        function getBackgroundImage(elem) {
            var style = getComputedStyle(elem, null);
            return cleanUrl(style.backgroundImage);
        }

        function merge(dest, src, iterator) {
            var i = 0,
                il = src.length;
            var fn = function fn(p) {
                iterator(p, dest, src[i]);
            };

            while (i < il) {
                if (src[i]) {
                    Object.keys(src[i]).forEach(fn);
                }
                i++;
            }

            return dest;
        }

        function updateRequired(elem, style, transform) {
            var hash = JSON.stringify(style) + ':' + JSON.stringify(transform);
            if (elem.hash === hash) {
                return false;
            }

            elem.hash = hash;
            return true;
        }

        /***/ },
    /* 4 */
    /***/ function(module, exports) {

        'use strict';
        'use scrict';

        exports.__esModule = true;

        exports['default'] = function (options) {
            return new Tween(options);
        };

        exports.defaults = defaults;
        exports._all = _all;
        exports.stop = stop;

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function extend(obj) {
            for (var i = 1, il = arguments.length, source; i < il; i++) {
                source = arguments[i];
                if (source) {
                    for (var prop in source) {
                        obj[prop] = source[prop];
                    }
                }
            }

            return obj;
        }

        var dummyFn = function dummyFn() {};
        var anims = [];
        var idCounter = 0;

        var defaults = {
            duration: 500, // ms
            delay: 0,
            easing: 'linear',
            start: dummyFn,
            step: dummyFn,
            complete: dummyFn,
            autostart: true,
            reverse: false
        };

        /**
         * Get or set default value
         * @param  {String} name
         * @param  {Object} value
         * @return {Object}
         */
        function defaults(name, value) {
            if (typeof value != 'undefined') {
                defaults[name] = value;
            }

            return defaults[name];
        }

        /**
         * Returns all active animation objects.
         * For debugging mostly
         * @return {Array}
         */
        function _all() {
            return anims;
        }

        function stop() {
            anims.forEach(function (anim) {
                return anim.stop();
            });
            anims.length = 0;
        }

        var easings = exports.easings = {
            linear: function linear(t, b, c, d) {
                return c * t / d + b;
            },
            inQuad: function inQuad(t, b, c, d) {
                return c * (t /= d) * t + b;
            },
            outQuad: function outQuad(t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            },
            inOutQuad: function inOutQuad(t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                return -c / 2 * (--t * (t - 2) - 1) + b;
            },
            inCubic: function inCubic(t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            outCubic: function outCubic(t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            inOutCubic: function inOutCubic(t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            },
            inExpo: function inExpo(t, b, c, d) {
                return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b - c * 0.001;
            },
            outExpo: function outExpo(t, b, c, d) {
                return t == d ? b + c : c * 1.001 * (-Math.pow(2, -10 * t / d) + 1) + b;
            },
            inOutExpo: function inOutExpo(t, b, c, d) {
                if (t == 0) return b;
                if (t == d) return b + c;
                if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005;
                return c / 2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b;
            },
            inElastic: function inElastic(t, b, c, d, a, p) {
                var s;
                if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
                if (!a || a < Math.abs(c)) {
                    a = c;s = p / 4;
                } else s = p / (2 * Math.PI) * Math.asin(c / a);
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            outElastic: function outElastic(t, b, c, d, a, p) {
                var s;
                if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
                if (!a || a < Math.abs(c)) {
                    a = c;s = p / 4;
                } else s = p / (2 * Math.PI) * Math.asin(c / a);
                return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
            },
            inOutElastic: function inOutElastic(t, b, c, d, a, p) {
                var s;
                if (t == 0) return b;
                if ((t /= d / 2) == 2) return b + c;
                if (!p) p = d * (.3 * 1.5);
                if (!a || a < Math.abs(c)) {
                    a = c;s = p / 4;
                } else s = p / (2 * Math.PI) * Math.asin(c / a);
                if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
            },
            inBack: function inBack(t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            outBack: function outBack(t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            inOutBack: function inOutBack(t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
                return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
            },
            inBounce: function inBounce(t, b, c, d) {
                return c - this.outBounce(t, d - t, 0, c, d) + b;
            },
            outBounce: function outBounce(t, b, c, d) {
                if ((t /= d) < 1 / 2.75) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < 2 / 2.75) {
                    return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
                } else if (t < 2.5 / 2.75) {
                    return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
                }
            },
            inOutBounce: function inOutBounce(t, b, c, d) {
                if (t < d / 2) return this.inBounce(t * 2, 0, c, d) * .5 + b;
                return this.outBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            },
            outHard: function outHard(t, b, c, d) {
                var ts = (t /= d) * t;
                var tc = ts * t;
                return b + c * (1.75 * tc * ts + -7.4475 * ts * ts + 12.995 * tc + -11.595 * ts + 5.2975 * t);
            }
        };

        var Tween = exports.Tween = function () {
            function Tween(options) {
                _classCallCheck(this, Tween);

                this.options = extend({}, defaults, options);

                var e = this.options.easing;
                if (typeof e == 'string') {
                    if (!easings[e]) {
                        throw new Error('Unknown "' + e + '" easing function');
                    }
                    this.options.easing = easings[e];
                }

                if (typeof this.options.easing !== 'function') {
                    throw 'Easing should be a function';
                }

                this._id = 'tw' + idCounter++;

                if (this.options.autostart) {
                    this.start();
                }
            }

            /**
             * Start animation from the beginning
             */


            Tween.prototype.start = function start() {
                if (!this.animating) {
                    this.pos = 0;
                    this.startTime = Date.now() + (this.options.delay || 0);
                    this.infinite = this.options.duration === 'infinite';
                    this.endTime = this.infinite ? 0 : this.startTime + this.options.duration;
                    this.animating = true;
                    this.options.start(this);
                    addToQueue(this);
                }

                return this;
            };

            /**
             * Stop animation
             */


            Tween.prototype.stop = function stop() {
                if (this.animating) {
                    this.animating = false;
                    if (this.options.complete) {
                        this.options.complete(this);
                    }
                }
                return this;
            };

            Tween.prototype.toggle = function toggle() {
                if (this.animating) {
                    this.stop();
                } else {
                    this.start();
                }
            };

            return Tween;
        }();

        function mainLoop() {
            if (!anims.length) {
                // no animations left, stop polling
                return;
            }

            var now = Date.now();
            var filtered = [],
                tween,
                opt;

            // do not use Array.filter() of _.filter() function
            // since tween’s callbacks can add new animations
            // in runtime. In this case, filter function will loose
            // newly created animation
            for (var i = 0; i < anims.length; i++) {
                tween = anims[i];

                if (!tween.animating) {
                    continue;
                }

                opt = tween.options;

                if (tween.startTime > now) {
                    filtered.push(tween);
                    continue;
                }

                if (tween.infinite) {
                    // opt.step.call(tween, 0);
                    opt.step(0, tween);
                    filtered.push(tween);
                } else if (tween.pos === 1 || tween.endTime <= now) {
                    tween.pos = 1;
                    // opt.step.call(tween, opt.reverse ? 0 : 1);
                    opt.step(opt.reverse ? 0 : 1, tween);
                    tween.stop();
                } else {
                    tween.pos = opt.easing(now - tween.startTime, 0, 1, opt.duration);
                    // opt.step.call(tween, opt.reverse ? 1 - tween.pos : tween.pos);
                    opt.step(opt.reverse ? 1 - tween.pos : tween.pos, tween);
                    filtered.push(tween);
                }
            }

            anims = filtered;

            if (anims.length) {
                requestAnimationFrame(mainLoop);
            }
        }

        function addToQueue(tween) {
            if (anims.indexOf(tween) === -1) {
                anims.push(tween);
                if (anims.length === 1) {
                    mainLoop();
                }
            }
        }

        /***/ },
    /* 5 */
    /***/ function(module, exports, __webpack_require__) {

        'use strict';

        exports.__esModule = true;
        exports.init = init;
        exports.destoy = destoy;
        exports.toggle = toggle;
        exports.swap = swap;

        var _utils = __webpack_require__(3);

        var utils = _interopRequireWildcard(_utils);

        var _tween = __webpack_require__(4);

        var _tween2 = _interopRequireDefault(_tween);

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

        function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

        var animating = false;
        var state = {};

        function init(options) {
            state = {
                main: options.main,
                aside: options.aside,
                separator: options.separator
            };
        }

        function destoy() {
            state = null;
        }

        function toggle(complete) {
            if (animating) {
                return;
            }

            animating = true;

            var mainScreen = getActiveScreen(state.main);
            var asideScreen = getActiveScreen(state.aside);

            var s = switchReels(mainScreen, asideScreen, state.separator);

            utils.setTransform(state.separator, { translateX: s.separator.delta });

            utils.setStyle(s.main.aside.elem, { opacity: 0 }, { translateX: s.main.aside.delta });
            utils.setStyle(s.aside.main.elem, { opacity: 0 }, { translateX: s.aside.main.delta });
            utils.setTransform(s.main.main.elem, { translateX: s.main.main.delta });
            utils.setTransform(s.aside.aside.elem, { translateX: s.aside.aside.delta });

            var completeSteps = 3;
            var _complete = function _complete() {
                if (--completeSteps <= 0) {
                    animating = false;

                    releaseContentBlock(s.main.main.elem);
                    releaseContentBlock(s.main.aside.elem);
                    releaseContentBlock(s.aside.main.elem);
                    releaseContentBlock(s.aside.aside.elem);

                    swap();
                    complete && complete();
                }
            };

            animateContent(s.main.main, s.main.aside, _complete);
            animateContent(s.aside.aside, s.aside.main, _complete);
            animateSeparator(s.separator, _complete);
        }

        function swap() {
            var _ref = [state.aside, state.main];
            state.main = _ref[0];
            state.aside = _ref[1];
        }

        function getActiveScreen(reel) {
            return reel.querySelector('.reel__active-screen');
        }

        function rect(elem) {
            return elem.getBoundingClientRect();
        }

        function switchReels(main, aside, separator) {
            var mainContent = prepareContent(main);
            var asideContent = prepareContent(aside);
            var delta = function delta(obj) {
                obj.delta = obj.from - obj.to;
            };

            var result = {
                main: {
                    main: {
                        elem: mainContent.main,
                        from: rect(mainContent.main).left
                    },
                    aside: {
                        elem: mainContent.aside,
                        from: rect(mainContent.aside).left
                    }
                },
                aside: {
                    main: {
                        elem: asideContent.main,
                        from: rect(asideContent.main).left
                    },
                    aside: {
                        elem: asideContent.aside,
                        from: rect(asideContent.aside).left
                    }
                },
                separator: {
                    elem: separator,
                    from: rect(separator).left
                }
            };

            mainContent.main.style.width = mainContent.main.offsetWidth + 'px';
            asideContent.aside.style.width = asideContent.aside.offsetWidth + 'px';

            state.main.classList.add('reel_aside');
            state.main.classList.remove('reel_main');

            state.aside.classList.add('reel_main');
            state.aside.classList.remove('reel_aside');

            state.separator.setAttribute('data-lineage', state.aside.getAttribute('data-lineage'));

            utils.setStyle(mainContent.aside, {
                width: mainContent.aside.offsetWidth + 'px',
                top: -mainContent.main.offsetHeight + 'px'
            });

            utils.setStyle(asideContent.main, {
                width: asideContent.main.offsetWidth + 'px'
            });

            utils.setStyle(asideContent.aside, {
                top: -asideContent.main.offsetHeight + 'px'
            });

            result.main.main.to = rect(mainContent.main).left;
            result.main.aside.to = rect(mainContent.aside).left;
            result.aside.main.to = rect(asideContent.main).left;
            result.aside.aside.to = rect(asideContent.aside).left;
            result.separator.to = rect(separator).left;

            delta(result.main.main);
            delta(result.main.aside);
            delta(result.aside.main);
            delta(result.aside.aside);
            delta(result.separator);

            return result;
        }

        /**
         * Готовит контент экрана для анимации: показывает оба контентных
         * блока и размещает их на одном уровне
         * @return {Object} Объект с данными о контентных блоках
         */
        function prepareContent(container) {
            var main = container.querySelector('.reel__screen-content_main');
            var aside = container.querySelector('.reel__screen-content_aside');

            // utils.setStyle(main, {display: 'block'});
            // utils.setStyle(aside, {display: 'block'});
            main.classList.add('reel__screen-content_visible');
            aside.classList.add('reel__screen-content_visible');

            return {
                main: main,
                aside: aside
            };
        }

        function releaseContentBlock(elem) {
            var style = {
                // display: '',
                top: '',
                opacity: '',
                width: ''
            };
            style[utils.testProp('transform')] = '';
            utils.setStyle(elem, style);
            elem.classList.remove('reel__screen-content_visible');
        }

        function rand(n1, n2) {
            return n1 + (n2 - n1) * Math.random();
        }

        function animateContent(primary, secondary, complete) {
            return (0, _tween2['default'])({
                // delay: rand(0, 80),
                // duration: rand(350, 450),
                duration: 400,
                easing: 'outCubic',
                step: function step(pos) {
                    utils.setStyle(primary.elem, { opacity: 1 - pos }, {
                        translateX: primary.delta * (1 - pos)
                    });
                    utils.setStyle(secondary.elem, { opacity: pos }, {
                        translateX: secondary.delta * (1 - pos)
                    });
                },
                complete: complete
            });
        }

        function animateSeparator(obj, complete) {
            return (0, _tween2['default'])({
                duration: 500,
                easing: 'outBack',
                step: function step(pos) {
                    utils.setStyle(obj.elem, null, {
                        translateX: obj.delta * (1 - pos)
                    });
                },
                complete: complete
            });
        }

        /***/ },
    /* 6 */
    /***/ function(module, exports) {

        /**
         * Модуль для работы с колесом мыши
         */
        'use strict';

        exports.__esModule = true;
        exports.on = on;
        exports.off = off;
        var callbacks = [];

        // detect available wheel event
        var support = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support "wheel"
            document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
                'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

        function on(callback) {
            var _c = callback;
            if (support !== 'wheel') {
                _c = function _c(evt) {
                    callback(normalizeEvent(event));
                };
                _c.__original = callback;
            }

            callbacks.push(_c);
            document.addEventListener(support, _c, false);
        }

        function off() {
            if (!arguments.length) {
                // удаляем всех подписчиков
                return callbacks.forEach(removeCallback);
            }

            for (var i = 0, il = arguments.length; i < il; i++) {
                removeCallback(arguments[i]);
            }
        }

        function normalizeEvent(originalEvent) {
            // create a normalized event object
            var event = {
                // keep a ref to the original event object
                originalEvent: originalEvent,
                target: originalEvent.target || originalEvent.srcElement,
                type: 'wheel',
                deltaMode: originalEvent.type == 'MozMousePixelScroll' ? 0 : 1,
                deltaX: 0,
                deltaZ: 0,
                preventDefault: function preventDefault() {
                    originalEvent.preventDefault ? originalEvent.preventDefault() : originalEvent.returnValue = false;
                }
            };

            // calculate deltaY (and deltaX) according to the event
            if (support == 'mousewheel') {
                event.deltaY = -1 / 40 * originalEvent.wheelDelta;
                // Webkit also support wheelDeltaX
                originalEvent.wheelDeltaX && (event.deltaX = -1 / 40 * originalEvent.wheelDeltaX);
            } else {
                event.deltaY = originalEvent.detail;
            }

            return event;
        }

        function removeCallback(callback) {
            for (var i = callbacks.length - 1; i >= 0, c; i--) {
                var c = callbacks[i];
                if (c === callback || c.__original === callback) {
                    callbacks.splice(i, 1);
                    document.removeEventListener(support, c, false);
                }
            }
        }

        /***/ },
    /* 7 */
    /***/ function(module, exports) {

        /**
         * Модуль для фильтрации элементов.
         * Принимает два списка: он с самими фильтрами (секции), а второй — с данными,
         * которые нужно отфильтрвать. Фильтрация делается по атрибутам: в данных остаются
         * только те элементы, у которых атрибут `data-filter-value` равен значению
         * атрибута `data-filter-name` из текущего фильтра
         */
        'use strict';

        exports.__esModule = true;

        exports['default'] = function (filtersContainer, dataContainer) {
            var filters = $$('[data-filter-name]', filtersContainer);
            var data = $$('[data-filter-value]', dataContainer);

            var update = function update(selected) {
                toggleAttribute(filtersContainer, 'filtered', true);
                toggleAttribute(dataContainer, 'filtered', true);
                updateFilter(filters, data, selected);
            };

            document.addEventListener('click', function (evt) {
                var target = closest(evt.target, filters);
                if (target) {
                    // кликнули на фильтр: подсветим его
                    update(target);
                } else {
                    target = closest(evt.target, data);
                    if (target) {
                        if (getAttribute(target, 'filter-matched')) {
                            highlightData(data, target);
                        } else {
                            update(filters.filter(function (n) {
                                return getAttribute(n, 'filter-name') === getAttribute(target, 'filter-value');
                            })[0]);
                        }
                    }
                }
            });
        };

        ;

        var dataAttr = function dataAttr(name) {
            return (/^data\-/.test(name) ? name : 'data-' + name
            );
        };

        function $$(sel) {
            var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

            return Array.prototype.slice.call(context.querySelectorAll(sel), 0);
        }

        function updateFilter(filters, data, selectedFilter) {
            var filterNames = getAttribute(selectedFilter, 'filter-name');
            filters.forEach(function (f) {
                return toggleAttribute(f, 'filter-active', !selectedFilter || f === selectedFilter);
            });
            data.forEach(function (item) {
                return toggleAttribute(item, 'filter-matched', matchesFilter(filterNames, item));
            });
            highlightData(data, null);
        }

        function matchesFilter(filter, value) {
            if (value && 'nodeType' in value) {
                value = getAttribute(value, 'filter-value');
            }

            value = value.split(',').map(function (n) {
                return n.trim();
            }).filter(Boolean);
            return value.indexOf(filter) !== -1;
        }

        function highlightData(data, selectedItem) {
            if (selectedItem) {
                toggleAttribute(selectedItem, 'filter-active');
            }

            data.filter(function (item) {
                return item !== selectedItem;
            }).forEach(function (item) {
                return toggleAttribute(item, 'filter-active', false);
            });
        }

        function closest(elem, items) {
            while (elem && elem.parentNode && elem.parentNode !== document) {
                if (items.indexOf(elem) !== -1) {
                    return elem;
                }
                elem = elem.parentNode;
            }
        }

        function toggleAttribute(elem, attrName, active) {
            if (active == null) {
                active = !getAttribute(elem, attrName);
            }

            if (active) {
                elem.setAttribute(dataAttr(attrName), 'true');
            } else {
                elem.removeAttribute(dataAttr(attrName));
            }
            return elem;
        }

        function getAttribute(elem, attrName) {
            return elem && elem.getAttribute(dataAttr(attrName));
        }

        /***/ }
    /******/ ]);