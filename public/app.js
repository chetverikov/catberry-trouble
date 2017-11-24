require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var config = require('./config/environment.json');

var catberry = require('catberry');
var cat = catberry.create(config);

var templateEngine = require('catberry-pug');
templateEngine.register(cat.locator);

var loggerPlugin = require('catberry-logger');
loggerPlugin.register(cat.locator);

var uhrPlugin = require('catberry-uhr');
uhrPlugin.register(cat.locator);

cat.startWhenReady();

},{"./config/environment.json":10,"catberry":"catberry","catberry-logger":undefined,"catberry-pug":undefined,"catberry-uhr":undefined}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Comment = function () {
  function Comment() {
    _classCallCheck(this, Comment);
  }

  _createClass(Comment, [{
    key: 'render',
    value: function render() {
      var commentId = this.$context.attributes['comment-id'];

      return this.$context.getStoreData().then(function (data) {
        return { comment: data.hashWithComments[commentId] };
      });
    }
  }]);

  return Comment;
}();

module.exports = Comment;

},{}],3:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Document = function Document() {
  _classCallCheck(this, Document);
};

module.exports = Document;

},{}],4:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Feed = function () {
  function Feed() {
    _classCallCheck(this, Feed);
  }

  _createClass(Feed, [{
    key: "render",
    value: function render() {
      return this.$context.getStoreData().then(function (data) {
        return { reviews: data.feed };
      });
    }
  }]);

  return Feed;
}();

module.exports = Feed;

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Head = function () {
	function Head(locator) {
		_classCallCheck(this, Head);

		this._config = locator.resolve('config');
	}

	_createClass(Head, [{
		key: 'render',
		value: function render() {
			return this._config;
		}
	}]);

	return Head;
}();

module.exports = Head;

},{}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Review = function () {
  function Review() {
    _classCallCheck(this, Review);
  }

  _createClass(Review, [{
    key: 'render',
    value: function render() {
      this.$context.locator.resolve('logger').info('Review render.');

      var reviewId = this.$context.attributes['review-id'];

      return this.$context.getStoreData().then(function (data) {
        return { review: data.hashWithReviews[reviewId] };
      });
    }
  }]);

  return Review;
}();

module.exports = Review;

},{}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fakeFeed = require('./fakeFeed.json');

var Feed = function () {
  function Feed() {
    var _this = this;

    _classCallCheck(this, Feed);

    this.$lifetime = 0;

    this.feed = fakeFeed;
    this.hashWithReviews = {};
    this.hashWithComments = {};

    this.feed.forEach(function (review) {
      _this.hashWithReviews[review.id] = review;

      if (review.comments.length) {
        review.comments.forEach(function (comment) {
          return _this.hashWithComments[comment.id] = comment;
        });
      }
    });

    this.$lifetime = 0;

    if (this.$context.isBrowser) {
      window.feedStore = this;
    }
  }

  _createClass(Feed, [{
    key: 'load',
    value: function load() {
      return {
        feed: this.feed,
        hashWithReviews: this.hashWithReviews,
        hashWithComments: this.hashWithComments
      };
    }
  }, {
    key: 'updateReview',
    value: function updateReview(reviewId, text) {
      this.hashWithReviews[reviewId].text = text;

      this.$context.changed();
    }
  }]);

  return Feed;
}();

module.exports = Feed;

},{"./fakeFeed.json":9}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Main = function () {
	function Main() {
		_classCallCheck(this, Main);
	}

	_createClass(Main, [{
		key: 'load',
		value: function load() {
			return {
				who: 'World'
			};
		}
	}]);

	return Main;
}();

module.exports = Main;

},{}],9:[function(require,module,exports){
module.exports=[
  {
    "id": "faba08c9-83b8-4dd6-8e5d-c4e08d837605",
    "text": "Quo eligendi quod facere et dolor et voluptatibus. Illo facilis occaecati facere omnis omnis voluptatem ad deleniti ut. Molestias et id repellat dolor tenetur harum eum voluptatum. Consequatur tempore voluptate suscipit fuga.",
    "comments": []
  },
  {
    "id": "3d56cd54-0bdb-470b-bfe7-baa5d6ee1bf5",
    "text": "Aut quasi necessitatibus quia necessitatibus officia eum ratione recusandae praesentium. Dolorem est numquam et. Enim aut sunt eum nihil excepturi perferendis sit reiciendis.",
    "comments": [
      {
        "id": "c6156287-0d06-433c-9829-48f9ca4db99e",
        "text": "molestiae qui et",
        "likes": 0
      },
      {
        "id": "e4143de5-e75a-40b7-88cd-73f513134d5b",
        "text": "quis quia repudiandae",
        "likes": 0
      },
      {
        "id": "ead7efa4-1de8-498a-963e-f1ccff461566",
        "text": "qui quia eveniet",
        "likes": 0
      },
      {
        "id": "93b028cc-399a-4485-b4c0-82cc50ee05af",
        "text": "maiores sed impedit",
        "likes": 0
      },
      {
        "id": "ab74601c-4061-4d7a-8104-c364d751033f",
        "text": "aut qui totam",
        "likes": 0
      }
    ]
  },
  {
    "id": "5c5870ba-5908-40d1-9b87-18ace05a1b6b",
    "text": "Fuga tenetur sed. Dolore animi ipsa explicabo nam aut iure sit earum hic. Rerum temporibus cupiditate ea aut. Qui et consequuntur ut omnis et dolor quae voluptas saepe. Perferendis consequatur voluptatem quia in magnam dignissimos culpa enim tempore. Et perspiciatis ipsa aut quos consequatur totam.",
    "comments": [
      {
        "id": "5f7d56a9-7ebc-4fbe-9ba7-1db4f1e90b59",
        "text": "voluptatibus odit dolores",
        "likes": 0
      },
      {
        "id": "738d8cef-7045-42fa-8c9c-8ffd15528746",
        "text": "velit in quas",
        "likes": 0
      },
      {
        "id": "355c03de-49fc-4525-91a2-3635b4825819",
        "text": "laborum sunt ducimus",
        "likes": 0
      }
    ]
  },
  {
    "id": "47d69e91-b2a9-401e-9258-cfe9a8fa7b20",
    "text": "Sunt eius quod. Reiciendis occaecati magnam magni qui. Et hic maxime laborum optio odit at accusantium aut eaque. Laudantium nihil perferendis repudiandae aperiam tempore. Reiciendis consectetur cum rem cum et omnis atque.",
    "comments": []
  },
  {
    "id": "b977be41-3633-460d-98e8-b81407fae754",
    "text": "Rerum illum necessitatibus quisquam autem aut dicta nesciunt vel. Ratione cumque similique sit. Enim quaerat aut provident atque corrupti maxime.",
    "comments": []
  },
  {
    "id": "106fe023-74a2-485f-91a4-e47842729219",
    "text": "Ipsum id quae minima sequi quisquam. Iste earum nihil sit. Sequi rerum et voluptatem ut amet non.",
    "comments": [
      {
        "id": "cac4b2d3-21a5-46b1-a0d9-0224dec16b73",
        "text": "neque et dolorem",
        "likes": 0
      },
      {
        "id": "832db7c6-09cc-40fa-adc3-b80df0b6b6b3",
        "text": "doloremque commodi mollitia",
        "likes": 0
      },
      {
        "id": "584789bc-de99-4a21-a7ab-b4b366f25b12",
        "text": "autem et natus",
        "likes": 0
      },
      {
        "id": "713a94dd-ec7f-4c7a-8fbe-d65a848022c6",
        "text": "dolores voluptatem iste",
        "likes": 0
      },
      {
        "id": "6c8b1354-82c9-4f4b-a675-34805c5f986f",
        "text": "sapiente quidem et",
        "likes": 0
      }
    ]
  },
  {
    "id": "e2cc7ea6-8049-4bcb-a6db-c0a5a4868a86",
    "text": "Minima in eos nisi vel. Aut ut maxime porro officia expedita. Facilis non autem nam ut. Laboriosam aliquam nam nostrum sit sit ut. Quia maxime ipsam nobis et iusto.",
    "comments": [
      {
        "id": "0c05f5c7-601c-44b3-a6d3-c45d42f28acc",
        "text": "et mollitia quam",
        "likes": 0
      },
      {
        "id": "318434df-cbd2-4198-a5f4-73feec2ddb57",
        "text": "et tempore labore",
        "likes": 0
      },
      {
        "id": "112cbf5d-736b-451e-8983-4955a9ff0086",
        "text": "voluptas quibusdam eos",
        "likes": 0
      },
      {
        "id": "575d6aeb-5789-4812-a14c-9ac5645e165c",
        "text": "molestias reprehenderit qui",
        "likes": 0
      }
    ]
  },
  {
    "id": "9906c16e-df17-41ac-8d25-8d953db794b6",
    "text": "Assumenda molestias omnis. Eos quia qui neque qui quasi repudiandae et eaque. Et in aperiam tempore atque aut autem. Ut ullam fuga molestiae ullam dolorum aliquam eos. Dolore fuga fugiat placeat est. Quaerat quae distinctio nihil pariatur quo aliquid.",
    "comments": [
      {
        "id": "0e0adf71-8a13-4dbd-94c3-a3bf732cadaa",
        "text": "perspiciatis accusantium deleniti",
        "likes": 0
      },
      {
        "id": "c720f93a-c191-4a93-a5a3-91206c320bf0",
        "text": "et adipisci nulla",
        "likes": 0
      },
      {
        "id": "c3af794c-774c-40c4-8680-0fd8a9a9aab6",
        "text": "enim quos alias",
        "likes": 0
      },
      {
        "id": "2a6dd73f-2223-49d8-9d14-36db20948c1f",
        "text": "exercitationem ut aut",
        "likes": 0
      }
    ]
  },
  {
    "id": "9f349dfc-9b24-435e-acb5-43fb6555e0ab",
    "text": "Dolorem tempore consequatur expedita inventore dolorum blanditiis. Soluta reiciendis aut provident ratione ipsa impedit. Aliquid tempore sed reiciendis perferendis provident. Ducimus nesciunt et officia est officia quia inventore eveniet. Sequi aspernatur doloribus non saepe quis sed odit enim. Quis et vitae excepturi ut neque qui ab maxime.",
    "comments": [
      {
        "id": "686b7189-5f54-49e4-bd3d-34fee9da1473",
        "text": "quia dolorem deserunt",
        "likes": 0
      }
    ]
  },
  {
    "id": "2d73fd08-72e5-4cf4-aa6a-04023a8bcc59",
    "text": "Fugit est vel quo dolorem praesentium et enim laudantium. Odio quia minima omnis ea tempore excepturi quia repellat maiores. Sed officiis sed omnis reprehenderit maxime ut qui et fugit. Debitis porro id sed eligendi adipisci alias qui aut.",
    "comments": [
      {
        "id": "0145d089-3642-4936-aec1-cef869ac10df",
        "text": "enim dignissimos voluptatem",
        "likes": 0
      },
      {
        "id": "9f5097de-e4dc-4869-ba9d-0ba18a7da024",
        "text": "eos aliquam ad",
        "likes": 0
      }
    ]
  }
]

},{}],10:[function(require,module,exports){
module.exports={
	"title": "Catberry Project",
	"logger": {
		"level": 0
	}
}

},{}],11:[function(require,module,exports){
'use strict';

module.exports = ['/'];

},{}],"appDefinitions":[function(require,module,exports){


'use strict';

var stores = [{ name: 'Feed', constructor: require('./catberry_stores/Feed.js') }, { name: 'Main', constructor: require('./catberry_stores/Main.js') }];

var components = [{
	name: 'comment',
	constructor: require('./catberry_components/comment/index.js'),
	properties: { "name": "comment", "template": "./template.pug", "errorTemplate": "./error.pug", "logic": "index.js" },
	templateProviderName: 'pug',
	compiledTemplate: 'function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}\nvar pug_match_html=/["&<>]/;\nfunction pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\\n"+i+"\\n\\n"+n.message,n}function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {;var locals_for_with = (locals || {});(function (comment) {;pug_debug_line = 1;\npug_html = pug_html + "\\u003Cdiv class=\\"comment-block\\"\\u003E";\n;pug_debug_line = 2;\npug_html = pug_html + "\\u003Cp\\u003E";\n;pug_debug_line = 2;\npug_html = pug_html + (pug_escape(null == (pug_interp = comment.text) ? "" : pug_interp)) + "\\u003C\\u002Fp\\u003E";\n;pug_debug_line = 3;\npug_html = pug_html + "\\u003Cdiv class=\\"comment-likes\\"\\u003E";\n;pug_debug_line = 3;\npug_html = pug_html + (pug_escape(null == (pug_interp = comment.likes) ? "" : pug_interp)) + "\\u003C\\u002Fdiv\\u003E\\u003C\\u002Fdiv\\u003E";}.call(this,"comment" in locals_for_with?locals_for_with.comment:typeof comment!=="undefined"?comment:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}',
	errorTemplateProviderName: 'pug',
	compiledErrorTemplate: 'function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\\n"+i+"\\n\\n"+n.message,n}function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}'
}, {
	name: 'document',
	constructor: require('./catberry_components/document/Document.js'),
	properties: { "name": "document", "template": "./document.pug", "logic": "./Document.js" },
	templateProviderName: 'pug',
	compiledTemplate: 'function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\\n"+i+"\\n\\n"+n.message,n}function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {;pug_debug_line = 1;\npug_html = pug_html + "\\u003C!DOCTYPE html\\u003E";\n;pug_debug_line = 2;\npug_html = pug_html + "\\u003Chtml\\u003E";\n;pug_debug_line = 3;\npug_html = pug_html + "\\u003Chead\\u003E";\n;pug_debug_line = 4;\npug_html = pug_html + "\\u003Cstyle type=\\"text\\u002Fcss\\"\\u003E";\n;pug_debug_line = 5;\npug_html = pug_html + "body {";\n;pug_debug_line = 6;\npug_html = pug_html + "\\n";\n;pug_debug_line = 6;\npug_html = pug_html + "  padding: 20px;";\n;pug_debug_line = 7;\npug_html = pug_html + "\\n";\n;pug_debug_line = 7;\npug_html = pug_html + "}";\n;pug_debug_line = 8;\npug_html = pug_html + "\\n";\n;pug_debug_line = 8;\npug_html = pug_html + "";\n;pug_debug_line = 9;\npug_html = pug_html + "\\n";\n;pug_debug_line = 9;\npug_html = pug_html + ".feed {";\n;pug_debug_line = 10;\npug_html = pug_html + "\\n";\n;pug_debug_line = 10;\npug_html = pug_html + "  margin: 0 auto;";\n;pug_debug_line = 11;\npug_html = pug_html + "\\n";\n;pug_debug_line = 11;\npug_html = pug_html + "  width: 600px;";\n;pug_debug_line = 12;\npug_html = pug_html + "\\n";\n;pug_debug_line = 12;\npug_html = pug_html + "}";\n;pug_debug_line = 13;\npug_html = pug_html + "\\n";\n;pug_debug_line = 13;\npug_html = pug_html + "";\n;pug_debug_line = 14;\npug_html = pug_html + "\\n";\n;pug_debug_line = 14;\npug_html = pug_html + ".review-block, .comment-block {";\n;pug_debug_line = 15;\npug_html = pug_html + "\\n";\n;pug_debug_line = 15;\npug_html = pug_html + "  margin-bottom: 20px;";\n;pug_debug_line = 16;\npug_html = pug_html + "\\n";\n;pug_debug_line = 16;\npug_html = pug_html + "}";\n;pug_debug_line = 17;\npug_html = pug_html + "\\n";\n;pug_debug_line = 17;\npug_html = pug_html + "";\n;pug_debug_line = 18;\npug_html = pug_html + "\\n";\n;pug_debug_line = 18;\npug_html = pug_html + ".comments-block {";\n;pug_debug_line = 19;\npug_html = pug_html + "\\n";\n;pug_debug_line = 19;\npug_html = pug_html + "  margin-top: 10px;";\n;pug_debug_line = 20;\npug_html = pug_html + "\\n";\n;pug_debug_line = 20;\npug_html = pug_html + "  margin-left: 40px;";\n;pug_debug_line = 21;\npug_html = pug_html + "\\n";\n;pug_debug_line = 21;\npug_html = pug_html + "}\\u003C\\u002Fstyle\\u003E\\u003C\\u002Fhead\\u003E\\u003C\\u002Fhtml\\u003E";\n;pug_debug_line = 22;\npug_html = pug_html + "\\u003Cbody\\u003E";\n;pug_debug_line = 23;\npug_html = pug_html + "\\u003Ccat-feed cat-store=\\"Feed\\"\\u003E\\u003C\\u002Fcat-feed\\u003E\\u003C\\u002Fbody\\u003E";} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}',
	errorTemplateProviderName: null,
	compiledErrorTemplate: null
}, {
	name: 'feed',
	constructor: require('./catberry_components/feed/index.js'),
	properties: { "name": "feed", "template": "./template.pug", "errorTemplate": "./error.pug", "logic": "index.js" },
	templateProviderName: 'pug',
	compiledTemplate: 'function pug_attr(t,e,n,f){return e!==!1&&null!=e&&(e||"class"!==t&&"style"!==t)?e===!0?" "+(f?t:t+\'="\'+t+\'"\'):("function"==typeof e.toJSON&&(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||e.indexOf(\'"\')===-1)?(n&&(e=pug_escape(e))," "+t+\'="\'+e+\'"\'):" "+t+"=\'"+e.replace(/\'/g,"&#39;")+"\'"):""}\nfunction pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}\nvar pug_match_html=/["&<>]/;\nfunction pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\\n"+i+"\\n\\n"+n.message,n}function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {;var locals_for_with = (locals || {});(function (reviews) {;pug_debug_line = 1;\npug_html = pug_html + "\\u003Cdiv class=\\"feed\\"\\u003E";\n;pug_debug_line = 2;\n// iterate reviews\n;(function(){\n  var $obj = reviews;\n  if (\'number\' == typeof $obj.length) {\n      for (var pug_index0 = 0, $l = $obj.length; pug_index0 < $l; pug_index0++) {\n        var review = $obj[pug_index0];\n;pug_debug_line = 3;\npug_html = pug_html + "\\u003Ccat-review" + (pug_attr("review-id", review.id, true, false)+" cat-store=\\"Feed\\"") + "\\u003E\\u003C\\u002Fcat-review\\u003E";\n      }\n  } else {\n    var $l = 0;\n    for (var pug_index0 in $obj) {\n      $l++;\n      var review = $obj[pug_index0];\n;pug_debug_line = 3;\npug_html = pug_html + "\\u003Ccat-review" + (pug_attr("review-id", review.id, true, false)+" cat-store=\\"Feed\\"") + "\\u003E\\u003C\\u002Fcat-review\\u003E";\n    }\n  }\n}).call(this);\n\npug_html = pug_html + "\\u003C\\u002Fdiv\\u003E";}.call(this,"reviews" in locals_for_with?locals_for_with.reviews:typeof reviews!=="undefined"?reviews:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}',
	errorTemplateProviderName: 'pug',
	compiledErrorTemplate: 'function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\\n"+i+"\\n\\n"+n.message,n}function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}'
}, {
	name: 'head',
	constructor: require('./catberry_components/head/Head.js'),
	properties: { "name": "head", "template": "./head.pug", "logic": "./Head.js" },
	templateProviderName: 'pug',
	compiledTemplate: 'function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}\nvar pug_match_html=/["&<>]/;\nfunction pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\\n"+i+"\\n\\n"+n.message,n}function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {;var locals_for_with = (locals || {});(function (title) {;pug_debug_line = 1;\npug_html = pug_html + "\\u003Cmeta charset=\\"UTF-8\\"\\u002F\\u003E";\n;pug_debug_line = 2;\npug_html = pug_html + "\\u003Ctitle\\u003E";\n;pug_debug_line = 2;\npug_html = pug_html + (pug_escape(null == (pug_interp = title) ? "" : pug_interp)) + "\\u003C\\u002Ftitle\\u003E";\n;pug_debug_line = 3;\npug_html = pug_html + "\\u003Cscript src=\\"externals.js\\"\\u003E\\u003C\\u002Fscript\\u003E";\n;pug_debug_line = 4;\npug_html = pug_html + "\\u003Cscript src=\\"app.js\\"\\u003E\\u003C\\u002Fscript\\u003E";}.call(this,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}',
	errorTemplateProviderName: null,
	compiledErrorTemplate: null
}, {
	name: 'review',
	constructor: require('./catberry_components/review/index.js'),
	properties: { "name": "review", "template": "./template.pug", "errorTemplate": "./error.pug", "logic": "index.js" },
	templateProviderName: 'pug',
	compiledTemplate: 'function pug_attr(t,e,n,f){return e!==!1&&null!=e&&(e||"class"!==t&&"style"!==t)?e===!0?" "+(f?t:t+\'="\'+t+\'"\'):("function"==typeof e.toJSON&&(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||e.indexOf(\'"\')===-1)?(n&&(e=pug_escape(e))," "+t+\'="\'+e+\'"\'):" "+t+"=\'"+e.replace(/\'/g,"&#39;")+"\'"):""}\nfunction pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}\nvar pug_match_html=/["&<>]/;\nfunction pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\\n"+i+"\\n\\n"+n.message,n}function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {;var locals_for_with = (locals || {});(function (review) {;pug_debug_line = 1;\npug_html = pug_html + "\\u003Cdiv class=\\"review-block\\"\\u003E";\n;pug_debug_line = 2;\npug_html = pug_html + "\\u003Cp\\u003E";\n;pug_debug_line = 2;\npug_html = pug_html + (pug_escape(null == (pug_interp = review.text) ? "" : pug_interp)) + "\\u003C\\u002Fp\\u003E";\n;pug_debug_line = 4;\npug_html = pug_html + "\\u003Cdiv class=\\"comments-block\\"\\u003E";\n;pug_debug_line = 5;\n// iterate review.comments\n;(function(){\n  var $obj = review.comments;\n  if (\'number\' == typeof $obj.length) {\n      for (var pug_index0 = 0, $l = $obj.length; pug_index0 < $l; pug_index0++) {\n        var comment = $obj[pug_index0];\n;pug_debug_line = 6;\npug_html = pug_html + "\\u003Ccat-comment" + (pug_attr("comment-id", comment.id, true, false)+" cat-store=\\"Feed\\"") + "\\u003E\\u003C\\u002Fcat-comment\\u003E";\n      }\n  } else {\n    var $l = 0;\n    for (var pug_index0 in $obj) {\n      $l++;\n      var comment = $obj[pug_index0];\n;pug_debug_line = 6;\npug_html = pug_html + "\\u003Ccat-comment" + (pug_attr("comment-id", comment.id, true, false)+" cat-store=\\"Feed\\"") + "\\u003E\\u003C\\u002Fcat-comment\\u003E";\n    }\n  }\n}).call(this);\n\npug_html = pug_html + "\\u003C\\u002Fdiv\\u003E\\u003C\\u002Fdiv\\u003E";}.call(this,"review" in locals_for_with?locals_for_with.review:typeof review!=="undefined"?review:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}',
	errorTemplateProviderName: 'pug',
	compiledErrorTemplate: 'function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\\n"+i+"\\n\\n"+n.message,n}function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}'
}];

var routeDefinitions = require('./routes.js') || [];
var routeDescriptors = [{ "expression": "/", "pathParameters": [], "queryParameters": [], "pathRegExpSource": "^/$" }] || [];

module.exports = {
	stores: stores,
	components: components,
	routeDefinitions: routeDefinitions,
	routeDescriptors: routeDescriptors
};

},{"./catberry_components/comment/index.js":2,"./catberry_components/document/Document.js":3,"./catberry_components/feed/index.js":4,"./catberry_components/head/Head.js":5,"./catberry_components/review/index.js":6,"./catberry_stores/Feed.js":7,"./catberry_stores/Main.js":8,"./routes.js":11}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLmpzIiwiY2F0YmVycnlfY29tcG9uZW50cy9jb21tZW50L2luZGV4LmpzIiwiY2F0YmVycnlfY29tcG9uZW50cy9kb2N1bWVudC9Eb2N1bWVudC5qcyIsImNhdGJlcnJ5X2NvbXBvbmVudHMvZmVlZC9pbmRleC5qcyIsImNhdGJlcnJ5X2NvbXBvbmVudHMvaGVhZC9IZWFkLmpzIiwiY2F0YmVycnlfY29tcG9uZW50cy9yZXZpZXcvaW5kZXguanMiLCJjYXRiZXJyeV9zdG9yZXMvRmVlZC5qcyIsImNhdGJlcnJ5X3N0b3Jlcy9NYWluLmpzIiwiY2F0YmVycnlfc3RvcmVzL2Zha2VGZWVkLmpzb24iLCJjb25maWcvYnJvd3Nlci5qc29uIiwicm91dGVzLmpzIiwiLmFwcERlZmluaXRpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBSUEsSUFBTSxTQUFTLFFBQVEsMkJBQVIsQ0FBZjs7QUFHQSxJQUFNLFdBQVcsUUFBUSxVQUFSLENBQWpCO0FBQ0EsSUFBTSxNQUFNLFNBQVMsTUFBVCxDQUFnQixNQUFoQixDQUFaOztBQUdBLElBQU0saUJBQWlCLFFBQVEsY0FBUixDQUF2QjtBQUNBLGVBQWUsUUFBZixDQUF3QixJQUFJLE9BQTVCOztBQUVBLElBQU0sZUFBZSxRQUFRLGlCQUFSLENBQXJCO0FBQ0EsYUFBYSxRQUFiLENBQXNCLElBQUksT0FBMUI7O0FBRUEsSUFBTSxZQUFZLFFBQVEsY0FBUixDQUFsQjtBQUNBLFVBQVUsUUFBVixDQUFtQixJQUFJLE9BQXZCOztBQUdBLElBQUksY0FBSjs7Ozs7Ozs7O0lDckJNLE87Ozs7Ozs7NkJBRUs7QUFDUCxVQUFNLFlBQVksS0FBSyxRQUFMLENBQWMsVUFBZCxDQUF5QixZQUF6QixDQUFsQjs7QUFFQSxhQUFPLEtBQUssUUFBTCxDQUFjLFlBQWQsR0FDSixJQURJLENBQ0M7QUFBQSxlQUFTLEVBQUMsU0FBUyxLQUFLLGdCQUFMLENBQXNCLFNBQXRCLENBQVYsRUFBVDtBQUFBLE9BREQsQ0FBUDtBQUVEOzs7Ozs7QUFHSCxPQUFPLE9BQVAsR0FBaUIsT0FBakI7OztBQ1ZBOzs7O0lBUU0sUTs7OztBQUVOLE9BQU8sT0FBUCxHQUFpQixRQUFqQjs7Ozs7Ozs7O0lDVk0sSTs7Ozs7Ozs2QkFDSztBQUNQLGFBQU8sS0FBSyxRQUFMLENBQWMsWUFBZCxHQUNKLElBREksQ0FDQztBQUFBLGVBQVMsRUFBQyxTQUFTLEtBQUssSUFBZixFQUFUO0FBQUEsT0FERCxDQUFQO0FBRUQ7Ozs7OztBQUdILE9BQU8sT0FBUCxHQUFpQixJQUFqQjs7O0FDUEE7Ozs7OztJQVFNLEk7QUFNTCxlQUFZLE9BQVosRUFBcUI7QUFBQTs7QUFPcEIsT0FBSyxPQUFMLEdBQWUsUUFBUSxPQUFSLENBQWdCLFFBQWhCLENBQWY7QUFDQTs7OzsyQkFNUTtBQUNSLFVBQU8sS0FBSyxPQUFaO0FBQ0E7Ozs7OztBQUdGLE9BQU8sT0FBUCxHQUFpQixJQUFqQjs7Ozs7Ozs7O0lDakNNLE07QUFDSixvQkFBYztBQUFBO0FBRWI7Ozs7NkJBRVE7QUFDUCxXQUFLLFFBQUwsQ0FBYyxPQUFkLENBQXNCLE9BQXRCLENBQThCLFFBQTlCLEVBQXdDLElBQXhDLENBQTZDLGdCQUE3Qzs7QUFFQSxVQUFNLFdBQVcsS0FBSyxRQUFMLENBQWMsVUFBZCxDQUF5QixXQUF6QixDQUFqQjs7QUFFQSxhQUFPLEtBQUssUUFBTCxDQUFjLFlBQWQsR0FDSixJQURJLENBQ0M7QUFBQSxlQUFTLEVBQUMsUUFBUSxLQUFLLGVBQUwsQ0FBcUIsUUFBckIsQ0FBVCxFQUFUO0FBQUEsT0FERCxDQUFQO0FBRUQ7Ozs7OztBQUdILE9BQU8sT0FBUCxHQUFpQixNQUFqQjs7Ozs7Ozs7O0FDZkEsSUFBTSxXQUFXLFFBQVEsaUJBQVIsQ0FBakI7O0lBUU0sSTtBQUVKLGtCQUFjO0FBQUE7O0FBQUE7O0FBQ1osU0FBSyxTQUFMLEdBQWlCLENBQWpCOztBQUVBLFNBQUssSUFBTCxHQUFZLFFBQVo7QUFDQSxTQUFLLGVBQUwsR0FBdUIsRUFBdkI7QUFDQSxTQUFLLGdCQUFMLEdBQXdCLEVBQXhCOztBQUVBLFNBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0Isa0JBQVU7QUFDMUIsWUFBSyxlQUFMLENBQXFCLE9BQU8sRUFBNUIsSUFBa0MsTUFBbEM7O0FBRUEsVUFBSSxPQUFPLFFBQVAsQ0FBZ0IsTUFBcEIsRUFBNEI7QUFDMUIsZUFBTyxRQUFQLENBQWdCLE9BQWhCLENBQXdCO0FBQUEsaUJBQVksTUFBSyxnQkFBTCxDQUFzQixRQUFRLEVBQTlCLElBQW9DLE9BQWhEO0FBQUEsU0FBeEI7QUFDRDtBQUNGLEtBTkQ7O0FBUUEsU0FBSyxTQUFMLEdBQWlCLENBQWpCOztBQUVBLFFBQUksS0FBSyxRQUFMLENBQWMsU0FBbEIsRUFBNkI7QUFDM0IsYUFBTyxTQUFQLEdBQW1CLElBQW5CO0FBQ0Q7QUFDRjs7OzsyQkFFTTtBQUNMLGFBQU87QUFDTCxjQUFNLEtBQUssSUFETjtBQUVMLHlCQUFpQixLQUFLLGVBRmpCO0FBR0wsMEJBQWtCLEtBQUs7QUFIbEIsT0FBUDtBQUtEOzs7aUNBRVksUSxFQUFVLEksRUFBTTtBQUMzQixXQUFLLGVBQUwsQ0FBcUIsUUFBckIsRUFBK0IsSUFBL0IsR0FBc0MsSUFBdEM7O0FBRUEsV0FBSyxRQUFMLENBQWMsT0FBZDtBQUNEOzs7Ozs7QUFHSCxPQUFPLE9BQVAsR0FBaUIsSUFBakI7OztBQy9DQTs7Ozs7O0lBRU0sSTs7Ozs7Ozt5QkFNRTtBQUNOLFVBQU87QUFDTixTQUFLO0FBREMsSUFBUDtBQUdBOzs7Ozs7QUFHRixPQUFPLE9BQVAsR0FBaUIsSUFBakI7OztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7O0FBV0EsT0FBTyxPQUFQLEdBQWlCLENBQ2hCLEdBRGdCLENBQWpCOzs7OztBQ05BOztBQUVBLElBQU0sU0FBUyxDQUdmLEVBQUMsTUFBTSxNQUFQLEVBQWUsYUFBYSxRQUFRLDJCQUFSLENBQTVCLEVBSGUsRUFJZixFQUFDLE1BQU0sTUFBUCxFQUFlLGFBQWEsUUFBUSwyQkFBUixDQUE1QixFQUplLENBQWY7O0FBUUEsSUFBTSxhQUFhLENBR25CO0FBQ0MsT0FBTSxTQURQO0FBRUMsY0FBYSxRQUFRLHdDQUFSLENBRmQ7QUFHQyxhQUFZLEVBQUMsUUFBTyxTQUFSLEVBQWtCLFlBQVcsZ0JBQTdCLEVBQThDLGlCQUFnQixhQUE5RCxFQUE0RSxTQUFRLFVBQXBGLEVBSGI7QUFJQyx1QkFBc0IsS0FKdkI7QUFLQyxtQkFBa0Isa3REQUxuQjtBQU1DLDRCQUEyQixLQU41QjtBQU9DLHdCQUF1QjtBQVB4QixDQUhtQixFQVluQjtBQUNDLE9BQU0sVUFEUDtBQUVDLGNBQWEsUUFBUSw0Q0FBUixDQUZkO0FBR0MsYUFBWSxFQUFDLFFBQU8sVUFBUixFQUFtQixZQUFXLGdCQUE5QixFQUErQyxTQUFRLGVBQXZELEVBSGI7QUFJQyx1QkFBc0IsS0FKdkI7QUFLQyxtQkFBa0IscWlHQUxuQjtBQU1DLDRCQUEyQixJQU41QjtBQU9DLHdCQUF1QjtBQVB4QixDQVptQixFQXFCbkI7QUFDQyxPQUFNLE1BRFA7QUFFQyxjQUFhLFFBQVEscUNBQVIsQ0FGZDtBQUdDLGFBQVksRUFBQyxRQUFPLE1BQVIsRUFBZSxZQUFXLGdCQUExQixFQUEyQyxpQkFBZ0IsYUFBM0QsRUFBeUUsU0FBUSxVQUFqRixFQUhiO0FBSUMsdUJBQXNCLEtBSnZCO0FBS0MsbUJBQWtCLHkyRUFMbkI7QUFNQyw0QkFBMkIsS0FONUI7QUFPQyx3QkFBdUI7QUFQeEIsQ0FyQm1CLEVBOEJuQjtBQUNDLE9BQU0sTUFEUDtBQUVDLGNBQWEsUUFBUSxvQ0FBUixDQUZkO0FBR0MsYUFBWSxFQUFDLFFBQU8sTUFBUixFQUFlLFlBQVcsWUFBMUIsRUFBdUMsU0FBUSxXQUEvQyxFQUhiO0FBSUMsdUJBQXNCLEtBSnZCO0FBS0MsbUJBQWtCLCtxREFMbkI7QUFNQyw0QkFBMkIsSUFONUI7QUFPQyx3QkFBdUI7QUFQeEIsQ0E5Qm1CLEVBdUNuQjtBQUNDLE9BQU0sUUFEUDtBQUVDLGNBQWEsUUFBUSx1Q0FBUixDQUZkO0FBR0MsYUFBWSxFQUFDLFFBQU8sUUFBUixFQUFpQixZQUFXLGdCQUE1QixFQUE2QyxpQkFBZ0IsYUFBN0QsRUFBMkUsU0FBUSxVQUFuRixFQUhiO0FBSUMsdUJBQXNCLEtBSnZCO0FBS0MsbUJBQWtCLHVzRkFMbkI7QUFNQyw0QkFBMkIsS0FONUI7QUFPQyx3QkFBdUI7QUFQeEIsQ0F2Q21CLENBQW5COztBQW1EQSxJQUFNLG1CQUFtQixRQUFRLGFBQVIsS0FBMEIsRUFBbkQ7QUFDQSxJQUFNLG1CQUFtQixDQUFDLEVBQUMsY0FBYSxHQUFkLEVBQWtCLGtCQUFpQixFQUFuQyxFQUFzQyxtQkFBa0IsRUFBeEQsRUFBMkQsb0JBQW1CLEtBQTlFLEVBQUQsS0FBMEYsRUFBbkg7O0FBRUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2hCLGVBRGdCO0FBRWhCLHVCQUZnQjtBQUdoQixtQ0FIZ0I7QUFJaEI7QUFKZ0IsQ0FBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyB0aGlzIGNvbmZpZyB3aWxsIGJlIHJlcGxhY2VkIGJ5IGAuL2NvbmZpZy9icm93c2VyLmpzb25gIHdoZW4gYnVpbGRpbmdcbi8vIGJlY2F1c2Ugb2YgYGJyb3dzZXJgIGZpZWxkIGluIGBwYWNrYWdlLmpzb25gXG5jb25zdCBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy9lbnZpcm9ubWVudC5qc29uJyk7XG5cbi8vIGNhdGJlcnJ5IGFwcGxpY2F0aW9uXG5jb25zdCBjYXRiZXJyeSA9IHJlcXVpcmUoJ2NhdGJlcnJ5Jyk7XG5jb25zdCBjYXQgPSBjYXRiZXJyeS5jcmVhdGUoY29uZmlnKTtcblxuLy8gcmVnaXN0ZXIgQ2F0YmVycnkgcGx1Z2lucyBuZWVkZWQgaW4gYSBicm93c2VyXG5jb25zdCB0ZW1wbGF0ZUVuZ2luZSA9IHJlcXVpcmUoJ2NhdGJlcnJ5LXB1ZycpO1xudGVtcGxhdGVFbmdpbmUucmVnaXN0ZXIoY2F0LmxvY2F0b3IpO1xuXG5jb25zdCBsb2dnZXJQbHVnaW4gPSByZXF1aXJlKCdjYXRiZXJyeS1sb2dnZXInKTtcbmxvZ2dlclBsdWdpbi5yZWdpc3RlcihjYXQubG9jYXRvcik7XG5cbmNvbnN0IHVoclBsdWdpbiA9IHJlcXVpcmUoJ2NhdGJlcnJ5LXVocicpO1xudWhyUGx1Z2luLnJlZ2lzdGVyKGNhdC5sb2NhdG9yKTtcblxuLy8gc3RhcnRzIHRoZSBhcHBsaWNhdGlvbiB3aGVuIERPTSBpcyByZWFkeVxuY2F0LnN0YXJ0V2hlblJlYWR5KCk7XG5cbiIsImNsYXNzIENvbW1lbnQge1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBjb21tZW50SWQgPSB0aGlzLiRjb250ZXh0LmF0dHJpYnV0ZXNbJ2NvbW1lbnQtaWQnXTtcblxuICAgIHJldHVybiB0aGlzLiRjb250ZXh0LmdldFN0b3JlRGF0YSgpXG4gICAgICAudGhlbihkYXRhID0+ICh7Y29tbWVudDogZGF0YS5oYXNoV2l0aENvbW1lbnRzW2NvbW1lbnRJZF19KSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb21tZW50O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbi8qXG4gKiBUaGlzIGlzIGEgQ2F0YmVycnkgQ2F0LWNvbXBvbmVudCBmaWxlLlxuICogTW9yZSBkZXRhaWxzIGNhbiBiZSBmb3VuZCBoZXJlXG4gKiBodHRwOi8vY2F0YmVycnkub3JnL2RvY3VtZW50YXRpb24jY2F0LWNvbXBvbmVudHMtaW50ZXJmYWNlXG4gKi9cblxuY2xhc3MgRG9jdW1lbnQgeyB9XG5cbm1vZHVsZS5leHBvcnRzID0gRG9jdW1lbnQ7XG5cbiIsImNsYXNzIEZlZWQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuJGNvbnRleHQuZ2V0U3RvcmVEYXRhKClcbiAgICAgIC50aGVuKGRhdGEgPT4gKHtyZXZpZXdzOiBkYXRhLmZlZWR9KSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGZWVkO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbi8qXG4gKiBUaGlzIGlzIGEgQ2F0YmVycnkgQ2F0LWNvbXBvbmVudCBmaWxlLlxuICogTW9yZSBkZXRhaWxzIGNhbiBiZSBmb3VuZCBoZXJlXG4gKiBodHRwOi8vY2F0YmVycnkub3JnL2RvY3VtZW50YXRpb24jY2F0LWNvbXBvbmVudHMtaW50ZXJmYWNlXG4gKi9cblxuY2xhc3MgSGVhZCB7XG5cblx0LyoqXG5cdCogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgXCJoZWFkXCIgY29tcG9uZW50LlxuXHQqIEBwYXJhbSB7U2VydmljZUxvY2F0b3J9IGxvY2F0b3IgQ2F0YmVycnkncyBzZXJ2aWNlIGxvY2F0b3IuXG5cdCovXG5cdGNvbnN0cnVjdG9yKGxvY2F0b3IpIHtcblxuXHRcdC8qKlxuXHRcdCogQ3VycmVudCBjb25maWcuXG5cdFx0KiBAdHlwZSB7T2JqZWN0fVxuXHRcdCogQHByaXZhdGVcblx0XHQqL1xuXHRcdHRoaXMuX2NvbmZpZyA9IGxvY2F0b3IucmVzb2x2ZSgnY29uZmlnJyk7XG5cdH1cblxuXHQvKipcblx0KiBHZXRzIGRhdGEgZm9yIHRlbXBsYXRlLlxuXHQqIEByZXR1cm5zIHtPYmplY3R9IERhdGEgb2JqZWN0LlxuXHQqL1xuXHRyZW5kZXIoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2NvbmZpZztcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEhlYWQ7XG5cbiIsImNsYXNzIFJldmlldyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdGhpcy4kY29udGV4dC5sb2NhdG9yLnJlc29sdmUoJ2xvZ2dlcicpLmluZm8oJ1JldmlldyByZW5kZXIuJyk7XG5cbiAgICBjb25zdCByZXZpZXdJZCA9IHRoaXMuJGNvbnRleHQuYXR0cmlidXRlc1sncmV2aWV3LWlkJ107XG5cbiAgICByZXR1cm4gdGhpcy4kY29udGV4dC5nZXRTdG9yZURhdGEoKVxuICAgICAgLnRoZW4oZGF0YSA9PiAoe3JldmlldzogZGF0YS5oYXNoV2l0aFJldmlld3NbcmV2aWV3SWRdfSkpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmV2aWV3O1xuXG4iLCJjb25zdCBmYWtlRmVlZCA9IHJlcXVpcmUoJy4vZmFrZUZlZWQuanNvbicpO1xuXG4vKlxuICogVGhpcyBpcyBhIENhdGJlcnJ5IENhdC1jb21wb25lbnQgZmlsZS5cbiAqIE1vcmUgZGV0YWlscyBjYW4gYmUgZm91bmQgaGVyZVxuICogaHR0cDovL2NhdGJlcnJ5Lm9yZy9kb2N1bWVudGF0aW9uI3N0b3Jlcy1pbnRlcmZhY2VcbiAqL1xuXG5jbGFzcyBGZWVkIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLiRsaWZldGltZSA9IDA7XG5cbiAgICB0aGlzLmZlZWQgPSBmYWtlRmVlZDtcbiAgICB0aGlzLmhhc2hXaXRoUmV2aWV3cyA9IHt9O1xuICAgIHRoaXMuaGFzaFdpdGhDb21tZW50cyA9IHt9O1xuXG4gICAgdGhpcy5mZWVkLmZvckVhY2gocmV2aWV3ID0+IHtcbiAgICAgIHRoaXMuaGFzaFdpdGhSZXZpZXdzW3Jldmlldy5pZF0gPSByZXZpZXc7XG5cbiAgICAgIGlmIChyZXZpZXcuY29tbWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHJldmlldy5jb21tZW50cy5mb3JFYWNoKGNvbW1lbnQgPT4gKHRoaXMuaGFzaFdpdGhDb21tZW50c1tjb21tZW50LmlkXSA9IGNvbW1lbnQpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuJGxpZmV0aW1lID0gMDtcblxuICAgIGlmICh0aGlzLiRjb250ZXh0LmlzQnJvd3Nlcikge1xuICAgICAgd2luZG93LmZlZWRTdG9yZSA9IHRoaXM7XG4gICAgfVxuICB9XG5cbiAgbG9hZCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZmVlZDogdGhpcy5mZWVkLFxuICAgICAgaGFzaFdpdGhSZXZpZXdzOiB0aGlzLmhhc2hXaXRoUmV2aWV3cyxcbiAgICAgIGhhc2hXaXRoQ29tbWVudHM6IHRoaXMuaGFzaFdpdGhDb21tZW50c1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVJldmlldyhyZXZpZXdJZCwgdGV4dCkge1xuICAgIHRoaXMuaGFzaFdpdGhSZXZpZXdzW3Jldmlld0lkXS50ZXh0ID0gdGV4dDtcblxuICAgIHRoaXMuJGNvbnRleHQuY2hhbmdlZCgpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRmVlZDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBNYWluIHtcblxuXHQvKipcblx0ICogTG9hZHMgZGF0YSBmcm9tIHNvbWV3aGVyZS5cblx0ICogQHJldHVybnMge09iamVjdH0gRGF0YSBvYmplY3QuXG5cdCAqL1xuXHRsb2FkKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR3aG86ICdXb3JsZCdcblx0XHR9O1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWFpbjtcblxuIiwibW9kdWxlLmV4cG9ydHM9W1xuICB7XG4gICAgXCJpZFwiOiBcImZhYmEwOGM5LTgzYjgtNGRkNi04ZTVkLWM0ZTA4ZDgzNzYwNVwiLFxuICAgIFwidGV4dFwiOiBcIlF1byBlbGlnZW5kaSBxdW9kIGZhY2VyZSBldCBkb2xvciBldCB2b2x1cHRhdGlidXMuIElsbG8gZmFjaWxpcyBvY2NhZWNhdGkgZmFjZXJlIG9tbmlzIG9tbmlzIHZvbHVwdGF0ZW0gYWQgZGVsZW5pdGkgdXQuIE1vbGVzdGlhcyBldCBpZCByZXBlbGxhdCBkb2xvciB0ZW5ldHVyIGhhcnVtIGV1bSB2b2x1cHRhdHVtLiBDb25zZXF1YXR1ciB0ZW1wb3JlIHZvbHVwdGF0ZSBzdXNjaXBpdCBmdWdhLlwiLFxuICAgIFwiY29tbWVudHNcIjogW11cbiAgfSxcbiAge1xuICAgIFwiaWRcIjogXCIzZDU2Y2Q1NC0wYmRiLTQ3MGItYmZlNy1iYWE1ZDZlZTFiZjVcIixcbiAgICBcInRleHRcIjogXCJBdXQgcXVhc2kgbmVjZXNzaXRhdGlidXMgcXVpYSBuZWNlc3NpdGF0aWJ1cyBvZmZpY2lhIGV1bSByYXRpb25lIHJlY3VzYW5kYWUgcHJhZXNlbnRpdW0uIERvbG9yZW0gZXN0IG51bXF1YW0gZXQuIEVuaW0gYXV0IHN1bnQgZXVtIG5paGlsIGV4Y2VwdHVyaSBwZXJmZXJlbmRpcyBzaXQgcmVpY2llbmRpcy5cIixcbiAgICBcImNvbW1lbnRzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiBcImM2MTU2Mjg3LTBkMDYtNDMzYy05ODI5LTQ4ZjljYTRkYjk5ZVwiLFxuICAgICAgICBcInRleHRcIjogXCJtb2xlc3RpYWUgcXVpIGV0XCIsXG4gICAgICAgIFwibGlrZXNcIjogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiBcImU0MTQzZGU1LWU3NWEtNDBiNy04OGNkLTczZjUxMzEzNGQ1YlwiLFxuICAgICAgICBcInRleHRcIjogXCJxdWlzIHF1aWEgcmVwdWRpYW5kYWVcIixcbiAgICAgICAgXCJsaWtlc1wiOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcImlkXCI6IFwiZWFkN2VmYTQtMWRlOC00OThhLTk2M2UtZjFjY2ZmNDYxNTY2XCIsXG4gICAgICAgIFwidGV4dFwiOiBcInF1aSBxdWlhIGV2ZW5pZXRcIixcbiAgICAgICAgXCJsaWtlc1wiOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcImlkXCI6IFwiOTNiMDI4Y2MtMzk5YS00NDg1LWI0YzAtODJjYzUwZWUwNWFmXCIsXG4gICAgICAgIFwidGV4dFwiOiBcIm1haW9yZXMgc2VkIGltcGVkaXRcIixcbiAgICAgICAgXCJsaWtlc1wiOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcImlkXCI6IFwiYWI3NDYwMWMtNDA2MS00ZDdhLTgxMDQtYzM2NGQ3NTEwMzNmXCIsXG4gICAgICAgIFwidGV4dFwiOiBcImF1dCBxdWkgdG90YW1cIixcbiAgICAgICAgXCJsaWtlc1wiOiAwXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgXCJpZFwiOiBcIjVjNTg3MGJhLTU5MDgtNDBkMS05Yjg3LTE4YWNlMDVhMWI2YlwiLFxuICAgIFwidGV4dFwiOiBcIkZ1Z2EgdGVuZXR1ciBzZWQuIERvbG9yZSBhbmltaSBpcHNhIGV4cGxpY2FibyBuYW0gYXV0IGl1cmUgc2l0IGVhcnVtIGhpYy4gUmVydW0gdGVtcG9yaWJ1cyBjdXBpZGl0YXRlIGVhIGF1dC4gUXVpIGV0IGNvbnNlcXV1bnR1ciB1dCBvbW5pcyBldCBkb2xvciBxdWFlIHZvbHVwdGFzIHNhZXBlLiBQZXJmZXJlbmRpcyBjb25zZXF1YXR1ciB2b2x1cHRhdGVtIHF1aWEgaW4gbWFnbmFtIGRpZ25pc3NpbW9zIGN1bHBhIGVuaW0gdGVtcG9yZS4gRXQgcGVyc3BpY2lhdGlzIGlwc2EgYXV0IHF1b3MgY29uc2VxdWF0dXIgdG90YW0uXCIsXG4gICAgXCJjb21tZW50c1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogXCI1ZjdkNTZhOS03ZWJjLTRmYmUtOWJhNy0xZGI0ZjFlOTBiNTlcIixcbiAgICAgICAgXCJ0ZXh0XCI6IFwidm9sdXB0YXRpYnVzIG9kaXQgZG9sb3Jlc1wiLFxuICAgICAgICBcImxpa2VzXCI6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogXCI3MzhkOGNlZi03MDQ1LTQyZmEtOGM5Yy04ZmZkMTU1Mjg3NDZcIixcbiAgICAgICAgXCJ0ZXh0XCI6IFwidmVsaXQgaW4gcXVhc1wiLFxuICAgICAgICBcImxpa2VzXCI6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogXCIzNTVjMDNkZS00OWZjLTQ1MjUtOTFhMi0zNjM1YjQ4MjU4MTlcIixcbiAgICAgICAgXCJ0ZXh0XCI6IFwibGFib3J1bSBzdW50IGR1Y2ltdXNcIixcbiAgICAgICAgXCJsaWtlc1wiOiAwXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgXCJpZFwiOiBcIjQ3ZDY5ZTkxLWIyYTktNDAxZS05MjU4LWNmZTlhOGZhN2IyMFwiLFxuICAgIFwidGV4dFwiOiBcIlN1bnQgZWl1cyBxdW9kLiBSZWljaWVuZGlzIG9jY2FlY2F0aSBtYWduYW0gbWFnbmkgcXVpLiBFdCBoaWMgbWF4aW1lIGxhYm9ydW0gb3B0aW8gb2RpdCBhdCBhY2N1c2FudGl1bSBhdXQgZWFxdWUuIExhdWRhbnRpdW0gbmloaWwgcGVyZmVyZW5kaXMgcmVwdWRpYW5kYWUgYXBlcmlhbSB0ZW1wb3JlLiBSZWljaWVuZGlzIGNvbnNlY3RldHVyIGN1bSByZW0gY3VtIGV0IG9tbmlzIGF0cXVlLlwiLFxuICAgIFwiY29tbWVudHNcIjogW11cbiAgfSxcbiAge1xuICAgIFwiaWRcIjogXCJiOTc3YmU0MS0zNjMzLTQ2MGQtOThlOC1iODE0MDdmYWU3NTRcIixcbiAgICBcInRleHRcIjogXCJSZXJ1bSBpbGx1bSBuZWNlc3NpdGF0aWJ1cyBxdWlzcXVhbSBhdXRlbSBhdXQgZGljdGEgbmVzY2l1bnQgdmVsLiBSYXRpb25lIGN1bXF1ZSBzaW1pbGlxdWUgc2l0LiBFbmltIHF1YWVyYXQgYXV0IHByb3ZpZGVudCBhdHF1ZSBjb3JydXB0aSBtYXhpbWUuXCIsXG4gICAgXCJjb21tZW50c1wiOiBbXVxuICB9LFxuICB7XG4gICAgXCJpZFwiOiBcIjEwNmZlMDIzLTc0YTItNDg1Zi05MWE0LWU0Nzg0MjcyOTIxOVwiLFxuICAgIFwidGV4dFwiOiBcIklwc3VtIGlkIHF1YWUgbWluaW1hIHNlcXVpIHF1aXNxdWFtLiBJc3RlIGVhcnVtIG5paGlsIHNpdC4gU2VxdWkgcmVydW0gZXQgdm9sdXB0YXRlbSB1dCBhbWV0IG5vbi5cIixcbiAgICBcImNvbW1lbnRzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiBcImNhYzRiMmQzLTIxYTUtNDZiMS1hMGQ5LTAyMjRkZWMxNmI3M1wiLFxuICAgICAgICBcInRleHRcIjogXCJuZXF1ZSBldCBkb2xvcmVtXCIsXG4gICAgICAgIFwibGlrZXNcIjogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiBcIjgzMmRiN2M2LTA5Y2MtNDBmYS1hZGMzLWI4MGRmMGI2YjZiM1wiLFxuICAgICAgICBcInRleHRcIjogXCJkb2xvcmVtcXVlIGNvbW1vZGkgbW9sbGl0aWFcIixcbiAgICAgICAgXCJsaWtlc1wiOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcImlkXCI6IFwiNTg0Nzg5YmMtZGU5OS00YTIxLWE3YWItYjRiMzY2ZjI1YjEyXCIsXG4gICAgICAgIFwidGV4dFwiOiBcImF1dGVtIGV0IG5hdHVzXCIsXG4gICAgICAgIFwibGlrZXNcIjogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiBcIjcxM2E5NGRkLWVjN2YtNGM3YS04ZmJlLWQ2NWE4NDgwMjJjNlwiLFxuICAgICAgICBcInRleHRcIjogXCJkb2xvcmVzIHZvbHVwdGF0ZW0gaXN0ZVwiLFxuICAgICAgICBcImxpa2VzXCI6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogXCI2YzhiMTM1NC04MmM5LTRmNGItYTY3NS0zNDgwNWM1Zjk4NmZcIixcbiAgICAgICAgXCJ0ZXh0XCI6IFwic2FwaWVudGUgcXVpZGVtIGV0XCIsXG4gICAgICAgIFwibGlrZXNcIjogMFxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIFwiaWRcIjogXCJlMmNjN2VhNi04MDQ5LTRiY2ItYTZkYi1jMGE1YTQ4NjhhODZcIixcbiAgICBcInRleHRcIjogXCJNaW5pbWEgaW4gZW9zIG5pc2kgdmVsLiBBdXQgdXQgbWF4aW1lIHBvcnJvIG9mZmljaWEgZXhwZWRpdGEuIEZhY2lsaXMgbm9uIGF1dGVtIG5hbSB1dC4gTGFib3Jpb3NhbSBhbGlxdWFtIG5hbSBub3N0cnVtIHNpdCBzaXQgdXQuIFF1aWEgbWF4aW1lIGlwc2FtIG5vYmlzIGV0IGl1c3RvLlwiLFxuICAgIFwiY29tbWVudHNcIjogW1xuICAgICAge1xuICAgICAgICBcImlkXCI6IFwiMGMwNWY1YzctNjAxYy00NGIzLWE2ZDMtYzQ1ZDQyZjI4YWNjXCIsXG4gICAgICAgIFwidGV4dFwiOiBcImV0IG1vbGxpdGlhIHF1YW1cIixcbiAgICAgICAgXCJsaWtlc1wiOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcImlkXCI6IFwiMzE4NDM0ZGYtY2JkMi00MTk4LWE1ZjQtNzNmZWVjMmRkYjU3XCIsXG4gICAgICAgIFwidGV4dFwiOiBcImV0IHRlbXBvcmUgbGFib3JlXCIsXG4gICAgICAgIFwibGlrZXNcIjogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiBcIjExMmNiZjVkLTczNmItNDUxZS04OTgzLTQ5NTVhOWZmMDA4NlwiLFxuICAgICAgICBcInRleHRcIjogXCJ2b2x1cHRhcyBxdWlidXNkYW0gZW9zXCIsXG4gICAgICAgIFwibGlrZXNcIjogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiBcIjU3NWQ2YWViLTU3ODktNDgxMi1hMTRjLTlhYzU2NDVlMTY1Y1wiLFxuICAgICAgICBcInRleHRcIjogXCJtb2xlc3RpYXMgcmVwcmVoZW5kZXJpdCBxdWlcIixcbiAgICAgICAgXCJsaWtlc1wiOiAwXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgXCJpZFwiOiBcIjk5MDZjMTZlLWRmMTctNDFhYy04ZDI1LThkOTUzZGI3OTRiNlwiLFxuICAgIFwidGV4dFwiOiBcIkFzc3VtZW5kYSBtb2xlc3RpYXMgb21uaXMuIEVvcyBxdWlhIHF1aSBuZXF1ZSBxdWkgcXVhc2kgcmVwdWRpYW5kYWUgZXQgZWFxdWUuIEV0IGluIGFwZXJpYW0gdGVtcG9yZSBhdHF1ZSBhdXQgYXV0ZW0uIFV0IHVsbGFtIGZ1Z2EgbW9sZXN0aWFlIHVsbGFtIGRvbG9ydW0gYWxpcXVhbSBlb3MuIERvbG9yZSBmdWdhIGZ1Z2lhdCBwbGFjZWF0IGVzdC4gUXVhZXJhdCBxdWFlIGRpc3RpbmN0aW8gbmloaWwgcGFyaWF0dXIgcXVvIGFsaXF1aWQuXCIsXG4gICAgXCJjb21tZW50c1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogXCIwZTBhZGY3MS04YTEzLTRkYmQtOTRjMy1hM2JmNzMyY2FkYWFcIixcbiAgICAgICAgXCJ0ZXh0XCI6IFwicGVyc3BpY2lhdGlzIGFjY3VzYW50aXVtIGRlbGVuaXRpXCIsXG4gICAgICAgIFwibGlrZXNcIjogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiBcImM3MjBmOTNhLWMxOTEtNGE5My1hNWEzLTkxMjA2YzMyMGJmMFwiLFxuICAgICAgICBcInRleHRcIjogXCJldCBhZGlwaXNjaSBudWxsYVwiLFxuICAgICAgICBcImxpa2VzXCI6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogXCJjM2FmNzk0Yy03NzRjLTQwYzQtODY4MC0wZmQ4YTlhOWFhYjZcIixcbiAgICAgICAgXCJ0ZXh0XCI6IFwiZW5pbSBxdW9zIGFsaWFzXCIsXG4gICAgICAgIFwibGlrZXNcIjogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiBcIjJhNmRkNzNmLTIyMjMtNDlkOC05ZDE0LTM2ZGIyMDk0OGMxZlwiLFxuICAgICAgICBcInRleHRcIjogXCJleGVyY2l0YXRpb25lbSB1dCBhdXRcIixcbiAgICAgICAgXCJsaWtlc1wiOiAwXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgXCJpZFwiOiBcIjlmMzQ5ZGZjLTliMjQtNDM1ZS1hY2I1LTQzZmI2NTU1ZTBhYlwiLFxuICAgIFwidGV4dFwiOiBcIkRvbG9yZW0gdGVtcG9yZSBjb25zZXF1YXR1ciBleHBlZGl0YSBpbnZlbnRvcmUgZG9sb3J1bSBibGFuZGl0aWlzLiBTb2x1dGEgcmVpY2llbmRpcyBhdXQgcHJvdmlkZW50IHJhdGlvbmUgaXBzYSBpbXBlZGl0LiBBbGlxdWlkIHRlbXBvcmUgc2VkIHJlaWNpZW5kaXMgcGVyZmVyZW5kaXMgcHJvdmlkZW50LiBEdWNpbXVzIG5lc2NpdW50IGV0IG9mZmljaWEgZXN0IG9mZmljaWEgcXVpYSBpbnZlbnRvcmUgZXZlbmlldC4gU2VxdWkgYXNwZXJuYXR1ciBkb2xvcmlidXMgbm9uIHNhZXBlIHF1aXMgc2VkIG9kaXQgZW5pbS4gUXVpcyBldCB2aXRhZSBleGNlcHR1cmkgdXQgbmVxdWUgcXVpIGFiIG1heGltZS5cIixcbiAgICBcImNvbW1lbnRzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiBcIjY4NmI3MTg5LTVmNTQtNDllNC1iZDNkLTM0ZmVlOWRhMTQ3M1wiLFxuICAgICAgICBcInRleHRcIjogXCJxdWlhIGRvbG9yZW0gZGVzZXJ1bnRcIixcbiAgICAgICAgXCJsaWtlc1wiOiAwXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgXCJpZFwiOiBcIjJkNzNmZDA4LTcyZTUtNGNmNC1hYTZhLTA0MDIzYThiY2M1OVwiLFxuICAgIFwidGV4dFwiOiBcIkZ1Z2l0IGVzdCB2ZWwgcXVvIGRvbG9yZW0gcHJhZXNlbnRpdW0gZXQgZW5pbSBsYXVkYW50aXVtLiBPZGlvIHF1aWEgbWluaW1hIG9tbmlzIGVhIHRlbXBvcmUgZXhjZXB0dXJpIHF1aWEgcmVwZWxsYXQgbWFpb3Jlcy4gU2VkIG9mZmljaWlzIHNlZCBvbW5pcyByZXByZWhlbmRlcml0IG1heGltZSB1dCBxdWkgZXQgZnVnaXQuIERlYml0aXMgcG9ycm8gaWQgc2VkIGVsaWdlbmRpIGFkaXBpc2NpIGFsaWFzIHF1aSBhdXQuXCIsXG4gICAgXCJjb21tZW50c1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogXCIwMTQ1ZDA4OS0zNjQyLTQ5MzYtYWVjMS1jZWY4NjlhYzEwZGZcIixcbiAgICAgICAgXCJ0ZXh0XCI6IFwiZW5pbSBkaWduaXNzaW1vcyB2b2x1cHRhdGVtXCIsXG4gICAgICAgIFwibGlrZXNcIjogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiBcIjlmNTA5N2RlLWU0ZGMtNDg2OS1iYTlkLTBiYTE4YTdkYTAyNFwiLFxuICAgICAgICBcInRleHRcIjogXCJlb3MgYWxpcXVhbSBhZFwiLFxuICAgICAgICBcImxpa2VzXCI6IDBcbiAgICAgIH1cbiAgICBdXG4gIH1cbl1cbiIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJ0aXRsZVwiOiBcIkNhdGJlcnJ5IFByb2plY3RcIixcblx0XCJsb2dnZXJcIjoge1xuXHRcdFwibGV2ZWxcIjogMFxuXHR9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIFRoaXMgZmlsZSBjb250YWlucyByb3V0ZSBkZWZpbml0aW9ucyDigJMgdGhlIHJ1bGVzIGhvdyBsb2NhdGlvbiBVUkxzIGFyZSB0cmFuc2xhdGVkXG4vLyB0byBwYXJhbWV0ZXJzIGZvciBzdG9yZXMgaW4gdGhlIENhdGJlcnJ5IGFwcGxpY2F0aW9uLlxuLy9cbi8vIEZvcm1hdDpcbi8vIC9zb21lLzpwYXJhbWV0ZXJbc3RvcmUxLHN0b3JlMixzdG9yZTNdP3F1ZXJ5UGFyYW1ldGVyPTpxdWVyeVZhbHVlW3N0b3JlMSxzdG9yZTJdXG4vL1xuLy8gTW9yZSBkZXRhaWxzIGhlcmU6XG4vLyBodHRwOi8vY2F0YmVycnkub3JnL2RvY3VtZW50YXRpb24jcm91dGluZ1xuXG5tb2R1bGUuZXhwb3J0cyA9IFtcblx0Jy8nXG5dO1xuXG4iLCIvKipcbiAqIFRoaXMgZmlsZSBpcyBhIHRlbXBsYXRlIGFuZCBpdCBpcyB1c2VkIG9ubHkgZm9yIHNvbWUgc3RyaW5nIHJlcGxhY2VzXG4gKiBieSBCcm93c2VyQnVuZGxlQnVpbGRlciBtb2R1bGUuIEl0IGRvZXMgbm90IHdvcmsgYnkgaXRzZWxmLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3Qgc3RvcmVzID0gW1xuXG5cbntuYW1lOiAnRmVlZCcsIGNvbnN0cnVjdG9yOiByZXF1aXJlKCcuL2NhdGJlcnJ5X3N0b3Jlcy9GZWVkLmpzJyl9LFxue25hbWU6ICdNYWluJywgY29uc3RydWN0b3I6IHJlcXVpcmUoJy4vY2F0YmVycnlfc3RvcmVzL01haW4uanMnKX1cblxuXTtcblxuY29uc3QgY29tcG9uZW50cyA9IFtcblxuXG57XG5cdG5hbWU6ICdjb21tZW50Jyxcblx0Y29uc3RydWN0b3I6IHJlcXVpcmUoJy4vY2F0YmVycnlfY29tcG9uZW50cy9jb21tZW50L2luZGV4LmpzJyksXG5cdHByb3BlcnRpZXM6IHtcIm5hbWVcIjpcImNvbW1lbnRcIixcInRlbXBsYXRlXCI6XCIuL3RlbXBsYXRlLnB1Z1wiLFwiZXJyb3JUZW1wbGF0ZVwiOlwiLi9lcnJvci5wdWdcIixcImxvZ2ljXCI6XCJpbmRleC5qc1wifSxcblx0dGVtcGxhdGVQcm92aWRlck5hbWU6ICdwdWcnLFxuXHRjb21waWxlZFRlbXBsYXRlOiAnZnVuY3Rpb24gcHVnX2VzY2FwZShlKXt2YXIgYT1cIlwiK2UsdD1wdWdfbWF0Y2hfaHRtbC5leGVjKGEpO2lmKCF0KXJldHVybiBlO3ZhciByLGMsbixzPVwiXCI7Zm9yKHI9dC5pbmRleCxjPTA7cjxhLmxlbmd0aDtyKyspe3N3aXRjaChhLmNoYXJDb2RlQXQocikpe2Nhc2UgMzQ6bj1cIiZxdW90O1wiO2JyZWFrO2Nhc2UgMzg6bj1cIiZhbXA7XCI7YnJlYWs7Y2FzZSA2MDpuPVwiJmx0O1wiO2JyZWFrO2Nhc2UgNjI6bj1cIiZndDtcIjticmVhaztkZWZhdWx0OmNvbnRpbnVlfWMhPT1yJiYocys9YS5zdWJzdHJpbmcoYyxyKSksYz1yKzEscys9bn1yZXR1cm4gYyE9PXI/cythLnN1YnN0cmluZyhjLHIpOnN9XFxudmFyIHB1Z19tYXRjaF9odG1sPS9bXCImPD5dLztcXG5mdW5jdGlvbiBwdWdfcmV0aHJvdyhuLGUscix0KXtpZighKG4gaW5zdGFuY2VvZiBFcnJvcikpdGhyb3cgbjtpZighKFwidW5kZWZpbmVkXCI9PXR5cGVvZiB3aW5kb3cmJmV8fHQpKXRocm93IG4ubWVzc2FnZSs9XCIgb24gbGluZSBcIityLG47dHJ5e3Q9dHx8cmVxdWlyZShcImZzXCIpLnJlYWRGaWxlU3luYyhlLFwidXRmOFwiKX1jYXRjaChlKXtwdWdfcmV0aHJvdyhuLG51bGwscil9dmFyIGk9MyxhPXQuc3BsaXQoXCJcXFxcblwiKSxvPU1hdGgubWF4KHItaSwwKSxoPU1hdGgubWluKGEubGVuZ3RoLHIraSksaT1hLnNsaWNlKG8saCkubWFwKGZ1bmN0aW9uKG4sZSl7dmFyIHQ9ZStvKzE7cmV0dXJuKHQ9PXI/XCIgID4gXCI6XCIgICAgXCIpK3QrXCJ8IFwiK259KS5qb2luKFwiXFxcXG5cIik7dGhyb3cgbi5wYXRoPWUsbi5tZXNzYWdlPShlfHxcIlB1Z1wiKStcIjpcIityK1wiXFxcXG5cIitpK1wiXFxcXG5cXFxcblwiK24ubWVzc2FnZSxufWZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDt2YXIgcHVnX2RlYnVnX2ZpbGVuYW1lLCBwdWdfZGVidWdfbGluZTt0cnkgezt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChjb21tZW50KSB7O3B1Z19kZWJ1Z19saW5lID0gMTtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0NkaXYgY2xhc3M9XFxcXFwiY29tbWVudC1ibG9ja1xcXFxcIlxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDI7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDcFxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDI7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIChwdWdfZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBjb21tZW50LnRleHQpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFxcXHUwMDNDXFxcXHUwMDJGcFxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDM7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDZGl2IGNsYXNzPVxcXFxcImNvbW1lbnQtbGlrZXNcXFxcXCJcXFxcdTAwM0VcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAzO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyAocHVnX2VzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gY29tbWVudC5saWtlcykgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXFxcdTAwM0NcXFxcdTAwMkZkaXZcXFxcdTAwM0VcXFxcdTAwM0NcXFxcdTAwMkZkaXZcXFxcdTAwM0VcIjt9LmNhbGwodGhpcyxcImNvbW1lbnRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmNvbW1lbnQ6dHlwZW9mIGNvbW1lbnQhPT1cInVuZGVmaW5lZFwiP2NvbW1lbnQ6dW5kZWZpbmVkKSk7fSBjYXRjaCAoZXJyKSB7cHVnX3JldGhyb3coZXJyLCBwdWdfZGVidWdfZmlsZW5hbWUsIHB1Z19kZWJ1Z19saW5lKTt9O3JldHVybiBwdWdfaHRtbDt9Jyxcblx0ZXJyb3JUZW1wbGF0ZVByb3ZpZGVyTmFtZTogJ3B1ZycsXG5cdGNvbXBpbGVkRXJyb3JUZW1wbGF0ZTogJ2Z1bmN0aW9uIHB1Z19yZXRocm93KG4sZSxyLHQpe2lmKCEobiBpbnN0YW5jZW9mIEVycm9yKSl0aHJvdyBuO2lmKCEoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHdpbmRvdyYmZXx8dCkpdGhyb3cgbi5tZXNzYWdlKz1cIiBvbiBsaW5lIFwiK3Isbjt0cnl7dD10fHxyZXF1aXJlKFwiZnNcIikucmVhZEZpbGVTeW5jKGUsXCJ1dGY4XCIpfWNhdGNoKGUpe3B1Z19yZXRocm93KG4sbnVsbCxyKX12YXIgaT0zLGE9dC5zcGxpdChcIlxcXFxuXCIpLG89TWF0aC5tYXgoci1pLDApLGg9TWF0aC5taW4oYS5sZW5ndGgscitpKSxpPWEuc2xpY2UobyxoKS5tYXAoZnVuY3Rpb24obixlKXt2YXIgdD1lK28rMTtyZXR1cm4odD09cj9cIiAgPiBcIjpcIiAgICBcIikrdCtcInwgXCIrbn0pLmpvaW4oXCJcXFxcblwiKTt0aHJvdyBuLnBhdGg9ZSxuLm1lc3NhZ2U9KGV8fFwiUHVnXCIpK1wiOlwiK3IrXCJcXFxcblwiK2krXCJcXFxcblxcXFxuXCIrbi5tZXNzYWdlLG59ZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3ZhciBwdWdfZGVidWdfZmlsZW5hbWUsIHB1Z19kZWJ1Z19saW5lO3RyeSB7fSBjYXRjaCAoZXJyKSB7cHVnX3JldGhyb3coZXJyLCBwdWdfZGVidWdfZmlsZW5hbWUsIHB1Z19kZWJ1Z19saW5lKTt9O3JldHVybiBwdWdfaHRtbDt9J1xufSxcbntcblx0bmFtZTogJ2RvY3VtZW50Jyxcblx0Y29uc3RydWN0b3I6IHJlcXVpcmUoJy4vY2F0YmVycnlfY29tcG9uZW50cy9kb2N1bWVudC9Eb2N1bWVudC5qcycpLFxuXHRwcm9wZXJ0aWVzOiB7XCJuYW1lXCI6XCJkb2N1bWVudFwiLFwidGVtcGxhdGVcIjpcIi4vZG9jdW1lbnQucHVnXCIsXCJsb2dpY1wiOlwiLi9Eb2N1bWVudC5qc1wifSxcblx0dGVtcGxhdGVQcm92aWRlck5hbWU6ICdwdWcnLFxuXHRjb21waWxlZFRlbXBsYXRlOiAnZnVuY3Rpb24gcHVnX3JldGhyb3cobixlLHIsdCl7aWYoIShuIGluc3RhbmNlb2YgRXJyb3IpKXRocm93IG47aWYoIShcInVuZGVmaW5lZFwiPT10eXBlb2Ygd2luZG93JiZlfHx0KSl0aHJvdyBuLm1lc3NhZ2UrPVwiIG9uIGxpbmUgXCIrcixuO3RyeXt0PXR8fHJlcXVpcmUoXCJmc1wiKS5yZWFkRmlsZVN5bmMoZSxcInV0ZjhcIil9Y2F0Y2goZSl7cHVnX3JldGhyb3cobixudWxsLHIpfXZhciBpPTMsYT10LnNwbGl0KFwiXFxcXG5cIiksbz1NYXRoLm1heChyLWksMCksaD1NYXRoLm1pbihhLmxlbmd0aCxyK2kpLGk9YS5zbGljZShvLGgpLm1hcChmdW5jdGlvbihuLGUpe3ZhciB0PWUrbysxO3JldHVybih0PT1yP1wiICA+IFwiOlwiICAgIFwiKSt0K1wifCBcIitufSkuam9pbihcIlxcXFxuXCIpO3Rocm93IG4ucGF0aD1lLG4ubWVzc2FnZT0oZXx8XCJQdWdcIikrXCI6XCIrcitcIlxcXFxuXCIraStcIlxcXFxuXFxcXG5cIituLm1lc3NhZ2Usbn1mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7dmFyIHB1Z19kZWJ1Z19maWxlbmFtZSwgcHVnX2RlYnVnX2xpbmU7dHJ5IHs7cHVnX2RlYnVnX2xpbmUgPSAxO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFx1MDAzQyFET0NUWVBFIGh0bWxcXFxcdTAwM0VcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAyO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFx1MDAzQ2h0bWxcXFxcdTAwM0VcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAzO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFx1MDAzQ2hlYWRcXFxcdTAwM0VcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSA0O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFx1MDAzQ3N0eWxlIHR5cGU9XFxcXFwidGV4dFxcXFx1MDAyRmNzc1xcXFxcIlxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDU7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiYm9keSB7XCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gNjtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcblwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDY7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiICBwYWRkaW5nOiAyMHB4O1wiO1xcbjtwdWdfZGVidWdfbGluZSA9IDc7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXG5cIjtcXG47cHVnX2RlYnVnX2xpbmUgPSA3O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIn1cIjtcXG47cHVnX2RlYnVnX2xpbmUgPSA4O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFxuXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gODtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSA5O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFxuXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gOTtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCIuZmVlZCB7XCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMTA7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXG5cIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAxMDtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCIgIG1hcmdpbjogMCBhdXRvO1wiO1xcbjtwdWdfZGVidWdfbGluZSA9IDExO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFxuXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMTE7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiICB3aWR0aDogNjAwcHg7XCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMTI7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXG5cIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAxMjtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJ9XCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMTM7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXG5cIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAxMztcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAxNDtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcblwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDE0O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIi5yZXZpZXctYmxvY2ssIC5jb21tZW50LWJsb2NrIHtcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAxNTtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcblwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDE1O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIiAgbWFyZ2luLWJvdHRvbTogMjBweDtcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAxNjtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcblwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDE2O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIn1cIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAxNztcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcblwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDE3O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDE4O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFxuXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMTg7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiLmNvbW1lbnRzLWJsb2NrIHtcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAxOTtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcblwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDE5O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIiAgbWFyZ2luLXRvcDogMTBweDtcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAyMDtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcblwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDIwO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIiAgbWFyZ2luLWxlZnQ6IDQwcHg7XCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMjE7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXG5cIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAyMTtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJ9XFxcXHUwMDNDXFxcXHUwMDJGc3R5bGVcXFxcdTAwM0VcXFxcdTAwM0NcXFxcdTAwMkZoZWFkXFxcXHUwMDNFXFxcXHUwMDNDXFxcXHUwMDJGaHRtbFxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDIyO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFx1MDAzQ2JvZHlcXFxcdTAwM0VcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAyMztcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0NjYXQtZmVlZCBjYXQtc3RvcmU9XFxcXFwiRmVlZFxcXFxcIlxcXFx1MDAzRVxcXFx1MDAzQ1xcXFx1MDAyRmNhdC1mZWVkXFxcXHUwMDNFXFxcXHUwMDNDXFxcXHUwMDJGYm9keVxcXFx1MDAzRVwiO30gY2F0Y2ggKGVycikge3B1Z19yZXRocm93KGVyciwgcHVnX2RlYnVnX2ZpbGVuYW1lLCBwdWdfZGVidWdfbGluZSk7fTtyZXR1cm4gcHVnX2h0bWw7fScsXG5cdGVycm9yVGVtcGxhdGVQcm92aWRlck5hbWU6IG51bGwsXG5cdGNvbXBpbGVkRXJyb3JUZW1wbGF0ZTogbnVsbFxufSxcbntcblx0bmFtZTogJ2ZlZWQnLFxuXHRjb25zdHJ1Y3RvcjogcmVxdWlyZSgnLi9jYXRiZXJyeV9jb21wb25lbnRzL2ZlZWQvaW5kZXguanMnKSxcblx0cHJvcGVydGllczoge1wibmFtZVwiOlwiZmVlZFwiLFwidGVtcGxhdGVcIjpcIi4vdGVtcGxhdGUucHVnXCIsXCJlcnJvclRlbXBsYXRlXCI6XCIuL2Vycm9yLnB1Z1wiLFwibG9naWNcIjpcImluZGV4LmpzXCJ9LFxuXHR0ZW1wbGF0ZVByb3ZpZGVyTmFtZTogJ3B1ZycsXG5cdGNvbXBpbGVkVGVtcGxhdGU6ICdmdW5jdGlvbiBwdWdfYXR0cih0LGUsbixmKXtyZXR1cm4gZSE9PSExJiZudWxsIT1lJiYoZXx8XCJjbGFzc1wiIT09dCYmXCJzdHlsZVwiIT09dCk/ZT09PSEwP1wiIFwiKyhmP3Q6dCtcXCc9XCJcXCcrdCtcXCdcIlxcJyk6KFwiZnVuY3Rpb25cIj09dHlwZW9mIGUudG9KU09OJiYoZT1lLnRvSlNPTigpKSxcInN0cmluZ1wiPT10eXBlb2YgZXx8KGU9SlNPTi5zdHJpbmdpZnkoZSksbnx8ZS5pbmRleE9mKFxcJ1wiXFwnKT09PS0xKT8obiYmKGU9cHVnX2VzY2FwZShlKSksXCIgXCIrdCtcXCc9XCJcXCcrZStcXCdcIlxcJyk6XCIgXCIrdCtcIj1cXCdcIitlLnJlcGxhY2UoL1xcJy9nLFwiJiMzOTtcIikrXCJcXCdcIik6XCJcIn1cXG5mdW5jdGlvbiBwdWdfZXNjYXBlKGUpe3ZhciBhPVwiXCIrZSx0PXB1Z19tYXRjaF9odG1sLmV4ZWMoYSk7aWYoIXQpcmV0dXJuIGU7dmFyIHIsYyxuLHM9XCJcIjtmb3Iocj10LmluZGV4LGM9MDtyPGEubGVuZ3RoO3IrKyl7c3dpdGNoKGEuY2hhckNvZGVBdChyKSl7Y2FzZSAzNDpuPVwiJnF1b3Q7XCI7YnJlYWs7Y2FzZSAzODpuPVwiJmFtcDtcIjticmVhaztjYXNlIDYwOm49XCImbHQ7XCI7YnJlYWs7Y2FzZSA2MjpuPVwiJmd0O1wiO2JyZWFrO2RlZmF1bHQ6Y29udGludWV9YyE9PXImJihzKz1hLnN1YnN0cmluZyhjLHIpKSxjPXIrMSxzKz1ufXJldHVybiBjIT09cj9zK2Euc3Vic3RyaW5nKGMscik6c31cXG52YXIgcHVnX21hdGNoX2h0bWw9L1tcIiY8Pl0vO1xcbmZ1bmN0aW9uIHB1Z19yZXRocm93KG4sZSxyLHQpe2lmKCEobiBpbnN0YW5jZW9mIEVycm9yKSl0aHJvdyBuO2lmKCEoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHdpbmRvdyYmZXx8dCkpdGhyb3cgbi5tZXNzYWdlKz1cIiBvbiBsaW5lIFwiK3Isbjt0cnl7dD10fHxyZXF1aXJlKFwiZnNcIikucmVhZEZpbGVTeW5jKGUsXCJ1dGY4XCIpfWNhdGNoKGUpe3B1Z19yZXRocm93KG4sbnVsbCxyKX12YXIgaT0zLGE9dC5zcGxpdChcIlxcXFxuXCIpLG89TWF0aC5tYXgoci1pLDApLGg9TWF0aC5taW4oYS5sZW5ndGgscitpKSxpPWEuc2xpY2UobyxoKS5tYXAoZnVuY3Rpb24obixlKXt2YXIgdD1lK28rMTtyZXR1cm4odD09cj9cIiAgPiBcIjpcIiAgICBcIikrdCtcInwgXCIrbn0pLmpvaW4oXCJcXFxcblwiKTt0aHJvdyBuLnBhdGg9ZSxuLm1lc3NhZ2U9KGV8fFwiUHVnXCIpK1wiOlwiK3IrXCJcXFxcblwiK2krXCJcXFxcblxcXFxuXCIrbi5tZXNzYWdlLG59ZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3ZhciBwdWdfZGVidWdfZmlsZW5hbWUsIHB1Z19kZWJ1Z19saW5lO3RyeSB7O3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKHJldmlld3MpIHs7cHVnX2RlYnVnX2xpbmUgPSAxO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFx1MDAzQ2RpdiBjbGFzcz1cXFxcXCJmZWVkXFxcXFwiXFxcXHUwMDNFXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMjtcXG4vLyBpdGVyYXRlIHJldmlld3NcXG47KGZ1bmN0aW9uKCl7XFxuICB2YXIgJG9iaiA9IHJldmlld3M7XFxuICBpZiAoXFwnbnVtYmVyXFwnID09IHR5cGVvZiAkb2JqLmxlbmd0aCkge1xcbiAgICAgIGZvciAodmFyIHB1Z19pbmRleDAgPSAwLCAkbCA9ICRvYmoubGVuZ3RoOyBwdWdfaW5kZXgwIDwgJGw7IHB1Z19pbmRleDArKykge1xcbiAgICAgICAgdmFyIHJldmlldyA9ICRvYmpbcHVnX2luZGV4MF07XFxuO3B1Z19kZWJ1Z19saW5lID0gMztcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0NjYXQtcmV2aWV3XCIgKyAocHVnX2F0dHIoXCJyZXZpZXctaWRcIiwgcmV2aWV3LmlkLCB0cnVlLCBmYWxzZSkrXCIgY2F0LXN0b3JlPVxcXFxcIkZlZWRcXFxcXCJcIikgKyBcIlxcXFx1MDAzRVxcXFx1MDAzQ1xcXFx1MDAyRmNhdC1yZXZpZXdcXFxcdTAwM0VcIjtcXG4gICAgICB9XFxuICB9IGVsc2Uge1xcbiAgICB2YXIgJGwgPSAwO1xcbiAgICBmb3IgKHZhciBwdWdfaW5kZXgwIGluICRvYmopIHtcXG4gICAgICAkbCsrO1xcbiAgICAgIHZhciByZXZpZXcgPSAkb2JqW3B1Z19pbmRleDBdO1xcbjtwdWdfZGVidWdfbGluZSA9IDM7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDY2F0LXJldmlld1wiICsgKHB1Z19hdHRyKFwicmV2aWV3LWlkXCIsIHJldmlldy5pZCwgdHJ1ZSwgZmFsc2UpK1wiIGNhdC1zdG9yZT1cXFxcXCJGZWVkXFxcXFwiXCIpICsgXCJcXFxcdTAwM0VcXFxcdTAwM0NcXFxcdTAwMkZjYXQtcmV2aWV3XFxcXHUwMDNFXCI7XFxuICAgIH1cXG4gIH1cXG59KS5jYWxsKHRoaXMpO1xcblxcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFx1MDAzQ1xcXFx1MDAyRmRpdlxcXFx1MDAzRVwiO30uY2FsbCh0aGlzLFwicmV2aWV3c1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgucmV2aWV3czp0eXBlb2YgcmV2aWV3cyE9PVwidW5kZWZpbmVkXCI/cmV2aWV3czp1bmRlZmluZWQpKTt9IGNhdGNoIChlcnIpIHtwdWdfcmV0aHJvdyhlcnIsIHB1Z19kZWJ1Z19maWxlbmFtZSwgcHVnX2RlYnVnX2xpbmUpO307cmV0dXJuIHB1Z19odG1sO30nLFxuXHRlcnJvclRlbXBsYXRlUHJvdmlkZXJOYW1lOiAncHVnJyxcblx0Y29tcGlsZWRFcnJvclRlbXBsYXRlOiAnZnVuY3Rpb24gcHVnX3JldGhyb3cobixlLHIsdCl7aWYoIShuIGluc3RhbmNlb2YgRXJyb3IpKXRocm93IG47aWYoIShcInVuZGVmaW5lZFwiPT10eXBlb2Ygd2luZG93JiZlfHx0KSl0aHJvdyBuLm1lc3NhZ2UrPVwiIG9uIGxpbmUgXCIrcixuO3RyeXt0PXR8fHJlcXVpcmUoXCJmc1wiKS5yZWFkRmlsZVN5bmMoZSxcInV0ZjhcIil9Y2F0Y2goZSl7cHVnX3JldGhyb3cobixudWxsLHIpfXZhciBpPTMsYT10LnNwbGl0KFwiXFxcXG5cIiksbz1NYXRoLm1heChyLWksMCksaD1NYXRoLm1pbihhLmxlbmd0aCxyK2kpLGk9YS5zbGljZShvLGgpLm1hcChmdW5jdGlvbihuLGUpe3ZhciB0PWUrbysxO3JldHVybih0PT1yP1wiICA+IFwiOlwiICAgIFwiKSt0K1wifCBcIitufSkuam9pbihcIlxcXFxuXCIpO3Rocm93IG4ucGF0aD1lLG4ubWVzc2FnZT0oZXx8XCJQdWdcIikrXCI6XCIrcitcIlxcXFxuXCIraStcIlxcXFxuXFxcXG5cIituLm1lc3NhZ2Usbn1mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7dmFyIHB1Z19kZWJ1Z19maWxlbmFtZSwgcHVnX2RlYnVnX2xpbmU7dHJ5IHt9IGNhdGNoIChlcnIpIHtwdWdfcmV0aHJvdyhlcnIsIHB1Z19kZWJ1Z19maWxlbmFtZSwgcHVnX2RlYnVnX2xpbmUpO307cmV0dXJuIHB1Z19odG1sO30nXG59LFxue1xuXHRuYW1lOiAnaGVhZCcsXG5cdGNvbnN0cnVjdG9yOiByZXF1aXJlKCcuL2NhdGJlcnJ5X2NvbXBvbmVudHMvaGVhZC9IZWFkLmpzJyksXG5cdHByb3BlcnRpZXM6IHtcIm5hbWVcIjpcImhlYWRcIixcInRlbXBsYXRlXCI6XCIuL2hlYWQucHVnXCIsXCJsb2dpY1wiOlwiLi9IZWFkLmpzXCJ9LFxuXHR0ZW1wbGF0ZVByb3ZpZGVyTmFtZTogJ3B1ZycsXG5cdGNvbXBpbGVkVGVtcGxhdGU6ICdmdW5jdGlvbiBwdWdfZXNjYXBlKGUpe3ZhciBhPVwiXCIrZSx0PXB1Z19tYXRjaF9odG1sLmV4ZWMoYSk7aWYoIXQpcmV0dXJuIGU7dmFyIHIsYyxuLHM9XCJcIjtmb3Iocj10LmluZGV4LGM9MDtyPGEubGVuZ3RoO3IrKyl7c3dpdGNoKGEuY2hhckNvZGVBdChyKSl7Y2FzZSAzNDpuPVwiJnF1b3Q7XCI7YnJlYWs7Y2FzZSAzODpuPVwiJmFtcDtcIjticmVhaztjYXNlIDYwOm49XCImbHQ7XCI7YnJlYWs7Y2FzZSA2MjpuPVwiJmd0O1wiO2JyZWFrO2RlZmF1bHQ6Y29udGludWV9YyE9PXImJihzKz1hLnN1YnN0cmluZyhjLHIpKSxjPXIrMSxzKz1ufXJldHVybiBjIT09cj9zK2Euc3Vic3RyaW5nKGMscik6c31cXG52YXIgcHVnX21hdGNoX2h0bWw9L1tcIiY8Pl0vO1xcbmZ1bmN0aW9uIHB1Z19yZXRocm93KG4sZSxyLHQpe2lmKCEobiBpbnN0YW5jZW9mIEVycm9yKSl0aHJvdyBuO2lmKCEoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHdpbmRvdyYmZXx8dCkpdGhyb3cgbi5tZXNzYWdlKz1cIiBvbiBsaW5lIFwiK3Isbjt0cnl7dD10fHxyZXF1aXJlKFwiZnNcIikucmVhZEZpbGVTeW5jKGUsXCJ1dGY4XCIpfWNhdGNoKGUpe3B1Z19yZXRocm93KG4sbnVsbCxyKX12YXIgaT0zLGE9dC5zcGxpdChcIlxcXFxuXCIpLG89TWF0aC5tYXgoci1pLDApLGg9TWF0aC5taW4oYS5sZW5ndGgscitpKSxpPWEuc2xpY2UobyxoKS5tYXAoZnVuY3Rpb24obixlKXt2YXIgdD1lK28rMTtyZXR1cm4odD09cj9cIiAgPiBcIjpcIiAgICBcIikrdCtcInwgXCIrbn0pLmpvaW4oXCJcXFxcblwiKTt0aHJvdyBuLnBhdGg9ZSxuLm1lc3NhZ2U9KGV8fFwiUHVnXCIpK1wiOlwiK3IrXCJcXFxcblwiK2krXCJcXFxcblxcXFxuXCIrbi5tZXNzYWdlLG59ZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3ZhciBwdWdfZGVidWdfZmlsZW5hbWUsIHB1Z19kZWJ1Z19saW5lO3RyeSB7O3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKHRpdGxlKSB7O3B1Z19kZWJ1Z19saW5lID0gMTtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0NtZXRhIGNoYXJzZXQ9XFxcXFwiVVRGLThcXFxcXCJcXFxcdTAwMkZcXFxcdTAwM0VcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAyO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFx1MDAzQ3RpdGxlXFxcXHUwMDNFXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMjtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgKHB1Z19lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRpdGxlKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcXFx1MDAzQ1xcXFx1MDAyRnRpdGxlXFxcXHUwMDNFXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMztcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0NzY3JpcHQgc3JjPVxcXFxcImV4dGVybmFscy5qc1xcXFxcIlxcXFx1MDAzRVxcXFx1MDAzQ1xcXFx1MDAyRnNjcmlwdFxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDQ7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDc2NyaXB0IHNyYz1cXFxcXCJhcHAuanNcXFxcXCJcXFxcdTAwM0VcXFxcdTAwM0NcXFxcdTAwMkZzY3JpcHRcXFxcdTAwM0VcIjt9LmNhbGwodGhpcyxcInRpdGxlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC50aXRsZTp0eXBlb2YgdGl0bGUhPT1cInVuZGVmaW5lZFwiP3RpdGxlOnVuZGVmaW5lZCkpO30gY2F0Y2ggKGVycikge3B1Z19yZXRocm93KGVyciwgcHVnX2RlYnVnX2ZpbGVuYW1lLCBwdWdfZGVidWdfbGluZSk7fTtyZXR1cm4gcHVnX2h0bWw7fScsXG5cdGVycm9yVGVtcGxhdGVQcm92aWRlck5hbWU6IG51bGwsXG5cdGNvbXBpbGVkRXJyb3JUZW1wbGF0ZTogbnVsbFxufSxcbntcblx0bmFtZTogJ3JldmlldycsXG5cdGNvbnN0cnVjdG9yOiByZXF1aXJlKCcuL2NhdGJlcnJ5X2NvbXBvbmVudHMvcmV2aWV3L2luZGV4LmpzJyksXG5cdHByb3BlcnRpZXM6IHtcIm5hbWVcIjpcInJldmlld1wiLFwidGVtcGxhdGVcIjpcIi4vdGVtcGxhdGUucHVnXCIsXCJlcnJvclRlbXBsYXRlXCI6XCIuL2Vycm9yLnB1Z1wiLFwibG9naWNcIjpcImluZGV4LmpzXCJ9LFxuXHR0ZW1wbGF0ZVByb3ZpZGVyTmFtZTogJ3B1ZycsXG5cdGNvbXBpbGVkVGVtcGxhdGU6ICdmdW5jdGlvbiBwdWdfYXR0cih0LGUsbixmKXtyZXR1cm4gZSE9PSExJiZudWxsIT1lJiYoZXx8XCJjbGFzc1wiIT09dCYmXCJzdHlsZVwiIT09dCk/ZT09PSEwP1wiIFwiKyhmP3Q6dCtcXCc9XCJcXCcrdCtcXCdcIlxcJyk6KFwiZnVuY3Rpb25cIj09dHlwZW9mIGUudG9KU09OJiYoZT1lLnRvSlNPTigpKSxcInN0cmluZ1wiPT10eXBlb2YgZXx8KGU9SlNPTi5zdHJpbmdpZnkoZSksbnx8ZS5pbmRleE9mKFxcJ1wiXFwnKT09PS0xKT8obiYmKGU9cHVnX2VzY2FwZShlKSksXCIgXCIrdCtcXCc9XCJcXCcrZStcXCdcIlxcJyk6XCIgXCIrdCtcIj1cXCdcIitlLnJlcGxhY2UoL1xcJy9nLFwiJiMzOTtcIikrXCJcXCdcIik6XCJcIn1cXG5mdW5jdGlvbiBwdWdfZXNjYXBlKGUpe3ZhciBhPVwiXCIrZSx0PXB1Z19tYXRjaF9odG1sLmV4ZWMoYSk7aWYoIXQpcmV0dXJuIGU7dmFyIHIsYyxuLHM9XCJcIjtmb3Iocj10LmluZGV4LGM9MDtyPGEubGVuZ3RoO3IrKyl7c3dpdGNoKGEuY2hhckNvZGVBdChyKSl7Y2FzZSAzNDpuPVwiJnF1b3Q7XCI7YnJlYWs7Y2FzZSAzODpuPVwiJmFtcDtcIjticmVhaztjYXNlIDYwOm49XCImbHQ7XCI7YnJlYWs7Y2FzZSA2MjpuPVwiJmd0O1wiO2JyZWFrO2RlZmF1bHQ6Y29udGludWV9YyE9PXImJihzKz1hLnN1YnN0cmluZyhjLHIpKSxjPXIrMSxzKz1ufXJldHVybiBjIT09cj9zK2Euc3Vic3RyaW5nKGMscik6c31cXG52YXIgcHVnX21hdGNoX2h0bWw9L1tcIiY8Pl0vO1xcbmZ1bmN0aW9uIHB1Z19yZXRocm93KG4sZSxyLHQpe2lmKCEobiBpbnN0YW5jZW9mIEVycm9yKSl0aHJvdyBuO2lmKCEoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHdpbmRvdyYmZXx8dCkpdGhyb3cgbi5tZXNzYWdlKz1cIiBvbiBsaW5lIFwiK3Isbjt0cnl7dD10fHxyZXF1aXJlKFwiZnNcIikucmVhZEZpbGVTeW5jKGUsXCJ1dGY4XCIpfWNhdGNoKGUpe3B1Z19yZXRocm93KG4sbnVsbCxyKX12YXIgaT0zLGE9dC5zcGxpdChcIlxcXFxuXCIpLG89TWF0aC5tYXgoci1pLDApLGg9TWF0aC5taW4oYS5sZW5ndGgscitpKSxpPWEuc2xpY2UobyxoKS5tYXAoZnVuY3Rpb24obixlKXt2YXIgdD1lK28rMTtyZXR1cm4odD09cj9cIiAgPiBcIjpcIiAgICBcIikrdCtcInwgXCIrbn0pLmpvaW4oXCJcXFxcblwiKTt0aHJvdyBuLnBhdGg9ZSxuLm1lc3NhZ2U9KGV8fFwiUHVnXCIpK1wiOlwiK3IrXCJcXFxcblwiK2krXCJcXFxcblxcXFxuXCIrbi5tZXNzYWdlLG59ZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3ZhciBwdWdfZGVidWdfZmlsZW5hbWUsIHB1Z19kZWJ1Z19saW5lO3RyeSB7O3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKHJldmlldykgeztwdWdfZGVidWdfbGluZSA9IDE7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDZGl2IGNsYXNzPVxcXFxcInJldmlldy1ibG9ja1xcXFxcIlxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDI7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDcFxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDI7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIChwdWdfZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSByZXZpZXcudGV4dCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXFxcdTAwM0NcXFxcdTAwMkZwXFxcXHUwMDNFXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gNDtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0NkaXYgY2xhc3M9XFxcXFwiY29tbWVudHMtYmxvY2tcXFxcXCJcXFxcdTAwM0VcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSA1O1xcbi8vIGl0ZXJhdGUgcmV2aWV3LmNvbW1lbnRzXFxuOyhmdW5jdGlvbigpe1xcbiAgdmFyICRvYmogPSByZXZpZXcuY29tbWVudHM7XFxuICBpZiAoXFwnbnVtYmVyXFwnID09IHR5cGVvZiAkb2JqLmxlbmd0aCkge1xcbiAgICAgIGZvciAodmFyIHB1Z19pbmRleDAgPSAwLCAkbCA9ICRvYmoubGVuZ3RoOyBwdWdfaW5kZXgwIDwgJGw7IHB1Z19pbmRleDArKykge1xcbiAgICAgICAgdmFyIGNvbW1lbnQgPSAkb2JqW3B1Z19pbmRleDBdO1xcbjtwdWdfZGVidWdfbGluZSA9IDY7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDY2F0LWNvbW1lbnRcIiArIChwdWdfYXR0cihcImNvbW1lbnQtaWRcIiwgY29tbWVudC5pZCwgdHJ1ZSwgZmFsc2UpK1wiIGNhdC1zdG9yZT1cXFxcXCJGZWVkXFxcXFwiXCIpICsgXCJcXFxcdTAwM0VcXFxcdTAwM0NcXFxcdTAwMkZjYXQtY29tbWVudFxcXFx1MDAzRVwiO1xcbiAgICAgIH1cXG4gIH0gZWxzZSB7XFxuICAgIHZhciAkbCA9IDA7XFxuICAgIGZvciAodmFyIHB1Z19pbmRleDAgaW4gJG9iaikge1xcbiAgICAgICRsKys7XFxuICAgICAgdmFyIGNvbW1lbnQgPSAkb2JqW3B1Z19pbmRleDBdO1xcbjtwdWdfZGVidWdfbGluZSA9IDY7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDY2F0LWNvbW1lbnRcIiArIChwdWdfYXR0cihcImNvbW1lbnQtaWRcIiwgY29tbWVudC5pZCwgdHJ1ZSwgZmFsc2UpK1wiIGNhdC1zdG9yZT1cXFxcXCJGZWVkXFxcXFwiXCIpICsgXCJcXFxcdTAwM0VcXFxcdTAwM0NcXFxcdTAwMkZjYXQtY29tbWVudFxcXFx1MDAzRVwiO1xcbiAgICB9XFxuICB9XFxufSkuY2FsbCh0aGlzKTtcXG5cXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0NcXFxcdTAwMkZkaXZcXFxcdTAwM0VcXFxcdTAwM0NcXFxcdTAwMkZkaXZcXFxcdTAwM0VcIjt9LmNhbGwodGhpcyxcInJldmlld1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgucmV2aWV3OnR5cGVvZiByZXZpZXchPT1cInVuZGVmaW5lZFwiP3Jldmlldzp1bmRlZmluZWQpKTt9IGNhdGNoIChlcnIpIHtwdWdfcmV0aHJvdyhlcnIsIHB1Z19kZWJ1Z19maWxlbmFtZSwgcHVnX2RlYnVnX2xpbmUpO307cmV0dXJuIHB1Z19odG1sO30nLFxuXHRlcnJvclRlbXBsYXRlUHJvdmlkZXJOYW1lOiAncHVnJyxcblx0Y29tcGlsZWRFcnJvclRlbXBsYXRlOiAnZnVuY3Rpb24gcHVnX3JldGhyb3cobixlLHIsdCl7aWYoIShuIGluc3RhbmNlb2YgRXJyb3IpKXRocm93IG47aWYoIShcInVuZGVmaW5lZFwiPT10eXBlb2Ygd2luZG93JiZlfHx0KSl0aHJvdyBuLm1lc3NhZ2UrPVwiIG9uIGxpbmUgXCIrcixuO3RyeXt0PXR8fHJlcXVpcmUoXCJmc1wiKS5yZWFkRmlsZVN5bmMoZSxcInV0ZjhcIil9Y2F0Y2goZSl7cHVnX3JldGhyb3cobixudWxsLHIpfXZhciBpPTMsYT10LnNwbGl0KFwiXFxcXG5cIiksbz1NYXRoLm1heChyLWksMCksaD1NYXRoLm1pbihhLmxlbmd0aCxyK2kpLGk9YS5zbGljZShvLGgpLm1hcChmdW5jdGlvbihuLGUpe3ZhciB0PWUrbysxO3JldHVybih0PT1yP1wiICA+IFwiOlwiICAgIFwiKSt0K1wifCBcIitufSkuam9pbihcIlxcXFxuXCIpO3Rocm93IG4ucGF0aD1lLG4ubWVzc2FnZT0oZXx8XCJQdWdcIikrXCI6XCIrcitcIlxcXFxuXCIraStcIlxcXFxuXFxcXG5cIituLm1lc3NhZ2Usbn1mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7dmFyIHB1Z19kZWJ1Z19maWxlbmFtZSwgcHVnX2RlYnVnX2xpbmU7dHJ5IHt9IGNhdGNoIChlcnIpIHtwdWdfcmV0aHJvdyhlcnIsIHB1Z19kZWJ1Z19maWxlbmFtZSwgcHVnX2RlYnVnX2xpbmUpO307cmV0dXJuIHB1Z19odG1sO30nXG59XG5cbl07XG5cbmNvbnN0IHJvdXRlRGVmaW5pdGlvbnMgPSByZXF1aXJlKCcuL3JvdXRlcy5qcycpIHx8IFtdO1xuY29uc3Qgcm91dGVEZXNjcmlwdG9ycyA9IFt7XCJleHByZXNzaW9uXCI6XCIvXCIsXCJwYXRoUGFyYW1ldGVyc1wiOltdLFwicXVlcnlQYXJhbWV0ZXJzXCI6W10sXCJwYXRoUmVnRXhwU291cmNlXCI6XCJeLyRcIn1dIHx8IFtdO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0c3RvcmVzLFxuXHRjb21wb25lbnRzLFxuXHRyb3V0ZURlZmluaXRpb25zLFxuXHRyb3V0ZURlc2NyaXB0b3JzXG59O1xuIl19
