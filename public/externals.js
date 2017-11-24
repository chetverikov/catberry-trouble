require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./raw":2}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{"_process":46}],4:[function(require,module,exports){
"use strict";

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"../lib/LoggerBase":7}],7:[function(require,module,exports){
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

},{"pretty-hrtime":45}],8:[function(require,module,exports){
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

},{"pug-runtime/wrap":56}],9:[function(require,module,exports){
'use strict';

module.exports = require('pug-runtime');

},{"pug-runtime":55}],10:[function(require,module,exports){
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

},{"../lib/UHRBase":11}],11:[function(require,module,exports){
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

},{"catberry-uri":12}],12:[function(require,module,exports){
'use strict';

module.exports = {
	URI: require('./lib/URI'),
	Authority: require('./lib/Authority'),
	UserInfo: require('./lib/UserInfo'),
	Query: require('./lib/Query')
};

},{"./lib/Authority":13,"./lib/Query":14,"./lib/URI":15,"./lib/UserInfo":16}],13:[function(require,module,exports){
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

},{"./UserInfo":16,"./percentEncodingHelper":17}],14:[function(require,module,exports){
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

},{"./percentEncodingHelper":17}],15:[function(require,module,exports){
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

},{"./Authority":13,"./Query":14,"./percentEncodingHelper":17}],16:[function(require,module,exports){
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

},{"./percentEncodingHelper":17}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{"../lib/StoreDispatcher":30,"../lib/base/BootstrapperBase":31,"./Catberry.js":19,"./CookieWrapper":20,"./providers/ModuleApiProvider":26}],19:[function(require,module,exports){
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

},{"../lib/base/CatberryBase":32,"appDefinitions":"appDefinitions","promise":47}],20:[function(require,module,exports){
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

},{"../lib/base/CookieWrapperBase":33}],21:[function(require,module,exports){
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

				_this18._storeDispatcher.getStore(element.getAttribute(moduleHelper.ATTRIBUTE_STORE));
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

			this._storeDispatcher.getStore(storeName);

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

			componentContext.createComponent = function (tagName, attributes) {
				return _this19.createComponent(tagName, attributes);
			};
			componentContext.collectGarbage = function () {
				return _this19.collectGarbage();
			};

			componentContext.getStoreData = function () {
				var currentStoreName = element.getAttribute(moduleHelper.ATTRIBUTE_STORE);
				return _this19._storeDispatcher.getStoreData(currentStoreName);
			};
			componentContext.sendAction = function (name, args) {
				var currentStoreName = element.getAttribute(moduleHelper.ATTRIBUTE_STORE);
				return _this19._storeDispatcher.sendAction(currentStoreName, name, args);
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

},{"../lib/base/DocumentRendererBase":34,"../lib/helpers/errorHelper":38,"../lib/helpers/hrTimeHelper":23,"../lib/helpers/moduleHelper":39,"morphdom":44,"uuid":57}],22:[function(require,module,exports){
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

},{"catberry-uri":12}],23:[function(require,module,exports){
'use strict';

module.exports = {
	get: require('browser-process-hrtime'),

	toMessage: require('pretty-hrtime'),

	toMilliseconds: function toMilliseconds(hrTime) {
		return hrTime[0] * 1e3 + Math.round(hrTime[1] / 1e6);
	}
};

},{"browser-process-hrtime":3,"pretty-hrtime":45}],24:[function(require,module,exports){
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

},{"../../lib/base/LoaderBase":35,"../../lib/helpers/moduleHelper":39,"../../lib/helpers/templateHelper":41}],25:[function(require,module,exports){
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

},{"../../lib/base/LoaderBase":35}],26:[function(require,module,exports){
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

},{"../../lib/base/ModuleApiProviderBase":36,"../../lib/helpers/propertyHelper":40}],27:[function(require,module,exports){
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

},{"../../lib/base/StateProviderBase":37}],28:[function(require,module,exports){
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

},{"./helpers/propertyHelper":40}],29:[function(require,module,exports){
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
				return Promise.reject(new Error('There is no such registered method'));
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

},{"events":43}],30:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SerialWrapper = require('./SerialWrapper');
var moduleHelper = require('./helpers/moduleHelper');
var propertyHelper = require('./helpers/propertyHelper');

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

			if (!this._lastState) {
				return this._errorState();
			}
			if (typeof storeName !== 'string') {
				return Promise.resolve(null);
			}
			if (storeName in this._lastData) {
				var existTime = Date.now() - this._lastData[storeName].createdAt;
				if (existTime <= this._lastData[storeName].lifetime) {
					return Promise.resolve(this._lastData[storeName].data);
				}
				delete this._lastData[storeName];
			}
			this._eventBus.emit('storeDataLoad', {
				name: storeName
			});

			var store = this.getStore(storeName);
			if (!store) {
				return this._errorStoreNotFound(storeName);
			}

			var lifetime = typeof store.$lifetime === 'number' ? store.$lifetime : DEFAULT_LIFETIME;

			return this._serialWrapper.invoke(storeName).then(function (data) {
				_this._lastData[storeName] = {
					data: data,
					lifetime: lifetime,
					createdAt: Date.now()
				};
				_this._eventBus.emit('storeDataLoaded', {
					name: storeName,
					data: data,
					lifetime: lifetime
				});
				return data;
			});
		}
	}, {
		key: 'sendAction',
		value: function sendAction(storeName, actionName, args) {
			var _this2 = this;

			if (!this._lastState) {
				return this._errorState();
			}
			var actionDetails = {
				storeName: storeName,
				actionName: actionName,
				args: args
			};
			this._eventBus.emit('actionSend', actionDetails);

			var store = this.getStore(storeName);
			if (!store) {
				return this._errorStoreNotFound(storeName);
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
					_this3._storeInstances[storeName].$context = _this3._getStoreContext(storeName);
				});
			}

			var changedStoreNames = Object.create(null);
			Object.keys(changed).forEach(function (storeName) {
				var store = _this3.getStore(storeName);
				if (!store) {
					return;
				}
				store.$context.changed().forEach(function (name) {
					changedStoreNames[name] = true;
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
		value: function _getStoreContext(storeName) {
			var _this4 = this;

			var storeContext = Object.create(this._currentBasicContext);
			propertyHelper.defineReadOnly(storeContext, 'name', storeName);
			propertyHelper.defineReadOnly(storeContext, 'state', this._lastState[storeName] || Object.create(null));

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

			storeContext.getStoreData = function (sourceStoreName) {
				return sourceStoreName === storeName ? Promise.resolve(null) : _this4.getStoreData(sourceStoreName);
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
		value: function getStore(storeName) {
			var _this5 = this;

			if (!storeName) {
				return null;
			}
			var store = this._storeInstances[storeName];
			if (store) {
				return store;
			}

			var stores = this._storeLoader.getStoresByNames();
			var config = this._serviceLocator.resolve('config');
			if (!(storeName in stores)) {
				return null;
			}

			var ComponentConstructor = stores[storeName].constructor;
			ComponentConstructor.prototype.$context = this._getStoreContext(storeName);
			this._storeInstances[storeName] = new ComponentConstructor(this._serviceLocator);
			this._storeInstances[storeName].$context = ComponentConstructor.prototype.$context;

			this._serialWrapper.add(storeName, function () {
				var loadMethod = moduleHelper.getMethodToInvoke(_this5._storeInstances[storeName], 'load');
				return moduleHelper.getSafePromise(loadMethod);
			});
			return this._storeInstances[storeName];
		}
	}, {
		key: '_errorStoreNotFound',
		value: function _errorStoreNotFound(name) {
			return Promise.reject(new Error('Store "' + name + '" not found'));
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

},{"./SerialWrapper":29,"./helpers/moduleHelper":39,"./helpers/propertyHelper":40}],31:[function(require,module,exports){
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

},{"../ContextFactory":28,"../DocumentRenderer":21,"../RequestRouter":22,"../base/ModuleApiProviderBase":36,"../helpers/moduleHelper":39,"../loaders/ComponentLoader":24,"../loaders/StoreLoader":25,"../providers/StateProvider":27,"events":43}],32:[function(require,module,exports){
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

},{"catberry-locator":5}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
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

},{"../helpers/uriHelper":42,"catberry-uri":12}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
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
	DEFAULT_LOGIC_FILENAME: 'index.js',

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

},{}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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

},{"./moduleHelper":39}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
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

},{}],45:[function(require,module,exports){


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

},{}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
'use strict';

module.exports = require('./lib');

},{"./lib":52}],48:[function(require,module,exports){
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

},{"asap/raw":2}],49:[function(require,module,exports){
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

},{"./core.js":48}],50:[function(require,module,exports){
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

},{"./core.js":48}],51:[function(require,module,exports){
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

},{"./core.js":48}],52:[function(require,module,exports){
'use strict';

module.exports = require('./core.js');
require('./done.js');
require('./finally.js');
require('./es6-extensions.js');
require('./node-extensions.js');
require('./synchronous.js');

},{"./core.js":48,"./done.js":49,"./es6-extensions.js":50,"./finally.js":51,"./node-extensions.js":53,"./synchronous.js":54}],53:[function(require,module,exports){
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

},{"./core.js":48,"asap":1}],54:[function(require,module,exports){
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

},{"./core.js":48}],55:[function(require,module,exports){
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

},{"fs":4}],56:[function(require,module,exports){
'use strict';

var runtime = require('./');

module.exports = wrap;
function wrap(template, templateName) {
  templateName = templateName || 'template';
  return Function('pug', template + '\n' + 'return ' + templateName + ';')(runtime);
}

},{"./":55}],57:[function(require,module,exports){
'use strict';

var v1 = require('./v1');
var v4 = require('./v4');

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;

},{"./v1":60,"./v4":61}],58:[function(require,module,exports){
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

},{}],59:[function(require,module,exports){
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

},{}],60:[function(require,module,exports){
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

},{"./lib/bytesToUuid":58,"./lib/rng":59}],61:[function(require,module,exports){
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

},{"./lib/bytesToUuid":58,"./lib/rng":59}],"catberry-logger":[function(require,module,exports){
'use strict';

var Logger = require('./lib/Logger');

module.exports = {
	register: function register(locator) {
		var logger = new Logger(locator);
		locator.registerInstance('logger', logger);
	},

	Logger: Logger
};

},{"./lib/Logger":6}],"catberry-pug":[function(require,module,exports){
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

},{"./lib/TemplateProvider":8,"./lib/pug.js":9}],"catberry-uhr":[function(require,module,exports){
'use strict';

var UHR = require('./lib/UHR');

module.exports = {
	register: function register(locator) {
		locator.register('uhr', UHR, true);
	},
	UHR: UHR
};

},{"./lib/UHR":10}],"catberry":[function(require,module,exports){
'use strict';

module.exports = require('./lib/Bootstrapper');

},{"./lib/Bootstrapper":18}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXNhcC9icm93c2VyLWFzYXAuanMiLCJub2RlX21vZHVsZXMvYXNhcC9icm93c2VyLXJhdy5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyLXByb2Nlc3MtaHJ0aW1lL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcmVzb2x2ZS9lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9jYXRiZXJyeS1sb2NhdG9yL2xpYi9TZXJ2aWNlTG9jYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jYXRiZXJyeS1sb2dnZXIvYnJvd3Nlci9Mb2dnZXIuanMiLCJub2RlX21vZHVsZXMvY2F0YmVycnktbG9nZ2VyL2xpYi9Mb2dnZXJCYXNlLmpzIiwibm9kZV9tb2R1bGVzL2NhdGJlcnJ5LXB1Zy9icm93c2VyL1RlbXBsYXRlUHJvdmlkZXIuanMiLCJub2RlX21vZHVsZXMvY2F0YmVycnktcHVnL2Jyb3dzZXIvcHVnLmpzIiwibm9kZV9tb2R1bGVzL2NhdGJlcnJ5LXVoci9icm93c2VyL1VIUi5qcyIsIm5vZGVfbW9kdWxlcy9jYXRiZXJyeS11aHIvbGliL1VIUkJhc2UuanMiLCJub2RlX21vZHVsZXMvY2F0YmVycnktdXJpL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NhdGJlcnJ5LXVyaS9saWIvQXV0aG9yaXR5LmpzIiwibm9kZV9tb2R1bGVzL2NhdGJlcnJ5LXVyaS9saWIvUXVlcnkuanMiLCJub2RlX21vZHVsZXMvY2F0YmVycnktdXJpL2xpYi9VUkkuanMiLCJub2RlX21vZHVsZXMvY2F0YmVycnktdXJpL2xpYi9Vc2VySW5mby5qcyIsIm5vZGVfbW9kdWxlcy9jYXRiZXJyeS11cmkvbGliL3BlcmNlbnRFbmNvZGluZ0hlbHBlci5qcyIsIm5vZGVfbW9kdWxlcy9jYXRiZXJyeS9icm93c2VyL0Jvb3RzdHJhcHBlci5qcyIsIm5vZGVfbW9kdWxlcy9jYXRiZXJyeS9icm93c2VyL0NhdGJlcnJ5LmpzIiwibm9kZV9tb2R1bGVzL2NhdGJlcnJ5L2Jyb3dzZXIvQ29va2llV3JhcHBlci5qcyIsIm5vZGVfbW9kdWxlcy9jYXRiZXJyeS9icm93c2VyL0RvY3VtZW50UmVuZGVyZXIuanMiLCJub2RlX21vZHVsZXMvY2F0YmVycnkvYnJvd3Nlci9SZXF1ZXN0Um91dGVyLmpzIiwibm9kZV9tb2R1bGVzL2NhdGJlcnJ5L2Jyb3dzZXIvaGVscGVycy9oclRpbWVIZWxwZXIuanMiLCJub2RlX21vZHVsZXMvY2F0YmVycnkvYnJvd3Nlci9sb2FkZXJzL0NvbXBvbmVudExvYWRlci5qcyIsIm5vZGVfbW9kdWxlcy9jYXRiZXJyeS9icm93c2VyL2xvYWRlcnMvU3RvcmVMb2FkZXIuanMiLCJub2RlX21vZHVsZXMvY2F0YmVycnkvYnJvd3Nlci9wcm92aWRlcnMvTW9kdWxlQXBpUHJvdmlkZXIuanMiLCJub2RlX21vZHVsZXMvY2F0YmVycnkvYnJvd3Nlci9wcm92aWRlcnMvU3RhdGVQcm92aWRlci5qcyIsIm5vZGVfbW9kdWxlcy9jYXRiZXJyeS9saWIvQ29udGV4dEZhY3RvcnkuanMiLCJub2RlX21vZHVsZXMvY2F0YmVycnkvbGliL1NlcmlhbFdyYXBwZXIuanMiLCJub2RlX21vZHVsZXMvY2F0YmVycnkvbGliL1N0b3JlRGlzcGF0Y2hlci5qcyIsIm5vZGVfbW9kdWxlcy9jYXRiZXJyeS9saWIvYmFzZS9Cb290c3RyYXBwZXJCYXNlLmpzIiwibm9kZV9tb2R1bGVzL2NhdGJlcnJ5L2xpYi9iYXNlL0NhdGJlcnJ5QmFzZS5qcyIsIm5vZGVfbW9kdWxlcy9jYXRiZXJyeS9saWIvYmFzZS9Db29raWVXcmFwcGVyQmFzZS5qcyIsIm5vZGVfbW9kdWxlcy9jYXRiZXJyeS9saWIvYmFzZS9Eb2N1bWVudFJlbmRlcmVyQmFzZS5qcyIsIm5vZGVfbW9kdWxlcy9jYXRiZXJyeS9saWIvYmFzZS9Mb2FkZXJCYXNlLmpzIiwibm9kZV9tb2R1bGVzL2NhdGJlcnJ5L2xpYi9iYXNlL01vZHVsZUFwaVByb3ZpZGVyQmFzZS5qcyIsIm5vZGVfbW9kdWxlcy9jYXRiZXJyeS9saWIvYmFzZS9TdGF0ZVByb3ZpZGVyQmFzZS5qcyIsIm5vZGVfbW9kdWxlcy9jYXRiZXJyeS9saWIvaGVscGVycy9lcnJvckhlbHBlci5qcyIsIm5vZGVfbW9kdWxlcy9jYXRiZXJyeS9saWIvaGVscGVycy9tb2R1bGVIZWxwZXIuanMiLCJub2RlX21vZHVsZXMvY2F0YmVycnkvbGliL2hlbHBlcnMvcHJvcGVydHlIZWxwZXIuanMiLCJub2RlX21vZHVsZXMvY2F0YmVycnkvbGliL2hlbHBlcnMvdGVtcGxhdGVIZWxwZXIuanMiLCJub2RlX21vZHVsZXMvY2F0YmVycnkvbGliL2hlbHBlcnMvdXJpSGVscGVyLmpzIiwibm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvbW9ycGhkb20vc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3ByZXR0eS1ocnRpbWUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3Byb21pc2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcHJvbWlzZS9saWIvY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9wcm9taXNlL2xpYi9kb25lLmpzIiwibm9kZV9tb2R1bGVzL3Byb21pc2UvbGliL2VzNi1leHRlbnNpb25zLmpzIiwibm9kZV9tb2R1bGVzL3Byb21pc2UvbGliL2ZpbmFsbHkuanMiLCJub2RlX21vZHVsZXMvcHJvbWlzZS9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcHJvbWlzZS9saWIvbm9kZS1leHRlbnNpb25zLmpzIiwibm9kZV9tb2R1bGVzL3Byb21pc2UvbGliL3N5bmNocm9ub3VzLmpzIiwibm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL3dyYXAuanMiLCJub2RlX21vZHVsZXMvdXVpZC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy91dWlkL2xpYi9ieXRlc1RvVXVpZC5qcyIsIm5vZGVfbW9kdWxlcy91dWlkL2xpYi9ybmctYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dWlkL3YxLmpzIiwibm9kZV9tb2R1bGVzL3V1aWQvdjQuanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUdBLElBQUksVUFBVSxRQUFRLE9BQVIsQ0FBZDs7QUFFQSxJQUFJLFlBQVksRUFBaEI7O0FBR0EsSUFBSSxnQkFBZ0IsRUFBcEI7QUFDQSxJQUFJLG9CQUFvQixRQUFRLHdCQUFSLENBQWlDLGVBQWpDLENBQXhCOztBQUVBLFNBQVMsZUFBVCxHQUEyQjtBQUN2QixRQUFJLGNBQWMsTUFBbEIsRUFBMEI7QUFDdEIsY0FBTSxjQUFjLEtBQWQsRUFBTjtBQUNIO0FBQ0o7O0FBVUQsT0FBTyxPQUFQLEdBQWlCLElBQWpCO0FBQ0EsU0FBUyxJQUFULENBQWMsSUFBZCxFQUFvQjtBQUNoQixRQUFJLE9BQUo7QUFDQSxRQUFJLFVBQVUsTUFBZCxFQUFzQjtBQUNsQixrQkFBVSxVQUFVLEdBQVYsRUFBVjtBQUNILEtBRkQsTUFFTztBQUNILGtCQUFVLElBQUksT0FBSixFQUFWO0FBQ0g7QUFDRCxZQUFRLElBQVIsR0FBZSxJQUFmO0FBQ0EsWUFBUSxPQUFSO0FBQ0g7O0FBSUQsU0FBUyxPQUFULEdBQW1CO0FBQ2YsU0FBSyxJQUFMLEdBQVksSUFBWjtBQUNIOztBQUlELFFBQVEsU0FBUixDQUFrQixJQUFsQixHQUF5QixZQUFZO0FBQ2pDLFFBQUk7QUFDQSxhQUFLLElBQUwsQ0FBVSxJQUFWO0FBQ0gsS0FGRCxDQUVFLE9BQU8sS0FBUCxFQUFjO0FBQ1osWUFBSSxLQUFLLE9BQVQsRUFBa0I7QUFJZCxpQkFBSyxPQUFMLENBQWEsS0FBYjtBQUNILFNBTEQsTUFLTztBQUlILDBCQUFjLElBQWQsQ0FBbUIsS0FBbkI7QUFDQTtBQUNIO0FBQ0osS0FmRCxTQWVVO0FBQ04sYUFBSyxJQUFMLEdBQVksSUFBWjtBQUNBLGtCQUFVLFVBQVUsTUFB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QUFJLElBQUksRUFBUixJQUFjLEtBQUssRUFBTCxDQUFkO0FBQ0Q7QUFDRjs7QUFFRCxTQUFPLE9BQU8sWUFBWSxJQUFaLENBQWQ7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsRUFBakI7OztBQzVCQTs7QUFFQSxJQUFNLFNBQVMsUUFBUSxjQUFSLENBQWY7O0FBRUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2hCLFNBRGdCLG9CQUNQLE9BRE8sRUFDRTtBQUNqQixNQUFNLFNBQVMsSUFBSSxNQUFKLENBQVcsT0FBWCxDQUFmO0FBQ0EsVUFBUSxnQkFBUixDQUF5QixRQUF6QixFQUFtQyxNQUFuQztBQUNBLEVBSmU7O0FBS2hCO0FBTGdCLENBQWpCOzs7QUFKQTs7QUFFQSxJQUFNLE1BQU0sUUFBUSxjQUFSLENBQVo7QUFDQSxJQUFNLG1CQUFtQixRQUFRLHdCQUFSLENBQXpCOztBQUVBLE9BQU8sT0FBUCxHQUFpQjtBQUNoQixTQURnQixvQkFDUCxPQURPLEVBQ0U7QUFDakIsVUFBUSxnQkFBUixDQUF5QixLQUF6QixFQUFnQyxHQUFoQztBQUNBLFVBQVEsUUFBUixDQUFpQixrQkFBakIsRUFBcUMsZ0JBQXJDLEVBQXVELElBQXZEO0FBQ0EsRUFKZTs7QUFLaEIsU0FMZ0I7QUFNaEI7QUFOZ0IsQ0FBakI7OztBQUxBOztBQUVBLElBQU0sTUFBTSxRQUFRLFdBQVIsQ0FBWjs7QUFFQSxPQUFPLE9BQVAsR0FBaUI7QUFNaEIsV0FBVSwyQkFBVztBQUNwQixVQUFRLFFBQVIsQ0FBaUIsS0FBakIsRUFBd0IsR0FBeEIsRUFBNkIsSUFBN0I7QUFDQSxFQVJlO0FBU2hCO0FBVGdCLENBQWpCOzs7QUFKQTs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsUUFBUSxvQkFBUixDQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gcmF3QXNhcCBwcm92aWRlcyBldmVyeXRoaW5nIHdlIG5lZWQgZXhjZXB0IGV4Y2VwdGlvbiBtYW5hZ2VtZW50LlxudmFyIHJhd0FzYXAgPSByZXF1aXJlKFwiLi9yYXdcIik7XG4vLyBSYXdUYXNrcyBhcmUgcmVjeWNsZWQgdG8gcmVkdWNlIEdDIGNodXJuLlxudmFyIGZyZWVUYXNrcyA9IFtdO1xuLy8gV2UgcXVldWUgZXJyb3JzIHRvIGVuc3VyZSB0aGV5IGFyZSB0aHJvd24gaW4gcmlnaHQgb3JkZXIgKEZJRk8pLlxuLy8gQXJyYXktYXMtcXVldWUgaXMgZ29vZCBlbm91Z2ggaGVyZSwgc2luY2Ugd2UgYXJlIGp1c3QgZGVhbGluZyB3aXRoIGV4Y2VwdGlvbnMuXG52YXIgcGVuZGluZ0Vycm9ycyA9IFtdO1xudmFyIHJlcXVlc3RFcnJvclRocm93ID0gcmF3QXNhcC5tYWtlUmVxdWVzdENhbGxGcm9tVGltZXIodGhyb3dGaXJzdEVycm9yKTtcblxuZnVuY3Rpb24gdGhyb3dGaXJzdEVycm9yKCkge1xuICAgIGlmIChwZW5kaW5nRXJyb3JzLmxlbmd0aCkge1xuICAgICAgICB0aHJvdyBwZW5kaW5nRXJyb3JzLnNoaWZ0KCk7XG4gICAgfVxufVxuXG4vKipcbiAqIENhbGxzIGEgdGFzayBhcyBzb29uIGFzIHBvc3NpYmxlIGFmdGVyIHJldHVybmluZywgaW4gaXRzIG93biBldmVudCwgd2l0aCBwcmlvcml0eVxuICogb3ZlciBvdGhlciBldmVudHMgbGlrZSBhbmltYXRpb24sIHJlZmxvdywgYW5kIHJlcGFpbnQuIEFuIGVycm9yIHRocm93biBmcm9tIGFuXG4gKiBldmVudCB3aWxsIG5vdCBpbnRlcnJ1cHQsIG5vciBldmVuIHN1YnN0YW50aWFsbHkgc2xvdyBkb3duIHRoZSBwcm9jZXNzaW5nIG9mXG4gKiBvdGhlciBldmVudHMsIGJ1dCB3aWxsIGJlIHJhdGhlciBwb3N0cG9uZWQgdG8gYSBsb3dlciBwcmlvcml0eSBldmVudC5cbiAqIEBwYXJhbSB7e2NhbGx9fSB0YXNrIEEgY2FsbGFibGUgb2JqZWN0LCB0eXBpY2FsbHkgYSBmdW5jdGlvbiB0aGF0IHRha2VzIG5vXG4gKiBhcmd1bWVudHMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gYXNhcDtcbmZ1bmN0aW9uIGFzYXAodGFzaykge1xuICAgIHZhciByYXdUYXNrO1xuICAgIGlmIChmcmVlVGFza3MubGVuZ3RoKSB7XG4gICAgICAgIHJhd1Rhc2sgPSBmcmVlVGFza3MucG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmF3VGFzayA9IG5ldyBSYXdUYXNrKCk7XG4gICAgfVxuICAgIHJhd1Rhc2sudGFzayA9IHRhc2s7XG4gICAgcmF3QXNhcChyYXdUYXNrKTtcbn1cblxuLy8gV2Ugd3JhcCB0YXNrcyB3aXRoIHJlY3ljbGFibGUgdGFzayBvYmplY3RzLiAgQSB0YXNrIG9iamVjdCBpbXBsZW1lbnRzXG4vLyBgY2FsbGAsIGp1c3QgbGlrZSBhIGZ1bmN0aW9uLlxuZnVuY3Rpb24gUmF3VGFzaygpIHtcbiAgICB0aGlzLnRhc2sgPSBudWxsO1xufVxuXG4vLyBUaGUgc29sZSBwdXJwb3NlIG9mIHdyYXBwaW5nIHRoZSB0YXNrIGlzIHRvIGNhdGNoIHRoZSBleGNlcHRpb24gYW5kIHJlY3ljbGVcbi8vIHRoZSB0YXNrIG9iamVjdCBhZnRlciBpdHMgc2luZ2xlIHVzZS5cblJhd1Rhc2sucHJvdG90eXBlLmNhbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgdGhpcy50YXNrLmNhbGwoKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoYXNhcC5vbmVycm9yKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGhvb2sgZXhpc3RzIHB1cmVseSBmb3IgdGVzdGluZyBwdXJwb3Nlcy5cbiAgICAgICAgICAgIC8vIEl0cyBuYW1lIHdpbGwgYmUgcGVyaW9kaWNhbGx5IHJhbmRvbWl6ZWQgdG8gYnJlYWsgYW55IGNvZGUgdGhhdFxuICAgICAgICAgICAgLy8gZGVwZW5kcyBvbiBpdHMgZXhpc3RlbmNlLlxuICAgICAgICAgICAgYXNhcC5vbmVycm9yKGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEluIGEgd2ViIGJyb3dzZXIsIGV4Y2VwdGlvbnMgYXJlIG5vdCBmYXRhbC4gSG93ZXZlciwgdG8gYXZvaWRcbiAgICAgICAgICAgIC8vIHNsb3dpbmcgZG93biB0aGUgcXVldWUgb2YgcGVuZGluZyB0YXNrcywgd2UgcmV0aHJvdyB0aGUgZXJyb3IgaW4gYVxuICAgICAgICAgICAgLy8gbG93ZXIgcHJpb3JpdHkgdHVybi5cbiAgICAgICAgICAgIHBlbmRpbmdFcnJvcnMucHVzaChlcnJvcik7XG4gICAgICAgICAgICByZXF1ZXN0RXJyb3JUaHJvdygpO1xuICAgICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy50YXNrID0gbnVsbDtcbiAgICAgICAgZnJlZVRhc2tzW2ZyZWVUYXNrcy5sZW5ndGhdID0gdGhpcztcbiAgICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIFVzZSB0aGUgZmFzdGVzdCBtZWFucyBwb3NzaWJsZSB0byBleGVjdXRlIGEgdGFzayBpbiBpdHMgb3duIHR1cm4sIHdpdGhcbi8vIHByaW9yaXR5IG92ZXIgb3RoZXIgZXZlbnRzIGluY2x1ZGluZyBJTywgYW5pbWF0aW9uLCByZWZsb3csIGFuZCByZWRyYXdcbi8vIGV2ZW50cyBpbiBicm93c2Vycy5cbi8vXG4vLyBBbiBleGNlcHRpb24gdGhyb3duIGJ5IGEgdGFzayB3aWxsIHBlcm1hbmVudGx5IGludGVycnVwdCB0aGUgcHJvY2Vzc2luZyBvZlxuLy8gc3Vic2VxdWVudCB0YXNrcy4gVGhlIGhpZ2hlciBsZXZlbCBgYXNhcGAgZnVuY3Rpb24gZW5zdXJlcyB0aGF0IGlmIGFuXG4vLyBleGNlcHRpb24gaXMgdGhyb3duIGJ5IGEgdGFzaywgdGhhdCB0aGUgdGFzayBxdWV1ZSB3aWxsIGNvbnRpbnVlIGZsdXNoaW5nIGFzXG4vLyBzb29uIGFzIHBvc3NpYmxlLCBidXQgaWYgeW91IHVzZSBgcmF3QXNhcGAgZGlyZWN0bHksIHlvdSBhcmUgcmVzcG9uc2libGUgdG9cbi8vIGVpdGhlciBlbnN1cmUgdGhhdCBubyBleGNlcHRpb25zIGFyZSB0aHJvd24gZnJvbSB5b3VyIHRhc2ssIG9yIHRvIG1hbnVhbGx5XG4vLyBjYWxsIGByYXdBc2FwLnJlcXVlc3RGbHVzaGAgaWYgYW4gZXhjZXB0aW9uIGlzIHRocm93bi5cbm1vZHVsZS5leHBvcnRzID0gcmF3QXNhcDtcbmZ1bmN0aW9uIHJhd0FzYXAodGFzaykge1xuICAgIGlmICghcXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHJlcXVlc3RGbHVzaCgpO1xuICAgICAgICBmbHVzaGluZyA9IHRydWU7XG4gICAgfVxuICAgIC8vIEVxdWl2YWxlbnQgdG8gcHVzaCwgYnV0IGF2b2lkcyBhIGZ1bmN0aW9uIGNhbGwuXG4gICAgcXVldWVbcXVldWUubGVuZ3RoXSA9IHRhc2s7XG59XG5cbnZhciBxdWV1ZSA9IFtdO1xuLy8gT25jZSBhIGZsdXNoIGhhcyBiZWVuIHJlcXVlc3RlZCwgbm8gZnVydGhlciBjYWxscyB0byBgcmVxdWVzdEZsdXNoYCBhcmVcbi8vIG5lY2Vzc2FyeSB1bnRpbCB0aGUgbmV4dCBgZmx1c2hgIGNvbXBsZXRlcy5cbnZhciBmbHVzaGluZyA9IGZhbHNlO1xuLy8gYHJlcXVlc3RGbHVzaGAgaXMgYW4gaW1wbGVtZW50YXRpb24tc3BlY2lmaWMgbWV0aG9kIHRoYXQgYXR0ZW1wdHMgdG8ga2lja1xuLy8gb2ZmIGEgYGZsdXNoYCBldmVudCBhcyBxdWlja2x5IGFzIHBvc3NpYmxlLiBgZmx1c2hgIHdpbGwgYXR0ZW1wdCB0byBleGhhdXN0XG4vLyB0aGUgZXZlbnQgcXVldWUgYmVmb3JlIHlpZWxkaW5nIHRvIHRoZSBicm93c2VyJ3Mgb3duIGV2ZW50IGxvb3AuXG52YXIgcmVxdWVzdEZsdXNoO1xuLy8gVGhlIHBvc2l0aW9uIG9mIHRoZSBuZXh0IHRhc2sgdG8gZXhlY3V0ZSBpbiB0aGUgdGFzayBxdWV1ZS4gVGhpcyBpc1xuLy8gcHJlc2VydmVkIGJldHdlZW4gY2FsbHMgdG8gYGZsdXNoYCBzbyB0aGF0IGl0IGNhbiBiZSByZXN1bWVkIGlmXG4vLyBhIHRhc2sgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbnZhciBpbmRleCA9IDA7XG4vLyBJZiBhIHRhc2sgc2NoZWR1bGVzIGFkZGl0aW9uYWwgdGFza3MgcmVjdXJzaXZlbHksIHRoZSB0YXNrIHF1ZXVlIGNhbiBncm93XG4vLyB1bmJvdW5kZWQuIFRvIHByZXZlbnQgbWVtb3J5IGV4aGF1c3Rpb24sIHRoZSB0YXNrIHF1ZXVlIHdpbGwgcGVyaW9kaWNhbGx5XG4vLyB0cnVuY2F0ZSBhbHJlYWR5LWNvbXBsZXRlZCB0YXNrcy5cbnZhciBjYXBhY2l0eSA9IDEwMjQ7XG5cbi8vIFRoZSBmbHVzaCBmdW5jdGlvbiBwcm9jZXNzZXMgYWxsIHRhc2tzIHRoYXQgaGF2ZSBiZWVuIHNjaGVkdWxlZCB3aXRoXG4vLyBgcmF3QXNhcGAgdW5sZXNzIGFuZCB1bnRpbCBvbmUgb2YgdGhvc2UgdGFza3MgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbi8vIElmIGEgdGFzayB0aHJvd3MgYW4gZXhjZXB0aW9uLCBgZmx1c2hgIGVuc3VyZXMgdGhhdCBpdHMgc3RhdGUgd2lsbCByZW1haW5cbi8vIGNvbnNpc3RlbnQgYW5kIHdpbGwgcmVzdW1lIHdoZXJlIGl0IGxlZnQgb2ZmIHdoZW4gY2FsbGVkIGFnYWluLlxuLy8gSG93ZXZlciwgYGZsdXNoYCBkb2VzIG5vdCBtYWtlIGFueSBhcnJhbmdlbWVudHMgdG8gYmUgY2FsbGVkIGFnYWluIGlmIGFuXG4vLyBleGNlcHRpb24gaXMgdGhyb3duLlxuZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgd2hpbGUgKGluZGV4IDwgcXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBpbmRleDtcbiAgICAgICAgLy8gQWR2YW5jZSB0aGUgaW5kZXggYmVmb3JlIGNhbGxpbmcgdGhlIHRhc2suIFRoaXMgZW5zdXJlcyB0aGF0IHdlIHdpbGxcbiAgICAgICAgLy8gYmVnaW4gZmx1c2hpbmcgb24gdGhlIG5leHQgdGFzayB0aGUgdGFzayB0aHJvd3MgYW4gZXJyb3IuXG4gICAgICAgIGluZGV4ID0gaW5kZXggKyAxO1xuICAgICAgICBxdWV1ZVtjdXJyZW50SW5kZXhdLmNhbGwoKTtcbiAgICAgICAgLy8gUHJldmVudCBsZWFraW5nIG1lbW9yeSBmb3IgbG9uZyBjaGFpbnMgb2YgcmVjdXJzaXZlIGNhbGxzIHRvIGBhc2FwYC5cbiAgICAgICAgLy8gSWYgd2UgY2FsbCBgYXNhcGAgd2l0aGluIHRhc2tzIHNjaGVkdWxlZCBieSBgYXNhcGAsIHRoZSBxdWV1ZSB3aWxsXG4gICAgICAgIC8vIGdyb3csIGJ1dCB0byBhdm9pZCBhbiBPKG4pIHdhbGsgZm9yIGV2ZXJ5IHRhc2sgd2UgZXhlY3V0ZSwgd2UgZG9uJ3RcbiAgICAgICAgLy8gc2hpZnQgdGFza3Mgb2ZmIHRoZSBxdWV1ZSBhZnRlciB0aGV5IGhhdmUgYmVlbiBleGVjdXRlZC5cbiAgICAgICAgLy8gSW5zdGVhZCwgd2UgcGVyaW9kaWNhbGx5IHNoaWZ0IDEwMjQgdGFza3Mgb2ZmIHRoZSBxdWV1ZS5cbiAgICAgICAgaWYgKGluZGV4ID4gY2FwYWNpdHkpIHtcbiAgICAgICAgICAgIC8vIE1hbnVhbGx5IHNoaWZ0IGFsbCB2YWx1ZXMgc3RhcnRpbmcgYXQgdGhlIGluZGV4IGJhY2sgdG8gdGhlXG4gICAgICAgICAgICAvLyBiZWdpbm5pbmcgb2YgdGhlIHF1ZXVlLlxuICAgICAgICAgICAgZm9yICh2YXIgc2NhbiA9IDAsIG5ld0xlbmd0aCA9IHF1ZXVlLmxlbmd0aCAtIGluZGV4OyBzY2FuIDwgbmV3TGVuZ3RoOyBzY2FuKyspIHtcbiAgICAgICAgICAgICAgICBxdWV1ZVtzY2FuXSA9IHF1ZXVlW3NjYW4gKyBpbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBxdWV1ZS5sZW5ndGggLT0gaW5kZXg7XG4gICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUubGVuZ3RoID0gMDtcbiAgICBpbmRleCA9IDA7XG4gICAgZmx1c2hpbmcgPSBmYWxzZTtcbn1cblxuLy8gYHJlcXVlc3RGbHVzaGAgaXMgaW1wbGVtZW50ZWQgdXNpbmcgYSBzdHJhdGVneSBiYXNlZCBvbiBkYXRhIGNvbGxlY3RlZCBmcm9tXG4vLyBldmVyeSBhdmFpbGFibGUgU2F1Y2VMYWJzIFNlbGVuaXVtIHdlYiBkcml2ZXIgd29ya2VyIGF0IHRpbWUgb2Ygd3JpdGluZy5cbi8vIGh0dHBzOi8vZG9jcy5nb29nbGUuY29tL3NwcmVhZHNoZWV0cy9kLzFtRy01VVlHdXA1cXhHZEVNV2toUDZCV0N6MDUzTlViMkUxUW9VVFUxNnVBL2VkaXQjZ2lkPTc4MzcyNDU5M1xuXG4vLyBTYWZhcmkgNiBhbmQgNi4xIGZvciBkZXNrdG9wLCBpUGFkLCBhbmQgaVBob25lIGFyZSB0aGUgb25seSBicm93c2VycyB0aGF0XG4vLyBoYXZlIFdlYktpdE11dGF0aW9uT2JzZXJ2ZXIgYnV0IG5vdCB1bi1wcmVmaXhlZCBNdXRhdGlvbk9ic2VydmVyLlxuLy8gTXVzdCB1c2UgYGdsb2JhbGAgb3IgYHNlbGZgIGluc3RlYWQgb2YgYHdpbmRvd2AgdG8gd29yayBpbiBib3RoIGZyYW1lcyBhbmQgd2ViXG4vLyB3b3JrZXJzLiBgZ2xvYmFsYCBpcyBhIHByb3Zpc2lvbiBvZiBCcm93c2VyaWZ5LCBNciwgTXJzLCBvciBNb3AuXG5cbi8qIGdsb2JhbHMgc2VsZiAqL1xudmFyIHNjb3BlID0gdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHNlbGY7XG52YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBzY29wZS5NdXRhdGlvbk9ic2VydmVyIHx8IHNjb3BlLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG5cbi8vIE11dGF0aW9uT2JzZXJ2ZXJzIGFyZSBkZXNpcmFibGUgYmVjYXVzZSB0aGV5IGhhdmUgaGlnaCBwcmlvcml0eSBhbmQgd29ya1xuLy8gcmVsaWFibHkgZXZlcnl3aGVyZSB0aGV5IGFyZSBpbXBsZW1lbnRlZC5cbi8vIFRoZXkgYXJlIGltcGxlbWVudGVkIGluIGFsbCBtb2Rlcm4gYnJvd3NlcnMuXG4vL1xuLy8gLSBBbmRyb2lkIDQtNC4zXG4vLyAtIENocm9tZSAyNi0zNFxuLy8gLSBGaXJlZm94IDE0LTI5XG4vLyAtIEludGVybmV0IEV4cGxvcmVyIDExXG4vLyAtIGlQYWQgU2FmYXJpIDYtNy4xXG4vLyAtIGlQaG9uZSBTYWZhcmkgNy03LjFcbi8vIC0gU2FmYXJpIDYtN1xuaWYgKHR5cGVvZiBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmVxdWVzdEZsdXNoID0gbWFrZVJlcXVlc3RDYWxsRnJvbU11dGF0aW9uT2JzZXJ2ZXIoZmx1c2gpO1xuXG4vLyBNZXNzYWdlQ2hhbm5lbHMgYXJlIGRlc2lyYWJsZSBiZWNhdXNlIHRoZXkgZ2l2ZSBkaXJlY3QgYWNjZXNzIHRvIHRoZSBIVE1MXG4vLyB0YXNrIHF1ZXVlLCBhcmUgaW1wbGVtZW50ZWQgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAsIFNhZmFyaSA1LjAtMSwgYW5kIE9wZXJhXG4vLyAxMS0xMiwgYW5kIGluIHdlYiB3b3JrZXJzIGluIG1hbnkgZW5naW5lcy5cbi8vIEFsdGhvdWdoIG1lc3NhZ2UgY2hhbm5lbHMgeWllbGQgdG8gYW55IHF1ZXVlZCByZW5kZXJpbmcgYW5kIElPIHRhc2tzLCB0aGV5XG4vLyB3b3VsZCBiZSBiZXR0ZXIgdGhhbiBpbXBvc2luZyB0aGUgNG1zIGRlbGF5IG9mIHRpbWVycy5cbi8vIEhvd2V2ZXIsIHRoZXkgZG8gbm90IHdvcmsgcmVsaWFibHkgaW4gSW50ZXJuZXQgRXhwbG9yZXIgb3IgU2FmYXJpLlxuXG4vLyBJbnRlcm5ldCBFeHBsb3JlciAxMCBpcyB0aGUgb25seSBicm93c2VyIHRoYXQgaGFzIHNldEltbWVkaWF0ZSBidXQgZG9lc1xuLy8gbm90IGhhdmUgTXV0YXRpb25PYnNlcnZlcnMuXG4vLyBBbHRob3VnaCBzZXRJbW1lZGlhdGUgeWllbGRzIHRvIHRoZSBicm93c2VyJ3MgcmVuZGVyZXIsIGl0IHdvdWxkIGJlXG4vLyBwcmVmZXJyYWJsZSB0byBmYWxsaW5nIGJhY2sgdG8gc2V0VGltZW91dCBzaW5jZSBpdCBkb2VzIG5vdCBoYXZlXG4vLyB0aGUgbWluaW11bSA0bXMgcGVuYWx0eS5cbi8vIFVuZm9ydHVuYXRlbHkgdGhlcmUgYXBwZWFycyB0byBiZSBhIGJ1ZyBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMCBNb2JpbGUgKGFuZFxuLy8gRGVza3RvcCB0byBhIGxlc3NlciBleHRlbnQpIHRoYXQgcmVuZGVycyBib3RoIHNldEltbWVkaWF0ZSBhbmRcbi8vIE1lc3NhZ2VDaGFubmVsIHVzZWxlc3MgZm9yIHRoZSBwdXJwb3NlcyBvZiBBU0FQLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9xL2lzc3Vlcy8zOTZcblxuLy8gVGltZXJzIGFyZSBpbXBsZW1lbnRlZCB1bml2ZXJzYWxseS5cbi8vIFdlIGZhbGwgYmFjayB0byB0aW1lcnMgaW4gd29ya2VycyBpbiBtb3N0IGVuZ2luZXMsIGFuZCBpbiBmb3JlZ3JvdW5kXG4vLyBjb250ZXh0cyBpbiB0aGUgZm9sbG93aW5nIGJyb3dzZXJzLlxuLy8gSG93ZXZlciwgbm90ZSB0aGF0IGV2ZW4gdGhpcyBzaW1wbGUgY2FzZSByZXF1aXJlcyBudWFuY2VzIHRvIG9wZXJhdGUgaW4gYVxuLy8gYnJvYWQgc3BlY3RydW0gb2YgYnJvd3NlcnMuXG4vL1xuLy8gLSBGaXJlZm94IDMtMTNcbi8vIC0gSW50ZXJuZXQgRXhwbG9yZXIgNi05XG4vLyAtIGlQYWQgU2FmYXJpIDQuM1xuLy8gLSBMeW54IDIuOC43XG59IGVsc2Uge1xuICAgIHJlcXVlc3RGbHVzaCA9IG1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcihmbHVzaCk7XG59XG5cbi8vIGByZXF1ZXN0Rmx1c2hgIHJlcXVlc3RzIHRoYXQgdGhlIGhpZ2ggcHJpb3JpdHkgZXZlbnQgcXVldWUgYmUgZmx1c2hlZCBhc1xuLy8gc29vbiBhcyBwb3NzaWJsZS5cbi8vIFRoaXMgaXMgdXNlZnVsIHRvIHByZXZlbnQgYW4gZXJyb3IgdGhyb3duIGluIGEgdGFzayBmcm9tIHN0YWxsaW5nIHRoZSBldmVudFxuLy8gcXVldWUgaWYgdGhlIGV4Y2VwdGlvbiBoYW5kbGVkIGJ5IE5vZGUuanPigJlzXG4vLyBgcHJvY2Vzcy5vbihcInVuY2F1Z2h0RXhjZXB0aW9uXCIpYCBvciBieSBhIGRvbWFpbi5cbnJhd0FzYXAucmVxdWVzdEZsdXNoID0gcmVxdWVzdEZsdXNoO1xuXG4vLyBUbyByZXF1ZXN0IGEgaGlnaCBwcmlvcml0eSBldmVudCwgd2UgaW5kdWNlIGEgbXV0YXRpb24gb2JzZXJ2ZXIgYnkgdG9nZ2xpbmdcbi8vIHRoZSB0ZXh0IG9mIGEgdGV4dCBub2RlIGJldHdlZW4gXCIxXCIgYW5kIFwiLTFcIi5cbmZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21NdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKSB7XG4gICAgdmFyIHRvZ2dsZSA9IDE7XG4gICAgdmFyIG9ic2VydmVyID0gbmV3IEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpO1xuICAgIG9ic2VydmVyLm9ic2VydmUobm9kZSwge2NoYXJhY3RlckRhdGE6IHRydWV9KTtcbiAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4gICAgICAgIHRvZ2dsZSA9IC10b2dnbGU7XG4gICAgICAgIG5vZGUuZGF0YSA9IHRvZ2dsZTtcbiAgICB9O1xufVxuXG4vLyBUaGUgbWVzc2FnZSBjaGFubmVsIHRlY2huaXF1ZSB3YXMgZGlzY292ZXJlZCBieSBNYWx0ZSBVYmwgYW5kIHdhcyB0aGVcbi8vIG9yaWdpbmFsIGZvdW5kYXRpb24gZm9yIHRoaXMgbGlicmFyeS5cbi8vIGh0dHA6Ly93d3cubm9uYmxvY2tpbmcuaW8vMjAxMS8wNi93aW5kb3duZXh0dGljay5odG1sXG5cbi8vIFNhZmFyaSA2LjAuNSAoYXQgbGVhc3QpIGludGVybWl0dGVudGx5IGZhaWxzIHRvIGNyZWF0ZSBtZXNzYWdlIHBvcnRzIG9uIGFcbi8vIHBhZ2UncyBmaXJzdCBsb2FkLiBUaGFua2Z1bGx5LCB0aGlzIHZlcnNpb24gb2YgU2FmYXJpIHN1cHBvcnRzXG4vLyBNdXRhdGlvbk9ic2VydmVycywgc28gd2UgZG9uJ3QgbmVlZCB0byBmYWxsIGJhY2sgaW4gdGhhdCBjYXNlLlxuXG4vLyBmdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tTWVzc2FnZUNoYW5uZWwoY2FsbGJhY2spIHtcbi8vICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuLy8gICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gY2FsbGJhY2s7XG4vLyAgICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuLy8gICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuLy8gICAgIH07XG4vLyB9XG5cbi8vIEZvciByZWFzb25zIGV4cGxhaW5lZCBhYm92ZSwgd2UgYXJlIGFsc28gdW5hYmxlIHRvIHVzZSBgc2V0SW1tZWRpYXRlYFxuLy8gdW5kZXIgYW55IGNpcmN1bXN0YW5jZXMuXG4vLyBFdmVuIGlmIHdlIHdlcmUsIHRoZXJlIGlzIGFub3RoZXIgYnVnIGluIEludGVybmV0IEV4cGxvcmVyIDEwLlxuLy8gSXQgaXMgbm90IHN1ZmZpY2llbnQgdG8gYXNzaWduIGBzZXRJbW1lZGlhdGVgIHRvIGByZXF1ZXN0Rmx1c2hgIGJlY2F1c2Vcbi8vIGBzZXRJbW1lZGlhdGVgIG11c3QgYmUgY2FsbGVkICpieSBuYW1lKiBhbmQgdGhlcmVmb3JlIG11c3QgYmUgd3JhcHBlZCBpbiBhXG4vLyBjbG9zdXJlLlxuLy8gTmV2ZXIgZm9yZ2V0LlxuXG4vLyBmdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tU2V0SW1tZWRpYXRlKGNhbGxiYWNrKSB7XG4vLyAgICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuLy8gICAgICAgICBzZXRJbW1lZGlhdGUoY2FsbGJhY2spO1xuLy8gICAgIH07XG4vLyB9XG5cbi8vIFNhZmFyaSA2LjAgaGFzIGEgcHJvYmxlbSB3aGVyZSB0aW1lcnMgd2lsbCBnZXQgbG9zdCB3aGlsZSB0aGUgdXNlciBpc1xuLy8gc2Nyb2xsaW5nLiBUaGlzIHByb2JsZW0gZG9lcyBub3QgaW1wYWN0IEFTQVAgYmVjYXVzZSBTYWZhcmkgNi4wIHN1cHBvcnRzXG4vLyBtdXRhdGlvbiBvYnNlcnZlcnMsIHNvIHRoYXQgaW1wbGVtZW50YXRpb24gaXMgdXNlZCBpbnN0ZWFkLlxuLy8gSG93ZXZlciwgaWYgd2UgZXZlciBlbGVjdCB0byB1c2UgdGltZXJzIGluIFNhZmFyaSwgdGhlIHByZXZhbGVudCB3b3JrLWFyb3VuZFxuLy8gaXMgdG8gYWRkIGEgc2Nyb2xsIGV2ZW50IGxpc3RlbmVyIHRoYXQgY2FsbHMgZm9yIGEgZmx1c2guXG5cbi8vIGBzZXRUaW1lb3V0YCBkb2VzIG5vdCBjYWxsIHRoZSBwYXNzZWQgY2FsbGJhY2sgaWYgdGhlIGRlbGF5IGlzIGxlc3MgdGhhblxuLy8gYXBwcm94aW1hdGVseSA3IGluIHdlYiB3b3JrZXJzIGluIEZpcmVmb3ggOCB0aHJvdWdoIDE4LCBhbmQgc29tZXRpbWVzIG5vdFxuLy8gZXZlbiB0aGVuLlxuXG5mdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tVGltZXIoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4gICAgICAgIC8vIFdlIGRpc3BhdGNoIGEgdGltZW91dCB3aXRoIGEgc3BlY2lmaWVkIGRlbGF5IG9mIDAgZm9yIGVuZ2luZXMgdGhhdFxuICAgICAgICAvLyBjYW4gcmVsaWFibHkgYWNjb21tb2RhdGUgdGhhdCByZXF1ZXN0LiBUaGlzIHdpbGwgdXN1YWxseSBiZSBzbmFwcGVkXG4gICAgICAgIC8vIHRvIGEgNCBtaWxpc2Vjb25kIGRlbGF5LCBidXQgb25jZSB3ZSdyZSBmbHVzaGluZywgdGhlcmUncyBubyBkZWxheVxuICAgICAgICAvLyBiZXR3ZWVuIGV2ZW50cy5cbiAgICAgICAgdmFyIHRpbWVvdXRIYW5kbGUgPSBzZXRUaW1lb3V0KGhhbmRsZVRpbWVyLCAwKTtcbiAgICAgICAgLy8gSG93ZXZlciwgc2luY2UgdGhpcyB0aW1lciBnZXRzIGZyZXF1ZW50bHkgZHJvcHBlZCBpbiBGaXJlZm94XG4gICAgICAgIC8vIHdvcmtlcnMsIHdlIGVubGlzdCBhbiBpbnRlcnZhbCBoYW5kbGUgdGhhdCB3aWxsIHRyeSB0byBmaXJlXG4gICAgICAgIC8vIGFuIGV2ZW50IDIwIHRpbWVzIHBlciBzZWNvbmQgdW50aWwgaXQgc3VjY2VlZHMuXG4gICAgICAgIHZhciBpbnRlcnZhbEhhbmRsZSA9IHNldEludGVydmFsKGhhbmRsZVRpbWVyLCA1MCk7XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlVGltZXIoKSB7XG4gICAgICAgICAgICAvLyBXaGljaGV2ZXIgdGltZXIgc3VjY2VlZHMgd2lsbCBjYW5jZWwgYm90aCB0aW1lcnMgYW5kXG4gICAgICAgICAgICAvLyBleGVjdXRlIHRoZSBjYWxsYmFjay5cbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SGFuZGxlKTtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxIYW5kbGUpO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbi8vIFRoaXMgaXMgZm9yIGBhc2FwLmpzYCBvbmx5LlxuLy8gSXRzIG5hbWUgd2lsbCBiZSBwZXJpb2RpY2FsbHkgcmFuZG9taXplZCB0byBicmVhayBhbnkgY29kZSB0aGF0IGRlcGVuZHMgb25cbi8vIGl0cyBleGlzdGVuY2UuXG5yYXdBc2FwLm1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lciA9IG1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcjtcblxuLy8gQVNBUCB3YXMgb3JpZ2luYWxseSBhIG5leHRUaWNrIHNoaW0gaW5jbHVkZWQgaW4gUS4gVGhpcyB3YXMgZmFjdG9yZWQgb3V0XG4vLyBpbnRvIHRoaXMgQVNBUCBwYWNrYWdlLiBJdCB3YXMgbGF0ZXIgYWRhcHRlZCB0byBSU1ZQIHdoaWNoIG1hZGUgZnVydGhlclxuLy8gYW1lbmRtZW50cy4gVGhlc2UgZGVjaXNpb25zLCBwYXJ0aWN1bGFybHkgdG8gbWFyZ2luYWxpemUgTWVzc2FnZUNoYW5uZWwgYW5kXG4vLyB0byBjYXB0dXJlIHRoZSBNdXRhdGlvbk9ic2VydmVyIGltcGxlbWVudGF0aW9uIGluIGEgY2xvc3VyZSwgd2VyZSBpbnRlZ3JhdGVkXG4vLyBiYWNrIGludG8gQVNBUCBwcm9wZXIuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGlsZGVpby9yc3ZwLmpzL2Jsb2IvY2RkZjcyMzI1NDZhOWNmODU4NTI0Yjc1Y2RlNmY5ZWRmNzI2MjBhNy9saWIvcnN2cC9hc2FwLmpzXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHByb2Nlc3MuaHJ0aW1lIHx8IGhydGltZVxuXG4vLyBwb2x5ZmlsIGZvciB3aW5kb3cucGVyZm9ybWFuY2Uubm93XG52YXIgcGVyZm9ybWFuY2UgPSBnbG9iYWwucGVyZm9ybWFuY2UgfHwge31cbnZhciBwZXJmb3JtYW5jZU5vdyA9XG4gIHBlcmZvcm1hbmNlLm5vdyAgICAgICAgfHxcbiAgcGVyZm9ybWFuY2UubW96Tm93ICAgICB8fFxuICBwZXJmb3JtYW5jZS5tc05vdyAgICAgIHx8XG4gIHBlcmZvcm1hbmNlLm9Ob3cgICAgICAgfHxcbiAgcGVyZm9ybWFuY2Uud2Via2l0Tm93ICB8fFxuICBmdW5jdGlvbigpeyByZXR1cm4gKG5ldyBEYXRlKCkpLmdldFRpbWUoKSB9XG5cbi8vIGdlbmVyYXRlIHRpbWVzdGFtcCBvciBkZWx0YVxuLy8gc2VlIGh0dHA6Ly9ub2RlanMub3JnL2FwaS9wcm9jZXNzLmh0bWwjcHJvY2Vzc19wcm9jZXNzX2hydGltZVxuZnVuY3Rpb24gaHJ0aW1lKHByZXZpb3VzVGltZXN0YW1wKXtcbiAgdmFyIGNsb2NrdGltZSA9IHBlcmZvcm1hbmNlTm93LmNhbGwocGVyZm9ybWFuY2UpKjFlLTNcbiAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKGNsb2NrdGltZSlcbiAgdmFyIG5hbm9zZWNvbmRzID0gTWF0aC5mbG9vcigoY2xvY2t0aW1lJTEpKjFlOSlcbiAgaWYgKHByZXZpb3VzVGltZXN0YW1wKSB7XG4gICAgc2Vjb25kcyA9IHNlY29uZHMgLSBwcmV2aW91c1RpbWVzdGFtcFswXVxuICAgIG5hbm9zZWNvbmRzID0gbmFub3NlY29uZHMgLSBwcmV2aW91c1RpbWVzdGFtcFsxXVxuICAgIGlmIChuYW5vc2Vjb25kczwwKSB7XG4gICAgICBzZWNvbmRzLS1cbiAgICAgIG5hbm9zZWNvbmRzICs9IDFlOVxuICAgIH1cbiAgfVxuICByZXR1cm4gW3NlY29uZHMsbmFub3NlY29uZHNdXG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSmxiWEIwZVM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEltcGxlbWVudHMgYSBTZXJ2aWNlIExvY2F0b3IgcGF0dGVybi5cbiAqL1xuY2xhc3MgU2VydmljZUxvY2F0b3Ige1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBzZXJ2aWNlIGxvY2F0b3IgY2xhc3MuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpIHtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgdHlwZSByZWdpc3RyYXRpb25zLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9yZWdpc3RyYXRpb25zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlcnMgYSBuZXcgdHlwZSBuYW1lIGluIHRoZSBzZXJ2aWNlIGxvY2F0b3IuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIFRoZSB0eXBlIG5hbWUgdXNlZCBhcyBhIGtleSBmb3IgcmVzb2x2aW5nIGluc3RhbmNlcy5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gaW1wbGVtZW50YXRpb24gVGhlIGltcGxlbWVudGF0aW9uIChjb25zdHJ1Y3RvciBvciBjbGFzcylcblx0ICogd2hpY2ggY3JlYXRlcyBpbnN0YW5jZXMgb2YgdGhlIHNwZWNpZmllZCB0eXBlIG5hbWUuXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbj99IGlzU2luZ2xldG9uIElmIHRydWUgdGhlbiB0aGUgb25seSBpbnN0YW5jZSB3aWxsXG5cdCAqIGJlIGNyZWF0ZWQgb24gdGhlIGZpcnN0IFwicmVzb2x2ZVwiIGNhbGwgYW5kIG5leHQgY2FsbHMgd2lsbFxuXHQgKiByZXR1cm4gdGhpcyBpbnN0YW5jZS5cblx0ICovXG5cdHJlZ2lzdGVyKHR5cGUsIGltcGxlbWVudGF0aW9uLCBpc1NpbmdsZXRvbikge1xuXHRcdHRoaXMuX3Rocm93SWZOb3RGdW5jdGlvbih0eXBlLCBpbXBsZW1lbnRhdGlvbik7XG5cdFx0dGhpcy5fdGhyb3dJZk5vdFN0cmluZyh0eXBlKTtcblxuXHRcdHRoaXMuX2luaXRpYWxpemVSZWdpc3RyYXRpb24odHlwZSk7XG5cblx0XHR0aGlzLl9yZWdpc3RyYXRpb25zW3R5cGVdLnVuc2hpZnQoe1xuXHRcdFx0SW1wbGVtZW50YXRpb246IGltcGxlbWVudGF0aW9uLFxuXHRcdFx0aXNTaW5nbGV0b246IEJvb2xlYW4oaXNTaW5nbGV0b24pLFxuXHRcdFx0c2luZ2xlSW5zdGFuY2U6IG51bGxcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlcnMgYSBzaW5nbGUgaW5zdGFuY2UgZm9yIHRoZSBzcGVjaWZpZWQgdHlwZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgVGhlIHR5cGUgbmFtZSBmb3IgcmVzb2x2aW5nIHRoZSBpbnN0YW5jZS5cblx0ICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlIFRoZSBpbnN0YW5jZSB0byByZWdpc3Rlci5cblx0ICovXG5cdHJlZ2lzdGVySW5zdGFuY2UodHlwZSwgaW5zdGFuY2UpIHtcblx0XHR0aGlzLl90aHJvd0lmTm90U3RyaW5nKHR5cGUpO1xuXHRcdHRoaXMuX2luaXRpYWxpemVSZWdpc3RyYXRpb24odHlwZSk7XG5cblx0XHR0aGlzLl9yZWdpc3RyYXRpb25zW3R5cGVdLnVuc2hpZnQoe1xuXHRcdFx0SW1wbGVtZW50YXRpb246IGluc3RhbmNlLmNvbnN0cnVjdG9yLFxuXHRcdFx0aXNTaW5nbGV0b246IHRydWUsXG5cdFx0XHRzaW5nbGVJbnN0YW5jZTogaW5zdGFuY2Vcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXNvbHZlcyB0aGUgbGFzdCByZWdpc3RlcmVkIGltcGxlbWVudGF0aW9uIGJ5IHRoZSB0eXBlIG5hbWUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIFRoZSB0eXBlIG5hbWUgdG8gcmVzb2x2ZS5cblx0ICogQHJldHVybnMge09iamVjdH0gVGhlIGluc3RhbmNlIG9mIHRoZSBzcGVjaWZpZWQgdHlwZSBuYW1lLlxuXHQgKi9cblx0cmVzb2x2ZSh0eXBlKSB7XG5cdFx0dGhpcy5fdGhyb3dJZk5vdFN0cmluZyh0eXBlKTtcblx0XHR0aGlzLl90aHJvd0lmTm9UeXBlKHR5cGUpO1xuXHRcdGNvbnN0IGZpcnN0UmVnaXN0cmF0aW9uID0gdGhpcy5fcmVnaXN0cmF0aW9uc1t0eXBlXVswXTtcblx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlSW5zdGFuY2UoZmlyc3RSZWdpc3RyYXRpb24pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlc29sdmVzIGFsbCByZWdpc3RlcmVkIGltcGxlbWVudGF0aW9ucyBieSB0aGUgdHlwZSBuYW1lLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBUaGUgdHlwZSBuYW1lIGZvciByZXNvbHZpbmcgaW5zdGFuY2VzLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBsaXN0IG9mIGluc3RhbmNlcyBvZiB0aGUgc3BlY2lmaWVkIHR5cGUgbmFtZS5cblx0ICovXG5cdHJlc29sdmVBbGwodHlwZSkge1xuXHRcdHRoaXMuX3Rocm93SWZOb3RTdHJpbmcodHlwZSk7XG5cdFx0dGhpcy5fdGhyb3dJZk5vVHlwZSh0eXBlKTtcblx0XHRyZXR1cm4gdGhpcy5fcmVnaXN0cmF0aW9uc1t0eXBlXVxuXHRcdFx0Lm1hcChyZWdpc3RyYXRpb24gPT4gdGhpcy5fY3JlYXRlSW5zdGFuY2UocmVnaXN0cmF0aW9uKSk7XG5cdH1cblxuXHQvKipcblx0ICogVW5yZWdpc3RlcnMgYWxsIHJlZ2lzdHJhdGlvbnMgb2YgdGhlIHNwZWNpZmllZCB0eXBlIG5hbWUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIFRoZSB0eXBlIG5hbWUgZm9yIGRlbGV0aW5nIHRoZSByZWdpc3RyYXRpb25zLlxuXHQgKi9cblx0dW5yZWdpc3Rlcih0eXBlKSB7XG5cdFx0dGhpcy5fdGhyb3dJZk5vdFN0cmluZyh0eXBlKTtcblx0XHR0aGlzLl9yZWdpc3RyYXRpb25zW3R5cGVdID0gW107XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGZ1bmN0aW9uIGNoZWNrcyB3aGV0aGVyIGEgdHlwZSBleGlzdHMgYW5kIGlmIHRoZXJlIGlzIGF0IGxlYXN0IG9uZSBpbnN0YW5jZVxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBUaGUgdHlwZSBuYW1lXG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHQgKi9cblx0aGFzKHR5cGUpIHtcblx0XHR0aGlzLl90aHJvd0lmTm90U3RyaW5nKHR5cGUpO1xuXG5cdFx0cmV0dXJuICh0eXBlIGluIHRoaXMuX3JlZ2lzdHJhdGlvbnMgJiYgdGhpcy5fcmVnaXN0cmF0aW9uc1t0eXBlXS5sZW5ndGggPiAwKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGFuIGluc3RhbmNlIGZvciB0aGUgc3BlY2lmaWVkIHJlZ2lzdHJhdGlvbiBkZXNjcmlwdG9yLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcmVnaXN0cmF0aW9uIFRoZSByZWdpc3RyYXRpb24gZGVzY3JpcHRvciBvYmplY3QuXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBpbnN0YW5jZSBvZiB0aGUgaW1wbGVtZW50YXRpb24gZm91bmQgaW5cblx0ICogdGhlIHNwZWNpZmllZCByZWdpc3RyYXRpb24gZGVzY3JpcHRvci5cblx0ICovXG5cdF9jcmVhdGVJbnN0YW5jZShyZWdpc3RyYXRpb24pIHtcblx0XHRpZiAocmVnaXN0cmF0aW9uLmlzU2luZ2xldG9uICYmIHJlZ2lzdHJhdGlvbi5zaW5nbGVJbnN0YW5jZSAhPT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIHJlZ2lzdHJhdGlvbi5zaW5nbGVJbnN0YW5jZTtcblx0XHR9XG5cblx0XHQvLyBpbmplY3QgU2VydmljZSBMb2NhdG9yIGFzIHRoZSBvbmx5IGFyZ3VtZW50IG9mIHRoZSBjb25zdHJ1Y3Rvci5cblx0XHRjb25zdCBpbnN0YW5jZSA9IG5ldyByZWdpc3RyYXRpb24uSW1wbGVtZW50YXRpb24odGhpcyk7XG5cblx0XHRpZiAocmVnaXN0cmF0aW9uLmlzU2luZ2xldG9uKSB7XG5cdFx0XHRyZWdpc3RyYXRpb24uc2luZ2xlSW5zdGFuY2UgPSBpbnN0YW5jZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gaW5zdGFuY2U7XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZXMgYSByZWdpc3RyYXRpb24gbGlzdCBmb3IgdGhlIHNwZWNpZmllZCB0eXBlIG5hbWUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIFRoZSB0eXBlIG5hbWUgZm9yIHRoZSByZWdpc3RyYXRpb24gbGlzdC5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9pbml0aWFsaXplUmVnaXN0cmF0aW9uKHR5cGUpIHtcblx0XHRpZiAodHlwZSBpbiB0aGlzLl9yZWdpc3RyYXRpb25zKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMuX3JlZ2lzdHJhdGlvbnNbdHlwZV0gPSBbXTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIHNwZWNpZmllZCByZWdpc3RyYXRpb24gaXMgbm90IGZvdW5kLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBUaGUgdHlwZSBuYW1lIHRvIGNoZWNrLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X3Rocm93SWZOb1R5cGUodHlwZSkge1xuXHRcdGlmICh0eXBlIGluIHRoaXMuX3JlZ2lzdHJhdGlvbnMgJiZcblx0XHRcdHRoaXMuX3JlZ2lzdHJhdGlvbnNbdHlwZV0ubGVuZ3RoID4gMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aHJvdyBuZXcgRXJyb3IoYFR5cGUgXCIke3R5cGV9XCIgbm90IHJlZ2lzdGVyZWRgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIHNwZWNpZmllZCBpbXBsZW1lbnRhdGlvbiBpcyBub3QgYSBmdW5jdGlvbi5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgVGhlIHR5cGUgbmFtZSBvZiB0aGUgaW1wbGVtZW50YXRpb24uXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IEltcGxlbWVudGF0aW9uIFRoZSBpbXBsZW1lbnRhdGlvbiB0byBjaGVjay5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF90aHJvd0lmTm90RnVuY3Rpb24odHlwZSwgSW1wbGVtZW50YXRpb24pIHtcblx0XHRpZiAoSW1wbGVtZW50YXRpb24gaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRocm93IG5ldyBFcnJvcihgQ29uc3RydWN0b3IgZm9yIHR5cGUgJHt0eXBlfSBzaG91bGQgYmUgYSBmdW5jdGlvbmApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRocm93cyBhbiBlcnJvciBpZiB0aGUgc3BlY2lmaWVkIHR5cGUgbmFtZSBpcyBub3QgYSBzdHJpbmcuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIFR5cGUgbmFtZSB0byBjaGVjay5cblx0ICovXG5cdF90aHJvd0lmTm90U3RyaW5nKHR5cGUpIHtcblx0XHRpZiAodHlwZW9mICh0eXBlKSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aHJvdyBuZXcgRXJyb3IoYFR5cGUgbmFtZSBcIiR7dHlwZX1cIiBzaG91bGQgYmUgYSBzdHJpbmdgKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlcnZpY2VMb2NhdG9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBMb2dnZXJCYXNlID0gcmVxdWlyZSgnLi4vbGliL0xvZ2dlckJhc2UnKTtcblxuY2xhc3MgTG9nZ2VyIGV4dGVuZHMgTG9nZ2VyQmFzZSB7XG5cblx0LyoqXG5cdCAqIFdyaXRlcyBhIGxvZyBtZXNzYWdlLlxuXHQgKiBAcGFyYW0gIHtudW1iZXJ9IGxldmVsICAgVGhlIGxvZyBsZXZlbC5cblx0ICogQHBhcmFtICB7c3RyaW5nfEVycm9yfSBtZXNzYWdlIE1lc3NhZ2UgdG8gd3JpdGUuXG5cdCAqL1xuXHQvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuXHR3cml0ZShsZXZlbCwgbWVzc2FnZSkge1xuXHRcdGlmIChsZXZlbCA8IHRoaXMuX2xldmVsKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKGxldmVsID49IDUwKSB7XG5cdFx0XHRjb25zdCBlcnJvck1lc3NhZ2UgPSBtZXNzYWdlIGluc3RhbmNlb2YgRXJyb3IgP1xuXHRcdFx0XHRgJHttZXNzYWdlLm5hbWV9OiAke21lc3NhZ2UubWVzc2FnZX1cXG4ke21lc3NhZ2Uuc3RhY2t9YCA6XG5cdFx0XHRcdG1lc3NhZ2U7XG5cdFx0XHRjb25zb2xlLmVycm9yKGVycm9yTWVzc2FnZSk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCA+PSA0MCkge1xuXHRcdFx0Y29uc29sZS53YXJuKG1lc3NhZ2UpO1xuXHRcdH0gZWxzZSBpZiAobGV2ZWwgPj0gMzApIHtcblx0XHRcdGNvbnNvbGUuaW5mbyhtZXNzYWdlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS5sb2cobWVzc2FnZSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFdyYXBzIHRoZSBldmVudCBidXMgd2l0aCBsb2cgbWVzc2FnZXMuXG5cdCAqIEBwYXJhbSAge0V2ZW50RW1pdHRlcn0gZXZlbnRCdXMgVGhlIGV2ZW50IGJ1cyB0byB3cmFwLlxuXHQgKi9cblx0d3JhcEV2ZW50QnVzKGV2ZW50QnVzKSB7XG5cdFx0c3VwZXIud3JhcEV2ZW50QnVzKGV2ZW50QnVzKTtcblxuXHRcdGNvbnN0IHdpbmRvdyA9IHRoaXMuX2xvY2F0b3IucmVzb2x2ZSgnd2luZG93Jyk7XG5cblx0XHR3aW5kb3cub25lcnJvciA9IChtc2csIHVyaSwgbGluZSkgPT4ge1xuXHRcdFx0dGhpcy5mYXRhbChgJHt1cml9OiR7bGluZX0gJHttc2d9YCk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9O1xuXG5cdFx0aWYgKHRoaXMuX2xldmVsID4gMjApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRldmVudEJ1c1xuXHRcdFx0Lm9uKCdkb2N1bWVudFVwZGF0ZWQnLCBhcmdzID0+XG5cdFx0XHRcdHRoaXMuZGVidWcoYERvY3VtZW50IHVwZGF0ZWQgKCR7YXJncy5sZW5ndGh9IHN0b3JlKHMpIGNoYW5nZWQpYCkpXG5cdFx0XHQub24oJ2NvbXBvbmVudEJvdW5kJywgYXJncyA9PiB7XG5cdFx0XHRcdGNvbnN0IGlkID0gYXJncy5pZCA/IGAjJHthcmdzLmlkfWAgOiAnJztcblx0XHRcdFx0dGhpcy5kZWJ1ZyhgQ29tcG9uZW50IFwiJHthcmdzLmVsZW1lbnQudGFnTmFtZX0ke2lkfVwiIGlzIGJvdW5kYCk7XG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdjb21wb25lbnRVbmJvdW5kJywgYXJncyA9PiB7XG5cdFx0XHRcdGNvbnN0IGlkID0gYXJncy5pZCA/IGAjJHthcmdzLmlkfWAgOiAnJztcblx0XHRcdFx0dGhpcy5kZWJ1ZyhgQ29tcG9uZW50IFwiJHthcmdzLmVsZW1lbnQudGFnTmFtZX0ke2lkfVwiIGlzIHVuYm91bmRgKTtcblx0XHRcdH0pO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTG9nZ2VyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBERUZBVUxUX0xFVkVMID0gMzA7XG5jb25zdCBERUZBVUxUX05BTUUgPSAnY2F0YmVycnknO1xuXG5jb25zdCBwcmV0dHlIclRpbWUgPSByZXF1aXJlKCdwcmV0dHktaHJ0aW1lJyk7XG5cbmNsYXNzIExvZ2dlckJhc2Uge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIGJhc2ljIHRoaXMuXG5cdCAqIEBwYXJhbSAge1NlcnZpY2VMb2NhdG9yfSBsb2NhdG9yIExvY2F0b3IgZm9yIHJlc29sdmluZyBkZXBlbmRlbmNpZXMuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihsb2NhdG9yKSB7XG5cdFx0Y29uc3QgY29uZmlnID0gbG9jYXRvci5yZXNvbHZlKCdjb25maWcnKS5sb2dnZXIgfHwge307XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IFNlcnZpY2UgTG9jYXRvci5cblx0XHQgKiBAdHlwZSB7U2VydmljZUxvY2F0b3J9XG5cdFx0ICogQHByb3RlY3RlZFxuXHRcdCAqL1xuXHRcdHRoaXMuX2xvY2F0b3IgPSBsb2NhdG9yO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBsb2dnaW5nIGxldmVsLlxuXHRcdCAqIEB0eXBlIHtudW1iZXJ9XG5cdFx0ICogQHByb3RlY3RlZFxuXHRcdCAqL1xuXHRcdHRoaXMuX2xldmVsID0gdHlwZW9mIChjb25maWcubGV2ZWwpID09PSAnbnVtYmVyJyA/IGNvbmZpZy5sZXZlbCA6IERFRkFVTFRfTEVWRUw7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IGxvZ2dlciBuYW1lLlxuXHRcdCAqIEB0eXBlIHtzdHJpbmd9XG5cdFx0ICogQHByb3RlY3RlZFxuXHRcdCAqL1xuXHRcdHRoaXMuX25hbWUgPSB0eXBlb2YgKGNvbmZpZy5uYW1lKSA9PT0gJ3N0cmluZycgPyBjb25maWcubmFtZSA6IERFRkFVTFRfTkFNRTtcblxuXHRcdGNvbnN0IGV2ZW50QnVzID0gbG9jYXRvci5yZXNvbHZlKCdldmVudEJ1cycpO1xuXHRcdHRoaXMud3JhcEV2ZW50QnVzKGV2ZW50QnVzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBMb2dzIGEgdHJhY2UgbWVzc2FnZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gd3JpdGUuXG5cdCAqL1xuXHR0cmFjZShtZXNzYWdlKSB7XG5cdFx0dGhpcy53cml0ZSgxMCwgbWVzc2FnZSk7XG5cdH1cblxuXHQvKipcblx0ICogTG9ncyBhIGRlYnVnIG1lc3NhZ2UuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIHdyaXRlLlxuXHQgKi9cblx0ZGVidWcobWVzc2FnZSkge1xuXHRcdHRoaXMud3JpdGUoMjAsIG1lc3NhZ2UpO1xuXHR9XG5cblx0LyoqXG5cdCAqIExvZ3MgYW4gaW5mbyBtZXNzYWdlLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgbWVzc2FnZSB0byB3cml0ZS5cblx0ICovXG5cdGluZm8obWVzc2FnZSkge1xuXHRcdHRoaXMud3JpdGUoMzAsIG1lc3NhZ2UpO1xuXHR9XG5cblx0LyoqXG5cdCAqIExvZ3MgYSB3YXJuaW5nIG1lc3NhZ2UuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIHdyaXRlLlxuXHQgKi9cblx0d2FybihtZXNzYWdlKSB7XG5cdFx0dGhpcy53cml0ZSg0MCwgbWVzc2FnZSk7XG5cdH1cblxuXHQvKipcblx0ICogTG9ncyBhbiBlcnJvciBtZXNzYWdlLlxuXHQgKiBAcGFyYW0ge3N0cmluZ3xFcnJvcn0gbWVzc2FnZSBUaGUgbWVzc2FnZSB0byB3cml0ZS5cblx0ICovXG5cdGVycm9yKG1lc3NhZ2UpIHtcblx0XHR0aGlzLndyaXRlKDUwLCBtZXNzYWdlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBMb2dzIGEgZmF0YWwgZXJyb3IgbWVzc2FnZS5cblx0ICogQHBhcmFtIHtzdHJpbmd8RXJyb3J9IG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gd3JpdGUuXG5cdCAqL1xuXHRmYXRhbChtZXNzYWdlKSB7XG5cdFx0dGhpcy53cml0ZSg2MCwgbWVzc2FnZSk7XG5cdH1cblxuXHQvKipcblx0ICogV3JhcHMgdGhlIGV2ZW50IGJ1cyB3aXRoIGxvZyBtZXNzYWdlcy5cblx0ICogQHBhcmFtICB7RXZlbnRFbWl0dGVyfSBldmVudEJ1cyBUaGUgZXZlbnQgYnVzIHRvIHdyYXAuXG5cdCAqL1xuXHR3cmFwRXZlbnRCdXMoZXZlbnRCdXMpIHtcblx0XHRpZiAodGhpcy5fbGV2ZWwgPiA1MCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRldmVudEJ1cy5vbignZXJyb3InLCBlcnJvciA9PiB0aGlzLmVycm9yKGVycm9yKSk7XG5cblx0XHRpZiAodGhpcy5fbGV2ZWwgPiA0MCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRldmVudEJ1cy5vbignd2FybicsIG1zZyA9PiB0aGlzLndhcm4obXNnKSk7XG5cblx0XHRpZiAodGhpcy5fbGV2ZWwgPiAzMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGV2ZW50QnVzXG5cdFx0XHQub24oJ2luZm8nLCBtc2cgPT4gdGhpcy5pbmZvKG1zZykpXG5cdFx0XHQub24oJ2NvbXBvbmVudExvYWRlZCcsIGFyZ3MgPT4gdGhpcy5pbmZvKGBDb21wb25lbnQgXCIke2FyZ3MubmFtZX1cIiBsb2FkZWRgKSlcblx0XHRcdC5vbignc3RvcmVMb2FkZWQnLCBhcmdzID0+IHRoaXMuaW5mbyhgU3RvcmUgXCIke2FyZ3MubmFtZX1cIiBsb2FkZWRgKSlcblx0XHRcdC5vbignYWxsU3RvcmVzTG9hZGVkJywgKCkgPT4gdGhpcy5pbmZvKCdBbGwgc3RvcmVzIGxvYWRlZCcpKVxuXHRcdFx0Lm9uKCdhbGxDb21wb25lbnRzTG9hZGVkJywgKCkgPT4gdGhpcy5pbmZvKCdBbGwgY29tcG9uZW50cyBsb2FkZWQnKSk7XG5cblx0XHRpZiAodGhpcy5fbGV2ZWwgPiAyMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGV2ZW50QnVzXG5cdFx0XHQub24oJ2RlYnVnJywgbXNnID0+IHRoaXMuZGVidWcobXNnKSlcblx0XHRcdC5vbignY29tcG9uZW50UmVuZGVyJywgYXJncyA9PiB7XG5cdFx0XHRcdGNvbnN0IGlkID0gZ2V0SWQoYXJncy5jb250ZXh0KTtcblx0XHRcdFx0Y29uc3QgdGFnTmFtZSA9IGdldFRhZ05hbWVGb3JDb21wb25lbnROYW1lKGFyZ3MubmFtZSk7XG5cdFx0XHRcdHRoaXMuZGVidWcoYENvbXBvbmVudCBcIiR7dGFnTmFtZX0ke2lkfVwiIGlzIGJlaW5nIHJlbmRlcmVkLi4uYCk7XG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdjb21wb25lbnRSZW5kZXJlZCcsIGFyZ3MgPT4ge1xuXHRcdFx0XHRjb25zdCBpZCA9IGdldElkKGFyZ3MuY29udGV4dCk7XG5cdFx0XHRcdGNvbnN0IHRhZ05hbWUgPSBnZXRUYWdOYW1lRm9yQ29tcG9uZW50TmFtZShhcmdzLm5hbWUpO1xuXHRcdFx0XHRjb25zdCB0aW1lID0gQXJyYXkuaXNBcnJheShhcmdzLmhyVGltZSkgP1xuXHRcdFx0XHRcdGAgKCR7cHJldHR5SHJUaW1lKGFyZ3MuaHJUaW1lKX0pYCA6ICcnO1xuXHRcdFx0XHR0aGlzLmRlYnVnKGBDb21wb25lbnQgXCIke3RhZ05hbWV9JHtpZH1cIiByZW5kZXJlZCR7dGltZX1gKTtcblx0XHRcdH0pXG5cdFx0XHQub24oJ2RvY3VtZW50UmVuZGVyZWQnLFxuXHRcdFx0XHRhcmdzID0+IHRoaXMuZGVidWcoYERvY3VtZW50IHJlbmRlcmVkIGZvciBVUkkgJHthcmdzLmxvY2F0aW9uLnRvU3RyaW5nKCl9YCkpO1xuXG5cdFx0aWYgKHRoaXMuX2xldmVsID4gMTApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRldmVudEJ1cy5vbigndHJhY2UnLCBtc2cgPT4gdGhpcy50cmFjZShtc2cpKTtcblx0fVxufVxuXG4vKipcbiAqIEdldHMgYW4gSUQgZm9yIGxvZ2dpbmcgY29tcG9uZW50LXJlbGF0ZWQgbWVzc2FnZXMuXG4gKiBAcGFyYW0gIHtPYmplY3R9IGNvbnRleHQgVGhlIGNvbXBvbmVudCdzIGNvbnRleHQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBJRCBvZiB0aGUgZWxlbWVudCBzdGFydGluZyB3aXRoICcjJy5cbiAqL1xuZnVuY3Rpb24gZ2V0SWQoY29udGV4dCkge1xuXHRjb25zdCBpZCA9IGNvbnRleHQuYXR0cmlidXRlcy5pZDtcblx0cmV0dXJuIGlkID8gYCMke2lkfWAgOiAnJztcbn1cblxuLyoqXG4gKiBHZXRzIGEgdGFnIG5hbWUgZm9yIGEgY29tcG9uZW50LlxuICogQHBhcmFtICB7c3RyaW5nfSBjb21wb25lbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBjb21wb25lbnQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSB0YWcgbmFtZSBvZiB0aGUgY29tcG9uZW50LlxuICovXG5mdW5jdGlvbiBnZXRUYWdOYW1lRm9yQ29tcG9uZW50TmFtZShjb21wb25lbnROYW1lKSB7XG5cdGlmICh0eXBlb2YgKGNvbXBvbmVudE5hbWUpICE9PSAnc3RyaW5nJykge1xuXHRcdHJldHVybiAnJztcblx0fVxuXHRjb25zdCB1cHBlckNvbXBvbmVudE5hbWUgPSBjb21wb25lbnROYW1lLnRvVXBwZXJDYXNlKCk7XG5cdGlmIChjb21wb25lbnROYW1lID09PSAnSEVBRCcpIHtcblx0XHRyZXR1cm4gdXBwZXJDb21wb25lbnROYW1lO1xuXHR9XG5cdGlmIChjb21wb25lbnROYW1lID09PSAnRE9DVU1FTlQnKSB7XG5cdFx0cmV0dXJuICdIVE1MJztcblx0fVxuXHRyZXR1cm4gYENBVC0ke3VwcGVyQ29tcG9uZW50TmFtZX1gO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExvZ2dlckJhc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHB1Z1J1bnRpbWVXcmFwID0gcmVxdWlyZSgncHVnLXJ1bnRpbWUvd3JhcCcpO1xuXG5jbGFzcyBUZW1wbGF0ZVByb3ZpZGVyIHtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBuZXcgaW5zdGFuY2Ugb2YgUHVnIHRlbXBsYXRlIHByb3ZpZGVyLlxuXHQgKiBAcGFyYW0ge0xvY2F0b3J9IGxvY2F0b3IgVGhlIHNlcnZpY2UgbG9jYXRvciBmb3IgcmVzb2x2aW5nIGRlcGVuZGVuY2llcy5cblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihsb2NhdG9yKSB7XG5cdFx0Y29uc3QgY29uZmlnID0gbG9jYXRvci5yZXNvbHZlKCdjb25maWcnKSB8fCB7fTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgUHVnIGZhY3RvcnkuXG5cdFx0ICogQHR5cGUge1B1Z31cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX3B1ZyA9IGxvY2F0b3IucmVzb2x2ZSgncHVnJyk7XG5cblx0XHR0aGlzLl9tZXJnZSA9IHRoaXMuX3B1Zy5tZXJnZTtcblxuXHRcdC8qKlxuXHRcdCAqIENvbmZpZyBmb3IgUHVnXG5cdFx0ICpcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX3B1Z09wdGlvbnMgPSBjb25maWcucHVnT3B0aW9ucyB8fCB7fTtcblxuXHRcdC8qKlxuXHRcdCAqIFRlbXBsYXRlIHByb3ZpZGVyIGdsb2JhbHNcblx0XHQgKlxuXHRcdCAqIEBwdWJsaWNcblx0XHQgKi9cblx0XHR0aGlzLmdsb2JhbHMgPSBjb25maWcudGVtcGxhdGUgJiYgY29uZmlnLnRlbXBsYXRlLmdsb2JhbHMgPyBjb25maWcudGVtcGxhdGUuZ2xvYmFscyA6IHt9O1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBzZXQgb2YgcmVnaXN0ZXJlZCB0ZW1wbGF0ZXMuXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX3RlbXBsYXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgdGVtcGxhdGUgcHJvdmlkZXIgbmFtZSBmb3IgaWRlbnRpZmljYXRpb24uXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IE5hbWUgb2YgdGhlIHByb3ZpZGVyLlxuXHQgKi9cblx0Z2V0TmFtZSgpIHtcblx0XHRyZXR1cm4gJ3B1Zyc7XG5cdH1cblxuXHQvKipcblx0ICogUmVnaXN0ZXJzIGNvbXBpbGVkIChwcmVjb21waWxlZCkgUHVnIHRlbXBsYXRlLlxuXHQgKiBodHRwOi8vcHVnanMuY29tL3JlZmVyZW5jZS5odG1sXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRlbXBsYXRlIG5hbWUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjb21waWxlZCBDb21waWxlZCB0ZW1wbGF0ZSBzb3VyY2UuXG5cdCAqL1xuXHRyZWdpc3RlckNvbXBpbGVkKG5hbWUsIGNvbXBpbGVkKSB7XG5cdFx0dGhpcy5fdGVtcGxhdGVzW25hbWVdID0gcHVnUnVudGltZVdyYXAoY29tcGlsZWQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbmRlcnMgdGVtcGxhdGUgd2l0aCBzcGVjaWZpZWQgZGF0YS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZSBvZiB0ZW1wbGF0ZS5cblx0ICogQHBhcmFtIHtPYmplY3R9IGRhdGEgRGF0YSBjb250ZXh0IGZvciB0ZW1wbGF0ZS5cblx0ICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nPn0gUHJvbWlzZSBmb3IgcmVuZGVyZWQgSFRNTC5cblx0ICovXG5cdHJlbmRlcihuYW1lLCBkYXRhKSB7XG5cdFx0aWYgKCEobmFtZSBpbiB0aGlzLl90ZW1wbGF0ZXMpKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGBcIiR7bmFtZX1cIiBub3QgZm91bmQgYW1vbmcgcmVnaXN0ZXJlZCB0ZW1wbGF0ZXNgKSk7XG5cdFx0fVxuXHRcdGxldCBwcm9taXNlO1xuXHRcdHRyeSB7XG5cblx0XHRcdC8qIFNraXAgbWVyZ2UgaWYgZ2xvYmFscyBkb2Vzbid0IGV4aXN0ICovXG5cdFx0XHRjb25zdCBtZXJnZWREYXRhID0gdGhpcy5nbG9iYWxzID8gdGhpcy5fbWVyZ2UodGhpcy5fbWVyZ2Uoe30sIHRoaXMuZ2xvYmFscyksIGRhdGEgfHwge30pIDogZGF0YTtcblx0XHRcdHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUodGhpcy5fdGVtcGxhdGVzW25hbWVdKG1lcmdlZERhdGEpKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRwcm9taXNlID0gUHJvbWlzZS5yZWplY3QoZSk7XG5cdFx0fVxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGVtcGxhdGVQcm92aWRlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdwdWctcnVudGltZScpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBVSFJCYXNlID0gcmVxdWlyZSgnLi4vbGliL1VIUkJhc2UnKTtcblxuY29uc3QgTk9OX1NBRkVfSEVBREVSUyA9IHtcblx0Y29va2llOiB0cnVlLFxuXHQnYWNjZXB0LWNoYXJzZXQnOiB0cnVlXG59O1xuXG5jbGFzcyBVSFIgZXh0ZW5kcyBVSFJCYXNlIHtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgY2xpZW50LXNpZGUgSFRUUChTKSByZXF1ZXN0IGltcGxlbWVudGF0aW9uLlxuXHQgKiBAcGFyYW0ge1NlcnZpY2VMb2NhdG9yfSBsb2NhdG9yIFRoZSBzZXJ2aWNlIGxvY2F0b3IgZm9yIHJlc29sdmluZyBkZXBlbmRlbmNpZXMuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihsb2NhdG9yKSB7XG5cdFx0c3VwZXIoKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgaW5zdGFuY2Ugb2Ygd2luZG93LlxuXHRcdCAqIEB0eXBlIHtXaW5kb3d9XG5cdFx0ICovXG5cdFx0dGhpcy53aW5kb3cgPSBsb2NhdG9yLnJlc29sdmUoJ3dpbmRvdycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERvZXMgcmVxdWVzdCB3aXRoIHNwZWNpZmllZCBwYXJhbWV0ZXJzIHVzaW5nIHByb3RvY29sIGltcGxlbWVudGF0aW9uLlxuXHQgKiBAcGFyYW0ge09iamVjdD99IHBhcmFtZXRlcnMgVGhlIHJlcXVlc3QgcGFyYW1ldGVycy5cblx0ICogQHBhcmFtIHtzdHJpbmc/fSBwYXJhbWV0ZXJzLm1ldGhvZCBUaGUgSFRUUCBtZXRob2QgZm9yIHRoZSByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge3N0cmluZz99IHBhcmFtZXRlcnMudXJsIFRoZSBVUkwgZm9yIHRoZSByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge1VSSX0gcGFyYW1ldGVycy51cmkgVGhlIFVSSSBvYmplY3QuXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gcGFyYW1ldGVycy5oZWFkZXJzIFRoZSBIVFRQIGhlYWRlcnMgdG8gc2VuZC5cblx0ICogQHBhcmFtIHsoc3RyaW5nfE9iamVjdCk/fSBwYXJhbWV0ZXJzLmRhdGEgVGhlIGRhdGEgdG8gc2VuZC5cblx0ICogQHBhcmFtIHtudW1iZXI/fSBwYXJhbWV0ZXJzLnRpbWVvdXQgVGhlIHJlcXVlc3QgdGltZW91dC5cblx0ICogQHBhcmFtIHtib29sZWFuP30gcGFyYW1ldGVycy51bnNhZmVIVFRQUyBJZiB0cnVlIHRoZW4gcmVxdWVzdHMgdG8gc2VydmVycyB3aXRoXG5cdCAqIGludmFsaWQgSFRUUFMgY2VydGlmaWNhdGVzIGFyZSBhbGxvd2VkLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZTxPYmplY3Q+fSBQcm9taXNlIGZvciB0aGUgcmVzdWx0IHdpdGggYSBzdGF0dXMgb2JqZWN0IGFuZCBjb250ZW50LlxuXHQgKi9cblx0X2RvUmVxdWVzdChwYXJhbWV0ZXJzKSB7XG5cdFx0T2JqZWN0LmtleXMocGFyYW1ldGVycy5oZWFkZXJzKVxuXHRcdFx0LmZvckVhY2gobmFtZSA9PiB7XG5cdFx0XHRcdGlmIChOT05fU0FGRV9IRUFERVJTLmhhc093blByb3BlcnR5KG5hbWUudG9Mb3dlckNhc2UoKSkpIHtcblx0XHRcdFx0XHRkZWxldGUgcGFyYW1ldGVycy5oZWFkZXJzW25hbWVdO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG5cdFx0XHRjb25zdCB4aHIgPSBuZXcgdGhpcy53aW5kb3cuWE1MSHR0cFJlcXVlc3QoKTtcblx0XHRcdHZhciByZXF1ZXN0RXJyb3IgPSBudWxsO1xuXG5cdFx0XHR4aHIub25hYm9ydCA9ICgpID0+IHtcblx0XHRcdFx0cmVxdWVzdEVycm9yID0gbmV3IEVycm9yKCdSZXF1ZXN0IGFib3J0ZWQnKTtcblx0XHRcdFx0cmVqZWN0KHJlcXVlc3RFcnJvcik7XG5cdFx0XHR9O1xuXHRcdFx0eGhyLm9udGltZW91dCA9ICgpID0+IHtcblx0XHRcdFx0cmVxdWVzdEVycm9yID0gbmV3IEVycm9yKCdSZXF1ZXN0IHRpbWVvdXQnKTtcblx0XHRcdFx0cmVqZWN0KHJlcXVlc3RFcnJvcik7XG5cdFx0XHR9O1xuXHRcdFx0eGhyLm9uZXJyb3IgPSAoKSA9PiB7XG5cdFx0XHRcdHJlcXVlc3RFcnJvciA9IG5ldyBFcnJvcih4aHIuc3RhdHVzVGV4dCB8fCAnQ29ubmVjdGlvbiBlcnJvcicpO1xuXHRcdFx0XHRyZWplY3QocmVxdWVzdEVycm9yKTtcblx0XHRcdH07XG5cdFx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuXHRcdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgIT09IDQpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHJlcXVlc3RFcnJvcikge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zdCBzdGF0dXMgPSB0aGlzLl9nZXRTdGF0dXNPYmplY3QoeGhyKTtcblx0XHRcdFx0Y29uc3QgY29udGVudCA9IHRoaXMuY29udmVydFJlc3BvbnNlKHN0YXR1cy5oZWFkZXJzLCB4aHIucmVzcG9uc2VUZXh0KTtcblx0XHRcdFx0ZnVsZmlsbCh7XG5cdFx0XHRcdFx0c3RhdHVzLFxuXHRcdFx0XHRcdGNvbnRlbnRcblx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCB1c2VyID0gcGFyYW1ldGVycy51cmkuYXV0aG9yaXR5LnVzZXJJbmZvID9cblx0XHRcdFx0XHRwYXJhbWV0ZXJzLnVyaS5hdXRob3JpdHkudXNlckluZm8udXNlciA6IG51bGw7XG5cdFx0XHRjb25zdCBwYXNzd29yZCA9IHBhcmFtZXRlcnMudXJpLmF1dGhvcml0eS51c2VySW5mbyA/XG5cdFx0XHRcdFx0cGFyYW1ldGVycy51cmkuYXV0aG9yaXR5LnVzZXJJbmZvLnBhc3N3b3JkIDogbnVsbDtcblx0XHRcdHhoci5vcGVuKFxuXHRcdFx0XHRwYXJhbWV0ZXJzLm1ldGhvZCwgcGFyYW1ldGVycy51cmkudG9TdHJpbmcoKSwgdHJ1ZSxcblx0XHRcdFx0dXNlciB8fCB1bmRlZmluZWQsIHBhc3N3b3JkIHx8IHVuZGVmaW5lZFxuXHRcdFx0KTtcblx0XHRcdHhoci50aW1lb3V0ID0gcGFyYW1ldGVycy50aW1lb3V0O1xuXG5cdFx0XHRpZiAocGFyYW1ldGVycy53aXRoQ3JlZGVudGlhbHMpIHtcblx0XHRcdFx0eGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdE9iamVjdC5rZXlzKHBhcmFtZXRlcnMuaGVhZGVycylcblx0XHRcdFx0LmZvckVhY2goaGVhZGVyTmFtZSA9PiB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXJOYW1lLCBwYXJhbWV0ZXJzLmhlYWRlcnNbaGVhZGVyTmFtZV0pKTtcblxuXHRcdFx0eGhyLnNlbmQocGFyYW1ldGVycy5kYXRhKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBzdGF0dXMgb2JqZWN0IGZvciB0aGUgc3BlY2lmaWVkIFhIUiBvYmplY3QuXG5cdCAqIEBwYXJhbSB7WG1sSHR0cFJlcXVlc3R9IHhociBYSFIgb2JqZWN0LlxuXHQgKiBAcmV0dXJucyB7e2NvZGU6IG51bWJlciwgdGV4dDogc3RyaW5nLCBoZWFkZXJzOiBPYmplY3R9fSBUaGUgc3RhdHVzIG9iamVjdC5cblx0ICovXG5cdF9nZXRTdGF0dXNPYmplY3QoeGhyKSB7XG5cdFx0Y29uc3QgaGVhZGVycyA9IHt9O1xuXG5cdFx0aWYgKCF4aHIpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGNvZGU6IDAsXG5cdFx0XHRcdHRleHQ6ICcnLFxuXHRcdFx0XHRoZWFkZXJzXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHhoclxuXHRcdFx0LmdldEFsbFJlc3BvbnNlSGVhZGVycygpXG5cdFx0XHQuc3BsaXQoJ1xcbicpXG5cdFx0XHQuZm9yRWFjaChoZWFkZXIgPT4ge1xuXHRcdFx0XHRjb25zdCBkZWxpbWl0ZXJJbmRleCA9IGhlYWRlci5pbmRleE9mKCc6Jyk7XG5cdFx0XHRcdGlmIChkZWxpbWl0ZXJJbmRleCA8PSAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IGhlYWRlck5hbWUgPSBoZWFkZXJcblx0XHRcdFx0XHQuc3Vic3RyaW5nKDAsIGRlbGltaXRlckluZGV4KVxuXHRcdFx0XHRcdC50cmltKClcblx0XHRcdFx0XHQudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0aGVhZGVyc1toZWFkZXJOYW1lXSA9IGhlYWRlclxuXHRcdFx0XHRcdC5zdWJzdHJpbmcoZGVsaW1pdGVySW5kZXggKyAxKVxuXHRcdFx0XHRcdC50cmltKCk7XG5cdFx0XHR9KTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHQvLyBoYW5kbGUgSUU5IGJ1ZzogaHR0cDovL2dvby5nbC9pZHNwU3Jcblx0XHRcdGNvZGU6IHhoci5zdGF0dXMgPT09IDEyMjMgPyAyMDQgOiB4aHIuc3RhdHVzLFxuXHRcdFx0dGV4dDogeGhyLnN0YXR1cyA9PT0gMTIyMyA/ICdObyBDb250ZW50JyA6IHhoci5zdGF0dXNUZXh0LFxuXHRcdFx0aGVhZGVyc1xuXHRcdH07XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVSFI7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGNhdGJlcnJ5VXJpID0gcmVxdWlyZSgnY2F0YmVycnktdXJpJyk7XG5jb25zdCBRdWVyeSA9IGNhdGJlcnJ5VXJpLlF1ZXJ5O1xuY29uc3QgVVJJID0gY2F0YmVycnlVcmkuVVJJO1xuXG5jb25zdCBERUZBVUxUX1RJTUVPVVQgPSAzMDAwMDtcbmNvbnN0IEhUVFBfUFJPVE9DT0xfUkVHRVhQID0gL14oaHR0cClzPyQvaTtcblxuLy8gVGhpcyBtb2R1bGUgd2VyZSBkZXZlbG9wZWQgdXNpbmcgSFRUUC8xLjF2MiBSRkMgMjYxNlxuLy8gKGh0dHA6Ly93d3cudzMub3JnL1Byb3RvY29scy9yZmMyNjE2LylcbmNsYXNzIFVIUkJhc2Uge1xuXG5cdHN0YXRpYyBnZXQgTUVUSE9EUygpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0R0VUOiAnR0VUJyxcblx0XHRcdEhFQUQ6ICdIRUFEJyxcblx0XHRcdFBPU1Q6ICdQT1NUJyxcblx0XHRcdFBVVDogJ1BVVCcsXG5cdFx0XHRQQVRDSDogJ1BBVENIJyxcblx0XHRcdERFTEVURTogJ0RFTEVURScsXG5cdFx0XHRPUFRJT05TOiAnT1BUSU9OUycsXG5cdFx0XHRUUkFDRTogJ1RSQUNFJyxcblx0XHRcdENPTk5FQ1Q6ICdDT05ORUNUJ1xuXHRcdH07XG5cdH1cblxuXHRzdGF0aWMgZ2V0IFRZUEVTKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRVUkxfRU5DT0RFRDogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG5cdFx0XHRKU09OOiAnYXBwbGljYXRpb24vanNvbicsXG5cdFx0XHRQTEFJTl9URVhUOiAndGV4dC9wbGFpbicsXG5cdFx0XHRIVE1MOiAndGV4dC9odG1sJ1xuXHRcdH07XG5cdH1cblxuXHRzdGF0aWMgZ2V0IENIQVJTRVQoKSB7XG5cdFx0cmV0dXJuICdVVEYtOCc7XG5cdH1cblxuXHRzdGF0aWMgZ2V0IERFRkFVTFRfR0VORVJBTF9IRUFERVJTKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRBY2NlcHQ6IGAke1VIUkJhc2UuVFlQRVMuSlNPTn07IHE9MC43LCAke1VIUkJhc2UuVFlQRVMuSFRNTH07IHE9MC4yLCAke1VIUkJhc2UuVFlQRVMuUExBSU5fVEVYVH07IHE9MC4xYCxcblx0XHRcdCdBY2NlcHQtQ2hhcnNldCc6IGAke1VIUkJhc2UuQ0hBUlNFVH07IHE9MWBcblx0XHR9O1xuXHR9XG5cblx0c3RhdGljIGdldCBDSEFSU0VUX1BBUkFNRVRFUigpIHtcblx0XHRyZXR1cm4gYDsgY2hhcnNldD0ke1VIUkJhc2UuQ0hBUlNFVH1gO1xuXHR9XG5cblx0c3RhdGljIGdldCBVUkxfRU5DT0RFRF9FTlRJVFlfQ09OVEVOVF9UWVBFKCkge1xuXHRcdHJldHVybiBVSFJCYXNlLlRZUEVTLlVSTF9FTkNPREVEICsgVUhSQmFzZS5DSEFSU0VUX1BBUkFNRVRFUjtcblx0fVxuXG5cdHN0YXRpYyBnZXQgSlNPTl9FTlRJVFlfQ09OVEVOVF9UWVBFKCkge1xuXHRcdHJldHVybiBVSFJCYXNlLlRZUEVTLkpTT04gKyBVSFJCYXNlLkNIQVJTRVRfUEFSQU1FVEVSO1xuXHR9XG5cblx0c3RhdGljIGdldCBQTEFJTl9URVhUX0VOVElUWV9DT05URU5UX1RZUEUoKSB7XG5cdFx0cmV0dXJuIFVIUkJhc2UuVFlQRVMuUExBSU5fVEVYVCArIFVIUkJhc2UuQ0hBUlNFVF9QQVJBTUVURVI7XG5cdH1cblxuXHQvKipcblx0ICogRG9lcyBhIEdFVCByZXF1ZXN0IHRvIHRoZSBIVFRQIHNlcnZlci5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHVybCBVUkwgdG8gcmVxdWVzdC5cblx0ICogQHBhcmFtIHtPYmplY3Q/fSBwYXJhbWV0ZXJzIFRoZSByZXF1ZXN0IHBhcmFtZXRlcnMuXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gcGFyYW1ldGVycy5oZWFkZXJzIFRoZSBIVFRQIGhlYWRlcnMgdG8gc2VuZC5cblx0ICogQHBhcmFtIHsoc3RyaW5nfE9iamVjdCk/fSBwYXJhbWV0ZXJzLmRhdGEgVGhlIGRhdGEgdG8gc2VuZC5cblx0ICogQHBhcmFtIHtudW1iZXI/fSBwYXJhbWV0ZXJzLnRpbWVvdXQgVGhlIHJlcXVlc3QgdGltZW91dC5cblx0ICogQHBhcmFtIHtib29sZWFuP30gcGFyYW1ldGVycy51bnNhZmVIVFRQUyBJZiB0cnVlIHRoZW4gcmVxdWVzdHMgdG8gc2VydmVycyB3aXRoXG5cdCAqIGludmFsaWQgSFRUUFMgY2VydGlmaWNhdGVzIGFyZSBhbGxvd2VkLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZTxPYmplY3Q+fSBUaGUgcHJvbWlzZSBmb3IgYSByZXN1bHQgd2l0aCB0aGUgc3RhdHVzIG9iamVjdCBhbmQgY29udGVudC5cblx0ICovXG5cdGdldCh1cmwsIHBhcmFtZXRlcnMpIHtcblx0XHRyZXR1cm4gdGhpcy5yZXF1ZXN0KHRoaXMuX25vcm1hbGl6ZU9wdGlvbnMoVUhSQmFzZS5NRVRIT0RTLkdFVCwgdXJsLCBwYXJhbWV0ZXJzKSk7XG5cdH1cblxuXHQvKipcblx0ICogRG9lcyBhIFBPU1QgcmVxdWVzdCB0byB0aGUgSFRUUCBzZXJ2ZXIuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVVJMIHRvIHJlcXVlc3QuXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gcGFyYW1ldGVycyBUaGUgcmVxdWVzdCBwYXJhbWV0ZXJzLlxuXHQgKiBAcGFyYW0ge09iamVjdD99IHBhcmFtZXRlcnMuaGVhZGVycyBUaGUgSFRUUCBoZWFkZXJzIHRvIHNlbmQuXG5cdCAqIEBwYXJhbSB7KHN0cmluZ3xPYmplY3QpP30gcGFyYW1ldGVycy5kYXRhIFRoZSBkYXRhIHRvIHNlbmQuXG5cdCAqIEBwYXJhbSB7bnVtYmVyP30gcGFyYW1ldGVycy50aW1lb3V0IFRoZSByZXF1ZXN0IHRpbWVvdXQuXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbj99IHBhcmFtZXRlcnMudW5zYWZlSFRUUFMgSWYgdHJ1ZSB0aGVuIHJlcXVlc3RzIHRvIHNlcnZlcnMgd2l0aFxuXHQgKiBpbnZhbGlkIEhUVFBTIGNlcnRpZmljYXRlcyBhcmUgYWxsb3dlZC5cblx0ICogQHJldHVybnMge1Byb21pc2U8T2JqZWN0Pn0gVGhlIHByb21pc2UgZm9yIGEgcmVzdWx0IHdpdGggdGhlIHN0YXR1cyBvYmplY3QgYW5kIGNvbnRlbnQuXG5cdCAqL1xuXHRwb3N0KHVybCwgcGFyYW1ldGVycykge1xuXHRcdHJldHVybiB0aGlzLnJlcXVlc3QodGhpcy5fbm9ybWFsaXplT3B0aW9ucyhVSFJCYXNlLk1FVEhPRFMuUE9TVCwgdXJsLCBwYXJhbWV0ZXJzKSk7XG5cdH1cblxuXHQvKipcblx0ICogRG9lcyBhIFBVVCByZXF1ZXN0IHRvIHRoZSBIVFRQIHNlcnZlci5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHVybCBVUkwgdG8gcmVxdWVzdC5cblx0ICogQHBhcmFtIHtPYmplY3Q/fSBwYXJhbWV0ZXJzIFRoZSByZXF1ZXN0IHBhcmFtZXRlcnMuXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gcGFyYW1ldGVycy5oZWFkZXJzIFRoZSBIVFRQIGhlYWRlcnMgdG8gc2VuZC5cblx0ICogQHBhcmFtIHsoc3RyaW5nfE9iamVjdCk/fSBwYXJhbWV0ZXJzLmRhdGEgVGhlIGRhdGEgdG8gc2VuZC5cblx0ICogQHBhcmFtIHtudW1iZXI/fSBwYXJhbWV0ZXJzLnRpbWVvdXQgVGhlIHJlcXVlc3QgdGltZW91dC5cblx0ICogQHBhcmFtIHtib29sZWFuP30gcGFyYW1ldGVycy51bnNhZmVIVFRQUyBJZiB0cnVlIHRoZW4gcmVxdWVzdHMgdG8gc2VydmVycyB3aXRoXG5cdCAqIGludmFsaWQgSFRUUFMgY2VydGlmaWNhdGVzIGFyZSBhbGxvd2VkLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZTxPYmplY3Q+fSBUaGUgcHJvbWlzZSBmb3IgYSByZXN1bHQgd2l0aCB0aGUgc3RhdHVzIG9iamVjdCBhbmQgY29udGVudC5cblx0ICovXG5cdHB1dCh1cmwsIHBhcmFtZXRlcnMpIHtcblx0XHRyZXR1cm4gdGhpcy5yZXF1ZXN0KHRoaXMuX25vcm1hbGl6ZU9wdGlvbnMoVUhSQmFzZS5NRVRIT0RTLlBVVCwgdXJsLCBwYXJhbWV0ZXJzKSk7XG5cdH1cblxuXHQvKipcblx0ICogRG9lcyBhIFBBVENIIHJlcXVlc3QgdG8gdGhlIEhUVFAgc2VydmVyLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdXJsIFVSTCB0byByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge09iamVjdD99IHBhcmFtZXRlcnMgVGhlIHJlcXVlc3QgcGFyYW1ldGVycy5cblx0ICogQHBhcmFtIHtPYmplY3Q/fSBwYXJhbWV0ZXJzLmhlYWRlcnMgVGhlIEhUVFAgaGVhZGVycyB0byBzZW5kLlxuXHQgKiBAcGFyYW0geyhzdHJpbmd8T2JqZWN0KT99IHBhcmFtZXRlcnMuZGF0YSBUaGUgZGF0YSB0byBzZW5kLlxuXHQgKiBAcGFyYW0ge251bWJlcj99IHBhcmFtZXRlcnMudGltZW91dCBUaGUgcmVxdWVzdCB0aW1lb3V0LlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW4/fSBwYXJhbWV0ZXJzLnVuc2FmZUhUVFBTIElmIHRydWUgdGhlbiByZXF1ZXN0cyB0byBzZXJ2ZXJzIHdpdGhcblx0ICogaW52YWxpZCBIVFRQUyBjZXJ0aWZpY2F0ZXMgYXJlIGFsbG93ZWQuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlPE9iamVjdD59IFRoZSBwcm9taXNlIGZvciBhIHJlc3VsdCB3aXRoIHRoZSBzdGF0dXMgb2JqZWN0IGFuZCBjb250ZW50LlxuXHQgKi9cblx0cGF0Y2godXJsLCBwYXJhbWV0ZXJzKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVxdWVzdCh0aGlzLl9ub3JtYWxpemVPcHRpb25zKFVIUkJhc2UuTUVUSE9EUy5QQVRDSCwgdXJsLCBwYXJhbWV0ZXJzKSk7XG5cdH1cblxuXHQvKipcblx0ICogRG9lcyBhIERFTEVURSByZXF1ZXN0IHRvIHRoZSBIVFRQIHNlcnZlci5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHVybCBVUkwgdG8gcmVxdWVzdC5cblx0ICogQHBhcmFtIHtPYmplY3Q/fSBwYXJhbWV0ZXJzIFRoZSByZXF1ZXN0IHBhcmFtZXRlcnMuXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gcGFyYW1ldGVycy5oZWFkZXJzIFRoZSBIVFRQIGhlYWRlcnMgdG8gc2VuZC5cblx0ICogQHBhcmFtIHsoc3RyaW5nfE9iamVjdCk/fSBwYXJhbWV0ZXJzLmRhdGEgVGhlIGRhdGEgdG8gc2VuZC5cblx0ICogQHBhcmFtIHtudW1iZXI/fSBwYXJhbWV0ZXJzLnRpbWVvdXQgVGhlIHJlcXVlc3QgdGltZW91dC5cblx0ICogQHBhcmFtIHtib29sZWFuP30gcGFyYW1ldGVycy51bnNhZmVIVFRQUyBJZiB0cnVlIHRoZW4gcmVxdWVzdHMgdG8gc2VydmVycyB3aXRoXG5cdCAqIGludmFsaWQgSFRUUFMgY2VydGlmaWNhdGVzIGFyZSBhbGxvd2VkLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZTxPYmplY3Q+fSBUaGUgcHJvbWlzZSBmb3IgYSByZXN1bHQgd2l0aCB0aGUgc3RhdHVzIG9iamVjdCBhbmQgY29udGVudC5cblx0ICovXG5cdGRlbGV0ZSh1cmwsIHBhcmFtZXRlcnMpIHtcblx0XHRyZXR1cm4gdGhpcy5yZXF1ZXN0KHRoaXMuX25vcm1hbGl6ZU9wdGlvbnMoVUhSQmFzZS5NRVRIT0RTLkRFTEVURSwgdXJsLCBwYXJhbWV0ZXJzKSk7XG5cdH1cblxuXHQvKipcblx0ICogRG9lcyBhIHJlcXVlc3QgdG8gdGhlIEhUVFAgc2VydmVyLlxuXHQgKiBAcGFyYW0ge09iamVjdD99IHBhcmFtZXRlcnMgVGhlIHJlcXVlc3QgcGFyYW1ldGVycy5cblx0ICogQHBhcmFtIHtzdHJpbmc/fSBwYXJhbWV0ZXJzLm1ldGhvZCBUaGUgSFRUUCBtZXRob2QgZm9yIHRoZSByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge3N0cmluZz99IHBhcmFtZXRlcnMudXJsIFRoZSBVUkwgZm9yIHRoZSByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge09iamVjdD99IHBhcmFtZXRlcnMuaGVhZGVycyBUaGUgSFRUUCBoZWFkZXJzIHRvIHNlbmQuXG5cdCAqIEBwYXJhbSB7KHN0cmluZ3xPYmplY3QpP30gcGFyYW1ldGVycy5kYXRhIFRoZSBkYXRhIHRvIHNlbmQuXG5cdCAqIEBwYXJhbSB7bnVtYmVyP30gcGFyYW1ldGVycy50aW1lb3V0IFRoZSByZXF1ZXN0IHRpbWVvdXQuXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbj99IHBhcmFtZXRlcnMudW5zYWZlSFRUUFMgSWYgdHJ1ZSB0aGVuIHJlcXVlc3RzIHRvIHNlcnZlcnMgd2l0aFxuXHQgKiBpbnZhbGlkIEhUVFBTIGNlcnRpZmljYXRlcyBhcmUgYWxsb3dlZC5cblx0ICogQHJldHVybnMge1Byb21pc2U8T2JqZWN0Pn0gVGhlIHByb21pc2UgZm9yIGEgcmVzdWx0IHdpdGggdGhlIHN0YXR1cyBvYmplY3QgYW5kIGNvbnRlbnQuXG5cdCAqL1xuXHRyZXF1ZXN0KHBhcmFtZXRlcnMpIHtcblx0XHRyZXR1cm4gdGhpcy5fdmFsaWRhdGVSZXF1ZXN0KHBhcmFtZXRlcnMpXG5cdFx0XHQudGhlbih2YWxpZGF0ZWQgPT4gdGhpcy5fZG9SZXF1ZXN0KHZhbGlkYXRlZCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFZhbGlkYXRlcyBVSFIgcGFyYW1ldGVycy5cblx0ICogQHBhcmFtIHtPYmplY3Q/fSBwYXJhbWV0ZXJzIFRoZSByZXF1ZXN0IHBhcmFtZXRlcnMuXG5cdCAqIEBwYXJhbSB7c3RyaW5nP30gcGFyYW1ldGVycy5tZXRob2QgVGhlIEhUVFAgbWV0aG9kIGZvciB0aGUgcmVxdWVzdC5cblx0ICogQHBhcmFtIHtzdHJpbmc/fSBwYXJhbWV0ZXJzLnVybCBUaGUgVVJMIGZvciB0aGUgcmVxdWVzdC5cblx0ICogQHBhcmFtIHtPYmplY3Q/fSBwYXJhbWV0ZXJzLmhlYWRlcnMgVGhlIEhUVFAgaGVhZGVycyB0byBzZW5kLlxuXHQgKiBAcGFyYW0geyhzdHJpbmd8T2JqZWN0KT99IHBhcmFtZXRlcnMuZGF0YSBUaGUgZGF0YSB0byBzZW5kLlxuXHQgKiBAcGFyYW0ge251bWJlcj99IHBhcmFtZXRlcnMudGltZW91dCBUaGUgcmVxdWVzdCB0aW1lb3V0LlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW4/fSBwYXJhbWV0ZXJzLnVuc2FmZUhUVFBTIElmIHRydWUgdGhlbiByZXF1ZXN0cyB0byBzZXJ2ZXJzIHdpdGhcblx0ICogaW52YWxpZCBIVFRQUyBjZXJ0aWZpY2F0ZXMgYXJlIGFsbG93ZWQuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIGZvciB0aGUgZmluaXNoZWQgd29yay5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdC8qIGVzbGludCBjb21wbGV4aXR5OiAwICovXG5cdF92YWxpZGF0ZVJlcXVlc3QocGFyYW1ldGVycykge1xuXHRcdGlmICghcGFyYW1ldGVycyB8fCB0eXBlb2YgKHBhcmFtZXRlcnMpICE9PSAnb2JqZWN0Jykge1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignUmVxdWVzdCBwYXJhbWV0ZXJzIGFyZ3VtZW50IHNob3VsZCBiZSBhbiBvYmplY3QnKSk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgdmFsaWRhdGVkID0gT2JqZWN0LmNyZWF0ZShwYXJhbWV0ZXJzKTtcblxuXHRcdGlmICh0eXBlb2YgKHBhcmFtZXRlcnMudXJsKSAhPT0gJ3N0cmluZycpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ1wicGFyYW1ldGVycy51cmxcIiBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpKTtcblx0XHR9XG5cblx0XHR2YWxpZGF0ZWQudXJpID0gbmV3IFVSSSh2YWxpZGF0ZWQudXJsKTtcblx0XHRpZiAoIXZhbGlkYXRlZC51cmkuc2NoZW1lKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdcInBhcmFtZXRlcnMudXJsXCIgc2hvdWxkIGNvbnRhaW4gYSBwcm90b2NvbCAoc2NoZW1lKScpKTtcblx0XHR9XG5cdFx0aWYgKCFIVFRQX1BST1RPQ09MX1JFR0VYUC50ZXN0KHZhbGlkYXRlZC51cmkuc2NoZW1lKSkge1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihgXCIke3ZhbGlkYXRlZC51cmkuc2NoZW1lfVwiIHByb3RvY29sIChzY2hlbWUpIGlzIHVuc3VwcG9ydGVkYCkpO1xuXHRcdH1cblx0XHRpZiAoIXZhbGlkYXRlZC51cmkuYXV0aG9yaXR5IHx8ICF2YWxpZGF0ZWQudXJpLmF1dGhvcml0eS5ob3N0KSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdcInBhcmFtZXRlcnMudXJsXCIgc2hvdWxkIGNvbnRhaW4gYSBob3N0JykpO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mICh2YWxpZGF0ZWQubWV0aG9kKSAhPT0gJ3N0cmluZycgfHxcblx0XHRcdCEodmFsaWRhdGVkLm1ldGhvZCBpbiBVSFJCYXNlLk1FVEhPRFMpKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdIVFRQIG1ldGhvZCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpKTtcblx0XHR9XG5cblx0XHR2YWxpZGF0ZWQudGltZW91dCA9IHZhbGlkYXRlZC50aW1lb3V0IHx8IERFRkFVTFRfVElNRU9VVDtcblx0XHRpZiAodHlwZW9mICh2YWxpZGF0ZWQudGltZW91dCkgIT09ICdudW1iZXInKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdUaW1lb3V0IHNob3VsZCBiZSBhIG51bWJlcicpKTtcblx0XHR9XG5cblx0XHR2YWxpZGF0ZWQuaGVhZGVycyA9IHRoaXMuY3JlYXRlSGVhZGVycyh2YWxpZGF0ZWQuaGVhZGVycyk7XG5cblx0XHRpZiAoIXRoaXMuX2lzVXBzdHJlYW1SZXF1ZXN0KHBhcmFtZXRlcnMubWV0aG9kKSAmJlxuXHRcdFx0dmFsaWRhdGVkLmRhdGEgJiYgdHlwZW9mICh2YWxpZGF0ZWQuZGF0YSkgPT09ICdvYmplY3QnKSB7XG5cblx0XHRcdGNvbnN0IGRhdGFLZXlzID0gT2JqZWN0LmtleXModmFsaWRhdGVkLmRhdGEpO1xuXG5cdFx0XHRpZiAoZGF0YUtleXMubGVuZ3RoID4gMCAmJiAhdmFsaWRhdGVkLnVyaS5xdWVyeSkge1xuXHRcdFx0XHR2YWxpZGF0ZWQudXJpLnF1ZXJ5ID0gbmV3IFF1ZXJ5KCcnKTtcblx0XHRcdH1cblxuXHRcdFx0ZGF0YUtleXMuZm9yRWFjaChrZXkgPT4ge1xuXHRcdFx0XHR2YWxpZGF0ZWQudXJpLnF1ZXJ5LnZhbHVlc1trZXldID0gdmFsaWRhdGVkLmRhdGFba2V5XTtcblx0XHRcdH0pO1xuXHRcdFx0dmFsaWRhdGVkLmRhdGEgPSBudWxsO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBkYXRhQW5kSGVhZGVycyA9IHRoaXMuX2dldERhdGFUb1NlbmQodmFsaWRhdGVkLmhlYWRlcnMsIHZhbGlkYXRlZC5kYXRhKTtcblx0XHRcdHZhbGlkYXRlZC5oZWFkZXJzID0gZGF0YUFuZEhlYWRlcnMuaGVhZGVycztcblx0XHRcdHZhbGlkYXRlZC5kYXRhID0gZGF0YUFuZEhlYWRlcnMuZGF0YTtcblx0XHR9XG5cblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbGlkYXRlZCk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBkYXRhIGZvciBzZW5kaW5nIHZpYSB0aGUgSFRUUCByZXF1ZXN0IHVzaW5nIFwiQ29udGVudCBUeXBlXCIgSFRUUCBoZWFkZXIuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzIFRoZSBIVFRQIGhlYWRlcnMuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBzZW5kLlxuXHQgKiBAcmV0dXJucyB7e2hlYWRlcnM6IE9iamVjdCwgZGF0YTogT2JqZWN0fHN0cmluZ319IFRoZSBkYXRhIGFuZCBoZWFkZXJzIHRvIHNlbmQuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfZ2V0RGF0YVRvU2VuZChoZWFkZXJzLCBkYXRhKSB7XG5cdFx0Y29uc3QgZm91bmQgPSB0aGlzLl9maW5kQ29udGVudFR5cGUoaGVhZGVycyk7XG5cdFx0Y29uc3QgY29udGVudFR5cGVIZWFkZXIgPSBmb3VuZC5uYW1lO1xuXHRcdGNvbnN0IGNvbnRlbnRUeXBlID0gZm91bmQudHlwZTtcblxuXHRcdGlmICghZGF0YSB8fCB0eXBlb2YgKGRhdGEpICE9PSAnb2JqZWN0Jykge1xuXHRcdFx0ZGF0YSA9IGRhdGEgPyBTdHJpbmcoZGF0YSkgOiAnJztcblx0XHRcdGlmICghY29udGVudFR5cGUpIHtcblx0XHRcdFx0aGVhZGVyc1tjb250ZW50VHlwZUhlYWRlcl0gPSBVSFJCYXNlLlBMQUlOX1RFWFRfRU5USVRZX0NPTlRFTlRfVFlQRTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGhlYWRlcnMsXG5cdFx0XHRcdGRhdGFcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0aWYgKGNvbnRlbnRUeXBlID09PSBVSFJCYXNlLlRZUEVTLkpTT04pIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGhlYWRlcnMsXG5cdFx0XHRcdGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8vIG90aGVyd2lzZSBvYmplY3Qgd2lsbCBiZSBzZW50IHdpdGhcblx0XHQvLyBhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcblx0XHRoZWFkZXJzW2NvbnRlbnRUeXBlSGVhZGVyXSA9IFVIUkJhc2UuVVJMX0VOQ09ERURfRU5USVRZX0NPTlRFTlRfVFlQRTtcblxuXHRcdGNvbnN0IHF1ZXJ5ID0gbmV3IFF1ZXJ5KCk7XG5cdFx0cXVlcnkudmFsdWVzID0gZGF0YTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0aGVhZGVycyxcblx0XHRcdGRhdGE6IHF1ZXJ5LnRvU3RyaW5nKClcblx0XHRcdFx0LnJlcGxhY2UoL1xcKy9nLCAnJTJCJylcblx0XHRcdFx0LnJlcGxhY2UoLyUyMC9nLCAnKycpXG5cdFx0fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIEhUVFAgaGVhZGVycyBmb3IgYSByZXF1ZXN0IHVzaW5nIGRlZmF1bHRzIGFuZCBjdXJyZW50IHBhcmFtZXRlcnMuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbWV0ZXJIZWFkZXJzIFRoZSBIVFRQIGhlYWRlcnMgZm9yIFVIUi5cblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0Y3JlYXRlSGVhZGVycyhwYXJhbWV0ZXJIZWFkZXJzKSB7XG5cdFx0aWYgKCFwYXJhbWV0ZXJIZWFkZXJzIHx8IHR5cGVvZiAocGFyYW1ldGVySGVhZGVycykgIT09ICdvYmplY3QnKSB7XG5cdFx0XHRwYXJhbWV0ZXJIZWFkZXJzID0ge307XG5cdFx0fVxuXG5cdFx0Y29uc3QgaGVhZGVycyA9IHt9O1xuXG5cdFx0T2JqZWN0LmtleXMoVUhSQmFzZS5ERUZBVUxUX0dFTkVSQUxfSEVBREVSUylcblx0XHRcdC5mb3JFYWNoKGhlYWRlck5hbWUgPT4ge1xuXHRcdFx0XHRoZWFkZXJzW2hlYWRlck5hbWVdID0gVUhSQmFzZS5ERUZBVUxUX0dFTkVSQUxfSEVBREVSU1toZWFkZXJOYW1lXTtcblx0XHRcdH0pO1xuXG5cdFx0T2JqZWN0LmtleXMocGFyYW1ldGVySGVhZGVycylcblx0XHRcdC5mb3JFYWNoKGhlYWRlck5hbWUgPT4ge1xuXHRcdFx0XHRpZiAocGFyYW1ldGVySGVhZGVyc1toZWFkZXJOYW1lXSA9PT0gbnVsbCB8fFxuXHRcdFx0XHRcdHBhcmFtZXRlckhlYWRlcnNbaGVhZGVyTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGRlbGV0ZSBoZWFkZXJzW2hlYWRlck5hbWVdO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRoZWFkZXJzW2hlYWRlck5hbWVdID0gcGFyYW1ldGVySGVhZGVyc1toZWFkZXJOYW1lXTtcblx0XHRcdH0pO1xuXG5cdFx0cmV0dXJuIGhlYWRlcnM7XG5cdH1cblxuXHQvKipcblx0ICogRG9lcyByZXF1ZXN0IHdpdGggc3BlY2lmaWVkIHBhcmFtZXRlcnMgdXNpbmcgcHJvdG9jb2wgaW1wbGVtZW50YXRpb24uXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gcGFyYW1ldGVycyBUaGUgcmVxdWVzdCBwYXJhbWV0ZXJzLlxuXHQgKiBAcGFyYW0ge3N0cmluZz99IHBhcmFtZXRlcnMubWV0aG9kIFRoZSBIVFRQIG1ldGhvZCBmb3IgdGhlIHJlcXVlc3QuXG5cdCAqIEBwYXJhbSB7c3RyaW5nP30gcGFyYW1ldGVycy51cmwgVGhlIFVSTCBmb3IgdGhlIHJlcXVlc3QuXG5cdCAqIEBwYXJhbSB7VVJJfSBwYXJhbWV0ZXJzLnVyaSBUaGUgVVJJIG9iamVjdC5cblx0ICogQHBhcmFtIHtPYmplY3Q/fSBwYXJhbWV0ZXJzLmhlYWRlcnMgVGhlIEhUVFAgaGVhZGVycyB0byBzZW5kLlxuXHQgKiBAcGFyYW0geyhzdHJpbmd8T2JqZWN0KT99IHBhcmFtZXRlcnMuZGF0YSBUaGUgZGF0YSB0byBzZW5kLlxuXHQgKiBAcGFyYW0ge251bWJlcj99IHBhcmFtZXRlcnMudGltZW91dCBUaGUgcmVxdWVzdCB0aW1lb3V0LlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW4/fSBwYXJhbWV0ZXJzLnVuc2FmZUhUVFBTIElmIHRydWUgdGhlbiByZXF1ZXN0cyB0byBzZXJ2ZXJzIHdpdGhcblx0ICogaW52YWxpZCBIVFRQUyBjZXJ0aWZpY2F0ZXMgYXJlIGFsbG93ZWQuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlPE9iamVjdD59IFByb21pc2UgZm9yIHRoZSByZXN1bHQgd2l0aCBhIHN0YXR1cyBvYmplY3QgYW5kIGNvbnRlbnQuXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICogQGFic3RyYWN0XG5cdCAqL1xuXHRfZG9SZXF1ZXN0KHBhcmFtZXRlcnMpIHsgfVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyByZXNwb25zZSBkYXRhIGFjY29yZGluZyB0byB0aGUgY29udGVudCB0eXBlLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVycyBUaGUgSFRUUCBoZWFkZXJzLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcmVzcG9uc2VEYXRhIFRoZSBkYXRhIGZyb20gcmVzcG9uc2UuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd8T2JqZWN0fSBUaGUgY29udmVydGVkIGRhdGEuXG5cdCAqL1xuXHRjb252ZXJ0UmVzcG9uc2UoaGVhZGVycywgcmVzcG9uc2VEYXRhKSB7XG5cdFx0aWYgKHR5cGVvZiAocmVzcG9uc2VEYXRhKSAhPT0gJ3N0cmluZycpIHtcblx0XHRcdHJlc3BvbnNlRGF0YSA9ICcnO1xuXHRcdH1cblx0XHRjb25zdCBmb3VuZCA9IHRoaXMuX2ZpbmRDb250ZW50VHlwZShoZWFkZXJzKTtcblx0XHRjb25zdCBjb250ZW50VHlwZSA9IGZvdW5kLnR5cGUgfHwgVUhSQmFzZS5UWVBFUy5QTEFJTl9URVhUO1xuXG5cdFx0c3dpdGNoIChjb250ZW50VHlwZSkge1xuXHRcdFx0Y2FzZSBVSFJCYXNlLlRZUEVTLkpTT046XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0cmV0dXJuIEpTT04ucGFyc2UocmVzcG9uc2VEYXRhKSB8fCB7fTtcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdHJldHVybiB7fTtcblx0XHRcdFx0fVxuXHRcdFx0Y2FzZSBVSFJCYXNlLlRZUEVTLlVSTF9FTkNPREVEOlxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gbmV3IFF1ZXJ5KHJlc3BvbnNlRGF0YS5yZXBsYWNlKCcrJywgJyUyMCcpKTtcblx0XHRcdFx0XHRyZXR1cm4gcXVlcnkudmFsdWVzIHx8IHt9O1xuXHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHt9O1xuXHRcdFx0XHR9XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2VEYXRhO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmVzIGlmIHRoZSBjdXJyZW50IHF1ZXJ5IG5lZWRzIHVzaW5nIHVwc3RyZWFtLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIFRoZSBIVFRQIG1ldGhvZC5cblx0ICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgY3VycmVudCBIVFRQIG1ldGhvZCBuZWVkcyB1cHN0cmVhbSB1c2FnZS5cblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0X2lzVXBzdHJlYW1SZXF1ZXN0KG1ldGhvZCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHRtZXRob2QgPT09IFVIUkJhc2UuTUVUSE9EUy5QT1NUIHx8XG5cdFx0XHRtZXRob2QgPT09IFVIUkJhc2UuTUVUSE9EUy5QVVQgfHxcblx0XHRcdG1ldGhvZCA9PT0gVUhSQmFzZS5NRVRIT0RTLlBBVENIXG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBOb3JtYWxpemVzIHBhcmFtZXRlcnMgcGFzc2VkIHRvIGEgcmVxdWVzdCBmdW5jdGlvbi5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCBUaGUgSFRUUCBtZXRob2QuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIFVSTCB0byByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge09iamVjdD99IHBhcmFtZXRlcnMgVGhlIHJlcXVlc3QgcGFyYW1ldGVycy5cblx0ICogQHBhcmFtIHtPYmplY3Q/fSBwYXJhbWV0ZXJzLmhlYWRlcnMgVGhlIEhUVFAgaGVhZGVycyB0byBzZW5kLlxuXHQgKiBAcGFyYW0geyhzdHJpbmd8T2JqZWN0KT99IHBhcmFtZXRlcnMuZGF0YSBUaGUgZGF0YSB0byBzZW5kLlxuXHQgKiBAcGFyYW0ge251bWJlcj99IHBhcmFtZXRlcnMudGltZW91dCBUaGUgcmVxdWVzdCB0aW1lb3V0LlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW4/fSBwYXJhbWV0ZXJzLnVuc2FmZUhUVFBTIElmIHRydWUgdGhlbiByZXF1ZXN0cyB0byBzZXJ2ZXJzIHdpdGhcblx0ICogaW52YWxpZCBIVFRQUyBjZXJ0aWZpY2F0ZXMgYXJlIGFsbG93ZWQuXG5cdCAqIEByZXR1cm4ge09iamVjdH0gVGhlIG5vcm1hbGl6ZWQgcGFyYW1ldGVycyBvYmplY3Qgd2l0aCBVUkwgYW5kIG1ldGhvZFxuXHQgKi9cblx0X25vcm1hbGl6ZU9wdGlvbnMobWV0aG9kLCB1cmwsIHBhcmFtZXRlcnMpIHtcblx0XHRwYXJhbWV0ZXJzID0gcGFyYW1ldGVycyB8fCB7fTtcblx0XHRjb25zdCBub3JtYWxQYXJhbWV0ZXJzID0gT2JqZWN0LmNyZWF0ZShwYXJhbWV0ZXJzKTtcblx0XHRub3JtYWxQYXJhbWV0ZXJzLm1ldGhvZCA9IG1ldGhvZDtcblx0XHRub3JtYWxQYXJhbWV0ZXJzLnVybCA9IHVybDtcblx0XHRyZXR1cm4gbm9ybWFsUGFyYW1ldGVycztcblx0fVxuXG5cdC8qKlxuXHQgKiBGaW5kcyB0aGUgY29udGVudCB0eXBlIGhlYWRlciBpbiB0aGUgaGVhZGVycyBvYmplY3QuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzIFRoZSBIVFRQIGhlYWRlcnMuXG5cdCAqIEByZXR1cm5zIHt7bmFtZTogc3RyaW5nLCB0eXBlOiBzdHJpbmd9fSBUaGUgbmFtZSBvZiB0aGUgaGVhZGVyIGFuZCB0aGUgY29udGVudCB0eXBlLlxuXHQgKi9cblx0X2ZpbmRDb250ZW50VHlwZShoZWFkZXJzKSB7XG5cdFx0dmFyIGNvbnRlbnRUeXBlU3RyaW5nID0gJyc7XG5cdFx0dmFyIGNvbnRlbnRUeXBlSGVhZGVyID0gJ0NvbnRlbnQtVHlwZSc7XG5cblx0XHRPYmplY3Qua2V5cyhoZWFkZXJzKVxuXHRcdFx0LmZvckVhY2goa2V5ID0+IHtcblx0XHRcdFx0aWYgKGtleS50b0xvd2VyQ2FzZSgpICE9PSAnY29udGVudC10eXBlJykge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb250ZW50VHlwZUhlYWRlciA9IGtleTtcblx0XHRcdFx0Y29udGVudFR5cGVTdHJpbmcgPSBoZWFkZXJzW2tleV07XG5cdFx0XHR9KTtcblxuXHRcdGNvbnN0IHR5cGVBbmRQYXJhbWV0ZXJzID0gY29udGVudFR5cGVTdHJpbmcuc3BsaXQoJzsnKTtcblx0XHRjb25zdCBjb250ZW50VHlwZSA9IHR5cGVBbmRQYXJhbWV0ZXJzWzBdLnRvTG93ZXJDYXNlKCk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG5hbWU6IGNvbnRlbnRUeXBlSGVhZGVyLFxuXHRcdFx0dHlwZTogY29udGVudFR5cGVcblx0XHR9O1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVUhSQmFzZTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdFVSSTogcmVxdWlyZSgnLi9saWIvVVJJJyksXG5cdEF1dGhvcml0eTogcmVxdWlyZSgnLi9saWIvQXV0aG9yaXR5JyksXG5cdFVzZXJJbmZvOiByZXF1aXJlKCcuL2xpYi9Vc2VySW5mbycpLFxuXHRRdWVyeTogcmVxdWlyZSgnLi9saWIvUXVlcnknKVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgVXNlckluZm8gPSByZXF1aXJlKCcuL1VzZXJJbmZvJyk7XG5jb25zdCBwZXJjZW50RW5jb2RpbmdIZWxwZXIgPSByZXF1aXJlKCcuL3BlcmNlbnRFbmNvZGluZ0hlbHBlcicpO1xuXG5jb25zdCBQT1JUX1JFR0VYUCA9IC9eXFxkKyQvO1xuY29uc3QgRVJST1JfUE9SVCA9IGBVUkkgYXV0aG9yaXR5IHBvcnQgbXVzdCBzYXRpc2Z5IGV4cHJlc3Npb24gJHtQT1JUX1JFR0VYUC50b1N0cmluZygpfWA7XG5cbmNsYXNzIEF1dGhvcml0eSB7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgVVJJIHVzZXIgaW5mbyBjb21wb25lbnQuXG5cdCAqIEBwYXJhbSB7c3RyaW5nP30gRXhpc3Rpbmcgc3RyaW5nLlxuXHQgKiBAcmV0dXJuIHtVc2VySW5mb30gVGhlIHVzZXIgaW5mbyBjb21wb25lbnQuXG5cdCAqL1xuXHRzdGF0aWMgY3JlYXRlVXNlckluZm8oc3RyaW5nKSB7XG5cdFx0cmV0dXJuIG5ldyBVc2VySW5mbyhzdHJpbmcpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgVVJJIHVzZXIgaW5mbyBjb21wb25lbnQuXG5cdCAqIEBwYXJhbSB7c3RyaW5nP30gRXhpc3Rpbmcgc3RyaW5nLlxuXHQgKiBAcmV0dXJuIHtVc2VySW5mb30gVGhlIHVzZXIgaW5mbyBjb21wb25lbnQuXG5cdCAqL1xuXHRjcmVhdGVVc2VySW5mbyhzdHJpbmcpIHtcblx0XHRyZXR1cm4gQXV0aG9yaXR5LmNyZWF0ZVVzZXJJbmZvKHN0cmluZyk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBuZXcgaW5zdGFuY2Ugb2YgVVJJIGF1dGhvcml0eSBjb21wb25lbnQgcGFyc2VyLlxuXHQgKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNzZWN0aW9uLTMuMlxuXHQgKiBAcGFyYW0ge3N0cmluZz99IGF1dGhvcml0eVN0cmluZyBVUkkgYXV0aG9yaXR5IGNvbXBvbmVudCBzdHJpbmcuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihhdXRob3JpdHlTdHJpbmcpIHtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgdXNlciBpbmZvcm1hdGlvbi5cblx0XHQgKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNzZWN0aW9uLTMuMi4xXG5cdFx0ICogQHR5cGUge1VzZXJJbmZvfVxuXHRcdCAqL1xuXHRcdHRoaXMudXNlckluZm8gPSBudWxsO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBwb3J0LlxuXHRcdCAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I3NlY3Rpb24tMy4yLjNcblx0XHQgKiBAdHlwZSB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdHRoaXMucG9ydCA9IG51bGw7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IGhvc3QuXG5cdFx0ICogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYjc2VjdGlvbi0zLjIuMlxuXHRcdCAqIEB0eXBlIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0dGhpcy5ob3N0ID0gbnVsbDtcblxuXHRcdGlmICh0eXBlb2YgKGF1dGhvcml0eVN0cmluZykgPT09ICdzdHJpbmcnICYmIGF1dGhvcml0eVN0cmluZy5sZW5ndGggPiAwKSB7XG5cdFx0XHRjb25zdCBmaXJzdEF0SW5kZXggPSBhdXRob3JpdHlTdHJpbmcuaW5kZXhPZignQCcpO1xuXHRcdFx0aWYgKGZpcnN0QXRJbmRleCAhPT0gLTEpIHtcblx0XHRcdFx0Y29uc3QgdXNlckluZm9TdHJpbmcgPSBhdXRob3JpdHlTdHJpbmcuc3Vic3RyaW5nKDAsIGZpcnN0QXRJbmRleCk7XG5cdFx0XHRcdHRoaXMudXNlckluZm8gPSBuZXcgVXNlckluZm8odXNlckluZm9TdHJpbmcpO1xuXHRcdFx0XHRhdXRob3JpdHlTdHJpbmcgPSBhdXRob3JpdHlTdHJpbmcuc3Vic3RyaW5nKGZpcnN0QXRJbmRleCArIDEpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBsYXN0Q29sb25JbmRleCA9IGF1dGhvcml0eVN0cmluZy5sYXN0SW5kZXhPZignOicpO1xuXHRcdFx0aWYgKGxhc3RDb2xvbkluZGV4ICE9PSAtMSkge1xuXHRcdFx0XHRjb25zdCBwb3J0U3RyaW5nID0gYXV0aG9yaXR5U3RyaW5nLnN1YnN0cmluZyhsYXN0Q29sb25JbmRleCArIDEpO1xuXHRcdFx0XHRpZiAobGFzdENvbG9uSW5kZXggPT09IGF1dGhvcml0eVN0cmluZy5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0dGhpcy5wb3J0ID0gJyc7XG5cdFx0XHRcdFx0YXV0aG9yaXR5U3RyaW5nID0gYXV0aG9yaXR5U3RyaW5nLnN1YnN0cmluZygwLCBsYXN0Q29sb25JbmRleCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoUE9SVF9SRUdFWFAudGVzdChwb3J0U3RyaW5nKSkge1xuXHRcdFx0XHRcdHRoaXMucG9ydCA9IHBvcnRTdHJpbmc7XG5cdFx0XHRcdFx0YXV0aG9yaXR5U3RyaW5nID0gYXV0aG9yaXR5U3RyaW5nLnN1YnN0cmluZygwLCBsYXN0Q29sb25JbmRleCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dGhpcy5ob3N0ID0gcGVyY2VudEVuY29kaW5nSGVscGVyLmRlY29kZShhdXRob3JpdHlTdHJpbmcpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBDbG9uZXMgY3VycmVudCBhdXRob3JpdHkuXG5cdCAqIEByZXR1cm5zIHtBdXRob3JpdHl9IE5ldyBjbG9uZSBvZiBjdXJyZW50IG9iamVjdC5cblx0ICovXG5cdGNsb25lKCkge1xuXHRcdGNvbnN0IGF1dGhvcml0eSA9IG5ldyBBdXRob3JpdHkoKTtcblx0XHRpZiAodGhpcy51c2VySW5mbykge1xuXHRcdFx0YXV0aG9yaXR5LnVzZXJJbmZvID0gdGhpcy51c2VySW5mby5jbG9uZSgpO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mICh0aGlzLmhvc3QpID09PSAnc3RyaW5nJykge1xuXHRcdFx0YXV0aG9yaXR5Lmhvc3QgPSB0aGlzLmhvc3Q7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgKHRoaXMucG9ydCkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRhdXRob3JpdHkucG9ydCA9IHRoaXMucG9ydDtcblx0XHR9XG5cdFx0cmV0dXJuIGF1dGhvcml0eTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWNvbWJpbmUgYWxsIGF1dGhvcml0eSBjb21wb25lbnRzIGludG8gYXV0aG9yaXR5IHN0cmluZy5cblx0ICogQHJldHVybnMge3N0cmluZ30gQXV0aG9yaXR5IGNvbXBvbmVudCBzdHJpbmcuXG5cdCAqL1xuXHR0b1N0cmluZygpIHtcblx0XHRsZXQgcmVzdWx0ID0gJyc7XG5cdFx0aWYgKHRoaXMudXNlckluZm8gaW5zdGFuY2VvZiBVc2VySW5mbykge1xuXHRcdFx0cmVzdWx0ICs9IGAke3RoaXMudXNlckluZm8udG9TdHJpbmcoKX1AYDtcblx0XHR9XG5cdFx0aWYgKHRoaXMuaG9zdCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuaG9zdCAhPT0gbnVsbCkge1xuXHRcdFx0Y29uc3QgaG9zdCA9IFN0cmluZyh0aGlzLmhvc3QpO1xuXHRcdFx0cmVzdWx0ICs9IHBlcmNlbnRFbmNvZGluZ0hlbHBlci5lbmNvZGVIb3N0KGhvc3QpO1xuXHRcdH1cblx0XHRpZiAodGhpcy5wb3J0ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5wb3J0ICE9PSBudWxsKSB7XG5cdFx0XHRjb25zdCBwb3J0ID0gU3RyaW5nKHRoaXMucG9ydCk7XG5cdFx0XHRpZiAocG9ydC5sZW5ndGggPiAwICYmICFQT1JUX1JFR0VYUC50ZXN0KHBvcnQpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihFUlJPUl9QT1JUKTtcblx0XHRcdH1cblx0XHRcdHJlc3VsdCArPSBgOiR7cG9ydH1gO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0aG9yaXR5O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBwZXJjZW50RW5jb2RpbmdIZWxwZXIgPSByZXF1aXJlKCcuL3BlcmNlbnRFbmNvZGluZ0hlbHBlcicpO1xuXG5jbGFzcyBRdWVyeSB7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgbmV3IGluc3RhbmNlIG9mIFVSSSBxdWVyeSBjb21wb25lbnQgcGFyc2VyLlxuXHQgKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNzZWN0aW9uLTMuNFxuXHQgKiBAcGFyYW0ge3N0cmluZz99IHF1ZXJ5U3RyaW5nIFVSSSBxdWVyeSBjb21wb25lbnQgc3RyaW5nLlxuXHQgKi9cblx0Y29uc3RydWN0b3IocXVlcnlTdHJpbmcpIHtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgc2V0IG9mIHZhbHVlcyBvZiBxdWVyeS5cblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqL1xuXHRcdHRoaXMudmFsdWVzID0gbnVsbDtcblxuXHRcdGlmICh0eXBlb2YgKHF1ZXJ5U3RyaW5nKSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHRoaXMudmFsdWVzID0ge307XG5cblx0XHRcdHF1ZXJ5U3RyaW5nXG5cdFx0XHRcdC5zcGxpdCgnJicpXG5cdFx0XHRcdC5mb3JFYWNoKHBhaXIgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHBhcnRzID0gcGFpci5zcGxpdCgnPScpO1xuXHRcdFx0XHRcdGNvbnN0IGtleSA9IHBlcmNlbnRFbmNvZGluZ0hlbHBlci5kZWNvZGUocGFydHNbMF0pO1xuXHRcdFx0XHRcdGlmICgha2V5KSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChrZXkgaW4gdGhpcy52YWx1ZXMgJiZcblx0XHRcdFx0XHRcdCEodGhpcy52YWx1ZXNba2V5XSBpbnN0YW5jZW9mIEFycmF5KSkge1xuXHRcdFx0XHRcdFx0dGhpcy52YWx1ZXNba2V5XSA9IFt0aGlzLnZhbHVlc1trZXldXTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjb25zdCB2YWx1ZSA9IHR5cGVvZiAocGFydHNbMV0pID09PSAnc3RyaW5nJyA/XG5cdFx0XHRcdFx0XHRwZXJjZW50RW5jb2RpbmdIZWxwZXIuZGVjb2RlKHBhcnRzWzFdKSA6IG51bGw7XG5cblx0XHRcdFx0XHRpZiAodGhpcy52YWx1ZXNba2V5XSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0XHRcdFx0XHR0aGlzLnZhbHVlc1trZXldLnB1c2godmFsdWUpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLnZhbHVlc1trZXldID0gdmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCB0aGlzKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2xvbmVzIGN1cnJlbnQgcXVlcnkgdG8gYSBuZXcgb2JqZWN0LlxuXHQgKiBAcmV0dXJucyB7UXVlcnl9IE5ldyBjbG9uZSBvZiBjdXJyZW50IG9iamVjdC5cblx0ICovXG5cdGNsb25lKCkge1xuXHRcdGNvbnN0IHF1ZXJ5ID0gbmV3IFF1ZXJ5KCk7XG5cdFx0aWYgKHRoaXMudmFsdWVzKSB7XG5cdFx0XHRxdWVyeS52YWx1ZXMgPSB7fTtcblx0XHRcdE9iamVjdC5rZXlzKHRoaXMudmFsdWVzKVxuXHRcdFx0XHQuZm9yRWFjaChrZXkgPT4ge1xuXHRcdFx0XHRcdHF1ZXJ5LnZhbHVlc1trZXldID0gdGhpcy52YWx1ZXNba2V5XTtcblx0XHRcdFx0fSwgdGhpcyk7XG5cdFx0fVxuXHRcdHJldHVybiBxdWVyeTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBjdXJyZW50IHNldCBvZiBxdWVyeSB2YWx1ZXMgdG8gc3RyaW5nLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBRdWVyeSBjb21wb25lbnQgc3RyaW5nLlxuXHQgKi9cblx0dG9TdHJpbmcoKSB7XG5cdFx0aWYgKCF0aGlzLnZhbHVlcykge1xuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH1cblxuXHRcdGxldCBxdWVyeVN0cmluZyA9ICcnO1xuXHRcdE9iamVjdC5rZXlzKHRoaXMudmFsdWVzKVxuXHRcdFx0LmZvckVhY2goa2V5ID0+IHtcblx0XHRcdFx0Y29uc3QgdmFsdWVzID0gdGhpcy52YWx1ZXNba2V5XSBpbnN0YW5jZW9mIEFycmF5ID9cblx0XHRcdFx0XHR0aGlzLnZhbHVlc1trZXldIDogW3RoaXMudmFsdWVzW2tleV1dO1xuXG5cdFx0XHRcdHZhbHVlcy5mb3JFYWNoKHZhbHVlID0+IHtcblx0XHRcdFx0XHRxdWVyeVN0cmluZyArPSBgJiR7cGVyY2VudEVuY29kaW5nSGVscGVyLmVuY29kZVF1ZXJ5U3ViQ29tcG9uZW50KGtleSl9YDtcblx0XHRcdFx0XHRpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YWx1ZSA9IFN0cmluZyh2YWx1ZSk7XG5cdFx0XHRcdFx0cXVlcnlTdHJpbmcgKz0gYD0ke3BlcmNlbnRFbmNvZGluZ0hlbHBlci5lbmNvZGVRdWVyeVN1YkNvbXBvbmVudCh2YWx1ZSl9YDtcblx0XHRcdFx0fSk7XG5cdFx0XHR9LCB0aGlzKTtcblxuXHRcdHJldHVybiBxdWVyeVN0cmluZy5yZXBsYWNlKC9eJi8sICcnKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXJ5O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBwZXJjZW50RW5jb2RpbmdIZWxwZXIgPSByZXF1aXJlKCcuL3BlcmNlbnRFbmNvZGluZ0hlbHBlcicpO1xuXG5jb25zdCBBdXRob3JpdHkgPSByZXF1aXJlKCcuL0F1dGhvcml0eScpO1xuY29uc3QgUXVlcnkgPSByZXF1aXJlKCcuL1F1ZXJ5Jyk7XG5cbi8vIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I2FwcGVuZGl4LUJcbmNvbnN0IFVSSV9QQVJTRV9SRUdFWFAgPSBuZXcgUmVnRXhwKFxuXHQnXigoW146Lz8jXSspOik/KC8vKFteLz8jXSopKT8oW14/I10qKShcXFxcPyhbXiNdKikpPygjKC4qKSk/J1xuXHQpO1xuLy8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYjc2VjdGlvbi0zLjFcbmNvbnN0IFNDSEVNRV9SRUdFWFAgPSAvXlthLXpdK1thLXpcXGRcXCtcXC4tXSokL2k7XG5jb25zdCBFUlJPUl9TQ0hFTUUgPSBgVVJJIHNjaGVtZSBtdXN0IHNhdGlzZnkgZXhwcmVzc2lvbiAke1NDSEVNRV9SRUdFWFAudG9TdHJpbmcoKX1gO1xuXG5jbGFzcyBVUkkge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IFVSSSBhdXRob3JpdHkgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0ge3N0cmluZz99IEV4aXN0aW5nIHN0cmluZy5cblx0ICogQHJldHVybiB7QXV0aG9yaXR5fSBUaGUgYXV0aG9yaXR5IGNvbXBvbmVudC5cblx0ICovXG5cdHN0YXRpYyBjcmVhdGVBdXRob3JpdHkoc3RyaW5nKSB7XG5cdFx0cmV0dXJuIG5ldyBBdXRob3JpdHkoc3RyaW5nKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IFVSSSBhdXRob3JpdHkgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0ge3N0cmluZz99IEV4aXN0aW5nIHN0cmluZy5cblx0ICogQHJldHVybiB7QXV0aG9yaXR5fSBUaGUgYXV0aG9yaXR5IGNvbXBvbmVudC5cblx0ICovXG5cdGNyZWF0ZUF1dGhvcml0eShzdHJpbmcpIHtcblx0XHRyZXR1cm4gVVJJLmNyZWF0ZUF1dGhvcml0eShzdHJpbmcpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgVVJJIHVzZXIgaW5mbyBjb21wb25lbnQuXG5cdCAqIEBwYXJhbSB7c3RyaW5nP30gRXhpc3Rpbmcgc3RyaW5nLlxuXHQgKiBAcmV0dXJuIHtVc2VySW5mb30gVGhlIHVzZXIgaW5mbyBjb21wb25lbnQuXG5cdCAqL1xuXHRzdGF0aWMgY3JlYXRlVXNlckluZm8oc3RyaW5nKSB7XG5cdFx0cmV0dXJuIEF1dGhvcml0eS5jcmVhdGVVc2VySW5mbyhzdHJpbmcpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgVVJJIHVzZXIgaW5mbyBjb21wb25lbnQuXG5cdCAqIEBwYXJhbSB7c3RyaW5nP30gRXhpc3Rpbmcgc3RyaW5nLlxuXHQgKiBAcmV0dXJuIHtVc2VySW5mb30gVGhlIHVzZXIgaW5mbyBjb21wb25lbnQuXG5cdCAqL1xuXHRjcmVhdGVVc2VySW5mbyhzdHJpbmcpIHtcblx0XHRyZXR1cm4gVVJJLmNyZWF0ZVVzZXJJbmZvKHN0cmluZyk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBVUkkgcXVlcnkgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0ge3N0cmluZz99IEV4aXN0aW5nIHN0cmluZy5cblx0ICogQHJldHVybiB7UXVlcnl9IFRoZSBxdWVyeSBjb21wb25lbnQuXG5cdCAqL1xuXHRzdGF0aWMgY3JlYXRlUXVlcnkoc3RyaW5nKSB7XG5cdFx0cmV0dXJuIG5ldyBRdWVyeShzdHJpbmcpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgVVJJIHF1ZXJ5IGNvbXBvbmVudC5cblx0ICogQHBhcmFtIHtzdHJpbmc/fSBFeGlzdGluZyBzdHJpbmcuXG5cdCAqIEByZXR1cm4ge1F1ZXJ5fSBUaGUgcXVlcnkgY29tcG9uZW50LlxuXHQgKi9cblx0Y3JlYXRlUXVlcnkoc3RyaW5nKSB7XG5cdFx0cmV0dXJuIFVSSS5jcmVhdGVRdWVyeShzdHJpbmcpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgbmV3IGluc3RhbmNlIG9mIFVSSSBhY2NvcmRpbmcgdG8gUkZDIDM5ODYuXG5cdCAqIEBwYXJhbSB7c3RyaW5nP30gdXJpU3RyaW5nIFVSSSBzdHJpbmcgdG8gcGFyc2UgY29tcG9uZW50cy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHVyaVN0cmluZykge1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBVUkkgc2NoZW1lLlxuXHRcdCAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I3NlY3Rpb24tMy4xXG5cdFx0ICogQHR5cGUge3N0cmluZ31cblx0XHQgKi9cblx0XHR0aGlzLnNjaGVtZSA9IG51bGw7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IFVSSSBhdXRob3JpdHkuXG5cdFx0ICogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYjc2VjdGlvbi0zLjJcblx0XHQgKiBAdHlwZSB7QXV0aG9yaXR5fVxuXHRcdCAqL1xuXHRcdHRoaXMuYXV0aG9yaXR5ID0gbnVsbDtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgVVJJIHBhdGguXG5cdFx0ICogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYjc2VjdGlvbi0zLjNcblx0XHQgKiBAdHlwZSB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdHRoaXMucGF0aCA9IG51bGw7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IFVSSSBxdWVyeS5cblx0XHQgKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNzZWN0aW9uLTMuNFxuXHRcdCAqIEB0eXBlIHtRdWVyeX1cblx0XHQgKi9cblx0XHR0aGlzLnF1ZXJ5ID0gbnVsbDtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgVVJJIGZyYWdtZW50LlxuXHRcdCAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I3NlY3Rpb24tMy41XG5cdFx0ICogQHR5cGUge3N0cmluZ31cblx0XHQgKi9cblx0XHR0aGlzLmZyYWdtZW50ID0gbnVsbDtcblxuXHRcdGlmICh0eXBlb2YgKHVyaVN0cmluZykgIT09ICdzdHJpbmcnKSB7XG5cdFx0XHR1cmlTdHJpbmcgPSAnJztcblx0XHR9XG5cblx0XHQvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNhcHBlbmRpeC1CXG5cdFx0Y29uc3QgbWF0Y2hlcyA9IHVyaVN0cmluZy5tYXRjaChVUklfUEFSU0VfUkVHRVhQKTtcblxuXHRcdGlmIChtYXRjaGVzKSB7XG5cdFx0XHRpZiAodHlwZW9mIChtYXRjaGVzWzJdKSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0dGhpcy5zY2hlbWUgPSBwZXJjZW50RW5jb2RpbmdIZWxwZXIuZGVjb2RlKG1hdGNoZXNbMl0pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHR5cGVvZiAobWF0Y2hlc1s0XSkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdHRoaXMuYXV0aG9yaXR5ID0gVVJJLmNyZWF0ZUF1dGhvcml0eShtYXRjaGVzWzRdKTtcblx0XHRcdH1cblx0XHRcdGlmICh0eXBlb2YgKG1hdGNoZXNbNV0pID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHR0aGlzLnBhdGggPSBwZXJjZW50RW5jb2RpbmdIZWxwZXIuZGVjb2RlUGF0aChtYXRjaGVzWzVdKTtcblx0XHRcdH1cblx0XHRcdGlmICh0eXBlb2YgKG1hdGNoZXNbN10pID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHR0aGlzLnF1ZXJ5ID0gVVJJLmNyZWF0ZVF1ZXJ5KG1hdGNoZXNbN10pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHR5cGVvZiAobWF0Y2hlc1s5XSkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdHRoaXMuZnJhZ21lbnQgPSBwZXJjZW50RW5jb2RpbmdIZWxwZXIuZGVjb2RlKG1hdGNoZXNbOV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIFVSSSByZWZlcmVuY2UgdGhhdCBtaWdodCBiZSByZWxhdGl2ZSB0byBhIGdpdmVuIGJhc2UgVVJJXG5cdCAqIGludG8gdGhlIHJlZmVyZW5jZSdzIHRhcmdldCBVUkkuXG5cdCAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I3NlY3Rpb24tNS4yXG5cdCAqIEBwYXJhbSB7VVJJfSBiYXNlVXJpIEJhc2UgVVJJLlxuXHQgKiBAcmV0dXJucyB7VVJJfSBSZXNvbHZlZCBVUkkuXG5cdCAqL1xuXHRyZXNvbHZlUmVsYXRpdmUoYmFzZVVyaSkge1xuXHRcdGlmICghYmFzZVVyaS5zY2hlbWUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignU2NoZW1lIGNvbXBvbmVudCBpcyByZXF1aXJlZCB0byBiZSBwcmVzZW50IGluIGEgYmFzZSBVUkknKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJhbnNmb3JtUmVmZXJlbmNlKGJhc2VVcmksIHRoaXMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENsb25lcyBjdXJyZW50IFVSSSB0byBhIG5ldyBvYmplY3QuXG5cdCAqIEByZXR1cm5zIHtVUkl9IE5ldyBjbG9uZSBvZiBjdXJyZW50IG9iamVjdC5cblx0ICovXG5cdGNsb25lKCkge1xuXHRcdGNvbnN0IHVyaSA9IG5ldyBVUkkoKTtcblxuXHRcdGlmICh0eXBlb2YgKHRoaXMuc2NoZW1lKSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHVyaS5zY2hlbWUgPSB0aGlzLnNjaGVtZTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5hdXRob3JpdHkpIHtcblx0XHRcdHVyaS5hdXRob3JpdHkgPSB0aGlzLmF1dGhvcml0eS5jbG9uZSgpO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgKHRoaXMucGF0aCkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHR1cmkucGF0aCA9IHRoaXMucGF0aDtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5xdWVyeSkge1xuXHRcdFx0dXJpLnF1ZXJ5ID0gdGhpcy5xdWVyeS5jbG9uZSgpO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgKHRoaXMuZnJhZ21lbnQpID09PSAnc3RyaW5nJykge1xuXHRcdFx0dXJpLmZyYWdtZW50ID0gdGhpcy5mcmFnbWVudDtcblx0XHR9XG5cblx0XHRyZXR1cm4gdXJpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlY29tcG9zZXMgVVJJIGNvbXBvbmVudHMgdG8gVVJJIHN0cmluZyxcblx0ICogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYjc2VjdGlvbi01LjNcblx0ICogQHJldHVybnMge3N0cmluZ30gVVJJIHN0cmluZy5cblx0ICovXG5cdHRvU3RyaW5nKCkge1xuXHRcdGxldCByZXN1bHQgPSAnJztcblxuXHRcdGlmICh0aGlzLnNjaGVtZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuc2NoZW1lICE9PSBudWxsKSB7XG5cdFx0XHRjb25zdCBzY2hlbWUgPSBTdHJpbmcodGhpcy5zY2hlbWUpO1xuXHRcdFx0aWYgKCFTQ0hFTUVfUkVHRVhQLnRlc3Qoc2NoZW1lKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoRVJST1JfU0NIRU1FKTtcblx0XHRcdH1cblx0XHRcdHJlc3VsdCArPSBgJHtzY2hlbWV9OmA7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuYXV0aG9yaXR5IGluc3RhbmNlb2YgQXV0aG9yaXR5KSB7XG5cdFx0XHRyZXN1bHQgKz0gYC8vJHt0aGlzLmF1dGhvcml0eS50b1N0cmluZygpfWA7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcGF0aCA9IHRoaXMucGF0aCA9PT0gdW5kZWZpbmVkIHx8IHRoaXMucGF0aCA9PT0gbnVsbCA/XG5cdFx0XHQnJyA6IFN0cmluZyh0aGlzLnBhdGgpO1xuXHRcdHJlc3VsdCArPSBwZXJjZW50RW5jb2RpbmdIZWxwZXIuZW5jb2RlUGF0aChwYXRoKTtcblxuXHRcdGlmICh0aGlzLnF1ZXJ5IGluc3RhbmNlb2YgUXVlcnkpIHtcblx0XHRcdHJlc3VsdCArPSBgPyR7dGhpcy5xdWVyeS50b1N0cmluZygpfWA7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuZnJhZ21lbnQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmZyYWdtZW50ICE9PSBudWxsKSB7XG5cdFx0XHRjb25zdCBmcmFnbWVudCA9IFN0cmluZyh0aGlzLmZyYWdtZW50KTtcblx0XHRcdHJlc3VsdCArPSBgIyR7cGVyY2VudEVuY29kaW5nSGVscGVyLmVuY29kZUZyYWdtZW50KGZyYWdtZW50KX1gO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHJlZmVyZW5jZSBmb3IgcmVsYXRpdmUgcmVzb2x1dGlvbi5cbiAqIFdob2xlIGFsZ29yaXRobSBoYXMgYmVlbiB0YWtlbiBmcm9tXG4gKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNzZWN0aW9uLTUuMi4yXG4gKiBAcGFyYW0ge1VSSX0gYmFzZVVyaSBCYXNlIFVSSSBmb3IgcmVzb2x1dGlvbi5cbiAqIEBwYXJhbSB7VVJJfSByZWZlcmVuY2VVcmkgUmVmZXJlbmNlIFVSSSB0byByZXNvbHZlLlxuICogQHJldHVybnMge1VSSX0gQ29tcG9uZW50cyBvZiB0YXJnZXQgVVJJLlxuICovXG5mdW5jdGlvbiB0cmFuc2Zvcm1SZWZlcmVuY2UoYmFzZVVyaSwgcmVmZXJlbmNlVXJpKSB7XG5cblx0LyogZXNsaW50IGNvbXBsZXhpdHk6IFsyLCAxM10qL1xuXHRjb25zdCB0YXJnZXRVcmkgPSBuZXcgVVJJKCcnKTtcblxuXHRpZiAocmVmZXJlbmNlVXJpLnNjaGVtZSkge1xuXHRcdHRhcmdldFVyaS5zY2hlbWUgPSByZWZlcmVuY2VVcmkuc2NoZW1lO1xuXHRcdHRhcmdldFVyaS5hdXRob3JpdHkgPSByZWZlcmVuY2VVcmkuYXV0aG9yaXR5ID9cblx0XHRcdHJlZmVyZW5jZVVyaS5hdXRob3JpdHkuY2xvbmUoKSA6IHJlZmVyZW5jZVVyaS5hdXRob3JpdHk7XG5cdFx0dGFyZ2V0VXJpLnBhdGggPSByZW1vdmVEb3RTZWdtZW50cyhyZWZlcmVuY2VVcmkucGF0aCk7XG5cdFx0dGFyZ2V0VXJpLnF1ZXJ5ID0gcmVmZXJlbmNlVXJpLnF1ZXJ5ID9cblx0XHRcdHJlZmVyZW5jZVVyaS5xdWVyeS5jbG9uZSgpIDogcmVmZXJlbmNlVXJpLnF1ZXJ5O1xuXHR9IGVsc2Uge1xuXHRcdGlmIChyZWZlcmVuY2VVcmkuYXV0aG9yaXR5KSB7XG5cdFx0XHR0YXJnZXRVcmkuYXV0aG9yaXR5ID0gcmVmZXJlbmNlVXJpLmF1dGhvcml0eSA/XG5cdFx0XHRcdHJlZmVyZW5jZVVyaS5hdXRob3JpdHkuY2xvbmUoKSA6IHJlZmVyZW5jZVVyaS5hdXRob3JpdHk7XG5cdFx0XHR0YXJnZXRVcmkucGF0aCA9IHJlbW92ZURvdFNlZ21lbnRzKHJlZmVyZW5jZVVyaS5wYXRoKTtcblx0XHRcdHRhcmdldFVyaS5xdWVyeSA9IHJlZmVyZW5jZVVyaS5xdWVyeSA/XG5cdFx0XHRcdHJlZmVyZW5jZVVyaS5xdWVyeS5jbG9uZSgpIDogcmVmZXJlbmNlVXJpLnF1ZXJ5O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAocmVmZXJlbmNlVXJpLnBhdGggPT09ICcnKSB7XG5cdFx0XHRcdHRhcmdldFVyaS5wYXRoID0gYmFzZVVyaS5wYXRoO1xuXHRcdFx0XHRpZiAocmVmZXJlbmNlVXJpLnF1ZXJ5KSB7XG5cdFx0XHRcdFx0dGFyZ2V0VXJpLnF1ZXJ5ID0gcmVmZXJlbmNlVXJpLnF1ZXJ5LmNsb25lKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGFyZ2V0VXJpLnF1ZXJ5ID0gYmFzZVVyaS5xdWVyeSA/XG5cdFx0XHRcdFx0XHRiYXNlVXJpLnF1ZXJ5LmNsb25lKCkgOiBiYXNlVXJpLnF1ZXJ5O1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAocmVmZXJlbmNlVXJpLnBhdGhbMF0gPT09ICcvJykge1xuXHRcdFx0XHRcdHRhcmdldFVyaS5wYXRoID0gcmVtb3ZlRG90U2VnbWVudHMocmVmZXJlbmNlVXJpLnBhdGgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRhcmdldFVyaS5wYXRoID0gbWVyZ2UoYmFzZVVyaSwgcmVmZXJlbmNlVXJpKTtcblx0XHRcdFx0XHR0YXJnZXRVcmkucGF0aCA9IHJlbW92ZURvdFNlZ21lbnRzKHRhcmdldFVyaS5wYXRoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0YXJnZXRVcmkucXVlcnkgPSByZWZlcmVuY2VVcmkucXVlcnkgP1xuXHRcdFx0XHRcdHJlZmVyZW5jZVVyaS5xdWVyeS5jbG9uZSgpIDogcmVmZXJlbmNlVXJpLnF1ZXJ5O1xuXHRcdFx0fVxuXHRcdFx0dGFyZ2V0VXJpLmF1dGhvcml0eSA9IGJhc2VVcmkuYXV0aG9yaXR5ID9cblx0XHRcdFx0YmFzZVVyaS5hdXRob3JpdHkuY2xvbmUoKSA6IGJhc2VVcmkuYXV0aG9yaXR5O1xuXHRcdH1cblx0XHR0YXJnZXRVcmkuc2NoZW1lID0gYmFzZVVyaS5zY2hlbWU7XG5cdH1cblxuXHR0YXJnZXRVcmkuZnJhZ21lbnQgPSByZWZlcmVuY2VVcmkuZnJhZ21lbnQ7XG5cdHJldHVybiB0YXJnZXRVcmk7XG59XG5cbi8qKlxuICogTWVyZ2VzIGEgcmVsYXRpdmUtcGF0aCByZWZlcmVuY2Ugd2l0aCB0aGUgcGF0aCBvZiB0aGUgYmFzZSBVUkkuXG4gKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNzZWN0aW9uLTUuMi4zXG4gKiBAcGFyYW0ge1VSSX0gYmFzZVVyaSBDb21wb25lbnRzIG9mIGJhc2UgVVJJLlxuICogQHBhcmFtIHtVUkl9IHJlZmVyZW5jZVVyaSBDb21wb25lbnRzIG9mIHJlZmVyZW5jZSBVUkkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBNZXJnZWQgcGF0aC5cbiAqL1xuZnVuY3Rpb24gbWVyZ2UoYmFzZVVyaSwgcmVmZXJlbmNlVXJpKSB7XG5cdGlmIChiYXNlVXJpLmF1dGhvcml0eSAmJiBiYXNlVXJpLnBhdGggPT09ICcnKSB7XG5cdFx0cmV0dXJuIGAvJHtyZWZlcmVuY2VVcmkucGF0aH1gO1xuXHR9XG5cblx0Y29uc3Qgc2VnbWVudHNTdHJpbmcgPSBiYXNlVXJpLnBhdGguaW5kZXhPZignLycpICE9PSAtMSA/XG5cdFx0YmFzZVVyaS5wYXRoLnJlcGxhY2UoL1xcL1teXFwvXSskLywgJy8nKSA6ICcnO1xuXG5cdHJldHVybiBzZWdtZW50c1N0cmluZyArIHJlZmVyZW5jZVVyaS5wYXRoO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgZG90cyBzZWdtZW50cyBmcm9tIFVSSSBwYXRoLlxuICogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYjc2VjdGlvbi01LjIuNFxuICogQHBhcmFtIHtzdHJpbmd9IHVyaVBhdGggVVJJIHBhdGggd2l0aCBwb3NzaWJsZSBkb3Qgc2VnbWVudHMuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBVUkkgcGF0aCB3aXRob3V0IGRvdCBzZWdtZW50cy5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRG90U2VnbWVudHModXJpUGF0aCkge1xuXHRpZiAoIXVyaVBhdGgpIHtcblx0XHRyZXR1cm4gJyc7XG5cdH1cblxuXHRsZXQgaW5wdXRCdWZmZXIgPSB1cmlQYXRoO1xuXHRsZXQgbmV3QnVmZmVyID0gJyc7XG5cdGxldCBuZXh0U2VnbWVudCA9ICcnO1xuXHRsZXQgb3V0cHV0QnVmZmVyID0gJyc7XG5cblx0d2hpbGUgKGlucHV0QnVmZmVyLmxlbmd0aCAhPT0gMCkge1xuXG5cdFx0Ly8gSWYgdGhlIGlucHV0IGJ1ZmZlciBiZWdpbnMgd2l0aCBhIHByZWZpeCBvZiBcIi4uL1wiIG9yIFwiLi9cIixcblx0XHQvLyB0aGVuIHJlbW92ZSB0aGF0IHByZWZpeCBmcm9tIHRoZSBpbnB1dCBidWZmZXJcblx0XHRuZXdCdWZmZXIgPSBpbnB1dEJ1ZmZlci5yZXBsYWNlKC9eXFwuP1xcLlxcLy8sICcnKTtcblx0XHRpZiAobmV3QnVmZmVyICE9PSBpbnB1dEJ1ZmZlcikge1xuXHRcdFx0aW5wdXRCdWZmZXIgPSBuZXdCdWZmZXI7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHQvLyBpZiB0aGUgaW5wdXQgYnVmZmVyIGJlZ2lucyB3aXRoIGEgcHJlZml4IG9mIFwiLy4vXCIgb3IgXCIvLlwiLFxuXHRcdC8vIHdoZXJlIFwiLlwiIGlzIGEgY29tcGxldGUgcGF0aCBzZWdtZW50LCB0aGVuIHJlcGxhY2UgdGhhdFxuXHRcdC8vIHByZWZpeCB3aXRoIFwiL1wiIGluIHRoZSBpbnB1dCBidWZmZXJcblx0XHRuZXdCdWZmZXIgPSBpbnB1dEJ1ZmZlci5yZXBsYWNlKC9eKChcXC9cXC5cXC8pfChcXC9cXC4kKSkvLCAnLycpO1xuXHRcdGlmIChuZXdCdWZmZXIgIT09IGlucHV0QnVmZmVyKSB7XG5cdFx0XHRpbnB1dEJ1ZmZlciA9IG5ld0J1ZmZlcjtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdC8vIGlmIHRoZSBpbnB1dCBidWZmZXIgYmVnaW5zIHdpdGggYSBwcmVmaXggb2YgXCIvLi4vXCIgb3IgXCIvLi5cIixcblx0XHQvLyB3aGVyZSBcIi4uXCIgaXMgYSBjb21wbGV0ZSBwYXRoIHNlZ21lbnQsIHRoZW4gcmVwbGFjZSB0aGF0XG5cdFx0Ly8gcHJlZml4IHdpdGggXCIvXCIgaW4gdGhlIGlucHV0IGJ1ZmZlciBhbmQgcmVtb3ZlIHRoZSBsYXN0XG5cdFx0Ly8gc2VnbWVudCBhbmQgaXRzIHByZWNlZGluZyBcIi9cIiAoaWYgYW55KSBmcm9tIHRoZSBvdXRwdXRcblx0XHQvLyBidWZmZXJcblx0XHRuZXdCdWZmZXIgPSBpbnB1dEJ1ZmZlci5yZXBsYWNlKC9eKChcXC9cXC5cXC5cXC8pfChcXC9cXC5cXC4kKSkvLCAnLycpO1xuXHRcdGlmIChuZXdCdWZmZXIgIT09IGlucHV0QnVmZmVyKSB7XG5cdFx0XHRvdXRwdXRCdWZmZXIgPSBvdXRwdXRCdWZmZXIucmVwbGFjZSgvXFwvW15cXC9dKyQvLCAnJyk7XG5cdFx0XHRpbnB1dEJ1ZmZlciA9IG5ld0J1ZmZlcjtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdC8vIGlmIHRoZSBpbnB1dCBidWZmZXIgY29uc2lzdHMgb25seSBvZiBcIi5cIiBvciBcIi4uXCIsIHRoZW4gcmVtb3ZlXG5cdFx0Ly8gdGhhdCBmcm9tIHRoZSBpbnB1dCBidWZmZXJcblx0XHRpZiAoaW5wdXRCdWZmZXIgPT09ICcuJyB8fCBpbnB1dEJ1ZmZlciA9PT0gJy4uJykge1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0Ly8gbW92ZSB0aGUgZmlyc3QgcGF0aCBzZWdtZW50IGluIHRoZSBpbnB1dCBidWZmZXIgdG8gdGhlIGVuZCBvZlxuXHRcdC8vIHRoZSBvdXRwdXQgYnVmZmVyLCBpbmNsdWRpbmcgdGhlIGluaXRpYWwgXCIvXCIgY2hhcmFjdGVyIChpZlxuXHRcdC8vIGFueSkgYW5kIGFueSBzdWJzZXF1ZW50IGNoYXJhY3RlcnMgdXAgdG8sIGJ1dCBub3QgaW5jbHVkaW5nLFxuXHRcdC8vIHRoZSBuZXh0IFwiL1wiIGNoYXJhY3RlciBvciB0aGUgZW5kIG9mIHRoZSBpbnB1dCBidWZmZXJcblx0XHRuZXh0U2VnbWVudCA9IC9eXFwvP1teXFwvXSooXFwvfCQpLy5leGVjKGlucHV0QnVmZmVyKVswXTtcblx0XHRuZXh0U2VnbWVudCA9IG5leHRTZWdtZW50LnJlcGxhY2UoLyhbXlxcL10pKFxcLyQpLywgJyQxJyk7XG5cdFx0aW5wdXRCdWZmZXIgPSBpbnB1dEJ1ZmZlci5zdWJzdHJpbmcobmV4dFNlZ21lbnQubGVuZ3RoKTtcblx0XHRvdXRwdXRCdWZmZXIgKz0gbmV4dFNlZ21lbnQ7XG5cdH1cblxuXHRyZXR1cm4gb3V0cHV0QnVmZmVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVSSTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcGVyY2VudEVuY29kaW5nSGVscGVyID0gcmVxdWlyZSgnLi9wZXJjZW50RW5jb2RpbmdIZWxwZXInKTtcblxuY2xhc3MgVXNlckluZm8ge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIG5ldyBpbnN0YW5jZSBvZiB1c2VyIGluZm9ybWF0aW9uIGNvbXBvbmVudCBwYXJzZXIuXG5cdCAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I3NlY3Rpb24tMy4yLjFcblx0ICogQHBhcmFtIHtzdHJpbmc/fSB1c2VySW5mb1N0cmluZyBVc2VyIGluZm9ybWF0aW9uIGNvbXBvbmVudCBzdHJpbmcuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcih1c2VySW5mb1N0cmluZykge1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCB1c2VyIGNvbXBvbmVudC5cblx0XHQgKiBAdHlwZSB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdHRoaXMudXNlciA9IG51bGw7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHBhc3N3b3JkLlxuXHRcdCAqIEB0eXBlIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0dGhpcy5wYXNzd29yZCA9IG51bGw7XG5cblx0XHRpZiAodHlwZW9mICh1c2VySW5mb1N0cmluZykgPT09ICdzdHJpbmcnICYmIHVzZXJJbmZvU3RyaW5nLmxlbmd0aCA+IDApIHtcblx0XHRcdGNvbnN0IHBhcnRzID0gdXNlckluZm9TdHJpbmcuc3BsaXQoJzonKTtcblx0XHRcdGlmICh0eXBlb2YgKHBhcnRzWzBdKSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0dGhpcy51c2VyID0gcGVyY2VudEVuY29kaW5nSGVscGVyLmRlY29kZShwYXJ0c1swXSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZW9mIChwYXJ0c1sxXSkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdHRoaXMucGFzc3dvcmQgPSBwZXJjZW50RW5jb2RpbmdIZWxwZXIuZGVjb2RlKHBhcnRzWzFdKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2xvbmVzIGN1cnJlbnQgdXNlciBpbmZvcm1hdGlvbi5cblx0ICogQHJldHVybnMge1VzZXJJbmZvfSBOZXcgY2xvbmUgb2YgY3VycmVudCBvYmplY3QuXG5cdCAqL1xuXHRjbG9uZSgpIHtcblx0XHRjb25zdCB1c2VySW5mbyA9IG5ldyBVc2VySW5mbygpO1xuXHRcdGlmICh0eXBlb2YgKHRoaXMudXNlcikgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHR1c2VySW5mby51c2VyID0gdGhpcy51c2VyO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mICh0aGlzLnBhc3N3b3JkKSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHVzZXJJbmZvLnBhc3N3b3JkID0gdGhpcy5wYXNzd29yZDtcblx0XHR9XG5cdFx0cmV0dXJuIHVzZXJJbmZvO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlY29tYmluZXMgdXNlciBpbmZvcm1hdGlvbiBjb21wb25lbnRzIHRvIHVzZXJJbmZvIHN0cmluZy5cblx0ICogQHJldHVybnMge3N0cmluZ30gVXNlciBpbmZvcm1hdGlvbiBjb21wb25lbnQgc3RyaW5nLlxuXHQgKi9cblx0dG9TdHJpbmcoKSB7XG5cdFx0bGV0IHJlc3VsdCA9ICcnO1xuXHRcdGlmICh0aGlzLnVzZXIgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnVzZXIgIT09IG51bGwpIHtcblx0XHRcdGNvbnN0IHVzZXIgPSBTdHJpbmcodGhpcy51c2VyKTtcblx0XHRcdHJlc3VsdCArPSBwZXJjZW50RW5jb2RpbmdIZWxwZXJcblx0XHRcdFx0LmVuY29kZVVzZXJJbmZvU3ViQ29tcG9uZW50KHVzZXIpO1xuXHRcdH1cblx0XHRpZiAodGhpcy5wYXNzd29yZCAhPT0gdW5kZWZpbmVkICYmIHRoaXMucGFzc3dvcmQgIT09IG51bGwpIHtcblx0XHRcdGNvbnN0IHBhc3N3b3JkID0gU3RyaW5nKHRoaXMucGFzc3dvcmQpO1xuXHRcdFx0cmVzdWx0ICs9IGA6JHtwZXJjZW50RW5jb2RpbmdIZWxwZXIuZW5jb2RlVXNlckluZm9TdWJDb21wb25lbnQocGFzc3dvcmQpfWA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJJbmZvO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNzZWN0aW9uLTIuMVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Ly8gXFx1RDgwMC1cXHVEQkZGIFxcdURDMDAtXFx1REZGRlxuXHQvLyBzdXJyb2dhdGVzIHBhaXJzIGxpa2UgZW1vamkgd2Ugc2hvdWxkIGlnbm9yZVxuXHQvKipcblx0ICogRW5jb2RlcyBhdXRob3JpdHkgdXNlciBpbmZvcm1hdGlvbiBzdWItY29tcG9uZW50IGFjY29yZGluZyB0byBSRkMgMzk4Ni5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBDb21wb25lbnQgdG8gZW5jb2RlLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBFbmNvZGVkIGNvbXBvbmVudC5cblx0ICovXG5cdGVuY29kZVVzZXJJbmZvU3ViQ29tcG9uZW50KHN0cmluZykge1xuXHRcdHJldHVybiBzdHJpbmcucmVwbGFjZShcblx0XHRcdC8vIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I3NlY3Rpb24tMy4yLjFcblx0XHRcdC9bXlxcd1xcLn5cXC0hXFwkJidcXChcXClcXCpcXCssOz1cXHVEODAwLVxcdURCRkZcXHVEQzAwLVxcdURGRkZdL2csXG5cdFx0XHRlbmNvZGVVUklDb21wb25lbnRcblx0XHQpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBFbmNvZGVzIGF1dGhvcml0eSBob3N0IGNvbXBvbmVudCBhY2NvcmRpbmcgdG8gUkZDIDM5ODYuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgQ29tcG9uZW50IHRvIGVuY29kZS5cblx0ICogQHJldHVybnMge3N0cmluZ30gRW5jb2RlZCBjb21wb25lbnQuXG5cdCAqL1xuXHRlbmNvZGVIb3N0KHN0cmluZykge1xuXHRcdHJldHVybiBzdHJpbmcucmVwbGFjZShcblx0XHRcdC8vIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I3NlY3Rpb24tMy4yLjJcblx0XHRcdC9bXlxcd1xcLn5cXC0hXFwkJidcXChcXClcXCpcXCssOz06XFxbXFxdXFx1RDgwMC1cXHVEQkZGXFx1REMwMC1cXHVERkZGXS9nLFxuXHRcdFx0ZW5jb2RlVVJJQ29tcG9uZW50XG5cdFx0KTtcblx0fSxcblxuXHQvKipcblx0ICogRW5jb2RlcyBVUkkgcGF0aCBjb21wb25lbnQgYWNjb3JkaW5nIHRvIFJGQyAzOTg2LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIENvbXBvbmVudCB0byBlbmNvZGUuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IEVuY29kZWQgY29tcG9uZW50LlxuXHQgKi9cblx0ZW5jb2RlUGF0aChzdHJpbmcpIHtcblx0XHRyZXR1cm4gc3RyaW5nLnNwbGl0KC8lMmYvaSlcblx0XHRcdC5tYXAocGFydCA9PiB7XG5cdFx0XHRcdHJldHVybiBwYXJ0LnJlcGxhY2UoXG5cdFx0XHRcdFx0Ly8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYjc2VjdGlvbi0zLjNcblx0XHRcdFx0XHQvW15cXHdcXC5+XFwtIVxcJCYnXFwoXFwpXFwqXFwrLDs9OkBcXC9cXHVEODAwLVxcdURCRkZcXHVEQzAwLVxcdURGRkZdL2csXG5cdFx0XHRcdFx0ZW5jb2RlVVJJQ29tcG9uZW50XG5cdFx0XHRcdCk7XG5cdFx0XHR9KVxuXHRcdFx0LnJlZHVjZSgocHJldiwgY3VycmVudCkgPT4gIXByZXYgPyBjdXJyZW50IDogYCR7cHJldn0lMkYke2N1cnJlbnR9YCwgJycpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBFbmNvZGVzIHF1ZXJ5IHN1Yi1jb21wb25lbnQgYWNjb3JkaW5nIHRvIFJGQyAzOTg2LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIENvbXBvbmVudCB0byBlbmNvZGUuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IEVuY29kZWQgY29tcG9uZW50LlxuXHQgKi9cblx0ZW5jb2RlUXVlcnlTdWJDb21wb25lbnQoc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKFxuXHRcdFx0Ly8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYjc2VjdGlvbi0zLjRcblx0XHRcdC9bXlxcd1xcLn5cXC0hXFwkJ1xcKFxcKVxcKiw7OkBcXC9cXD9cXHVEODAwLVxcdURCRkZcXHVEQzAwLVxcdURGRkZdL2csXG5cdFx0XHRlbmNvZGVVUklDb21wb25lbnRcblx0XHQpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBFbmNvZGVzIFVSSSBmcmFnbWVudCBjb21wb25lbnQgYWNjb3JkaW5nIHRvIFJGQyAzOTg2LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIENvbXBvbmVudCB0byBlbmNvZGUuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IEVuY29kZWQgY29tcG9uZW50LlxuXHQgKi9cblx0ZW5jb2RlRnJhZ21lbnQoc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKFxuXHRcdFx0Ly8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYjc2VjdGlvbi0zLjVcblx0XHRcdC9bXlxcd1xcLn5cXC0hXFwkJidcXChcXClcXCpcXCssOz06QFxcL1xcP1xcdUQ4MDAtXFx1REJGRlxcdURDMDAtXFx1REZGRl0vZyxcblx0XHRcdGVuY29kZVVSSUNvbXBvbmVudFxuXHRcdCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIERlY29kZXMgcGVyY2VudCBlbmNvZGVkIGNvbXBvbmVudC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBDb21wb25lbnQgdG8gZGVjb2RlLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBEZWNvZGVkIGNvbXBvbmVudC5cblx0ICovXG5cdGRlY29kZShzdHJpbmcpIHtcblx0XHRyZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cmluZyk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIERlY29kZXMgcGVyY2VudCBlbmNvZGVkIHBhdGggY29tcG9uZW50LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIENvbXBvbmVudCB0byBkZWNvZGUuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IERlY29kZWQgcGF0aCBjb21wb25lbnQuXG5cdCAqL1xuXHRkZWNvZGVQYXRoKHN0cmluZykge1xuXHRcdHJldHVybiBzdHJpbmcuc3BsaXQoLyUyZi9pKVxuXHRcdFx0Lm1hcChkZWNvZGVVUklDb21wb25lbnQpXG5cdFx0XHQucmVkdWNlKChwcmV2LCBjdXJyZW50KSA9PiAhcHJldiA/IGN1cnJlbnQgOiBgJHtwcmV2fSUyRiR7Y3VycmVudH1gLCAnJyk7XG5cdH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IENhdGJlcnJ5ID0gcmVxdWlyZSgnLi9DYXRiZXJyeS5qcycpO1xuY29uc3QgQm9vdHN0cmFwcGVyQmFzZSA9IHJlcXVpcmUoJy4uL2xpYi9iYXNlL0Jvb3RzdHJhcHBlckJhc2UnKTtcbmNvbnN0IFN0b3JlRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2xpYi9TdG9yZURpc3BhdGNoZXInKTtcbmNvbnN0IE1vZHVsZUFwaVByb3ZpZGVyID0gcmVxdWlyZSgnLi9wcm92aWRlcnMvTW9kdWxlQXBpUHJvdmlkZXInKTtcbmNvbnN0IENvb2tpZVdyYXBwZXIgPSByZXF1aXJlKCcuL0Nvb2tpZVdyYXBwZXInKTtcblxuY2xhc3MgQm9vdHN0cmFwcGVyIGV4dGVuZHMgQm9vdHN0cmFwcGVyQmFzZSB7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIGJyb3dzZXIgQ2F0YmVycnkncyBib290c3RyYXBwZXIuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcihDYXRiZXJyeSk7XG5cdH1cblxuXHQvKipcblx0ICogQ29uZmlndXJlcyBhIENhdGJlcnJ5J3Mgc2VydmljZSBsb2NhdG9yLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnT2JqZWN0IFRoZSBhcHBsaWNhdGlvbiBjb25maWcgb2JqZWN0LlxuXHQgKiBAcGFyYW0ge1NlcnZpY2VMb2NhdG9yfSBsb2NhdG9yIFRoZSBzZXJ2aWNlIGxvY2F0b3IgdG8gY29uZmlndXJlLlxuXHQgKi9cblx0Y29uZmlndXJlKGNvbmZpZ09iamVjdCwgbG9jYXRvcikge1xuXHRcdHN1cGVyLmNvbmZpZ3VyZShjb25maWdPYmplY3QsIGxvY2F0b3IpO1xuXG5cdFx0bG9jYXRvci5yZWdpc3Rlcignc3RvcmVEaXNwYXRjaGVyJywgU3RvcmVEaXNwYXRjaGVyLCB0cnVlKTtcblx0XHRsb2NhdG9yLnJlZ2lzdGVyKCdtb2R1bGVBcGlQcm92aWRlcicsIE1vZHVsZUFwaVByb3ZpZGVyLCB0cnVlKTtcblx0XHRsb2NhdG9yLnJlZ2lzdGVyKCdjb29raWVXcmFwcGVyJywgQ29va2llV3JhcHBlciwgdHJ1ZSk7XG5cblx0XHRsb2NhdG9yLnJlZ2lzdGVySW5zdGFuY2UoJ3dpbmRvdycsIHdpbmRvdyk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQm9vdHN0cmFwcGVyKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IENhdGJlcnJ5QmFzZSA9IHJlcXVpcmUoJy4uL2xpYi9iYXNlL0NhdGJlcnJ5QmFzZScpO1xuXG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgncHJvbWlzZScpO1xuLy8gaWYgYnJvd3NlciBzdGlsbCBkb2VzIG5vdCBoYXZlIHByb21pc2VzIHRoZW4gYWRkIGl0LlxuaWYgKCEoJ1Byb21pc2UnIGluIHdpbmRvdykpIHtcblx0d2luZG93LlByb21pc2UgPSBQcm9taXNlO1xufVxuXG5jbGFzcyBDYXRiZXJyeSBleHRlbmRzIENhdGJlcnJ5QmFzZSB7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgbmV3IGluc3RhbmNlIG9mIHRoZSBicm93c2VyIHZlcnNpb24gb2YgQ2F0YmVycnkuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCByZXF1ZXN0IHJvdXRlci5cblx0XHQgKiBAdHlwZSB7UmVxdWVzdFJvdXRlcn1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX3JvdXRlciA9IG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogV3JhcHMgY3VycmVudCBIVE1MIGRvY3VtZW50IHdpdGggQ2F0YmVycnkgZXZlbnQgaGFuZGxlcnMuXG5cdCAqL1xuXHR3cmFwRG9jdW1lbnQoKSB7XG5cdFx0Y29uc3QgYXBwRGVmaW5pdGlvbnMgPSByZXF1aXJlKCdhcHBEZWZpbml0aW9ucycpO1xuXHRcdGFwcERlZmluaXRpb25zLnJvdXRlRGVmaW5pdGlvbnNcblx0XHRcdC5mb3JFYWNoKHJvdXRlRGVmaW5pdGlvbiA9PiB0aGlzLmxvY2F0b3IucmVnaXN0ZXJJbnN0YW5jZSgncm91dGVEZWZpbml0aW9uJywgcm91dGVEZWZpbml0aW9uKSk7XG5cblx0XHRhcHBEZWZpbml0aW9ucy5yb3V0ZURlc2NyaXB0b3JzXG5cdFx0XHQuZm9yRWFjaChyb3V0ZURlc2NyaXB0b3IgPT4gdGhpcy5sb2NhdG9yLnJlZ2lzdGVySW5zdGFuY2UoJ3JvdXRlRGVzY3JpcHRvcicsIHJvdXRlRGVzY3JpcHRvcikpO1xuXG5cdFx0YXBwRGVmaW5pdGlvbnMuc3RvcmVzXG5cdFx0XHQuZm9yRWFjaChzdG9yZSA9PiB0aGlzLmxvY2F0b3IucmVnaXN0ZXJJbnN0YW5jZSgnc3RvcmUnLCBzdG9yZSkpO1xuXG5cdFx0YXBwRGVmaW5pdGlvbnMuY29tcG9uZW50c1xuXHRcdFx0LmZvckVhY2goY29tcG9uZW50ID0+IHRoaXMubG9jYXRvci5yZWdpc3Rlckluc3RhbmNlKCdjb21wb25lbnQnLCBjb21wb25lbnQpKTtcblxuXHRcdHRoaXMuX3JvdXRlciA9IHRoaXMubG9jYXRvci5yZXNvbHZlKCdyZXF1ZXN0Um91dGVyJyk7XG5cdH1cblxuXHQvKipcblx0ICogU3RhcnRzIENhdGJlcnJ5IGFwcGxpY2F0aW9uIHdoZW4gRE9NIGlzIHJlYWR5LlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSBmb3Igbm90aGluZy5cblx0ICovXG5cdHN0YXJ0V2hlblJlYWR5KCkge1xuXHRcdGlmICh3aW5kb3cuY2F0YmVycnkpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuXHRcdFx0d2luZG93LmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dGhpcy53cmFwRG9jdW1lbnQoKTtcblx0XHRcdFx0XHR3aW5kb3cuY2F0YmVycnkgPSB0aGlzO1xuXHRcdFx0XHRcdGZ1bGZpbGwoKTtcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdHJlamVjdChlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDYXRiZXJyeTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgQ29va2llV3JhcHBlckJhc2UgPSByZXF1aXJlKCcuLi9saWIvYmFzZS9Db29raWVXcmFwcGVyQmFzZScpO1xuXG5jbGFzcyBDb29raWVXcmFwcGVyIGV4dGVuZHMgQ29va2llV3JhcHBlckJhc2Uge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBicm93c2VyIGNvb2tpZSB3cmFwcGVyLlxuXHQgKiBAcGFyYW0ge1NlcnZpY2VMb2NhdG9yfSBsb2NhdG9yIFRoZSBzZXJ2aWNlIGxvY2F0b3IgZm9yIHJlc29sdmluZyBkZXBlbmRlbmNpZXMuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihsb2NhdG9yKSB7XG5cdFx0c3VwZXIoKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgYnJvd3NlciB3aW5kb3cuXG5cdFx0ICogQHR5cGUge1dpbmRvd31cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX3dpbmRvdyA9IGxvY2F0b3IucmVzb2x2ZSgnd2luZG93Jyk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBjdXJyZW50IGNvb2tpZSBzdHJpbmcuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IENvb2tpZSBzdHJpbmcuXG5cdCAqL1xuXHRnZXRDb29raWVTdHJpbmcoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3dpbmRvdy5kb2N1bWVudC5jb29raWUgP1xuXHRcdFx0dGhpcy5fd2luZG93LmRvY3VtZW50LmNvb2tpZS50b1N0cmluZygpIDpcblx0XHRcdCcnO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgY29va2llIHRvIHRoaXMgd3JhcHBlci5cblx0ICogQHBhcmFtIHtPYmplY3R9IGNvb2tpZVNldHVwIENvb2tpZSBzZXR1cCBvYmplY3QuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjb29raWVTZXR1cC5rZXkgQ29va2llIGtleS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGNvb2tpZVNldHVwLnZhbHVlIENvb2tpZSB2YWx1ZS5cblx0ICogQHBhcmFtIHtudW1iZXI/fSBjb29raWVTZXR1cC5tYXhBZ2UgTWF4IGNvb2tpZSBhZ2UgaW4gc2Vjb25kcy5cblx0ICogQHBhcmFtIHtEYXRlP30gY29va2llU2V0dXAuZXhwaXJlcyBFeHBpcmUgZGF0ZS5cblx0ICogQHBhcmFtIHtzdHJpbmc/fSBjb29raWVTZXR1cC5wYXRoIFVSSSBwYXRoIGZvciBjb29raWUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nP30gY29va2llU2V0dXAuZG9tYWluIENvb2tpZSBkb21haW4uXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbj99IGNvb2tpZVNldHVwLnNlY3VyZSBJcyBjb29raWUgc2VjdXJlZC5cblx0ICogQHBhcmFtIHtib29sZWFuP30gY29va2llU2V0dXAuaHR0cE9ubHkgSXMgY29va2llIEhUVFAgb25seS5cblx0ICogQHJldHVybnMge3N0cmluZ30gQ29va2llIHNldHVwIHN0cmluZy5cblx0ICovXG5cdHNldChjb29raWVTZXR1cCkge1xuXHRcdGNvbnN0IGNvb2tpZSA9IHRoaXMuX2NvbnZlcnRUb0Nvb2tpZVNldHVwKGNvb2tpZVNldHVwKTtcblx0XHR0aGlzLl93aW5kb3cuZG9jdW1lbnQuY29va2llID0gY29va2llO1xuXHRcdHJldHVybiBjb29raWU7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb29raWVXcmFwcGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBtb3JwaGRvbSA9IHJlcXVpcmUoJ21vcnBoZG9tJyk7XG5jb25zdCB1dWlkID0gcmVxdWlyZSgndXVpZCcpO1xuY29uc3QgZXJyb3JIZWxwZXIgPSByZXF1aXJlKCcuLi9saWIvaGVscGVycy9lcnJvckhlbHBlcicpO1xuY29uc3QgbW9kdWxlSGVscGVyID0gcmVxdWlyZSgnLi4vbGliL2hlbHBlcnMvbW9kdWxlSGVscGVyJyk7XG5jb25zdCBoclRpbWVIZWxwZXIgPSByZXF1aXJlKCcuLi9saWIvaGVscGVycy9oclRpbWVIZWxwZXInKTtcbmNvbnN0IERvY3VtZW50UmVuZGVyZXJCYXNlID0gcmVxdWlyZSgnLi4vbGliL2Jhc2UvRG9jdW1lbnRSZW5kZXJlckJhc2UnKTtcblxuY29uc3QgU1BFQ0lBTF9JRFMgPSB7XG5cdCQkaGVhZDogJyQkaGVhZCcsXG5cdCQkZG9jdW1lbnQ6ICckJGRvY3VtZW50J1xufTtcbmNvbnN0IFRBR19OQU1FUyA9IHtcblx0SEVBRDogJ0hFQUQnLFxuXHRTVFlMRTogJ1NUWUxFJyxcblx0U0NSSVBUOiAnU0NSSVBUJyxcblx0TElOSzogJ0xJTksnXG59O1xuXG4vLyBodHRwOi8vd3d3LnczLm9yZy9UUi8yMDE1L1dELXVpZXZlbnRzLTIwMTUwMzE5LyNldmVudC10eXBlcy1saXN0XG5jb25zdCBOT05fQlVCQkxJTkdfRVZFTlRTID0ge1xuXHRhYm9ydDogdHJ1ZSxcblx0Ymx1cjogdHJ1ZSxcblx0ZXJyb3I6IHRydWUsXG5cdGZvY3VzOiB0cnVlLFxuXHRsb2FkOiB0cnVlLFxuXHRtb3VzZWVudGVyOiB0cnVlLFxuXHRtb3VzZWxlYXZlOiB0cnVlLFxuXHRyZXNpemU6IHRydWUsXG5cdHVubG9hZDogdHJ1ZVxufTtcblxuY2xhc3MgRG9jdW1lbnRSZW5kZXJlciBleHRlbmRzIERvY3VtZW50UmVuZGVyZXJCYXNlIHtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgZG9jdW1lbnQgcmVuZGVyZXIuXG5cdCAqIEBwYXJhbSB7U2VydmljZUxvY2F0b3J9IGxvY2F0b3IgTG9jYXRvciBmb3IgcmVzb2x2aW5nIGRlcGVuZGVuY2llcy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGxvY2F0b3IpIHtcblx0XHRzdXBlcihsb2NhdG9yKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgc2V0IG9mIGNvbXBvbmVudCBpbnN0YW5jZXMgYnkgdW5pcXVlIGtleXMuXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX2NvbXBvbmVudEluc3RhbmNlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHNldCBvZiBjb21wb25lbnQgZWxlbWVudHMgYnkgdW5pcXVlIGtleXMuXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX2NvbXBvbmVudEVsZW1lbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgc2V0IG9mIGNvbXBvbmVudCBiaW5kaW5ncyBieSB1bmlxdWUga2V5cy5cblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fY29tcG9uZW50QmluZGluZ3MgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBzZXQgb2YgY2hhbmdlZCBzdG9yZXMuXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX2N1cnJlbnRDaGFuZ2VkU3RvcmVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgYnJvd3NlcidzIHdpbmRvdy5cblx0XHQgKi9cblx0XHR0aGlzLl93aW5kb3cgPSBsb2NhdG9yLnJlc29sdmUoJ3dpbmRvdycpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBhcHBsaWNhdGlvbiBjb25maWcuXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX2NvbmZpZyA9IGxvY2F0b3IucmVzb2x2ZSgnY29uZmlnJyk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHN0b3JlIGRpc3BhdGNoZXIuXG5cdFx0ICogQHR5cGUge1N0b3JlRGlzcGF0Y2hlcn1cblx0XHQgKiBAcHJvdGVjdGVkXG5cdFx0ICovXG5cdFx0dGhpcy5fc3RvcmVEaXNwYXRjaGVyID0gbG9jYXRvci5yZXNvbHZlKCdzdG9yZURpc3BhdGNoZXInKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgcHJvbWlzZSBmb3IgcmVuZGVyZWQgcGFnZS5cblx0XHQgKiBAdHlwZSB7UHJvbWlzZX1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX3JlbmRlcmVkUHJvbWlzZSA9IG51bGw7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHN0YXRlIG9mIHVwZGF0aW5nIGNvbXBvbmVudHMuXG5cdFx0ICogQHR5cGUge2Jvb2xlYW59XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9pc1VwZGF0aW5nID0gZmFsc2U7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IGF3YWl0aW5nIHJvdXRpbmcuXG5cdFx0ICogQHR5cGUge3tzdGF0ZTogT2JqZWN0LCByb3V0aW5nQ29udGV4dDogT2JqZWN0fX1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX2F3YWl0aW5nUm91dGluZyA9IG51bGw7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHJvdXRpbmcgY29udGV4dC5cblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fY3VycmVudFJvdXRpbmdDb250ZXh0ID0gbnVsbDtcblxuXHRcdHRoaXMuX2V2ZW50QnVzLm9uKCdzdG9yZUNoYW5nZWQnLCBzdG9yZU5hbWUgPT4ge1xuXHRcdFx0dGhpcy5fY3VycmVudENoYW5nZWRTdG9yZXNbc3RvcmVOYW1lXSA9IHRydWU7XG5cdFx0XHRpZiAodGhpcy5faXNTdGF0ZUNoYW5naW5nKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3VwZGF0ZVN0b3JlQ29tcG9uZW50cygpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIGluaXRpYWwgc3RhdGUgb2YgdGhlIGFwcGxpY2F0aW9uLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc3RhdGUgTmV3IHN0YXRlIG9mIHRoZSBhcHBsaWNhdGlvbi5cblx0ICogQHBhcmFtIHtPYmplY3R9IHJvdXRpbmdDb250ZXh0IFJvdXRpbmcgY29udGV4dC5cblx0ICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgZm9yIG5vdGhpbmcuXG5cdCAqL1xuXHRpbml0V2l0aFN0YXRlKHN0YXRlLCByb3V0aW5nQ29udGV4dCkge1xuXHRcdHJldHVybiB0aGlzLl9nZXRQcm9taXNlRm9yUmVhZHlTdGF0ZSgpXG5cdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdHRoaXMuX2N1cnJlbnRSb3V0aW5nQ29udGV4dCA9IHJvdXRpbmdDb250ZXh0O1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fc3RvcmVEaXNwYXRjaGVyLnNldFN0YXRlKHN0YXRlLCByb3V0aW5nQ29udGV4dCk7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRjb25zdCBjb21wb25lbnRzID0gdGhpcy5fY29tcG9uZW50TG9hZGVyLmdldENvbXBvbmVudHNCeU5hbWVzKCk7XG5cdFx0XHRcdGNvbnN0IGRvY3VtZW50RWxlbWVudCA9IHRoaXMuX3dpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cdFx0XHRcdGNvbnN0IGFjdGlvbiA9IGVsZW1lbnQgPT4gdGhpcy5faW5pdGlhbGl6ZUNvbXBvbmVudChlbGVtZW50LCBjb21wb25lbnRzKTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3RyYXZlcnNlQ29tcG9uZW50cyhbZG9jdW1lbnRFbGVtZW50XSwgY29tcG9uZW50cywgYWN0aW9uKTtcblx0XHRcdH0pXG5cdFx0XHQudGhlbigoKSA9PiB0aGlzLl9ldmVudEJ1cy5lbWl0KFxuXHRcdFx0XHQnZG9jdW1lbnRSZW5kZXJlZCcsIHRoaXMuX2N1cnJlbnRSb3V0aW5nQ29udGV4dFxuXHRcdFx0KSk7XG5cdH1cblxuXHQvKipcblx0ICogUmVuZGVycyBhIG5ldyBzdGF0ZSBvZiB0aGUgYXBwbGljYXRpb24uXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZSBOZXcgc3RhdGUgb2YgdGhlIGFwcGxpY2F0aW9uLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcm91dGluZ0NvbnRleHQgUm91dGluZyBjb250ZXh0LlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSBmb3Igbm90aGluZy5cblx0ICovXG5cdHJlbmRlcihzdGF0ZSwgcm91dGluZ0NvbnRleHQpIHtcblx0XHR0aGlzLl9hd2FpdGluZ1JvdXRpbmcgPSB7XG5cdFx0XHRzdGF0ZSxcblx0XHRcdHJvdXRpbmdDb250ZXh0XG5cdFx0fTtcblx0XHRpZiAodGhpcy5faXNTdGF0ZUNoYW5naW5nKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fcmVuZGVyZWRQcm9taXNlO1xuXHRcdH1cblxuXHRcdC8vIHdlIHNob3VsZCBzZXQgdGhpcyBmbGFnIHRvIGF2b2lkIFwic3RvcmVDaGFuZ2VkXCJcblx0XHQvLyBldmVudCBoYW5kbGluZyBmb3Igbm93XG5cdFx0dGhpcy5faXNTdGF0ZUNoYW5naW5nID0gdHJ1ZTtcblxuXHRcdHRoaXMuX3JlbmRlcmVkUHJvbWlzZSA9IHRoaXMuX2dldFByb21pc2VGb3JSZWFkeVN0YXRlKClcblx0XHRcdC8vIGFuZCB0aGVuIHdlIHVwZGF0ZSBhbGwgY29tcG9uZW50cyBvZiB0aGVzZSBzdG9yZXMgaW4gYSBiYXRjaC5cblx0XHRcdC50aGVuKCgpID0+IHRoaXMuX3VwZGF0ZVN0b3JlQ29tcG9uZW50cygpKVxuXHRcdFx0LmNhdGNoKHJlYXNvbiA9PiB0aGlzLl9ldmVudEJ1cy5lbWl0KCdlcnJvcicsIHJlYXNvbikpXG5cdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdHRoaXMuX2lzU3RhdGVDaGFuZ2luZyA9IGZhbHNlO1xuXHRcdFx0fSk7XG5cblx0XHRyZXR1cm4gdGhpcy5fcmVuZGVyZWRQcm9taXNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbmRlcnMgYSBjb21wb25lbnQgaW50byB0aGUgSFRNTCBlbGVtZW50LlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgSFRNTCBlbGVtZW50IG9mIHRoZSBjb21wb25lbnQuXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gcmVuZGVyaW5nQ29udGV4dCBSZW5kZXJpbmcgY29udGV4dCBmb3IgZ3JvdXAgcmVuZGVyaW5nLlxuXHQgKi9cblx0cmVuZGVyQ29tcG9uZW50KGVsZW1lbnQsIHJlbmRlcmluZ0NvbnRleHQpIHtcblx0XHRyZXR1cm4gdGhpcy5fZ2V0UHJvbWlzZUZvclJlYWR5U3RhdGUoKVxuXHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRjb25zdCBpZCA9IHRoaXMuX2dldElkKGVsZW1lbnQpO1xuXHRcdFx0XHRjb25zdCBjb21wb25lbnROYW1lID0gbW9kdWxlSGVscGVyLmdldE9yaWdpbmFsQ29tcG9uZW50TmFtZShlbGVtZW50LnRhZ05hbWUpO1xuXG5cdFx0XHRcdGlmICghcmVuZGVyaW5nQ29udGV4dCkge1xuXHRcdFx0XHRcdHJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLl9jcmVhdGVSZW5kZXJpbmdDb250ZXh0KFtdKTtcblx0XHRcdFx0XHRyZW5kZXJpbmdDb250ZXh0LnJvb3RJZHNbaWRdID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IGhhZENoaWxkcmVuID0gKGVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoID4gMCk7XG5cdFx0XHRcdGNvbnN0IGNvbXBvbmVudCA9IHJlbmRlcmluZ0NvbnRleHQuY29tcG9uZW50c1tjb21wb25lbnROYW1lXTtcblx0XHRcdFx0aWYgKCFjb21wb25lbnQpIHtcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlbmRlcmluZ0NvbnRleHQucmVuZGVyZWRJZHNbaWRdID0gdHJ1ZTtcblxuXHRcdFx0XHRsZXQgaW5zdGFuY2UgPSB0aGlzLl9jb21wb25lbnRJbnN0YW5jZXNbaWRdO1xuXHRcdFx0XHRpZiAoIWluc3RhbmNlKSB7XG5cdFx0XHRcdFx0Y29tcG9uZW50LmNvbnN0cnVjdG9yLnByb3RvdHlwZS4kY29udGV4dCA9XG5cdFx0XHRcdFx0XHR0aGlzLl9nZXRDb21wb25lbnRDb250ZXh0KGNvbXBvbmVudCwgZWxlbWVudCk7XG5cdFx0XHRcdFx0aW5zdGFuY2UgPSBuZXcgY29tcG9uZW50LmNvbnN0cnVjdG9yKHRoaXMuX3NlcnZpY2VMb2NhdG9yKTtcblx0XHRcdFx0XHRpbnN0YW5jZS4kY29udGV4dCA9IGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUuJGNvbnRleHQ7XG5cdFx0XHRcdFx0dGhpcy5fY29tcG9uZW50SW5zdGFuY2VzW2lkXSA9IGluc3RhbmNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgZXZlbnRBcmdzID0ge1xuXHRcdFx0XHRcdG5hbWU6IGNvbXBvbmVudE5hbWUsXG5cdFx0XHRcdFx0Y29udGV4dDogaW5zdGFuY2UuJGNvbnRleHRcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR0aGlzLl9jb21wb25lbnRFbGVtZW50c1tpZF0gPSBlbGVtZW50O1xuXG5cdFx0XHRcdGNvbnN0IHN0YXJ0VGltZSA9IGhyVGltZUhlbHBlci5nZXQoKTtcblx0XHRcdFx0dGhpcy5fZXZlbnRCdXMuZW1pdCgnY29tcG9uZW50UmVuZGVyJywgZXZlbnRBcmdzKTtcblxuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcblx0XHRcdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0XHQvLyB3ZSBuZWVkIHVuYmluZCB0aGUgd2hvbGUgaGllcmFyY2h5IG9ubHkgYXRcblx0XHRcdFx0XHRcdC8vIHRoZSBiZWdpbm5pbmcgYW5kIG5vdCBmb3IgbmV3IGVsZW1lbnRzXG5cdFx0XHRcdFx0XHRpZiAoIShpZCBpbiByZW5kZXJpbmdDb250ZXh0LnJvb3RJZHMpIHx8ICFoYWRDaGlsZHJlbikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLl91bmJpbmRBbGwoZWxlbWVudCwgcmVuZGVyaW5nQ29udGV4dCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuY2F0Y2gocmVhc29uID0+IHRoaXMuX2V2ZW50QnVzLmVtaXQoJ2Vycm9yJywgcmVhc29uKSlcblx0XHRcdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCByZW5kZXJNZXRob2QgPSBtb2R1bGVIZWxwZXIuZ2V0TWV0aG9kVG9JbnZva2UoaW5zdGFuY2UsICdyZW5kZXInKTtcblx0XHRcdFx0XHRcdHJldHVybiBtb2R1bGVIZWxwZXIuZ2V0U2FmZVByb21pc2UocmVuZGVyTWV0aG9kKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC50aGVuKGRhdGFDb250ZXh0ID0+IGNvbXBvbmVudC50ZW1wbGF0ZS5yZW5kZXIoZGF0YUNvbnRleHQpKVxuXHRcdFx0XHRcdC5jYXRjaChyZWFzb24gPT4gdGhpcy5faGFuZGxlUmVuZGVyRXJyb3IoZWxlbWVudCwgY29tcG9uZW50LCByZWFzb24pKVxuXHRcdFx0XHRcdC50aGVuKGh0bWwgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgaXNIZWFkID0gZWxlbWVudC50YWdOYW1lID09PSBUQUdfTkFNRVMuSEVBRDtcblx0XHRcdFx0XHRcdGlmIChodG1sID09PSAnJyAmJiBpc0hlYWQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjb25zdCB0bXBFbGVtZW50ID0gZWxlbWVudC5jbG9uZU5vZGUoZmFsc2UpO1xuXHRcdFx0XHRcdFx0dG1wRWxlbWVudC5pbm5lckhUTUwgPSBodG1sO1xuXG5cdFx0XHRcdFx0XHRpZiAoaXNIZWFkKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX21lcmdlSGVhZChlbGVtZW50LCB0bXBFbGVtZW50KTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRtb3JwaGRvbShlbGVtZW50LCB0bXBFbGVtZW50LCB7XG5cdFx0XHRcdFx0XHRcdG9uQmVmb3JlRWxDaGlsZHJlblVwZGF0ZWQ6IGZvdW5kRWxlbWVudCA9PlxuXHRcdFx0XHRcdFx0XHRcdGZvdW5kRWxlbWVudCA9PT0gZWxlbWVudCB8fCAhdGhpcy5faXNDb21wb25lbnRFbGVtZW50KFxuXHRcdFx0XHRcdFx0XHRcdFx0cmVuZGVyaW5nQ29udGV4dC5jb21wb25lbnRzLCBmb3VuZEVsZW1lbnRcblx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgcHJvbWlzZXMgPSB0aGlzLl9maW5kTmVzdGVkQ29tcG9uZW50cyhcblx0XHRcdFx0XHRcdFx0ZWxlbWVudCwgcmVuZGVyaW5nQ29udGV4dC5jb21wb25lbnRzXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdC5tYXAoY2hpbGQgPT4gdGhpcy5yZW5kZXJDb21wb25lbnQoY2hpbGQsIHJlbmRlcmluZ0NvbnRleHQpKTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0XHRcdGV2ZW50QXJncy5oclRpbWUgPSBoclRpbWVIZWxwZXIuZ2V0KHN0YXJ0VGltZSk7XG5cdFx0XHRcdFx0XHRldmVudEFyZ3MudGltZSA9IGhyVGltZUhlbHBlci50b01pbGxpc2Vjb25kcyhldmVudEFyZ3MuaHJUaW1lKTtcblx0XHRcdFx0XHRcdHRoaXMuX2V2ZW50QnVzLmVtaXQoJ2NvbXBvbmVudFJlbmRlcmVkJywgZXZlbnRBcmdzKTtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLl9iaW5kQ29tcG9uZW50KGVsZW1lbnQpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdFx0Ly8gY29sbGVjdGluZyBnYXJiYWdlIG9ubHkgd2hlblxuXHRcdFx0XHRcdFx0Ly8gdGhlIGVudGlyZSByZW5kZXJpbmcgaXMgZmluaXNoZWRcblx0XHRcdFx0XHRcdGlmICghKGlkIGluIHJlbmRlcmluZ0NvbnRleHQucm9vdElkcykgfHwgIWhhZENoaWxkcmVuKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRoaXMuX2NvbGxlY3RSZW5kZXJpbmdHYXJiYWdlKHJlbmRlcmluZ0NvbnRleHQpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKHJlYXNvbiA9PiB0aGlzLl9ldmVudEJ1cy5lbWl0KCdlcnJvcicsIHJlYXNvbikpO1xuXHRcdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBhIGNvbXBvbmVudCBpbnN0YW5jZSBieSBJRC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGlkIENvbXBvbmVudCdzIGVsZW1lbnQgSUQuXG5cdCAqIEByZXR1cm5zIHtPYmplY3R8bnVsbH0gQ29tcG9uZW50IGluc3RhbmNlLlxuXHQgKi9cblx0Z2V0Q29tcG9uZW50QnlJZChpZCkge1xuXHRcdGNvbnN0IGVsZW1lbnQgPSB0aGlzLl93aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXHRcdHJldHVybiB0aGlzLmdldENvbXBvbmVudEJ5RWxlbWVudChlbGVtZW50KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEb2VzIHF1ZXJ5IGZvciBhIGNvbXBvbmVudCBieSB0aGUgc2VsZWN0b3IuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciBTZWxlY3RvciBmb3IgdGhlIHF1ZXJ5LlxuXHQgKiBAcGFyYW0ge09iamVjdD99IHBhcmVudENvbXBvbmVudCBQYXJlbnQgY29tcG9uZW50IG9iamVjdC5cblx0ICogQHJldHVybnMge09iamVjdH0gVGhlIGZvdW5kIGNvbXBvbmVudCBvYmplY3QuXG5cdCAqL1xuXHRxdWVyeUNvbXBvbmVudFNlbGVjdG9yKHNlbGVjdG9yLCBwYXJlbnRDb21wb25lbnQpIHtcblx0XHRjb25zdCBwYXJlbnQgPSB0aGlzLl9pc0NvbXBvbmVudE9iamVjdChwYXJlbnRDb21wb25lbnQpID9cblx0XHRcdHBhcmVudENvbXBvbmVudC4kY29udGV4dC5lbGVtZW50IDogdGhpcy5fd2luZG93LmRvY3VtZW50O1xuXHRcdHJldHVybiB0aGlzLmdldENvbXBvbmVudEJ5RWxlbWVudChwYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERvZXMgcXVlcnkgZm9yIGFsbCBjb21wb25lbnRzIGJ5IHRoZSBzZWxlY3Rvci5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIFNlbGVjdG9yIGZvciB0aGUgcXVlcnkuXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gcGFyZW50Q29tcG9uZW50IFBhcmVudCBjb21wb25lbnQgb2JqZWN0LlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBmb3VuZCBjb21wb25lbnQgb2JqZWN0IGxpc3QuXG5cdCAqL1xuXHRxdWVyeUNvbXBvbmVudFNlbGVjdG9yQWxsKHNlbGVjdG9yLCBwYXJlbnRDb21wb25lbnQpIHtcblx0XHRjb25zdCBwYXJlbnQgPSB0aGlzLl9pc0NvbXBvbmVudE9iamVjdChwYXJlbnRDb21wb25lbnQpID9cblx0XHRcdHBhcmVudENvbXBvbmVudC4kY29udGV4dC5lbGVtZW50IDogdGhpcy5fd2luZG93LmRvY3VtZW50O1xuXHRcdHJldHVybiB0aGlzLl9tYXBFbGVtZW50c1RvQ29tcG9uZW50cyhwYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgYWxsIGNvbXBvbmVudHMgYnkgdGhlIHRhZyBuYW1lLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGFnTmFtZSBUYWcgbmFtZSBvZiB0aGUgY29tcG9uZW50cy5cblx0ICogQHBhcmFtIHtPYmplY3Q/fSBwYXJlbnRDb21wb25lbnQgUGFyZW50IGNvbXBvbmVudCBvYmplY3QuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGZvdW5kIGNvbXBvbmVudCBvYmplY3QgbGlzdC5cblx0ICovXG5cdGdldENvbXBvbmVudHNCeVRhZ05hbWUodGFnTmFtZSwgcGFyZW50Q29tcG9uZW50KSB7XG5cdFx0Y29uc3QgcGFyZW50ID0gdGhpcy5faXNDb21wb25lbnRPYmplY3QocGFyZW50Q29tcG9uZW50KSA/XG5cdFx0XHRwYXJlbnRDb21wb25lbnQuJGNvbnRleHQuZWxlbWVudCA6IHRoaXMuX3dpbmRvdy5kb2N1bWVudDtcblx0XHRyZXR1cm4gdGhpcy5fbWFwRWxlbWVudHNUb0NvbXBvbmVudHMocGFyZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHRhZ05hbWUpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGFsbCBjb21wb25lbnRzIGJ5IHRoZSBjbGFzcyBuYW1lLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIENsYXNzIG5hbWUgb2YgdGhlIGNvbXBvbmVudHMuXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gcGFyZW50Q29tcG9uZW50IFBhcmVudCBjb21wb25lbnQgb2JqZWN0LlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBmb3VuZCBjb21wb25lbnQgb2JqZWN0IGxpc3QuXG5cdCAqL1xuXHRnZXRDb21wb25lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lLCBwYXJlbnRDb21wb25lbnQpIHtcblx0XHRjb25zdCBwYXJlbnQgPSB0aGlzLl9pc0NvbXBvbmVudE9iamVjdChwYXJlbnRDb21wb25lbnQpID9cblx0XHRcdHBhcmVudENvbXBvbmVudC4kY29udGV4dC5lbGVtZW50IDogdGhpcy5fd2luZG93LmRvY3VtZW50O1xuXHRcdHJldHVybiB0aGlzLl9tYXBFbGVtZW50c1RvQ29tcG9uZW50cyhwYXJlbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc05hbWUpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGNvbXBvbmVudCBpbnN0YW5jZSBieSBhIERPTSBlbGVtZW50LlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgQ29tcG9uZW50J3MgRWxlbWVudC5cblx0ICogQHJldHVybnMge09iamVjdHxudWxsfSBDb21wb25lbnQgaW5zdGFuY2UuXG5cdCAqL1xuXHRnZXRDb21wb25lbnRCeUVsZW1lbnQoZWxlbWVudCkge1xuXHRcdGlmICghZWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHRcdGNvbnN0IGlkID0gZWxlbWVudFttb2R1bGVIZWxwZXIuQ09NUE9ORU5UX0lEXTtcblx0XHRpZiAoIWlkKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX2NvbXBvbmVudEluc3RhbmNlc1tpZF0gfHwgbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgdGhhdCBldmVyeSBpbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50IGhhcyBhbiBlbGVtZW50IG9uIHRoZSBwYWdlIGFuZFxuXHQgKiByZW1vdmVzIGFsbCByZWZlcmVuY2VzIHRvIHRob3NlIGNvbXBvbmVudHMgd2hpY2ggd2VyZSByZW1vdmVkIGZyb20gRE9NLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSBmb3Igbm90aGluZy5cblx0ICovXG5cdC8qIGVzbGludCBtYXgtbmVzdGVkLWNhbGxiYWNrczogMCAqL1xuXHRjb2xsZWN0R2FyYmFnZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5fZ2V0UHJvbWlzZUZvclJlYWR5U3RhdGUoKVxuXHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRjb25zdCBjb250ZXh0ID0ge1xuXHRcdFx0XHRcdHJvb3RzOiBbXSxcblx0XHRcdFx0XHRjb21wb25lbnRzOiB0aGlzLl9jb21wb25lbnRMb2FkZXIuZ2V0Q29tcG9uZW50c0J5TmFtZXMoKVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdE9iamVjdC5rZXlzKHRoaXMuX2NvbXBvbmVudEVsZW1lbnRzKVxuXHRcdFx0XHRcdC5mb3JFYWNoKGlkID0+IHtcblx0XHRcdFx0XHRcdC8vIHdlIHNob3VsZCBub3QgcmVtb3ZlIHNwZWNpYWwgZWxlbWVudHMgbGlrZSBIRUFEXG5cdFx0XHRcdFx0XHRpZiAoU1BFQ0lBTF9JRFMuaGFzT3duUHJvcGVydHkoaWQpKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0bGV0IGN1cnJlbnQgPSB0aGlzLl9jb21wb25lbnRFbGVtZW50c1tpZF07XG5cdFx0XHRcdFx0XHR3aGlsZSAoY3VycmVudCAhPT0gdGhpcy5fd2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuXHRcdFx0XHRcdFx0XHQvLyB0aGUgY29tcG9uZW50IGlzIHNpdHVhdGVkIGluIGEgZGV0YWNoZWQgRE9NIHN1YnRyZWVcblx0XHRcdFx0XHRcdFx0aWYgKGN1cnJlbnQucGFyZW50RWxlbWVudCA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnRleHQucm9vdHMucHVzaChjdXJyZW50KTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQvLyB0aGUgY29tcG9uZW50IGlzIGFub3RoZXIgY29tcG9uZW50J3MgZGVzY2VuZGFudFxuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy5faXNDb21wb25lbnRFbGVtZW50KGNvbnRleHQuY29tcG9uZW50cywgY3VycmVudC5wYXJlbnRFbGVtZW50KSkge1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudEVsZW1lbnQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuIHRoaXMuX3JlbW92ZURldGFjaGVkQ29tcG9uZW50cyhjb250ZXh0KTtcblx0XHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYW5kIHJlbmRlcnMgYSBjb21wb25lbnQgZWxlbWVudC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHRhZ05hbWUgTmFtZSBvZiB0aGUgSFRNTCB0YWcuXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gYXR0cmlidXRlcyBFbGVtZW50IGF0dHJpYnV0ZXMuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlPEVsZW1lbnQ+fSBQcm9taXNlIGZvciBIVE1MIGVsZW1lbnQgd2l0aCB0aGUgcmVuZGVyZWQgY29tcG9uZW50LlxuXHQgKi9cblx0Y3JlYXRlQ29tcG9uZW50KHRhZ05hbWUsIGF0dHJpYnV0ZXMpIHtcblx0XHRpZiAodHlwZW9mICh0YWdOYW1lKSAhPT0gJ3N0cmluZycpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChcblx0XHRcdFx0bmV3IEVycm9yKCdUaGUgdGFnIG5hbWUgbXVzdCBiZSBhIHN0cmluZycpXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRhdHRyaWJ1dGVzID0gYXR0cmlidXRlcyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdFx0cmV0dXJuIHRoaXMuX2dldFByb21pc2VGb3JSZWFkeVN0YXRlKClcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0Y29uc3QgY29tcG9uZW50cyA9IHRoaXMuX2NvbXBvbmVudExvYWRlci5nZXRDb21wb25lbnRzQnlOYW1lcygpO1xuXHRcdFx0XHRjb25zdCBjb21wb25lbnROYW1lID0gbW9kdWxlSGVscGVyLmdldE9yaWdpbmFsQ29tcG9uZW50TmFtZSh0YWdOYW1lKTtcblxuXHRcdFx0XHRpZiAobW9kdWxlSGVscGVyLmlzSGVhZENvbXBvbmVudChjb21wb25lbnROYW1lKSB8fFxuXHRcdFx0XHRcdG1vZHVsZUhlbHBlci5pc0RvY3VtZW50Q29tcG9uZW50KGNvbXBvbmVudE5hbWUpIHx8XG5cdFx0XHRcdFx0IShjb21wb25lbnROYW1lIGluIGNvbXBvbmVudHMpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihgQ29tcG9uZW50IGZvciB0YWcgXCIke3RhZ05hbWV9XCIgbm90IGZvdW5kYCkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3Qgc2FmZVRhZ05hbWUgPSBtb2R1bGVIZWxwZXIuZ2V0VGFnTmFtZUZvckNvbXBvbmVudE5hbWUoY29tcG9uZW50TmFtZSk7XG5cdFx0XHRcdGNvbnN0IGVsZW1lbnQgPSB0aGlzLl93aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudChzYWZlVGFnTmFtZSk7XG5cdFx0XHRcdE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpXG5cdFx0XHRcdFx0LmZvckVhY2goYXR0cmlidXRlTmFtZSA9PiBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdKSk7XG5cblx0XHRcdFx0cmV0dXJuIHRoaXMucmVuZGVyQ29tcG9uZW50KGVsZW1lbnQpXG5cdFx0XHRcdFx0LnRoZW4oKCkgPT4gZWxlbWVudCk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDbGVhcnMgYWxsIHJlZmVyZW5jZXMgdG8gcmVtb3ZlZCBjb21wb25lbnRzIGR1cmluZyB0aGUgcmVuZGVyaW5nIHByb2Nlc3MuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJpbmdDb250ZXh0IENvbnRleHQgb2YgcmVuZGVyaW5nLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2NvbGxlY3RSZW5kZXJpbmdHYXJiYWdlKHJlbmRlcmluZ0NvbnRleHQpIHtcblx0XHRPYmplY3Qua2V5cyhyZW5kZXJpbmdDb250ZXh0LnVuYm91bmRJZHMpXG5cdFx0XHQuZm9yRWFjaChpZCA9PiB7XG5cdFx0XHRcdC8vIHRoaXMgY29tcG9uZW50IGhhcyBiZWVuIHJlbmRlcmVkIGFnYWluIGFuZCB3ZSBkbyBub3QgbmVlZCB0b1xuXHRcdFx0XHQvLyByZW1vdmUgaXQuXG5cdFx0XHRcdGlmIChpZCBpbiByZW5kZXJpbmdDb250ZXh0LnJlbmRlcmVkSWRzKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5fcmVtb3ZlQ29tcG9uZW50QnlJZChpZCk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZW1vdmVzIGRldGFjaGVkIHN1YnRyZWVzIGZyb20gdGhlIGNvbXBvbmVudHMgc2V0LlxuXHQgKiBAcGFyYW0ge3tyb290czogQXJyYXksIGNvbXBvbmVudHM6IE9iamVjdH19IGNvbnRleHQgT3BlcmF0aW9uIGNvbnRleHQuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIGZvciBmaW5pc2hlZCByZW1vdmFsXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfcmVtb3ZlRGV0YWNoZWRDb21wb25lbnRzKGNvbnRleHQpIHtcblx0XHRpZiAoY29udGV4dC5yb290cy5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHR9XG5cdFx0Y29uc3Qgcm9vdCA9IGNvbnRleHQucm9vdHMucG9wKCk7XG5cdFx0cmV0dXJuIHRoaXMuX3RyYXZlcnNlQ29tcG9uZW50cyhbcm9vdF0sIGNvbnRleHQuY29tcG9uZW50cywgZWxlbWVudCA9PiB0aGlzLl9yZW1vdmVEZXRhY2hlZENvbXBvbmVudChlbGVtZW50KSlcblx0XHRcdC50aGVuKCgpID0+IHRoaXMuX3JlbW92ZURldGFjaGVkQ29tcG9uZW50cyhjb250ZXh0KSk7XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlcyBkZXRhY2hlZCBjb21wb25lbnQuXG5cdCAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IG9mIHRoZSBkZXRhY2hlZCBjb21wb25lbnQuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIGZvciB0aGUgcmVtb3ZlZCBjb21wb25lbnQuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfcmVtb3ZlRGV0YWNoZWRDb21wb25lbnQoZWxlbWVudCkge1xuXHRcdGNvbnN0IGlkID0gdGhpcy5fZ2V0SWQoZWxlbWVudCk7XG5cdFx0cmV0dXJuIHRoaXMuX3VuYmluZENvbXBvbmVudChlbGVtZW50KVxuXHRcdFx0LnRoZW4oKCkgPT4gdGhpcy5fcmVtb3ZlQ29tcG9uZW50QnlJZChpZCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVuYmluZHMgYWxsIGV2ZW50IGhhbmRsZXJzIGZyb20gdGhlIHNwZWNpZmllZCBjb21wb25lbnQgYW5kIGFsbCBpdCdzIGRlc2NlbmRhbnRzLlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgQ29tcG9uZW50IEhUTUwgZWxlbWVudC5cblx0ICogQHBhcmFtIHtPYmplY3R9IHJlbmRlcmluZ0NvbnRleHQgQ29udGV4dCBvZiByZW5kZXJpbmcuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIGZvciBub3RoaW5nLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X3VuYmluZEFsbChlbGVtZW50LCByZW5kZXJpbmdDb250ZXh0KSB7XG5cdFx0Y29uc3QgYWN0aW9uID0gaW5uZXJFbGVtZW50ID0+IHtcblx0XHRcdGNvbnN0IGlkID0gdGhpcy5fZ2V0SWQoaW5uZXJFbGVtZW50KTtcblx0XHRcdHJlbmRlcmluZ0NvbnRleHQudW5ib3VuZElkc1tpZF0gPSB0cnVlO1xuXHRcdFx0cmV0dXJuIHRoaXMuX3VuYmluZENvbXBvbmVudChpbm5lckVsZW1lbnQpO1xuXHRcdH07XG5cdFx0cmV0dXJuIHRoaXMuX3RyYXZlcnNlQ29tcG9uZW50cyhbZWxlbWVudF0sIHJlbmRlcmluZ0NvbnRleHQuY29tcG9uZW50cywgYWN0aW9uKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBVbmJpbmRzIGFsbCBldmVudCBoYW5kbGVycyBmcm9tIHRoZSBzcGVjaWZpZWQgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgQ29tcG9uZW50IEhUTUwgZWxlbWVudC5cblx0ICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgZm9yIG5vdGhpbmcuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfdW5iaW5kQ29tcG9uZW50KGVsZW1lbnQpIHtcblx0XHRjb25zdCBpZCA9IHRoaXMuX2dldElkKGVsZW1lbnQpO1xuXHRcdGNvbnN0IGluc3RhbmNlID0gdGhpcy5fY29tcG9uZW50SW5zdGFuY2VzW2lkXTtcblxuXHRcdGlmICghaW5zdGFuY2UpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHR9XG5cdFx0aWYgKGlkIGluIHRoaXMuX2NvbXBvbmVudEJpbmRpbmdzKSB7XG5cdFx0XHRPYmplY3Qua2V5cyh0aGlzLl9jb21wb25lbnRCaW5kaW5nc1tpZF0pXG5cdFx0XHRcdC5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG5cdFx0XHRcdFx0ZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFxuXHRcdFx0XHRcdFx0ZXZlbnROYW1lLFxuXHRcdFx0XHRcdFx0dGhpcy5fY29tcG9uZW50QmluZGluZ3NbaWRdW2V2ZW50TmFtZV0uaGFuZGxlcixcblx0XHRcdFx0XHRcdE5PTl9CVUJCTElOR19FVkVOVFMuaGFzT3duUHJvcGVydHkoZXZlbnROYW1lKVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0ZGVsZXRlIHRoaXMuX2NvbXBvbmVudEJpbmRpbmdzW2lkXTtcblx0XHR9XG5cblx0XHRjb25zdCB1bmJpbmRNZXRob2QgPSBtb2R1bGVIZWxwZXIuZ2V0TWV0aG9kVG9JbnZva2UoaW5zdGFuY2UsICd1bmJpbmQnKTtcblx0XHRyZXR1cm4gbW9kdWxlSGVscGVyLmdldFNhZmVQcm9taXNlKHVuYmluZE1ldGhvZClcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0dGhpcy5fZXZlbnRCdXMuZW1pdCgnY29tcG9uZW50VW5ib3VuZCcsIHtcblx0XHRcdFx0XHRlbGVtZW50LFxuXHRcdFx0XHRcdGlkOiBlbGVtZW50LmlkIHx8IG51bGxcblx0XHRcdFx0fSk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKHJlYXNvbiA9PiB0aGlzLl9ldmVudEJ1cy5lbWl0KCdlcnJvcicsIHJlYXNvbikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgYSBjb21wb25lbnQgZnJvbSB0aGUgY3VycmVudCBsaXN0LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gaWQgQ29tcG9uZW50J3MgSURcblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9yZW1vdmVDb21wb25lbnRCeUlkKGlkKSB7XG5cdFx0ZGVsZXRlIHRoaXMuX2NvbXBvbmVudEVsZW1lbnRzW2lkXTtcblx0XHRkZWxldGUgdGhpcy5fY29tcG9uZW50SW5zdGFuY2VzW2lkXTtcblx0XHRkZWxldGUgdGhpcy5fY29tcG9uZW50QmluZGluZ3NbaWRdO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJpbmRzIGFsbCByZXF1aXJlZCBldmVudCBoYW5kbGVycyB0byB0aGUgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgQ29tcG9uZW50J3MgSFRNTCBlbGVtZW50LlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSBmb3Igbm90aGluZy5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9iaW5kQ29tcG9uZW50KGVsZW1lbnQpIHtcblx0XHRjb25zdCBpZCA9IHRoaXMuX2dldElkKGVsZW1lbnQpO1xuXHRcdGNvbnN0IGluc3RhbmNlID0gdGhpcy5fY29tcG9uZW50SW5zdGFuY2VzW2lkXTtcblx0XHRpZiAoIWluc3RhbmNlKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgYmluZE1ldGhvZCA9IG1vZHVsZUhlbHBlci5nZXRNZXRob2RUb0ludm9rZShpbnN0YW5jZSwgJ2JpbmQnKTtcblx0XHRyZXR1cm4gbW9kdWxlSGVscGVyLmdldFNhZmVQcm9taXNlKGJpbmRNZXRob2QpXG5cdFx0XHQudGhlbihiaW5kaW5ncyA9PiB7XG5cdFx0XHRcdGlmICghYmluZGluZ3MgfHwgdHlwZW9mIChiaW5kaW5ncykgIT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdFx0dGhpcy5fZXZlbnRCdXMuZW1pdCgnY29tcG9uZW50Qm91bmQnLCB7XG5cdFx0XHRcdFx0XHRlbGVtZW50LFxuXHRcdFx0XHRcdFx0aWQ6IGVsZW1lbnQuaWQgfHwgbnVsbFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9jb21wb25lbnRCaW5kaW5nc1tpZF0gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRcdFx0XHRPYmplY3Qua2V5cyhiaW5kaW5ncylcblx0XHRcdFx0XHQuZm9yRWFjaChldmVudE5hbWUgPT4ge1xuXHRcdFx0XHRcdFx0ZXZlbnROYW1lID0gZXZlbnROYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdFx0XHRpZiAoZXZlbnROYW1lIGluIHRoaXMuX2NvbXBvbmVudEJpbmRpbmdzW2lkXSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjb25zdCBzZWxlY3RvckhhbmRsZXJzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0XHRcdFx0XHRcdE9iamVjdC5rZXlzKGJpbmRpbmdzW2V2ZW50TmFtZV0pXG5cdFx0XHRcdFx0XHRcdC5mb3JFYWNoKHNlbGVjdG9yID0+IHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBoYW5kbGVyID0gYmluZGluZ3NbZXZlbnROYW1lXVtzZWxlY3Rvcl07XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiAoaGFuZGxlcikgIT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0c2VsZWN0b3JIYW5kbGVyc1tzZWxlY3Rvcl0gPSBoYW5kbGVyLmJpbmQoaW5zdGFuY2UpO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdHRoaXMuX2NvbXBvbmVudEJpbmRpbmdzW2lkXVtldmVudE5hbWVdID0ge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVyOiB0aGlzLl9jcmVhdGVCaW5kaW5nSGFuZGxlcihlbGVtZW50LCBzZWxlY3RvckhhbmRsZXJzKSxcblx0XHRcdFx0XHRcdFx0c2VsZWN0b3JIYW5kbGVyc1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcblx0XHRcdFx0XHRcdFx0ZXZlbnROYW1lLFxuXHRcdFx0XHRcdFx0XHR0aGlzLl9jb21wb25lbnRCaW5kaW5nc1tpZF1bZXZlbnROYW1lXS5oYW5kbGVyLFxuXHRcdFx0XHRcdFx0XHROT05fQlVCQkxJTkdfRVZFTlRTLmhhc093blByb3BlcnR5KGV2ZW50TmFtZSlcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMuX2V2ZW50QnVzLmVtaXQoJ2NvbXBvbmVudEJvdW5kJywge1xuXHRcdFx0XHRcdGVsZW1lbnQsXG5cdFx0XHRcdFx0aWQ6IGVsZW1lbnQuaWQgfHwgbnVsbFxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSB1bml2ZXJzYWwgZXZlbnQgaGFuZGxlciBmb3IgZGVsZWdhdGVkIGV2ZW50cy5cblx0ICogQHBhcmFtIHtFbGVtZW50fSBjb21wb25lbnRSb290IFJvb3QgZWxlbWVudCBvZiB0aGUgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc2VsZWN0b3JIYW5kbGVycyBNYXAgb2YgZXZlbnQgaGFuZGxlcnMgYnkgdGhlaXIgQ1NTIHNlbGVjdG9ycy5cblx0ICogQHJldHVybnMge0Z1bmN0aW9ufSBVbml2ZXJzYWwgZXZlbnQgaGFuZGxlciBmb3IgZGVsZWdhdGVkIGV2ZW50cy5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9jcmVhdGVCaW5kaW5nSGFuZGxlcihjb21wb25lbnRSb290LCBzZWxlY3RvckhhbmRsZXJzKSB7XG5cdFx0Y29uc3Qgc2VsZWN0b3JzID0gT2JqZWN0LmtleXMoc2VsZWN0b3JIYW5kbGVycyk7XG5cdFx0cmV0dXJuIGV2ZW50ID0+IHtcblx0XHRcdHZhciBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuXHRcdFx0Y29uc3QgZGlzcGF0Y2hlZEV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQoZXZlbnQsICgpID0+IGVsZW1lbnQpO1xuXHRcdFx0dmFyIHRhcmdldE1hdGNoZXMgPSB0aGlzLl9nZXRNYXRjaGVzTWV0aG9kKGVsZW1lbnQpO1xuXHRcdFx0dmFyIGlzSGFuZGxlZCA9IHNlbGVjdG9ycy5zb21lKHNlbGVjdG9yID0+IHtcblx0XHRcdFx0aWYgKHRhcmdldE1hdGNoZXMoc2VsZWN0b3IpKSB7XG5cdFx0XHRcdFx0c2VsZWN0b3JIYW5kbGVyc1tzZWxlY3Rvcl0oZGlzcGF0Y2hlZEV2ZW50KTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKGlzSGFuZGxlZCB8fCAhZXZlbnQuYnViYmxlcykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIHdlIGNhbid0IHVzZSBwYXJlbnRFbGVtZW50IGhlcmUsIGJlY2F1c2Vcblx0XHRcdC8vIGludGVybmFsIFNWRyBlbGVtZW50cyBkb24ndCBoYXZlIHRoaXMgcHJvcGVydHkgaW4gSUVcblx0XHRcdHdoaWxlIChlbGVtZW50LnBhcmVudE5vZGUgJiYgZWxlbWVudCAhPT0gY29tcG9uZW50Um9vdCkge1xuXHRcdFx0XHRlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuXHRcdFx0XHR0YXJnZXRNYXRjaGVzID0gdGhpcy5fZ2V0TWF0Y2hlc01ldGhvZChlbGVtZW50KTtcblx0XHRcdFx0aXNIYW5kbGVkID0gdGhpcy5fdHJ5RGlzcGF0Y2hFdmVudChcblx0XHRcdFx0XHRzZWxlY3RvcnMsIHRhcmdldE1hdGNoZXMsIHNlbGVjdG9ySGFuZGxlcnMsIGRpc3BhdGNoZWRFdmVudFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAoaXNIYW5kbGVkKSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIFRyaWVzIHRvIGRpc3BhdGNoIGFuIGV2ZW50LlxuXHQgKiBAcGFyYW0ge0FycmF5fSBzZWxlY3RvcnMgVGhlIGxpc3Qgb2Ygc3VwcG9ydGVkIHNlbGVjdG9ycy5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gbWF0Y2hQcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrIGlmIHNlbGVjdG9yIG1hdGNoZXMuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBoYW5kbGVycyBUaGUgc2V0IG9mIGhhbmRsZXJzIGZvciBldmVudHMuXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBET00gZXZlbnQgb2JqZWN0LlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X3RyeURpc3BhdGNoRXZlbnQoc2VsZWN0b3JzLCBtYXRjaFByZWRpY2F0ZSwgaGFuZGxlcnMsIGV2ZW50KSB7XG5cdFx0cmV0dXJuIHNlbGVjdG9ycy5zb21lKHNlbGVjdG9yID0+IHtcblx0XHRcdGlmICghbWF0Y2hQcmVkaWNhdGUoc2VsZWN0b3IpKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGhhbmRsZXJzW3NlbGVjdG9yXShldmVudCk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIGVsZW1lbnQgaXMgYSBjb21wb25lbnQuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnRzIEN1cnJlbnQgY29tcG9uZW50cy5cblx0ICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IERPTSBlbGVtZW50LlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2lzQ29tcG9uZW50RWxlbWVudChjb21wb25lbnRzLCBlbGVtZW50KSB7XG5cdFx0aWYgKCFtb2R1bGVIZWxwZXIuaXNDb21wb25lbnROb2RlKGVsZW1lbnQpKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiBtb2R1bGVIZWxwZXIuZ2V0T3JpZ2luYWxDb21wb25lbnROYW1lKGVsZW1lbnQubm9kZU5hbWUpIGluIGNvbXBvbmVudHM7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZSBzcGVjaWZpZWQgb2JqZWN0IGlzIGEgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBjb21wb25lbnQgb2JqZWN0LlxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9pc0NvbXBvbmVudE9iamVjdChvYmopIHtcblx0XHRyZXR1cm4gb2JqICYmIG9iai4kY29udGV4dCAmJlxuXHRcdFx0dHlwZW9mIChvYmouJGNvbnRleHQpID09PSAnb2JqZWN0JyAmJlxuXHRcdFx0b2JqLiRjb250ZXh0LmVsZW1lbnQgaW5zdGFuY2VvZiB0aGlzLl93aW5kb3cuRWxlbWVudDtcblx0fVxuXG5cdC8qKlxuXHQgKiBNYXBzIGZvdW5kIGVsZW1lbnRzIHRvIGNvbXBvbmVudCBvYmplY3RzIGZpbHRlcmluZyBub24tY29tcG9uZW50IGVsZW1lbnRzLlxuXHQgKiBAcGFyYW0ge0hUTUxDb2xsZWN0aW9ufE5vZGVMaXN0fSBlbGVtZW50cyBFbGVtZW50cyBjb2xsZWN0aW9uLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IEFycmF5IG9mIHRoZSBjb21wb25lbnQgb2JqZWN0cy5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9tYXBFbGVtZW50c1RvQ29tcG9uZW50cyhlbGVtZW50cykge1xuXHRcdGNvbnN0IHJlc3VsdHMgPSBbXTtcblx0XHRBcnJheS5wcm90b3R5cGUuZm9yRWFjaFxuXHRcdFx0LmNhbGwoZWxlbWVudHMsIGVsZW1lbnQgPT4ge1xuXHRcdFx0XHRjb25zdCBjb21wb25lbnQgPSB0aGlzLmdldENvbXBvbmVudEJ5RWxlbWVudChlbGVtZW50KTtcblx0XHRcdFx0aWYgKGNvbXBvbmVudCkge1xuXHRcdFx0XHRcdHJlc3VsdHMucHVzaChjb21wb25lbnQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fVxuXG5cdC8qKlxuXHQgKiBEb2VzIGFzeW5jaHJvbm91cyB0cmF2ZXJzYWwgdGhyb3VnaCB0aGUgY29tcG9uZW50cyBoaWVyYXJjaHkuXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGVsZW1lbnRzIEVsZW1lbnRzIHRvIHN0YXJ0IHRoZSBzZWFyY2guXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnRzIEN1cnJlbnQgc2V0IG9mIGNvbXBvbmVudHMuXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGFjdGlvbiBBY3Rpb24gZm9yIGV2ZXJ5IGNvbXBvbmVudC5cblx0ICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgZm9yIHRoZSBmaW5pc2hlZCB0cmF2ZXJzYWwuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfdHJhdmVyc2VDb21wb25lbnRzKGVsZW1lbnRzLCBjb21wb25lbnRzLCBhY3Rpb24pIHtcblx0XHRpZiAoZWxlbWVudHMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgcm9vdCA9IGVsZW1lbnRzLnNoaWZ0KCk7XG5cdFx0ZWxlbWVudHMgPSBlbGVtZW50cy5jb25jYXQodGhpcy5fZmluZE5lc3RlZENvbXBvbmVudHMocm9vdCwgY29tcG9uZW50cykpO1xuXHRcdHJldHVybiB0aGlzLl90cmF2ZXJzZUNvbXBvbmVudHMoZWxlbWVudHMsIGNvbXBvbmVudHMsIGFjdGlvbilcblx0XHRcdC50aGVuKCgpID0+IGFjdGlvbihyb290KSk7XG5cdH1cblxuXHQvKipcblx0ICogRmluZHMgYWxsIGRlc2NlbmRhbnQgY29tcG9uZW50cyBvZiB0aGUgc3BlY2lmaWVkIGNvbXBvbmVudCByb290LlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IHJvb3QgUm9vdCBjb21wb25lbnQncyBIVE1MIHJvb3QgdG8gYmVnaW4gc2VhcmNoIHdpdGguXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnRzIE1hcCBvZiBjb21wb25lbnRzIGJ5IHRoZWlyIG5hbWVzLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2ZpbmROZXN0ZWRDb21wb25lbnRzKHJvb3QsIGNvbXBvbmVudHMpIHtcblx0XHRjb25zdCBlbGVtZW50cyA9IFtdO1xuXHRcdGNvbnN0IHF1ZXVlID0gW3Jvb3RdO1xuXG5cdFx0Ly8gZG9lcyBicmVhZHRoLWZpcnN0IHNlYXJjaCBpbnNpZGUgdGhlIHJvb3QgZWxlbWVudFxuXHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRjb25zdCBjdXJyZW50Q2hpbGRyZW4gPSBxdWV1ZS5zaGlmdCgpLmNoaWxkcmVuO1xuXHRcdFx0aWYgKCFjdXJyZW50Q2hpbGRyZW4pIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoY3VycmVudENoaWxkcmVuLCBjdXJyZW50Q2hpbGQgPT4ge1xuXHRcdFx0XHQvLyBhbmQgdGhleSBzaG91bGQgYmUgY29tcG9uZW50c1xuXHRcdFx0XHRpZiAoIXRoaXMuX2lzQ29tcG9uZW50RWxlbWVudChjb21wb25lbnRzLCBjdXJyZW50Q2hpbGQpKSB7XG5cdFx0XHRcdFx0cXVldWUucHVzaChjdXJyZW50Q2hpbGQpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsZW1lbnRzLnB1c2goY3VycmVudENoaWxkKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gZWxlbWVudHM7XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyBhbiBlcnJvciB3aGlsZSByZW5kZXJpbmcuXG5cdCAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBDb21wb25lbnQncyBIVE1MIGVsZW1lbnQuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnQgQ29tcG9uZW50J3MgaW5zdGFuY2UuXG5cdCAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIEVycm9yIHRvIGhhbmRsZS5cblx0ICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nPn0gUHJvbWlzZSBmb3IgSFRNTCBzdHJpbmcuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfaGFuZGxlUmVuZGVyRXJyb3IoZWxlbWVudCwgY29tcG9uZW50LCBlcnJvcikge1xuXHRcdHRoaXMuX2V2ZW50QnVzLmVtaXQoJ2Vycm9yJywgZXJyb3IpO1xuXG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG5cdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdC8vIGRvIG5vdCBjb3JydXB0IGV4aXN0ZWQgSEVBRCB3aGVuIGVycm9yIG9jY3Vyc1xuXHRcdFx0XHRpZiAoZWxlbWVudC50YWdOYW1lID09PSBUQUdfTkFNRVMuSEVBRCkge1xuXHRcdFx0XHRcdHJldHVybiAnJztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghdGhpcy5fY29uZmlnLmlzUmVsZWFzZSAmJiBlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVycm9ySGVscGVyLnByZXR0eVByaW50KGVycm9yLCB0aGlzLl93aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoY29tcG9uZW50LmVycm9yVGVtcGxhdGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gY29tcG9uZW50LmVycm9yVGVtcGxhdGUucmVuZGVyKGVycm9yKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAnJztcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goKCkgPT4gJycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZXMgYWxsIGNvbXBvbmVudHMgdGhhdCBkZXBlbmQgb24gdGhlIGN1cnJlbnQgc2V0IG9mIGNoYW5nZWQgc3RvcmVzLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSBmb3Igbm90aGluZy5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF91cGRhdGVTdG9yZUNvbXBvbmVudHMoKSB7XG5cdFx0aWYgKHRoaXMuX2lzVXBkYXRpbmcpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHR9XG5cblx0XHQvLyBpZiBkb2N1bWVudCBjb21wb25lbnQgaXMgY2hhbmdlZCB3ZSBzaG91bGQgcmVsb2FkIHRoZSBwYWdlXG5cdFx0Y29uc3QgZG9jdW1lbnRTdG9yZSA9IHRoaXMuX3dpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKFxuXHRcdFx0bW9kdWxlSGVscGVyLkFUVFJJQlVURV9TVE9SRVxuXHRcdCk7XG5cdFx0aWYgKGRvY3VtZW50U3RvcmUgaW4gdGhpcy5fY3VycmVudENoYW5nZWRTdG9yZXMpIHtcblx0XHRcdGNvbnN0IG5ld0xvY2F0aW9uID0gdGhpcy5fY3VycmVudFJvdXRpbmdDb250ZXh0LmxvY2F0aW9uLnRvU3RyaW5nKCk7XG5cdFx0XHRpZiAobmV3TG9jYXRpb24gPT09IHRoaXMuX3dpbmRvdy5sb2NhdGlvbi50b1N0cmluZygpKSB7XG5cdFx0XHRcdHRoaXMuX3dpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fd2luZG93LmxvY2F0aW9uLmFzc2lnbihuZXdMb2NhdGlvbik7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5faXNVcGRhdGluZyA9IHRydWU7XG5cblx0XHQvLyBpZiB3ZSBoYXZlIGF3YWl0aW5nIHJvdXRpbmcgd2Ugc2hvdWxkIGFwcGx5IHN0YXRlIHRvIHRoZSBzdG9yZXNcblx0XHRpZiAodGhpcy5fYXdhaXRpbmdSb3V0aW5nKSB7XG5cdFx0XHRjb25zdCBjb21wb25lbnRzID0gdGhpcy5fY29tcG9uZW50TG9hZGVyLmdldENvbXBvbmVudHNCeU5hbWVzKCk7XG5cdFx0XHRjb25zdCBjaGFuZ2VkQnlTdGF0ZSA9IHRoaXMuX3N0b3JlRGlzcGF0Y2hlci5zZXRTdGF0ZShcblx0XHRcdFx0dGhpcy5fYXdhaXRpbmdSb3V0aW5nLnN0YXRlLFxuXHRcdFx0XHR0aGlzLl9hd2FpdGluZ1JvdXRpbmcucm91dGluZ0NvbnRleHRcblx0XHRcdCk7XG5cblx0XHRcdGNoYW5nZWRCeVN0YXRlLmZvckVhY2gobmFtZSA9PiB7XG5cdFx0XHRcdHRoaXMuX2N1cnJlbnRDaGFuZ2VkU3RvcmVzW25hbWVdID0gdHJ1ZTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyB3ZSBzaG91bGQgdXBkYXRlIGNvbnRleHRzIG9mIHRoZSBjb21wb25lbnRzIHdpdGggdGhlIG5ldyByb3V0aW5nIGNvbnRleHRcblx0XHRcdHRoaXMuX2N1cnJlbnRSb3V0aW5nQ29udGV4dCA9IHRoaXMuX2F3YWl0aW5nUm91dGluZy5yb3V0aW5nQ29udGV4dDtcblx0XHRcdE9iamVjdC5rZXlzKHRoaXMuX2NvbXBvbmVudEluc3RhbmNlcylcblx0XHRcdFx0LmZvckVhY2goaWQgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGluc3RhbmNlID0gdGhpcy5fY29tcG9uZW50SW5zdGFuY2VzW2lkXTtcblx0XHRcdFx0XHRpbnN0YW5jZS4kY29udGV4dCA9IHRoaXMuX2dldENvbXBvbmVudENvbnRleHQoXG5cdFx0XHRcdFx0XHRjb21wb25lbnRzW2luc3RhbmNlLiRjb250ZXh0Lm5hbWVdLFxuXHRcdFx0XHRcdFx0aW5zdGFuY2UuJGNvbnRleHQuZWxlbWVudFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fYXdhaXRpbmdSb3V0aW5nID0gbnVsbDtcblx0XHR9XG5cblx0XHRjb25zdCBjaGFuZ2VkU3RvcmVzID0gT2JqZWN0LmtleXModGhpcy5fY3VycmVudENoYW5nZWRTdG9yZXMpO1xuXHRcdGlmIChjaGFuZ2VkU3RvcmVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0dGhpcy5faXNVcGRhdGluZyA9IGZhbHNlO1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHRcdH1cblxuXHRcdHRoaXMuX2N1cnJlbnRDaGFuZ2VkU3RvcmVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXHRcdGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLl9jcmVhdGVSZW5kZXJpbmdDb250ZXh0KGNoYW5nZWRTdG9yZXMpO1xuXHRcdGNvbnN0IHByb21pc2VzID0gcmVuZGVyaW5nQ29udGV4dC5yb290cy5tYXAocm9vdCA9PiB7XG5cdFx0XHRyZW5kZXJpbmdDb250ZXh0LnJvb3RJZHNbdGhpcy5fZ2V0SWQocm9vdCldID0gdHJ1ZTtcblx0XHRcdHJldHVybiB0aGlzLnJlbmRlckNvbXBvbmVudChyb290LCByZW5kZXJpbmdDb250ZXh0KTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcylcblx0XHRcdC5jYXRjaChyZWFzb24gPT4gdGhpcy5fZXZlbnRCdXMuZW1pdCgnZXJyb3InLCByZWFzb24pKVxuXHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9pc1VwZGF0aW5nID0gZmFsc2U7XG5cdFx0XHRcdHRoaXMuX2V2ZW50QnVzLmVtaXQoJ2RvY3VtZW50VXBkYXRlZCcsIGNoYW5nZWRTdG9yZXMpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fdXBkYXRlU3RvcmVDb21wb25lbnRzKCk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNZXJnZXMgbmV3IGFuZCBleGlzdGVkIGhlYWQgZWxlbWVudHMgYW5kIGFwcGxpZXMgb25seSBkaWZmZXJlbmNlLlxuXHQgKiBUaGUgcHJvYmxlbSBoZXJlIGlzIHRoYXQgd2UgY2FuJ3QgcmUtY3JlYXRlIG9yIGNoYW5nZSBzY3JpcHQgYW5kIHN0eWxlIHRhZ3MsXG5cdCAqIGJlY2F1c2UgaXQgY2F1c2VzIGJsaW5raW5nIGFuZCBKYXZhU2NyaXB0IHJlLWluaXRpYWxpemF0aW9uLiBUaGVyZWZvcmUgc3VjaFxuXHQgKiBlbGVtZW50IG11c3QgYmUgaW1tdXRhYmxlIGluIHRoZSBIRUFELlxuXHQgKiBAcGFyYW0ge05vZGV9IGhlYWQgSEVBRCBET00gZWxlbWVudC5cblx0ICogQHBhcmFtIHtOb2RlfSBuZXdIZWFkIE5ldyBIRUFEIGVsZW1lbnQuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfbWVyZ2VIZWFkKGhlYWQsIG5ld0hlYWQpIHtcblx0XHRpZiAoIW5ld0hlYWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBoZWFkU2V0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXHRcdC8vIHJlbW92ZSBhbGwgbm9kZXMgZnJvbSB0aGUgY3VycmVudCBIRUFEIGV4Y2VwdCBpbW11dGFibGUgb25lc1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaGVhZC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBjdXJyZW50ID0gaGVhZC5jaGlsZE5vZGVzW2ldO1xuXHRcdFx0aWYgKCFpc1RhZ0ltbXV0YWJsZShjdXJyZW50KSkge1xuXHRcdFx0XHRoZWFkLnJlbW92ZUNoaWxkKGN1cnJlbnQpO1xuXHRcdFx0XHRpLS07XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0Ly8gd2UgbmVlZCB0byBjb2xsZWN0IGtleXMgZm9yIGltbXV0YWJsZSBlbGVtZW50cyB0byBoYW5kbGVcblx0XHRcdC8vIGF0dHJpYnV0ZXMgcmVvcmRlcmluZ1xuXHRcdFx0aGVhZFNldFt0aGlzLl9nZXRFbGVtZW50S2V5KGN1cnJlbnQpXSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBuZXdIZWFkLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBjdXJyZW50ID0gbmV3SGVhZC5jaGlsZHJlbltpXTtcblx0XHRcdGlmICh0aGlzLl9nZXRFbGVtZW50S2V5KGN1cnJlbnQpIGluIGhlYWRTZXQpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRoZWFkLmFwcGVuZENoaWxkKGN1cnJlbnQpO1xuXHRcdFx0Ly8gd2hlbiB3ZSBhcHBlbmQgZXhpc3RpbmcgY2hpbGQgdG8gYW5vdGhlciBwYXJlbnQgaXQgcmVtb3Zlc1xuXHRcdFx0Ly8gdGhlIG5vZGUgZnJvbSBhIHByZXZpb3VzIHBhcmVudFxuXHRcdFx0aS0tO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGFuIHVuaXF1ZSBlbGVtZW50IGtleSB1c2luZyBlbGVtZW50J3MgYXR0cmlidXRlcyBhbmQgaXRzIGNvbnRlbnQuXG5cdCAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBIVE1MIGVsZW1lbnQuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFVuaXF1ZSBrZXkgZm9yIHRoZSBlbGVtZW50LlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2dldEVsZW1lbnRLZXkoZWxlbWVudCkge1xuXHRcdC8vIHNvbWUgaW1tdXRhYmxlIGVsZW1lbnRzIGhhdmUgc2V2ZXJhbCB2YWx1YWJsZSBhdHRyaWJ1dGVzXG5cdFx0Ly8gdGhlc2UgYXR0cmlidXRlcyBkZWZpbmUgdGhlIGVsZW1lbnQgaWRlbnRpdHlcblx0XHRjb25zdCBhdHRyaWJ1dGVzID0gW107XG5cblx0XHRzd2l0Y2ggKGVsZW1lbnQubm9kZU5hbWUpIHtcblx0XHRcdGNhc2UgVEFHX05BTUVTLkxJTks6XG5cdFx0XHRcdGF0dHJpYnV0ZXMucHVzaChgaHJlZj0ke2VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyl9YCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBUQUdfTkFNRVMuU0NSSVBUOlxuXHRcdFx0XHRhdHRyaWJ1dGVzLnB1c2goYHNyYz0ke2VsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKX1gKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGA8JHtlbGVtZW50Lm5vZGVOYW1lfSAke2F0dHJpYnV0ZXMuc29ydCgpLmpvaW4oJyAnKX0+JHtlbGVtZW50LnRleHRDb250ZW50fTwvJHtlbGVtZW50Lm5vZGVOYW1lfT5gO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemVzIHRoZSBlbGVtZW50IGFzIGEgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgVGhlIGNvbXBvbmVudCdzIGVsZW1lbnQuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnRzIEN1cnJlbnQgc2V0IG9mIGNvbXBvbmVudHMuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIGZvciB0aGUgZG9uZSBpbml0aWFsaXphdGlvbi5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9pbml0aWFsaXplQ29tcG9uZW50KGVsZW1lbnQsIGNvbXBvbmVudHMpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0Y29uc3QgY29tcG9uZW50TmFtZSA9IG1vZHVsZUhlbHBlci5nZXRPcmlnaW5hbENvbXBvbmVudE5hbWUoZWxlbWVudC5ub2RlTmFtZSk7XG5cdFx0XHRcdGlmICghKGNvbXBvbmVudE5hbWUgaW4gY29tcG9uZW50cykpIHtcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IGlkID0gdGhpcy5fZ2V0SWQoZWxlbWVudCk7XG5cdFx0XHRcdGNvbnN0IENvbXBvbmVudENvbnN0cnVjdG9yID0gY29tcG9uZW50c1tjb21wb25lbnROYW1lXS5jb25zdHJ1Y3Rvcjtcblx0XHRcdFx0Q29tcG9uZW50Q29uc3RydWN0b3IucHJvdG90eXBlLiRjb250ZXh0ID0gdGhpcy5fZ2V0Q29tcG9uZW50Q29udGV4dChcblx0XHRcdFx0XHRjb21wb25lbnRzW2NvbXBvbmVudE5hbWVdLCBlbGVtZW50XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0Y29uc3QgaW5zdGFuY2UgPSBuZXcgQ29tcG9uZW50Q29uc3RydWN0b3IodGhpcy5fc2VydmljZUxvY2F0b3IpO1xuXHRcdFx0XHRpbnN0YW5jZS4kY29udGV4dCA9IENvbXBvbmVudENvbnN0cnVjdG9yLnByb3RvdHlwZS4kY29udGV4dDtcblx0XHRcdFx0dGhpcy5fY29tcG9uZW50RWxlbWVudHNbaWRdID0gZWxlbWVudDtcblx0XHRcdFx0dGhpcy5fY29tcG9uZW50SW5zdGFuY2VzW2lkXSA9IGluc3RhbmNlO1xuXHRcdFx0XHQvLyBpbml0aWFsaXplIHRoZSBzdG9yZSBvZiB0aGUgY29tcG9uZW50XG5cdFx0XHRcdHRoaXMuX3N0b3JlRGlzcGF0Y2hlci5nZXRTdG9yZShcblx0XHRcdFx0XHRlbGVtZW50LmdldEF0dHJpYnV0ZShtb2R1bGVIZWxwZXIuQVRUUklCVVRFX1NUT1JFKVxuXHRcdFx0XHQpO1xuXHRcdFx0XHR0aGlzLl9ldmVudEJ1cy5lbWl0KCdjb21wb25lbnRSZW5kZXJlZCcsIHtcblx0XHRcdFx0XHRuYW1lOiBjb21wb25lbnROYW1lLFxuXHRcdFx0XHRcdGF0dHJpYnV0ZXM6IGluc3RhbmNlLiRjb250ZXh0LmF0dHJpYnV0ZXMsXG5cdFx0XHRcdFx0Y29udGV4dDogaW5zdGFuY2UuJGNvbnRleHRcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9iaW5kQ29tcG9uZW50KGVsZW1lbnQpO1xuXHRcdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBhIGNvbXBvbmVudCBjb250ZXh0IHVzaW5nIHRoZSBiYXNpYyBjb250ZXh0LlxuXHQgKiBAcGFyYW0ge09iamVjdH0gY29tcG9uZW50IENvbXBvbmVudCBkZXRhaWxzLlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgRE9NIGVsZW1lbnQgb2YgdGhlIGNvbXBvbmVudC5cblx0ICogQHJldHVybnMge09iamVjdH0gQ29tcG9uZW50J3MgY29udGV4dC5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9nZXRDb21wb25lbnRDb250ZXh0KGNvbXBvbmVudCwgZWxlbWVudCkge1xuXHRcdGNvbnN0IHN0b3JlTmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKG1vZHVsZUhlbHBlci5BVFRSSUJVVEVfU1RPUkUpO1xuXHRcdGNvbnN0IGNvbXBvbmVudENvbnRleHQgPSBPYmplY3QuY3JlYXRlKHRoaXMuX2N1cnJlbnRSb3V0aW5nQ29udGV4dCk7XG5cblx0XHQvLyBpbml0aWFsaXplIHRoZSBzdG9yZSBvZiB0aGUgY29tcG9uZW50XG5cdFx0dGhpcy5fc3RvcmVEaXNwYXRjaGVyLmdldFN0b3JlKHN0b3JlTmFtZSk7XG5cblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyhjb21wb25lbnRDb250ZXh0LCB7XG5cdFx0XHRuYW1lOiB7XG5cdFx0XHRcdGdldDogKCkgPT4gY29tcG9uZW50Lm5hbWUsXG5cdFx0XHRcdGVudW1lcmFibGU6IHRydWVcblx0XHRcdH0sXG5cdFx0XHRhdHRyaWJ1dGVzOiB7XG5cdFx0XHRcdGdldDogKCkgPT4gYXR0cmlidXRlc1RvT2JqZWN0KGVsZW1lbnQuYXR0cmlidXRlcyksXG5cdFx0XHRcdGVudW1lcmFibGU6IHRydWVcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGNvbXBvbmVudENvbnRleHQuZWxlbWVudCA9IGVsZW1lbnQ7XG5cblx0XHQvLyBzZWFyY2ggbWV0aG9kc1xuXHRcdGNvbXBvbmVudENvbnRleHQuZ2V0Q29tcG9uZW50QnlJZCA9XG5cdFx0XHRpZCA9PiB0aGlzLmdldENvbXBvbmVudEJ5SWQoaWQpO1xuXG5cdFx0Y29tcG9uZW50Q29udGV4dC5nZXRDb21wb25lbnRCeUVsZW1lbnQgPVxuXHRcdFx0ZWxlbWVudCA9PiB0aGlzLmdldENvbXBvbmVudEJ5RWxlbWVudChlbGVtZW50KTtcblxuXHRcdGNvbXBvbmVudENvbnRleHQuZ2V0Q29tcG9uZW50c0J5VGFnTmFtZSA9XG5cdFx0XHQodGFnTmFtZSwgcGFyZW50KSA9PiB0aGlzLmdldENvbXBvbmVudHNCeVRhZ05hbWUodGFnTmFtZSwgcGFyZW50KTtcblxuXHRcdGNvbXBvbmVudENvbnRleHQuZ2V0Q29tcG9uZW50c0J5Q2xhc3NOYW1lID1cblx0XHRcdChjbGFzc05hbWUsIHBhcmVudCkgPT4gdGhpcy5nZXRDb21wb25lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lLCBwYXJlbnQpO1xuXG5cdFx0Y29tcG9uZW50Q29udGV4dC5xdWVyeUNvbXBvbmVudFNlbGVjdG9yID1cblx0XHRcdChzZWxlY3RvciwgcGFyZW50KSA9PiB0aGlzLnF1ZXJ5Q29tcG9uZW50U2VsZWN0b3Ioc2VsZWN0b3IsIHBhcmVudCk7XG5cblx0XHRjb21wb25lbnRDb250ZXh0LnF1ZXJ5Q29tcG9uZW50U2VsZWN0b3JBbGwgPVxuXHRcdFx0KHNlbGVjdG9yLCBwYXJlbnQpID0+IHRoaXMucXVlcnlDb21wb25lbnRTZWxlY3RvckFsbChzZWxlY3RvciwgcGFyZW50KTtcblxuXHRcdC8vIGNyZWF0ZS9yZW1vdmVcblx0XHRjb21wb25lbnRDb250ZXh0LmNyZWF0ZUNvbXBvbmVudCA9ICh0YWdOYW1lLCBhdHRyaWJ1dGVzKSA9PlxuXHRcdFx0dGhpcy5jcmVhdGVDb21wb25lbnQodGFnTmFtZSwgYXR0cmlidXRlcyk7XG5cdFx0Y29tcG9uZW50Q29udGV4dC5jb2xsZWN0R2FyYmFnZSA9ICgpID0+IHRoaXMuY29sbGVjdEdhcmJhZ2UoKTtcblxuXHRcdC8vIHN0b3JlIG1ldGhvZHNcblx0XHRjb21wb25lbnRDb250ZXh0LmdldFN0b3JlRGF0YSA9ICgpID0+IHtcblx0XHRcdGNvbnN0IGN1cnJlbnRTdG9yZU5hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShtb2R1bGVIZWxwZXIuQVRUUklCVVRFX1NUT1JFKTtcblx0XHRcdHJldHVybiB0aGlzLl9zdG9yZURpc3BhdGNoZXIuZ2V0U3RvcmVEYXRhKGN1cnJlbnRTdG9yZU5hbWUpO1xuXHRcdH07XG5cdFx0Y29tcG9uZW50Q29udGV4dC5zZW5kQWN0aW9uID0gKG5hbWUsIGFyZ3MpID0+IHtcblx0XHRcdGNvbnN0IGN1cnJlbnRTdG9yZU5hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShtb2R1bGVIZWxwZXIuQVRUUklCVVRFX1NUT1JFKTtcblx0XHRcdHJldHVybiB0aGlzLl9zdG9yZURpc3BhdGNoZXIuc2VuZEFjdGlvbihjdXJyZW50U3RvcmVOYW1lLCBuYW1lLCBhcmdzKTtcblx0XHR9O1xuXG5cdFx0cmV0dXJuIE9iamVjdC5mcmVlemUoY29tcG9uZW50Q29udGV4dCk7XG5cdH1cblxuXHQvKipcblx0ICogRmluZHMgYWxsIHJlbmRlcmluZyByb290cyBvbiB0aGUgcGFnZSBmb3IgYWxsIGNoYW5nZWQgc3RvcmVzLlxuXHQgKiBAcGFyYW0ge0FycmF5fSBjaGFuZ2VkU3RvcmVOYW1lcyBMaXN0IG9mIGNoYW5nZWQgc3RvcmUncyBuYW1lcy5cblx0ICogQHJldHVybnMge0FycmF5PEVsZW1lbnQ+fSBIVE1MIGVsZW1lbnRzIHRoYXQgYXJlIHJlbmRlcmluZyByb290cy5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9maW5kUmVuZGVyaW5nUm9vdHMoY2hhbmdlZFN0b3JlTmFtZXMpIHtcblx0XHRjb25zdCBoZWFkU3RvcmUgPSB0aGlzLl93aW5kb3cuZG9jdW1lbnQuaGVhZC5nZXRBdHRyaWJ1dGUobW9kdWxlSGVscGVyLkFUVFJJQlVURV9TVE9SRSk7XG5cdFx0Y29uc3QgY29tcG9uZW50cyA9IHRoaXMuX2NvbXBvbmVudExvYWRlci5nZXRDb21wb25lbnRzQnlOYW1lcygpO1xuXHRcdGNvbnN0IGNvbXBvbmVudEVsZW1lbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0XHRjb25zdCBzdG9yZU5hbWVzU2V0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0XHRjb25zdCByb290c1NldCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdFx0Y29uc3Qgcm9vdHMgPSBbXTtcblxuXHRcdC8vIHdlIHNob3VsZCBmaW5kIGFsbCBjb21wb25lbnRzIGFuZCB0aGVuIGxvb2sgZm9yIHJvb3RzXG5cdFx0Y2hhbmdlZFN0b3JlTmFtZXNcblx0XHRcdC5mb3JFYWNoKHN0b3JlTmFtZSA9PiB7XG5cdFx0XHRcdHN0b3JlTmFtZXNTZXRbc3RvcmVOYW1lXSA9IHRydWU7XG5cdFx0XHRcdGNvbnN0IGVsZW1lbnRzID0gdGhpcy5fd2luZG93LmRvY3VtZW50XG5cdFx0XHRcdFx0LnF1ZXJ5U2VsZWN0b3JBbGwoYFske21vZHVsZUhlbHBlci5BVFRSSUJVVEVfU1RPUkV9PVwiJHtzdG9yZU5hbWV9XCJdYCk7XG5cdFx0XHRcdGlmIChlbGVtZW50cy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29tcG9uZW50RWxlbWVudHNbc3RvcmVOYW1lXSA9IGVsZW1lbnRzO1xuXHRcdFx0fSk7XG5cblx0XHRpZiAoaGVhZFN0b3JlIGluIHN0b3JlTmFtZXNTZXQgJiYgbW9kdWxlSGVscGVyLkhFQURfQ09NUE9ORU5UX05BTUUgaW4gY29tcG9uZW50cykge1xuXHRcdFx0cm9vdHNTZXRbdGhpcy5fZ2V0SWQodGhpcy5fd2luZG93LmRvY3VtZW50LmhlYWQpXSA9IHRydWU7XG5cdFx0XHRyb290cy5wdXNoKHRoaXMuX3dpbmRvdy5kb2N1bWVudC5oZWFkKTtcblx0XHR9XG5cblx0XHRjaGFuZ2VkU3RvcmVOYW1lc1xuXHRcdFx0LmZvckVhY2goc3RvcmVOYW1lID0+IHtcblx0XHRcdFx0aWYgKCEoc3RvcmVOYW1lIGluIGNvbXBvbmVudEVsZW1lbnRzKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHdlIGNhbiBvcHRpbWl6ZSBhbmQgZG9uJ3QgZ28gdGhlIHNhbWUgcGF0aCB0d2ljZVxuXHRcdFx0XHRjb25zdCB2aXNpdGVkSWRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXHRcdFx0XHRBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGNvbXBvbmVudEVsZW1lbnRzW3N0b3JlTmFtZV0sIGN1cnJlbnQgPT4ge1xuXHRcdFx0XHRcdGlmICghbW9kdWxlSGVscGVyLmlzQ29tcG9uZW50Tm9kZShjdXJyZW50KSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGxldCBjdXJyZW50Um9vdCA9IGN1cnJlbnQ7XG5cdFx0XHRcdFx0bGV0IGxhc3RSb290ID0gY3VycmVudFJvb3Q7XG5cdFx0XHRcdFx0bGV0IGxhc3RSb290SWQgPSB0aGlzLl9nZXRJZChjdXJyZW50KTtcblx0XHRcdFx0XHRpZiAobGFzdFJvb3RJZCBpbiB2aXNpdGVkSWRzKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZpc2l0ZWRJZHNbbGFzdFJvb3RJZF0gPSB0cnVlO1xuXG5cdFx0XHRcdFx0d2hpbGUgKGN1cnJlbnRSb290LnBhcmVudEVsZW1lbnQpIHtcblx0XHRcdFx0XHRcdGN1cnJlbnRSb290ID0gY3VycmVudFJvb3QucGFyZW50RWxlbWVudDtcblxuXHRcdFx0XHRcdFx0Ly8gaWYgd2UgZ28gdGhlIHNhbWUgcm91dGUgd2UgdmlzaXRlZCBiZWZvcmUgd2UgY2FuXG5cdFx0XHRcdFx0XHQvLyBwcm9jZWVkIHdpdGggdGhlIG5leHQgZWxlbWVudFxuXHRcdFx0XHRcdFx0Y29uc3QgY3VycmVudElkID0gdGhpcy5fZ2V0SWQoY3VycmVudFJvb3QpO1xuXHRcdFx0XHRcdFx0aWYgKGN1cnJlbnRJZCBpbiB2aXNpdGVkSWRzKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Y29uc3QgY3VycmVudFN0b3JlID0gY3VycmVudFJvb3QuZ2V0QXR0cmlidXRlKG1vZHVsZUhlbHBlci5BVFRSSUJVVEVfU1RPUkUpO1xuXHRcdFx0XHRcdFx0Y29uc3QgY3VycmVudENvbXBvbmVudE5hbWUgPSBtb2R1bGVIZWxwZXIuZ2V0T3JpZ2luYWxDb21wb25lbnROYW1lKGN1cnJlbnRSb290LnRhZ05hbWUpO1xuXG5cdFx0XHRcdFx0XHQvLyBzdG9yZSBkaWQgbm90IGNoYW5nZSBzdGF0ZVxuXHRcdFx0XHRcdFx0aWYgKCFjdXJyZW50U3RvcmUgfHwgIShjdXJyZW50U3RvcmUgaW4gc3RvcmVOYW1lc1NldCkpIHtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIHRoaXMgY29tcG9uZW50IGVsZW1lbnQgZG9lcyBub3QgaGF2ZSBhblxuXHRcdFx0XHRcdFx0Ly8gaW1wbGVtZW50YXRpb24sIHNraXBwaW5nLi4uLlxuXHRcdFx0XHRcdFx0aWYgKCEoY3VycmVudENvbXBvbmVudE5hbWUgaW4gY29tcG9uZW50cykpIHtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGxhc3RSb290ID0gY3VycmVudFJvb3Q7XG5cdFx0XHRcdFx0XHRsYXN0Um9vdElkID0gY3VycmVudElkO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIHdlIGRvbid0IHdhbnQgdGhlIHNhbWUgcm9vdCBlbGVtZW50IHR3aWNlXG5cdFx0XHRcdFx0aWYgKGxhc3RSb290SWQgaW4gcm9vdHNTZXQpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cm9vdHNTZXRbbGFzdFJvb3RJZF0gPSB0cnVlO1xuXHRcdFx0XHRcdHJvb3RzLnB1c2gobGFzdFJvb3QpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0cmV0dXJuIHJvb3RzO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSByZW5kZXJpbmcgY29udGV4dC5cblx0ICogQHBhcmFtIHtBcnJheT99IGNoYW5nZWRTdG9yZXMgTmFtZXMgb2YgY2hhbmdlZCBzdG9yZXMuXG5cdCAqIEByZXR1cm5zIHt7XG5cdCAqICAgY29uZmlnOiBPYmplY3QsXG5cdCAqICAgcmVuZGVyZWRJZHM6IHt9LFxuXHQgKiAgIHVuYm91bmRJZHM6IHt9LFxuXHQgKiAgIGlzSGVhZFJlbmRlcmVkOiBib29sZWFuLFxuXHQgKiAgIGJpbmRNZXRob2RzOiBBcnJheSxcblx0ICogICByb3V0aW5nQ29udGV4dDogT2JqZWN0LFxuXHQgKiAgIGNvbXBvbmVudHM6IE9iamVjdCxcblx0ICogICByb290czogQXJyYXkuPEVsZW1lbnQ+XG5cdCAqIH19IFRoZSBjb250ZXh0IG9iamVjdC5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9jcmVhdGVSZW5kZXJpbmdDb250ZXh0KGNoYW5nZWRTdG9yZXMpIHtcblx0XHRjb25zdCBjb21wb25lbnRzID0gdGhpcy5fY29tcG9uZW50TG9hZGVyLmdldENvbXBvbmVudHNCeU5hbWVzKCk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Y29uZmlnOiB0aGlzLl9jb25maWcsXG5cdFx0XHRyZW5kZXJlZElkczogT2JqZWN0LmNyZWF0ZShudWxsKSxcblx0XHRcdHVuYm91bmRJZHM6IE9iamVjdC5jcmVhdGUobnVsbCksXG5cdFx0XHRpc0hlYWRSZW5kZXJlZDogZmFsc2UsXG5cdFx0XHRiaW5kTWV0aG9kczogW10sXG5cdFx0XHRyb3V0aW5nQ29udGV4dDogdGhpcy5fY3VycmVudFJvdXRpbmdDb250ZXh0LFxuXHRcdFx0Y29tcG9uZW50cyxcblx0XHRcdHJvb3RJZHM6IE9iamVjdC5jcmVhdGUobnVsbCksXG5cdFx0XHRyb290czogY2hhbmdlZFN0b3JlcyA/IHRoaXMuX2ZpbmRSZW5kZXJpbmdSb290cyhjaGFuZ2VkU3RvcmVzKSA6IFtdXG5cdFx0fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGFuIElEIG9mIHRoZSBlbGVtZW50LlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgSFRNTCBlbGVtZW50IG9mIHRoZSBjb21wb25lbnQuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IElELlxuXHQgKi9cblx0X2dldElkKGVsZW1lbnQpIHtcblx0XHRpZiAoZWxlbWVudCA9PT0gdGhpcy5fd2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIFNQRUNJQUxfSURTLiQkZG9jdW1lbnQ7XG5cdFx0fVxuXG5cdFx0aWYgKGVsZW1lbnQgPT09IHRoaXMuX3dpbmRvdy5kb2N1bWVudC5oZWFkKSB7XG5cdFx0XHRyZXR1cm4gU1BFQ0lBTF9JRFMuJCRoZWFkO1xuXHRcdH1cblxuXHRcdC8vIGlmIHRoZSBlbGVtZW50IGRvZXMgbm90IGhhdmUgYW4gSUQgd2UgY3JlYXRlIGl0XG5cdFx0aWYgKCFlbGVtZW50W21vZHVsZUhlbHBlci5DT01QT05FTlRfSURdKSB7XG5cdFx0XHRlbGVtZW50W21vZHVsZUhlbHBlci5DT01QT05FTlRfSURdID0gdXVpZC52NCgpO1xuXHRcdFx0Ly8gZGVhbCB3aXRoIHBvc3NpYmxlIGNvbGxpc2lvbnNcblx0XHRcdHdoaWxlIChlbGVtZW50W21vZHVsZUhlbHBlci5DT01QT05FTlRfSURdIGluIHRoaXMuX2NvbXBvbmVudEluc3RhbmNlcykge1xuXHRcdFx0XHRlbGVtZW50W21vZHVsZUhlbHBlci5DT01QT05FTlRfSURdID0gdXVpZC52NCgpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZWxlbWVudFttb2R1bGVIZWxwZXIuQ09NUE9ORU5UX0lEXTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGEgY3Jvc3MtYnJvd3NlciBcIm1hdGNoZXNcIiBtZXRob2QgZm9yIHRoZSBlbGVtZW50LlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgSFRNTCBlbGVtZW50LlxuXHQgKiBAcmV0dXJucyB7RnVuY3Rpb259IFwibWF0Y2hlc1wiIG1ldGhvZC5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9nZXRNYXRjaGVzTWV0aG9kKGVsZW1lbnQpIHtcblx0XHRjb25zdCBtZXRob2QgPSAoXG5cdFx0XHRlbGVtZW50Lm1hdGNoZXMgfHxcblx0XHRcdGVsZW1lbnQud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8XG5cdFx0XHRlbGVtZW50Lm1vek1hdGNoZXNTZWxlY3RvciB8fFxuXHRcdFx0ZWxlbWVudC5vTWF0Y2hlc1NlbGVjdG9yIHx8XG5cdFx0XHRlbGVtZW50Lm1zTWF0Y2hlc1NlbGVjdG9yIHx8XG5cdFx0XHQoc2VsZWN0b3IgPT4gbWF0Y2hlcyh0aGlzLl93aW5kb3csIGVsZW1lbnQsIHNlbGVjdG9yKSlcblx0XHQpO1xuXG5cdFx0cmV0dXJuIG1ldGhvZC5iaW5kKGVsZW1lbnQpO1xuXHR9XG59XG5cbi8qKlxuICogQ29udmVydHMgTmFtZWROb2RlTWFwIG9mIEF0dHIgaXRlbXMgdG8gdGhlIGtleS12YWx1ZSBvYmplY3QgbWFwLlxuICogQHBhcmFtIHtOYW1lZE5vZGVNYXB9IGF0dHJpYnV0ZXMgTGlzdCBvZiBFbGVtZW50IGF0dHJpYnV0ZXMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBNYXAgb2YgYXR0cmlidXRlIHZhbHVlcyBieSB0aGVpciBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYXR0cmlidXRlc1RvT2JqZWN0KGF0dHJpYnV0ZXMpIHtcblx0Y29uc3QgcmVzdWx0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0QXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChhdHRyaWJ1dGVzLCBjdXJyZW50ID0+IHtcblx0XHRyZXN1bHRbY3VycmVudC5uYW1lXSA9IGN1cnJlbnQudmFsdWU7XG5cdH0pO1xuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIE1hdGNoZXMgdGhlIHNwZWNpZmllZCBlbGVtZW50IHRvIHRoZSBzZWxlY3RvciAoZmFsbGJhY2spLlxuICogQHBhcmFtIHtXaW5kb3d9IGN1cnJlbnRXaW5kb3cgQ3VycmVudCBicm93c2VyIHdpbmRvdy5cbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBET00gZWxlbWVudC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciBTZWxlY3RvciBmb3IgbWF0Y2hpbmcuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gRG9lcyB0aGUgZWxlbWVudCBtYXRjaC5cbiAqL1xuZnVuY3Rpb24gbWF0Y2hlcyhjdXJyZW50V2luZG93LCBlbGVtZW50LCBzZWxlY3Rvcikge1xuXHRjb25zdCBvd25lckRvY3VtZW50ID0gZWxlbWVudC5kb2N1bWVudCB8fCBlbGVtZW50Lm93bmVyRG9jdW1lbnQgfHwgY3VycmVudFdpbmRvdy5kb2N1bWVudDtcblx0Y29uc3QgbWF0Y2hlZCA9IG93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cdHJldHVybiBBcnJheS5wcm90b3R5cGUuc29tZS5jYWxsKG1hdGNoZWQsIGl0ZW0gPT4gaXRlbSA9PT0gZWxlbWVudCk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBpbWl0YXRpb24gb2YgdGhlIG9yaWdpbmFsIEV2ZW50IG9iamVjdCBidXQgd2l0aCBzcGVjaWZpZWQgY3VycmVudFRhcmdldC5cbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IE9yaWdpbmFsIGV2ZW50IG9iamVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1cnJlbnRUYXJnZXRHZXR0ZXIgR2V0dGVyIGZvciB0aGUgY3VycmVudFRhcmdldC5cbiAqIEByZXR1cm5zIHtFdmVudH0gV3JhcHBlZCBldmVudC5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQ3VzdG9tRXZlbnQoZXZlbnQsIGN1cnJlbnRUYXJnZXRHZXR0ZXIpIHtcblx0Y29uc3QgY2F0RXZlbnQgPSBPYmplY3QuY3JlYXRlKGV2ZW50KTtcblx0Y29uc3Qga2V5cyA9IFtdO1xuXHRjb25zdCBwcm9wZXJ0aWVzID0ge307XG5cblx0LyogZXNsaW50IGd1YXJkLWZvci1pbjogMCAqL1xuXHRmb3IgKGNvbnN0IGtleSBpbiBldmVudCkge1xuXHRcdGtleXMucHVzaChrZXkpO1xuXHR9XG5cdGtleXMuZm9yRWFjaChrZXkgPT4ge1xuXHRcdGlmICh0eXBlb2YgKGV2ZW50W2tleV0pID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRwcm9wZXJ0aWVzW2tleV0gPSB7XG5cdFx0XHRcdGdldDogKCkgPT4gZXZlbnRba2V5XS5iaW5kKGV2ZW50KVxuXHRcdFx0fTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRwcm9wZXJ0aWVzW2tleV0gPSB7XG5cdFx0XHRnZXQ6ICgpID0+IGV2ZW50W2tleV0sXG5cdFx0XHRzZXQ6IHZhbHVlID0+IHtcblx0XHRcdFx0ZXZlbnRba2V5XSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xuXG5cdHByb3BlcnRpZXMuY3VycmVudFRhcmdldCA9IHtcblx0XHRnZXQ6IGN1cnJlbnRUYXJnZXRHZXR0ZXJcblx0fTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoY2F0RXZlbnQsIHByb3BlcnRpZXMpO1xuXHRPYmplY3Quc2VhbChjYXRFdmVudCk7XG5cdE9iamVjdC5mcmVlemUoY2F0RXZlbnQpO1xuXHRyZXR1cm4gY2F0RXZlbnQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHdlIGNhbiBtdXRhdGUgdGhlIHNwZWNpZmllZCBIVE1MIHRhZy5cbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBUaGUgRE9NIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBlbGVtZW50IHNob3VsZCBub3QgYmUgbXV0YXRlZC5cbiAqL1xuZnVuY3Rpb24gaXNUYWdJbW11dGFibGUoZWxlbWVudCkge1xuXHQvLyB0aGVzZSAzIGtpbmRzIG9mIHRhZ3Mgb25jZSBsb2FkZWQgY2FuIG5vdCBiZSByZW1vdmVkXG5cdC8vIG90aGVyd2lzZSBpdCB3aWxsIGNhdXNlIHN0eWxlIG9yIHNjcmlwdCByZWxvYWRpbmdcblx0cmV0dXJuIGVsZW1lbnQubm9kZU5hbWUgPT09IFRBR19OQU1FUy5TQ1JJUFQgfHxcblx0XHRlbGVtZW50Lm5vZGVOYW1lID09PSBUQUdfTkFNRVMuU1RZTEUgfHxcblx0XHRlbGVtZW50Lm5vZGVOYW1lID09PSBUQUdfTkFNRVMuTElOSyAmJlxuXHRcdGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdyZWwnKSA9PT0gJ3N0eWxlc2hlZXQnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERvY3VtZW50UmVuZGVyZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFVSSSA9IHJlcXVpcmUoJ2NhdGJlcnJ5LXVyaScpLlVSSTtcblxuY29uc3QgTU9VU0VfUFJJTUFSWV9LRVkgPSAwO1xuY29uc3QgSFJFRl9BVFRSSUJVVEVfTkFNRSA9ICdocmVmJztcbmNvbnN0IFRBUkdFVF9BVFRSSUJVVEVfTkFNRSA9ICd0YXJnZXQnO1xuY29uc3QgQV9UQUdfTkFNRSA9ICdBJztcbmNvbnN0IEJPRFlfVEFHX05BTUUgPSAnQk9EWSc7XG5cbmNsYXNzIFJlcXVlc3RSb3V0ZXIge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBicm93c2VyIHJlcXVlc3Qgcm91dGVyLlxuXHQgKiBAcGFyYW0ge1NlcnZpY2VMb2NhdG9yfSBsb2NhdG9yIFRoZSBzZXJ2aWNlIGxvY2F0b3IgZm9yIHJlc29sdmluZyBkZXBlbmRlbmNpZXMuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihsb2NhdG9yKSB7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IGV2ZW50IGJ1cy5cblx0XHQgKiBAdHlwZSB7RXZlbnRFbWl0dGVyfVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fZXZlbnRCdXMgPSBsb2NhdG9yLnJlc29sdmUoJ2V2ZW50QnVzJyk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IGJyb3dzZXIgd2luZG93LlxuXHRcdCAqIEB0eXBlIHtXaW5kb3d9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl93aW5kb3cgPSBsb2NhdG9yLnJlc29sdmUoJ3dpbmRvdycpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBkb2N1bWVudCByZW5kZXJlci5cblx0XHQgKiBAdHlwZSB7RG9jdW1lbnRSZW5kZXJlcn1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX2RvY3VtZW50UmVuZGVyZXIgPSBsb2NhdG9yLnJlc29sdmUoJ2RvY3VtZW50UmVuZGVyZXInKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgc3RhdGUgcHJvdmlkZXIuXG5cdFx0ICogQHR5cGUge1N0YXRlUHJvdmlkZXJ9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9zdGF0ZVByb3ZpZGVyID0gbG9jYXRvci5yZXNvbHZlKCdzdGF0ZVByb3ZpZGVyJyk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IGNvbnRleHQgZmFjdG9yeS5cblx0XHQgKiBAdHlwZSB7Q29udGV4dEZhY3Rvcnl9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9jb250ZXh0RmFjdG9yeSA9IGxvY2F0b3IucmVzb2x2ZSgnY29udGV4dEZhY3RvcnknKTtcblxuXHRcdC8qKlxuXHRcdCAqIFRydWUgaWYgY3VycmVudCBicm93c2VyIHN1cHBvcnRzIGhpc3RvcnkgQVBJLlxuXHRcdCAqIEB0eXBlIHtib29sZWFufVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5faXNIaXN0b3J5U3VwcG9ydGVkID0gdGhpcy5fd2luZG93Lmhpc3RvcnkgJiZcblx0XHRcdHRoaXMuX3dpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uO1xuXG5cdFx0Ly8gYWRkIGV2ZW50IGhhbmRsZXJzXG5cdFx0dGhpcy5fd3JhcERvY3VtZW50KCk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IGxvY2F0aW9uLlxuXHRcdCAqIEB0eXBlIHtVUkl9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9sb2NhdGlvbiA9IG5ldyBVUkkodGhpcy5fd2luZG93LmxvY2F0aW9uLnRvU3RyaW5nKCkpO1xuXG5cdFx0Ly8gc2V0IGluaXRpYWwgc3RhdGUgZnJvbSBjdXJyZW50IFVSSVxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgc3RhdGUuXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX3N0YXRlID0gdGhpcy5fc3RhdGVQcm92aWRlci5nZXRTdGF0ZUJ5VXJpKHRoaXMuX2xvY2F0aW9uKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgaW5pdGlhbGl6YXRpb24gZmxhZy5cblx0XHQgKiBAdHlwZSB7Ym9vbGVhbn1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX2lzU3RhdGVJbml0aWFsaXplZCA9IGZhbHNlO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCByZWZlcnJlci5cblx0XHQgKiBAdHlwZSB7VVJJfVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fcmVmZXJyZXIgPSAnJztcblxuXHRcdHRoaXMuX2NoYW5nZVN0YXRlKHRoaXMuX3N0YXRlKVxuXHRcdFx0LmNhdGNoKHJlYXNvbiA9PiB0aGlzLl9oYW5kbGVFcnJvcihyZWFzb24pKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIGFuIGFwcGxpY2F0aW9uIHN0YXRlIGZvciB0aGUgc3BlY2lmaWVkIFVSSS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uU3RyaW5nIFVSSSB0byBnby5cblx0ICogQHBhcmFtIHtib29sZWFuP30gaXNIaXN0b3J5QWN0aW9uIElmIGl0J3MgYSBiYWNrIG9yIGZvcndhcmQgaGlzdG9yeSBhY3Rpb24uXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIGZvciBub3RoaW5nLlxuXHQgKi9cblx0LyogZXNsaW50IGNvbXBsZXhpdHk6IDAgKi9cblx0Z28obG9jYXRpb25TdHJpbmcsIGlzSGlzdG9yeUFjdGlvbikge1xuXG5cdFx0Ly8gd2UgbXVzdCBpbW1lZGlhdGVseSBjaGFuZ2UgdGhlIFVSTCwgdGhlcmVmb3JlIHRoaXMgbWV0aG9kIGlzIHN5bmNocm9ub3VzXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IG5ld0xvY2F0aW9uID0gKG5ldyBVUkkobG9jYXRpb25TdHJpbmcpKS5yZXNvbHZlUmVsYXRpdmUodGhpcy5fbG9jYXRpb24pO1xuXHRcdFx0Y29uc3QgbmV3TG9jYXRpb25TdHJpbmcgPSBuZXdMb2NhdGlvbi50b1N0cmluZygpO1xuXG5cdFx0XHRjb25zdCBjdXJyZW50QXV0aG9yaXR5ID0gdGhpcy5fbG9jYXRpb24uYXV0aG9yaXR5ID9cblx0XHRcdFx0dGhpcy5fbG9jYXRpb24uYXV0aG9yaXR5LnRvU3RyaW5nKCkgOiBudWxsO1xuXHRcdFx0Y29uc3QgbmV3QXV0aG9yaXR5ID0gbmV3TG9jYXRpb24uYXV0aG9yaXR5ID9cblx0XHRcdFx0bmV3TG9jYXRpb24uYXV0aG9yaXR5LnRvU3RyaW5nKCkgOiBudWxsO1xuXG5cdFx0XHQvLyB3ZSBtdXN0IGNoZWNrIGlmIGhpc3RvcnkgQVBJIGlzIHN1cHBvcnRlZCBvciBpZiB0aGlzIGlzIGFuIGV4dGVybmFsIGxpbmtcblx0XHRcdC8vIGJlZm9yZSBtYXBwaW5nIFVSSSB0byBpbnRlcm5hbCBhcHBsaWNhdGlvbiBzdGF0ZVxuXHRcdFx0aWYgKCF0aGlzLl9pc0hpc3RvcnlTdXBwb3J0ZWQgfHxcblx0XHRcdFx0bmV3TG9jYXRpb24uc2NoZW1lICE9PSB0aGlzLl9sb2NhdGlvbi5zY2hlbWUgfHxcblx0XHRcdFx0bmV3QXV0aG9yaXR5ICE9PSBjdXJyZW50QXV0aG9yaXR5KSB7XG5cdFx0XHRcdHRoaXMuX3dpbmRvdy5sb2NhdGlvbi5hc3NpZ24obmV3TG9jYXRpb25TdHJpbmcpO1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGlmIG9ubHkgVVJJIGZyYWdtZW50IGlzIGNoYW5nZWQgd2UgZG9uJ3QgbmVlZCB0byB1cGRhdGVcblx0XHRcdC8vIHRoZSB3aG9sZSBzdGF0ZSBvZiB0aGUgYXBwXG5cdFx0XHRjb25zdCBuZXdRdWVyeSA9IG5ld0xvY2F0aW9uLnF1ZXJ5ID9cblx0XHRcdFx0bmV3TG9jYXRpb24ucXVlcnkudG9TdHJpbmcoKSA6IG51bGw7XG5cdFx0XHRjb25zdCBjdXJyZW50UXVlcnkgPSB0aGlzLl9sb2NhdGlvbi5xdWVyeSA/XG5cdFx0XHRcdHRoaXMuX2xvY2F0aW9uLnF1ZXJ5LnRvU3RyaW5nKCkgOiBudWxsO1xuXG5cdFx0XHRpZiAobmV3TG9jYXRpb24ucGF0aCA9PT0gdGhpcy5fbG9jYXRpb24ucGF0aCAmJlx0bmV3UXVlcnkgPT09IGN1cnJlbnRRdWVyeSkge1xuXHRcdFx0XHR0aGlzLl9sb2NhdGlvbiA9IG5ld0xvY2F0aW9uO1xuXHRcdFx0XHR0aGlzLl93aW5kb3cubG9jYXRpb24uaGFzaCA9IHRoaXMuX2xvY2F0aW9uLmZyYWdtZW50IHx8ICcnO1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHN0YXRlID0gdGhpcy5fc3RhdGVQcm92aWRlci5nZXRTdGF0ZUJ5VXJpKG5ld0xvY2F0aW9uKTtcblx0XHRcdGlmICghc3RhdGUpIHtcblx0XHRcdFx0dGhpcy5fd2luZG93LmxvY2F0aW9uLmFzc2lnbihuZXdMb2NhdGlvblN0cmluZyk7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fc3RhdGUgPSBzdGF0ZTtcblx0XHRcdHRoaXMuX3JlZmVycmVyID0gdGhpcy5fbG9jYXRpb247XG5cdFx0XHR0aGlzLl9sb2NhdGlvbiA9IG5ld0xvY2F0aW9uO1xuXG5cdFx0XHRpZiAoIWlzSGlzdG9yeUFjdGlvbikge1xuXHRcdFx0XHR0aGlzLl93aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoc3RhdGUsICcnLCBuZXdMb2NhdGlvblN0cmluZyk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzLl9jaGFuZ2VTdGF0ZShzdGF0ZSk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGUpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBDaGFuZ2VzIHRoZSBjdXJyZW50IGFwcGxpY2F0aW9uIHN0YXRlIHdpdGggdGhlIG5ldyBsb2NhdGlvbi5cblx0ICogQHBhcmFtIHtPYmplY3R9IHN0YXRlIE5ldyBzdGF0ZS5cblx0ICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgZm9yIG5vdGhpbmcuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfY2hhbmdlU3RhdGUoc3RhdGUpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0Ly8gZm9yIFwibm90IGZvdW5kXCIgc3RhdGVcblx0XHRcdFx0aWYgKHN0YXRlID09PSBudWxsKSB7XG5cdFx0XHRcdFx0dGhpcy5fd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3Qgcm91dGluZ0NvbnRleHQgPSB0aGlzLl9jb250ZXh0RmFjdG9yeS5jcmVhdGUoe1xuXHRcdFx0XHRcdHJlZmVycmVyOiB0aGlzLl9yZWZlcnJlciB8fCB0aGlzLl93aW5kb3cuZG9jdW1lbnQucmVmZXJyZXIsXG5cdFx0XHRcdFx0bG9jYXRpb246IHRoaXMuX2xvY2F0aW9uLFxuXHRcdFx0XHRcdHVzZXJBZ2VudDogdGhpcy5fd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnRcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0aWYgKCF0aGlzLl9pc1N0YXRlSW5pdGlhbGl6ZWQpIHtcblx0XHRcdFx0XHR0aGlzLl9pc1N0YXRlSW5pdGlhbGl6ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLl9kb2N1bWVudFJlbmRlcmVyLmluaXRXaXRoU3RhdGUoc3RhdGUsIHJvdXRpbmdDb250ZXh0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0aGlzLl9kb2N1bWVudFJlbmRlcmVyLnJlbmRlcihzdGF0ZSwgcm91dGluZ0NvbnRleHQpO1xuXHRcdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogV3JhcHMgdGhlIGRvY3VtZW50IHdpdGggcmVxdWlyZWQgZXZlbnRzIHRvIHJvdXRlIHJlcXVlc3RzLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X3dyYXBEb2N1bWVudCgpIHtcblx0XHRpZiAoIXRoaXMuX2lzSGlzdG9yeVN1cHBvcnRlZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIGJlY2F1c2Ugbm93IGxvY2F0aW9uIHdhcyBub3QgY2hhbmdlIHlldCBhbmRcblx0XHQvLyBkaWZmZXJlbnQgYnJvd3NlcnMgaGFuZGxlIGBwb3BzdGF0ZWAgZGlmZmVyZW50bHlcblx0XHQvLyB3ZSBuZWVkIHRvIGRvIHJvdXRlIGluIG5leHQgaXRlcmF0aW9uIG9mIGV2ZW50IGxvb3Bcblx0XHR0aGlzLl93aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCAoKSA9PlxuXHRcdFx0UHJvbWlzZS5yZXNvbHZlKClcblx0XHRcdFx0LnRoZW4oKCkgPT4gdGhpcy5nbyh0aGlzLl93aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKSwgdHJ1ZSkpXG5cdFx0XHRcdC5jYXRjaChyZWFzb24gPT4gdGhpcy5faGFuZGxlRXJyb3IocmVhc29uKSlcblx0XHQpO1xuXG5cdFx0dGhpcy5fd2luZG93LmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG5cdFx0XHRpZiAoZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRpZiAoZXZlbnQudGFyZ2V0LnRhZ05hbWUgPT09IEFfVEFHX05BTUUpIHtcblx0XHRcdFx0dGhpcy5fbGlua0NsaWNrSGFuZGxlcihldmVudCwgZXZlbnQudGFyZ2V0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IGxpbmsgPSBjbG9zZXN0TGluayhldmVudC50YXJnZXQpO1xuXHRcdFx0XHRpZiAoIWxpbmspIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fbGlua0NsaWNrSGFuZGxlcihldmVudCwgbGluayk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyBhIGxpbmsgY2xpY2sgb24gdGhlIHBhZ2UuXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IEV2ZW50LXJlbGF0ZWQgb2JqZWN0LlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgTGluayBlbGVtZW50LlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2xpbmtDbGlja0hhbmRsZXIoZXZlbnQsIGVsZW1lbnQpIHtcblx0XHRjb25zdCB0YXJnZXRBdHRyaWJ1dGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShUQVJHRVRfQVRUUklCVVRFX05BTUUpO1xuXHRcdGlmICh0YXJnZXRBdHRyaWJ1dGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBpZiBtaWRkbGUgbW91c2UgYnV0dG9uIHdhcyBjbGlja2VkXG5cdFx0aWYgKGV2ZW50LmJ1dHRvbiAhPT0gTU9VU0VfUFJJTUFSWV9LRVkgfHxcblx0XHRcdGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQuYWx0S2V5IHx8IGV2ZW50LnNoaWZ0S2V5IHx8IGV2ZW50Lm1ldGFLZXkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBsb2NhdGlvblN0cmluZyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKEhSRUZfQVRUUklCVVRFX05BTUUpO1xuXHRcdGlmICghbG9jYXRpb25TdHJpbmcpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHRoaXMuZ28obG9jYXRpb25TdHJpbmcpXG5cdFx0XHQuY2F0Y2gocmVhc29uID0+IHRoaXMuX2hhbmRsZUVycm9yKHJlYXNvbikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXMgYWxsIGVycm9ycy5cblx0ICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgRXJyb3IgdG8gaGFuZGxlLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2hhbmRsZUVycm9yKGVycm9yKSB7XG5cdFx0dGhpcy5fZXZlbnRCdXMuZW1pdCgnZXJyb3InLCBlcnJvcik7XG5cdH1cbn1cblxuLyoqXG4gKiBGaW5kcyB0aGUgY2xvc2VzdCBhc2NlbmRpbmcgXCJBXCIgZWxlbWVudCBub2RlLlxuICogQHBhcmFtIHtOb2RlfSBlbGVtZW50IERPTSBlbGVtZW50LlxuICogQHJldHVybnMge05vZGV8bnVsbH0gVGhlIGNsb3Nlc3QgXCJBXCIgZWxlbWVudCBvciBudWxsLlxuICovXG5mdW5jdGlvbiBjbG9zZXN0TGluayhlbGVtZW50KSB7XG5cdHdoaWxlIChlbGVtZW50ICYmIGVsZW1lbnQubm9kZU5hbWUgIT09IEFfVEFHX05BTUUgJiZcblx0XHRlbGVtZW50Lm5vZGVOYW1lICE9PSBCT0RZX1RBR19OQU1FKSB7XG5cdFx0ZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcblx0fVxuXHRyZXR1cm4gZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVOYW1lID09PSBBX1RBR19OQU1FID8gZWxlbWVudCA6IG51bGw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVxdWVzdFJvdXRlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGhpZ2ggcmVzb2x1dGlvbiB0aW1lIG9yIHRoZSBkaWZmZXJlbmNlIGJldHdlZW5cblx0ICogcHJldmlvdXMgYW5kIGN1cnJlbnQgdGltZS5cblx0ICogQHBhcmFtIHtBcnJheT99IFByZXZpb3VzIGhpZ2ggcmVzb2x1dGlvbiB0aW1lc3RhbXAuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGhpZ2ggcmVzb2x1dGlvbiB0aW1lLlxuXHQgKi9cblx0Z2V0OiByZXF1aXJlKCdicm93c2VyLXByb2Nlc3MtaHJ0aW1lJyksXG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIHRoZSBoaWdoIHJlc29sdXRpb24gdGltZXN0YW1wIHRvIHRleHQgbWVzc2FnZS5cblx0ICogQHBhcmFtIHtBcnJheX1cblx0ICogQHJldHVybnMge3N0cmluZ30gVGltZSBtZXNzYWdlLlxuXHQgKi9cblx0dG9NZXNzYWdlOiByZXF1aXJlKCdwcmV0dHktaHJ0aW1lJyksXG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGhpZ2ggcmVzb2x1dGlvbiB0aW1lIHRvIG1pbGxpc2Vjb25kcyBudW1iZXIuXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGhyVGltZSBIaWdoIHJlc29sdXRpb24gdGltZSB0dXBsZS5cblx0ICovXG5cdHRvTWlsbGlzZWNvbmRzOiBoclRpbWUgPT4gaHJUaW1lWzBdICogMWUzICsgTWF0aC5yb3VuZChoclRpbWVbMV0gLyAxZTYpXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBtb2R1bGVIZWxwZXIgPSByZXF1aXJlKCcuLi8uLi9saWIvaGVscGVycy9tb2R1bGVIZWxwZXInKTtcbmNvbnN0IHRlbXBsYXRlSGVscGVyID0gcmVxdWlyZSgnLi4vLi4vbGliL2hlbHBlcnMvdGVtcGxhdGVIZWxwZXInKTtcbmNvbnN0IExvYWRlckJhc2UgPSByZXF1aXJlKCcuLi8uLi9saWIvYmFzZS9Mb2FkZXJCYXNlJyk7XG5cbmNsYXNzIENvbXBvbmVudExvYWRlciBleHRlbmRzIExvYWRlckJhc2Uge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBjb21wb25lbnQgbG9hZGVyLlxuXHQgKiBAcGFyYW0ge1NlcnZpY2VMb2NhdG9yfSBsb2NhdG9yIFRoZSBzZXJ2aWNlIGxvY2F0b3IgZm9yIHJlc29sdmluZyBkZXBlbmRlbmNpZXMuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihsb2NhdG9yKSB7XG5cdFx0dmFyIGNvbXBvbmVudFRyYW5zZm9ybXM7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbXBvbmVudFRyYW5zZm9ybXMgPSBsb2NhdG9yLnJlc29sdmVBbGwoJ2NvbXBvbmVudFRyYW5zZm9ybScpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGNvbXBvbmVudFRyYW5zZm9ybXMgPSBbXTtcblx0XHR9XG5cdFx0c3VwZXIobG9jYXRvciwgY29tcG9uZW50VHJhbnNmb3Jtcyk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHNlcnZpY2UgbG9jYXRvci5cblx0XHQgKiBAdHlwZSB7U2VydmljZUxvY2F0b3J9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9zZXJ2aWNlTG9jYXRvciA9IGxvY2F0b3I7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IGV2ZW50IGJ1cy5cblx0XHQgKiBAdHlwZSB7RXZlbnRFbWl0dGVyfVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fZXZlbnRCdXMgPSBsb2NhdG9yLnJlc29sdmUoJ2V2ZW50QnVzJyk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHRlbXBsYXRlIHByb3ZpZGVyIG1hcC5cblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fdGVtcGxhdGVQcm92aWRlcnNCeU5hbWVzID0gdGVtcGxhdGVIZWxwZXJcblx0XHRcdC5yZXNvbHZlVGVtcGxhdGVQcm92aWRlcnNCeU5hbWVzKGxvY2F0b3IpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBtYXAgb2YgbG9hZGVkIGNvbXBvbmVudHMgYnkgbmFtZXMuXG5cdFx0ICogQHR5cGUge09iamVjdH0gTWFwIG9mIGNvbXBvbmVudHMgYnkgbmFtZXMuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9sb2FkZWRDb21wb25lbnRzID0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBMb2FkcyBjb21wb25lbnRzIGluc2lkZSB0aGUgYnJvd3NlciBidW5kbGUuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlPE9iamVjdD59IFRoZSBwcm9taXNlIGZvciBsb2FkZWQgY29tcG9uZW50cy5cblx0ICovXG5cdGxvYWQoKSB7XG5cdFx0aWYgKHRoaXMuX2xvYWRlZENvbXBvbmVudHMpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fbG9hZGVkQ29tcG9uZW50cyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fbG9hZGVkQ29tcG9uZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcblx0XHRcdC50aGVuKCgpID0+IHRoaXMuX3NlcnZpY2VMb2NhdG9yLnJlc29sdmVBbGwoJ2NvbXBvbmVudCcpKVxuXHRcdFx0LmNhdGNoKCgpID0+IFtdKVxuXHRcdFx0LnRoZW4oY29tcG9uZW50cyA9PiB7XG5cdFx0XHRcdGNvbnN0IGNvbXBvbmVudFByb21pc2VzID0gW107XG5cdFx0XHRcdC8vIHRoZSBsaXN0IGlzIGEgc3RhY2ssIHdlIHNob3VsZCByZXZlcnNlIGl0XG5cdFx0XHRcdGNvbXBvbmVudHMuZm9yRWFjaChjb21wb25lbnQgPT4ge1xuXHRcdFx0XHRcdGlmICghY29tcG9uZW50IHx8IHR5cGVvZiAoY29tcG9uZW50KSAhPT0gJ29iamVjdCcpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y29tcG9uZW50UHJvbWlzZXMudW5zaGlmdCh0aGlzLl9wcm9jZXNzQ29tcG9uZW50KGNvbXBvbmVudCkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UuYWxsKGNvbXBvbmVudFByb21pc2VzKTtcblx0XHRcdH0pXG5cdFx0XHQudGhlbihjb21wb25lbnRzID0+IHtcblx0XHRcdFx0Y29tcG9uZW50cy5mb3JFYWNoKGNvbXBvbmVudCA9PiB7XG5cdFx0XHRcdFx0aWYgKCFjb21wb25lbnQpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fbG9hZGVkQ29tcG9uZW50c1tjb21wb25lbnQubmFtZV0gPSBjb21wb25lbnQ7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0aGlzLl9ldmVudEJ1cy5lbWl0KCdhbGxDb21wb25lbnRzTG9hZGVkJywgY29tcG9uZW50cyk7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9sb2FkZWRDb21wb25lbnRzO1xuXHRcdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogUHJvY2Vzc2VzIGEgY29tcG9uZW50IGFuZCBhcHBsaWVzIHJlcXVpcmVkIG9wZXJhdGlvbnMuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnREZXRhaWxzIFRoZSBsb2FkZWQgY29tcG9uZW50IGRldGFpbHMuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlPE9iamVjdD59IFRoZSBwcm9taXNlIGZvciB0aGUgY29tcG9uZW50IG9iamVjdC5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9wcm9jZXNzQ29tcG9uZW50KGNvbXBvbmVudERldGFpbHMpIHtcblx0XHR2YXIgY29tcG9uZW50ID0gT2JqZWN0LmNyZWF0ZShjb21wb25lbnREZXRhaWxzKTtcblxuXHRcdHJldHVybiB0aGlzLl9hcHBseVRyYW5zZm9ybXMoY29tcG9uZW50KVxuXHRcdFx0LnRoZW4odHJhbnNmb3JtZWQgPT4ge1xuXHRcdFx0XHRpZiAoIXRyYW5zZm9ybWVkKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBUcmFuc2Zvcm1hdGlvbiBmb3IgdGhlIFwiJHtjb21wb25lbnREZXRhaWxzLm5hbWV9XCIgY29tcG9uZW50IHJldHVybmVkIGEgYmFkIHJlc3VsdGApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbXBvbmVudCA9IE9iamVjdC5jcmVhdGUodHJhbnNmb3JtZWQpO1xuXHRcdFx0XHRjb21wb25lbnQudGVtcGxhdGVQcm92aWRlciA9IHRoaXMuX3RlbXBsYXRlUHJvdmlkZXJzQnlOYW1lc1tjb21wb25lbnQudGVtcGxhdGVQcm92aWRlck5hbWVdO1xuXHRcdFx0XHRjb21wb25lbnQuZXJyb3JUZW1wbGF0ZVByb3ZpZGVyID0gdGhpcy5fdGVtcGxhdGVQcm92aWRlcnNCeU5hbWVzW2NvbXBvbmVudC5lcnJvclRlbXBsYXRlUHJvdmlkZXJOYW1lXTtcblxuXHRcdFx0XHRpZiAoIWNvbXBvbmVudC50ZW1wbGF0ZVByb3ZpZGVyICYmXG5cdFx0XHRcdFx0XHQoY29tcG9uZW50LmVycm9yVGVtcGxhdGVQcm92aWRlck5hbWUgJiYgIWNvbXBvbmVudC5lcnJvclRlbXBsYXRlUHJvdmlkZXIpKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBUZW1wbGF0ZSBwcm92aWRlciByZXF1aXJlZCBieSB0aGUgY29tcG9uZW50IFwiJHtjb21wb25lbnQubmFtZX1cIiBub3QgZm91bmRgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRlbXBsYXRlSGVscGVyLnJlZ2lzdGVyVGVtcGxhdGVzKGNvbXBvbmVudCk7XG5cblx0XHRcdFx0dGhpcy5fZXZlbnRCdXMuZW1pdCgnY29tcG9uZW50TG9hZGVkJywgY29tcG9uZW50KTtcblx0XHRcdFx0cmV0dXJuIGNvbXBvbmVudDtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2gocmVhc29uID0+IHtcblx0XHRcdFx0dGhpcy5fZXZlbnRCdXMuZW1pdCgnZXJyb3InLCByZWFzb24pO1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgYSBtYXAgb2YgY29tcG9uZW50cyBieSB0aGVpciBuYW1lcy5cblx0ICogQHJldHVybnMge09iamVjdH0gVGhlIG1hcCBvZiB0aGUgY29tcG9uZW50cyBieSB0aGVpciBuYW1lcy5cblx0ICovXG5cdGdldENvbXBvbmVudHNCeU5hbWVzKCkge1xuXHRcdHJldHVybiB0aGlzLl9sb2FkZWRDb21wb25lbnRzIHx8IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnRMb2FkZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IExvYWRlckJhc2UgPSByZXF1aXJlKCcuLi8uLi9saWIvYmFzZS9Mb2FkZXJCYXNlJyk7XG5cbmNsYXNzIFN0b3JlTG9hZGVyIGV4dGVuZHMgTG9hZGVyQmFzZSB7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIHN0b3JlIGxvYWRlci5cblx0ICogQHBhcmFtIHtTZXJ2aWNlTG9jYXRvcn0gbG9jYXRvciBUaGUgc2VydmljZSBsb2NhdG9yIGZvciByZXNvbHZpbmcgc3RvcmVzLlxuXHQgKi9cblx0Y29uc3RydWN0b3IobG9jYXRvcikge1xuXHRcdHZhciBzdG9yZVRyYW5zZm9ybXM7XG5cdFx0dHJ5IHtcblx0XHRcdHN0b3JlVHJhbnNmb3JtcyA9IGxvY2F0b3IucmVzb2x2ZUFsbCgnc3RvcmVUcmFuc2Zvcm0nKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRzdG9yZVRyYW5zZm9ybXMgPSBbXTtcblx0XHR9XG5cdFx0c3VwZXIobG9jYXRvciwgc3RvcmVUcmFuc2Zvcm1zKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgc2VydmljZSBsb2NhdG9yLlxuXHRcdCAqIEB0eXBlIHtTZXJ2aWNlTG9jYXRvcn1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX3NlcnZpY2VMb2NhdG9yID0gbG9jYXRvcjtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgZXZlbnQgYnVzLlxuXHRcdCAqIEB0eXBlIHtFdmVudEVtaXR0ZXJ9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9ldmVudEJ1cyA9IGxvY2F0b3IucmVzb2x2ZSgnZXZlbnRCdXMnKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgc2V0IG9mIGxvYWRlZCBzdG9yZXMuXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX2xvYWRlZFN0b3JlcyA9IG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogTG9hZHMgYWxsIHN0b3JlcyBpbnNpZGUgdGhlIGJyb3dzZXIgYnVuZGxlLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZTxPYmplY3Q+fSBUaGUgcHJvbWlzZSBsb2FkZWQgc3RvcmVzLlxuXHQgKi9cblx0bG9hZCgpIHtcblx0XHRpZiAodGhpcy5fbG9hZGVkU3RvcmVzKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2xvYWRlZFN0b3Jlcyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fbG9hZGVkU3RvcmVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuXHRcdFx0LnRoZW4oKCkgPT4gdGhpcy5fc2VydmljZUxvY2F0b3IucmVzb2x2ZUFsbCgnc3RvcmUnKSlcblx0XHRcdC5jYXRjaCgoKSA9PiBbXSlcblx0XHRcdC50aGVuKHN0b3JlcyA9PiB7XG5cdFx0XHRcdGNvbnN0IHN0b3JlUHJvbWlzZXMgPSBbXTtcblx0XHRcdFx0Ly8gdGhlIGxpc3QgaXMgYSBzdGFjaywgd2Ugc2hvdWxkIHJldmVyc2UgaXRcblx0XHRcdFx0c3RvcmVzLmZvckVhY2goc3RvcmUgPT4ge1xuXHRcdFx0XHRcdGlmICghc3RvcmUgfHwgdHlwZW9mIChzdG9yZSkgIT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN0b3JlUHJvbWlzZXMudW5zaGlmdCh0aGlzLl9nZXRTdG9yZShzdG9yZSkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UuYWxsKHN0b3JlUHJvbWlzZXMpO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKHN0b3JlcyA9PiB7XG5cdFx0XHRcdHN0b3Jlcy5mb3JFYWNoKHN0b3JlID0+IHtcblx0XHRcdFx0XHRpZiAoIXN0b3JlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX2xvYWRlZFN0b3Jlc1tzdG9yZS5uYW1lXSA9IHN0b3JlO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0dGhpcy5fZXZlbnRCdXMuZW1pdCgnYWxsU3RvcmVzTG9hZGVkJywgdGhpcy5fbG9hZGVkU3RvcmVzKTtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9sb2FkZWRTdG9yZXMpO1xuXHRcdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBhc3RvcmUgZnJvbSBzdG9yZSBkZXRhaWxzLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc3RvcmVEZXRhaWxzIFRoZSBzdG9yZSBkZXRhaWxzLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZTxPYmplY3Q+fSBUaGUgcHJvbWlzZSBmb3IgdGhlIHN0b3JlLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2dldFN0b3JlKHN0b3JlRGV0YWlscykge1xuXHRcdHJldHVybiB0aGlzLl9hcHBseVRyYW5zZm9ybXMoc3RvcmVEZXRhaWxzKVxuXHRcdFx0LnRoZW4odHJhbnNmb3JtZWQgPT4ge1xuXHRcdFx0XHRpZiAoIXRyYW5zZm9ybWVkKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBUcmFuc2Zvcm1hdGlvbiBmb3IgdGhlIFwiJHtzdG9yZURldGFpbHMubmFtZX1cIiBzdG9yZSByZXR1cm5lZCBhIGJhZCByZXN1bHRgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9ldmVudEJ1cy5lbWl0KCdzdG9yZUxvYWRlZCcsIHRyYW5zZm9ybWVkKTtcblx0XHRcdFx0cmV0dXJuIHRyYW5zZm9ybWVkO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChyZWFzb24gPT4ge1xuXHRcdFx0XHR0aGlzLl9ldmVudEJ1cy5lbWl0KCdlcnJvcicsIHJlYXNvbik7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBhIHN0b3JlcyBtYXAgYnkgdGhlaXIgbmFtZXMuXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBtYXAgb2Ygc3RvcmVzIGJ5IHRoZWlyIG5hbWVzLlxuXHQgKi9cblx0Z2V0U3RvcmVzQnlOYW1lcygpIHtcblx0XHRyZXR1cm4gdGhpcy5fbG9hZGVkU3RvcmVzIHx8IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTdG9yZUxvYWRlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcHJvcGVydHlIZWxwZXIgPSByZXF1aXJlKCcuLi8uLi9saWIvaGVscGVycy9wcm9wZXJ0eUhlbHBlcicpO1xuY29uc3QgTW9kdWxlQXBpUHJvdmlkZXJCYXNlID0gcmVxdWlyZSgnLi4vLi4vbGliL2Jhc2UvTW9kdWxlQXBpUHJvdmlkZXJCYXNlJyk7XG5cbmNsYXNzIE1vZHVsZUFwaVByb3ZpZGVyIGV4dGVuZHMgTW9kdWxlQXBpUHJvdmlkZXJCYXNlIHtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgbW9kdWxlIEFQSSBwcm92aWRlci5cblx0ICogQHBhcmFtIHtTZXJ2aWNlTG9jYXRvcn0gbG9jYXRvciBUaGUgc2VydmljZSBsb2NhdG9yIGZvciByZXNvbHZpbmcgZGVwZW5kZW5jaWVzLlxuXHQgKi9cblx0Y29uc3RydWN0b3IobG9jYXRvcikge1xuXHRcdHN1cGVyKGxvY2F0b3IpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdHJ1ZSBiZWNhdXNlIHdvcmtzIGluIGEgYnJvd3Nlci5cblx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdCAqL1xuXHRnZXQgaXNCcm93c2VyKCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgZmFsc2UgYmVjYXVzZSB3b3JrcyBpbiBhIGJyb3dzZXIuXG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHQgKi9cblx0Z2V0IGlzU2VydmVyKCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWxvYWRzIHRoZSBwYWdlIGZvciBoYW5kbGluZyBcIm5vdCBmb3VuZFwiIGVycm9yLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSBmb3Igbm90aGluZy5cblx0ICovXG5cdG5vdEZvdW5kKCkge1xuXHRcdGNvbnN0IHdpbmRvdyA9IHRoaXMubG9jYXRvci5yZXNvbHZlKCd3aW5kb3cnKTtcblx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlZGlyZWN0cyBjdXJyZW50IHBhZ2UgdG8gc3BlY2lmaWVkIFVSSS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHVyaVN0cmluZyBVUkkgdG8gcmVkaXJlY3QuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIGZvciBub3RoaW5nLlxuXHQgKi9cblx0cmVkaXJlY3QodXJpU3RyaW5nKSB7XG5cdFx0Y29uc3QgcmVxdWVzdFJvdXRlciA9IHRoaXMubG9jYXRvci5yZXNvbHZlKCdyZXF1ZXN0Um91dGVyJyk7XG5cdFx0cmV0dXJuIHJlcXVlc3RSb3V0ZXIuZ28odXJpU3RyaW5nKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDbGVhcnMgY3VycmVudCBsb2NhdGlvbiBVUkkncyBmcmFnbWVudC5cblx0ICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgZm9yIG5vdGhpbmcuXG5cdCAqL1xuXHRjbGVhckZyYWdtZW50KCkge1xuXHRcdGNvbnN0IHdpbmRvdyA9IHRoaXMubG9jYXRvci5yZXNvbHZlKCd3aW5kb3cnKTtcblx0XHRjb25zdCBwb3NpdGlvbiA9IHdpbmRvdy5kb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcblx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcnO1xuXHRcdHdpbmRvdy5kb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IHBvc2l0aW9uO1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZHVsZUFwaVByb3ZpZGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBTdGF0ZVByb3ZpZGVyQmFzZSA9IHJlcXVpcmUoJy4uLy4uL2xpYi9iYXNlL1N0YXRlUHJvdmlkZXJCYXNlJyk7XG5cbi8qKlxuICogSW1wbGVtZW50cyB0aGUgc3RhdGUgcHJvdmlkZXIgZm9yIHRoZSBzZXJ2ZXIgZW52aXJvbm1lbnQuXG4gKi9cbmNsYXNzIFN0YXRlUHJvdmlkZXIgZXh0ZW5kcyBTdGF0ZVByb3ZpZGVyQmFzZSB7XG5cblx0LyoqXG5cdCAqIEdldHMgYSBsaXN0IG9mIHJvdXRlIGRlc2NyaXB0b3JzLlxuXHQgKiBAcGFyYW0ge1NlcnZpY2VMb2NhdG9yfSBzZXJ2aWNlTG9jYXRvciBUaGUgU2VydmljZSBsb2NhdG9yXG5cdCAqIGZvciBnZXR0aW5nIHJvdXRlIGRlZmluaXRpb25zLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBsaXN0IG9mIFVSSSBtYXBwZXJzLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2dldFJvdXRlRGVzY3JpcHRvcnMoc2VydmljZUxvY2F0b3IpIHtcblx0XHRjb25zdCBkZXNjcmlwdG9ycyA9IFtdO1xuXG5cdFx0bGV0IHJvdXRlRGVmaW5pdGlvbnM7XG5cblx0XHR0cnkge1xuXHRcdFx0cm91dGVEZWZpbml0aW9ucyA9IHNlcnZpY2VMb2NhdG9yLnJlc29sdmVBbGwoJ3JvdXRlRGVmaW5pdGlvbicpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdHJvdXRlRGVmaW5pdGlvbnMgPSBbXTtcblx0XHR9XG5cblx0XHRjb25zdCByb3V0ZURlc2NyaXB0b3JzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXHRcdHRyeSB7XG5cdFx0XHRzZXJ2aWNlTG9jYXRvci5yZXNvbHZlQWxsKCdyb3V0ZURlc2NyaXB0b3InKVxuXHRcdFx0XHQuZm9yRWFjaChkZXNjcmlwdG9yID0+IHtcblx0XHRcdFx0XHRyb3V0ZURlc2NyaXB0b3JzW2Rlc2NyaXB0b3IuZXhwcmVzc2lvbl0gPSBkZXNjcmlwdG9yO1xuXHRcdFx0XHR9KTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHQvLyBub3RoaW5nIHRvIGRvXG5cdFx0fVxuXG5cdFx0cm91dGVEZWZpbml0aW9uc1xuXHRcdFx0LmZvckVhY2gocm91dGUgPT4ge1xuXHRcdFx0XHQvLyBqdXN0IGNvbG9uLXBhcmFtZXRyaXplZCBzdHJpbmdcblx0XHRcdFx0aWYgKHR5cGVvZiAocm91dGUpID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdGRlc2NyaXB0b3JzLnB1c2gocm91dGVEZXNjcmlwdG9yc1tyb3V0ZV0pO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGV4dGVuZGVkIGNvbG9uLXBhcmFtZXRyaXplZCBtYXBwZXJcblx0XHRcdFx0aWYgKHR5cGVvZiAocm91dGUpID09PSAnb2JqZWN0JyAmJlxuXHRcdFx0XHRcdFx0dHlwZW9mIChyb3V0ZS5leHByZXNzaW9uKSA9PT0gJ3N0cmluZycpIHtcblxuXHRcdFx0XHRcdGNvbnN0IGRlc2NyaXB0b3IgPSByb3V0ZURlc2NyaXB0b3JzW3JvdXRlLmV4cHJlc3Npb25dO1xuXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiAocm91dGUubmFtZSkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0XHRkZXNjcmlwdG9yLm5hbWUgPSByb3V0ZS5uYW1lO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChyb3V0ZS5tYXAgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuXHRcdFx0XHRcdFx0ZGVzY3JpcHRvci5tYXAgPSByb3V0ZS5tYXA7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0ZGVzY3JpcHRvcnMucHVzaChkZXNjcmlwdG9yKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyByZWd1bGFyIGV4cHJlc3Npb24gbWFwcGVyXG5cdFx0XHRcdGlmICh0eXBlb2YgKHJvdXRlKSA9PT0gJ29iamVjdCcgJiZcblx0XHRcdFx0XHQocm91dGUuZXhwcmVzc2lvbiBpbnN0YW5jZW9mIFJlZ0V4cCkgJiZcblx0XHRcdFx0XHQocm91dGUubWFwIGluc3RhbmNlb2YgRnVuY3Rpb24pKSB7XG5cdFx0XHRcdFx0ZGVzY3JpcHRvcnMucHVzaChyb3V0ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0cmV0dXJuIGRlc2NyaXB0b3JzO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdGVQcm92aWRlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcHJvcGVydHlIZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcnMvcHJvcGVydHlIZWxwZXInKTtcblxuY2xhc3MgQ29udGV4dEZhY3Rvcnkge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBjb250ZXh0IGZhY3RvcnkuXG5cdCAqIEBwYXJhbSB7U2VydmljZUxvY2F0b3J9IGxvY2F0b3IgTG9jYXRvciBmb3IgcmVzb2x2aW5nIGRlcGVuZGVuY2llcy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGxvY2F0b3IpIHtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgc2VydmljZSBsb2NhdG9yLlxuXHRcdCAqIEB0eXBlIHtTZXJ2aWNlTG9jYXRvcn1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX3NlcnZpY2VMb2NhdG9yID0gbG9jYXRvcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IGNvbnRleHQgZm9yIG1vZHVsZXMuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBhZGRpdGlvbmFsIEFkZGl0aW9uYWwgcGFyYW1ldGVycy5cblx0ICogQHBhcmFtIHtVUkl9IGFkZGl0aW9uYWwucmVmZXJyZXIgQ3VycmVudCByZWZlcnJlci5cblx0ICogQHBhcmFtIHtVUkl9IGFkZGl0aW9uYWwubG9jYXRpb24gQ3VycmVudCBsb2NhdGlvbi5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGFkZGl0aW9uYWwudXNlckFnZW50IEN1cnJlbnQgdXNlciBhZ2VudC5cblx0ICovXG5cdGNyZWF0ZShhZGRpdGlvbmFsKSB7XG5cdFx0Y29uc3QgYXBpUHJvdmlkZXIgPSB0aGlzLl9zZXJ2aWNlTG9jYXRvci5yZXNvbHZlKCdtb2R1bGVBcGlQcm92aWRlcicpO1xuXHRcdGNvbnN0IGNvbnRleHQgPSBPYmplY3QuY3JlYXRlKGFwaVByb3ZpZGVyKTtcblx0XHRPYmplY3Qua2V5cyhhZGRpdGlvbmFsKVxuXHRcdFx0LmZvckVhY2goa2V5ID0+IHByb3BlcnR5SGVscGVyLmRlZmluZVJlYWRPbmx5KGNvbnRleHQsIGtleSwgYWRkaXRpb25hbFtrZXldKSk7XG5cdFx0cmV0dXJuIGNvbnRleHQ7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb250ZXh0RmFjdG9yeTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5cbmNsYXNzIFNlcmlhbFdyYXBwZXIge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBzZXJpYWwgd3JhcHBlciBmb3IgcHJvbWlzZXMuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpIHtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgZXZlbnQgZW1pdHRlci5cblx0XHQgKiBAdHlwZSB7RXZlbnRFbWl0dGVyfVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fZW1pdHRlciA9IG5ldyBldmVudHMuRXZlbnRFbWl0dGVyKCk7XG5cdFx0dGhpcy5fZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoMCk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHNldCBvZiBuYW1lZCBtZXRob2RzIHRvIGludm9rZS5cblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fdG9JbnZva2UgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBzZXQgb2YgZmxhZ3MgaWYgdGhlIG1ldGhvZCBpcyBpbiBwcm9ncmVzcy5cblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5faW5Qcm9ncmVzcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkcyBhIG1ldGhvZCB0byB0aGUgc2V0LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBNZXRob2QgbmFtZS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gdG9JbnZva2UgRnVuY3Rpb24gdGhhdCByZXR1cm5zIHByb21pc2UuXG5cdCAqL1xuXHRhZGQobmFtZSwgdG9JbnZva2UpIHtcblx0XHR0aGlzLl90b0ludm9rZVtuYW1lXSA9IHRvSW52b2tlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgbWV0aG9kIHdpdGggc3VjaCBuYW1lIHdhcyByZWdpc3RlcmVkIHRvIHRoZSBzZXQuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE5hbWUgb2YgbWV0aG9kLlxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBtZXRob2QgbmFtZSBpcyByZWdpc3RlcmVkLlxuXHQgKi9cblx0aXNSZWdpc3RlcmVkKG5hbWUpIHtcblx0XHRyZXR1cm4gdHlwZW9mICh0aGlzLl90b0ludm9rZVtuYW1lXSkgPT09ICdmdW5jdGlvbic7XG5cdH1cblxuXHQvKipcblx0ICogSW52b2tlcyBhIG1ldGhvZCB3aXRob3V0IGNvbmN1cnJlbmN5LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBNZXRob2QgbmFtZS5cblx0ICogQHJldHVybnMge1Byb21pc2U8T2JqZWN0Pn0gUHJvbWlzZSBmb3IgcmVzdWx0LlxuXHQgKi9cblx0aW52b2tlKG5hbWUpIHtcblx0XHRpZiAoIXRoaXMuaXNSZWdpc3RlcmVkKG5hbWUpKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdUaGVyZSBpcyBubyBzdWNoIHJlZ2lzdGVyZWQgbWV0aG9kJykpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9pblByb2dyZXNzW25hbWVdKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9lbWl0dGVyLm9uY2UobmFtZSwgZnVsZmlsbCk7XG5cdFx0XHRcdHRoaXMuX2VtaXR0ZXIub25jZShgJHtuYW1lfS0tZXJyb3JgLCByZWplY3QpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5faW5Qcm9ncmVzc1tuYW1lXSA9IHRydWU7XG5cdFx0dGhpcy5fdG9JbnZva2VbbmFtZV0oKVxuXHRcdFx0LnRoZW4ocmVzdWx0ID0+IHtcblx0XHRcdFx0dGhpcy5fZW1pdHRlci5lbWl0KG5hbWUsIHJlc3VsdCk7XG5cdFx0XHRcdHRoaXMuX2luUHJvZ3Jlc3NbbmFtZV0gPSBudWxsO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChyZWFzb24gPT4ge1xuXHRcdFx0XHR0aGlzLl9lbWl0dGVyLmVtaXQoYCR7bmFtZX0tLWVycm9yYCwgcmVhc29uKTtcblx0XHRcdFx0dGhpcy5faW5Qcm9ncmVzc1tuYW1lXSA9IG51bGw7XG5cdFx0XHR9KTtcblxuXHRcdHJldHVybiB0aGlzLmludm9rZShuYW1lKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlcmlhbFdyYXBwZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFNlcmlhbFdyYXBwZXIgPSByZXF1aXJlKCcuL1NlcmlhbFdyYXBwZXInKTtcbmNvbnN0IG1vZHVsZUhlbHBlciA9IHJlcXVpcmUoJy4vaGVscGVycy9tb2R1bGVIZWxwZXInKTtcbmNvbnN0IHByb3BlcnR5SGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXJzL3Byb3BlcnR5SGVscGVyJyk7XG5cbmNvbnN0IERFRkFVTFRfTElGRVRJTUUgPSA2MDAwMDtcblxuY2xhc3MgU3RvcmVEaXNwYXRjaGVyIHtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgc3RvcmUgZGlzcGF0Y2hlci5cblx0ICogQHBhcmFtIHtTZXJ2aWNlTG9jYXRvcn0gbG9jYXRvciBMb2NhdG9yIGZvciByZXNvbHZpbmcgZGVwZW5kZW5jaWVzLlxuXHQgKi9cblx0Y29uc3RydWN0b3IobG9jYXRvcikge1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBzZXJ2aWNlIGxvY2F0b3IuXG5cdFx0ICogQHR5cGUge1NlcnZpY2VMb2NhdG9yfVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fc2VydmljZUxvY2F0b3IgPSBsb2NhdG9yO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBzdG9yZSBsb2FkZXIuXG5cdFx0ICogQHR5cGUge1N0b3JlTG9hZGVyfVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fc3RvcmVMb2FkZXIgPSBsb2NhdG9yLnJlc29sdmUoJ3N0b3JlTG9hZGVyJyk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IGV2ZW50IGJ1cy5cblx0XHQgKiBAdHlwZSB7RXZlbnRFbWl0dGVyfVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fZXZlbnRCdXMgPSBsb2NhdG9yLnJlc29sdmUoJ2V2ZW50QnVzJyk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IG1hcCBvZiBhbGwgc3RvcmUgaW5zdGFuY2VzLlxuXHRcdCAqIEB0eXBlIHtudWxsfVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fc3RvcmVJbnN0YW5jZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBtYXAgb2YgbGFzdCBkYXRhIGZvciBlYWNoIHN0b3JlLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9sYXN0RGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IG1hcCBvZiBsYXN0IHN0YXRlIG9mIHN0b3JlIGRpc3BhdGNoZXIuXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX2xhc3RTdGF0ZSA9IG51bGw7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHNldCBvZiBzdG9yZSBkZXBlbmRlbmN5IGdyYXBoLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9kZXBlbmRhbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgc2VyaWFsIHdyYXBwZXIuXG5cdFx0ICogQHR5cGUge1NlcmlhbFdyYXBwZXJ9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9zZXJpYWxXcmFwcGVyID0gbmV3IFNlcmlhbFdyYXBwZXIoKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgYmFzaWMgY29udGV4dCBmb3IgYWxsIHN0b3JlIGNvbnRleHRzLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9jdXJyZW50QmFzaWNDb250ZXh0ID0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHN0b3JlIGRhdGEgYW5kIGNyZWF0ZXMgYSBzdG9yZSBpbnN0YW5jZSBpZiByZXF1aXJlZC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0b3JlTmFtZSBOYW1lIG9mIHN0b3JlLlxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBTdG9yZSdzIGRhdGEuXG5cdCAqL1xuXHRnZXRTdG9yZURhdGEoc3RvcmVOYW1lKSB7XG5cdFx0aWYgKCF0aGlzLl9sYXN0U3RhdGUpIHtcblx0XHRcdHJldHVybiB0aGlzLl9lcnJvclN0YXRlKCk7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgKHN0b3JlTmFtZSkgIT09ICdzdHJpbmcnKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXHRcdH1cblx0XHRpZiAoc3RvcmVOYW1lIGluIHRoaXMuX2xhc3REYXRhKSB7XG5cdFx0XHRjb25zdCBleGlzdFRpbWUgPSBEYXRlLm5vdygpIC0gdGhpcy5fbGFzdERhdGFbc3RvcmVOYW1lXS5jcmVhdGVkQXQ7XG5cdFx0XHRpZiAoZXhpc3RUaW1lIDw9IHRoaXMuX2xhc3REYXRhW3N0b3JlTmFtZV0ubGlmZXRpbWUpIHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9sYXN0RGF0YVtzdG9yZU5hbWVdLmRhdGEpO1xuXHRcdFx0fVxuXHRcdFx0ZGVsZXRlIHRoaXMuX2xhc3REYXRhW3N0b3JlTmFtZV07XG5cdFx0fVxuXHRcdHRoaXMuX2V2ZW50QnVzLmVtaXQoJ3N0b3JlRGF0YUxvYWQnLCB7XG5cdFx0XHRuYW1lOiBzdG9yZU5hbWVcblx0XHR9KTtcblxuXHRcdGNvbnN0IHN0b3JlID0gdGhpcy5nZXRTdG9yZShzdG9yZU5hbWUpO1xuXHRcdGlmICghc3RvcmUpIHtcblx0XHRcdHJldHVybiB0aGlzLl9lcnJvclN0b3JlTm90Rm91bmQoc3RvcmVOYW1lKTtcblx0XHR9XG5cblx0XHRjb25zdCBsaWZldGltZSA9IHR5cGVvZiAoc3RvcmUuJGxpZmV0aW1lKSA9PT0gJ251bWJlcicgP1xuXHRcdFx0c3RvcmUuJGxpZmV0aW1lIDpcblx0XHRcdERFRkFVTFRfTElGRVRJTUU7XG5cblx0XHRyZXR1cm4gdGhpcy5fc2VyaWFsV3JhcHBlci5pbnZva2Uoc3RvcmVOYW1lKVxuXHRcdFx0LnRoZW4oZGF0YSA9PiB7XG5cdFx0XHRcdHRoaXMuX2xhc3REYXRhW3N0b3JlTmFtZV0gPSB7XG5cdFx0XHRcdFx0ZGF0YSxcblx0XHRcdFx0XHRsaWZldGltZSxcblx0XHRcdFx0XHRjcmVhdGVkQXQ6IERhdGUubm93KClcblx0XHRcdFx0fTtcblx0XHRcdFx0dGhpcy5fZXZlbnRCdXMuZW1pdCgnc3RvcmVEYXRhTG9hZGVkJywge1xuXHRcdFx0XHRcdG5hbWU6IHN0b3JlTmFtZSxcblx0XHRcdFx0XHRkYXRhLFxuXHRcdFx0XHRcdGxpZmV0aW1lXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNlbmRzIGFuIGFjdGlvbiB0byB0aGUgc3BlY2lmaWVkIHN0b3JlIGFuZCByZXNvbHZlcyBwcm9taXNlcyBpbiB0aGUgc2VyaWFsIG1vZGUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdG9yZU5hbWUgTmFtZSBvZiB0aGUgc3RvcmUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25OYW1lIE5hbWUgb2YgdGhlIGFjdGlvbi5cblx0ICogQHBhcmFtIHtPYmplY3R9IGFyZ3MgQWN0aW9uIGFyZ3VtZW50cy5cblx0ICogQHJldHVybnMge1Byb21pc2U8Kj59IFByb21pc2UgZm9yIGFuIGFjdGlvbiBoYW5kbGluZyByZXN1bHQuXG5cdCAqL1xuXHRzZW5kQWN0aW9uKHN0b3JlTmFtZSwgYWN0aW9uTmFtZSwgYXJncykge1xuXHRcdGlmICghdGhpcy5fbGFzdFN0YXRlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZXJyb3JTdGF0ZSgpO1xuXHRcdH1cblx0XHRjb25zdCBhY3Rpb25EZXRhaWxzID0ge1xuXHRcdFx0c3RvcmVOYW1lLFxuXHRcdFx0YWN0aW9uTmFtZSxcblx0XHRcdGFyZ3Ncblx0XHR9O1xuXHRcdHRoaXMuX2V2ZW50QnVzLmVtaXQoJ2FjdGlvblNlbmQnLCBhY3Rpb25EZXRhaWxzKTtcblxuXHRcdGNvbnN0IHN0b3JlID0gdGhpcy5nZXRTdG9yZShzdG9yZU5hbWUpO1xuXHRcdGlmICghc3RvcmUpIHtcblx0XHRcdHJldHVybiB0aGlzLl9lcnJvclN0b3JlTm90Rm91bmQoc3RvcmVOYW1lKTtcblx0XHR9XG5cblx0XHRjb25zdCBoYW5kbGVNZXRob2QgPSBtb2R1bGVIZWxwZXIuZ2V0TWV0aG9kVG9JbnZva2UoXG5cdFx0XHRzdG9yZSwgJ2hhbmRsZScsIGFjdGlvbk5hbWVcblx0XHQpO1xuXHRcdHJldHVybiBtb2R1bGVIZWxwZXIuZ2V0U2FmZVByb21pc2UoKCkgPT4gaGFuZGxlTWV0aG9kKGFyZ3MpKVxuXHRcdFx0LnRoZW4ocmVzdWx0ID0+IHtcblx0XHRcdFx0dGhpcy5fZXZlbnRCdXMuZW1pdCgnYWN0aW9uU2VudCcsIGFjdGlvbkRldGFpbHMpO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyBhIG5ldyBzdGF0ZSB0byB0aGUgc3RvcmUgZGlzcGF0Y2hlciBhbmQgaW52b2tlcyB0aGUgXCJjaGFuZ2VkXCIgbWV0aG9kIGZvciBhbGxcblx0ICogc3RvcmVzIHdoaWNoIHN0YXRlIGhhcyBiZWVuIGNoYW5nZWQuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbWV0ZXJzIE1hcCBvZiBuZXcgcGFyYW1ldGVycy5cblx0ICogQHBhcmFtIHtPYmplY3R9IGJhc2ljQ29udGV4dCBCYXNpYyBjb250ZXh0IGZvciBhbGwgc3RvcmVzLlxuXHQgKiBAcmV0dXJucyB7QXJyYXk8c3RyaW5nPn0gTmFtZXMgb2Ygc3RvcmVzIHRoYXQgaGF2ZSBiZWVuIGNoYW5nZWQuXG5cdCAqL1xuXHRzZXRTdGF0ZShwYXJhbWV0ZXJzLCBiYXNpY0NvbnRleHQpIHtcblx0XHRwYXJhbWV0ZXJzID0gcGFyYW1ldGVycyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdFx0Y29uc3Qgc3RvcmVzID0gdGhpcy5fc3RvcmVMb2FkZXIuZ2V0U3RvcmVzQnlOYW1lcygpO1xuXHRcdGNvbnN0IHBhcmFtZXRlck5hbWVzID0gT2JqZWN0LmtleXMocGFyYW1ldGVycyk7XG5cdFx0cGFyYW1ldGVyTmFtZXMuZm9yRWFjaChzdG9yZU5hbWUgPT4ge1xuXHRcdFx0aWYgKCEoc3RvcmVOYW1lIGluIHN0b3JlcykpIHtcblx0XHRcdFx0dGhpcy5fZXZlbnRCdXMuZW1pdCgnd2FybicsIGBTdG9yZSBcIiR7c3RvcmVOYW1lfVwiIGRvZXMgbm90IGV4aXN0IChtaWdodCBiZSBhIHR5cG8gaW4gYSByb3V0ZSlgKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmICghdGhpcy5fbGFzdFN0YXRlKSB7XG5cdFx0XHR0aGlzLl9jdXJyZW50QmFzaWNDb250ZXh0ID0gYmFzaWNDb250ZXh0O1xuXHRcdFx0dGhpcy5fbGFzdFN0YXRlID0gcGFyYW1ldGVycztcblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cblx0XHQvLyBzb21lIHN0b3JlJ3MgcGFyYW1ldGVycyBjYW4gYmUgcmVtb3ZlZCBzaW5jZSBsYXN0IHRpbWVcblx0XHRjb25zdCBjaGFuZ2VkID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXHRcdE9iamVjdC5rZXlzKHRoaXMuX2xhc3RTdGF0ZSlcblx0XHRcdC5maWx0ZXIoc3RvcmVOYW1lID0+ICEoc3RvcmVOYW1lIGluIHBhcmFtZXRlcnMpKVxuXHRcdFx0LmZvckVhY2gobmFtZSA9PiB7XG5cdFx0XHRcdGNoYW5nZWRbbmFtZV0gPSB0cnVlO1xuXHRcdFx0fSk7XG5cblx0XHRwYXJhbWV0ZXJOYW1lc1xuXHRcdFx0LmZvckVhY2goc3RvcmVOYW1lID0+IHtcblx0XHRcdFx0Ly8gbmV3IHBhcmFtZXRlcnMgd2VyZSBzZXQgZm9yIHN0b3JlXG5cdFx0XHRcdGlmICghKHN0b3JlTmFtZSBpbiB0aGlzLl9sYXN0U3RhdGUpKSB7XG5cdFx0XHRcdFx0Y2hhbmdlZFtzdG9yZU5hbWVdID0gdHJ1ZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBuZXcgYW5kIGxhc3QgcGFyYW1ldGVycyBoYXMgZGlmZmVyZW50IHZhbHVlc1xuXHRcdFx0XHRjb25zdCBsYXN0UGFyYW1ldGVyTmFtZXMgPSBPYmplY3Qua2V5cyh0aGlzLl9sYXN0U3RhdGVbc3RvcmVOYW1lXSk7XG5cdFx0XHRcdGNvbnN0IGN1cnJlbnRQYXJhbWV0ZXJOYW1lcyA9IE9iamVjdC5rZXlzKHBhcmFtZXRlcnNbc3RvcmVOYW1lXSk7XG5cblx0XHRcdFx0aWYgKGN1cnJlbnRQYXJhbWV0ZXJOYW1lcy5sZW5ndGggIT09IGxhc3RQYXJhbWV0ZXJOYW1lcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRjaGFuZ2VkW3N0b3JlTmFtZV0gPSB0cnVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGN1cnJlbnRQYXJhbWV0ZXJOYW1lcy5ldmVyeShwYXJhbWV0ZXJOYW1lID0+IHtcblx0XHRcdFx0XHRpZiAocGFyYW1ldGVyc1tzdG9yZU5hbWVdW3BhcmFtZXRlck5hbWVdICE9PVxuXHRcdFx0XHRcdFx0dGhpcy5fbGFzdFN0YXRlW3N0b3JlTmFtZV1bcGFyYW1ldGVyTmFtZV0pIHtcblx0XHRcdFx0XHRcdGNoYW5nZWRbc3RvcmVOYW1lXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0dGhpcy5fbGFzdFN0YXRlID0gcGFyYW1ldGVycztcblx0XHRpZiAodGhpcy5fY3VycmVudEJhc2ljQ29udGV4dCAhPT0gYmFzaWNDb250ZXh0KSB7XG5cdFx0XHR0aGlzLl9jdXJyZW50QmFzaWNDb250ZXh0ID0gYmFzaWNDb250ZXh0O1xuXHRcdFx0T2JqZWN0LmtleXModGhpcy5fc3RvcmVJbnN0YW5jZXMpXG5cdFx0XHRcdC5mb3JFYWNoKHN0b3JlTmFtZSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5fc3RvcmVJbnN0YW5jZXNbc3RvcmVOYW1lXS4kY29udGV4dCA9IHRoaXMuX2dldFN0b3JlQ29udGV4dChzdG9yZU5hbWUpO1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cblx0XHRjb25zdCBjaGFuZ2VkU3RvcmVOYW1lcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdFx0T2JqZWN0LmtleXMoY2hhbmdlZClcblx0XHRcdC5mb3JFYWNoKHN0b3JlTmFtZSA9PiB7XG5cdFx0XHRcdGNvbnN0IHN0b3JlID0gdGhpcy5nZXRTdG9yZShzdG9yZU5hbWUpO1xuXHRcdFx0XHRpZiAoIXN0b3JlKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHN0b3JlLiRjb250ZXh0LmNoYW5nZWQoKVxuXHRcdFx0XHRcdC5mb3JFYWNoKG5hbWUgPT4ge1xuXHRcdFx0XHRcdFx0Y2hhbmdlZFN0b3JlTmFtZXNbbmFtZV0gPSB0cnVlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHR0aGlzLl9ldmVudEJ1cy5lbWl0KCdzdGF0ZUNoYW5nZWQnLCB7XG5cdFx0XHRvbGRTdGF0ZTogdGhpcy5fbGFzdFN0YXRlLFxuXHRcdFx0bmV3U3RhdGU6IHBhcmFtZXRlcnNcblx0XHR9KTtcblx0XHRyZXR1cm4gT2JqZWN0LmtleXMoY2hhbmdlZFN0b3JlTmFtZXMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgYSBjb250ZXh0IGZvciBhIHN0b3JlIHVzaW5nIGNvbXBvbmVudCdzIGNvbnRleHQgYXMgYSBwcm90b3R5cGUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdG9yZU5hbWUgTmFtZSBvZiB0aGUgc3RvcmUuXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IFN0b3JlIGNvbnRleHQuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfZ2V0U3RvcmVDb250ZXh0KHN0b3JlTmFtZSkge1xuXHRcdGNvbnN0IHN0b3JlQ29udGV4dCA9IE9iamVjdC5jcmVhdGUodGhpcy5fY3VycmVudEJhc2ljQ29udGV4dCk7XG5cdFx0cHJvcGVydHlIZWxwZXIuZGVmaW5lUmVhZE9ubHkoc3RvcmVDb250ZXh0LCAnbmFtZScsIHN0b3JlTmFtZSk7XG5cdFx0cHJvcGVydHlIZWxwZXIuZGVmaW5lUmVhZE9ubHkoXG5cdFx0XHRzdG9yZUNvbnRleHQsICdzdGF0ZScsIHRoaXMuX2xhc3RTdGF0ZVtzdG9yZU5hbWVdIHx8IE9iamVjdC5jcmVhdGUobnVsbClcblx0XHQpO1xuXG5cdFx0c3RvcmVDb250ZXh0LmNoYW5nZWQgPSAoKSA9PiB7XG5cdFx0XHRjb25zdCB3YWxrZWQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRcdFx0dmFyIHRvQ2hhbmdlID0gW3N0b3JlTmFtZV07XG5cblx0XHRcdHdoaWxlICh0b0NoYW5nZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGNvbnN0IGN1cnJlbnQgPSB0b0NoYW5nZS5zaGlmdCgpO1xuXHRcdFx0XHRpZiAoY3VycmVudCBpbiB3YWxrZWQpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHR3YWxrZWRbY3VycmVudF0gPSB0cnVlO1xuXHRcdFx0XHRpZiAoY3VycmVudCBpbiB0aGlzLl9kZXBlbmRhbnRzKSB7XG5cdFx0XHRcdFx0dG9DaGFuZ2UgPSB0b0NoYW5nZS5jb25jYXQoT2JqZWN0LmtleXModGhpcy5fZGVwZW5kYW50c1tjdXJyZW50XSkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRlbGV0ZSB0aGlzLl9sYXN0RGF0YVtjdXJyZW50XTtcblx0XHRcdFx0dGhpcy5fZXZlbnRCdXMuZW1pdCgnc3RvcmVDaGFuZ2VkJywgY3VycmVudCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gT2JqZWN0LmtleXMod2Fsa2VkKTtcblx0XHR9O1xuXG5cdFx0c3RvcmVDb250ZXh0LmdldFN0b3JlRGF0YSA9IHNvdXJjZVN0b3JlTmFtZSA9PiBzb3VyY2VTdG9yZU5hbWUgPT09IHN0b3JlTmFtZSA/XG5cdFx0XHRQcm9taXNlLnJlc29sdmUobnVsbCkgOlxuXHRcdFx0dGhpcy5nZXRTdG9yZURhdGEoc291cmNlU3RvcmVOYW1lKTtcblxuXHRcdHN0b3JlQ29udGV4dC5zZXREZXBlbmRlbmN5ID0gbmFtZSA9PiB7XG5cdFx0XHRpZiAoIShuYW1lIGluIHRoaXMuX2RlcGVuZGFudHMpKSB7XG5cdFx0XHRcdHRoaXMuX2RlcGVuZGFudHNbbmFtZV0gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZGVwZW5kYW50c1tuYW1lXVtzdG9yZU5hbWVdID0gdHJ1ZTtcblx0XHR9O1xuXHRcdHN0b3JlQ29udGV4dC51bnNldERlcGVuZGVuY3kgPSBuYW1lID0+IHtcblx0XHRcdGlmICghKG5hbWUgaW4gdGhpcy5fZGVwZW5kYW50cykpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0ZGVsZXRlIHRoaXMuX2RlcGVuZGFudHNbbmFtZV1bc3RvcmVOYW1lXTtcblx0XHR9O1xuXHRcdHN0b3JlQ29udGV4dC5zZW5kQWN0aW9uID0gKHN0b3JlTmFtZSwgbmFtZSwgYXJncykgPT4gdGhpcy5zZW5kQWN0aW9uKHN0b3JlTmFtZSwgbmFtZSwgYXJncyk7XG5cblx0XHRyZXR1cm4gc3RvcmVDb250ZXh0O1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgYSBzdG9yZSBpbnN0YW5jZSBhbmQgY3JlYXRlcyBpdCBpZiByZXF1aXJlZC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0b3JlTmFtZSBOYW1lIG9mIHRoZSBzdG9yZS5cblx0ICogQHJldHVybnMge1Byb21pc2U8T2JqZWN0Pn0gUHJvbWlzZSBmb3IgdGhlIHN0b3JlLlxuXHQgKi9cblx0Z2V0U3RvcmUoc3RvcmVOYW1lKSB7XG5cdFx0aWYgKCFzdG9yZU5hbWUpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0XHRjb25zdCBzdG9yZSA9IHRoaXMuX3N0b3JlSW5zdGFuY2VzW3N0b3JlTmFtZV07XG5cdFx0aWYgKHN0b3JlKSB7XG5cdFx0XHRyZXR1cm4gc3RvcmU7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgc3RvcmVzID0gdGhpcy5fc3RvcmVMb2FkZXIuZ2V0U3RvcmVzQnlOYW1lcygpO1xuXHRcdGNvbnN0IGNvbmZpZyA9IHRoaXMuX3NlcnZpY2VMb2NhdG9yLnJlc29sdmUoJ2NvbmZpZycpO1xuXHRcdGlmICghKHN0b3JlTmFtZSBpbiBzdG9yZXMpKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRjb25zdCBDb21wb25lbnRDb25zdHJ1Y3RvciA9IHN0b3Jlc1tzdG9yZU5hbWVdLmNvbnN0cnVjdG9yO1xuXHRcdENvbXBvbmVudENvbnN0cnVjdG9yLnByb3RvdHlwZS4kY29udGV4dCA9IHRoaXMuX2dldFN0b3JlQ29udGV4dChzdG9yZU5hbWUpO1xuXHRcdHRoaXMuX3N0b3JlSW5zdGFuY2VzW3N0b3JlTmFtZV0gPSBuZXcgQ29tcG9uZW50Q29uc3RydWN0b3IodGhpcy5fc2VydmljZUxvY2F0b3IpO1xuXHRcdHRoaXMuX3N0b3JlSW5zdGFuY2VzW3N0b3JlTmFtZV0uJGNvbnRleHQgPSBDb21wb25lbnRDb25zdHJ1Y3Rvci5wcm90b3R5cGUuJGNvbnRleHQ7XG5cblx0XHR0aGlzLl9zZXJpYWxXcmFwcGVyLmFkZChzdG9yZU5hbWUsICgpID0+IHtcblx0XHRcdGNvbnN0IGxvYWRNZXRob2QgPSBtb2R1bGVIZWxwZXIuZ2V0TWV0aG9kVG9JbnZva2UoXG5cdFx0XHRcdHRoaXMuX3N0b3JlSW5zdGFuY2VzW3N0b3JlTmFtZV0sICdsb2FkJ1xuXHRcdFx0KTtcblx0XHRcdHJldHVybiBtb2R1bGVIZWxwZXIuZ2V0U2FmZVByb21pc2UobG9hZE1ldGhvZCk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHRoaXMuX3N0b3JlSW5zdGFuY2VzW3N0b3JlTmFtZV07XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBhbiBlcnJvciBtZXNzYWdlIGFib3V0IGEgbm90IGZvdW5kIHN0b3JlLlxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IG5hbWUgVGhlIHN0b3JlIG5hbWUuXG5cdCAqIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBUaGUgcHJvbWlzZSBmb3IgdGhlIGVycm9yLlxuXHQgKi9cblx0X2Vycm9yU3RvcmVOb3RGb3VuZChuYW1lKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihgU3RvcmUgXCIke25hbWV9XCIgbm90IGZvdW5kYCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gZXJyb3IgbWVzc2FnZSBhYm91dCBhbiB1bmluaXRpYWxpemVkIHN0YXRlLlxuXHQgKiBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gVGhlIHByb21pc2UgZm9yIHRoZSBlcnJvci5cblx0ICovXG5cdF9lcnJvclN0YXRlKCkge1xuXHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ1N0YXRlIHNob3VsZCBiZSBzZXQgYmVmb3JlIGFueSByZXF1ZXN0JykpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3RvcmVEaXNwYXRjaGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBtb2R1bGVIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL21vZHVsZUhlbHBlcicpO1xuY29uc3QgU3RhdGVQcm92aWRlciA9IHJlcXVpcmUoJy4uL3Byb3ZpZGVycy9TdGF0ZVByb3ZpZGVyJyk7XG5jb25zdCBTdG9yZUxvYWRlciA9IHJlcXVpcmUoJy4uL2xvYWRlcnMvU3RvcmVMb2FkZXInKTtcbmNvbnN0IENvbXBvbmVudExvYWRlciA9IHJlcXVpcmUoJy4uL2xvYWRlcnMvQ29tcG9uZW50TG9hZGVyJyk7XG5jb25zdCBEb2N1bWVudFJlbmRlcmVyID0gcmVxdWlyZSgnLi4vRG9jdW1lbnRSZW5kZXJlcicpO1xuY29uc3QgUmVxdWVzdFJvdXRlciA9IHJlcXVpcmUoJy4uL1JlcXVlc3RSb3V0ZXInKTtcbmNvbnN0IE1vZHVsZUFwaVByb3ZpZGVyQmFzZSA9IHJlcXVpcmUoJy4uL2Jhc2UvTW9kdWxlQXBpUHJvdmlkZXJCYXNlJyk7XG5jb25zdCBDb250ZXh0RmFjdG9yeSA9IHJlcXVpcmUoJy4uL0NvbnRleHRGYWN0b3J5Jyk7XG5jb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbi8qKlxuICogSW1wbGVtZW50cyB0aGUgYmFzaWMgYm9vdHN0cmFwcGVyIGNsYXNzXG4gKiBmb3IgYm90aCBzZXJ2ZXIgYW5kIGJyb3dzZXIgZW52aXJvbm1lbnRzLlxuICovXG5jbGFzcyBCb290c3RyYXBwZXJCYXNlIHtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgYmFzaWMgQ2F0YmVycnkgYm9vdHN0cmFwcGVyLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYXRiZXJyeUNvbnN0cnVjdG9yIENvbnN0cnVjdG9yXG5cdCAqIG9mIHRoZSBDYXRiZXJyeSdzIG1haW4gbW9kdWxlLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoY2F0YmVycnlDb25zdHJ1Y3Rvcikge1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBjb25zdHJ1Y3RvciBvZiB0aGUgQ2F0YmVycnkncyBtYWluIG1vZHVsZS5cblx0XHQgKiBAdHlwZSB7RnVuY3Rpb259XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9jYXRiZXJyeUNvbnN0cnVjdG9yID0gY2F0YmVycnlDb25zdHJ1Y3Rvcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IGZ1bGwtY29uZmlndXJlZCBpbnN0YW5jZSBvZiB0aGUgQ2F0YmVycnkgYXBwbGljYXRpb24uXG5cdCAqIEBwYXJhbSB7T2JqZWN0P30gY29uZmlnT2JqZWN0IFRoZSBjb25maWd1cmF0aW9uIG9iamVjdC5cblx0ICogQHJldHVybnMge0NhdGJlcnJ5fSBUaGUgQ2F0YmVycnkgYXBwbGljYXRpb24gaW5zdGFuY2UuXG5cdCAqL1xuXHRjcmVhdGUoY29uZmlnT2JqZWN0KSB7XG5cdFx0Y29uc3QgY3VycmVudENvbmZpZyA9IGNvbmZpZ09iamVjdCB8fCB7fTtcblx0XHRjb25zdCBjYXRiZXJyeSA9IG5ldyB0aGlzLl9jYXRiZXJyeUNvbnN0cnVjdG9yKCk7XG5cblx0XHR0aGlzLmNvbmZpZ3VyZShjdXJyZW50Q29uZmlnLCBjYXRiZXJyeS5sb2NhdG9yKTtcblx0XHRjYXRiZXJyeS5ldmVudHMgPSBuZXcgTW9kdWxlQXBpUHJvdmlkZXJCYXNlKGNhdGJlcnJ5LmxvY2F0b3IpO1xuXHRcdHJldHVybiBjYXRiZXJyeTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb25maWd1cmVzIGEgbG9jYXRvciB3aXRoIGFsbCByZXF1aXJlZCB0eXBlIHJlZ2lzdHJhdGlvbnMuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdPYmplY3QgVGhlIGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxuXHQgKiBAcGFyYW0ge1NlcnZpY2VMb2NhdG9yfSBsb2NhdG9yIFRoZSBTZXJ2aWNlIGxvY2F0b3IgdG8gY29uZmlndXJlLlxuXHQgKi9cblx0Y29uZmlndXJlKGNvbmZpZ09iamVjdCwgbG9jYXRvcikge1xuXHRcdGNvbnN0IGV2ZW50QnVzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXHRcdGV2ZW50QnVzLnNldE1heExpc3RlbmVycygwKTtcblx0XHRsb2NhdG9yLnJlZ2lzdGVySW5zdGFuY2UoJ2V2ZW50QnVzJywgZXZlbnRCdXMpO1xuXHRcdGxvY2F0b3IucmVnaXN0ZXJJbnN0YW5jZSgnY29uZmlnJywgY29uZmlnT2JqZWN0KTtcblx0XHRsb2NhdG9yLnJlZ2lzdGVyKCdzdGF0ZVByb3ZpZGVyJywgU3RhdGVQcm92aWRlciwgdHJ1ZSk7XG5cdFx0bG9jYXRvci5yZWdpc3RlcignY29udGV4dEZhY3RvcnknLCBDb250ZXh0RmFjdG9yeSwgdHJ1ZSk7XG5cdFx0bG9jYXRvci5yZWdpc3Rlcignc3RvcmVMb2FkZXInLCBTdG9yZUxvYWRlciwgdHJ1ZSk7XG5cdFx0bG9jYXRvci5yZWdpc3RlcignY29tcG9uZW50TG9hZGVyJywgQ29tcG9uZW50TG9hZGVyLCB0cnVlKTtcblx0XHRsb2NhdG9yLnJlZ2lzdGVyKCdkb2N1bWVudFJlbmRlcmVyJywgRG9jdW1lbnRSZW5kZXJlciwgdHJ1ZSk7XG5cdFx0bG9jYXRvci5yZWdpc3RlcigncmVxdWVzdFJvdXRlcicsIFJlcXVlc3RSb3V0ZXIsIHRydWUpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQm9vdHN0cmFwcGVyQmFzZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgU2VydmljZUxvY2F0b3IgPSByZXF1aXJlKCdjYXRiZXJyeS1sb2NhdG9yJyk7XG5cbi8qKlxuICogSW1wbGVtZW50cyB0aGUgYmFzaWMgQ2F0YmVycnkgY2xhc3MgZm9yIGJvdGggc2VydmVyIGFuZCBicm93c2VyIGVudmlyb25tZW50cy5cbiAqL1xuY2xhc3MgQ2F0YmVycnlCYXNlIHtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgYmFzaWMgQ2F0YmVycnkgYXBwbGljYXRpb24gbW9kdWxlLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoKSB7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHNlcnZpY2UgbG9jYXRvci5cblx0XHQgKiBAdHlwZSB7U2VydmljZUxvY2F0b3J9XG5cdFx0ICovXG5cdFx0dGhpcy5sb2NhdG9yID0gbmV3IFNlcnZpY2VMb2NhdG9yKCk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHZlcnNpb24gb2YgQ2F0YmVycnkuXG5cdFx0ICovXG5cdFx0dGhpcy52ZXJzaW9uID0gJzkuMC4wJztcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgb2JqZWN0IHdpdGggZXZlbnRzLlxuXHRcdCAqIEB0eXBlIHtNb2R1bGVBcGlQcm92aWRlcn1cblx0XHQgKi9cblx0XHR0aGlzLmV2ZW50cyA9IG51bGw7XG5cblx0XHR0aGlzLmxvY2F0b3IucmVnaXN0ZXJJbnN0YW5jZSgnc2VydmljZUxvY2F0b3InLCB0aGlzLmxvY2F0b3IpO1xuXHRcdHRoaXMubG9jYXRvci5yZWdpc3Rlckluc3RhbmNlKCdjYXRiZXJyeScsIHRoaXMpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2F0YmVycnlCYXNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEltcGxlbWVudHMgdGhlIGJhc2ljIENvb2tpZSBXcmFwcGVyIGNsYXNzIGZvciBib3RoIHNlcnZlclxuICogYW5kIGJyb3dzZXIgZW52aXJvbm1lbnRzLlxuICovXG5jbGFzcyBDb29raWVXcmFwcGVyQmFzZSB7XG5cblx0LyoqXG5cdCAqIEdldHMgYSBtYXAgb2YgY29va2llIHZhbHVlcyBieSB0aGVpciBuYW1lcy5cblx0ICogQHJldHVybnMge09iamVjdH0gVGhlIGNvb2tpZXMgbWFwIGJ5IHRoZWlyIG5hbWVzLlxuXHQgKi9cblx0Z2V0QWxsKCkge1xuXHRcdGNvbnN0IHN0cmluZyA9IHRoaXMuZ2V0Q29va2llU3RyaW5nKCk7XG5cdFx0cmV0dXJuIHRoaXMuX3BhcnNlQ29va2llU3RyaW5nKHN0cmluZyk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBhIGNvb2tpZSB2YWx1ZSBieSBpdHMgbmFtZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIGNvb2tpZSBuYW1lLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29va2llIHZhbHVlLlxuXHQgKi9cblx0Z2V0KG5hbWUpIHtcblx0XHRpZiAodHlwZW9mIChuYW1lKSAhPT0gJ3N0cmluZycpIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5nZXRBbGwoKVtuYW1lXSB8fCAnJztcblx0fVxuXG5cdC8qKlxuXHQgKiBQYXJzZXMgYSBjb29raWUgc3RyaW5nIGludG8gdGhlIG1hcCBvZiBjb29raWUga2V5L3ZhbHVlIHBhaXJzLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBjb29raWUgc3RyaW5nLlxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgb2JqZWN0IHdpdGggY29va2llIHZhbHVlcyBieSB0aGVpciBuYW1lcy5cblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0X3BhcnNlQ29va2llU3RyaW5nKHN0cmluZykge1xuXHRcdGNvbnN0IGNvb2tpZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cblx0XHRpZiAodHlwZW9mIChzdHJpbmcpICE9PSAnc3RyaW5nJykge1xuXHRcdFx0cmV0dXJuIGNvb2tpZTtcblx0XHR9XG5cdFx0c3RyaW5nXG5cdFx0XHQuc3BsaXQoLzsgKi8pXG5cdFx0XHQuZm9yRWFjaChjb29raWVQYWlyID0+IHtcblx0XHRcdFx0Y29uc3QgZXF1YWxzSW5kZXggPSBjb29raWVQYWlyLmluZGV4T2YoJz0nKTtcblx0XHRcdFx0aWYgKGVxdWFsc0luZGV4IDwgMCkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IGtleSA9IGNvb2tpZVBhaXJcblx0XHRcdFx0XHQuc3Vic3RyaW5nKDAsIGVxdWFsc0luZGV4KVxuXHRcdFx0XHRcdC50cmltKCk7XG5cblx0XHRcdFx0Y29va2llW2tleV0gPSBjb29raWVQYWlyXG5cdFx0XHRcdFx0LnN1YnN0cmluZyhlcXVhbHNJbmRleCArIDEpXG5cdFx0XHRcdFx0LnRyaW0oKVxuXHRcdFx0XHRcdC5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKTtcblx0XHRcdH0pO1xuXG5cdFx0cmV0dXJuIGNvb2tpZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIGNvb2tpZSBzZXR1cCBvYmplY3QgdG8gdGhlIGNvb2tpZSBzdHJpbmcuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb29raWVTZXR1cCBUaGUgY29va2llIHNldHVwIG9iamVjdC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGNvb2tpZVNldHVwLmtleSBUaGUgY29va2llIGtleS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGNvb2tpZVNldHVwLnZhbHVlIFRoZSBjb29raWUncyB2YWx1ZS5cblx0ICogQHBhcmFtIHtudW1iZXI/fSBjb29raWVTZXR1cC5tYXhBZ2UgVGhlIGNvb2tpZSdzIG1heCBhZ2UgaW4gc2Vjb25kcy5cblx0ICogQHBhcmFtIHtEYXRlP30gY29va2llU2V0dXAuZXhwaXJlcyBUaGUgZXhwaXJhdGlvbiBkYXRlLlxuXHQgKiBAcGFyYW0ge3N0cmluZz99IGNvb2tpZVNldHVwLnBhdGggVGhlIGNvb2tpZSdzIFVSSSBwYXRoLlxuXHQgKiBAcGFyYW0ge3N0cmluZz99IGNvb2tpZVNldHVwLmRvbWFpbiBUaGUgY29va2llJ3MgZG9tYWluLlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW4/fSBjb29raWVTZXR1cC5zZWN1cmUgSXMgdGhlIGNvb2tpZSBzZWN1cmVkLlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW4/fSBjb29raWVTZXR1cC5odHRwT25seSBJcyB0aGUgY29va2llIEhUVFAgb25seS5cblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvb2tpZSBzdHJpbmcuXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdF9jb252ZXJ0VG9Db29raWVTZXR1cChjb29raWVTZXR1cCkge1xuXHRcdGlmICh0eXBlb2YgKGNvb2tpZVNldHVwLmtleSkgIT09ICdzdHJpbmcnIHx8XG5cdFx0XHR0eXBlb2YgKGNvb2tpZVNldHVwLnZhbHVlKSAhPT0gJ3N0cmluZycpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignV3Jvbmcga2V5IG9yIHZhbHVlJyk7XG5cdFx0fVxuXG5cdFx0dmFyIGNvb2tpZSA9IGAke2Nvb2tpZVNldHVwLmtleX09JHtjb29raWVTZXR1cC52YWx1ZX1gO1xuXG5cdFx0Ly8gaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNjI2NSNzZWN0aW9uLTQuMS4xXG5cdFx0aWYgKHR5cGVvZiAoY29va2llU2V0dXAubWF4QWdlKSA9PT0gJ251bWJlcicpIHtcblx0XHRcdGNvb2tpZSArPSBgOyBNYXgtQWdlPSR7Y29va2llU2V0dXAubWF4QWdlLnRvRml4ZWQoKX1gO1xuXHRcdFx0aWYgKCFjb29raWVTZXR1cC5leHBpcmVzKSB7XG5cdFx0XHRcdC8vIGJ5IGRlZmF1bHQgZXhwaXJlIGRhdGUgPSBjdXJyZW50IGRhdGUgKyBtYXgtYWdlIGluIHNlY29uZHNcblx0XHRcdFx0Y29va2llU2V0dXAuZXhwaXJlcyA9IG5ldyBEYXRlKERhdGUubm93KCkgK1xuXHRcdFx0XHRcdGNvb2tpZVNldHVwLm1heEFnZSAqIDEwMDApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoY29va2llU2V0dXAuZXhwaXJlcyBpbnN0YW5jZW9mIERhdGUpIHtcblx0XHRcdGNvb2tpZSArPSBgOyBFeHBpcmVzPSR7Y29va2llU2V0dXAuZXhwaXJlcy50b1VUQ1N0cmluZygpfWA7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgKGNvb2tpZVNldHVwLnBhdGgpID09PSAnc3RyaW5nJykge1xuXHRcdFx0Y29va2llICs9IGA7IFBhdGg9JHtjb29raWVTZXR1cC5wYXRofWA7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgKGNvb2tpZVNldHVwLmRvbWFpbikgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRjb29raWUgKz0gYDsgRG9tYWluPSR7Y29va2llU2V0dXAuZG9tYWlufWA7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgKGNvb2tpZVNldHVwLnNlY3VyZSkgPT09ICdib29sZWFuJyAmJlxuXHRcdFx0Y29va2llU2V0dXAuc2VjdXJlKSB7XG5cdFx0XHRjb29raWUgKz0gJzsgU2VjdXJlJztcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiAoY29va2llU2V0dXAuaHR0cE9ubHkpID09PSAnYm9vbGVhbicgJiZcblx0XHRcdGNvb2tpZVNldHVwLmh0dHBPbmx5KSB7XG5cdFx0XHRjb29raWUgKz0gJzsgSHR0cE9ubHknO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb29raWU7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb29raWVXcmFwcGVyQmFzZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBJbXBsZW1lbnRzIHRoZSBiYXNpYyBDb29raWUgV3JhcHBlciBjbGFzcyBmb3IgYm90aCBzZXJ2ZXJcbiAqIGFuZCBicm93c2VyIGVudmlyb25tZW50cy5cbiAqL1xuY2xhc3MgRG9jdW1lbnRSZW5kZXJlckJhc2Uge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBiYXNpYyBkb2N1bWVudCByZW5kZXJlci5cblx0ICogQHBhcmFtIHtTZXJ2aWNlTG9jYXRvcn0gbG9jYXRvciBUaGUgbG9jYXRvciBmb3IgcmVzb2x2aW5nIGRlcGVuZGVuY2llcy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGxvY2F0b3IpIHtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgc2VydmljZSBsb2NhdG9yLlxuXHRcdCAqIEB0eXBlIHtTZXJ2aWNlTG9jYXRvcn1cblx0XHQgKiBAcHJvdGVjdGVkXG5cdFx0ICovXG5cdFx0dGhpcy5fc2VydmljZUxvY2F0b3IgPSBsb2NhdG9yO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBjb250ZXh0IGZhY3RvcnkuXG5cdFx0ICogQHR5cGUge0NvbnRleHRGYWN0b3J5fVxuXHRcdCAqIEBwcm90ZWN0ZWRcblx0XHQgKi9cblx0XHR0aGlzLl9jb250ZXh0RmFjdG9yeSA9IGxvY2F0b3IucmVzb2x2ZSgnY29udGV4dEZhY3RvcnknKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgY29tcG9uZW50IGxvYWRlci5cblx0XHQgKiBAdHlwZSB7Q29tcG9uZW50TG9hZGVyfVxuXHRcdCAqIEBwcm90ZWN0ZWRcblx0XHQgKi9cblx0XHR0aGlzLl9jb21wb25lbnRMb2FkZXIgPSBsb2NhdG9yLnJlc29sdmUoJ2NvbXBvbmVudExvYWRlcicpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBldmVudCBidXMuXG5cdFx0ICogQHBhcmFtICB7RXZlbnRFbWl0dGVyfVxuXHRcdCAqL1xuXHRcdHRoaXMuX2V2ZW50QnVzID0gbG9jYXRvci5yZXNvbHZlKCdldmVudEJ1cycpO1xuXG5cdFx0Y29uc3Qgc3RvcmVMb2FkZXIgPSBsb2NhdG9yLnJlc29sdmUoJ3N0b3JlTG9hZGVyJyk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IG1vZHVsZSBsb2FkaW5nIHByb21pc2UuXG5cdFx0ICogQHR5cGUge1Byb21pc2V9XG5cdFx0ICogQHByb3RlY3RlZFxuXHRcdCAqL1xuXHRcdHRoaXMuX2xvYWRpbmcgPSBQcm9taXNlLmFsbChbXG5cdFx0XHR0aGlzLl9jb21wb25lbnRMb2FkZXIubG9hZCgpLFxuXHRcdFx0c3RvcmVMb2FkZXIubG9hZCgpXG5cdFx0XSlcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0dGhpcy5fbG9hZGluZyA9IG51bGw7XG5cdFx0XHRcdHRoaXMuX2V2ZW50QnVzLmVtaXQoJ3JlYWR5Jyk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKHJlYXNvbiA9PiB0aGlzLl9ldmVudEJ1cy5lbWl0KCdlcnJvcicsIHJlYXNvbikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgc3RhdGUgd2hlbiBDYXRiZXJyeSB3aWxsIGJlIGFibGUgdG8gaGFuZGxlIHJlcXVlc3RzLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSBmb3Igbm90aGluZy5cblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0X2dldFByb21pc2VGb3JSZWFkeVN0YXRlKCkge1xuXHRcdHJldHVybiB0aGlzLl9sb2FkaW5nID9cblx0XHRcdHRoaXMuX2xvYWRpbmcgOlxuXHRcdFx0UHJvbWlzZS5yZXNvbHZlKCk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEb2N1bWVudFJlbmRlcmVyQmFzZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBJbXBsZW1lbnRzIHRoZSBiYXNpYyBMb2FkZXIgY2xhc3MgZm9yIGJvdGggc2VydmVyXG4gKiBhbmQgYnJvd3NlciBlbnZpcm9ubWVudHMuXG4gKi9cbmNsYXNzIExvYWRlckJhc2Uge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBiYXNpYyBsb2FkZXIuXG5cdCAqIEBwYXJhbSB7U2VydmljZUxvY2F0b3J9IGxvY2F0b3IgVGhlIHNlcnZpY2UgbG9jYXRvciBmb3IgcmVzb2x2aW5nIGRlcGVuZGVuY2llcy5cblx0ICogQHBhcmFtIHtBcnJheX0gdHJhbnNmb3JtcyBUaGUgbGlzdCBvZiBtb2R1bGUgdHJhbnNmb3JtYXRpb25zLlxuXHQgKi9cblx0Y29uc3RydWN0b3IobG9jYXRvciwgdHJhbnNmb3Jtcykge1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBsaXN0IG9mIG1vZHVsZSB0cmFuc2Zvcm1hdGlvbnMuXG5cdFx0ICogQHR5cGUge0FycmF5fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fdHJhbnNmb3JtcyA9IHRyYW5zZm9ybXM7XG5cdFx0dGhpcy5fZXZlbnRCdXMgPSBsb2NhdG9yLnJlc29sdmUoJ2V2ZW50QnVzJyk7XG5cdH1cblxuXHQvKipcblx0ICogQXBwbGllcyBhbGwgdGhlIHRyYW5zZm9ybWF0aW9ucyBmb3IgdGhlIGxvYWRlZCBtb2R1bGUuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBtb2R1bGUgVGhlIGxvYWRlZCBtb2R1bGUuXG5cdCAqIEBwYXJhbSB7bnVtYmVyP30gaW5kZXggVGhlIHRyYW5zZm9ybWF0aW9uIGluZGV4IGluIHRoZSBsaXN0LlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZTxPYmplY3Q+fSBUaGUgdHJhbnNmb3JtZWQgbW9kdWxlLlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHRfYXBwbHlUcmFuc2Zvcm1zKG1vZHVsZSwgaW5kZXgpIHtcblx0XHRpZiAoaW5kZXggPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Ly8gdGhlIGxpc3QgaXMgYSBzdGFjaywgd2Ugc2hvdWxkIHJldmVyc2UgaXRcblx0XHRcdGluZGV4ID0gdGhpcy5fdHJhbnNmb3Jtcy5sZW5ndGggLSAxO1xuXHRcdH1cblxuXHRcdGlmIChpbmRleCA8IDApIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUobW9kdWxlKTtcblx0XHR9XG5cblx0XHRjb25zdCB0cmFuc2Zvcm1hdGlvbiA9IHRoaXMuX3RyYW5zZm9ybXNbaW5kZXhdO1xuXG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG5cdFx0XHQudGhlbigoKSA9PiB0cmFuc2Zvcm1hdGlvbi50cmFuc2Zvcm0obW9kdWxlKSlcblx0XHRcdC5jYXRjaChyZWFzb24gPT4ge1xuXHRcdFx0XHR0aGlzLl9ldmVudEJ1cy5lbWl0KCdlcnJvcicsIHJlYXNvbik7XG5cdFx0XHRcdHJldHVybiBtb2R1bGU7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4odHJhbnNmb3JtZWRNb2R1bGUgPT4gdGhpcy5fYXBwbHlUcmFuc2Zvcm1zKHRyYW5zZm9ybWVkTW9kdWxlLCBpbmRleCAtIDEpKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExvYWRlckJhc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogSW1wbGVtZW50cyB0aGUgYmFzaWMgTW9kdWxlIEFQSSBQcm92aWRlciBjbGFzcyBmb3IgYm90aCBzZXJ2ZXJcbiAqIGFuZCBicm93c2VyIGVudmlyb25tZW50cy5cbiAqL1xuY2xhc3MgTW9kdWxlQXBpUHJvdmlkZXJCYXNlIHtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgYmFzaWMgQVBJIHByb3ZpZGVyLlxuXHQgKiBAcGFyYW0ge1NlcnZpY2VMb2NhdG9yfSBsb2NhdG9yIFNlcnZpY2UgbG9jYXRvciBmb3IgcmVzb2x2aW5nIGRlcGVuZGVuY2llcy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGxvY2F0b3IpIHtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgc2VydmljZSBsb2NhdG9yLlxuXHRcdCAqIEB0eXBlIHtTZXJ2aWNlTG9jYXRvcn1cblx0XHQgKi9cblx0XHR0aGlzLmxvY2F0b3IgPSBsb2NhdG9yO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBjb29raWUgcHJvdmlkZXIuXG5cdFx0ICogQHR5cGUge0Nvb2tpZVdyYXBwZXJ9XG5cdFx0ICovXG5cdFx0dGhpcy5jb29raWUgPSBsb2NhdG9yLnJlc29sdmUoJ2Nvb2tpZVdyYXBwZXInKTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgZXZlbnQgYnVzLlxuXHRcdCAqIEB0eXBlIHtFdmVudEVtaXR0ZXJ9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9ldmVudEJ1cyA9IGxvY2F0b3IucmVzb2x2ZSgnZXZlbnRCdXMnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTdWJzY3JpYmVzIG9uIHRoZSBzcGVjaWZpZWQgZXZlbnQgaW4gQ2F0YmVycnkuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIGV2ZW50LlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyIFRoZSBldmVudCBoYW5kbGVyLlxuXHQgKiBAcmV0dXJucyB7TW9kdWxlQXBpUHJvdmlkZXJCYXNlfSBUaGlzIG9iamVjdCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRvbihldmVudE5hbWUsIGhhbmRsZXIpIHtcblx0XHRjaGVja0V2ZW50TmFtZUFuZEhhbmRsZXIoZXZlbnROYW1lLCBoYW5kbGVyKTtcblx0XHR0aGlzLl9ldmVudEJ1cy5vbihldmVudE5hbWUsIGhhbmRsZXIpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFN1YnNjcmliZXMgb24gdGhlIHNwZWNpZmllZCBldmVudCBpbiBDYXRiZXJyeSB0byBoYW5kbGUgaXQgb25jZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXIgVGhlIGV2ZW50IGhhbmRsZXIuXG5cdCAqIEByZXR1cm5zIHtNb2R1bGVBcGlQcm92aWRlckJhc2V9IFRoaXMgb2JqZWN0IGZvciBjaGFpbmluZy5cblx0ICovXG5cdG9uY2UoZXZlbnROYW1lLCBoYW5kbGVyKSB7XG5cdFx0Y2hlY2tFdmVudE5hbWVBbmRIYW5kbGVyKGV2ZW50TmFtZSwgaGFuZGxlcik7XG5cdFx0dGhpcy5fZXZlbnRCdXMub25jZShldmVudE5hbWUsIGhhbmRsZXIpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgdGhlIHNwZWNpZmllZCBoYW5kbGVyIGZyb20gdGhlIHNwZWNpZmllZCBldmVudC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXIgVGhlIGV2ZW50IGhhbmRsZXIuXG5cdCAqIEByZXR1cm5zIHtNb2R1bGVBcGlQcm92aWRlckJhc2V9IFRoaXMgb2JqZWN0IGZvciBjaGFpbmluZy5cblx0ICovXG5cdHJlbW92ZUxpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlcikge1xuXHRcdGNoZWNrRXZlbnROYW1lQW5kSGFuZGxlcihldmVudE5hbWUsIGhhbmRsZXIpO1xuXHRcdHRoaXMuX2V2ZW50QnVzLnJlbW92ZUxpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlcik7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlcyBhbGwgaGFuZGxlcnMgZnJvbSB0aGUgc3BlY2lmaWVkIGV2ZW50IGluIENhdGJlcnJ5LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBldmVudC5cblx0ICogQHJldHVybnMge01vZHVsZUFwaVByb3ZpZGVyQmFzZX0gVGhpcyBvYmplY3QgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0cmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50TmFtZSkge1xuXHRcdGNoZWNrRXZlbnROYW1lQW5kSGFuZGxlcihldmVudE5hbWUsIHN0dWIpO1xuXHRcdHRoaXMuX2V2ZW50QnVzLnJlbW92ZUFsbExpc3RlbmVycyhldmVudE5hbWUpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgVVJJIGZvciB0aGUgbmFtZWQgcm91dGUgYW5kIHNwZWNpZmllZCBwYXJhbWV0ZXJzLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSByb3V0ZS5cblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbHVlcyBTZXQgb2Ygcm91dGUgcGFyYW1ldGVyIHZhbHVlcy5cblx0ICogQHJldHVybnMge3N0cmluZ30gVVJJIHN0cmluZy5cblx0ICovXG5cdGdldFJvdXRlVVJJKG5hbWUsIHZhbHVlcykge1xuXHRcdGNvbnN0IHN0YXRlUHJvdmlkZXIgPSB0aGlzLmxvY2F0b3IucmVzb2x2ZSgnc3RhdGVQcm92aWRlcicpO1xuXHRcdHJldHVybiBzdGF0ZVByb3ZpZGVyLmdldFJvdXRlVVJJKG5hbWUsIHZhbHVlcyk7XG5cdH1cbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYW4gZXZlbnQgbmFtZSBpcyBhIHN0cmluZyBhbmQgaGFuZGxlciBpcyBhIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSBldmVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRvIGNoZWNrLlxuICogQHBhcmFtIHsqfSBoYW5kbGVyIFRoZSBldmVudCBoYW5kbGVyIHRvIGNoZWNrLlxuICovXG5mdW5jdGlvbiBjaGVja0V2ZW50TmFtZUFuZEhhbmRsZXIoZXZlbnROYW1lLCBoYW5kbGVyKSB7XG5cdGlmICh0eXBlb2YgKGV2ZW50TmFtZSkgIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdFdmVudCBuYW1lIHNob3VsZCBiZSBhIHN0cmluZycpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiAoaGFuZGxlcikgIT09ICdmdW5jdGlvbicpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0V2ZW50IGhhbmRsZXIgc2hvdWxkIGJlIGEgZnVuY3Rpb24nKTtcblx0fVxufVxuXG4vKipcbiAqIERvZXMgbm90aGluZy4gSXQgaXMgdXNlZCBhcyBhIGRlZmF1bHQgY2FsbGJhY2suXG4gKi9cbmZ1bmN0aW9uIHN0dWIoKSB7fVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZHVsZUFwaVByb3ZpZGVyQmFzZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXJpSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy91cmlIZWxwZXInKTtcbmNvbnN0IGNhdGJlcnJ5VXJpID0gcmVxdWlyZSgnY2F0YmVycnktdXJpJyk7XG5jb25zdCBVUkkgPSBjYXRiZXJyeVVyaS5VUkk7XG5cbi8qKlxuICogSW1wbGVtZW50cyB0aGUgc3RhdGUgcHJvdmlkZXIgZm9yIHRoZSBzZXJ2ZXIgZW52aXJvbm1lbnQuXG4gKi9cbmNsYXNzIFN0YXRlUHJvdmlkZXJCYXNlIHtcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBzdGF0ZSBwcm92aWRlci5cblx0ICogQHBhcmFtIHtTZXJ2aWNlTG9jYXRvcn0gbG9jYXRvciBTZXJ2aWNlIGxvY2F0b3IgZm9yIHJlc29sdmluZyBVUkkgbWFwcGVycy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGxvY2F0b3IpIHtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgc2V0IG9mIG5hbWVkIHJvdXRlcy5cblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fbmFtZWRSb3V0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCByb3V0ZSBkZXNjcmlwdG9ycy5cblx0XHQgKi9cblx0XHR0aGlzLl9yb3V0ZURlc2NyaXB0b3JzID0gdGhpcy5fZ2V0Um91dGVEZXNjcmlwdG9ycyhsb2NhdG9yKTtcblx0XHR0aGlzLl9yb3V0ZURlc2NyaXB0b3JzLmZvckVhY2goZGVzY3JpcHRvciA9PiB7XG5cdFx0XHR0aGlzLl9yZXN0b3JlUmVndWxhckV4cHJlc3Npb25zKGRlc2NyaXB0b3IpO1xuXHRcdFx0aWYgKHR5cGVvZiAoZGVzY3JpcHRvci5uYW1lKSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0dGhpcy5fbmFtZWRSb3V0ZXNbZGVzY3JpcHRvci5uYW1lXSA9IGRlc2NyaXB0b3I7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IGxpc3Qgb2YgVVJJIG1hcHBlcnMuXG5cdFx0ICogQHR5cGUge0FycmF5fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fdXJpTWFwcGVycyA9IHRoaXMuX2dldFVyaU1hcHBlcnMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGEgc3RhdGUgYnkgdGhlIHNwZWNpZmllZCBsb2NhdGlvbiBVUkkuXG5cdCAqIEBwYXJhbSB7VVJJfSB1cmkgVGhlIFVSSSBsb2NhdGlvbi5cblx0ICogQHJldHVybnMge09iamVjdHxudWxsfSBUaGUgc3RhdGUgb2JqZWN0LlxuXHQgKi9cblx0Z2V0U3RhdGVCeVVyaSh1cmkpIHtcblx0XHRpZiAodGhpcy5fdXJpTWFwcGVycy5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHVyaSA9IHVyaS5jbG9uZSgpO1xuXHRcdHVyaS5zY2hlbWUgPSBudWxsO1xuXHRcdHVyaS5hdXRob3JpdHkgPSBudWxsO1xuXHRcdHVyaS5mcmFnbWVudCA9IG51bGw7XG5cdFx0dXJpLnBhdGggPSB1cmlIZWxwZXIucmVtb3ZlRW5kU2xhc2godXJpLnBhdGgpO1xuXG5cdFx0Y29uc3Qgc3RhdGUgPSB0aGlzLl9tYXBTdGF0ZSh1cmkpO1xuXHRcdGlmICghc3RhdGUpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdC8vIG1ha2Ugc3RhdGUgb2JqZWN0IGltbXV0YWJsZVxuXHRcdE9iamVjdC5rZXlzKHN0YXRlKS5mb3JFYWNoKHN0b3JlTmFtZSA9PiBPYmplY3QuZnJlZXplKHN0YXRlW3N0b3JlTmFtZV0pKTtcblx0XHRPYmplY3QuZnJlZXplKHN0YXRlKTtcblxuXHRcdHJldHVybiBzdGF0ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGEgVVJJIHBhdGggc3RyaW5nIGZvciB0aGUgbmFtZWQgcm91dGUgdXNpbmcgc3BlY2lmaWVkIHBhcmFtZXRlcnMuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSByb3V0ZS5cblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbHVlcyBUaGUgc2V0IG9mIHBhcmFtZXRlciB2YWx1ZXMgZm9yIHRoZSByb3V0ZS5cblx0ICogQHJldHVybnMge3N0cmluZ30gVVJJIHBhdGggc3RyaW5nLlxuXHQgKi9cblx0Z2V0Um91dGVVUkkobmFtZSwgdmFsdWVzKSB7XG5cdFx0dmFsdWVzID0gdmFsdWVzIHx8IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdFx0Y29uc3QgZGVzY3JpcHRvciA9IHRoaXMuX25hbWVkUm91dGVzW25hbWVdO1xuXHRcdGlmICghZGVzY3JpcHRvcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBUaGVyZSBpcyBubyBzdWNoIHJvdXRlIGNhbGxlZCBcIiR7bmFtZX1cImApO1xuXHRcdH1cblxuXHRcdGNvbnN0IHVyaSA9IG5ldyBVUkkoZGVzY3JpcHRvci5leHByZXNzaW9uKTtcblxuXHRcdC8vIHNldCB2YWx1ZSB0byBVUkkgcGF0aCBwYXJhbWV0ZXJzIGZpcnN0XG5cdFx0aWYgKGRlc2NyaXB0b3IucGF0aFBhcmFtZXRlcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0dXJpLnBhdGggPSBzZXRQYXJhbWV0ZXJWYWx1ZXMoXG5cdFx0XHRcdHVyaS5wYXRoLCBkZXNjcmlwdG9yLnBhdGhQYXJhbWV0ZXJzLCB2YWx1ZXMsXG5cdFx0XHRcdChwYXJhbWV0ZXIsIHZhbHVlKSA9PiBlbmNvZGVVUklDb21wb25lbnQoZGVmYXVsdFBhcmFtZXRlclZhbHVlUHJvY2Vzc29yKHBhcmFtZXRlciwgdmFsdWUpKVxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHQvLyB0cnlpbmcgdG8gc2V0IHF1ZXJ5IHN0cmluZyBwYXJhbWV0ZXJzIGlmIHRoZXkgZXhpc3Rcblx0XHRpZiAoZGVzY3JpcHRvci5xdWVyeVBhcmFtZXRlcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0Y29uc3QgcXVlcnlWYWx1ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdFx0XHRkZXNjcmlwdG9yLnF1ZXJ5UGFyYW1ldGVycy5mb3JFYWNoKHF1ZXJ5UGFyYW1ldGVyID0+IHtcblx0XHRcdFx0Y29uc3QgbmFtZSA9IHNldFBhcmFtZXRlclZhbHVlcyhcblx0XHRcdFx0XHRxdWVyeVBhcmFtZXRlci5uYW1lRXhwcmVzc2lvbiwgcXVlcnlQYXJhbWV0ZXIubmFtZVBhcmFtZXRlcnMsIHZhbHVlc1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdC8vIGlmIHRoZXJlIGlzIG5vIG5hbWUgbWVhbnMgdGhlcmUgaXMgbm8gcXVlcnkgcGFyYW1ldGVyIGF0IGFsbFxuXHRcdFx0XHRpZiAoIW5hbWUpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBpZiB0aGVyZSBhcmUgbm8gcGFyYW1ldGVyIHZhbHVlcyBpdCBtZWFucyB0aGUgcXVlcnlcblx0XHRcdFx0Ly8gcGFyYW1ldGVyIGRvZXMgbm90IGhhdmUgdmFsdWVcblx0XHRcdFx0aWYgKCFxdWVyeVBhcmFtZXRlci52YWx1ZVBhcmFtZXRlcnMpIHtcblx0XHRcdFx0XHRxdWVyeVZhbHVlc1tuYW1lXSA9IG51bGw7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gaWYgdGhlcmUgYXJlIG5vIHJvdXRlIHBhcmFtZXRlcnMgaW4gdGhlIHF1ZXJ5IHBhcmFtZXRlcidzIHZhbHVlXG5cdFx0XHRcdC8vIHRoYXQgbWVhbnMgaXQgaGFzIGEgc3RhdGljIHZhbHVlXG5cdFx0XHRcdGlmIChxdWVyeVBhcmFtZXRlci52YWx1ZVBhcmFtZXRlcnMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0cXVlcnlWYWx1ZXNbbmFtZV0gPSBxdWVyeVBhcmFtZXRlci52YWx1ZUV4cHJlc3Npb247XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgZmlyc3RQYXJhbWV0ZXJOYW1lID0gcXVlcnlQYXJhbWV0ZXIudmFsdWVQYXJhbWV0ZXJzWzBdLm5hbWU7XG5cdFx0XHRcdGNvbnN0IGZpcnN0UGFyYW1ldGVyVmFsdWUgPSB2YWx1ZXNbZmlyc3RQYXJhbWV0ZXJOYW1lXTtcblx0XHRcdFx0Ly8gaWYgdGhlcmUgaXMgb25seSBvbmUgcGFyYW1ldGVyIGluIHF1ZXJ5IHZhbHVlIGFuZFxuXHRcdFx0XHQvLyB0aGUgc3BlY2lmaWVkIHBhcmFtZXRlcidzIHZhbHVlIGlzIGFuIGFycmF5XG5cdFx0XHRcdGlmIChxdWVyeVBhcmFtZXRlci52YWx1ZVBhcmFtZXRlcnMubGVuZ3RoID09PSAxICYmIEFycmF5LmlzQXJyYXkoZmlyc3RQYXJhbWV0ZXJWYWx1ZSkpIHtcblx0XHRcdFx0XHRxdWVyeVZhbHVlc1tuYW1lXSA9IFtdO1xuXHRcdFx0XHRcdGZpcnN0UGFyYW1ldGVyVmFsdWUuZm9yRWFjaCh2YWx1ZSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCB2YWx1ZXNPYmplY3QgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRcdFx0XHRcdFx0dmFsdWVzT2JqZWN0W2ZpcnN0UGFyYW1ldGVyTmFtZV0gPSB2YWx1ZTtcblx0XHRcdFx0XHRcdGNvbnN0IHF1ZXJ5VmFsdWVTdHJpbmcgPSBzZXRQYXJhbWV0ZXJWYWx1ZXMoXG5cdFx0XHRcdFx0XHRcdHF1ZXJ5UGFyYW1ldGVyLnZhbHVlRXhwcmVzc2lvbiwgcXVlcnlQYXJhbWV0ZXIudmFsdWVQYXJhbWV0ZXJzLCB2YWx1ZXNPYmplY3Rcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRpZiAocXVlcnlWYWx1ZVN0cmluZy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRcdHF1ZXJ5VmFsdWVzW25hbWVdLnB1c2gocXVlcnlWYWx1ZVN0cmluZyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgcXVlcnlWYWx1ZVN0cmluZyA9IHNldFBhcmFtZXRlclZhbHVlcyhcblx0XHRcdFx0XHRxdWVyeVBhcmFtZXRlci52YWx1ZUV4cHJlc3Npb24sIHF1ZXJ5UGFyYW1ldGVyLnZhbHVlUGFyYW1ldGVycywgdmFsdWVzXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGlmIChxdWVyeVZhbHVlU3RyaW5nLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRxdWVyeVZhbHVlc1tuYW1lXSA9IHF1ZXJ5VmFsdWVTdHJpbmc7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoT2JqZWN0LmtleXMocXVlcnlWYWx1ZXMpLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHR1cmkucXVlcnkgPSBudWxsO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dXJpLnF1ZXJ5LnZhbHVlcyA9IHF1ZXJ5VmFsdWVzO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB1cmkudG9TdHJpbmcoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNYXBzIHRoZSBzdGF0ZS5cblx0ICogQHBhcmFtIHtVUkl9IHVyaSBVUkkgdGhhdCBkZXNjcmliZXMgdGhlIHN0YXRlLlxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fG51bGx9IFRoZSBzdGF0ZSBmcm9tIFVSSS5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9tYXBTdGF0ZSh1cmkpIHtcblx0XHRsZXQgc3RhdGUgPSBudWxsO1xuXHRcdHRoaXMuX3VyaU1hcHBlcnMuc29tZShtYXBwZXIgPT4ge1xuXHRcdFx0c3RhdGUgPSBtYXBwZXIodXJpKTtcblx0XHRcdHJldHVybiBCb29sZWFuKHN0YXRlKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBzdGF0ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGEgbGlzdCBvZiBVUkkgbWFwcGVycy5cblx0ICogQHJldHVybnMge0FycmF5fSBUaGUgbGlzdCBvZiBVUkkgbWFwcGVycy5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9nZXRVcmlNYXBwZXJzKCkge1xuXHRcdHJldHVybiB0aGlzLl9yb3V0ZURlc2NyaXB0b3JzLm1hcChkZXNjcmlwdG9yID0+IHtcblx0XHRcdGlmIChkZXNjcmlwdG9yLmV4cHJlc3Npb24gaW5zdGFuY2VvZiBSZWdFeHApIHtcblx0XHRcdFx0cmV0dXJuIHVyaSA9PiBkZXNjcmlwdG9yLmV4cHJlc3Npb24udGVzdCh1cmkudG9TdHJpbmcoKSkgPyBkZXNjcmlwdG9yLm1hcCh1cmkpIDogbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZXh0cmFjdG9yID0gdGhpcy5fY3JlYXRlUGFyYW1ldGVyRXh0cmFjdG9yKGRlc2NyaXB0b3IpO1xuXHRcdFx0aWYgKGRlc2NyaXB0b3IubWFwIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcblx0XHRcdFx0cmV0dXJuIHVyaSA9PiB7XG5cdFx0XHRcdFx0Y29uc3Qgc3RhdGUgPSBleHRyYWN0b3IodXJpKTtcblx0XHRcdFx0XHRyZXR1cm4gc3RhdGUgPyBkZXNjcmlwdG9yLm1hcChzdGF0ZSkgOiBzdGF0ZTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBleHRyYWN0b3I7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBhIGxpc3Qgb2Ygcm91dGUgZGVzY3JpcHRvcnMuXG5cdCAqIEBwYXJhbSB7U2VydmljZUxvY2F0b3J9IHNlcnZpY2VMb2NhdG9yIFRoZSBTZXJ2aWNlIGxvY2F0b3Jcblx0ICogZm9yIGdldHRpbmcgcm91dGUgZGVmaW5pdGlvbnMuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGxpc3Qgb2Ygcm91dGUgZGVzY3JpcHRvcnMuXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICogQGFic3RyYWN0XG5cdCAqL1xuXHRfZ2V0Um91dGVEZXNjcmlwdG9ycyhzZXJ2aWNlTG9jYXRvcikge1xuXG5cdH1cblxuXHQvKipcblx0ICogUmVzdG9yZXMgYWxsIHRoZSByZWd1bGFyIGV4cHJlc3Npb25zIGZyb20gdGhlaXIgc291cmNlcy5cblx0ICogQHBhcmFtIHtPYmplY3R9IGRlc2NyaXB0b3IgVGhlIHJvdXRlIGRlc2NyaXB0b3IuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfcmVzdG9yZVJlZ3VsYXJFeHByZXNzaW9ucyhkZXNjcmlwdG9yKSB7XG5cblx0XHQvLyBiZWNhdXNlIHRoZSBvYmplY3QgaXMgY29udmVydGVkIHRvIEpTT04gd2UgaGF2ZSB0byBzdG9yZSB0aGVcblx0XHQvLyByZWd1bGFyIGV4cHJlc3Npb25zIGFzIHRoZWlyIHNvdXJjZXNcblx0XHRpZiAoZGVzY3JpcHRvci5wYXRoUmVnRXhwU291cmNlKSB7XG5cdFx0XHRkZXNjcmlwdG9yLnBhdGhSZWdFeHAgPSBuZXcgUmVnRXhwKGRlc2NyaXB0b3IucGF0aFJlZ0V4cFNvdXJjZSwgJ2knKTtcblx0XHR9XG5cdFx0aWYgKCFkZXNjcmlwdG9yLnF1ZXJ5UGFyYW1ldGVycykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRkZXNjcmlwdG9yLnF1ZXJ5UGFyYW1ldGVycy5mb3JFYWNoKHBhcmFtZXRlciA9PiB7XG5cdFx0XHRwYXJhbWV0ZXIubmFtZVJlZ0V4cCA9IG5ldyBSZWdFeHAocGFyYW1ldGVyLm5hbWVSZWdFeHBTb3VyY2UsICdpJyk7XG5cdFx0XHRpZiAocGFyYW1ldGVyLnZhbHVlUmVnRXhwU291cmNlKSB7XG5cdFx0XHRcdHBhcmFtZXRlci52YWx1ZVJlZ0V4cCA9IG5ldyBSZWdFeHAocGFyYW1ldGVyLnZhbHVlUmVnRXhwU291cmNlLCAnaScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGV4dHJhY3RzIHBhcmFtZXRlcnMgZnJvbSB0aGUgVVJJLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcm91dGVEZXNjcmlwdG9yIFJvdXRlIGRlc2NyaXB0b3IuXG5cdCAqIEByZXR1cm5zIHtmdW5jdGlvbn0gRnVuY3Rpb25cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9jcmVhdGVQYXJhbWV0ZXJFeHRyYWN0b3Iocm91dGVEZXNjcmlwdG9yKSB7XG5cdFx0Y29uc3QgcGF0aFJlZ0V4cCA9IG5ldyBSZWdFeHAocm91dGVEZXNjcmlwdG9yLnBhdGhSZWdFeHBTb3VyY2UpO1xuXHRcdHJldHVybiB1cmkgPT4ge1xuXHRcdFx0Y29uc3QgcGF0aE1hdGNoZXMgPSB1cmkucGF0aC5tYXRjaChwYXRoUmVnRXhwKTtcblx0XHRcdGlmICghcGF0aE1hdGNoZXMpIHtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHN0YXRlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0XHRcdGNvbnN0IHBhdGhQYXJhbWV0ZXJWYWx1ZXMgPSBwYXRoTWF0Y2hlcy5zbGljZSgxKTtcblxuXHRcdFx0c2V0U3RhdGVWYWx1ZXMoc3RhdGUsIHBhdGhQYXJhbWV0ZXJWYWx1ZXMsIHJvdXRlRGVzY3JpcHRvci5wYXRoUGFyYW1ldGVycyk7XG5cblx0XHRcdGlmICh1cmkucXVlcnkgJiYgdXJpLnF1ZXJ5LnZhbHVlcykge1xuXHRcdFx0XHRzZXRRdWVyeVBhcmFtZXRlcnMoc3RhdGUsIHVyaS5xdWVyeS52YWx1ZXMsIHJvdXRlRGVzY3JpcHRvcik7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBzdGF0ZTtcblx0XHR9O1xuXHR9XG59XG5cbi8qKlxuICogU2V0cyBwYXJhbWV0ZXIgdmFsdWVzIHRvIHRoZSBzdGF0ZSB1c2luZyBwYXJhbWV0ZXIgYW5kIHN0b3JlIG5hbWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YXRlIEN1cnJlbnQgc3RhdGUgb2JqZWN0LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIEN1cnJlbnQgdmFsdWVzLlxuICogQHBhcmFtIHtBcnJheX0gcGFyYW1ldGVycyBMaXN0IG9mIHBhcmFtZXRlciBkZXNjcmlwdG9ycy5cbiAqL1xuZnVuY3Rpb24gc2V0U3RhdGVWYWx1ZXMoc3RhdGUsIHZhbHVlcywgcGFyYW1ldGVycykge1xuXHR2YWx1ZXMuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG5cdFx0Y29uc3QgcGFyYW1ldGVyID0gcGFyYW1ldGVyc1tpbmRleF07XG5cdFx0cGFyYW1ldGVyLnN0b3Jlcy5mb3JFYWNoKHN0b3JlTmFtZSA9PiB7XG5cdFx0XHRpZiAoIShzdG9yZU5hbWUgaW4gc3RhdGUpKSB7XG5cdFx0XHRcdHN0YXRlW3N0b3JlTmFtZV0gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBpZiBVUkkgaGFzIHNldmVyYWwgdmFsdWVzIGZvciB0aGUgc2FtZSBwYXJhbWV0ZXIgaXQgdHVybnMgdG8gYW4gYXJyYXlcblx0XHRcdGlmIChwYXJhbWV0ZXIubmFtZSBpbiBzdGF0ZVtzdG9yZU5hbWVdKSB7XG5cdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KHN0YXRlW3N0b3JlTmFtZV1bcGFyYW1ldGVyLm5hbWVdKSkge1xuXHRcdFx0XHRcdHN0YXRlW3N0b3JlTmFtZV1bcGFyYW1ldGVyLm5hbWVdLnB1c2godmFsdWUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHN0YXRlW3N0b3JlTmFtZV1bcGFyYW1ldGVyLm5hbWVdID0gW3N0YXRlW3N0b3JlTmFtZV1bcGFyYW1ldGVyLm5hbWVdLCB2YWx1ZV07XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHN0YXRlW3N0b3JlTmFtZV1bcGFyYW1ldGVyLm5hbWVdID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xufVxuXG4vKipcbiAqIFNldHMgcXVlcnkgcGFyYW1ldGVycyB0byB0aGUgc3RhdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhdGUgQ3VycmVudCBzdGF0ZSBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gcXVlcnlWYWx1ZXMgVVJJIHF1ZXJ5IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge09iamVjdH0gcm91dGVEZXNjcmlwdG9yIEN1cnJlbnQgcm91dGUgZGVzY3JpcHRvci5cbiAqL1xuZnVuY3Rpb24gc2V0UXVlcnlQYXJhbWV0ZXJzKHN0YXRlLCBxdWVyeVZhbHVlcywgcm91dGVEZXNjcmlwdG9yKSB7XG5cdE9iamVjdC5rZXlzKHF1ZXJ5VmFsdWVzKVxuXHRcdC5mb3JFYWNoKG5hbWUgPT4ge1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBxdWVyeVZhbHVlc1tuYW1lXTtcblxuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRcdHZhbHVlLmZvckVhY2goaXRlbSA9PiB7XG5cdFx0XHRcdFx0Y29uc3Qgc3ViVmFsdWVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0XHRcdFx0XHRzdWJWYWx1ZXNbbmFtZV0gPSBpdGVtO1xuXHRcdFx0XHRcdHNldFF1ZXJ5UGFyYW1ldGVycyhzdGF0ZSwgc3ViVmFsdWVzLCByb3V0ZURlc2NyaXB0b3IpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgaXNWYWx1ZSA9IHR5cGVvZiAodmFsdWUpID09PSAnc3RyaW5nJztcblxuXHRcdFx0bGV0IHF1ZXJ5TmFtZU1hdGNoZXMgPSBudWxsO1xuXHRcdFx0bGV0IHF1ZXJ5VmFsdWVNYXRjaGVzID0gbnVsbDtcblx0XHRcdGxldCByb3V0ZVBhcmFtZXRlciA9IG51bGw7XG5cblx0XHRcdHJvdXRlRGVzY3JpcHRvci5xdWVyeVBhcmFtZXRlcnMuc29tZShwYXJhbWV0ZXIgPT4ge1xuXHRcdFx0XHRxdWVyeU5hbWVNYXRjaGVzID0gbmFtZS5tYXRjaChwYXJhbWV0ZXIubmFtZVJlZ0V4cCk7XG5cblx0XHRcdFx0aWYgKGlzVmFsdWUgJiYgcGFyYW1ldGVyLnZhbHVlUmVnRXhwKSB7XG5cdFx0XHRcdFx0cXVlcnlWYWx1ZU1hdGNoZXMgPSB2YWx1ZS5tYXRjaChwYXJhbWV0ZXIudmFsdWVSZWdFeHApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHF1ZXJ5TmFtZU1hdGNoZXMpIHtcblx0XHRcdFx0XHRyb3V0ZVBhcmFtZXRlciA9IHBhcmFtZXRlcjtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKCFyb3V0ZVBhcmFtZXRlcikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHNldFN0YXRlVmFsdWVzKHN0YXRlLCBxdWVyeU5hbWVNYXRjaGVzLnNsaWNlKDEpLCByb3V0ZVBhcmFtZXRlci5uYW1lUGFyYW1ldGVycyk7XG5cblx0XHRcdGlmICghcXVlcnlWYWx1ZU1hdGNoZXMpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0c2V0U3RhdGVWYWx1ZXMoc3RhdGUsIHF1ZXJ5VmFsdWVNYXRjaGVzLnNsaWNlKDEpLCByb3V0ZVBhcmFtZXRlci52YWx1ZVBhcmFtZXRlcnMpO1xuXHRcdH0pO1xufVxuXG4vKipcbiAqIFNldHMgcGFyYW1ldGVyIHZhbHVlcyB0byBhIHJvdXRlIGV4cHJlc3Npb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gZXhwcmVzc2lvbiBUaGUgcm91dGUgZXhwcmVzc2lvbi5cbiAqIEBwYXJhbSB7QXJyYXl9IHBhcmFtZXRlcnMgQXJyYXkgb2Ygcm91dGUgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZXMgRGljdGlvbmFyeSBvZiByb3V0ZSBwYXJhbWV0ZXIgdmFsdWVzLlxuICogQHBhcmFtIHtmdW5jdGlvbj99IHByZVByb2Nlc3NvciBWYWx1ZSBwcmVwcm9jZXNzb3JcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFN0cmluZyB3aXRoIHN1YnN0aXR1dGVkIHZhbHVlcy5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHNldFBhcmFtZXRlclZhbHVlcyhleHByZXNzaW9uLCBwYXJhbWV0ZXJzLCB2YWx1ZXMsIHByZVByb2Nlc3Nvcikge1xuXHRpZiAoIXBhcmFtZXRlcnMgfHwgcGFyYW1ldGVycy5sZW5ndGggPT09IDApIHtcblx0XHRyZXR1cm4gZXhwcmVzc2lvbjtcblx0fVxuXG5cdHByZVByb2Nlc3NvciA9IHByZVByb2Nlc3NvciB8fCBkZWZhdWx0UGFyYW1ldGVyVmFsdWVQcm9jZXNzb3I7XG5cblx0Ly8gYXBwbHkgdmFsdWVzIGZvciBwYXJhbWV0ZXJzIGluIHRoZSBVUkkgcGF0aFxuXHRsZXQgbmV4dFBhcmFtZXRlckluZGV4ID0gMDtcblx0bGV0IG5leHRQYXJhbWV0ZXIgPSBwYXJhbWV0ZXJzW25leHRQYXJhbWV0ZXJJbmRleF07XG5cdGxldCByZXN1bHQgPSAnJztcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGV4cHJlc3Npb24ubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAobmV4dFBhcmFtZXRlciAmJiBpID09PSBuZXh0UGFyYW1ldGVyLnN0YXJ0KSB7XG5cdFx0XHRyZXN1bHQgKz0gcHJlUHJvY2Vzc29yKG5leHRQYXJhbWV0ZXIsIHZhbHVlc1tuZXh0UGFyYW1ldGVyLm5hbWVdKTtcblx0XHRcdHdoaWxlICgrK2kgPCBuZXh0UGFyYW1ldGVyLmVuZCAtIDEpIHtcblx0XHRcdFx0Ly8ganVzdCBza2lwcGluZyB0aGUgcGFyYW1ldGVyIGluIHRoZSBleHByZXNzaW9uIHN0cmluZ1xuXHRcdFx0fVxuXHRcdFx0bmV4dFBhcmFtZXRlckluZGV4Kys7XG5cdFx0XHRuZXh0UGFyYW1ldGVyID0gcGFyYW1ldGVyc1tuZXh0UGFyYW1ldGVySW5kZXhdO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdHJlc3VsdCArPSBleHByZXNzaW9uW2ldO1xuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogUHJvY2Vzc2VzIHBhcmFtZXRlciB2YWx1ZSBieSBkZWZhdWx0LlxuICogQHBhcmFtIHtPYmplY3R9IHBhcmFtZXRlciBQYXJhbWV0ZXIgZGVzY3JpcHRvci5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgUGFyYW1ldGVyJ3MgdmFsdWUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBQcm9jZXNzZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGRlZmF1bHRQYXJhbWV0ZXJWYWx1ZVByb2Nlc3NvcihwYXJhbWV0ZXIsIHZhbHVlKSB7XG5cdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihgQXJyYXkgdmFsdWUgaXMgbm90IHN1cHBvcnRlZCBmb3IgdGhlIHBhcmFtZXRlciBcIiR7cGFyYW1ldGVyLm5hbWV9XCJgKTtcblx0fVxuXHRyZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogU3RyaW5nKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0ZVByb3ZpZGVyQmFzZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgRVJST1JfTUVTU0FHRV9SRUdFWFAgPSAvXig/OltcXHckXSspOiAoPzouKylcXHI/XFxuL2k7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG5cdC8qKlxuXHQgKiBQcmludHMgYW4gZXJyb3Igd2l0aCBwcmV0dHkgZm9ybWF0dGluZy5cblx0ICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHByaW50LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdXNlckFnZW50IFRoZSB1c2VyIGFnZW50IGluZm9ybWF0aW9uLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBIVE1MIHRleHQgd2l0aCBhbGwgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVycm9yLlxuXHQgKi9cblx0cHJldHR5UHJpbnQ6IChlcnJvciwgdXNlckFnZW50KSA9PiB7XG5cdFx0aWYgKCFlcnJvciB8fCB0eXBlb2YgKGVycm9yKSAhPT0gJ29iamVjdCcpIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cdFx0cmV0dXJuIGBcbjxkaXYgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTsgZm9udC1zaXplOiAxMnB0O1wiPlxuXHQkeyhuZXcgRGF0ZSgpKS50b1VUQ1N0cmluZygpfTs8YnIvPlxuXHQke3VzZXJBZ2VudCB8fCAnVW5rbm93biBicm93c2VyJ307PGJyLz5cblx0Q2F0YmVycnlAOS4wLjAgKFxuXHQ8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2NhdGJlcnJ5L2NhdGJlcnJ5L2lzc3Vlc1wiIHRhcmdldD1cIl9ibGFua1wiPlxuXHRcdHJlcG9ydCBhbiBpc3N1ZVxuXHQ8L2E+KVxuXHQ8YnIvPjxici8+XG5cdDxzcGFuIHN0eWxlPVwiY29sb3I6IHJlZDsgZm9udC1zaXplOiAxNnB0OyBmb250LXdlaWdodDogYm9sZDtcIj5cblx0XHQke2VzY2FwZShlcnJvci5uYW1lKX06ICR7ZXNjYXBlKGVycm9yLm1lc3NhZ2UpfVxuXHQ8L3NwYW4+XG5cdDxici8+PGJyLz5cblx0JHtlc2NhcGUoZXJyb3Iuc3RhY2spLnJlcGxhY2UoRVJST1JfTUVTU0FHRV9SRUdFWFAsICcnKX1cbjwvZGl2PlxuYDtcblx0fVxufTtcblxuLyoqXG4gKiBFc2NhcGVzIHRoZSBlcnJvciB0ZXh0LlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFRoZSBlcnJvciB0ZXh0IHRvIGVzY2FwZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBlc2NhcGVkIGFuZCBmb3JtYXR0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBlc2NhcGUodmFsdWUpIHtcblx0dmFsdWUgPSBTdHJpbmcodmFsdWUgfHwgJycpO1xuXHRyZXR1cm4gdmFsdWVcblx0XHQucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuXHRcdC5yZXBsYWNlKC88L2csICcmbHQ7Jylcblx0XHQucmVwbGFjZSgvPi9nLCAnJmd0OycpXG5cdFx0LnJlcGxhY2UoL1xcXCIvZywgJyZxdW90OycpXG5cdFx0LnJlcGxhY2UoL1xcJy9nLCAnJiMzOTsnKVxuXHRcdC5yZXBsYWNlKC9cXHI/XFxuL2csICc8YnIvPicpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBoZWxwZXIgPSB7XG5cdEVMRU1FTlRfTk9ERV9UWVBFOiAxLFxuXHRDT01QT05FTlRfVEFHX1BSRUZJWDogJ0NBVC0nLFxuXHRDT01QT05FTlRfSUQ6ICckY2F0YmVycnlJZCcsXG5cdENPTVBPTkVOVF9QUkVGSVhfUkVHRVhQOiAvXmNhdC0vaSxcblx0Q09NUE9ORU5UX0VSUk9SX1RFTVBMQVRFX1BPU1RGSVg6ICctLWVycm9yJyxcblx0RE9DVU1FTlRfQ09NUE9ORU5UX05BTUU6ICdkb2N1bWVudCcsXG5cdERPQ1VNRU5UX1RBR19OQU1FOiAnSFRNTCcsXG5cdEhFQURfVEFHX05BTUU6ICdIRUFEJyxcblx0SEVBRF9DT01QT05FTlRfTkFNRTogJ2hlYWQnLFxuXHRBVFRSSUJVVEVfU1RPUkU6ICdjYXQtc3RvcmUnLFxuXHRERUZBVUxUX0xPR0lDX0ZJTEVOQU1FOiAnaW5kZXguanMnLFxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmFtZSBmb3IgdGhlIGVycm9yIHRlbXBsYXRlIG9mIHRoZSBjb21wb25lbnQuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjb21wb25lbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBjb21wb25lbnQuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBuYW1lIG9mIHRoZSBlcnJvciB0ZW1wbGF0ZSBvZiB0aGUgY29tcG9uZW50LlxuXHQgKi9cblx0Z2V0TmFtZUZvckVycm9yVGVtcGxhdGU6IGNvbXBvbmVudE5hbWUgPT4ge1xuXHRcdGlmICh0eXBlb2YgKGNvbXBvbmVudE5hbWUpICE9PSAnc3RyaW5nJykge1xuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH1cblx0XHRyZXR1cm4gY29tcG9uZW50TmFtZSArIGhlbHBlci5DT01QT05FTlRfRVJST1JfVEVNUExBVEVfUE9TVEZJWDtcblx0fSxcblxuXHQvKipcblx0ICogRGV0ZXJtaW5lcyBpZiB0aGUgc3BlY2lmaWVkIGNvbXBvbmVudCBuYW1lIGlzIGEgXCJkb2N1bWVudFwiIGNvbXBvbmVudCdzIG5hbWUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjb21wb25lbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBjb21wb25lbnQuXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgY29tcG9uZW50J3MgbmFtZVxuXHQgKiBpcyBhIFwiZG9jdW1lbnRcIiBjb21wb25lbnQncyBuYW1lLlxuXHQgKi9cblx0aXNEb2N1bWVudENvbXBvbmVudDogY29tcG9uZW50TmFtZSA9PlxuXHRcdGNvbXBvbmVudE5hbWUudG9Mb3dlckNhc2UoKSA9PT0gaGVscGVyLkRPQ1VNRU5UX0NPTVBPTkVOVF9OQU1FLFxuXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmVzIGlmIHRoZSBzcGVjaWZpZWQgY29tcG9uZW50IG5hbWUgaXMgYSBcImhlYWRcIiBjb21wb25lbnQgbmFtZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGNvbXBvbmVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIGNvbXBvbmVudC5cblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHNwZWNpZmllZCBjb21wb25lbnQncyBuYW1lXG5cdCAqIGlzIGEgXCJoZWFkXCIgY29tcG9uZW50J3MgbmFtZS5cblx0ICovXG5cdGlzSGVhZENvbXBvbmVudDogY29tcG9uZW50TmFtZSA9PlxuXHRcdGNvbXBvbmVudE5hbWUudG9Mb3dlckNhc2UoKSA9PT0gaGVscGVyLkhFQURfQ09NUE9ORU5UX05BTUUsXG5cblx0LyoqXG5cdCAqIERldGVybWluZXMgaWYgdGhlIERPTSBub2RlIGlzIGEgY29tcG9uZW50IGVsZW1lbnQuXG5cdCAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBUaGUgRE9NIG5vZGUuXG5cdCAqL1xuXHRpc0NvbXBvbmVudE5vZGU6IG5vZGUgPT5cblx0XHRub2RlLm5vZGVUeXBlID09PSBoZWxwZXIuRUxFTUVOVF9OT0RFX1RZUEUgJiZcblx0XHQoXG5cdFx0XHRoZWxwZXIuQ09NUE9ORU5UX1BSRUZJWF9SRUdFWFAudGVzdChub2RlLm5vZGVOYW1lKSB8fFxuXHRcdFx0bm9kZS5ub2RlTmFtZSA9PT0gaGVscGVyLkhFQURfVEFHX05BTUUgfHxcblx0XHRcdG5vZGUubm9kZU5hbWUgPT09IGhlbHBlci5ET0NVTUVOVF9UQUdfTkFNRVxuXHRcdCksXG5cblx0LyoqXG5cdCAqIEdldHMgYSBvcmlnaW5hbCBjb21wb25lbnQncyBuYW1lIHdpdGhvdXQgYSBwcmVmaXguXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBmdWxsQ29tcG9uZW50TmFtZSBUaGUgZnVsbCBjb21wb25lbnQncyBuYW1lICh0YWcgbmFtZSkuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBvcmlnaW5hbCBjb21wb25lbnQncyBuYW1lIHdpdGhvdXQgYSBwcmVmaXguXG5cdCAqL1xuXHRnZXRPcmlnaW5hbENvbXBvbmVudE5hbWU6IGZ1bGxDb21wb25lbnROYW1lID0+IHtcblx0XHRpZiAodHlwZW9mIChmdWxsQ29tcG9uZW50TmFtZSkgIT09ICdzdHJpbmcnKSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXG5cdFx0aWYgKGZ1bGxDb21wb25lbnROYW1lID09PSBoZWxwZXIuRE9DVU1FTlRfVEFHX05BTUUpIHtcblx0XHRcdHJldHVybiBoZWxwZXIuRE9DVU1FTlRfQ09NUE9ORU5UX05BTUU7XG5cdFx0fVxuXG5cdFx0aWYgKGZ1bGxDb21wb25lbnROYW1lID09PSBoZWxwZXIuSEVBRF9UQUdfTkFNRSkge1xuXHRcdFx0cmV0dXJuIGhlbHBlci5IRUFEX0NPTVBPTkVOVF9OQU1FO1xuXHRcdH1cblxuXHRcdHJldHVybiBmdWxsQ29tcG9uZW50TmFtZVxuXHRcdFx0LnRvTG93ZXJDYXNlKClcblx0XHRcdC5yZXBsYWNlKGhlbHBlci5DT01QT05FTlRfUFJFRklYX1JFR0VYUCwgJycpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBHZXRzIGEgdmFsaWQgdGFnIG5hbWUgZm9yIGEgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gY29tcG9uZW50TmFtZSBUaGUgbmFtZSBvZiB0aGUgY29tcG9uZW50LlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgbmFtZSBvZiB0aGUgdGFnLlxuXHQgKi9cblx0Z2V0VGFnTmFtZUZvckNvbXBvbmVudE5hbWU6IGNvbXBvbmVudE5hbWUgPT4ge1xuXHRcdGlmICh0eXBlb2YgKGNvbXBvbmVudE5hbWUpICE9PSAnc3RyaW5nJykge1xuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH1cblx0XHRjb25zdCB1cHBlckNvbXBvbmVudE5hbWUgPSBjb21wb25lbnROYW1lLnRvVXBwZXJDYXNlKCk7XG5cdFx0aWYgKGNvbXBvbmVudE5hbWUgPT09IGhlbHBlci5IRUFEX0NPTVBPTkVOVF9OQU1FKSB7XG5cdFx0XHRyZXR1cm4gdXBwZXJDb21wb25lbnROYW1lO1xuXHRcdH1cblx0XHRpZiAoY29tcG9uZW50TmFtZSA9PT0gaGVscGVyLkRPQ1VNRU5UX0NPTVBPTkVOVF9OQU1FKSB7XG5cdFx0XHRyZXR1cm4gaGVscGVyLkRPQ1VNRU5UX1RBR19OQU1FO1xuXHRcdH1cblx0XHRyZXR1cm4gaGVscGVyLkNPTVBPTkVOVF9UQUdfUFJFRklYICsgdXBwZXJDb21wb25lbnROYW1lO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBHZXRzIGEgcHJlZml4ZWQgbWV0aG9kIG9mIHRoZSBtb2R1bGUgdGhhdCBjYW4gYmUgaW52b2tlZC5cblx0ICogQHBhcmFtIHtPYmplY3R9IG1vZHVsZSBUaGUgbW9kdWxlIGltcGxlbWVudGF0aW9uLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcHJlZml4IFRoZSBtZXRob2QgcHJlZml4IChpLmUuIGhhbmRsZSkuXG5cdCAqIEBwYXJhbSB7c3RyaW5nP30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgZW50aXR5IHRvIGludm9rZSBtZXRob2QgZm9yXG5cdCAqICh3aWxsIGJlIGNvbnZlcnRlZCB0byBhIGNhbWVsIGNhc2UpLlxuXHQgKiBAcmV0dXJucyB7RnVuY3Rpb259IFRoZSBtZXRob2QgdG8gaW52b2tlLlxuXHQgKi9cblx0Z2V0TWV0aG9kVG9JbnZva2U6IChtb2R1bGUsIHByZWZpeCwgbmFtZSkgPT4ge1xuXHRcdGlmICghbW9kdWxlIHx8IHR5cGVvZiAobW9kdWxlKSAhPT0gJ29iamVjdCcpIHtcblx0XHRcdHJldHVybiBkZWZhdWx0UHJvbWlzZU1ldGhvZDtcblx0XHR9XG5cdFx0Y29uc3QgbWV0aG9kTmFtZSA9IGhlbHBlci5nZXRDYW1lbENhc2VOYW1lKHByZWZpeCwgbmFtZSk7XG5cdFx0aWYgKHR5cGVvZiAobW9kdWxlW21ldGhvZE5hbWVdKSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0cmV0dXJuIG1vZHVsZVttZXRob2ROYW1lXS5iaW5kKG1vZHVsZSk7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgKG1vZHVsZVtwcmVmaXhdKSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0cmV0dXJuIG1vZHVsZVtwcmVmaXhdLmJpbmQobW9kdWxlLCBuYW1lKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGVmYXVsdFByb21pc2VNZXRob2Q7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEdldHMgYSBuYW1lIGluIHRoZSBjYW1lbCBjYXNlIGZvciBhbnl0aGluZy5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHByZWZpeCBUaGUgcHJlZml4IGZvciB0aGUgbmFtZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgdG8gY29udmVydC5cblx0ICogQHJldHVybnMge3N0cmluZ30gTmFtZSBpbiB0aGUgY2FtZWwgY2FzZS5cblx0ICovXG5cdGdldENhbWVsQ2FzZU5hbWU6IChwcmVmaXgsIG5hbWUpID0+IHtcblx0XHRpZiAoIW5hbWUpIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cdFx0aWYgKHByZWZpeCkge1xuXHRcdFx0bmFtZSA9IGAke3ByZWZpeH0tJHtuYW1lfWA7XG5cdFx0fVxuXHRcdHJldHVybiBuYW1lXG5cdFx0XHQucmVwbGFjZSgvKD86W15hLXowLTldKykoXFx3KS9naSwgKHNwYWNlLCBsZXR0ZXIpID0+IGxldHRlci50b1VwcGVyQ2FzZSgpKVxuXHRcdFx0LnJlcGxhY2UoLyheW15hLXowLTldKXwoW15hLXowLTldJCkvZ2ksICcnKTtcblx0fSxcblxuXHQvKipcblx0ICogR2V0cyBhIHNhZmUgcHJvbWlzZSByZXNvbHZlZCBieSB0aGUgYWN0aW9uLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBhY3Rpb24gVGhlIGFjdGlvbiB0byB3cmFwIHdpdGggYSBzYWZlIHByb21pc2UuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgcHJvbWlzZSBmb3IgdGhlIGRvbmUgYWN0aW9uLlxuXHQgKi9cblx0Z2V0U2FmZVByb21pc2U6IGFjdGlvbiA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoYWN0aW9uKCkpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlKTtcblx0XHR9XG5cdH1cbn07XG5cbi8qKlxuICogSnVzdCByZXR1cm5zIGEgcmVzb2x2ZWQgcHJvbWlzZS5cbiAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgcHJvbWlzZSBmb3Igbm90aGluZy5cbiAqL1xuZnVuY3Rpb24gZGVmYXVsdFByb21pc2VNZXRob2QoKSB7XG5cdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoZWxwZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG5cdC8qKlxuXHQgKiBEZWZpbmVzIGEgcmVhZC1vbmx5IHByb3BlcnR5LlxuXHQgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gZGVmaW5lIGEgcHJvcGVydHkgaW4uXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eS5cblx0ICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgb2YgdGhlIHByb3BlcnR5LlxuXHQgKi9cblx0ZGVmaW5lUmVhZE9ubHk6IChvYmplY3QsIG5hbWUsIHZhbHVlKSA9PiB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwge1xuXHRcdFx0ZW51bWVyYWJsZTogZmFsc2UsXG5cdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuXHRcdFx0d3JpdGFibGU6IGZhbHNlLFxuXHRcdFx0dmFsdWVcblx0XHR9KTtcblx0fVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgbW9kdWxlSGVscGVyID0gcmVxdWlyZSgnLi9tb2R1bGVIZWxwZXInKTtcblxuY29uc3QgaGVscGVyID0ge1xuXG5cdC8qKlxuXHQgKiBSZWdpc3RlcnMgdGVtcGxhdGVzIGludG8gdGhlIGNvbXBvbmVudCBhbmQgdGVtcGxhdGUgcHJvdmlkZXJzLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gY29tcG9uZW50IFRoZSBjb21wb25lbnQuXG5cdCAqIEBwYXJhbSB7e3RlbXBsYXRlOiBzdHJpbmcsIGVycm9yVGVtcGxhdGU6IHN0cmluZ319IHRlbXBsYXRlc1xuXHQgKiBUaGUgY29tcGlsZWQgdGVtcGxhdGVzLlxuXHQgKi9cblx0cmVnaXN0ZXJUZW1wbGF0ZXM6IGNvbXBvbmVudCA9PiB7XG5cdFx0Y29tcG9uZW50LnRlbXBsYXRlUHJvdmlkZXIucmVnaXN0ZXJDb21waWxlZChjb21wb25lbnQubmFtZSwgY29tcG9uZW50LmNvbXBpbGVkVGVtcGxhdGUpO1xuXG5cdFx0Y29tcG9uZW50LnRlbXBsYXRlID0ge1xuXHRcdFx0cmVuZGVyOiBjb250ZXh0ID0+IGNvbXBvbmVudC50ZW1wbGF0ZVByb3ZpZGVyLnJlbmRlcihjb21wb25lbnQubmFtZSwgY29udGV4dClcblx0XHR9O1xuXG5cdFx0aWYgKCFjb21wb25lbnQuY29tcGlsZWRFcnJvclRlbXBsYXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZXJyb3JUZW1wbGF0ZU5hbWUgPSBtb2R1bGVIZWxwZXIuZ2V0TmFtZUZvckVycm9yVGVtcGxhdGUoY29tcG9uZW50Lm5hbWUpO1xuXHRcdGNvbXBvbmVudC5lcnJvclRlbXBsYXRlUHJvdmlkZXIucmVnaXN0ZXJDb21waWxlZChlcnJvclRlbXBsYXRlTmFtZSwgY29tcG9uZW50LmNvbXBpbGVkRXJyb3JUZW1wbGF0ZSk7XG5cblx0XHRjb21wb25lbnQuZXJyb3JUZW1wbGF0ZSA9IHtcblx0XHRcdHJlbmRlcjogY29udGV4dCA9PiBjb21wb25lbnQuZXJyb3JUZW1wbGF0ZVByb3ZpZGVyLnJlbmRlcihlcnJvclRlbXBsYXRlTmFtZSwgY29udGV4dClcblx0XHR9O1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZXNvbHZlcyB2YWxpZCB0ZW1wbGF0ZSBwcm92aWRlcnMuXG5cdCAqIEBwYXJhbSB7U2VydmljZUxvY2F0b3J9IGxvY2F0b3IgU2VydmljZSBsb2NhdG9yIHRoYXQgaGFzIHByb3ZpZGVycyByZWdpc3RlcmVkLlxuXHQgKiBAcmV0dXJucyB7QXJyYXk8VGVtcGxhdGVQcm92aWRlcj59IExpc3Qgb2YgdGVtcGxhdGUgcHJvdmlkZXJzLlxuXHQgKi9cblx0cmVzb2x2ZVRlbXBsYXRlUHJvdmlkZXJzOiBsb2NhdG9yID0+IHtcblx0XHRjb25zdCBldmVudEJ1cyA9IGxvY2F0b3IucmVzb2x2ZSgnZXZlbnRCdXMnKTtcblx0XHR0cnkge1xuXHRcdFx0cmV0dXJuIGxvY2F0b3Jcblx0XHRcdFx0LnJlc29sdmVBbGwoJ3RlbXBsYXRlUHJvdmlkZXInKVxuXHRcdFx0XHQuZmlsdGVyKHByb3ZpZGVyID0+IHtcblx0XHRcdFx0XHRjb25zdCBpc1ZhbGlkID0gdHlwZW9mIChwcm92aWRlci5nZXROYW1lKSA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZW9mIChwcm92aWRlci5yZWdpc3RlckNvbXBpbGVkKSA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZW9mIChwcm92aWRlci5yZW5kZXIpID09PSAnZnVuY3Rpb24nO1xuXHRcdFx0XHRcdGlmICghaXNWYWxpZCkge1xuXHRcdFx0XHRcdFx0ZXZlbnRCdXMuZW1pdCgnd2FybicsICdUZW1wbGF0ZSBwcm92aWRlciBkb2VzIG5vdCBoYXZlIHJlcXVpcmVkIG1ldGhvZHMsIHNraXBwaW5nLi4uJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBpc1ZhbGlkO1xuXHRcdFx0XHR9KTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRyZXR1cm4gW107XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZXNvbHZlcyB2YWxpZCB0ZW1wbGF0ZSBwcm92aWRlcnMgYnkgbmFtZXMuXG5cdCAqIEBwYXJhbSB7U2VydmljZUxvY2F0b3J9IGxvY2F0b3IgU2VydmljZSBsb2NhdG9yIHRoYXQgaGFzIHByb3ZpZGVycyByZWdpc3RlcmVkLlxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBNYXAgb2YgdGVtcGxhdGUgcHJvdmlkZXJzIGJ5IG5hbWVzLlxuXHQgKi9cblx0cmVzb2x2ZVRlbXBsYXRlUHJvdmlkZXJzQnlOYW1lczogbG9jYXRvciA9PiB7XG5cdFx0cmV0dXJuIGhlbHBlclxuXHRcdFx0LnJlc29sdmVUZW1wbGF0ZVByb3ZpZGVycyhsb2NhdG9yKVxuXHRcdFx0LnJlZHVjZSgobWFwLCBjdXJyZW50KSA9PiB7XG5cdFx0XHRcdG1hcFtjdXJyZW50LmdldE5hbWUoKV0gPSBjdXJyZW50O1xuXHRcdFx0XHRyZXR1cm4gbWFwO1xuXHRcdFx0fSwgT2JqZWN0LmNyZWF0ZShudWxsKSk7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaGVscGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBQQVRIX0VORF9TTEFTSF9SRUdfRVhQID0gLyguKylcXC8oJHxcXD98IykvO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuXHQvKipcblx0ICogUmVtb3ZlcyBhIHNsYXNoIGZyb20gdGhlIGVuZCBvZiB0aGUgVVJJIHBhdGguXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB1cmlQYXRoIFRoZSBVUkkgcGF0aC5cblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIFVSSSB3aXRob3V0IGEgc2xhc2ggYXQgdGhlIGVuZC5cblx0ICovXG5cdHJlbW92ZUVuZFNsYXNoKHVyaVBhdGgpIHtcblx0XHRpZiAoIXVyaVBhdGggfHwgdHlwZW9mICh1cmlQYXRoKSAhPT0gJ3N0cmluZycpIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cdFx0aWYgKHVyaVBhdGggPT09ICcvJykge1xuXHRcdFx0cmV0dXJuIHVyaVBhdGg7XG5cdFx0fVxuXHRcdHJldHVybiB1cmlQYXRoLnJlcGxhY2UoUEFUSF9FTkRfU0xBU0hfUkVHX0VYUCwgJyQxJDInKTtcblx0fVxufTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuICgnICsgZXIgKyAnKScpO1xuICAgICAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSlcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGV2bGlzdGVuZXIpXG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIid1c2Ugc3RyaWN0Jztcbi8vIENyZWF0ZSBhIHJhbmdlIG9iamVjdCBmb3IgZWZmaWNlbnRseSByZW5kZXJpbmcgc3RyaW5ncyB0byBlbGVtZW50cy5cbnZhciByYW5nZTtcblxudmFyIGRvYyA9IHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQ7XG5cbnZhciB0ZXN0RWwgPSBkb2MgP1xuICAgIGRvYy5ib2R5IHx8IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSA6XG4gICAge307XG5cbnZhciBOU19YSFRNTCA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJztcblxudmFyIEVMRU1FTlRfTk9ERSA9IDE7XG52YXIgVEVYVF9OT0RFID0gMztcbnZhciBDT01NRU5UX05PREUgPSA4O1xuXG4vLyBGaXhlcyA8aHR0cHM6Ly9naXRodWIuY29tL3BhdHJpY2stc3RlZWxlLWlkZW0vbW9ycGhkb20vaXNzdWVzLzMyPlxuLy8gKElFNysgc3VwcG9ydCkgPD1JRTcgZG9lcyBub3Qgc3VwcG9ydCBlbC5oYXNBdHRyaWJ1dGUobmFtZSlcbnZhciBoYXNBdHRyaWJ1dGVOUztcblxuaWYgKHRlc3RFbC5oYXNBdHRyaWJ1dGVOUykge1xuICAgIGhhc0F0dHJpYnV0ZU5TID0gZnVuY3Rpb24oZWwsIG5hbWVzcGFjZVVSSSwgbmFtZSkge1xuICAgICAgICByZXR1cm4gZWwuaGFzQXR0cmlidXRlTlMobmFtZXNwYWNlVVJJLCBuYW1lKTtcbiAgICB9O1xufSBlbHNlIGlmICh0ZXN0RWwuaGFzQXR0cmlidXRlKSB7XG4gICAgaGFzQXR0cmlidXRlTlMgPSBmdW5jdGlvbihlbCwgbmFtZXNwYWNlVVJJLCBuYW1lKSB7XG4gICAgICAgIHJldHVybiBlbC5oYXNBdHRyaWJ1dGUobmFtZSk7XG4gICAgfTtcbn0gZWxzZSB7XG4gICAgaGFzQXR0cmlidXRlTlMgPSBmdW5jdGlvbihlbCwgbmFtZXNwYWNlVVJJLCBuYW1lKSB7XG4gICAgICAgIHJldHVybiAhIWVsLmdldEF0dHJpYnV0ZU5vZGUobmFtZSk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gdG9FbGVtZW50KHN0cikge1xuICAgIGlmICghcmFuZ2UgJiYgZG9jLmNyZWF0ZVJhbmdlKSB7XG4gICAgICAgIHJhbmdlID0gZG9jLmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgIHJhbmdlLnNlbGVjdE5vZGUoZG9jLmJvZHkpO1xuICAgIH1cblxuICAgIHZhciBmcmFnbWVudDtcbiAgICBpZiAocmFuZ2UgJiYgcmFuZ2UuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KSB7XG4gICAgICAgIGZyYWdtZW50ID0gcmFuZ2UuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHN0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZnJhZ21lbnQgPSBkb2MuY3JlYXRlRWxlbWVudCgnYm9keScpO1xuICAgICAgICBmcmFnbWVudC5pbm5lckhUTUwgPSBzdHI7XG4gICAgfVxuICAgIHJldHVybiBmcmFnbWVudC5jaGlsZE5vZGVzWzBdO1xufVxuXG5mdW5jdGlvbiBzeW5jQm9vbGVhbkF0dHJQcm9wKGZyb21FbCwgdG9FbCwgbmFtZSkge1xuICAgIGlmIChmcm9tRWxbbmFtZV0gIT09IHRvRWxbbmFtZV0pIHtcbiAgICAgICAgZnJvbUVsW25hbWVdID0gdG9FbFtuYW1lXTtcbiAgICAgICAgaWYgKGZyb21FbFtuYW1lXSkge1xuICAgICAgICAgICAgZnJvbUVsLnNldEF0dHJpYnV0ZShuYW1lLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKG5hbWUsICcnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxudmFyIHNwZWNpYWxFbEhhbmRsZXJzID0ge1xuICAgIC8qKlxuICAgICAqIE5lZWRlZCBmb3IgSUUuIEFwcGFyZW50bHkgSUUgZG9lc24ndCB0aGluayB0aGF0IFwic2VsZWN0ZWRcIiBpcyBhblxuICAgICAqIGF0dHJpYnV0ZSB3aGVuIHJlYWRpbmcgb3ZlciB0aGUgYXR0cmlidXRlcyB1c2luZyBzZWxlY3RFbC5hdHRyaWJ1dGVzXG4gICAgICovXG4gICAgT1BUSU9OOiBmdW5jdGlvbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgc3luY0Jvb2xlYW5BdHRyUHJvcChmcm9tRWwsIHRvRWwsICdzZWxlY3RlZCcpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogVGhlIFwidmFsdWVcIiBhdHRyaWJ1dGUgaXMgc3BlY2lhbCBmb3IgdGhlIDxpbnB1dD4gZWxlbWVudCBzaW5jZSBpdCBzZXRzXG4gICAgICogdGhlIGluaXRpYWwgdmFsdWUuIENoYW5naW5nIHRoZSBcInZhbHVlXCIgYXR0cmlidXRlIHdpdGhvdXQgY2hhbmdpbmcgdGhlXG4gICAgICogXCJ2YWx1ZVwiIHByb3BlcnR5IHdpbGwgaGF2ZSBubyBlZmZlY3Qgc2luY2UgaXQgaXMgb25seSB1c2VkIHRvIHRoZSBzZXQgdGhlXG4gICAgICogaW5pdGlhbCB2YWx1ZS4gIFNpbWlsYXIgZm9yIHRoZSBcImNoZWNrZWRcIiBhdHRyaWJ1dGUsIGFuZCBcImRpc2FibGVkXCIuXG4gICAgICovXG4gICAgSU5QVVQ6IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICBzeW5jQm9vbGVhbkF0dHJQcm9wKGZyb21FbCwgdG9FbCwgJ2NoZWNrZWQnKTtcbiAgICAgICAgc3luY0Jvb2xlYW5BdHRyUHJvcChmcm9tRWwsIHRvRWwsICdkaXNhYmxlZCcpO1xuXG4gICAgICAgIGlmIChmcm9tRWwudmFsdWUgIT09IHRvRWwudmFsdWUpIHtcbiAgICAgICAgICAgIGZyb21FbC52YWx1ZSA9IHRvRWwudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhhc0F0dHJpYnV0ZU5TKHRvRWwsIG51bGwsICd2YWx1ZScpKSB7XG4gICAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKCd2YWx1ZScpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIFRFWFRBUkVBOiBmdW5jdGlvbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gdG9FbC52YWx1ZTtcbiAgICAgICAgaWYgKGZyb21FbC52YWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgIGZyb21FbC52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZyb21FbC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAvLyBOZWVkZWQgZm9yIElFLiBBcHBhcmVudGx5IElFIHNldHMgdGhlIHBsYWNlaG9sZGVyIGFzIHRoZVxuICAgICAgICAgICAgLy8gbm9kZSB2YWx1ZSBhbmQgdmlzZSB2ZXJzYS4gVGhpcyBpZ25vcmVzIGFuIGVtcHR5IHVwZGF0ZS5cbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gJycgJiYgZnJvbUVsLmZpcnN0Q2hpbGQubm9kZVZhbHVlID09PSBmcm9tRWwucGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZyb21FbC5maXJzdENoaWxkLm5vZGVWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBTRUxFQ1Q6IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICBpZiAoIWhhc0F0dHJpYnV0ZU5TKHRvRWwsIG51bGwsICdtdWx0aXBsZScpKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRJbmRleCA9IC0xO1xuICAgICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgICAgdmFyIGN1ckNoaWxkID0gdG9FbC5maXJzdENoaWxkO1xuICAgICAgICAgICAgd2hpbGUoY3VyQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZU5hbWUgPSBjdXJDaGlsZC5ub2RlTmFtZTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZU5hbWUgJiYgbm9kZU5hbWUudG9VcHBlckNhc2UoKSA9PT0gJ09QVElPTicpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhhc0F0dHJpYnV0ZU5TKGN1ckNoaWxkLCBudWxsLCAnc2VsZWN0ZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZyb21FbC5zZWxlY3RlZEluZGV4ID0gaTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0d28gbm9kZSdzIG5hbWVzIGFyZSB0aGUgc2FtZS5cbiAqXG4gKiBOT1RFOiBXZSBkb24ndCBib3RoZXIgY2hlY2tpbmcgYG5hbWVzcGFjZVVSSWAgYmVjYXVzZSB5b3Ugd2lsbCBuZXZlciBmaW5kIHR3byBIVE1MIGVsZW1lbnRzIHdpdGggdGhlIHNhbWVcbiAqICAgICAgIG5vZGVOYW1lIGFuZCBkaWZmZXJlbnQgbmFtZXNwYWNlIFVSSXMuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBhXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGIgVGhlIHRhcmdldCBlbGVtZW50XG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBjb21wYXJlTm9kZU5hbWVzKGZyb21FbCwgdG9FbCkge1xuICAgIHZhciBmcm9tTm9kZU5hbWUgPSBmcm9tRWwubm9kZU5hbWU7XG4gICAgdmFyIHRvTm9kZU5hbWUgPSB0b0VsLm5vZGVOYW1lO1xuXG4gICAgaWYgKGZyb21Ob2RlTmFtZSA9PT0gdG9Ob2RlTmFtZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodG9FbC5hY3R1YWxpemUgJiZcbiAgICAgICAgZnJvbU5vZGVOYW1lLmNoYXJDb2RlQXQoMCkgPCA5MSAmJiAvKiBmcm9tIHRhZyBuYW1lIGlzIHVwcGVyIGNhc2UgKi9cbiAgICAgICAgdG9Ob2RlTmFtZS5jaGFyQ29kZUF0KDApID4gOTAgLyogdGFyZ2V0IHRhZyBuYW1lIGlzIGxvd2VyIGNhc2UgKi8pIHtcbiAgICAgICAgLy8gSWYgdGhlIHRhcmdldCBlbGVtZW50IGlzIGEgdmlydHVhbCBET00gbm9kZSB0aGVuIHdlIG1heSBuZWVkIHRvIG5vcm1hbGl6ZSB0aGUgdGFnIG5hbWVcbiAgICAgICAgLy8gYmVmb3JlIGNvbXBhcmluZy4gTm9ybWFsIEhUTUwgZWxlbWVudHMgdGhhdCBhcmUgaW4gdGhlIFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiXG4gICAgICAgIC8vIGFyZSBjb252ZXJ0ZWQgdG8gdXBwZXIgY2FzZVxuICAgICAgICByZXR1cm4gZnJvbU5vZGVOYW1lID09PSB0b05vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYW4gZWxlbWVudCwgb3B0aW9uYWxseSB3aXRoIGEga25vd24gbmFtZXNwYWNlIFVSSS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSB0aGUgZWxlbWVudCBuYW1lLCBlLmcuICdkaXYnIG9yICdzdmcnXG4gKiBAcGFyYW0ge3N0cmluZ30gW25hbWVzcGFjZVVSSV0gdGhlIGVsZW1lbnQncyBuYW1lc3BhY2UgVVJJLCBpLmUuIHRoZSB2YWx1ZSBvZlxuICogaXRzIGB4bWxuc2AgYXR0cmlidXRlIG9yIGl0cyBpbmZlcnJlZCBuYW1lc3BhY2UuXG4gKlxuICogQHJldHVybiB7RWxlbWVudH1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlRWxlbWVudE5TKG5hbWUsIG5hbWVzcGFjZVVSSSkge1xuICAgIHJldHVybiAhbmFtZXNwYWNlVVJJIHx8IG5hbWVzcGFjZVVSSSA9PT0gTlNfWEhUTUwgP1xuICAgICAgICBkb2MuY3JlYXRlRWxlbWVudChuYW1lKSA6XG4gICAgICAgIGRvYy5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJLCBuYW1lKTtcbn1cblxuLyoqXG4gKiBMb29wIG92ZXIgYWxsIG9mIHRoZSBhdHRyaWJ1dGVzIG9uIHRoZSB0YXJnZXQgbm9kZSBhbmQgbWFrZSBzdXJlIHRoZSBvcmlnaW5hbFxuICogRE9NIG5vZGUgaGFzIHRoZSBzYW1lIGF0dHJpYnV0ZXMuIElmIGFuIGF0dHJpYnV0ZSBmb3VuZCBvbiB0aGUgb3JpZ2luYWwgbm9kZVxuICogaXMgbm90IG9uIHRoZSBuZXcgbm9kZSB0aGVuIHJlbW92ZSBpdCBmcm9tIHRoZSBvcmlnaW5hbCBub2RlLlxuICpcbiAqIEBwYXJhbSAge0VsZW1lbnR9IGZyb21Ob2RlXG4gKiBAcGFyYW0gIHtFbGVtZW50fSB0b05vZGVcbiAqL1xuZnVuY3Rpb24gbW9ycGhBdHRycyhmcm9tTm9kZSwgdG9Ob2RlKSB7XG4gICAgaWYgKHRvTm9kZS5hc3NpZ25BdHRyaWJ1dGVzKSB7XG4gICAgICAgIHRvTm9kZS5hc3NpZ25BdHRyaWJ1dGVzKGZyb21Ob2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgYXR0cnMgPSB0b05vZGUuYXR0cmlidXRlcztcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBhdHRyO1xuICAgICAgICB2YXIgYXR0ck5hbWU7XG4gICAgICAgIHZhciBhdHRyTmFtZXNwYWNlVVJJO1xuICAgICAgICB2YXIgYXR0clZhbHVlO1xuICAgICAgICB2YXIgZnJvbVZhbHVlO1xuXG4gICAgICAgIGZvciAoaSA9IGF0dHJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICBhdHRyID0gYXR0cnNbaV07XG4gICAgICAgICAgICBhdHRyTmFtZSA9IGF0dHIubmFtZTtcbiAgICAgICAgICAgIGF0dHJOYW1lc3BhY2VVUkkgPSBhdHRyLm5hbWVzcGFjZVVSSTtcbiAgICAgICAgICAgIGF0dHJWYWx1ZSA9IGF0dHIudmFsdWU7XG5cbiAgICAgICAgICAgIGlmIChhdHRyTmFtZXNwYWNlVVJJKSB7XG4gICAgICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRyLmxvY2FsTmFtZSB8fCBhdHRyTmFtZTtcbiAgICAgICAgICAgICAgICBmcm9tVmFsdWUgPSBmcm9tTm9kZS5nZXRBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZnJvbVZhbHVlICE9PSBhdHRyVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbU5vZGUuc2V0QXR0cmlidXRlTlMoYXR0ck5hbWVzcGFjZVVSSSwgYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmcm9tVmFsdWUgPSBmcm9tTm9kZS5nZXRBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZyb21WYWx1ZSAhPT0gYXR0clZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyb21Ob2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW1vdmUgYW55IGV4dHJhIGF0dHJpYnV0ZXMgZm91bmQgb24gdGhlIG9yaWdpbmFsIERPTSBlbGVtZW50IHRoYXRcbiAgICAgICAgLy8gd2VyZW4ndCBmb3VuZCBvbiB0aGUgdGFyZ2V0IGVsZW1lbnQuXG4gICAgICAgIGF0dHJzID0gZnJvbU5vZGUuYXR0cmlidXRlcztcblxuICAgICAgICBmb3IgKGkgPSBhdHRycy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICAgICAgYXR0ciA9IGF0dHJzW2ldO1xuICAgICAgICAgICAgaWYgKGF0dHIuc3BlY2lmaWVkICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGF0dHJOYW1lID0gYXR0ci5uYW1lO1xuICAgICAgICAgICAgICAgIGF0dHJOYW1lc3BhY2VVUkkgPSBhdHRyLm5hbWVzcGFjZVVSSTtcblxuICAgICAgICAgICAgICAgIGlmIChhdHRyTmFtZXNwYWNlVVJJKSB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJOYW1lID0gYXR0ci5sb2NhbE5hbWUgfHwgYXR0ck5hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFoYXNBdHRyaWJ1dGVOUyh0b05vZGUsIGF0dHJOYW1lc3BhY2VVUkksIGF0dHJOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbU5vZGUucmVtb3ZlQXR0cmlidXRlTlMoYXR0ck5hbWVzcGFjZVVSSSwgYXR0ck5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFoYXNBdHRyaWJ1dGVOUyh0b05vZGUsIG51bGwsIGF0dHJOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbU5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBDb3BpZXMgdGhlIGNoaWxkcmVuIG9mIG9uZSBET00gZWxlbWVudCB0byBhbm90aGVyIERPTSBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIG1vdmVDaGlsZHJlbihmcm9tRWwsIHRvRWwpIHtcbiAgICB2YXIgY3VyQ2hpbGQgPSBmcm9tRWwuZmlyc3RDaGlsZDtcbiAgICB3aGlsZSAoY3VyQ2hpbGQpIHtcbiAgICAgICAgdmFyIG5leHRDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICB0b0VsLmFwcGVuZENoaWxkKGN1ckNoaWxkKTtcbiAgICAgICAgY3VyQ2hpbGQgPSBuZXh0Q2hpbGQ7XG4gICAgfVxuICAgIHJldHVybiB0b0VsO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0R2V0Tm9kZUtleShub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuaWQ7XG59XG5cbmZ1bmN0aW9uIG1vcnBoZG9tKGZyb21Ob2RlLCB0b05vZGUsIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdG9Ob2RlID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAoZnJvbU5vZGUubm9kZU5hbWUgPT09ICcjZG9jdW1lbnQnIHx8IGZyb21Ob2RlLm5vZGVOYW1lID09PSAnSFRNTCcpIHtcbiAgICAgICAgICAgIHZhciB0b05vZGVIdG1sID0gdG9Ob2RlO1xuICAgICAgICAgICAgdG9Ob2RlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2h0bWwnKTtcbiAgICAgICAgICAgIHRvTm9kZS5pbm5lckhUTUwgPSB0b05vZGVIdG1sO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9Ob2RlID0gdG9FbGVtZW50KHRvTm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZ2V0Tm9kZUtleSA9IG9wdGlvbnMuZ2V0Tm9kZUtleSB8fCBkZWZhdWx0R2V0Tm9kZUtleTtcbiAgICB2YXIgb25CZWZvcmVOb2RlQWRkZWQgPSBvcHRpb25zLm9uQmVmb3JlTm9kZUFkZGVkIHx8IG5vb3A7XG4gICAgdmFyIG9uTm9kZUFkZGVkID0gb3B0aW9ucy5vbk5vZGVBZGRlZCB8fCBub29wO1xuICAgIHZhciBvbkJlZm9yZUVsVXBkYXRlZCA9IG9wdGlvbnMub25CZWZvcmVFbFVwZGF0ZWQgfHwgbm9vcDtcbiAgICB2YXIgb25FbFVwZGF0ZWQgPSBvcHRpb25zLm9uRWxVcGRhdGVkIHx8IG5vb3A7XG4gICAgdmFyIG9uQmVmb3JlTm9kZURpc2NhcmRlZCA9IG9wdGlvbnMub25CZWZvcmVOb2RlRGlzY2FyZGVkIHx8IG5vb3A7XG4gICAgdmFyIG9uTm9kZURpc2NhcmRlZCA9IG9wdGlvbnMub25Ob2RlRGlzY2FyZGVkIHx8IG5vb3A7XG4gICAgdmFyIG9uQmVmb3JlRWxDaGlsZHJlblVwZGF0ZWQgPSBvcHRpb25zLm9uQmVmb3JlRWxDaGlsZHJlblVwZGF0ZWQgfHwgbm9vcDtcbiAgICB2YXIgY2hpbGRyZW5Pbmx5ID0gb3B0aW9ucy5jaGlsZHJlbk9ubHkgPT09IHRydWU7XG5cbiAgICAvLyBUaGlzIG9iamVjdCBpcyB1c2VkIGFzIGEgbG9va3VwIHRvIHF1aWNrbHkgZmluZCBhbGwga2V5ZWQgZWxlbWVudHMgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlLlxuICAgIHZhciBmcm9tTm9kZXNMb29rdXAgPSB7fTtcbiAgICB2YXIga2V5ZWRSZW1vdmFsTGlzdDtcblxuICAgIGZ1bmN0aW9uIGFkZEtleWVkUmVtb3ZhbChrZXkpIHtcbiAgICAgICAgaWYgKGtleWVkUmVtb3ZhbExpc3QpIHtcbiAgICAgICAgICAgIGtleWVkUmVtb3ZhbExpc3QucHVzaChrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAga2V5ZWRSZW1vdmFsTGlzdCA9IFtrZXldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2Fsa0Rpc2NhcmRlZENoaWxkTm9kZXMobm9kZSwgc2tpcEtleWVkTm9kZXMpIHtcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgdmFyIGN1ckNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuICAgICAgICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNraXBLZXllZE5vZGVzICYmIChrZXkgPSBnZXROb2RlS2V5KGN1ckNoaWxkKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgd2UgYXJlIHNraXBwaW5nIGtleWVkIG5vZGVzIHRoZW4gd2UgYWRkIHRoZSBrZXlcbiAgICAgICAgICAgICAgICAgICAgLy8gdG8gYSBsaXN0IHNvIHRoYXQgaXQgY2FuIGJlIGhhbmRsZWQgYXQgdGhlIHZlcnkgZW5kLlxuICAgICAgICAgICAgICAgICAgICBhZGRLZXllZFJlbW92YWwoa2V5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IHJlcG9ydCB0aGUgbm9kZSBhcyBkaXNjYXJkZWQgaWYgaXQgaXMgbm90IGtleWVkLiBXZSBkbyB0aGlzIGJlY2F1c2VcbiAgICAgICAgICAgICAgICAgICAgLy8gYXQgdGhlIGVuZCB3ZSBsb29wIHRocm91Z2ggYWxsIGtleWVkIGVsZW1lbnRzIHRoYXQgd2VyZSB1bm1hdGNoZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gYW5kIHRoZW4gZGlzY2FyZCB0aGVtIGluIG9uZSBmaW5hbCBwYXNzLlxuICAgICAgICAgICAgICAgICAgICBvbk5vZGVEaXNjYXJkZWQoY3VyQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyQ2hpbGQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2Fsa0Rpc2NhcmRlZENoaWxkTm9kZXMoY3VyQ2hpbGQsIHNraXBLZXllZE5vZGVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgRE9NIG5vZGUgb3V0IG9mIHRoZSBvcmlnaW5hbCBET01cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge05vZGV9IG5vZGUgVGhlIG5vZGUgdG8gcmVtb3ZlXG4gICAgICogQHBhcmFtICB7Tm9kZX0gcGFyZW50Tm9kZSBUaGUgbm9kZXMgcGFyZW50XG4gICAgICogQHBhcmFtICB7Qm9vbGVhbn0gc2tpcEtleWVkTm9kZXMgSWYgdHJ1ZSB0aGVuIGVsZW1lbnRzIHdpdGgga2V5cyB3aWxsIGJlIHNraXBwZWQgYW5kIG5vdCBkaXNjYXJkZWQuXG4gICAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlbW92ZU5vZGUobm9kZSwgcGFyZW50Tm9kZSwgc2tpcEtleWVkTm9kZXMpIHtcbiAgICAgICAgaWYgKG9uQmVmb3JlTm9kZURpc2NhcmRlZChub2RlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgb25Ob2RlRGlzY2FyZGVkKG5vZGUpO1xuICAgICAgICB3YWxrRGlzY2FyZGVkQ2hpbGROb2Rlcyhub2RlLCBza2lwS2V5ZWROb2Rlcyk7XG4gICAgfVxuXG4gICAgLy8gLy8gVHJlZVdhbGtlciBpbXBsZW1lbnRhdGlvbiBpcyBubyBmYXN0ZXIsIGJ1dCBrZWVwaW5nIHRoaXMgYXJvdW5kIGluIGNhc2UgdGhpcyBjaGFuZ2VzIGluIHRoZSBmdXR1cmVcbiAgICAvLyBmdW5jdGlvbiBpbmRleFRyZWUocm9vdCkge1xuICAgIC8vICAgICB2YXIgdHJlZVdhbGtlciA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIoXG4gICAgLy8gICAgICAgICByb290LFxuICAgIC8vICAgICAgICAgTm9kZUZpbHRlci5TSE9XX0VMRU1FTlQpO1xuICAgIC8vXG4gICAgLy8gICAgIHZhciBlbDtcbiAgICAvLyAgICAgd2hpbGUoKGVsID0gdHJlZVdhbGtlci5uZXh0Tm9kZSgpKSkge1xuICAgIC8vICAgICAgICAgdmFyIGtleSA9IGdldE5vZGVLZXkoZWwpO1xuICAgIC8vICAgICAgICAgaWYgKGtleSkge1xuICAgIC8vICAgICAgICAgICAgIGZyb21Ob2Rlc0xvb2t1cFtrZXldID0gZWw7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG5cbiAgICAvLyAvLyBOb2RlSXRlcmF0b3IgaW1wbGVtZW50YXRpb24gaXMgbm8gZmFzdGVyLCBidXQga2VlcGluZyB0aGlzIGFyb3VuZCBpbiBjYXNlIHRoaXMgY2hhbmdlcyBpbiB0aGUgZnV0dXJlXG4gICAgLy9cbiAgICAvLyBmdW5jdGlvbiBpbmRleFRyZWUobm9kZSkge1xuICAgIC8vICAgICB2YXIgbm9kZUl0ZXJhdG9yID0gZG9jdW1lbnQuY3JlYXRlTm9kZUl0ZXJhdG9yKG5vZGUsIE5vZGVGaWx0ZXIuU0hPV19FTEVNRU5UKTtcbiAgICAvLyAgICAgdmFyIGVsO1xuICAgIC8vICAgICB3aGlsZSgoZWwgPSBub2RlSXRlcmF0b3IubmV4dE5vZGUoKSkpIHtcbiAgICAvLyAgICAgICAgIHZhciBrZXkgPSBnZXROb2RlS2V5KGVsKTtcbiAgICAvLyAgICAgICAgIGlmIChrZXkpIHtcbiAgICAvLyAgICAgICAgICAgICBmcm9tTm9kZXNMb29rdXBba2V5XSA9IGVsO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgZnVuY3Rpb24gaW5kZXhUcmVlKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgdmFyIGN1ckNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuICAgICAgICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGdldE5vZGVLZXkoY3VyQ2hpbGQpO1xuICAgICAgICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbU5vZGVzTG9va3VwW2tleV0gPSBjdXJDaGlsZDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBXYWxrIHJlY3Vyc2l2ZWx5XG4gICAgICAgICAgICAgICAgaW5kZXhUcmVlKGN1ckNoaWxkKTtcblxuICAgICAgICAgICAgICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbmRleFRyZWUoZnJvbU5vZGUpO1xuXG4gICAgZnVuY3Rpb24gaGFuZGxlTm9kZUFkZGVkKGVsKSB7XG4gICAgICAgIG9uTm9kZUFkZGVkKGVsKTtcblxuICAgICAgICB2YXIgY3VyQ2hpbGQgPSBlbC5maXJzdENoaWxkO1xuICAgICAgICB3aGlsZSAoY3VyQ2hpbGQpIHtcbiAgICAgICAgICAgIHZhciBuZXh0U2libGluZyA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuXG4gICAgICAgICAgICB2YXIga2V5ID0gZ2V0Tm9kZUtleShjdXJDaGlsZCk7XG4gICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgdmFyIHVubWF0Y2hlZEZyb21FbCA9IGZyb21Ob2Rlc0xvb2t1cFtrZXldO1xuICAgICAgICAgICAgICAgIGlmICh1bm1hdGNoZWRGcm9tRWwgJiYgY29tcGFyZU5vZGVOYW1lcyhjdXJDaGlsZCwgdW5tYXRjaGVkRnJvbUVsKSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZCh1bm1hdGNoZWRGcm9tRWwsIGN1ckNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgbW9ycGhFbCh1bm1hdGNoZWRGcm9tRWwsIGN1ckNoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGhhbmRsZU5vZGVBZGRlZChjdXJDaGlsZCk7XG4gICAgICAgICAgICBjdXJDaGlsZCA9IG5leHRTaWJsaW5nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9ycGhFbChmcm9tRWwsIHRvRWwsIGNoaWxkcmVuT25seSkge1xuICAgICAgICB2YXIgdG9FbEtleSA9IGdldE5vZGVLZXkodG9FbCk7XG4gICAgICAgIHZhciBjdXJGcm9tTm9kZUtleTtcblxuICAgICAgICBpZiAodG9FbEtleSkge1xuICAgICAgICAgICAgLy8gSWYgYW4gZWxlbWVudCB3aXRoIGFuIElEIGlzIGJlaW5nIG1vcnBoZWQgdGhlbiBpdCBpcyB3aWxsIGJlIGluIHRoZSBmaW5hbFxuICAgICAgICAgICAgLy8gRE9NIHNvIGNsZWFyIGl0IG91dCBvZiB0aGUgc2F2ZWQgZWxlbWVudHMgY29sbGVjdGlvblxuICAgICAgICAgICAgZGVsZXRlIGZyb21Ob2Rlc0xvb2t1cFt0b0VsS2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b05vZGUuaXNTYW1lTm9kZSAmJiB0b05vZGUuaXNTYW1lTm9kZShmcm9tTm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY2hpbGRyZW5Pbmx5KSB7XG4gICAgICAgICAgICBpZiAob25CZWZvcmVFbFVwZGF0ZWQoZnJvbUVsLCB0b0VsKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1vcnBoQXR0cnMoZnJvbUVsLCB0b0VsKTtcbiAgICAgICAgICAgIG9uRWxVcGRhdGVkKGZyb21FbCk7XG5cbiAgICAgICAgICAgIGlmIChvbkJlZm9yZUVsQ2hpbGRyZW5VcGRhdGVkKGZyb21FbCwgdG9FbCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZyb21FbC5ub2RlTmFtZSAhPT0gJ1RFWFRBUkVBJykge1xuICAgICAgICAgICAgdmFyIGN1clRvTm9kZUNoaWxkID0gdG9FbC5maXJzdENoaWxkO1xuICAgICAgICAgICAgdmFyIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tRWwuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIHZhciBjdXJUb05vZGVLZXk7XG5cbiAgICAgICAgICAgIHZhciBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB2YXIgdG9OZXh0U2libGluZztcbiAgICAgICAgICAgIHZhciBtYXRjaGluZ0Zyb21FbDtcblxuICAgICAgICAgICAgb3V0ZXI6IHdoaWxlIChjdXJUb05vZGVDaGlsZCkge1xuICAgICAgICAgICAgICAgIHRvTmV4dFNpYmxpbmcgPSBjdXJUb05vZGVDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICBjdXJUb05vZGVLZXkgPSBnZXROb2RlS2V5KGN1clRvTm9kZUNoaWxkKTtcblxuICAgICAgICAgICAgICAgIHdoaWxlIChjdXJGcm9tTm9kZUNoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUNoaWxkLmlzU2FtZU5vZGUgJiYgY3VyVG9Ob2RlQ2hpbGQuaXNTYW1lTm9kZShjdXJGcm9tTm9kZUNoaWxkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVLZXkgPSBnZXROb2RlS2V5KGN1ckZyb21Ob2RlQ2hpbGQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJGcm9tTm9kZVR5cGUgPSBjdXJGcm9tTm9kZUNoaWxkLm5vZGVUeXBlO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBpc0NvbXBhdGlibGUgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlVHlwZSA9PT0gY3VyVG9Ob2RlQ2hpbGQubm9kZVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJvdGggbm9kZXMgYmVpbmcgY29tcGFyZWQgYXJlIEVsZW1lbnQgbm9kZXNcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJUb05vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIHRhcmdldCBub2RlIGhhcyBhIGtleSBzbyB3ZSB3YW50IHRvIG1hdGNoIGl0IHVwIHdpdGggdGhlIGNvcnJlY3QgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbiB0aGUgb3JpZ2luYWwgRE9NIHRyZWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUtleSAhPT0gY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBjdXJyZW50IGVsZW1lbnQgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlIGRvZXMgbm90IGhhdmUgYSBtYXRjaGluZyBrZXkgc29cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxldCdzIGNoZWNrIG91ciBsb29rdXAgdG8gc2VlIGlmIHRoZXJlIGlzIGEgbWF0Y2hpbmcgZWxlbWVudCBpbiB0aGUgb3JpZ2luYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERPTSB0cmVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKG1hdGNoaW5nRnJvbUVsID0gZnJvbU5vZGVzTG9va3VwW2N1clRvTm9kZUtleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlQ2hpbGQubmV4dFNpYmxpbmcgPT09IG1hdGNoaW5nRnJvbUVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNwZWNpYWwgY2FzZSBmb3Igc2luZ2xlIGVsZW1lbnQgcmVtb3ZhbHMuIFRvIGF2b2lkIHJlbW92aW5nIHRoZSBvcmlnaW5hbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBET00gbm9kZSBvdXQgb2YgdGhlIHRyZWUgKHNpbmNlIHRoYXQgY2FuIGJyZWFrIENTUyB0cmFuc2l0aW9ucywgZXRjLiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIHdpbGwgaW5zdGVhZCBkaXNjYXJkIHRoZSBjdXJyZW50IG5vZGUgYW5kIHdhaXQgdW50aWwgdGhlIG5leHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXRlcmF0aW9uIHRvIHByb3Blcmx5IG1hdGNoIHVwIHRoZSBrZXllZCB0YXJnZXQgZWxlbWVudCB3aXRoIGl0cyBtYXRjaGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlbGVtZW50IGluIHRoZSBvcmlnaW5hbCB0cmVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGZvdW5kIGEgbWF0Y2hpbmcga2V5ZWQgZWxlbWVudCBzb21ld2hlcmUgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMZXQncyBtb3ZpbmcgdGhlIG9yaWdpbmFsIERPTSBub2RlIGludG8gdGhlIGN1cnJlbnQgcG9zaXRpb24gYW5kIG1vcnBoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0LlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IFdlIHVzZSBpbnNlcnRCZWZvcmUgaW5zdGVhZCBvZiByZXBsYWNlQ2hpbGQgYmVjYXVzZSB3ZSB3YW50IHRvIGdvIHRocm91Z2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGByZW1vdmVOb2RlKClgIGZ1bmN0aW9uIGZvciB0aGUgbm9kZSB0aGF0IGlzIGJlaW5nIGRpc2NhcmRlZCBzbyB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsbCBsaWZlY3ljbGUgaG9va3MgYXJlIGNvcnJlY3RseSBpbnZva2VkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21FbC5pbnNlcnRCZWZvcmUobWF0Y2hpbmdGcm9tRWwsIGN1ckZyb21Ob2RlQ2hpbGQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaW5jZSB0aGUgbm9kZSBpcyBrZXllZCBpdCBtaWdodCBiZSBtYXRjaGVkIHVwIGxhdGVyIHNvIHdlIGRlZmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgYWN0dWFsIHJlbW92YWwgdG8gbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiB3ZSBza2lwIG5lc3RlZCBrZXllZCBub2RlcyBmcm9tIGJlaW5nIHJlbW92ZWQgc2luY2UgdGhlcmUgaXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgIHN0aWxsIGEgY2hhbmNlIHRoZXkgd2lsbCBiZSBtYXRjaGVkIHVwIGxhdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21FbCwgdHJ1ZSAvKiBza2lwIGtleWVkIG5vZGVzICovKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBtYXRjaGluZ0Zyb21FbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBub2RlcyBhcmUgbm90IGNvbXBhdGlibGUgc2luY2UgdGhlIFwidG9cIiBub2RlIGhhcyBhIGtleSBhbmQgdGhlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpcyBubyBtYXRjaGluZyBrZXllZCBub2RlIGluIHRoZSBzb3VyY2UgdHJlZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJGcm9tTm9kZUtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgb3JpZ2luYWwgaGFzIGEga2V5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGlzQ29tcGF0aWJsZSAhPT0gZmFsc2UgJiYgY29tcGFyZU5vZGVOYW1lcyhjdXJGcm9tTm9kZUNoaWxkLCBjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQ29tcGF0aWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBmb3VuZCBjb21wYXRpYmxlIERPTSBlbGVtZW50cyBzbyB0cmFuc2Zvcm1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGN1cnJlbnQgXCJmcm9tXCIgbm9kZSB0byBtYXRjaCB0aGUgY3VycmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0YXJnZXQgRE9NIG5vZGUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vcnBoRWwoY3VyRnJvbU5vZGVDaGlsZCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJGcm9tTm9kZVR5cGUgPT09IFRFWFRfTk9ERSB8fCBjdXJGcm9tTm9kZVR5cGUgPT0gQ09NTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQm90aCBub2RlcyBiZWluZyBjb21wYXJlZCBhcmUgVGV4dCBvciBDb21tZW50IG5vZGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaW1wbHkgdXBkYXRlIG5vZGVWYWx1ZSBvbiB0aGUgb3JpZ2luYWwgbm9kZSB0b1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoYW5nZSB0aGUgdGV4dCB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQubm9kZVZhbHVlID0gY3VyVG9Ob2RlQ2hpbGQubm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQ29tcGF0aWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWR2YW5jZSBib3RoIHRoZSBcInRvXCIgY2hpbGQgYW5kIHRoZSBcImZyb21cIiBjaGlsZCBzaW5jZSB3ZSBmb3VuZCBhIG1hdGNoXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWUgb3V0ZXI7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBObyBjb21wYXRpYmxlIG1hdGNoIHNvIHJlbW92ZSB0aGUgb2xkIG5vZGUgZnJvbSB0aGUgRE9NIGFuZCBjb250aW51ZSB0cnlpbmcgdG8gZmluZCBhXG4gICAgICAgICAgICAgICAgICAgIC8vIG1hdGNoIGluIHRoZSBvcmlnaW5hbCBET00uIEhvd2V2ZXIsIHdlIG9ubHkgZG8gdGhpcyBpZiB0aGUgZnJvbSBub2RlIGlzIG5vdCBrZXllZFxuICAgICAgICAgICAgICAgICAgICAvLyBzaW5jZSBpdCBpcyBwb3NzaWJsZSB0aGF0IGEga2V5ZWQgbm9kZSBtaWdodCBtYXRjaCB1cCB3aXRoIGEgbm9kZSBzb21ld2hlcmUgZWxzZSBpbiB0aGVcbiAgICAgICAgICAgICAgICAgICAgLy8gdGFyZ2V0IHRyZWUgYW5kIHdlIGRvbid0IHdhbnQgdG8gZGlzY2FyZCBpdCBqdXN0IHlldCBzaW5jZSBpdCBzdGlsbCBtaWdodCBmaW5kIGFcbiAgICAgICAgICAgICAgICAgICAgLy8gaG9tZSBpbiB0aGUgZmluYWwgRE9NIHRyZWUuIEFmdGVyIGV2ZXJ5dGhpbmcgaXMgZG9uZSB3ZSB3aWxsIHJlbW92ZSBhbnkga2V5ZWQgbm9kZXNcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhhdCBkaWRuJ3QgZmluZCBhIGhvbWVcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTaW5jZSB0aGUgbm9kZSBpcyBrZXllZCBpdCBtaWdodCBiZSBtYXRjaGVkIHVwIGxhdGVyIHNvIHdlIGRlZmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgYWN0dWFsIHJlbW92YWwgdG8gbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiB3ZSBza2lwIG5lc3RlZCBrZXllZCBub2RlcyBmcm9tIGJlaW5nIHJlbW92ZWQgc2luY2UgdGhlcmUgaXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgIHN0aWxsIGEgY2hhbmNlIHRoZXkgd2lsbCBiZSBtYXRjaGVkIHVwIGxhdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21FbCwgdHJ1ZSAvKiBza2lwIGtleWVkIG5vZGVzICovKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSWYgd2UgZ290IHRoaXMgZmFyIHRoZW4gd2UgZGlkIG5vdCBmaW5kIGEgY2FuZGlkYXRlIG1hdGNoIGZvclxuICAgICAgICAgICAgICAgIC8vIG91ciBcInRvIG5vZGVcIiBhbmQgd2UgZXhoYXVzdGVkIGFsbCBvZiB0aGUgY2hpbGRyZW4gXCJmcm9tXCJcbiAgICAgICAgICAgICAgICAvLyBub2Rlcy4gVGhlcmVmb3JlLCB3ZSB3aWxsIGp1c3QgYXBwZW5kIHRoZSBjdXJyZW50IFwidG9cIiBub2RlXG4gICAgICAgICAgICAgICAgLy8gdG8gdGhlIGVuZFxuICAgICAgICAgICAgICAgIGlmIChjdXJUb05vZGVLZXkgJiYgKG1hdGNoaW5nRnJvbUVsID0gZnJvbU5vZGVzTG9va3VwW2N1clRvTm9kZUtleV0pICYmIGNvbXBhcmVOb2RlTmFtZXMobWF0Y2hpbmdGcm9tRWwsIGN1clRvTm9kZUNoaWxkKSkge1xuICAgICAgICAgICAgICAgICAgICBmcm9tRWwuYXBwZW5kQ2hpbGQobWF0Y2hpbmdGcm9tRWwpO1xuICAgICAgICAgICAgICAgICAgICBtb3JwaEVsKG1hdGNoaW5nRnJvbUVsLCBjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9uQmVmb3JlTm9kZUFkZGVkUmVzdWx0ID0gb25CZWZvcmVOb2RlQWRkZWQoY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob25CZWZvcmVOb2RlQWRkZWRSZXN1bHQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob25CZWZvcmVOb2RlQWRkZWRSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IG9uQmVmb3JlTm9kZUFkZGVkUmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyVG9Ob2RlQ2hpbGQuYWN0dWFsaXplKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSBjdXJUb05vZGVDaGlsZC5hY3R1YWxpemUoZnJvbUVsLm93bmVyRG9jdW1lbnQgfHwgZG9jKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb21FbC5hcHBlbmRDaGlsZChjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVOb2RlQWRkZWQoY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFdlIGhhdmUgcHJvY2Vzc2VkIGFsbCBvZiB0aGUgXCJ0byBub2Rlc1wiLiBJZiBjdXJGcm9tTm9kZUNoaWxkIGlzXG4gICAgICAgICAgICAvLyBub24tbnVsbCB0aGVuIHdlIHN0aWxsIGhhdmUgc29tZSBmcm9tIG5vZGVzIGxlZnQgb3ZlciB0aGF0IG5lZWRcbiAgICAgICAgICAgIC8vIHRvIGJlIHJlbW92ZWRcbiAgICAgICAgICAgIHdoaWxlIChjdXJGcm9tTm9kZUNoaWxkKSB7XG4gICAgICAgICAgICAgICAgZnJvbU5leHRTaWJsaW5nID0gY3VyRnJvbU5vZGVDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICBpZiAoKGN1ckZyb21Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJGcm9tTm9kZUNoaWxkKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2luY2UgdGhlIG5vZGUgaXMga2V5ZWQgaXQgbWlnaHQgYmUgbWF0Y2hlZCB1cCBsYXRlciBzbyB3ZSBkZWZlclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgYWN0dWFsIHJlbW92YWwgdG8gbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgYWRkS2V5ZWRSZW1vdmFsKGN1ckZyb21Ob2RlS2V5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiB3ZSBza2lwIG5lc3RlZCBrZXllZCBub2RlcyBmcm9tIGJlaW5nIHJlbW92ZWQgc2luY2UgdGhlcmUgaXNcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgc3RpbGwgYSBjaGFuY2UgdGhleSB3aWxsIGJlIG1hdGNoZWQgdXAgbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tRWwsIHRydWUgLyogc2tpcCBrZXllZCBub2RlcyAqLyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3BlY2lhbEVsSGFuZGxlciA9IHNwZWNpYWxFbEhhbmRsZXJzW2Zyb21FbC5ub2RlTmFtZV07XG4gICAgICAgIGlmIChzcGVjaWFsRWxIYW5kbGVyKSB7XG4gICAgICAgICAgICBzcGVjaWFsRWxIYW5kbGVyKGZyb21FbCwgdG9FbCk7XG4gICAgICAgIH1cbiAgICB9IC8vIEVORDogbW9ycGhFbCguLi4pXG5cbiAgICB2YXIgbW9ycGhlZE5vZGUgPSBmcm9tTm9kZTtcbiAgICB2YXIgbW9ycGhlZE5vZGVUeXBlID0gbW9ycGhlZE5vZGUubm9kZVR5cGU7XG4gICAgdmFyIHRvTm9kZVR5cGUgPSB0b05vZGUubm9kZVR5cGU7XG5cbiAgICBpZiAoIWNoaWxkcmVuT25seSkge1xuICAgICAgICAvLyBIYW5kbGUgdGhlIGNhc2Ugd2hlcmUgd2UgYXJlIGdpdmVuIHR3byBET00gbm9kZXMgdGhhdCBhcmUgbm90XG4gICAgICAgIC8vIGNvbXBhdGlibGUgKGUuZy4gPGRpdj4gLS0+IDxzcGFuPiBvciA8ZGl2PiAtLT4gVEVYVClcbiAgICAgICAgaWYgKG1vcnBoZWROb2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICBpZiAodG9Ob2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjb21wYXJlTm9kZU5hbWVzKGZyb21Ob2RlLCB0b05vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChmcm9tTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIG1vcnBoZWROb2RlID0gbW92ZUNoaWxkcmVuKGZyb21Ob2RlLCBjcmVhdGVFbGVtZW50TlModG9Ob2RlLm5vZGVOYW1lLCB0b05vZGUubmFtZXNwYWNlVVJJKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBHb2luZyBmcm9tIGFuIGVsZW1lbnQgbm9kZSB0byBhIHRleHQgbm9kZVxuICAgICAgICAgICAgICAgIG1vcnBoZWROb2RlID0gdG9Ob2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1vcnBoZWROb2RlVHlwZSA9PT0gVEVYVF9OT0RFIHx8IG1vcnBoZWROb2RlVHlwZSA9PT0gQ09NTUVOVF9OT0RFKSB7IC8vIFRleHQgb3IgY29tbWVudCBub2RlXG4gICAgICAgICAgICBpZiAodG9Ob2RlVHlwZSA9PT0gbW9ycGhlZE5vZGVUeXBlKSB7XG4gICAgICAgICAgICAgICAgbW9ycGhlZE5vZGUubm9kZVZhbHVlID0gdG9Ob2RlLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9ycGhlZE5vZGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFRleHQgbm9kZSB0byBzb21ldGhpbmcgZWxzZVxuICAgICAgICAgICAgICAgIG1vcnBoZWROb2RlID0gdG9Ob2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1vcnBoZWROb2RlID09PSB0b05vZGUpIHtcbiAgICAgICAgLy8gVGhlIFwidG8gbm9kZVwiIHdhcyBub3QgY29tcGF0aWJsZSB3aXRoIHRoZSBcImZyb20gbm9kZVwiIHNvIHdlIGhhZCB0b1xuICAgICAgICAvLyB0b3NzIG91dCB0aGUgXCJmcm9tIG5vZGVcIiBhbmQgdXNlIHRoZSBcInRvIG5vZGVcIlxuICAgICAgICBvbk5vZGVEaXNjYXJkZWQoZnJvbU5vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG1vcnBoRWwobW9ycGhlZE5vZGUsIHRvTm9kZSwgY2hpbGRyZW5Pbmx5KTtcblxuICAgICAgICAvLyBXZSBub3cgbmVlZCB0byBsb29wIG92ZXIgYW55IGtleWVkIG5vZGVzIHRoYXQgbWlnaHQgbmVlZCB0byBiZVxuICAgICAgICAvLyByZW1vdmVkLiBXZSBvbmx5IGRvIHRoZSByZW1vdmFsIGlmIHdlIGtub3cgdGhhdCB0aGUga2V5ZWQgbm9kZVxuICAgICAgICAvLyBuZXZlciBmb3VuZCBhIG1hdGNoLiBXaGVuIGEga2V5ZWQgbm9kZSBpcyBtYXRjaGVkIHVwIHdlIHJlbW92ZVxuICAgICAgICAvLyBpdCBvdXQgb2YgZnJvbU5vZGVzTG9va3VwIGFuZCB3ZSB1c2UgZnJvbU5vZGVzTG9va3VwIHRvIGRldGVybWluZVxuICAgICAgICAvLyBpZiBhIGtleWVkIG5vZGUgaGFzIGJlZW4gbWF0Y2hlZCB1cCBvciBub3RcbiAgICAgICAgaWYgKGtleWVkUmVtb3ZhbExpc3QpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MCwgbGVuPWtleWVkUmVtb3ZhbExpc3QubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsVG9SZW1vdmUgPSBmcm9tTm9kZXNMb29rdXBba2V5ZWRSZW1vdmFsTGlzdFtpXV07XG4gICAgICAgICAgICAgICAgaWYgKGVsVG9SZW1vdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm9kZShlbFRvUmVtb3ZlLCBlbFRvUmVtb3ZlLnBhcmVudE5vZGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWNoaWxkcmVuT25seSAmJiBtb3JwaGVkTm9kZSAhPT0gZnJvbU5vZGUgJiYgZnJvbU5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICBpZiAobW9ycGhlZE5vZGUuYWN0dWFsaXplKSB7XG4gICAgICAgICAgICBtb3JwaGVkTm9kZSA9IG1vcnBoZWROb2RlLmFjdHVhbGl6ZShmcm9tTm9kZS5vd25lckRvY3VtZW50IHx8IGRvYyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgd2UgaGFkIHRvIHN3YXAgb3V0IHRoZSBmcm9tIG5vZGUgd2l0aCBhIG5ldyBub2RlIGJlY2F1c2UgdGhlIG9sZFxuICAgICAgICAvLyBub2RlIHdhcyBub3QgY29tcGF0aWJsZSB3aXRoIHRoZSB0YXJnZXQgbm9kZSB0aGVuIHdlIG5lZWQgdG9cbiAgICAgICAgLy8gcmVwbGFjZSB0aGUgb2xkIERPTSBub2RlIGluIHRoZSBvcmlnaW5hbCBET00gdHJlZS4gVGhpcyBpcyBvbmx5XG4gICAgICAgIC8vIHBvc3NpYmxlIGlmIHRoZSBvcmlnaW5hbCBET00gbm9kZSB3YXMgcGFydCBvZiBhIERPTSB0cmVlIHdoaWNoXG4gICAgICAgIC8vIHdlIGtub3cgaXMgdGhlIGNhc2UgaWYgaXQgaGFzIGEgcGFyZW50IG5vZGUuXG4gICAgICAgIGZyb21Ob2RlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG1vcnBoZWROb2RlLCBmcm9tTm9kZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vcnBoZWROb2RlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1vcnBoZG9tO1xuIiwiLypqc2hpbnQgbm9kZTp0cnVlICovXHJcblxyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBtaW5pbWFsRGVzYyA9IFsnaCcsICdtaW4nLCAncycsICdtcycsICfOvHMnLCAnbnMnXTtcclxudmFyIHZlcmJvc2VEZXNjID0gWydob3VyJywgJ21pbnV0ZScsICdzZWNvbmQnLCAnbWlsbGlzZWNvbmQnLCAnbWljcm9zZWNvbmQnLCAnbmFub3NlY29uZCddO1xyXG52YXIgY29udmVydCA9IFs2MCo2MCwgNjAsIDEsIDFlNiwgMWUzLCAxXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHNvdXJjZSwgb3B0cykge1xyXG5cdHZhciB2ZXJib3NlLCBwcmVjaXNlLCBpLCBzcG90LCBzb3VyY2VBdFN0ZXAsIHZhbEF0U3RlcCwgZGVjaW1hbHMsIHN0ckF0U3RlcCwgcmVzdWx0cywgdG90YWxTZWNvbmRzO1xyXG5cclxuXHR2ZXJib3NlID0gZmFsc2U7XHJcblx0cHJlY2lzZSA9IGZhbHNlO1xyXG5cdGlmIChvcHRzKSB7XHJcblx0XHR2ZXJib3NlID0gb3B0cy52ZXJib3NlIHx8IGZhbHNlO1xyXG5cdFx0cHJlY2lzZSA9IG9wdHMucHJlY2lzZSB8fCBmYWxzZTtcclxuXHR9XHJcblxyXG5cdGlmICghQXJyYXkuaXNBcnJheShzb3VyY2UpIHx8IHNvdXJjZS5sZW5ndGggIT09IDIpIHtcclxuXHRcdHJldHVybiAnJztcclxuXHR9XHJcblx0aWYgKHR5cGVvZiBzb3VyY2VbMF0gIT09ICdudW1iZXInIHx8IHR5cGVvZiBzb3VyY2VbMV0gIT09ICdudW1iZXInKSB7XHJcblx0XHRyZXR1cm4gJyc7XHJcblx0fVxyXG5cclxuXHQvLyBub3JtYWxpemUgc291cmNlIGFycmF5IGR1ZSB0byBjaGFuZ2VzIGluIG5vZGUgdjUuNCtcclxuXHRpZiAoc291cmNlWzFdIDwgMCkge1xyXG5cdFx0dG90YWxTZWNvbmRzID0gc291cmNlWzBdICsgc291cmNlWzFdIC8gMWU5O1xyXG5cdFx0c291cmNlWzBdID0gcGFyc2VJbnQodG90YWxTZWNvbmRzKTtcclxuXHRcdHNvdXJjZVsxXSA9IHBhcnNlRmxvYXQoKHRvdGFsU2Vjb25kcyAlIDEpLnRvUHJlY2lzaW9uKDkpKSAqIDFlOTtcclxuXHR9XHJcblxyXG5cdHJlc3VsdHMgPSAnJztcclxuXHJcblx0Ly8gZm9yZWFjaCB1bml0XHJcblx0Zm9yIChpID0gMDsgaSA8IDY7IGkrKykge1xyXG5cdFx0c3BvdCA9IGkgPCAzID8gMCA6IDE7IC8vIGdyYWJiaW5nIGZpcnN0IG9yIHNlY29uZCBzcG90IGluIHNvdXJjZSBhcnJheVxyXG5cdFx0c291cmNlQXRTdGVwID0gc291cmNlW3Nwb3RdO1xyXG5cdFx0aWYgKGkgIT09IDMgJiYgaSAhPT0gMCkge1xyXG5cdFx0XHRzb3VyY2VBdFN0ZXAgPSBzb3VyY2VBdFN0ZXAgJSBjb252ZXJ0W2ktMV07IC8vIHRyaW0gb2ZmIHByZXZpb3VzIHBvcnRpb25zXHJcblx0XHR9XHJcblx0XHRpZiAoaSA9PT0gMikge1xyXG5cdFx0XHRzb3VyY2VBdFN0ZXAgKz0gc291cmNlWzFdLzFlOTsgLy8gZ2V0IHBhcnRpYWwgc2Vjb25kcyBmcm9tIG90aGVyIHBvcnRpb24gb2YgdGhlIGFycmF5XHJcblx0XHR9XHJcblx0XHR2YWxBdFN0ZXAgPSBzb3VyY2VBdFN0ZXAgLyBjb252ZXJ0W2ldOyAvLyB2YWwgYXQgdGhpcyB1bml0XHJcblx0XHRpZiAodmFsQXRTdGVwID49IDEpIHtcclxuXHRcdFx0aWYgKHZlcmJvc2UpIHtcclxuXHRcdFx0XHR2YWxBdFN0ZXAgPSBNYXRoLmZsb29yKHZhbEF0U3RlcCk7IC8vIGRlYWwgaW4gd2hvbGUgdW5pdHMsIHN1YnNlcXVlbnQgbGFwcyB3aWxsIGdldCB0aGUgZGVjaW1hbCBwb3J0aW9uXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFwcmVjaXNlKSB7XHJcblx0XHRcdFx0Ly8gZG9uJ3QgZmxpbmcgdG9vIG1hbnkgZGVjaW1hbHNcclxuXHRcdFx0XHRkZWNpbWFscyA9IHZhbEF0U3RlcCA+PSAxMCA/IDAgOiAyO1xyXG5cdFx0XHRcdHN0ckF0U3RlcCA9IHZhbEF0U3RlcC50b0ZpeGVkKGRlY2ltYWxzKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRzdHJBdFN0ZXAgPSB2YWxBdFN0ZXAudG9TdHJpbmcoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoc3RyQXRTdGVwLmluZGV4T2YoJy4nKSA+IC0xICYmIHN0ckF0U3RlcFtzdHJBdFN0ZXAubGVuZ3RoLTFdID09PSAnMCcpIHtcclxuXHRcdFx0XHRzdHJBdFN0ZXAgPSBzdHJBdFN0ZXAucmVwbGFjZSgvXFwuPzArJC8sJycpOyAvLyByZW1vdmUgdHJhaWxpbmcgemVyb3NcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAocmVzdWx0cykge1xyXG5cdFx0XHRcdHJlc3VsdHMgKz0gJyAnOyAvLyBhcHBlbmQgc3BhY2UgaWYgd2UgaGF2ZSBhIHByZXZpb3VzIHZhbHVlXHJcblx0XHRcdH1cclxuXHRcdFx0cmVzdWx0cyArPSBzdHJBdFN0ZXA7IC8vIGFwcGVuZCB0aGUgdmFsdWVcclxuXHRcdFx0Ly8gYXBwZW5kIHVuaXRzXHJcblx0XHRcdGlmICh2ZXJib3NlKSB7XHJcblx0XHRcdFx0cmVzdWx0cyArPSAnICcrdmVyYm9zZURlc2NbaV07XHJcblx0XHRcdFx0aWYgKHN0ckF0U3RlcCAhPT0gJzEnKSB7XHJcblx0XHRcdFx0XHRyZXN1bHRzICs9ICdzJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmVzdWx0cyArPSAnICcrbWluaW1hbERlc2NbaV07XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCF2ZXJib3NlKSB7XHJcblx0XHRcdFx0YnJlYWs7IC8vIHZlcmJvc2UgZ2V0cyBhcyBtYW55IGdyb3VwcyBhcyBuZWNlc3NhcnksIHRoZSByZXN0IGdldCBvbmx5IG9uZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gcmVzdWx0cztcclxufTtcclxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYicpXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhc2FwID0gcmVxdWlyZSgnYXNhcC9yYXcnKTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbi8vIFN0YXRlczpcbi8vXG4vLyAwIC0gcGVuZGluZ1xuLy8gMSAtIGZ1bGZpbGxlZCB3aXRoIF92YWx1ZVxuLy8gMiAtIHJlamVjdGVkIHdpdGggX3ZhbHVlXG4vLyAzIC0gYWRvcHRlZCB0aGUgc3RhdGUgb2YgYW5vdGhlciBwcm9taXNlLCBfdmFsdWVcbi8vXG4vLyBvbmNlIHRoZSBzdGF0ZSBpcyBubyBsb25nZXIgcGVuZGluZyAoMCkgaXQgaXMgaW1tdXRhYmxlXG5cbi8vIEFsbCBgX2AgcHJlZml4ZWQgcHJvcGVydGllcyB3aWxsIGJlIHJlZHVjZWQgdG8gYF97cmFuZG9tIG51bWJlcn1gXG4vLyBhdCBidWlsZCB0aW1lIHRvIG9iZnVzY2F0ZSB0aGVtIGFuZCBkaXNjb3VyYWdlIHRoZWlyIHVzZS5cbi8vIFdlIGRvbid0IHVzZSBzeW1ib2xzIG9yIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0byBmdWxseSBoaWRlIHRoZW1cbi8vIGJlY2F1c2UgdGhlIHBlcmZvcm1hbmNlIGlzbid0IGdvb2QgZW5vdWdoLlxuXG5cbi8vIHRvIGF2b2lkIHVzaW5nIHRyeS9jYXRjaCBpbnNpZGUgY3JpdGljYWwgZnVuY3Rpb25zLCB3ZVxuLy8gZXh0cmFjdCB0aGVtIHRvIGhlcmUuXG52YXIgTEFTVF9FUlJPUiA9IG51bGw7XG52YXIgSVNfRVJST1IgPSB7fTtcbmZ1bmN0aW9uIGdldFRoZW4ob2JqKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIG9iai50aGVuO1xuICB9IGNhdGNoIChleCkge1xuICAgIExBU1RfRVJST1IgPSBleDtcbiAgICByZXR1cm4gSVNfRVJST1I7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJ5Q2FsbE9uZShmbiwgYSkge1xuICB0cnkge1xuICAgIHJldHVybiBmbihhKTtcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICBMQVNUX0VSUk9SID0gZXg7XG4gICAgcmV0dXJuIElTX0VSUk9SO1xuICB9XG59XG5mdW5jdGlvbiB0cnlDYWxsVHdvKGZuLCBhLCBiKSB7XG4gIHRyeSB7XG4gICAgZm4oYSwgYik7XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgTEFTVF9FUlJPUiA9IGV4O1xuICAgIHJldHVybiBJU19FUlJPUjtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByb21pc2U7XG5cbmZ1bmN0aW9uIFByb21pc2UoZm4pIHtcbiAgaWYgKHR5cGVvZiB0aGlzICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb21pc2VzIG11c3QgYmUgY29uc3RydWN0ZWQgdmlhIG5ldycpO1xuICB9XG4gIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9taXNlIGNvbnN0cnVjdG9yXFwncyBhcmd1bWVudCBpcyBub3QgYSBmdW5jdGlvbicpO1xuICB9XG4gIHRoaXMuXzQwID0gMDtcbiAgdGhpcy5fNjUgPSAwO1xuICB0aGlzLl81NSA9IG51bGw7XG4gIHRoaXMuXzcyID0gbnVsbDtcbiAgaWYgKGZuID09PSBub29wKSByZXR1cm47XG4gIGRvUmVzb2x2ZShmbiwgdGhpcyk7XG59XG5Qcm9taXNlLl8zNyA9IG51bGw7XG5Qcm9taXNlLl84NyA9IG51bGw7XG5Qcm9taXNlLl82MSA9IG5vb3A7XG5cblByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICBpZiAodGhpcy5jb25zdHJ1Y3RvciAhPT0gUHJvbWlzZSkge1xuICAgIHJldHVybiBzYWZlVGhlbih0aGlzLCBvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCk7XG4gIH1cbiAgdmFyIHJlcyA9IG5ldyBQcm9taXNlKG5vb3ApO1xuICBoYW5kbGUodGhpcywgbmV3IEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHJlcykpO1xuICByZXR1cm4gcmVzO1xufTtcblxuZnVuY3Rpb24gc2FmZVRoZW4oc2VsZiwgb25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgcmV0dXJuIG5ldyBzZWxmLmNvbnN0cnVjdG9yKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVzID0gbmV3IFByb21pc2Uobm9vcCk7XG4gICAgcmVzLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICBoYW5kbGUoc2VsZiwgbmV3IEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHJlcykpO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGhhbmRsZShzZWxmLCBkZWZlcnJlZCkge1xuICB3aGlsZSAoc2VsZi5fNjUgPT09IDMpIHtcbiAgICBzZWxmID0gc2VsZi5fNTU7XG4gIH1cbiAgaWYgKFByb21pc2UuXzM3KSB7XG4gICAgUHJvbWlzZS5fMzcoc2VsZik7XG4gIH1cbiAgaWYgKHNlbGYuXzY1ID09PSAwKSB7XG4gICAgaWYgKHNlbGYuXzQwID09PSAwKSB7XG4gICAgICBzZWxmLl80MCA9IDE7XG4gICAgICBzZWxmLl83MiA9IGRlZmVycmVkO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoc2VsZi5fNDAgPT09IDEpIHtcbiAgICAgIHNlbGYuXzQwID0gMjtcbiAgICAgIHNlbGYuXzcyID0gW3NlbGYuXzcyLCBkZWZlcnJlZF07XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNlbGYuXzcyLnB1c2goZGVmZXJyZWQpO1xuICAgIHJldHVybjtcbiAgfVxuICBoYW5kbGVSZXNvbHZlZChzZWxmLCBkZWZlcnJlZCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJlc29sdmVkKHNlbGYsIGRlZmVycmVkKSB7XG4gIGFzYXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNiID0gc2VsZi5fNjUgPT09IDEgPyBkZWZlcnJlZC5vbkZ1bGZpbGxlZCA6IGRlZmVycmVkLm9uUmVqZWN0ZWQ7XG4gICAgaWYgKGNiID09PSBudWxsKSB7XG4gICAgICBpZiAoc2VsZi5fNjUgPT09IDEpIHtcbiAgICAgICAgcmVzb2x2ZShkZWZlcnJlZC5wcm9taXNlLCBzZWxmLl81NSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWplY3QoZGVmZXJyZWQucHJvbWlzZSwgc2VsZi5fNTUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcmV0ID0gdHJ5Q2FsbE9uZShjYiwgc2VsZi5fNTUpO1xuICAgIGlmIChyZXQgPT09IElTX0VSUk9SKSB7XG4gICAgICByZWplY3QoZGVmZXJyZWQucHJvbWlzZSwgTEFTVF9FUlJPUik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc29sdmUoZGVmZXJyZWQucHJvbWlzZSwgcmV0KTtcbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gcmVzb2x2ZShzZWxmLCBuZXdWYWx1ZSkge1xuICAvLyBQcm9taXNlIFJlc29sdXRpb24gUHJvY2VkdXJlOiBodHRwczovL2dpdGh1Yi5jb20vcHJvbWlzZXMtYXBsdXMvcHJvbWlzZXMtc3BlYyN0aGUtcHJvbWlzZS1yZXNvbHV0aW9uLXByb2NlZHVyZVxuICBpZiAobmV3VmFsdWUgPT09IHNlbGYpIHtcbiAgICByZXR1cm4gcmVqZWN0KFxuICAgICAgc2VsZixcbiAgICAgIG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZSBjYW5ub3QgYmUgcmVzb2x2ZWQgd2l0aCBpdHNlbGYuJylcbiAgICApO1xuICB9XG4gIGlmIChcbiAgICBuZXdWYWx1ZSAmJlxuICAgICh0eXBlb2YgbmV3VmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgKSB7XG4gICAgdmFyIHRoZW4gPSBnZXRUaGVuKG5ld1ZhbHVlKTtcbiAgICBpZiAodGhlbiA9PT0gSVNfRVJST1IpIHtcbiAgICAgIHJldHVybiByZWplY3Qoc2VsZiwgTEFTVF9FUlJPUik7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIHRoZW4gPT09IHNlbGYudGhlbiAmJlxuICAgICAgbmV3VmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlXG4gICAgKSB7XG4gICAgICBzZWxmLl82NSA9IDM7XG4gICAgICBzZWxmLl81NSA9IG5ld1ZhbHVlO1xuICAgICAgZmluYWxlKHNlbGYpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGRvUmVzb2x2ZSh0aGVuLmJpbmQobmV3VmFsdWUpLCBzZWxmKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgc2VsZi5fNjUgPSAxO1xuICBzZWxmLl81NSA9IG5ld1ZhbHVlO1xuICBmaW5hbGUoc2VsZik7XG59XG5cbmZ1bmN0aW9uIHJlamVjdChzZWxmLCBuZXdWYWx1ZSkge1xuICBzZWxmLl82NSA9IDI7XG4gIHNlbGYuXzU1ID0gbmV3VmFsdWU7XG4gIGlmIChQcm9taXNlLl84Nykge1xuICAgIFByb21pc2UuXzg3KHNlbGYsIG5ld1ZhbHVlKTtcbiAgfVxuICBmaW5hbGUoc2VsZik7XG59XG5mdW5jdGlvbiBmaW5hbGUoc2VsZikge1xuICBpZiAoc2VsZi5fNDAgPT09IDEpIHtcbiAgICBoYW5kbGUoc2VsZiwgc2VsZi5fNzIpO1xuICAgIHNlbGYuXzcyID0gbnVsbDtcbiAgfVxuICBpZiAoc2VsZi5fNDAgPT09IDIpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYuXzcyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBoYW5kbGUoc2VsZiwgc2VsZi5fNzJbaV0pO1xuICAgIH1cbiAgICBzZWxmLl83MiA9IG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbWlzZSl7XG4gIHRoaXMub25GdWxmaWxsZWQgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IG51bGw7XG4gIHRoaXMub25SZWplY3RlZCA9IHR5cGVvZiBvblJlamVjdGVkID09PSAnZnVuY3Rpb24nID8gb25SZWplY3RlZCA6IG51bGw7XG4gIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG59XG5cbi8qKlxuICogVGFrZSBhIHBvdGVudGlhbGx5IG1pc2JlaGF2aW5nIHJlc29sdmVyIGZ1bmN0aW9uIGFuZCBtYWtlIHN1cmVcbiAqIG9uRnVsZmlsbGVkIGFuZCBvblJlamVjdGVkIGFyZSBvbmx5IGNhbGxlZCBvbmNlLlxuICpcbiAqIE1ha2VzIG5vIGd1YXJhbnRlZXMgYWJvdXQgYXN5bmNocm9ueS5cbiAqL1xuZnVuY3Rpb24gZG9SZXNvbHZlKGZuLCBwcm9taXNlKSB7XG4gIHZhciBkb25lID0gZmFsc2U7XG4gIHZhciByZXMgPSB0cnlDYWxsVHdvKGZuLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAoZG9uZSkgcmV0dXJuO1xuICAgIGRvbmUgPSB0cnVlO1xuICAgIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICBkb25lID0gdHJ1ZTtcbiAgICByZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgfSk7XG4gIGlmICghZG9uZSAmJiByZXMgPT09IElTX0VSUk9SKSB7XG4gICAgZG9uZSA9IHRydWU7XG4gICAgcmVqZWN0KHByb21pc2UsIExBU1RfRVJST1IpO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi9jb3JlLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcblByb21pc2UucHJvdG90eXBlLmRvbmUgPSBmdW5jdGlvbiAob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgdmFyIHNlbGYgPSBhcmd1bWVudHMubGVuZ3RoID8gdGhpcy50aGVuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiB0aGlzO1xuICBzZWxmLnRoZW4obnVsbCwgZnVuY3Rpb24gKGVycikge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH0sIDApO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBFUzYgZXh0ZW5zaW9ucyB0byB0aGUgY29yZSBQcm9taXNlcy9BKyBBUElcblxudmFyIFByb21pc2UgPSByZXF1aXJlKCcuL2NvcmUuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuXG4vKiBTdGF0aWMgRnVuY3Rpb25zICovXG5cbnZhciBUUlVFID0gdmFsdWVQcm9taXNlKHRydWUpO1xudmFyIEZBTFNFID0gdmFsdWVQcm9taXNlKGZhbHNlKTtcbnZhciBOVUxMID0gdmFsdWVQcm9taXNlKG51bGwpO1xudmFyIFVOREVGSU5FRCA9IHZhbHVlUHJvbWlzZSh1bmRlZmluZWQpO1xudmFyIFpFUk8gPSB2YWx1ZVByb21pc2UoMCk7XG52YXIgRU1QVFlTVFJJTkcgPSB2YWx1ZVByb21pc2UoJycpO1xuXG5mdW5jdGlvbiB2YWx1ZVByb21pc2UodmFsdWUpIHtcbiAgdmFyIHAgPSBuZXcgUHJvbWlzZShQcm9taXNlLl82MSk7XG4gIHAuXzY1ID0gMTtcbiAgcC5fNTUgPSB2YWx1ZTtcbiAgcmV0dXJuIHA7XG59XG5Qcm9taXNlLnJlc29sdmUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkgcmV0dXJuIHZhbHVlO1xuXG4gIGlmICh2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuIE5VTEw7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gVU5ERUZJTkVEO1xuICBpZiAodmFsdWUgPT09IHRydWUpIHJldHVybiBUUlVFO1xuICBpZiAodmFsdWUgPT09IGZhbHNlKSByZXR1cm4gRkFMU0U7XG4gIGlmICh2YWx1ZSA9PT0gMCkgcmV0dXJuIFpFUk87XG4gIGlmICh2YWx1ZSA9PT0gJycpIHJldHVybiBFTVBUWVNUUklORztcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICB0cnkge1xuICAgICAgdmFyIHRoZW4gPSB2YWx1ZS50aGVuO1xuICAgICAgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSh0aGVuLmJpbmQodmFsdWUpKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmVqZWN0KGV4KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdmFsdWVQcm9taXNlKHZhbHVlKTtcbn07XG5cblByb21pc2UuYWxsID0gZnVuY3Rpb24gKGFycikge1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFycik7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHJldHVybiByZXNvbHZlKFtdKTtcbiAgICB2YXIgcmVtYWluaW5nID0gYXJncy5sZW5ndGg7XG4gICAgZnVuY3Rpb24gcmVzKGksIHZhbCkge1xuICAgICAgaWYgKHZhbCAmJiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgaWYgKHZhbCBpbnN0YW5jZW9mIFByb21pc2UgJiYgdmFsLnRoZW4gPT09IFByb21pc2UucHJvdG90eXBlLnRoZW4pIHtcbiAgICAgICAgICB3aGlsZSAodmFsLl82NSA9PT0gMykge1xuICAgICAgICAgICAgdmFsID0gdmFsLl81NTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZhbC5fNjUgPT09IDEpIHJldHVybiByZXMoaSwgdmFsLl81NSk7XG4gICAgICAgICAgaWYgKHZhbC5fNjUgPT09IDIpIHJlamVjdCh2YWwuXzU1KTtcbiAgICAgICAgICB2YWwudGhlbihmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICByZXMoaSwgdmFsKTtcbiAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgdGhlbiA9IHZhbC50aGVuO1xuICAgICAgICAgIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIHAgPSBuZXcgUHJvbWlzZSh0aGVuLmJpbmQodmFsKSk7XG4gICAgICAgICAgICBwLnRoZW4oZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICByZXMoaSwgdmFsKTtcbiAgICAgICAgICAgIH0sIHJlamVjdCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhcmdzW2ldID0gdmFsO1xuICAgICAgaWYgKC0tcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgIHJlc29sdmUoYXJncyk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzKGksIGFyZ3NbaV0pO1xuICAgIH1cbiAgfSk7XG59O1xuXG5Qcm9taXNlLnJlamVjdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHJlamVjdCh2YWx1ZSk7XG4gIH0pO1xufTtcblxuUHJvbWlzZS5yYWNlID0gZnVuY3Rpb24gKHZhbHVlcykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbi8qIFByb3RvdHlwZSBNZXRob2RzICovXG5cblByb21pc2UucHJvdG90eXBlWydjYXRjaCddID0gZnVuY3Rpb24gKG9uUmVqZWN0ZWQpIHtcbiAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGVkKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi9jb3JlLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcblByb21pc2UucHJvdG90eXBlWydmaW5hbGx5J10gPSBmdW5jdGlvbiAoZikge1xuICByZXR1cm4gdGhpcy50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZigpKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9KTtcbiAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZigpKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9KTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY29yZS5qcycpO1xucmVxdWlyZSgnLi9kb25lLmpzJyk7XG5yZXF1aXJlKCcuL2ZpbmFsbHkuanMnKTtcbnJlcXVpcmUoJy4vZXM2LWV4dGVuc2lvbnMuanMnKTtcbnJlcXVpcmUoJy4vbm9kZS1leHRlbnNpb25zLmpzJyk7XG5yZXF1aXJlKCcuL3N5bmNocm9ub3VzLmpzJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIFRoaXMgZmlsZSBjb250YWlucyB0aGVuL3Byb21pc2Ugc3BlY2lmaWMgZXh0ZW5zaW9ucyB0aGF0IGFyZSBvbmx5IHVzZWZ1bFxuLy8gZm9yIG5vZGUuanMgaW50ZXJvcFxuXG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJy4vY29yZS5qcycpO1xudmFyIGFzYXAgPSByZXF1aXJlKCdhc2FwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcblxuLyogU3RhdGljIEZ1bmN0aW9ucyAqL1xuXG5Qcm9taXNlLmRlbm9kZWlmeSA9IGZ1bmN0aW9uIChmbiwgYXJndW1lbnRDb3VudCkge1xuICBpZiAoXG4gICAgdHlwZW9mIGFyZ3VtZW50Q291bnQgPT09ICdudW1iZXInICYmIGFyZ3VtZW50Q291bnQgIT09IEluZmluaXR5XG4gICkge1xuICAgIHJldHVybiBkZW5vZGVpZnlXaXRoQ291bnQoZm4sIGFyZ3VtZW50Q291bnQpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBkZW5vZGVpZnlXaXRob3V0Q291bnQoZm4pO1xuICB9XG59O1xuXG52YXIgY2FsbGJhY2tGbiA9IChcbiAgJ2Z1bmN0aW9uIChlcnIsIHJlcykgeycgK1xuICAnaWYgKGVycikgeyByaihlcnIpOyB9IGVsc2UgeyBycyhyZXMpOyB9JyArXG4gICd9J1xuKTtcbmZ1bmN0aW9uIGRlbm9kZWlmeVdpdGhDb3VudChmbiwgYXJndW1lbnRDb3VudCkge1xuICB2YXIgYXJncyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50Q291bnQ7IGkrKykge1xuICAgIGFyZ3MucHVzaCgnYScgKyBpKTtcbiAgfVxuICB2YXIgYm9keSA9IFtcbiAgICAncmV0dXJuIGZ1bmN0aW9uICgnICsgYXJncy5qb2luKCcsJykgKyAnKSB7JyxcbiAgICAndmFyIHNlbGYgPSB0aGlzOycsXG4gICAgJ3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocnMsIHJqKSB7JyxcbiAgICAndmFyIHJlcyA9IGZuLmNhbGwoJyxcbiAgICBbJ3NlbGYnXS5jb25jYXQoYXJncykuY29uY2F0KFtjYWxsYmFja0ZuXSkuam9pbignLCcpLFxuICAgICcpOycsXG4gICAgJ2lmIChyZXMgJiYnLFxuICAgICcodHlwZW9mIHJlcyA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgcmVzID09PSBcImZ1bmN0aW9uXCIpICYmJyxcbiAgICAndHlwZW9mIHJlcy50aGVuID09PSBcImZ1bmN0aW9uXCInLFxuICAgICcpIHtycyhyZXMpO30nLFxuICAgICd9KTsnLFxuICAgICd9OydcbiAgXS5qb2luKCcnKTtcbiAgcmV0dXJuIEZ1bmN0aW9uKFsnUHJvbWlzZScsICdmbiddLCBib2R5KShQcm9taXNlLCBmbik7XG59XG5mdW5jdGlvbiBkZW5vZGVpZnlXaXRob3V0Q291bnQoZm4pIHtcbiAgdmFyIGZuTGVuZ3RoID0gTWF0aC5tYXgoZm4ubGVuZ3RoIC0gMSwgMyk7XG4gIHZhciBhcmdzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZm5MZW5ndGg7IGkrKykge1xuICAgIGFyZ3MucHVzaCgnYScgKyBpKTtcbiAgfVxuICB2YXIgYm9keSA9IFtcbiAgICAncmV0dXJuIGZ1bmN0aW9uICgnICsgYXJncy5qb2luKCcsJykgKyAnKSB7JyxcbiAgICAndmFyIHNlbGYgPSB0aGlzOycsXG4gICAgJ3ZhciBhcmdzOycsXG4gICAgJ3ZhciBhcmdMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoOycsXG4gICAgJ2lmIChhcmd1bWVudHMubGVuZ3RoID4gJyArIGZuTGVuZ3RoICsgJykgeycsXG4gICAgJ2FyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCArIDEpOycsXG4gICAgJ2ZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7JyxcbiAgICAnYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTsnLFxuICAgICd9JyxcbiAgICAnfScsXG4gICAgJ3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocnMsIHJqKSB7JyxcbiAgICAndmFyIGNiID0gJyArIGNhbGxiYWNrRm4gKyAnOycsXG4gICAgJ3ZhciByZXM7JyxcbiAgICAnc3dpdGNoIChhcmdMZW5ndGgpIHsnLFxuICAgIGFyZ3MuY29uY2F0KFsnZXh0cmEnXSkubWFwKGZ1bmN0aW9uIChfLCBpbmRleCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgJ2Nhc2UgJyArIChpbmRleCkgKyAnOicgK1xuICAgICAgICAncmVzID0gZm4uY2FsbCgnICsgWydzZWxmJ10uY29uY2F0KGFyZ3Muc2xpY2UoMCwgaW5kZXgpKS5jb25jYXQoJ2NiJykuam9pbignLCcpICsgJyk7JyArXG4gICAgICAgICdicmVhazsnXG4gICAgICApO1xuICAgIH0pLmpvaW4oJycpLFxuICAgICdkZWZhdWx0OicsXG4gICAgJ2FyZ3NbYXJnTGVuZ3RoXSA9IGNiOycsXG4gICAgJ3JlcyA9IGZuLmFwcGx5KHNlbGYsIGFyZ3MpOycsXG4gICAgJ30nLFxuICAgIFxuICAgICdpZiAocmVzICYmJyxcbiAgICAnKHR5cGVvZiByZXMgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHJlcyA9PT0gXCJmdW5jdGlvblwiKSAmJicsXG4gICAgJ3R5cGVvZiByZXMudGhlbiA9PT0gXCJmdW5jdGlvblwiJyxcbiAgICAnKSB7cnMocmVzKTt9JyxcbiAgICAnfSk7JyxcbiAgICAnfTsnXG4gIF0uam9pbignJyk7XG5cbiAgcmV0dXJuIEZ1bmN0aW9uKFxuICAgIFsnUHJvbWlzZScsICdmbiddLFxuICAgIGJvZHlcbiAgKShQcm9taXNlLCBmbik7XG59XG5cblByb21pc2Uubm9kZWlmeSA9IGZ1bmN0aW9uIChmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgY2FsbGJhY2sgPVxuICAgICAgdHlwZW9mIGFyZ3NbYXJncy5sZW5ndGggLSAxXSA9PT0gJ2Z1bmN0aW9uJyA/IGFyZ3MucG9wKCkgOiBudWxsO1xuICAgIHZhciBjdHggPSB0aGlzO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKS5ub2RlaWZ5KGNhbGxiYWNrLCBjdHgpO1xuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICBpZiAoY2FsbGJhY2sgPT09IG51bGwgfHwgdHlwZW9mIGNhbGxiYWNrID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgcmVqZWN0KGV4KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhc2FwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjYWxsYmFjay5jYWxsKGN0eCwgZXgpO1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuUHJvbWlzZS5wcm90b3R5cGUubm9kZWlmeSA9IGZ1bmN0aW9uIChjYWxsYmFjaywgY3R4KSB7XG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJykgcmV0dXJuIHRoaXM7XG5cbiAgdGhpcy50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGFzYXAoZnVuY3Rpb24gKCkge1xuICAgICAgY2FsbGJhY2suY2FsbChjdHgsIG51bGwsIHZhbHVlKTtcbiAgICB9KTtcbiAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgIGFzYXAoZnVuY3Rpb24gKCkge1xuICAgICAgY2FsbGJhY2suY2FsbChjdHgsIGVycik7XG4gICAgfSk7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFByb21pc2UgPSByZXF1aXJlKCcuL2NvcmUuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuUHJvbWlzZS5lbmFibGVTeW5jaHJvbm91cyA9IGZ1bmN0aW9uICgpIHtcbiAgUHJvbWlzZS5wcm90b3R5cGUuaXNQZW5kaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGUoKSA9PSAwO1xuICB9O1xuXG4gIFByb21pc2UucHJvdG90eXBlLmlzRnVsZmlsbGVkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGUoKSA9PSAxO1xuICB9O1xuXG4gIFByb21pc2UucHJvdG90eXBlLmlzUmVqZWN0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZSgpID09IDI7XG4gIH07XG5cbiAgUHJvbWlzZS5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuXzY1ID09PSAzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fNTUuZ2V0VmFsdWUoKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaXNGdWxmaWxsZWQoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZ2V0IGEgdmFsdWUgb2YgYW4gdW5mdWxmaWxsZWQgcHJvbWlzZS4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fNTU7XG4gIH07XG5cbiAgUHJvbWlzZS5wcm90b3R5cGUuZ2V0UmVhc29uID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl82NSA9PT0gMykge1xuICAgICAgcmV0dXJuIHRoaXMuXzU1LmdldFJlYXNvbigpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5pc1JlamVjdGVkKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGdldCBhIHJlamVjdGlvbiByZWFzb24gb2YgYSBub24tcmVqZWN0ZWQgcHJvbWlzZS4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fNTU7XG4gIH07XG5cbiAgUHJvbWlzZS5wcm90b3R5cGUuZ2V0U3RhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuXzY1ID09PSAzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fNTUuZ2V0U3RhdGUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuXzY1ID09PSAtMSB8fCB0aGlzLl82NSA9PT0gLTIpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl82NTtcbiAgfTtcbn07XG5cblByb21pc2UuZGlzYWJsZVN5bmNocm9ub3VzID0gZnVuY3Rpb24oKSB7XG4gIFByb21pc2UucHJvdG90eXBlLmlzUGVuZGluZyA9IHVuZGVmaW5lZDtcbiAgUHJvbWlzZS5wcm90b3R5cGUuaXNGdWxmaWxsZWQgPSB1bmRlZmluZWQ7XG4gIFByb21pc2UucHJvdG90eXBlLmlzUmVqZWN0ZWQgPSB1bmRlZmluZWQ7XG4gIFByb21pc2UucHJvdG90eXBlLmdldFZhbHVlID0gdW5kZWZpbmVkO1xuICBQcm9taXNlLnByb3RvdHlwZS5nZXRSZWFzb24gPSB1bmRlZmluZWQ7XG4gIFByb21pc2UucHJvdG90eXBlLmdldFN0YXRlID0gdW5kZWZpbmVkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHB1Z19oYXNfb3duX3Byb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBNZXJnZSB0d28gYXR0cmlidXRlIG9iamVjdHMgZ2l2aW5nIHByZWNlZGVuY2VcbiAqIHRvIHZhbHVlcyBpbiBvYmplY3QgYGJgLiBDbGFzc2VzIGFyZSBzcGVjaWFsLWNhc2VkXG4gKiBhbGxvd2luZyBmb3IgYXJyYXlzIGFuZCBtZXJnaW5nL2pvaW5pbmcgYXBwcm9wcmlhdGVseVxuICogcmVzdWx0aW5nIGluIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhXG4gKiBAcGFyYW0ge09iamVjdH0gYlxuICogQHJldHVybiB7T2JqZWN0fSBhXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLm1lcmdlID0gcHVnX21lcmdlO1xuZnVuY3Rpb24gcHVnX21lcmdlKGEsIGIpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICB2YXIgYXR0cnMgPSBhWzBdO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0cnMgPSBwdWdfbWVyZ2UoYXR0cnMsIGFbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cnM7XG4gIH1cblxuICBmb3IgKHZhciBrZXkgaW4gYikge1xuICAgIGlmIChrZXkgPT09ICdjbGFzcycpIHtcbiAgICAgIHZhciB2YWxBID0gYVtrZXldIHx8IFtdO1xuICAgICAgYVtrZXldID0gKEFycmF5LmlzQXJyYXkodmFsQSkgPyB2YWxBIDogW3ZhbEFdKS5jb25jYXQoYltrZXldIHx8IFtdKTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xuICAgICAgdmFyIHZhbEEgPSBwdWdfc3R5bGUoYVtrZXldKTtcbiAgICAgIHZhciB2YWxCID0gcHVnX3N0eWxlKGJba2V5XSk7XG4gICAgICBhW2tleV0gPSB2YWxBICsgdmFsQjtcbiAgICB9IGVsc2Uge1xuICAgICAgYVtrZXldID0gYltrZXldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhO1xufTtcblxuLyoqXG4gKiBQcm9jZXNzIGFycmF5LCBvYmplY3QsIG9yIHN0cmluZyBhcyBhIHN0cmluZyBvZiBjbGFzc2VzIGRlbGltaXRlZCBieSBhIHNwYWNlLlxuICpcbiAqIElmIGB2YWxgIGlzIGFuIGFycmF5LCBhbGwgbWVtYmVycyBvZiBpdCBhbmQgaXRzIHN1YmFycmF5cyBhcmUgY291bnRlZCBhc1xuICogY2xhc3Nlcy4gSWYgYGVzY2FwaW5nYCBpcyBhbiBhcnJheSwgdGhlbiB3aGV0aGVyIG9yIG5vdCB0aGUgaXRlbSBpbiBgdmFsYCBpc1xuICogZXNjYXBlZCBkZXBlbmRzIG9uIHRoZSBjb3JyZXNwb25kaW5nIGl0ZW0gaW4gYGVzY2FwaW5nYC4gSWYgYGVzY2FwaW5nYCBpc1xuICogbm90IGFuIGFycmF5LCBubyBlc2NhcGluZyBpcyBkb25lLlxuICpcbiAqIElmIGB2YWxgIGlzIGFuIG9iamVjdCwgYWxsIHRoZSBrZXlzIHdob3NlIHZhbHVlIGlzIHRydXRoeSBhcmUgY291bnRlZCBhc1xuICogY2xhc3Nlcy4gTm8gZXNjYXBpbmcgaXMgZG9uZS5cbiAqXG4gKiBJZiBgdmFsYCBpcyBhIHN0cmluZywgaXQgaXMgY291bnRlZCBhcyBhIGNsYXNzLiBObyBlc2NhcGluZyBpcyBkb25lLlxuICpcbiAqIEBwYXJhbSB7KEFycmF5LjxzdHJpbmc+fE9iamVjdC48c3RyaW5nLCBib29sZWFuPnxzdHJpbmcpfSB2YWxcbiAqIEBwYXJhbSB7P0FycmF5LjxzdHJpbmc+fSBlc2NhcGluZ1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmNsYXNzZXMgPSBwdWdfY2xhc3NlcztcbmZ1bmN0aW9uIHB1Z19jbGFzc2VzX2FycmF5KHZhbCwgZXNjYXBpbmcpIHtcbiAgdmFyIGNsYXNzU3RyaW5nID0gJycsIGNsYXNzTmFtZSwgcGFkZGluZyA9ICcnLCBlc2NhcGVFbmFibGVkID0gQXJyYXkuaXNBcnJheShlc2NhcGluZyk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsLmxlbmd0aDsgaSsrKSB7XG4gICAgY2xhc3NOYW1lID0gcHVnX2NsYXNzZXModmFsW2ldKTtcbiAgICBpZiAoIWNsYXNzTmFtZSkgY29udGludWU7XG4gICAgZXNjYXBlRW5hYmxlZCAmJiBlc2NhcGluZ1tpXSAmJiAoY2xhc3NOYW1lID0gcHVnX2VzY2FwZShjbGFzc05hbWUpKTtcbiAgICBjbGFzc1N0cmluZyA9IGNsYXNzU3RyaW5nICsgcGFkZGluZyArIGNsYXNzTmFtZTtcbiAgICBwYWRkaW5nID0gJyAnO1xuICB9XG4gIHJldHVybiBjbGFzc1N0cmluZztcbn1cbmZ1bmN0aW9uIHB1Z19jbGFzc2VzX29iamVjdCh2YWwpIHtcbiAgdmFyIGNsYXNzU3RyaW5nID0gJycsIHBhZGRpbmcgPSAnJztcbiAgZm9yICh2YXIga2V5IGluIHZhbCkge1xuICAgIGlmIChrZXkgJiYgdmFsW2tleV0gJiYgcHVnX2hhc19vd25fcHJvcGVydHkuY2FsbCh2YWwsIGtleSkpIHtcbiAgICAgIGNsYXNzU3RyaW5nID0gY2xhc3NTdHJpbmcgKyBwYWRkaW5nICsga2V5O1xuICAgICAgcGFkZGluZyA9ICcgJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNsYXNzU3RyaW5nO1xufVxuZnVuY3Rpb24gcHVnX2NsYXNzZXModmFsLCBlc2NhcGluZykge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgcmV0dXJuIHB1Z19jbGFzc2VzX2FycmF5KHZhbCwgZXNjYXBpbmcpO1xuICB9IGVsc2UgaWYgKHZhbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBwdWdfY2xhc3Nlc19vYmplY3QodmFsKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdmFsIHx8ICcnO1xuICB9XG59XG5cbi8qKlxuICogQ29udmVydCBvYmplY3Qgb3Igc3RyaW5nIHRvIGEgc3RyaW5nIG9mIENTUyBzdHlsZXMgZGVsaW1pdGVkIGJ5IGEgc2VtaWNvbG9uLlxuICpcbiAqIEBwYXJhbSB7KE9iamVjdC48c3RyaW5nLCBzdHJpbmc+fHN0cmluZyl9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmV4cG9ydHMuc3R5bGUgPSBwdWdfc3R5bGU7XG5mdW5jdGlvbiBwdWdfc3R5bGUodmFsKSB7XG4gIGlmICghdmFsKSByZXR1cm4gJyc7XG4gIGlmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgIHZhciBvdXQgPSAnJztcbiAgICBmb3IgKHZhciBzdHlsZSBpbiB2YWwpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAocHVnX2hhc19vd25fcHJvcGVydHkuY2FsbCh2YWwsIHN0eWxlKSkge1xuICAgICAgICBvdXQgPSBvdXQgKyBzdHlsZSArICc6JyArIHZhbFtzdHlsZV0gKyAnOyc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH0gZWxzZSB7XG4gICAgdmFsICs9ICcnO1xuICAgIGlmICh2YWxbdmFsLmxlbmd0aCAtIDFdICE9PSAnOycpIFxuICAgICAgcmV0dXJuIHZhbCArICc7JztcbiAgICByZXR1cm4gdmFsO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZXNjYXBlZFxuICogQHBhcmFtIHtCb29sZWFufSB0ZXJzZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmF0dHIgPSBwdWdfYXR0cjtcbmZ1bmN0aW9uIHB1Z19hdHRyKGtleSwgdmFsLCBlc2NhcGVkLCB0ZXJzZSkge1xuICBpZiAodmFsID09PSBmYWxzZSB8fCB2YWwgPT0gbnVsbCB8fCAhdmFsICYmIChrZXkgPT09ICdjbGFzcycgfHwga2V5ID09PSAnc3R5bGUnKSkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICBpZiAodmFsID09PSB0cnVlKSB7XG4gICAgcmV0dXJuICcgJyArICh0ZXJzZSA/IGtleSA6IGtleSArICc9XCInICsga2V5ICsgJ1wiJyk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWwudG9KU09OID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFsID0gdmFsLnRvSlNPTigpO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsICE9PSAnc3RyaW5nJykge1xuICAgIHZhbCA9IEpTT04uc3RyaW5naWZ5KHZhbCk7XG4gICAgaWYgKCFlc2NhcGVkICYmIHZhbC5pbmRleE9mKCdcIicpICE9PSAtMSkge1xuICAgICAgcmV0dXJuICcgJyArIGtleSArICc9XFwnJyArIHZhbC5yZXBsYWNlKC8nL2csICcmIzM5OycpICsgJ1xcJyc7XG4gICAgfVxuICB9XG4gIGlmIChlc2NhcGVkKSB2YWwgPSBwdWdfZXNjYXBlKHZhbCk7XG4gIHJldHVybiAnICcgKyBrZXkgKyAnPVwiJyArIHZhbCArICdcIic7XG59O1xuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlcyBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtPYmplY3R9IHRlcnNlIHdoZXRoZXIgdG8gdXNlIEhUTUw1IHRlcnNlIGJvb2xlYW4gYXR0cmlidXRlc1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmF0dHJzID0gcHVnX2F0dHJzO1xuZnVuY3Rpb24gcHVnX2F0dHJzKG9iaiwgdGVyc2Upe1xuICB2YXIgYXR0cnMgPSAnJztcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKHB1Z19oYXNfb3duX3Byb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICB2YXIgdmFsID0gb2JqW2tleV07XG5cbiAgICAgIGlmICgnY2xhc3MnID09PSBrZXkpIHtcbiAgICAgICAgdmFsID0gcHVnX2NsYXNzZXModmFsKTtcbiAgICAgICAgYXR0cnMgPSBwdWdfYXR0cihrZXksIHZhbCwgZmFsc2UsIHRlcnNlKSArIGF0dHJzO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICgnc3R5bGUnID09PSBrZXkpIHtcbiAgICAgICAgdmFsID0gcHVnX3N0eWxlKHZhbCk7XG4gICAgICB9XG4gICAgICBhdHRycyArPSBwdWdfYXR0cihrZXksIHZhbCwgZmFsc2UsIHRlcnNlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYXR0cnM7XG59O1xuXG4vKipcbiAqIEVzY2FwZSB0aGUgZ2l2ZW4gc3RyaW5nIG9mIGBodG1sYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaHRtbFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxudmFyIHB1Z19tYXRjaF9odG1sID0gL1tcIiY8Pl0vO1xuZXhwb3J0cy5lc2NhcGUgPSBwdWdfZXNjYXBlO1xuZnVuY3Rpb24gcHVnX2VzY2FwZShfaHRtbCl7XG4gIHZhciBodG1sID0gJycgKyBfaHRtbDtcbiAgdmFyIHJlZ2V4UmVzdWx0ID0gcHVnX21hdGNoX2h0bWwuZXhlYyhodG1sKTtcbiAgaWYgKCFyZWdleFJlc3VsdCkgcmV0dXJuIF9odG1sO1xuXG4gIHZhciByZXN1bHQgPSAnJztcbiAgdmFyIGksIGxhc3RJbmRleCwgZXNjYXBlO1xuICBmb3IgKGkgPSByZWdleFJlc3VsdC5pbmRleCwgbGFzdEluZGV4ID0gMDsgaSA8IGh0bWwubGVuZ3RoOyBpKyspIHtcbiAgICBzd2l0Y2ggKGh0bWwuY2hhckNvZGVBdChpKSkge1xuICAgICAgY2FzZSAzNDogZXNjYXBlID0gJyZxdW90Oyc7IGJyZWFrO1xuICAgICAgY2FzZSAzODogZXNjYXBlID0gJyZhbXA7JzsgYnJlYWs7XG4gICAgICBjYXNlIDYwOiBlc2NhcGUgPSAnJmx0Oyc7IGJyZWFrO1xuICAgICAgY2FzZSA2MjogZXNjYXBlID0gJyZndDsnOyBicmVhaztcbiAgICAgIGRlZmF1bHQ6IGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAobGFzdEluZGV4ICE9PSBpKSByZXN1bHQgKz0gaHRtbC5zdWJzdHJpbmcobGFzdEluZGV4LCBpKTtcbiAgICBsYXN0SW5kZXggPSBpICsgMTtcbiAgICByZXN1bHQgKz0gZXNjYXBlO1xuICB9XG4gIGlmIChsYXN0SW5kZXggIT09IGkpIHJldHVybiByZXN1bHQgKyBodG1sLnN1YnN0cmluZyhsYXN0SW5kZXgsIGkpO1xuICBlbHNlIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIFJlLXRocm93IHRoZSBnaXZlbiBgZXJyYCBpbiBjb250ZXh0IHRvIHRoZVxuICogdGhlIHB1ZyBpbiBgZmlsZW5hbWVgIGF0IHRoZSBnaXZlbiBgbGluZW5vYC5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IGxpbmVub1xuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBvcmlnaW5hbCBzb3VyY2VcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMucmV0aHJvdyA9IHB1Z19yZXRocm93O1xuZnVuY3Rpb24gcHVnX3JldGhyb3coZXJyLCBmaWxlbmFtZSwgbGluZW5vLCBzdHIpe1xuICBpZiAoIShlcnIgaW5zdGFuY2VvZiBFcnJvcikpIHRocm93IGVycjtcbiAgaWYgKCh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnIHx8ICFmaWxlbmFtZSkgJiYgIXN0cikge1xuICAgIGVyci5tZXNzYWdlICs9ICcgb24gbGluZSAnICsgbGluZW5vO1xuICAgIHRocm93IGVycjtcbiAgfVxuICB0cnkge1xuICAgIHN0ciA9IHN0ciB8fCByZXF1aXJlKCdmcycpLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgJ3V0ZjgnKVxuICB9IGNhdGNoIChleCkge1xuICAgIHB1Z19yZXRocm93KGVyciwgbnVsbCwgbGluZW5vKVxuICB9XG4gIHZhciBjb250ZXh0ID0gM1xuICAgICwgbGluZXMgPSBzdHIuc3BsaXQoJ1xcbicpXG4gICAgLCBzdGFydCA9IE1hdGgubWF4KGxpbmVubyAtIGNvbnRleHQsIDApXG4gICAgLCBlbmQgPSBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIGxpbmVubyArIGNvbnRleHQpO1xuXG4gIC8vIEVycm9yIGNvbnRleHRcbiAgdmFyIGNvbnRleHQgPSBsaW5lcy5zbGljZShzdGFydCwgZW5kKS5tYXAoZnVuY3Rpb24obGluZSwgaSl7XG4gICAgdmFyIGN1cnIgPSBpICsgc3RhcnQgKyAxO1xuICAgIHJldHVybiAoY3VyciA9PSBsaW5lbm8gPyAnICA+ICcgOiAnICAgICcpXG4gICAgICArIGN1cnJcbiAgICAgICsgJ3wgJ1xuICAgICAgKyBsaW5lO1xuICB9KS5qb2luKCdcXG4nKTtcblxuICAvLyBBbHRlciBleGNlcHRpb24gbWVzc2FnZVxuICBlcnIucGF0aCA9IGZpbGVuYW1lO1xuICBlcnIubWVzc2FnZSA9IChmaWxlbmFtZSB8fCAnUHVnJykgKyAnOicgKyBsaW5lbm9cbiAgICArICdcXG4nICsgY29udGV4dCArICdcXG5cXG4nICsgZXJyLm1lc3NhZ2U7XG4gIHRocm93IGVycjtcbn07XG4iLCJ2YXIgcnVudGltZSA9IHJlcXVpcmUoJy4vJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gd3JhcDtcbmZ1bmN0aW9uIHdyYXAodGVtcGxhdGUsIHRlbXBsYXRlTmFtZSkge1xuICB0ZW1wbGF0ZU5hbWUgPSB0ZW1wbGF0ZU5hbWUgfHwgJ3RlbXBsYXRlJztcbiAgcmV0dXJuIEZ1bmN0aW9uKCdwdWcnLFxuICAgIHRlbXBsYXRlICsgJ1xcbicgK1xuICAgICdyZXR1cm4gJyArIHRlbXBsYXRlTmFtZSArICc7J1xuICApKHJ1bnRpbWUpO1xufVxuIiwidmFyIHYxID0gcmVxdWlyZSgnLi92MScpO1xudmFyIHY0ID0gcmVxdWlyZSgnLi92NCcpO1xuXG52YXIgdXVpZCA9IHY0O1xudXVpZC52MSA9IHYxO1xudXVpZC52NCA9IHY0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHV1aWQ7XG4iLCIvKipcbiAqIENvbnZlcnQgYXJyYXkgb2YgMTYgYnl0ZSB2YWx1ZXMgdG8gVVVJRCBzdHJpbmcgZm9ybWF0IG9mIHRoZSBmb3JtOlxuICogWFhYWFhYWFgtWFhYWC1YWFhYLVhYWFgtWFhYWFhYWFhYWFhYXG4gKi9cbnZhciBieXRlVG9IZXggPSBbXTtcbmZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgYnl0ZVRvSGV4W2ldID0gKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnN1YnN0cigxKTtcbn1cblxuZnVuY3Rpb24gYnl0ZXNUb1V1aWQoYnVmLCBvZmZzZXQpIHtcbiAgdmFyIGkgPSBvZmZzZXQgfHwgMDtcbiAgdmFyIGJ0aCA9IGJ5dGVUb0hleDtcbiAgcmV0dXJuIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gKyAnLScgK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBieXRlc1RvVXVpZDtcbiIsIi8vIFVuaXF1ZSBJRCBjcmVhdGlvbiByZXF1aXJlcyBhIGhpZ2ggcXVhbGl0eSByYW5kb20gIyBnZW5lcmF0b3IuICBJbiB0aGVcbi8vIGJyb3dzZXIgdGhpcyBpcyBhIGxpdHRsZSBjb21wbGljYXRlZCBkdWUgdG8gdW5rbm93biBxdWFsaXR5IG9mIE1hdGgucmFuZG9tKClcbi8vIGFuZCBpbmNvbnNpc3RlbnQgc3VwcG9ydCBmb3IgdGhlIGBjcnlwdG9gIEFQSS4gIFdlIGRvIHRoZSBiZXN0IHdlIGNhbiB2aWFcbi8vIGZlYXR1cmUtZGV0ZWN0aW9uXG52YXIgcm5nO1xuXG52YXIgY3J5cHRvID0gZ2xvYmFsLmNyeXB0byB8fCBnbG9iYWwubXNDcnlwdG87IC8vIGZvciBJRSAxMVxuaWYgKGNyeXB0byAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XG4gIC8vIFdIQVRXRyBjcnlwdG8gUk5HIC0gaHR0cDovL3dpa2kud2hhdHdnLm9yZy93aWtpL0NyeXB0b1xuICB2YXIgcm5kczggPSBuZXcgVWludDhBcnJheSgxNik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiAgcm5nID0gZnVuY3Rpb24gd2hhdHdnUk5HKCkge1xuICAgIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMocm5kczgpO1xuICAgIHJldHVybiBybmRzODtcbiAgfTtcbn1cblxuaWYgKCFybmcpIHtcbiAgLy8gTWF0aC5yYW5kb20oKS1iYXNlZCAoUk5HKVxuICAvL1xuICAvLyBJZiBhbGwgZWxzZSBmYWlscywgdXNlIE1hdGgucmFuZG9tKCkuICBJdCdzIGZhc3QsIGJ1dCBpcyBvZiB1bnNwZWNpZmllZFxuICAvLyBxdWFsaXR5LlxuICB2YXIgcm5kcyA9IG5ldyBBcnJheSgxNik7XG4gIHJuZyA9IGZ1bmN0aW9uKCkge1xuICAgIGZvciAodmFyIGkgPSAwLCByOyBpIDwgMTY7IGkrKykge1xuICAgICAgaWYgKChpICYgMHgwMykgPT09IDApIHIgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDA7XG4gICAgICBybmRzW2ldID0gciA+Pj4gKChpICYgMHgwMykgPDwgMykgJiAweGZmO1xuICAgIH1cblxuICAgIHJldHVybiBybmRzO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJuZztcbiIsInZhciBybmcgPSByZXF1aXJlKCcuL2xpYi9ybmcnKTtcbnZhciBieXRlc1RvVXVpZCA9IHJlcXVpcmUoJy4vbGliL2J5dGVzVG9VdWlkJyk7XG5cbi8vICoqYHYxKClgIC0gR2VuZXJhdGUgdGltZS1iYXNlZCBVVUlEKipcbi8vXG4vLyBJbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vTGlvc0svVVVJRC5qc1xuLy8gYW5kIGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS91dWlkLmh0bWxcblxuLy8gcmFuZG9tICMncyB3ZSBuZWVkIHRvIGluaXQgbm9kZSBhbmQgY2xvY2tzZXFcbnZhciBfc2VlZEJ5dGVzID0gcm5nKCk7XG5cbi8vIFBlciA0LjUsIGNyZWF0ZSBhbmQgNDgtYml0IG5vZGUgaWQsICg0NyByYW5kb20gYml0cyArIG11bHRpY2FzdCBiaXQgPSAxKVxudmFyIF9ub2RlSWQgPSBbXG4gIF9zZWVkQnl0ZXNbMF0gfCAweDAxLFxuICBfc2VlZEJ5dGVzWzFdLCBfc2VlZEJ5dGVzWzJdLCBfc2VlZEJ5dGVzWzNdLCBfc2VlZEJ5dGVzWzRdLCBfc2VlZEJ5dGVzWzVdXG5dO1xuXG4vLyBQZXIgNC4yLjIsIHJhbmRvbWl6ZSAoMTQgYml0KSBjbG9ja3NlcVxudmFyIF9jbG9ja3NlcSA9IChfc2VlZEJ5dGVzWzZdIDw8IDggfCBfc2VlZEJ5dGVzWzddKSAmIDB4M2ZmZjtcblxuLy8gUHJldmlvdXMgdXVpZCBjcmVhdGlvbiB0aW1lXG52YXIgX2xhc3RNU2VjcyA9IDAsIF9sYXN0TlNlY3MgPSAwO1xuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2Jyb29mYS9ub2RlLXV1aWQgZm9yIEFQSSBkZXRhaWxzXG5mdW5jdGlvbiB2MShvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICB2YXIgaSA9IGJ1ZiAmJiBvZmZzZXQgfHwgMDtcbiAgdmFyIGIgPSBidWYgfHwgW107XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdmFyIGNsb2Nrc2VxID0gb3B0aW9ucy5jbG9ja3NlcSAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5jbG9ja3NlcSA6IF9jbG9ja3NlcTtcblxuICAvLyBVVUlEIHRpbWVzdGFtcHMgYXJlIDEwMCBuYW5vLXNlY29uZCB1bml0cyBzaW5jZSB0aGUgR3JlZ29yaWFuIGVwb2NoLFxuICAvLyAoMTU4Mi0xMC0xNSAwMDowMCkuICBKU051bWJlcnMgYXJlbid0IHByZWNpc2UgZW5vdWdoIGZvciB0aGlzLCBzb1xuICAvLyB0aW1lIGlzIGhhbmRsZWQgaW50ZXJuYWxseSBhcyAnbXNlY3MnIChpbnRlZ2VyIG1pbGxpc2Vjb25kcykgYW5kICduc2VjcydcbiAgLy8gKDEwMC1uYW5vc2Vjb25kcyBvZmZzZXQgZnJvbSBtc2Vjcykgc2luY2UgdW5peCBlcG9jaCwgMTk3MC0wMS0wMSAwMDowMC5cbiAgdmFyIG1zZWNzID0gb3B0aW9ucy5tc2VjcyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5tc2VjcyA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gIC8vIFBlciA0LjIuMS4yLCB1c2UgY291bnQgb2YgdXVpZCdzIGdlbmVyYXRlZCBkdXJpbmcgdGhlIGN1cnJlbnQgY2xvY2tcbiAgLy8gY3ljbGUgdG8gc2ltdWxhdGUgaGlnaGVyIHJlc29sdXRpb24gY2xvY2tcbiAgdmFyIG5zZWNzID0gb3B0aW9ucy5uc2VjcyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5uc2VjcyA6IF9sYXN0TlNlY3MgKyAxO1xuXG4gIC8vIFRpbWUgc2luY2UgbGFzdCB1dWlkIGNyZWF0aW9uIChpbiBtc2VjcylcbiAgdmFyIGR0ID0gKG1zZWNzIC0gX2xhc3RNU2VjcykgKyAobnNlY3MgLSBfbGFzdE5TZWNzKS8xMDAwMDtcblxuICAvLyBQZXIgNC4yLjEuMiwgQnVtcCBjbG9ja3NlcSBvbiBjbG9jayByZWdyZXNzaW9uXG4gIGlmIChkdCA8IDAgJiYgb3B0aW9ucy5jbG9ja3NlcSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY2xvY2tzZXEgPSBjbG9ja3NlcSArIDEgJiAweDNmZmY7XG4gIH1cblxuICAvLyBSZXNldCBuc2VjcyBpZiBjbG9jayByZWdyZXNzZXMgKG5ldyBjbG9ja3NlcSkgb3Igd2UndmUgbW92ZWQgb250byBhIG5ld1xuICAvLyB0aW1lIGludGVydmFsXG4gIGlmICgoZHQgPCAwIHx8IG1zZWNzID4gX2xhc3RNU2VjcykgJiYgb3B0aW9ucy5uc2VjcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbnNlY3MgPSAwO1xuICB9XG5cbiAgLy8gUGVyIDQuMi4xLjIgVGhyb3cgZXJyb3IgaWYgdG9vIG1hbnkgdXVpZHMgYXJlIHJlcXVlc3RlZFxuICBpZiAobnNlY3MgPj0gMTAwMDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3V1aWQudjEoKTogQ2FuXFwndCBjcmVhdGUgbW9yZSB0aGFuIDEwTSB1dWlkcy9zZWMnKTtcbiAgfVxuXG4gIF9sYXN0TVNlY3MgPSBtc2VjcztcbiAgX2xhc3ROU2VjcyA9IG5zZWNzO1xuICBfY2xvY2tzZXEgPSBjbG9ja3NlcTtcblxuICAvLyBQZXIgNC4xLjQgLSBDb252ZXJ0IGZyb20gdW5peCBlcG9jaCB0byBHcmVnb3JpYW4gZXBvY2hcbiAgbXNlY3MgKz0gMTIyMTkyOTI4MDAwMDA7XG5cbiAgLy8gYHRpbWVfbG93YFxuICB2YXIgdGwgPSAoKG1zZWNzICYgMHhmZmZmZmZmKSAqIDEwMDAwICsgbnNlY3MpICUgMHgxMDAwMDAwMDA7XG4gIGJbaSsrXSA9IHRsID4+PiAyNCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsID4+PiAxNiAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsID4+PiA4ICYgMHhmZjtcbiAgYltpKytdID0gdGwgJiAweGZmO1xuXG4gIC8vIGB0aW1lX21pZGBcbiAgdmFyIHRtaCA9IChtc2VjcyAvIDB4MTAwMDAwMDAwICogMTAwMDApICYgMHhmZmZmZmZmO1xuICBiW2krK10gPSB0bWggPj4+IDggJiAweGZmO1xuICBiW2krK10gPSB0bWggJiAweGZmO1xuXG4gIC8vIGB0aW1lX2hpZ2hfYW5kX3ZlcnNpb25gXG4gIGJbaSsrXSA9IHRtaCA+Pj4gMjQgJiAweGYgfCAweDEwOyAvLyBpbmNsdWRlIHZlcnNpb25cbiAgYltpKytdID0gdG1oID4+PiAxNiAmIDB4ZmY7XG5cbiAgLy8gYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgIChQZXIgNC4yLjIgLSBpbmNsdWRlIHZhcmlhbnQpXG4gIGJbaSsrXSA9IGNsb2Nrc2VxID4+PiA4IHwgMHg4MDtcblxuICAvLyBgY2xvY2tfc2VxX2xvd2BcbiAgYltpKytdID0gY2xvY2tzZXEgJiAweGZmO1xuXG4gIC8vIGBub2RlYFxuICB2YXIgbm9kZSA9IG9wdGlvbnMubm9kZSB8fCBfbm9kZUlkO1xuICBmb3IgKHZhciBuID0gMDsgbiA8IDY7ICsrbikge1xuICAgIGJbaSArIG5dID0gbm9kZVtuXTtcbiAgfVxuXG4gIHJldHVybiBidWYgPyBidWYgOiBieXRlc1RvVXVpZChiKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB2MTtcbiIsInZhciBybmcgPSByZXF1aXJlKCcuL2xpYi9ybmcnKTtcbnZhciBieXRlc1RvVXVpZCA9IHJlcXVpcmUoJy4vbGliL2J5dGVzVG9VdWlkJyk7XG5cbmZ1bmN0aW9uIHY0KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuXG4gIGlmICh0eXBlb2Yob3B0aW9ucykgPT0gJ3N0cmluZycpIHtcbiAgICBidWYgPSBvcHRpb25zID09ICdiaW5hcnknID8gbmV3IEFycmF5KDE2KSA6IG51bGw7XG4gICAgb3B0aW9ucyA9IG51bGw7XG4gIH1cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdmFyIHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgcm5nKSgpO1xuXG4gIC8vIFBlciA0LjQsIHNldCBiaXRzIGZvciB2ZXJzaW9uIGFuZCBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGBcbiAgcm5kc1s2XSA9IChybmRzWzZdICYgMHgwZikgfCAweDQwO1xuICBybmRzWzhdID0gKHJuZHNbOF0gJiAweDNmKSB8IDB4ODA7XG5cbiAgLy8gQ29weSBieXRlcyB0byBidWZmZXIsIGlmIHByb3ZpZGVkXG4gIGlmIChidWYpIHtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgMTY7ICsraWkpIHtcbiAgICAgIGJ1ZltpICsgaWldID0gcm5kc1tpaV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1ZiB8fCBieXRlc1RvVXVpZChybmRzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB2NDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9Cb290c3RyYXBwZXInKTtcbiJdfQ==
