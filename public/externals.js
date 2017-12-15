require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Catberry = require('./Catberry.js');
var BootstrapperBase = require('../lib/base/BootstrapperBase');
var StoreDispatcher = require('../lib/StoreDispatcher');
var ModuleApiProvider = require('./providers/ModuleApiProvider');
var CookieWrapper = require('./CookieWrapper');

var Bootstrapper = function (_BootstrapperBase) {
	_inherits(Bootstrapper, _BootstrapperBase);

	function Bootstrapper() {
		_classCallCheck(this, Bootstrapper);

		return _possibleConstructorReturn(this, (Bootstrapper.__proto__ || Object.getPrototypeOf(Bootstrapper)).call(this, Catberry));
	}

	_createClass(Bootstrapper, [{
		key: 'configure',
		value: function configure(configObject, locator) {
			_get(Bootstrapper.prototype.__proto__ || Object.getPrototypeOf(Bootstrapper.prototype), 'configure', this).call(this, configObject, locator);

			locator.register('storeDispatcher', StoreDispatcher, true);
			locator.register('moduleApiProvider', ModuleApiProvider, true);
			locator.register('cookieWrapper', CookieWrapper, true);

			locator.registerInstance('window', window);
		}
	}]);

	return Bootstrapper;
}(BootstrapperBase);

module.exports = new Bootstrapper();

},{"../lib/StoreDispatcher":13,"../lib/base/BootstrapperBase":14,"./Catberry.js":2,"./CookieWrapper":3,"./providers/ModuleApiProvider":9}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CatberryBase = require('../lib/base/CatberryBase');

var Promise = require('promise');

if (!('Promise' in window)) {
	window.Promise = Promise;
}

var Catberry = function (_CatberryBase) {
	_inherits(Catberry, _CatberryBase);

	function Catberry() {
		_classCallCheck(this, Catberry);

		var _this = _possibleConstructorReturn(this, (Catberry.__proto__ || Object.getPrototypeOf(Catberry)).call(this));

		_this._router = null;
		return _this;
	}

	_createClass(Catberry, [{
		key: 'wrapDocument',
		value: function wrapDocument() {
			var _this2 = this;

			var appDefinitions = require('appDefinitions');
			appDefinitions.routeDefinitions.forEach(function (routeDefinition) {
				return _this2.locator.registerInstance('routeDefinition', routeDefinition);
			});

			appDefinitions.routeDescriptors.forEach(function (routeDescriptor) {
				return _this2.locator.registerInstance('routeDescriptor', routeDescriptor);
			});

			appDefinitions.stores.forEach(function (store) {
				return _this2.locator.registerInstance('store', store);
			});

			appDefinitions.components.forEach(function (component) {
				return _this2.locator.registerInstance('component', component);
			});

			this._router = this.locator.resolve('requestRouter');
		}
	}, {
		key: 'startWhenReady',
		value: function startWhenReady() {
			var _this3 = this;

			if (window.catberry) {
				return Promise.resolve();
			}

			return new Promise(function (fulfill, reject) {
				window.document.addEventListener('DOMContentLoaded', function () {
					try {
						_this3.wrapDocument();
						window.catberry = _this3;
						fulfill();
					} catch (e) {
						reject(e);
					}
				});
			});
		}
	}]);

	return Catberry;
}(CatberryBase);

module.exports = Catberry;

},{"../lib/base/CatberryBase":15,"appDefinitions":"appDefinitions","promise":41}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CookieWrapperBase = require('../lib/base/CookieWrapperBase');

var CookieWrapper = function (_CookieWrapperBase) {
	_inherits(CookieWrapper, _CookieWrapperBase);

	function CookieWrapper(locator) {
		_classCallCheck(this, CookieWrapper);

		var _this = _possibleConstructorReturn(this, (CookieWrapper.__proto__ || Object.getPrototypeOf(CookieWrapper)).call(this));

		_this._window = locator.resolve('window');
		return _this;
	}

	_createClass(CookieWrapper, [{
		key: 'getCookieString',
		value: function getCookieString() {
			return this._window.document.cookie ? this._window.document.cookie.toString() : '';
		}
	}, {
		key: 'set',
		value: function set(cookieSetup) {
			var cookie = this._convertToCookieSetup(cookieSetup);
			this._window.document.cookie = cookie;
			return cookie;
		}
	}]);

	return CookieWrapper;
}(CookieWrapperBase);

module.exports = CookieWrapper;

},{"../lib/base/CookieWrapperBase":16}],4:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var morphdom = require('morphdom');
var uuid = require('uuid');
var errorHelper = require('../lib/helpers/errorHelper');
var moduleHelper = require('../lib/helpers/moduleHelper');
var hrTimeHelper = require('../lib/helpers/hrTimeHelper');
var DocumentRendererBase = require('../lib/base/DocumentRendererBase');

var SPECIAL_IDS = {
	$$head: '$$head',
	$$document: '$$document'
};
var TAG_NAMES = {
	HEAD: 'HEAD',
	STYLE: 'STYLE',
	SCRIPT: 'SCRIPT',
	LINK: 'LINK'
};

var NON_BUBBLING_EVENTS = {
	abort: true,
	blur: true,
	error: true,
	focus: true,
	load: true,
	mouseenter: true,
	mouseleave: true,
	resize: true,
	unload: true
};

var DocumentRenderer = function (_DocumentRendererBase) {
	_inherits(DocumentRenderer, _DocumentRendererBase);

	function DocumentRenderer(locator) {
		_classCallCheck(this, DocumentRenderer);

		var _this = _possibleConstructorReturn(this, (DocumentRenderer.__proto__ || Object.getPrototypeOf(DocumentRenderer)).call(this, locator));

		_this._componentInstances = Object.create(null);

		_this._componentElements = Object.create(null);

		_this._componentBindings = Object.create(null);

		_this._currentChangedStores = Object.create(null);

		_this._window = locator.resolve('window');

		_this._config = locator.resolve('config');

		_this._storeDispatcher = locator.resolve('storeDispatcher');

		_this._renderedPromise = null;

		_this._isUpdating = false;

		_this._awaitingRouting = null;

		_this._currentRoutingContext = null;

		_this._eventBus.on('storeChanged', function (storeName) {
			_this._currentChangedStores[storeName] = true;
			if (_this._isStateChanging) {
				return;
			}
			_this._updateStoreComponents();
		});
		return _this;
	}

	_createClass(DocumentRenderer, [{
		key: 'initWithState',
		value: function initWithState(state, routingContext) {
			var _this2 = this;

			return this._getPromiseForReadyState().then(function () {
				_this2._currentRoutingContext = routingContext;
				return _this2._storeDispatcher.setState(state, routingContext);
			}).then(function () {
				var components = _this2._componentLoader.getComponentsByNames();
				var documentElement = _this2._window.document.documentElement;
				var action = function action(element) {
					return _this2._initializeComponent(element, components);
				};
				return _this2._traverseComponents([documentElement], components, action);
			}).then(function () {
				return _this2._eventBus.emit('documentRendered', _this2._currentRoutingContext);
			});
		}
	}, {
		key: 'render',
		value: function render(state, routingContext) {
			var _this3 = this;

			this._awaitingRouting = {
				state: state,
				routingContext: routingContext
			};
			if (this._isStateChanging) {
				return this._renderedPromise;
			}

			this._isStateChanging = true;

			this._renderedPromise = this._getPromiseForReadyState().then(function () {
				return _this3._updateStoreComponents();
			}).catch(function (reason) {
				return _this3._eventBus.emit('error', reason);
			}).then(function () {
				_this3._isStateChanging = false;
			});

			return this._renderedPromise;
		}
	}, {
		key: 'renderComponent',
		value: function renderComponent(element, renderingContext) {
			var _this4 = this;

			return this._getPromiseForReadyState().then(function () {
				var id = _this4._getId(element);
				var componentName = moduleHelper.getOriginalComponentName(element.tagName);

				if (!renderingContext) {
					renderingContext = _this4._createRenderingContext([]);
					renderingContext.rootIds[id] = true;
				}

				var hadChildren = element.children.length > 0;
				var component = renderingContext.components[componentName];
				if (!component) {
					return null;
				}

				renderingContext.renderedIds[id] = true;

				var instance = _this4._componentInstances[id];
				if (!instance) {
					component.constructor.prototype.$context = _this4._getComponentContext(component, element);
					instance = new component.constructor(_this4._serviceLocator);
					instance.$context = component.constructor.prototype.$context;
					_this4._componentInstances[id] = instance;
				}

				var eventArgs = {
					name: componentName,
					context: instance.$context
				};

				_this4._componentElements[id] = element;

				var startTime = hrTimeHelper.get();
				_this4._eventBus.emit('componentRender', eventArgs);

				return Promise.resolve().then(function () {
					if (!(id in renderingContext.rootIds) || !hadChildren) {
						return [];
					}

					return _this4._unbindAll(element, renderingContext);
				}).catch(function (reason) {
					return _this4._eventBus.emit('error', reason);
				}).then(function () {
					var renderMethod = moduleHelper.getMethodToInvoke(instance, 'render');
					return moduleHelper.getSafePromise(renderMethod);
				}).then(function (dataContext) {
					return component.template.render(dataContext);
				}).catch(function (reason) {
					return _this4._handleRenderError(element, component, reason);
				}).then(function (html) {
					var isHead = element.tagName === TAG_NAMES.HEAD;
					if (html === '' && isHead) {
						return [];
					}

					var tmpElement = element.cloneNode(false);
					tmpElement.innerHTML = html;

					if (isHead) {
						_this4._mergeHead(element, tmpElement);
						return [];
					}

					morphdom(element, tmpElement, {
						onBeforeElChildrenUpdated: function onBeforeElChildrenUpdated(foundElement) {
							return foundElement === element || !_this4._isComponentElement(renderingContext.components, foundElement);
						}
					});

					var promises = _this4._findNestedComponents(element, renderingContext.components).map(function (child) {
						return _this4.renderComponent(child, renderingContext);
					});

					return Promise.all(promises);
				}).then(function () {
					eventArgs.hrTime = hrTimeHelper.get(startTime);
					eventArgs.time = hrTimeHelper.toMilliseconds(eventArgs.hrTime);
					_this4._eventBus.emit('componentRendered', eventArgs);
					return _this4._bindComponent(element);
				}).then(function () {
					if (!(id in renderingContext.rootIds) || !hadChildren) {
						return;
					}
					_this4._collectRenderingGarbage(renderingContext);
				}).catch(function (reason) {
					return _this4._eventBus.emit('error', reason);
				});
			});
		}
	}, {
		key: 'getComponentById',
		value: function getComponentById(id) {
			var element = this._window.document.getElementById(id);
			return this.getComponentByElement(element);
		}
	}, {
		key: 'queryComponentSelector',
		value: function queryComponentSelector(selector, parentComponent) {
			var parent = this._isComponentObject(parentComponent) ? parentComponent.$context.element : this._window.document;
			return this.getComponentByElement(parent.querySelector(selector));
		}
	}, {
		key: 'queryComponentSelectorAll',
		value: function queryComponentSelectorAll(selector, parentComponent) {
			var parent = this._isComponentObject(parentComponent) ? parentComponent.$context.element : this._window.document;
			return this._mapElementsToComponents(parent.querySelectorAll(selector));
		}
	}, {
		key: 'getComponentsByTagName',
		value: function getComponentsByTagName(tagName, parentComponent) {
			var parent = this._isComponentObject(parentComponent) ? parentComponent.$context.element : this._window.document;
			return this._mapElementsToComponents(parent.getElementsByTagName(tagName));
		}
	}, {
		key: 'getComponentsByClassName',
		value: function getComponentsByClassName(className, parentComponent) {
			var parent = this._isComponentObject(parentComponent) ? parentComponent.$context.element : this._window.document;
			return this._mapElementsToComponents(parent.getElementsByClassName(className));
		}
	}, {
		key: 'getComponentByElement',
		value: function getComponentByElement(element) {
			if (!element) {
				return null;
			}
			var id = element[moduleHelper.COMPONENT_ID];
			if (!id) {
				return null;
			}
			return this._componentInstances[id] || null;
		}
	}, {
		key: 'collectGarbage',
		value: function collectGarbage() {
			var _this5 = this;

			return this._getPromiseForReadyState().then(function () {
				var context = {
					roots: [],
					components: _this5._componentLoader.getComponentsByNames()
				};

				Object.keys(_this5._componentElements).forEach(function (id) {
					if (SPECIAL_IDS.hasOwnProperty(id)) {
						return;
					}

					var current = _this5._componentElements[id];
					while (current !== _this5._window.document.documentElement) {
						if (current.parentElement === null) {
							context.roots.push(current);
							break;
						}

						if (_this5._isComponentElement(context.components, current.parentElement)) {
							break;
						}
						current = current.parentElement;
					}
				});

				return _this5._removeDetachedComponents(context);
			});
		}
	}, {
		key: 'createComponent',
		value: function createComponent(tagName, attributes) {
			var _this6 = this;

			if (typeof tagName !== 'string') {
				return Promise.reject(new Error('The tag name must be a string'));
			}
			attributes = attributes || Object.create(null);

			return this._getPromiseForReadyState().then(function () {
				var components = _this6._componentLoader.getComponentsByNames();
				var componentName = moduleHelper.getOriginalComponentName(tagName);

				if (moduleHelper.isHeadComponent(componentName) || moduleHelper.isDocumentComponent(componentName) || !(componentName in components)) {
					return Promise.reject(new Error('Component for tag "' + tagName + '" not found'));
				}

				var safeTagName = moduleHelper.getTagNameForComponentName(componentName);
				var element = _this6._window.document.createElement(safeTagName);
				Object.keys(attributes).forEach(function (attributeName) {
					return element.setAttribute(attributeName, attributes[attributeName]);
				});

				return _this6.renderComponent(element).then(function () {
					return element;
				});
			});
		}
	}, {
		key: '_collectRenderingGarbage',
		value: function _collectRenderingGarbage(renderingContext) {
			var _this7 = this;

			Object.keys(renderingContext.unboundIds).forEach(function (id) {
				if (id in renderingContext.renderedIds) {
					return;
				}

				_this7._removeComponentById(id);
			});
		}
	}, {
		key: '_removeDetachedComponents',
		value: function _removeDetachedComponents(context) {
			var _this8 = this;

			if (context.roots.length === 0) {
				return Promise.resolve();
			}
			var root = context.roots.pop();
			return this._traverseComponents([root], context.components, function (element) {
				return _this8._removeDetachedComponent(element);
			}).then(function () {
				return _this8._removeDetachedComponents(context);
			});
		}
	}, {
		key: '_removeDetachedComponent',
		value: function _removeDetachedComponent(element) {
			var _this9 = this;

			var id = this._getId(element);
			return this._unbindComponent(element).then(function () {
				return _this9._removeComponentById(id);
			});
		}
	}, {
		key: '_unbindAll',
		value: function _unbindAll(element, renderingContext) {
			var _this10 = this;

			var action = function action(innerElement) {
				var id = _this10._getId(innerElement);
				renderingContext.unboundIds[id] = true;
				return _this10._unbindComponent(innerElement);
			};
			return this._traverseComponents([element], renderingContext.components, action);
		}
	}, {
		key: '_unbindComponent',
		value: function _unbindComponent(element) {
			var _this11 = this;

			var id = this._getId(element);
			var instance = this._componentInstances[id];

			if (!instance) {
				return Promise.resolve();
			}
			if (id in this._componentBindings) {
				Object.keys(this._componentBindings[id]).forEach(function (eventName) {
					element.removeEventListener(eventName, _this11._componentBindings[id][eventName].handler, NON_BUBBLING_EVENTS.hasOwnProperty(eventName));
				});
				delete this._componentBindings[id];
			}

			var unbindMethod = moduleHelper.getMethodToInvoke(instance, 'unbind');
			return moduleHelper.getSafePromise(unbindMethod).then(function () {
				_this11._eventBus.emit('componentUnbound', {
					element: element,
					id: element.id || null
				});
			}).catch(function (reason) {
				return _this11._eventBus.emit('error', reason);
			});
		}
	}, {
		key: '_removeComponentById',
		value: function _removeComponentById(id) {
			delete this._componentElements[id];
			delete this._componentInstances[id];
			delete this._componentBindings[id];
		}
	}, {
		key: '_bindComponent',
		value: function _bindComponent(element) {
			var _this12 = this;

			var id = this._getId(element);
			var instance = this._componentInstances[id];
			if (!instance) {
				return Promise.resolve();
			}

			var bindMethod = moduleHelper.getMethodToInvoke(instance, 'bind');
			return moduleHelper.getSafePromise(bindMethod).then(function (bindings) {
				if (!bindings || (typeof bindings === 'undefined' ? 'undefined' : _typeof(bindings)) !== 'object') {
					_this12._eventBus.emit('componentBound', {
						element: element,
						id: element.id || null
					});
					return;
				}
				_this12._componentBindings[id] = Object.create(null);
				Object.keys(bindings).forEach(function (eventName) {
					eventName = eventName.toLowerCase();
					if (eventName in _this12._componentBindings[id]) {
						return;
					}
					var selectorHandlers = Object.create(null);
					Object.keys(bindings[eventName]).forEach(function (selector) {
						var handler = bindings[eventName][selector];
						if (typeof handler !== 'function') {
							return;
						}
						selectorHandlers[selector] = handler.bind(instance);
					});
					_this12._componentBindings[id][eventName] = {
						handler: _this12._createBindingHandler(element, selectorHandlers),
						selectorHandlers: selectorHandlers
					};
					element.addEventListener(eventName, _this12._componentBindings[id][eventName].handler, NON_BUBBLING_EVENTS.hasOwnProperty(eventName));
				});
				_this12._eventBus.emit('componentBound', {
					element: element,
					id: element.id || null
				});
			});
		}
	}, {
		key: '_createBindingHandler',
		value: function _createBindingHandler(componentRoot, selectorHandlers) {
			var _this13 = this;

			var selectors = Object.keys(selectorHandlers);
			return function (event) {
				var element = event.target;
				var dispatchedEvent = createCustomEvent(event, function () {
					return element;
				});
				var targetMatches = _this13._getMatchesMethod(element);
				var isHandled = selectors.some(function (selector) {
					if (targetMatches(selector)) {
						selectorHandlers[selector](dispatchedEvent);
						return true;
					}
					return false;
				});

				if (isHandled || !event.bubbles) {
					return;
				}

				while (element.parentNode && element !== componentRoot) {
					element = element.parentNode;
					targetMatches = _this13._getMatchesMethod(element);
					isHandled = _this13._tryDispatchEvent(selectors, targetMatches, selectorHandlers, dispatchedEvent);
					if (isHandled) {
						break;
					}
				}
			};
		}
	}, {
		key: '_tryDispatchEvent',
		value: function _tryDispatchEvent(selectors, matchPredicate, handlers, event) {
			return selectors.some(function (selector) {
				if (!matchPredicate(selector)) {
					return false;
				}
				handlers[selector](event);
				return true;
			});
		}
	}, {
		key: '_isComponentElement',
		value: function _isComponentElement(components, element) {
			if (!moduleHelper.isComponentNode(element)) {
				return false;
			}
			return moduleHelper.getOriginalComponentName(element.nodeName) in components;
		}
	}, {
		key: '_isComponentObject',
		value: function _isComponentObject(obj) {
			return obj && obj.$context && _typeof(obj.$context) === 'object' && obj.$context.element instanceof this._window.Element;
		}
	}, {
		key: '_mapElementsToComponents',
		value: function _mapElementsToComponents(elements) {
			var _this14 = this;

			var results = [];
			Array.prototype.forEach.call(elements, function (element) {
				var component = _this14.getComponentByElement(element);
				if (component) {
					results.push(component);
				}
			});
			return results;
		}
	}, {
		key: '_traverseComponents',
		value: function _traverseComponents(elements, components, action) {
			if (elements.length === 0) {
				return Promise.resolve();
			}

			var root = elements.shift();
			elements = elements.concat(this._findNestedComponents(root, components));
			return this._traverseComponents(elements, components, action).then(function () {
				return action(root);
			});
		}
	}, {
		key: '_findNestedComponents',
		value: function _findNestedComponents(root, components) {
			var _this15 = this;

			var elements = [];
			var queue = [root];

			while (queue.length > 0) {
				var currentChildren = queue.shift().children;
				if (!currentChildren) {
					continue;
				}

				Array.prototype.forEach.call(currentChildren, function (currentChild) {
					if (!_this15._isComponentElement(components, currentChild)) {
						queue.push(currentChild);
						return;
					}

					elements.push(currentChild);
				});
			}
			return elements;
		}
	}, {
		key: '_handleRenderError',
		value: function _handleRenderError(element, component, error) {
			var _this16 = this;

			this._eventBus.emit('error', error);

			return Promise.resolve().then(function () {
				if (element.tagName === TAG_NAMES.HEAD) {
					return '';
				}

				if (!_this16._config.isRelease && error instanceof Error) {
					return errorHelper.prettyPrint(error, _this16._window.navigator.userAgent);
				} else if (component.errorTemplate) {
					return component.errorTemplate.render(error);
				}

				return '';
			}).catch(function () {
				return '';
			});
		}
	}, {
		key: '_updateStoreComponents',
		value: function _updateStoreComponents() {
			var _this17 = this;

			if (this._isUpdating) {
				return Promise.resolve();
			}

			var documentStore = this._window.document.documentElement.getAttribute(moduleHelper.ATTRIBUTE_STORE);
			if (documentStore in this._currentChangedStores) {
				var newLocation = this._currentRoutingContext.location.toString();
				if (newLocation === this._window.location.toString()) {
					this._window.location.reload();
					return Promise.resolve();
				}
				this._window.location.assign(newLocation);
				return Promise.resolve();
			}

			this._isUpdating = true;

			if (this._awaitingRouting) {
				var components = this._componentLoader.getComponentsByNames();
				var changedByState = this._storeDispatcher.setState(this._awaitingRouting.state, this._awaitingRouting.routingContext);

				changedByState.forEach(function (name) {
					_this17._currentChangedStores[name] = true;
				});

				this._currentRoutingContext = this._awaitingRouting.routingContext;
				Object.keys(this._componentInstances).forEach(function (id) {
					var instance = _this17._componentInstances[id];
					instance.$context = _this17._getComponentContext(components[instance.$context.name], instance.$context.element);
				});
				this._awaitingRouting = null;
			}

			var changedStores = Object.keys(this._currentChangedStores);
			if (changedStores.length === 0) {
				this._isUpdating = false;
				return Promise.resolve();
			}

			this._currentChangedStores = Object.create(null);

			var renderingContext = this._createRenderingContext(changedStores);
			var promises = renderingContext.roots.map(function (root) {
				renderingContext.rootIds[_this17._getId(root)] = true;
				return _this17.renderComponent(root, renderingContext);
			});

			return Promise.all(promises).catch(function (reason) {
				return _this17._eventBus.emit('error', reason);
			}).then(function () {
				_this17._isUpdating = false;
				_this17._eventBus.emit('documentUpdated', changedStores);
				return _this17._updateStoreComponents();
			});
		}
	}, {
		key: '_mergeHead',
		value: function _mergeHead(head, newHead) {
			if (!newHead) {
				return;
			}

			var headSet = Object.create(null);

			for (var i = 0; i < head.childNodes.length; i++) {
				var current = head.childNodes[i];
				if (!isTagImmutable(current)) {
					head.removeChild(current);
					i--;
					continue;
				}

				headSet[this._getElementKey(current)] = true;
			}

			for (var _i = 0; _i < newHead.children.length; _i++) {
				var _current = newHead.children[_i];
				if (this._getElementKey(_current) in headSet) {
					continue;
				}
				head.appendChild(_current);

				_i--;
			}
		}
	}, {
		key: '_getElementKey',
		value: function _getElementKey(element) {
			var attributes = [];

			switch (element.nodeName) {
				case TAG_NAMES.LINK:
					attributes.push('href=' + element.getAttribute('href'));
					break;
				case TAG_NAMES.SCRIPT:
					attributes.push('src=' + element.getAttribute('src'));
					break;
			}

			return '<' + element.nodeName + ' ' + attributes.sort().join(' ') + '>' + element.textContent + '</' + element.nodeName + '>';
		}
	}, {
		key: '_initializeComponent',
		value: function _initializeComponent(element, components) {
			var _this18 = this;

			return Promise.resolve().then(function () {
				var componentName = moduleHelper.getOriginalComponentName(element.nodeName);
				if (!(componentName in components)) {
					return null;
				}

				var id = _this18._getId(element);
				var ComponentConstructor = components[componentName].constructor;
				ComponentConstructor.prototype.$context = _this18._getComponentContext(components[componentName], element);

				var instance = new ComponentConstructor(_this18._serviceLocator);
				instance.$context = ComponentConstructor.prototype.$context;
				_this18._componentElements[id] = element;
				_this18._componentInstances[id] = instance;

				_this18._eventBus.emit('componentRendered', {
					name: componentName,
					attributes: instance.$context.attributes,
					context: instance.$context
				});
				return _this18._bindComponent(element);
			});
		}
	}, {
		key: '_getComponentContext',
		value: function _getComponentContext(component, element) {
			var _this19 = this;

			var storeName = element.getAttribute(moduleHelper.ATTRIBUTE_STORE);
			var componentContext = Object.create(this._currentRoutingContext);

			Object.defineProperties(componentContext, {
				name: {
					get: function get() {
						return component.name;
					},
					enumerable: true
				},
				attributes: {
					get: function get() {
						return attributesToObject(element.attributes);
					},
					enumerable: true
				}

			});

			var storeParams = moduleHelper.getStoreParamsFromAttributes(componentContext.attributes);
			var storeInstance = this._storeDispatcher.getStore(storeName, { storeParams: storeParams });
			var storeInstanceId = storeInstance && storeInstance.$context.storeInstanceId;

			if (storeInstanceId) {
				Object.defineProperties(componentContext, {
					storeInstanceId: {
						get: function get() {
							return storeInstanceId;
						},
						enumerable: true
					}
				});
			}

			componentContext.element = element;

			componentContext.getComponentById = function (id) {
				return _this19.getComponentById(id);
			};
			componentContext.getComponentByElement = function (element) {
				return _this19.getComponentByElement(element);
			};
			componentContext.getComponentsByTagName = function (tagName, parent) {
				return _this19.getComponentsByTagName(tagName, parent);
			};
			componentContext.getComponentsByClassName = function (className, parent) {
				return _this19.getComponentsByClassName(className, parent);
			};
			componentContext.queryComponentSelector = function (selector, parent) {
				return _this19.queryComponentSelector(selector, parent);
			};
			componentContext.queryComponentSelectorAll = function (selector, parent) {
				return _this19.queryComponentSelectorAll(selector, parent);
			};

			componentContext.reRenderComponent = function () {
				return _this19.renderComponent(element);
			};
			componentContext.createComponent = function (tagName, attributes) {
				return _this19.createComponent(tagName, attributes);
			};
			componentContext.collectGarbage = function () {
				return _this19.collectGarbage();
			};

			componentContext.getStoreData = function () {
				var storeName = element.getAttribute(moduleHelper.ATTRIBUTE_STORE);
				var storeParams = moduleHelper.getStoreParamsFromAttributes(componentContext.attributes);

				return _this19._storeDispatcher.getStoreData(storeName, {
					storeParams: storeParams,
					storeInstanceId: storeInstanceId
				});
			};
			componentContext.sendAction = function (name, args) {
				var options = { storeName: element.getAttribute(moduleHelper.ATTRIBUTE_STORE), storeInstanceId: storeInstanceId };
				return _this19._storeDispatcher.sendAction(options, name, args);
			};

			return Object.freeze(componentContext);
		}
	}, {
		key: '_findRenderingRoots',
		value: function _findRenderingRoots(changedStoreNames) {
			var _this20 = this;

			var headStore = this._window.document.head.getAttribute(moduleHelper.ATTRIBUTE_STORE);
			var components = this._componentLoader.getComponentsByNames();
			var componentElements = Object.create(null);
			var storeNamesSet = Object.create(null);
			var rootsSet = Object.create(null);
			var roots = [];

			changedStoreNames.forEach(function (storeName) {
				storeNamesSet[storeName] = true;
				var elements = _this20._window.document.querySelectorAll('[' + moduleHelper.ATTRIBUTE_STORE + '="' + storeName + '"]');
				if (elements.length === 0) {
					return;
				}
				componentElements[storeName] = elements;
			});

			if (headStore in storeNamesSet && moduleHelper.HEAD_COMPONENT_NAME in components) {
				rootsSet[this._getId(this._window.document.head)] = true;
				roots.push(this._window.document.head);
			}

			changedStoreNames.forEach(function (storeName) {
				if (!(storeName in componentElements)) {
					return;
				}

				var visitedIds = Object.create(null);

				Array.prototype.forEach.call(componentElements[storeName], function (current) {
					if (!moduleHelper.isComponentNode(current)) {
						return;
					}

					var currentRoot = current;
					var lastRoot = currentRoot;
					var lastRootId = _this20._getId(current);
					if (lastRootId in visitedIds) {
						return;
					}
					visitedIds[lastRootId] = true;

					while (currentRoot.parentElement) {
						currentRoot = currentRoot.parentElement;

						var currentId = _this20._getId(currentRoot);
						if (currentId in visitedIds) {
							return;
						}

						var currentStore = currentRoot.getAttribute(moduleHelper.ATTRIBUTE_STORE);
						var currentComponentName = moduleHelper.getOriginalComponentName(currentRoot.tagName);

						if (!currentStore || !(currentStore in storeNamesSet)) {
							continue;
						}

						if (!(currentComponentName in components)) {
							continue;
						}

						lastRoot = currentRoot;
						lastRootId = currentId;
					}

					if (lastRootId in rootsSet) {
						return;
					}
					rootsSet[lastRootId] = true;
					roots.push(lastRoot);
				});
			});

			return roots;
		}
	}, {
		key: '_createRenderingContext',
		value: function _createRenderingContext(changedStores) {
			var components = this._componentLoader.getComponentsByNames();

			return {
				config: this._config,
				renderedIds: Object.create(null),
				unboundIds: Object.create(null),
				isHeadRendered: false,
				bindMethods: [],
				routingContext: this._currentRoutingContext,
				components: components,
				rootIds: Object.create(null),
				roots: changedStores ? this._findRenderingRoots(changedStores) : []
			};
		}
	}, {
		key: '_getId',
		value: function _getId(element) {
			if (element === this._window.document.documentElement) {
				return SPECIAL_IDS.$$document;
			}

			if (element === this._window.document.head) {
				return SPECIAL_IDS.$$head;
			}

			if (!element[moduleHelper.COMPONENT_ID]) {
				element[moduleHelper.COMPONENT_ID] = uuid.v4();

				while (element[moduleHelper.COMPONENT_ID] in this._componentInstances) {
					element[moduleHelper.COMPONENT_ID] = uuid.v4();
				}
			}
			return element[moduleHelper.COMPONENT_ID];
		}
	}, {
		key: '_getMatchesMethod',
		value: function _getMatchesMethod(element) {
			var _this21 = this;

			var method = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.msMatchesSelector || function (selector) {
				return matches(_this21._window, element, selector);
			};

			return method.bind(element);
		}
	}]);

	return DocumentRenderer;
}(DocumentRendererBase);

function attributesToObject(attributes) {
	var result = Object.create(null);
	Array.prototype.forEach.call(attributes, function (current) {
		result[current.name] = current.value;
	});
	return result;
}

function matches(currentWindow, element, selector) {
	var ownerDocument = element.document || element.ownerDocument || currentWindow.document;
	var matched = ownerDocument.querySelectorAll(selector);
	return Array.prototype.some.call(matched, function (item) {
		return item === element;
	});
}

function createCustomEvent(event, currentTargetGetter) {
	var catEvent = Object.create(event);
	var keys = [];
	var properties = {};

	for (var key in event) {
		keys.push(key);
	}
	keys.forEach(function (key) {
		if (typeof event[key] === 'function') {
			properties[key] = {
				get: function get() {
					return event[key].bind(event);
				}
			};
			return;
		}

		properties[key] = {
			get: function get() {
				return event[key];
			},
			set: function set(value) {
				event[key] = value;
			}
		};
	});

	properties.currentTarget = {
		get: currentTargetGetter
	};
	Object.defineProperties(catEvent, properties);
	Object.seal(catEvent);
	Object.freeze(catEvent);
	return catEvent;
}

function isTagImmutable(element) {
	return element.nodeName === TAG_NAMES.SCRIPT || element.nodeName === TAG_NAMES.STYLE || element.nodeName === TAG_NAMES.LINK && element.getAttribute('rel') === 'stylesheet';
}

module.exports = DocumentRenderer;

},{"../lib/base/DocumentRendererBase":17,"../lib/helpers/errorHelper":21,"../lib/helpers/hrTimeHelper":6,"../lib/helpers/moduleHelper":22,"morphdom":38,"uuid":49}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URI = require('catberry-uri').URI;

var MOUSE_PRIMARY_KEY = 0;
var HREF_ATTRIBUTE_NAME = 'href';
var TARGET_ATTRIBUTE_NAME = 'target';
var A_TAG_NAME = 'A';
var BODY_TAG_NAME = 'BODY';

var RequestRouter = function () {
	function RequestRouter(locator) {
		var _this = this;

		_classCallCheck(this, RequestRouter);

		this._eventBus = locator.resolve('eventBus');

		this._window = locator.resolve('window');

		this._documentRenderer = locator.resolve('documentRenderer');

		this._stateProvider = locator.resolve('stateProvider');

		this._contextFactory = locator.resolve('contextFactory');

		this._isHistorySupported = this._window.history && this._window.history.pushState instanceof Function;

		this._wrapDocument();

		this._location = new URI(this._window.location.toString());

		this._state = this._stateProvider.getStateByUri(this._location);

		this._isStateInitialized = false;

		this._referrer = '';

		this._changeState(this._state).catch(function (reason) {
			return _this._handleError(reason);
		});
	}

	_createClass(RequestRouter, [{
		key: 'go',
		value: function go(locationString, isHistoryAction) {
			try {
				var newLocation = new URI(locationString).resolveRelative(this._location);
				var newLocationString = newLocation.toString();

				var currentAuthority = this._location.authority ? this._location.authority.toString() : null;
				var newAuthority = newLocation.authority ? newLocation.authority.toString() : null;

				if (!this._isHistorySupported || newLocation.scheme !== this._location.scheme || newAuthority !== currentAuthority) {
					this._window.location.assign(newLocationString);
					return Promise.resolve();
				}

				var newQuery = newLocation.query ? newLocation.query.toString() : null;
				var currentQuery = this._location.query ? this._location.query.toString() : null;

				if (newLocation.path === this._location.path && newQuery === currentQuery) {
					this._location = newLocation;
					this._window.location.hash = this._location.fragment || '';
					return Promise.resolve();
				}

				var state = this._stateProvider.getStateByUri(newLocation);
				if (!state) {
					this._window.location.assign(newLocationString);
					return Promise.resolve();
				}

				this._state = state;
				this._referrer = this._location;
				this._location = newLocation;

				if (!isHistoryAction) {
					this._window.history.pushState(state, '', newLocationString);
				}

				return this._changeState(state);
			} catch (e) {
				return Promise.reject(e);
			}
		}
	}, {
		key: '_changeState',
		value: function _changeState(state) {
			var _this2 = this;

			return Promise.resolve().then(function () {
				if (state === null) {
					_this2._window.location.reload();
					return null;
				}

				var routingContext = _this2._contextFactory.create({
					referrer: _this2._referrer || _this2._window.document.referrer,
					location: _this2._location,
					userAgent: _this2._window.navigator.userAgent
				});

				if (!_this2._isStateInitialized) {
					_this2._isStateInitialized = true;
					return _this2._documentRenderer.initWithState(state, routingContext);
				}

				return _this2._documentRenderer.render(state, routingContext);
			});
		}
	}, {
		key: '_wrapDocument',
		value: function _wrapDocument() {
			var _this3 = this;

			if (!this._isHistorySupported) {
				return;
			}

			this._window.addEventListener('popstate', function () {
				return Promise.resolve().then(function () {
					return _this3.go(_this3._window.location.toString(), true);
				}).catch(function (reason) {
					return _this3._handleError(reason);
				});
			});

			this._window.document.body.addEventListener('click', function (event) {
				if (event.defaultPrevented) {
					return;
				}
				if (event.target.tagName === A_TAG_NAME) {
					_this3._linkClickHandler(event, event.target);
				} else {
					var link = closestLink(event.target);
					if (!link) {
						return;
					}
					_this3._linkClickHandler(event, link);
				}
			});
		}
	}, {
		key: '_linkClickHandler',
		value: function _linkClickHandler(event, element) {
			var _this4 = this;

			var targetAttribute = element.getAttribute(TARGET_ATTRIBUTE_NAME);
			if (targetAttribute) {
				return;
			}

			if (event.button !== MOUSE_PRIMARY_KEY || event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
				return;
			}

			var locationString = element.getAttribute(HREF_ATTRIBUTE_NAME);
			if (!locationString) {
				return;
			}

			event.preventDefault();
			this.go(locationString).catch(function (reason) {
				return _this4._handleError(reason);
			});
		}
	}, {
		key: '_handleError',
		value: function _handleError(error) {
			this._eventBus.emit('error', error);
		}
	}]);

	return RequestRouter;
}();

function closestLink(element) {
	while (element && element.nodeName !== A_TAG_NAME && element.nodeName !== BODY_TAG_NAME) {
		element = element.parentNode;
	}
	return element && element.nodeName === A_TAG_NAME ? element : null;
}

module.exports = RequestRouter;

},{"catberry-uri":31}],6:[function(require,module,exports){
'use strict';

module.exports = {
	get: require('browser-process-hrtime'),

	toMessage: require('pretty-hrtime'),

	toMilliseconds: function toMilliseconds(hrTime) {
		return hrTime[0] * 1e3 + Math.round(hrTime[1] / 1e6);
	}
};

},{"browser-process-hrtime":28,"pretty-hrtime":39}],7:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var moduleHelper = require('../../lib/helpers/moduleHelper');
var templateHelper = require('../../lib/helpers/templateHelper');
var LoaderBase = require('../../lib/base/LoaderBase');

var ComponentLoader = function (_LoaderBase) {
	_inherits(ComponentLoader, _LoaderBase);

	function ComponentLoader(locator) {
		_classCallCheck(this, ComponentLoader);

		var componentTransforms;
		try {
			componentTransforms = locator.resolveAll('componentTransform');
		} catch (e) {
			componentTransforms = [];
		}

		var _this = _possibleConstructorReturn(this, (ComponentLoader.__proto__ || Object.getPrototypeOf(ComponentLoader)).call(this, locator, componentTransforms));

		_this._serviceLocator = locator;

		_this._eventBus = locator.resolve('eventBus');

		_this._templateProvidersByNames = templateHelper.resolveTemplateProvidersByNames(locator);

		_this._loadedComponents = null;
		return _this;
	}

	_createClass(ComponentLoader, [{
		key: 'load',
		value: function load() {
			var _this2 = this;

			if (this._loadedComponents) {
				return Promise.resolve(this._loadedComponents);
			}

			this._loadedComponents = Object.create(null);

			return Promise.resolve().then(function () {
				return _this2._serviceLocator.resolveAll('component');
			}).catch(function () {
				return [];
			}).then(function (components) {
				var componentPromises = [];

				components.forEach(function (component) {
					if (!component || (typeof component === 'undefined' ? 'undefined' : _typeof(component)) !== 'object') {
						return;
					}
					componentPromises.unshift(_this2._processComponent(component));
				});
				return Promise.all(componentPromises);
			}).then(function (components) {
				components.forEach(function (component) {
					if (!component) {
						return;
					}
					_this2._loadedComponents[component.name] = component;
				});
				_this2._eventBus.emit('allComponentsLoaded', components);
				return _this2._loadedComponents;
			});
		}
	}, {
		key: '_processComponent',
		value: function _processComponent(componentDetails) {
			var _this3 = this;

			var component = Object.create(componentDetails);

			return this._applyTransforms(component).then(function (transformed) {
				if (!transformed) {
					throw new Error('Transformation for the "' + componentDetails.name + '" component returned a bad result');
				}
				component = Object.create(transformed);
				component.templateProvider = _this3._templateProvidersByNames[component.templateProviderName];
				component.errorTemplateProvider = _this3._templateProvidersByNames[component.errorTemplateProviderName];

				if (!component.templateProvider && component.errorTemplateProviderName && !component.errorTemplateProvider) {
					throw new Error('Template provider required by the component "' + component.name + '" not found');
				}

				templateHelper.registerTemplates(component);

				_this3._eventBus.emit('componentLoaded', component);
				return component;
			}).catch(function (reason) {
				_this3._eventBus.emit('error', reason);
				return null;
			});
		}
	}, {
		key: 'getComponentsByNames',
		value: function getComponentsByNames() {
			return this._loadedComponents || Object.create(null);
		}
	}]);

	return ComponentLoader;
}(LoaderBase);

module.exports = ComponentLoader;

},{"../../lib/base/LoaderBase":18,"../../lib/helpers/moduleHelper":22,"../../lib/helpers/templateHelper":24}],8:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoaderBase = require('../../lib/base/LoaderBase');

var StoreLoader = function (_LoaderBase) {
	_inherits(StoreLoader, _LoaderBase);

	function StoreLoader(locator) {
		_classCallCheck(this, StoreLoader);

		var storeTransforms;
		try {
			storeTransforms = locator.resolveAll('storeTransform');
		} catch (e) {
			storeTransforms = [];
		}

		var _this = _possibleConstructorReturn(this, (StoreLoader.__proto__ || Object.getPrototypeOf(StoreLoader)).call(this, locator, storeTransforms));

		_this._serviceLocator = locator;

		_this._eventBus = locator.resolve('eventBus');

		_this._loadedStores = null;
		return _this;
	}

	_createClass(StoreLoader, [{
		key: 'load',
		value: function load() {
			var _this2 = this;

			if (this._loadedStores) {
				return Promise.resolve(this._loadedStores);
			}

			this._loadedStores = Object.create(null);

			return Promise.resolve().then(function () {
				return _this2._serviceLocator.resolveAll('store');
			}).catch(function () {
				return [];
			}).then(function (stores) {
				var storePromises = [];

				stores.forEach(function (store) {
					if (!store || (typeof store === 'undefined' ? 'undefined' : _typeof(store)) !== 'object') {
						return;
					}
					storePromises.unshift(_this2._getStore(store));
				});
				return Promise.all(storePromises);
			}).then(function (stores) {
				stores.forEach(function (store) {
					if (!store) {
						return;
					}
					_this2._loadedStores[store.name] = store;
				});
				_this2._eventBus.emit('allStoresLoaded', _this2._loadedStores);
				return Promise.resolve(_this2._loadedStores);
			});
		}
	}, {
		key: '_getStore',
		value: function _getStore(storeDetails) {
			var _this3 = this;

			return this._applyTransforms(storeDetails).then(function (transformed) {
				if (!transformed) {
					throw new Error('Transformation for the "' + storeDetails.name + '" store returned a bad result');
				}
				_this3._eventBus.emit('storeLoaded', transformed);
				return transformed;
			}).catch(function (reason) {
				_this3._eventBus.emit('error', reason);
				return null;
			});
		}
	}, {
		key: 'getStoresByNames',
		value: function getStoresByNames() {
			return this._loadedStores || Object.create(null);
		}
	}]);

	return StoreLoader;
}(LoaderBase);

module.exports = StoreLoader;

},{"../../lib/base/LoaderBase":18}],9:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propertyHelper = require('../../lib/helpers/propertyHelper');
var ModuleApiProviderBase = require('../../lib/base/ModuleApiProviderBase');

var ModuleApiProvider = function (_ModuleApiProviderBas) {
	_inherits(ModuleApiProvider, _ModuleApiProviderBas);

	function ModuleApiProvider(locator) {
		_classCallCheck(this, ModuleApiProvider);

		return _possibleConstructorReturn(this, (ModuleApiProvider.__proto__ || Object.getPrototypeOf(ModuleApiProvider)).call(this, locator));
	}

	_createClass(ModuleApiProvider, [{
		key: 'notFound',
		value: function notFound() {
			var window = this.locator.resolve('window');
			window.location.reload();
			return Promise.resolve();
		}
	}, {
		key: 'redirect',
		value: function redirect(uriString) {
			var requestRouter = this.locator.resolve('requestRouter');
			return requestRouter.go(uriString);
		}
	}, {
		key: 'clearFragment',
		value: function clearFragment() {
			var window = this.locator.resolve('window');
			var position = window.document.body.scrollTop;
			window.location.hash = '';
			window.document.body.scrollTop = position;
			return Promise.resolve();
		}
	}, {
		key: 'isBrowser',
		get: function get() {
			return true;
		}
	}, {
		key: 'isServer',
		get: function get() {
			return false;
		}
	}]);

	return ModuleApiProvider;
}(ModuleApiProviderBase);

module.exports = ModuleApiProvider;

},{"../../lib/base/ModuleApiProviderBase":19,"../../lib/helpers/propertyHelper":23}],10:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StateProviderBase = require('../../lib/base/StateProviderBase');

var StateProvider = function (_StateProviderBase) {
	_inherits(StateProvider, _StateProviderBase);

	function StateProvider() {
		_classCallCheck(this, StateProvider);

		return _possibleConstructorReturn(this, (StateProvider.__proto__ || Object.getPrototypeOf(StateProvider)).apply(this, arguments));
	}

	_createClass(StateProvider, [{
		key: '_getRouteDescriptors',
		value: function _getRouteDescriptors(serviceLocator) {
			var descriptors = [];

			var routeDefinitions = void 0;

			try {
				routeDefinitions = serviceLocator.resolveAll('routeDefinition');
			} catch (e) {
				routeDefinitions = [];
			}

			var routeDescriptors = Object.create(null);

			try {
				serviceLocator.resolveAll('routeDescriptor').forEach(function (descriptor) {
					routeDescriptors[descriptor.expression] = descriptor;
				});
			} catch (e) {}

			routeDefinitions.forEach(function (route) {
				if (typeof route === 'string') {
					descriptors.push(routeDescriptors[route]);
					return;
				}

				if ((typeof route === 'undefined' ? 'undefined' : _typeof(route)) === 'object' && typeof route.expression === 'string') {

					var descriptor = routeDescriptors[route.expression];

					if (typeof route.name === 'string') {
						descriptor.name = route.name;
					}

					if (route.map instanceof Function) {
						descriptor.map = route.map;
					}

					descriptors.push(descriptor);
					return;
				}

				if ((typeof route === 'undefined' ? 'undefined' : _typeof(route)) === 'object' && route.expression instanceof RegExp && route.map instanceof Function) {
					descriptors.push(route);
				}
			});

			return descriptors;
		}
	}]);

	return StateProvider;
}(StateProviderBase);

module.exports = StateProvider;

},{"../../lib/base/StateProviderBase":20}],11:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var propertyHelper = require('./helpers/propertyHelper');

var ContextFactory = function () {
	function ContextFactory(locator) {
		_classCallCheck(this, ContextFactory);

		this._serviceLocator = locator;
	}

	_createClass(ContextFactory, [{
		key: 'create',
		value: function create(additional) {
			var apiProvider = this._serviceLocator.resolve('moduleApiProvider');
			var context = Object.create(apiProvider);
			Object.keys(additional).forEach(function (key) {
				return propertyHelper.defineReadOnly(context, key, additional[key]);
			});
			return context;
		}
	}]);

	return ContextFactory;
}();

module.exports = ContextFactory;

},{"./helpers/propertyHelper":23}],12:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var events = require('events');

var SerialWrapper = function () {
	function SerialWrapper() {
		_classCallCheck(this, SerialWrapper);

		this._emitter = new events.EventEmitter();
		this._emitter.setMaxListeners(0);

		this._toInvoke = Object.create(null);

		this._inProgress = Object.create(null);
	}

	_createClass(SerialWrapper, [{
		key: 'add',
		value: function add(name, toInvoke) {
			this._toInvoke[name] = toInvoke;
		}
	}, {
		key: 'isRegistered',
		value: function isRegistered(name) {
			return typeof this._toInvoke[name] === 'function';
		}
	}, {
		key: 'invoke',
		value: function invoke(name) {
			var _this = this;

			if (!this.isRegistered(name)) {
				return Promise.reject(new Error('Method "' + name + '" is no such registered'));
			}

			if (this._inProgress[name]) {
				return new Promise(function (fulfill, reject) {
					_this._emitter.once(name, fulfill);
					_this._emitter.once(name + '--error', reject);
				});
			}

			this._inProgress[name] = true;
			this._toInvoke[name]().then(function (result) {
				_this._emitter.emit(name, result);
				_this._inProgress[name] = null;
			}).catch(function (reason) {
				_this._emitter.emit(name + '--error', reason);
				_this._inProgress[name] = null;
			});

			return this.invoke(name);
		}
	}]);

	return SerialWrapper;
}();

module.exports = SerialWrapper;

},{"events":37}],13:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SerialWrapper = require('./SerialWrapper');
var moduleHelper = require('./helpers/moduleHelper');
var propertyHelper = require('./helpers/propertyHelper');
var uuid = require('uuid');

var DEFAULT_LIFETIME = 60000;

var StoreDispatcher = function () {
	function StoreDispatcher(locator) {
		_classCallCheck(this, StoreDispatcher);

		this._serviceLocator = locator;

		this._storeLoader = locator.resolve('storeLoader');

		this._eventBus = locator.resolve('eventBus');

		this._storeInstances = Object.create(null);

		this._lastData = Object.create(null);

		this._lastState = null;

		this._dependants = Object.create(null);

		this._serialWrapper = new SerialWrapper();

		this._currentBasicContext = null;
	}

	_createClass(StoreDispatcher, [{
		key: 'getStoreData',
		value: function getStoreData(storeName) {
			var _this = this;

			var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			if (!this._lastState) {
				return this._errorState();
			}

			if (typeof storeName !== 'string') {
				return Promise.resolve(null);
			}

			var storeInstanceId = options.storeInstanceId;
			var storeParams = options.storeParams;

			var cacheStoreName = moduleHelper.getStoreCacheKey(storeName, storeInstanceId);

			if (cacheStoreName in this._lastData) {
				var existTime = Date.now() - this._lastData[cacheStoreName].createdAt;

				if (existTime <= this._lastData[cacheStoreName].lifetime) {
					return Promise.resolve(this._lastData[cacheStoreName].data);
				}

				delete this._lastData[cacheStoreName];
			}

			this._eventBus.emit('storeDataLoad', {
				name: storeName
			});

			var store = this.getStore(storeName, { storeParams: storeParams, storeInstanceId: storeInstanceId });

			console.log('test', storeInstanceId, store.$context.storeInstanceId);

			if (!store) {
				return this._errorStoreNotFound(storeName, storeInstanceId);
			}

			var lifetime = typeof store.$lifetime === 'number' ? store.$lifetime : DEFAULT_LIFETIME;

			storeInstanceId = store.$context.storeInstanceId;

			return this._serialWrapper.invoke(moduleHelper.getStoreCacheKey(storeName, storeInstanceId)).then(function (data) {
				if (!storeParams) {
					_this._lastData[cacheStoreName] = {
						data: data,
						lifetime: lifetime,
						createdAt: Date.now()
					};
				}

				_this._eventBus.emit('storeDataLoaded', {
					name: storeName,
					storeInstanceId: storeInstanceId,
					data: data,
					lifetime: lifetime
				});
				return data;
			});
		}
	}, {
		key: 'sendAction',
		value: function sendAction(options, actionName, args) {
			var _this2 = this;

			if (!this._lastState) {
				return this._errorState();
			}

			var storeInstanceId = void 0;
			var storeName = void 0;

			if (typeof options === 'string') {
				storeName = options;
			}

			if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' && options !== null) {
				storeName = options.storeName;
				storeInstanceId = options.storeInstanceId;
			}

			var actionDetails = {
				storeName: storeName,
				storeInstanceId: storeInstanceId,
				actionName: actionName,
				args: args
			};
			this._eventBus.emit('actionSend', actionDetails);

			var store = this.getStore(storeName, { storeInstanceId: storeInstanceId });
			if (!store) {
				return this._errorStoreNotFound(storeName, storeInstanceId);
			}

			var handleMethod = moduleHelper.getMethodToInvoke(store, 'handle', actionName);
			return moduleHelper.getSafePromise(function () {
				return handleMethod(args);
			}).then(function (result) {
				_this2._eventBus.emit('actionSent', actionDetails);
				return result;
			});
		}
	}, {
		key: 'setState',
		value: function setState(parameters, basicContext) {
			var _this3 = this;

			parameters = parameters || Object.create(null);

			var stores = this._storeLoader.getStoresByNames();
			var parameterNames = Object.keys(parameters);
			parameterNames.forEach(function (storeName) {
				if (!(storeName in stores)) {
					_this3._eventBus.emit('warn', 'Store "' + storeName + '" does not exist (might be a typo in a route)');
				}
			});

			if (!this._lastState) {
				this._currentBasicContext = basicContext;
				this._lastState = parameters;
				return [];
			}

			var changed = Object.create(null);

			Object.keys(this._lastState).filter(function (storeName) {
				return !(storeName in parameters);
			}).forEach(function (name) {
				changed[name] = true;
			});

			parameterNames.forEach(function (storeName) {
				if (!(storeName in _this3._lastState)) {
					changed[storeName] = true;
					return;
				}

				var lastParameterNames = Object.keys(_this3._lastState[storeName]);
				var currentParameterNames = Object.keys(parameters[storeName]);

				if (currentParameterNames.length !== lastParameterNames.length) {
					changed[storeName] = true;
					return;
				}

				currentParameterNames.every(function (parameterName) {
					if (parameters[storeName][parameterName] !== _this3._lastState[storeName][parameterName]) {
						changed[storeName] = true;
						return false;
					}
					return true;
				});
			});

			this._lastState = parameters;
			if (this._currentBasicContext !== basicContext) {
				this._currentBasicContext = basicContext;
				Object.keys(this._storeInstances).forEach(function (storeName) {
					Object.keys(_this3._storeInstances[storeName]).forEach(function (storeInstanceId) {
						var params = _this3._storeInstances[storeName][storeInstanceId].$context.params;
						_this3._storeInstances[storeName][storeInstanceId].$context = _this3._getStoreContext(storeName, {
							storeInstanceId: storeInstanceId, params: params
						});
					});
				});
			}

			var changedStoreNames = Object.create(null);
			Object.keys(changed).forEach(function (storeName) {
				Object.keys(_this3._storeInstances[storeName]).forEach(function (storeInstanceId) {
					var storeParams = _this3._storeInstances[storeName][storeInstanceId].$context.params;
					var store = _this3.getStore(storeName, { storeInstanceId: storeInstanceId, storeParams: storeParams });

					if (!store) {
						return;
					}

					store.$context.changed().forEach(function (name) {
						changedStoreNames[name] = true;
					});
				});
			});

			this._eventBus.emit('stateChanged', {
				oldState: this._lastState,
				newState: parameters
			});
			return Object.keys(changedStoreNames);
		}
	}, {
		key: '_getStoreContext',
		value: function _getStoreContext(storeName, properties) {
			var _this4 = this;

			var storeContext = Object.create(this._currentBasicContext);

			propertyHelper.defineReadOnly(storeContext, 'name', storeName);
			propertyHelper.defineReadOnly(storeContext, 'state', this._lastState[storeName] || Object.create(null));

			if ((typeof properties === 'undefined' ? 'undefined' : _typeof(properties)) === 'object' && properties !== null) {
				Object.keys(properties).forEach(function (propName) {
					return propertyHelper.defineReadOnly(storeContext, propName, properties[propName]);
				});
			}

			storeContext.changed = function () {
				var walked = Object.create(null);
				var toChange = [storeName];

				while (toChange.length > 0) {
					var current = toChange.shift();
					if (current in walked) {
						continue;
					}
					walked[current] = true;
					if (current in _this4._dependants) {
						toChange = toChange.concat(Object.keys(_this4._dependants[current]));
					}
					delete _this4._lastData[current];
					_this4._eventBus.emit('storeChanged', current);
				}
				return Object.keys(walked);
			};

			storeContext.getStoreData = function (sourceStoreName, sourceStoreInstanceId) {
				if (sourceStoreName === storeName) {
					return Promise.resolve(null);
				}

				return _this4.getStoreData(sourceStoreName, { storeInstanceId: sourceStoreInstanceId });
			};

			storeContext.setDependency = function (name) {
				if (!(name in _this4._dependants)) {
					_this4._dependants[name] = Object.create(null);
				}
				_this4._dependants[name][storeName] = true;
			};
			storeContext.unsetDependency = function (name) {
				if (!(name in _this4._dependants)) {
					return;
				}
				delete _this4._dependants[name][storeName];
			};
			storeContext.sendAction = function (storeName, name, args) {
				return _this4.sendAction(storeName, name, args);
			};

			return storeContext;
		}
	}, {
		key: 'getStore',
		value: function getStore(storeName, options) {
			if (!storeName) {
				return null;
			}

			var _ref = options || {},
			    storeInstanceId = _ref.storeInstanceId,
			    storeParams = _ref.storeParams;

			var isDynamicStore = moduleHelper.isDynamicStore(storeName);

			if (!storeInstanceId) {
				storeInstanceId = uuid.v4();
			}

			var instances = this._storeInstances[storeName];
			var store = instances && instances[storeInstanceId];

			if (!store && !isDynamicStore) {
				store = instances && Object.values(instances)[0];
			}

			if (store) {
				return store;
			}

			var stores = this._storeLoader.getStoresByNames();
			if (!(storeName in stores)) {
				return null;
			}

			var StoreConstructor = stores[storeName].constructor;

			StoreConstructor.prototype.$context = this._getStoreContext(storeName, {
				storeInstanceId: storeInstanceId,
				params: storeParams || {}
			});

			if (!this._storeInstances[storeName]) {
				this._storeInstances[storeName] = Object.create(null);
			}

			var instance = new StoreConstructor(this._serviceLocator);

			instance.$context = StoreConstructor.prototype.$context;

			this._storeInstances[storeName][storeInstanceId] = instance;

			this._serialWrapper.add(moduleHelper.getStoreCacheKey(storeName, storeInstanceId), function () {
				var loadMethod = moduleHelper.getMethodToInvoke(instance, 'load');

				return moduleHelper.getSafePromise(loadMethod);
			});

			this._eventBus.emit('debug', 'Store ' + storeName + '[' + storeInstanceId + '] init');
			this._eventBus.emit('debug', 'Params: ' + JSON.stringify(storeParams));

			return instance;
		}
	}, {
		key: '_errorStoreNotFound',
		value: function _errorStoreNotFound(name, storeInstanceId) {
			var instanceIdText = storeInstanceId ? '(instance id "' + storeInstanceId + '")' : '';
			return Promise.reject(new Error('Store "' + name + '" ' + instanceIdText + ' not found'));
		}
	}, {
		key: '_errorState',
		value: function _errorState() {
			return Promise.reject(new Error('State should be set before any request'));
		}
	}]);

	return StoreDispatcher;
}();

module.exports = StoreDispatcher;

},{"./SerialWrapper":12,"./helpers/moduleHelper":22,"./helpers/propertyHelper":23,"uuid":49}],14:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var moduleHelper = require('../helpers/moduleHelper');
var StateProvider = require('../providers/StateProvider');
var StoreLoader = require('../loaders/StoreLoader');
var ComponentLoader = require('../loaders/ComponentLoader');
var DocumentRenderer = require('../DocumentRenderer');
var RequestRouter = require('../RequestRouter');
var ModuleApiProviderBase = require('../base/ModuleApiProviderBase');
var ContextFactory = require('../ContextFactory');
var EventEmitter = require('events').EventEmitter;

var BootstrapperBase = function () {
	function BootstrapperBase(catberryConstructor) {
		_classCallCheck(this, BootstrapperBase);

		this._catberryConstructor = catberryConstructor;
	}

	_createClass(BootstrapperBase, [{
		key: 'create',
		value: function create(configObject) {
			var currentConfig = configObject || {};
			var catberry = new this._catberryConstructor();

			this.configure(currentConfig, catberry.locator);
			catberry.events = new ModuleApiProviderBase(catberry.locator);
			return catberry;
		}
	}, {
		key: 'configure',
		value: function configure(configObject, locator) {
			var eventBus = new EventEmitter();
			eventBus.setMaxListeners(0);
			locator.registerInstance('eventBus', eventBus);
			locator.registerInstance('config', configObject);
			locator.register('stateProvider', StateProvider, true);
			locator.register('contextFactory', ContextFactory, true);
			locator.register('storeLoader', StoreLoader, true);
			locator.register('componentLoader', ComponentLoader, true);
			locator.register('documentRenderer', DocumentRenderer, true);
			locator.register('requestRouter', RequestRouter, true);
		}
	}]);

	return BootstrapperBase;
}();

module.exports = BootstrapperBase;

},{"../ContextFactory":11,"../DocumentRenderer":4,"../RequestRouter":5,"../base/ModuleApiProviderBase":19,"../helpers/moduleHelper":22,"../loaders/ComponentLoader":7,"../loaders/StoreLoader":8,"../providers/StateProvider":10,"events":37}],15:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ServiceLocator = require('catberry-locator');

var CatberryBase = function CatberryBase() {
	_classCallCheck(this, CatberryBase);

	this.locator = new ServiceLocator();

	this.version = '9.0.0';

	this.events = null;

	this.locator.registerInstance('serviceLocator', this.locator);
	this.locator.registerInstance('catberry', this);
};

module.exports = CatberryBase;

},{"catberry-locator":30}],16:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CookieWrapperBase = function () {
	function CookieWrapperBase() {
		_classCallCheck(this, CookieWrapperBase);
	}

	_createClass(CookieWrapperBase, [{
		key: 'getAll',
		value: function getAll() {
			var string = this.getCookieString();
			return this._parseCookieString(string);
		}
	}, {
		key: 'get',
		value: function get(name) {
			if (typeof name !== 'string') {
				return '';
			}

			return this.getAll()[name] || '';
		}
	}, {
		key: '_parseCookieString',
		value: function _parseCookieString(string) {
			var cookie = Object.create(null);

			if (typeof string !== 'string') {
				return cookie;
			}
			string.split(/; */).forEach(function (cookiePair) {
				var equalsIndex = cookiePair.indexOf('=');
				if (equalsIndex < 0) {
					return;
				}

				var key = cookiePair.substring(0, equalsIndex).trim();

				cookie[key] = cookiePair.substring(equalsIndex + 1).trim().replace(/^"|"$/g, '');
			});

			return cookie;
		}
	}, {
		key: '_convertToCookieSetup',
		value: function _convertToCookieSetup(cookieSetup) {
			if (typeof cookieSetup.key !== 'string' || typeof cookieSetup.value !== 'string') {
				throw new Error('Wrong key or value');
			}

			var cookie = cookieSetup.key + '=' + cookieSetup.value;

			if (typeof cookieSetup.maxAge === 'number') {
				cookie += '; Max-Age=' + cookieSetup.maxAge.toFixed();
				if (!cookieSetup.expires) {
					cookieSetup.expires = new Date(Date.now() + cookieSetup.maxAge * 1000);
				}
			}
			if (cookieSetup.expires instanceof Date) {
				cookie += '; Expires=' + cookieSetup.expires.toUTCString();
			}
			if (typeof cookieSetup.path === 'string') {
				cookie += '; Path=' + cookieSetup.path;
			}
			if (typeof cookieSetup.domain === 'string') {
				cookie += '; Domain=' + cookieSetup.domain;
			}
			if (typeof cookieSetup.secure === 'boolean' && cookieSetup.secure) {
				cookie += '; Secure';
			}
			if (typeof cookieSetup.httpOnly === 'boolean' && cookieSetup.httpOnly) {
				cookie += '; HttpOnly';
			}

			return cookie;
		}
	}]);

	return CookieWrapperBase;
}();

module.exports = CookieWrapperBase;

},{}],17:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DocumentRendererBase = function () {
	function DocumentRendererBase(locator) {
		var _this = this;

		_classCallCheck(this, DocumentRendererBase);

		this._serviceLocator = locator;

		this._contextFactory = locator.resolve('contextFactory');

		this._componentLoader = locator.resolve('componentLoader');

		this._eventBus = locator.resolve('eventBus');

		var storeLoader = locator.resolve('storeLoader');

		this._loading = Promise.all([this._componentLoader.load(), storeLoader.load()]).then(function () {
			_this._loading = null;
			_this._eventBus.emit('ready');
		}).catch(function (reason) {
			return _this._eventBus.emit('error', reason);
		});
	}

	_createClass(DocumentRendererBase, [{
		key: '_getPromiseForReadyState',
		value: function _getPromiseForReadyState() {
			return this._loading ? this._loading : Promise.resolve();
		}
	}]);

	return DocumentRendererBase;
}();

module.exports = DocumentRendererBase;

},{}],18:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoaderBase = function () {
	function LoaderBase(locator, transforms) {
		_classCallCheck(this, LoaderBase);

		this._transforms = transforms;
		this._eventBus = locator.resolve('eventBus');
	}

	_createClass(LoaderBase, [{
		key: '_applyTransforms',
		value: function _applyTransforms(module, index) {
			var _this = this;

			if (index === undefined) {
				index = this._transforms.length - 1;
			}

			if (index < 0) {
				return Promise.resolve(module);
			}

			var transformation = this._transforms[index];

			return Promise.resolve().then(function () {
				return transformation.transform(module);
			}).catch(function (reason) {
				_this._eventBus.emit('error', reason);
				return module;
			}).then(function (transformedModule) {
				return _this._applyTransforms(transformedModule, index - 1);
			});
		}
	}]);

	return LoaderBase;
}();

module.exports = LoaderBase;

},{}],19:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModuleApiProviderBase = function () {
	function ModuleApiProviderBase(locator) {
		_classCallCheck(this, ModuleApiProviderBase);

		this.locator = locator;

		this.cookie = locator.resolve('cookieWrapper');

		this._eventBus = locator.resolve('eventBus');
	}

	_createClass(ModuleApiProviderBase, [{
		key: 'on',
		value: function on(eventName, handler) {
			checkEventNameAndHandler(eventName, handler);
			this._eventBus.on(eventName, handler);
			return this;
		}
	}, {
		key: 'once',
		value: function once(eventName, handler) {
			checkEventNameAndHandler(eventName, handler);
			this._eventBus.once(eventName, handler);
			return this;
		}
	}, {
		key: 'removeListener',
		value: function removeListener(eventName, handler) {
			checkEventNameAndHandler(eventName, handler);
			this._eventBus.removeListener(eventName, handler);
			return this;
		}
	}, {
		key: 'removeAllListeners',
		value: function removeAllListeners(eventName) {
			checkEventNameAndHandler(eventName, stub);
			this._eventBus.removeAllListeners(eventName);
			return this;
		}
	}, {
		key: 'getRouteURI',
		value: function getRouteURI(name, values) {
			var stateProvider = this.locator.resolve('stateProvider');
			return stateProvider.getRouteURI(name, values);
		}
	}]);

	return ModuleApiProviderBase;
}();

function checkEventNameAndHandler(eventName, handler) {
	if (typeof eventName !== 'string') {
		throw new Error('Event name should be a string');
	}

	if (typeof handler !== 'function') {
		throw new Error('Event handler should be a function');
	}
}

function stub() {}

module.exports = ModuleApiProviderBase;

},{}],20:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uriHelper = require('../helpers/uriHelper');
var catberryUri = require('catberry-uri');
var URI = catberryUri.URI;

var StateProviderBase = function () {
	function StateProviderBase(locator) {
		var _this = this;

		_classCallCheck(this, StateProviderBase);

		this._namedRoutes = Object.create(null);

		this._routeDescriptors = this._getRouteDescriptors(locator);
		this._routeDescriptors.forEach(function (descriptor) {
			_this._restoreRegularExpressions(descriptor);
			if (typeof descriptor.name === 'string') {
				_this._namedRoutes[descriptor.name] = descriptor;
			}
		});

		this._uriMappers = this._getUriMappers();
	}

	_createClass(StateProviderBase, [{
		key: 'getStateByUri',
		value: function getStateByUri(uri) {
			if (this._uriMappers.length === 0) {
				return null;
			}

			uri = uri.clone();
			uri.scheme = null;
			uri.authority = null;
			uri.fragment = null;
			uri.path = uriHelper.removeEndSlash(uri.path);

			var state = this._mapState(uri);
			if (!state) {
				return null;
			}

			Object.keys(state).forEach(function (storeName) {
				return Object.freeze(state[storeName]);
			});
			Object.freeze(state);

			return state;
		}
	}, {
		key: 'getRouteURI',
		value: function getRouteURI(name, values) {
			values = values || Object.create(null);
			var descriptor = this._namedRoutes[name];
			if (!descriptor) {
				throw new Error('There is no such route called "' + name + '"');
			}

			var uri = new URI(descriptor.expression);

			if (descriptor.pathParameters.length > 0) {
				uri.path = setParameterValues(uri.path, descriptor.pathParameters, values, function (parameter, value) {
					return encodeURIComponent(defaultParameterValueProcessor(parameter, value));
				});
			}

			if (descriptor.queryParameters.length > 0) {
				var queryValues = Object.create(null);

				descriptor.queryParameters.forEach(function (queryParameter) {
					var name = setParameterValues(queryParameter.nameExpression, queryParameter.nameParameters, values);

					if (!name) {
						return;
					}

					if (!queryParameter.valueParameters) {
						queryValues[name] = null;
						return;
					}

					if (queryParameter.valueParameters.length === 0) {
						queryValues[name] = queryParameter.valueExpression;
						return;
					}

					var firstParameterName = queryParameter.valueParameters[0].name;
					var firstParameterValue = values[firstParameterName];

					if (queryParameter.valueParameters.length === 1 && Array.isArray(firstParameterValue)) {
						queryValues[name] = [];
						firstParameterValue.forEach(function (value) {
							var valuesObject = Object.create(null);
							valuesObject[firstParameterName] = value;
							var queryValueString = setParameterValues(queryParameter.valueExpression, queryParameter.valueParameters, valuesObject);
							if (queryValueString.length > 0) {
								queryValues[name].push(queryValueString);
							}
						});
						return;
					}

					var queryValueString = setParameterValues(queryParameter.valueExpression, queryParameter.valueParameters, values);
					if (queryValueString.length > 0) {
						queryValues[name] = queryValueString;
					}
				});

				if (Object.keys(queryValues).length === 0) {
					uri.query = null;
				} else {
					uri.query.values = queryValues;
				}
			}

			return uri.toString();
		}
	}, {
		key: '_mapState',
		value: function _mapState(uri) {
			var state = null;
			this._uriMappers.some(function (mapper) {
				state = mapper(uri);
				return Boolean(state);
			});

			return state;
		}
	}, {
		key: '_getUriMappers',
		value: function _getUriMappers() {
			var _this2 = this;

			return this._routeDescriptors.map(function (descriptor) {
				if (descriptor.expression instanceof RegExp) {
					return function (uri) {
						return descriptor.expression.test(uri.toString()) ? descriptor.map(uri) : null;
					};
				}

				var extractor = _this2._createParameterExtractor(descriptor);
				if (descriptor.map instanceof Function) {
					return function (uri) {
						var state = extractor(uri);
						return state ? descriptor.map(state) : state;
					};
				}
				return extractor;
			});
		}
	}, {
		key: '_getRouteDescriptors',
		value: function _getRouteDescriptors(serviceLocator) {}
	}, {
		key: '_restoreRegularExpressions',
		value: function _restoreRegularExpressions(descriptor) {
			if (descriptor.pathRegExpSource) {
				descriptor.pathRegExp = new RegExp(descriptor.pathRegExpSource, 'i');
			}
			if (!descriptor.queryParameters) {
				return;
			}
			descriptor.queryParameters.forEach(function (parameter) {
				parameter.nameRegExp = new RegExp(parameter.nameRegExpSource, 'i');
				if (parameter.valueRegExpSource) {
					parameter.valueRegExp = new RegExp(parameter.valueRegExpSource, 'i');
				}
			});
		}
	}, {
		key: '_createParameterExtractor',
		value: function _createParameterExtractor(routeDescriptor) {
			var pathRegExp = new RegExp(routeDescriptor.pathRegExpSource);
			return function (uri) {
				var pathMatches = uri.path.match(pathRegExp);
				if (!pathMatches) {
					return null;
				}

				var state = Object.create(null);
				var pathParameterValues = pathMatches.slice(1);

				setStateValues(state, pathParameterValues, routeDescriptor.pathParameters);

				if (uri.query && uri.query.values) {
					setQueryParameters(state, uri.query.values, routeDescriptor);
				}

				return state;
			};
		}
	}]);

	return StateProviderBase;
}();

function setStateValues(state, values, parameters) {
	values.forEach(function (value, index) {
		var parameter = parameters[index];
		parameter.stores.forEach(function (storeName) {
			if (!(storeName in state)) {
				state[storeName] = Object.create(null);
			}

			if (parameter.name in state[storeName]) {
				if (Array.isArray(state[storeName][parameter.name])) {
					state[storeName][parameter.name].push(value);
				} else {
					state[storeName][parameter.name] = [state[storeName][parameter.name], value];
				}
			} else {
				state[storeName][parameter.name] = value;
			}
		});
	});
}

function setQueryParameters(state, queryValues, routeDescriptor) {
	Object.keys(queryValues).forEach(function (name) {
		var value = queryValues[name];

		if (Array.isArray(value)) {
			value.forEach(function (item) {
				var subValues = Object.create(null);
				subValues[name] = item;
				setQueryParameters(state, subValues, routeDescriptor);
			});
			return;
		}
		var isValue = typeof value === 'string';

		var queryNameMatches = null;
		var queryValueMatches = null;
		var routeParameter = null;

		routeDescriptor.queryParameters.some(function (parameter) {
			queryNameMatches = name.match(parameter.nameRegExp);

			if (isValue && parameter.valueRegExp) {
				queryValueMatches = value.match(parameter.valueRegExp);
			}

			if (queryNameMatches) {
				routeParameter = parameter;
				return true;
			}
			return false;
		});

		if (!routeParameter) {
			return;
		}

		setStateValues(state, queryNameMatches.slice(1), routeParameter.nameParameters);

		if (!queryValueMatches) {
			return;
		}
		setStateValues(state, queryValueMatches.slice(1), routeParameter.valueParameters);
	});
}

function setParameterValues(expression, parameters, values, preProcessor) {
	if (!parameters || parameters.length === 0) {
		return expression;
	}

	preProcessor = preProcessor || defaultParameterValueProcessor;

	var nextParameterIndex = 0;
	var nextParameter = parameters[nextParameterIndex];
	var result = '';

	for (var i = 0; i < expression.length; i++) {
		if (nextParameter && i === nextParameter.start) {
			result += preProcessor(nextParameter, values[nextParameter.name]);
			while (++i < nextParameter.end - 1) {}
			nextParameterIndex++;
			nextParameter = parameters[nextParameterIndex];
			continue;
		}
		result += expression[i];
	}
	return result;
}

function defaultParameterValueProcessor(parameter, value) {
	if (Array.isArray(value)) {
		throw new Error('Array value is not supported for the parameter "' + parameter.name + '"');
	}
	return value === undefined ? '' : String(value);
}

module.exports = StateProviderBase;

},{"../helpers/uriHelper":25,"catberry-uri":31}],21:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var ERROR_MESSAGE_REGEXP = /^(?:[\w$]+): (?:.+)\r?\n/i;

module.exports = {
	prettyPrint: function prettyPrint(error, userAgent) {
		if (!error || (typeof error === 'undefined' ? 'undefined' : _typeof(error)) !== 'object') {
			return '';
		}
		return '\n<div style="background-color: white; font-size: 12pt;">\n\t' + new Date().toUTCString() + ';<br/>\n\t' + (userAgent || 'Unknown browser') + ';<br/>\n\tCatberry@9.0.0 (\n\t<a href="https://github.com/catberry/catberry/issues" target="_blank">\n\t\treport an issue\n\t</a>)\n\t<br/><br/>\n\t<span style="color: red; font-size: 16pt; font-weight: bold;">\n\t\t' + escape(error.name) + ': ' + escape(error.message) + '\n\t</span>\n\t<br/><br/>\n\t' + escape(error.stack).replace(ERROR_MESSAGE_REGEXP, '') + '\n</div>\n';
	}
};

function escape(value) {
	value = String(value || '');
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/\'/g, '&#39;').replace(/\r?\n/g, '<br/>');
}

},{}],22:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var helper = {
	ELEMENT_NODE_TYPE: 1,
	COMPONENT_TAG_PREFIX: 'CAT-',
	COMPONENT_ID: '$catberryId',
	COMPONENT_PREFIX_REGEXP: /^cat-/i,
	COMPONENT_ERROR_TEMPLATE_POSTFIX: '--error',
	DOCUMENT_COMPONENT_NAME: 'document',
	DOCUMENT_TAG_NAME: 'HTML',
	HEAD_TAG_NAME: 'HEAD',
	HEAD_COMPONENT_NAME: 'head',
	ATTRIBUTE_STORE: 'cat-store',
	ATTRIBUTE_STORE_PARAMS_REGEXP: /^cat-store-param-/i,
	STORE_DYNAMIC_NAME_REGEXP: /^dynamic/i,
	DEFAULT_LOGIC_FILENAME: 'index.js',

	getStoreCacheKey: function getStoreCacheKey(storeName, storeInstanceId) {
		var instance = storeInstanceId ? '[' + storeInstanceId + ']' : '';

		return '' + storeName + instance;
	},
	isDynamicStore: function isDynamicStore(storeName) {
		return helper.STORE_DYNAMIC_NAME_REGEXP.test(storeName);
	},
	getStoreParamsFromAttributes: function getStoreParamsFromAttributes(attributes) {
		var params = Object.create(null);

		Object.keys(attributes).forEach(function (name) {
			if (helper.ATTRIBUTE_STORE_PARAMS_REGEXP.test(name)) {
				params[name.replace(helper.ATTRIBUTE_STORE_PARAMS_REGEXP, '')] = attributes[name];
			}
		});

		return params;
	},

	getNameForErrorTemplate: function getNameForErrorTemplate(componentName) {
		if (typeof componentName !== 'string') {
			return '';
		}
		return componentName + helper.COMPONENT_ERROR_TEMPLATE_POSTFIX;
	},

	isDocumentComponent: function isDocumentComponent(componentName) {
		return componentName.toLowerCase() === helper.DOCUMENT_COMPONENT_NAME;
	},

	isHeadComponent: function isHeadComponent(componentName) {
		return componentName.toLowerCase() === helper.HEAD_COMPONENT_NAME;
	},

	isComponentNode: function isComponentNode(node) {
		return node.nodeType === helper.ELEMENT_NODE_TYPE && (helper.COMPONENT_PREFIX_REGEXP.test(node.nodeName) || node.nodeName === helper.HEAD_TAG_NAME || node.nodeName === helper.DOCUMENT_TAG_NAME);
	},

	getOriginalComponentName: function getOriginalComponentName(fullComponentName) {
		if (typeof fullComponentName !== 'string') {
			return '';
		}

		if (fullComponentName === helper.DOCUMENT_TAG_NAME) {
			return helper.DOCUMENT_COMPONENT_NAME;
		}

		if (fullComponentName === helper.HEAD_TAG_NAME) {
			return helper.HEAD_COMPONENT_NAME;
		}

		return fullComponentName.toLowerCase().replace(helper.COMPONENT_PREFIX_REGEXP, '');
	},

	getTagNameForComponentName: function getTagNameForComponentName(componentName) {
		if (typeof componentName !== 'string') {
			return '';
		}
		var upperComponentName = componentName.toUpperCase();
		if (componentName === helper.HEAD_COMPONENT_NAME) {
			return upperComponentName;
		}
		if (componentName === helper.DOCUMENT_COMPONENT_NAME) {
			return helper.DOCUMENT_TAG_NAME;
		}
		return helper.COMPONENT_TAG_PREFIX + upperComponentName;
	},

	getMethodToInvoke: function getMethodToInvoke(module, prefix, name) {
		if (!module || (typeof module === 'undefined' ? 'undefined' : _typeof(module)) !== 'object') {
			return defaultPromiseMethod;
		}
		var methodName = helper.getCamelCaseName(prefix, name);
		if (typeof module[methodName] === 'function') {
			return module[methodName].bind(module);
		}
		if (typeof module[prefix] === 'function') {
			return module[prefix].bind(module, name);
		}

		return defaultPromiseMethod;
	},

	getCamelCaseName: function getCamelCaseName(prefix, name) {
		if (!name) {
			return '';
		}
		if (prefix) {
			name = prefix + '-' + name;
		}
		return name.replace(/(?:[^a-z0-9]+)(\w)/gi, function (space, letter) {
			return letter.toUpperCase();
		}).replace(/(^[^a-z0-9])|([^a-z0-9]$)/gi, '');
	},

	getSafePromise: function getSafePromise(action) {
		try {
			return Promise.resolve(action());
		} catch (e) {
			return Promise.reject(e);
		}
	}
};

function defaultPromiseMethod() {
	return Promise.resolve();
}

module.exports = helper;

},{}],23:[function(require,module,exports){
'use strict';

module.exports = {
	defineReadOnly: function defineReadOnly(object, name, value) {
		Object.defineProperty(object, name, {
			enumerable: false,
			configurable: false,
			writable: false,
			value: value
		});
	}
};

},{}],24:[function(require,module,exports){
'use strict';

var moduleHelper = require('./moduleHelper');

var helper = {
	registerTemplates: function registerTemplates(component) {
		component.templateProvider.registerCompiled(component.name, component.compiledTemplate);

		component.template = {
			render: function render(context) {
				return component.templateProvider.render(component.name, context);
			}
		};

		if (!component.compiledErrorTemplate) {
			return;
		}

		var errorTemplateName = moduleHelper.getNameForErrorTemplate(component.name);
		component.errorTemplateProvider.registerCompiled(errorTemplateName, component.compiledErrorTemplate);

		component.errorTemplate = {
			render: function render(context) {
				return component.errorTemplateProvider.render(errorTemplateName, context);
			}
		};
	},

	resolveTemplateProviders: function resolveTemplateProviders(locator) {
		var eventBus = locator.resolve('eventBus');
		try {
			return locator.resolveAll('templateProvider').filter(function (provider) {
				var isValid = typeof provider.getName === 'function' && typeof provider.registerCompiled === 'function' && typeof provider.render === 'function';
				if (!isValid) {
					eventBus.emit('warn', 'Template provider does not have required methods, skipping...');
				}
				return isValid;
			});
		} catch (e) {
			return [];
		}
	},

	resolveTemplateProvidersByNames: function resolveTemplateProvidersByNames(locator) {
		return helper.resolveTemplateProviders(locator).reduce(function (map, current) {
			map[current.getName()] = current;
			return map;
		}, Object.create(null));
	}
};

module.exports = helper;

},{"./moduleHelper":22}],25:[function(require,module,exports){
'use strict';

var PATH_END_SLASH_REG_EXP = /(.+)\/($|\?|#)/;

module.exports = {
	removeEndSlash: function removeEndSlash(uriPath) {
		if (!uriPath || typeof uriPath !== 'string') {
			return '';
		}
		if (uriPath === '/') {
			return uriPath;
		}
		return uriPath.replace(PATH_END_SLASH_REG_EXP, '$1$2');
	}
};

},{}],26:[function(require,module,exports){
"use strict";

var rawAsap = require("./raw");

var freeTasks = [];

var pendingErrors = [];
var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

function throwFirstError() {
    if (pendingErrors.length) {
        throw pendingErrors.shift();
    }
}

module.exports = asap;
function asap(task) {
    var rawTask;
    if (freeTasks.length) {
        rawTask = freeTasks.pop();
    } else {
        rawTask = new RawTask();
    }
    rawTask.task = task;
    rawAsap(rawTask);
}

function RawTask() {
    this.task = null;
}

RawTask.prototype.call = function () {
    try {
        this.task.call();
    } catch (error) {
        if (asap.onerror) {
            asap.onerror(error);
        } else {
            pendingErrors.push(error);
            requestErrorThrow();
        }
    } finally {
        this.task = null;
        freeTasks[freeTasks.length] = this;
    }
};

},{"./raw":27}],27:[function(require,module,exports){
(function (global){
"use strict";

module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }

    queue[queue.length] = task;
}

var queue = [];

var flushing = false;

var requestFlush;

var index = 0;

var capacity = 1024;

function flush() {
    while (index < queue.length) {
        var currentIndex = index;

        index = index + 1;
        queue[currentIndex].call();

        if (index > capacity) {
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

var scope = typeof global !== "undefined" ? global : self;
var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;

if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

rawAsap.requestFlush = requestFlush;

function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, { characterData: true });
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        var timeoutHandle = setTimeout(handleTimer, 0);

        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],28:[function(require,module,exports){
(function (process,global){
"use strict";

module.exports = process.hrtime || hrtime;

var performance = global.performance || {};
var performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function () {
  return new Date().getTime();
};

function hrtime(previousTimestamp) {
  var clocktime = performanceNow.call(performance) * 1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor(clocktime % 1 * 1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds < 0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds, nanoseconds];
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":40}],29:[function(require,module,exports){
"use strict";

},{}],30:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ServiceLocator = function () {
	function ServiceLocator() {
		_classCallCheck(this, ServiceLocator);

		this._registrations = Object.create(null);
	}

	_createClass(ServiceLocator, [{
		key: 'register',
		value: function register(type, implementation, isSingleton) {
			this._throwIfNotFunction(type, implementation);
			this._throwIfNotString(type);

			this._initializeRegistration(type);

			this._registrations[type].unshift({
				Implementation: implementation,
				isSingleton: Boolean(isSingleton),
				singleInstance: null
			});
		}
	}, {
		key: 'registerInstance',
		value: function registerInstance(type, instance) {
			this._throwIfNotString(type);
			this._initializeRegistration(type);

			this._registrations[type].unshift({
				Implementation: instance.constructor,
				isSingleton: true,
				singleInstance: instance
			});
		}
	}, {
		key: 'resolve',
		value: function resolve(type) {
			this._throwIfNotString(type);
			this._throwIfNoType(type);
			var firstRegistration = this._registrations[type][0];
			return this._createInstance(firstRegistration);
		}
	}, {
		key: 'resolveAll',
		value: function resolveAll(type) {
			var _this = this;

			this._throwIfNotString(type);
			this._throwIfNoType(type);
			return this._registrations[type].map(function (registration) {
				return _this._createInstance(registration);
			});
		}
	}, {
		key: 'unregister',
		value: function unregister(type) {
			this._throwIfNotString(type);
			this._registrations[type] = [];
		}
	}, {
		key: 'has',
		value: function has(type) {
			this._throwIfNotString(type);

			return type in this._registrations && this._registrations[type].length > 0;
		}
	}, {
		key: '_createInstance',
		value: function _createInstance(registration) {
			if (registration.isSingleton && registration.singleInstance !== null) {
				return registration.singleInstance;
			}

			var instance = new registration.Implementation(this);

			if (registration.isSingleton) {
				registration.singleInstance = instance;
			}

			return instance;
		}
	}, {
		key: '_initializeRegistration',
		value: function _initializeRegistration(type) {
			if (type in this._registrations) {
				return;
			}
			this._registrations[type] = [];
		}
	}, {
		key: '_throwIfNoType',
		value: function _throwIfNoType(type) {
			if (type in this._registrations && this._registrations[type].length > 0) {
				return;
			}
			throw new Error('Type "' + type + '" not registered');
		}
	}, {
		key: '_throwIfNotFunction',
		value: function _throwIfNotFunction(type, Implementation) {
			if (Implementation instanceof Function) {
				return;
			}

			throw new Error('Constructor for type ' + type + ' should be a function');
		}
	}, {
		key: '_throwIfNotString',
		value: function _throwIfNotString(type) {
			if (typeof type === 'string') {
				return;
			}

			throw new Error('Type name "' + type + '" should be a string');
		}
	}]);

	return ServiceLocator;
}();

module.exports = ServiceLocator;

},{}],31:[function(require,module,exports){
'use strict';

module.exports = {
	URI: require('./lib/URI'),
	Authority: require('./lib/Authority'),
	UserInfo: require('./lib/UserInfo'),
	Query: require('./lib/Query')
};

},{"./lib/Authority":32,"./lib/Query":33,"./lib/URI":34,"./lib/UserInfo":35}],32:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserInfo = require('./UserInfo');
var percentEncodingHelper = require('./percentEncodingHelper');

var PORT_REGEXP = /^\d+$/;
var ERROR_PORT = 'URI authority port must satisfy expression ' + PORT_REGEXP.toString();

var Authority = function () {
	_createClass(Authority, [{
		key: 'createUserInfo',
		value: function createUserInfo(string) {
			return Authority.createUserInfo(string);
		}
	}], [{
		key: 'createUserInfo',
		value: function createUserInfo(string) {
			return new UserInfo(string);
		}
	}]);

	function Authority(authorityString) {
		_classCallCheck(this, Authority);

		this.userInfo = null;

		this.port = null;

		this.host = null;

		if (typeof authorityString === 'string' && authorityString.length > 0) {
			var firstAtIndex = authorityString.indexOf('@');
			if (firstAtIndex !== -1) {
				var userInfoString = authorityString.substring(0, firstAtIndex);
				this.userInfo = new UserInfo(userInfoString);
				authorityString = authorityString.substring(firstAtIndex + 1);
			}

			var lastColonIndex = authorityString.lastIndexOf(':');
			if (lastColonIndex !== -1) {
				var portString = authorityString.substring(lastColonIndex + 1);
				if (lastColonIndex === authorityString.length - 1) {
					this.port = '';
					authorityString = authorityString.substring(0, lastColonIndex);
				} else if (PORT_REGEXP.test(portString)) {
					this.port = portString;
					authorityString = authorityString.substring(0, lastColonIndex);
				}
			}

			this.host = percentEncodingHelper.decode(authorityString);
		}
	}

	_createClass(Authority, [{
		key: 'clone',
		value: function clone() {
			var authority = new Authority();
			if (this.userInfo) {
				authority.userInfo = this.userInfo.clone();
			}
			if (typeof this.host === 'string') {
				authority.host = this.host;
			}
			if (typeof this.port === 'string') {
				authority.port = this.port;
			}
			return authority;
		}
	}, {
		key: 'toString',
		value: function toString() {
			var result = '';
			if (this.userInfo instanceof UserInfo) {
				result += this.userInfo.toString() + '@';
			}
			if (this.host !== undefined && this.host !== null) {
				var host = String(this.host);
				result += percentEncodingHelper.encodeHost(host);
			}
			if (this.port !== undefined && this.port !== null) {
				var port = String(this.port);
				if (port.length > 0 && !PORT_REGEXP.test(port)) {
					throw new Error(ERROR_PORT);
				}
				result += ':' + port;
			}
			return result;
		}
	}]);

	return Authority;
}();

module.exports = Authority;

},{"./UserInfo":35,"./percentEncodingHelper":36}],33:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var percentEncodingHelper = require('./percentEncodingHelper');

var Query = function () {
	function Query(queryString) {
		var _this = this;

		_classCallCheck(this, Query);

		this.values = null;

		if (typeof queryString === 'string') {
			this.values = {};

			queryString.split('&').forEach(function (pair) {
				var parts = pair.split('=');
				var key = percentEncodingHelper.decode(parts[0]);
				if (!key) {
					return;
				}
				if (key in _this.values && !(_this.values[key] instanceof Array)) {
					_this.values[key] = [_this.values[key]];
				}

				var value = typeof parts[1] === 'string' ? percentEncodingHelper.decode(parts[1]) : null;

				if (_this.values[key] instanceof Array) {
					_this.values[key].push(value);
				} else {
					_this.values[key] = value;
				}
			}, this);
		}
	}

	_createClass(Query, [{
		key: 'clone',
		value: function clone() {
			var _this2 = this;

			var query = new Query();
			if (this.values) {
				query.values = {};
				Object.keys(this.values).forEach(function (key) {
					query.values[key] = _this2.values[key];
				}, this);
			}
			return query;
		}
	}, {
		key: 'toString',
		value: function toString() {
			var _this3 = this;

			if (!this.values) {
				return '';
			}

			var queryString = '';
			Object.keys(this.values).forEach(function (key) {
				var values = _this3.values[key] instanceof Array ? _this3.values[key] : [_this3.values[key]];

				values.forEach(function (value) {
					queryString += '&' + percentEncodingHelper.encodeQuerySubComponent(key);
					if (value === undefined || value === null) {
						return;
					}
					value = String(value);
					queryString += '=' + percentEncodingHelper.encodeQuerySubComponent(value);
				});
			}, this);

			return queryString.replace(/^&/, '');
		}
	}]);

	return Query;
}();

module.exports = Query;

},{"./percentEncodingHelper":36}],34:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var percentEncodingHelper = require('./percentEncodingHelper');

var Authority = require('./Authority');
var Query = require('./Query');

var URI_PARSE_REGEXP = new RegExp('^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?');

var SCHEME_REGEXP = /^[a-z]+[a-z\d\+\.-]*$/i;
var ERROR_SCHEME = 'URI scheme must satisfy expression ' + SCHEME_REGEXP.toString();

var URI = function () {
	_createClass(URI, [{
		key: 'createAuthority',
		value: function createAuthority(string) {
			return URI.createAuthority(string);
		}
	}, {
		key: 'createUserInfo',
		value: function createUserInfo(string) {
			return URI.createUserInfo(string);
		}
	}, {
		key: 'createQuery',
		value: function createQuery(string) {
			return URI.createQuery(string);
		}
	}], [{
		key: 'createAuthority',
		value: function createAuthority(string) {
			return new Authority(string);
		}
	}, {
		key: 'createUserInfo',
		value: function createUserInfo(string) {
			return Authority.createUserInfo(string);
		}
	}, {
		key: 'createQuery',
		value: function createQuery(string) {
			return new Query(string);
		}
	}]);

	function URI(uriString) {
		_classCallCheck(this, URI);

		this.scheme = null;

		this.authority = null;

		this.path = null;

		this.query = null;

		this.fragment = null;

		if (typeof uriString !== 'string') {
			uriString = '';
		}

		var matches = uriString.match(URI_PARSE_REGEXP);

		if (matches) {
			if (typeof matches[2] === 'string') {
				this.scheme = percentEncodingHelper.decode(matches[2]);
			}
			if (typeof matches[4] === 'string') {
				this.authority = URI.createAuthority(matches[4]);
			}
			if (typeof matches[5] === 'string') {
				this.path = percentEncodingHelper.decodePath(matches[5]);
			}
			if (typeof matches[7] === 'string') {
				this.query = URI.createQuery(matches[7]);
			}
			if (typeof matches[9] === 'string') {
				this.fragment = percentEncodingHelper.decode(matches[9]);
			}
		}
	}

	_createClass(URI, [{
		key: 'resolveRelative',
		value: function resolveRelative(baseUri) {
			if (!baseUri.scheme) {
				throw new Error('Scheme component is required to be present in a base URI');
			}

			return transformReference(baseUri, this);
		}
	}, {
		key: 'clone',
		value: function clone() {
			var uri = new URI();

			if (typeof this.scheme === 'string') {
				uri.scheme = this.scheme;
			}

			if (this.authority) {
				uri.authority = this.authority.clone();
			}

			if (typeof this.path === 'string') {
				uri.path = this.path;
			}

			if (this.query) {
				uri.query = this.query.clone();
			}

			if (typeof this.fragment === 'string') {
				uri.fragment = this.fragment;
			}

			return uri;
		}
	}, {
		key: 'toString',
		value: function toString() {
			var result = '';

			if (this.scheme !== undefined && this.scheme !== null) {
				var scheme = String(this.scheme);
				if (!SCHEME_REGEXP.test(scheme)) {
					throw new Error(ERROR_SCHEME);
				}
				result += scheme + ':';
			}

			if (this.authority instanceof Authority) {
				result += '//' + this.authority.toString();
			}

			var path = this.path === undefined || this.path === null ? '' : String(this.path);
			result += percentEncodingHelper.encodePath(path);

			if (this.query instanceof Query) {
				result += '?' + this.query.toString();
			}

			if (this.fragment !== undefined && this.fragment !== null) {
				var fragment = String(this.fragment);
				result += '#' + percentEncodingHelper.encodeFragment(fragment);
			}

			return result;
		}
	}]);

	return URI;
}();

function transformReference(baseUri, referenceUri) {
	var targetUri = new URI('');

	if (referenceUri.scheme) {
		targetUri.scheme = referenceUri.scheme;
		targetUri.authority = referenceUri.authority ? referenceUri.authority.clone() : referenceUri.authority;
		targetUri.path = removeDotSegments(referenceUri.path);
		targetUri.query = referenceUri.query ? referenceUri.query.clone() : referenceUri.query;
	} else {
		if (referenceUri.authority) {
			targetUri.authority = referenceUri.authority ? referenceUri.authority.clone() : referenceUri.authority;
			targetUri.path = removeDotSegments(referenceUri.path);
			targetUri.query = referenceUri.query ? referenceUri.query.clone() : referenceUri.query;
		} else {
			if (referenceUri.path === '') {
				targetUri.path = baseUri.path;
				if (referenceUri.query) {
					targetUri.query = referenceUri.query.clone();
				} else {
					targetUri.query = baseUri.query ? baseUri.query.clone() : baseUri.query;
				}
			} else {
				if (referenceUri.path[0] === '/') {
					targetUri.path = removeDotSegments(referenceUri.path);
				} else {
					targetUri.path = merge(baseUri, referenceUri);
					targetUri.path = removeDotSegments(targetUri.path);
				}
				targetUri.query = referenceUri.query ? referenceUri.query.clone() : referenceUri.query;
			}
			targetUri.authority = baseUri.authority ? baseUri.authority.clone() : baseUri.authority;
		}
		targetUri.scheme = baseUri.scheme;
	}

	targetUri.fragment = referenceUri.fragment;
	return targetUri;
}

function merge(baseUri, referenceUri) {
	if (baseUri.authority && baseUri.path === '') {
		return '/' + referenceUri.path;
	}

	var segmentsString = baseUri.path.indexOf('/') !== -1 ? baseUri.path.replace(/\/[^\/]+$/, '/') : '';

	return segmentsString + referenceUri.path;
}

function removeDotSegments(uriPath) {
	if (!uriPath) {
		return '';
	}

	var inputBuffer = uriPath;
	var newBuffer = '';
	var nextSegment = '';
	var outputBuffer = '';

	while (inputBuffer.length !== 0) {
		newBuffer = inputBuffer.replace(/^\.?\.\//, '');
		if (newBuffer !== inputBuffer) {
			inputBuffer = newBuffer;
			continue;
		}

		newBuffer = inputBuffer.replace(/^((\/\.\/)|(\/\.$))/, '/');
		if (newBuffer !== inputBuffer) {
			inputBuffer = newBuffer;
			continue;
		}

		newBuffer = inputBuffer.replace(/^((\/\.\.\/)|(\/\.\.$))/, '/');
		if (newBuffer !== inputBuffer) {
			outputBuffer = outputBuffer.replace(/\/[^\/]+$/, '');
			inputBuffer = newBuffer;
			continue;
		}

		if (inputBuffer === '.' || inputBuffer === '..') {
			break;
		}

		nextSegment = /^\/?[^\/]*(\/|$)/.exec(inputBuffer)[0];
		nextSegment = nextSegment.replace(/([^\/])(\/$)/, '$1');
		inputBuffer = inputBuffer.substring(nextSegment.length);
		outputBuffer += nextSegment;
	}

	return outputBuffer;
}

module.exports = URI;

},{"./Authority":32,"./Query":33,"./percentEncodingHelper":36}],35:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var percentEncodingHelper = require('./percentEncodingHelper');

var UserInfo = function () {
	function UserInfo(userInfoString) {
		_classCallCheck(this, UserInfo);

		this.user = null;

		this.password = null;

		if (typeof userInfoString === 'string' && userInfoString.length > 0) {
			var parts = userInfoString.split(':');
			if (typeof parts[0] === 'string') {
				this.user = percentEncodingHelper.decode(parts[0]);
			}
			if (typeof parts[1] === 'string') {
				this.password = percentEncodingHelper.decode(parts[1]);
			}
		}
	}

	_createClass(UserInfo, [{
		key: 'clone',
		value: function clone() {
			var userInfo = new UserInfo();
			if (typeof this.user === 'string') {
				userInfo.user = this.user;
			}
			if (typeof this.password === 'string') {
				userInfo.password = this.password;
			}
			return userInfo;
		}
	}, {
		key: 'toString',
		value: function toString() {
			var result = '';
			if (this.user !== undefined && this.user !== null) {
				var user = String(this.user);
				result += percentEncodingHelper.encodeUserInfoSubComponent(user);
			}
			if (this.password !== undefined && this.password !== null) {
				var password = String(this.password);
				result += ':' + percentEncodingHelper.encodeUserInfoSubComponent(password);
			}

			return result;
		}
	}]);

	return UserInfo;
}();

module.exports = UserInfo;

},{"./percentEncodingHelper":36}],36:[function(require,module,exports){
'use strict';

module.exports = {
	encodeUserInfoSubComponent: function encodeUserInfoSubComponent(string) {
		return string.replace(/[^\w\.~\-!\$&'\(\)\*\+,;=\uD800-\uDBFF\uDC00-\uDFFF]/g, encodeURIComponent);
	},
	encodeHost: function encodeHost(string) {
		return string.replace(/[^\w\.~\-!\$&'\(\)\*\+,;=:\[\]\uD800-\uDBFF\uDC00-\uDFFF]/g, encodeURIComponent);
	},
	encodePath: function encodePath(string) {
		return string.split(/%2f/i).map(function (part) {
			return part.replace(/[^\w\.~\-!\$&'\(\)\*\+,;=:@\/\uD800-\uDBFF\uDC00-\uDFFF]/g, encodeURIComponent);
		}).reduce(function (prev, current) {
			return !prev ? current : prev + '%2F' + current;
		}, '');
	},
	encodeQuerySubComponent: function encodeQuerySubComponent(string) {
		return string.replace(/[^\w\.~\-!\$'\(\)\*,;:@\/\?\uD800-\uDBFF\uDC00-\uDFFF]/g, encodeURIComponent);
	},
	encodeFragment: function encodeFragment(string) {
		return string.replace(/[^\w\.~\-!\$&'\(\)\*\+,;=:@\/\?\uD800-\uDBFF\uDC00-\uDFFF]/g, encodeURIComponent);
	},
	decode: function decode(string) {
		return decodeURIComponent(string);
	},
	decodePath: function decodePath(string) {
		return string.split(/%2f/i).map(decodeURIComponent).reduce(function (prev, current) {
			return !prev ? current : prev + '%2F' + current;
		}, '');
	}
};

},{}],37:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

EventEmitter.defaultMaxListeners = 10;

EventEmitter.prototype.setMaxListeners = function (n) {
  if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function (type) {
  var er, handler, len, args, i, listeners;

  if (!this._events) this._events = {};

  if (type === 'error') {
    if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er;
      } else {
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler)) return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;

      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++) {
      listeners[i].apply(this, args);
    }
  }

  return true;
};

EventEmitter.prototype.addListener = function (type, listener) {
  var m;

  if (!isFunction(listener)) throw TypeError('listener must be a function');

  if (!this._events) this._events = {};

  if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);

  if (!this._events[type]) this._events[type] = listener;else if (isObject(this._events[type])) this._events[type].push(listener);else this._events[type] = [this._events[type], listener];

  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
      if (typeof console.trace === 'function') {
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function (type, listener) {
  if (!isFunction(listener)) throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

EventEmitter.prototype.removeListener = function (type, listener) {
  var list, position, length, i;

  if (!isFunction(listener)) throw TypeError('listener must be a function');

  if (!this._events || !this._events[type]) return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener || isFunction(list.listener) && list.listener === listener) {
    delete this._events[type];
    if (this._events.removeListener) this.emit('removeListener', type, listener);
  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener || list[i].listener && list[i].listener === listener) {
        position = i;
        break;
      }
    }

    if (position < 0) return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener) this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function (type) {
  var key, listeners;

  if (!this._events) return this;

  if (!this._events.removeListener) {
    if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
    return this;
  }

  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    while (listeners.length) {
      this.removeListener(type, listeners[listeners.length - 1]);
    }
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function (type) {
  var ret;
  if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function (type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener)) return 1;else if (evlistener) return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function (emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],38:[function(require,module,exports){
'use strict';

var range;

var doc = typeof document !== 'undefined' && document;

var testEl = doc ? doc.body || doc.createElement('div') : {};

var NS_XHTML = 'http://www.w3.org/1999/xhtml';

var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;

var hasAttributeNS;

if (testEl.hasAttributeNS) {
    hasAttributeNS = function hasAttributeNS(el, namespaceURI, name) {
        return el.hasAttributeNS(namespaceURI, name);
    };
} else if (testEl.hasAttribute) {
    hasAttributeNS = function hasAttributeNS(el, namespaceURI, name) {
        return el.hasAttribute(name);
    };
} else {
    hasAttributeNS = function hasAttributeNS(el, namespaceURI, name) {
        return !!el.getAttributeNode(name);
    };
}

function toElement(str) {
    if (!range && doc.createRange) {
        range = doc.createRange();
        range.selectNode(doc.body);
    }

    var fragment;
    if (range && range.createContextualFragment) {
        fragment = range.createContextualFragment(str);
    } else {
        fragment = doc.createElement('body');
        fragment.innerHTML = str;
    }
    return fragment.childNodes[0];
}

function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
        fromEl[name] = toEl[name];
        if (fromEl[name]) {
            fromEl.setAttribute(name, '');
        } else {
            fromEl.removeAttribute(name, '');
        }
    }
}

var specialElHandlers = {
    OPTION: function OPTION(fromEl, toEl) {
        syncBooleanAttrProp(fromEl, toEl, 'selected');
    },

    INPUT: function INPUT(fromEl, toEl) {
        syncBooleanAttrProp(fromEl, toEl, 'checked');
        syncBooleanAttrProp(fromEl, toEl, 'disabled');

        if (fromEl.value !== toEl.value) {
            fromEl.value = toEl.value;
        }

        if (!hasAttributeNS(toEl, null, 'value')) {
            fromEl.removeAttribute('value');
        }
    },

    TEXTAREA: function TEXTAREA(fromEl, toEl) {
        var newValue = toEl.value;
        if (fromEl.value !== newValue) {
            fromEl.value = newValue;
        }

        if (fromEl.firstChild) {
            if (newValue === '' && fromEl.firstChild.nodeValue === fromEl.placeholder) {
                return;
            }

            fromEl.firstChild.nodeValue = newValue;
        }
    },
    SELECT: function SELECT(fromEl, toEl) {
        if (!hasAttributeNS(toEl, null, 'multiple')) {
            var selectedIndex = -1;
            var i = 0;
            var curChild = toEl.firstChild;
            while (curChild) {
                var nodeName = curChild.nodeName;
                if (nodeName && nodeName.toUpperCase() === 'OPTION') {
                    if (hasAttributeNS(curChild, null, 'selected')) {
                        selectedIndex = i;
                        break;
                    }
                    i++;
                }
                curChild = curChild.nextSibling;
            }

            fromEl.selectedIndex = i;
        }
    }
};

function noop() {}

function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;

    if (fromNodeName === toNodeName) {
        return true;
    }

    if (toEl.actualize && fromNodeName.charCodeAt(0) < 91 && toNodeName.charCodeAt(0) > 90) {
            return fromNodeName === toNodeName.toUpperCase();
        } else {
        return false;
    }
}

function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name);
}

function morphAttrs(fromNode, toNode) {
    if (toNode.assignAttributes) {
        toNode.assignAttributes(fromNode);
    } else {
        var attrs = toNode.attributes;
        var i;
        var attr;
        var attrName;
        var attrNamespaceURI;
        var attrValue;
        var fromValue;

        for (i = attrs.length - 1; i >= 0; --i) {
            attr = attrs[i];
            attrName = attr.name;
            attrNamespaceURI = attr.namespaceURI;
            attrValue = attr.value;

            if (attrNamespaceURI) {
                attrName = attr.localName || attrName;
                fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);

                if (fromValue !== attrValue) {
                    fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
                }
            } else {
                fromValue = fromNode.getAttribute(attrName);

                if (fromValue !== attrValue) {
                    fromNode.setAttribute(attrName, attrValue);
                }
            }
        }

        attrs = fromNode.attributes;

        for (i = attrs.length - 1; i >= 0; --i) {
            attr = attrs[i];
            if (attr.specified !== false) {
                attrName = attr.name;
                attrNamespaceURI = attr.namespaceURI;

                if (attrNamespaceURI) {
                    attrName = attr.localName || attrName;

                    if (!hasAttributeNS(toNode, attrNamespaceURI, attrName)) {
                        fromNode.removeAttributeNS(attrNamespaceURI, attrName);
                    }
                } else {
                    if (!hasAttributeNS(toNode, null, attrName)) {
                        fromNode.removeAttribute(attrName);
                    }
                }
            }
        }
    }
}

function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
        var nextChild = curChild.nextSibling;
        toEl.appendChild(curChild);
        curChild = nextChild;
    }
    return toEl;
}

function defaultGetNodeKey(node) {
    return node.id;
}

function morphdom(fromNode, toNode, options) {
    if (!options) {
        options = {};
    }

    if (typeof toNode === 'string') {
        if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML') {
            var toNodeHtml = toNode;
            toNode = doc.createElement('html');
            toNode.innerHTML = toNodeHtml;
        } else {
            toNode = toElement(toNode);
        }
    }

    var getNodeKey = options.getNodeKey || defaultGetNodeKey;
    var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
    var onNodeAdded = options.onNodeAdded || noop;
    var onBeforeElUpdated = options.onBeforeElUpdated || noop;
    var onElUpdated = options.onElUpdated || noop;
    var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
    var onNodeDiscarded = options.onNodeDiscarded || noop;
    var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
    var childrenOnly = options.childrenOnly === true;

    var fromNodesLookup = {};
    var keyedRemovalList;

    function addKeyedRemoval(key) {
        if (keyedRemovalList) {
            keyedRemovalList.push(key);
        } else {
            keyedRemovalList = [key];
        }
    }

    function walkDiscardedChildNodes(node, skipKeyedNodes) {
        if (node.nodeType === ELEMENT_NODE) {
            var curChild = node.firstChild;
            while (curChild) {

                var key = undefined;

                if (skipKeyedNodes && (key = getNodeKey(curChild))) {
                    addKeyedRemoval(key);
                } else {
                    onNodeDiscarded(curChild);
                    if (curChild.firstChild) {
                        walkDiscardedChildNodes(curChild, skipKeyedNodes);
                    }
                }

                curChild = curChild.nextSibling;
            }
        }
    }

    function removeNode(node, parentNode, skipKeyedNodes) {
        if (onBeforeNodeDiscarded(node) === false) {
            return;
        }

        if (parentNode) {
            parentNode.removeChild(node);
        }

        onNodeDiscarded(node);
        walkDiscardedChildNodes(node, skipKeyedNodes);
    }

    function indexTree(node) {
        if (node.nodeType === ELEMENT_NODE) {
            var curChild = node.firstChild;
            while (curChild) {
                var key = getNodeKey(curChild);
                if (key) {
                    fromNodesLookup[key] = curChild;
                }

                indexTree(curChild);

                curChild = curChild.nextSibling;
            }
        }
    }

    indexTree(fromNode);

    function handleNodeAdded(el) {
        onNodeAdded(el);

        var curChild = el.firstChild;
        while (curChild) {
            var nextSibling = curChild.nextSibling;

            var key = getNodeKey(curChild);
            if (key) {
                var unmatchedFromEl = fromNodesLookup[key];
                if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
                    curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
                    morphEl(unmatchedFromEl, curChild);
                }
            }

            handleNodeAdded(curChild);
            curChild = nextSibling;
        }
    }

    function morphEl(fromEl, toEl, childrenOnly) {
        var toElKey = getNodeKey(toEl);
        var curFromNodeKey;

        if (toElKey) {
            delete fromNodesLookup[toElKey];
        }

        if (toNode.isSameNode && toNode.isSameNode(fromNode)) {
            return;
        }

        if (!childrenOnly) {
            if (onBeforeElUpdated(fromEl, toEl) === false) {
                return;
            }

            morphAttrs(fromEl, toEl);
            onElUpdated(fromEl);

            if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
                return;
            }
        }

        if (fromEl.nodeName !== 'TEXTAREA') {
            var curToNodeChild = toEl.firstChild;
            var curFromNodeChild = fromEl.firstChild;
            var curToNodeKey;

            var fromNextSibling;
            var toNextSibling;
            var matchingFromEl;

            outer: while (curToNodeChild) {
                toNextSibling = curToNodeChild.nextSibling;
                curToNodeKey = getNodeKey(curToNodeChild);

                while (curFromNodeChild) {
                    fromNextSibling = curFromNodeChild.nextSibling;

                    if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
                        curToNodeChild = toNextSibling;
                        curFromNodeChild = fromNextSibling;
                        continue outer;
                    }

                    curFromNodeKey = getNodeKey(curFromNodeChild);

                    var curFromNodeType = curFromNodeChild.nodeType;

                    var isCompatible = undefined;

                    if (curFromNodeType === curToNodeChild.nodeType) {
                        if (curFromNodeType === ELEMENT_NODE) {

                            if (curToNodeKey) {
                                if (curToNodeKey !== curFromNodeKey) {
                                    if (matchingFromEl = fromNodesLookup[curToNodeKey]) {
                                        if (curFromNodeChild.nextSibling === matchingFromEl) {
                                            isCompatible = false;
                                        } else {
                                            fromEl.insertBefore(matchingFromEl, curFromNodeChild);

                                            fromNextSibling = curFromNodeChild.nextSibling;

                                            if (curFromNodeKey) {
                                                addKeyedRemoval(curFromNodeKey);
                                            } else {
                                                removeNode(curFromNodeChild, fromEl, true);
                                            }

                                            curFromNodeChild = matchingFromEl;
                                        }
                                    } else {
                                        isCompatible = false;
                                    }
                                }
                            } else if (curFromNodeKey) {
                                isCompatible = false;
                            }

                            isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                            if (isCompatible) {
                                morphEl(curFromNodeChild, curToNodeChild);
                            }
                        } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                            isCompatible = true;

                            curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                        }
                    }

                    if (isCompatible) {
                        curToNodeChild = toNextSibling;
                        curFromNodeChild = fromNextSibling;
                        continue outer;
                    }

                    if (curFromNodeKey) {
                        addKeyedRemoval(curFromNodeKey);
                    } else {
                        removeNode(curFromNodeChild, fromEl, true);
                    }

                    curFromNodeChild = fromNextSibling;
                }

                if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
                    fromEl.appendChild(matchingFromEl);
                    morphEl(matchingFromEl, curToNodeChild);
                } else {
                    var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
                    if (onBeforeNodeAddedResult !== false) {
                        if (onBeforeNodeAddedResult) {
                            curToNodeChild = onBeforeNodeAddedResult;
                        }

                        if (curToNodeChild.actualize) {
                            curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
                        }
                        fromEl.appendChild(curToNodeChild);
                        handleNodeAdded(curToNodeChild);
                    }
                }

                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
            }

            while (curFromNodeChild) {
                fromNextSibling = curFromNodeChild.nextSibling;
                if (curFromNodeKey = getNodeKey(curFromNodeChild)) {
                    addKeyedRemoval(curFromNodeKey);
                } else {
                    removeNode(curFromNodeChild, fromEl, true);
                }
                curFromNodeChild = fromNextSibling;
            }
        }

        var specialElHandler = specialElHandlers[fromEl.nodeName];
        if (specialElHandler) {
            specialElHandler(fromEl, toEl);
        }
    }

    var morphedNode = fromNode;
    var morphedNodeType = morphedNode.nodeType;
    var toNodeType = toNode.nodeType;

    if (!childrenOnly) {
        if (morphedNodeType === ELEMENT_NODE) {
            if (toNodeType === ELEMENT_NODE) {
                if (!compareNodeNames(fromNode, toNode)) {
                    onNodeDiscarded(fromNode);
                    morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
                }
            } else {
                morphedNode = toNode;
            }
        } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) {
            if (toNodeType === morphedNodeType) {
                morphedNode.nodeValue = toNode.nodeValue;
                return morphedNode;
            } else {
                morphedNode = toNode;
            }
        }
    }

    if (morphedNode === toNode) {
        onNodeDiscarded(fromNode);
    } else {
        morphEl(morphedNode, toNode, childrenOnly);

        if (keyedRemovalList) {
            for (var i = 0, len = keyedRemovalList.length; i < len; i++) {
                var elToRemove = fromNodesLookup[keyedRemovalList[i]];
                if (elToRemove) {
                    removeNode(elToRemove, elToRemove.parentNode, false);
                }
            }
        }
    }

    if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
        if (morphedNode.actualize) {
            morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
        }

        fromNode.parentNode.replaceChild(morphedNode, fromNode);
    }

    return morphedNode;
}

module.exports = morphdom;

},{}],39:[function(require,module,exports){


"use strict";

var minimalDesc = ['h', 'min', 's', 'ms', 'μs', 'ns'];
var verboseDesc = ['hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond'];
var convert = [60 * 60, 60, 1, 1e6, 1e3, 1];

module.exports = function (source, opts) {
	var verbose, precise, i, spot, sourceAtStep, valAtStep, decimals, strAtStep, results, totalSeconds;

	verbose = false;
	precise = false;
	if (opts) {
		verbose = opts.verbose || false;
		precise = opts.precise || false;
	}

	if (!Array.isArray(source) || source.length !== 2) {
		return '';
	}
	if (typeof source[0] !== 'number' || typeof source[1] !== 'number') {
		return '';
	}

	if (source[1] < 0) {
		totalSeconds = source[0] + source[1] / 1e9;
		source[0] = parseInt(totalSeconds);
		source[1] = parseFloat((totalSeconds % 1).toPrecision(9)) * 1e9;
	}

	results = '';

	for (i = 0; i < 6; i++) {
		spot = i < 3 ? 0 : 1;
		sourceAtStep = source[spot];
		if (i !== 3 && i !== 0) {
			sourceAtStep = sourceAtStep % convert[i - 1];
		}
		if (i === 2) {
			sourceAtStep += source[1] / 1e9;
		}
		valAtStep = sourceAtStep / convert[i];
		if (valAtStep >= 1) {
			if (verbose) {
				valAtStep = Math.floor(valAtStep);
			}
			if (!precise) {
				decimals = valAtStep >= 10 ? 0 : 2;
				strAtStep = valAtStep.toFixed(decimals);
			} else {
				strAtStep = valAtStep.toString();
			}
			if (strAtStep.indexOf('.') > -1 && strAtStep[strAtStep.length - 1] === '0') {
				strAtStep = strAtStep.replace(/\.?0+$/, '');
			}
			if (results) {
				results += ' ';
			}
			results += strAtStep;
			if (verbose) {
				results += ' ' + verboseDesc[i];
				if (strAtStep !== '1') {
					results += 's';
				}
			} else {
				results += ' ' + minimalDesc[i];
			}
			if (!verbose) {
				break;
			}
		}
	}

	return results;
};

},{}],40:[function(require,module,exports){
'use strict';

var process = module.exports = {};

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        return setTimeout(fun, 0);
    }

    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        return clearTimeout(marker);
    }

    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = '';
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

},{}],41:[function(require,module,exports){
'use strict';

module.exports = require('./lib');

},{"./lib":46}],42:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var asap = require('asap/raw');

function noop() {}

var LAST_ERROR = null;
var IS_ERROR = {};
function getThen(obj) {
  try {
    return obj.then;
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}
function tryCallTwo(fn, a, b) {
  try {
    fn(a, b);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

module.exports = Promise;

function Promise(fn) {
  if (_typeof(this) !== 'object') {
    throw new TypeError('Promises must be constructed via new');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('Promise constructor\'s argument is not a function');
  }
  this._40 = 0;
  this._65 = 0;
  this._55 = null;
  this._72 = null;
  if (fn === noop) return;
  doResolve(fn, this);
}
Promise._37 = null;
Promise._87 = null;
Promise._61 = noop;

Promise.prototype.then = function (onFulfilled, onRejected) {
  if (this.constructor !== Promise) {
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};

function safeThen(self, onFulfilled, onRejected) {
  return new self.constructor(function (resolve, reject) {
    var res = new Promise(noop);
    res.then(resolve, reject);
    handle(self, new Handler(onFulfilled, onRejected, res));
  });
}
function handle(self, deferred) {
  while (self._65 === 3) {
    self = self._55;
  }
  if (Promise._37) {
    Promise._37(self);
  }
  if (self._65 === 0) {
    if (self._40 === 0) {
      self._40 = 1;
      self._72 = deferred;
      return;
    }
    if (self._40 === 1) {
      self._40 = 2;
      self._72 = [self._72, deferred];
      return;
    }
    self._72.push(deferred);
    return;
  }
  handleResolved(self, deferred);
}

function handleResolved(self, deferred) {
  asap(function () {
    var cb = self._65 === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._65 === 1) {
        resolve(deferred.promise, self._55);
      } else {
        reject(deferred.promise, self._55);
      }
      return;
    }
    var ret = tryCallOne(cb, self._55);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
}
function resolve(self, newValue) {
  if (newValue === self) {
    return reject(self, new TypeError('A promise cannot be resolved with itself.'));
  }
  if (newValue && ((typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) === 'object' || typeof newValue === 'function')) {
    var then = getThen(newValue);
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR);
    }
    if (then === self.then && newValue instanceof Promise) {
      self._65 = 3;
      self._55 = newValue;
      finale(self);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  self._65 = 1;
  self._55 = newValue;
  finale(self);
}

function reject(self, newValue) {
  self._65 = 2;
  self._55 = newValue;
  if (Promise._87) {
    Promise._87(self, newValue);
  }
  finale(self);
}
function finale(self) {
  if (self._40 === 1) {
    handle(self, self._72);
    self._72 = null;
  }
  if (self._40 === 2) {
    for (var i = 0; i < self._72.length; i++) {
      handle(self, self._72[i]);
    }
    self._72 = null;
  }
}

function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

function doResolve(fn, promise) {
  var done = false;
  var res = tryCallTwo(fn, function (value) {
    if (done) return;
    done = true;
    resolve(promise, value);
  }, function (reason) {
    if (done) return;
    done = true;
    reject(promise, reason);
  });
  if (!done && res === IS_ERROR) {
    done = true;
    reject(promise, LAST_ERROR);
  }
}

},{"asap/raw":27}],43:[function(require,module,exports){
'use strict';

var Promise = require('./core.js');

module.exports = Promise;
Promise.prototype.done = function (onFulfilled, onRejected) {
  var self = arguments.length ? this.then.apply(this, arguments) : this;
  self.then(null, function (err) {
    setTimeout(function () {
      throw err;
    }, 0);
  });
};

},{"./core.js":42}],44:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Promise = require('./core.js');

module.exports = Promise;

var TRUE = valuePromise(true);
var FALSE = valuePromise(false);
var NULL = valuePromise(null);
var UNDEFINED = valuePromise(undefined);
var ZERO = valuePromise(0);
var EMPTYSTRING = valuePromise('');

function valuePromise(value) {
  var p = new Promise(Promise._61);
  p._65 = 1;
  p._55 = value;
  return p;
}
Promise.resolve = function (value) {
  if (value instanceof Promise) return value;

  if (value === null) return NULL;
  if (value === undefined) return UNDEFINED;
  if (value === true) return TRUE;
  if (value === false) return FALSE;
  if (value === 0) return ZERO;
  if (value === '') return EMPTYSTRING;

  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' || typeof value === 'function') {
    try {
      var then = value.then;
      if (typeof then === 'function') {
        return new Promise(then.bind(value));
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex);
      });
    }
  }
  return valuePromise(value);
};

Promise.all = function (arr) {
  var args = Array.prototype.slice.call(arr);

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([]);
    var remaining = args.length;
    function res(i, val) {
      if (val && ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' || typeof val === 'function')) {
        if (val instanceof Promise && val.then === Promise.prototype.then) {
          while (val._65 === 3) {
            val = val._55;
          }
          if (val._65 === 1) return res(i, val._55);
          if (val._65 === 2) reject(val._55);
          val.then(function (val) {
            res(i, val);
          }, reject);
          return;
        } else {
          var then = val.then;
          if (typeof then === 'function') {
            var p = new Promise(then.bind(val));
            p.then(function (val) {
              res(i, val);
            }, reject);
            return;
          }
        }
      }
      args[i] = val;
      if (--remaining === 0) {
        resolve(args);
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
};

Promise.race = function (values) {
  return new Promise(function (resolve, reject) {
    values.forEach(function (value) {
      Promise.resolve(value).then(resolve, reject);
    });
  });
};

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
};

},{"./core.js":42}],45:[function(require,module,exports){
'use strict';

var Promise = require('./core.js');

module.exports = Promise;
Promise.prototype['finally'] = function (f) {
  return this.then(function (value) {
    return Promise.resolve(f()).then(function () {
      return value;
    });
  }, function (err) {
    return Promise.resolve(f()).then(function () {
      throw err;
    });
  });
};

},{"./core.js":42}],46:[function(require,module,exports){
'use strict';

module.exports = require('./core.js');
require('./done.js');
require('./finally.js');
require('./es6-extensions.js');
require('./node-extensions.js');
require('./synchronous.js');

},{"./core.js":42,"./done.js":43,"./es6-extensions.js":44,"./finally.js":45,"./node-extensions.js":47,"./synchronous.js":48}],47:[function(require,module,exports){
'use strict';

var Promise = require('./core.js');
var asap = require('asap');

module.exports = Promise;

Promise.denodeify = function (fn, argumentCount) {
  if (typeof argumentCount === 'number' && argumentCount !== Infinity) {
    return denodeifyWithCount(fn, argumentCount);
  } else {
    return denodeifyWithoutCount(fn);
  }
};

var callbackFn = 'function (err, res) {' + 'if (err) { rj(err); } else { rs(res); }' + '}';
function denodeifyWithCount(fn, argumentCount) {
  var args = [];
  for (var i = 0; i < argumentCount; i++) {
    args.push('a' + i);
  }
  var body = ['return function (' + args.join(',') + ') {', 'var self = this;', 'return new Promise(function (rs, rj) {', 'var res = fn.call(', ['self'].concat(args).concat([callbackFn]).join(','), ');', 'if (res &&', '(typeof res === "object" || typeof res === "function") &&', 'typeof res.then === "function"', ') {rs(res);}', '});', '};'].join('');
  return Function(['Promise', 'fn'], body)(Promise, fn);
}
function denodeifyWithoutCount(fn) {
  var fnLength = Math.max(fn.length - 1, 3);
  var args = [];
  for (var i = 0; i < fnLength; i++) {
    args.push('a' + i);
  }
  var body = ['return function (' + args.join(',') + ') {', 'var self = this;', 'var args;', 'var argLength = arguments.length;', 'if (arguments.length > ' + fnLength + ') {', 'args = new Array(arguments.length + 1);', 'for (var i = 0; i < arguments.length; i++) {', 'args[i] = arguments[i];', '}', '}', 'return new Promise(function (rs, rj) {', 'var cb = ' + callbackFn + ';', 'var res;', 'switch (argLength) {', args.concat(['extra']).map(function (_, index) {
    return 'case ' + index + ':' + 'res = fn.call(' + ['self'].concat(args.slice(0, index)).concat('cb').join(',') + ');' + 'break;';
  }).join(''), 'default:', 'args[argLength] = cb;', 'res = fn.apply(self, args);', '}', 'if (res &&', '(typeof res === "object" || typeof res === "function") &&', 'typeof res.then === "function"', ') {rs(res);}', '});', '};'].join('');

  return Function(['Promise', 'fn'], body)(Promise, fn);
}

Promise.nodeify = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var callback = typeof args[args.length - 1] === 'function' ? args.pop() : null;
    var ctx = this;
    try {
      return fn.apply(this, arguments).nodeify(callback, ctx);
    } catch (ex) {
      if (callback === null || typeof callback == 'undefined') {
        return new Promise(function (resolve, reject) {
          reject(ex);
        });
      } else {
        asap(function () {
          callback.call(ctx, ex);
        });
      }
    }
  };
};

Promise.prototype.nodeify = function (callback, ctx) {
  if (typeof callback != 'function') return this;

  this.then(function (value) {
    asap(function () {
      callback.call(ctx, null, value);
    });
  }, function (err) {
    asap(function () {
      callback.call(ctx, err);
    });
  });
};

},{"./core.js":42,"asap":26}],48:[function(require,module,exports){
'use strict';

var Promise = require('./core.js');

module.exports = Promise;
Promise.enableSynchronous = function () {
  Promise.prototype.isPending = function () {
    return this.getState() == 0;
  };

  Promise.prototype.isFulfilled = function () {
    return this.getState() == 1;
  };

  Promise.prototype.isRejected = function () {
    return this.getState() == 2;
  };

  Promise.prototype.getValue = function () {
    if (this._65 === 3) {
      return this._55.getValue();
    }

    if (!this.isFulfilled()) {
      throw new Error('Cannot get a value of an unfulfilled promise.');
    }

    return this._55;
  };

  Promise.prototype.getReason = function () {
    if (this._65 === 3) {
      return this._55.getReason();
    }

    if (!this.isRejected()) {
      throw new Error('Cannot get a rejection reason of a non-rejected promise.');
    }

    return this._55;
  };

  Promise.prototype.getState = function () {
    if (this._65 === 3) {
      return this._55.getState();
    }
    if (this._65 === -1 || this._65 === -2) {
      return 0;
    }

    return this._65;
  };
};

Promise.disableSynchronous = function () {
  Promise.prototype.isPending = undefined;
  Promise.prototype.isFulfilled = undefined;
  Promise.prototype.isRejected = undefined;
  Promise.prototype.getValue = undefined;
  Promise.prototype.getReason = undefined;
  Promise.prototype.getState = undefined;
};

},{"./core.js":42}],49:[function(require,module,exports){
'use strict';

var v1 = require('./v1');
var v4 = require('./v4');

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;

},{"./v1":52,"./v4":53}],50:[function(require,module,exports){
'use strict';

var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;

},{}],51:[function(require,module,exports){
(function (global){
"use strict";

var rng;

var crypto = global.crypto || global.msCrypto;
if (crypto && crypto.getRandomValues) {
  var rnds8 = new Uint8Array(16);
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  var rnds = new Array(16);
  rng = function rng() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],52:[function(require,module,exports){
'use strict';

var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

var _seedBytes = rng();

var _nodeId = [_seedBytes[0] | 0x01, _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]];

var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

var _lastMSecs = 0,
    _lastNSecs = 0;

function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000;

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  msecs += 12219292800000;

  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  b[i++] = tmh >>> 24 & 0xf | 0x10;
  b[i++] = tmh >>> 16 & 0xff;

  b[i++] = clockseq >>> 8 | 0x80;

  b[i++] = clockseq & 0xff;

  var node = options.node || _nodeId;
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;

},{"./lib/bytesToUuid":50,"./lib/rng":51}],53:[function(require,module,exports){
'use strict';

var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof options == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80;

  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;

},{"./lib/bytesToUuid":50,"./lib/rng":51}],54:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoggerBase = require('../lib/LoggerBase');

var Logger = function (_LoggerBase) {
	_inherits(Logger, _LoggerBase);

	function Logger() {
		_classCallCheck(this, Logger);

		return _possibleConstructorReturn(this, (Logger.__proto__ || Object.getPrototypeOf(Logger)).apply(this, arguments));
	}

	_createClass(Logger, [{
		key: 'write',
		value: function write(level, message) {
			if (level < this._level) {
				return;
			}

			if (level >= 50) {
				var errorMessage = message instanceof Error ? message.name + ': ' + message.message + '\n' + message.stack : message;
				console.error(errorMessage);
			} else if (level >= 40) {
				console.warn(message);
			} else if (level >= 30) {
				console.info(message);
			} else {
				console.log(message);
			}
		}
	}, {
		key: 'wrapEventBus',
		value: function wrapEventBus(eventBus) {
			var _this2 = this;

			_get(Logger.prototype.__proto__ || Object.getPrototypeOf(Logger.prototype), 'wrapEventBus', this).call(this, eventBus);

			var window = this._locator.resolve('window');

			window.onerror = function (msg, uri, line) {
				_this2.fatal(uri + ':' + line + ' ' + msg);
				return true;
			};

			if (this._level > 20) {
				return;
			}

			eventBus.on('documentUpdated', function (args) {
				return _this2.debug('Document updated (' + args.length + ' store(s) changed)');
			}).on('componentBound', function (args) {
				var id = args.id ? '#' + args.id : '';
				_this2.debug('Component "' + args.element.tagName + id + '" is bound');
			}).on('componentUnbound', function (args) {
				var id = args.id ? '#' + args.id : '';
				_this2.debug('Component "' + args.element.tagName + id + '" is unbound');
			});
		}
	}]);

	return Logger;
}(LoggerBase);

module.exports = Logger;

},{"../lib/LoggerBase":55}],55:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_LEVEL = 30;
var DEFAULT_NAME = 'catberry';

var prettyHrTime = require('pretty-hrtime');

var LoggerBase = function () {
	function LoggerBase(locator) {
		_classCallCheck(this, LoggerBase);

		var config = locator.resolve('config').logger || {};

		this._locator = locator;

		this._level = typeof config.level === 'number' ? config.level : DEFAULT_LEVEL;

		this._name = typeof config.name === 'string' ? config.name : DEFAULT_NAME;

		var eventBus = locator.resolve('eventBus');
		this.wrapEventBus(eventBus);
	}

	_createClass(LoggerBase, [{
		key: 'trace',
		value: function trace(message) {
			this.write(10, message);
		}
	}, {
		key: 'debug',
		value: function debug(message) {
			this.write(20, message);
		}
	}, {
		key: 'info',
		value: function info(message) {
			this.write(30, message);
		}
	}, {
		key: 'warn',
		value: function warn(message) {
			this.write(40, message);
		}
	}, {
		key: 'error',
		value: function error(message) {
			this.write(50, message);
		}
	}, {
		key: 'fatal',
		value: function fatal(message) {
			this.write(60, message);
		}
	}, {
		key: 'wrapEventBus',
		value: function wrapEventBus(eventBus) {
			var _this = this;

			if (this._level > 50) {
				return;
			}
			eventBus.on('error', function (error) {
				return _this.error(error);
			});

			if (this._level > 40) {
				return;
			}
			eventBus.on('warn', function (msg) {
				return _this.warn(msg);
			});

			if (this._level > 30) {
				return;
			}

			eventBus.on('info', function (msg) {
				return _this.info(msg);
			}).on('componentLoaded', function (args) {
				return _this.info('Component "' + args.name + '" loaded');
			}).on('storeLoaded', function (args) {
				return _this.info('Store "' + args.name + '" loaded');
			}).on('allStoresLoaded', function () {
				return _this.info('All stores loaded');
			}).on('allComponentsLoaded', function () {
				return _this.info('All components loaded');
			});

			if (this._level > 20) {
				return;
			}

			eventBus.on('debug', function (msg) {
				return _this.debug(msg);
			}).on('componentRender', function (args) {
				var id = getId(args.context);
				var tagName = getTagNameForComponentName(args.name);
				_this.debug('Component "' + tagName + id + '" is being rendered...');
			}).on('componentRendered', function (args) {
				var id = getId(args.context);
				var tagName = getTagNameForComponentName(args.name);
				var time = Array.isArray(args.hrTime) ? ' (' + prettyHrTime(args.hrTime) + ')' : '';
				_this.debug('Component "' + tagName + id + '" rendered' + time);
			}).on('documentRendered', function (args) {
				return _this.debug('Document rendered for URI ' + args.location.toString());
			});

			if (this._level > 10) {
				return;
			}

			eventBus.on('trace', function (msg) {
				return _this.trace(msg);
			});
		}
	}]);

	return LoggerBase;
}();

function getId(context) {
	var id = context.attributes.id;
	return id ? '#' + id : '';
}

function getTagNameForComponentName(componentName) {
	if (typeof componentName !== 'string') {
		return '';
	}
	var upperComponentName = componentName.toUpperCase();
	if (componentName === 'HEAD') {
		return upperComponentName;
	}
	if (componentName === 'DOCUMENT') {
		return 'HTML';
	}
	return 'CAT-' + upperComponentName;
}

module.exports = LoggerBase;

},{"pretty-hrtime":66}],56:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pugRuntimeWrap = require('pug-runtime/wrap');

var TemplateProvider = function () {
	function TemplateProvider(locator) {
		_classCallCheck(this, TemplateProvider);

		var config = locator.resolve('config') || {};

		this._pug = locator.resolve('pug');

		this._merge = this._pug.merge;

		this._pugOptions = config.pugOptions || {};

		this.globals = config.template && config.template.globals ? config.template.globals : {};

		this._templates = Object.create(null);
	}

	_createClass(TemplateProvider, [{
		key: 'getName',
		value: function getName() {
			return 'pug';
		}
	}, {
		key: 'registerCompiled',
		value: function registerCompiled(name, compiled) {
			this._templates[name] = pugRuntimeWrap(compiled);
		}
	}, {
		key: 'render',
		value: function render(name, data) {
			if (!(name in this._templates)) {
				return Promise.reject(new Error('"' + name + '" not found among registered templates'));
			}
			var promise = void 0;
			try {
				var mergedData = this.globals ? this._merge(this._merge({}, this.globals), data || {}) : data;
				promise = Promise.resolve(this._templates[name](mergedData));
			} catch (e) {
				promise = Promise.reject(e);
			}
			return promise;
		}
	}]);

	return TemplateProvider;
}();

module.exports = TemplateProvider;

},{"pug-runtime/wrap":68}],57:[function(require,module,exports){
'use strict';

module.exports = require('pug-runtime');

},{"pug-runtime":67}],58:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UHRBase = require('../lib/UHRBase');

var NON_SAFE_HEADERS = {
	cookie: true,
	'accept-charset': true
};

var UHR = function (_UHRBase) {
	_inherits(UHR, _UHRBase);

	function UHR(locator) {
		_classCallCheck(this, UHR);

		var _this = _possibleConstructorReturn(this, (UHR.__proto__ || Object.getPrototypeOf(UHR)).call(this));

		_this.window = locator.resolve('window');
		return _this;
	}

	_createClass(UHR, [{
		key: '_doRequest',
		value: function _doRequest(parameters) {
			var _this2 = this;

			Object.keys(parameters.headers).forEach(function (name) {
				if (NON_SAFE_HEADERS.hasOwnProperty(name.toLowerCase())) {
					delete parameters.headers[name];
				}
			});

			return new Promise(function (fulfill, reject) {
				var xhr = new _this2.window.XMLHttpRequest();
				var requestError = null;

				xhr.onabort = function () {
					requestError = new Error('Request aborted');
					reject(requestError);
				};
				xhr.ontimeout = function () {
					requestError = new Error('Request timeout');
					reject(requestError);
				};
				xhr.onerror = function () {
					requestError = new Error(xhr.statusText || 'Connection error');
					reject(requestError);
				};
				xhr.onreadystatechange = function () {
					if (xhr.readyState !== 4) {
						return;
					}
					if (requestError) {
						return;
					}
					var status = _this2._getStatusObject(xhr);
					var content = _this2.convertResponse(status.headers, xhr.responseText);
					fulfill({
						status: status,
						content: content
					});
				};

				var user = parameters.uri.authority.userInfo ? parameters.uri.authority.userInfo.user : null;
				var password = parameters.uri.authority.userInfo ? parameters.uri.authority.userInfo.password : null;
				xhr.open(parameters.method, parameters.uri.toString(), true, user || undefined, password || undefined);
				xhr.timeout = parameters.timeout;

				if (parameters.withCredentials) {
					xhr.withCredentials = true;
				}

				Object.keys(parameters.headers).forEach(function (headerName) {
					return xhr.setRequestHeader(headerName, parameters.headers[headerName]);
				});

				xhr.send(parameters.data);
			});
		}
	}, {
		key: '_getStatusObject',
		value: function _getStatusObject(xhr) {
			var headers = {};

			if (!xhr) {
				return {
					code: 0,
					text: '',
					headers: headers
				};
			}

			xhr.getAllResponseHeaders().split('\n').forEach(function (header) {
				var delimiterIndex = header.indexOf(':');
				if (delimiterIndex <= 0) {
					return;
				}
				var headerName = header.substring(0, delimiterIndex).trim().toLowerCase();
				headers[headerName] = header.substring(delimiterIndex + 1).trim();
			});

			return {
				code: xhr.status === 1223 ? 204 : xhr.status,
				text: xhr.status === 1223 ? 'No Content' : xhr.statusText,
				headers: headers
			};
		}
	}]);

	return UHR;
}(UHRBase);

module.exports = UHR;

},{"../lib/UHRBase":59}],59:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var catberryUri = require('catberry-uri');
var Query = catberryUri.Query;
var URI = catberryUri.URI;

var DEFAULT_TIMEOUT = 30000;
var HTTP_PROTOCOL_REGEXP = /^(http)s?$/i;

var UHRBase = function () {
	function UHRBase() {
		_classCallCheck(this, UHRBase);
	}

	_createClass(UHRBase, [{
		key: 'get',
		value: function get(url, parameters) {
			return this.request(this._normalizeOptions(UHRBase.METHODS.GET, url, parameters));
		}
	}, {
		key: 'post',
		value: function post(url, parameters) {
			return this.request(this._normalizeOptions(UHRBase.METHODS.POST, url, parameters));
		}
	}, {
		key: 'put',
		value: function put(url, parameters) {
			return this.request(this._normalizeOptions(UHRBase.METHODS.PUT, url, parameters));
		}
	}, {
		key: 'patch',
		value: function patch(url, parameters) {
			return this.request(this._normalizeOptions(UHRBase.METHODS.PATCH, url, parameters));
		}
	}, {
		key: 'delete',
		value: function _delete(url, parameters) {
			return this.request(this._normalizeOptions(UHRBase.METHODS.DELETE, url, parameters));
		}
	}, {
		key: 'request',
		value: function request(parameters) {
			var _this = this;

			return this._validateRequest(parameters).then(function (validated) {
				return _this._doRequest(validated);
			});
		}
	}, {
		key: '_validateRequest',
		value: function _validateRequest(parameters) {
			if (!parameters || (typeof parameters === 'undefined' ? 'undefined' : _typeof(parameters)) !== 'object') {
				return Promise.reject(new Error('Request parameters argument should be an object'));
			}

			var validated = Object.create(parameters);

			if (typeof parameters.url !== 'string') {
				return Promise.reject(new Error('"parameters.url" is a required parameter'));
			}

			validated.uri = new URI(validated.url);
			if (!validated.uri.scheme) {
				return Promise.reject(new Error('"parameters.url" should contain a protocol (scheme)'));
			}
			if (!HTTP_PROTOCOL_REGEXP.test(validated.uri.scheme)) {
				return Promise.reject(new Error('"' + validated.uri.scheme + '" protocol (scheme) is unsupported'));
			}
			if (!validated.uri.authority || !validated.uri.authority.host) {
				return Promise.reject(new Error('"parameters.url" should contain a host'));
			}
			if (typeof validated.method !== 'string' || !(validated.method in UHRBase.METHODS)) {
				return Promise.reject(new Error('HTTP method is a required parameter'));
			}

			validated.timeout = validated.timeout || DEFAULT_TIMEOUT;
			if (typeof validated.timeout !== 'number') {
				return Promise.reject(new Error('Timeout should be a number'));
			}

			validated.headers = this.createHeaders(validated.headers);

			if (!this._isUpstreamRequest(parameters.method) && validated.data && _typeof(validated.data) === 'object') {

				var dataKeys = Object.keys(validated.data);

				if (dataKeys.length > 0 && !validated.uri.query) {
					validated.uri.query = new Query('');
				}

				dataKeys.forEach(function (key) {
					validated.uri.query.values[key] = validated.data[key];
				});
				validated.data = null;
			} else {
				var dataAndHeaders = this._getDataToSend(validated.headers, validated.data);
				validated.headers = dataAndHeaders.headers;
				validated.data = dataAndHeaders.data;
			}

			return Promise.resolve(validated);
		}
	}, {
		key: '_getDataToSend',
		value: function _getDataToSend(headers, data) {
			var found = this._findContentType(headers);
			var contentTypeHeader = found.name;
			var contentType = found.type;

			if (!data || (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
				data = data ? String(data) : '';
				if (!contentType) {
					headers[contentTypeHeader] = UHRBase.PLAIN_TEXT_ENTITY_CONTENT_TYPE;
				}
				return {
					headers: headers,
					data: data
				};
			}

			if (contentType === UHRBase.TYPES.JSON) {
				return {
					headers: headers,
					data: JSON.stringify(data)
				};
			}

			headers[contentTypeHeader] = UHRBase.URL_ENCODED_ENTITY_CONTENT_TYPE;

			var query = new Query();
			query.values = data;
			return {
				headers: headers,
				data: query.toString().replace(/\+/g, '%2B').replace(/%20/g, '+')
			};
		}
	}, {
		key: 'createHeaders',
		value: function createHeaders(parameterHeaders) {
			if (!parameterHeaders || (typeof parameterHeaders === 'undefined' ? 'undefined' : _typeof(parameterHeaders)) !== 'object') {
				parameterHeaders = {};
			}

			var headers = {};

			Object.keys(UHRBase.DEFAULT_GENERAL_HEADERS).forEach(function (headerName) {
				headers[headerName] = UHRBase.DEFAULT_GENERAL_HEADERS[headerName];
			});

			Object.keys(parameterHeaders).forEach(function (headerName) {
				if (parameterHeaders[headerName] === null || parameterHeaders[headerName] === undefined) {
					delete headers[headerName];
					return;
				}
				headers[headerName] = parameterHeaders[headerName];
			});

			return headers;
		}
	}, {
		key: '_doRequest',
		value: function _doRequest(parameters) {}
	}, {
		key: 'convertResponse',
		value: function convertResponse(headers, responseData) {
			if (typeof responseData !== 'string') {
				responseData = '';
			}
			var found = this._findContentType(headers);
			var contentType = found.type || UHRBase.TYPES.PLAIN_TEXT;

			switch (contentType) {
				case UHRBase.TYPES.JSON:
					try {
						return JSON.parse(responseData) || {};
					} catch (e) {
						return {};
					}
				case UHRBase.TYPES.URL_ENCODED:
					try {
						var query = new Query(responseData.replace('+', '%20'));
						return query.values || {};
					} catch (e) {
						return {};
					}
				default:
					return responseData;
			}
		}
	}, {
		key: '_isUpstreamRequest',
		value: function _isUpstreamRequest(method) {
			return method === UHRBase.METHODS.POST || method === UHRBase.METHODS.PUT || method === UHRBase.METHODS.PATCH;
		}
	}, {
		key: '_normalizeOptions',
		value: function _normalizeOptions(method, url, parameters) {
			parameters = parameters || {};
			var normalParameters = Object.create(parameters);
			normalParameters.method = method;
			normalParameters.url = url;
			return normalParameters;
		}
	}, {
		key: '_findContentType',
		value: function _findContentType(headers) {
			var contentTypeString = '';
			var contentTypeHeader = 'Content-Type';

			Object.keys(headers).forEach(function (key) {
				if (key.toLowerCase() !== 'content-type') {
					return;
				}
				contentTypeHeader = key;
				contentTypeString = headers[key];
			});

			var typeAndParameters = contentTypeString.split(';');
			var contentType = typeAndParameters[0].toLowerCase();
			return {
				name: contentTypeHeader,
				type: contentType
			};
		}
	}], [{
		key: 'METHODS',
		get: function get() {
			return {
				GET: 'GET',
				HEAD: 'HEAD',
				POST: 'POST',
				PUT: 'PUT',
				PATCH: 'PATCH',
				DELETE: 'DELETE',
				OPTIONS: 'OPTIONS',
				TRACE: 'TRACE',
				CONNECT: 'CONNECT'
			};
		}
	}, {
		key: 'TYPES',
		get: function get() {
			return {
				URL_ENCODED: 'application/x-www-form-urlencoded',
				JSON: 'application/json',
				PLAIN_TEXT: 'text/plain',
				HTML: 'text/html'
			};
		}
	}, {
		key: 'CHARSET',
		get: function get() {
			return 'UTF-8';
		}
	}, {
		key: 'DEFAULT_GENERAL_HEADERS',
		get: function get() {
			return {
				Accept: UHRBase.TYPES.JSON + '; q=0.7, ' + UHRBase.TYPES.HTML + '; q=0.2, ' + UHRBase.TYPES.PLAIN_TEXT + '; q=0.1',
				'Accept-Charset': UHRBase.CHARSET + '; q=1'
			};
		}
	}, {
		key: 'CHARSET_PARAMETER',
		get: function get() {
			return '; charset=' + UHRBase.CHARSET;
		}
	}, {
		key: 'URL_ENCODED_ENTITY_CONTENT_TYPE',
		get: function get() {
			return UHRBase.TYPES.URL_ENCODED + UHRBase.CHARSET_PARAMETER;
		}
	}, {
		key: 'JSON_ENTITY_CONTENT_TYPE',
		get: function get() {
			return UHRBase.TYPES.JSON + UHRBase.CHARSET_PARAMETER;
		}
	}, {
		key: 'PLAIN_TEXT_ENTITY_CONTENT_TYPE',
		get: function get() {
			return UHRBase.TYPES.PLAIN_TEXT + UHRBase.CHARSET_PARAMETER;
		}
	}]);

	return UHRBase;
}();

module.exports = UHRBase;

},{"catberry-uri":60}],60:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"./lib/Authority":61,"./lib/Query":62,"./lib/URI":63,"./lib/UserInfo":64,"dup":31}],61:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"./UserInfo":64,"./percentEncodingHelper":65,"dup":32}],62:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"./percentEncodingHelper":65,"dup":33}],63:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"./Authority":61,"./Query":62,"./percentEncodingHelper":65,"dup":34}],64:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"./percentEncodingHelper":65,"dup":35}],65:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],66:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],67:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var pug_has_own_property = Object.prototype.hasOwnProperty;

exports.merge = pug_merge;
function pug_merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = pug_merge(attrs, a[i]);
    }
    return attrs;
  }

  for (var key in b) {
    if (key === 'class') {
      var valA = a[key] || [];
      a[key] = (Array.isArray(valA) ? valA : [valA]).concat(b[key] || []);
    } else if (key === 'style') {
      var valA = pug_style(a[key]);
      var valB = pug_style(b[key]);
      a[key] = valA + valB;
    } else {
      a[key] = b[key];
    }
  }

  return a;
};

exports.classes = pug_classes;
function pug_classes_array(val, escaping) {
  var classString = '',
      className,
      padding = '',
      escapeEnabled = Array.isArray(escaping);
  for (var i = 0; i < val.length; i++) {
    className = pug_classes(val[i]);
    if (!className) continue;
    escapeEnabled && escaping[i] && (className = pug_escape(className));
    classString = classString + padding + className;
    padding = ' ';
  }
  return classString;
}
function pug_classes_object(val) {
  var classString = '',
      padding = '';
  for (var key in val) {
    if (key && val[key] && pug_has_own_property.call(val, key)) {
      classString = classString + padding + key;
      padding = ' ';
    }
  }
  return classString;
}
function pug_classes(val, escaping) {
  if (Array.isArray(val)) {
    return pug_classes_array(val, escaping);
  } else if (val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
    return pug_classes_object(val);
  } else {
    return val || '';
  }
}

exports.style = pug_style;
function pug_style(val) {
  if (!val) return '';
  if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
    var out = '';
    for (var style in val) {
      if (pug_has_own_property.call(val, style)) {
        out = out + style + ':' + val[style] + ';';
      }
    }
    return out;
  } else {
    val += '';
    if (val[val.length - 1] !== ';') return val + ';';
    return val;
  }
};

exports.attr = pug_attr;
function pug_attr(key, val, escaped, terse) {
  if (val === false || val == null || !val && (key === 'class' || key === 'style')) {
    return '';
  }
  if (val === true) {
    return ' ' + (terse ? key : key + '="' + key + '"');
  }
  if (typeof val.toJSON === 'function') {
    val = val.toJSON();
  }
  if (typeof val !== 'string') {
    val = JSON.stringify(val);
    if (!escaped && val.indexOf('"') !== -1) {
      return ' ' + key + '=\'' + val.replace(/'/g, '&#39;') + '\'';
    }
  }
  if (escaped) val = pug_escape(val);
  return ' ' + key + '="' + val + '"';
};

exports.attrs = pug_attrs;
function pug_attrs(obj, terse) {
  var attrs = '';

  for (var key in obj) {
    if (pug_has_own_property.call(obj, key)) {
      var val = obj[key];

      if ('class' === key) {
        val = pug_classes(val);
        attrs = pug_attr(key, val, false, terse) + attrs;
        continue;
      }
      if ('style' === key) {
        val = pug_style(val);
      }
      attrs += pug_attr(key, val, false, terse);
    }
  }

  return attrs;
};

var pug_match_html = /["&<>]/;
exports.escape = pug_escape;
function pug_escape(_html) {
  var html = '' + _html;
  var regexResult = pug_match_html.exec(html);
  if (!regexResult) return _html;

  var result = '';
  var i, lastIndex, escape;
  for (i = regexResult.index, lastIndex = 0; i < html.length; i++) {
    switch (html.charCodeAt(i)) {
      case 34:
        escape = '&quot;';break;
      case 38:
        escape = '&amp;';break;
      case 60:
        escape = '&lt;';break;
      case 62:
        escape = '&gt;';break;
      default:
        continue;
    }
    if (lastIndex !== i) result += html.substring(lastIndex, i);
    lastIndex = i + 1;
    result += escape;
  }
  if (lastIndex !== i) return result + html.substring(lastIndex, i);else return result;
};

exports.rethrow = pug_rethrow;
function pug_rethrow(err, filename, lineno, str) {
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || require('fs').readFileSync(filename, 'utf8');
  } catch (ex) {
    pug_rethrow(err, null, lineno);
  }
  var context = 3,
      lines = str.split('\n'),
      start = Math.max(lineno - context, 0),
      end = Math.min(lines.length, lineno + context);

  var context = lines.slice(start, end).map(function (line, i) {
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ') + curr + '| ' + line;
  }).join('\n');

  err.path = filename;
  err.message = (filename || 'Pug') + ':' + lineno + '\n' + context + '\n\n' + err.message;
  throw err;
};

},{"fs":29}],68:[function(require,module,exports){
'use strict';

var runtime = require('./');

module.exports = wrap;
function wrap(template, templateName) {
  templateName = templateName || 'template';
  return Function('pug', template + '\n' + 'return ' + templateName + ';')(runtime);
}

},{"./":67}],"catberry-logger":[function(require,module,exports){
'use strict';

var Logger = require('./lib/Logger');

module.exports = {
	register: function register(locator) {
		var logger = new Logger(locator);
		locator.registerInstance('logger', logger);
	},

	Logger: Logger
};

},{"./lib/Logger":54}],"catberry-pug":[function(require,module,exports){
'use strict';

var Pug = require('./lib/pug.js');
var TemplateProvider = require('./lib/TemplateProvider');

module.exports = {
	register: function register(locator) {
		locator.registerInstance('pug', Pug);
		locator.register('templateProvider', TemplateProvider, true);
	},

	Pug: Pug,
	TemplateProvider: TemplateProvider
};

},{"./lib/TemplateProvider":56,"./lib/pug.js":57}],"catberry-uhr":[function(require,module,exports){
'use strict';

var UHR = require('./lib/UHR');

module.exports = {
	register: function register(locator) {
		locator.register('uhr', UHR, true);
	},
	UHR: UHR
};

},{"./lib/UHR":58}],"catberry":[function(require,module,exports){
'use strict';

module.exports = require('./lib/Bootstrapper');

},{"./lib/Bootstrapper":1}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9TaXRlcy9jYXRiZXJyeS9icm93c2VyL0Jvb3RzdHJhcHBlci5qcyIsIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L2Jyb3dzZXIvQ2F0YmVycnkuanMiLCIuLi8uLi9TaXRlcy9jYXRiZXJyeS9icm93c2VyL0Nvb2tpZVdyYXBwZXIuanMiLCIuLi8uLi9TaXRlcy9jYXRiZXJyeS9icm93c2VyL0RvY3VtZW50UmVuZGVyZXIuanMiLCIuLi8uLi9TaXRlcy9jYXRiZXJyeS9icm93c2VyL1JlcXVlc3RSb3V0ZXIuanMiLCIuLi8uLi9TaXRlcy9jYXRiZXJyeS9icm93c2VyL2hlbHBlcnMvaHJUaW1lSGVscGVyLmpzIiwiLi4vLi4vU2l0ZXMvY2F0YmVycnkvYnJvd3Nlci9sb2FkZXJzL0NvbXBvbmVudExvYWRlci5qcyIsIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L2Jyb3dzZXIvbG9hZGVycy9TdG9yZUxvYWRlci5qcyIsIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L2Jyb3dzZXIvcHJvdmlkZXJzL01vZHVsZUFwaVByb3ZpZGVyLmpzIiwiLi4vLi4vU2l0ZXMvY2F0YmVycnkvYnJvd3Nlci9wcm92aWRlcnMvU3RhdGVQcm92aWRlci5qcyIsIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L2xpYi9Db250ZXh0RmFjdG9yeS5qcyIsIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L2xpYi9TZXJpYWxXcmFwcGVyLmpzIiwiLi4vLi4vU2l0ZXMvY2F0YmVycnkvbGliL1N0b3JlRGlzcGF0Y2hlci5qcyIsIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L2xpYi9iYXNlL0Jvb3RzdHJhcHBlckJhc2UuanMiLCIuLi8uLi9TaXRlcy9jYXRiZXJyeS9saWIvYmFzZS9DYXRiZXJyeUJhc2UuanMiLCIuLi8uLi9TaXRlcy9jYXRiZXJyeS9saWIvYmFzZS9Db29raWVXcmFwcGVyQmFzZS5qcyIsIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L2xpYi9iYXNlL0RvY3VtZW50UmVuZGVyZXJCYXNlLmpzIiwiLi4vLi4vU2l0ZXMvY2F0YmVycnkvbGliL2Jhc2UvTG9hZGVyQmFzZS5qcyIsIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L2xpYi9iYXNlL01vZHVsZUFwaVByb3ZpZGVyQmFzZS5qcyIsIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L2xpYi9iYXNlL1N0YXRlUHJvdmlkZXJCYXNlLmpzIiwiLi4vLi4vU2l0ZXMvY2F0YmVycnkvbGliL2hlbHBlcnMvZXJyb3JIZWxwZXIuanMiLCIuLi8uLi9TaXRlcy9jYXRiZXJyeS9saWIvaGVscGVycy9tb2R1bGVIZWxwZXIuanMiLCIuLi8uLi9TaXRlcy9jYXRiZXJyeS9saWIvaGVscGVycy9wcm9wZXJ0eUhlbHBlci5qcyIsIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L2xpYi9oZWxwZXJzL3RlbXBsYXRlSGVscGVyLmpzIiwiLi4vLi4vU2l0ZXMvY2F0YmVycnkvbGliL2hlbHBlcnMvdXJpSGVscGVyLmpzIiwiLi4vLi4vU2l0ZXMvY2F0YmVycnkvbm9kZV9tb2R1bGVzL2FzYXAvYnJvd3Nlci1hc2FwLmpzIiwiLi4vLi4vU2l0ZXMvY2F0YmVycnkvbm9kZV9tb2R1bGVzL2FzYXAvYnJvd3Nlci1yYXcuanMiLCIuLi8uLi9TaXRlcy9jYXRiZXJyeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wcm9jZXNzLWhydGltZS9pbmRleC5qcyIsIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L25vZGVfbW9kdWxlcy9icm93c2VyLXJlc29sdmUvZW1wdHkuanMiLCIuLi8uLi9TaXRlcy9jYXRiZXJyeS9ub2RlX21vZHVsZXMvY2F0YmVycnktbG9jYXRvci9saWIvU2VydmljZUxvY2F0b3IuanMiLCIuLi8uLi9TaXRlcy9jYXRiZXJyeS9ub2RlX21vZHVsZXMvY2F0YmVycnktdXJpL2luZGV4LmpzIiwiLi4vLi4vU2l0ZXMvY2F0YmVycnkvbm9kZV9tb2R1bGVzL2NhdGJlcnJ5LXVyaS9saWIvQXV0aG9yaXR5LmpzIiwiLi4vLi4vU2l0ZXMvY2F0YmVycnkvbm9kZV9tb2R1bGVzL2NhdGJlcnJ5LXVyaS9saWIvUXVlcnkuanMiLCIuLi8uLi9TaXRlcy9jYXRiZXJyeS9ub2RlX21vZHVsZXMvY2F0YmVycnktdXJpL2xpYi9VUkkuanMiLCIuLi8uLi9TaXRlcy9jYXRiZXJyeS9ub2RlX21vZHVsZXMvY2F0YmVycnktdXJpL2xpYi9Vc2VySW5mby5qcyIsIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L25vZGVfbW9kdWxlcy9jYXRiZXJyeS11cmkvbGliL3BlcmNlbnRFbmNvZGluZ0hlbHBlci5qcyIsIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwiLi4vLi4vU2l0ZXMvY2F0YmVycnkvbm9kZV9tb2R1bGVzL21vcnBoZG9tL3NyYy9pbmRleC5qcyIsIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L25vZGVfbW9kdWxlcy9wcmV0dHktaHJ0aW1lL2luZGV4LmpzIiwiLi4vLi4vU2l0ZXMvY2F0YmVycnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L25vZGVfbW9kdWxlcy9wcm9taXNlL2luZGV4LmpzIiwiLi4vLi4vU2l0ZXMvY2F0YmVycnkvbm9kZV9tb2R1bGVzL3Byb21pc2UvbGliL2NvcmUuanMiLCIuLi8uLi9TaXRlcy9jYXRiZXJyeS9ub2RlX21vZHVsZXMvcHJvbWlzZS9saWIvZG9uZS5qcyIsIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L25vZGVfbW9kdWxlcy9wcm9taXNlL2xpYi9lczYtZXh0ZW5zaW9ucy5qcyIsIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L25vZGVfbW9kdWxlcy9wcm9taXNlL2xpYi9maW5hbGx5LmpzIiwiLi4vLi4vU2l0ZXMvY2F0YmVycnkvbm9kZV9tb2R1bGVzL3Byb21pc2UvbGliL2luZGV4LmpzIiwiLi4vLi4vU2l0ZXMvY2F0YmVycnkvbm9kZV9tb2R1bGVzL3Byb21pc2UvbGliL25vZGUtZXh0ZW5zaW9ucy5qcyIsIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L25vZGVfbW9kdWxlcy9wcm9taXNlL2xpYi9zeW5jaHJvbm91cy5qcyIsIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L25vZGVfbW9kdWxlcy91dWlkL2luZGV4LmpzIiwiLi4vLi4vU2l0ZXMvY2F0YmVycnkvbm9kZV9tb2R1bGVzL3V1aWQvbGliL2J5dGVzVG9VdWlkLmpzIiwiLi4vLi4vU2l0ZXMvY2F0YmVycnkvbm9kZV9tb2R1bGVzL3V1aWQvbGliL3JuZy1icm93c2VyLmpzIiwiLi4vLi4vU2l0ZXMvY2F0YmVycnkvbm9kZV9tb2R1bGVzL3V1aWQvdjEuanMiLCIuLi8uLi9TaXRlcy9jYXRiZXJyeS9ub2RlX21vZHVsZXMvdXVpZC92NC5qcyIsIm5vZGVfbW9kdWxlcy9jYXRiZXJyeS1sb2dnZXIvYnJvd3Nlci9Mb2dnZXIuanMiLCJub2RlX21vZHVsZXMvY2F0YmVycnktbG9nZ2VyL2xpYi9Mb2dnZXJCYXNlLmpzIiwibm9kZV9tb2R1bGVzL2NhdGJlcnJ5LXB1Zy9icm93c2VyL1RlbXBsYXRlUHJvdmlkZXIuanMiLCJub2RlX21vZHVsZXMvY2F0YmVycnktcHVnL2Jyb3dzZXIvcHVnLmpzIiwibm9kZV9tb2R1bGVzL2NhdGJlcnJ5LXVoci9icm93c2VyL1VIUi5qcyIsIm5vZGVfbW9kdWxlcy9jYXRiZXJyeS11aHIvbGliL1VIUkJhc2UuanMiLCJub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvd3JhcC5qcyIsImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7Ozs7OztBQUVBLElBQU0sV0FBVyxRQUFRLGVBQVIsQ0FBakI7QUFDQSxJQUFNLG1CQUFtQixRQUFRLDhCQUFSLENBQXpCO0FBQ0EsSUFBTSxrQkFBa0IsUUFBUSx3QkFBUixDQUF4QjtBQUNBLElBQU0sb0JBQW9CLFFBQVEsK0JBQVIsQ0FBMUI7QUFDQSxJQUFNLGdCQUFnQixRQUFR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U0FBUyxLQUFULEVBQ0wsV0FBVyxJQUFYLEdBQ0EsU0FEQSxHQUNZLFlBRFosR0FDMkIsR0FGdEIsRUFHTCxPQUhLLENBQVA7QUFJRDs7O0FDVEQ7O0FBRUEsSUFBTSxTQUFTLFFBQVEsY0FBUixDQUFmOztBQUVBLE9BQU8sT0FBUCxHQUFpQjtBQUNoQixTQURnQixvQkFDUCxPQURPLEVBQ0U7QUFDakIsTUFBTSxTQUFTLElBQUksTUFBSixDQUFXLE9BQVgsQ0FBZjtBQUNBLFVBQVEsZ0JBQVIsQ0FBeUIsUUFBekIsRUFBbUMsTUFBbkM7QUFDQSxFQUplOztBQUtoQjtBQUxnQixDQUFqQjs7O0FBSkE7O0FBRUEsSUFBTSxNQUFNLFFBQVEsY0FBUixDQUFaO0FBQ0EsSUFBTSxtQkFBbUIsUUFBUSx3QkFBUixDQUF6Qjs7QUFFQSxPQUFPLE9BQVAsR0FBaUI7QUFDaEIsU0FEZ0Isb0JBQ1AsT0FETyxFQUNFO0FBQ2pCLFVBQVEsZ0JBQVIsQ0FBeUIsS0FBekIsRUFBZ0MsR0FBaEM7QUFDQSxVQUFRLFFBQVIsQ0FBaUIsa0JBQWpCLEVBQXFDLGdCQUFyQyxFQUF1RCxJQUF2RDtBQUNBLEVBSmU7O0FBS2hCLFNBTGdCO0FBTWhCO0FBTmdCLENBQWpCOzs7QUFMQTs7QUFFQSxJQUFNLE1BQU0sUUFBUSxXQUFSLENBQVo7O0FBRUEsT0FBTyxPQUFQLEdBQWlCO0FBTWhCLFdBQVUsMkJBQVc7QUFDcEIsVUFBUSxRQUFSLENBQWlCLEtBQWpCLEVBQXdCLEdBQXhCLEVBQTZCLElBQTdCO0FBQ0EsRUFSZTtBQVNoQjtBQVRnQixDQUFqQjs7O0FBSkE7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFFBQVEsb0JBQVIsQ0FBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBDYXRiZXJyeSA9IHJlcXVpcmUoJy4vQ2F0YmVycnkuanMnKTtcbmNvbnN0IEJvb3RzdHJhcHBlckJhc2UgPSByZXF1aXJlKCcuLi9saWIvYmFzZS9Cb290c3RyYXBwZXJCYXNlJyk7XG5jb25zdCBTdG9yZURpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9saWIvU3RvcmVEaXNwYXRjaGVyJyk7XG5jb25zdCBNb2R1bGVBcGlQcm92aWRlciA9IHJlcXVpcmUoJy4vcHJvdmlkZXJzL01vZHVsZUFwaVByb3ZpZGVyJyk7XG5jb25zdCBDb29raWVXcmFwcGVyID0gcmVxdWlyZSgnLi9Db29raWVXcmFwcGVyJyk7XG5cbmNsYXNzIEJvb3RzdHJhcHBlciBleHRlbmRzIEJvb3RzdHJhcHBlckJhc2Uge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBicm93c2VyIENhdGJlcnJ5J3MgYm9vdHN0cmFwcGVyLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoQ2F0YmVycnkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbmZpZ3VyZXMgYSBDYXRiZXJyeSdzIHNlcnZpY2UgbG9jYXRvci5cblx0ICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ09iamVjdCBUaGUgYXBwbGljYXRpb24gY29uZmlnIG9iamVjdC5cblx0ICogQHBhcmFtIHtTZXJ2aWNlTG9jYXRvcn0gbG9jYXRvciBUaGUgc2VydmljZSBsb2NhdG9yIHRvIGNvbmZpZ3VyZS5cblx0ICovXG5cdGNvbmZpZ3VyZShjb25maWdPYmplY3QsIGxvY2F0b3IpIHtcblx0XHRzdXBlci5jb25maWd1cmUoY29uZmlnT2JqZWN0LCBsb2NhdG9yKTtcblxuXHRcdGxvY2F0b3IucmVnaXN0ZXIoJ3N0b3JlRGlzcGF0Y2hlcicsIFN0b3JlRGlzcGF0Y2hlciwgdHJ1ZSk7XG5cdFx0bG9jYXRvci5yZWdpc3RlcignbW9kdWxlQXBpUHJvdmlkZXInLCBNb2R1bGVBcGlQcm92aWRlciwgdHJ1ZSk7XG5cdFx0bG9jYXRvci5yZWdpc3RlcignY29va2llV3JhcHBlcicsIENvb2tpZVdyYXBwZXIsIHRydWUpO1xuXG5cdFx0bG9jYXRvci5yZWdpc3Rlckluc3RhbmNlKCd3aW5kb3cnLCB3aW5kb3cpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEJvb3RzdHJhcHBlcigpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBDYXRiZXJyeUJhc2UgPSByZXF1aXJlKCcuLi9saWIvYmFzZS9DYXRiZXJyeUJhc2UnKTtcblxuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ3Byb21pc2UnKTtcbi8vIGlmIGJyb3dzZXIgc3RpbGwgZG9lcyBub3QgaGF2ZSBwcm9taXNlcyB0aGVuIGFkZCBpdC5cbmlmICghKCdQcm9taXNlJyBpbiB3aW5kb3cpKSB7XG5cdHdpbmRvdy5Qcm9taXNlID0gUHJvbWlzZTtcbn1cblxuY2xhc3MgQ2F0YmVycnkgZXh0ZW5kcyBDYXRiZXJyeUJhc2Uge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIG5ldyBpbnN0YW5jZSBvZiB0aGUgYnJvd3NlciB2ZXJzaW9uIG9mIENhdGJlcnJ5LlxuXHQgKi9cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgcmVxdWVzdCByb3V0ZXIuXG5cdFx0ICogQHR5cGUge1JlcXVlc3RSb3V0ZXJ9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9yb3V0ZXIgPSBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdyYXBzIGN1cnJlbnQgSFRNTCBkb2N1bWVudCB3aXRoIENhdGJlcnJ5IGV2ZW50IGhhbmRsZXJzLlxuXHQgKi9cblx0d3JhcERvY3VtZW50KCkge1xuXHRcdGNvbnN0IGFwcERlZmluaXRpb25zID0gcmVxdWlyZSgnYXBwRGVmaW5pdGlvbnMnKTtcblx0XHRhcHBEZWZpbml0aW9ucy5yb3V0ZURlZmluaXRpb25zXG5cdFx0XHQuZm9yRWFjaChyb3V0ZURlZmluaXRpb24gPT4gdGhpcy5sb2NhdG9yLnJlZ2lzdGVySW5zdGFuY2UoJ3JvdXRlRGVmaW5pdGlvbicsIHJvdXRlRGVmaW5pdGlvbikpO1xuXG5cdFx0YXBwRGVmaW5pdGlvbnMucm91dGVEZXNjcmlwdG9yc1xuXHRcdFx0LmZvckVhY2gocm91dGVEZXNjcmlwdG9yID0+IHRoaXMubG9jYXRvci5yZWdpc3Rlckluc3RhbmNlKCdyb3V0ZURlc2NyaXB0b3InLCByb3V0ZURlc2NyaXB0b3IpKTtcblxuXHRcdGFwcERlZmluaXRpb25zLnN0b3Jlc1xuXHRcdFx0LmZvckVhY2goc3RvcmUgPT4gdGhpcy5sb2NhdG9yLnJlZ2lzdGVySW5zdGFuY2UoJ3N0b3JlJywgc3RvcmUpKTtcblxuXHRcdGFwcERlZmluaXRpb25zLmNvbXBvbmVudHNcblx0XHRcdC5mb3JFYWNoKGNvbXBvbmVudCA9PiB0aGlzLmxvY2F0b3IucmVnaXN0ZXJJbnN0YW5jZSgnY29tcG9uZW50JywgY29tcG9uZW50KSk7XG5cblx0XHR0aGlzLl9yb3V0ZXIgPSB0aGlzLmxvY2F0b3IucmVzb2x2ZSgncmVxdWVzdFJvdXRlcicpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFN0YXJ0cyBDYXRiZXJyeSBhcHBsaWNhdGlvbiB3aGVuIERPTSBpcyByZWFkeS5cblx0ICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgZm9yIG5vdGhpbmcuXG5cdCAqL1xuXHRzdGFydFdoZW5SZWFkeSgpIHtcblx0XHRpZiAod2luZG93LmNhdGJlcnJ5KSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcblx0XHRcdHdpbmRvdy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHRoaXMud3JhcERvY3VtZW50KCk7XG5cdFx0XHRcdFx0d2luZG93LmNhdGJlcnJ5ID0gdGhpcztcblx0XHRcdFx0XHRmdWxmaWxsKCk7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRyZWplY3QoZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2F0YmVycnk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IENvb2tpZVdyYXBwZXJCYXNlID0gcmVxdWlyZSgnLi4vbGliL2Jhc2UvQ29va2llV3JhcHBlckJhc2UnKTtcblxuY2xhc3MgQ29va2llV3JhcHBlciBleHRlbmRzIENvb2tpZVdyYXBwZXJCYXNlIHtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgYnJvd3NlciBjb29raWUgd3JhcHBlci5cblx0ICogQHBhcmFtIHtTZXJ2aWNlTG9jYXRvcn0gbG9jYXRvciBUaGUgc2VydmljZSBsb2NhdG9yIGZvciByZXNvbHZpbmcgZGVwZW5kZW5jaWVzLlxuXHQgKi9cblx0Y29uc3RydWN0b3IobG9jYXRvcikge1xuXHRcdHN1cGVyKCk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IGJyb3dzZXIgd2luZG93LlxuXHRcdCAqIEB0eXBlIHtXaW5kb3d9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl93aW5kb3cgPSBsb2NhdG9yLnJlc29sdmUoJ3dpbmRvdycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgY3VycmVudCBjb29raWUgc3RyaW5nLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBDb29raWUgc3RyaW5nLlxuXHQgKi9cblx0Z2V0Q29va2llU3RyaW5nKCkge1xuXHRcdHJldHVybiB0aGlzLl93aW5kb3cuZG9jdW1lbnQuY29va2llID9cblx0XHRcdHRoaXMuX3dpbmRvdy5kb2N1bWVudC5jb29raWUudG9TdHJpbmcoKSA6XG5cdFx0XHQnJztcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIGNvb2tpZSB0byB0aGlzIHdyYXBwZXIuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb29raWVTZXR1cCBDb29raWUgc2V0dXAgb2JqZWN0LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gY29va2llU2V0dXAua2V5IENvb2tpZSBrZXkuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjb29raWVTZXR1cC52YWx1ZSBDb29raWUgdmFsdWUuXG5cdCAqIEBwYXJhbSB7bnVtYmVyP30gY29va2llU2V0dXAubWF4QWdlIE1heCBjb29raWUgYWdlIGluIHNlY29uZHMuXG5cdCAqIEBwYXJhbSB7RGF0ZT99IGNvb2tpZVNldHVwLmV4cGlyZXMgRXhwaXJlIGRhdGUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nP30gY29va2llU2V0dXAucGF0aCBVUkkgcGF0aCBmb3IgY29va2llLlxuXHQgKiBAcGFyYW0ge3N0cmluZz99IGNvb2tpZVNldHVwLmRvbWFpbiBDb29raWUgZG9tYWluLlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW4/fSBjb29raWVTZXR1cC5zZWN1cmUgSXMgY29va2llIHNlY3VyZWQuXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbj99IGNvb2tpZVNldHVwLmh0dHBPbmx5IElzIGNvb2tpZSBIVFRQIG9ubHkuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IENvb2tpZSBzZXR1cCBzdHJpbmcuXG5cdCAqL1xuXHRzZXQoY29va2llU2V0dXApIHtcblx0XHRjb25zdCBjb29raWUgPSB0aGlzLl9jb252ZXJ0VG9Db29raWVTZXR1cChjb29raWVTZXR1cCk7XG5cdFx0dGhpcy5fd2luZG93LmRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZTtcblx0XHRyZXR1cm4gY29va2llO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29va2llV3JhcHBlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgbW9ycGhkb20gPSByZXF1aXJlKCdtb3JwaGRvbScpO1xuY29uc3QgdXVpZCA9IHJlcXVpcmUoJ3V1aWQnKTtcbmNvbnN0IGVycm9ySGVscGVyID0gcmVxdWlyZSgnLi4vbGliL2hlbHBlcnMvZXJyb3JIZWxwZXInKTtcbmNvbnN0IG1vZHVsZUhlbHBlciA9IHJlcXVpcmUoJy4uL2xpYi9oZWxwZXJzL21vZHVsZUhlbHBlcicpO1xuY29uc3QgaHJUaW1lSGVscGVyID0gcmVxdWlyZSgnLi4vbGliL2hlbHBlcnMvaHJUaW1lSGVscGVyJyk7XG5jb25zdCBEb2N1bWVudFJlbmRlcmVyQmFzZSA9IHJlcXVpcmUoJy4uL2xpYi9iYXNlL0RvY3VtZW50UmVuZGVyZXJCYXNlJyk7XG5cbmNvbnN0IFNQRUNJQUxfSURTID0ge1xuXHQkJGhlYWQ6ICckJGhlYWQnLFxuXHQkJGRvY3VtZW50OiAnJCRkb2N1bWVudCdcbn07XG5jb25zdCBUQUdfTkFNRVMgPSB7XG5cdEhFQUQ6ICdIRUFEJyxcblx0U1RZTEU6ICdTVFlMRScsXG5cdFNDUklQVDogJ1NDUklQVCcsXG5cdExJTks6ICdMSU5LJ1xufTtcblxuLy8gaHR0cDovL3d3dy53My5vcmcvVFIvMjAxNS9XRC11aWV2ZW50cy0yMDE1MDMxOS8jZXZlbnQtdHlwZXMtbGlzdFxuY29uc3QgTk9OX0JVQkJMSU5HX0VWRU5UUyA9IHtcblx0YWJvcnQ6IHRydWUsXG5cdGJsdXI6IHRydWUsXG5cdGVycm9yOiB0cnVlLFxuXHRmb2N1czogdHJ1ZSxcblx0bG9hZDogdHJ1ZSxcblx0bW91c2VlbnRlcjogdHJ1ZSxcblx0bW91c2VsZWF2ZTogdHJ1ZSxcblx0cmVzaXplOiB0cnVlLFxuXHR1bmxvYWQ6IHRydWVcbn07XG5cbmNsYXNzIERvY3VtZW50UmVuZGVyZXIgZXh0ZW5kcyBEb2N1bWVudFJlbmRlcmVyQmFzZSB7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIGRvY3VtZW50IHJlbmRlcmVyLlxuXHQgKiBAcGFyYW0ge1NlcnZpY2VMb2NhdG9yfSBsb2NhdG9yIExvY2F0b3IgZm9yIHJlc29sdmluZyBkZXBlbmRlbmNpZXMuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihsb2NhdG9yKSB7XG5cdFx0c3VwZXIobG9jYXRvcik7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHNldCBvZiBjb21wb25lbnQgaW5zdGFuY2VzIGJ5IHVuaXF1ZSBrZXlzLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9jb21wb25lbnRJbnN0YW5jZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBzZXQgb2YgY29tcG9uZW50IGVsZW1lbnRzIGJ5IHVuaXF1ZSBrZXlzLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9jb21wb25lbnRFbGVtZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHNldCBvZiBjb21wb25lbnQgYmluZGluZ3MgYnkgdW5pcXVlIGtleXMuXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX2NvbXBvbmVudEJpbmRpbmdzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgc2V0IG9mIGNoYW5nZWQgc3RvcmVzLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9jdXJyZW50Q2hhbmdlZFN0b3JlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IGJyb3dzZXIncyB3aW5kb3cuXG5cdFx0ICovXG5cdFx0dGhpcy5fd2luZG93ID0gbG9jYXRvci5yZXNvbHZlKCd3aW5kb3cnKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgYXBwbGljYXRpb24gY29uZmlnLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9jb25maWcgPSBsb2NhdG9yLnJlc29sdmUoJ2NvbmZpZycpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBzdG9yZSBkaXNwYXRjaGVyLlxuXHRcdCAqIEB0eXBlIHtTdG9yZURpc3BhdGNoZXJ9XG5cdFx0ICogQHByb3RlY3RlZFxuXHRcdCAqL1xuXHRcdHRoaXMuX3N0b3JlRGlzcGF0Y2hlciA9IGxvY2F0b3IucmVzb2x2ZSgnc3RvcmVEaXNwYXRjaGVyJyk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHByb21pc2UgZm9yIHJlbmRlcmVkIHBhZ2UuXG5cdFx0ICogQHR5cGUge1Byb21pc2V9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9yZW5kZXJlZFByb21pc2UgPSBudWxsO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBzdGF0ZSBvZiB1cGRhdGluZyBjb21wb25lbnRzLlxuXHRcdCAqIEB0eXBlIHtib29sZWFufVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5faXNVcGRhdGluZyA9IGZhbHNlO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBhd2FpdGluZyByb3V0aW5nLlxuXHRcdCAqIEB0eXBlIHt7c3RhdGU6IE9iamVjdCwgcm91dGluZ0NvbnRleHQ6IE9iamVjdH19XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9hd2FpdGluZ1JvdXRpbmcgPSBudWxsO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCByb3V0aW5nIGNvbnRleHQuXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX2N1cnJlbnRSb3V0aW5nQ29udGV4dCA9IG51bGw7XG5cblx0XHR0aGlzLl9ldmVudEJ1cy5vbignc3RvcmVDaGFuZ2VkJywgc3RvcmVOYW1lID0+IHtcblx0XHRcdHRoaXMuX2N1cnJlbnRDaGFuZ2VkU3RvcmVzW3N0b3JlTmFtZV0gPSB0cnVlO1xuXHRcdFx0aWYgKHRoaXMuX2lzU3RhdGVDaGFuZ2luZykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl91cGRhdGVTdG9yZUNvbXBvbmVudHMoKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBpbml0aWFsIHN0YXRlIG9mIHRoZSBhcHBsaWNhdGlvbi5cblx0ICogQHBhcmFtIHtPYmplY3R9IHN0YXRlIE5ldyBzdGF0ZSBvZiB0aGUgYXBwbGljYXRpb24uXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSByb3V0aW5nQ29udGV4dCBSb3V0aW5nIGNvbnRleHQuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIGZvciBub3RoaW5nLlxuXHQgKi9cblx0aW5pdFdpdGhTdGF0ZShzdGF0ZSwgcm91dGluZ0NvbnRleHQpIHtcblx0XHRyZXR1cm4gdGhpcy5fZ2V0UHJvbWlzZUZvclJlYWR5U3RhdGUoKVxuXHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9jdXJyZW50Um91dGluZ0NvbnRleHQgPSByb3V0aW5nQ29udGV4dDtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3N0b3JlRGlzcGF0Y2hlci5zZXRTdGF0ZShzdGF0ZSwgcm91dGluZ0NvbnRleHQpO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0Y29uc3QgY29tcG9uZW50cyA9IHRoaXMuX2NvbXBvbmVudExvYWRlci5nZXRDb21wb25lbnRzQnlOYW1lcygpO1xuXHRcdFx0XHRjb25zdCBkb2N1bWVudEVsZW1lbnQgPSB0aGlzLl93aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXHRcdFx0XHRjb25zdCBhY3Rpb24gPSBlbGVtZW50ID0+IHRoaXMuX2luaXRpYWxpemVDb21wb25lbnQoZWxlbWVudCwgY29tcG9uZW50cyk7XG5cdFx0XHRcdHJldHVybiB0aGlzLl90cmF2ZXJzZUNvbXBvbmVudHMoW2RvY3VtZW50RWxlbWVudF0sIGNvbXBvbmVudHMsIGFjdGlvbik7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oKCkgPT4gdGhpcy5fZXZlbnRCdXMuZW1pdChcblx0XHRcdFx0J2RvY3VtZW50UmVuZGVyZWQnLCB0aGlzLl9jdXJyZW50Um91dGluZ0NvbnRleHRcblx0XHRcdCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbmRlcnMgYSBuZXcgc3RhdGUgb2YgdGhlIGFwcGxpY2F0aW9uLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc3RhdGUgTmV3IHN0YXRlIG9mIHRoZSBhcHBsaWNhdGlvbi5cblx0ICogQHBhcmFtIHtPYmplY3R9IHJvdXRpbmdDb250ZXh0IFJvdXRpbmcgY29udGV4dC5cblx0ICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgZm9yIG5vdGhpbmcuXG5cdCAqL1xuXHRyZW5kZXIoc3RhdGUsIHJvdXRpbmdDb250ZXh0KSB7XG5cdFx0dGhpcy5fYXdhaXRpbmdSb3V0aW5nID0ge1xuXHRcdFx0c3RhdGUsXG5cdFx0XHRyb3V0aW5nQ29udGV4dFxuXHRcdH07XG5cdFx0aWYgKHRoaXMuX2lzU3RhdGVDaGFuZ2luZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3JlbmRlcmVkUHJvbWlzZTtcblx0XHR9XG5cblx0XHQvLyB3ZSBzaG91bGQgc2V0IHRoaXMgZmxhZyB0byBhdm9pZCBcInN0b3JlQ2hhbmdlZFwiXG5cdFx0Ly8gZXZlbnQgaGFuZGxpbmcgZm9yIG5vd1xuXHRcdHRoaXMuX2lzU3RhdGVDaGFuZ2luZyA9IHRydWU7XG5cblx0XHR0aGlzLl9yZW5kZXJlZFByb21pc2UgPSB0aGlzLl9nZXRQcm9taXNlRm9yUmVhZHlTdGF0ZSgpXG5cdFx0XHQvLyBhbmQgdGhlbiB3ZSB1cGRhdGUgYWxsIGNvbXBvbmVudHMgb2YgdGhlc2Ugc3RvcmVzIGluIGEgYmF0Y2guXG5cdFx0XHQudGhlbigoKSA9PiB0aGlzLl91cGRhdGVTdG9yZUNvbXBvbmVudHMoKSlcblx0XHRcdC5jYXRjaChyZWFzb24gPT4gdGhpcy5fZXZlbnRCdXMuZW1pdCgnZXJyb3InLCByZWFzb24pKVxuXHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9pc1N0YXRlQ2hhbmdpbmcgPSBmYWxzZTtcblx0XHRcdH0pO1xuXG5cdFx0cmV0dXJuIHRoaXMuX3JlbmRlcmVkUHJvbWlzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZW5kZXJzIGEgY29tcG9uZW50IGludG8gdGhlIEhUTUwgZWxlbWVudC5cblx0ICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IEhUTUwgZWxlbWVudCBvZiB0aGUgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0ge09iamVjdD99IHJlbmRlcmluZ0NvbnRleHQgUmVuZGVyaW5nIGNvbnRleHQgZm9yIGdyb3VwIHJlbmRlcmluZy5cblx0ICovXG5cdHJlbmRlckNvbXBvbmVudChlbGVtZW50LCByZW5kZXJpbmdDb250ZXh0KSB7XG5cdFx0cmV0dXJuIHRoaXMuX2dldFByb21pc2VGb3JSZWFkeVN0YXRlKClcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0Y29uc3QgaWQgPSB0aGlzLl9nZXRJZChlbGVtZW50KTtcblx0XHRcdFx0Y29uc3QgY29tcG9uZW50TmFtZSA9IG1vZHVsZUhlbHBlci5nZXRPcmlnaW5hbENvbXBvbmVudE5hbWUoZWxlbWVudC50YWdOYW1lKTtcblxuXHRcdFx0XHRpZiAoIXJlbmRlcmluZ0NvbnRleHQpIHtcblx0XHRcdFx0XHRyZW5kZXJpbmdDb250ZXh0ID0gdGhpcy5fY3JlYXRlUmVuZGVyaW5nQ29udGV4dChbXSk7XG5cdFx0XHRcdFx0cmVuZGVyaW5nQ29udGV4dC5yb290SWRzW2lkXSA9IHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBoYWRDaGlsZHJlbiA9IChlbGVtZW50LmNoaWxkcmVuLmxlbmd0aCA+IDApO1xuXHRcdFx0XHRjb25zdCBjb21wb25lbnQgPSByZW5kZXJpbmdDb250ZXh0LmNvbXBvbmVudHNbY29tcG9uZW50TmFtZV07XG5cdFx0XHRcdGlmICghY29tcG9uZW50KSB7XG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZW5kZXJpbmdDb250ZXh0LnJlbmRlcmVkSWRzW2lkXSA9IHRydWU7XG5cblx0XHRcdFx0bGV0IGluc3RhbmNlID0gdGhpcy5fY29tcG9uZW50SW5zdGFuY2VzW2lkXTtcblx0XHRcdFx0aWYgKCFpbnN0YW5jZSkge1xuXHRcdFx0XHRcdGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUuJGNvbnRleHQgPSB0aGlzLl9nZXRDb21wb25lbnRDb250ZXh0KGNvbXBvbmVudCwgZWxlbWVudCk7XG5cdFx0XHRcdFx0aW5zdGFuY2UgPSBuZXcgY29tcG9uZW50LmNvbnN0cnVjdG9yKHRoaXMuX3NlcnZpY2VMb2NhdG9yKTtcblx0XHRcdFx0XHRpbnN0YW5jZS4kY29udGV4dCA9IGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUuJGNvbnRleHQ7XG5cdFx0XHRcdFx0dGhpcy5fY29tcG9uZW50SW5zdGFuY2VzW2lkXSA9IGluc3RhbmNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgZXZlbnRBcmdzID0ge1xuXHRcdFx0XHRcdG5hbWU6IGNvbXBvbmVudE5hbWUsXG5cdFx0XHRcdFx0Y29udGV4dDogaW5zdGFuY2UuJGNvbnRleHRcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR0aGlzLl9jb21wb25lbnRFbGVtZW50c1tpZF0gPSBlbGVtZW50O1xuXG5cdFx0XHRcdGNvbnN0IHN0YXJ0VGltZSA9IGhyVGltZUhlbHBlci5nZXQoKTtcblx0XHRcdFx0dGhpcy5fZXZlbnRCdXMuZW1pdCgnY29tcG9uZW50UmVuZGVyJywgZXZlbnRBcmdzKTtcblxuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcblx0XHRcdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0XHQvLyB3ZSBuZWVkIHVuYmluZCB0aGUgd2hvbGUgaGllcmFyY2h5IG9ubHkgYXRcblx0XHRcdFx0XHRcdC8vIHRoZSBiZWdpbm5pbmcgYW5kIG5vdCBmb3IgbmV3IGVsZW1lbnRzXG5cdFx0XHRcdFx0XHRpZiAoIShpZCBpbiByZW5kZXJpbmdDb250ZXh0LnJvb3RJZHMpIHx8ICFoYWRDaGlsZHJlbikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLl91bmJpbmRBbGwoZWxlbWVudCwgcmVuZGVyaW5nQ29udGV4dCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuY2F0Y2gocmVhc29uID0+IHRoaXMuX2V2ZW50QnVzLmVtaXQoJ2Vycm9yJywgcmVhc29uKSlcblx0XHRcdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCByZW5kZXJNZXRob2QgPSBtb2R1bGVIZWxwZXIuZ2V0TWV0aG9kVG9JbnZva2UoaW5zdGFuY2UsICdyZW5kZXInKTtcblx0XHRcdFx0XHRcdHJldHVybiBtb2R1bGVIZWxwZXIuZ2V0U2FmZVByb21pc2UocmVuZGVyTWV0aG9kKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC50aGVuKGRhdGFDb250ZXh0ID0+IGNvbXBvbmVudC50ZW1wbGF0ZS5yZW5kZXIoZGF0YUNvbnRleHQpKVxuXHRcdFx0XHRcdC5jYXRjaChyZWFzb24gPT4gdGhpcy5faGFuZGxlUmVuZGVyRXJyb3IoZWxlbWVudCwgY29tcG9uZW50LCByZWFzb24pKVxuXHRcdFx0XHRcdC50aGVuKGh0bWwgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgaXNIZWFkID0gZWxlbWVudC50YWdOYW1lID09PSBUQUdfTkFNRVMuSEVBRDtcblx0XHRcdFx0XHRcdGlmIChodG1sID09PSAnJyAmJiBpc0hlYWQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjb25zdCB0bXBFbGVtZW50ID0gZWxlbWVudC5jbG9uZU5vZGUoZmFsc2UpO1xuXHRcdFx0XHRcdFx0dG1wRWxlbWVudC5pbm5lckhUTUwgPSBodG1sO1xuXG5cdFx0XHRcdFx0XHRpZiAoaXNIZWFkKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX21lcmdlSGVhZChlbGVtZW50LCB0bXBFbGVtZW50KTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRtb3JwaGRvbShlbGVtZW50LCB0bXBFbGVtZW50LCB7XG5cdFx0XHRcdFx0XHRcdG9uQmVmb3JlRWxDaGlsZHJlblVwZGF0ZWQ6IGZvdW5kRWxlbWVudCA9PlxuXHRcdFx0XHRcdFx0XHRcdGZvdW5kRWxlbWVudCA9PT0gZWxlbWVudCB8fCAhdGhpcy5faXNDb21wb25lbnRFbGVtZW50KFxuXHRcdFx0XHRcdFx0XHRcdFx0cmVuZGVyaW5nQ29udGV4dC5jb21wb25lbnRzLCBmb3VuZEVsZW1lbnRcblx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgcHJvbWlzZXMgPSB0aGlzLl9maW5kTmVzdGVkQ29tcG9uZW50cyhcblx0XHRcdFx0XHRcdFx0ZWxlbWVudCwgcmVuZGVyaW5nQ29udGV4dC5jb21wb25lbnRzXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdC5tYXAoY2hpbGQgPT4gdGhpcy5yZW5kZXJDb21wb25lbnQoY2hpbGQsIHJlbmRlcmluZ0NvbnRleHQpKTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0XHRcdGV2ZW50QXJncy5oclRpbWUgPSBoclRpbWVIZWxwZXIuZ2V0KHN0YXJ0VGltZSk7XG5cdFx0XHRcdFx0XHRldmVudEFyZ3MudGltZSA9IGhyVGltZUhlbHBlci50b01pbGxpc2Vjb25kcyhldmVudEFyZ3MuaHJUaW1lKTtcblx0XHRcdFx0XHRcdHRoaXMuX2V2ZW50QnVzLmVtaXQoJ2NvbXBvbmVudFJlbmRlcmVkJywgZXZlbnRBcmdzKTtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLl9iaW5kQ29tcG9uZW50KGVsZW1lbnQpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdFx0Ly8gY29sbGVjdGluZyBnYXJiYWdlIG9ubHkgd2hlblxuXHRcdFx0XHRcdFx0Ly8gdGhlIGVudGlyZSByZW5kZXJpbmcgaXMgZmluaXNoZWRcblx0XHRcdFx0XHRcdGlmICghKGlkIGluIHJlbmRlcmluZ0NvbnRleHQucm9vdElkcykgfHwgIWhhZENoaWxkcmVuKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRoaXMuX2NvbGxlY3RSZW5kZXJpbmdHYXJiYWdlKHJlbmRlcmluZ0NvbnRleHQpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKHJlYXNvbiA9PiB0aGlzLl9ldmVudEJ1cy5lbWl0KCdlcnJvcicsIHJlYXNvbikpO1xuXHRcdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBhIGNvbXBvbmVudCBpbnN0YW5jZSBieSBJRC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGlkIENvbXBvbmVudCdzIGVsZW1lbnQgSUQuXG5cdCAqIEByZXR1cm5zIHtPYmplY3R8bnVsbH0gQ29tcG9uZW50IGluc3RhbmNlLlxuXHQgKi9cblx0Z2V0Q29tcG9uZW50QnlJZChpZCkge1xuXHRcdGNvbnN0IGVsZW1lbnQgPSB0aGlzLl93aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXHRcdHJldHVybiB0aGlzLmdldENvbXBvbmVudEJ5RWxlbWVudChlbGVtZW50KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEb2VzIHF1ZXJ5IGZvciBhIGNvbXBvbmVudCBieSB0aGUgc2VsZWN0b3IuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciBTZWxlY3RvciBmb3IgdGhlIHF1ZXJ5LlxuXHQgKiBAcGFyYW0ge09iamVjdD99IHBhcmVudENvbXBvbmVudCBQYXJlbnQgY29tcG9uZW50IG9iamVjdC5cblx0ICogQHJldHVybnMge09iamVjdH0gVGhlIGZvdW5kIGNvbXBvbmVudCBvYmplY3QuXG5cdCAqL1xuXHRxdWVyeUNvbXBvbmVudFNlbGVjdG9yKHNlbGVjdG9yLCBwYXJlbnRDb21wb25lbnQpIHtcblx0XHRjb25zdCBwYXJlbnQgPSB0aGlzLl9pc0NvbXBvbmVudE9iamVjdChwYXJlbnRDb21wb25lbnQpID9cblx0XHRcdHBhcmVudENvbXBvbmVudC4kY29udGV4dC5lbGVtZW50IDogdGhpcy5fd2luZG93LmRvY3VtZW50O1xuXHRcdHJldHVybiB0aGlzLmdldENvbXBvbmVudEJ5RWxlbWVudChwYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERvZXMgcXVlcnkgZm9yIGFsbCBjb21wb25lbnRzIGJ5IHRoZSBzZWxlY3Rvci5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIFNlbGVjdG9yIGZvciB0aGUgcXVlcnkuXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gcGFyZW50Q29tcG9uZW50IFBhcmVudCBjb21wb25lbnQgb2JqZWN0LlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBmb3VuZCBjb21wb25lbnQgb2JqZWN0IGxpc3QuXG5cdCAqL1xuXHRxdWVyeUNvbXBvbmVudFNlbGVjdG9yQWxsKHNlbGVjdG9yLCBwYXJlbnRDb21wb25lbnQpIHtcblx0XHRjb25zdCBwYXJlbnQgPSB0aGlzLl9pc0NvbXBvbmVudE9iamVjdChwYXJlbnRDb21wb25lbnQpID9cblx0XHRcdHBhcmVudENvbXBvbmVudC4kY29udGV4dC5lbGVtZW50IDogdGhpcy5fd2luZG93LmRvY3VtZW50O1xuXHRcdHJldHVybiB0aGlzLl9tYXBFbGVtZW50c1RvQ29tcG9uZW50cyhwYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgYWxsIGNvbXBvbmVudHMgYnkgdGhlIHRhZyBuYW1lLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGFnTmFtZSBUYWcgbmFtZSBvZiB0aGUgY29tcG9uZW50cy5cblx0ICogQHBhcmFtIHtPYmplY3Q/fSBwYXJlbnRDb21wb25lbnQgUGFyZW50IGNvbXBvbmVudCBvYmplY3QuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGZvdW5kIGNvbXBvbmVudCBvYmplY3QgbGlzdC5cblx0ICovXG5cdGdldENvbXBvbmVudHNCeVRhZ05hbWUodGFnTmFtZSwgcGFyZW50Q29tcG9uZW50KSB7XG5cdFx0Y29uc3QgcGFyZW50ID0gdGhpcy5faXNDb21wb25lbnRPYmplY3QocGFyZW50Q29tcG9uZW50KSA/XG5cdFx0XHRwYXJlbnRDb21wb25lbnQuJGNvbnRleHQuZWxlbWVudCA6IHRoaXMuX3dpbmRvdy5kb2N1bWVudDtcblx0XHRyZXR1cm4gdGhpcy5fbWFwRWxlbWVudHNUb0NvbXBvbmVudHMocGFyZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHRhZ05hbWUpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGFsbCBjb21wb25lbnRzIGJ5IHRoZSBjbGFzcyBuYW1lLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIENsYXNzIG5hbWUgb2YgdGhlIGNvbXBvbmVudHMuXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gcGFyZW50Q29tcG9uZW50IFBhcmVudCBjb21wb25lbnQgb2JqZWN0LlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBmb3VuZCBjb21wb25lbnQgb2JqZWN0IGxpc3QuXG5cdCAqL1xuXHRnZXRDb21wb25lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lLCBwYXJlbnRDb21wb25lbnQpIHtcblx0XHRjb25zdCBwYXJlbnQgPSB0aGlzLl9pc0NvbXBvbmVudE9iamVjdChwYXJlbnRDb21wb25lbnQpID9cblx0XHRcdHBhcmVudENvbXBvbmVudC4kY29udGV4dC5lbGVtZW50IDogdGhpcy5fd2luZG93LmRvY3VtZW50O1xuXHRcdHJldHVybiB0aGlzLl9tYXBFbGVtZW50c1RvQ29tcG9uZW50cyhwYXJlbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc05hbWUpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGNvbXBvbmVudCBpbnN0YW5jZSBieSBhIERPTSBlbGVtZW50LlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgQ29tcG9uZW50J3MgRWxlbWVudC5cblx0ICogQHJldHVybnMge09iamVjdHxudWxsfSBDb21wb25lbnQgaW5zdGFuY2UuXG5cdCAqL1xuXHRnZXRDb21wb25lbnRCeUVsZW1lbnQoZWxlbWVudCkge1xuXHRcdGlmICghZWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHRcdGNvbnN0IGlkID0gZWxlbWVudFttb2R1bGVIZWxwZXIuQ09NUE9ORU5UX0lEXTtcblx0XHRpZiAoIWlkKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX2NvbXBvbmVudEluc3RhbmNlc1tpZF0gfHwgbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgdGhhdCBldmVyeSBpbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50IGhhcyBhbiBlbGVtZW50IG9uIHRoZSBwYWdlIGFuZFxuXHQgKiByZW1vdmVzIGFsbCByZWZlcmVuY2VzIHRvIHRob3NlIGNvbXBvbmVudHMgd2hpY2ggd2VyZSByZW1vdmVkIGZyb20gRE9NLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSBmb3Igbm90aGluZy5cblx0ICovXG5cdC8qIGVzbGludCBtYXgtbmVzdGVkLWNhbGxiYWNrczogMCAqL1xuXHRjb2xsZWN0R2FyYmFnZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5fZ2V0UHJvbWlzZUZvclJlYWR5U3RhdGUoKVxuXHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRjb25zdCBjb250ZXh0ID0ge1xuXHRcdFx0XHRcdHJvb3RzOiBbXSxcblx0XHRcdFx0XHRjb21wb25lbnRzOiB0aGlzLl9jb21wb25lbnRMb2FkZXIuZ2V0Q29tcG9uZW50c0J5TmFtZXMoKVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdE9iamVjdC5rZXlzKHRoaXMuX2NvbXBvbmVudEVsZW1lbnRzKVxuXHRcdFx0XHRcdC5mb3JFYWNoKGlkID0+IHtcblx0XHRcdFx0XHRcdC8vIHdlIHNob3VsZCBub3QgcmVtb3ZlIHNwZWNpYWwgZWxlbWVudHMgbGlrZSBIRUFEXG5cdFx0XHRcdFx0XHRpZiAoU1BFQ0lBTF9JRFMuaGFzT3duUHJvcGVydHkoaWQpKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0bGV0IGN1cnJlbnQgPSB0aGlzLl9jb21wb25lbnRFbGVtZW50c1tpZF07XG5cdFx0XHRcdFx0XHR3aGlsZSAoY3VycmVudCAhPT0gdGhpcy5fd2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuXHRcdFx0XHRcdFx0XHQvLyB0aGUgY29tcG9uZW50IGlzIHNpdHVhdGVkIGluIGEgZGV0YWNoZWQgRE9NIHN1YnRyZWVcblx0XHRcdFx0XHRcdFx0aWYgKGN1cnJlbnQucGFyZW50RWxlbWVudCA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnRleHQucm9vdHMucHVzaChjdXJyZW50KTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQvLyB0aGUgY29tcG9uZW50IGlzIGFub3RoZXIgY29tcG9uZW50J3MgZGVzY2VuZGFudFxuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy5faXNDb21wb25lbnRFbGVtZW50KGNvbnRleHQuY29tcG9uZW50cywgY3VycmVudC5wYXJlbnRFbGVtZW50KSkge1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudEVsZW1lbnQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuIHRoaXMuX3JlbW92ZURldGFjaGVkQ29tcG9uZW50cyhjb250ZXh0KTtcblx0XHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYW5kIHJlbmRlcnMgYSBjb21wb25lbnQgZWxlbWVudC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHRhZ05hbWUgTmFtZSBvZiB0aGUgSFRNTCB0YWcuXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gYXR0cmlidXRlcyBFbGVtZW50IGF0dHJpYnV0ZXMuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlPEVsZW1lbnQ+fSBQcm9taXNlIGZvciBIVE1MIGVsZW1lbnQgd2l0aCB0aGUgcmVuZGVyZWQgY29tcG9uZW50LlxuXHQgKi9cblx0Y3JlYXRlQ29tcG9uZW50KHRhZ05hbWUsIGF0dHJpYnV0ZXMpIHtcblx0XHRpZiAodHlwZW9mICh0YWdOYW1lKSAhPT0gJ3N0cmluZycpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChcblx0XHRcdFx0bmV3IEVycm9yKCdUaGUgdGFnIG5hbWUgbXVzdCBiZSBhIHN0cmluZycpXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRhdHRyaWJ1dGVzID0gYXR0cmlidXRlcyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdFx0cmV0dXJuIHRoaXMuX2dldFByb21pc2VGb3JSZWFkeVN0YXRlKClcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0Y29uc3QgY29tcG9uZW50cyA9IHRoaXMuX2NvbXBvbmVudExvYWRlci5nZXRDb21wb25lbnRzQnlOYW1lcygpO1xuXHRcdFx0XHRjb25zdCBjb21wb25lbnROYW1lID0gbW9kdWxlSGVscGVyLmdldE9yaWdpbmFsQ29tcG9uZW50TmFtZSh0YWdOYW1lKTtcblxuXHRcdFx0XHRpZiAobW9kdWxlSGVscGVyLmlzSGVhZENvbXBvbmVudChjb21wb25lbnROYW1lKSB8fFxuXHRcdFx0XHRcdG1vZHVsZUhlbHBlci5pc0RvY3VtZW50Q29tcG9uZW50KGNvbXBvbmVudE5hbWUpIHx8XG5cdFx0XHRcdFx0IShjb21wb25lbnROYW1lIGluIGNvbXBvbmVudHMpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihgQ29tcG9uZW50IGZvciB0YWcgXCIke3RhZ05hbWV9XCIgbm90IGZvdW5kYCkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3Qgc2FmZVRhZ05hbWUgPSBtb2R1bGVIZWxwZXIuZ2V0VGFnTmFtZUZvckNvbXBvbmVudE5hbWUoY29tcG9uZW50TmFtZSk7XG5cdFx0XHRcdGNvbnN0IGVsZW1lbnQgPSB0aGlzLl93aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudChzYWZlVGFnTmFtZSk7XG5cdFx0XHRcdE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpXG5cdFx0XHRcdFx0LmZvckVhY2goYXR0cmlidXRlTmFtZSA9PiBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdKSk7XG5cblx0XHRcdFx0cmV0dXJuIHRoaXMucmVuZGVyQ29tcG9uZW50KGVsZW1lbnQpXG5cdFx0XHRcdFx0LnRoZW4oKCkgPT4gZWxlbWVudCk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDbGVhcnMgYWxsIHJlZmVyZW5jZXMgdG8gcmVtb3ZlZCBjb21wb25lbnRzIGR1cmluZyB0aGUgcmVuZGVyaW5nIHByb2Nlc3MuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJpbmdDb250ZXh0IENvbnRleHQgb2YgcmVuZGVyaW5nLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2NvbGxlY3RSZW5kZXJpbmdHYXJiYWdlKHJlbmRlcmluZ0NvbnRleHQpIHtcblx0XHRPYmplY3Qua2V5cyhyZW5kZXJpbmdDb250ZXh0LnVuYm91bmRJZHMpXG5cdFx0XHQuZm9yRWFjaChpZCA9PiB7XG5cdFx0XHRcdC8vIHRoaXMgY29tcG9uZW50IGhhcyBiZWVuIHJlbmRlcmVkIGFnYWluIGFuZCB3ZSBkbyBub3QgbmVlZCB0b1xuXHRcdFx0XHQvLyByZW1vdmUgaXQuXG5cdFx0XHRcdGlmIChpZCBpbiByZW5kZXJpbmdDb250ZXh0LnJlbmRlcmVkSWRzKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5fcmVtb3ZlQ29tcG9uZW50QnlJZChpZCk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZW1vdmVzIGRldGFjaGVkIHN1YnRyZWVzIGZyb20gdGhlIGNvbXBvbmVudHMgc2V0LlxuXHQgKiBAcGFyYW0ge3tyb290czogQXJyYXksIGNvbXBvbmVudHM6IE9iamVjdH19IGNvbnRleHQgT3BlcmF0aW9uIGNvbnRleHQuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIGZvciBmaW5pc2hlZCByZW1vdmFsXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfcmVtb3ZlRGV0YWNoZWRDb21wb25lbnRzKGNvbnRleHQpIHtcblx0XHRpZiAoY29udGV4dC5yb290cy5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHR9XG5cdFx0Y29uc3Qgcm9vdCA9IGNvbnRleHQucm9vdHMucG9wKCk7XG5cdFx0cmV0dXJuIHRoaXMuX3RyYXZlcnNlQ29tcG9uZW50cyhbcm9vdF0sIGNvbnRleHQuY29tcG9uZW50cywgZWxlbWVudCA9PiB0aGlzLl9yZW1vdmVEZXRhY2hlZENvbXBvbmVudChlbGVtZW50KSlcblx0XHRcdC50aGVuKCgpID0+IHRoaXMuX3JlbW92ZURldGFjaGVkQ29tcG9uZW50cyhjb250ZXh0KSk7XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlcyBkZXRhY2hlZCBjb21wb25lbnQuXG5cdCAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IG9mIHRoZSBkZXRhY2hlZCBjb21wb25lbnQuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIGZvciB0aGUgcmVtb3ZlZCBjb21wb25lbnQuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfcmVtb3ZlRGV0YWNoZWRDb21wb25lbnQoZWxlbWVudCkge1xuXHRcdGNvbnN0IGlkID0gdGhpcy5fZ2V0SWQoZWxlbWVudCk7XG5cdFx0cmV0dXJuIHRoaXMuX3VuYmluZENvbXBvbmVudChlbGVtZW50KVxuXHRcdFx0LnRoZW4oKCkgPT4gdGhpcy5fcmVtb3ZlQ29tcG9uZW50QnlJZChpZCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVuYmluZHMgYWxsIGV2ZW50IGhhbmRsZXJzIGZyb20gdGhlIHNwZWNpZmllZCBjb21wb25lbnQgYW5kIGFsbCBpdCdzIGRlc2NlbmRhbnRzLlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgQ29tcG9uZW50IEhUTUwgZWxlbWVudC5cblx0ICogQHBhcmFtIHtPYmplY3R9IHJlbmRlcmluZ0NvbnRleHQgQ29udGV4dCBvZiByZW5kZXJpbmcuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIGZvciBub3RoaW5nLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X3VuYmluZEFsbChlbGVtZW50LCByZW5kZXJpbmdDb250ZXh0KSB7XG5cdFx0Y29uc3QgYWN0aW9uID0gaW5uZXJFbGVtZW50ID0+IHtcblx0XHRcdGNvbnN0IGlkID0gdGhpcy5fZ2V0SWQoaW5uZXJFbGVtZW50KTtcblx0XHRcdHJlbmRlcmluZ0NvbnRleHQudW5ib3VuZElkc1tpZF0gPSB0cnVlO1xuXHRcdFx0cmV0dXJuIHRoaXMuX3VuYmluZENvbXBvbmVudChpbm5lckVsZW1lbnQpO1xuXHRcdH07XG5cdFx0cmV0dXJuIHRoaXMuX3RyYXZlcnNlQ29tcG9uZW50cyhbZWxlbWVudF0sIHJlbmRlcmluZ0NvbnRleHQuY29tcG9uZW50cywgYWN0aW9uKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBVbmJpbmRzIGFsbCBldmVudCBoYW5kbGVycyBmcm9tIHRoZSBzcGVjaWZpZWQgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgQ29tcG9uZW50IEhUTUwgZWxlbWVudC5cblx0ICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgZm9yIG5vdGhpbmcuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfdW5iaW5kQ29tcG9uZW50KGVsZW1lbnQpIHtcblx0XHRjb25zdCBpZCA9IHRoaXMuX2dldElkKGVsZW1lbnQpO1xuXHRcdGNvbnN0IGluc3RhbmNlID0gdGhpcy5fY29tcG9uZW50SW5zdGFuY2VzW2lkXTtcblxuXHRcdGlmICghaW5zdGFuY2UpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHR9XG5cdFx0aWYgKGlkIGluIHRoaXMuX2NvbXBvbmVudEJpbmRpbmdzKSB7XG5cdFx0XHRPYmplY3Qua2V5cyh0aGlzLl9jb21wb25lbnRCaW5kaW5nc1tpZF0pXG5cdFx0XHRcdC5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG5cdFx0XHRcdFx0ZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFxuXHRcdFx0XHRcdFx0ZXZlbnROYW1lLFxuXHRcdFx0XHRcdFx0dGhpcy5fY29tcG9uZW50QmluZGluZ3NbaWRdW2V2ZW50TmFtZV0uaGFuZGxlcixcblx0XHRcdFx0XHRcdE5PTl9CVUJCTElOR19FVkVOVFMuaGFzT3duUHJvcGVydHkoZXZlbnROYW1lKVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0ZGVsZXRlIHRoaXMuX2NvbXBvbmVudEJpbmRpbmdzW2lkXTtcblx0XHR9XG5cblx0XHRjb25zdCB1bmJpbmRNZXRob2QgPSBtb2R1bGVIZWxwZXIuZ2V0TWV0aG9kVG9JbnZva2UoaW5zdGFuY2UsICd1bmJpbmQnKTtcblx0XHRyZXR1cm4gbW9kdWxlSGVscGVyLmdldFNhZmVQcm9taXNlKHVuYmluZE1ldGhvZClcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0dGhpcy5fZXZlbnRCdXMuZW1pdCgnY29tcG9uZW50VW5ib3VuZCcsIHtcblx0XHRcdFx0XHRlbGVtZW50LFxuXHRcdFx0XHRcdGlkOiBlbGVtZW50LmlkIHx8IG51bGxcblx0XHRcdFx0fSk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKHJlYXNvbiA9PiB0aGlzLl9ldmVudEJ1cy5lbWl0KCdlcnJvcicsIHJlYXNvbikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgYSBjb21wb25lbnQgZnJvbSB0aGUgY3VycmVudCBsaXN0LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gaWQgQ29tcG9uZW50J3MgSURcblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9yZW1vdmVDb21wb25lbnRCeUlkKGlkKSB7XG5cdFx0ZGVsZXRlIHRoaXMuX2NvbXBvbmVudEVsZW1lbnRzW2lkXTtcblx0XHRkZWxldGUgdGhpcy5fY29tcG9uZW50SW5zdGFuY2VzW2lkXTtcblx0XHRkZWxldGUgdGhpcy5fY29tcG9uZW50QmluZGluZ3NbaWRdO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJpbmRzIGFsbCByZXF1aXJlZCBldmVudCBoYW5kbGVycyB0byB0aGUgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgQ29tcG9uZW50J3MgSFRNTCBlbGVtZW50LlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSBmb3Igbm90aGluZy5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9iaW5kQ29tcG9uZW50KGVsZW1lbnQpIHtcblx0XHRjb25zdCBpZCA9IHRoaXMuX2dldElkKGVsZW1lbnQpO1xuXHRcdGNvbnN0IGluc3RhbmNlID0gdGhpcy5fY29tcG9uZW50SW5zdGFuY2VzW2lkXTtcblx0XHRpZiAoIWluc3RhbmNlKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgYmluZE1ldGhvZCA9IG1vZHVsZUhlbHBlci5nZXRNZXRob2RUb0ludm9rZShpbnN0YW5jZSwgJ2JpbmQnKTtcblx0XHRyZXR1cm4gbW9kdWxlSGVscGVyLmdldFNhZmVQcm9taXNlKGJpbmRNZXRob2QpXG5cdFx0XHQudGhlbihiaW5kaW5ncyA9PiB7XG5cdFx0XHRcdGlmICghYmluZGluZ3MgfHwgdHlwZW9mIChiaW5kaW5ncykgIT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdFx0dGhpcy5fZXZlbnRCdXMuZW1pdCgnY29tcG9uZW50Qm91bmQnLCB7XG5cdFx0XHRcdFx0XHRlbGVtZW50LFxuXHRcdFx0XHRcdFx0aWQ6IGVsZW1lbnQuaWQgfHwgbnVsbFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9jb21wb25lbnRCaW5kaW5nc1tpZF0gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRcdFx0XHRPYmplY3Qua2V5cyhiaW5kaW5ncylcblx0XHRcdFx0XHQuZm9yRWFjaChldmVudE5hbWUgPT4ge1xuXHRcdFx0XHRcdFx0ZXZlbnROYW1lID0gZXZlbnROYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdFx0XHRpZiAoZXZlbnROYW1lIGluIHRoaXMuX2NvbXBvbmVudEJpbmRpbmdzW2lkXSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjb25zdCBzZWxlY3RvckhhbmRsZXJzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0XHRcdFx0XHRcdE9iamVjdC5rZXlzKGJpbmRpbmdzW2V2ZW50TmFtZV0pXG5cdFx0XHRcdFx0XHRcdC5mb3JFYWNoKHNlbGVjdG9yID0+IHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBoYW5kbGVyID0gYmluZGluZ3NbZXZlbnROYW1lXVtzZWxlY3Rvcl07XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiAoaGFuZGxlcikgIT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0c2VsZWN0b3JIYW5kbGVyc1tzZWxlY3Rvcl0gPSBoYW5kbGVyLmJpbmQoaW5zdGFuY2UpO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdHRoaXMuX2NvbXBvbmVudEJpbmRpbmdzW2lkXVtldmVudE5hbWVdID0ge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVyOiB0aGlzLl9jcmVhdGVCaW5kaW5nSGFuZGxlcihlbGVtZW50LCBzZWxlY3RvckhhbmRsZXJzKSxcblx0XHRcdFx0XHRcdFx0c2VsZWN0b3JIYW5kbGVyc1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcblx0XHRcdFx0XHRcdFx0ZXZlbnROYW1lLFxuXHRcdFx0XHRcdFx0XHR0aGlzLl9jb21wb25lbnRCaW5kaW5nc1tpZF1bZXZlbnROYW1lXS5oYW5kbGVyLFxuXHRcdFx0XHRcdFx0XHROT05fQlVCQkxJTkdfRVZFTlRTLmhhc093blByb3BlcnR5KGV2ZW50TmFtZSlcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMuX2V2ZW50QnVzLmVtaXQoJ2NvbXBvbmVudEJvdW5kJywge1xuXHRcdFx0XHRcdGVsZW1lbnQsXG5cdFx0XHRcdFx0aWQ6IGVsZW1lbnQuaWQgfHwgbnVsbFxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSB1bml2ZXJzYWwgZXZlbnQgaGFuZGxlciBmb3IgZGVsZWdhdGVkIGV2ZW50cy5cblx0ICogQHBhcmFtIHtFbGVtZW50fSBjb21wb25lbnRSb290IFJvb3QgZWxlbWVudCBvZiB0aGUgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc2VsZWN0b3JIYW5kbGVycyBNYXAgb2YgZXZlbnQgaGFuZGxlcnMgYnkgdGhlaXIgQ1NTIHNlbGVjdG9ycy5cblx0ICogQHJldHVybnMge0Z1bmN0aW9ufSBVbml2ZXJzYWwgZXZlbnQgaGFuZGxlciBmb3IgZGVsZWdhdGVkIGV2ZW50cy5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9jcmVhdGVCaW5kaW5nSGFuZGxlcihjb21wb25lbnRSb290LCBzZWxlY3RvckhhbmRsZXJzKSB7XG5cdFx0Y29uc3Qgc2VsZWN0b3JzID0gT2JqZWN0LmtleXMoc2VsZWN0b3JIYW5kbGVycyk7XG5cdFx0cmV0dXJuIGV2ZW50ID0+IHtcblx0XHRcdHZhciBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuXHRcdFx0Y29uc3QgZGlzcGF0Y2hlZEV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQoZXZlbnQsICgpID0+IGVsZW1lbnQpO1xuXHRcdFx0dmFyIHRhcmdldE1hdGNoZXMgPSB0aGlzLl9nZXRNYXRjaGVzTWV0aG9kKGVsZW1lbnQpO1xuXHRcdFx0dmFyIGlzSGFuZGxlZCA9IHNlbGVjdG9ycy5zb21lKHNlbGVjdG9yID0+IHtcblx0XHRcdFx0aWYgKHRhcmdldE1hdGNoZXMoc2VsZWN0b3IpKSB7XG5cdFx0XHRcdFx0c2VsZWN0b3JIYW5kbGVyc1tzZWxlY3Rvcl0oZGlzcGF0Y2hlZEV2ZW50KTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKGlzSGFuZGxlZCB8fCAhZXZlbnQuYnViYmxlcykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIHdlIGNhbid0IHVzZSBwYXJlbnRFbGVtZW50IGhlcmUsIGJlY2F1c2Vcblx0XHRcdC8vIGludGVybmFsIFNWRyBlbGVtZW50cyBkb24ndCBoYXZlIHRoaXMgcHJvcGVydHkgaW4gSUVcblx0XHRcdHdoaWxlIChlbGVtZW50LnBhcmVudE5vZGUgJiYgZWxlbWVudCAhPT0gY29tcG9uZW50Um9vdCkge1xuXHRcdFx0XHRlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuXHRcdFx0XHR0YXJnZXRNYXRjaGVzID0gdGhpcy5fZ2V0TWF0Y2hlc01ldGhvZChlbGVtZW50KTtcblx0XHRcdFx0aXNIYW5kbGVkID0gdGhpcy5fdHJ5RGlzcGF0Y2hFdmVudChcblx0XHRcdFx0XHRzZWxlY3RvcnMsIHRhcmdldE1hdGNoZXMsIHNlbGVjdG9ySGFuZGxlcnMsIGRpc3BhdGNoZWRFdmVudFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAoaXNIYW5kbGVkKSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIFRyaWVzIHRvIGRpc3BhdGNoIGFuIGV2ZW50LlxuXHQgKiBAcGFyYW0ge0FycmF5fSBzZWxlY3RvcnMgVGhlIGxpc3Qgb2Ygc3VwcG9ydGVkIHNlbGVjdG9ycy5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gbWF0Y2hQcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrIGlmIHNlbGVjdG9yIG1hdGNoZXMuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBoYW5kbGVycyBUaGUgc2V0IG9mIGhhbmRsZXJzIGZvciBldmVudHMuXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBET00gZXZlbnQgb2JqZWN0LlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X3RyeURpc3BhdGNoRXZlbnQoc2VsZWN0b3JzLCBtYXRjaFByZWRpY2F0ZSwgaGFuZGxlcnMsIGV2ZW50KSB7XG5cdFx0cmV0dXJuIHNlbGVjdG9ycy5zb21lKHNlbGVjdG9yID0+IHtcblx0XHRcdGlmICghbWF0Y2hQcmVkaWNhdGUoc2VsZWN0b3IpKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGhhbmRsZXJzW3NlbGVjdG9yXShldmVudCk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIGVsZW1lbnQgaXMgYSBjb21wb25lbnQuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnRzIEN1cnJlbnQgY29tcG9uZW50cy5cblx0ICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IERPTSBlbGVtZW50LlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2lzQ29tcG9uZW50RWxlbWVudChjb21wb25lbnRzLCBlbGVtZW50KSB7XG5cdFx0aWYgKCFtb2R1bGVIZWxwZXIuaXNDb21wb25lbnROb2RlKGVsZW1lbnQpKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiBtb2R1bGVIZWxwZXIuZ2V0T3JpZ2luYWxDb21wb25lbnROYW1lKGVsZW1lbnQubm9kZU5hbWUpIGluIGNvbXBvbmVudHM7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZSBzcGVjaWZpZWQgb2JqZWN0IGlzIGEgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBjb21wb25lbnQgb2JqZWN0LlxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9pc0NvbXBvbmVudE9iamVjdChvYmopIHtcblx0XHRyZXR1cm4gb2JqICYmIG9iai4kY29udGV4dCAmJlxuXHRcdFx0dHlwZW9mIChvYmouJGNvbnRleHQpID09PSAnb2JqZWN0JyAmJlxuXHRcdFx0b2JqLiRjb250ZXh0LmVsZW1lbnQgaW5zdGFuY2VvZiB0aGlzLl93aW5kb3cuRWxlbWVudDtcblx0fVxuXG5cdC8qKlxuXHQgKiBNYXBzIGZvdW5kIGVsZW1lbnRzIHRvIGNvbXBvbmVudCBvYmplY3RzIGZpbHRlcmluZyBub24tY29tcG9uZW50IGVsZW1lbnRzLlxuXHQgKiBAcGFyYW0ge0hUTUxDb2xsZWN0aW9ufE5vZGVMaXN0fSBlbGVtZW50cyBFbGVtZW50cyBjb2xsZWN0aW9uLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IEFycmF5IG9mIHRoZSBjb21wb25lbnQgb2JqZWN0cy5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9tYXBFbGVtZW50c1RvQ29tcG9uZW50cyhlbGVtZW50cykge1xuXHRcdGNvbnN0IHJlc3VsdHMgPSBbXTtcblx0XHRBcnJheS5wcm90b3R5cGUuZm9yRWFjaFxuXHRcdFx0LmNhbGwoZWxlbWVudHMsIGVsZW1lbnQgPT4ge1xuXHRcdFx0XHRjb25zdCBjb21wb25lbnQgPSB0aGlzLmdldENvbXBvbmVudEJ5RWxlbWVudChlbGVtZW50KTtcblx0XHRcdFx0aWYgKGNvbXBvbmVudCkge1xuXHRcdFx0XHRcdHJlc3VsdHMucHVzaChjb21wb25lbnQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fVxuXG5cdC8qKlxuXHQgKiBEb2VzIGFzeW5jaHJvbm91cyB0cmF2ZXJzYWwgdGhyb3VnaCB0aGUgY29tcG9uZW50cyBoaWVyYXJjaHkuXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGVsZW1lbnRzIEVsZW1lbnRzIHRvIHN0YXJ0IHRoZSBzZWFyY2guXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnRzIEN1cnJlbnQgc2V0IG9mIGNvbXBvbmVudHMuXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGFjdGlvbiBBY3Rpb24gZm9yIGV2ZXJ5IGNvbXBvbmVudC5cblx0ICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgZm9yIHRoZSBmaW5pc2hlZCB0cmF2ZXJzYWwuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfdHJhdmVyc2VDb21wb25lbnRzKGVsZW1lbnRzLCBjb21wb25lbnRzLCBhY3Rpb24pIHtcblx0XHRpZiAoZWxlbWVudHMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgcm9vdCA9IGVsZW1lbnRzLnNoaWZ0KCk7XG5cdFx0ZWxlbWVudHMgPSBlbGVtZW50cy5jb25jYXQodGhpcy5fZmluZE5lc3RlZENvbXBvbmVudHMocm9vdCwgY29tcG9uZW50cykpO1xuXHRcdHJldHVybiB0aGlzLl90cmF2ZXJzZUNvbXBvbmVudHMoZWxlbWVudHMsIGNvbXBvbmVudHMsIGFjdGlvbilcblx0XHRcdC50aGVuKCgpID0+IGFjdGlvbihyb290KSk7XG5cdH1cblxuXHQvKipcblx0ICogRmluZHMgYWxsIGRlc2NlbmRhbnQgY29tcG9uZW50cyBvZiB0aGUgc3BlY2lmaWVkIGNvbXBvbmVudCByb290LlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IHJvb3QgUm9vdCBjb21wb25lbnQncyBIVE1MIHJvb3QgdG8gYmVnaW4gc2VhcmNoIHdpdGguXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnRzIE1hcCBvZiBjb21wb25lbnRzIGJ5IHRoZWlyIG5hbWVzLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2ZpbmROZXN0ZWRDb21wb25lbnRzKHJvb3QsIGNvbXBvbmVudHMpIHtcblx0XHRjb25zdCBlbGVtZW50cyA9IFtdO1xuXHRcdGNvbnN0IHF1ZXVlID0gW3Jvb3RdO1xuXG5cdFx0Ly8gZG9lcyBicmVhZHRoLWZpcnN0IHNlYXJjaCBpbnNpZGUgdGhlIHJvb3QgZWxlbWVudFxuXHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRjb25zdCBjdXJyZW50Q2hpbGRyZW4gPSBxdWV1ZS5zaGlmdCgpLmNoaWxkcmVuO1xuXHRcdFx0aWYgKCFjdXJyZW50Q2hpbGRyZW4pIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoY3VycmVudENoaWxkcmVuLCBjdXJyZW50Q2hpbGQgPT4ge1xuXHRcdFx0XHQvLyBhbmQgdGhleSBzaG91bGQgYmUgY29tcG9uZW50c1xuXHRcdFx0XHRpZiAoIXRoaXMuX2lzQ29tcG9uZW50RWxlbWVudChjb21wb25lbnRzLCBjdXJyZW50Q2hpbGQpKSB7XG5cdFx0XHRcdFx0cXVldWUucHVzaChjdXJyZW50Q2hpbGQpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsZW1lbnRzLnB1c2goY3VycmVudENoaWxkKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gZWxlbWVudHM7XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyBhbiBlcnJvciB3aGlsZSByZW5kZXJpbmcuXG5cdCAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBDb21wb25lbnQncyBIVE1MIGVsZW1lbnQuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnQgQ29tcG9uZW50J3MgaW5zdGFuY2UuXG5cdCAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIEVycm9yIHRvIGhhbmRsZS5cblx0ICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nPn0gUHJvbWlzZSBmb3IgSFRNTCBzdHJpbmcuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfaGFuZGxlUmVuZGVyRXJyb3IoZWxlbWVudCwgY29tcG9uZW50LCBlcnJvcikge1xuXHRcdHRoaXMuX2V2ZW50QnVzLmVtaXQoJ2Vycm9yJywgZXJyb3IpO1xuXG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG5cdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdC8vIGRvIG5vdCBjb3JydXB0IGV4aXN0ZWQgSEVBRCB3aGVuIGVycm9yIG9jY3Vyc1xuXHRcdFx0XHRpZiAoZWxlbWVudC50YWdOYW1lID09PSBUQUdfTkFNRVMuSEVBRCkge1xuXHRcdFx0XHRcdHJldHVybiAnJztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghdGhpcy5fY29uZmlnLmlzUmVsZWFzZSAmJiBlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVycm9ySGVscGVyLnByZXR0eVByaW50KGVycm9yLCB0aGlzLl93aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoY29tcG9uZW50LmVycm9yVGVtcGxhdGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gY29tcG9uZW50LmVycm9yVGVtcGxhdGUucmVuZGVyKGVycm9yKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAnJztcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goKCkgPT4gJycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZXMgYWxsIGNvbXBvbmVudHMgdGhhdCBkZXBlbmQgb24gdGhlIGN1cnJlbnQgc2V0IG9mIGNoYW5nZWQgc3RvcmVzLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSBmb3Igbm90aGluZy5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF91cGRhdGVTdG9yZUNvbXBvbmVudHMoKSB7XG5cdFx0aWYgKHRoaXMuX2lzVXBkYXRpbmcpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHR9XG5cblx0XHQvLyBpZiBkb2N1bWVudCBjb21wb25lbnQgaXMgY2hhbmdlZCB3ZSBzaG91bGQgcmVsb2FkIHRoZSBwYWdlXG5cdFx0Y29uc3QgZG9jdW1lbnRTdG9yZSA9IHRoaXMuX3dpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKFxuXHRcdFx0bW9kdWxlSGVscGVyLkFUVFJJQlVURV9TVE9SRVxuXHRcdCk7XG5cdFx0aWYgKGRvY3VtZW50U3RvcmUgaW4gdGhpcy5fY3VycmVudENoYW5nZWRTdG9yZXMpIHtcblx0XHRcdGNvbnN0IG5ld0xvY2F0aW9uID0gdGhpcy5fY3VycmVudFJvdXRpbmdDb250ZXh0LmxvY2F0aW9uLnRvU3RyaW5nKCk7XG5cdFx0XHRpZiAobmV3TG9jYXRpb24gPT09IHRoaXMuX3dpbmRvdy5sb2NhdGlvbi50b1N0cmluZygpKSB7XG5cdFx0XHRcdHRoaXMuX3dpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fd2luZG93LmxvY2F0aW9uLmFzc2lnbihuZXdMb2NhdGlvbik7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5faXNVcGRhdGluZyA9IHRydWU7XG5cblx0XHQvLyBpZiB3ZSBoYXZlIGF3YWl0aW5nIHJvdXRpbmcgd2Ugc2hvdWxkIGFwcGx5IHN0YXRlIHRvIHRoZSBzdG9yZXNcblx0XHRpZiAodGhpcy5fYXdhaXRpbmdSb3V0aW5nKSB7XG5cdFx0XHRjb25zdCBjb21wb25lbnRzID0gdGhpcy5fY29tcG9uZW50TG9hZGVyLmdldENvbXBvbmVudHNCeU5hbWVzKCk7XG5cdFx0XHRjb25zdCBjaGFuZ2VkQnlTdGF0ZSA9IHRoaXMuX3N0b3JlRGlzcGF0Y2hlci5zZXRTdGF0ZShcblx0XHRcdFx0dGhpcy5fYXdhaXRpbmdSb3V0aW5nLnN0YXRlLFxuXHRcdFx0XHR0aGlzLl9hd2FpdGluZ1JvdXRpbmcucm91dGluZ0NvbnRleHRcblx0XHRcdCk7XG5cblx0XHRcdGNoYW5nZWRCeVN0YXRlLmZvckVhY2gobmFtZSA9PiB7XG5cdFx0XHRcdHRoaXMuX2N1cnJlbnRDaGFuZ2VkU3RvcmVzW25hbWVdID0gdHJ1ZTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyB3ZSBzaG91bGQgdXBkYXRlIGNvbnRleHRzIG9mIHRoZSBjb21wb25lbnRzIHdpdGggdGhlIG5ldyByb3V0aW5nIGNvbnRleHRcblx0XHRcdHRoaXMuX2N1cnJlbnRSb3V0aW5nQ29udGV4dCA9IHRoaXMuX2F3YWl0aW5nUm91dGluZy5yb3V0aW5nQ29udGV4dDtcblx0XHRcdE9iamVjdC5rZXlzKHRoaXMuX2NvbXBvbmVudEluc3RhbmNlcylcblx0XHRcdFx0LmZvckVhY2goaWQgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGluc3RhbmNlID0gdGhpcy5fY29tcG9uZW50SW5zdGFuY2VzW2lkXTtcblx0XHRcdFx0XHRpbnN0YW5jZS4kY29udGV4dCA9IHRoaXMuX2dldENvbXBvbmVudENvbnRleHQoXG5cdFx0XHRcdFx0XHRjb21wb25lbnRzW2luc3RhbmNlLiRjb250ZXh0Lm5hbWVdLFxuXHRcdFx0XHRcdFx0aW5zdGFuY2UuJGNvbnRleHQuZWxlbWVudFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fYXdhaXRpbmdSb3V0aW5nID0gbnVsbDtcblx0XHR9XG5cblx0XHRjb25zdCBjaGFuZ2VkU3RvcmVzID0gT2JqZWN0LmtleXModGhpcy5fY3VycmVudENoYW5nZWRTdG9yZXMpO1xuXHRcdGlmIChjaGFuZ2VkU3RvcmVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0dGhpcy5faXNVcGRhdGluZyA9IGZhbHNlO1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHRcdH1cblxuXHRcdHRoaXMuX2N1cnJlbnRDaGFuZ2VkU3RvcmVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXHRcdGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLl9jcmVhdGVSZW5kZXJpbmdDb250ZXh0KGNoYW5nZWRTdG9yZXMpO1xuXHRcdGNvbnN0IHByb21pc2VzID0gcmVuZGVyaW5nQ29udGV4dC5yb290cy5tYXAocm9vdCA9PiB7XG5cdFx0XHRyZW5kZXJpbmdDb250ZXh0LnJvb3RJZHNbdGhpcy5fZ2V0SWQocm9vdCldID0gdHJ1ZTtcblx0XHRcdHJldHVybiB0aGlzLnJlbmRlckNvbXBvbmVudChyb290LCByZW5kZXJpbmdDb250ZXh0KTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcylcblx0XHRcdC5jYXRjaChyZWFzb24gPT4gdGhpcy5fZXZlbnRCdXMuZW1pdCgnZXJyb3InLCByZWFzb24pKVxuXHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9pc1VwZGF0aW5nID0gZmFsc2U7XG5cdFx0XHRcdHRoaXMuX2V2ZW50QnVzLmVtaXQoJ2RvY3VtZW50VXBkYXRlZCcsIGNoYW5nZWRTdG9yZXMpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fdXBkYXRlU3RvcmVDb21wb25lbnRzKCk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNZXJnZXMgbmV3IGFuZCBleGlzdGVkIGhlYWQgZWxlbWVudHMgYW5kIGFwcGxpZXMgb25seSBkaWZmZXJlbmNlLlxuXHQgKiBUaGUgcHJvYmxlbSBoZXJlIGlzIHRoYXQgd2UgY2FuJ3QgcmUtY3JlYXRlIG9yIGNoYW5nZSBzY3JpcHQgYW5kIHN0eWxlIHRhZ3MsXG5cdCAqIGJlY2F1c2UgaXQgY2F1c2VzIGJsaW5raW5nIGFuZCBKYXZhU2NyaXB0IHJlLWluaXRpYWxpemF0aW9uLiBUaGVyZWZvcmUgc3VjaFxuXHQgKiBlbGVtZW50IG11c3QgYmUgaW1tdXRhYmxlIGluIHRoZSBIRUFELlxuXHQgKiBAcGFyYW0ge05vZGV9IGhlYWQgSEVBRCBET00gZWxlbWVudC5cblx0ICogQHBhcmFtIHtOb2RlfSBuZXdIZWFkIE5ldyBIRUFEIGVsZW1lbnQuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfbWVyZ2VIZWFkKGhlYWQsIG5ld0hlYWQpIHtcblx0XHRpZiAoIW5ld0hlYWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBoZWFkU2V0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXHRcdC8vIHJlbW92ZSBhbGwgbm9kZXMgZnJvbSB0aGUgY3VycmVudCBIRUFEIGV4Y2VwdCBpbW11dGFibGUgb25lc1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaGVhZC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBjdXJyZW50ID0gaGVhZC5jaGlsZE5vZGVzW2ldO1xuXHRcdFx0aWYgKCFpc1RhZ0ltbXV0YWJsZShjdXJyZW50KSkge1xuXHRcdFx0XHRoZWFkLnJlbW92ZUNoaWxkKGN1cnJlbnQpO1xuXHRcdFx0XHRpLS07XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0Ly8gd2UgbmVlZCB0byBjb2xsZWN0IGtleXMgZm9yIGltbXV0YWJsZSBlbGVtZW50cyB0byBoYW5kbGVcblx0XHRcdC8vIGF0dHJpYnV0ZXMgcmVvcmRlcmluZ1xuXHRcdFx0aGVhZFNldFt0aGlzLl9nZXRFbGVtZW50S2V5KGN1cnJlbnQpXSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBuZXdIZWFkLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBjdXJyZW50ID0gbmV3SGVhZC5jaGlsZHJlbltpXTtcblx0XHRcdGlmICh0aGlzLl9nZXRFbGVtZW50S2V5KGN1cnJlbnQpIGluIGhlYWRTZXQpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRoZWFkLmFwcGVuZENoaWxkKGN1cnJlbnQpO1xuXHRcdFx0Ly8gd2hlbiB3ZSBhcHBlbmQgZXhpc3RpbmcgY2hpbGQgdG8gYW5vdGhlciBwYXJlbnQgaXQgcmVtb3Zlc1xuXHRcdFx0Ly8gdGhlIG5vZGUgZnJvbSBhIHByZXZpb3VzIHBhcmVudFxuXHRcdFx0aS0tO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGFuIHVuaXF1ZSBlbGVtZW50IGtleSB1c2luZyBlbGVtZW50J3MgYXR0cmlidXRlcyBhbmQgaXRzIGNvbnRlbnQuXG5cdCAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBIVE1MIGVsZW1lbnQuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFVuaXF1ZSBrZXkgZm9yIHRoZSBlbGVtZW50LlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2dldEVsZW1lbnRLZXkoZWxlbWVudCkge1xuXHRcdC8vIHNvbWUgaW1tdXRhYmxlIGVsZW1lbnRzIGhhdmUgc2V2ZXJhbCB2YWx1YWJsZSBhdHRyaWJ1dGVzXG5cdFx0Ly8gdGhlc2UgYXR0cmlidXRlcyBkZWZpbmUgdGhlIGVsZW1lbnQgaWRlbnRpdHlcblx0XHRjb25zdCBhdHRyaWJ1dGVzID0gW107XG5cblx0XHRzd2l0Y2ggKGVsZW1lbnQubm9kZU5hbWUpIHtcblx0XHRcdGNhc2UgVEFHX05BTUVTLkxJTks6XG5cdFx0XHRcdGF0dHJpYnV0ZXMucHVzaChgaHJlZj0ke2VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyl9YCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBUQUdfTkFNRVMuU0NSSVBUOlxuXHRcdFx0XHRhdHRyaWJ1dGVzLnB1c2goYHNyYz0ke2VsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKX1gKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGA8JHtlbGVtZW50Lm5vZGVOYW1lfSAke2F0dHJpYnV0ZXMuc29ydCgpLmpvaW4oJyAnKX0+JHtlbGVtZW50LnRleHRDb250ZW50fTwvJHtlbGVtZW50Lm5vZGVOYW1lfT5gO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemVzIHRoZSBlbGVtZW50IGFzIGEgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgVGhlIGNvbXBvbmVudCdzIGVsZW1lbnQuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnRzIEN1cnJlbnQgc2V0IG9mIGNvbXBvbmVudHMuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIGZvciB0aGUgZG9uZSBpbml0aWFsaXphdGlvbi5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9pbml0aWFsaXplQ29tcG9uZW50KGVsZW1lbnQsIGNvbXBvbmVudHMpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0Y29uc3QgY29tcG9uZW50TmFtZSA9IG1vZHVsZUhlbHBlci5nZXRPcmlnaW5hbENvbXBvbmVudE5hbWUoZWxlbWVudC5ub2RlTmFtZSk7XG5cdFx0XHRcdGlmICghKGNvbXBvbmVudE5hbWUgaW4gY29tcG9uZW50cykpIHtcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IGlkID0gdGhpcy5fZ2V0SWQoZWxlbWVudCk7XG5cdFx0XHRcdGNvbnN0IENvbXBvbmVudENvbnN0cnVjdG9yID0gY29tcG9uZW50c1tjb21wb25lbnROYW1lXS5jb25zdHJ1Y3Rvcjtcblx0XHRcdFx0Q29tcG9uZW50Q29uc3RydWN0b3IucHJvdG90eXBlLiRjb250ZXh0ID0gdGhpcy5fZ2V0Q29tcG9uZW50Q29udGV4dChcblx0XHRcdFx0XHRjb21wb25lbnRzW2NvbXBvbmVudE5hbWVdLCBlbGVtZW50XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0Y29uc3QgaW5zdGFuY2UgPSBuZXcgQ29tcG9uZW50Q29uc3RydWN0b3IodGhpcy5fc2VydmljZUxvY2F0b3IpO1xuXHRcdFx0XHRpbnN0YW5jZS4kY29udGV4dCA9IENvbXBvbmVudENvbnN0cnVjdG9yLnByb3RvdHlwZS4kY29udGV4dDtcblx0XHRcdFx0dGhpcy5fY29tcG9uZW50RWxlbWVudHNbaWRdID0gZWxlbWVudDtcblx0XHRcdFx0dGhpcy5fY29tcG9uZW50SW5zdGFuY2VzW2lkXSA9IGluc3RhbmNlO1xuXG5cdFx0XHRcdHRoaXMuX2V2ZW50QnVzLmVtaXQoJ2NvbXBvbmVudFJlbmRlcmVkJywge1xuXHRcdFx0XHRcdG5hbWU6IGNvbXBvbmVudE5hbWUsXG5cdFx0XHRcdFx0YXR0cmlidXRlczogaW5zdGFuY2UuJGNvbnRleHQuYXR0cmlidXRlcyxcblx0XHRcdFx0XHRjb250ZXh0OiBpbnN0YW5jZS4kY29udGV4dFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2JpbmRDb21wb25lbnQoZWxlbWVudCk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGEgY29tcG9uZW50IGNvbnRleHQgdXNpbmcgdGhlIGJhc2ljIGNvbnRleHQuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnQgQ29tcG9uZW50IGRldGFpbHMuXG5cdCAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBET00gZWxlbWVudCBvZiB0aGUgY29tcG9uZW50LlxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBDb21wb25lbnQncyBjb250ZXh0LlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2dldENvbXBvbmVudENvbnRleHQoY29tcG9uZW50LCBlbGVtZW50KSB7XG5cdFx0Y29uc3Qgc3RvcmVOYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUobW9kdWxlSGVscGVyLkFUVFJJQlVURV9TVE9SRSk7XG5cdFx0Y29uc3QgY29tcG9uZW50Q29udGV4dCA9IE9iamVjdC5jcmVhdGUodGhpcy5fY3VycmVudFJvdXRpbmdDb250ZXh0KTtcblxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGNvbXBvbmVudENvbnRleHQsIHtcblx0XHRcdG5hbWU6IHtcblx0XHRcdFx0Z2V0OiAoKSA9PiBjb21wb25lbnQubmFtZSxcblx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdGF0dHJpYnV0ZXM6IHtcblx0XHRcdFx0Z2V0OiAoKSA9PiBhdHRyaWJ1dGVzVG9PYmplY3QoZWxlbWVudC5hdHRyaWJ1dGVzKSxcblx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZVxuXHRcdFx0fVxuXG5cdFx0fSk7XG5cblx0XHQvLyBpbml0aWFsaXplIHRoZSBzdG9yZSBvZiB0aGUgY29tcG9uZW50XG5cdFx0Y29uc3Qgc3RvcmVQYXJhbXMgPSBtb2R1bGVIZWxwZXIuZ2V0U3RvcmVQYXJhbXNGcm9tQXR0cmlidXRlcyhjb21wb25lbnRDb250ZXh0LmF0dHJpYnV0ZXMpO1xuXHRcdGNvbnN0IHN0b3JlSW5zdGFuY2UgPSB0aGlzLl9zdG9yZURpc3BhdGNoZXIuZ2V0U3RvcmUoc3RvcmVOYW1lLCB7c3RvcmVQYXJhbXN9KTtcblx0XHRjb25zdCBzdG9yZUluc3RhbmNlSWQgPSBzdG9yZUluc3RhbmNlICYmIHN0b3JlSW5zdGFuY2UuJGNvbnRleHQuc3RvcmVJbnN0YW5jZUlkO1xuXG5cdFx0aWYgKHN0b3JlSW5zdGFuY2VJZCkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoY29tcG9uZW50Q29udGV4dCwge1xuXHRcdFx0XHRzdG9yZUluc3RhbmNlSWQ6IHtcblx0XHRcdFx0XHRnZXQ6ICgpID0+IHN0b3JlSW5zdGFuY2VJZCxcblx0XHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGNvbXBvbmVudENvbnRleHQuZWxlbWVudCA9IGVsZW1lbnQ7XG5cblx0XHQvLyBzZWFyY2ggbWV0aG9kc1xuXHRcdGNvbXBvbmVudENvbnRleHQuZ2V0Q29tcG9uZW50QnlJZCA9IGlkID0+IHRoaXMuZ2V0Q29tcG9uZW50QnlJZChpZCk7XG5cdFx0Y29tcG9uZW50Q29udGV4dC5nZXRDb21wb25lbnRCeUVsZW1lbnQgPSBlbGVtZW50ID0+IHRoaXMuZ2V0Q29tcG9uZW50QnlFbGVtZW50KGVsZW1lbnQpO1xuXHRcdGNvbXBvbmVudENvbnRleHQuZ2V0Q29tcG9uZW50c0J5VGFnTmFtZSA9ICh0YWdOYW1lLCBwYXJlbnQpID0+IHRoaXMuZ2V0Q29tcG9uZW50c0J5VGFnTmFtZSh0YWdOYW1lLCBwYXJlbnQpO1xuXHRcdGNvbXBvbmVudENvbnRleHQuZ2V0Q29tcG9uZW50c0J5Q2xhc3NOYW1lID0gKGNsYXNzTmFtZSwgcGFyZW50KSA9PiB0aGlzLmdldENvbXBvbmVudHNCeUNsYXNzTmFtZShjbGFzc05hbWUsIHBhcmVudCk7XG5cdFx0Y29tcG9uZW50Q29udGV4dC5xdWVyeUNvbXBvbmVudFNlbGVjdG9yID0gKHNlbGVjdG9yLCBwYXJlbnQpID0+IHRoaXMucXVlcnlDb21wb25lbnRTZWxlY3RvcihzZWxlY3RvciwgcGFyZW50KTtcblx0XHRjb21wb25lbnRDb250ZXh0LnF1ZXJ5Q29tcG9uZW50U2VsZWN0b3JBbGwgPSAoc2VsZWN0b3IsIHBhcmVudCkgPT4gdGhpcy5xdWVyeUNvbXBvbmVudFNlbGVjdG9yQWxsKHNlbGVjdG9yLCBwYXJlbnQpO1xuXG5cdFx0Ly8gY3JlYXRlL3JlbW92ZS9yZW5kZXJcblx0XHRjb21wb25lbnRDb250ZXh0LnJlUmVuZGVyQ29tcG9uZW50ID0gKCkgPT4gdGhpcy5yZW5kZXJDb21wb25lbnQoZWxlbWVudCk7XG5cdFx0Y29tcG9uZW50Q29udGV4dC5jcmVhdGVDb21wb25lbnQgPSAodGFnTmFtZSwgYXR0cmlidXRlcykgPT4gdGhpcy5jcmVhdGVDb21wb25lbnQodGFnTmFtZSwgYXR0cmlidXRlcyk7XG5cdFx0Y29tcG9uZW50Q29udGV4dC5jb2xsZWN0R2FyYmFnZSA9ICgpID0+IHRoaXMuY29sbGVjdEdhcmJhZ2UoKTtcblxuXHRcdC8vIHN0b3JlIG1ldGhvZHNcblx0XHRjb21wb25lbnRDb250ZXh0LmdldFN0b3JlRGF0YSA9ICgpID0+IHtcblx0XHRcdGNvbnN0IHN0b3JlTmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKG1vZHVsZUhlbHBlci5BVFRSSUJVVEVfU1RPUkUpO1xuXHRcdFx0Y29uc3Qgc3RvcmVQYXJhbXMgPSBtb2R1bGVIZWxwZXIuZ2V0U3RvcmVQYXJhbXNGcm9tQXR0cmlidXRlcyhjb21wb25lbnRDb250ZXh0LmF0dHJpYnV0ZXMpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5fc3RvcmVEaXNwYXRjaGVyLmdldFN0b3JlRGF0YShzdG9yZU5hbWUsIHtcblx0XHRcdFx0c3RvcmVQYXJhbXMsXG5cdFx0XHRcdHN0b3JlSW5zdGFuY2VJZFxuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHRjb21wb25lbnRDb250ZXh0LnNlbmRBY3Rpb24gPSAobmFtZSwgYXJncykgPT4ge1xuXHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHtzdG9yZU5hbWU6IGVsZW1lbnQuZ2V0QXR0cmlidXRlKG1vZHVsZUhlbHBlci5BVFRSSUJVVEVfU1RPUkUpLCBzdG9yZUluc3RhbmNlSWR9O1xuXHRcdFx0cmV0dXJuIHRoaXMuX3N0b3JlRGlzcGF0Y2hlci5zZW5kQWN0aW9uKG9wdGlvbnMsIG5hbWUsIGFyZ3MpO1xuXHRcdH07XG5cblx0XHRyZXR1cm4gT2JqZWN0LmZyZWV6ZShjb21wb25lbnRDb250ZXh0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGaW5kcyBhbGwgcmVuZGVyaW5nIHJvb3RzIG9uIHRoZSBwYWdlIGZvciBhbGwgY2hhbmdlZCBzdG9yZXMuXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGNoYW5nZWRTdG9yZU5hbWVzIExpc3Qgb2YgY2hhbmdlZCBzdG9yZSdzIG5hbWVzLlxuXHQgKiBAcmV0dXJucyB7QXJyYXk8RWxlbWVudD59IEhUTUwgZWxlbWVudHMgdGhhdCBhcmUgcmVuZGVyaW5nIHJvb3RzLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2ZpbmRSZW5kZXJpbmdSb290cyhjaGFuZ2VkU3RvcmVOYW1lcykge1xuXHRcdGNvbnN0IGhlYWRTdG9yZSA9IHRoaXMuX3dpbmRvdy5kb2N1bWVudC5oZWFkLmdldEF0dHJpYnV0ZShtb2R1bGVIZWxwZXIuQVRUUklCVVRFX1NUT1JFKTtcblx0XHRjb25zdCBjb21wb25lbnRzID0gdGhpcy5fY29tcG9uZW50TG9hZGVyLmdldENvbXBvbmVudHNCeU5hbWVzKCk7XG5cdFx0Y29uc3QgY29tcG9uZW50RWxlbWVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRcdGNvbnN0IHN0b3JlTmFtZXNTZXQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRcdGNvbnN0IHJvb3RzU2V0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0XHRjb25zdCByb290cyA9IFtdO1xuXG5cdFx0Ly8gd2Ugc2hvdWxkIGZpbmQgYWxsIGNvbXBvbmVudHMgYW5kIHRoZW4gbG9vayBmb3Igcm9vdHNcblx0XHRjaGFuZ2VkU3RvcmVOYW1lc1xuXHRcdFx0LmZvckVhY2goc3RvcmVOYW1lID0+IHtcblx0XHRcdFx0c3RvcmVOYW1lc1NldFtzdG9yZU5hbWVdID0gdHJ1ZTtcblx0XHRcdFx0Y29uc3QgZWxlbWVudHMgPSB0aGlzLl93aW5kb3cuZG9jdW1lbnRcblx0XHRcdFx0XHQucXVlcnlTZWxlY3RvckFsbChgWyR7bW9kdWxlSGVscGVyLkFUVFJJQlVURV9TVE9SRX09XCIke3N0b3JlTmFtZX1cIl1gKTtcblx0XHRcdFx0aWYgKGVsZW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb21wb25lbnRFbGVtZW50c1tzdG9yZU5hbWVdID0gZWxlbWVudHM7XG5cdFx0XHR9KTtcblxuXHRcdGlmIChoZWFkU3RvcmUgaW4gc3RvcmVOYW1lc1NldCAmJiBtb2R1bGVIZWxwZXIuSEVBRF9DT01QT05FTlRfTkFNRSBpbiBjb21wb25lbnRzKSB7XG5cdFx0XHRyb290c1NldFt0aGlzLl9nZXRJZCh0aGlzLl93aW5kb3cuZG9jdW1lbnQuaGVhZCldID0gdHJ1ZTtcblx0XHRcdHJvb3RzLnB1c2godGhpcy5fd2luZG93LmRvY3VtZW50LmhlYWQpO1xuXHRcdH1cblxuXHRcdGNoYW5nZWRTdG9yZU5hbWVzXG5cdFx0XHQuZm9yRWFjaChzdG9yZU5hbWUgPT4ge1xuXHRcdFx0XHRpZiAoIShzdG9yZU5hbWUgaW4gY29tcG9uZW50RWxlbWVudHMpKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gd2UgY2FuIG9wdGltaXplIGFuZCBkb24ndCBnbyB0aGUgc2FtZSBwYXRoIHR3aWNlXG5cdFx0XHRcdGNvbnN0IHZpc2l0ZWRJZHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdFx0XHRcdEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoY29tcG9uZW50RWxlbWVudHNbc3RvcmVOYW1lXSwgY3VycmVudCA9PiB7XG5cdFx0XHRcdFx0aWYgKCFtb2R1bGVIZWxwZXIuaXNDb21wb25lbnROb2RlKGN1cnJlbnQpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bGV0IGN1cnJlbnRSb290ID0gY3VycmVudDtcblx0XHRcdFx0XHRsZXQgbGFzdFJvb3QgPSBjdXJyZW50Um9vdDtcblx0XHRcdFx0XHRsZXQgbGFzdFJvb3RJZCA9IHRoaXMuX2dldElkKGN1cnJlbnQpO1xuXHRcdFx0XHRcdGlmIChsYXN0Um9vdElkIGluIHZpc2l0ZWRJZHMpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmlzaXRlZElkc1tsYXN0Um9vdElkXSA9IHRydWU7XG5cblx0XHRcdFx0XHR3aGlsZSAoY3VycmVudFJvb3QucGFyZW50RWxlbWVudCkge1xuXHRcdFx0XHRcdFx0Y3VycmVudFJvb3QgPSBjdXJyZW50Um9vdC5wYXJlbnRFbGVtZW50O1xuXG5cdFx0XHRcdFx0XHQvLyBpZiB3ZSBnbyB0aGUgc2FtZSByb3V0ZSB3ZSB2aXNpdGVkIGJlZm9yZSB3ZSBjYW5cblx0XHRcdFx0XHRcdC8vIHByb2NlZWQgd2l0aCB0aGUgbmV4dCBlbGVtZW50XG5cdFx0XHRcdFx0XHRjb25zdCBjdXJyZW50SWQgPSB0aGlzLl9nZXRJZChjdXJyZW50Um9vdCk7XG5cdFx0XHRcdFx0XHRpZiAoY3VycmVudElkIGluIHZpc2l0ZWRJZHMpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjb25zdCBjdXJyZW50U3RvcmUgPSBjdXJyZW50Um9vdC5nZXRBdHRyaWJ1dGUobW9kdWxlSGVscGVyLkFUVFJJQlVURV9TVE9SRSk7XG5cdFx0XHRcdFx0XHRjb25zdCBjdXJyZW50Q29tcG9uZW50TmFtZSA9IG1vZHVsZUhlbHBlci5nZXRPcmlnaW5hbENvbXBvbmVudE5hbWUoY3VycmVudFJvb3QudGFnTmFtZSk7XG5cblx0XHRcdFx0XHRcdC8vIHN0b3JlIGRpZCBub3QgY2hhbmdlIHN0YXRlXG5cdFx0XHRcdFx0XHRpZiAoIWN1cnJlbnRTdG9yZSB8fCAhKGN1cnJlbnRTdG9yZSBpbiBzdG9yZU5hbWVzU2V0KSkge1xuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gdGhpcyBjb21wb25lbnQgZWxlbWVudCBkb2VzIG5vdCBoYXZlIGFuXG5cdFx0XHRcdFx0XHQvLyBpbXBsZW1lbnRhdGlvbiwgc2tpcHBpbmcuLi4uXG5cdFx0XHRcdFx0XHRpZiAoIShjdXJyZW50Q29tcG9uZW50TmFtZSBpbiBjb21wb25lbnRzKSkge1xuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0bGFzdFJvb3QgPSBjdXJyZW50Um9vdDtcblx0XHRcdFx0XHRcdGxhc3RSb290SWQgPSBjdXJyZW50SWQ7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gd2UgZG9uJ3Qgd2FudCB0aGUgc2FtZSByb290IGVsZW1lbnQgdHdpY2Vcblx0XHRcdFx0XHRpZiAobGFzdFJvb3RJZCBpbiByb290c1NldCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyb290c1NldFtsYXN0Um9vdElkXSA9IHRydWU7XG5cdFx0XHRcdFx0cm9vdHMucHVzaChsYXN0Um9vdCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRyZXR1cm4gcm9vdHM7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIHJlbmRlcmluZyBjb250ZXh0LlxuXHQgKiBAcGFyYW0ge0FycmF5P30gY2hhbmdlZFN0b3JlcyBOYW1lcyBvZiBjaGFuZ2VkIHN0b3Jlcy5cblx0ICogQHJldHVybnMge3tcblx0ICogICBjb25maWc6IE9iamVjdCxcblx0ICogICByZW5kZXJlZElkczoge30sXG5cdCAqICAgdW5ib3VuZElkczoge30sXG5cdCAqICAgaXNIZWFkUmVuZGVyZWQ6IGJvb2xlYW4sXG5cdCAqICAgYmluZE1ldGhvZHM6IEFycmF5LFxuXHQgKiAgIHJvdXRpbmdDb250ZXh0OiBPYmplY3QsXG5cdCAqICAgY29tcG9uZW50czogT2JqZWN0LFxuXHQgKiAgIHJvb3RzOiBBcnJheS48RWxlbWVudD5cblx0ICogfX0gVGhlIGNvbnRleHQgb2JqZWN0LlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2NyZWF0ZVJlbmRlcmluZ0NvbnRleHQoY2hhbmdlZFN0b3Jlcykge1xuXHRcdGNvbnN0IGNvbXBvbmVudHMgPSB0aGlzLl9jb21wb25lbnRMb2FkZXIuZ2V0Q29tcG9uZW50c0J5TmFtZXMoKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRjb25maWc6IHRoaXMuX2NvbmZpZyxcblx0XHRcdHJlbmRlcmVkSWRzOiBPYmplY3QuY3JlYXRlKG51bGwpLFxuXHRcdFx0dW5ib3VuZElkczogT2JqZWN0LmNyZWF0ZShudWxsKSxcblx0XHRcdGlzSGVhZFJlbmRlcmVkOiBmYWxzZSxcblx0XHRcdGJpbmRNZXRob2RzOiBbXSxcblx0XHRcdHJvdXRpbmdDb250ZXh0OiB0aGlzLl9jdXJyZW50Um91dGluZ0NvbnRleHQsXG5cdFx0XHRjb21wb25lbnRzLFxuXHRcdFx0cm9vdElkczogT2JqZWN0LmNyZWF0ZShudWxsKSxcblx0XHRcdHJvb3RzOiBjaGFuZ2VkU3RvcmVzID8gdGhpcy5fZmluZFJlbmRlcmluZ1Jvb3RzKGNoYW5nZWRTdG9yZXMpIDogW11cblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgYW4gSUQgb2YgdGhlIGVsZW1lbnQuXG5cdCAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBIVE1MIGVsZW1lbnQgb2YgdGhlIGNvbXBvbmVudC5cblx0ICogQHJldHVybnMge3N0cmluZ30gSUQuXG5cdCAqL1xuXHRfZ2V0SWQoZWxlbWVudCkge1xuXHRcdGlmIChlbGVtZW50ID09PSB0aGlzLl93aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gU1BFQ0lBTF9JRFMuJCRkb2N1bWVudDtcblx0XHR9XG5cblx0XHRpZiAoZWxlbWVudCA9PT0gdGhpcy5fd2luZG93LmRvY3VtZW50LmhlYWQpIHtcblx0XHRcdHJldHVybiBTUEVDSUFMX0lEUy4kJGhlYWQ7XG5cdFx0fVxuXG5cdFx0Ly8gaWYgdGhlIGVsZW1lbnQgZG9lcyBub3QgaGF2ZSBhbiBJRCB3ZSBjcmVhdGUgaXRcblx0XHRpZiAoIWVsZW1lbnRbbW9kdWxlSGVscGVyLkNPTVBPTkVOVF9JRF0pIHtcblx0XHRcdGVsZW1lbnRbbW9kdWxlSGVscGVyLkNPTVBPTkVOVF9JRF0gPSB1dWlkLnY0KCk7XG5cdFx0XHQvLyBkZWFsIHdpdGggcG9zc2libGUgY29sbGlzaW9uc1xuXHRcdFx0d2hpbGUgKGVsZW1lbnRbbW9kdWxlSGVscGVyLkNPTVBPTkVOVF9JRF0gaW4gdGhpcy5fY29tcG9uZW50SW5zdGFuY2VzKSB7XG5cdFx0XHRcdGVsZW1lbnRbbW9kdWxlSGVscGVyLkNPTVBPTkVOVF9JRF0gPSB1dWlkLnY0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBlbGVtZW50W21vZHVsZUhlbHBlci5DT01QT05FTlRfSURdO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgYSBjcm9zcy1icm93c2VyIFwibWF0Y2hlc1wiIG1ldGhvZCBmb3IgdGhlIGVsZW1lbnQuXG5cdCAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBIVE1MIGVsZW1lbnQuXG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn0gXCJtYXRjaGVzXCIgbWV0aG9kLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2dldE1hdGNoZXNNZXRob2QoZWxlbWVudCkge1xuXHRcdGNvbnN0IG1ldGhvZCA9IChcblx0XHRcdGVsZW1lbnQubWF0Y2hlcyB8fFxuXHRcdFx0ZWxlbWVudC53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHxcblx0XHRcdGVsZW1lbnQubW96TWF0Y2hlc1NlbGVjdG9yIHx8XG5cdFx0XHRlbGVtZW50Lm9NYXRjaGVzU2VsZWN0b3IgfHxcblx0XHRcdGVsZW1lbnQubXNNYXRjaGVzU2VsZWN0b3IgfHxcblx0XHRcdChzZWxlY3RvciA9PiBtYXRjaGVzKHRoaXMuX3dpbmRvdywgZWxlbWVudCwgc2VsZWN0b3IpKVxuXHRcdCk7XG5cblx0XHRyZXR1cm4gbWV0aG9kLmJpbmQoZWxlbWVudCk7XG5cdH1cbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBOYW1lZE5vZGVNYXAgb2YgQXR0ciBpdGVtcyB0byB0aGUga2V5LXZhbHVlIG9iamVjdCBtYXAuXG4gKiBAcGFyYW0ge05hbWVkTm9kZU1hcH0gYXR0cmlidXRlcyBMaXN0IG9mIEVsZW1lbnQgYXR0cmlidXRlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IE1hcCBvZiBhdHRyaWJ1dGUgdmFsdWVzIGJ5IHRoZWlyIG5hbWVzLlxuICovXG5mdW5jdGlvbiBhdHRyaWJ1dGVzVG9PYmplY3QoYXR0cmlidXRlcykge1xuXHRjb25zdCByZXN1bHQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGF0dHJpYnV0ZXMsIGN1cnJlbnQgPT4ge1xuXHRcdHJlc3VsdFtjdXJyZW50Lm5hbWVdID0gY3VycmVudC52YWx1ZTtcblx0fSk7XG5cdHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogTWF0Y2hlcyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQgdG8gdGhlIHNlbGVjdG9yIChmYWxsYmFjaykuXG4gKiBAcGFyYW0ge1dpbmRvd30gY3VycmVudFdpbmRvdyBDdXJyZW50IGJyb3dzZXIgd2luZG93LlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IERPTSBlbGVtZW50LlxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIFNlbGVjdG9yIGZvciBtYXRjaGluZy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBEb2VzIHRoZSBlbGVtZW50IG1hdGNoLlxuICovXG5mdW5jdGlvbiBtYXRjaGVzKGN1cnJlbnRXaW5kb3csIGVsZW1lbnQsIHNlbGVjdG9yKSB7XG5cdGNvbnN0IG93bmVyRG9jdW1lbnQgPSBlbGVtZW50LmRvY3VtZW50IHx8IGVsZW1lbnQub3duZXJEb2N1bWVudCB8fCBjdXJyZW50V2luZG93LmRvY3VtZW50O1xuXHRjb25zdCBtYXRjaGVkID0gb3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zb21lLmNhbGwobWF0Y2hlZCwgaXRlbSA9PiBpdGVtID09PSBlbGVtZW50KTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGltaXRhdGlvbiBvZiB0aGUgb3JpZ2luYWwgRXZlbnQgb2JqZWN0IGJ1dCB3aXRoIHNwZWNpZmllZCBjdXJyZW50VGFyZ2V0LlxuICogQHBhcmFtIHtFdmVudH0gZXZlbnQgT3JpZ2luYWwgZXZlbnQgb2JqZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VycmVudFRhcmdldEdldHRlciBHZXR0ZXIgZm9yIHRoZSBjdXJyZW50VGFyZ2V0LlxuICogQHJldHVybnMge0V2ZW50fSBXcmFwcGVkIGV2ZW50LlxuICovXG5mdW5jdGlvbiBjcmVhdGVDdXN0b21FdmVudChldmVudCwgY3VycmVudFRhcmdldEdldHRlcikge1xuXHRjb25zdCBjYXRFdmVudCA9IE9iamVjdC5jcmVhdGUoZXZlbnQpO1xuXHRjb25zdCBrZXlzID0gW107XG5cdGNvbnN0IHByb3BlcnRpZXMgPSB7fTtcblxuXHQvKiBlc2xpbnQgZ3VhcmQtZm9yLWluOiAwICovXG5cdGZvciAoY29uc3Qga2V5IGluIGV2ZW50KSB7XG5cdFx0a2V5cy5wdXNoKGtleSk7XG5cdH1cblx0a2V5cy5mb3JFYWNoKGtleSA9PiB7XG5cdFx0aWYgKHR5cGVvZiAoZXZlbnRba2V5XSkgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHByb3BlcnRpZXNba2V5XSA9IHtcblx0XHRcdFx0Z2V0OiAoKSA9PiBldmVudFtrZXldLmJpbmQoZXZlbnQpXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHByb3BlcnRpZXNba2V5XSA9IHtcblx0XHRcdGdldDogKCkgPT4gZXZlbnRba2V5XSxcblx0XHRcdHNldDogdmFsdWUgPT4ge1xuXHRcdFx0XHRldmVudFtrZXldID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG5cblx0cHJvcGVydGllcy5jdXJyZW50VGFyZ2V0ID0ge1xuXHRcdGdldDogY3VycmVudFRhcmdldEdldHRlclxuXHR9O1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyhjYXRFdmVudCwgcHJvcGVydGllcyk7XG5cdE9iamVjdC5zZWFsKGNhdEV2ZW50KTtcblx0T2JqZWN0LmZyZWV6ZShjYXRFdmVudCk7XG5cdHJldHVybiBjYXRFdmVudDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgd2UgY2FuIG11dGF0ZSB0aGUgc3BlY2lmaWVkIEhUTUwgdGFnLlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IFRoZSBET00gZWxlbWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGVsZW1lbnQgc2hvdWxkIG5vdCBiZSBtdXRhdGVkLlxuICovXG5mdW5jdGlvbiBpc1RhZ0ltbXV0YWJsZShlbGVtZW50KSB7XG5cdC8vIHRoZXNlIDMga2luZHMgb2YgdGFncyBvbmNlIGxvYWRlZCBjYW4gbm90IGJlIHJlbW92ZWRcblx0Ly8gb3RoZXJ3aXNlIGl0IHdpbGwgY2F1c2Ugc3R5bGUgb3Igc2NyaXB0IHJlbG9hZGluZ1xuXHRyZXR1cm4gZWxlbWVudC5ub2RlTmFtZSA9PT0gVEFHX05BTUVTLlNDUklQVCB8fFxuXHRcdGVsZW1lbnQubm9kZU5hbWUgPT09IFRBR19OQU1FUy5TVFlMRSB8fFxuXHRcdGVsZW1lbnQubm9kZU5hbWUgPT09IFRBR19OQU1FUy5MSU5LICYmXG5cdFx0ZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3JlbCcpID09PSAnc3R5bGVzaGVldCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRG9jdW1lbnRSZW5kZXJlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgVVJJID0gcmVxdWlyZSgnY2F0YmVycnktdXJpJykuVVJJO1xuXG5jb25zdCBNT1VTRV9QUklNQVJZX0tFWSA9IDA7XG5jb25zdCBIUkVGX0FUVFJJQlVURV9OQU1FID0gJ2hyZWYnO1xuY29uc3QgVEFSR0VUX0FUVFJJQlVURV9OQU1FID0gJ3RhcmdldCc7XG5jb25zdCBBX1RBR19OQU1FID0gJ0EnO1xuY29uc3QgQk9EWV9UQUdfTkFNRSA9ICdCT0RZJztcblxuY2xhc3MgUmVxdWVzdFJvdXRlciB7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIGJyb3dzZXIgcmVxdWVzdCByb3V0ZXIuXG5cdCAqIEBwYXJhbSB7U2VydmljZUxvY2F0b3J9IGxvY2F0b3IgVGhlIHNlcnZpY2UgbG9jYXRvciBmb3IgcmVzb2x2aW5nIGRlcGVuZGVuY2llcy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGxvY2F0b3IpIHtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgZXZlbnQgYnVzLlxuXHRcdCAqIEB0eXBlIHtFdmVudEVtaXR0ZXJ9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9ldmVudEJ1cyA9IGxvY2F0b3IucmVzb2x2ZSgnZXZlbnRCdXMnKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgYnJvd3NlciB3aW5kb3cuXG5cdFx0ICogQHR5cGUge1dpbmRvd31cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX3dpbmRvdyA9IGxvY2F0b3IucmVzb2x2ZSgnd2luZG93Jyk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IGRvY3VtZW50IHJlbmRlcmVyLlxuXHRcdCAqIEB0eXBlIHtEb2N1bWVudFJlbmRlcmVyfVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fZG9jdW1lbnRSZW5kZXJlciA9IGxvY2F0b3IucmVzb2x2ZSgnZG9jdW1lbnRSZW5kZXJlcicpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBzdGF0ZSBwcm92aWRlci5cblx0XHQgKiBAdHlwZSB7U3RhdGVQcm92aWRlcn1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX3N0YXRlUHJvdmlkZXIgPSBsb2NhdG9yLnJlc29sdmUoJ3N0YXRlUHJvdmlkZXInKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgY29udGV4dCBmYWN0b3J5LlxuXHRcdCAqIEB0eXBlIHtDb250ZXh0RmFjdG9yeX1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX2NvbnRleHRGYWN0b3J5ID0gbG9jYXRvci5yZXNvbHZlKCdjb250ZXh0RmFjdG9yeScpO1xuXG5cdFx0LyoqXG5cdFx0ICogVHJ1ZSBpZiBjdXJyZW50IGJyb3dzZXIgc3VwcG9ydHMgaGlzdG9yeSBBUEkuXG5cdFx0ICogQHR5cGUge2Jvb2xlYW59XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9pc0hpc3RvcnlTdXBwb3J0ZWQgPSB0aGlzLl93aW5kb3cuaGlzdG9yeSAmJlxuXHRcdFx0dGhpcy5fd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlIGluc3RhbmNlb2YgRnVuY3Rpb247XG5cblx0XHQvLyBhZGQgZXZlbnQgaGFuZGxlcnNcblx0XHR0aGlzLl93cmFwRG9jdW1lbnQoKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgbG9jYXRpb24uXG5cdFx0ICogQHR5cGUge1VSSX1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX2xvY2F0aW9uID0gbmV3IFVSSSh0aGlzLl93aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKSk7XG5cblx0XHQvLyBzZXQgaW5pdGlhbCBzdGF0ZSBmcm9tIGN1cnJlbnQgVVJJXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBzdGF0ZS5cblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fc3RhdGUgPSB0aGlzLl9zdGF0ZVByb3ZpZGVyLmdldFN0YXRlQnlVcmkodGhpcy5fbG9jYXRpb24pO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBpbml0aWFsaXphdGlvbiBmbGFnLlxuXHRcdCAqIEB0eXBlIHtib29sZWFufVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5faXNTdGF0ZUluaXRpYWxpemVkID0gZmFsc2U7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHJlZmVycmVyLlxuXHRcdCAqIEB0eXBlIHtVUkl9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9yZWZlcnJlciA9ICcnO1xuXG5cdFx0dGhpcy5fY2hhbmdlU3RhdGUodGhpcy5fc3RhdGUpXG5cdFx0XHQuY2F0Y2gocmVhc29uID0+IHRoaXMuX2hhbmRsZUVycm9yKHJlYXNvbikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgYW4gYXBwbGljYXRpb24gc3RhdGUgZm9yIHRoZSBzcGVjaWZpZWQgVVJJLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb25TdHJpbmcgVVJJIHRvIGdvLlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW4/fSBpc0hpc3RvcnlBY3Rpb24gSWYgaXQncyBhIGJhY2sgb3IgZm9yd2FyZCBoaXN0b3J5IGFjdGlvbi5cblx0ICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgZm9yIG5vdGhpbmcuXG5cdCAqL1xuXHQvKiBlc2xpbnQgY29tcGxleGl0eTogMCAqL1xuXHRnbyhsb2NhdGlvblN0cmluZywgaXNIaXN0b3J5QWN0aW9uKSB7XG5cblx0XHQvLyB3ZSBtdXN0IGltbWVkaWF0ZWx5IGNoYW5nZSB0aGUgVVJMLCB0aGVyZWZvcmUgdGhpcyBtZXRob2QgaXMgc3luY2hyb25vdXNcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgbmV3TG9jYXRpb24gPSAobmV3IFVSSShsb2NhdGlvblN0cmluZykpLnJlc29sdmVSZWxhdGl2ZSh0aGlzLl9sb2NhdGlvbik7XG5cdFx0XHRjb25zdCBuZXdMb2NhdGlvblN0cmluZyA9IG5ld0xvY2F0aW9uLnRvU3RyaW5nKCk7XG5cblx0XHRcdGNvbnN0IGN1cnJlbnRBdXRob3JpdHkgPSB0aGlzLl9sb2NhdGlvbi5hdXRob3JpdHkgP1xuXHRcdFx0XHR0aGlzLl9sb2NhdGlvbi5hdXRob3JpdHkudG9TdHJpbmcoKSA6IG51bGw7XG5cdFx0XHRjb25zdCBuZXdBdXRob3JpdHkgPSBuZXdMb2NhdGlvbi5hdXRob3JpdHkgP1xuXHRcdFx0XHRuZXdMb2NhdGlvbi5hdXRob3JpdHkudG9TdHJpbmcoKSA6IG51bGw7XG5cblx0XHRcdC8vIHdlIG11c3QgY2hlY2sgaWYgaGlzdG9yeSBBUEkgaXMgc3VwcG9ydGVkIG9yIGlmIHRoaXMgaXMgYW4gZXh0ZXJuYWwgbGlua1xuXHRcdFx0Ly8gYmVmb3JlIG1hcHBpbmcgVVJJIHRvIGludGVybmFsIGFwcGxpY2F0aW9uIHN0YXRlXG5cdFx0XHRpZiAoIXRoaXMuX2lzSGlzdG9yeVN1cHBvcnRlZCB8fFxuXHRcdFx0XHRuZXdMb2NhdGlvbi5zY2hlbWUgIT09IHRoaXMuX2xvY2F0aW9uLnNjaGVtZSB8fFxuXHRcdFx0XHRuZXdBdXRob3JpdHkgIT09IGN1cnJlbnRBdXRob3JpdHkpIHtcblx0XHRcdFx0dGhpcy5fd2luZG93LmxvY2F0aW9uLmFzc2lnbihuZXdMb2NhdGlvblN0cmluZyk7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gaWYgb25seSBVUkkgZnJhZ21lbnQgaXMgY2hhbmdlZCB3ZSBkb24ndCBuZWVkIHRvIHVwZGF0ZVxuXHRcdFx0Ly8gdGhlIHdob2xlIHN0YXRlIG9mIHRoZSBhcHBcblx0XHRcdGNvbnN0IG5ld1F1ZXJ5ID0gbmV3TG9jYXRpb24ucXVlcnkgP1xuXHRcdFx0XHRuZXdMb2NhdGlvbi5xdWVyeS50b1N0cmluZygpIDogbnVsbDtcblx0XHRcdGNvbnN0IGN1cnJlbnRRdWVyeSA9IHRoaXMuX2xvY2F0aW9uLnF1ZXJ5ID9cblx0XHRcdFx0dGhpcy5fbG9jYXRpb24ucXVlcnkudG9TdHJpbmcoKSA6IG51bGw7XG5cblx0XHRcdGlmIChuZXdMb2NhdGlvbi5wYXRoID09PSB0aGlzLl9sb2NhdGlvbi5wYXRoICYmXHRuZXdRdWVyeSA9PT0gY3VycmVudFF1ZXJ5KSB7XG5cdFx0XHRcdHRoaXMuX2xvY2F0aW9uID0gbmV3TG9jYXRpb247XG5cdFx0XHRcdHRoaXMuX3dpbmRvdy5sb2NhdGlvbi5oYXNoID0gdGhpcy5fbG9jYXRpb24uZnJhZ21lbnQgfHwgJyc7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc3RhdGUgPSB0aGlzLl9zdGF0ZVByb3ZpZGVyLmdldFN0YXRlQnlVcmkobmV3TG9jYXRpb24pO1xuXHRcdFx0aWYgKCFzdGF0ZSkge1xuXHRcdFx0XHR0aGlzLl93aW5kb3cubG9jYXRpb24uYXNzaWduKG5ld0xvY2F0aW9uU3RyaW5nKTtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuXHRcdFx0dGhpcy5fcmVmZXJyZXIgPSB0aGlzLl9sb2NhdGlvbjtcblx0XHRcdHRoaXMuX2xvY2F0aW9uID0gbmV3TG9jYXRpb247XG5cblx0XHRcdGlmICghaXNIaXN0b3J5QWN0aW9uKSB7XG5cdFx0XHRcdHRoaXMuX3dpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZSwgJycsIG5ld0xvY2F0aW9uU3RyaW5nKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXMuX2NoYW5nZVN0YXRlKHN0YXRlKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIENoYW5nZXMgdGhlIGN1cnJlbnQgYXBwbGljYXRpb24gc3RhdGUgd2l0aCB0aGUgbmV3IGxvY2F0aW9uLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc3RhdGUgTmV3IHN0YXRlLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSBmb3Igbm90aGluZy5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9jaGFuZ2VTdGF0ZShzdGF0ZSkge1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuXHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHQvLyBmb3IgXCJub3QgZm91bmRcIiBzdGF0ZVxuXHRcdFx0XHRpZiAoc3RhdGUgPT09IG51bGwpIHtcblx0XHRcdFx0XHR0aGlzLl93aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCByb3V0aW5nQ29udGV4dCA9IHRoaXMuX2NvbnRleHRGYWN0b3J5LmNyZWF0ZSh7XG5cdFx0XHRcdFx0cmVmZXJyZXI6IHRoaXMuX3JlZmVycmVyIHx8IHRoaXMuX3dpbmRvdy5kb2N1bWVudC5yZWZlcnJlcixcblx0XHRcdFx0XHRsb2NhdGlvbjogdGhpcy5fbG9jYXRpb24sXG5cdFx0XHRcdFx0dXNlckFnZW50OiB0aGlzLl93aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRpZiAoIXRoaXMuX2lzU3RhdGVJbml0aWFsaXplZCkge1xuXHRcdFx0XHRcdHRoaXMuX2lzU3RhdGVJbml0aWFsaXplZCA9IHRydWU7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuX2RvY3VtZW50UmVuZGVyZXIuaW5pdFdpdGhTdGF0ZShzdGF0ZSwgcm91dGluZ0NvbnRleHQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRoaXMuX2RvY3VtZW50UmVuZGVyZXIucmVuZGVyKHN0YXRlLCByb3V0aW5nQ29udGV4dCk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXcmFwcyB0aGUgZG9jdW1lbnQgd2l0aCByZXF1aXJlZCBldmVudHMgdG8gcm91dGUgcmVxdWVzdHMuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfd3JhcERvY3VtZW50KCkge1xuXHRcdGlmICghdGhpcy5faXNIaXN0b3J5U3VwcG9ydGVkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gYmVjYXVzZSBub3cgbG9jYXRpb24gd2FzIG5vdCBjaGFuZ2UgeWV0IGFuZFxuXHRcdC8vIGRpZmZlcmVudCBicm93c2VycyBoYW5kbGUgYHBvcHN0YXRlYCBkaWZmZXJlbnRseVxuXHRcdC8vIHdlIG5lZWQgdG8gZG8gcm91dGUgaW4gbmV4dCBpdGVyYXRpb24gb2YgZXZlbnQgbG9vcFxuXHRcdHRoaXMuX3dpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsICgpID0+XG5cdFx0XHRQcm9taXNlLnJlc29sdmUoKVxuXHRcdFx0XHQudGhlbigoKSA9PiB0aGlzLmdvKHRoaXMuX3dpbmRvdy5sb2NhdGlvbi50b1N0cmluZygpLCB0cnVlKSlcblx0XHRcdFx0LmNhdGNoKHJlYXNvbiA9PiB0aGlzLl9oYW5kbGVFcnJvcihyZWFzb24pKVxuXHRcdCk7XG5cblx0XHR0aGlzLl93aW5kb3cuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcblx0XHRcdGlmIChldmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmIChldmVudC50YXJnZXQudGFnTmFtZSA9PT0gQV9UQUdfTkFNRSkge1xuXHRcdFx0XHR0aGlzLl9saW5rQ2xpY2tIYW5kbGVyKGV2ZW50LCBldmVudC50YXJnZXQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgbGluayA9IGNsb3Nlc3RMaW5rKGV2ZW50LnRhcmdldCk7XG5cdFx0XHRcdGlmICghbGluaykge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9saW5rQ2xpY2tIYW5kbGVyKGV2ZW50LCBsaW5rKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVzIGEgbGluayBjbGljayBvbiB0aGUgcGFnZS5cblx0ICogQHBhcmFtIHtFdmVudH0gZXZlbnQgRXZlbnQtcmVsYXRlZCBvYmplY3QuXG5cdCAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBMaW5rIGVsZW1lbnQuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfbGlua0NsaWNrSGFuZGxlcihldmVudCwgZWxlbWVudCkge1xuXHRcdGNvbnN0IHRhcmdldEF0dHJpYnV0ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFRBUkdFVF9BVFRSSUJVVEVfTkFNRSk7XG5cdFx0aWYgKHRhcmdldEF0dHJpYnV0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIGlmIG1pZGRsZSBtb3VzZSBidXR0b24gd2FzIGNsaWNrZWRcblx0XHRpZiAoZXZlbnQuYnV0dG9uICE9PSBNT1VTRV9QUklNQVJZX0tFWSB8fFxuXHRcdFx0ZXZlbnQuY3RybEtleSB8fCBldmVudC5hbHRLZXkgfHwgZXZlbnQuc2hpZnRLZXkgfHwgZXZlbnQubWV0YUtleSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGxvY2F0aW9uU3RyaW5nID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoSFJFRl9BVFRSSUJVVEVfTkFNRSk7XG5cdFx0aWYgKCFsb2NhdGlvblN0cmluZykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dGhpcy5nbyhsb2NhdGlvblN0cmluZylcblx0XHRcdC5jYXRjaChyZWFzb24gPT4gdGhpcy5faGFuZGxlRXJyb3IocmVhc29uKSk7XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyBhbGwgZXJyb3JzLlxuXHQgKiBAcGFyYW0ge0Vycm9yfSBlcnJvciBFcnJvciB0byBoYW5kbGUuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfaGFuZGxlRXJyb3IoZXJyb3IpIHtcblx0XHR0aGlzLl9ldmVudEJ1cy5lbWl0KCdlcnJvcicsIGVycm9yKTtcblx0fVxufVxuXG4vKipcbiAqIEZpbmRzIHRoZSBjbG9zZXN0IGFzY2VuZGluZyBcIkFcIiBlbGVtZW50IG5vZGUuXG4gKiBAcGFyYW0ge05vZGV9IGVsZW1lbnQgRE9NIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7Tm9kZXxudWxsfSBUaGUgY2xvc2VzdCBcIkFcIiBlbGVtZW50IG9yIG51bGwuXG4gKi9cbmZ1bmN0aW9uIGNsb3Nlc3RMaW5rKGVsZW1lbnQpIHtcblx0d2hpbGUgKGVsZW1lbnQgJiYgZWxlbWVudC5ub2RlTmFtZSAhPT0gQV9UQUdfTkFNRSAmJlxuXHRcdGVsZW1lbnQubm9kZU5hbWUgIT09IEJPRFlfVEFHX05BTUUpIHtcblx0XHRlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuXHR9XG5cdHJldHVybiBlbGVtZW50ICYmIGVsZW1lbnQubm9kZU5hbWUgPT09IEFfVEFHX05BTUUgPyBlbGVtZW50IDogbnVsbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXF1ZXN0Um91dGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuXHQvKipcblx0ICogR2V0cyB0aGUgaGlnaCByZXNvbHV0aW9uIHRpbWUgb3IgdGhlIGRpZmZlcmVuY2UgYmV0d2VlblxuXHQgKiBwcmV2aW91cyBhbmQgY3VycmVudCB0aW1lLlxuXHQgKiBAcGFyYW0ge0FycmF5P30gUHJldmlvdXMgaGlnaCByZXNvbHV0aW9uIHRpbWVzdGFtcC5cblx0ICogQHJldHVybnMge0FycmF5fSBUaGUgaGlnaCByZXNvbHV0aW9uIHRpbWUuXG5cdCAqL1xuXHRnZXQ6IHJlcXVpcmUoJ2Jyb3dzZXItcHJvY2Vzcy1ocnRpbWUnKSxcblxuXHQvKipcblx0ICogQ29udmVydHMgdGhlIGhpZ2ggcmVzb2x1dGlvbiB0aW1lc3RhbXAgdG8gdGV4dCBtZXNzYWdlLlxuXHQgKiBAcGFyYW0ge0FycmF5fVxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaW1lIG1lc3NhZ2UuXG5cdCAqL1xuXHR0b01lc3NhZ2U6IHJlcXVpcmUoJ3ByZXR0eS1ocnRpbWUnKSxcblxuXHQvKipcblx0ICogQ29udmVydHMgaGlnaCByZXNvbHV0aW9uIHRpbWUgdG8gbWlsbGlzZWNvbmRzIG51bWJlci5cblx0ICogQHBhcmFtIHtBcnJheX0gaHJUaW1lIEhpZ2ggcmVzb2x1dGlvbiB0aW1lIHR1cGxlLlxuXHQgKi9cblx0dG9NaWxsaXNlY29uZHM6IGhyVGltZSA9PiBoclRpbWVbMF0gKiAxZTMgKyBNYXRoLnJvdW5kKGhyVGltZVsxXSAvIDFlNilcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IG1vZHVsZUhlbHBlciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9oZWxwZXJzL21vZHVsZUhlbHBlcicpO1xuY29uc3QgdGVtcGxhdGVIZWxwZXIgPSByZXF1aXJlKCcuLi8uLi9saWIvaGVscGVycy90ZW1wbGF0ZUhlbHBlcicpO1xuY29uc3QgTG9hZGVyQmFzZSA9IHJlcXVpcmUoJy4uLy4uL2xpYi9iYXNlL0xvYWRlckJhc2UnKTtcblxuY2xhc3MgQ29tcG9uZW50TG9hZGVyIGV4dGVuZHMgTG9hZGVyQmFzZSB7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudCBsb2FkZXIuXG5cdCAqIEBwYXJhbSB7U2VydmljZUxvY2F0b3J9IGxvY2F0b3IgVGhlIHNlcnZpY2UgbG9jYXRvciBmb3IgcmVzb2x2aW5nIGRlcGVuZGVuY2llcy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGxvY2F0b3IpIHtcblx0XHR2YXIgY29tcG9uZW50VHJhbnNmb3Jtcztcblx0XHR0cnkge1xuXHRcdFx0Y29tcG9uZW50VHJhbnNmb3JtcyA9IGxvY2F0b3IucmVzb2x2ZUFsbCgnY29tcG9uZW50VHJhbnNmb3JtJyk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Y29tcG9uZW50VHJhbnNmb3JtcyA9IFtdO1xuXHRcdH1cblx0XHRzdXBlcihsb2NhdG9yLCBjb21wb25lbnRUcmFuc2Zvcm1zKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgc2VydmljZSBsb2NhdG9yLlxuXHRcdCAqIEB0eXBlIHtTZXJ2aWNlTG9jYXRvcn1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX3NlcnZpY2VMb2NhdG9yID0gbG9jYXRvcjtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgZXZlbnQgYnVzLlxuXHRcdCAqIEB0eXBlIHtFdmVudEVtaXR0ZXJ9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9ldmVudEJ1cyA9IGxvY2F0b3IucmVzb2x2ZSgnZXZlbnRCdXMnKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgdGVtcGxhdGUgcHJvdmlkZXIgbWFwLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl90ZW1wbGF0ZVByb3ZpZGVyc0J5TmFtZXMgPSB0ZW1wbGF0ZUhlbHBlclxuXHRcdFx0LnJlc29sdmVUZW1wbGF0ZVByb3ZpZGVyc0J5TmFtZXMobG9jYXRvcik7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IG1hcCBvZiBsb2FkZWQgY29tcG9uZW50cyBieSBuYW1lcy5cblx0XHQgKiBAdHlwZSB7T2JqZWN0fSBNYXAgb2YgY29tcG9uZW50cyBieSBuYW1lcy5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX2xvYWRlZENvbXBvbmVudHMgPSBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIExvYWRzIGNvbXBvbmVudHMgaW5zaWRlIHRoZSBicm93c2VyIGJ1bmRsZS5cblx0ICogQHJldHVybnMge1Byb21pc2U8T2JqZWN0Pn0gVGhlIHByb21pc2UgZm9yIGxvYWRlZCBjb21wb25lbnRzLlxuXHQgKi9cblx0bG9hZCgpIHtcblx0XHRpZiAodGhpcy5fbG9hZGVkQ29tcG9uZW50cykge1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9sb2FkZWRDb21wb25lbnRzKTtcblx0XHR9XG5cblx0XHR0aGlzLl9sb2FkZWRDb21wb25lbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuXHRcdFx0LnRoZW4oKCkgPT4gdGhpcy5fc2VydmljZUxvY2F0b3IucmVzb2x2ZUFsbCgnY29tcG9uZW50JykpXG5cdFx0XHQuY2F0Y2goKCkgPT4gW10pXG5cdFx0XHQudGhlbihjb21wb25lbnRzID0+IHtcblx0XHRcdFx0Y29uc3QgY29tcG9uZW50UHJvbWlzZXMgPSBbXTtcblx0XHRcdFx0Ly8gdGhlIGxpc3QgaXMgYSBzdGFjaywgd2Ugc2hvdWxkIHJldmVyc2UgaXRcblx0XHRcdFx0Y29tcG9uZW50cy5mb3JFYWNoKGNvbXBvbmVudCA9PiB7XG5cdFx0XHRcdFx0aWYgKCFjb21wb25lbnQgfHwgdHlwZW9mIChjb21wb25lbnQpICE9PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjb21wb25lbnRQcm9taXNlcy51bnNoaWZ0KHRoaXMuX3Byb2Nlc3NDb21wb25lbnQoY29tcG9uZW50KSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoY29tcG9uZW50UHJvbWlzZXMpO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKGNvbXBvbmVudHMgPT4ge1xuXHRcdFx0XHRjb21wb25lbnRzLmZvckVhY2goY29tcG9uZW50ID0+IHtcblx0XHRcdFx0XHRpZiAoIWNvbXBvbmVudCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLl9sb2FkZWRDb21wb25lbnRzW2NvbXBvbmVudC5uYW1lXSA9IGNvbXBvbmVudDtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMuX2V2ZW50QnVzLmVtaXQoJ2FsbENvbXBvbmVudHNMb2FkZWQnLCBjb21wb25lbnRzKTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2xvYWRlZENvbXBvbmVudHM7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQcm9jZXNzZXMgYSBjb21wb25lbnQgYW5kIGFwcGxpZXMgcmVxdWlyZWQgb3BlcmF0aW9ucy5cblx0ICogQHBhcmFtIHtPYmplY3R9IGNvbXBvbmVudERldGFpbHMgVGhlIGxvYWRlZCBjb21wb25lbnQgZGV0YWlscy5cblx0ICogQHJldHVybnMge1Byb21pc2U8T2JqZWN0Pn0gVGhlIHByb21pc2UgZm9yIHRoZSBjb21wb25lbnQgb2JqZWN0LlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X3Byb2Nlc3NDb21wb25lbnQoY29tcG9uZW50RGV0YWlscykge1xuXHRcdHZhciBjb21wb25lbnQgPSBPYmplY3QuY3JlYXRlKGNvbXBvbmVudERldGFpbHMpO1xuXG5cdFx0cmV0dXJuIHRoaXMuX2FwcGx5VHJhbnNmb3Jtcyhjb21wb25lbnQpXG5cdFx0XHQudGhlbih0cmFuc2Zvcm1lZCA9PiB7XG5cdFx0XHRcdGlmICghdHJhbnNmb3JtZWQpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFRyYW5zZm9ybWF0aW9uIGZvciB0aGUgXCIke2NvbXBvbmVudERldGFpbHMubmFtZX1cIiBjb21wb25lbnQgcmV0dXJuZWQgYSBiYWQgcmVzdWx0YCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29tcG9uZW50ID0gT2JqZWN0LmNyZWF0ZSh0cmFuc2Zvcm1lZCk7XG5cdFx0XHRcdGNvbXBvbmVudC50ZW1wbGF0ZVByb3ZpZGVyID0gdGhpcy5fdGVtcGxhdGVQcm92aWRlcnNCeU5hbWVzW2NvbXBvbmVudC50ZW1wbGF0ZVByb3ZpZGVyTmFtZV07XG5cdFx0XHRcdGNvbXBvbmVudC5lcnJvclRlbXBsYXRlUHJvdmlkZXIgPSB0aGlzLl90ZW1wbGF0ZVByb3ZpZGVyc0J5TmFtZXNbY29tcG9uZW50LmVycm9yVGVtcGxhdGVQcm92aWRlck5hbWVdO1xuXG5cdFx0XHRcdGlmICghY29tcG9uZW50LnRlbXBsYXRlUHJvdmlkZXIgJiZcblx0XHRcdFx0XHRcdChjb21wb25lbnQuZXJyb3JUZW1wbGF0ZVByb3ZpZGVyTmFtZSAmJiAhY29tcG9uZW50LmVycm9yVGVtcGxhdGVQcm92aWRlcikpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFRlbXBsYXRlIHByb3ZpZGVyIHJlcXVpcmVkIGJ5IHRoZSBjb21wb25lbnQgXCIke2NvbXBvbmVudC5uYW1lfVwiIG5vdCBmb3VuZGApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGVtcGxhdGVIZWxwZXIucmVnaXN0ZXJUZW1wbGF0ZXMoY29tcG9uZW50KTtcblxuXHRcdFx0XHR0aGlzLl9ldmVudEJ1cy5lbWl0KCdjb21wb25lbnRMb2FkZWQnLCBjb21wb25lbnQpO1xuXHRcdFx0XHRyZXR1cm4gY29tcG9uZW50O1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChyZWFzb24gPT4ge1xuXHRcdFx0XHR0aGlzLl9ldmVudEJ1cy5lbWl0KCdlcnJvcicsIHJlYXNvbik7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBhIG1hcCBvZiBjb21wb25lbnRzIGJ5IHRoZWlyIG5hbWVzLlxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgbWFwIG9mIHRoZSBjb21wb25lbnRzIGJ5IHRoZWlyIG5hbWVzLlxuXHQgKi9cblx0Z2V0Q29tcG9uZW50c0J5TmFtZXMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2xvYWRlZENvbXBvbmVudHMgfHwgT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudExvYWRlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgTG9hZGVyQmFzZSA9IHJlcXVpcmUoJy4uLy4uL2xpYi9iYXNlL0xvYWRlckJhc2UnKTtcblxuY2xhc3MgU3RvcmVMb2FkZXIgZXh0ZW5kcyBMb2FkZXJCYXNlIHtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgc3RvcmUgbG9hZGVyLlxuXHQgKiBAcGFyYW0ge1NlcnZpY2VMb2NhdG9yfSBsb2NhdG9yIFRoZSBzZXJ2aWNlIGxvY2F0b3IgZm9yIHJlc29sdmluZyBzdG9yZXMuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihsb2NhdG9yKSB7XG5cdFx0dmFyIHN0b3JlVHJhbnNmb3Jtcztcblx0XHR0cnkge1xuXHRcdFx0c3RvcmVUcmFuc2Zvcm1zID0gbG9jYXRvci5yZXNvbHZlQWxsKCdzdG9yZVRyYW5zZm9ybScpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdHN0b3JlVHJhbnNmb3JtcyA9IFtdO1xuXHRcdH1cblx0XHRzdXBlcihsb2NhdG9yLCBzdG9yZVRyYW5zZm9ybXMpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBzZXJ2aWNlIGxvY2F0b3IuXG5cdFx0ICogQHR5cGUge1NlcnZpY2VMb2NhdG9yfVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fc2VydmljZUxvY2F0b3IgPSBsb2NhdG9yO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBldmVudCBidXMuXG5cdFx0ICogQHR5cGUge0V2ZW50RW1pdHRlcn1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX2V2ZW50QnVzID0gbG9jYXRvci5yZXNvbHZlKCdldmVudEJ1cycpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBzZXQgb2YgbG9hZGVkIHN0b3Jlcy5cblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fbG9hZGVkU3RvcmVzID0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBMb2FkcyBhbGwgc3RvcmVzIGluc2lkZSB0aGUgYnJvd3NlciBidW5kbGUuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlPE9iamVjdD59IFRoZSBwcm9taXNlIGxvYWRlZCBzdG9yZXMuXG5cdCAqL1xuXHRsb2FkKCkge1xuXHRcdGlmICh0aGlzLl9sb2FkZWRTdG9yZXMpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fbG9hZGVkU3RvcmVzKTtcblx0XHR9XG5cblx0XHR0aGlzLl9sb2FkZWRTdG9yZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG5cdFx0XHQudGhlbigoKSA9PiB0aGlzLl9zZXJ2aWNlTG9jYXRvci5yZXNvbHZlQWxsKCdzdG9yZScpKVxuXHRcdFx0LmNhdGNoKCgpID0+IFtdKVxuXHRcdFx0LnRoZW4oc3RvcmVzID0+IHtcblx0XHRcdFx0Y29uc3Qgc3RvcmVQcm9taXNlcyA9IFtdO1xuXHRcdFx0XHQvLyB0aGUgbGlzdCBpcyBhIHN0YWNrLCB3ZSBzaG91bGQgcmV2ZXJzZSBpdFxuXHRcdFx0XHRzdG9yZXMuZm9yRWFjaChzdG9yZSA9PiB7XG5cdFx0XHRcdFx0aWYgKCFzdG9yZSB8fCB0eXBlb2YgKHN0b3JlKSAhPT0gJ29iamVjdCcpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3RvcmVQcm9taXNlcy51bnNoaWZ0KHRoaXMuX2dldFN0b3JlKHN0b3JlKSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoc3RvcmVQcm9taXNlcyk7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oc3RvcmVzID0+IHtcblx0XHRcdFx0c3RvcmVzLmZvckVhY2goc3RvcmUgPT4ge1xuXHRcdFx0XHRcdGlmICghc3RvcmUpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fbG9hZGVkU3RvcmVzW3N0b3JlLm5hbWVdID0gc3RvcmU7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0aGlzLl9ldmVudEJ1cy5lbWl0KCdhbGxTdG9yZXNMb2FkZWQnLCB0aGlzLl9sb2FkZWRTdG9yZXMpO1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2xvYWRlZFN0b3Jlcyk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGFzdG9yZSBmcm9tIHN0b3JlIGRldGFpbHMuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzdG9yZURldGFpbHMgVGhlIHN0b3JlIGRldGFpbHMuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlPE9iamVjdD59IFRoZSBwcm9taXNlIGZvciB0aGUgc3RvcmUuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfZ2V0U3RvcmUoc3RvcmVEZXRhaWxzKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2FwcGx5VHJhbnNmb3JtcyhzdG9yZURldGFpbHMpXG5cdFx0XHQudGhlbih0cmFuc2Zvcm1lZCA9PiB7XG5cdFx0XHRcdGlmICghdHJhbnNmb3JtZWQpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFRyYW5zZm9ybWF0aW9uIGZvciB0aGUgXCIke3N0b3JlRGV0YWlscy5uYW1lfVwiIHN0b3JlIHJldHVybmVkIGEgYmFkIHJlc3VsdGApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX2V2ZW50QnVzLmVtaXQoJ3N0b3JlTG9hZGVkJywgdHJhbnNmb3JtZWQpO1xuXHRcdFx0XHRyZXR1cm4gdHJhbnNmb3JtZWQ7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKHJlYXNvbiA9PiB7XG5cdFx0XHRcdHRoaXMuX2V2ZW50QnVzLmVtaXQoJ2Vycm9yJywgcmVhc29uKTtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGEgc3RvcmVzIG1hcCBieSB0aGVpciBuYW1lcy5cblx0ICogQHJldHVybnMge09iamVjdH0gVGhlIG1hcCBvZiBzdG9yZXMgYnkgdGhlaXIgbmFtZXMuXG5cdCAqL1xuXHRnZXRTdG9yZXNCeU5hbWVzKCkge1xuXHRcdHJldHVybiB0aGlzLl9sb2FkZWRTdG9yZXMgfHwgT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0b3JlTG9hZGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBwcm9wZXJ0eUhlbHBlciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9oZWxwZXJzL3Byb3BlcnR5SGVscGVyJyk7XG5jb25zdCBNb2R1bGVBcGlQcm92aWRlckJhc2UgPSByZXF1aXJlKCcuLi8uLi9saWIvYmFzZS9Nb2R1bGVBcGlQcm92aWRlckJhc2UnKTtcblxuY2xhc3MgTW9kdWxlQXBpUHJvdmlkZXIgZXh0ZW5kcyBNb2R1bGVBcGlQcm92aWRlckJhc2Uge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBtb2R1bGUgQVBJIHByb3ZpZGVyLlxuXHQgKiBAcGFyYW0ge1NlcnZpY2VMb2NhdG9yfSBsb2NhdG9yIFRoZSBzZXJ2aWNlIGxvY2F0b3IgZm9yIHJlc29sdmluZyBkZXBlbmRlbmNpZXMuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihsb2NhdG9yKSB7XG5cdFx0c3VwZXIobG9jYXRvcik7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0cnVlIGJlY2F1c2Ugd29ya3MgaW4gYSBicm93c2VyLlxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0ICovXG5cdGdldCBpc0Jyb3dzZXIoKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBmYWxzZSBiZWNhdXNlIHdvcmtzIGluIGEgYnJvd3Nlci5cblx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdCAqL1xuXHRnZXQgaXNTZXJ2ZXIoKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbG9hZHMgdGhlIHBhZ2UgZm9yIGhhbmRsaW5nIFwibm90IGZvdW5kXCIgZXJyb3IuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIGZvciBub3RoaW5nLlxuXHQgKi9cblx0bm90Rm91bmQoKSB7XG5cdFx0Y29uc3Qgd2luZG93ID0gdGhpcy5sb2NhdG9yLnJlc29sdmUoJ3dpbmRvdycpO1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdH1cblxuXHQvKipcblx0ICogUmVkaXJlY3RzIGN1cnJlbnQgcGFnZSB0byBzcGVjaWZpZWQgVVJJLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdXJpU3RyaW5nIFVSSSB0byByZWRpcmVjdC5cblx0ICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgZm9yIG5vdGhpbmcuXG5cdCAqL1xuXHRyZWRpcmVjdCh1cmlTdHJpbmcpIHtcblx0XHRjb25zdCByZXF1ZXN0Um91dGVyID0gdGhpcy5sb2NhdG9yLnJlc29sdmUoJ3JlcXVlc3RSb3V0ZXInKTtcblx0XHRyZXR1cm4gcmVxdWVzdFJvdXRlci5nbyh1cmlTdHJpbmcpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENsZWFycyBjdXJyZW50IGxvY2F0aW9uIFVSSSdzIGZyYWdtZW50LlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSBmb3Igbm90aGluZy5cblx0ICovXG5cdGNsZWFyRnJhZ21lbnQoKSB7XG5cdFx0Y29uc3Qgd2luZG93ID0gdGhpcy5sb2NhdG9yLnJlc29sdmUoJ3dpbmRvdycpO1xuXHRcdGNvbnN0IHBvc2l0aW9uID0gd2luZG93LmRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJyc7XG5cdFx0d2luZG93LmRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gcG9zaXRpb247XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kdWxlQXBpUHJvdmlkZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFN0YXRlUHJvdmlkZXJCYXNlID0gcmVxdWlyZSgnLi4vLi4vbGliL2Jhc2UvU3RhdGVQcm92aWRlckJhc2UnKTtcblxuLyoqXG4gKiBJbXBsZW1lbnRzIHRoZSBzdGF0ZSBwcm92aWRlciBmb3IgdGhlIHNlcnZlciBlbnZpcm9ubWVudC5cbiAqL1xuY2xhc3MgU3RhdGVQcm92aWRlciBleHRlbmRzIFN0YXRlUHJvdmlkZXJCYXNlIHtcblxuXHQvKipcblx0ICogR2V0cyBhIGxpc3Qgb2Ygcm91dGUgZGVzY3JpcHRvcnMuXG5cdCAqIEBwYXJhbSB7U2VydmljZUxvY2F0b3J9IHNlcnZpY2VMb2NhdG9yIFRoZSBTZXJ2aWNlIGxvY2F0b3Jcblx0ICogZm9yIGdldHRpbmcgcm91dGUgZGVmaW5pdGlvbnMuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGxpc3Qgb2YgVVJJIG1hcHBlcnMuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfZ2V0Um91dGVEZXNjcmlwdG9ycyhzZXJ2aWNlTG9jYXRvcikge1xuXHRcdGNvbnN0IGRlc2NyaXB0b3JzID0gW107XG5cblx0XHRsZXQgcm91dGVEZWZpbml0aW9ucztcblxuXHRcdHRyeSB7XG5cdFx0XHRyb3V0ZURlZmluaXRpb25zID0gc2VydmljZUxvY2F0b3IucmVzb2x2ZUFsbCgncm91dGVEZWZpbml0aW9uJyk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0cm91dGVEZWZpbml0aW9ucyA9IFtdO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJvdXRlRGVzY3JpcHRvcnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdFx0dHJ5IHtcblx0XHRcdHNlcnZpY2VMb2NhdG9yLnJlc29sdmVBbGwoJ3JvdXRlRGVzY3JpcHRvcicpXG5cdFx0XHRcdC5mb3JFYWNoKGRlc2NyaXB0b3IgPT4ge1xuXHRcdFx0XHRcdHJvdXRlRGVzY3JpcHRvcnNbZGVzY3JpcHRvci5leHByZXNzaW9uXSA9IGRlc2NyaXB0b3I7XG5cdFx0XHRcdH0pO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdC8vIG5vdGhpbmcgdG8gZG9cblx0XHR9XG5cblx0XHRyb3V0ZURlZmluaXRpb25zXG5cdFx0XHQuZm9yRWFjaChyb3V0ZSA9PiB7XG5cdFx0XHRcdC8vIGp1c3QgY29sb24tcGFyYW1ldHJpemVkIHN0cmluZ1xuXHRcdFx0XHRpZiAodHlwZW9mIChyb3V0ZSkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0ZGVzY3JpcHRvcnMucHVzaChyb3V0ZURlc2NyaXB0b3JzW3JvdXRlXSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gZXh0ZW5kZWQgY29sb24tcGFyYW1ldHJpemVkIG1hcHBlclxuXHRcdFx0XHRpZiAodHlwZW9mIChyb3V0ZSkgPT09ICdvYmplY3QnICYmXG5cdFx0XHRcdFx0XHR0eXBlb2YgKHJvdXRlLmV4cHJlc3Npb24pID09PSAnc3RyaW5nJykge1xuXG5cdFx0XHRcdFx0Y29uc3QgZGVzY3JpcHRvciA9IHJvdXRlRGVzY3JpcHRvcnNbcm91dGUuZXhwcmVzc2lvbl07XG5cblx0XHRcdFx0XHRpZiAodHlwZW9mIChyb3V0ZS5uYW1lKSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRcdGRlc2NyaXB0b3IubmFtZSA9IHJvdXRlLm5hbWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHJvdXRlLm1hcCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG5cdFx0XHRcdFx0XHRkZXNjcmlwdG9yLm1hcCA9IHJvdXRlLm1hcDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRkZXNjcmlwdG9ycy5wdXNoKGRlc2NyaXB0b3IpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHJlZ3VsYXIgZXhwcmVzc2lvbiBtYXBwZXJcblx0XHRcdFx0aWYgKHR5cGVvZiAocm91dGUpID09PSAnb2JqZWN0JyAmJlxuXHRcdFx0XHRcdChyb3V0ZS5leHByZXNzaW9uIGluc3RhbmNlb2YgUmVnRXhwKSAmJlxuXHRcdFx0XHRcdChyb3V0ZS5tYXAgaW5zdGFuY2VvZiBGdW5jdGlvbikpIHtcblx0XHRcdFx0XHRkZXNjcmlwdG9ycy5wdXNoKHJvdXRlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRyZXR1cm4gZGVzY3JpcHRvcnM7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0ZVByb3ZpZGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBwcm9wZXJ0eUhlbHBlciA9IHJlcXVpcmUoJy4vaGVscGVycy9wcm9wZXJ0eUhlbHBlcicpO1xuXG5jbGFzcyBDb250ZXh0RmFjdG9yeSB7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIGNvbnRleHQgZmFjdG9yeS5cblx0ICogQHBhcmFtIHtTZXJ2aWNlTG9jYXRvcn0gbG9jYXRvciBMb2NhdG9yIGZvciByZXNvbHZpbmcgZGVwZW5kZW5jaWVzLlxuXHQgKi9cblx0Y29uc3RydWN0b3IobG9jYXRvcikge1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBzZXJ2aWNlIGxvY2F0b3IuXG5cdFx0ICogQHR5cGUge1NlcnZpY2VMb2NhdG9yfVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fc2VydmljZUxvY2F0b3IgPSBsb2NhdG9yO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgY29udGV4dCBmb3IgbW9kdWxlcy5cblx0ICogQHBhcmFtIHtPYmplY3R9IGFkZGl0aW9uYWwgQWRkaXRpb25hbCBwYXJhbWV0ZXJzLlxuXHQgKiBAcGFyYW0ge1VSSX0gYWRkaXRpb25hbC5yZWZlcnJlciBDdXJyZW50IHJlZmVycmVyLlxuXHQgKiBAcGFyYW0ge1VSSX0gYWRkaXRpb25hbC5sb2NhdGlvbiBDdXJyZW50IGxvY2F0aW9uLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYWRkaXRpb25hbC51c2VyQWdlbnQgQ3VycmVudCB1c2VyIGFnZW50LlxuXHQgKi9cblx0Y3JlYXRlKGFkZGl0aW9uYWwpIHtcblx0XHRjb25zdCBhcGlQcm92aWRlciA9IHRoaXMuX3NlcnZpY2VMb2NhdG9yLnJlc29sdmUoJ21vZHVsZUFwaVByb3ZpZGVyJyk7XG5cdFx0Y29uc3QgY29udGV4dCA9IE9iamVjdC5jcmVhdGUoYXBpUHJvdmlkZXIpO1xuXHRcdE9iamVjdC5rZXlzKGFkZGl0aW9uYWwpXG5cdFx0XHQuZm9yRWFjaChrZXkgPT4gcHJvcGVydHlIZWxwZXIuZGVmaW5lUmVhZE9ubHkoY29udGV4dCwga2V5LCBhZGRpdGlvbmFsW2tleV0pKTtcblx0XHRyZXR1cm4gY29udGV4dDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRleHRGYWN0b3J5O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBldmVudHMgPSByZXF1aXJlKCdldmVudHMnKTtcblxuY2xhc3MgU2VyaWFsV3JhcHBlciB7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIHNlcmlhbCB3cmFwcGVyIGZvciBwcm9taXNlcy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKCkge1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBldmVudCBlbWl0dGVyLlxuXHRcdCAqIEB0eXBlIHtFdmVudEVtaXR0ZXJ9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9lbWl0dGVyID0gbmV3IGV2ZW50cy5FdmVudEVtaXR0ZXIoKTtcblx0XHR0aGlzLl9lbWl0dGVyLnNldE1heExpc3RlbmVycygwKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgc2V0IG9mIG5hbWVkIG1ldGhvZHMgdG8gaW52b2tlLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl90b0ludm9rZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHNldCBvZiBmbGFncyBpZiB0aGUgbWV0aG9kIGlzIGluIHByb2dyZXNzLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9pblByb2dyZXNzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGRzIGEgbWV0aG9kIHRvIHRoZSBzZXQuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE1ldGhvZCBuYW1lLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSB0b0ludm9rZSBGdW5jdGlvbiB0aGF0IHJldHVybnMgcHJvbWlzZS5cblx0ICovXG5cdGFkZChuYW1lLCB0b0ludm9rZSkge1xuXHRcdHRoaXMuX3RvSW52b2tlW25hbWVdID0gdG9JbnZva2U7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0cnVlIGlmIHRoZSBtZXRob2Qgd2l0aCBzdWNoIG5hbWUgd2FzIHJlZ2lzdGVyZWQgdG8gdGhlIHNldC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZSBvZiBtZXRob2QuXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIG1ldGhvZCBuYW1lIGlzIHJlZ2lzdGVyZWQuXG5cdCAqL1xuXHRpc1JlZ2lzdGVyZWQobmFtZSkge1xuXHRcdHJldHVybiB0eXBlb2YgKHRoaXMuX3RvSW52b2tlW25hbWVdKSA9PT0gJ2Z1bmN0aW9uJztcblx0fVxuXG5cdC8qKlxuXHQgKiBJbnZva2VzIGEgbWV0aG9kIHdpdGhvdXQgY29uY3VycmVuY3kuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE1ldGhvZCBuYW1lLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZTxPYmplY3Q+fSBQcm9taXNlIGZvciByZXN1bHQuXG5cdCAqL1xuXHRpbnZva2UobmFtZSkge1xuXHRcdGlmICghdGhpcy5pc1JlZ2lzdGVyZWQobmFtZSkpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYE1ldGhvZCBcIiR7bmFtZX1cIiBpcyBubyBzdWNoIHJlZ2lzdGVyZWRgKSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2luUHJvZ3Jlc3NbbmFtZV0pIHtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdHRoaXMuX2VtaXR0ZXIub25jZShuYW1lLCBmdWxmaWxsKTtcblx0XHRcdFx0dGhpcy5fZW1pdHRlci5vbmNlKGAke25hbWV9LS1lcnJvcmAsIHJlamVjdCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHR0aGlzLl9pblByb2dyZXNzW25hbWVdID0gdHJ1ZTtcblx0XHR0aGlzLl90b0ludm9rZVtuYW1lXSgpXG5cdFx0XHQudGhlbihyZXN1bHQgPT4ge1xuXHRcdFx0XHR0aGlzLl9lbWl0dGVyLmVtaXQobmFtZSwgcmVzdWx0KTtcblx0XHRcdFx0dGhpcy5faW5Qcm9ncmVzc1tuYW1lXSA9IG51bGw7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKHJlYXNvbiA9PiB7XG5cdFx0XHRcdHRoaXMuX2VtaXR0ZXIuZW1pdChgJHtuYW1lfS0tZXJyb3JgLCByZWFzb24pO1xuXHRcdFx0XHR0aGlzLl9pblByb2dyZXNzW25hbWVdID0gbnVsbDtcblx0XHRcdH0pO1xuXG5cdFx0cmV0dXJuIHRoaXMuaW52b2tlKG5hbWUpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2VyaWFsV3JhcHBlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgU2VyaWFsV3JhcHBlciA9IHJlcXVpcmUoJy4vU2VyaWFsV3JhcHBlcicpO1xuY29uc3QgbW9kdWxlSGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXJzL21vZHVsZUhlbHBlcicpO1xuY29uc3QgcHJvcGVydHlIZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcnMvcHJvcGVydHlIZWxwZXInKTtcbmNvbnN0IHV1aWQgPSByZXF1aXJlKCd1dWlkJyk7XG5cbmNvbnN0IERFRkFVTFRfTElGRVRJTUUgPSA2MDAwMDtcblxuY2xhc3MgU3RvcmVEaXNwYXRjaGVyIHtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgc3RvcmUgZGlzcGF0Y2hlci5cblx0ICogQHBhcmFtIHtTZXJ2aWNlTG9jYXRvcn0gbG9jYXRvciBMb2NhdG9yIGZvciByZXNvbHZpbmcgZGVwZW5kZW5jaWVzLlxuXHQgKi9cblx0Y29uc3RydWN0b3IobG9jYXRvcikge1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBzZXJ2aWNlIGxvY2F0b3IuXG5cdFx0ICogQHR5cGUge1NlcnZpY2VMb2NhdG9yfVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fc2VydmljZUxvY2F0b3IgPSBsb2NhdG9yO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBzdG9yZSBsb2FkZXIuXG5cdFx0ICogQHR5cGUge1N0b3JlTG9hZGVyfVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fc3RvcmVMb2FkZXIgPSBsb2NhdG9yLnJlc29sdmUoJ3N0b3JlTG9hZGVyJyk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IGV2ZW50IGJ1cy5cblx0XHQgKiBAdHlwZSB7RXZlbnRFbWl0dGVyfVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fZXZlbnRCdXMgPSBsb2NhdG9yLnJlc29sdmUoJ2V2ZW50QnVzJyk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IG1hcCBvZiBhbGwgc3RvcmUgaW5zdGFuY2VzLlxuXHRcdCAqIEB0eXBlIHtudWxsfVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fc3RvcmVJbnN0YW5jZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBtYXAgb2YgbGFzdCBkYXRhIGZvciBlYWNoIHN0b3JlLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9sYXN0RGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IG1hcCBvZiBsYXN0IHN0YXRlIG9mIHN0b3JlIGRpc3BhdGNoZXIuXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX2xhc3RTdGF0ZSA9IG51bGw7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHNldCBvZiBzdG9yZSBkZXBlbmRlbmN5IGdyYXBoLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9kZXBlbmRhbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgc2VyaWFsIHdyYXBwZXIuXG5cdFx0ICogQHR5cGUge1NlcmlhbFdyYXBwZXJ9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9zZXJpYWxXcmFwcGVyID0gbmV3IFNlcmlhbFdyYXBwZXIoKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgYmFzaWMgY29udGV4dCBmb3IgYWxsIHN0b3JlIGNvbnRleHRzLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9jdXJyZW50QmFzaWNDb250ZXh0ID0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHN0b3JlIGRhdGEgYW5kIGNyZWF0ZXMgYSBzdG9yZSBpbnN0YW5jZSBpZiByZXF1aXJlZC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0b3JlTmFtZSBOYW1lIG9mIHN0b3JlLlxuXHQgKiBAcGFyYW0ge09iamVjdD99IG9wdGlvbnMgT3B0aW9uc1xuXHQgKiBAcGFyYW0ge1N0cmluZz99IG9wdGlvbnMuc3RvcmVJbnN0YW5jZUlkIEluc3RhbmNlIElkIG9mIHN0b3JlXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gb3B0aW9ucy5zdG9yZVBhcmFtcyBQYXJhbXMgZm9yIHN0b3JlXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IFN0b3JlJ3MgZGF0YS5cblx0ICovXG5cdGdldFN0b3JlRGF0YShzdG9yZU5hbWUsIG9wdGlvbnMgPSB7fSkge1xuXHRcdGlmICghdGhpcy5fbGFzdFN0YXRlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZXJyb3JTdGF0ZSgpO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgKHN0b3JlTmFtZSkgIT09ICdzdHJpbmcnKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXHRcdH1cblxuXHRcdGxldCB7c3RvcmVJbnN0YW5jZUlkfSA9IG9wdGlvbnM7XG5cdFx0Y29uc3Qge3N0b3JlUGFyYW1zfSA9IG9wdGlvbnM7XG5cdFx0Y29uc3QgY2FjaGVTdG9yZU5hbWUgPSBtb2R1bGVIZWxwZXIuZ2V0U3RvcmVDYWNoZUtleShzdG9yZU5hbWUsIHN0b3JlSW5zdGFuY2VJZCk7XG5cblx0XHRpZiAoY2FjaGVTdG9yZU5hbWUgaW4gdGhpcy5fbGFzdERhdGEpIHtcblx0XHRcdGNvbnN0IGV4aXN0VGltZSA9IERhdGUubm93KCkgLSB0aGlzLl9sYXN0RGF0YVtjYWNoZVN0b3JlTmFtZV0uY3JlYXRlZEF0O1xuXG5cdFx0XHRpZiAoZXhpc3RUaW1lIDw9IHRoaXMuX2xhc3REYXRhW2NhY2hlU3RvcmVOYW1lXS5saWZldGltZSkge1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2xhc3REYXRhW2NhY2hlU3RvcmVOYW1lXS5kYXRhKTtcblx0XHRcdH1cblxuXHRcdFx0ZGVsZXRlIHRoaXMuX2xhc3REYXRhW2NhY2hlU3RvcmVOYW1lXTtcblx0XHR9XG5cblx0XHR0aGlzLl9ldmVudEJ1cy5lbWl0KCdzdG9yZURhdGFMb2FkJywge1xuXHRcdFx0bmFtZTogc3RvcmVOYW1lXG5cdFx0fSk7XG5cblx0XHRjb25zdCBzdG9yZSA9IHRoaXMuZ2V0U3RvcmUoc3RvcmVOYW1lLCB7c3RvcmVQYXJhbXMsIHN0b3JlSW5zdGFuY2VJZH0pO1xuXG5cdFx0Y29uc29sZS5sb2coJ3Rlc3QnLCBzdG9yZUluc3RhbmNlSWQsIHN0b3JlLiRjb250ZXh0LnN0b3JlSW5zdGFuY2VJZCk7XG5cblx0XHRpZiAoIXN0b3JlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZXJyb3JTdG9yZU5vdEZvdW5kKHN0b3JlTmFtZSwgc3RvcmVJbnN0YW5jZUlkKTtcblx0XHR9XG5cblx0XHRjb25zdCBsaWZldGltZSA9IHR5cGVvZiAoc3RvcmUuJGxpZmV0aW1lKSA9PT0gJ251bWJlcicgPyBzdG9yZS4kbGlmZXRpbWUgOiBERUZBVUxUX0xJRkVUSU1FO1xuXG5cdFx0c3RvcmVJbnN0YW5jZUlkID0gc3RvcmUuJGNvbnRleHQuc3RvcmVJbnN0YW5jZUlkO1xuXG5cdFx0cmV0dXJuIHRoaXMuX3NlcmlhbFdyYXBwZXIuaW52b2tlKG1vZHVsZUhlbHBlci5nZXRTdG9yZUNhY2hlS2V5KHN0b3JlTmFtZSwgc3RvcmVJbnN0YW5jZUlkKSlcblx0XHRcdC50aGVuKGRhdGEgPT4ge1xuXHRcdFx0XHRpZiAoIXN0b3JlUGFyYW1zKSB7XG5cdFx0XHRcdFx0dGhpcy5fbGFzdERhdGFbY2FjaGVTdG9yZU5hbWVdID0ge1xuXHRcdFx0XHRcdFx0ZGF0YSxcblx0XHRcdFx0XHRcdGxpZmV0aW1lLFxuXHRcdFx0XHRcdFx0Y3JlYXRlZEF0OiBEYXRlLm5vdygpXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMuX2V2ZW50QnVzLmVtaXQoJ3N0b3JlRGF0YUxvYWRlZCcsIHtcblx0XHRcdFx0XHRuYW1lOiBzdG9yZU5hbWUsXG5cdFx0XHRcdFx0c3RvcmVJbnN0YW5jZUlkLFxuXHRcdFx0XHRcdGRhdGEsXG5cdFx0XHRcdFx0bGlmZXRpbWVcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogU2VuZHMgYW4gYWN0aW9uIHRvIHRoZSBzcGVjaWZpZWQgc3RvcmUgYW5kIHJlc29sdmVzIHByb21pc2VzIGluIHRoZSBzZXJpYWwgbW9kZS5cblx0ICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBvcHRpb25zIE5hbWUgb2YgdGhlIHN0b3JlIG9yIG9wdGlvbnNcblx0ICogQHBhcmFtIHtTdHJpbmc/fSBvcHRpb25zLnN0b3JlTmFtZSBOYW1lIG9mIHRoZSBzdG9yZS5cblx0ICogQHBhcmFtIHtTdHJpbmc/fSBvcHRpb25zLnN0b3JlSW5zdGFuY2VJZCBJbnN0YW5jZSBJZCBvZiB0aGUgc3RvcmUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25OYW1lIE5hbWUgb2YgdGhlIGFjdGlvbi5cblx0ICogQHBhcmFtIHtPYmplY3R9IGFyZ3MgQWN0aW9uIGFyZ3VtZW50cy5cblx0ICogQHJldHVybnMge1Byb21pc2U8Kj59IFByb21pc2UgZm9yIGFuIGFjdGlvbiBoYW5kbGluZyByZXN1bHQuXG5cdCAqL1xuXHRzZW5kQWN0aW9uKG9wdGlvbnMsIGFjdGlvbk5hbWUsIGFyZ3MpIHtcblx0XHRpZiAoIXRoaXMuX2xhc3RTdGF0ZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Vycm9yU3RhdGUoKTtcblx0XHR9XG5cblx0XHRsZXQgc3RvcmVJbnN0YW5jZUlkO1xuXHRcdGxldCBzdG9yZU5hbWU7XG5cblx0XHRpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRzdG9yZU5hbWUgPSBvcHRpb25zO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgJiYgb3B0aW9ucyAhPT0gbnVsbCkge1xuXHRcdFx0c3RvcmVOYW1lID0gb3B0aW9ucy5zdG9yZU5hbWU7XG5cdFx0XHRzdG9yZUluc3RhbmNlSWQgPSBvcHRpb25zLnN0b3JlSW5zdGFuY2VJZDtcblx0XHR9XG5cblx0XHRjb25zdCBhY3Rpb25EZXRhaWxzID0ge1xuXHRcdFx0c3RvcmVOYW1lLFxuXHRcdFx0c3RvcmVJbnN0YW5jZUlkLFxuXHRcdFx0YWN0aW9uTmFtZSxcblx0XHRcdGFyZ3Ncblx0XHR9O1xuXHRcdHRoaXMuX2V2ZW50QnVzLmVtaXQoJ2FjdGlvblNlbmQnLCBhY3Rpb25EZXRhaWxzKTtcblxuXHRcdGNvbnN0IHN0b3JlID0gdGhpcy5nZXRTdG9yZShzdG9yZU5hbWUsIHtzdG9yZUluc3RhbmNlSWR9KTtcblx0XHRpZiAoIXN0b3JlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZXJyb3JTdG9yZU5vdEZvdW5kKHN0b3JlTmFtZSwgc3RvcmVJbnN0YW5jZUlkKTtcblx0XHR9XG5cblx0XHRjb25zdCBoYW5kbGVNZXRob2QgPSBtb2R1bGVIZWxwZXIuZ2V0TWV0aG9kVG9JbnZva2UoXG5cdFx0XHRzdG9yZSwgJ2hhbmRsZScsIGFjdGlvbk5hbWVcblx0XHQpO1xuXHRcdHJldHVybiBtb2R1bGVIZWxwZXIuZ2V0U2FmZVByb21pc2UoKCkgPT4gaGFuZGxlTWV0aG9kKGFyZ3MpKVxuXHRcdFx0LnRoZW4ocmVzdWx0ID0+IHtcblx0XHRcdFx0dGhpcy5fZXZlbnRCdXMuZW1pdCgnYWN0aW9uU2VudCcsIGFjdGlvbkRldGFpbHMpO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyBhIG5ldyBzdGF0ZSB0byB0aGUgc3RvcmUgZGlzcGF0Y2hlciBhbmQgaW52b2tlcyB0aGUgXCJjaGFuZ2VkXCIgbWV0aG9kIGZvciBhbGxcblx0ICogc3RvcmVzIHdoaWNoIHN0YXRlIGhhcyBiZWVuIGNoYW5nZWQuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbWV0ZXJzIE1hcCBvZiBuZXcgcGFyYW1ldGVycy5cblx0ICogQHBhcmFtIHtPYmplY3R9IGJhc2ljQ29udGV4dCBCYXNpYyBjb250ZXh0IGZvciBhbGwgc3RvcmVzLlxuXHQgKiBAcmV0dXJucyB7QXJyYXk8c3RyaW5nPn0gTmFtZXMgb2Ygc3RvcmVzIHRoYXQgaGF2ZSBiZWVuIGNoYW5nZWQuXG5cdCAqL1xuXHRzZXRTdGF0ZShwYXJhbWV0ZXJzLCBiYXNpY0NvbnRleHQpIHtcblx0XHRwYXJhbWV0ZXJzID0gcGFyYW1ldGVycyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdFx0Y29uc3Qgc3RvcmVzID0gdGhpcy5fc3RvcmVMb2FkZXIuZ2V0U3RvcmVzQnlOYW1lcygpO1xuXHRcdGNvbnN0IHBhcmFtZXRlck5hbWVzID0gT2JqZWN0LmtleXMocGFyYW1ldGVycyk7XG5cdFx0cGFyYW1ldGVyTmFtZXMuZm9yRWFjaChzdG9yZU5hbWUgPT4ge1xuXHRcdFx0aWYgKCEoc3RvcmVOYW1lIGluIHN0b3JlcykpIHtcblx0XHRcdFx0dGhpcy5fZXZlbnRCdXMuZW1pdCgnd2FybicsIGBTdG9yZSBcIiR7c3RvcmVOYW1lfVwiIGRvZXMgbm90IGV4aXN0IChtaWdodCBiZSBhIHR5cG8gaW4gYSByb3V0ZSlgKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmICghdGhpcy5fbGFzdFN0YXRlKSB7XG5cdFx0XHR0aGlzLl9jdXJyZW50QmFzaWNDb250ZXh0ID0gYmFzaWNDb250ZXh0O1xuXHRcdFx0dGhpcy5fbGFzdFN0YXRlID0gcGFyYW1ldGVycztcblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cblx0XHQvLyBzb21lIHN0b3JlJ3MgcGFyYW1ldGVycyBjYW4gYmUgcmVtb3ZlZCBzaW5jZSBsYXN0IHRpbWVcblx0XHRjb25zdCBjaGFuZ2VkID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXHRcdE9iamVjdC5rZXlzKHRoaXMuX2xhc3RTdGF0ZSlcblx0XHRcdC5maWx0ZXIoc3RvcmVOYW1lID0+ICEoc3RvcmVOYW1lIGluIHBhcmFtZXRlcnMpKVxuXHRcdFx0LmZvckVhY2gobmFtZSA9PiB7XG5cdFx0XHRcdGNoYW5nZWRbbmFtZV0gPSB0cnVlO1xuXHRcdFx0fSk7XG5cblx0XHRwYXJhbWV0ZXJOYW1lc1xuXHRcdFx0LmZvckVhY2goc3RvcmVOYW1lID0+IHtcblx0XHRcdFx0Ly8gbmV3IHBhcmFtZXRlcnMgd2VyZSBzZXQgZm9yIHN0b3JlXG5cdFx0XHRcdGlmICghKHN0b3JlTmFtZSBpbiB0aGlzLl9sYXN0U3RhdGUpKSB7XG5cdFx0XHRcdFx0Y2hhbmdlZFtzdG9yZU5hbWVdID0gdHJ1ZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBuZXcgYW5kIGxhc3QgcGFyYW1ldGVycyBoYXMgZGlmZmVyZW50IHZhbHVlc1xuXHRcdFx0XHRjb25zdCBsYXN0UGFyYW1ldGVyTmFtZXMgPSBPYmplY3Qua2V5cyh0aGlzLl9sYXN0U3RhdGVbc3RvcmVOYW1lXSk7XG5cdFx0XHRcdGNvbnN0IGN1cnJlbnRQYXJhbWV0ZXJOYW1lcyA9IE9iamVjdC5rZXlzKHBhcmFtZXRlcnNbc3RvcmVOYW1lXSk7XG5cblx0XHRcdFx0aWYgKGN1cnJlbnRQYXJhbWV0ZXJOYW1lcy5sZW5ndGggIT09IGxhc3RQYXJhbWV0ZXJOYW1lcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRjaGFuZ2VkW3N0b3JlTmFtZV0gPSB0cnVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGN1cnJlbnRQYXJhbWV0ZXJOYW1lcy5ldmVyeShwYXJhbWV0ZXJOYW1lID0+IHtcblx0XHRcdFx0XHRpZiAocGFyYW1ldGVyc1tzdG9yZU5hbWVdW3BhcmFtZXRlck5hbWVdICE9PVxuXHRcdFx0XHRcdFx0dGhpcy5fbGFzdFN0YXRlW3N0b3JlTmFtZV1bcGFyYW1ldGVyTmFtZV0pIHtcblx0XHRcdFx0XHRcdGNoYW5nZWRbc3RvcmVOYW1lXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0dGhpcy5fbGFzdFN0YXRlID0gcGFyYW1ldGVycztcblx0XHRpZiAodGhpcy5fY3VycmVudEJhc2ljQ29udGV4dCAhPT0gYmFzaWNDb250ZXh0KSB7XG5cdFx0XHR0aGlzLl9jdXJyZW50QmFzaWNDb250ZXh0ID0gYmFzaWNDb250ZXh0O1xuXHRcdFx0T2JqZWN0LmtleXModGhpcy5fc3RvcmVJbnN0YW5jZXMpXG5cdFx0XHRcdC5mb3JFYWNoKHN0b3JlTmFtZSA9PiB7XG5cdFx0XHRcdFx0T2JqZWN0LmtleXModGhpcy5fc3RvcmVJbnN0YW5jZXNbc3RvcmVOYW1lXSlcblx0XHRcdFx0XHRcdC5mb3JFYWNoKHN0b3JlSW5zdGFuY2VJZCA9PiB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHBhcmFtcyA9IHRoaXMuX3N0b3JlSW5zdGFuY2VzW3N0b3JlTmFtZV1bc3RvcmVJbnN0YW5jZUlkXS4kY29udGV4dC5wYXJhbXM7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX3N0b3JlSW5zdGFuY2VzW3N0b3JlTmFtZV1bc3RvcmVJbnN0YW5jZUlkXS4kY29udGV4dCA9IHRoaXMuX2dldFN0b3JlQ29udGV4dChzdG9yZU5hbWUsIHtcblx0XHRcdFx0XHRcdFx0XHRzdG9yZUluc3RhbmNlSWQsIHBhcmFtc1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNoYW5nZWRTdG9yZU5hbWVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0XHRPYmplY3Qua2V5cyhjaGFuZ2VkKVxuXHRcdFx0LmZvckVhY2goc3RvcmVOYW1lID0+IHtcblx0XHRcdFx0T2JqZWN0LmtleXModGhpcy5fc3RvcmVJbnN0YW5jZXNbc3RvcmVOYW1lXSlcblx0XHRcdFx0XHQuZm9yRWFjaChzdG9yZUluc3RhbmNlSWQgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3Qgc3RvcmVQYXJhbXMgPSB0aGlzLl9zdG9yZUluc3RhbmNlc1tzdG9yZU5hbWVdW3N0b3JlSW5zdGFuY2VJZF0uJGNvbnRleHQucGFyYW1zO1xuXHRcdFx0XHRcdFx0Y29uc3Qgc3RvcmUgPSB0aGlzLmdldFN0b3JlKHN0b3JlTmFtZSwge3N0b3JlSW5zdGFuY2VJZCwgc3RvcmVQYXJhbXN9KTtcblxuXHRcdFx0XHRcdFx0aWYgKCFzdG9yZSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHN0b3JlLiRjb250ZXh0LmNoYW5nZWQoKVxuXHRcdFx0XHRcdFx0XHQuZm9yRWFjaChuYW1lID0+IHtcblx0XHRcdFx0XHRcdFx0XHRjaGFuZ2VkU3RvcmVOYW1lc1tuYW1lXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHR9KTtcblxuXHRcdHRoaXMuX2V2ZW50QnVzLmVtaXQoJ3N0YXRlQ2hhbmdlZCcsIHtcblx0XHRcdG9sZFN0YXRlOiB0aGlzLl9sYXN0U3RhdGUsXG5cdFx0XHRuZXdTdGF0ZTogcGFyYW1ldGVyc1xuXHRcdH0pO1xuXHRcdHJldHVybiBPYmplY3Qua2V5cyhjaGFuZ2VkU3RvcmVOYW1lcyk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBhIGNvbnRleHQgZm9yIGEgc3RvcmUgdXNpbmcgY29tcG9uZW50J3MgY29udGV4dCBhcyBhIHByb3RvdHlwZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0b3JlTmFtZSBOYW1lIG9mIHRoZSBzdG9yZS5cblx0ICogQHBhcmFtIHtPYmplY3Q/fSBwcm9wZXJ0aWVzIEFkZGl0aW9uYWwgcHJvcGVydGllc1xuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBTdG9yZSBjb250ZXh0LlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2dldFN0b3JlQ29udGV4dChzdG9yZU5hbWUsIHByb3BlcnRpZXMpIHtcblx0XHRjb25zdCBzdG9yZUNvbnRleHQgPSBPYmplY3QuY3JlYXRlKHRoaXMuX2N1cnJlbnRCYXNpY0NvbnRleHQpO1xuXG5cdFx0cHJvcGVydHlIZWxwZXIuZGVmaW5lUmVhZE9ubHkoc3RvcmVDb250ZXh0LCAnbmFtZScsIHN0b3JlTmFtZSk7XG5cdFx0cHJvcGVydHlIZWxwZXIuZGVmaW5lUmVhZE9ubHkoXG5cdFx0XHRzdG9yZUNvbnRleHQsICdzdGF0ZScsIHRoaXMuX2xhc3RTdGF0ZVtzdG9yZU5hbWVdIHx8IE9iamVjdC5jcmVhdGUobnVsbClcblx0XHQpO1xuXG5cdFx0aWYgKHR5cGVvZiBwcm9wZXJ0aWVzID09PSAnb2JqZWN0JyAmJiBwcm9wZXJ0aWVzICE9PSBudWxsKSB7XG5cdFx0XHRPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5mb3JFYWNoKHByb3BOYW1lID0+XG5cdFx0XHRcdHByb3BlcnR5SGVscGVyLmRlZmluZVJlYWRPbmx5KHN0b3JlQ29udGV4dCwgcHJvcE5hbWUsIHByb3BlcnRpZXNbcHJvcE5hbWVdKVxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRzdG9yZUNvbnRleHQuY2hhbmdlZCA9ICgpID0+IHtcblx0XHRcdGNvbnN0IHdhbGtlZCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdFx0XHR2YXIgdG9DaGFuZ2UgPSBbc3RvcmVOYW1lXTtcblxuXHRcdFx0d2hpbGUgKHRvQ2hhbmdlLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0Y29uc3QgY3VycmVudCA9IHRvQ2hhbmdlLnNoaWZ0KCk7XG5cdFx0XHRcdGlmIChjdXJyZW50IGluIHdhbGtlZCkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHdhbGtlZFtjdXJyZW50XSA9IHRydWU7XG5cdFx0XHRcdGlmIChjdXJyZW50IGluIHRoaXMuX2RlcGVuZGFudHMpIHtcblx0XHRcdFx0XHR0b0NoYW5nZSA9IHRvQ2hhbmdlLmNvbmNhdChPYmplY3Qua2V5cyh0aGlzLl9kZXBlbmRhbnRzW2N1cnJlbnRdKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZGVsZXRlIHRoaXMuX2xhc3REYXRhW2N1cnJlbnRdO1xuXHRcdFx0XHR0aGlzLl9ldmVudEJ1cy5lbWl0KCdzdG9yZUNoYW5nZWQnLCBjdXJyZW50KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBPYmplY3Qua2V5cyh3YWxrZWQpO1xuXHRcdH07XG5cblx0XHRzdG9yZUNvbnRleHQuZ2V0U3RvcmVEYXRhID0gKHNvdXJjZVN0b3JlTmFtZSwgc291cmNlU3RvcmVJbnN0YW5jZUlkKSA9PiB7XG5cdFx0XHRpZiAoc291cmNlU3RvcmVOYW1lID09PSBzdG9yZU5hbWUpIHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXMuZ2V0U3RvcmVEYXRhKHNvdXJjZVN0b3JlTmFtZSwge3N0b3JlSW5zdGFuY2VJZDogc291cmNlU3RvcmVJbnN0YW5jZUlkfSk7XG5cdFx0fTtcblxuXHRcdHN0b3JlQ29udGV4dC5zZXREZXBlbmRlbmN5ID0gbmFtZSA9PiB7XG5cdFx0XHRpZiAoIShuYW1lIGluIHRoaXMuX2RlcGVuZGFudHMpKSB7XG5cdFx0XHRcdHRoaXMuX2RlcGVuZGFudHNbbmFtZV0gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZGVwZW5kYW50c1tuYW1lXVtzdG9yZU5hbWVdID0gdHJ1ZTtcblx0XHR9O1xuXHRcdHN0b3JlQ29udGV4dC51bnNldERlcGVuZGVuY3kgPSBuYW1lID0+IHtcblx0XHRcdGlmICghKG5hbWUgaW4gdGhpcy5fZGVwZW5kYW50cykpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0ZGVsZXRlIHRoaXMuX2RlcGVuZGFudHNbbmFtZV1bc3RvcmVOYW1lXTtcblx0XHR9O1xuXHRcdHN0b3JlQ29udGV4dC5zZW5kQWN0aW9uID0gKHN0b3JlTmFtZSwgbmFtZSwgYXJncykgPT4gdGhpcy5zZW5kQWN0aW9uKHN0b3JlTmFtZSwgbmFtZSwgYXJncyk7XG5cblx0XHRyZXR1cm4gc3RvcmVDb250ZXh0O1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgYSBzdG9yZSBpbnN0YW5jZSBhbmQgY3JlYXRlcyBpdCBpZiByZXF1aXJlZC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0b3JlTmFtZSBOYW1lIG9mIHRoZSBzdG9yZS5cblx0ICogQHBhcmFtIHtvcHRpb25zfSBvcHRpb25zIE9wdGlvbnNcblx0ICogQHBhcmFtIHtzdHJpbmc/fSBzdG9yZUluc3RhbmNlSWQgU3RvcmUgaW5zdGFuY2UncyBpZFxuXHQgKiBAcGFyYW0ge09iamVjdD99IHN0b3JlUGFyYW1zIFBhcmFtcyBmb3IgdGhlIHN0b3JlXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlPE9iamVjdD59IFByb21pc2UgZm9yIHRoZSBzdG9yZS5cblx0ICovXG5cdGdldFN0b3JlKHN0b3JlTmFtZSwgb3B0aW9ucykge1xuXHRcdGlmICghc3RvcmVOYW1lKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0bGV0IHtzdG9yZUluc3RhbmNlSWQsIHN0b3JlUGFyYW1zfSA9IG9wdGlvbnMgfHwge307XG5cdFx0Y29uc3QgaXNEeW5hbWljU3RvcmUgPSBtb2R1bGVIZWxwZXIuaXNEeW5hbWljU3RvcmUoc3RvcmVOYW1lKTtcblxuXHRcdGlmICghc3RvcmVJbnN0YW5jZUlkKSB7XG5cdFx0XHRzdG9yZUluc3RhbmNlSWQgPSB1dWlkLnY0KCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgaW5zdGFuY2VzID0gdGhpcy5fc3RvcmVJbnN0YW5jZXNbc3RvcmVOYW1lXTtcblx0XHRsZXQgc3RvcmUgPSBpbnN0YW5jZXMgJiYgaW5zdGFuY2VzW3N0b3JlSW5zdGFuY2VJZF07XG5cblx0XHRpZiAoIXN0b3JlICYmICFpc0R5bmFtaWNTdG9yZSkge1xuXHRcdFx0c3RvcmUgPSBpbnN0YW5jZXMgJiYgT2JqZWN0LnZhbHVlcyhpbnN0YW5jZXMpWzBdO1xuXHRcdH1cblxuXHRcdGlmIChzdG9yZSkge1xuXHRcdFx0cmV0dXJuIHN0b3JlO1xuXHRcdH1cblxuXHRcdGNvbnN0IHN0b3JlcyA9IHRoaXMuX3N0b3JlTG9hZGVyLmdldFN0b3Jlc0J5TmFtZXMoKTtcblx0XHRpZiAoIShzdG9yZU5hbWUgaW4gc3RvcmVzKSkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0Y29uc3QgU3RvcmVDb25zdHJ1Y3RvciA9IHN0b3Jlc1tzdG9yZU5hbWVdLmNvbnN0cnVjdG9yO1xuXG5cdFx0U3RvcmVDb25zdHJ1Y3Rvci5wcm90b3R5cGUuJGNvbnRleHQgPSB0aGlzLl9nZXRTdG9yZUNvbnRleHQoc3RvcmVOYW1lLCB7XG5cdFx0XHRzdG9yZUluc3RhbmNlSWQsXG5cdFx0XHRwYXJhbXM6IHN0b3JlUGFyYW1zIHx8IHt9XG5cdFx0fSk7XG5cblx0XHRpZiAoIXRoaXMuX3N0b3JlSW5zdGFuY2VzW3N0b3JlTmFtZV0pIHtcblx0XHRcdHRoaXMuX3N0b3JlSW5zdGFuY2VzW3N0b3JlTmFtZV0gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGluc3RhbmNlID0gbmV3IFN0b3JlQ29uc3RydWN0b3IodGhpcy5fc2VydmljZUxvY2F0b3IpO1xuXG5cdFx0aW5zdGFuY2UuJGNvbnRleHQgPSBTdG9yZUNvbnN0cnVjdG9yLnByb3RvdHlwZS4kY29udGV4dDtcblxuXHRcdHRoaXMuX3N0b3JlSW5zdGFuY2VzW3N0b3JlTmFtZV1bc3RvcmVJbnN0YW5jZUlkXSA9IGluc3RhbmNlO1xuXG5cdFx0dGhpcy5fc2VyaWFsV3JhcHBlci5hZGQobW9kdWxlSGVscGVyLmdldFN0b3JlQ2FjaGVLZXkoc3RvcmVOYW1lLCBzdG9yZUluc3RhbmNlSWQpLCAoKSA9PiB7XG5cdFx0XHRjb25zdCBsb2FkTWV0aG9kID0gbW9kdWxlSGVscGVyLmdldE1ldGhvZFRvSW52b2tlKGluc3RhbmNlLCAnbG9hZCcpO1xuXG5cdFx0XHRyZXR1cm4gbW9kdWxlSGVscGVyLmdldFNhZmVQcm9taXNlKGxvYWRNZXRob2QpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5fZXZlbnRCdXMuZW1pdCgnZGVidWcnLCBgU3RvcmUgJHtzdG9yZU5hbWV9WyR7c3RvcmVJbnN0YW5jZUlkfV0gaW5pdGApO1xuXHRcdHRoaXMuX2V2ZW50QnVzLmVtaXQoJ2RlYnVnJywgYFBhcmFtczogJHtKU09OLnN0cmluZ2lmeShzdG9yZVBhcmFtcyl9YCk7XG5cblx0XHRyZXR1cm4gaW5zdGFuY2U7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBhbiBlcnJvciBtZXNzYWdlIGFib3V0IGEgbm90IGZvdW5kIHN0b3JlLlxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IG5hbWUgVGhlIHN0b3JlIG5hbWUuXG5cdCAqIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBUaGUgcHJvbWlzZSBmb3IgdGhlIGVycm9yLlxuXHQgKi9cblx0X2Vycm9yU3RvcmVOb3RGb3VuZChuYW1lLCBzdG9yZUluc3RhbmNlSWQpIHtcblx0XHRjb25zdCBpbnN0YW5jZUlkVGV4dCA9IHN0b3JlSW5zdGFuY2VJZCA/IGAoaW5zdGFuY2UgaWQgXCIke3N0b3JlSW5zdGFuY2VJZH1cIilgIDogJyc7XG5cdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihgU3RvcmUgXCIke25hbWV9XCIgJHtpbnN0YW5jZUlkVGV4dH0gbm90IGZvdW5kYCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gZXJyb3IgbWVzc2FnZSBhYm91dCBhbiB1bmluaXRpYWxpemVkIHN0YXRlLlxuXHQgKiBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gVGhlIHByb21pc2UgZm9yIHRoZSBlcnJvci5cblx0ICovXG5cdF9lcnJvclN0YXRlKCkge1xuXHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ1N0YXRlIHNob3VsZCBiZSBzZXQgYmVmb3JlIGFueSByZXF1ZXN0JykpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3RvcmVEaXNwYXRjaGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBtb2R1bGVIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL21vZHVsZUhlbHBlcicpO1xuY29uc3QgU3RhdGVQcm92aWRlciA9IHJlcXVpcmUoJy4uL3Byb3ZpZGVycy9TdGF0ZVByb3ZpZGVyJyk7XG5jb25zdCBTdG9yZUxvYWRlciA9IHJlcXVpcmUoJy4uL2xvYWRlcnMvU3RvcmVMb2FkZXInKTtcbmNvbnN0IENvbXBvbmVudExvYWRlciA9IHJlcXVpcmUoJy4uL2xvYWRlcnMvQ29tcG9uZW50TG9hZGVyJyk7XG5jb25zdCBEb2N1bWVudFJlbmRlcmVyID0gcmVxdWlyZSgnLi4vRG9jdW1lbnRSZW5kZXJlcicpO1xuY29uc3QgUmVxdWVzdFJvdXRlciA9IHJlcXVpcmUoJy4uL1JlcXVlc3RSb3V0ZXInKTtcbmNvbnN0IE1vZHVsZUFwaVByb3ZpZGVyQmFzZSA9IHJlcXVpcmUoJy4uL2Jhc2UvTW9kdWxlQXBpUHJvdmlkZXJCYXNlJyk7XG5jb25zdCBDb250ZXh0RmFjdG9yeSA9IHJlcXVpcmUoJy4uL0NvbnRleHRGYWN0b3J5Jyk7XG5jb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbi8qKlxuICogSW1wbGVtZW50cyB0aGUgYmFzaWMgYm9vdHN0cmFwcGVyIGNsYXNzXG4gKiBmb3IgYm90aCBzZXJ2ZXIgYW5kIGJyb3dzZXIgZW52aXJvbm1lbnRzLlxuICovXG5jbGFzcyBCb290c3RyYXBwZXJCYXNlIHtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgYmFzaWMgQ2F0YmVycnkgYm9vdHN0cmFwcGVyLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYXRiZXJyeUNvbnN0cnVjdG9yIENvbnN0cnVjdG9yXG5cdCAqIG9mIHRoZSBDYXRiZXJyeSdzIG1haW4gbW9kdWxlLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoY2F0YmVycnlDb25zdHJ1Y3Rvcikge1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBjb25zdHJ1Y3RvciBvZiB0aGUgQ2F0YmVycnkncyBtYWluIG1vZHVsZS5cblx0XHQgKiBAdHlwZSB7RnVuY3Rpb259XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9jYXRiZXJyeUNvbnN0cnVjdG9yID0gY2F0YmVycnlDb25zdHJ1Y3Rvcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IGZ1bGwtY29uZmlndXJlZCBpbnN0YW5jZSBvZiB0aGUgQ2F0YmVycnkgYXBwbGljYXRpb24uXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gY29uZmlnT2JqZWN0IFRoZSBjb25maWd1cmF0aW9uIG9iamVjdC5cblx0ICogQHJldHVybnMge0NhdGJlcnJ5fSBUaGUgQ2F0YmVycnkgYXBwbGljYXRpb24gaW5zdGFuY2UuXG5cdCAqL1xuXHRjcmVhdGUoY29uZmlnT2JqZWN0KSB7XG5cdFx0Y29uc3QgY3VycmVudENvbmZpZyA9IGNvbmZpZ09iamVjdCB8fCB7fTtcblx0XHRjb25zdCBjYXRiZXJyeSA9IG5ldyB0aGlzLl9jYXRiZXJyeUNvbnN0cnVjdG9yKCk7XG5cblx0XHR0aGlzLmNvbmZpZ3VyZShjdXJyZW50Q29uZmlnLCBjYXRiZXJyeS5sb2NhdG9yKTtcblx0XHRjYXRiZXJyeS5ldmVudHMgPSBuZXcgTW9kdWxlQXBpUHJvdmlkZXJCYXNlKGNhdGJlcnJ5LmxvY2F0b3IpO1xuXHRcdHJldHVybiBjYXRiZXJyeTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb25maWd1cmVzIGEgbG9jYXRvciB3aXRoIGFsbCByZXF1aXJlZCB0eXBlIHJlZ2lzdHJhdGlvbnMuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdPYmplY3QgVGhlIGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxuXHQgKiBAcGFyYW0ge1NlcnZpY2VMb2NhdG9yfSBsb2NhdG9yIFRoZSBTZXJ2aWNlIGxvY2F0b3IgdG8gY29uZmlndXJlLlxuXHQgKi9cblx0Y29uZmlndXJlKGNvbmZpZ09iamVjdCwgbG9jYXRvcikge1xuXHRcdGNvbnN0IGV2ZW50QnVzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXHRcdGV2ZW50QnVzLnNldE1heExpc3RlbmVycygwKTtcblx0XHRsb2NhdG9yLnJlZ2lzdGVySW5zdGFuY2UoJ2V2ZW50QnVzJywgZXZlbnRCdXMpO1xuXHRcdGxvY2F0b3IucmVnaXN0ZXJJbnN0YW5jZSgnY29uZmlnJywgY29uZmlnT2JqZWN0KTtcblx0XHRsb2NhdG9yLnJlZ2lzdGVyKCdzdGF0ZVByb3ZpZGVyJywgU3RhdGVQcm92aWRlciwgdHJ1ZSk7XG5cdFx0bG9jYXRvci5yZWdpc3RlcignY29udGV4dEZhY3RvcnknLCBDb250ZXh0RmFjdG9yeSwgdHJ1ZSk7XG5cdFx0bG9jYXRvci5yZWdpc3Rlcignc3RvcmVMb2FkZXInLCBTdG9yZUxvYWRlciwgdHJ1ZSk7XG5cdFx0bG9jYXRvci5yZWdpc3RlcignY29tcG9uZW50TG9hZGVyJywgQ29tcG9uZW50TG9hZGVyLCB0cnVlKTtcblx0XHRsb2NhdG9yLnJlZ2lzdGVyKCdkb2N1bWVudFJlbmRlcmVyJywgRG9jdW1lbnRSZW5kZXJlciwgdHJ1ZSk7XG5cdFx0bG9jYXRvci5yZWdpc3RlcigncmVxdWVzdFJvdXRlcicsIFJlcXVlc3RSb3V0ZXIsIHRydWUpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQm9vdHN0cmFwcGVyQmFzZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgU2VydmljZUxvY2F0b3IgPSByZXF1aXJlKCdjYXRiZXJyeS1sb2NhdG9yJyk7XG5cbi8qKlxuICogSW1wbGVtZW50cyB0aGUgYmFzaWMgQ2F0YmVycnkgY2xhc3MgZm9yIGJvdGggc2VydmVyIGFuZCBicm93c2VyIGVudmlyb25tZW50cy5cbiAqL1xuY2xhc3MgQ2F0YmVycnlCYXNlIHtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgYmFzaWMgQ2F0YmVycnkgYXBwbGljYXRpb24gbW9kdWxlLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoKSB7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHNlcnZpY2UgbG9jYXRvci5cblx0XHQgKiBAdHlwZSB7U2VydmljZUxvY2F0b3J9XG5cdFx0ICovXG5cdFx0dGhpcy5sb2NhdG9yID0gbmV3IFNlcnZpY2VMb2NhdG9yKCk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHZlcnNpb24gb2YgQ2F0YmVycnkuXG5cdFx0ICovXG5cdFx0dGhpcy52ZXJzaW9uID0gJzkuMC4wJztcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgb2JqZWN0IHdpdGggZXZlbnRzLlxuXHRcdCAqIEB0eXBlIHtNb2R1bGVBcGlQcm92aWRlcn1cblx0XHQgKi9cblx0XHR0aGlzLmV2ZW50cyA9IG51bGw7XG5cblx0XHR0aGlzLmxvY2F0b3IucmVnaXN0ZXJJbnN0YW5jZSgnc2VydmljZUxvY2F0b3InLCB0aGlzLmxvY2F0b3IpO1xuXHRcdHRoaXMubG9jYXRvci5yZWdpc3Rlckluc3RhbmNlKCdjYXRiZXJyeScsIHRoaXMpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2F0YmVycnlCYXNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEltcGxlbWVudHMgdGhlIGJhc2ljIENvb2tpZSBXcmFwcGVyIGNsYXNzIGZvciBib3RoIHNlcnZlclxuICogYW5kIGJyb3dzZXIgZW52aXJvbm1lbnRzLlxuICovXG5jbGFzcyBDb29raWVXcmFwcGVyQmFzZSB7XG5cblx0LyoqXG5cdCAqIEdldHMgYSBtYXAgb2YgY29va2llIHZhbHVlcyBieSB0aGVpciBuYW1lcy5cblx0ICogQHJldHVybnMge09iamVjdH0gVGhlIGNvb2tpZXMgbWFwIGJ5IHRoZWlyIG5hbWVzLlxuXHQgKi9cblx0Z2V0QWxsKCkge1xuXHRcdGNvbnN0IHN0cmluZyA9IHRoaXMuZ2V0Q29va2llU3RyaW5nKCk7XG5cdFx0cmV0dXJuIHRoaXMuX3BhcnNlQ29va2llU3RyaW5nKHN0cmluZyk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBhIGNvb2tpZSB2YWx1ZSBieSBpdHMgbmFtZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIGNvb2tpZSBuYW1lLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29va2llIHZhbHVlLlxuXHQgKi9cblx0Z2V0KG5hbWUpIHtcblx0XHRpZiAodHlwZW9mIChuYW1lKSAhPT0gJ3N0cmluZycpIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5nZXRBbGwoKVtuYW1lXSB8fCAnJztcblx0fVxuXG5cdC8qKlxuXHQgKiBQYXJzZXMgYSBjb29raWUgc3RyaW5nIGludG8gdGhlIG1hcCBvZiBjb29raWUga2V5L3ZhbHVlIHBhaXJzLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBjb29raWUgc3RyaW5nLlxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgb2JqZWN0IHdpdGggY29va2llIHZhbHVlcyBieSB0aGVpciBuYW1lcy5cblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0X3BhcnNlQ29va2llU3RyaW5nKHN0cmluZykge1xuXHRcdGNvbnN0IGNvb2tpZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cblx0XHRpZiAodHlwZW9mIChzdHJpbmcpICE9PSAnc3RyaW5nJykge1xuXHRcdFx0cmV0dXJuIGNvb2tpZTtcblx0XHR9XG5cdFx0c3RyaW5nXG5cdFx0XHQuc3BsaXQoLzsgKi8pXG5cdFx0XHQuZm9yRWFjaChjb29raWVQYWlyID0+IHtcblx0XHRcdFx0Y29uc3QgZXF1YWxzSW5kZXggPSBjb29raWVQYWlyLmluZGV4T2YoJz0nKTtcblx0XHRcdFx0aWYgKGVxdWFsc0luZGV4IDwgMCkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IGtleSA9IGNvb2tpZVBhaXJcblx0XHRcdFx0XHQuc3Vic3RyaW5nKDAsIGVxdWFsc0luZGV4KVxuXHRcdFx0XHRcdC50cmltKCk7XG5cblx0XHRcdFx0Y29va2llW2tleV0gPSBjb29raWVQYWlyXG5cdFx0XHRcdFx0LnN1YnN0cmluZyhlcXVhbHNJbmRleCArIDEpXG5cdFx0XHRcdFx0LnRyaW0oKVxuXHRcdFx0XHRcdC5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKTtcblx0XHRcdH0pO1xuXG5cdFx0cmV0dXJuIGNvb2tpZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIGNvb2tpZSBzZXR1cCBvYmplY3QgdG8gdGhlIGNvb2tpZSBzdHJpbmcuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb29raWVTZXR1cCBUaGUgY29va2llIHNldHVwIG9iamVjdC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGNvb2tpZVNldHVwLmtleSBUaGUgY29va2llIGtleS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGNvb2tpZVNldHVwLnZhbHVlIFRoZSBjb29raWUncyB2YWx1ZS5cblx0ICogQHBhcmFtIHtudW1iZXI/fSBjb29raWVTZXR1cC5tYXhBZ2UgVGhlIGNvb2tpZSdzIG1heCBhZ2UgaW4gc2Vjb25kcy5cblx0ICogQHBhcmFtIHtEYXRlP30gY29va2llU2V0dXAuZXhwaXJlcyBUaGUgZXhwaXJhdGlvbiBkYXRlLlxuXHQgKiBAcGFyYW0ge3N0cmluZz99IGNvb2tpZVNldHVwLnBhdGggVGhlIGNvb2tpZSdzIFVSSSBwYXRoLlxuXHQgKiBAcGFyYW0ge3N0cmluZz99IGNvb2tpZVNldHVwLmRvbWFpbiBUaGUgY29va2llJ3MgZG9tYWluLlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW4/fSBjb29raWVTZXR1cC5zZWN1cmUgSXMgdGhlIGNvb2tpZSBzZWN1cmVkLlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW4/fSBjb29raWVTZXR1cC5odHRwT25seSBJcyB0aGUgY29va2llIEhUVFAgb25seS5cblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvb2tpZSBzdHJpbmcuXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdF9jb252ZXJ0VG9Db29raWVTZXR1cChjb29raWVTZXR1cCkge1xuXHRcdGlmICh0eXBlb2YgKGNvb2tpZVNldHVwLmtleSkgIT09ICdzdHJpbmcnIHx8XG5cdFx0XHR0eXBlb2YgKGNvb2tpZVNldHVwLnZhbHVlKSAhPT0gJ3N0cmluZycpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignV3Jvbmcga2V5IG9yIHZhbHVlJyk7XG5cdFx0fVxuXG5cdFx0dmFyIGNvb2tpZSA9IGAke2Nvb2tpZVNldHVwLmtleX09JHtjb29raWVTZXR1cC52YWx1ZX1gO1xuXG5cdFx0Ly8gaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNjI2NSNzZWN0aW9uLTQuMS4xXG5cdFx0aWYgKHR5cGVvZiAoY29va2llU2V0dXAubWF4QWdlKSA9PT0gJ251bWJlcicpIHtcblx0XHRcdGNvb2tpZSArPSBgOyBNYXgtQWdlPSR7Y29va2llU2V0dXAubWF4QWdlLnRvRml4ZWQoKX1gO1xuXHRcdFx0aWYgKCFjb29raWVTZXR1cC5leHBpcmVzKSB7XG5cdFx0XHRcdC8vIGJ5IGRlZmF1bHQgZXhwaXJlIGRhdGUgPSBjdXJyZW50IGRhdGUgKyBtYXgtYWdlIGluIHNlY29uZHNcblx0XHRcdFx0Y29va2llU2V0dXAuZXhwaXJlcyA9IG5ldyBEYXRlKERhdGUubm93KCkgK1xuXHRcdFx0XHRcdGNvb2tpZVNldHVwLm1heEFnZSAqIDEwMDApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoY29va2llU2V0dXAuZXhwaXJlcyBpbnN0YW5jZW9mIERhdGUpIHtcblx0XHRcdGNvb2tpZSArPSBgOyBFeHBpcmVzPSR7Y29va2llU2V0dXAuZXhwaXJlcy50b1VUQ1N0cmluZygpfWA7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgKGNvb2tpZVNldHVwLnBhdGgpID09PSAnc3RyaW5nJykge1xuXHRcdFx0Y29va2llICs9IGA7IFBhdGg9JHtjb29raWVTZXR1cC5wYXRofWA7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgKGNvb2tpZVNldHVwLmRvbWFpbikgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRjb29raWUgKz0gYDsgRG9tYWluPSR7Y29va2llU2V0dXAuZG9tYWlufWA7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgKGNvb2tpZVNldHVwLnNlY3VyZSkgPT09ICdib29sZWFuJyAmJlxuXHRcdFx0Y29va2llU2V0dXAuc2VjdXJlKSB7XG5cdFx0XHRjb29raWUgKz0gJzsgU2VjdXJlJztcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiAoY29va2llU2V0dXAuaHR0cE9ubHkpID09PSAnYm9vbGVhbicgJiZcblx0XHRcdGNvb2tpZVNldHVwLmh0dHBPbmx5KSB7XG5cdFx0XHRjb29raWUgKz0gJzsgSHR0cE9ubHknO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb29raWU7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb29raWVXcmFwcGVyQmFzZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBJbXBsZW1lbnRzIHRoZSBiYXNpYyBDb29raWUgV3JhcHBlciBjbGFzcyBmb3IgYm90aCBzZXJ2ZXJcbiAqIGFuZCBicm93c2VyIGVudmlyb25tZW50cy5cbiAqL1xuY2xhc3MgRG9jdW1lbnRSZW5kZXJlckJhc2Uge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBiYXNpYyBkb2N1bWVudCByZW5kZXJlci5cblx0ICogQHBhcmFtIHtTZXJ2aWNlTG9jYXRvcn0gbG9jYXRvciBUaGUgbG9jYXRvciBmb3IgcmVzb2x2aW5nIGRlcGVuZGVuY2llcy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGxvY2F0b3IpIHtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgc2VydmljZSBsb2NhdG9yLlxuXHRcdCAqIEB0eXBlIHtTZXJ2aWNlTG9jYXRvcn1cblx0XHQgKiBAcHJvdGVjdGVkXG5cdFx0ICovXG5cdFx0dGhpcy5fc2VydmljZUxvY2F0b3IgPSBsb2NhdG9yO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBjb250ZXh0IGZhY3RvcnkuXG5cdFx0ICogQHR5cGUge0NvbnRleHRGYWN0b3J5fVxuXHRcdCAqIEBwcm90ZWN0ZWRcblx0XHQgKi9cblx0XHR0aGlzLl9jb250ZXh0RmFjdG9yeSA9IGxvY2F0b3IucmVzb2x2ZSgnY29udGV4dEZhY3RvcnknKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgY29tcG9uZW50IGxvYWRlci5cblx0XHQgKiBAdHlwZSB7Q29tcG9uZW50TG9hZGVyfVxuXHRcdCAqIEBwcm90ZWN0ZWRcblx0XHQgKi9cblx0XHR0aGlzLl9jb21wb25lbnRMb2FkZXIgPSBsb2NhdG9yLnJlc29sdmUoJ2NvbXBvbmVudExvYWRlcicpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBldmVudCBidXMuXG5cdFx0ICogQHBhcmFtICB7RXZlbnRFbWl0dGVyfVxuXHRcdCAqL1xuXHRcdHRoaXMuX2V2ZW50QnVzID0gbG9jYXRvci5yZXNvbHZlKCdldmVudEJ1cycpO1xuXG5cdFx0Y29uc3Qgc3RvcmVMb2FkZXIgPSBsb2NhdG9yLnJlc29sdmUoJ3N0b3JlTG9hZGVyJyk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IG1vZHVsZSBsb2FkaW5nIHByb21pc2UuXG5cdFx0ICogQHR5cGUge1Byb21pc2V9XG5cdFx0ICogQHByb3RlY3RlZFxuXHRcdCAqL1xuXHRcdHRoaXMuX2xvYWRpbmcgPSBQcm9taXNlLmFsbChbXG5cdFx0XHR0aGlzLl9jb21wb25lbnRMb2FkZXIubG9hZCgpLFxuXHRcdFx0c3RvcmVMb2FkZXIubG9hZCgpXG5cdFx0XSlcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0dGhpcy5fbG9hZGluZyA9IG51bGw7XG5cdFx0XHRcdHRoaXMuX2V2ZW50QnVzLmVtaXQoJ3JlYWR5Jyk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKHJlYXNvbiA9PiB0aGlzLl9ldmVudEJ1cy5lbWl0KCdlcnJvcicsIHJlYXNvbikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgc3RhdGUgd2hlbiBDYXRiZXJyeSB3aWxsIGJlIGFibGUgdG8gaGFuZGxlIHJlcXVlc3RzLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSBmb3Igbm90aGluZy5cblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0X2dldFByb21pc2VGb3JSZWFkeVN0YXRlKCkge1xuXHRcdHJldHVybiB0aGlzLl9sb2FkaW5nID9cblx0XHRcdHRoaXMuX2xvYWRpbmcgOlxuXHRcdFx0UHJvbWlzZS5yZXNvbHZlKCk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEb2N1bWVudFJlbmRlcmVyQmFzZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBJbXBsZW1lbnRzIHRoZSBiYXNpYyBMb2FkZXIgY2xhc3MgZm9yIGJvdGggc2VydmVyXG4gKiBhbmQgYnJvd3NlciBlbnZpcm9ubWVudHMuXG4gKi9cbmNsYXNzIExvYWRlckJhc2Uge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBiYXNpYyBsb2FkZXIuXG5cdCAqIEBwYXJhbSB7U2VydmljZUxvY2F0b3J9IGxvY2F0b3IgVGhlIHNlcnZpY2UgbG9jYXRvciBmb3IgcmVzb2x2aW5nIGRlcGVuZGVuY2llcy5cblx0ICogQHBhcmFtIHtBcnJheX0gdHJhbnNmb3JtcyBUaGUgbGlzdCBvZiBtb2R1bGUgdHJhbnNmb3JtYXRpb25zLlxuXHQgKi9cblx0Y29uc3RydWN0b3IobG9jYXRvciwgdHJhbnNmb3Jtcykge1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBsaXN0IG9mIG1vZHVsZSB0cmFuc2Zvcm1hdGlvbnMuXG5cdFx0ICogQHR5cGUge0FycmF5fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fdHJhbnNmb3JtcyA9IHRyYW5zZm9ybXM7XG5cdFx0dGhpcy5fZXZlbnRCdXMgPSBsb2NhdG9yLnJlc29sdmUoJ2V2ZW50QnVzJyk7XG5cdH1cblxuXHQvKipcblx0ICogQXBwbGllcyBhbGwgdGhlIHRyYW5zZm9ybWF0aW9ucyBmb3IgdGhlIGxvYWRlZCBtb2R1bGUuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBtb2R1bGUgVGhlIGxvYWRlZCBtb2R1bGUuXG5cdCAqIEBwYXJhbSB7bnVtYmVyP30gaW5kZXggVGhlIHRyYW5zZm9ybWF0aW9uIGluZGV4IGluIHRoZSBsaXN0LlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZTxPYmplY3Q+fSBUaGUgdHJhbnNmb3JtZWQgbW9kdWxlLlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHRfYXBwbHlUcmFuc2Zvcm1zKG1vZHVsZSwgaW5kZXgpIHtcblx0XHRpZiAoaW5kZXggPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Ly8gdGhlIGxpc3QgaXMgYSBzdGFjaywgd2Ugc2hvdWxkIHJldmVyc2UgaXRcblx0XHRcdGluZGV4ID0gdGhpcy5fdHJhbnNmb3Jtcy5sZW5ndGggLSAxO1xuXHRcdH1cblxuXHRcdGlmIChpbmRleCA8IDApIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUobW9kdWxlKTtcblx0XHR9XG5cblx0XHRjb25zdCB0cmFuc2Zvcm1hdGlvbiA9IHRoaXMuX3RyYW5zZm9ybXNbaW5kZXhdO1xuXG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG5cdFx0XHQudGhlbigoKSA9PiB0cmFuc2Zvcm1hdGlvbi50cmFuc2Zvcm0obW9kdWxlKSlcblx0XHRcdC5jYXRjaChyZWFzb24gPT4ge1xuXHRcdFx0XHR0aGlzLl9ldmVudEJ1cy5lbWl0KCdlcnJvcicsIHJlYXNvbik7XG5cdFx0XHRcdHJldHVybiBtb2R1bGU7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4odHJhbnNmb3JtZWRNb2R1bGUgPT4gdGhpcy5fYXBwbHlUcmFuc2Zvcm1zKHRyYW5zZm9ybWVkTW9kdWxlLCBpbmRleCAtIDEpKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExvYWRlckJhc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogSW1wbGVtZW50cyB0aGUgYmFzaWMgTW9kdWxlIEFQSSBQcm92aWRlciBjbGFzcyBmb3IgYm90aCBzZXJ2ZXJcbiAqIGFuZCBicm93c2VyIGVudmlyb25tZW50cy5cbiAqL1xuY2xhc3MgTW9kdWxlQXBpUHJvdmlkZXJCYXNlIHtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgYmFzaWMgQVBJIHByb3ZpZGVyLlxuXHQgKiBAcGFyYW0ge1NlcnZpY2VMb2NhdG9yfSBsb2NhdG9yIFNlcnZpY2UgbG9jYXRvciBmb3IgcmVzb2x2aW5nIGRlcGVuZGVuY2llcy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGxvY2F0b3IpIHtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgc2VydmljZSBsb2NhdG9yLlxuXHRcdCAqIEB0eXBlIHtTZXJ2aWNlTG9jYXRvcn1cblx0XHQgKi9cblx0XHR0aGlzLmxvY2F0b3IgPSBsb2NhdG9yO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBjb29raWUgcHJvdmlkZXIuXG5cdFx0ICogQHR5cGUge0Nvb2tpZVdyYXBwZXJ9XG5cdFx0ICovXG5cdFx0dGhpcy5jb29raWUgPSBsb2NhdG9yLnJlc29sdmUoJ2Nvb2tpZVdyYXBwZXInKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgZXZlbnQgYnVzLlxuXHRcdCAqIEB0eXBlIHtFdmVudEVtaXR0ZXJ9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9ldmVudEJ1cyA9IGxvY2F0b3IucmVzb2x2ZSgnZXZlbnRCdXMnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTdWJzY3JpYmVzIG9uIHRoZSBzcGVjaWZpZWQgZXZlbnQgaW4gQ2F0YmVycnkuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIGV2ZW50LlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyIFRoZSBldmVudCBoYW5kbGVyLlxuXHQgKiBAcmV0dXJucyB7TW9kdWxlQXBpUHJvdmlkZXJCYXNlfSBUaGlzIG9iamVjdCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRvbihldmVudE5hbWUsIGhhbmRsZXIpIHtcblx0XHRjaGVja0V2ZW50TmFtZUFuZEhhbmRsZXIoZXZlbnROYW1lLCBoYW5kbGVyKTtcblx0XHR0aGlzLl9ldmVudEJ1cy5vbihldmVudE5hbWUsIGhhbmRsZXIpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFN1YnNjcmliZXMgb24gdGhlIHNwZWNpZmllZCBldmVudCBpbiBDYXRiZXJyeSB0byBoYW5kbGUgaXQgb25jZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXIgVGhlIGV2ZW50IGhhbmRsZXIuXG5cdCAqIEByZXR1cm5zIHtNb2R1bGVBcGlQcm92aWRlckJhc2V9IFRoaXMgb2JqZWN0IGZvciBjaGFpbmluZy5cblx0ICovXG5cdG9uY2UoZXZlbnROYW1lLCBoYW5kbGVyKSB7XG5cdFx0Y2hlY2tFdmVudE5hbWVBbmRIYW5kbGVyKGV2ZW50TmFtZSwgaGFuZGxlcik7XG5cdFx0dGhpcy5fZXZlbnRCdXMub25jZShldmVudE5hbWUsIGhhbmRsZXIpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgdGhlIHNwZWNpZmllZCBoYW5kbGVyIGZyb20gdGhlIHNwZWNpZmllZCBldmVudC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXIgVGhlIGV2ZW50IGhhbmRsZXIuXG5cdCAqIEByZXR1cm5zIHtNb2R1bGVBcGlQcm92aWRlckJhc2V9IFRoaXMgb2JqZWN0IGZvciBjaGFpbmluZy5cblx0ICovXG5cdHJlbW92ZUxpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlcikge1xuXHRcdGNoZWNrRXZlbnROYW1lQW5kSGFuZGxlcihldmVudE5hbWUsIGhhbmRsZXIpO1xuXHRcdHRoaXMuX2V2ZW50QnVzLnJlbW92ZUxpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlcik7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlcyBhbGwgaGFuZGxlcnMgZnJvbSB0aGUgc3BlY2lmaWVkIGV2ZW50IGluIENhdGJlcnJ5LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBldmVudC5cblx0ICogQHJldHVybnMge01vZHVsZUFwaVByb3ZpZGVyQmFzZX0gVGhpcyBvYmplY3QgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0cmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50TmFtZSkge1xuXHRcdGNoZWNrRXZlbnROYW1lQW5kSGFuZGxlcihldmVudE5hbWUsIHN0dWIpO1xuXHRcdHRoaXMuX2V2ZW50QnVzLnJlbW92ZUFsbExpc3RlbmVycyhldmVudE5hbWUpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgVVJJIGZvciB0aGUgbmFtZWQgcm91dGUgYW5kIHNwZWNpZmllZCBwYXJhbWV0ZXJzLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSByb3V0ZS5cblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbHVlcyBTZXQgb2Ygcm91dGUgcGFyYW1ldGVyIHZhbHVlcy5cblx0ICogQHJldHVybnMge3N0cmluZ30gVVJJIHN0cmluZy5cblx0ICovXG5cdGdldFJvdXRlVVJJKG5hbWUsIHZhbHVlcykge1xuXHRcdGNvbnN0IHN0YXRlUHJvdmlkZXIgPSB0aGlzLmxvY2F0b3IucmVzb2x2ZSgnc3RhdGVQcm92aWRlcicpO1xuXHRcdHJldHVybiBzdGF0ZVByb3ZpZGVyLmdldFJvdXRlVVJJKG5hbWUsIHZhbHVlcyk7XG5cdH1cbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYW4gZXZlbnQgbmFtZSBpcyBhIHN0cmluZyBhbmQgaGFuZGxlciBpcyBhIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSBldmVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRvIGNoZWNrLlxuICogQHBhcmFtIHsqfSBoYW5kbGVyIFRoZSBldmVudCBoYW5kbGVyIHRvIGNoZWNrLlxuICovXG5mdW5jdGlvbiBjaGVja0V2ZW50TmFtZUFuZEhhbmRsZXIoZXZlbnROYW1lLCBoYW5kbGVyKSB7XG5cdGlmICh0eXBlb2YgKGV2ZW50TmFtZSkgIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdFdmVudCBuYW1lIHNob3VsZCBiZSBhIHN0cmluZycpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiAoaGFuZGxlcikgIT09ICdmdW5jdGlvbicpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0V2ZW50IGhhbmRsZXIgc2hvdWxkIGJlIGEgZnVuY3Rpb24nKTtcblx0fVxufVxuXG4vKipcbiAqIERvZXMgbm90aGluZy4gSXQgaXMgdXNlZCBhcyBhIGRlZmF1bHQgY2FsbGJhY2suXG4gKi9cbmZ1bmN0aW9uIHN0dWIoKSB7fVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZHVsZUFwaVByb3ZpZGVyQmFzZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXJpSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy91cmlIZWxwZXInKTtcbmNvbnN0IGNhdGJlcnJ5VXJpID0gcmVxdWlyZSgnY2F0YmVycnktdXJpJyk7XG5jb25zdCBVUkkgPSBjYXRiZXJyeVVyaS5VUkk7XG5cbi8qKlxuICogSW1wbGVtZW50cyB0aGUgc3RhdGUgcHJvdmlkZXIgZm9yIHRoZSBzZXJ2ZXIgZW52aXJvbm1lbnQuXG4gKi9cbmNsYXNzIFN0YXRlUHJvdmlkZXJCYXNlIHtcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBzdGF0ZSBwcm92aWRlci5cblx0ICogQHBhcmFtIHtTZXJ2aWNlTG9jYXRvcn0gbG9jYXRvciBTZXJ2aWNlIGxvY2F0b3IgZm9yIHJlc29sdmluZyBVUkkgbWFwcGVycy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGxvY2F0b3IpIHtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgc2V0IG9mIG5hbWVkIHJvdXRlcy5cblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fbmFtZWRSb3V0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCByb3V0ZSBkZXNjcmlwdG9ycy5cblx0XHQgKi9cblx0XHR0aGlzLl9yb3V0ZURlc2NyaXB0b3JzID0gdGhpcy5fZ2V0Um91dGVEZXNjcmlwdG9ycyhsb2NhdG9yKTtcblx0XHR0aGlzLl9yb3V0ZURlc2NyaXB0b3JzLmZvckVhY2goZGVzY3JpcHRvciA9PiB7XG5cdFx0XHR0aGlzLl9yZXN0b3JlUmVndWxhckV4cHJlc3Npb25zKGRlc2NyaXB0b3IpO1xuXHRcdFx0aWYgKHR5cGVvZiAoZGVzY3JpcHRvci5uYW1lKSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0dGhpcy5fbmFtZWRSb3V0ZXNbZGVzY3JpcHRvci5uYW1lXSA9IGRlc2NyaXB0b3I7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IGxpc3Qgb2YgVVJJIG1hcHBlcnMuXG5cdFx0ICogQHR5cGUge0FycmF5fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fdXJpTWFwcGVycyA9IHRoaXMuX2dldFVyaU1hcHBlcnMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGEgc3RhdGUgYnkgdGhlIHNwZWNpZmllZCBsb2NhdGlvbiBVUkkuXG5cdCAqIEBwYXJhbSB7VVJJfSB1cmkgVGhlIFVSSSBsb2NhdGlvbi5cblx0ICogQHJldHVybnMge09iamVjdHxudWxsfSBUaGUgc3RhdGUgb2JqZWN0LlxuXHQgKi9cblx0Z2V0U3RhdGVCeVVyaSh1cmkpIHtcblx0XHRpZiAodGhpcy5fdXJpTWFwcGVycy5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHVyaSA9IHVyaS5jbG9uZSgpO1xuXHRcdHVyaS5zY2hlbWUgPSBudWxsO1xuXHRcdHVyaS5hdXRob3JpdHkgPSBudWxsO1xuXHRcdHVyaS5mcmFnbWVudCA9IG51bGw7XG5cdFx0dXJpLnBhdGggPSB1cmlIZWxwZXIucmVtb3ZlRW5kU2xhc2godXJpLnBhdGgpO1xuXG5cdFx0Y29uc3Qgc3RhdGUgPSB0aGlzLl9tYXBTdGF0ZSh1cmkpO1xuXHRcdGlmICghc3RhdGUpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdC8vIG1ha2Ugc3RhdGUgb2JqZWN0IGltbXV0YWJsZVxuXHRcdE9iamVjdC5rZXlzKHN0YXRlKS5mb3JFYWNoKHN0b3JlTmFtZSA9PiBPYmplY3QuZnJlZXplKHN0YXRlW3N0b3JlTmFtZV0pKTtcblx0XHRPYmplY3QuZnJlZXplKHN0YXRlKTtcblxuXHRcdHJldHVybiBzdGF0ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGEgVVJJIHBhdGggc3RyaW5nIGZvciB0aGUgbmFtZWQgcm91dGUgdXNpbmcgc3BlY2lmaWVkIHBhcmFtZXRlcnMuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSByb3V0ZS5cblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbHVlcyBUaGUgc2V0IG9mIHBhcmFtZXRlciB2YWx1ZXMgZm9yIHRoZSByb3V0ZS5cblx0ICogQHJldHVybnMge3N0cmluZ30gVVJJIHBhdGggc3RyaW5nLlxuXHQgKi9cblx0Z2V0Um91dGVVUkkobmFtZSwgdmFsdWVzKSB7XG5cdFx0dmFsdWVzID0gdmFsdWVzIHx8IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdFx0Y29uc3QgZGVzY3JpcHRvciA9IHRoaXMuX25hbWVkUm91dGVzW25hbWVdO1xuXHRcdGlmICghZGVzY3JpcHRvcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBUaGVyZSBpcyBubyBzdWNoIHJvdXRlIGNhbGxlZCBcIiR7bmFtZX1cImApO1xuXHRcdH1cblxuXHRcdGNvbnN0IHVyaSA9IG5ldyBVUkkoZGVzY3JpcHRvci5leHByZXNzaW9uKTtcblxuXHRcdC8vIHNldCB2YWx1ZSB0byBVUkkgcGF0aCBwYXJhbWV0ZXJzIGZpcnN0XG5cdFx0aWYgKGRlc2NyaXB0b3IucGF0aFBhcmFtZXRlcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0dXJpLnBhdGggPSBzZXRQYXJhbWV0ZXJWYWx1ZXMoXG5cdFx0XHRcdHVyaS5wYXRoLCBkZXNjcmlwdG9yLnBhdGhQYXJhbWV0ZXJzLCB2YWx1ZXMsXG5cdFx0XHRcdChwYXJhbWV0ZXIsIHZhbHVlKSA9PiBlbmNvZGVVUklDb21wb25lbnQoZGVmYXVsdFBhcmFtZXRlclZhbHVlUHJvY2Vzc29yKHBhcmFtZXRlciwgdmFsdWUpKVxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHQvLyB0cnlpbmcgdG8gc2V0IHF1ZXJ5IHN0cmluZyBwYXJhbWV0ZXJzIGlmIHRoZXkgZXhpc3Rcblx0XHRpZiAoZGVzY3JpcHRvci5xdWVyeVBhcmFtZXRlcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0Y29uc3QgcXVlcnlWYWx1ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdFx0XHRkZXNjcmlwdG9yLnF1ZXJ5UGFyYW1ldGVycy5mb3JFYWNoKHF1ZXJ5UGFyYW1ldGVyID0+IHtcblx0XHRcdFx0Y29uc3QgbmFtZSA9IHNldFBhcmFtZXRlclZhbHVlcyhcblx0XHRcdFx0XHRxdWVyeVBhcmFtZXRlci5uYW1lRXhwcmVzc2lvbiwgcXVlcnlQYXJhbWV0ZXIubmFtZVBhcmFtZXRlcnMsIHZhbHVlc1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdC8vIGlmIHRoZXJlIGlzIG5vIG5hbWUgbWVhbnMgdGhlcmUgaXMgbm8gcXVlcnkgcGFyYW1ldGVyIGF0IGFsbFxuXHRcdFx0XHRpZiAoIW5hbWUpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBpZiB0aGVyZSBhcmUgbm8gcGFyYW1ldGVyIHZhbHVlcyBpdCBtZWFucyB0aGUgcXVlcnlcblx0XHRcdFx0Ly8gcGFyYW1ldGVyIGRvZXMgbm90IGhhdmUgdmFsdWVcblx0XHRcdFx0aWYgKCFxdWVyeVBhcmFtZXRlci52YWx1ZVBhcmFtZXRlcnMpIHtcblx0XHRcdFx0XHRxdWVyeVZhbHVlc1tuYW1lXSA9IG51bGw7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gaWYgdGhlcmUgYXJlIG5vIHJvdXRlIHBhcmFtZXRlcnMgaW4gdGhlIHF1ZXJ5IHBhcmFtZXRlcidzIHZhbHVlXG5cdFx0XHRcdC8vIHRoYXQgbWVhbnMgaXQgaGFzIGEgc3RhdGljIHZhbHVlXG5cdFx0XHRcdGlmIChxdWVyeVBhcmFtZXRlci52YWx1ZVBhcmFtZXRlcnMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0cXVlcnlWYWx1ZXNbbmFtZV0gPSBxdWVyeVBhcmFtZXRlci52YWx1ZUV4cHJlc3Npb247XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgZmlyc3RQYXJhbWV0ZXJOYW1lID0gcXVlcnlQYXJhbWV0ZXIudmFsdWVQYXJhbWV0ZXJzWzBdLm5hbWU7XG5cdFx0XHRcdGNvbnN0IGZpcnN0UGFyYW1ldGVyVmFsdWUgPSB2YWx1ZXNbZmlyc3RQYXJhbWV0ZXJOYW1lXTtcblx0XHRcdFx0Ly8gaWYgdGhlcmUgaXMgb25seSBvbmUgcGFyYW1ldGVyIGluIHF1ZXJ5IHZhbHVlIGFuZFxuXHRcdFx0XHQvLyB0aGUgc3BlY2lmaWVkIHBhcmFtZXRlcidzIHZhbHVlIGlzIGFuIGFycmF5XG5cdFx0XHRcdGlmIChxdWVyeVBhcmFtZXRlci52YWx1ZVBhcmFtZXRlcnMubGVuZ3RoID09PSAxICYmIEFycmF5LmlzQXJyYXkoZmlyc3RQYXJhbWV0ZXJWYWx1ZSkpIHtcblx0XHRcdFx0XHRxdWVyeVZhbHVlc1tuYW1lXSA9IFtdO1xuXHRcdFx0XHRcdGZpcnN0UGFyYW1ldGVyVmFsdWUuZm9yRWFjaCh2YWx1ZSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCB2YWx1ZXNPYmplY3QgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRcdFx0XHRcdFx0dmFsdWVzT2JqZWN0W2ZpcnN0UGFyYW1ldGVyTmFtZV0gPSB2YWx1ZTtcblx0XHRcdFx0XHRcdGNvbnN0IHF1ZXJ5VmFsdWVTdHJpbmcgPSBzZXRQYXJhbWV0ZXJWYWx1ZXMoXG5cdFx0XHRcdFx0XHRcdHF1ZXJ5UGFyYW1ldGVyLnZhbHVlRXhwcmVzc2lvbiwgcXVlcnlQYXJhbWV0ZXIudmFsdWVQYXJhbWV0ZXJzLCB2YWx1ZXNPYmplY3Rcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRpZiAocXVlcnlWYWx1ZVN0cmluZy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRcdHF1ZXJ5VmFsdWVzW25hbWVdLnB1c2gocXVlcnlWYWx1ZVN0cmluZyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgcXVlcnlWYWx1ZVN0cmluZyA9IHNldFBhcmFtZXRlclZhbHVlcyhcblx0XHRcdFx0XHRxdWVyeVBhcmFtZXRlci52YWx1ZUV4cHJlc3Npb24sIHF1ZXJ5UGFyYW1ldGVyLnZhbHVlUGFyYW1ldGVycywgdmFsdWVzXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGlmIChxdWVyeVZhbHVlU3RyaW5nLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRxdWVyeVZhbHVlc1tuYW1lXSA9IHF1ZXJ5VmFsdWVTdHJpbmc7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoT2JqZWN0LmtleXMocXVlcnlWYWx1ZXMpLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHR1cmkucXVlcnkgPSBudWxsO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dXJpLnF1ZXJ5LnZhbHVlcyA9IHF1ZXJ5VmFsdWVzO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB1cmkudG9TdHJpbmcoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNYXBzIHRoZSBzdGF0ZS5cblx0ICogQHBhcmFtIHtVUkl9IHVyaSBVUkkgdGhhdCBkZXNjcmliZXMgdGhlIHN0YXRlLlxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fG51bGx9IFRoZSBzdGF0ZSBmcm9tIFVSSS5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9tYXBTdGF0ZSh1cmkpIHtcblx0XHRsZXQgc3RhdGUgPSBudWxsO1xuXHRcdHRoaXMuX3VyaU1hcHBlcnMuc29tZShtYXBwZXIgPT4ge1xuXHRcdFx0c3RhdGUgPSBtYXBwZXIodXJpKTtcblx0XHRcdHJldHVybiBCb29sZWFuKHN0YXRlKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBzdGF0ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGEgbGlzdCBvZiBVUkkgbWFwcGVycy5cblx0ICogQHJldHVybnMge0FycmF5fSBUaGUgbGlzdCBvZiBVUkkgbWFwcGVycy5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9nZXRVcmlNYXBwZXJzKCkge1xuXHRcdHJldHVybiB0aGlzLl9yb3V0ZURlc2NyaXB0b3JzLm1hcChkZXNjcmlwdG9yID0+IHtcblx0XHRcdGlmIChkZXNjcmlwdG9yLmV4cHJlc3Npb24gaW5zdGFuY2VvZiBSZWdFeHApIHtcblx0XHRcdFx0cmV0dXJuIHVyaSA9PiBkZXNjcmlwdG9yLmV4cHJlc3Npb24udGVzdCh1cmkudG9TdHJpbmcoKSkgPyBkZXNjcmlwdG9yLm1hcCh1cmkpIDogbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZXh0cmFjdG9yID0gdGhpcy5fY3JlYXRlUGFyYW1ldGVyRXh0cmFjdG9yKGRlc2NyaXB0b3IpO1xuXHRcdFx0aWYgKGRlc2NyaXB0b3IubWFwIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcblx0XHRcdFx0cmV0dXJuIHVyaSA9PiB7XG5cdFx0XHRcdFx0Y29uc3Qgc3RhdGUgPSBleHRyYWN0b3IodXJpKTtcblx0XHRcdFx0XHRyZXR1cm4gc3RhdGUgPyBkZXNjcmlwdG9yLm1hcChzdGF0ZSkgOiBzdGF0ZTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBleHRyYWN0b3I7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBhIGxpc3Qgb2Ygcm91dGUgZGVzY3JpcHRvcnMuXG5cdCAqIEBwYXJhbSB7U2VydmljZUxvY2F0b3J9IHNlcnZpY2VMb2NhdG9yIFRoZSBTZXJ2aWNlIGxvY2F0b3Jcblx0ICogZm9yIGdldHRpbmcgcm91dGUgZGVmaW5pdGlvbnMuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGxpc3Qgb2Ygcm91dGUgZGVzY3JpcHRvcnMuXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICogQGFic3RyYWN0XG5cdCAqL1xuXHRfZ2V0Um91dGVEZXNjcmlwdG9ycyhzZXJ2aWNlTG9jYXRvcikge1xuXG5cdH1cblxuXHQvKipcblx0ICogUmVzdG9yZXMgYWxsIHRoZSByZWd1bGFyIGV4cHJlc3Npb25zIGZyb20gdGhlaXIgc291cmNlcy5cblx0ICogQHBhcmFtIHtPYmplY3R9IGRlc2NyaXB0b3IgVGhlIHJvdXRlIGRlc2NyaXB0b3IuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfcmVzdG9yZVJlZ3VsYXJFeHByZXNzaW9ucyhkZXNjcmlwdG9yKSB7XG5cblx0XHQvLyBiZWNhdXNlIHRoZSBvYmplY3QgaXMgY29udmVydGVkIHRvIEpTT04gd2UgaGF2ZSB0byBzdG9yZSB0aGVcblx0XHQvLyByZWd1bGFyIGV4cHJlc3Npb25zIGFzIHRoZWlyIHNvdXJjZXNcblx0XHRpZiAoZGVzY3JpcHRvci5wYXRoUmVnRXhwU291cmNlKSB7XG5cdFx0XHRkZXNjcmlwdG9yLnBhdGhSZWdFeHAgPSBuZXcgUmVnRXhwKGRlc2NyaXB0b3IucGF0aFJlZ0V4cFNvdXJjZSwgJ2knKTtcblx0XHR9XG5cdFx0aWYgKCFkZXNjcmlwdG9yLnF1ZXJ5UGFyYW1ldGVycykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRkZXNjcmlwdG9yLnF1ZXJ5UGFyYW1ldGVycy5mb3JFYWNoKHBhcmFtZXRlciA9PiB7XG5cdFx0XHRwYXJhbWV0ZXIubmFtZVJlZ0V4cCA9IG5ldyBSZWdFeHAocGFyYW1ldGVyLm5hbWVSZWdFeHBTb3VyY2UsICdpJyk7XG5cdFx0XHRpZiAocGFyYW1ldGVyLnZhbHVlUmVnRXhwU291cmNlKSB7XG5cdFx0XHRcdHBhcmFtZXRlci52YWx1ZVJlZ0V4cCA9IG5ldyBSZWdFeHAocGFyYW1ldGVyLnZhbHVlUmVnRXhwU291cmNlLCAnaScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGV4dHJhY3RzIHBhcmFtZXRlcnMgZnJvbSB0aGUgVVJJLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcm91dGVEZXNjcmlwdG9yIFJvdXRlIGRlc2NyaXB0b3IuXG5cdCAqIEByZXR1cm5zIHtmdW5jdGlvbn0gRnVuY3Rpb25cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9jcmVhdGVQYXJhbWV0ZXJFeHRyYWN0b3Iocm91dGVEZXNjcmlwdG9yKSB7XG5cdFx0Y29uc3QgcGF0aFJlZ0V4cCA9IG5ldyBSZWdFeHAocm91dGVEZXNjcmlwdG9yLnBhdGhSZWdFeHBTb3VyY2UpO1xuXHRcdHJldHVybiB1cmkgPT4ge1xuXHRcdFx0Y29uc3QgcGF0aE1hdGNoZXMgPSB1cmkucGF0aC5tYXRjaChwYXRoUmVnRXhwKTtcblx0XHRcdGlmICghcGF0aE1hdGNoZXMpIHtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHN0YXRlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0XHRcdGNvbnN0IHBhdGhQYXJhbWV0ZXJWYWx1ZXMgPSBwYXRoTWF0Y2hlcy5zbGljZSgxKTtcblxuXHRcdFx0c2V0U3RhdGVWYWx1ZXMoc3RhdGUsIHBhdGhQYXJhbWV0ZXJWYWx1ZXMsIHJvdXRlRGVzY3JpcHRvci5wYXRoUGFyYW1ldGVycyk7XG5cblx0XHRcdGlmICh1cmkucXVlcnkgJiYgdXJpLnF1ZXJ5LnZhbHVlcykge1xuXHRcdFx0XHRzZXRRdWVyeVBhcmFtZXRlcnMoc3RhdGUsIHVyaS5xdWVyeS52YWx1ZXMsIHJvdXRlRGVzY3JpcHRvcik7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBzdGF0ZTtcblx0XHR9O1xuXHR9XG59XG5cbi8qKlxuICogU2V0cyBwYXJhbWV0ZXIgdmFsdWVzIHRvIHRoZSBzdGF0ZSB1c2luZyBwYXJhbWV0ZXIgYW5kIHN0b3JlIG5hbWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YXRlIEN1cnJlbnQgc3RhdGUgb2JqZWN0LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIEN1cnJlbnQgdmFsdWVzLlxuICogQHBhcmFtIHtBcnJheX0gcGFyYW1ldGVycyBMaXN0IG9mIHBhcmFtZXRlciBkZXNjcmlwdG9ycy5cbiAqL1xuZnVuY3Rpb24gc2V0U3RhdGVWYWx1ZXMoc3RhdGUsIHZhbHVlcywgcGFyYW1ldGVycykge1xuXHR2YWx1ZXMuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG5cdFx0Y29uc3QgcGFyYW1ldGVyID0gcGFyYW1ldGVyc1tpbmRleF07XG5cdFx0cGFyYW1ldGVyLnN0b3Jlcy5mb3JFYWNoKHN0b3JlTmFtZSA9PiB7XG5cdFx0XHRpZiAoIShzdG9yZU5hbWUgaW4gc3RhdGUpKSB7XG5cdFx0XHRcdHN0YXRlW3N0b3JlTmFtZV0gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBpZiBVUkkgaGFzIHNldmVyYWwgdmFsdWVzIGZvciB0aGUgc2FtZSBwYXJhbWV0ZXIgaXQgdHVybnMgdG8gYW4gYXJyYXlcblx0XHRcdGlmIChwYXJhbWV0ZXIubmFtZSBpbiBzdGF0ZVtzdG9yZU5hbWVdKSB7XG5cdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KHN0YXRlW3N0b3JlTmFtZV1bcGFyYW1ldGVyLm5hbWVdKSkge1xuXHRcdFx0XHRcdHN0YXRlW3N0b3JlTmFtZV1bcGFyYW1ldGVyLm5hbWVdLnB1c2godmFsdWUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHN0YXRlW3N0b3JlTmFtZV1bcGFyYW1ldGVyLm5hbWVdID0gW3N0YXRlW3N0b3JlTmFtZV1bcGFyYW1ldGVyLm5hbWVdLCB2YWx1ZV07XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHN0YXRlW3N0b3JlTmFtZV1bcGFyYW1ldGVyLm5hbWVdID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xufVxuXG4vKipcbiAqIFNldHMgcXVlcnkgcGFyYW1ldGVycyB0byB0aGUgc3RhdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhdGUgQ3VycmVudCBzdGF0ZSBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gcXVlcnlWYWx1ZXMgVVJJIHF1ZXJ5IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge09iamVjdH0gcm91dGVEZXNjcmlwdG9yIEN1cnJlbnQgcm91dGUgZGVzY3JpcHRvci5cbiAqL1xuZnVuY3Rpb24gc2V0UXVlcnlQYXJhbWV0ZXJzKHN0YXRlLCBxdWVyeVZhbHVlcywgcm91dGVEZXNjcmlwdG9yKSB7XG5cdE9iamVjdC5rZXlzKHF1ZXJ5VmFsdWVzKVxuXHRcdC5mb3JFYWNoKG5hbWUgPT4ge1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBxdWVyeVZhbHVlc1tuYW1lXTtcblxuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRcdHZhbHVlLmZvckVhY2goaXRlbSA9PiB7XG5cdFx0XHRcdFx0Y29uc3Qgc3ViVmFsdWVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0XHRcdFx0XHRzdWJWYWx1ZXNbbmFtZV0gPSBpdGVtO1xuXHRcdFx0XHRcdHNldFF1ZXJ5UGFyYW1ldGVycyhzdGF0ZSwgc3ViVmFsdWVzLCByb3V0ZURlc2NyaXB0b3IpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgaXNWYWx1ZSA9IHR5cGVvZiAodmFsdWUpID09PSAnc3RyaW5nJztcblxuXHRcdFx0bGV0IHF1ZXJ5TmFtZU1hdGNoZXMgPSBudWxsO1xuXHRcdFx0bGV0IHF1ZXJ5VmFsdWVNYXRjaGVzID0gbnVsbDtcblx0XHRcdGxldCByb3V0ZVBhcmFtZXRlciA9IG51bGw7XG5cblx0XHRcdHJvdXRlRGVzY3JpcHRvci5xdWVyeVBhcmFtZXRlcnMuc29tZShwYXJhbWV0ZXIgPT4ge1xuXHRcdFx0XHRxdWVyeU5hbWVNYXRjaGVzID0gbmFtZS5tYXRjaChwYXJhbWV0ZXIubmFtZVJlZ0V4cCk7XG5cblx0XHRcdFx0aWYgKGlzVmFsdWUgJiYgcGFyYW1ldGVyLnZhbHVlUmVnRXhwKSB7XG5cdFx0XHRcdFx0cXVlcnlWYWx1ZU1hdGNoZXMgPSB2YWx1ZS5tYXRjaChwYXJhbWV0ZXIudmFsdWVSZWdFeHApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHF1ZXJ5TmFtZU1hdGNoZXMpIHtcblx0XHRcdFx0XHRyb3V0ZVBhcmFtZXRlciA9IHBhcmFtZXRlcjtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKCFyb3V0ZVBhcmFtZXRlcikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHNldFN0YXRlVmFsdWVzKHN0YXRlLCBxdWVyeU5hbWVNYXRjaGVzLnNsaWNlKDEpLCByb3V0ZVBhcmFtZXRlci5uYW1lUGFyYW1ldGVycyk7XG5cblx0XHRcdGlmICghcXVlcnlWYWx1ZU1hdGNoZXMpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0c2V0U3RhdGVWYWx1ZXMoc3RhdGUsIHF1ZXJ5VmFsdWVNYXRjaGVzLnNsaWNlKDEpLCByb3V0ZVBhcmFtZXRlci52YWx1ZVBhcmFtZXRlcnMpO1xuXHRcdH0pO1xufVxuXG4vKipcbiAqIFNldHMgcGFyYW1ldGVyIHZhbHVlcyB0byBhIHJvdXRlIGV4cHJlc3Npb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gZXhwcmVzc2lvbiBUaGUgcm91dGUgZXhwcmVzc2lvbi5cbiAqIEBwYXJhbSB7QXJyYXl9IHBhcmFtZXRlcnMgQXJyYXkgb2Ygcm91dGUgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZXMgRGljdGlvbmFyeSBvZiByb3V0ZSBwYXJhbWV0ZXIgdmFsdWVzLlxuICogQHBhcmFtIHtmdW5jdGlvbj99IHByZVByb2Nlc3NvciBWYWx1ZSBwcmVwcm9jZXNzb3JcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFN0cmluZyB3aXRoIHN1YnN0aXR1dGVkIHZhbHVlcy5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHNldFBhcmFtZXRlclZhbHVlcyhleHByZXNzaW9uLCBwYXJhbWV0ZXJzLCB2YWx1ZXMsIHByZVByb2Nlc3Nvcikge1xuXHRpZiAoIXBhcmFtZXRlcnMgfHwgcGFyYW1ldGVycy5sZW5ndGggPT09IDApIHtcblx0XHRyZXR1cm4gZXhwcmVzc2lvbjtcblx0fVxuXG5cdHByZVByb2Nlc3NvciA9IHByZVByb2Nlc3NvciB8fCBkZWZhdWx0UGFyYW1ldGVyVmFsdWVQcm9jZXNzb3I7XG5cblx0Ly8gYXBwbHkgdmFsdWVzIGZvciBwYXJhbWV0ZXJzIGluIHRoZSBVUkkgcGF0aFxuXHRsZXQgbmV4dFBhcmFtZXRlckluZGV4ID0gMDtcblx0bGV0IG5leHRQYXJhbWV0ZXIgPSBwYXJhbWV0ZXJzW25leHRQYXJhbWV0ZXJJbmRleF07XG5cdGxldCByZXN1bHQgPSAnJztcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGV4cHJlc3Npb24ubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAobmV4dFBhcmFtZXRlciAmJiBpID09PSBuZXh0UGFyYW1ldGVyLnN0YXJ0KSB7XG5cdFx0XHRyZXN1bHQgKz0gcHJlUHJvY2Vzc29yKG5leHRQYXJhbWV0ZXIsIHZhbHVlc1tuZXh0UGFyYW1ldGVyLm5hbWVdKTtcblx0XHRcdHdoaWxlICgrK2kgPCBuZXh0UGFyYW1ldGVyLmVuZCAtIDEpIHtcblx0XHRcdFx0Ly8ganVzdCBza2lwcGluZyB0aGUgcGFyYW1ldGVyIGluIHRoZSBleHByZXNzaW9uIHN0cmluZ1xuXHRcdFx0fVxuXHRcdFx0bmV4dFBhcmFtZXRlckluZGV4Kys7XG5cdFx0XHRuZXh0UGFyYW1ldGVyID0gcGFyYW1ldGVyc1tuZXh0UGFyYW1ldGVySW5kZXhdO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdHJlc3VsdCArPSBleHByZXNzaW9uW2ldO1xuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogUHJvY2Vzc2VzIHBhcmFtZXRlciB2YWx1ZSBieSBkZWZhdWx0LlxuICogQHBhcmFtIHtPYmplY3R9IHBhcmFtZXRlciBQYXJhbWV0ZXIgZGVzY3JpcHRvci5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgUGFyYW1ldGVyJ3MgdmFsdWUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBQcm9jZXNzZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGRlZmF1bHRQYXJhbWV0ZXJWYWx1ZVByb2Nlc3NvcihwYXJhbWV0ZXIsIHZhbHVlKSB7XG5cdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihgQXJyYXkgdmFsdWUgaXMgbm90IHN1cHBvcnRlZCBmb3IgdGhlIHBhcmFtZXRlciBcIiR7cGFyYW1ldGVyLm5hbWV9XCJgKTtcblx0fVxuXHRyZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogU3RyaW5nKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0ZVByb3ZpZGVyQmFzZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgRVJST1JfTUVTU0FHRV9SRUdFWFAgPSAvXig/OltcXHckXSspOiAoPzouKylcXHI/XFxuL2k7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG5cdC8qKlxuXHQgKiBQcmludHMgYW4gZXJyb3Igd2l0aCBwcmV0dHkgZm9ybWF0dGluZy5cblx0ICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHByaW50LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdXNlckFnZW50IFRoZSB1c2VyIGFnZW50IGluZm9ybWF0aW9uLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBIVE1MIHRleHQgd2l0aCBhbGwgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVycm9yLlxuXHQgKi9cblx0cHJldHR5UHJpbnQ6IChlcnJvciwgdXNlckFnZW50KSA9PiB7XG5cdFx0aWYgKCFlcnJvciB8fCB0eXBlb2YgKGVycm9yKSAhPT0gJ29iamVjdCcpIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cdFx0cmV0dXJuIGBcbjxkaXYgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTsgZm9udC1zaXplOiAxMnB0O1wiPlxuXHQkeyhuZXcgRGF0ZSgpKS50b1VUQ1N0cmluZygpfTs8YnIvPlxuXHQke3VzZXJBZ2VudCB8fCAnVW5rbm93biBicm93c2VyJ307PGJyLz5cblx0Q2F0YmVycnlAOS4wLjAgKFxuXHQ8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2NhdGJlcnJ5L2NhdGJlcnJ5L2lzc3Vlc1wiIHRhcmdldD1cIl9ibGFua1wiPlxuXHRcdHJlcG9ydCBhbiBpc3N1ZVxuXHQ8L2E+KVxuXHQ8YnIvPjxici8+XG5cdDxzcGFuIHN0eWxlPVwiY29sb3I6IHJlZDsgZm9udC1zaXplOiAxNnB0OyBmb250LXdlaWdodDogYm9sZDtcIj5cblx0XHQke2VzY2FwZShlcnJvci5uYW1lKX06ICR7ZXNjYXBlKGVycm9yLm1lc3NhZ2UpfVxuXHQ8L3NwYW4+XG5cdDxici8+PGJyLz5cblx0JHtlc2NhcGUoZXJyb3Iuc3RhY2spLnJlcGxhY2UoRVJST1JfTUVTU0FHRV9SRUdFWFAsICcnKX1cbjwvZGl2PlxuYDtcblx0fVxufTtcblxuLyoqXG4gKiBFc2NhcGVzIHRoZSBlcnJvciB0ZXh0LlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFRoZSBlcnJvciB0ZXh0IHRvIGVzY2FwZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBlc2NhcGVkIGFuZCBmb3JtYXR0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBlc2NhcGUodmFsdWUpIHtcblx0dmFsdWUgPSBTdHJpbmcodmFsdWUgfHwgJycpO1xuXHRyZXR1cm4gdmFsdWVcblx0XHQucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuXHRcdC5yZXBsYWNlKC88L2csICcmbHQ7Jylcblx0XHQucmVwbGFjZSgvPi9nLCAnJmd0OycpXG5cdFx0LnJlcGxhY2UoL1xcXCIvZywgJyZxdW90OycpXG5cdFx0LnJlcGxhY2UoL1xcJy9nLCAnJiMzOTsnKVxuXHRcdC5yZXBsYWNlKC9cXHI/XFxuL2csICc8YnIvPicpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBoZWxwZXIgPSB7XG5cdEVMRU1FTlRfTk9ERV9UWVBFOiAxLFxuXHRDT01QT05FTlRfVEFHX1BSRUZJWDogJ0NBVC0nLFxuXHRDT01QT05FTlRfSUQ6ICckY2F0YmVycnlJZCcsXG5cdENPTVBPTkVOVF9QUkVGSVhfUkVHRVhQOiAvXmNhdC0vaSxcblx0Q09NUE9ORU5UX0VSUk9SX1RFTVBMQVRFX1BPU1RGSVg6ICctLWVycm9yJyxcblx0RE9DVU1FTlRfQ09NUE9ORU5UX05BTUU6ICdkb2N1bWVudCcsXG5cdERPQ1VNRU5UX1RBR19OQU1FOiAnSFRNTCcsXG5cdEhFQURfVEFHX05BTUU6ICdIRUFEJyxcblx0SEVBRF9DT01QT05FTlRfTkFNRTogJ2hlYWQnLFxuXHRBVFRSSUJVVEVfU1RPUkU6ICdjYXQtc3RvcmUnLFxuXHRBVFRSSUJVVEVfU1RPUkVfUEFSQU1TX1JFR0VYUDogL15jYXQtc3RvcmUtcGFyYW0tL2ksXG5cdFNUT1JFX0RZTkFNSUNfTkFNRV9SRUdFWFA6IC9eZHluYW1pYy9pLFxuXHRERUZBVUxUX0xPR0lDX0ZJTEVOQU1FOiAnaW5kZXguanMnLFxuXG5cdGdldFN0b3JlQ2FjaGVLZXkoc3RvcmVOYW1lLCBzdG9yZUluc3RhbmNlSWQpIHtcblx0XHRjb25zdCBpbnN0YW5jZSA9IHN0b3JlSW5zdGFuY2VJZCA/IGBbJHtzdG9yZUluc3RhbmNlSWR9XWAgOiAnJztcblxuXHRcdHJldHVybiBgJHtzdG9yZU5hbWV9JHtpbnN0YW5jZX1gO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZXR1cm4gdHJ1ZSBpZiBhIHBhc3NlZCBzdG9yZSBuYW1lIGNvbnRhaW4gZHluYW1pYyB3b3JkXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdG9yZU5hbWUgU3RvcmUgbmFtZVxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBuYW1lIGNvbnRhaW4gXCJkeW5hbWljXCJcblx0ICovXG5cdGlzRHluYW1pY1N0b3JlKHN0b3JlTmFtZSkge1xuXHRcdHJldHVybiBoZWxwZXIuU1RPUkVfRFlOQU1JQ19OQU1FX1JFR0VYUC50ZXN0KHN0b3JlTmFtZSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIENyZWF0ZSBvYmplY3Qgb2YgcGFyYW1ldGVycyBmb3Igc3RvcmUgZnJvbSBjb21wb25lbnQgYXR0cmlidXRlc1xuXHQgKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlcyBDb21wb25lbnQgYXR0cmlidXRlc1xuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBQYXJhbWV0ZXJzXG5cdCAqL1xuXHRnZXRTdG9yZVBhcmFtc0Zyb21BdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpIHtcblx0XHRjb25zdCBwYXJhbXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdFx0T2JqZWN0LmtleXMoYXR0cmlidXRlcylcblx0XHRcdC5mb3JFYWNoKG5hbWUgPT4ge1xuXHRcdFx0XHRpZiAoaGVscGVyLkFUVFJJQlVURV9TVE9SRV9QQVJBTVNfUkVHRVhQLnRlc3QobmFtZSkpIHtcblx0XHRcdFx0XHRwYXJhbXNbbmFtZS5yZXBsYWNlKGhlbHBlci5BVFRSSUJVVEVfU1RPUkVfUEFSQU1TX1JFR0VYUCwgJycpXSA9IGF0dHJpYnV0ZXNbbmFtZV07XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0cmV0dXJuIHBhcmFtcztcblx0fSxcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5hbWUgZm9yIHRoZSBlcnJvciB0ZW1wbGF0ZSBvZiB0aGUgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gY29tcG9uZW50TmFtZSBUaGUgbmFtZSBvZiB0aGUgY29tcG9uZW50LlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgbmFtZSBvZiB0aGUgZXJyb3IgdGVtcGxhdGUgb2YgdGhlIGNvbXBvbmVudC5cblx0ICovXG5cdGdldE5hbWVGb3JFcnJvclRlbXBsYXRlOiBjb21wb25lbnROYW1lID0+IHtcblx0XHRpZiAodHlwZW9mIChjb21wb25lbnROYW1lKSAhPT0gJ3N0cmluZycpIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cdFx0cmV0dXJuIGNvbXBvbmVudE5hbWUgKyBoZWxwZXIuQ09NUE9ORU5UX0VSUk9SX1RFTVBMQVRFX1BPU1RGSVg7XG5cdH0sXG5cblx0LyoqXG5cdCAqIERldGVybWluZXMgaWYgdGhlIHNwZWNpZmllZCBjb21wb25lbnQgbmFtZSBpcyBhIFwiZG9jdW1lbnRcIiBjb21wb25lbnQncyBuYW1lLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gY29tcG9uZW50TmFtZSBUaGUgbmFtZSBvZiB0aGUgY29tcG9uZW50LlxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIGNvbXBvbmVudCdzIG5hbWVcblx0ICogaXMgYSBcImRvY3VtZW50XCIgY29tcG9uZW50J3MgbmFtZS5cblx0ICovXG5cdGlzRG9jdW1lbnRDb21wb25lbnQ6IGNvbXBvbmVudE5hbWUgPT5cblx0XHRjb21wb25lbnROYW1lLnRvTG93ZXJDYXNlKCkgPT09IGhlbHBlci5ET0NVTUVOVF9DT01QT05FTlRfTkFNRSxcblxuXHQvKipcblx0ICogRGV0ZXJtaW5lcyBpZiB0aGUgc3BlY2lmaWVkIGNvbXBvbmVudCBuYW1lIGlzIGEgXCJoZWFkXCIgY29tcG9uZW50IG5hbWUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjb21wb25lbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBjb21wb25lbnQuXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgY29tcG9uZW50J3MgbmFtZVxuXHQgKiBpcyBhIFwiaGVhZFwiIGNvbXBvbmVudCdzIG5hbWUuXG5cdCAqL1xuXHRpc0hlYWRDb21wb25lbnQ6IGNvbXBvbmVudE5hbWUgPT5cblx0XHRjb21wb25lbnROYW1lLnRvTG93ZXJDYXNlKCkgPT09IGhlbHBlci5IRUFEX0NPTVBPTkVOVF9OQU1FLFxuXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmVzIGlmIHRoZSBET00gbm9kZSBpcyBhIGNvbXBvbmVudCBlbGVtZW50LlxuXHQgKiBAcGFyYW0ge05vZGV9IG5vZGUgVGhlIERPTSBub2RlLlxuXHQgKi9cblx0aXNDb21wb25lbnROb2RlOiBub2RlID0+XG5cdFx0bm9kZS5ub2RlVHlwZSA9PT0gaGVscGVyLkVMRU1FTlRfTk9ERV9UWVBFICYmXG5cdFx0KFxuXHRcdFx0aGVscGVyLkNPTVBPTkVOVF9QUkVGSVhfUkVHRVhQLnRlc3Qobm9kZS5ub2RlTmFtZSkgfHxcblx0XHRcdG5vZGUubm9kZU5hbWUgPT09IGhlbHBlci5IRUFEX1RBR19OQU1FIHx8XG5cdFx0XHRub2RlLm5vZGVOYW1lID09PSBoZWxwZXIuRE9DVU1FTlRfVEFHX05BTUVcblx0XHQpLFxuXG5cdC8qKlxuXHQgKiBHZXRzIGEgb3JpZ2luYWwgY29tcG9uZW50J3MgbmFtZSB3aXRob3V0IGEgcHJlZml4LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZnVsbENvbXBvbmVudE5hbWUgVGhlIGZ1bGwgY29tcG9uZW50J3MgbmFtZSAodGFnIG5hbWUpLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgb3JpZ2luYWwgY29tcG9uZW50J3MgbmFtZSB3aXRob3V0IGEgcHJlZml4LlxuXHQgKi9cblx0Z2V0T3JpZ2luYWxDb21wb25lbnROYW1lOiBmdWxsQ29tcG9uZW50TmFtZSA9PiB7XG5cdFx0aWYgKHR5cGVvZiAoZnVsbENvbXBvbmVudE5hbWUpICE9PSAnc3RyaW5nJykge1xuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH1cblxuXHRcdGlmIChmdWxsQ29tcG9uZW50TmFtZSA9PT0gaGVscGVyLkRPQ1VNRU5UX1RBR19OQU1FKSB7XG5cdFx0XHRyZXR1cm4gaGVscGVyLkRPQ1VNRU5UX0NPTVBPTkVOVF9OQU1FO1xuXHRcdH1cblxuXHRcdGlmIChmdWxsQ29tcG9uZW50TmFtZSA9PT0gaGVscGVyLkhFQURfVEFHX05BTUUpIHtcblx0XHRcdHJldHVybiBoZWxwZXIuSEVBRF9DT01QT05FTlRfTkFNRTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZnVsbENvbXBvbmVudE5hbWVcblx0XHRcdC50b0xvd2VyQ2FzZSgpXG5cdFx0XHQucmVwbGFjZShoZWxwZXIuQ09NUE9ORU5UX1BSRUZJWF9SRUdFWFAsICcnKTtcblx0fSxcblxuXHQvKipcblx0ICogR2V0cyBhIHZhbGlkIHRhZyBuYW1lIGZvciBhIGNvbXBvbmVudC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGNvbXBvbmVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIGNvbXBvbmVudC5cblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIG5hbWUgb2YgdGhlIHRhZy5cblx0ICovXG5cdGdldFRhZ05hbWVGb3JDb21wb25lbnROYW1lOiBjb21wb25lbnROYW1lID0+IHtcblx0XHRpZiAodHlwZW9mIChjb21wb25lbnROYW1lKSAhPT0gJ3N0cmluZycpIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cdFx0Y29uc3QgdXBwZXJDb21wb25lbnROYW1lID0gY29tcG9uZW50TmFtZS50b1VwcGVyQ2FzZSgpO1xuXHRcdGlmIChjb21wb25lbnROYW1lID09PSBoZWxwZXIuSEVBRF9DT01QT05FTlRfTkFNRSkge1xuXHRcdFx0cmV0dXJuIHVwcGVyQ29tcG9uZW50TmFtZTtcblx0XHR9XG5cdFx0aWYgKGNvbXBvbmVudE5hbWUgPT09IGhlbHBlci5ET0NVTUVOVF9DT01QT05FTlRfTkFNRSkge1xuXHRcdFx0cmV0dXJuIGhlbHBlci5ET0NVTUVOVF9UQUdfTkFNRTtcblx0XHR9XG5cdFx0cmV0dXJuIGhlbHBlci5DT01QT05FTlRfVEFHX1BSRUZJWCArIHVwcGVyQ29tcG9uZW50TmFtZTtcblx0fSxcblxuXHQvKipcblx0ICogR2V0cyBhIHByZWZpeGVkIG1ldGhvZCBvZiB0aGUgbW9kdWxlIHRoYXQgY2FuIGJlIGludm9rZWQuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBtb2R1bGUgVGhlIG1vZHVsZSBpbXBsZW1lbnRhdGlvbi5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHByZWZpeCBUaGUgbWV0aG9kIHByZWZpeCAoaS5lLiBoYW5kbGUpLlxuXHQgKiBAcGFyYW0ge3N0cmluZz99IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGVudGl0eSB0byBpbnZva2UgbWV0aG9kIGZvclxuXHQgKiAod2lsbCBiZSBjb252ZXJ0ZWQgdG8gYSBjYW1lbCBjYXNlKS5cblx0ICogQHJldHVybnMge0Z1bmN0aW9ufSBUaGUgbWV0aG9kIHRvIGludm9rZS5cblx0ICovXG5cdGdldE1ldGhvZFRvSW52b2tlOiAobW9kdWxlLCBwcmVmaXgsIG5hbWUpID0+IHtcblx0XHRpZiAoIW1vZHVsZSB8fCB0eXBlb2YgKG1vZHVsZSkgIT09ICdvYmplY3QnKSB7XG5cdFx0XHRyZXR1cm4gZGVmYXVsdFByb21pc2VNZXRob2Q7XG5cdFx0fVxuXHRcdGNvbnN0IG1ldGhvZE5hbWUgPSBoZWxwZXIuZ2V0Q2FtZWxDYXNlTmFtZShwcmVmaXgsIG5hbWUpO1xuXHRcdGlmICh0eXBlb2YgKG1vZHVsZVttZXRob2ROYW1lXSkgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHJldHVybiBtb2R1bGVbbWV0aG9kTmFtZV0uYmluZChtb2R1bGUpO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIChtb2R1bGVbcHJlZml4XSkgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHJldHVybiBtb2R1bGVbcHJlZml4XS5iaW5kKG1vZHVsZSwgbmFtZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRlZmF1bHRQcm9taXNlTWV0aG9kO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBHZXRzIGEgbmFtZSBpbiB0aGUgY2FtZWwgY2FzZSBmb3IgYW55dGhpbmcuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBwcmVmaXggVGhlIHByZWZpeCBmb3IgdGhlIG5hbWUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIHRvIGNvbnZlcnQuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IE5hbWUgaW4gdGhlIGNhbWVsIGNhc2UuXG5cdCAqL1xuXHRnZXRDYW1lbENhc2VOYW1lOiAocHJlZml4LCBuYW1lKSA9PiB7XG5cdFx0aWYgKCFuYW1lKSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXHRcdGlmIChwcmVmaXgpIHtcblx0XHRcdG5hbWUgPSBgJHtwcmVmaXh9LSR7bmFtZX1gO1xuXHRcdH1cblx0XHRyZXR1cm4gbmFtZVxuXHRcdFx0LnJlcGxhY2UoLyg/OlteYS16MC05XSspKFxcdykvZ2ksIChzcGFjZSwgbGV0dGVyKSA9PiBsZXR0ZXIudG9VcHBlckNhc2UoKSlcblx0XHRcdC5yZXBsYWNlKC8oXlteYS16MC05XSl8KFteYS16MC05XSQpL2dpLCAnJyk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEdldHMgYSBzYWZlIHByb21pc2UgcmVzb2x2ZWQgYnkgdGhlIGFjdGlvbi5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gYWN0aW9uIFRoZSBhY3Rpb24gdG8gd3JhcCB3aXRoIGEgc2FmZSBwcm9taXNlLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIHByb21pc2UgZm9yIHRoZSBkb25lIGFjdGlvbi5cblx0ICovXG5cdGdldFNhZmVQcm9taXNlOiBhY3Rpb24gPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGFjdGlvbigpKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZSk7XG5cdFx0fVxuXHR9XG59O1xuXG4vKipcbiAqIEp1c3QgcmV0dXJucyBhIHJlc29sdmVkIHByb21pc2UuXG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIHByb21pc2UgZm9yIG5vdGhpbmcuXG4gKi9cbmZ1bmN0aW9uIGRlZmF1bHRQcm9taXNlTWV0aG9kKCkge1xuXHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGVscGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuXHQvKipcblx0ICogRGVmaW5lcyBhIHJlYWQtb25seSBwcm9wZXJ0eS5cblx0ICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGRlZmluZSBhIHByb3BlcnR5IGluLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkuXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eS5cblx0ICovXG5cdGRlZmluZVJlYWRPbmx5OiAob2JqZWN0LCBuYW1lLCB2YWx1ZSkgPT4ge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtcblx0XHRcdGVudW1lcmFibGU6IGZhbHNlLFxuXHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcblx0XHRcdHdyaXRhYmxlOiBmYWxzZSxcblx0XHRcdHZhbHVlXG5cdFx0fSk7XG5cdH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IG1vZHVsZUhlbHBlciA9IHJlcXVpcmUoJy4vbW9kdWxlSGVscGVyJyk7XG5cbmNvbnN0IGhlbHBlciA9IHtcblxuXHQvKipcblx0ICogUmVnaXN0ZXJzIHRlbXBsYXRlcyBpbnRvIHRoZSBjb21wb25lbnQgYW5kIHRlbXBsYXRlIHByb3ZpZGVycy5cblx0ICogQHBhcmFtIHtPYmplY3R9IGNvbXBvbmVudCBUaGUgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0ge3t0ZW1wbGF0ZTogc3RyaW5nLCBlcnJvclRlbXBsYXRlOiBzdHJpbmd9fSB0ZW1wbGF0ZXNcblx0ICogVGhlIGNvbXBpbGVkIHRlbXBsYXRlcy5cblx0ICovXG5cdHJlZ2lzdGVyVGVtcGxhdGVzOiBjb21wb25lbnQgPT4ge1xuXHRcdGNvbXBvbmVudC50ZW1wbGF0ZVByb3ZpZGVyLnJlZ2lzdGVyQ29tcGlsZWQoY29tcG9uZW50Lm5hbWUsIGNvbXBvbmVudC5jb21waWxlZFRlbXBsYXRlKTtcblxuXHRcdGNvbXBvbmVudC50ZW1wbGF0ZSA9IHtcblx0XHRcdHJlbmRlcjogY29udGV4dCA9PiBjb21wb25lbnQudGVtcGxhdGVQcm92aWRlci5yZW5kZXIoY29tcG9uZW50Lm5hbWUsIGNvbnRleHQpXG5cdFx0fTtcblxuXHRcdGlmICghY29tcG9uZW50LmNvbXBpbGVkRXJyb3JUZW1wbGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGVycm9yVGVtcGxhdGVOYW1lID0gbW9kdWxlSGVscGVyLmdldE5hbWVGb3JFcnJvclRlbXBsYXRlKGNvbXBvbmVudC5uYW1lKTtcblx0XHRjb21wb25lbnQuZXJyb3JUZW1wbGF0ZVByb3ZpZGVyLnJlZ2lzdGVyQ29tcGlsZWQoZXJyb3JUZW1wbGF0ZU5hbWUsIGNvbXBvbmVudC5jb21waWxlZEVycm9yVGVtcGxhdGUpO1xuXG5cdFx0Y29tcG9uZW50LmVycm9yVGVtcGxhdGUgPSB7XG5cdFx0XHRyZW5kZXI6IGNvbnRleHQgPT4gY29tcG9uZW50LmVycm9yVGVtcGxhdGVQcm92aWRlci5yZW5kZXIoZXJyb3JUZW1wbGF0ZU5hbWUsIGNvbnRleHQpXG5cdFx0fTtcblx0fSxcblxuXHQvKipcblx0ICogUmVzb2x2ZXMgdmFsaWQgdGVtcGxhdGUgcHJvdmlkZXJzLlxuXHQgKiBAcGFyYW0ge1NlcnZpY2VMb2NhdG9yfSBsb2NhdG9yIFNlcnZpY2UgbG9jYXRvciB0aGF0IGhhcyBwcm92aWRlcnMgcmVnaXN0ZXJlZC5cblx0ICogQHJldHVybnMge0FycmF5PFRlbXBsYXRlUHJvdmlkZXI+fSBMaXN0IG9mIHRlbXBsYXRlIHByb3ZpZGVycy5cblx0ICovXG5cdHJlc29sdmVUZW1wbGF0ZVByb3ZpZGVyczogbG9jYXRvciA9PiB7XG5cdFx0Y29uc3QgZXZlbnRCdXMgPSBsb2NhdG9yLnJlc29sdmUoJ2V2ZW50QnVzJyk7XG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiBsb2NhdG9yXG5cdFx0XHRcdC5yZXNvbHZlQWxsKCd0ZW1wbGF0ZVByb3ZpZGVyJylcblx0XHRcdFx0LmZpbHRlcihwcm92aWRlciA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgaXNWYWxpZCA9IHR5cGVvZiAocHJvdmlkZXIuZ2V0TmFtZSkgPT09ICdmdW5jdGlvbicgJiZcblx0XHRcdFx0XHRcdFx0XHRcdHR5cGVvZiAocHJvdmlkZXIucmVnaXN0ZXJDb21waWxlZCkgPT09ICdmdW5jdGlvbicgJiZcblx0XHRcdFx0XHRcdFx0XHRcdHR5cGVvZiAocHJvdmlkZXIucmVuZGVyKSA9PT0gJ2Z1bmN0aW9uJztcblx0XHRcdFx0XHRpZiAoIWlzVmFsaWQpIHtcblx0XHRcdFx0XHRcdGV2ZW50QnVzLmVtaXQoJ3dhcm4nLCAnVGVtcGxhdGUgcHJvdmlkZXIgZG9lcyBub3QgaGF2ZSByZXF1aXJlZCBtZXRob2RzLCBza2lwcGluZy4uLicpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gaXNWYWxpZDtcblx0XHRcdFx0fSk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0cmV0dXJuIFtdO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogUmVzb2x2ZXMgdmFsaWQgdGVtcGxhdGUgcHJvdmlkZXJzIGJ5IG5hbWVzLlxuXHQgKiBAcGFyYW0ge1NlcnZpY2VMb2NhdG9yfSBsb2NhdG9yIFNlcnZpY2UgbG9jYXRvciB0aGF0IGhhcyBwcm92aWRlcnMgcmVnaXN0ZXJlZC5cblx0ICogQHJldHVybnMge09iamVjdH0gTWFwIG9mIHRlbXBsYXRlIHByb3ZpZGVycyBieSBuYW1lcy5cblx0ICovXG5cdHJlc29sdmVUZW1wbGF0ZVByb3ZpZGVyc0J5TmFtZXM6IGxvY2F0b3IgPT4ge1xuXHRcdHJldHVybiBoZWxwZXJcblx0XHRcdC5yZXNvbHZlVGVtcGxhdGVQcm92aWRlcnMobG9jYXRvcilcblx0XHRcdC5yZWR1Y2UoKG1hcCwgY3VycmVudCkgPT4ge1xuXHRcdFx0XHRtYXBbY3VycmVudC5nZXROYW1lKCldID0gY3VycmVudDtcblx0XHRcdFx0cmV0dXJuIG1hcDtcblx0XHRcdH0sIE9iamVjdC5jcmVhdGUobnVsbCkpO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGhlbHBlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgUEFUSF9FTkRfU0xBU0hfUkVHX0VYUCA9IC8oLispXFwvKCR8XFw/fCMpLztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgYSBzbGFzaCBmcm9tIHRoZSBlbmQgb2YgdGhlIFVSSSBwYXRoLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdXJpUGF0aCBUaGUgVVJJIHBhdGguXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBVUkkgd2l0aG91dCBhIHNsYXNoIGF0IHRoZSBlbmQuXG5cdCAqL1xuXHRyZW1vdmVFbmRTbGFzaCh1cmlQYXRoKSB7XG5cdFx0aWYgKCF1cmlQYXRoIHx8IHR5cGVvZiAodXJpUGF0aCkgIT09ICdzdHJpbmcnKSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXHRcdGlmICh1cmlQYXRoID09PSAnLycpIHtcblx0XHRcdHJldHVybiB1cmlQYXRoO1xuXHRcdH1cblx0XHRyZXR1cm4gdXJpUGF0aC5yZXBsYWNlKFBBVEhfRU5EX1NMQVNIX1JFR19FWFAsICckMSQyJyk7XG5cdH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gcmF3QXNhcCBwcm92aWRlcyBldmVyeXRoaW5nIHdlIG5lZWQgZXhjZXB0IGV4Y2VwdGlvbiBtYW5hZ2VtZW50LlxudmFyIHJhd0FzYXAgPSByZXF1aXJlKFwiLi9yYXdcIik7XG4vLyBSYXdUYXNrcyBhcmUgcmVjeWNsZWQgdG8gcmVkdWNlIEdDIGNodXJuLlxudmFyIGZyZWVUYXNrcyA9IFtdO1xuLy8gV2UgcXVldWUgZXJyb3JzIHRvIGVuc3VyZSB0aGV5IGFyZSB0aHJvd24gaW4gcmlnaHQgb3JkZXIgKEZJRk8pLlxuLy8gQXJyYXktYXMtcXVldWUgaXMgZ29vZCBlbm91Z2ggaGVyZSwgc2luY2Ugd2UgYXJlIGp1c3QgZGVhbGluZyB3aXRoIGV4Y2VwdGlvbnMuXG52YXIgcGVuZGluZ0Vycm9ycyA9IFtdO1xudmFyIHJlcXVlc3RFcnJvclRocm93ID0gcmF3QXNhcC5tYWtlUmVxdWVzdENhbGxGcm9tVGltZXIodGhyb3dGaXJzdEVycm9yKTtcblxuZnVuY3Rpb24gdGhyb3dGaXJzdEVycm9yKCkge1xuICAgIGlmIChwZW5kaW5nRXJyb3JzLmxlbmd0aCkge1xuICAgICAgICB0aHJvdyBwZW5kaW5nRXJyb3JzLnNoaWZ0KCk7XG4gICAgfVxufVxuXG4vKipcbiAqIENhbGxzIGEgdGFzayBhcyBzb29uIGFzIHBvc3NpYmxlIGFmdGVyIHJldHVybmluZywgaW4gaXRzIG93biBldmVudCwgd2l0aCBwcmlvcml0eVxuICogb3ZlciBvdGhlciBldmVudHMgbGlrZSBhbmltYXRpb24sIHJlZmxvdywgYW5kIHJlcGFpbnQuIEFuIGVycm9yIHRocm93biBmcm9tIGFuXG4gKiBldmVudCB3aWxsIG5vdCBpbnRlcnJ1cHQsIG5vciBldmVuIHN1YnN0YW50aWFsbHkgc2xvdyBkb3duIHRoZSBwcm9jZXNzaW5nIG9mXG4gKiBvdGhlciBldmVudHMsIGJ1dCB3aWxsIGJlIHJhdGhlciBwb3N0cG9uZWQgdG8gYSBsb3dlciBwcmlvcml0eSBldmVudC5cbiAqIEBwYXJhbSB7e2NhbGx9fSB0YXNrIEEgY2FsbGFibGUgb2JqZWN0LCB0eXBpY2FsbHkgYSBmdW5jdGlvbiB0aGF0IHRha2VzIG5vXG4gKiBhcmd1bWVudHMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gYXNhcDtcbmZ1bmN0aW9uIGFzYXAodGFzaykge1xuICAgIHZhciByYXdUYXNrO1xuICAgIGlmIChmcmVlVGFza3MubGVuZ3RoKSB7XG4gICAgICAgIHJhd1Rhc2sgPSBmcmVlVGFza3MucG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmF3VGFzayA9IG5ldyBSYXdUYXNrKCk7XG4gICAgfVxuICAgIHJhd1Rhc2sudGFzayA9IHRhc2s7XG4gICAgcmF3QXNhcChyYXdUYXNrKTtcbn1cblxuLy8gV2Ugd3JhcCB0YXNrcyB3aXRoIHJlY3ljbGFibGUgdGFzayBvYmplY3RzLiAgQSB0YXNrIG9iamVjdCBpbXBsZW1lbnRzXG4vLyBgY2FsbGAsIGp1c3QgbGlrZSBhIGZ1bmN0aW9uLlxuZnVuY3Rpb24gUmF3VGFzaygpIHtcbiAgICB0aGlzLnRhc2sgPSBudWxsO1xufVxuXG4vLyBUaGUgc29sZSBwdXJwb3NlIG9mIHdyYXBwaW5nIHRoZSB0YXNrIGlzIHRvIGNhdGNoIHRoZSBleGNlcHRpb24gYW5kIHJlY3ljbGVcbi8vIHRoZSB0YXNrIG9iamVjdCBhZnRlciBpdHMgc2luZ2xlIHVzZS5cblJhd1Rhc2sucHJvdG90eXBlLmNhbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgdGhpcy50YXNrLmNhbGwoKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoYXNhcC5vbmVycm9yKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGhvb2sgZXhpc3RzIHB1cmVseSBmb3IgdGVzdGluZyBwdXJwb3Nlcy5cbiAgICAgICAgICAgIC8vIEl0cyBuYW1lIHdpbGwgYmUgcGVyaW9kaWNhbGx5IHJhbmRvbWl6ZWQgdG8gYnJlYWsgYW55IGNvZGUgdGhhdFxuICAgICAgICAgICAgLy8gZGVwZW5kcyBvbiBpdHMgZXhpc3RlbmNlLlxuICAgICAgICAgICAgYXNhcC5vbmVycm9yKGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEluIGEgd2ViIGJyb3dzZXIsIGV4Y2VwdGlvbnMgYXJlIG5vdCBmYXRhbC4gSG93ZXZlciwgdG8gYXZvaWRcbiAgICAgICAgICAgIC8vIHNsb3dpbmcgZG93biB0aGUgcXVldWUgb2YgcGVuZGluZyB0YXNrcywgd2UgcmV0aHJvdyB0aGUgZXJyb3IgaW4gYVxuICAgICAgICAgICAgLy8gbG93ZXIgcHJpb3JpdHkgdHVybi5cbiAgICAgICAgICAgIHBlbmRpbmdFcnJvcnMucHVzaChlcnJvcik7XG4gICAgICAgICAgICByZXF1ZXN0RXJyb3JUaHJvdygpO1xuICAgICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy50YXNrID0gbnVsbDtcbiAgICAgICAgZnJlZVRhc2tzW2ZyZWVUYXNrcy5sZW5ndGhdID0gdGhpcztcbiAgICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIFVzZSB0aGUgZmFzdGVzdCBtZWFucyBwb3NzaWJsZSB0byBleGVjdXRlIGEgdGFzayBpbiBpdHMgb3duIHR1cm4sIHdpdGhcbi8vIHByaW9yaXR5IG92ZXIgb3RoZXIgZXZlbnRzIGluY2x1ZGluZyBJTywgYW5pbWF0aW9uLCByZWZsb3csIGFuZCByZWRyYXdcbi8vIGV2ZW50cyBpbiBicm93c2Vycy5cbi8vXG4vLyBBbiBleGNlcHRpb24gdGhyb3duIGJ5IGEgdGFzayB3aWxsIHBlcm1hbmVudGx5IGludGVycnVwdCB0aGUgcHJvY2Vzc2luZyBvZlxuLy8gc3Vic2VxdWVudCB0YXNrcy4gVGhlIGhpZ2hlciBsZXZlbCBgYXNhcGAgZnVuY3Rpb24gZW5zdXJlcyB0aGF0IGlmIGFuXG4vLyBleGNlcHRpb24gaXMgdGhyb3duIGJ5IGEgdGFzaywgdGhhdCB0aGUgdGFzayBxdWV1ZSB3aWxsIGNvbnRpbnVlIGZsdXNoaW5nIGFzXG4vLyBzb29uIGFzIHBvc3NpYmxlLCBidXQgaWYgeW91IHVzZSBgcmF3QXNhcGAgZGlyZWN0bHksIHlvdSBhcmUgcmVzcG9uc2libGUgdG9cbi8vIGVpdGhlciBlbnN1cmUgdGhhdCBubyBleGNlcHRpb25zIGFyZSB0aHJvd24gZnJvbSB5b3VyIHRhc2ssIG9yIHRvIG1hbnVhbGx5XG4vLyBjYWxsIGByYXdBc2FwLnJlcXVlc3RGbHVzaGAgaWYgYW4gZXhjZXB0aW9uIGlzIHRocm93bi5cbm1vZHVsZS5leHBvcnRzID0gcmF3QXNhcDtcbmZ1bmN0aW9uIHJhd0FzYXAodGFzaykge1xuICAgIGlmICghcXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHJlcXVlc3RGbHVzaCgpO1xuICAgICAgICBmbHVzaGluZyA9IHRydWU7XG4gICAgfVxuICAgIC8vIEVxdWl2YWxlbnQgdG8gcHVzaCwgYnV0IGF2b2lkcyBhIGZ1bmN0aW9uIGNhbGwuXG4gICAgcXVldWVbcXVldWUubGVuZ3RoXSA9IHRhc2s7XG59XG5cbnZhciBxdWV1ZSA9IFtdO1xuLy8gT25jZSBhIGZsdXNoIGhhcyBiZWVuIHJlcXVlc3RlZCwgbm8gZnVydGhlciBjYWxscyB0byBgcmVxdWVzdEZsdXNoYCBhcmVcbi8vIG5lY2Vzc2FyeSB1bnRpbCB0aGUgbmV4dCBgZmx1c2hgIGNvbXBsZXRlcy5cbnZhciBmbHVzaGluZyA9IGZhbHNlO1xuLy8gYHJlcXVlc3RGbHVzaGAgaXMgYW4gaW1wbGVtZW50YXRpb24tc3BlY2lmaWMgbWV0aG9kIHRoYXQgYXR0ZW1wdHMgdG8ga2lja1xuLy8gb2ZmIGEgYGZsdXNoYCBldmVudCBhcyBxdWlja2x5IGFzIHBvc3NpYmxlLiBgZmx1c2hgIHdpbGwgYXR0ZW1wdCB0byBleGhhdXN0XG4vLyB0aGUgZXZlbnQgcXVldWUgYmVmb3JlIHlpZWxkaW5nIHRvIHRoZSBicm93c2VyJ3Mgb3duIGV2ZW50IGxvb3AuXG52YXIgcmVxdWVzdEZsdXNoO1xuLy8gVGhlIHBvc2l0aW9uIG9mIHRoZSBuZXh0IHRhc2sgdG8gZXhlY3V0ZSBpbiB0aGUgdGFzayBxdWV1ZS4gVGhpcyBpc1xuLy8gcHJlc2VydmVkIGJldHdlZW4gY2FsbHMgdG8gYGZsdXNoYCBzbyB0aGF0IGl0IGNhbiBiZSByZXN1bWVkIGlmXG4vLyBhIHRhc2sgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbnZhciBpbmRleCA9IDA7XG4vLyBJZiBhIHRhc2sgc2NoZWR1bGVzIGFkZGl0aW9uYWwgdGFza3MgcmVjdXJzaXZlbHksIHRoZSB0YXNrIHF1ZXVlIGNhbiBncm93XG4vLyB1bmJvdW5kZWQuIFRvIHByZXZlbnQgbWVtb3J5IGV4aGF1c3Rpb24sIHRoZSB0YXNrIHF1ZXVlIHdpbGwgcGVyaW9kaWNhbGx5XG4vLyB0cnVuY2F0ZSBhbHJlYWR5LWNvbXBsZXRlZCB0YXNrcy5cbnZhciBjYXBhY2l0eSA9IDEwMjQ7XG5cbi8vIFRoZSBmbHVzaCBmdW5jdGlvbiBwcm9jZXNzZXMgYWxsIHRhc2tzIHRoYXQgaGF2ZSBiZWVuIHNjaGVkdWxlZCB3aXRoXG4vLyBgcmF3QXNhcGAgdW5sZXNzIGFuZCB1bnRpbCBvbmUgb2YgdGhvc2UgdGFza3MgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbi8vIElmIGEgdGFzayB0aHJvd3MgYW4gZXhjZXB0aW9uLCBgZmx1c2hgIGVuc3VyZXMgdGhhdCBpdHMgc3RhdGUgd2lsbCByZW1haW5cbi8vIGNvbnNpc3RlbnQgYW5kIHdpbGwgcmVzdW1lIHdoZXJlIGl0IGxlZnQgb2ZmIHdoZW4gY2FsbGVkIGFnYWluLlxuLy8gSG93ZXZlciwgYGZsdXNoYCBkb2VzIG5vdCBtYWtlIGFueSBhcnJhbmdlbWVudHMgdG8gYmUgY2FsbGVkIGFnYWluIGlmIGFuXG4vLyBleGNlcHRpb24gaXMgdGhyb3duLlxuZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgd2hpbGUgKGluZGV4IDwgcXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBpbmRleDtcbiAgICAgICAgLy8gQWR2YW5jZSB0aGUgaW5kZXggYmVmb3JlIGNhbGxpbmcgdGhlIHRhc2suIFRoaXMgZW5zdXJlcyB0aGF0IHdlIHdpbGxcbiAgICAgICAgLy8gYmVnaW4gZmx1c2hpbmcgb24gdGhlIG5leHQgdGFzayB0aGUgdGFzayB0aHJvd3MgYW4gZXJyb3IuXG4gICAgICAgIGluZGV4ID0gaW5kZXggKyAxO1xuICAgICAgICBxdWV1ZVtjdXJyZW50SW5kZXhdLmNhbGwoKTtcbiAgICAgICAgLy8gUHJldmVudCBsZWFraW5nIG1lbW9yeSBmb3IgbG9uZyBjaGFpbnMgb2YgcmVjdXJzaXZlIGNhbGxzIHRvIGBhc2FwYC5cbiAgICAgICAgLy8gSWYgd2UgY2FsbCBgYXNhcGAgd2l0aGluIHRhc2tzIHNjaGVkdWxlZCBieSBgYXNhcGAsIHRoZSBxdWV1ZSB3aWxsXG4gICAgICAgIC8vIGdyb3csIGJ1dCB0byBhdm9pZCBhbiBPKG4pIHdhbGsgZm9yIGV2ZXJ5IHRhc2sgd2UgZXhlY3V0ZSwgd2UgZG9uJ3RcbiAgICAgICAgLy8gc2hpZnQgdGFza3Mgb2ZmIHRoZSBxdWV1ZSBhZnRlciB0aGV5IGhhdmUgYmVlbiBleGVjdXRlZC5cbiAgICAgICAgLy8gSW5zdGVhZCwgd2UgcGVyaW9kaWNhbGx5IHNoaWZ0IDEwMjQgdGFza3Mgb2ZmIHRoZSBxdWV1ZS5cbiAgICAgICAgaWYgKGluZGV4ID4gY2FwYWNpdHkpIHtcbiAgICAgICAgICAgIC8vIE1hbnVhbGx5IHNoaWZ0IGFsbCB2YWx1ZXMgc3RhcnRpbmcgYXQgdGhlIGluZGV4IGJhY2sgdG8gdGhlXG4gICAgICAgICAgICAvLyBiZWdpbm5pbmcgb2YgdGhlIHF1ZXVlLlxuICAgICAgICAgICAgZm9yICh2YXIgc2NhbiA9IDAsIG5ld0xlbmd0aCA9IHF1ZXVlLmxlbmd0aCAtIGluZGV4OyBzY2FuIDwgbmV3TGVuZ3RoOyBzY2FuKyspIHtcbiAgICAgICAgICAgICAgICBxdWV1ZVtzY2FuXSA9IHF1ZXVlW3NjYW4gKyBpbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBxdWV1ZS5sZW5ndGggLT0gaW5kZXg7XG4gICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUubGVuZ3RoID0gMDtcbiAgICBpbmRleCA9IDA7XG4gICAgZmx1c2hpbmcgPSBmYWxzZTtcbn1cblxuLy8gYHJlcXVlc3RGbHVzaGAgaXMgaW1wbGVtZW50ZWQgdXNpbmcgYSBzdHJhdGVneSBiYXNlZCBvbiBkYXRhIGNvbGxlY3RlZCBmcm9tXG4vLyBldmVyeSBhdmFpbGFibGUgU2F1Y2VMYWJzIFNlbGVuaXVtIHdlYiBkcml2ZXIgd29ya2VyIGF0IHRpbWUgb2Ygd3JpdGluZy5cbi8vIGh0dHBzOi8vZG9jcy5nb29nbGUuY29tL3NwcmVhZHNoZWV0cy9kLzFtRy01VVlHdXA1cXhHZEVNV2toUDZCV0N6MDUzTlViMkUxUW9VVFUxNnVBL2VkaXQjZ2lkPTc4MzcyNDU5M1xuXG4vLyBTYWZhcmkgNiBhbmQgNi4xIGZvciBkZXNrdG9wLCBpUGFkLCBhbmQgaVBob25lIGFyZSB0aGUgb25seSBicm93c2VycyB0aGF0XG4vLyBoYXZlIFdlYktpdE11dGF0aW9uT2JzZXJ2ZXIgYnV0IG5vdCB1bi1wcmVmaXhlZCBNdXRhdGlvbk9ic2VydmVyLlxuLy8gTXVzdCB1c2UgYGdsb2JhbGAgb3IgYHNlbGZgIGluc3RlYWQgb2YgYHdpbmRvd2AgdG8gd29yayBpbiBib3RoIGZyYW1lcyBhbmQgd2ViXG4vLyB3b3JrZXJzLiBgZ2xvYmFsYCBpcyBhIHByb3Zpc2lvbiBvZiBCcm93c2VyaWZ5LCBNciwgTXJzLCBvciBNb3AuXG5cbi8qIGdsb2JhbHMgc2VsZiAqL1xudmFyIHNjb3BlID0gdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHNlbGY7XG52YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBzY29wZS5NdXRhdGlvbk9ic2VydmVyIHx8IHNjb3BlLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG5cbi8vIE11dGF0aW9uT2JzZXJ2ZXJzIGFyZSBkZXNpcmFibGUgYmVjYXVzZSB0aGV5IGhhdmUgaGlnaCBwcmlvcml0eSBhbmQgd29ya1xuLy8gcmVsaWFibHkgZXZlcnl3aGVyZSB0aGV5IGFyZSBpbXBsZW1lbnRlZC5cbi8vIFRoZXkgYXJlIGltcGxlbWVudGVkIGluIGFsbCBtb2Rlcm4gYnJvd3NlcnMuXG4vL1xuLy8gLSBBbmRyb2lkIDQtNC4zXG4vLyAtIENocm9tZSAyNi0zNFxuLy8gLSBGaXJlZm94IDE0LTI5XG4vLyAtIEludGVybmV0IEV4cGxvcmVyIDExXG4vLyAtIGlQYWQgU2FmYXJpIDYtNy4xXG4vLyAtIGlQaG9uZSBTYWZhcmkgNy03LjFcbi8vIC0gU2FmYXJpIDYtN1xuaWYgKHR5cGVvZiBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmVxdWVzdEZsdXNoID0gbWFrZVJlcXVlc3RDYWxsRnJvbU11dGF0aW9uT2JzZXJ2ZXIoZmx1c2gpO1xuXG4vLyBNZXNzYWdlQ2hhbm5lbHMgYXJlIGRlc2lyYWJsZSBiZWNhdXNlIHRoZXkgZ2l2ZSBkaXJlY3QgYWNjZXNzIHRvIHRoZSBIVE1MXG4vLyB0YXNrIHF1ZXVlLCBhcmUgaW1wbGVtZW50ZWQgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAsIFNhZmFyaSA1LjAtMSwgYW5kIE9wZXJhXG4vLyAxMS0xMiwgYW5kIGluIHdlYiB3b3JrZXJzIGluIG1hbnkgZW5naW5lcy5cbi8vIEFsdGhvdWdoIG1lc3NhZ2UgY2hhbm5lbHMgeWllbGQgdG8gYW55IHF1ZXVlZCByZW5kZXJpbmcgYW5kIElPIHRhc2tzLCB0aGV5XG4vLyB3b3VsZCBiZSBiZXR0ZXIgdGhhbiBpbXBvc2luZyB0aGUgNG1zIGRlbGF5IG9mIHRpbWVycy5cbi8vIEhvd2V2ZXIsIHRoZXkgZG8gbm90IHdvcmsgcmVsaWFibHkgaW4gSW50ZXJuZXQgRXhwbG9yZXIgb3IgU2FmYXJpLlxuXG4vLyBJbnRlcm5ldCBFeHBsb3JlciAxMCBpcyB0aGUgb25seSBicm93c2VyIHRoYXQgaGFzIHNldEltbWVkaWF0ZSBidXQgZG9lc1xuLy8gbm90IGhhdmUgTXV0YXRpb25PYnNlcnZlcnMuXG4vLyBBbHRob3VnaCBzZXRJbW1lZGlhdGUgeWllbGRzIHRvIHRoZSBicm93c2VyJ3MgcmVuZGVyZXIsIGl0IHdvdWxkIGJlXG4vLyBwcmVmZXJyYWJsZSB0byBmYWxsaW5nIGJhY2sgdG8gc2V0VGltZW91dCBzaW5jZSBpdCBkb2VzIG5vdCBoYXZlXG4vLyB0aGUgbWluaW11bSA0bXMgcGVuYWx0eS5cbi8vIFVuZm9ydHVuYXRlbHkgdGhlcmUgYXBwZWFycyB0byBiZSBhIGJ1ZyBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMCBNb2JpbGUgKGFuZFxuLy8gRGVza3RvcCB0byBhIGxlc3NlciBleHRlbnQpIHRoYXQgcmVuZGVycyBib3RoIHNldEltbWVkaWF0ZSBhbmRcbi8vIE1lc3NhZ2VDaGFubmVsIHVzZWxlc3MgZm9yIHRoZSBwdXJwb3NlcyBvZiBBU0FQLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9xL2lzc3Vlcy8zOTZcblxuLy8gVGltZXJzIGFyZSBpbXBsZW1lbnRlZCB1bml2ZXJzYWxseS5cbi8vIFdlIGZhbGwgYmFjayB0byB0aW1lcnMgaW4gd29ya2VycyBpbiBtb3N0IGVuZ2luZXMsIGFuZCBpbiBmb3JlZ3JvdW5kXG4vLyBjb250ZXh0cyBpbiB0aGUgZm9sbG93aW5nIGJyb3dzZXJzLlxuLy8gSG93ZXZlciwgbm90ZSB0aGF0IGV2ZW4gdGhpcyBzaW1wbGUgY2FzZSByZXF1aXJlcyBudWFuY2VzIHRvIG9wZXJhdGUgaW4gYVxuLy8gYnJvYWQgc3BlY3RydW0gb2YgYnJvd3NlcnMuXG4vL1xuLy8gLSBGaXJlZm94IDMtMTNcbi8vIC0gSW50ZXJuZXQgRXhwbG9yZXIgNi05XG4vLyAtIGlQYWQgU2FmYXJpIDQuM1xuLy8gLSBMeW54IDIuOC43XG59IGVsc2Uge1xuICAgIHJlcXVlc3RGbHVzaCA9IG1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcihmbHVzaCk7XG59XG5cbi8vIGByZXF1ZXN0Rmx1c2hgIHJlcXVlc3RzIHRoYXQgdGhlIGhpZ2ggcHJpb3JpdHkgZXZlbnQgcXVldWUgYmUgZmx1c2hlZCBhc1xuLy8gc29vbiBhcyBwb3NzaWJsZS5cbi8vIFRoaXMgaXMgdXNlZnVsIHRvIHByZXZlbnQgYW4gZXJyb3IgdGhyb3duIGluIGEgdGFzayBmcm9tIHN0YWxsaW5nIHRoZSBldmVudFxuLy8gcXVldWUgaWYgdGhlIGV4Y2VwdGlvbiBoYW5kbGVkIGJ5IE5vZGUuanPigJlzXG4vLyBgcHJvY2Vzcy5vbihcInVuY2F1Z2h0RXhjZXB0aW9uXCIpYCBvciBieSBhIGRvbWFpbi5cbnJhd0FzYXAucmVxdWVzdEZsdXNoID0gcmVxdWVzdEZsdXNoO1xuXG4vLyBUbyByZXF1ZXN0IGEgaGlnaCBwcmlvcml0eSBldmVudCwgd2UgaW5kdWNlIGEgbXV0YXRpb24gb2JzZXJ2ZXIgYnkgdG9nZ2xpbmdcbi8vIHRoZSB0ZXh0IG9mIGEgdGV4dCBub2RlIGJldHdlZW4gXCIxXCIgYW5kIFwiLTFcIi5cbmZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21NdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKSB7XG4gICAgdmFyIHRvZ2dsZSA9IDE7XG4gICAgdmFyIG9ic2VydmVyID0gbmV3IEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpO1xuICAgIG9ic2VydmVyLm9ic2VydmUobm9kZSwge2NoYXJhY3RlckRhdGE6IHRydWV9KTtcbiAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4gICAgICAgIHRvZ2dsZSA9IC10b2dnbGU7XG4gICAgICAgIG5vZGUuZGF0YSA9IHRvZ2dsZTtcbiAgICB9O1xufVxuXG4vLyBUaGUgbWVzc2FnZSBjaGFubmVsIHRlY2huaXF1ZSB3YXMgZGlzY292ZXJlZCBieSBNYWx0ZSBVYmwgYW5kIHdhcyB0aGVcbi8vIG9yaWdpbmFsIGZvdW5kYXRpb24gZm9yIHRoaXMgbGlicmFyeS5cbi8vIGh0dHA6Ly93d3cubm9uYmxvY2tpbmcuaW8vMjAxMS8wNi93aW5kb3duZXh0dGljay5odG1sXG5cbi8vIFNhZmFyaSA2LjAuNSAoYXQgbGVhc3QpIGludGVybWl0dGVudGx5IGZhaWxzIHRvIGNyZWF0ZSBtZXNzYWdlIHBvcnRzIG9uIGFcbi8vIHBhZ2UncyBmaXJzdCBsb2FkLiBUaGFua2Z1bGx5LCB0aGlzIHZlcnNpb24gb2YgU2FmYXJpIHN1cHBvcnRzXG4vLyBNdXRhdGlvbk9ic2VydmVycywgc28gd2UgZG9uJ3QgbmVlZCB0byBmYWxsIGJhY2sgaW4gdGhhdCBjYXNlLlxuXG4vLyBmdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tTWVzc2FnZUNoYW5uZWwoY2FsbGJhY2spIHtcbi8vICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuLy8gICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gY2FsbGJhY2s7XG4vLyAgICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuLy8gICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuLy8gICAgIH07XG4vLyB9XG5cbi8vIEZvciByZWFzb25zIGV4cGxhaW5lZCBhYm92ZSwgd2UgYXJlIGFsc28gdW5hYmxlIHRvIHVzZSBgc2V0SW1tZWRpYXRlYFxuLy8gdW5kZXIgYW55IGNpcmN1bXN0YW5jZXMuXG4vLyBFdmVuIGlmIHdlIHdlcmUsIHRoZXJlIGlzIGFub3RoZXIgYnVnIGluIEludGVybmV0IEV4cGxvcmVyIDEwLlxuLy8gSXQgaXMgbm90IHN1ZmZpY2llbnQgdG8gYXNzaWduIGBzZXRJbW1lZGlhdGVgIHRvIGByZXF1ZXN0Rmx1c2hgIGJlY2F1c2Vcbi8vIGBzZXRJbW1lZGlhdGVgIG11c3QgYmUgY2FsbGVkICpieSBuYW1lKiBhbmQgdGhlcmVmb3JlIG11c3QgYmUgd3JhcHBlZCBpbiBhXG4vLyBjbG9zdXJlLlxuLy8gTmV2ZXIgZm9yZ2V0LlxuXG4vLyBmdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tU2V0SW1tZWRpYXRlKGNhbGxiYWNrKSB7XG4vLyAgICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuLy8gICAgICAgICBzZXRJbW1lZGlhdGUoY2FsbGJhY2spO1xuLy8gICAgIH07XG4vLyB9XG5cbi8vIFNhZmFyaSA2LjAgaGFzIGEgcHJvYmxlbSB3aGVyZSB0aW1lcnMgd2lsbCBnZXQgbG9zdCB3aGlsZSB0aGUgdXNlciBpc1xuLy8gc2Nyb2xsaW5nLiBUaGlzIHByb2JsZW0gZG9lcyBub3QgaW1wYWN0IEFTQVAgYmVjYXVzZSBTYWZhcmkgNi4wIHN1cHBvcnRzXG4vLyBtdXRhdGlvbiBvYnNlcnZlcnMsIHNvIHRoYXQgaW1wbGVtZW50YXRpb24gaXMgdXNlZCBpbnN0ZWFkLlxuLy8gSG93ZXZlciwgaWYgd2UgZXZlciBlbGVjdCB0byB1c2UgdGltZXJzIGluIFNhZmFyaSwgdGhlIHByZXZhbGVudCB3b3JrLWFyb3VuZFxuLy8gaXMgdG8gYWRkIGEgc2Nyb2xsIGV2ZW50IGxpc3RlbmVyIHRoYXQgY2FsbHMgZm9yIGEgZmx1c2guXG5cbi8vIGBzZXRUaW1lb3V0YCBkb2VzIG5vdCBjYWxsIHRoZSBwYXNzZWQgY2FsbGJhY2sgaWYgdGhlIGRlbGF5IGlzIGxlc3MgdGhhblxuLy8gYXBwcm94aW1hdGVseSA3IGluIHdlYiB3b3JrZXJzIGluIEZpcmVmb3ggOCB0aHJvdWdoIDE4LCBhbmQgc29tZXRpbWVzIG5vdFxuLy8gZXZlbiB0aGVuLlxuXG5mdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tVGltZXIoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4gICAgICAgIC8vIFdlIGRpc3BhdGNoIGEgdGltZW91dCB3aXRoIGEgc3BlY2lmaWVkIGRlbGF5IG9mIDAgZm9yIGVuZ2luZXMgdGhhdFxuICAgICAgICAvLyBjYW4gcmVsaWFibHkgYWNjb21tb2RhdGUgdGhhdCByZXF1ZXN0LiBUaGlzIHdpbGwgdXN1YWxseSBiZSBzbmFwcGVkXG4gICAgICAgIC8vIHRvIGEgNCBtaWxpc2Vjb25kIGRlbGF5LCBidXQgb25jZSB3ZSdyZSBmbHVzaGluZywgdGhlcmUncyBubyBkZWxheVxuICAgICAgICAvLyBiZXR3ZWVuIGV2ZW50cy5cbiAgICAgICAgdmFyIHRpbWVvdXRIYW5kbGUgPSBzZXRUaW1lb3V0KGhhbmRsZVRpbWVyLCAwKTtcbiAgICAgICAgLy8gSG93ZXZlciwgc2luY2UgdGhpcyB0aW1lciBnZXRzIGZyZXF1ZW50bHkgZHJvcHBlZCBpbiBGaXJlZm94XG4gICAgICAgIC8vIHdvcmtlcnMsIHdlIGVubGlzdCBhbiBpbnRlcnZhbCBoYW5kbGUgdGhhdCB3aWxsIHRyeSB0byBmaXJlXG4gICAgICAgIC8vIGFuIGV2ZW50IDIwIHRpbWVzIHBlciBzZWNvbmQgdW50aWwgaXQgc3VjY2VlZHMuXG4gICAgICAgIHZhciBpbnRlcnZhbEhhbmRsZSA9IHNldEludGVydmFsKGhhbmRsZVRpbWVyLCA1MCk7XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlVGltZXIoKSB7XG4gICAgICAgICAgICAvLyBXaGljaGV2ZXIgdGltZXIgc3VjY2VlZHMgd2lsbCBjYW5jZWwgYm90aCB0aW1lcnMgYW5kXG4gICAgICAgICAgICAvLyBleGVjdXRlIHRoZSBjYWxsYmFjay5cbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SGFuZGxlKTtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxIYW5kbGUpO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbi8vIFRoaXMgaXMgZm9yIGBhc2FwLmpzYCBvbmx5LlxuLy8gSXRzIG5hbWUgd2lsbCBiZSBwZXJpb2RpY2FsbHkgcmFuZG9taXplZCB0byBicmVhayBhbnkgY29kZSB0aGF0IGRlcGVuZHMgb25cbi8vIGl0cyBleGlzdGVuY2UuXG5yYXdBc2FwLm1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lciA9IG1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcjtcblxuLy8gQVNBUCB3YXMgb3JpZ2luYWxseSBhIG5leHRUaWNrIHNoaW0gaW5jbHVkZWQgaW4gUS4gVGhpcyB3YXMgZmFjdG9yZWQgb3V0XG4vLyBpbnRvIHRoaXMgQVNBUCBwYWNrYWdlLiBJdCB3YXMgbGF0ZXIgYWRhcHRlZCB0byBSU1ZQIHdoaWNoIG1hZGUgZnVydGhlclxuLy8gYW1lbmRtZW50cy4gVGhlc2UgZGVjaXNpb25zLCBwYXJ0aWN1bGFybHkgdG8gbWFyZ2luYWxpemUgTWVzc2FnZUNoYW5uZWwgYW5kXG4vLyB0byBjYXB0dXJlIHRoZSBNdXRhdGlvbk9ic2VydmVyIGltcGxlbWVudGF0aW9uIGluIGEgY2xvc3VyZSwgd2VyZSBpbnRlZ3JhdGVkXG4vLyBiYWNrIGludG8gQVNBUCBwcm9wZXIuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGlsZGVpby9yc3ZwLmpzL2Jsb2IvY2RkZjcyMzI1NDZhOWNmODU4NTI0Yjc1Y2RlNmY5ZWRmNzI2MjBhNy9saWIvcnN2cC9hc2FwLmpzXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHByb2Nlc3MuaHJ0aW1lIHx8IGhydGltZVxuXG4vLyBwb2x5ZmlsIGZvciB3aW5kb3cucGVyZm9ybWFuY2Uubm93XG52YXIgcGVyZm9ybWFuY2UgPSBnbG9iYWwucGVyZm9ybWFuY2UgfHwge31cbnZhciBwZXJmb3JtYW5jZU5vdyA9XG4gIHBlcmZvcm1hbmNlLm5vdyAgICAgICAgfHxcbiAgcGVyZm9ybWFuY2UubW96Tm93ICAgICB8fFxuICBwZXJmb3JtYW5jZS5tc05vdyAgICAgIHx8XG4gIHBlcmZvcm1hbmNlLm9Ob3cgICAgICAgfHxcbiAgcGVyZm9ybWFuY2Uud2Via2l0Tm93ICB8fFxuICBmdW5jdGlvbigpeyByZXR1cm4gKG5ldyBEYXRlKCkpLmdldFRpbWUoKSB9XG5cbi8vIGdlbmVyYXRlIHRpbWVzdGFtcCBvciBkZWx0YVxuLy8gc2VlIGh0dHA6Ly9ub2RlanMub3JnL2FwaS9wcm9jZXNzLmh0bWwjcHJvY2Vzc19wcm9jZXNzX2hydGltZVxuZnVuY3Rpb24gaHJ0aW1lKHByZXZpb3VzVGltZXN0YW1wKXtcbiAgdmFyIGNsb2NrdGltZSA9IHBlcmZvcm1hbmNlTm93LmNhbGwocGVyZm9ybWFuY2UpKjFlLTNcbiAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKGNsb2NrdGltZSlcbiAgdmFyIG5hbm9zZWNvbmRzID0gTWF0aC5mbG9vcigoY2xvY2t0aW1lJTEpKjFlOSlcbiAgaWYgKHByZXZpb3VzVGltZXN0YW1wKSB7XG4gICAgc2Vjb25kcyA9IHNlY29uZHMgLSBwcmV2aW91c1RpbWVzdGFtcFswXVxuICAgIG5hbm9zZWNvbmRzID0gbmFub3NlY29uZHMgLSBwcmV2aW91c1RpbWVzdGFtcFsxXVxuICAgIGlmIChuYW5vc2Vjb25kczwwKSB7XG4gICAgICBzZWNvbmRzLS1cbiAgICAgIG5hbm9zZWNvbmRzICs9IDFlOVxuICAgIH1cbiAgfVxuICByZXR1cm4gW3NlY29uZHMsbmFub3NlY29uZHNdXG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSmxiWEIwZVM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEltcGxlbWVudHMgYSBTZXJ2aWNlIExvY2F0b3IgcGF0dGVybi5cbiAqL1xuY2xhc3MgU2VydmljZUxvY2F0b3Ige1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBzZXJ2aWNlIGxvY2F0b3IgY2xhc3MuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpIHtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgdHlwZSByZWdpc3RyYXRpb25zLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9yZWdpc3RyYXRpb25zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlcnMgYSBuZXcgdHlwZSBuYW1lIGluIHRoZSBzZXJ2aWNlIGxvY2F0b3IuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIFRoZSB0eXBlIG5hbWUgdXNlZCBhcyBhIGtleSBmb3IgcmVzb2x2aW5nIGluc3RhbmNlcy5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gaW1wbGVtZW50YXRpb24gVGhlIGltcGxlbWVudGF0aW9uIChjb25zdHJ1Y3RvciBvciBjbGFzcylcblx0ICogd2hpY2ggY3JlYXRlcyBpbnN0YW5jZXMgb2YgdGhlIHNwZWNpZmllZCB0eXBlIG5hbWUuXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbj99IGlzU2luZ2xldG9uIElmIHRydWUgdGhlbiB0aGUgb25seSBpbnN0YW5jZSB3aWxsXG5cdCAqIGJlIGNyZWF0ZWQgb24gdGhlIGZpcnN0IFwicmVzb2x2ZVwiIGNhbGwgYW5kIG5leHQgY2FsbHMgd2lsbFxuXHQgKiByZXR1cm4gdGhpcyBpbnN0YW5jZS5cblx0ICovXG5cdHJlZ2lzdGVyKHR5cGUsIGltcGxlbWVudGF0aW9uLCBpc1NpbmdsZXRvbikge1xuXHRcdHRoaXMuX3Rocm93SWZOb3RGdW5jdGlvbih0eXBlLCBpbXBsZW1lbnRhdGlvbik7XG5cdFx0dGhpcy5fdGhyb3dJZk5vdFN0cmluZyh0eXBlKTtcblxuXHRcdHRoaXMuX2luaXRpYWxpemVSZWdpc3RyYXRpb24odHlwZSk7XG5cblx0XHR0aGlzLl9yZWdpc3RyYXRpb25zW3R5cGVdLnVuc2hpZnQoe1xuXHRcdFx0SW1wbGVtZW50YXRpb246IGltcGxlbWVudGF0aW9uLFxuXHRcdFx0aXNTaW5nbGV0b246IEJvb2xlYW4oaXNTaW5nbGV0b24pLFxuXHRcdFx0c2luZ2xlSW5zdGFuY2U6IG51bGxcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlcnMgYSBzaW5nbGUgaW5zdGFuY2UgZm9yIHRoZSBzcGVjaWZpZWQgdHlwZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgVGhlIHR5cGUgbmFtZSBmb3IgcmVzb2x2aW5nIHRoZSBpbnN0YW5jZS5cblx0ICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlIFRoZSBpbnN0YW5jZSB0byByZWdpc3Rlci5cblx0ICovXG5cdHJlZ2lzdGVySW5zdGFuY2UodHlwZSwgaW5zdGFuY2UpIHtcblx0XHR0aGlzLl90aHJvd0lmTm90U3RyaW5nKHR5cGUpO1xuXHRcdHRoaXMuX2luaXRpYWxpemVSZWdpc3RyYXRpb24odHlwZSk7XG5cblx0XHR0aGlzLl9yZWdpc3RyYXRpb25zW3R5cGVdLnVuc2hpZnQoe1xuXHRcdFx0SW1wbGVtZW50YXRpb246IGluc3RhbmNlLmNvbnN0cnVjdG9yLFxuXHRcdFx0aXNTaW5nbGV0b246IHRydWUsXG5cdFx0XHRzaW5nbGVJbnN0YW5jZTogaW5zdGFuY2Vcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXNvbHZlcyB0aGUgbGFzdCByZWdpc3RlcmVkIGltcGxlbWVudGF0aW9uIGJ5IHRoZSB0eXBlIG5hbWUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIFRoZSB0eXBlIG5hbWUgdG8gcmVzb2x2ZS5cblx0ICogQHJldHVybnMge09iamVjdH0gVGhlIGluc3RhbmNlIG9mIHRoZSBzcGVjaWZpZWQgdHlwZSBuYW1lLlxuXHQgKi9cblx0cmVzb2x2ZSh0eXBlKSB7XG5cdFx0dGhpcy5fdGhyb3dJZk5vdFN0cmluZyh0eXBlKTtcblx0XHR0aGlzLl90aHJvd0lmTm9UeXBlKHR5cGUpO1xuXHRcdGNvbnN0IGZpcnN0UmVnaXN0cmF0aW9uID0gdGhpcy5fcmVnaXN0cmF0aW9uc1t0eXBlXVswXTtcblx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlSW5zdGFuY2UoZmlyc3RSZWdpc3RyYXRpb24pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlc29sdmVzIGFsbCByZWdpc3RlcmVkIGltcGxlbWVudGF0aW9ucyBieSB0aGUgdHlwZSBuYW1lLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBUaGUgdHlwZSBuYW1lIGZvciByZXNvbHZpbmcgaW5zdGFuY2VzLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBsaXN0IG9mIGluc3RhbmNlcyBvZiB0aGUgc3BlY2lmaWVkIHR5cGUgbmFtZS5cblx0ICovXG5cdHJlc29sdmVBbGwodHlwZSkge1xuXHRcdHRoaXMuX3Rocm93SWZOb3RTdHJpbmcodHlwZSk7XG5cdFx0dGhpcy5fdGhyb3dJZk5vVHlwZSh0eXBlKTtcblx0XHRyZXR1cm4gdGhpcy5fcmVnaXN0cmF0aW9uc1t0eXBlXVxuXHRcdFx0Lm1hcChyZWdpc3RyYXRpb24gPT4gdGhpcy5fY3JlYXRlSW5zdGFuY2UocmVnaXN0cmF0aW9uKSk7XG5cdH1cblxuXHQvKipcblx0ICogVW5yZWdpc3RlcnMgYWxsIHJlZ2lzdHJhdGlvbnMgb2YgdGhlIHNwZWNpZmllZCB0eXBlIG5hbWUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIFRoZSB0eXBlIG5hbWUgZm9yIGRlbGV0aW5nIHRoZSByZWdpc3RyYXRpb25zLlxuXHQgKi9cblx0dW5yZWdpc3Rlcih0eXBlKSB7XG5cdFx0dGhpcy5fdGhyb3dJZk5vdFN0cmluZyh0eXBlKTtcblx0XHR0aGlzLl9yZWdpc3RyYXRpb25zW3R5cGVdID0gW107XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGZ1bmN0aW9uIGNoZWNrcyB3aGV0aGVyIGEgdHlwZSBleGlzdHMgYW5kIGlmIHRoZXJlIGlzIGF0IGxlYXN0IG9uZSBpbnN0YW5jZVxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBUaGUgdHlwZSBuYW1lXG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHQgKi9cblx0aGFzKHR5cGUpIHtcblx0XHR0aGlzLl90aHJvd0lmTm90U3RyaW5nKHR5cGUpO1xuXG5cdFx0cmV0dXJuICh0eXBlIGluIHRoaXMuX3JlZ2lzdHJhdGlvbnMgJiYgdGhpcy5fcmVnaXN0cmF0aW9uc1t0eXBlXS5sZW5ndGggPiAwKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGFuIGluc3RhbmNlIGZvciB0aGUgc3BlY2lmaWVkIHJlZ2lzdHJhdGlvbiBkZXNjcmlwdG9yLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcmVnaXN0cmF0aW9uIFRoZSByZWdpc3RyYXRpb24gZGVzY3JpcHRvciBvYmplY3QuXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBpbnN0YW5jZSBvZiB0aGUgaW1wbGVtZW50YXRpb24gZm91bmQgaW5cblx0ICogdGhlIHNwZWNpZmllZCByZWdpc3RyYXRpb24gZGVzY3JpcHRvci5cblx0ICovXG5cdF9jcmVhdGVJbnN0YW5jZShyZWdpc3RyYXRpb24pIHtcblx0XHRpZiAocmVnaXN0cmF0aW9uLmlzU2luZ2xldG9uICYmIHJlZ2lzdHJhdGlvbi5zaW5nbGVJbnN0YW5jZSAhPT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIHJlZ2lzdHJhdGlvbi5zaW5nbGVJbnN0YW5jZTtcblx0XHR9XG5cblx0XHQvLyBpbmplY3QgU2VydmljZSBMb2NhdG9yIGFzIHRoZSBvbmx5IGFyZ3VtZW50IG9mIHRoZSBjb25zdHJ1Y3Rvci5cblx0XHRjb25zdCBpbnN0YW5jZSA9IG5ldyByZWdpc3RyYXRpb24uSW1wbGVtZW50YXRpb24odGhpcyk7XG5cblx0XHRpZiAocmVnaXN0cmF0aW9uLmlzU2luZ2xldG9uKSB7XG5cdFx0XHRyZWdpc3RyYXRpb24uc2luZ2xlSW5zdGFuY2UgPSBpbnN0YW5jZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gaW5zdGFuY2U7XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZXMgYSByZWdpc3RyYXRpb24gbGlzdCBmb3IgdGhlIHNwZWNpZmllZCB0eXBlIG5hbWUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIFRoZSB0eXBlIG5hbWUgZm9yIHRoZSByZWdpc3RyYXRpb24gbGlzdC5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9pbml0aWFsaXplUmVnaXN0cmF0aW9uKHR5cGUpIHtcblx0XHRpZiAodHlwZSBpbiB0aGlzLl9yZWdpc3RyYXRpb25zKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMuX3JlZ2lzdHJhdGlvbnNbdHlwZV0gPSBbXTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIHNwZWNpZmllZCByZWdpc3RyYXRpb24gaXMgbm90IGZvdW5kLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBUaGUgdHlwZSBuYW1lIHRvIGNoZWNrLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X3Rocm93SWZOb1R5cGUodHlwZSkge1xuXHRcdGlmICh0eXBlIGluIHRoaXMuX3JlZ2lzdHJhdGlvbnMgJiZcblx0XHRcdHRoaXMuX3JlZ2lzdHJhdGlvbnNbdHlwZV0ubGVuZ3RoID4gMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aHJvdyBuZXcgRXJyb3IoYFR5cGUgXCIke3R5cGV9XCIgbm90IHJlZ2lzdGVyZWRgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIHNwZWNpZmllZCBpbXBsZW1lbnRhdGlvbiBpcyBub3QgYSBmdW5jdGlvbi5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgVGhlIHR5cGUgbmFtZSBvZiB0aGUgaW1wbGVtZW50YXRpb24uXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IEltcGxlbWVudGF0aW9uIFRoZSBpbXBsZW1lbnRhdGlvbiB0byBjaGVjay5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF90aHJvd0lmTm90RnVuY3Rpb24odHlwZSwgSW1wbGVtZW50YXRpb24pIHtcblx0XHRpZiAoSW1wbGVtZW50YXRpb24gaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRocm93IG5ldyBFcnJvcihgQ29uc3RydWN0b3IgZm9yIHR5cGUgJHt0eXBlfSBzaG91bGQgYmUgYSBmdW5jdGlvbmApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRocm93cyBhbiBlcnJvciBpZiB0aGUgc3BlY2lmaWVkIHR5cGUgbmFtZSBpcyBub3QgYSBzdHJpbmcuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIFR5cGUgbmFtZSB0byBjaGVjay5cblx0ICovXG5cdF90aHJvd0lmTm90U3RyaW5nKHR5cGUpIHtcblx0XHRpZiAodHlwZW9mICh0eXBlKSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aHJvdyBuZXcgRXJyb3IoYFR5cGUgbmFtZSBcIiR7dHlwZX1cIiBzaG91bGQgYmUgYSBzdHJpbmdgKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlcnZpY2VMb2NhdG9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0VVJJOiByZXF1aXJlKCcuL2xpYi9VUkknKSxcblx0QXV0aG9yaXR5OiByZXF1aXJlKCcuL2xpYi9BdXRob3JpdHknKSxcblx0VXNlckluZm86IHJlcXVpcmUoJy4vbGliL1VzZXJJbmZvJyksXG5cdFF1ZXJ5OiByZXF1aXJlKCcuL2xpYi9RdWVyeScpXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBVc2VySW5mbyA9IHJlcXVpcmUoJy4vVXNlckluZm8nKTtcbmNvbnN0IHBlcmNlbnRFbmNvZGluZ0hlbHBlciA9IHJlcXVpcmUoJy4vcGVyY2VudEVuY29kaW5nSGVscGVyJyk7XG5cbmNvbnN0IFBPUlRfUkVHRVhQID0gL15cXGQrJC87XG5jb25zdCBFUlJPUl9QT1JUID0gYFVSSSBhdXRob3JpdHkgcG9ydCBtdXN0IHNhdGlzZnkgZXhwcmVzc2lvbiAke1BPUlRfUkVHRVhQLnRvU3RyaW5nKCl9YDtcblxuY2xhc3MgQXV0aG9yaXR5IHtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBVUkkgdXNlciBpbmZvIGNvbXBvbmVudC5cblx0ICogQHBhcmFtIHtzdHJpbmc/fSBFeGlzdGluZyBzdHJpbmcuXG5cdCAqIEByZXR1cm4ge1VzZXJJbmZvfSBUaGUgdXNlciBpbmZvIGNvbXBvbmVudC5cblx0ICovXG5cdHN0YXRpYyBjcmVhdGVVc2VySW5mbyhzdHJpbmcpIHtcblx0XHRyZXR1cm4gbmV3IFVzZXJJbmZvKHN0cmluZyk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBVUkkgdXNlciBpbmZvIGNvbXBvbmVudC5cblx0ICogQHBhcmFtIHtzdHJpbmc/fSBFeGlzdGluZyBzdHJpbmcuXG5cdCAqIEByZXR1cm4ge1VzZXJJbmZvfSBUaGUgdXNlciBpbmZvIGNvbXBvbmVudC5cblx0ICovXG5cdGNyZWF0ZVVzZXJJbmZvKHN0cmluZykge1xuXHRcdHJldHVybiBBdXRob3JpdHkuY3JlYXRlVXNlckluZm8oc3RyaW5nKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIG5ldyBpbnN0YW5jZSBvZiBVUkkgYXV0aG9yaXR5IGNvbXBvbmVudCBwYXJzZXIuXG5cdCAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I3NlY3Rpb24tMy4yXG5cdCAqIEBwYXJhbSB7c3RyaW5nP30gYXV0aG9yaXR5U3RyaW5nIFVSSSBhdXRob3JpdHkgY29tcG9uZW50IHN0cmluZy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGF1dGhvcml0eVN0cmluZykge1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCB1c2VyIGluZm9ybWF0aW9uLlxuXHRcdCAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I3NlY3Rpb24tMy4yLjFcblx0XHQgKiBAdHlwZSB7VXNlckluZm99XG5cdFx0ICovXG5cdFx0dGhpcy51c2VySW5mbyA9IG51bGw7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHBvcnQuXG5cdFx0ICogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYjc2VjdGlvbi0zLjIuM1xuXHRcdCAqIEB0eXBlIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0dGhpcy5wb3J0ID0gbnVsbDtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgaG9zdC5cblx0XHQgKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNzZWN0aW9uLTMuMi4yXG5cdFx0ICogQHR5cGUge3N0cmluZ31cblx0XHQgKi9cblx0XHR0aGlzLmhvc3QgPSBudWxsO1xuXG5cdFx0aWYgKHR5cGVvZiAoYXV0aG9yaXR5U3RyaW5nKSA9PT0gJ3N0cmluZycgJiYgYXV0aG9yaXR5U3RyaW5nLmxlbmd0aCA+IDApIHtcblx0XHRcdGNvbnN0IGZpcnN0QXRJbmRleCA9IGF1dGhvcml0eVN0cmluZy5pbmRleE9mKCdAJyk7XG5cdFx0XHRpZiAoZmlyc3RBdEluZGV4ICE9PSAtMSkge1xuXHRcdFx0XHRjb25zdCB1c2VySW5mb1N0cmluZyA9IGF1dGhvcml0eVN0cmluZy5zdWJzdHJpbmcoMCwgZmlyc3RBdEluZGV4KTtcblx0XHRcdFx0dGhpcy51c2VySW5mbyA9IG5ldyBVc2VySW5mbyh1c2VySW5mb1N0cmluZyk7XG5cdFx0XHRcdGF1dGhvcml0eVN0cmluZyA9IGF1dGhvcml0eVN0cmluZy5zdWJzdHJpbmcoZmlyc3RBdEluZGV4ICsgMSk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGxhc3RDb2xvbkluZGV4ID0gYXV0aG9yaXR5U3RyaW5nLmxhc3RJbmRleE9mKCc6Jyk7XG5cdFx0XHRpZiAobGFzdENvbG9uSW5kZXggIT09IC0xKSB7XG5cdFx0XHRcdGNvbnN0IHBvcnRTdHJpbmcgPSBhdXRob3JpdHlTdHJpbmcuc3Vic3RyaW5nKGxhc3RDb2xvbkluZGV4ICsgMSk7XG5cdFx0XHRcdGlmIChsYXN0Q29sb25JbmRleCA9PT0gYXV0aG9yaXR5U3RyaW5nLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0XHR0aGlzLnBvcnQgPSAnJztcblx0XHRcdFx0XHRhdXRob3JpdHlTdHJpbmcgPSBhdXRob3JpdHlTdHJpbmcuc3Vic3RyaW5nKDAsIGxhc3RDb2xvbkluZGV4KTtcblx0XHRcdFx0fSBlbHNlIGlmIChQT1JUX1JFR0VYUC50ZXN0KHBvcnRTdHJpbmcpKSB7XG5cdFx0XHRcdFx0dGhpcy5wb3J0ID0gcG9ydFN0cmluZztcblx0XHRcdFx0XHRhdXRob3JpdHlTdHJpbmcgPSBhdXRob3JpdHlTdHJpbmcuc3Vic3RyaW5nKDAsIGxhc3RDb2xvbkluZGV4KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmhvc3QgPSBwZXJjZW50RW5jb2RpbmdIZWxwZXIuZGVjb2RlKGF1dGhvcml0eVN0cmluZyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIENsb25lcyBjdXJyZW50IGF1dGhvcml0eS5cblx0ICogQHJldHVybnMge0F1dGhvcml0eX0gTmV3IGNsb25lIG9mIGN1cnJlbnQgb2JqZWN0LlxuXHQgKi9cblx0Y2xvbmUoKSB7XG5cdFx0Y29uc3QgYXV0aG9yaXR5ID0gbmV3IEF1dGhvcml0eSgpO1xuXHRcdGlmICh0aGlzLnVzZXJJbmZvKSB7XG5cdFx0XHRhdXRob3JpdHkudXNlckluZm8gPSB0aGlzLnVzZXJJbmZvLmNsb25lKCk7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgKHRoaXMuaG9zdCkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRhdXRob3JpdHkuaG9zdCA9IHRoaXMuaG9zdDtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiAodGhpcy5wb3J0KSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdGF1dGhvcml0eS5wb3J0ID0gdGhpcy5wb3J0O1xuXHRcdH1cblx0XHRyZXR1cm4gYXV0aG9yaXR5O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlY29tYmluZSBhbGwgYXV0aG9yaXR5IGNvbXBvbmVudHMgaW50byBhdXRob3JpdHkgc3RyaW5nLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBBdXRob3JpdHkgY29tcG9uZW50IHN0cmluZy5cblx0ICovXG5cdHRvU3RyaW5nKCkge1xuXHRcdGxldCByZXN1bHQgPSAnJztcblx0XHRpZiAodGhpcy51c2VySW5mbyBpbnN0YW5jZW9mIFVzZXJJbmZvKSB7XG5cdFx0XHRyZXN1bHQgKz0gYCR7dGhpcy51c2VySW5mby50b1N0cmluZygpfUBgO1xuXHRcdH1cblx0XHRpZiAodGhpcy5ob3N0ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5ob3N0ICE9PSBudWxsKSB7XG5cdFx0XHRjb25zdCBob3N0ID0gU3RyaW5nKHRoaXMuaG9zdCk7XG5cdFx0XHRyZXN1bHQgKz0gcGVyY2VudEVuY29kaW5nSGVscGVyLmVuY29kZUhvc3QoaG9zdCk7XG5cdFx0fVxuXHRcdGlmICh0aGlzLnBvcnQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnBvcnQgIT09IG51bGwpIHtcblx0XHRcdGNvbnN0IHBvcnQgPSBTdHJpbmcodGhpcy5wb3J0KTtcblx0XHRcdGlmIChwb3J0Lmxlbmd0aCA+IDAgJiYgIVBPUlRfUkVHRVhQLnRlc3QocG9ydCkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKEVSUk9SX1BPUlQpO1xuXHRcdFx0fVxuXHRcdFx0cmVzdWx0ICs9IGA6JHtwb3J0fWA7XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBdXRob3JpdHk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHBlcmNlbnRFbmNvZGluZ0hlbHBlciA9IHJlcXVpcmUoJy4vcGVyY2VudEVuY29kaW5nSGVscGVyJyk7XG5cbmNsYXNzIFF1ZXJ5IHtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBuZXcgaW5zdGFuY2Ugb2YgVVJJIHF1ZXJ5IGNvbXBvbmVudCBwYXJzZXIuXG5cdCAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I3NlY3Rpb24tMy40XG5cdCAqIEBwYXJhbSB7c3RyaW5nP30gcXVlcnlTdHJpbmcgVVJJIHF1ZXJ5IGNvbXBvbmVudCBzdHJpbmcuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihxdWVyeVN0cmluZykge1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBzZXQgb2YgdmFsdWVzIG9mIHF1ZXJ5LlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICovXG5cdFx0dGhpcy52YWx1ZXMgPSBudWxsO1xuXG5cdFx0aWYgKHR5cGVvZiAocXVlcnlTdHJpbmcpID09PSAnc3RyaW5nJykge1xuXHRcdFx0dGhpcy52YWx1ZXMgPSB7fTtcblxuXHRcdFx0cXVlcnlTdHJpbmdcblx0XHRcdFx0LnNwbGl0KCcmJylcblx0XHRcdFx0LmZvckVhY2gocGFpciA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgcGFydHMgPSBwYWlyLnNwbGl0KCc9Jyk7XG5cdFx0XHRcdFx0Y29uc3Qga2V5ID0gcGVyY2VudEVuY29kaW5nSGVscGVyLmRlY29kZShwYXJ0c1swXSk7XG5cdFx0XHRcdFx0aWYgKCFrZXkpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGtleSBpbiB0aGlzLnZhbHVlcyAmJlxuXHRcdFx0XHRcdFx0ISh0aGlzLnZhbHVlc1trZXldIGluc3RhbmNlb2YgQXJyYXkpKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnZhbHVlc1trZXldID0gW3RoaXMudmFsdWVzW2tleV1dO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gdHlwZW9mIChwYXJ0c1sxXSkgPT09ICdzdHJpbmcnID9cblx0XHRcdFx0XHRcdHBlcmNlbnRFbmNvZGluZ0hlbHBlci5kZWNvZGUocGFydHNbMV0pIDogbnVsbDtcblxuXHRcdFx0XHRcdGlmICh0aGlzLnZhbHVlc1trZXldIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRcdFx0XHRcdHRoaXMudmFsdWVzW2tleV0ucHVzaCh2YWx1ZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMudmFsdWVzW2tleV0gPSB2YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIHRoaXMpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBDbG9uZXMgY3VycmVudCBxdWVyeSB0byBhIG5ldyBvYmplY3QuXG5cdCAqIEByZXR1cm5zIHtRdWVyeX0gTmV3IGNsb25lIG9mIGN1cnJlbnQgb2JqZWN0LlxuXHQgKi9cblx0Y2xvbmUoKSB7XG5cdFx0Y29uc3QgcXVlcnkgPSBuZXcgUXVlcnkoKTtcblx0XHRpZiAodGhpcy52YWx1ZXMpIHtcblx0XHRcdHF1ZXJ5LnZhbHVlcyA9IHt9O1xuXHRcdFx0T2JqZWN0LmtleXModGhpcy52YWx1ZXMpXG5cdFx0XHRcdC5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRcdFx0cXVlcnkudmFsdWVzW2tleV0gPSB0aGlzLnZhbHVlc1trZXldO1xuXHRcdFx0XHR9LCB0aGlzKTtcblx0XHR9XG5cdFx0cmV0dXJuIHF1ZXJ5O1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGN1cnJlbnQgc2V0IG9mIHF1ZXJ5IHZhbHVlcyB0byBzdHJpbmcuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFF1ZXJ5IGNvbXBvbmVudCBzdHJpbmcuXG5cdCAqL1xuXHR0b1N0cmluZygpIHtcblx0XHRpZiAoIXRoaXMudmFsdWVzKSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXG5cdFx0bGV0IHF1ZXJ5U3RyaW5nID0gJyc7XG5cdFx0T2JqZWN0LmtleXModGhpcy52YWx1ZXMpXG5cdFx0XHQuZm9yRWFjaChrZXkgPT4ge1xuXHRcdFx0XHRjb25zdCB2YWx1ZXMgPSB0aGlzLnZhbHVlc1trZXldIGluc3RhbmNlb2YgQXJyYXkgP1xuXHRcdFx0XHRcdHRoaXMudmFsdWVzW2tleV0gOiBbdGhpcy52YWx1ZXNba2V5XV07XG5cblx0XHRcdFx0dmFsdWVzLmZvckVhY2godmFsdWUgPT4ge1xuXHRcdFx0XHRcdHF1ZXJ5U3RyaW5nICs9IGAmJHtwZXJjZW50RW5jb2RpbmdIZWxwZXIuZW5jb2RlUXVlcnlTdWJDb21wb25lbnQoa2V5KX1gO1xuXHRcdFx0XHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZhbHVlID0gU3RyaW5nKHZhbHVlKTtcblx0XHRcdFx0XHRxdWVyeVN0cmluZyArPSBgPSR7cGVyY2VudEVuY29kaW5nSGVscGVyLmVuY29kZVF1ZXJ5U3ViQ29tcG9uZW50KHZhbHVlKX1gO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0sIHRoaXMpO1xuXG5cdFx0cmV0dXJuIHF1ZXJ5U3RyaW5nLnJlcGxhY2UoL14mLywgJycpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUXVlcnk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHBlcmNlbnRFbmNvZGluZ0hlbHBlciA9IHJlcXVpcmUoJy4vcGVyY2VudEVuY29kaW5nSGVscGVyJyk7XG5cbmNvbnN0IEF1dGhvcml0eSA9IHJlcXVpcmUoJy4vQXV0aG9yaXR5Jyk7XG5jb25zdCBRdWVyeSA9IHJlcXVpcmUoJy4vUXVlcnknKTtcblxuLy8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYjYXBwZW5kaXgtQlxuY29uc3QgVVJJX1BBUlNFX1JFR0VYUCA9IG5ldyBSZWdFeHAoXG5cdCdeKChbXjovPyNdKyk6KT8oLy8oW14vPyNdKikpPyhbXj8jXSopKFxcXFw/KFteI10qKSk/KCMoLiopKT8nXG5cdCk7XG4vLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNzZWN0aW9uLTMuMVxuY29uc3QgU0NIRU1FX1JFR0VYUCA9IC9eW2Etel0rW2EtelxcZFxcK1xcLi1dKiQvaTtcbmNvbnN0IEVSUk9SX1NDSEVNRSA9IGBVUkkgc2NoZW1lIG11c3Qgc2F0aXNmeSBleHByZXNzaW9uICR7U0NIRU1FX1JFR0VYUC50b1N0cmluZygpfWA7XG5cbmNsYXNzIFVSSSB7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgVVJJIGF1dGhvcml0eSBjb21wb25lbnQuXG5cdCAqIEBwYXJhbSB7c3RyaW5nP30gRXhpc3Rpbmcgc3RyaW5nLlxuXHQgKiBAcmV0dXJuIHtBdXRob3JpdHl9IFRoZSBhdXRob3JpdHkgY29tcG9uZW50LlxuXHQgKi9cblx0c3RhdGljIGNyZWF0ZUF1dGhvcml0eShzdHJpbmcpIHtcblx0XHRyZXR1cm4gbmV3IEF1dGhvcml0eShzdHJpbmcpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgVVJJIGF1dGhvcml0eSBjb21wb25lbnQuXG5cdCAqIEBwYXJhbSB7c3RyaW5nP30gRXhpc3Rpbmcgc3RyaW5nLlxuXHQgKiBAcmV0dXJuIHtBdXRob3JpdHl9IFRoZSBhdXRob3JpdHkgY29tcG9uZW50LlxuXHQgKi9cblx0Y3JlYXRlQXV0aG9yaXR5KHN0cmluZykge1xuXHRcdHJldHVybiBVUkkuY3JlYXRlQXV0aG9yaXR5KHN0cmluZyk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBVUkkgdXNlciBpbmZvIGNvbXBvbmVudC5cblx0ICogQHBhcmFtIHtzdHJpbmc/fSBFeGlzdGluZyBzdHJpbmcuXG5cdCAqIEByZXR1cm4ge1VzZXJJbmZvfSBUaGUgdXNlciBpbmZvIGNvbXBvbmVudC5cblx0ICovXG5cdHN0YXRpYyBjcmVhdGVVc2VySW5mbyhzdHJpbmcpIHtcblx0XHRyZXR1cm4gQXV0aG9yaXR5LmNyZWF0ZVVzZXJJbmZvKHN0cmluZyk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBVUkkgdXNlciBpbmZvIGNvbXBvbmVudC5cblx0ICogQHBhcmFtIHtzdHJpbmc/fSBFeGlzdGluZyBzdHJpbmcuXG5cdCAqIEByZXR1cm4ge1VzZXJJbmZvfSBUaGUgdXNlciBpbmZvIGNvbXBvbmVudC5cblx0ICovXG5cdGNyZWF0ZVVzZXJJbmZvKHN0cmluZykge1xuXHRcdHJldHVybiBVUkkuY3JlYXRlVXNlckluZm8oc3RyaW5nKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IFVSSSBxdWVyeSBjb21wb25lbnQuXG5cdCAqIEBwYXJhbSB7c3RyaW5nP30gRXhpc3Rpbmcgc3RyaW5nLlxuXHQgKiBAcmV0dXJuIHtRdWVyeX0gVGhlIHF1ZXJ5IGNvbXBvbmVudC5cblx0ICovXG5cdHN0YXRpYyBjcmVhdGVRdWVyeShzdHJpbmcpIHtcblx0XHRyZXR1cm4gbmV3IFF1ZXJ5KHN0cmluZyk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBVUkkgcXVlcnkgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0ge3N0cmluZz99IEV4aXN0aW5nIHN0cmluZy5cblx0ICogQHJldHVybiB7UXVlcnl9IFRoZSBxdWVyeSBjb21wb25lbnQuXG5cdCAqL1xuXHRjcmVhdGVRdWVyeShzdHJpbmcpIHtcblx0XHRyZXR1cm4gVVJJLmNyZWF0ZVF1ZXJ5KHN0cmluZyk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBuZXcgaW5zdGFuY2Ugb2YgVVJJIGFjY29yZGluZyB0byBSRkMgMzk4Ni5cblx0ICogQHBhcmFtIHtzdHJpbmc/fSB1cmlTdHJpbmcgVVJJIHN0cmluZyB0byBwYXJzZSBjb21wb25lbnRzLlxuXHQgKi9cblx0Y29uc3RydWN0b3IodXJpU3RyaW5nKSB7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IFVSSSBzY2hlbWUuXG5cdFx0ICogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYjc2VjdGlvbi0zLjFcblx0XHQgKiBAdHlwZSB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdHRoaXMuc2NoZW1lID0gbnVsbDtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgVVJJIGF1dGhvcml0eS5cblx0XHQgKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNzZWN0aW9uLTMuMlxuXHRcdCAqIEB0eXBlIHtBdXRob3JpdHl9XG5cdFx0ICovXG5cdFx0dGhpcy5hdXRob3JpdHkgPSBudWxsO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBVUkkgcGF0aC5cblx0XHQgKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNzZWN0aW9uLTMuM1xuXHRcdCAqIEB0eXBlIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0dGhpcy5wYXRoID0gbnVsbDtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgVVJJIHF1ZXJ5LlxuXHRcdCAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I3NlY3Rpb24tMy40XG5cdFx0ICogQHR5cGUge1F1ZXJ5fVxuXHRcdCAqL1xuXHRcdHRoaXMucXVlcnkgPSBudWxsO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBVUkkgZnJhZ21lbnQuXG5cdFx0ICogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYjc2VjdGlvbi0zLjVcblx0XHQgKiBAdHlwZSB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdHRoaXMuZnJhZ21lbnQgPSBudWxsO1xuXG5cdFx0aWYgKHR5cGVvZiAodXJpU3RyaW5nKSAhPT0gJ3N0cmluZycpIHtcblx0XHRcdHVyaVN0cmluZyA9ICcnO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I2FwcGVuZGl4LUJcblx0XHRjb25zdCBtYXRjaGVzID0gdXJpU3RyaW5nLm1hdGNoKFVSSV9QQVJTRV9SRUdFWFApO1xuXG5cdFx0aWYgKG1hdGNoZXMpIHtcblx0XHRcdGlmICh0eXBlb2YgKG1hdGNoZXNbMl0pID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHR0aGlzLnNjaGVtZSA9IHBlcmNlbnRFbmNvZGluZ0hlbHBlci5kZWNvZGUobWF0Y2hlc1syXSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZW9mIChtYXRjaGVzWzRdKSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0dGhpcy5hdXRob3JpdHkgPSBVUkkuY3JlYXRlQXV0aG9yaXR5KG1hdGNoZXNbNF0pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHR5cGVvZiAobWF0Y2hlc1s1XSkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdHRoaXMucGF0aCA9IHBlcmNlbnRFbmNvZGluZ0hlbHBlci5kZWNvZGVQYXRoKG1hdGNoZXNbNV0pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHR5cGVvZiAobWF0Y2hlc1s3XSkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdHRoaXMucXVlcnkgPSBVUkkuY3JlYXRlUXVlcnkobWF0Y2hlc1s3XSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZW9mIChtYXRjaGVzWzldKSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0dGhpcy5mcmFnbWVudCA9IHBlcmNlbnRFbmNvZGluZ0hlbHBlci5kZWNvZGUobWF0Y2hlc1s5XSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgVVJJIHJlZmVyZW5jZSB0aGF0IG1pZ2h0IGJlIHJlbGF0aXZlIHRvIGEgZ2l2ZW4gYmFzZSBVUklcblx0ICogaW50byB0aGUgcmVmZXJlbmNlJ3MgdGFyZ2V0IFVSSS5cblx0ICogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYjc2VjdGlvbi01LjJcblx0ICogQHBhcmFtIHtVUkl9IGJhc2VVcmkgQmFzZSBVUkkuXG5cdCAqIEByZXR1cm5zIHtVUkl9IFJlc29sdmVkIFVSSS5cblx0ICovXG5cdHJlc29sdmVSZWxhdGl2ZShiYXNlVXJpKSB7XG5cdFx0aWYgKCFiYXNlVXJpLnNjaGVtZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdTY2hlbWUgY29tcG9uZW50IGlzIHJlcXVpcmVkIHRvIGJlIHByZXNlbnQgaW4gYSBiYXNlIFVSSScpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cmFuc2Zvcm1SZWZlcmVuY2UoYmFzZVVyaSwgdGhpcyk7XG5cdH1cblxuXHQvKipcblx0ICogQ2xvbmVzIGN1cnJlbnQgVVJJIHRvIGEgbmV3IG9iamVjdC5cblx0ICogQHJldHVybnMge1VSSX0gTmV3IGNsb25lIG9mIGN1cnJlbnQgb2JqZWN0LlxuXHQgKi9cblx0Y2xvbmUoKSB7XG5cdFx0Y29uc3QgdXJpID0gbmV3IFVSSSgpO1xuXG5cdFx0aWYgKHR5cGVvZiAodGhpcy5zY2hlbWUpID09PSAnc3RyaW5nJykge1xuXHRcdFx0dXJpLnNjaGVtZSA9IHRoaXMuc2NoZW1lO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmF1dGhvcml0eSkge1xuXHRcdFx0dXJpLmF1dGhvcml0eSA9IHRoaXMuYXV0aG9yaXR5LmNsb25lKCk7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiAodGhpcy5wYXRoKSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHVyaS5wYXRoID0gdGhpcy5wYXRoO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnF1ZXJ5KSB7XG5cdFx0XHR1cmkucXVlcnkgPSB0aGlzLnF1ZXJ5LmNsb25lKCk7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiAodGhpcy5mcmFnbWVudCkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHR1cmkuZnJhZ21lbnQgPSB0aGlzLmZyYWdtZW50O1xuXHRcdH1cblxuXHRcdHJldHVybiB1cmk7XG5cdH1cblxuXHQvKipcblx0ICogUmVjb21wb3NlcyBVUkkgY29tcG9uZW50cyB0byBVUkkgc3RyaW5nLFxuXHQgKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNzZWN0aW9uLTUuM1xuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBVUkkgc3RyaW5nLlxuXHQgKi9cblx0dG9TdHJpbmcoKSB7XG5cdFx0bGV0IHJlc3VsdCA9ICcnO1xuXG5cdFx0aWYgKHRoaXMuc2NoZW1lICE9PSB1bmRlZmluZWQgJiYgdGhpcy5zY2hlbWUgIT09IG51bGwpIHtcblx0XHRcdGNvbnN0IHNjaGVtZSA9IFN0cmluZyh0aGlzLnNjaGVtZSk7XG5cdFx0XHRpZiAoIVNDSEVNRV9SRUdFWFAudGVzdChzY2hlbWUpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihFUlJPUl9TQ0hFTUUpO1xuXHRcdFx0fVxuXHRcdFx0cmVzdWx0ICs9IGAke3NjaGVtZX06YDtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5hdXRob3JpdHkgaW5zdGFuY2VvZiBBdXRob3JpdHkpIHtcblx0XHRcdHJlc3VsdCArPSBgLy8ke3RoaXMuYXV0aG9yaXR5LnRvU3RyaW5nKCl9YDtcblx0XHR9XG5cblx0XHRjb25zdCBwYXRoID0gdGhpcy5wYXRoID09PSB1bmRlZmluZWQgfHwgdGhpcy5wYXRoID09PSBudWxsID9cblx0XHRcdCcnIDogU3RyaW5nKHRoaXMucGF0aCk7XG5cdFx0cmVzdWx0ICs9IHBlcmNlbnRFbmNvZGluZ0hlbHBlci5lbmNvZGVQYXRoKHBhdGgpO1xuXG5cdFx0aWYgKHRoaXMucXVlcnkgaW5zdGFuY2VvZiBRdWVyeSkge1xuXHRcdFx0cmVzdWx0ICs9IGA/JHt0aGlzLnF1ZXJ5LnRvU3RyaW5nKCl9YDtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5mcmFnbWVudCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZnJhZ21lbnQgIT09IG51bGwpIHtcblx0XHRcdGNvbnN0IGZyYWdtZW50ID0gU3RyaW5nKHRoaXMuZnJhZ21lbnQpO1xuXHRcdFx0cmVzdWx0ICs9IGAjJHtwZXJjZW50RW5jb2RpbmdIZWxwZXIuZW5jb2RlRnJhZ21lbnQoZnJhZ21lbnQpfWA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxufVxuXG4vKipcbiAqIFRyYW5zZm9ybXMgcmVmZXJlbmNlIGZvciByZWxhdGl2ZSByZXNvbHV0aW9uLlxuICogV2hvbGUgYWxnb3JpdGhtIGhhcyBiZWVuIHRha2VuIGZyb21cbiAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I3NlY3Rpb24tNS4yLjJcbiAqIEBwYXJhbSB7VVJJfSBiYXNlVXJpIEJhc2UgVVJJIGZvciByZXNvbHV0aW9uLlxuICogQHBhcmFtIHtVUkl9IHJlZmVyZW5jZVVyaSBSZWZlcmVuY2UgVVJJIHRvIHJlc29sdmUuXG4gKiBAcmV0dXJucyB7VVJJfSBDb21wb25lbnRzIG9mIHRhcmdldCBVUkkuXG4gKi9cbmZ1bmN0aW9uIHRyYW5zZm9ybVJlZmVyZW5jZShiYXNlVXJpLCByZWZlcmVuY2VVcmkpIHtcblxuXHQvKiBlc2xpbnQgY29tcGxleGl0eTogWzIsIDEzXSovXG5cdGNvbnN0IHRhcmdldFVyaSA9IG5ldyBVUkkoJycpO1xuXG5cdGlmIChyZWZlcmVuY2VVcmkuc2NoZW1lKSB7XG5cdFx0dGFyZ2V0VXJpLnNjaGVtZSA9IHJlZmVyZW5jZVVyaS5zY2hlbWU7XG5cdFx0dGFyZ2V0VXJpLmF1dGhvcml0eSA9IHJlZmVyZW5jZVVyaS5hdXRob3JpdHkgP1xuXHRcdFx0cmVmZXJlbmNlVXJpLmF1dGhvcml0eS5jbG9uZSgpIDogcmVmZXJlbmNlVXJpLmF1dGhvcml0eTtcblx0XHR0YXJnZXRVcmkucGF0aCA9IHJlbW92ZURvdFNlZ21lbnRzKHJlZmVyZW5jZVVyaS5wYXRoKTtcblx0XHR0YXJnZXRVcmkucXVlcnkgPSByZWZlcmVuY2VVcmkucXVlcnkgP1xuXHRcdFx0cmVmZXJlbmNlVXJpLnF1ZXJ5LmNsb25lKCkgOiByZWZlcmVuY2VVcmkucXVlcnk7XG5cdH0gZWxzZSB7XG5cdFx0aWYgKHJlZmVyZW5jZVVyaS5hdXRob3JpdHkpIHtcblx0XHRcdHRhcmdldFVyaS5hdXRob3JpdHkgPSByZWZlcmVuY2VVcmkuYXV0aG9yaXR5ID9cblx0XHRcdFx0cmVmZXJlbmNlVXJpLmF1dGhvcml0eS5jbG9uZSgpIDogcmVmZXJlbmNlVXJpLmF1dGhvcml0eTtcblx0XHRcdHRhcmdldFVyaS5wYXRoID0gcmVtb3ZlRG90U2VnbWVudHMocmVmZXJlbmNlVXJpLnBhdGgpO1xuXHRcdFx0dGFyZ2V0VXJpLnF1ZXJ5ID0gcmVmZXJlbmNlVXJpLnF1ZXJ5ID9cblx0XHRcdFx0cmVmZXJlbmNlVXJpLnF1ZXJ5LmNsb25lKCkgOiByZWZlcmVuY2VVcmkucXVlcnk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChyZWZlcmVuY2VVcmkucGF0aCA9PT0gJycpIHtcblx0XHRcdFx0dGFyZ2V0VXJpLnBhdGggPSBiYXNlVXJpLnBhdGg7XG5cdFx0XHRcdGlmIChyZWZlcmVuY2VVcmkucXVlcnkpIHtcblx0XHRcdFx0XHR0YXJnZXRVcmkucXVlcnkgPSByZWZlcmVuY2VVcmkucXVlcnkuY2xvbmUoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0YXJnZXRVcmkucXVlcnkgPSBiYXNlVXJpLnF1ZXJ5ID9cblx0XHRcdFx0XHRcdGJhc2VVcmkucXVlcnkuY2xvbmUoKSA6IGJhc2VVcmkucXVlcnk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmIChyZWZlcmVuY2VVcmkucGF0aFswXSA9PT0gJy8nKSB7XG5cdFx0XHRcdFx0dGFyZ2V0VXJpLnBhdGggPSByZW1vdmVEb3RTZWdtZW50cyhyZWZlcmVuY2VVcmkucGF0aCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGFyZ2V0VXJpLnBhdGggPSBtZXJnZShiYXNlVXJpLCByZWZlcmVuY2VVcmkpO1xuXHRcdFx0XHRcdHRhcmdldFVyaS5wYXRoID0gcmVtb3ZlRG90U2VnbWVudHModGFyZ2V0VXJpLnBhdGgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRhcmdldFVyaS5xdWVyeSA9IHJlZmVyZW5jZVVyaS5xdWVyeSA/XG5cdFx0XHRcdFx0cmVmZXJlbmNlVXJpLnF1ZXJ5LmNsb25lKCkgOiByZWZlcmVuY2VVcmkucXVlcnk7XG5cdFx0XHR9XG5cdFx0XHR0YXJnZXRVcmkuYXV0aG9yaXR5ID0gYmFzZVVyaS5hdXRob3JpdHkgP1xuXHRcdFx0XHRiYXNlVXJpLmF1dGhvcml0eS5jbG9uZSgpIDogYmFzZVVyaS5hdXRob3JpdHk7XG5cdFx0fVxuXHRcdHRhcmdldFVyaS5zY2hlbWUgPSBiYXNlVXJpLnNjaGVtZTtcblx0fVxuXG5cdHRhcmdldFVyaS5mcmFnbWVudCA9IHJlZmVyZW5jZVVyaS5mcmFnbWVudDtcblx0cmV0dXJuIHRhcmdldFVyaTtcbn1cblxuLyoqXG4gKiBNZXJnZXMgYSByZWxhdGl2ZS1wYXRoIHJlZmVyZW5jZSB3aXRoIHRoZSBwYXRoIG9mIHRoZSBiYXNlIFVSSS5cbiAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I3NlY3Rpb24tNS4yLjNcbiAqIEBwYXJhbSB7VVJJfSBiYXNlVXJpIENvbXBvbmVudHMgb2YgYmFzZSBVUkkuXG4gKiBAcGFyYW0ge1VSSX0gcmVmZXJlbmNlVXJpIENvbXBvbmVudHMgb2YgcmVmZXJlbmNlIFVSSS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IE1lcmdlZCBwYXRoLlxuICovXG5mdW5jdGlvbiBtZXJnZShiYXNlVXJpLCByZWZlcmVuY2VVcmkpIHtcblx0aWYgKGJhc2VVcmkuYXV0aG9yaXR5ICYmIGJhc2VVcmkucGF0aCA9PT0gJycpIHtcblx0XHRyZXR1cm4gYC8ke3JlZmVyZW5jZVVyaS5wYXRofWA7XG5cdH1cblxuXHRjb25zdCBzZWdtZW50c1N0cmluZyA9IGJhc2VVcmkucGF0aC5pbmRleE9mKCcvJykgIT09IC0xID9cblx0XHRiYXNlVXJpLnBhdGgucmVwbGFjZSgvXFwvW15cXC9dKyQvLCAnLycpIDogJyc7XG5cblx0cmV0dXJuIHNlZ21lbnRzU3RyaW5nICsgcmVmZXJlbmNlVXJpLnBhdGg7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBkb3RzIHNlZ21lbnRzIGZyb20gVVJJIHBhdGguXG4gKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNzZWN0aW9uLTUuMi40XG4gKiBAcGFyYW0ge3N0cmluZ30gdXJpUGF0aCBVUkkgcGF0aCB3aXRoIHBvc3NpYmxlIGRvdCBzZWdtZW50cy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFVSSSBwYXRoIHdpdGhvdXQgZG90IHNlZ21lbnRzLlxuICovXG5mdW5jdGlvbiByZW1vdmVEb3RTZWdtZW50cyh1cmlQYXRoKSB7XG5cdGlmICghdXJpUGF0aCkge1xuXHRcdHJldHVybiAnJztcblx0fVxuXG5cdGxldCBpbnB1dEJ1ZmZlciA9IHVyaVBhdGg7XG5cdGxldCBuZXdCdWZmZXIgPSAnJztcblx0bGV0IG5leHRTZWdtZW50ID0gJyc7XG5cdGxldCBvdXRwdXRCdWZmZXIgPSAnJztcblxuXHR3aGlsZSAoaW5wdXRCdWZmZXIubGVuZ3RoICE9PSAwKSB7XG5cblx0XHQvLyBJZiB0aGUgaW5wdXQgYnVmZmVyIGJlZ2lucyB3aXRoIGEgcHJlZml4IG9mIFwiLi4vXCIgb3IgXCIuL1wiLFxuXHRcdC8vIHRoZW4gcmVtb3ZlIHRoYXQgcHJlZml4IGZyb20gdGhlIGlucHV0IGJ1ZmZlclxuXHRcdG5ld0J1ZmZlciA9IGlucHV0QnVmZmVyLnJlcGxhY2UoL15cXC4/XFwuXFwvLywgJycpO1xuXHRcdGlmIChuZXdCdWZmZXIgIT09IGlucHV0QnVmZmVyKSB7XG5cdFx0XHRpbnB1dEJ1ZmZlciA9IG5ld0J1ZmZlcjtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdC8vIGlmIHRoZSBpbnB1dCBidWZmZXIgYmVnaW5zIHdpdGggYSBwcmVmaXggb2YgXCIvLi9cIiBvciBcIi8uXCIsXG5cdFx0Ly8gd2hlcmUgXCIuXCIgaXMgYSBjb21wbGV0ZSBwYXRoIHNlZ21lbnQsIHRoZW4gcmVwbGFjZSB0aGF0XG5cdFx0Ly8gcHJlZml4IHdpdGggXCIvXCIgaW4gdGhlIGlucHV0IGJ1ZmZlclxuXHRcdG5ld0J1ZmZlciA9IGlucHV0QnVmZmVyLnJlcGxhY2UoL14oKFxcL1xcLlxcLyl8KFxcL1xcLiQpKS8sICcvJyk7XG5cdFx0aWYgKG5ld0J1ZmZlciAhPT0gaW5wdXRCdWZmZXIpIHtcblx0XHRcdGlucHV0QnVmZmVyID0gbmV3QnVmZmVyO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0Ly8gaWYgdGhlIGlucHV0IGJ1ZmZlciBiZWdpbnMgd2l0aCBhIHByZWZpeCBvZiBcIi8uLi9cIiBvciBcIi8uLlwiLFxuXHRcdC8vIHdoZXJlIFwiLi5cIiBpcyBhIGNvbXBsZXRlIHBhdGggc2VnbWVudCwgdGhlbiByZXBsYWNlIHRoYXRcblx0XHQvLyBwcmVmaXggd2l0aCBcIi9cIiBpbiB0aGUgaW5wdXQgYnVmZmVyIGFuZCByZW1vdmUgdGhlIGxhc3Rcblx0XHQvLyBzZWdtZW50IGFuZCBpdHMgcHJlY2VkaW5nIFwiL1wiIChpZiBhbnkpIGZyb20gdGhlIG91dHB1dFxuXHRcdC8vIGJ1ZmZlclxuXHRcdG5ld0J1ZmZlciA9IGlucHV0QnVmZmVyLnJlcGxhY2UoL14oKFxcL1xcLlxcLlxcLyl8KFxcL1xcLlxcLiQpKS8sICcvJyk7XG5cdFx0aWYgKG5ld0J1ZmZlciAhPT0gaW5wdXRCdWZmZXIpIHtcblx0XHRcdG91dHB1dEJ1ZmZlciA9IG91dHB1dEJ1ZmZlci5yZXBsYWNlKC9cXC9bXlxcL10rJC8sICcnKTtcblx0XHRcdGlucHV0QnVmZmVyID0gbmV3QnVmZmVyO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0Ly8gaWYgdGhlIGlucHV0IGJ1ZmZlciBjb25zaXN0cyBvbmx5IG9mIFwiLlwiIG9yIFwiLi5cIiwgdGhlbiByZW1vdmVcblx0XHQvLyB0aGF0IGZyb20gdGhlIGlucHV0IGJ1ZmZlclxuXHRcdGlmIChpbnB1dEJ1ZmZlciA9PT0gJy4nIHx8IGlucHV0QnVmZmVyID09PSAnLi4nKSB7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHQvLyBtb3ZlIHRoZSBmaXJzdCBwYXRoIHNlZ21lbnQgaW4gdGhlIGlucHV0IGJ1ZmZlciB0byB0aGUgZW5kIG9mXG5cdFx0Ly8gdGhlIG91dHB1dCBidWZmZXIsIGluY2x1ZGluZyB0aGUgaW5pdGlhbCBcIi9cIiBjaGFyYWN0ZXIgKGlmXG5cdFx0Ly8gYW55KSBhbmQgYW55IHN1YnNlcXVlbnQgY2hhcmFjdGVycyB1cCB0bywgYnV0IG5vdCBpbmNsdWRpbmcsXG5cdFx0Ly8gdGhlIG5leHQgXCIvXCIgY2hhcmFjdGVyIG9yIHRoZSBlbmQgb2YgdGhlIGlucHV0IGJ1ZmZlclxuXHRcdG5leHRTZWdtZW50ID0gL15cXC8/W15cXC9dKihcXC98JCkvLmV4ZWMoaW5wdXRCdWZmZXIpWzBdO1xuXHRcdG5leHRTZWdtZW50ID0gbmV4dFNlZ21lbnQucmVwbGFjZSgvKFteXFwvXSkoXFwvJCkvLCAnJDEnKTtcblx0XHRpbnB1dEJ1ZmZlciA9IGlucHV0QnVmZmVyLnN1YnN0cmluZyhuZXh0U2VnbWVudC5sZW5ndGgpO1xuXHRcdG91dHB1dEJ1ZmZlciArPSBuZXh0U2VnbWVudDtcblx0fVxuXG5cdHJldHVybiBvdXRwdXRCdWZmZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVVJJO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBwZXJjZW50RW5jb2RpbmdIZWxwZXIgPSByZXF1aXJlKCcuL3BlcmNlbnRFbmNvZGluZ0hlbHBlcicpO1xuXG5jbGFzcyBVc2VySW5mbyB7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgbmV3IGluc3RhbmNlIG9mIHVzZXIgaW5mb3JtYXRpb24gY29tcG9uZW50IHBhcnNlci5cblx0ICogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYjc2VjdGlvbi0zLjIuMVxuXHQgKiBAcGFyYW0ge3N0cmluZz99IHVzZXJJbmZvU3RyaW5nIFVzZXIgaW5mb3JtYXRpb24gY29tcG9uZW50IHN0cmluZy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHVzZXJJbmZvU3RyaW5nKSB7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHVzZXIgY29tcG9uZW50LlxuXHRcdCAqIEB0eXBlIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0dGhpcy51c2VyID0gbnVsbDtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgcGFzc3dvcmQuXG5cdFx0ICogQHR5cGUge3N0cmluZ31cblx0XHQgKi9cblx0XHR0aGlzLnBhc3N3b3JkID0gbnVsbDtcblxuXHRcdGlmICh0eXBlb2YgKHVzZXJJbmZvU3RyaW5nKSA9PT0gJ3N0cmluZycgJiYgdXNlckluZm9TdHJpbmcubGVuZ3RoID4gMCkge1xuXHRcdFx0Y29uc3QgcGFydHMgPSB1c2VySW5mb1N0cmluZy5zcGxpdCgnOicpO1xuXHRcdFx0aWYgKHR5cGVvZiAocGFydHNbMF0pID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHR0aGlzLnVzZXIgPSBwZXJjZW50RW5jb2RpbmdIZWxwZXIuZGVjb2RlKHBhcnRzWzBdKTtcblx0XHRcdH1cblx0XHRcdGlmICh0eXBlb2YgKHBhcnRzWzFdKSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0dGhpcy5wYXNzd29yZCA9IHBlcmNlbnRFbmNvZGluZ0hlbHBlci5kZWNvZGUocGFydHNbMV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBDbG9uZXMgY3VycmVudCB1c2VyIGluZm9ybWF0aW9uLlxuXHQgKiBAcmV0dXJucyB7VXNlckluZm99IE5ldyBjbG9uZSBvZiBjdXJyZW50IG9iamVjdC5cblx0ICovXG5cdGNsb25lKCkge1xuXHRcdGNvbnN0IHVzZXJJbmZvID0gbmV3IFVzZXJJbmZvKCk7XG5cdFx0aWYgKHR5cGVvZiAodGhpcy51c2VyKSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHVzZXJJbmZvLnVzZXIgPSB0aGlzLnVzZXI7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgKHRoaXMucGFzc3dvcmQpID09PSAnc3RyaW5nJykge1xuXHRcdFx0dXNlckluZm8ucGFzc3dvcmQgPSB0aGlzLnBhc3N3b3JkO1xuXHRcdH1cblx0XHRyZXR1cm4gdXNlckluZm87XG5cdH1cblxuXHQvKipcblx0ICogUmVjb21iaW5lcyB1c2VyIGluZm9ybWF0aW9uIGNvbXBvbmVudHMgdG8gdXNlckluZm8gc3RyaW5nLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBVc2VyIGluZm9ybWF0aW9uIGNvbXBvbmVudCBzdHJpbmcuXG5cdCAqL1xuXHR0b1N0cmluZygpIHtcblx0XHRsZXQgcmVzdWx0ID0gJyc7XG5cdFx0aWYgKHRoaXMudXNlciAhPT0gdW5kZWZpbmVkICYmIHRoaXMudXNlciAhPT0gbnVsbCkge1xuXHRcdFx0Y29uc3QgdXNlciA9IFN0cmluZyh0aGlzLnVzZXIpO1xuXHRcdFx0cmVzdWx0ICs9IHBlcmNlbnRFbmNvZGluZ0hlbHBlclxuXHRcdFx0XHQuZW5jb2RlVXNlckluZm9TdWJDb21wb25lbnQodXNlcik7XG5cdFx0fVxuXHRcdGlmICh0aGlzLnBhc3N3b3JkICE9PSB1bmRlZmluZWQgJiYgdGhpcy5wYXNzd29yZCAhPT0gbnVsbCkge1xuXHRcdFx0Y29uc3QgcGFzc3dvcmQgPSBTdHJpbmcodGhpcy5wYXNzd29yZCk7XG5cdFx0XHRyZXN1bHQgKz0gYDoke3BlcmNlbnRFbmNvZGluZ0hlbHBlci5lbmNvZGVVc2VySW5mb1N1YkNvbXBvbmVudChwYXNzd29yZCl9YDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVXNlckluZm87XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I3NlY3Rpb24tMi4xXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHQvLyBcXHVEODAwLVxcdURCRkYgXFx1REMwMC1cXHVERkZGXG5cdC8vIHN1cnJvZ2F0ZXMgcGFpcnMgbGlrZSBlbW9qaSB3ZSBzaG91bGQgaWdub3JlXG5cdC8qKlxuXHQgKiBFbmNvZGVzIGF1dGhvcml0eSB1c2VyIGluZm9ybWF0aW9uIHN1Yi1jb21wb25lbnQgYWNjb3JkaW5nIHRvIFJGQyAzOTg2LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIENvbXBvbmVudCB0byBlbmNvZGUuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IEVuY29kZWQgY29tcG9uZW50LlxuXHQgKi9cblx0ZW5jb2RlVXNlckluZm9TdWJDb21wb25lbnQoc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKFxuXHRcdFx0Ly8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYjc2VjdGlvbi0zLjIuMVxuXHRcdFx0L1teXFx3XFwuflxcLSFcXCQmJ1xcKFxcKVxcKlxcKyw7PVxcdUQ4MDAtXFx1REJGRlxcdURDMDAtXFx1REZGRl0vZyxcblx0XHRcdGVuY29kZVVSSUNvbXBvbmVudFxuXHRcdCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEVuY29kZXMgYXV0aG9yaXR5IGhvc3QgY29tcG9uZW50IGFjY29yZGluZyB0byBSRkMgMzk4Ni5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBDb21wb25lbnQgdG8gZW5jb2RlLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBFbmNvZGVkIGNvbXBvbmVudC5cblx0ICovXG5cdGVuY29kZUhvc3Qoc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKFxuXHRcdFx0Ly8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYjc2VjdGlvbi0zLjIuMlxuXHRcdFx0L1teXFx3XFwuflxcLSFcXCQmJ1xcKFxcKVxcKlxcKyw7PTpcXFtcXF1cXHVEODAwLVxcdURCRkZcXHVEQzAwLVxcdURGRkZdL2csXG5cdFx0XHRlbmNvZGVVUklDb21wb25lbnRcblx0XHQpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBFbmNvZGVzIFVSSSBwYXRoIGNvbXBvbmVudCBhY2NvcmRpbmcgdG8gUkZDIDM5ODYuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgQ29tcG9uZW50IHRvIGVuY29kZS5cblx0ICogQHJldHVybnMge3N0cmluZ30gRW5jb2RlZCBjb21wb25lbnQuXG5cdCAqL1xuXHRlbmNvZGVQYXRoKHN0cmluZykge1xuXHRcdHJldHVybiBzdHJpbmcuc3BsaXQoLyUyZi9pKVxuXHRcdFx0Lm1hcChwYXJ0ID0+IHtcblx0XHRcdFx0cmV0dXJuIHBhcnQucmVwbGFjZShcblx0XHRcdFx0XHQvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNzZWN0aW9uLTMuM1xuXHRcdFx0XHRcdC9bXlxcd1xcLn5cXC0hXFwkJidcXChcXClcXCpcXCssOz06QFxcL1xcdUQ4MDAtXFx1REJGRlxcdURDMDAtXFx1REZGRl0vZyxcblx0XHRcdFx0XHRlbmNvZGVVUklDb21wb25lbnRcblx0XHRcdFx0KTtcblx0XHRcdH0pXG5cdFx0XHQucmVkdWNlKChwcmV2LCBjdXJyZW50KSA9PiAhcHJldiA/IGN1cnJlbnQgOiBgJHtwcmV2fSUyRiR7Y3VycmVudH1gLCAnJyk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEVuY29kZXMgcXVlcnkgc3ViLWNvbXBvbmVudCBhY2NvcmRpbmcgdG8gUkZDIDM5ODYuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgQ29tcG9uZW50IHRvIGVuY29kZS5cblx0ICogQHJldHVybnMge3N0cmluZ30gRW5jb2RlZCBjb21wb25lbnQuXG5cdCAqL1xuXHRlbmNvZGVRdWVyeVN1YkNvbXBvbmVudChzdHJpbmcpIHtcblx0XHRyZXR1cm4gc3RyaW5nLnJlcGxhY2UoXG5cdFx0XHQvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNzZWN0aW9uLTMuNFxuXHRcdFx0L1teXFx3XFwuflxcLSFcXCQnXFwoXFwpXFwqLDs6QFxcL1xcP1xcdUQ4MDAtXFx1REJGRlxcdURDMDAtXFx1REZGRl0vZyxcblx0XHRcdGVuY29kZVVSSUNvbXBvbmVudFxuXHRcdCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEVuY29kZXMgVVJJIGZyYWdtZW50IGNvbXBvbmVudCBhY2NvcmRpbmcgdG8gUkZDIDM5ODYuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgQ29tcG9uZW50IHRvIGVuY29kZS5cblx0ICogQHJldHVybnMge3N0cmluZ30gRW5jb2RlZCBjb21wb25lbnQuXG5cdCAqL1xuXHRlbmNvZGVGcmFnbWVudChzdHJpbmcpIHtcblx0XHRyZXR1cm4gc3RyaW5nLnJlcGxhY2UoXG5cdFx0XHQvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNzZWN0aW9uLTMuNVxuXHRcdFx0L1teXFx3XFwuflxcLSFcXCQmJ1xcKFxcKVxcKlxcKyw7PTpAXFwvXFw/XFx1RDgwMC1cXHVEQkZGXFx1REMwMC1cXHVERkZGXS9nLFxuXHRcdFx0ZW5jb2RlVVJJQ29tcG9uZW50XG5cdFx0KTtcblx0fSxcblxuXHQvKipcblx0ICogRGVjb2RlcyBwZXJjZW50IGVuY29kZWQgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIENvbXBvbmVudCB0byBkZWNvZGUuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IERlY29kZWQgY29tcG9uZW50LlxuXHQgKi9cblx0ZGVjb2RlKHN0cmluZykge1xuXHRcdHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyaW5nKTtcblx0fSxcblxuXHQvKipcblx0ICogRGVjb2RlcyBwZXJjZW50IGVuY29kZWQgcGF0aCBjb21wb25lbnQuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgQ29tcG9uZW50IHRvIGRlY29kZS5cblx0ICogQHJldHVybnMge3N0cmluZ30gRGVjb2RlZCBwYXRoIGNvbXBvbmVudC5cblx0ICovXG5cdGRlY29kZVBhdGgoc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHN0cmluZy5zcGxpdCgvJTJmL2kpXG5cdFx0XHQubWFwKGRlY29kZVVSSUNvbXBvbmVudClcblx0XHRcdC5yZWR1Y2UoKHByZXYsIGN1cnJlbnQpID0+ICFwcmV2ID8gY3VycmVudCA6IGAke3ByZXZ9JTJGJHtjdXJyZW50fWAsICcnKTtcblx0fVxufTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuICgnICsgZXIgKyAnKScpO1xuICAgICAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSlcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGV2bGlzdGVuZXIpXG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIid1c2Ugc3RyaWN0Jztcbi8vIENyZWF0ZSBhIHJhbmdlIG9iamVjdCBmb3IgZWZmaWNlbnRseSByZW5kZXJpbmcgc3RyaW5ncyB0byBlbGVtZW50cy5cbnZhciByYW5nZTtcblxudmFyIGRvYyA9IHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQ7XG5cbnZhciB0ZXN0RWwgPSBkb2MgP1xuICAgIGRvYy5ib2R5IHx8IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSA6XG4gICAge307XG5cbnZhciBOU19YSFRNTCA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJztcblxudmFyIEVMRU1FTlRfTk9ERSA9IDE7XG52YXIgVEVYVF9OT0RFID0gMztcbnZhciBDT01NRU5UX05PREUgPSA4O1xuXG4vLyBGaXhlcyA8aHR0cHM6Ly9naXRodWIuY29tL3BhdHJpY2stc3RlZWxlLWlkZW0vbW9ycGhkb20vaXNzdWVzLzMyPlxuLy8gKElFNysgc3VwcG9ydCkgPD1JRTcgZG9lcyBub3Qgc3VwcG9ydCBlbC5oYXNBdHRyaWJ1dGUobmFtZSlcbnZhciBoYXNBdHRyaWJ1dGVOUztcblxuaWYgKHRlc3RFbC5oYXNBdHRyaWJ1dGVOUykge1xuICAgIGhhc0F0dHJpYnV0ZU5TID0gZnVuY3Rpb24oZWwsIG5hbWVzcGFjZVVSSSwgbmFtZSkge1xuICAgICAgICByZXR1cm4gZWwuaGFzQXR0cmlidXRlTlMobmFtZXNwYWNlVVJJLCBuYW1lKTtcbiAgICB9O1xufSBlbHNlIGlmICh0ZXN0RWwuaGFzQXR0cmlidXRlKSB7XG4gICAgaGFzQXR0cmlidXRlTlMgPSBmdW5jdGlvbihlbCwgbmFtZXNwYWNlVVJJLCBuYW1lKSB7XG4gICAgICAgIHJldHVybiBlbC5oYXNBdHRyaWJ1dGUobmFtZSk7XG4gICAgfTtcbn0gZWxzZSB7XG4gICAgaGFzQXR0cmlidXRlTlMgPSBmdW5jdGlvbihlbCwgbmFtZXNwYWNlVVJJLCBuYW1lKSB7XG4gICAgICAgIHJldHVybiAhIWVsLmdldEF0dHJpYnV0ZU5vZGUobmFtZSk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gdG9FbGVtZW50KHN0cikge1xuICAgIGlmICghcmFuZ2UgJiYgZG9jLmNyZWF0ZVJhbmdlKSB7XG4gICAgICAgIHJhbmdlID0gZG9jLmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgIHJhbmdlLnNlbGVjdE5vZGUoZG9jLmJvZHkpO1xuICAgIH1cblxuICAgIHZhciBmcmFnbWVudDtcbiAgICBpZiAocmFuZ2UgJiYgcmFuZ2UuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KSB7XG4gICAgICAgIGZyYWdtZW50ID0gcmFuZ2UuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHN0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZnJhZ21lbnQgPSBkb2MuY3JlYXRlRWxlbWVudCgnYm9keScpO1xuICAgICAgICBmcmFnbWVudC5pbm5lckhUTUwgPSBzdHI7XG4gICAgfVxuICAgIHJldHVybiBmcmFnbWVudC5jaGlsZE5vZGVzWzBdO1xufVxuXG5mdW5jdGlvbiBzeW5jQm9vbGVhbkF0dHJQcm9wKGZyb21FbCwgdG9FbCwgbmFtZSkge1xuICAgIGlmIChmcm9tRWxbbmFtZV0gIT09IHRvRWxbbmFtZV0pIHtcbiAgICAgICAgZnJvbUVsW25hbWVdID0gdG9FbFtuYW1lXTtcbiAgICAgICAgaWYgKGZyb21FbFtuYW1lXSkge1xuICAgICAgICAgICAgZnJvbUVsLnNldEF0dHJpYnV0ZShuYW1lLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKG5hbWUsICcnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxudmFyIHNwZWNpYWxFbEhhbmRsZXJzID0ge1xuICAgIC8qKlxuICAgICAqIE5lZWRlZCBmb3IgSUUuIEFwcGFyZW50bHkgSUUgZG9lc24ndCB0aGluayB0aGF0IFwic2VsZWN0ZWRcIiBpcyBhblxuICAgICAqIGF0dHJpYnV0ZSB3aGVuIHJlYWRpbmcgb3ZlciB0aGUgYXR0cmlidXRlcyB1c2luZyBzZWxlY3RFbC5hdHRyaWJ1dGVzXG4gICAgICovXG4gICAgT1BUSU9OOiBmdW5jdGlvbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgc3luY0Jvb2xlYW5BdHRyUHJvcChmcm9tRWwsIHRvRWwsICdzZWxlY3RlZCcpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogVGhlIFwidmFsdWVcIiBhdHRyaWJ1dGUgaXMgc3BlY2lhbCBmb3IgdGhlIDxpbnB1dD4gZWxlbWVudCBzaW5jZSBpdCBzZXRzXG4gICAgICogdGhlIGluaXRpYWwgdmFsdWUuIENoYW5naW5nIHRoZSBcInZhbHVlXCIgYXR0cmlidXRlIHdpdGhvdXQgY2hhbmdpbmcgdGhlXG4gICAgICogXCJ2YWx1ZVwiIHByb3BlcnR5IHdpbGwgaGF2ZSBubyBlZmZlY3Qgc2luY2UgaXQgaXMgb25seSB1c2VkIHRvIHRoZSBzZXQgdGhlXG4gICAgICogaW5pdGlhbCB2YWx1ZS4gIFNpbWlsYXIgZm9yIHRoZSBcImNoZWNrZWRcIiBhdHRyaWJ1dGUsIGFuZCBcImRpc2FibGVkXCIuXG4gICAgICovXG4gICAgSU5QVVQ6IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICBzeW5jQm9vbGVhbkF0dHJQcm9wKGZyb21FbCwgdG9FbCwgJ2NoZWNrZWQnKTtcbiAgICAgICAgc3luY0Jvb2xlYW5BdHRyUHJvcChmcm9tRWwsIHRvRWwsICdkaXNhYmxlZCcpO1xuXG4gICAgICAgIGlmIChmcm9tRWwudmFsdWUgIT09IHRvRWwudmFsdWUpIHtcbiAgICAgICAgICAgIGZyb21FbC52YWx1ZSA9IHRvRWwudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhhc0F0dHJpYnV0ZU5TKHRvRWwsIG51bGwsICd2YWx1ZScpKSB7XG4gICAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKCd2YWx1ZScpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIFRFWFRBUkVBOiBmdW5jdGlvbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gdG9FbC52YWx1ZTtcbiAgICAgICAgaWYgKGZyb21FbC52YWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgIGZyb21FbC52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZyb21FbC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAvLyBOZWVkZWQgZm9yIElFLiBBcHBhcmVudGx5IElFIHNldHMgdGhlIHBsYWNlaG9sZGVyIGFzIHRoZVxuICAgICAgICAgICAgLy8gbm9kZSB2YWx1ZSBhbmQgdmlzZSB2ZXJzYS4gVGhpcyBpZ25vcmVzIGFuIGVtcHR5IHVwZGF0ZS5cbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gJycgJiYgZnJvbUVsLmZpcnN0Q2hpbGQubm9kZVZhbHVlID09PSBmcm9tRWwucGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZyb21FbC5maXJzdENoaWxkLm5vZGVWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBTRUxFQ1Q6IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICBpZiAoIWhhc0F0dHJpYnV0ZU5TKHRvRWwsIG51bGwsICdtdWx0aXBsZScpKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRJbmRleCA9IC0xO1xuICAgICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgICAgdmFyIGN1ckNoaWxkID0gdG9FbC5maXJzdENoaWxkO1xuICAgICAgICAgICAgd2hpbGUoY3VyQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZU5hbWUgPSBjdXJDaGlsZC5ub2RlTmFtZTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZU5hbWUgJiYgbm9kZU5hbWUudG9VcHBlckNhc2UoKSA9PT0gJ09QVElPTicpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhhc0F0dHJpYnV0ZU5TKGN1ckNoaWxkLCBudWxsLCAnc2VsZWN0ZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZyb21FbC5zZWxlY3RlZEluZGV4ID0gaTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0d28gbm9kZSdzIG5hbWVzIGFyZSB0aGUgc2FtZS5cbiAqXG4gKiBOT1RFOiBXZSBkb24ndCBib3RoZXIgY2hlY2tpbmcgYG5hbWVzcGFjZVVSSWAgYmVjYXVzZSB5b3Ugd2lsbCBuZXZlciBmaW5kIHR3byBIVE1MIGVsZW1lbnRzIHdpdGggdGhlIHNhbWVcbiAqICAgICAgIG5vZGVOYW1lIGFuZCBkaWZmZXJlbnQgbmFtZXNwYWNlIFVSSXMuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBhXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGIgVGhlIHRhcmdldCBlbGVtZW50XG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBjb21wYXJlTm9kZU5hbWVzKGZyb21FbCwgdG9FbCkge1xuICAgIHZhciBmcm9tTm9kZU5hbWUgPSBmcm9tRWwubm9kZU5hbWU7XG4gICAgdmFyIHRvTm9kZU5hbWUgPSB0b0VsLm5vZGVOYW1lO1xuXG4gICAgaWYgKGZyb21Ob2RlTmFtZSA9PT0gdG9Ob2RlTmFtZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodG9FbC5hY3R1YWxpemUgJiZcbiAgICAgICAgZnJvbU5vZGVOYW1lLmNoYXJDb2RlQXQoMCkgPCA5MSAmJiAvKiBmcm9tIHRhZyBuYW1lIGlzIHVwcGVyIGNhc2UgKi9cbiAgICAgICAgdG9Ob2RlTmFtZS5jaGFyQ29kZUF0KDApID4gOTAgLyogdGFyZ2V0IHRhZyBuYW1lIGlzIGxvd2VyIGNhc2UgKi8pIHtcbiAgICAgICAgLy8gSWYgdGhlIHRhcmdldCBlbGVtZW50IGlzIGEgdmlydHVhbCBET00gbm9kZSB0aGVuIHdlIG1heSBuZWVkIHRvIG5vcm1hbGl6ZSB0aGUgdGFnIG5hbWVcbiAgICAgICAgLy8gYmVmb3JlIGNvbXBhcmluZy4gTm9ybWFsIEhUTUwgZWxlbWVudHMgdGhhdCBhcmUgaW4gdGhlIFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiXG4gICAgICAgIC8vIGFyZSBjb252ZXJ0ZWQgdG8gdXBwZXIgY2FzZVxuICAgICAgICByZXR1cm4gZnJvbU5vZGVOYW1lID09PSB0b05vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYW4gZWxlbWVudCwgb3B0aW9uYWxseSB3aXRoIGEga25vd24gbmFtZXNwYWNlIFVSSS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSB0aGUgZWxlbWVudCBuYW1lLCBlLmcuICdkaXYnIG9yICdzdmcnXG4gKiBAcGFyYW0ge3N0cmluZ30gW25hbWVzcGFjZVVSSV0gdGhlIGVsZW1lbnQncyBuYW1lc3BhY2UgVVJJLCBpLmUuIHRoZSB2YWx1ZSBvZlxuICogaXRzIGB4bWxuc2AgYXR0cmlidXRlIG9yIGl0cyBpbmZlcnJlZCBuYW1lc3BhY2UuXG4gKlxuICogQHJldHVybiB7RWxlbWVudH1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlRWxlbWVudE5TKG5hbWUsIG5hbWVzcGFjZVVSSSkge1xuICAgIHJldHVybiAhbmFtZXNwYWNlVVJJIHx8IG5hbWVzcGFjZVVSSSA9PT0gTlNfWEhUTUwgP1xuICAgICAgICBkb2MuY3JlYXRlRWxlbWVudChuYW1lKSA6XG4gICAgICAgIGRvYy5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJLCBuYW1lKTtcbn1cblxuLyoqXG4gKiBMb29wIG92ZXIgYWxsIG9mIHRoZSBhdHRyaWJ1dGVzIG9uIHRoZSB0YXJnZXQgbm9kZSBhbmQgbWFrZSBzdXJlIHRoZSBvcmlnaW5hbFxuICogRE9NIG5vZGUgaGFzIHRoZSBzYW1lIGF0dHJpYnV0ZXMuIElmIGFuIGF0dHJpYnV0ZSBmb3VuZCBvbiB0aGUgb3JpZ2luYWwgbm9kZVxuICogaXMgbm90IG9uIHRoZSBuZXcgbm9kZSB0aGVuIHJlbW92ZSBpdCBmcm9tIHRoZSBvcmlnaW5hbCBub2RlLlxuICpcbiAqIEBwYXJhbSAge0VsZW1lbnR9IGZyb21Ob2RlXG4gKiBAcGFyYW0gIHtFbGVtZW50fSB0b05vZGVcbiAqL1xuZnVuY3Rpb24gbW9ycGhBdHRycyhmcm9tTm9kZSwgdG9Ob2RlKSB7XG4gICAgaWYgKHRvTm9kZS5hc3NpZ25BdHRyaWJ1dGVzKSB7XG4gICAgICAgIHRvTm9kZS5hc3NpZ25BdHRyaWJ1dGVzKGZyb21Ob2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgYXR0cnMgPSB0b05vZGUuYXR0cmlidXRlcztcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBhdHRyO1xuICAgICAgICB2YXIgYXR0ck5hbWU7XG4gICAgICAgIHZhciBhdHRyTmFtZXNwYWNlVVJJO1xuICAgICAgICB2YXIgYXR0clZhbHVlO1xuICAgICAgICB2YXIgZnJvbVZhbHVlO1xuXG4gICAgICAgIGZvciAoaSA9IGF0dHJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICBhdHRyID0gYXR0cnNbaV07XG4gICAgICAgICAgICBhdHRyTmFtZSA9IGF0dHIubmFtZTtcbiAgICAgICAgICAgIGF0dHJOYW1lc3BhY2VVUkkgPSBhdHRyLm5hbWVzcGFjZVVSSTtcbiAgICAgICAgICAgIGF0dHJWYWx1ZSA9IGF0dHIudmFsdWU7XG5cbiAgICAgICAgICAgIGlmIChhdHRyTmFtZXNwYWNlVVJJKSB7XG4gICAgICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRyLmxvY2FsTmFtZSB8fCBhdHRyTmFtZTtcbiAgICAgICAgICAgICAgICBmcm9tVmFsdWUgPSBmcm9tTm9kZS5nZXRBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZnJvbVZhbHVlICE9PSBhdHRyVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbU5vZGUuc2V0QXR0cmlidXRlTlMoYXR0ck5hbWVzcGFjZVVSSSwgYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmcm9tVmFsdWUgPSBmcm9tTm9kZS5nZXRBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZyb21WYWx1ZSAhPT0gYXR0clZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyb21Ob2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW1vdmUgYW55IGV4dHJhIGF0dHJpYnV0ZXMgZm91bmQgb24gdGhlIG9yaWdpbmFsIERPTSBlbGVtZW50IHRoYXRcbiAgICAgICAgLy8gd2VyZW4ndCBmb3VuZCBvbiB0aGUgdGFyZ2V0IGVsZW1lbnQuXG4gICAgICAgIGF0dHJzID0gZnJvbU5vZGUuYXR0cmlidXRlcztcblxuICAgICAgICBmb3IgKGkgPSBhdHRycy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICAgICAgYXR0ciA9IGF0dHJzW2ldO1xuICAgICAgICAgICAgaWYgKGF0dHIuc3BlY2lmaWVkICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGF0dHJOYW1lID0gYXR0ci5uYW1lO1xuICAgICAgICAgICAgICAgIGF0dHJOYW1lc3BhY2VVUkkgPSBhdHRyLm5hbWVzcGFjZVVSSTtcblxuICAgICAgICAgICAgICAgIGlmIChhdHRyTmFtZXNwYWNlVVJJKSB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJOYW1lID0gYXR0ci5sb2NhbE5hbWUgfHwgYXR0ck5hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFoYXNBdHRyaWJ1dGVOUyh0b05vZGUsIGF0dHJOYW1lc3BhY2VVUkksIGF0dHJOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbU5vZGUucmVtb3ZlQXR0cmlidXRlTlMoYXR0ck5hbWVzcGFjZVVSSSwgYXR0ck5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFoYXNBdHRyaWJ1dGVOUyh0b05vZGUsIG51bGwsIGF0dHJOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbU5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBDb3BpZXMgdGhlIGNoaWxkcmVuIG9mIG9uZSBET00gZWxlbWVudCB0byBhbm90aGVyIERPTSBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIG1vdmVDaGlsZHJlbihmcm9tRWwsIHRvRWwpIHtcbiAgICB2YXIgY3VyQ2hpbGQgPSBmcm9tRWwuZmlyc3RDaGlsZDtcbiAgICB3aGlsZSAoY3VyQ2hpbGQpIHtcbiAgICAgICAgdmFyIG5leHRDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICB0b0VsLmFwcGVuZENoaWxkKGN1ckNoaWxkKTtcbiAgICAgICAgY3VyQ2hpbGQgPSBuZXh0Q2hpbGQ7XG4gICAgfVxuICAgIHJldHVybiB0b0VsO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0R2V0Tm9kZUtleShub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuaWQ7XG59XG5cbmZ1bmN0aW9uIG1vcnBoZG9tKGZyb21Ob2RlLCB0b05vZGUsIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdG9Ob2RlID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAoZnJvbU5vZGUubm9kZU5hbWUgPT09ICcjZG9jdW1lbnQnIHx8IGZyb21Ob2RlLm5vZGVOYW1lID09PSAnSFRNTCcpIHtcbiAgICAgICAgICAgIHZhciB0b05vZGVIdG1sID0gdG9Ob2RlO1xuICAgICAgICAgICAgdG9Ob2RlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2h0bWwnKTtcbiAgICAgICAgICAgIHRvTm9kZS5pbm5lckhUTUwgPSB0b05vZGVIdG1sO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9Ob2RlID0gdG9FbGVtZW50KHRvTm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZ2V0Tm9kZUtleSA9IG9wdGlvbnMuZ2V0Tm9kZUtleSB8fCBkZWZhdWx0R2V0Tm9kZUtleTtcbiAgICB2YXIgb25CZWZvcmVOb2RlQWRkZWQgPSBvcHRpb25zLm9uQmVmb3JlTm9kZUFkZGVkIHx8IG5vb3A7XG4gICAgdmFyIG9uTm9kZUFkZGVkID0gb3B0aW9ucy5vbk5vZGVBZGRlZCB8fCBub29wO1xuICAgIHZhciBvbkJlZm9yZUVsVXBkYXRlZCA9IG9wdGlvbnMub25CZWZvcmVFbFVwZGF0ZWQgfHwgbm9vcDtcbiAgICB2YXIgb25FbFVwZGF0ZWQgPSBvcHRpb25zLm9uRWxVcGRhdGVkIHx8IG5vb3A7XG4gICAgdmFyIG9uQmVmb3JlTm9kZURpc2NhcmRlZCA9IG9wdGlvbnMub25CZWZvcmVOb2RlRGlzY2FyZGVkIHx8IG5vb3A7XG4gICAgdmFyIG9uTm9kZURpc2NhcmRlZCA9IG9wdGlvbnMub25Ob2RlRGlzY2FyZGVkIHx8IG5vb3A7XG4gICAgdmFyIG9uQmVmb3JlRWxDaGlsZHJlblVwZGF0ZWQgPSBvcHRpb25zLm9uQmVmb3JlRWxDaGlsZHJlblVwZGF0ZWQgfHwgbm9vcDtcbiAgICB2YXIgY2hpbGRyZW5Pbmx5ID0gb3B0aW9ucy5jaGlsZHJlbk9ubHkgPT09IHRydWU7XG5cbiAgICAvLyBUaGlzIG9iamVjdCBpcyB1c2VkIGFzIGEgbG9va3VwIHRvIHF1aWNrbHkgZmluZCBhbGwga2V5ZWQgZWxlbWVudHMgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlLlxuICAgIHZhciBmcm9tTm9kZXNMb29rdXAgPSB7fTtcbiAgICB2YXIga2V5ZWRSZW1vdmFsTGlzdDtcblxuICAgIGZ1bmN0aW9uIGFkZEtleWVkUmVtb3ZhbChrZXkpIHtcbiAgICAgICAgaWYgKGtleWVkUmVtb3ZhbExpc3QpIHtcbiAgICAgICAgICAgIGtleWVkUmVtb3ZhbExpc3QucHVzaChrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAga2V5ZWRSZW1vdmFsTGlzdCA9IFtrZXldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2Fsa0Rpc2NhcmRlZENoaWxkTm9kZXMobm9kZSwgc2tpcEtleWVkTm9kZXMpIHtcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgdmFyIGN1ckNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuICAgICAgICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNraXBLZXllZE5vZGVzICYmIChrZXkgPSBnZXROb2RlS2V5KGN1ckNoaWxkKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgd2UgYXJlIHNraXBwaW5nIGtleWVkIG5vZGVzIHRoZW4gd2UgYWRkIHRoZSBrZXlcbiAgICAgICAgICAgICAgICAgICAgLy8gdG8gYSBsaXN0IHNvIHRoYXQgaXQgY2FuIGJlIGhhbmRsZWQgYXQgdGhlIHZlcnkgZW5kLlxuICAgICAgICAgICAgICAgICAgICBhZGRLZXllZFJlbW92YWwoa2V5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IHJlcG9ydCB0aGUgbm9kZSBhcyBkaXNjYXJkZWQgaWYgaXQgaXMgbm90IGtleWVkLiBXZSBkbyB0aGlzIGJlY2F1c2VcbiAgICAgICAgICAgICAgICAgICAgLy8gYXQgdGhlIGVuZCB3ZSBsb29wIHRocm91Z2ggYWxsIGtleWVkIGVsZW1lbnRzIHRoYXQgd2VyZSB1bm1hdGNoZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gYW5kIHRoZW4gZGlzY2FyZCB0aGVtIGluIG9uZSBmaW5hbCBwYXNzLlxuICAgICAgICAgICAgICAgICAgICBvbk5vZGVEaXNjYXJkZWQoY3VyQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyQ2hpbGQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2Fsa0Rpc2NhcmRlZENoaWxkTm9kZXMoY3VyQ2hpbGQsIHNraXBLZXllZE5vZGVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgRE9NIG5vZGUgb3V0IG9mIHRoZSBvcmlnaW5hbCBET01cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge05vZGV9IG5vZGUgVGhlIG5vZGUgdG8gcmVtb3ZlXG4gICAgICogQHBhcmFtICB7Tm9kZX0gcGFyZW50Tm9kZSBUaGUgbm9kZXMgcGFyZW50XG4gICAgICogQHBhcmFtICB7Qm9vbGVhbn0gc2tpcEtleWVkTm9kZXMgSWYgdHJ1ZSB0aGVuIGVsZW1lbnRzIHdpdGgga2V5cyB3aWxsIGJlIHNraXBwZWQgYW5kIG5vdCBkaXNjYXJkZWQuXG4gICAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlbW92ZU5vZGUobm9kZSwgcGFyZW50Tm9kZSwgc2tpcEtleWVkTm9kZXMpIHtcbiAgICAgICAgaWYgKG9uQmVmb3JlTm9kZURpc2NhcmRlZChub2RlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgb25Ob2RlRGlzY2FyZGVkKG5vZGUpO1xuICAgICAgICB3YWxrRGlzY2FyZGVkQ2hpbGROb2Rlcyhub2RlLCBza2lwS2V5ZWROb2Rlcyk7XG4gICAgfVxuXG4gICAgLy8gLy8gVHJlZVdhbGtlciBpbXBsZW1lbnRhdGlvbiBpcyBubyBmYXN0ZXIsIGJ1dCBrZWVwaW5nIHRoaXMgYXJvdW5kIGluIGNhc2UgdGhpcyBjaGFuZ2VzIGluIHRoZSBmdXR1cmVcbiAgICAvLyBmdW5jdGlvbiBpbmRleFRyZWUocm9vdCkge1xuICAgIC8vICAgICB2YXIgdHJlZVdhbGtlciA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIoXG4gICAgLy8gICAgICAgICByb290LFxuICAgIC8vICAgICAgICAgTm9kZUZpbHRlci5TSE9XX0VMRU1FTlQpO1xuICAgIC8vXG4gICAgLy8gICAgIHZhciBlbDtcbiAgICAvLyAgICAgd2hpbGUoKGVsID0gdHJlZVdhbGtlci5uZXh0Tm9kZSgpKSkge1xuICAgIC8vICAgICAgICAgdmFyIGtleSA9IGdldE5vZGVLZXkoZWwpO1xuICAgIC8vICAgICAgICAgaWYgKGtleSkge1xuICAgIC8vICAgICAgICAgICAgIGZyb21Ob2Rlc0xvb2t1cFtrZXldID0gZWw7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG5cbiAgICAvLyAvLyBOb2RlSXRlcmF0b3IgaW1wbGVtZW50YXRpb24gaXMgbm8gZmFzdGVyLCBidXQga2VlcGluZyB0aGlzIGFyb3VuZCBpbiBjYXNlIHRoaXMgY2hhbmdlcyBpbiB0aGUgZnV0dXJlXG4gICAgLy9cbiAgICAvLyBmdW5jdGlvbiBpbmRleFRyZWUobm9kZSkge1xuICAgIC8vICAgICB2YXIgbm9kZUl0ZXJhdG9yID0gZG9jdW1lbnQuY3JlYXRlTm9kZUl0ZXJhdG9yKG5vZGUsIE5vZGVGaWx0ZXIuU0hPV19FTEVNRU5UKTtcbiAgICAvLyAgICAgdmFyIGVsO1xuICAgIC8vICAgICB3aGlsZSgoZWwgPSBub2RlSXRlcmF0b3IubmV4dE5vZGUoKSkpIHtcbiAgICAvLyAgICAgICAgIHZhciBrZXkgPSBnZXROb2RlS2V5KGVsKTtcbiAgICAvLyAgICAgICAgIGlmIChrZXkpIHtcbiAgICAvLyAgICAgICAgICAgICBmcm9tTm9kZXNMb29rdXBba2V5XSA9IGVsO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgZnVuY3Rpb24gaW5kZXhUcmVlKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgdmFyIGN1ckNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuICAgICAgICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGdldE5vZGVLZXkoY3VyQ2hpbGQpO1xuICAgICAgICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbU5vZGVzTG9va3VwW2tleV0gPSBjdXJDaGlsZDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBXYWxrIHJlY3Vyc2l2ZWx5XG4gICAgICAgICAgICAgICAgaW5kZXhUcmVlKGN1ckNoaWxkKTtcblxuICAgICAgICAgICAgICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbmRleFRyZWUoZnJvbU5vZGUpO1xuXG4gICAgZnVuY3Rpb24gaGFuZGxlTm9kZUFkZGVkKGVsKSB7XG4gICAgICAgIG9uTm9kZUFkZGVkKGVsKTtcblxuICAgICAgICB2YXIgY3VyQ2hpbGQgPSBlbC5maXJzdENoaWxkO1xuICAgICAgICB3aGlsZSAoY3VyQ2hpbGQpIHtcbiAgICAgICAgICAgIHZhciBuZXh0U2libGluZyA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuXG4gICAgICAgICAgICB2YXIga2V5ID0gZ2V0Tm9kZUtleShjdXJDaGlsZCk7XG4gICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgdmFyIHVubWF0Y2hlZEZyb21FbCA9IGZyb21Ob2Rlc0xvb2t1cFtrZXldO1xuICAgICAgICAgICAgICAgIGlmICh1bm1hdGNoZWRGcm9tRWwgJiYgY29tcGFyZU5vZGVOYW1lcyhjdXJDaGlsZCwgdW5tYXRjaGVkRnJvbUVsKSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZCh1bm1hdGNoZWRGcm9tRWwsIGN1ckNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgbW9ycGhFbCh1bm1hdGNoZWRGcm9tRWwsIGN1ckNoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGhhbmRsZU5vZGVBZGRlZChjdXJDaGlsZCk7XG4gICAgICAgICAgICBjdXJDaGlsZCA9IG5leHRTaWJsaW5nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9ycGhFbChmcm9tRWwsIHRvRWwsIGNoaWxkcmVuT25seSkge1xuICAgICAgICB2YXIgdG9FbEtleSA9IGdldE5vZGVLZXkodG9FbCk7XG4gICAgICAgIHZhciBjdXJGcm9tTm9kZUtleTtcblxuICAgICAgICBpZiAodG9FbEtleSkge1xuICAgICAgICAgICAgLy8gSWYgYW4gZWxlbWVudCB3aXRoIGFuIElEIGlzIGJlaW5nIG1vcnBoZWQgdGhlbiBpdCBpcyB3aWxsIGJlIGluIHRoZSBmaW5hbFxuICAgICAgICAgICAgLy8gRE9NIHNvIGNsZWFyIGl0IG91dCBvZiB0aGUgc2F2ZWQgZWxlbWVudHMgY29sbGVjdGlvblxuICAgICAgICAgICAgZGVsZXRlIGZyb21Ob2Rlc0xvb2t1cFt0b0VsS2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b05vZGUuaXNTYW1lTm9kZSAmJiB0b05vZGUuaXNTYW1lTm9kZShmcm9tTm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY2hpbGRyZW5Pbmx5KSB7XG4gICAgICAgICAgICBpZiAob25CZWZvcmVFbFVwZGF0ZWQoZnJvbUVsLCB0b0VsKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1vcnBoQXR0cnMoZnJvbUVsLCB0b0VsKTtcbiAgICAgICAgICAgIG9uRWxVcGRhdGVkKGZyb21FbCk7XG5cbiAgICAgICAgICAgIGlmIChvbkJlZm9yZUVsQ2hpbGRyZW5VcGRhdGVkKGZyb21FbCwgdG9FbCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZyb21FbC5ub2RlTmFtZSAhPT0gJ1RFWFRBUkVBJykge1xuICAgICAgICAgICAgdmFyIGN1clRvTm9kZUNoaWxkID0gdG9FbC5maXJzdENoaWxkO1xuICAgICAgICAgICAgdmFyIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tRWwuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIHZhciBjdXJUb05vZGVLZXk7XG5cbiAgICAgICAgICAgIHZhciBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB2YXIgdG9OZXh0U2libGluZztcbiAgICAgICAgICAgIHZhciBtYXRjaGluZ0Zyb21FbDtcblxuICAgICAgICAgICAgb3V0ZXI6IHdoaWxlIChjdXJUb05vZGVDaGlsZCkge1xuICAgICAgICAgICAgICAgIHRvTmV4dFNpYmxpbmcgPSBjdXJUb05vZGVDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICBjdXJUb05vZGVLZXkgPSBnZXROb2RlS2V5KGN1clRvTm9kZUNoaWxkKTtcblxuICAgICAgICAgICAgICAgIHdoaWxlIChjdXJGcm9tTm9kZUNoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUNoaWxkLmlzU2FtZU5vZGUgJiYgY3VyVG9Ob2RlQ2hpbGQuaXNTYW1lTm9kZShjdXJGcm9tTm9kZUNoaWxkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVLZXkgPSBnZXROb2RlS2V5KGN1ckZyb21Ob2RlQ2hpbGQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJGcm9tTm9kZVR5cGUgPSBjdXJGcm9tTm9kZUNoaWxkLm5vZGVUeXBlO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBpc0NvbXBhdGlibGUgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlVHlwZSA9PT0gY3VyVG9Ob2RlQ2hpbGQubm9kZVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJvdGggbm9kZXMgYmVpbmcgY29tcGFyZWQgYXJlIEVsZW1lbnQgbm9kZXNcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJUb05vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIHRhcmdldCBub2RlIGhhcyBhIGtleSBzbyB3ZSB3YW50IHRvIG1hdGNoIGl0IHVwIHdpdGggdGhlIGNvcnJlY3QgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbiB0aGUgb3JpZ2luYWwgRE9NIHRyZWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUtleSAhPT0gY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBjdXJyZW50IGVsZW1lbnQgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlIGRvZXMgbm90IGhhdmUgYSBtYXRjaGluZyBrZXkgc29cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxldCdzIGNoZWNrIG91ciBsb29rdXAgdG8gc2VlIGlmIHRoZXJlIGlzIGEgbWF0Y2hpbmcgZWxlbWVudCBpbiB0aGUgb3JpZ2luYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERPTSB0cmVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKG1hdGNoaW5nRnJvbUVsID0gZnJvbU5vZGVzTG9va3VwW2N1clRvTm9kZUtleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlQ2hpbGQubmV4dFNpYmxpbmcgPT09IG1hdGNoaW5nRnJvbUVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNwZWNpYWwgY2FzZSBmb3Igc2luZ2xlIGVsZW1lbnQgcmVtb3ZhbHMuIFRvIGF2b2lkIHJlbW92aW5nIHRoZSBvcmlnaW5hbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBET00gbm9kZSBvdXQgb2YgdGhlIHRyZWUgKHNpbmNlIHRoYXQgY2FuIGJyZWFrIENTUyB0cmFuc2l0aW9ucywgZXRjLiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIHdpbGwgaW5zdGVhZCBkaXNjYXJkIHRoZSBjdXJyZW50IG5vZGUgYW5kIHdhaXQgdW50aWwgdGhlIG5leHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXRlcmF0aW9uIHRvIHByb3Blcmx5IG1hdGNoIHVwIHRoZSBrZXllZCB0YXJnZXQgZWxlbWVudCB3aXRoIGl0cyBtYXRjaGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlbGVtZW50IGluIHRoZSBvcmlnaW5hbCB0cmVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGZvdW5kIGEgbWF0Y2hpbmcga2V5ZWQgZWxlbWVudCBzb21ld2hlcmUgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMZXQncyBtb3ZpbmcgdGhlIG9yaWdpbmFsIERPTSBub2RlIGludG8gdGhlIGN1cnJlbnQgcG9zaXRpb24gYW5kIG1vcnBoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0LlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IFdlIHVzZSBpbnNlcnRCZWZvcmUgaW5zdGVhZCBvZiByZXBsYWNlQ2hpbGQgYmVjYXVzZSB3ZSB3YW50IHRvIGdvIHRocm91Z2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGByZW1vdmVOb2RlKClgIGZ1bmN0aW9uIGZvciB0aGUgbm9kZSB0aGF0IGlzIGJlaW5nIGRpc2NhcmRlZCBzbyB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsbCBsaWZlY3ljbGUgaG9va3MgYXJlIGNvcnJlY3RseSBpbnZva2VkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21FbC5pbnNlcnRCZWZvcmUobWF0Y2hpbmdGcm9tRWwsIGN1ckZyb21Ob2RlQ2hpbGQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaW5jZSB0aGUgbm9kZSBpcyBrZXllZCBpdCBtaWdodCBiZSBtYXRjaGVkIHVwIGxhdGVyIHNvIHdlIGRlZmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgYWN0dWFsIHJlbW92YWwgdG8gbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiB3ZSBza2lwIG5lc3RlZCBrZXllZCBub2RlcyBmcm9tIGJlaW5nIHJlbW92ZWQgc2luY2UgdGhlcmUgaXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgIHN0aWxsIGEgY2hhbmNlIHRoZXkgd2lsbCBiZSBtYXRjaGVkIHVwIGxhdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21FbCwgdHJ1ZSAvKiBza2lwIGtleWVkIG5vZGVzICovKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBtYXRjaGluZ0Zyb21FbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBub2RlcyBhcmUgbm90IGNvbXBhdGlibGUgc2luY2UgdGhlIFwidG9cIiBub2RlIGhhcyBhIGtleSBhbmQgdGhlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpcyBubyBtYXRjaGluZyBrZXllZCBub2RlIGluIHRoZSBzb3VyY2UgdHJlZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJGcm9tTm9kZUtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgb3JpZ2luYWwgaGFzIGEga2V5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGlzQ29tcGF0aWJsZSAhPT0gZmFsc2UgJiYgY29tcGFyZU5vZGVOYW1lcyhjdXJGcm9tTm9kZUNoaWxkLCBjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQ29tcGF0aWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBmb3VuZCBjb21wYXRpYmxlIERPTSBlbGVtZW50cyBzbyB0cmFuc2Zvcm1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGN1cnJlbnQgXCJmcm9tXCIgbm9kZSB0byBtYXRjaCB0aGUgY3VycmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0YXJnZXQgRE9NIG5vZGUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vcnBoRWwoY3VyRnJvbU5vZGVDaGlsZCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJGcm9tTm9kZVR5cGUgPT09IFRFWFRfTk9ERSB8fCBjdXJGcm9tTm9kZVR5cGUgPT0gQ09NTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQm90aCBub2RlcyBiZWluZyBjb21wYXJlZCBhcmUgVGV4dCBvciBDb21tZW50IG5vZGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaW1wbHkgdXBkYXRlIG5vZGVWYWx1ZSBvbiB0aGUgb3JpZ2luYWwgbm9kZSB0b1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoYW5nZSB0aGUgdGV4dCB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQubm9kZVZhbHVlID0gY3VyVG9Ob2RlQ2hpbGQubm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQ29tcGF0aWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWR2YW5jZSBib3RoIHRoZSBcInRvXCIgY2hpbGQgYW5kIHRoZSBcImZyb21cIiBjaGlsZCBzaW5jZSB3ZSBmb3VuZCBhIG1hdGNoXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWUgb3V0ZXI7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBObyBjb21wYXRpYmxlIG1hdGNoIHNvIHJlbW92ZSB0aGUgb2xkIG5vZGUgZnJvbSB0aGUgRE9NIGFuZCBjb250aW51ZSB0cnlpbmcgdG8gZmluZCBhXG4gICAgICAgICAgICAgICAgICAgIC8vIG1hdGNoIGluIHRoZSBvcmlnaW5hbCBET00uIEhvd2V2ZXIsIHdlIG9ubHkgZG8gdGhpcyBpZiB0aGUgZnJvbSBub2RlIGlzIG5vdCBrZXllZFxuICAgICAgICAgICAgICAgICAgICAvLyBzaW5jZSBpdCBpcyBwb3NzaWJsZSB0aGF0IGEga2V5ZWQgbm9kZSBtaWdodCBtYXRjaCB1cCB3aXRoIGEgbm9kZSBzb21ld2hlcmUgZWxzZSBpbiB0aGVcbiAgICAgICAgICAgICAgICAgICAgLy8gdGFyZ2V0IHRyZWUgYW5kIHdlIGRvbid0IHdhbnQgdG8gZGlzY2FyZCBpdCBqdXN0IHlldCBzaW5jZSBpdCBzdGlsbCBtaWdodCBmaW5kIGFcbiAgICAgICAgICAgICAgICAgICAgLy8gaG9tZSBpbiB0aGUgZmluYWwgRE9NIHRyZWUuIEFmdGVyIGV2ZXJ5dGhpbmcgaXMgZG9uZSB3ZSB3aWxsIHJlbW92ZSBhbnkga2V5ZWQgbm9kZXNcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhhdCBkaWRuJ3QgZmluZCBhIGhvbWVcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTaW5jZSB0aGUgbm9kZSBpcyBrZXllZCBpdCBtaWdodCBiZSBtYXRjaGVkIHVwIGxhdGVyIHNvIHdlIGRlZmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgYWN0dWFsIHJlbW92YWwgdG8gbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiB3ZSBza2lwIG5lc3RlZCBrZXllZCBub2RlcyBmcm9tIGJlaW5nIHJlbW92ZWQgc2luY2UgdGhlcmUgaXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgIHN0aWxsIGEgY2hhbmNlIHRoZXkgd2lsbCBiZSBtYXRjaGVkIHVwIGxhdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21FbCwgdHJ1ZSAvKiBza2lwIGtleWVkIG5vZGVzICovKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSWYgd2UgZ290IHRoaXMgZmFyIHRoZW4gd2UgZGlkIG5vdCBmaW5kIGEgY2FuZGlkYXRlIG1hdGNoIGZvclxuICAgICAgICAgICAgICAgIC8vIG91ciBcInRvIG5vZGVcIiBhbmQgd2UgZXhoYXVzdGVkIGFsbCBvZiB0aGUgY2hpbGRyZW4gXCJmcm9tXCJcbiAgICAgICAgICAgICAgICAvLyBub2Rlcy4gVGhlcmVmb3JlLCB3ZSB3aWxsIGp1c3QgYXBwZW5kIHRoZSBjdXJyZW50IFwidG9cIiBub2RlXG4gICAgICAgICAgICAgICAgLy8gdG8gdGhlIGVuZFxuICAgICAgICAgICAgICAgIGlmIChjdXJUb05vZGVLZXkgJiYgKG1hdGNoaW5nRnJvbUVsID0gZnJvbU5vZGVzTG9va3VwW2N1clRvTm9kZUtleV0pICYmIGNvbXBhcmVOb2RlTmFtZXMobWF0Y2hpbmdGcm9tRWwsIGN1clRvTm9kZUNoaWxkKSkge1xuICAgICAgICAgICAgICAgICAgICBmcm9tRWwuYXBwZW5kQ2hpbGQobWF0Y2hpbmdGcm9tRWwpO1xuICAgICAgICAgICAgICAgICAgICBtb3JwaEVsKG1hdGNoaW5nRnJvbUVsLCBjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9uQmVmb3JlTm9kZUFkZGVkUmVzdWx0ID0gb25CZWZvcmVOb2RlQWRkZWQoY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob25CZWZvcmVOb2RlQWRkZWRSZXN1bHQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob25CZWZvcmVOb2RlQWRkZWRSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IG9uQmVmb3JlTm9kZUFkZGVkUmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyVG9Ob2RlQ2hpbGQuYWN0dWFsaXplKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSBjdXJUb05vZGVDaGlsZC5hY3R1YWxpemUoZnJvbUVsLm93bmVyRG9jdW1lbnQgfHwgZG9jKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb21FbC5hcHBlbmRDaGlsZChjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVOb2RlQWRkZWQoY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFdlIGhhdmUgcHJvY2Vzc2VkIGFsbCBvZiB0aGUgXCJ0byBub2Rlc1wiLiBJZiBjdXJGcm9tTm9kZUNoaWxkIGlzXG4gICAgICAgICAgICAvLyBub24tbnVsbCB0aGVuIHdlIHN0aWxsIGhhdmUgc29tZSBmcm9tIG5vZGVzIGxlZnQgb3ZlciB0aGF0IG5lZWRcbiAgICAgICAgICAgIC8vIHRvIGJlIHJlbW92ZWRcbiAgICAgICAgICAgIHdoaWxlIChjdXJGcm9tTm9kZUNoaWxkKSB7XG4gICAgICAgICAgICAgICAgZnJvbU5leHRTaWJsaW5nID0gY3VyRnJvbU5vZGVDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICBpZiAoKGN1ckZyb21Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJGcm9tTm9kZUNoaWxkKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2luY2UgdGhlIG5vZGUgaXMga2V5ZWQgaXQgbWlnaHQgYmUgbWF0Y2hlZCB1cCBsYXRlciBzbyB3ZSBkZWZlclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgYWN0dWFsIHJlbW92YWwgdG8gbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgYWRkS2V5ZWRSZW1vdmFsKGN1ckZyb21Ob2RlS2V5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiB3ZSBza2lwIG5lc3RlZCBrZXllZCBub2RlcyBmcm9tIGJlaW5nIHJlbW92ZWQgc2luY2UgdGhlcmUgaXNcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgc3RpbGwgYSBjaGFuY2UgdGhleSB3aWxsIGJlIG1hdGNoZWQgdXAgbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tRWwsIHRydWUgLyogc2tpcCBrZXllZCBub2RlcyAqLyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3BlY2lhbEVsSGFuZGxlciA9IHNwZWNpYWxFbEhhbmRsZXJzW2Zyb21FbC5ub2RlTmFtZV07XG4gICAgICAgIGlmIChzcGVjaWFsRWxIYW5kbGVyKSB7XG4gICAgICAgICAgICBzcGVjaWFsRWxIYW5kbGVyKGZyb21FbCwgdG9FbCk7XG4gICAgICAgIH1cbiAgICB9IC8vIEVORDogbW9ycGhFbCguLi4pXG5cbiAgICB2YXIgbW9ycGhlZE5vZGUgPSBmcm9tTm9kZTtcbiAgICB2YXIgbW9ycGhlZE5vZGVUeXBlID0gbW9ycGhlZE5vZGUubm9kZVR5cGU7XG4gICAgdmFyIHRvTm9kZVR5cGUgPSB0b05vZGUubm9kZVR5cGU7XG5cbiAgICBpZiAoIWNoaWxkcmVuT25seSkge1xuICAgICAgICAvLyBIYW5kbGUgdGhlIGNhc2Ugd2hlcmUgd2UgYXJlIGdpdmVuIHR3byBET00gbm9kZXMgdGhhdCBhcmUgbm90XG4gICAgICAgIC8vIGNvbXBhdGlibGUgKGUuZy4gPGRpdj4gLS0+IDxzcGFuPiBvciA8ZGl2PiAtLT4gVEVYVClcbiAgICAgICAgaWYgKG1vcnBoZWROb2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICBpZiAodG9Ob2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjb21wYXJlTm9kZU5hbWVzKGZyb21Ob2RlLCB0b05vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChmcm9tTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIG1vcnBoZWROb2RlID0gbW92ZUNoaWxkcmVuKGZyb21Ob2RlLCBjcmVhdGVFbGVtZW50TlModG9Ob2RlLm5vZGVOYW1lLCB0b05vZGUubmFtZXNwYWNlVVJJKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBHb2luZyBmcm9tIGFuIGVsZW1lbnQgbm9kZSB0byBhIHRleHQgbm9kZVxuICAgICAgICAgICAgICAgIG1vcnBoZWROb2RlID0gdG9Ob2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1vcnBoZWROb2RlVHlwZSA9PT0gVEVYVF9OT0RFIHx8IG1vcnBoZWROb2RlVHlwZSA9PT0gQ09NTUVOVF9OT0RFKSB7IC8vIFRleHQgb3IgY29tbWVudCBub2RlXG4gICAgICAgICAgICBpZiAodG9Ob2RlVHlwZSA9PT0gbW9ycGhlZE5vZGVUeXBlKSB7XG4gICAgICAgICAgICAgICAgbW9ycGhlZE5vZGUubm9kZVZhbHVlID0gdG9Ob2RlLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9ycGhlZE5vZGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFRleHQgbm9kZSB0byBzb21ldGhpbmcgZWxzZVxuICAgICAgICAgICAgICAgIG1vcnBoZWROb2RlID0gdG9Ob2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1vcnBoZWROb2RlID09PSB0b05vZGUpIHtcbiAgICAgICAgLy8gVGhlIFwidG8gbm9kZVwiIHdhcyBub3QgY29tcGF0aWJsZSB3aXRoIHRoZSBcImZyb20gbm9kZVwiIHNvIHdlIGhhZCB0b1xuICAgICAgICAvLyB0b3NzIG91dCB0aGUgXCJmcm9tIG5vZGVcIiBhbmQgdXNlIHRoZSBcInRvIG5vZGVcIlxuICAgICAgICBvbk5vZGVEaXNjYXJkZWQoZnJvbU5vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG1vcnBoRWwobW9ycGhlZE5vZGUsIHRvTm9kZSwgY2hpbGRyZW5Pbmx5KTtcblxuICAgICAgICAvLyBXZSBub3cgbmVlZCB0byBsb29wIG92ZXIgYW55IGtleWVkIG5vZGVzIHRoYXQgbWlnaHQgbmVlZCB0byBiZVxuICAgICAgICAvLyByZW1vdmVkLiBXZSBvbmx5IGRvIHRoZSByZW1vdmFsIGlmIHdlIGtub3cgdGhhdCB0aGUga2V5ZWQgbm9kZVxuICAgICAgICAvLyBuZXZlciBmb3VuZCBhIG1hdGNoLiBXaGVuIGEga2V5ZWQgbm9kZSBpcyBtYXRjaGVkIHVwIHdlIHJlbW92ZVxuICAgICAgICAvLyBpdCBvdXQgb2YgZnJvbU5vZGVzTG9va3VwIGFuZCB3ZSB1c2UgZnJvbU5vZGVzTG9va3VwIHRvIGRldGVybWluZVxuICAgICAgICAvLyBpZiBhIGtleWVkIG5vZGUgaGFzIGJlZW4gbWF0Y2hlZCB1cCBvciBub3RcbiAgICAgICAgaWYgKGtleWVkUmVtb3ZhbExpc3QpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MCwgbGVuPWtleWVkUmVtb3ZhbExpc3QubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsVG9SZW1vdmUgPSBmcm9tTm9kZXNMb29rdXBba2V5ZWRSZW1vdmFsTGlzdFtpXV07XG4gICAgICAgICAgICAgICAgaWYgKGVsVG9SZW1vdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm9kZShlbFRvUmVtb3ZlLCBlbFRvUmVtb3ZlLnBhcmVudE5vZGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWNoaWxkcmVuT25seSAmJiBtb3JwaGVkTm9kZSAhPT0gZnJvbU5vZGUgJiYgZnJvbU5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICBpZiAobW9ycGhlZE5vZGUuYWN0dWFsaXplKSB7XG4gICAgICAgICAgICBtb3JwaGVkTm9kZSA9IG1vcnBoZWROb2RlLmFjdHVhbGl6ZShmcm9tTm9kZS5vd25lckRvY3VtZW50IHx8IGRvYyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgd2UgaGFkIHRvIHN3YXAgb3V0IHRoZSBmcm9tIG5vZGUgd2l0aCBhIG5ldyBub2RlIGJlY2F1c2UgdGhlIG9sZFxuICAgICAgICAvLyBub2RlIHdhcyBub3QgY29tcGF0aWJsZSB3aXRoIHRoZSB0YXJnZXQgbm9kZSB0aGVuIHdlIG5lZWQgdG9cbiAgICAgICAgLy8gcmVwbGFjZSB0aGUgb2xkIERPTSBub2RlIGluIHRoZSBvcmlnaW5hbCBET00gdHJlZS4gVGhpcyBpcyBvbmx5XG4gICAgICAgIC8vIHBvc3NpYmxlIGlmIHRoZSBvcmlnaW5hbCBET00gbm9kZSB3YXMgcGFydCBvZiBhIERPTSB0cmVlIHdoaWNoXG4gICAgICAgIC8vIHdlIGtub3cgaXMgdGhlIGNhc2UgaWYgaXQgaGFzIGEgcGFyZW50IG5vZGUuXG4gICAgICAgIGZyb21Ob2RlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG1vcnBoZWROb2RlLCBmcm9tTm9kZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vcnBoZWROb2RlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1vcnBoZG9tO1xuIiwiLypqc2hpbnQgbm9kZTp0cnVlICovXHJcblxyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBtaW5pbWFsRGVzYyA9IFsnaCcsICdtaW4nLCAncycsICdtcycsICfOvHMnLCAnbnMnXTtcclxudmFyIHZlcmJvc2VEZXNjID0gWydob3VyJywgJ21pbnV0ZScsICdzZWNvbmQnLCAnbWlsbGlzZWNvbmQnLCAnbWljcm9zZWNvbmQnLCAnbmFub3NlY29uZCddO1xyXG52YXIgY29udmVydCA9IFs2MCo2MCwgNjAsIDEsIDFlNiwgMWUzLCAxXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHNvdXJjZSwgb3B0cykge1xyXG5cdHZhciB2ZXJib3NlLCBwcmVjaXNlLCBpLCBzcG90LCBzb3VyY2VBdFN0ZXAsIHZhbEF0U3RlcCwgZGVjaW1hbHMsIHN0ckF0U3RlcCwgcmVzdWx0cywgdG90YWxTZWNvbmRzO1xyXG5cclxuXHR2ZXJib3NlID0gZmFsc2U7XHJcblx0cHJlY2lzZSA9IGZhbHNlO1xyXG5cdGlmIChvcHRzKSB7XHJcblx0XHR2ZXJib3NlID0gb3B0cy52ZXJib3NlIHx8IGZhbHNlO1xyXG5cdFx0cHJlY2lzZSA9IG9wdHMucHJlY2lzZSB8fCBmYWxzZTtcclxuXHR9XHJcblxyXG5cdGlmICghQXJyYXkuaXNBcnJheShzb3VyY2UpIHx8IHNvdXJjZS5sZW5ndGggIT09IDIpIHtcclxuXHRcdHJldHVybiAnJztcclxuXHR9XHJcblx0aWYgKHR5cGVvZiBzb3VyY2VbMF0gIT09ICdudW1iZXInIHx8IHR5cGVvZiBzb3VyY2VbMV0gIT09ICdudW1iZXInKSB7XHJcblx0XHRyZXR1cm4gJyc7XHJcblx0fVxyXG5cclxuXHQvLyBub3JtYWxpemUgc291cmNlIGFycmF5IGR1ZSB0byBjaGFuZ2VzIGluIG5vZGUgdjUuNCtcclxuXHRpZiAoc291cmNlWzFdIDwgMCkge1xyXG5cdFx0dG90YWxTZWNvbmRzID0gc291cmNlWzBdICsgc291cmNlWzFdIC8gMWU5O1xyXG5cdFx0c291cmNlWzBdID0gcGFyc2VJbnQodG90YWxTZWNvbmRzKTtcclxuXHRcdHNvdXJjZVsxXSA9IHBhcnNlRmxvYXQoKHRvdGFsU2Vjb25kcyAlIDEpLnRvUHJlY2lzaW9uKDkpKSAqIDFlOTtcclxuXHR9XHJcblxyXG5cdHJlc3VsdHMgPSAnJztcclxuXHJcblx0Ly8gZm9yZWFjaCB1bml0XHJcblx0Zm9yIChpID0gMDsgaSA8IDY7IGkrKykge1xyXG5cdFx0c3BvdCA9IGkgPCAzID8gMCA6IDE7IC8vIGdyYWJiaW5nIGZpcnN0IG9yIHNlY29uZCBzcG90IGluIHNvdXJjZSBhcnJheVxyXG5cdFx0c291cmNlQXRTdGVwID0gc291cmNlW3Nwb3RdO1xyXG5cdFx0aWYgKGkgIT09IDMgJiYgaSAhPT0gMCkge1xyXG5cdFx0XHRzb3VyY2VBdFN0ZXAgPSBzb3VyY2VBdFN0ZXAgJSBjb252ZXJ0W2ktMV07IC8vIHRyaW0gb2ZmIHByZXZpb3VzIHBvcnRpb25zXHJcblx0XHR9XHJcblx0XHRpZiAoaSA9PT0gMikge1xyXG5cdFx0XHRzb3VyY2VBdFN0ZXAgKz0gc291cmNlWzFdLzFlOTsgLy8gZ2V0IHBhcnRpYWwgc2Vjb25kcyBmcm9tIG90aGVyIHBvcnRpb24gb2YgdGhlIGFycmF5XHJcblx0XHR9XHJcblx0XHR2YWxBdFN0ZXAgPSBzb3VyY2VBdFN0ZXAgLyBjb252ZXJ0W2ldOyAvLyB2YWwgYXQgdGhpcyB1bml0XHJcblx0XHRpZiAodmFsQXRTdGVwID49IDEpIHtcclxuXHRcdFx0aWYgKHZlcmJvc2UpIHtcclxuXHRcdFx0XHR2YWxBdFN0ZXAgPSBNYXRoLmZsb29yKHZhbEF0U3RlcCk7IC8vIGRlYWwgaW4gd2hvbGUgdW5pdHMsIHN1YnNlcXVlbnQgbGFwcyB3aWxsIGdldCB0aGUgZGVjaW1hbCBwb3J0aW9uXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFwcmVjaXNlKSB7XHJcblx0XHRcdFx0Ly8gZG9uJ3QgZmxpbmcgdG9vIG1hbnkgZGVjaW1hbHNcclxuXHRcdFx0XHRkZWNpbWFscyA9IHZhbEF0U3RlcCA+PSAxMCA/IDAgOiAyO1xyXG5cdFx0XHRcdHN0ckF0U3RlcCA9IHZhbEF0U3RlcC50b0ZpeGVkKGRlY2ltYWxzKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRzdHJBdFN0ZXAgPSB2YWxBdFN0ZXAudG9TdHJpbmcoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoc3RyQXRTdGVwLmluZGV4T2YoJy4nKSA+IC0xICYmIHN0ckF0U3RlcFtzdHJBdFN0ZXAubGVuZ3RoLTFdID09PSAnMCcpIHtcclxuXHRcdFx0XHRzdHJBdFN0ZXAgPSBzdHJBdFN0ZXAucmVwbGFjZSgvXFwuPzArJC8sJycpOyAvLyByZW1vdmUgdHJhaWxpbmcgemVyb3NcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAocmVzdWx0cykge1xyXG5cdFx0XHRcdHJlc3VsdHMgKz0gJyAnOyAvLyBhcHBlbmQgc3BhY2UgaWYgd2UgaGF2ZSBhIHByZXZpb3VzIHZhbHVlXHJcblx0XHRcdH1cclxuXHRcdFx0cmVzdWx0cyArPSBzdHJBdFN0ZXA7IC8vIGFwcGVuZCB0aGUgdmFsdWVcclxuXHRcdFx0Ly8gYXBwZW5kIHVuaXRzXHJcblx0XHRcdGlmICh2ZXJib3NlKSB7XHJcblx0XHRcdFx0cmVzdWx0cyArPSAnICcrdmVyYm9zZURlc2NbaV07XHJcblx0XHRcdFx0aWYgKHN0ckF0U3RlcCAhPT0gJzEnKSB7XHJcblx0XHRcdFx0XHRyZXN1bHRzICs9ICdzJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmVzdWx0cyArPSAnICcrbWluaW1hbERlc2NbaV07XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCF2ZXJib3NlKSB7XHJcblx0XHRcdFx0YnJlYWs7IC8vIHZlcmJvc2UgZ2V0cyBhcyBtYW55IGdyb3VwcyBhcyBuZWNlc3NhcnksIHRoZSByZXN0IGdldCBvbmx5IG9uZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gcmVzdWx0cztcclxufTtcclxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYicpXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhc2FwID0gcmVxdWlyZSgnYXNhcC9yYXcnKTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbi8vIFN0YXRlczpcbi8vXG4vLyAwIC0gcGVuZGluZ1xuLy8gMSAtIGZ1bGZpbGxlZCB3aXRoIF92YWx1ZVxuLy8gMiAtIHJlamVjdGVkIHdpdGggX3ZhbHVlXG4vLyAzIC0gYWRvcHRlZCB0aGUgc3RhdGUgb2YgYW5vdGhlciBwcm9taXNlLCBfdmFsdWVcbi8vXG4vLyBvbmNlIHRoZSBzdGF0ZSBpcyBubyBsb25nZXIgcGVuZGluZyAoMCkgaXQgaXMgaW1tdXRhYmxlXG5cbi8vIEFsbCBgX2AgcHJlZml4ZWQgcHJvcGVydGllcyB3aWxsIGJlIHJlZHVjZWQgdG8gYF97cmFuZG9tIG51bWJlcn1gXG4vLyBhdCBidWlsZCB0aW1lIHRvIG9iZnVzY2F0ZSB0aGVtIGFuZCBkaXNjb3VyYWdlIHRoZWlyIHVzZS5cbi8vIFdlIGRvbid0IHVzZSBzeW1ib2xzIG9yIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0byBmdWxseSBoaWRlIHRoZW1cbi8vIGJlY2F1c2UgdGhlIHBlcmZvcm1hbmNlIGlzbid0IGdvb2QgZW5vdWdoLlxuXG5cbi8vIHRvIGF2b2lkIHVzaW5nIHRyeS9jYXRjaCBpbnNpZGUgY3JpdGljYWwgZnVuY3Rpb25zLCB3ZVxuLy8gZXh0cmFjdCB0aGVtIHRvIGhlcmUuXG52YXIgTEFTVF9FUlJPUiA9IG51bGw7XG52YXIgSVNfRVJST1IgPSB7fTtcbmZ1bmN0aW9uIGdldFRoZW4ob2JqKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIG9iai50aGVuO1xuICB9IGNhdGNoIChleCkge1xuICAgIExBU1RfRVJST1IgPSBleDtcbiAgICByZXR1cm4gSVNfRVJST1I7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJ5Q2FsbE9uZShmbiwgYSkge1xuICB0cnkge1xuICAgIHJldHVybiBmbihhKTtcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICBMQVNUX0VSUk9SID0gZXg7XG4gICAgcmV0dXJuIElTX0VSUk9SO1xuICB9XG59XG5mdW5jdGlvbiB0cnlDYWxsVHdvKGZuLCBhLCBiKSB7XG4gIHRyeSB7XG4gICAgZm4oYSwgYik7XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgTEFTVF9FUlJPUiA9IGV4O1xuICAgIHJldHVybiBJU19FUlJPUjtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByb21pc2U7XG5cbmZ1bmN0aW9uIFByb21pc2UoZm4pIHtcbiAgaWYgKHR5cGVvZiB0aGlzICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb21pc2VzIG11c3QgYmUgY29uc3RydWN0ZWQgdmlhIG5ldycpO1xuICB9XG4gIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9taXNlIGNvbnN0cnVjdG9yXFwncyBhcmd1bWVudCBpcyBub3QgYSBmdW5jdGlvbicpO1xuICB9XG4gIHRoaXMuXzQwID0gMDtcbiAgdGhpcy5fNjUgPSAwO1xuICB0aGlzLl81NSA9IG51bGw7XG4gIHRoaXMuXzcyID0gbnVsbDtcbiAgaWYgKGZuID09PSBub29wKSByZXR1cm47XG4gIGRvUmVzb2x2ZShmbiwgdGhpcyk7XG59XG5Qcm9taXNlLl8zNyA9IG51bGw7XG5Qcm9taXNlLl84NyA9IG51bGw7XG5Qcm9taXNlLl82MSA9IG5vb3A7XG5cblByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICBpZiAodGhpcy5jb25zdHJ1Y3RvciAhPT0gUHJvbWlzZSkge1xuICAgIHJldHVybiBzYWZlVGhlbih0aGlzLCBvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCk7XG4gIH1cbiAgdmFyIHJlcyA9IG5ldyBQcm9taXNlKG5vb3ApO1xuICBoYW5kbGUodGhpcywgbmV3IEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHJlcykpO1xuICByZXR1cm4gcmVzO1xufTtcblxuZnVuY3Rpb24gc2FmZVRoZW4oc2VsZiwgb25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgcmV0dXJuIG5ldyBzZWxmLmNvbnN0cnVjdG9yKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVzID0gbmV3IFByb21pc2Uobm9vcCk7XG4gICAgcmVzLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICBoYW5kbGUoc2VsZiwgbmV3IEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHJlcykpO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGhhbmRsZShzZWxmLCBkZWZlcnJlZCkge1xuICB3aGlsZSAoc2VsZi5fNjUgPT09IDMpIHtcbiAgICBzZWxmID0gc2VsZi5fNTU7XG4gIH1cbiAgaWYgKFByb21pc2UuXzM3KSB7XG4gICAgUHJvbWlzZS5fMzcoc2VsZik7XG4gIH1cbiAgaWYgKHNlbGYuXzY1ID09PSAwKSB7XG4gICAgaWYgKHNlbGYuXzQwID09PSAwKSB7XG4gICAgICBzZWxmLl80MCA9IDE7XG4gICAgICBzZWxmLl83MiA9IGRlZmVycmVkO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoc2VsZi5fNDAgPT09IDEpIHtcbiAgICAgIHNlbGYuXzQwID0gMjtcbiAgICAgIHNlbGYuXzcyID0gW3NlbGYuXzcyLCBkZWZlcnJlZF07XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNlbGYuXzcyLnB1c2goZGVmZXJyZWQpO1xuICAgIHJldHVybjtcbiAgfVxuICBoYW5kbGVSZXNvbHZlZChzZWxmLCBkZWZlcnJlZCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJlc29sdmVkKHNlbGYsIGRlZmVycmVkKSB7XG4gIGFzYXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNiID0gc2VsZi5fNjUgPT09IDEgPyBkZWZlcnJlZC5vbkZ1bGZpbGxlZCA6IGRlZmVycmVkLm9uUmVqZWN0ZWQ7XG4gICAgaWYgKGNiID09PSBudWxsKSB7XG4gICAgICBpZiAoc2VsZi5fNjUgPT09IDEpIHtcbiAgICAgICAgcmVzb2x2ZShkZWZlcnJlZC5wcm9taXNlLCBzZWxmLl81NSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWplY3QoZGVmZXJyZWQucHJvbWlzZSwgc2VsZi5fNTUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcmV0ID0gdHJ5Q2FsbE9uZShjYiwgc2VsZi5fNTUpO1xuICAgIGlmIChyZXQgPT09IElTX0VSUk9SKSB7XG4gICAgICByZWplY3QoZGVmZXJyZWQucHJvbWlzZSwgTEFTVF9FUlJPUik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc29sdmUoZGVmZXJyZWQucHJvbWlzZSwgcmV0KTtcbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gcmVzb2x2ZShzZWxmLCBuZXdWYWx1ZSkge1xuICAvLyBQcm9taXNlIFJlc29sdXRpb24gUHJvY2VkdXJlOiBodHRwczovL2dpdGh1Yi5jb20vcHJvbWlzZXMtYXBsdXMvcHJvbWlzZXMtc3BlYyN0aGUtcHJvbWlzZS1yZXNvbHV0aW9uLXByb2NlZHVyZVxuICBpZiAobmV3VmFsdWUgPT09IHNlbGYpIHtcbiAgICByZXR1cm4gcmVqZWN0KFxuICAgICAgc2VsZixcbiAgICAgIG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZSBjYW5ub3QgYmUgcmVzb2x2ZWQgd2l0aCBpdHNlbGYuJylcbiAgICApO1xuICB9XG4gIGlmIChcbiAgICBuZXdWYWx1ZSAmJlxuICAgICh0eXBlb2YgbmV3VmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgKSB7XG4gICAgdmFyIHRoZW4gPSBnZXRUaGVuKG5ld1ZhbHVlKTtcbiAgICBpZiAodGhlbiA9PT0gSVNfRVJST1IpIHtcbiAgICAgIHJldHVybiByZWplY3Qoc2VsZiwgTEFTVF9FUlJPUik7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIHRoZW4gPT09IHNlbGYudGhlbiAmJlxuICAgICAgbmV3VmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlXG4gICAgKSB7XG4gICAgICBzZWxmLl82NSA9IDM7XG4gICAgICBzZWxmLl81NSA9IG5ld1ZhbHVlO1xuICAgICAgZmluYWxlKHNlbGYpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGRvUmVzb2x2ZSh0aGVuLmJpbmQobmV3VmFsdWUpLCBzZWxmKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgc2VsZi5fNjUgPSAxO1xuICBzZWxmLl81NSA9IG5ld1ZhbHVlO1xuICBmaW5hbGUoc2VsZik7XG59XG5cbmZ1bmN0aW9uIHJlamVjdChzZWxmLCBuZXdWYWx1ZSkge1xuICBzZWxmLl82NSA9IDI7XG4gIHNlbGYuXzU1ID0gbmV3VmFsdWU7XG4gIGlmIChQcm9taXNlLl84Nykge1xuICAgIFByb21pc2UuXzg3KHNlbGYsIG5ld1ZhbHVlKTtcbiAgfVxuICBmaW5hbGUoc2VsZik7XG59XG5mdW5jdGlvbiBmaW5hbGUoc2VsZikge1xuICBpZiAoc2VsZi5fNDAgPT09IDEpIHtcbiAgICBoYW5kbGUoc2VsZiwgc2VsZi5fNzIpO1xuICAgIHNlbGYuXzcyID0gbnVsbDtcbiAgfVxuICBpZiAoc2VsZi5fNDAgPT09IDIpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYuXzcyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBoYW5kbGUoc2VsZiwgc2VsZi5fNzJbaV0pO1xuICAgIH1cbiAgICBzZWxmLl83MiA9IG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbWlzZSl7XG4gIHRoaXMub25GdWxmaWxsZWQgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IG51bGw7XG4gIHRoaXMub25SZWplY3RlZCA9IHR5cGVvZiBvblJlamVjdGVkID09PSAnZnVuY3Rpb24nID8gb25SZWplY3RlZCA6IG51bGw7XG4gIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG59XG5cbi8qKlxuICogVGFrZSBhIHBvdGVudGlhbGx5IG1pc2JlaGF2aW5nIHJlc29sdmVyIGZ1bmN0aW9uIGFuZCBtYWtlIHN1cmVcbiAqIG9uRnVsZmlsbGVkIGFuZCBvblJlamVjdGVkIGFyZSBvbmx5IGNhbGxlZCBvbmNlLlxuICpcbiAqIE1ha2VzIG5vIGd1YXJhbnRlZXMgYWJvdXQgYXN5bmNocm9ueS5cbiAqL1xuZnVuY3Rpb24gZG9SZXNvbHZlKGZuLCBwcm9taXNlKSB7XG4gIHZhciBkb25lID0gZmFsc2U7XG4gIHZhciByZXMgPSB0cnlDYWxsVHdvKGZuLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAoZG9uZSkgcmV0dXJuO1xuICAgIGRvbmUgPSB0cnVlO1xuICAgIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICBkb25lID0gdHJ1ZTtcbiAgICByZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgfSk7XG4gIGlmICghZG9uZSAmJiByZXMgPT09IElTX0VSUk9SKSB7XG4gICAgZG9uZSA9IHRydWU7XG4gICAgcmVqZWN0KHByb21pc2UsIExBU1RfRVJST1IpO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi9jb3JlLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcblByb21pc2UucHJvdG90eXBlLmRvbmUgPSBmdW5jdGlvbiAob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgdmFyIHNlbGYgPSBhcmd1bWVudHMubGVuZ3RoID8gdGhpcy50aGVuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiB0aGlzO1xuICBzZWxmLnRoZW4obnVsbCwgZnVuY3Rpb24gKGVycikge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH0sIDApO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBFUzYgZXh0ZW5zaW9ucyB0byB0aGUgY29yZSBQcm9taXNlcy9BKyBBUElcblxudmFyIFByb21pc2UgPSByZXF1aXJlKCcuL2NvcmUuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuXG4vKiBTdGF0aWMgRnVuY3Rpb25zICovXG5cbnZhciBUUlVFID0gdmFsdWVQcm9taXNlKHRydWUpO1xudmFyIEZBTFNFID0gdmFsdWVQcm9taXNlKGZhbHNlKTtcbnZhciBOVUxMID0gdmFsdWVQcm9taXNlKG51bGwpO1xudmFyIFVOREVGSU5FRCA9IHZhbHVlUHJvbWlzZSh1bmRlZmluZWQpO1xudmFyIFpFUk8gPSB2YWx1ZVByb21pc2UoMCk7XG52YXIgRU1QVFlTVFJJTkcgPSB2YWx1ZVByb21pc2UoJycpO1xuXG5mdW5jdGlvbiB2YWx1ZVByb21pc2UodmFsdWUpIHtcbiAgdmFyIHAgPSBuZXcgUHJvbWlzZShQcm9taXNlLl82MSk7XG4gIHAuXzY1ID0gMTtcbiAgcC5fNTUgPSB2YWx1ZTtcbiAgcmV0dXJuIHA7XG59XG5Qcm9taXNlLnJlc29sdmUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkgcmV0dXJuIHZhbHVlO1xuXG4gIGlmICh2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuIE5VTEw7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gVU5ERUZJTkVEO1xuICBpZiAodmFsdWUgPT09IHRydWUpIHJldHVybiBUUlVFO1xuICBpZiAodmFsdWUgPT09IGZhbHNlKSByZXR1cm4gRkFMU0U7XG4gIGlmICh2YWx1ZSA9PT0gMCkgcmV0dXJuIFpFUk87XG4gIGlmICh2YWx1ZSA9PT0gJycpIHJldHVybiBFTVBUWVNUUklORztcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICB0cnkge1xuICAgICAgdmFyIHRoZW4gPSB2YWx1ZS50aGVuO1xuICAgICAgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSh0aGVuLmJpbmQodmFsdWUpKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmVqZWN0KGV4KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdmFsdWVQcm9taXNlKHZhbHVlKTtcbn07XG5cblByb21pc2UuYWxsID0gZnVuY3Rpb24gKGFycikge1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFycik7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHJldHVybiByZXNvbHZlKFtdKTtcbiAgICB2YXIgcmVtYWluaW5nID0gYXJncy5sZW5ndGg7XG4gICAgZnVuY3Rpb24gcmVzKGksIHZhbCkge1xuICAgICAgaWYgKHZhbCAmJiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgaWYgKHZhbCBpbnN0YW5jZW9mIFByb21pc2UgJiYgdmFsLnRoZW4gPT09IFByb21pc2UucHJvdG90eXBlLnRoZW4pIHtcbiAgICAgICAgICB3aGlsZSAodmFsLl82NSA9PT0gMykge1xuICAgICAgICAgICAgdmFsID0gdmFsLl81NTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZhbC5fNjUgPT09IDEpIHJldHVybiByZXMoaSwgdmFsLl81NSk7XG4gICAgICAgICAgaWYgKHZhbC5fNjUgPT09IDIpIHJlamVjdCh2YWwuXzU1KTtcbiAgICAgICAgICB2YWwudGhlbihmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICByZXMoaSwgdmFsKTtcbiAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgdGhlbiA9IHZhbC50aGVuO1xuICAgICAgICAgIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIHAgPSBuZXcgUHJvbWlzZSh0aGVuLmJpbmQodmFsKSk7XG4gICAgICAgICAgICBwLnRoZW4oZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICByZXMoaSwgdmFsKTtcbiAgICAgICAgICAgIH0sIHJlamVjdCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhcmdzW2ldID0gdmFsO1xuICAgICAgaWYgKC0tcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgIHJlc29sdmUoYXJncyk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzKGksIGFyZ3NbaV0pO1xuICAgIH1cbiAgfSk7XG59O1xuXG5Qcm9taXNlLnJlamVjdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHJlamVjdCh2YWx1ZSk7XG4gIH0pO1xufTtcblxuUHJvbWlzZS5yYWNlID0gZnVuY3Rpb24gKHZhbHVlcykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbi8qIFByb3RvdHlwZSBNZXRob2RzICovXG5cblByb21pc2UucHJvdG90eXBlWydjYXRjaCddID0gZnVuY3Rpb24gKG9uUmVqZWN0ZWQpIHtcbiAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGVkKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi9jb3JlLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcblByb21pc2UucHJvdG90eXBlWydmaW5hbGx5J10gPSBmdW5jdGlvbiAoZikge1xuICByZXR1cm4gdGhpcy50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZigpKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9KTtcbiAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZigpKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9KTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY29yZS5qcycpO1xucmVxdWlyZSgnLi9kb25lLmpzJyk7XG5yZXF1aXJlKCcuL2ZpbmFsbHkuanMnKTtcbnJlcXVpcmUoJy4vZXM2LWV4dGVuc2lvbnMuanMnKTtcbnJlcXVpcmUoJy4vbm9kZS1leHRlbnNpb25zLmpzJyk7XG5yZXF1aXJlKCcuL3N5bmNocm9ub3VzLmpzJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIFRoaXMgZmlsZSBjb250YWlucyB0aGVuL3Byb21pc2Ugc3BlY2lmaWMgZXh0ZW5zaW9ucyB0aGF0IGFyZSBvbmx5IHVzZWZ1bFxuLy8gZm9yIG5vZGUuanMgaW50ZXJvcFxuXG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJy4vY29yZS5qcycpO1xudmFyIGFzYXAgPSByZXF1aXJlKCdhc2FwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcblxuLyogU3RhdGljIEZ1bmN0aW9ucyAqL1xuXG5Qcm9taXNlLmRlbm9kZWlmeSA9IGZ1bmN0aW9uIChmbiwgYXJndW1lbnRDb3VudCkge1xuICBpZiAoXG4gICAgdHlwZW9mIGFyZ3VtZW50Q291bnQgPT09ICdudW1iZXInICYmIGFyZ3VtZW50Q291bnQgIT09IEluZmluaXR5XG4gICkge1xuICAgIHJldHVybiBkZW5vZGVpZnlXaXRoQ291bnQoZm4sIGFyZ3VtZW50Q291bnQpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBkZW5vZGVpZnlXaXRob3V0Q291bnQoZm4pO1xuICB9XG59O1xuXG52YXIgY2FsbGJhY2tGbiA9IChcbiAgJ2Z1bmN0aW9uIChlcnIsIHJlcykgeycgK1xuICAnaWYgKGVycikgeyByaihlcnIpOyB9IGVsc2UgeyBycyhyZXMpOyB9JyArXG4gICd9J1xuKTtcbmZ1bmN0aW9uIGRlbm9kZWlmeVdpdGhDb3VudChmbiwgYXJndW1lbnRDb3VudCkge1xuICB2YXIgYXJncyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50Q291bnQ7IGkrKykge1xuICAgIGFyZ3MucHVzaCgnYScgKyBpKTtcbiAgfVxuICB2YXIgYm9keSA9IFtcbiAgICAncmV0dXJuIGZ1bmN0aW9uICgnICsgYXJncy5qb2luKCcsJykgKyAnKSB7JyxcbiAgICAndmFyIHNlbGYgPSB0aGlzOycsXG4gICAgJ3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocnMsIHJqKSB7JyxcbiAgICAndmFyIHJlcyA9IGZuLmNhbGwoJyxcbiAgICBbJ3NlbGYnXS5jb25jYXQoYXJncykuY29uY2F0KFtjYWxsYmFja0ZuXSkuam9pbignLCcpLFxuICAgICcpOycsXG4gICAgJ2lmIChyZXMgJiYnLFxuICAgICcodHlwZW9mIHJlcyA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgcmVzID09PSBcImZ1bmN0aW9uXCIpICYmJyxcbiAgICAndHlwZW9mIHJlcy50aGVuID09PSBcImZ1bmN0aW9uXCInLFxuICAgICcpIHtycyhyZXMpO30nLFxuICAgICd9KTsnLFxuICAgICd9OydcbiAgXS5qb2luKCcnKTtcbiAgcmV0dXJuIEZ1bmN0aW9uKFsnUHJvbWlzZScsICdmbiddLCBib2R5KShQcm9taXNlLCBmbik7XG59XG5mdW5jdGlvbiBkZW5vZGVpZnlXaXRob3V0Q291bnQoZm4pIHtcbiAgdmFyIGZuTGVuZ3RoID0gTWF0aC5tYXgoZm4ubGVuZ3RoIC0gMSwgMyk7XG4gIHZhciBhcmdzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZm5MZW5ndGg7IGkrKykge1xuICAgIGFyZ3MucHVzaCgnYScgKyBpKTtcbiAgfVxuICB2YXIgYm9keSA9IFtcbiAgICAncmV0dXJuIGZ1bmN0aW9uICgnICsgYXJncy5qb2luKCcsJykgKyAnKSB7JyxcbiAgICAndmFyIHNlbGYgPSB0aGlzOycsXG4gICAgJ3ZhciBhcmdzOycsXG4gICAgJ3ZhciBhcmdMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoOycsXG4gICAgJ2lmIChhcmd1bWVudHMubGVuZ3RoID4gJyArIGZuTGVuZ3RoICsgJykgeycsXG4gICAgJ2FyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCArIDEpOycsXG4gICAgJ2ZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7JyxcbiAgICAnYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTsnLFxuICAgICd9JyxcbiAgICAnfScsXG4gICAgJ3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocnMsIHJqKSB7JyxcbiAgICAndmFyIGNiID0gJyArIGNhbGxiYWNrRm4gKyAnOycsXG4gICAgJ3ZhciByZXM7JyxcbiAgICAnc3dpdGNoIChhcmdMZW5ndGgpIHsnLFxuICAgIGFyZ3MuY29uY2F0KFsnZXh0cmEnXSkubWFwKGZ1bmN0aW9uIChfLCBpbmRleCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgJ2Nhc2UgJyArIChpbmRleCkgKyAnOicgK1xuICAgICAgICAncmVzID0gZm4uY2FsbCgnICsgWydzZWxmJ10uY29uY2F0KGFyZ3Muc2xpY2UoMCwgaW5kZXgpKS5jb25jYXQoJ2NiJykuam9pbignLCcpICsgJyk7JyArXG4gICAgICAgICdicmVhazsnXG4gICAgICApO1xuICAgIH0pLmpvaW4oJycpLFxuICAgICdkZWZhdWx0OicsXG4gICAgJ2FyZ3NbYXJnTGVuZ3RoXSA9IGNiOycsXG4gICAgJ3JlcyA9IGZuLmFwcGx5KHNlbGYsIGFyZ3MpOycsXG4gICAgJ30nLFxuICAgIFxuICAgICdpZiAocmVzICYmJyxcbiAgICAnKHR5cGVvZiByZXMgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHJlcyA9PT0gXCJmdW5jdGlvblwiKSAmJicsXG4gICAgJ3R5cGVvZiByZXMudGhlbiA9PT0gXCJmdW5jdGlvblwiJyxcbiAgICAnKSB7cnMocmVzKTt9JyxcbiAgICAnfSk7JyxcbiAgICAnfTsnXG4gIF0uam9pbignJyk7XG5cbiAgcmV0dXJuIEZ1bmN0aW9uKFxuICAgIFsnUHJvbWlzZScsICdmbiddLFxuICAgIGJvZHlcbiAgKShQcm9taXNlLCBmbik7XG59XG5cblByb21pc2Uubm9kZWlmeSA9IGZ1bmN0aW9uIChmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgY2FsbGJhY2sgPVxuICAgICAgdHlwZW9mIGFyZ3NbYXJncy5sZW5ndGggLSAxXSA9PT0gJ2Z1bmN0aW9uJyA/IGFyZ3MucG9wKCkgOiBudWxsO1xuICAgIHZhciBjdHggPSB0aGlzO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKS5ub2RlaWZ5KGNhbGxiYWNrLCBjdHgpO1xuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICBpZiAoY2FsbGJhY2sgPT09IG51bGwgfHwgdHlwZW9mIGNhbGxiYWNrID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgcmVqZWN0KGV4KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhc2FwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjYWxsYmFjay5jYWxsKGN0eCwgZXgpO1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuUHJvbWlzZS5wcm90b3R5cGUubm9kZWlmeSA9IGZ1bmN0aW9uIChjYWxsYmFjaywgY3R4KSB7XG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJykgcmV0dXJuIHRoaXM7XG5cbiAgdGhpcy50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGFzYXAoZnVuY3Rpb24gKCkge1xuICAgICAgY2FsbGJhY2suY2FsbChjdHgsIG51bGwsIHZhbHVlKTtcbiAgICB9KTtcbiAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgIGFzYXAoZnVuY3Rpb24gKCkge1xuICAgICAgY2FsbGJhY2suY2FsbChjdHgsIGVycik7XG4gICAgfSk7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFByb21pc2UgPSByZXF1aXJlKCcuL2NvcmUuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuUHJvbWlzZS5lbmFibGVTeW5jaHJvbm91cyA9IGZ1bmN0aW9uICgpIHtcbiAgUHJvbWlzZS5wcm90b3R5cGUuaXNQZW5kaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGUoKSA9PSAwO1xuICB9O1xuXG4gIFByb21pc2UucHJvdG90eXBlLmlzRnVsZmlsbGVkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGUoKSA9PSAxO1xuICB9O1xuXG4gIFByb21pc2UucHJvdG90eXBlLmlzUmVqZWN0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZSgpID09IDI7XG4gIH07XG5cbiAgUHJvbWlzZS5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuXzY1ID09PSAzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fNTUuZ2V0VmFsdWUoKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaXNGdWxmaWxsZWQoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZ2V0IGEgdmFsdWUgb2YgYW4gdW5mdWxmaWxsZWQgcHJvbWlzZS4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fNTU7XG4gIH07XG5cbiAgUHJvbWlzZS5wcm90b3R5cGUuZ2V0UmVhc29uID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl82NSA9PT0gMykge1xuICAgICAgcmV0dXJuIHRoaXMuXzU1LmdldFJlYXNvbigpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5pc1JlamVjdGVkKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGdldCBhIHJlamVjdGlvbiByZWFzb24gb2YgYSBub24tcmVqZWN0ZWQgcHJvbWlzZS4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fNTU7XG4gIH07XG5cbiAgUHJvbWlzZS5wcm90b3R5cGUuZ2V0U3RhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuXzY1ID09PSAzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fNTUuZ2V0U3RhdGUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuXzY1ID09PSAtMSB8fCB0aGlzLl82NSA9PT0gLTIpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl82NTtcbiAgfTtcbn07XG5cblByb21pc2UuZGlzYWJsZVN5bmNocm9ub3VzID0gZnVuY3Rpb24oKSB7XG4gIFByb21pc2UucHJvdG90eXBlLmlzUGVuZGluZyA9IHVuZGVmaW5lZDtcbiAgUHJvbWlzZS5wcm90b3R5cGUuaXNGdWxmaWxsZWQgPSB1bmRlZmluZWQ7XG4gIFByb21pc2UucHJvdG90eXBlLmlzUmVqZWN0ZWQgPSB1bmRlZmluZWQ7XG4gIFByb21pc2UucHJvdG90eXBlLmdldFZhbHVlID0gdW5kZWZpbmVkO1xuICBQcm9taXNlLnByb3RvdHlwZS5nZXRSZWFzb24gPSB1bmRlZmluZWQ7XG4gIFByb21pc2UucHJvdG90eXBlLmdldFN0YXRlID0gdW5kZWZpbmVkO1xufTtcbiIsInZhciB2MSA9IHJlcXVpcmUoJy4vdjEnKTtcbnZhciB2NCA9IHJlcXVpcmUoJy4vdjQnKTtcblxudmFyIHV1aWQgPSB2NDtcbnV1aWQudjEgPSB2MTtcbnV1aWQudjQgPSB2NDtcblxubW9kdWxlLmV4cG9ydHMgPSB1dWlkO1xuIiwiLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIDE2IGJ5dGUgdmFsdWVzIHRvIFVVSUQgc3RyaW5nIGZvcm1hdCBvZiB0aGUgZm9ybTpcbiAqIFhYWFhYWFhYLVhYWFgtWFhYWC1YWFhYLVhYWFhYWFhYWFhYWFxuICovXG52YXIgYnl0ZVRvSGV4ID0gW107XG5mb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGJ5dGVUb0hleFtpXSA9IChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSk7XG59XG5cbmZ1bmN0aW9uIGJ5dGVzVG9VdWlkKGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gb2Zmc2V0IHx8IDA7XG4gIHZhciBidGggPSBieXRlVG9IZXg7XG4gIHJldHVybiBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gKyAnLScgK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gKyAnLScgK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYnl0ZXNUb1V1aWQ7XG4iLCIvLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiAgSW4gdGhlXG4vLyBicm93c2VyIHRoaXMgaXMgYSBsaXR0bGUgY29tcGxpY2F0ZWQgZHVlIHRvIHVua25vd24gcXVhbGl0eSBvZiBNYXRoLnJhbmRvbSgpXG4vLyBhbmQgaW5jb25zaXN0ZW50IHN1cHBvcnQgZm9yIHRoZSBgY3J5cHRvYCBBUEkuICBXZSBkbyB0aGUgYmVzdCB3ZSBjYW4gdmlhXG4vLyBmZWF0dXJlLWRldGVjdGlvblxudmFyIHJuZztcblxudmFyIGNyeXB0byA9IGdsb2JhbC5jcnlwdG8gfHwgZ2xvYmFsLm1zQ3J5cHRvOyAvLyBmb3IgSUUgMTFcbmlmIChjcnlwdG8gJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xuICAvLyBXSEFUV0cgY3J5cHRvIFJORyAtIGh0dHA6Ly93aWtpLndoYXR3Zy5vcmcvd2lraS9DcnlwdG9cbiAgdmFyIHJuZHM4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4gIHJuZyA9IGZ1bmN0aW9uIHdoYXR3Z1JORygpIHtcbiAgICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKHJuZHM4KTtcbiAgICByZXR1cm4gcm5kczg7XG4gIH07XG59XG5cbmlmICghcm5nKSB7XG4gIC8vIE1hdGgucmFuZG9tKCktYmFzZWQgKFJORylcbiAgLy9cbiAgLy8gSWYgYWxsIGVsc2UgZmFpbHMsIHVzZSBNYXRoLnJhbmRvbSgpLiAgSXQncyBmYXN0LCBidXQgaXMgb2YgdW5zcGVjaWZpZWRcbiAgLy8gcXVhbGl0eS5cbiAgdmFyIHJuZHMgPSBuZXcgQXJyYXkoMTYpO1xuICBybmcgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgcjsgaSA8IDE2OyBpKyspIHtcbiAgICAgIGlmICgoaSAmIDB4MDMpID09PSAwKSByID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwO1xuICAgICAgcm5kc1tpXSA9IHIgPj4+ICgoaSAmIDB4MDMpIDw8IDMpICYgMHhmZjtcbiAgICB9XG5cbiAgICByZXR1cm4gcm5kcztcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBybmc7XG4iLCJ2YXIgcm5nID0gcmVxdWlyZSgnLi9saWIvcm5nJyk7XG52YXIgYnl0ZXNUb1V1aWQgPSByZXF1aXJlKCcuL2xpYi9ieXRlc1RvVXVpZCcpO1xuXG4vLyAqKmB2MSgpYCAtIEdlbmVyYXRlIHRpbWUtYmFzZWQgVVVJRCoqXG4vL1xuLy8gSW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL0xpb3NLL1VVSUQuanNcbi8vIGFuZCBodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvdXVpZC5odG1sXG5cbi8vIHJhbmRvbSAjJ3Mgd2UgbmVlZCB0byBpbml0IG5vZGUgYW5kIGNsb2Nrc2VxXG52YXIgX3NlZWRCeXRlcyA9IHJuZygpO1xuXG4vLyBQZXIgNC41LCBjcmVhdGUgYW5kIDQ4LWJpdCBub2RlIGlkLCAoNDcgcmFuZG9tIGJpdHMgKyBtdWx0aWNhc3QgYml0ID0gMSlcbnZhciBfbm9kZUlkID0gW1xuICBfc2VlZEJ5dGVzWzBdIHwgMHgwMSxcbiAgX3NlZWRCeXRlc1sxXSwgX3NlZWRCeXRlc1syXSwgX3NlZWRCeXRlc1szXSwgX3NlZWRCeXRlc1s0XSwgX3NlZWRCeXRlc1s1XVxuXTtcblxuLy8gUGVyIDQuMi4yLCByYW5kb21pemUgKDE0IGJpdCkgY2xvY2tzZXFcbnZhciBfY2xvY2tzZXEgPSAoX3NlZWRCeXRlc1s2XSA8PCA4IHwgX3NlZWRCeXRlc1s3XSkgJiAweDNmZmY7XG5cbi8vIFByZXZpb3VzIHV1aWQgY3JlYXRpb24gdGltZVxudmFyIF9sYXN0TVNlY3MgPSAwLCBfbGFzdE5TZWNzID0gMDtcblxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9icm9vZmEvbm9kZS11dWlkIGZvciBBUEkgZGV0YWlsc1xuZnVuY3Rpb24gdjEob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgdmFyIGkgPSBidWYgJiYgb2Zmc2V0IHx8IDA7XG4gIHZhciBiID0gYnVmIHx8IFtdO1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHZhciBjbG9ja3NlcSA9IG9wdGlvbnMuY2xvY2tzZXEgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuY2xvY2tzZXEgOiBfY2xvY2tzZXE7XG5cbiAgLy8gVVVJRCB0aW1lc3RhbXBzIGFyZSAxMDAgbmFuby1zZWNvbmQgdW5pdHMgc2luY2UgdGhlIEdyZWdvcmlhbiBlcG9jaCxcbiAgLy8gKDE1ODItMTAtMTUgMDA6MDApLiAgSlNOdW1iZXJzIGFyZW4ndCBwcmVjaXNlIGVub3VnaCBmb3IgdGhpcywgc29cbiAgLy8gdGltZSBpcyBoYW5kbGVkIGludGVybmFsbHkgYXMgJ21zZWNzJyAoaW50ZWdlciBtaWxsaXNlY29uZHMpIGFuZCAnbnNlY3MnXG4gIC8vICgxMDAtbmFub3NlY29uZHMgb2Zmc2V0IGZyb20gbXNlY3MpIHNpbmNlIHVuaXggZXBvY2gsIDE5NzAtMDEtMDEgMDA6MDAuXG4gIHZhciBtc2VjcyA9IG9wdGlvbnMubXNlY3MgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubXNlY3MgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAvLyBQZXIgNC4yLjEuMiwgdXNlIGNvdW50IG9mIHV1aWQncyBnZW5lcmF0ZWQgZHVyaW5nIHRoZSBjdXJyZW50IGNsb2NrXG4gIC8vIGN5Y2xlIHRvIHNpbXVsYXRlIGhpZ2hlciByZXNvbHV0aW9uIGNsb2NrXG4gIHZhciBuc2VjcyA9IG9wdGlvbnMubnNlY3MgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubnNlY3MgOiBfbGFzdE5TZWNzICsgMTtcblxuICAvLyBUaW1lIHNpbmNlIGxhc3QgdXVpZCBjcmVhdGlvbiAoaW4gbXNlY3MpXG4gIHZhciBkdCA9IChtc2VjcyAtIF9sYXN0TVNlY3MpICsgKG5zZWNzIC0gX2xhc3ROU2VjcykvMTAwMDA7XG5cbiAgLy8gUGVyIDQuMi4xLjIsIEJ1bXAgY2xvY2tzZXEgb24gY2xvY2sgcmVncmVzc2lvblxuICBpZiAoZHQgPCAwICYmIG9wdGlvbnMuY2xvY2tzZXEgPT09IHVuZGVmaW5lZCkge1xuICAgIGNsb2Nrc2VxID0gY2xvY2tzZXEgKyAxICYgMHgzZmZmO1xuICB9XG5cbiAgLy8gUmVzZXQgbnNlY3MgaWYgY2xvY2sgcmVncmVzc2VzIChuZXcgY2xvY2tzZXEpIG9yIHdlJ3ZlIG1vdmVkIG9udG8gYSBuZXdcbiAgLy8gdGltZSBpbnRlcnZhbFxuICBpZiAoKGR0IDwgMCB8fCBtc2VjcyA+IF9sYXN0TVNlY3MpICYmIG9wdGlvbnMubnNlY3MgPT09IHVuZGVmaW5lZCkge1xuICAgIG5zZWNzID0gMDtcbiAgfVxuXG4gIC8vIFBlciA0LjIuMS4yIFRocm93IGVycm9yIGlmIHRvbyBtYW55IHV1aWRzIGFyZSByZXF1ZXN0ZWRcbiAgaWYgKG5zZWNzID49IDEwMDAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1dWlkLnYxKCk6IENhblxcJ3QgY3JlYXRlIG1vcmUgdGhhbiAxME0gdXVpZHMvc2VjJyk7XG4gIH1cblxuICBfbGFzdE1TZWNzID0gbXNlY3M7XG4gIF9sYXN0TlNlY3MgPSBuc2VjcztcbiAgX2Nsb2Nrc2VxID0gY2xvY2tzZXE7XG5cbiAgLy8gUGVyIDQuMS40IC0gQ29udmVydCBmcm9tIHVuaXggZXBvY2ggdG8gR3JlZ29yaWFuIGVwb2NoXG4gIG1zZWNzICs9IDEyMjE5MjkyODAwMDAwO1xuXG4gIC8vIGB0aW1lX2xvd2BcbiAgdmFyIHRsID0gKChtc2VjcyAmIDB4ZmZmZmZmZikgKiAxMDAwMCArIG5zZWNzKSAlIDB4MTAwMDAwMDAwO1xuICBiW2krK10gPSB0bCA+Pj4gMjQgJiAweGZmO1xuICBiW2krK10gPSB0bCA+Pj4gMTYgJiAweGZmO1xuICBiW2krK10gPSB0bCA+Pj4gOCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsICYgMHhmZjtcblxuICAvLyBgdGltZV9taWRgXG4gIHZhciB0bWggPSAobXNlY3MgLyAweDEwMDAwMDAwMCAqIDEwMDAwKSAmIDB4ZmZmZmZmZjtcbiAgYltpKytdID0gdG1oID4+PiA4ICYgMHhmZjtcbiAgYltpKytdID0gdG1oICYgMHhmZjtcblxuICAvLyBgdGltZV9oaWdoX2FuZF92ZXJzaW9uYFxuICBiW2krK10gPSB0bWggPj4+IDI0ICYgMHhmIHwgMHgxMDsgLy8gaW5jbHVkZSB2ZXJzaW9uXG4gIGJbaSsrXSA9IHRtaCA+Pj4gMTYgJiAweGZmO1xuXG4gIC8vIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYCAoUGVyIDQuMi4yIC0gaW5jbHVkZSB2YXJpYW50KVxuICBiW2krK10gPSBjbG9ja3NlcSA+Pj4gOCB8IDB4ODA7XG5cbiAgLy8gYGNsb2NrX3NlcV9sb3dgXG4gIGJbaSsrXSA9IGNsb2Nrc2VxICYgMHhmZjtcblxuICAvLyBgbm9kZWBcbiAgdmFyIG5vZGUgPSBvcHRpb25zLm5vZGUgfHwgX25vZGVJZDtcbiAgZm9yICh2YXIgbiA9IDA7IG4gPCA2OyArK24pIHtcbiAgICBiW2kgKyBuXSA9IG5vZGVbbl07XG4gIH1cblxuICByZXR1cm4gYnVmID8gYnVmIDogYnl0ZXNUb1V1aWQoYik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdjE7XG4iLCJ2YXIgcm5nID0gcmVxdWlyZSgnLi9saWIvcm5nJyk7XG52YXIgYnl0ZXNUb1V1aWQgPSByZXF1aXJlKCcuL2xpYi9ieXRlc1RvVXVpZCcpO1xuXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICB2YXIgaSA9IGJ1ZiAmJiBvZmZzZXQgfHwgMDtcblxuICBpZiAodHlwZW9mKG9wdGlvbnMpID09ICdzdHJpbmcnKSB7XG4gICAgYnVmID0gb3B0aW9ucyA9PSAnYmluYXJ5JyA/IG5ldyBBcnJheSgxNikgOiBudWxsO1xuICAgIG9wdGlvbnMgPSBudWxsO1xuICB9XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHZhciBybmRzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTtcblxuICAvLyBQZXIgNC40LCBzZXQgYml0cyBmb3IgdmVyc2lvbiBhbmQgYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgXG4gIHJuZHNbNl0gPSAocm5kc1s2XSAmIDB4MGYpIHwgMHg0MDtcbiAgcm5kc1s4XSA9IChybmRzWzhdICYgMHgzZikgfCAweDgwO1xuXG4gIC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuICBpZiAoYnVmKSB7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IDE2OyArK2lpKSB7XG4gICAgICBidWZbaSArIGlpXSA9IHJuZHNbaWldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWYgfHwgYnl0ZXNUb1V1aWQocm5kcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdjQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IExvZ2dlckJhc2UgPSByZXF1aXJlKCcuLi9saWIvTG9nZ2VyQmFzZScpO1xuXG5jbGFzcyBMb2dnZXIgZXh0ZW5kcyBMb2dnZXJCYXNlIHtcblxuXHQvKipcblx0ICogV3JpdGVzIGEgbG9nIG1lc3NhZ2UuXG5cdCAqIEBwYXJhbSAge251bWJlcn0gbGV2ZWwgICBUaGUgbG9nIGxldmVsLlxuXHQgKiBAcGFyYW0gIHtzdHJpbmd8RXJyb3J9IG1lc3NhZ2UgTWVzc2FnZSB0byB3cml0ZS5cblx0ICovXG5cdC8qIGVzbGludCBuby1jb25zb2xlOiAwICovXG5cdHdyaXRlKGxldmVsLCBtZXNzYWdlKSB7XG5cdFx0aWYgKGxldmVsIDwgdGhpcy5fbGV2ZWwpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAobGV2ZWwgPj0gNTApIHtcblx0XHRcdGNvbnN0IGVycm9yTWVzc2FnZSA9IG1lc3NhZ2UgaW5zdGFuY2VvZiBFcnJvciA/XG5cdFx0XHRcdGAke21lc3NhZ2UubmFtZX06ICR7bWVzc2FnZS5tZXNzYWdlfVxcbiR7bWVzc2FnZS5zdGFja31gIDpcblx0XHRcdFx0bWVzc2FnZTtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3JNZXNzYWdlKTtcblx0XHR9IGVsc2UgaWYgKGxldmVsID49IDQwKSB7XG5cdFx0XHRjb25zb2xlLndhcm4obWVzc2FnZSk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCA+PSAzMCkge1xuXHRcdFx0Y29uc29sZS5pbmZvKG1lc3NhZ2UpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLmxvZyhtZXNzYWdlKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogV3JhcHMgdGhlIGV2ZW50IGJ1cyB3aXRoIGxvZyBtZXNzYWdlcy5cblx0ICogQHBhcmFtICB7RXZlbnRFbWl0dGVyfSBldmVudEJ1cyBUaGUgZXZlbnQgYnVzIHRvIHdyYXAuXG5cdCAqL1xuXHR3cmFwRXZlbnRCdXMoZXZlbnRCdXMpIHtcblx0XHRzdXBlci53cmFwRXZlbnRCdXMoZXZlbnRCdXMpO1xuXG5cdFx0Y29uc3Qgd2luZG93ID0gdGhpcy5fbG9jYXRvci5yZXNvbHZlKCd3aW5kb3cnKTtcblxuXHRcdHdpbmRvdy5vbmVycm9yID0gKG1zZywgdXJpLCBsaW5lKSA9PiB7XG5cdFx0XHR0aGlzLmZhdGFsKGAke3VyaX06JHtsaW5lfSAke21zZ31gKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH07XG5cblx0XHRpZiAodGhpcy5fbGV2ZWwgPiAyMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGV2ZW50QnVzXG5cdFx0XHQub24oJ2RvY3VtZW50VXBkYXRlZCcsIGFyZ3MgPT5cblx0XHRcdFx0dGhpcy5kZWJ1ZyhgRG9jdW1lbnQgdXBkYXRlZCAoJHthcmdzLmxlbmd0aH0gc3RvcmUocykgY2hhbmdlZClgKSlcblx0XHRcdC5vbignY29tcG9uZW50Qm91bmQnLCBhcmdzID0+IHtcblx0XHRcdFx0Y29uc3QgaWQgPSBhcmdzLmlkID8gYCMke2FyZ3MuaWR9YCA6ICcnO1xuXHRcdFx0XHR0aGlzLmRlYnVnKGBDb21wb25lbnQgXCIke2FyZ3MuZWxlbWVudC50YWdOYW1lfSR7aWR9XCIgaXMgYm91bmRgKTtcblx0XHRcdH0pXG5cdFx0XHQub24oJ2NvbXBvbmVudFVuYm91bmQnLCBhcmdzID0+IHtcblx0XHRcdFx0Y29uc3QgaWQgPSBhcmdzLmlkID8gYCMke2FyZ3MuaWR9YCA6ICcnO1xuXHRcdFx0XHR0aGlzLmRlYnVnKGBDb21wb25lbnQgXCIke2FyZ3MuZWxlbWVudC50YWdOYW1lfSR7aWR9XCIgaXMgdW5ib3VuZGApO1xuXHRcdFx0fSk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMb2dnZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IERFRkFVTFRfTEVWRUwgPSAzMDtcbmNvbnN0IERFRkFVTFRfTkFNRSA9ICdjYXRiZXJyeSc7XG5cbmNvbnN0IHByZXR0eUhyVGltZSA9IHJlcXVpcmUoJ3ByZXR0eS1ocnRpbWUnKTtcblxuY2xhc3MgTG9nZ2VyQmFzZSB7XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgYmFzaWMgdGhpcy5cblx0ICogQHBhcmFtICB7U2VydmljZUxvY2F0b3J9IGxvY2F0b3IgTG9jYXRvciBmb3IgcmVzb2x2aW5nIGRlcGVuZGVuY2llcy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGxvY2F0b3IpIHtcblx0XHRjb25zdCBjb25maWcgPSBsb2NhdG9yLnJlc29sdmUoJ2NvbmZpZycpLmxvZ2dlciB8fCB7fTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgU2VydmljZSBMb2NhdG9yLlxuXHRcdCAqIEB0eXBlIHtTZXJ2aWNlTG9jYXRvcn1cblx0XHQgKiBAcHJvdGVjdGVkXG5cdFx0ICovXG5cdFx0dGhpcy5fbG9jYXRvciA9IGxvY2F0b3I7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IGxvZ2dpbmcgbGV2ZWwuXG5cdFx0ICogQHR5cGUge251bWJlcn1cblx0XHQgKiBAcHJvdGVjdGVkXG5cdFx0ICovXG5cdFx0dGhpcy5fbGV2ZWwgPSB0eXBlb2YgKGNvbmZpZy5sZXZlbCkgPT09ICdudW1iZXInID8gY29uZmlnLmxldmVsIDogREVGQVVMVF9MRVZFTDtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgbG9nZ2VyIG5hbWUuXG5cdFx0ICogQHR5cGUge3N0cmluZ31cblx0XHQgKiBAcHJvdGVjdGVkXG5cdFx0ICovXG5cdFx0dGhpcy5fbmFtZSA9IHR5cGVvZiAoY29uZmlnLm5hbWUpID09PSAnc3RyaW5nJyA/IGNvbmZpZy5uYW1lIDogREVGQVVMVF9OQU1FO1xuXG5cdFx0Y29uc3QgZXZlbnRCdXMgPSBsb2NhdG9yLnJlc29sdmUoJ2V2ZW50QnVzJyk7XG5cdFx0dGhpcy53cmFwRXZlbnRCdXMoZXZlbnRCdXMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIExvZ3MgYSB0cmFjZSBtZXNzYWdlLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgbWVzc2FnZSB0byB3cml0ZS5cblx0ICovXG5cdHRyYWNlKG1lc3NhZ2UpIHtcblx0XHR0aGlzLndyaXRlKDEwLCBtZXNzYWdlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBMb2dzIGEgZGVidWcgbWVzc2FnZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gd3JpdGUuXG5cdCAqL1xuXHRkZWJ1ZyhtZXNzYWdlKSB7XG5cdFx0dGhpcy53cml0ZSgyMCwgbWVzc2FnZSk7XG5cdH1cblxuXHQvKipcblx0ICogTG9ncyBhbiBpbmZvIG1lc3NhZ2UuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIHdyaXRlLlxuXHQgKi9cblx0aW5mbyhtZXNzYWdlKSB7XG5cdFx0dGhpcy53cml0ZSgzMCwgbWVzc2FnZSk7XG5cdH1cblxuXHQvKipcblx0ICogTG9ncyBhIHdhcm5pbmcgbWVzc2FnZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gd3JpdGUuXG5cdCAqL1xuXHR3YXJuKG1lc3NhZ2UpIHtcblx0XHR0aGlzLndyaXRlKDQwLCBtZXNzYWdlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBMb2dzIGFuIGVycm9yIG1lc3NhZ2UuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfEVycm9yfSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIHdyaXRlLlxuXHQgKi9cblx0ZXJyb3IobWVzc2FnZSkge1xuXHRcdHRoaXMud3JpdGUoNTAsIG1lc3NhZ2UpO1xuXHR9XG5cblx0LyoqXG5cdCAqIExvZ3MgYSBmYXRhbCBlcnJvciBtZXNzYWdlLlxuXHQgKiBAcGFyYW0ge3N0cmluZ3xFcnJvcn0gbWVzc2FnZSBUaGUgbWVzc2FnZSB0byB3cml0ZS5cblx0ICovXG5cdGZhdGFsKG1lc3NhZ2UpIHtcblx0XHR0aGlzLndyaXRlKDYwLCBtZXNzYWdlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXcmFwcyB0aGUgZXZlbnQgYnVzIHdpdGggbG9nIG1lc3NhZ2VzLlxuXHQgKiBAcGFyYW0gIHtFdmVudEVtaXR0ZXJ9IGV2ZW50QnVzIFRoZSBldmVudCBidXMgdG8gd3JhcC5cblx0ICovXG5cdHdyYXBFdmVudEJ1cyhldmVudEJ1cykge1xuXHRcdGlmICh0aGlzLl9sZXZlbCA+IDUwKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGV2ZW50QnVzLm9uKCdlcnJvcicsIGVycm9yID0+IHRoaXMuZXJyb3IoZXJyb3IpKTtcblxuXHRcdGlmICh0aGlzLl9sZXZlbCA+IDQwKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGV2ZW50QnVzLm9uKCd3YXJuJywgbXNnID0+IHRoaXMud2Fybihtc2cpKTtcblxuXHRcdGlmICh0aGlzLl9sZXZlbCA+IDMwKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0ZXZlbnRCdXNcblx0XHRcdC5vbignaW5mbycsIG1zZyA9PiB0aGlzLmluZm8obXNnKSlcblx0XHRcdC5vbignY29tcG9uZW50TG9hZGVkJywgYXJncyA9PiB0aGlzLmluZm8oYENvbXBvbmVudCBcIiR7YXJncy5uYW1lfVwiIGxvYWRlZGApKVxuXHRcdFx0Lm9uKCdzdG9yZUxvYWRlZCcsIGFyZ3MgPT4gdGhpcy5pbmZvKGBTdG9yZSBcIiR7YXJncy5uYW1lfVwiIGxvYWRlZGApKVxuXHRcdFx0Lm9uKCdhbGxTdG9yZXNMb2FkZWQnLCAoKSA9PiB0aGlzLmluZm8oJ0FsbCBzdG9yZXMgbG9hZGVkJykpXG5cdFx0XHQub24oJ2FsbENvbXBvbmVudHNMb2FkZWQnLCAoKSA9PiB0aGlzLmluZm8oJ0FsbCBjb21wb25lbnRzIGxvYWRlZCcpKTtcblxuXHRcdGlmICh0aGlzLl9sZXZlbCA+IDIwKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0ZXZlbnRCdXNcblx0XHRcdC5vbignZGVidWcnLCBtc2cgPT4gdGhpcy5kZWJ1Zyhtc2cpKVxuXHRcdFx0Lm9uKCdjb21wb25lbnRSZW5kZXInLCBhcmdzID0+IHtcblx0XHRcdFx0Y29uc3QgaWQgPSBnZXRJZChhcmdzLmNvbnRleHQpO1xuXHRcdFx0XHRjb25zdCB0YWdOYW1lID0gZ2V0VGFnTmFtZUZvckNvbXBvbmVudE5hbWUoYXJncy5uYW1lKTtcblx0XHRcdFx0dGhpcy5kZWJ1ZyhgQ29tcG9uZW50IFwiJHt0YWdOYW1lfSR7aWR9XCIgaXMgYmVpbmcgcmVuZGVyZWQuLi5gKTtcblx0XHRcdH0pXG5cdFx0XHQub24oJ2NvbXBvbmVudFJlbmRlcmVkJywgYXJncyA9PiB7XG5cdFx0XHRcdGNvbnN0IGlkID0gZ2V0SWQoYXJncy5jb250ZXh0KTtcblx0XHRcdFx0Y29uc3QgdGFnTmFtZSA9IGdldFRhZ05hbWVGb3JDb21wb25lbnROYW1lKGFyZ3MubmFtZSk7XG5cdFx0XHRcdGNvbnN0IHRpbWUgPSBBcnJheS5pc0FycmF5KGFyZ3MuaHJUaW1lKSA/XG5cdFx0XHRcdFx0YCAoJHtwcmV0dHlIclRpbWUoYXJncy5oclRpbWUpfSlgIDogJyc7XG5cdFx0XHRcdHRoaXMuZGVidWcoYENvbXBvbmVudCBcIiR7dGFnTmFtZX0ke2lkfVwiIHJlbmRlcmVkJHt0aW1lfWApO1xuXHRcdFx0fSlcblx0XHRcdC5vbignZG9jdW1lbnRSZW5kZXJlZCcsXG5cdFx0XHRcdGFyZ3MgPT4gdGhpcy5kZWJ1ZyhgRG9jdW1lbnQgcmVuZGVyZWQgZm9yIFVSSSAke2FyZ3MubG9jYXRpb24udG9TdHJpbmcoKX1gKSk7XG5cblx0XHRpZiAodGhpcy5fbGV2ZWwgPiAxMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGV2ZW50QnVzLm9uKCd0cmFjZScsIG1zZyA9PiB0aGlzLnRyYWNlKG1zZykpO1xuXHR9XG59XG5cbi8qKlxuICogR2V0cyBhbiBJRCBmb3IgbG9nZ2luZyBjb21wb25lbnQtcmVsYXRlZCBtZXNzYWdlcy5cbiAqIEBwYXJhbSAge09iamVjdH0gY29udGV4dCBUaGUgY29tcG9uZW50J3MgY29udGV4dC5cbiAqIEByZXR1cm4ge3N0cmluZ30gdGhlIElEIG9mIHRoZSBlbGVtZW50IHN0YXJ0aW5nIHdpdGggJyMnLlxuICovXG5mdW5jdGlvbiBnZXRJZChjb250ZXh0KSB7XG5cdGNvbnN0IGlkID0gY29udGV4dC5hdHRyaWJ1dGVzLmlkO1xuXHRyZXR1cm4gaWQgPyBgIyR7aWR9YCA6ICcnO1xufVxuXG4vKipcbiAqIEdldHMgYSB0YWcgbmFtZSBmb3IgYSBjb21wb25lbnQuXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGNvbXBvbmVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIGNvbXBvbmVudC5cbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHRhZyBuYW1lIG9mIHRoZSBjb21wb25lbnQuXG4gKi9cbmZ1bmN0aW9uIGdldFRhZ05hbWVGb3JDb21wb25lbnROYW1lKGNvbXBvbmVudE5hbWUpIHtcblx0aWYgKHR5cGVvZiAoY29tcG9uZW50TmFtZSkgIT09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuICcnO1xuXHR9XG5cdGNvbnN0IHVwcGVyQ29tcG9uZW50TmFtZSA9IGNvbXBvbmVudE5hbWUudG9VcHBlckNhc2UoKTtcblx0aWYgKGNvbXBvbmVudE5hbWUgPT09ICdIRUFEJykge1xuXHRcdHJldHVybiB1cHBlckNvbXBvbmVudE5hbWU7XG5cdH1cblx0aWYgKGNvbXBvbmVudE5hbWUgPT09ICdET0NVTUVOVCcpIHtcblx0XHRyZXR1cm4gJ0hUTUwnO1xuXHR9XG5cdHJldHVybiBgQ0FULSR7dXBwZXJDb21wb25lbnROYW1lfWA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTG9nZ2VyQmFzZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcHVnUnVudGltZVdyYXAgPSByZXF1aXJlKCdwdWctcnVudGltZS93cmFwJyk7XG5cbmNsYXNzIFRlbXBsYXRlUHJvdmlkZXIge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIG5ldyBpbnN0YW5jZSBvZiBQdWcgdGVtcGxhdGUgcHJvdmlkZXIuXG5cdCAqIEBwYXJhbSB7TG9jYXRvcn0gbG9jYXRvciBUaGUgc2VydmljZSBsb2NhdG9yIGZvciByZXNvbHZpbmcgZGVwZW5kZW5jaWVzLlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICovXG5cdGNvbnN0cnVjdG9yKGxvY2F0b3IpIHtcblx0XHRjb25zdCBjb25maWcgPSBsb2NhdG9yLnJlc29sdmUoJ2NvbmZpZycpIHx8IHt9O1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBQdWcgZmFjdG9yeS5cblx0XHQgKiBAdHlwZSB7UHVnfVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fcHVnID0gbG9jYXRvci5yZXNvbHZlKCdwdWcnKTtcblxuXHRcdHRoaXMuX21lcmdlID0gdGhpcy5fcHVnLm1lcmdlO1xuXG5cdFx0LyoqXG5cdFx0ICogQ29uZmlnIGZvciBQdWdcblx0XHQgKlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fcHVnT3B0aW9ucyA9IGNvbmZpZy5wdWdPcHRpb25zIHx8IHt9O1xuXG5cdFx0LyoqXG5cdFx0ICogVGVtcGxhdGUgcHJvdmlkZXIgZ2xvYmFsc1xuXHRcdCAqXG5cdFx0ICogQHB1YmxpY1xuXHRcdCAqL1xuXHRcdHRoaXMuZ2xvYmFscyA9IGNvbmZpZy50ZW1wbGF0ZSAmJiBjb25maWcudGVtcGxhdGUuZ2xvYmFscyA/IGNvbmZpZy50ZW1wbGF0ZS5nbG9iYWxzIDoge307XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHNldCBvZiByZWdpc3RlcmVkIHRlbXBsYXRlcy5cblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fdGVtcGxhdGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSB0ZW1wbGF0ZSBwcm92aWRlciBuYW1lIGZvciBpZGVudGlmaWNhdGlvbi5cblx0ICogQHJldHVybnMge3N0cmluZ30gTmFtZSBvZiB0aGUgcHJvdmlkZXIuXG5cdCAqL1xuXHRnZXROYW1lKCkge1xuXHRcdHJldHVybiAncHVnJztcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlcnMgY29tcGlsZWQgKHByZWNvbXBpbGVkKSBQdWcgdGVtcGxhdGUuXG5cdCAqIGh0dHA6Ly9wdWdqcy5jb20vcmVmZXJlbmNlLmh0bWxcblx0ICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGVtcGxhdGUgbmFtZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGNvbXBpbGVkIENvbXBpbGVkIHRlbXBsYXRlIHNvdXJjZS5cblx0ICovXG5cdHJlZ2lzdGVyQ29tcGlsZWQobmFtZSwgY29tcGlsZWQpIHtcblx0XHR0aGlzLl90ZW1wbGF0ZXNbbmFtZV0gPSBwdWdSdW50aW1lV3JhcChjb21waWxlZCk7XG5cdH1cblxuXHQvKipcblx0ICogUmVuZGVycyB0ZW1wbGF0ZSB3aXRoIHNwZWNpZmllZCBkYXRhLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBOYW1lIG9mIHRlbXBsYXRlLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBEYXRhIGNvbnRleHQgZm9yIHRlbXBsYXRlLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZTxzdHJpbmc+fSBQcm9taXNlIGZvciByZW5kZXJlZCBIVE1MLlxuXHQgKi9cblx0cmVuZGVyKG5hbWUsIGRhdGEpIHtcblx0XHRpZiAoIShuYW1lIGluIHRoaXMuX3RlbXBsYXRlcykpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYFwiJHtuYW1lfVwiIG5vdCBmb3VuZCBhbW9uZyByZWdpc3RlcmVkIHRlbXBsYXRlc2ApKTtcblx0XHR9XG5cdFx0bGV0IHByb21pc2U7XG5cdFx0dHJ5IHtcblxuXHRcdFx0LyogU2tpcCBtZXJnZSBpZiBnbG9iYWxzIGRvZXNuJ3QgZXhpc3QgKi9cblx0XHRcdGNvbnN0IG1lcmdlZERhdGEgPSB0aGlzLmdsb2JhbHMgPyB0aGlzLl9tZXJnZSh0aGlzLl9tZXJnZSh7fSwgdGhpcy5nbG9iYWxzKSwgZGF0YSB8fCB7fSkgOiBkYXRhO1xuXHRcdFx0cHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSh0aGlzLl90ZW1wbGF0ZXNbbmFtZV0obWVyZ2VkRGF0YSkpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdHByb21pc2UgPSBQcm9taXNlLnJlamVjdChlKTtcblx0XHR9XG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUZW1wbGF0ZVByb3ZpZGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJ3B1Zy1ydW50aW1lJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFVIUkJhc2UgPSByZXF1aXJlKCcuLi9saWIvVUhSQmFzZScpO1xuXG5jb25zdCBOT05fU0FGRV9IRUFERVJTID0ge1xuXHRjb29raWU6IHRydWUsXG5cdCdhY2NlcHQtY2hhcnNldCc6IHRydWVcbn07XG5cbmNsYXNzIFVIUiBleHRlbmRzIFVIUkJhc2Uge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBjbGllbnQtc2lkZSBIVFRQKFMpIHJlcXVlc3QgaW1wbGVtZW50YXRpb24uXG5cdCAqIEBwYXJhbSB7U2VydmljZUxvY2F0b3J9IGxvY2F0b3IgVGhlIHNlcnZpY2UgbG9jYXRvciBmb3IgcmVzb2x2aW5nIGRlcGVuZGVuY2llcy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGxvY2F0b3IpIHtcblx0XHRzdXBlcigpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBpbnN0YW5jZSBvZiB3aW5kb3cuXG5cdFx0ICogQHR5cGUge1dpbmRvd31cblx0XHQgKi9cblx0XHR0aGlzLndpbmRvdyA9IGxvY2F0b3IucmVzb2x2ZSgnd2luZG93Jyk7XG5cdH1cblxuXHQvKipcblx0ICogRG9lcyByZXF1ZXN0IHdpdGggc3BlY2lmaWVkIHBhcmFtZXRlcnMgdXNpbmcgcHJvdG9jb2wgaW1wbGVtZW50YXRpb24uXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gcGFyYW1ldGVycyBUaGUgcmVxdWVzdCBwYXJhbWV0ZXJzLlxuXHQgKiBAcGFyYW0ge3N0cmluZz99IHBhcmFtZXRlcnMubWV0aG9kIFRoZSBIVFRQIG1ldGhvZCBmb3IgdGhlIHJlcXVlc3QuXG5cdCAqIEBwYXJhbSB7c3RyaW5nP30gcGFyYW1ldGVycy51cmwgVGhlIFVSTCBmb3IgdGhlIHJlcXVlc3QuXG5cdCAqIEBwYXJhbSB7VVJJfSBwYXJhbWV0ZXJzLnVyaSBUaGUgVVJJIG9iamVjdC5cblx0ICogQHBhcmFtIHtPYmplY3Q/fSBwYXJhbWV0ZXJzLmhlYWRlcnMgVGhlIEhUVFAgaGVhZGVycyB0byBzZW5kLlxuXHQgKiBAcGFyYW0geyhzdHJpbmd8T2JqZWN0KT99IHBhcmFtZXRlcnMuZGF0YSBUaGUgZGF0YSB0byBzZW5kLlxuXHQgKiBAcGFyYW0ge251bWJlcj99IHBhcmFtZXRlcnMudGltZW91dCBUaGUgcmVxdWVzdCB0aW1lb3V0LlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW4/fSBwYXJhbWV0ZXJzLnVuc2FmZUhUVFBTIElmIHRydWUgdGhlbiByZXF1ZXN0cyB0byBzZXJ2ZXJzIHdpdGhcblx0ICogaW52YWxpZCBIVFRQUyBjZXJ0aWZpY2F0ZXMgYXJlIGFsbG93ZWQuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlPE9iamVjdD59IFByb21pc2UgZm9yIHRoZSByZXN1bHQgd2l0aCBhIHN0YXR1cyBvYmplY3QgYW5kIGNvbnRlbnQuXG5cdCAqL1xuXHRfZG9SZXF1ZXN0KHBhcmFtZXRlcnMpIHtcblx0XHRPYmplY3Qua2V5cyhwYXJhbWV0ZXJzLmhlYWRlcnMpXG5cdFx0XHQuZm9yRWFjaChuYW1lID0+IHtcblx0XHRcdFx0aWYgKE5PTl9TQUZFX0hFQURFUlMuaGFzT3duUHJvcGVydHkobmFtZS50b0xvd2VyQ2FzZSgpKSkge1xuXHRcdFx0XHRcdGRlbGV0ZSBwYXJhbWV0ZXJzLmhlYWRlcnNbbmFtZV07XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcblx0XHRcdGNvbnN0IHhociA9IG5ldyB0aGlzLndpbmRvdy5YTUxIdHRwUmVxdWVzdCgpO1xuXHRcdFx0dmFyIHJlcXVlc3RFcnJvciA9IG51bGw7XG5cblx0XHRcdHhoci5vbmFib3J0ID0gKCkgPT4ge1xuXHRcdFx0XHRyZXF1ZXN0RXJyb3IgPSBuZXcgRXJyb3IoJ1JlcXVlc3QgYWJvcnRlZCcpO1xuXHRcdFx0XHRyZWplY3QocmVxdWVzdEVycm9yKTtcblx0XHRcdH07XG5cdFx0XHR4aHIub250aW1lb3V0ID0gKCkgPT4ge1xuXHRcdFx0XHRyZXF1ZXN0RXJyb3IgPSBuZXcgRXJyb3IoJ1JlcXVlc3QgdGltZW91dCcpO1xuXHRcdFx0XHRyZWplY3QocmVxdWVzdEVycm9yKTtcblx0XHRcdH07XG5cdFx0XHR4aHIub25lcnJvciA9ICgpID0+IHtcblx0XHRcdFx0cmVxdWVzdEVycm9yID0gbmV3IEVycm9yKHhoci5zdGF0dXNUZXh0IHx8ICdDb25uZWN0aW9uIGVycm9yJyk7XG5cdFx0XHRcdHJlamVjdChyZXF1ZXN0RXJyb3IpO1xuXHRcdFx0fTtcblx0XHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG5cdFx0XHRcdGlmICh4aHIucmVhZHlTdGF0ZSAhPT0gNCkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocmVxdWVzdEVycm9yKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IHN0YXR1cyA9IHRoaXMuX2dldFN0YXR1c09iamVjdCh4aHIpO1xuXHRcdFx0XHRjb25zdCBjb250ZW50ID0gdGhpcy5jb252ZXJ0UmVzcG9uc2Uoc3RhdHVzLmhlYWRlcnMsIHhoci5yZXNwb25zZVRleHQpO1xuXHRcdFx0XHRmdWxmaWxsKHtcblx0XHRcdFx0XHRzdGF0dXMsXG5cdFx0XHRcdFx0Y29udGVudFxuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IHVzZXIgPSBwYXJhbWV0ZXJzLnVyaS5hdXRob3JpdHkudXNlckluZm8gP1xuXHRcdFx0XHRcdHBhcmFtZXRlcnMudXJpLmF1dGhvcml0eS51c2VySW5mby51c2VyIDogbnVsbDtcblx0XHRcdGNvbnN0IHBhc3N3b3JkID0gcGFyYW1ldGVycy51cmkuYXV0aG9yaXR5LnVzZXJJbmZvID9cblx0XHRcdFx0XHRwYXJhbWV0ZXJzLnVyaS5hdXRob3JpdHkudXNlckluZm8ucGFzc3dvcmQgOiBudWxsO1xuXHRcdFx0eGhyLm9wZW4oXG5cdFx0XHRcdHBhcmFtZXRlcnMubWV0aG9kLCBwYXJhbWV0ZXJzLnVyaS50b1N0cmluZygpLCB0cnVlLFxuXHRcdFx0XHR1c2VyIHx8IHVuZGVmaW5lZCwgcGFzc3dvcmQgfHwgdW5kZWZpbmVkXG5cdFx0XHQpO1xuXHRcdFx0eGhyLnRpbWVvdXQgPSBwYXJhbWV0ZXJzLnRpbWVvdXQ7XG5cblx0XHRcdGlmIChwYXJhbWV0ZXJzLndpdGhDcmVkZW50aWFscykge1xuXHRcdFx0XHR4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0T2JqZWN0LmtleXMocGFyYW1ldGVycy5oZWFkZXJzKVxuXHRcdFx0XHQuZm9yRWFjaChoZWFkZXJOYW1lID0+IHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlck5hbWUsIHBhcmFtZXRlcnMuaGVhZGVyc1toZWFkZXJOYW1lXSkpO1xuXG5cdFx0XHR4aHIuc2VuZChwYXJhbWV0ZXJzLmRhdGEpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIHN0YXR1cyBvYmplY3QgZm9yIHRoZSBzcGVjaWZpZWQgWEhSIG9iamVjdC5cblx0ICogQHBhcmFtIHtYbWxIdHRwUmVxdWVzdH0geGhyIFhIUiBvYmplY3QuXG5cdCAqIEByZXR1cm5zIHt7Y29kZTogbnVtYmVyLCB0ZXh0OiBzdHJpbmcsIGhlYWRlcnM6IE9iamVjdH19IFRoZSBzdGF0dXMgb2JqZWN0LlxuXHQgKi9cblx0X2dldFN0YXR1c09iamVjdCh4aHIpIHtcblx0XHRjb25zdCBoZWFkZXJzID0ge307XG5cblx0XHRpZiAoIXhocikge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0Y29kZTogMCxcblx0XHRcdFx0dGV4dDogJycsXG5cdFx0XHRcdGhlYWRlcnNcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0eGhyXG5cdFx0XHQuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKClcblx0XHRcdC5zcGxpdCgnXFxuJylcblx0XHRcdC5mb3JFYWNoKGhlYWRlciA9PiB7XG5cdFx0XHRcdGNvbnN0IGRlbGltaXRlckluZGV4ID0gaGVhZGVyLmluZGV4T2YoJzonKTtcblx0XHRcdFx0aWYgKGRlbGltaXRlckluZGV4IDw9IDApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc3QgaGVhZGVyTmFtZSA9IGhlYWRlclxuXHRcdFx0XHRcdC5zdWJzdHJpbmcoMCwgZGVsaW1pdGVySW5kZXgpXG5cdFx0XHRcdFx0LnRyaW0oKVxuXHRcdFx0XHRcdC50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRoZWFkZXJzW2hlYWRlck5hbWVdID0gaGVhZGVyXG5cdFx0XHRcdFx0LnN1YnN0cmluZyhkZWxpbWl0ZXJJbmRleCArIDEpXG5cdFx0XHRcdFx0LnRyaW0oKTtcblx0XHRcdH0pO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdC8vIGhhbmRsZSBJRTkgYnVnOiBodHRwOi8vZ29vLmdsL2lkc3BTclxuXHRcdFx0Y29kZTogeGhyLnN0YXR1cyA9PT0gMTIyMyA/IDIwNCA6IHhoci5zdGF0dXMsXG5cdFx0XHR0ZXh0OiB4aHIuc3RhdHVzID09PSAxMjIzID8gJ05vIENvbnRlbnQnIDogeGhyLnN0YXR1c1RleHQsXG5cdFx0XHRoZWFkZXJzXG5cdFx0fTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVIUjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgY2F0YmVycnlVcmkgPSByZXF1aXJlKCdjYXRiZXJyeS11cmknKTtcbmNvbnN0IFF1ZXJ5ID0gY2F0YmVycnlVcmkuUXVlcnk7XG5jb25zdCBVUkkgPSBjYXRiZXJyeVVyaS5VUkk7XG5cbmNvbnN0IERFRkFVTFRfVElNRU9VVCA9IDMwMDAwO1xuY29uc3QgSFRUUF9QUk9UT0NPTF9SRUdFWFAgPSAvXihodHRwKXM/JC9pO1xuXG4vLyBUaGlzIG1vZHVsZSB3ZXJlIGRldmVsb3BlZCB1c2luZyBIVFRQLzEuMXYyIFJGQyAyNjE2XG4vLyAoaHR0cDovL3d3dy53My5vcmcvUHJvdG9jb2xzL3JmYzI2MTYvKVxuY2xhc3MgVUhSQmFzZSB7XG5cblx0c3RhdGljIGdldCBNRVRIT0RTKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRHRVQ6ICdHRVQnLFxuXHRcdFx0SEVBRDogJ0hFQUQnLFxuXHRcdFx0UE9TVDogJ1BPU1QnLFxuXHRcdFx0UFVUOiAnUFVUJyxcblx0XHRcdFBBVENIOiAnUEFUQ0gnLFxuXHRcdFx0REVMRVRFOiAnREVMRVRFJyxcblx0XHRcdE9QVElPTlM6ICdPUFRJT05TJyxcblx0XHRcdFRSQUNFOiAnVFJBQ0UnLFxuXHRcdFx0Q09OTkVDVDogJ0NPTk5FQ1QnXG5cdFx0fTtcblx0fVxuXG5cdHN0YXRpYyBnZXQgVFlQRVMoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdFVSTF9FTkNPREVEOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcblx0XHRcdEpTT046ICdhcHBsaWNhdGlvbi9qc29uJyxcblx0XHRcdFBMQUlOX1RFWFQ6ICd0ZXh0L3BsYWluJyxcblx0XHRcdEhUTUw6ICd0ZXh0L2h0bWwnXG5cdFx0fTtcblx0fVxuXG5cdHN0YXRpYyBnZXQgQ0hBUlNFVCgpIHtcblx0XHRyZXR1cm4gJ1VURi04Jztcblx0fVxuXG5cdHN0YXRpYyBnZXQgREVGQVVMVF9HRU5FUkFMX0hFQURFUlMoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdEFjY2VwdDogYCR7VUhSQmFzZS5UWVBFUy5KU09OfTsgcT0wLjcsICR7VUhSQmFzZS5UWVBFUy5IVE1MfTsgcT0wLjIsICR7VUhSQmFzZS5UWVBFUy5QTEFJTl9URVhUfTsgcT0wLjFgLFxuXHRcdFx0J0FjY2VwdC1DaGFyc2V0JzogYCR7VUhSQmFzZS5DSEFSU0VUfTsgcT0xYFxuXHRcdH07XG5cdH1cblxuXHRzdGF0aWMgZ2V0IENIQVJTRVRfUEFSQU1FVEVSKCkge1xuXHRcdHJldHVybiBgOyBjaGFyc2V0PSR7VUhSQmFzZS5DSEFSU0VUfWA7XG5cdH1cblxuXHRzdGF0aWMgZ2V0IFVSTF9FTkNPREVEX0VOVElUWV9DT05URU5UX1RZUEUoKSB7XG5cdFx0cmV0dXJuIFVIUkJhc2UuVFlQRVMuVVJMX0VOQ09ERUQgKyBVSFJCYXNlLkNIQVJTRVRfUEFSQU1FVEVSO1xuXHR9XG5cblx0c3RhdGljIGdldCBKU09OX0VOVElUWV9DT05URU5UX1RZUEUoKSB7XG5cdFx0cmV0dXJuIFVIUkJhc2UuVFlQRVMuSlNPTiArIFVIUkJhc2UuQ0hBUlNFVF9QQVJBTUVURVI7XG5cdH1cblxuXHRzdGF0aWMgZ2V0IFBMQUlOX1RFWFRfRU5USVRZX0NPTlRFTlRfVFlQRSgpIHtcblx0XHRyZXR1cm4gVUhSQmFzZS5UWVBFUy5QTEFJTl9URVhUICsgVUhSQmFzZS5DSEFSU0VUX1BBUkFNRVRFUjtcblx0fVxuXG5cdC8qKlxuXHQgKiBEb2VzIGEgR0VUIHJlcXVlc3QgdG8gdGhlIEhUVFAgc2VydmVyLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdXJsIFVSTCB0byByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge09iamVjdD99IHBhcmFtZXRlcnMgVGhlIHJlcXVlc3QgcGFyYW1ldGVycy5cblx0ICogQHBhcmFtIHtPYmplY3Q/fSBwYXJhbWV0ZXJzLmhlYWRlcnMgVGhlIEhUVFAgaGVhZGVycyB0byBzZW5kLlxuXHQgKiBAcGFyYW0geyhzdHJpbmd8T2JqZWN0KT99IHBhcmFtZXRlcnMuZGF0YSBUaGUgZGF0YSB0byBzZW5kLlxuXHQgKiBAcGFyYW0ge251bWJlcj99IHBhcmFtZXRlcnMudGltZW91dCBUaGUgcmVxdWVzdCB0aW1lb3V0LlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW4/fSBwYXJhbWV0ZXJzLnVuc2FmZUhUVFBTIElmIHRydWUgdGhlbiByZXF1ZXN0cyB0byBzZXJ2ZXJzIHdpdGhcblx0ICogaW52YWxpZCBIVFRQUyBjZXJ0aWZpY2F0ZXMgYXJlIGFsbG93ZWQuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlPE9iamVjdD59IFRoZSBwcm9taXNlIGZvciBhIHJlc3VsdCB3aXRoIHRoZSBzdGF0dXMgb2JqZWN0IGFuZCBjb250ZW50LlxuXHQgKi9cblx0Z2V0KHVybCwgcGFyYW1ldGVycykge1xuXHRcdHJldHVybiB0aGlzLnJlcXVlc3QodGhpcy5fbm9ybWFsaXplT3B0aW9ucyhVSFJCYXNlLk1FVEhPRFMuR0VULCB1cmwsIHBhcmFtZXRlcnMpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEb2VzIGEgUE9TVCByZXF1ZXN0IHRvIHRoZSBIVFRQIHNlcnZlci5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHVybCBVUkwgdG8gcmVxdWVzdC5cblx0ICogQHBhcmFtIHtPYmplY3Q/fSBwYXJhbWV0ZXJzIFRoZSByZXF1ZXN0IHBhcmFtZXRlcnMuXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gcGFyYW1ldGVycy5oZWFkZXJzIFRoZSBIVFRQIGhlYWRlcnMgdG8gc2VuZC5cblx0ICogQHBhcmFtIHsoc3RyaW5nfE9iamVjdCk/fSBwYXJhbWV0ZXJzLmRhdGEgVGhlIGRhdGEgdG8gc2VuZC5cblx0ICogQHBhcmFtIHtudW1iZXI/fSBwYXJhbWV0ZXJzLnRpbWVvdXQgVGhlIHJlcXVlc3QgdGltZW91dC5cblx0ICogQHBhcmFtIHtib29sZWFuP30gcGFyYW1ldGVycy51bnNhZmVIVFRQUyBJZiB0cnVlIHRoZW4gcmVxdWVzdHMgdG8gc2VydmVycyB3aXRoXG5cdCAqIGludmFsaWQgSFRUUFMgY2VydGlmaWNhdGVzIGFyZSBhbGxvd2VkLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZTxPYmplY3Q+fSBUaGUgcHJvbWlzZSBmb3IgYSByZXN1bHQgd2l0aCB0aGUgc3RhdHVzIG9iamVjdCBhbmQgY29udGVudC5cblx0ICovXG5cdHBvc3QodXJsLCBwYXJhbWV0ZXJzKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVxdWVzdCh0aGlzLl9ub3JtYWxpemVPcHRpb25zKFVIUkJhc2UuTUVUSE9EUy5QT1NULCB1cmwsIHBhcmFtZXRlcnMpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEb2VzIGEgUFVUIHJlcXVlc3QgdG8gdGhlIEhUVFAgc2VydmVyLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdXJsIFVSTCB0byByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge09iamVjdD99IHBhcmFtZXRlcnMgVGhlIHJlcXVlc3QgcGFyYW1ldGVycy5cblx0ICogQHBhcmFtIHtPYmplY3Q/fSBwYXJhbWV0ZXJzLmhlYWRlcnMgVGhlIEhUVFAgaGVhZGVycyB0byBzZW5kLlxuXHQgKiBAcGFyYW0geyhzdHJpbmd8T2JqZWN0KT99IHBhcmFtZXRlcnMuZGF0YSBUaGUgZGF0YSB0byBzZW5kLlxuXHQgKiBAcGFyYW0ge251bWJlcj99IHBhcmFtZXRlcnMudGltZW91dCBUaGUgcmVxdWVzdCB0aW1lb3V0LlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW4/fSBwYXJhbWV0ZXJzLnVuc2FmZUhUVFBTIElmIHRydWUgdGhlbiByZXF1ZXN0cyB0byBzZXJ2ZXJzIHdpdGhcblx0ICogaW52YWxpZCBIVFRQUyBjZXJ0aWZpY2F0ZXMgYXJlIGFsbG93ZWQuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlPE9iamVjdD59IFRoZSBwcm9taXNlIGZvciBhIHJlc3VsdCB3aXRoIHRoZSBzdGF0dXMgb2JqZWN0IGFuZCBjb250ZW50LlxuXHQgKi9cblx0cHV0KHVybCwgcGFyYW1ldGVycykge1xuXHRcdHJldHVybiB0aGlzLnJlcXVlc3QodGhpcy5fbm9ybWFsaXplT3B0aW9ucyhVSFJCYXNlLk1FVEhPRFMuUFVULCB1cmwsIHBhcmFtZXRlcnMpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEb2VzIGEgUEFUQ0ggcmVxdWVzdCB0byB0aGUgSFRUUCBzZXJ2ZXIuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVVJMIHRvIHJlcXVlc3QuXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gcGFyYW1ldGVycyBUaGUgcmVxdWVzdCBwYXJhbWV0ZXJzLlxuXHQgKiBAcGFyYW0ge09iamVjdD99IHBhcmFtZXRlcnMuaGVhZGVycyBUaGUgSFRUUCBoZWFkZXJzIHRvIHNlbmQuXG5cdCAqIEBwYXJhbSB7KHN0cmluZ3xPYmplY3QpP30gcGFyYW1ldGVycy5kYXRhIFRoZSBkYXRhIHRvIHNlbmQuXG5cdCAqIEBwYXJhbSB7bnVtYmVyP30gcGFyYW1ldGVycy50aW1lb3V0IFRoZSByZXF1ZXN0IHRpbWVvdXQuXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbj99IHBhcmFtZXRlcnMudW5zYWZlSFRUUFMgSWYgdHJ1ZSB0aGVuIHJlcXVlc3RzIHRvIHNlcnZlcnMgd2l0aFxuXHQgKiBpbnZhbGlkIEhUVFBTIGNlcnRpZmljYXRlcyBhcmUgYWxsb3dlZC5cblx0ICogQHJldHVybnMge1Byb21pc2U8T2JqZWN0Pn0gVGhlIHByb21pc2UgZm9yIGEgcmVzdWx0IHdpdGggdGhlIHN0YXR1cyBvYmplY3QgYW5kIGNvbnRlbnQuXG5cdCAqL1xuXHRwYXRjaCh1cmwsIHBhcmFtZXRlcnMpIHtcblx0XHRyZXR1cm4gdGhpcy5yZXF1ZXN0KHRoaXMuX25vcm1hbGl6ZU9wdGlvbnMoVUhSQmFzZS5NRVRIT0RTLlBBVENILCB1cmwsIHBhcmFtZXRlcnMpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEb2VzIGEgREVMRVRFIHJlcXVlc3QgdG8gdGhlIEhUVFAgc2VydmVyLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdXJsIFVSTCB0byByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge09iamVjdD99IHBhcmFtZXRlcnMgVGhlIHJlcXVlc3QgcGFyYW1ldGVycy5cblx0ICogQHBhcmFtIHtPYmplY3Q/fSBwYXJhbWV0ZXJzLmhlYWRlcnMgVGhlIEhUVFAgaGVhZGVycyB0byBzZW5kLlxuXHQgKiBAcGFyYW0geyhzdHJpbmd8T2JqZWN0KT99IHBhcmFtZXRlcnMuZGF0YSBUaGUgZGF0YSB0byBzZW5kLlxuXHQgKiBAcGFyYW0ge251bWJlcj99IHBhcmFtZXRlcnMudGltZW91dCBUaGUgcmVxdWVzdCB0aW1lb3V0LlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW4/fSBwYXJhbWV0ZXJzLnVuc2FmZUhUVFBTIElmIHRydWUgdGhlbiByZXF1ZXN0cyB0byBzZXJ2ZXJzIHdpdGhcblx0ICogaW52YWxpZCBIVFRQUyBjZXJ0aWZpY2F0ZXMgYXJlIGFsbG93ZWQuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlPE9iamVjdD59IFRoZSBwcm9taXNlIGZvciBhIHJlc3VsdCB3aXRoIHRoZSBzdGF0dXMgb2JqZWN0IGFuZCBjb250ZW50LlxuXHQgKi9cblx0ZGVsZXRlKHVybCwgcGFyYW1ldGVycykge1xuXHRcdHJldHVybiB0aGlzLnJlcXVlc3QodGhpcy5fbm9ybWFsaXplT3B0aW9ucyhVSFJCYXNlLk1FVEhPRFMuREVMRVRFLCB1cmwsIHBhcmFtZXRlcnMpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEb2VzIGEgcmVxdWVzdCB0byB0aGUgSFRUUCBzZXJ2ZXIuXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gcGFyYW1ldGVycyBUaGUgcmVxdWVzdCBwYXJhbWV0ZXJzLlxuXHQgKiBAcGFyYW0ge3N0cmluZz99IHBhcmFtZXRlcnMubWV0aG9kIFRoZSBIVFRQIG1ldGhvZCBmb3IgdGhlIHJlcXVlc3QuXG5cdCAqIEBwYXJhbSB7c3RyaW5nP30gcGFyYW1ldGVycy51cmwgVGhlIFVSTCBmb3IgdGhlIHJlcXVlc3QuXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gcGFyYW1ldGVycy5oZWFkZXJzIFRoZSBIVFRQIGhlYWRlcnMgdG8gc2VuZC5cblx0ICogQHBhcmFtIHsoc3RyaW5nfE9iamVjdCk/fSBwYXJhbWV0ZXJzLmRhdGEgVGhlIGRhdGEgdG8gc2VuZC5cblx0ICogQHBhcmFtIHtudW1iZXI/fSBwYXJhbWV0ZXJzLnRpbWVvdXQgVGhlIHJlcXVlc3QgdGltZW91dC5cblx0ICogQHBhcmFtIHtib29sZWFuP30gcGFyYW1ldGVycy51bnNhZmVIVFRQUyBJZiB0cnVlIHRoZW4gcmVxdWVzdHMgdG8gc2VydmVycyB3aXRoXG5cdCAqIGludmFsaWQgSFRUUFMgY2VydGlmaWNhdGVzIGFyZSBhbGxvd2VkLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZTxPYmplY3Q+fSBUaGUgcHJvbWlzZSBmb3IgYSByZXN1bHQgd2l0aCB0aGUgc3RhdHVzIG9iamVjdCBhbmQgY29udGVudC5cblx0ICovXG5cdHJlcXVlc3QocGFyYW1ldGVycykge1xuXHRcdHJldHVybiB0aGlzLl92YWxpZGF0ZVJlcXVlc3QocGFyYW1ldGVycylcblx0XHRcdC50aGVuKHZhbGlkYXRlZCA9PiB0aGlzLl9kb1JlcXVlc3QodmFsaWRhdGVkKSk7XG5cdH1cblxuXHQvKipcblx0ICogVmFsaWRhdGVzIFVIUiBwYXJhbWV0ZXJzLlxuXHQgKiBAcGFyYW0ge09iamVjdD99IHBhcmFtZXRlcnMgVGhlIHJlcXVlc3QgcGFyYW1ldGVycy5cblx0ICogQHBhcmFtIHtzdHJpbmc/fSBwYXJhbWV0ZXJzLm1ldGhvZCBUaGUgSFRUUCBtZXRob2QgZm9yIHRoZSByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge3N0cmluZz99IHBhcmFtZXRlcnMudXJsIFRoZSBVUkwgZm9yIHRoZSByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge09iamVjdD99IHBhcmFtZXRlcnMuaGVhZGVycyBUaGUgSFRUUCBoZWFkZXJzIHRvIHNlbmQuXG5cdCAqIEBwYXJhbSB7KHN0cmluZ3xPYmplY3QpP30gcGFyYW1ldGVycy5kYXRhIFRoZSBkYXRhIHRvIHNlbmQuXG5cdCAqIEBwYXJhbSB7bnVtYmVyP30gcGFyYW1ldGVycy50aW1lb3V0IFRoZSByZXF1ZXN0IHRpbWVvdXQuXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbj99IHBhcmFtZXRlcnMudW5zYWZlSFRUUFMgSWYgdHJ1ZSB0aGVuIHJlcXVlc3RzIHRvIHNlcnZlcnMgd2l0aFxuXHQgKiBpbnZhbGlkIEhUVFBTIGNlcnRpZmljYXRlcyBhcmUgYWxsb3dlZC5cblx0ICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgZm9yIHRoZSBmaW5pc2hlZCB3b3JrLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0LyogZXNsaW50IGNvbXBsZXhpdHk6IDAgKi9cblx0X3ZhbGlkYXRlUmVxdWVzdChwYXJhbWV0ZXJzKSB7XG5cdFx0aWYgKCFwYXJhbWV0ZXJzIHx8IHR5cGVvZiAocGFyYW1ldGVycykgIT09ICdvYmplY3QnKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdSZXF1ZXN0IHBhcmFtZXRlcnMgYXJndW1lbnQgc2hvdWxkIGJlIGFuIG9iamVjdCcpKTtcblx0XHR9XG5cblx0XHRjb25zdCB2YWxpZGF0ZWQgPSBPYmplY3QuY3JlYXRlKHBhcmFtZXRlcnMpO1xuXG5cdFx0aWYgKHR5cGVvZiAocGFyYW1ldGVycy51cmwpICE9PSAnc3RyaW5nJykge1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignXCJwYXJhbWV0ZXJzLnVybFwiIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJykpO1xuXHRcdH1cblxuXHRcdHZhbGlkYXRlZC51cmkgPSBuZXcgVVJJKHZhbGlkYXRlZC51cmwpO1xuXHRcdGlmICghdmFsaWRhdGVkLnVyaS5zY2hlbWUpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ1wicGFyYW1ldGVycy51cmxcIiBzaG91bGQgY29udGFpbiBhIHByb3RvY29sIChzY2hlbWUpJykpO1xuXHRcdH1cblx0XHRpZiAoIUhUVFBfUFJPVE9DT0xfUkVHRVhQLnRlc3QodmFsaWRhdGVkLnVyaS5zY2hlbWUpKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGBcIiR7dmFsaWRhdGVkLnVyaS5zY2hlbWV9XCIgcHJvdG9jb2wgKHNjaGVtZSkgaXMgdW5zdXBwb3J0ZWRgKSk7XG5cdFx0fVxuXHRcdGlmICghdmFsaWRhdGVkLnVyaS5hdXRob3JpdHkgfHwgIXZhbGlkYXRlZC51cmkuYXV0aG9yaXR5Lmhvc3QpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ1wicGFyYW1ldGVycy51cmxcIiBzaG91bGQgY29udGFpbiBhIGhvc3QnKSk7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgKHZhbGlkYXRlZC5tZXRob2QpICE9PSAnc3RyaW5nJyB8fFxuXHRcdFx0ISh2YWxpZGF0ZWQubWV0aG9kIGluIFVIUkJhc2UuTUVUSE9EUykpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ0hUVFAgbWV0aG9kIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJykpO1xuXHRcdH1cblxuXHRcdHZhbGlkYXRlZC50aW1lb3V0ID0gdmFsaWRhdGVkLnRpbWVvdXQgfHwgREVGQVVMVF9USU1FT1VUO1xuXHRcdGlmICh0eXBlb2YgKHZhbGlkYXRlZC50aW1lb3V0KSAhPT0gJ251bWJlcicpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ1RpbWVvdXQgc2hvdWxkIGJlIGEgbnVtYmVyJykpO1xuXHRcdH1cblxuXHRcdHZhbGlkYXRlZC5oZWFkZXJzID0gdGhpcy5jcmVhdGVIZWFkZXJzKHZhbGlkYXRlZC5oZWFkZXJzKTtcblxuXHRcdGlmICghdGhpcy5faXNVcHN0cmVhbVJlcXVlc3QocGFyYW1ldGVycy5tZXRob2QpICYmXG5cdFx0XHR2YWxpZGF0ZWQuZGF0YSAmJiB0eXBlb2YgKHZhbGlkYXRlZC5kYXRhKSA9PT0gJ29iamVjdCcpIHtcblxuXHRcdFx0Y29uc3QgZGF0YUtleXMgPSBPYmplY3Qua2V5cyh2YWxpZGF0ZWQuZGF0YSk7XG5cblx0XHRcdGlmIChkYXRhS2V5cy5sZW5ndGggPiAwICYmICF2YWxpZGF0ZWQudXJpLnF1ZXJ5KSB7XG5cdFx0XHRcdHZhbGlkYXRlZC51cmkucXVlcnkgPSBuZXcgUXVlcnkoJycpO1xuXHRcdFx0fVxuXG5cdFx0XHRkYXRhS2V5cy5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRcdHZhbGlkYXRlZC51cmkucXVlcnkudmFsdWVzW2tleV0gPSB2YWxpZGF0ZWQuZGF0YVtrZXldO1xuXHRcdFx0fSk7XG5cdFx0XHR2YWxpZGF0ZWQuZGF0YSA9IG51bGw7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGRhdGFBbmRIZWFkZXJzID0gdGhpcy5fZ2V0RGF0YVRvU2VuZCh2YWxpZGF0ZWQuaGVhZGVycywgdmFsaWRhdGVkLmRhdGEpO1xuXHRcdFx0dmFsaWRhdGVkLmhlYWRlcnMgPSBkYXRhQW5kSGVhZGVycy5oZWFkZXJzO1xuXHRcdFx0dmFsaWRhdGVkLmRhdGEgPSBkYXRhQW5kSGVhZGVycy5kYXRhO1xuXHRcdH1cblxuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsaWRhdGVkKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGRhdGEgZm9yIHNlbmRpbmcgdmlhIHRoZSBIVFRQIHJlcXVlc3QgdXNpbmcgXCJDb250ZW50IFR5cGVcIiBIVFRQIGhlYWRlci5cblx0ICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnMgVGhlIEhUVFAgaGVhZGVycy5cblx0ICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIHNlbmQuXG5cdCAqIEByZXR1cm5zIHt7aGVhZGVyczogT2JqZWN0LCBkYXRhOiBPYmplY3R8c3RyaW5nfX0gVGhlIGRhdGEgYW5kIGhlYWRlcnMgdG8gc2VuZC5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9nZXREYXRhVG9TZW5kKGhlYWRlcnMsIGRhdGEpIHtcblx0XHRjb25zdCBmb3VuZCA9IHRoaXMuX2ZpbmRDb250ZW50VHlwZShoZWFkZXJzKTtcblx0XHRjb25zdCBjb250ZW50VHlwZUhlYWRlciA9IGZvdW5kLm5hbWU7XG5cdFx0Y29uc3QgY29udGVudFR5cGUgPSBmb3VuZC50eXBlO1xuXG5cdFx0aWYgKCFkYXRhIHx8IHR5cGVvZiAoZGF0YSkgIT09ICdvYmplY3QnKSB7XG5cdFx0XHRkYXRhID0gZGF0YSA/IFN0cmluZyhkYXRhKSA6ICcnO1xuXHRcdFx0aWYgKCFjb250ZW50VHlwZSkge1xuXHRcdFx0XHRoZWFkZXJzW2NvbnRlbnRUeXBlSGVhZGVyXSA9IFVIUkJhc2UuUExBSU5fVEVYVF9FTlRJVFlfQ09OVEVOVF9UWVBFO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aGVhZGVycyxcblx0XHRcdFx0ZGF0YVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAoY29udGVudFR5cGUgPT09IFVIUkJhc2UuVFlQRVMuSlNPTikge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aGVhZGVycyxcblx0XHRcdFx0ZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSlcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Ly8gb3RoZXJ3aXNlIG9iamVjdCB3aWxsIGJlIHNlbnQgd2l0aFxuXHRcdC8vIGFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFxuXHRcdGhlYWRlcnNbY29udGVudFR5cGVIZWFkZXJdID0gVUhSQmFzZS5VUkxfRU5DT0RFRF9FTlRJVFlfQ09OVEVOVF9UWVBFO1xuXG5cdFx0Y29uc3QgcXVlcnkgPSBuZXcgUXVlcnkoKTtcblx0XHRxdWVyeS52YWx1ZXMgPSBkYXRhO1xuXHRcdHJldHVybiB7XG5cdFx0XHRoZWFkZXJzLFxuXHRcdFx0ZGF0YTogcXVlcnkudG9TdHJpbmcoKVxuXHRcdFx0XHQucmVwbGFjZSgvXFwrL2csICclMkInKVxuXHRcdFx0XHQucmVwbGFjZSgvJTIwL2csICcrJylcblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgSFRUUCBoZWFkZXJzIGZvciBhIHJlcXVlc3QgdXNpbmcgZGVmYXVsdHMgYW5kIGN1cnJlbnQgcGFyYW1ldGVycy5cblx0ICogQHBhcmFtIHtPYmplY3R9IHBhcmFtZXRlckhlYWRlcnMgVGhlIEhUVFAgaGVhZGVycyBmb3IgVUhSLlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHRjcmVhdGVIZWFkZXJzKHBhcmFtZXRlckhlYWRlcnMpIHtcblx0XHRpZiAoIXBhcmFtZXRlckhlYWRlcnMgfHwgdHlwZW9mIChwYXJhbWV0ZXJIZWFkZXJzKSAhPT0gJ29iamVjdCcpIHtcblx0XHRcdHBhcmFtZXRlckhlYWRlcnMgPSB7fTtcblx0XHR9XG5cblx0XHRjb25zdCBoZWFkZXJzID0ge307XG5cblx0XHRPYmplY3Qua2V5cyhVSFJCYXNlLkRFRkFVTFRfR0VORVJBTF9IRUFERVJTKVxuXHRcdFx0LmZvckVhY2goaGVhZGVyTmFtZSA9PiB7XG5cdFx0XHRcdGhlYWRlcnNbaGVhZGVyTmFtZV0gPSBVSFJCYXNlLkRFRkFVTFRfR0VORVJBTF9IRUFERVJTW2hlYWRlck5hbWVdO1xuXHRcdFx0fSk7XG5cblx0XHRPYmplY3Qua2V5cyhwYXJhbWV0ZXJIZWFkZXJzKVxuXHRcdFx0LmZvckVhY2goaGVhZGVyTmFtZSA9PiB7XG5cdFx0XHRcdGlmIChwYXJhbWV0ZXJIZWFkZXJzW2hlYWRlck5hbWVdID09PSBudWxsIHx8XG5cdFx0XHRcdFx0cGFyYW1ldGVySGVhZGVyc1toZWFkZXJOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIGhlYWRlcnNbaGVhZGVyTmFtZV07XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGhlYWRlcnNbaGVhZGVyTmFtZV0gPSBwYXJhbWV0ZXJIZWFkZXJzW2hlYWRlck5hbWVdO1xuXHRcdFx0fSk7XG5cblx0XHRyZXR1cm4gaGVhZGVycztcblx0fVxuXG5cdC8qKlxuXHQgKiBEb2VzIHJlcXVlc3Qgd2l0aCBzcGVjaWZpZWQgcGFyYW1ldGVycyB1c2luZyBwcm90b2NvbCBpbXBsZW1lbnRhdGlvbi5cblx0ICogQHBhcmFtIHtPYmplY3Q/fSBwYXJhbWV0ZXJzIFRoZSByZXF1ZXN0IHBhcmFtZXRlcnMuXG5cdCAqIEBwYXJhbSB7c3RyaW5nP30gcGFyYW1ldGVycy5tZXRob2QgVGhlIEhUVFAgbWV0aG9kIGZvciB0aGUgcmVxdWVzdC5cblx0ICogQHBhcmFtIHtzdHJpbmc/fSBwYXJhbWV0ZXJzLnVybCBUaGUgVVJMIGZvciB0aGUgcmVxdWVzdC5cblx0ICogQHBhcmFtIHtVUkl9IHBhcmFtZXRlcnMudXJpIFRoZSBVUkkgb2JqZWN0LlxuXHQgKiBAcGFyYW0ge09iamVjdD99IHBhcmFtZXRlcnMuaGVhZGVycyBUaGUgSFRUUCBoZWFkZXJzIHRvIHNlbmQuXG5cdCAqIEBwYXJhbSB7KHN0cmluZ3xPYmplY3QpP30gcGFyYW1ldGVycy5kYXRhIFRoZSBkYXRhIHRvIHNlbmQuXG5cdCAqIEBwYXJhbSB7bnVtYmVyP30gcGFyYW1ldGVycy50aW1lb3V0IFRoZSByZXF1ZXN0IHRpbWVvdXQuXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbj99IHBhcmFtZXRlcnMudW5zYWZlSFRUUFMgSWYgdHJ1ZSB0aGVuIHJlcXVlc3RzIHRvIHNlcnZlcnMgd2l0aFxuXHQgKiBpbnZhbGlkIEhUVFBTIGNlcnRpZmljYXRlcyBhcmUgYWxsb3dlZC5cblx0ICogQHJldHVybnMge1Byb21pc2U8T2JqZWN0Pn0gUHJvbWlzZSBmb3IgdGhlIHJlc3VsdCB3aXRoIGEgc3RhdHVzIG9iamVjdCBhbmQgY29udGVudC5cblx0ICogQHByb3RlY3RlZFxuXHQgKiBAYWJzdHJhY3Rcblx0ICovXG5cdF9kb1JlcXVlc3QocGFyYW1ldGVycykgeyB9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIHJlc3BvbnNlIGRhdGEgYWNjb3JkaW5nIHRvIHRoZSBjb250ZW50IHR5cGUuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzIFRoZSBIVFRQIGhlYWRlcnMuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSByZXNwb25zZURhdGEgVGhlIGRhdGEgZnJvbSByZXNwb25zZS5cblx0ICogQHJldHVybnMge3N0cmluZ3xPYmplY3R9IFRoZSBjb252ZXJ0ZWQgZGF0YS5cblx0ICovXG5cdGNvbnZlcnRSZXNwb25zZShoZWFkZXJzLCByZXNwb25zZURhdGEpIHtcblx0XHRpZiAodHlwZW9mIChyZXNwb25zZURhdGEpICE9PSAnc3RyaW5nJykge1xuXHRcdFx0cmVzcG9uc2VEYXRhID0gJyc7XG5cdFx0fVxuXHRcdGNvbnN0IGZvdW5kID0gdGhpcy5fZmluZENvbnRlbnRUeXBlKGhlYWRlcnMpO1xuXHRcdGNvbnN0IGNvbnRlbnRUeXBlID0gZm91bmQudHlwZSB8fCBVSFJCYXNlLlRZUEVTLlBMQUlOX1RFWFQ7XG5cblx0XHRzd2l0Y2ggKGNvbnRlbnRUeXBlKSB7XG5cdFx0XHRjYXNlIFVIUkJhc2UuVFlQRVMuSlNPTjpcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRyZXR1cm4gSlNPTi5wYXJzZShyZXNwb25zZURhdGEpIHx8IHt9O1xuXHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHt9O1xuXHRcdFx0XHR9XG5cdFx0XHRjYXNlIFVIUkJhc2UuVFlQRVMuVVJMX0VOQ09ERUQ6XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Y29uc3QgcXVlcnkgPSBuZXcgUXVlcnkocmVzcG9uc2VEYXRhLnJlcGxhY2UoJysnLCAnJTIwJykpO1xuXHRcdFx0XHRcdHJldHVybiBxdWVyeS52YWx1ZXMgfHwge307XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRyZXR1cm4ge307XG5cdFx0XHRcdH1cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiByZXNwb25zZURhdGE7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIERldGVybWluZXMgaWYgdGhlIGN1cnJlbnQgcXVlcnkgbmVlZHMgdXNpbmcgdXBzdHJlYW0uXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgVGhlIEhUVFAgbWV0aG9kLlxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBjdXJyZW50IEhUVFAgbWV0aG9kIG5lZWRzIHVwc3RyZWFtIHVzYWdlLlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHRfaXNVcHN0cmVhbVJlcXVlc3QobWV0aG9kKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdG1ldGhvZCA9PT0gVUhSQmFzZS5NRVRIT0RTLlBPU1QgfHxcblx0XHRcdG1ldGhvZCA9PT0gVUhSQmFzZS5NRVRIT0RTLlBVVCB8fFxuXHRcdFx0bWV0aG9kID09PSBVSFJCYXNlLk1FVEhPRFMuUEFUQ0hcblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE5vcm1hbGl6ZXMgcGFyYW1ldGVycyBwYXNzZWQgdG8gYSByZXF1ZXN0IGZ1bmN0aW9uLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIFRoZSBIVFRQIG1ldGhvZC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHJlcXVlc3QuXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gcGFyYW1ldGVycyBUaGUgcmVxdWVzdCBwYXJhbWV0ZXJzLlxuXHQgKiBAcGFyYW0ge09iamVjdD99IHBhcmFtZXRlcnMuaGVhZGVycyBUaGUgSFRUUCBoZWFkZXJzIHRvIHNlbmQuXG5cdCAqIEBwYXJhbSB7KHN0cmluZ3xPYmplY3QpP30gcGFyYW1ldGVycy5kYXRhIFRoZSBkYXRhIHRvIHNlbmQuXG5cdCAqIEBwYXJhbSB7bnVtYmVyP30gcGFyYW1ldGVycy50aW1lb3V0IFRoZSByZXF1ZXN0IHRpbWVvdXQuXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbj99IHBhcmFtZXRlcnMudW5zYWZlSFRUUFMgSWYgdHJ1ZSB0aGVuIHJlcXVlc3RzIHRvIHNlcnZlcnMgd2l0aFxuXHQgKiBpbnZhbGlkIEhUVFBTIGNlcnRpZmljYXRlcyBhcmUgYWxsb3dlZC5cblx0ICogQHJldHVybiB7T2JqZWN0fSBUaGUgbm9ybWFsaXplZCBwYXJhbWV0ZXJzIG9iamVjdCB3aXRoIFVSTCBhbmQgbWV0aG9kXG5cdCAqL1xuXHRfbm9ybWFsaXplT3B0aW9ucyhtZXRob2QsIHVybCwgcGFyYW1ldGVycykge1xuXHRcdHBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJzIHx8IHt9O1xuXHRcdGNvbnN0IG5vcm1hbFBhcmFtZXRlcnMgPSBPYmplY3QuY3JlYXRlKHBhcmFtZXRlcnMpO1xuXHRcdG5vcm1hbFBhcmFtZXRlcnMubWV0aG9kID0gbWV0aG9kO1xuXHRcdG5vcm1hbFBhcmFtZXRlcnMudXJsID0gdXJsO1xuXHRcdHJldHVybiBub3JtYWxQYXJhbWV0ZXJzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZpbmRzIHRoZSBjb250ZW50IHR5cGUgaGVhZGVyIGluIHRoZSBoZWFkZXJzIG9iamVjdC5cblx0ICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnMgVGhlIEhUVFAgaGVhZGVycy5cblx0ICogQHJldHVybnMge3tuYW1lOiBzdHJpbmcsIHR5cGU6IHN0cmluZ319IFRoZSBuYW1lIG9mIHRoZSBoZWFkZXIgYW5kIHRoZSBjb250ZW50IHR5cGUuXG5cdCAqL1xuXHRfZmluZENvbnRlbnRUeXBlKGhlYWRlcnMpIHtcblx0XHR2YXIgY29udGVudFR5cGVTdHJpbmcgPSAnJztcblx0XHR2YXIgY29udGVudFR5cGVIZWFkZXIgPSAnQ29udGVudC1UeXBlJztcblxuXHRcdE9iamVjdC5rZXlzKGhlYWRlcnMpXG5cdFx0XHQuZm9yRWFjaChrZXkgPT4ge1xuXHRcdFx0XHRpZiAoa2V5LnRvTG93ZXJDYXNlKCkgIT09ICdjb250ZW50LXR5cGUnKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnRlbnRUeXBlSGVhZGVyID0ga2V5O1xuXHRcdFx0XHRjb250ZW50VHlwZVN0cmluZyA9IGhlYWRlcnNba2V5XTtcblx0XHRcdH0pO1xuXG5cdFx0Y29uc3QgdHlwZUFuZFBhcmFtZXRlcnMgPSBjb250ZW50VHlwZVN0cmluZy5zcGxpdCgnOycpO1xuXHRcdGNvbnN0IGNvbnRlbnRUeXBlID0gdHlwZUFuZFBhcmFtZXRlcnNbMF0udG9Mb3dlckNhc2UoKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0bmFtZTogY29udGVudFR5cGVIZWFkZXIsXG5cdFx0XHR0eXBlOiBjb250ZW50VHlwZVxuXHRcdH07XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVSFJCYXNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHVnX2hhc19vd25fcHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIE1lcmdlIHR3byBhdHRyaWJ1dGUgb2JqZWN0cyBnaXZpbmcgcHJlY2VkZW5jZVxuICogdG8gdmFsdWVzIGluIG9iamVjdCBgYmAuIENsYXNzZXMgYXJlIHNwZWNpYWwtY2FzZWRcbiAqIGFsbG93aW5nIGZvciBhcnJheXMgYW5kIG1lcmdpbmcvam9pbmluZyBhcHByb3ByaWF0ZWx5XG4gKiByZXN1bHRpbmcgaW4gYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBiXG4gKiBAcmV0dXJuIHtPYmplY3R9IGFcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMubWVyZ2UgPSBwdWdfbWVyZ2U7XG5mdW5jdGlvbiBwdWdfbWVyZ2UoYSwgYikge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHZhciBhdHRycyA9IGFbMF07XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhdHRycyA9IHB1Z19tZXJnZShhdHRycywgYVtpXSk7XG4gICAgfVxuICAgIHJldHVybiBhdHRycztcbiAgfVxuXG4gIGZvciAodmFyIGtleSBpbiBiKSB7XG4gICAgaWYgKGtleSA9PT0gJ2NsYXNzJykge1xuICAgICAgdmFyIHZhbEEgPSBhW2tleV0gfHwgW107XG4gICAgICBhW2tleV0gPSAoQXJyYXkuaXNBcnJheSh2YWxBKSA/IHZhbEEgOiBbdmFsQV0pLmNvbmNhdChiW2tleV0gfHwgW10pO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnc3R5bGUnKSB7XG4gICAgICB2YXIgdmFsQSA9IHB1Z19zdHlsZShhW2tleV0pO1xuICAgICAgdmFyIHZhbEIgPSBwdWdfc3R5bGUoYltrZXldKTtcbiAgICAgIGFba2V5XSA9IHZhbEEgKyB2YWxCO1xuICAgIH0gZWxzZSB7XG4gICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGE7XG59O1xuXG4vKipcbiAqIFByb2Nlc3MgYXJyYXksIG9iamVjdCwgb3Igc3RyaW5nIGFzIGEgc3RyaW5nIG9mIGNsYXNzZXMgZGVsaW1pdGVkIGJ5IGEgc3BhY2UuXG4gKlxuICogSWYgYHZhbGAgaXMgYW4gYXJyYXksIGFsbCBtZW1iZXJzIG9mIGl0IGFuZCBpdHMgc3ViYXJyYXlzIGFyZSBjb3VudGVkIGFzXG4gKiBjbGFzc2VzLiBJZiBgZXNjYXBpbmdgIGlzIGFuIGFycmF5LCB0aGVuIHdoZXRoZXIgb3Igbm90IHRoZSBpdGVtIGluIGB2YWxgIGlzXG4gKiBlc2NhcGVkIGRlcGVuZHMgb24gdGhlIGNvcnJlc3BvbmRpbmcgaXRlbSBpbiBgZXNjYXBpbmdgLiBJZiBgZXNjYXBpbmdgIGlzXG4gKiBub3QgYW4gYXJyYXksIG5vIGVzY2FwaW5nIGlzIGRvbmUuXG4gKlxuICogSWYgYHZhbGAgaXMgYW4gb2JqZWN0LCBhbGwgdGhlIGtleXMgd2hvc2UgdmFsdWUgaXMgdHJ1dGh5IGFyZSBjb3VudGVkIGFzXG4gKiBjbGFzc2VzLiBObyBlc2NhcGluZyBpcyBkb25lLlxuICpcbiAqIElmIGB2YWxgIGlzIGEgc3RyaW5nLCBpdCBpcyBjb3VudGVkIGFzIGEgY2xhc3MuIE5vIGVzY2FwaW5nIGlzIGRvbmUuXG4gKlxuICogQHBhcmFtIHsoQXJyYXkuPHN0cmluZz58T2JqZWN0LjxzdHJpbmcsIGJvb2xlYW4+fHN0cmluZyl9IHZhbFxuICogQHBhcmFtIHs/QXJyYXkuPHN0cmluZz59IGVzY2FwaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuY2xhc3NlcyA9IHB1Z19jbGFzc2VzO1xuZnVuY3Rpb24gcHVnX2NsYXNzZXNfYXJyYXkodmFsLCBlc2NhcGluZykge1xuICB2YXIgY2xhc3NTdHJpbmcgPSAnJywgY2xhc3NOYW1lLCBwYWRkaW5nID0gJycsIGVzY2FwZUVuYWJsZWQgPSBBcnJheS5pc0FycmF5KGVzY2FwaW5nKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWwubGVuZ3RoOyBpKyspIHtcbiAgICBjbGFzc05hbWUgPSBwdWdfY2xhc3Nlcyh2YWxbaV0pO1xuICAgIGlmICghY2xhc3NOYW1lKSBjb250aW51ZTtcbiAgICBlc2NhcGVFbmFibGVkICYmIGVzY2FwaW5nW2ldICYmIChjbGFzc05hbWUgPSBwdWdfZXNjYXBlKGNsYXNzTmFtZSkpO1xuICAgIGNsYXNzU3RyaW5nID0gY2xhc3NTdHJpbmcgKyBwYWRkaW5nICsgY2xhc3NOYW1lO1xuICAgIHBhZGRpbmcgPSAnICc7XG4gIH1cbiAgcmV0dXJuIGNsYXNzU3RyaW5nO1xufVxuZnVuY3Rpb24gcHVnX2NsYXNzZXNfb2JqZWN0KHZhbCkge1xuICB2YXIgY2xhc3NTdHJpbmcgPSAnJywgcGFkZGluZyA9ICcnO1xuICBmb3IgKHZhciBrZXkgaW4gdmFsKSB7XG4gICAgaWYgKGtleSAmJiB2YWxba2V5XSAmJiBwdWdfaGFzX293bl9wcm9wZXJ0eS5jYWxsKHZhbCwga2V5KSkge1xuICAgICAgY2xhc3NTdHJpbmcgPSBjbGFzc1N0cmluZyArIHBhZGRpbmcgKyBrZXk7XG4gICAgICBwYWRkaW5nID0gJyAnO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY2xhc3NTdHJpbmc7XG59XG5mdW5jdGlvbiBwdWdfY2xhc3Nlcyh2YWwsIGVzY2FwaW5nKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICByZXR1cm4gcHVnX2NsYXNzZXNfYXJyYXkodmFsLCBlc2NhcGluZyk7XG4gIH0gZWxzZSBpZiAodmFsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIHB1Z19jbGFzc2VzX29iamVjdCh2YWwpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB2YWwgfHwgJyc7XG4gIH1cbn1cblxuLyoqXG4gKiBDb252ZXJ0IG9iamVjdCBvciBzdHJpbmcgdG8gYSBzdHJpbmcgb2YgQ1NTIHN0eWxlcyBkZWxpbWl0ZWQgYnkgYSBzZW1pY29sb24uXG4gKlxuICogQHBhcmFtIHsoT2JqZWN0LjxzdHJpbmcsIHN0cmluZz58c3RyaW5nKX0gdmFsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZXhwb3J0cy5zdHlsZSA9IHB1Z19zdHlsZTtcbmZ1bmN0aW9uIHB1Z19zdHlsZSh2YWwpIHtcbiAgaWYgKCF2YWwpIHJldHVybiAnJztcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgdmFyIG91dCA9ICcnO1xuICAgIGZvciAodmFyIHN0eWxlIGluIHZhbCkge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmIChwdWdfaGFzX293bl9wcm9wZXJ0eS5jYWxsKHZhbCwgc3R5bGUpKSB7XG4gICAgICAgIG91dCA9IG91dCArIHN0eWxlICsgJzonICsgdmFsW3N0eWxlXSArICc7JztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfSBlbHNlIHtcbiAgICB2YWwgKz0gJyc7XG4gICAgaWYgKHZhbFt2YWwubGVuZ3RoIC0gMV0gIT09ICc7JykgXG4gICAgICByZXR1cm4gdmFsICsgJzsnO1xuICAgIHJldHVybiB2YWw7XG4gIH1cbn07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHBhcmFtIHtCb29sZWFufSBlc2NhcGVkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHRlcnNlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0ciA9IHB1Z19hdHRyO1xuZnVuY3Rpb24gcHVnX2F0dHIoa2V5LCB2YWwsIGVzY2FwZWQsIHRlcnNlKSB7XG4gIGlmICh2YWwgPT09IGZhbHNlIHx8IHZhbCA9PSBudWxsIHx8ICF2YWwgJiYgKGtleSA9PT0gJ2NsYXNzJyB8fCBrZXkgPT09ICdzdHlsZScpKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGlmICh2YWwgPT09IHRydWUpIHtcbiAgICByZXR1cm4gJyAnICsgKHRlcnNlID8ga2V5IDoga2V5ICsgJz1cIicgKyBrZXkgKyAnXCInKTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbC50b0pTT04gPT09ICdmdW5jdGlvbicpIHtcbiAgICB2YWwgPSB2YWwudG9KU09OKCk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWwgIT09ICdzdHJpbmcnKSB7XG4gICAgdmFsID0gSlNPTi5zdHJpbmdpZnkodmFsKTtcbiAgICBpZiAoIWVzY2FwZWQgJiYgdmFsLmluZGV4T2YoJ1wiJykgIT09IC0xKSB7XG4gICAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cXCcnICsgdmFsLnJlcGxhY2UoLycvZywgJyYjMzk7JykgKyAnXFwnJztcbiAgICB9XG4gIH1cbiAgaWYgKGVzY2FwZWQpIHZhbCA9IHB1Z19lc2NhcGUodmFsKTtcbiAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJztcbn07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGVzIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge09iamVjdH0gdGVyc2Ugd2hldGhlciB0byB1c2UgSFRNTDUgdGVyc2UgYm9vbGVhbiBhdHRyaWJ1dGVzXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0cnMgPSBwdWdfYXR0cnM7XG5mdW5jdGlvbiBwdWdfYXR0cnMob2JqLCB0ZXJzZSl7XG4gIHZhciBhdHRycyA9ICcnO1xuXG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAocHVnX2hhc19vd25fcHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgIHZhciB2YWwgPSBvYmpba2V5XTtcblxuICAgICAgaWYgKCdjbGFzcycgPT09IGtleSkge1xuICAgICAgICB2YWwgPSBwdWdfY2xhc3Nlcyh2YWwpO1xuICAgICAgICBhdHRycyA9IHB1Z19hdHRyKGtleSwgdmFsLCBmYWxzZSwgdGVyc2UpICsgYXR0cnM7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKCdzdHlsZScgPT09IGtleSkge1xuICAgICAgICB2YWwgPSBwdWdfc3R5bGUodmFsKTtcbiAgICAgIH1cbiAgICAgIGF0dHJzICs9IHB1Z19hdHRyKGtleSwgdmFsLCBmYWxzZSwgdGVyc2UpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhdHRycztcbn07XG5cbi8qKlxuICogRXNjYXBlIHRoZSBnaXZlbiBzdHJpbmcgb2YgYGh0bWxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBodG1sXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG52YXIgcHVnX21hdGNoX2h0bWwgPSAvW1wiJjw+XS87XG5leHBvcnRzLmVzY2FwZSA9IHB1Z19lc2NhcGU7XG5mdW5jdGlvbiBwdWdfZXNjYXBlKF9odG1sKXtcbiAgdmFyIGh0bWwgPSAnJyArIF9odG1sO1xuICB2YXIgcmVnZXhSZXN1bHQgPSBwdWdfbWF0Y2hfaHRtbC5leGVjKGh0bWwpO1xuICBpZiAoIXJlZ2V4UmVzdWx0KSByZXR1cm4gX2h0bWw7XG5cbiAgdmFyIHJlc3VsdCA9ICcnO1xuICB2YXIgaSwgbGFzdEluZGV4LCBlc2NhcGU7XG4gIGZvciAoaSA9IHJlZ2V4UmVzdWx0LmluZGV4LCBsYXN0SW5kZXggPSAwOyBpIDwgaHRtbC5sZW5ndGg7IGkrKykge1xuICAgIHN3aXRjaCAoaHRtbC5jaGFyQ29kZUF0KGkpKSB7XG4gICAgICBjYXNlIDM0OiBlc2NhcGUgPSAnJnF1b3Q7JzsgYnJlYWs7XG4gICAgICBjYXNlIDM4OiBlc2NhcGUgPSAnJmFtcDsnOyBicmVhaztcbiAgICAgIGNhc2UgNjA6IGVzY2FwZSA9ICcmbHQ7JzsgYnJlYWs7XG4gICAgICBjYXNlIDYyOiBlc2NhcGUgPSAnJmd0Oyc7IGJyZWFrO1xuICAgICAgZGVmYXVsdDogY29udGludWU7XG4gICAgfVxuICAgIGlmIChsYXN0SW5kZXggIT09IGkpIHJlc3VsdCArPSBodG1sLnN1YnN0cmluZyhsYXN0SW5kZXgsIGkpO1xuICAgIGxhc3RJbmRleCA9IGkgKyAxO1xuICAgIHJlc3VsdCArPSBlc2NhcGU7XG4gIH1cbiAgaWYgKGxhc3RJbmRleCAhPT0gaSkgcmV0dXJuIHJlc3VsdCArIGh0bWwuc3Vic3RyaW5nKGxhc3RJbmRleCwgaSk7XG4gIGVsc2UgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogUmUtdGhyb3cgdGhlIGdpdmVuIGBlcnJgIGluIGNvbnRleHQgdG8gdGhlXG4gKiB0aGUgcHVnIGluIGBmaWxlbmFtZWAgYXQgdGhlIGdpdmVuIGBsaW5lbm9gLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gbGluZW5vXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIG9yaWdpbmFsIHNvdXJjZVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5yZXRocm93ID0gcHVnX3JldGhyb3c7XG5mdW5jdGlvbiBwdWdfcmV0aHJvdyhlcnIsIGZpbGVuYW1lLCBsaW5lbm8sIHN0cil7XG4gIGlmICghKGVyciBpbnN0YW5jZW9mIEVycm9yKSkgdGhyb3cgZXJyO1xuICBpZiAoKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgfHwgIWZpbGVuYW1lKSAmJiAhc3RyKSB7XG4gICAgZXJyLm1lc3NhZ2UgKz0gJyBvbiBsaW5lICcgKyBsaW5lbm87XG4gICAgdGhyb3cgZXJyO1xuICB9XG4gIHRyeSB7XG4gICAgc3RyID0gc3RyIHx8IHJlcXVpcmUoJ2ZzJykucmVhZEZpbGVTeW5jKGZpbGVuYW1lLCAndXRmOCcpXG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgcHVnX3JldGhyb3coZXJyLCBudWxsLCBsaW5lbm8pXG4gIH1cbiAgdmFyIGNvbnRleHQgPSAzXG4gICAgLCBsaW5lcyA9IHN0ci5zcGxpdCgnXFxuJylcbiAgICAsIHN0YXJ0ID0gTWF0aC5tYXgobGluZW5vIC0gY29udGV4dCwgMClcbiAgICAsIGVuZCA9IE1hdGgubWluKGxpbmVzLmxlbmd0aCwgbGluZW5vICsgY29udGV4dCk7XG5cbiAgLy8gRXJyb3IgY29udGV4dFxuICB2YXIgY29udGV4dCA9IGxpbmVzLnNsaWNlKHN0YXJ0LCBlbmQpLm1hcChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICB2YXIgY3VyciA9IGkgKyBzdGFydCArIDE7XG4gICAgcmV0dXJuIChjdXJyID09IGxpbmVubyA/ICcgID4gJyA6ICcgICAgJylcbiAgICAgICsgY3VyclxuICAgICAgKyAnfCAnXG4gICAgICArIGxpbmU7XG4gIH0pLmpvaW4oJ1xcbicpO1xuXG4gIC8vIEFsdGVyIGV4Y2VwdGlvbiBtZXNzYWdlXG4gIGVyci5wYXRoID0gZmlsZW5hbWU7XG4gIGVyci5tZXNzYWdlID0gKGZpbGVuYW1lIHx8ICdQdWcnKSArICc6JyArIGxpbmVub1xuICAgICsgJ1xcbicgKyBjb250ZXh0ICsgJ1xcblxcbicgKyBlcnIubWVzc2FnZTtcbiAgdGhyb3cgZXJyO1xufTtcbiIsInZhciBydW50aW1lID0gcmVxdWlyZSgnLi8nKTtcblxubW9kdWxlLmV4cG9ydHMgPSB3cmFwO1xuZnVuY3Rpb24gd3JhcCh0ZW1wbGF0ZSwgdGVtcGxhdGVOYW1lKSB7XG4gIHRlbXBsYXRlTmFtZSA9IHRlbXBsYXRlTmFtZSB8fCAndGVtcGxhdGUnO1xuICByZXR1cm4gRnVuY3Rpb24oJ3B1ZycsXG4gICAgdGVtcGxhdGUgKyAnXFxuJyArXG4gICAgJ3JldHVybiAnICsgdGVtcGxhdGVOYW1lICsgJzsnXG4gICkocnVudGltZSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvQm9vdHN0cmFwcGVyJyk7XG4iXX0=
