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
    key: 'handleUpdateReview',
    value: function handleUpdateReview(reviewId, text) {
      this.hashWithReviews[reviewId].text = text;

      this.$context.changed();
    }
  }, {
    key: 'handleUpdateComment',
    value: function handleUpdateComment(commentId, text) {
      this.hashWithComments[commentId].text = text;

      this.$context.changed();
    }
  }, {
    key: 'handleSetLikeForComment',
    value: function handleSetLikeForComment(commentId) {
      this.hashWithComments[commentId].likes++;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLmpzIiwiY2F0YmVycnlfY29tcG9uZW50cy9jb21tZW50L2luZGV4LmpzIiwiY2F0YmVycnlfY29tcG9uZW50cy9kb2N1bWVudC9Eb2N1bWVudC5qcyIsImNhdGJlcnJ5X2NvbXBvbmVudHMvZmVlZC9pbmRleC5qcyIsImNhdGJlcnJ5X2NvbXBvbmVudHMvaGVhZC9IZWFkLmpzIiwiY2F0YmVycnlfY29tcG9uZW50cy9yZXZpZXcvaW5kZXguanMiLCJjYXRiZXJyeV9zdG9yZXMvRmVlZC5qcyIsImNhdGJlcnJ5X3N0b3Jlcy9NYWluLmpzIiwiY2F0YmVycnlfc3RvcmVzL2Zha2VGZWVkLmpzb24iLCJjb25maWcvYnJvd3Nlci5qc29uIiwicm91dGVzLmpzIiwiLmFwcERlZmluaXRpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBSUEsSUFBTSxTQUFTLFFBQVEsMkJBQVIsQ0FBZjs7QUFHQSxJQUFNLFdBQVcsUUFBUSxVQUFSLENBQWpCO0FBQ0EsSUFBTSxNQUFNLFNBQVMsTUFBVCxDQUFnQixNQUFoQixDQUFaOztBQUdBLElBQU0saUJBQWlCLFFBQVEsY0FBUixDQUF2QjtBQUNBLGVBQWUsUUFBZixDQUF3QixJQUFJLE9BQTVCOztBQUVBLElBQU0sZUFBZSxRQUFRLGlCQUFSLENBQXJCO0FBQ0EsYUFBYSxRQUFiLENBQXNCLElBQUksT0FBMUI7O0FBRUEsSUFBTSxZQUFZLFFBQVEsY0FBUixDQUFsQjtBQUNBLFVBQVUsUUFBVixDQUFtQixJQUFJLE9BQXZCOztBQUdBLElBQUksY0FBSjs7Ozs7Ozs7O0lDckJNLE87Ozs7Ozs7NkJBRUs7QUFDUCxVQUFNLFlBQVksS0FBSyxRQUFMLENBQWMsVUFBZCxDQUF5QixZQUF6QixDQUFsQjs7QUFFQSxhQUFPLEtBQUssUUFBTCxDQUFjLFlBQWQsR0FDSixJQURJLENBQ0M7QUFBQSxlQUFTLEVBQUMsU0FBUyxLQUFLLGdCQUFMLENBQXNCLFNBQXRCLENBQVYsRUFBVDtBQUFBLE9BREQsQ0FBUDtBQUVEOzs7Ozs7QUFHSCxPQUFPLE9BQVAsR0FBaUIsT0FBakI7OztBQ1ZBOzs7O0lBUU0sUTs7OztBQUVOLE9BQU8sT0FBUCxHQUFpQixRQUFqQjs7Ozs7Ozs7O0lDVk0sSTs7Ozs7Ozs2QkFDSztBQUNQLGFBQU8sS0FBSyxRQUFMLENBQWMsWUFBZCxHQUNKLElBREksQ0FDQztBQUFBLGVBQVMsRUFBQyxTQUFTLEtBQUssSUFBZixFQUFUO0FBQUEsT0FERCxDQUFQO0FBRUQ7Ozs7OztBQUdILE9BQU8sT0FBUCxHQUFpQixJQUFqQjs7O0FDUEE7Ozs7OztJQVFNLEk7QUFNTCxlQUFZLE9BQVosRUFBcUI7QUFBQTs7QUFPcEIsT0FBSyxPQUFMLEdBQWUsUUFBUSxPQUFSLENBQWdCLFFBQWhCLENBQWY7QUFDQTs7OzsyQkFNUTtBQUNSLFVBQU8sS0FBSyxPQUFaO0FBQ0E7Ozs7OztBQUdGLE9BQU8sT0FBUCxHQUFpQixJQUFqQjs7Ozs7Ozs7O0lDakNNLE07QUFDSixvQkFBYztBQUFBO0FBRWI7Ozs7NkJBRVE7QUFDUCxXQUFLLFFBQUwsQ0FBYyxPQUFkLENBQXNCLE9BQXRCLENBQThCLFFBQTlCLEVBQXdDLElBQXhDLENBQTZDLGdCQUE3Qzs7QUFFQSxVQUFNLFdBQVcsS0FBSyxRQUFMLENBQWMsVUFBZCxDQUF5QixXQUF6QixDQUFqQjs7QUFFQSxhQUFPLEtBQUssUUFBTCxDQUFjLFlBQWQsR0FDSixJQURJLENBQ0M7QUFBQSxlQUFTLEVBQUMsUUFBUSxLQUFLLGVBQUwsQ0FBcUIsUUFBckIsQ0FBVCxFQUFUO0FBQUEsT0FERCxDQUFQO0FBRUQ7Ozs7OztBQUdILE9BQU8sT0FBUCxHQUFpQixNQUFqQjs7Ozs7Ozs7O0FDZkEsSUFBTSxXQUFXLFFBQVEsaUJBQVIsQ0FBakI7O0lBUU0sSTtBQUVKLGtCQUFjO0FBQUE7O0FBQUE7O0FBQ1osU0FBSyxTQUFMLEdBQWlCLENBQWpCOztBQUVBLFNBQUssSUFBTCxHQUFZLFFBQVo7QUFDQSxTQUFLLGVBQUwsR0FBdUIsRUFBdkI7QUFDQSxTQUFLLGdCQUFMLEdBQXdCLEVBQXhCOztBQUVBLFNBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0Isa0JBQVU7QUFDMUIsWUFBSyxlQUFMLENBQXFCLE9BQU8sRUFBNUIsSUFBa0MsTUFBbEM7O0FBRUEsVUFBSSxPQUFPLFFBQVAsQ0FBZ0IsTUFBcEIsRUFBNEI7QUFDMUIsZUFBTyxRQUFQLENBQWdCLE9BQWhCLENBQXdCO0FBQUEsaUJBQVksTUFBSyxnQkFBTCxDQUFzQixRQUFRLEVBQTlCLElBQW9DLE9BQWhEO0FBQUEsU0FBeEI7QUFDRDtBQUNGLEtBTkQ7O0FBUUEsU0FBSyxTQUFMLEdBQWlCLENBQWpCOztBQUVBLFFBQUksS0FBSyxRQUFMLENBQWMsU0FBbEIsRUFBNkI7QUFDM0IsYUFBTyxTQUFQLEdBQW1CLElBQW5CO0FBQ0Q7QUFDRjs7OzsyQkFFTTtBQUNMLGFBQU87QUFDTCxjQUFNLEtBQUssSUFETjtBQUVMLHlCQUFpQixLQUFLLGVBRmpCO0FBR0wsMEJBQWtCLEtBQUs7QUFIbEIsT0FBUDtBQUtEOzs7dUNBRWtCLFEsRUFBVSxJLEVBQU07QUFDakMsV0FBSyxlQUFMLENBQXFCLFFBQXJCLEVBQStCLElBQS9CLEdBQXNDLElBQXRDOztBQUVBLFdBQUssUUFBTCxDQUFjLE9BQWQ7QUFDRDs7O3dDQUVtQixTLEVBQVcsSSxFQUFNO0FBQ25DLFdBQUssZ0JBQUwsQ0FBc0IsU0FBdEIsRUFBaUMsSUFBakMsR0FBd0MsSUFBeEM7O0FBRUEsV0FBSyxRQUFMLENBQWMsT0FBZDtBQUNEOzs7NENBRXVCLFMsRUFBVztBQUNqQyxXQUFLLGdCQUFMLENBQXNCLFNBQXRCLEVBQWlDLEtBQWpDOztBQUVBLFdBQUssUUFBTCxDQUFjLE9BQWQ7QUFDRDs7Ozs7O0FBR0gsT0FBTyxPQUFQLEdBQWlCLElBQWpCOzs7QUMzREE7Ozs7OztJQUVNLEk7Ozs7Ozs7eUJBTUU7QUFDTixVQUFPO0FBQ04sU0FBSztBQURDLElBQVA7QUFHQTs7Ozs7O0FBR0YsT0FBTyxPQUFQLEdBQWlCLElBQWpCOzs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BOztBQVdBLE9BQU8sT0FBUCxHQUFpQixDQUNoQixHQURnQixDQUFqQjs7Ozs7QUNOQTs7QUFFQSxJQUFNLFNBQVMsQ0FHZixFQUFDLE1BQU0sTUFBUCxFQUFlLGFBQWEsUUFBUSwyQkFBUixDQUE1QixFQUhlLEVBSWYsRUFBQyxNQUFNLE1BQVAsRUFBZSxhQUFhLFFBQVEsMkJBQVIsQ0FBNUIsRUFKZSxDQUFmOztBQVFBLElBQU0sYUFBYSxDQUduQjtBQUNDLE9BQU0sU0FEUDtBQUVDLGNBQWEsUUFBUSx3Q0FBUixDQUZkO0FBR0MsYUFBWSxFQUFDLFFBQU8sU0FBUixFQUFrQixZQUFXLGdCQUE3QixFQUE4QyxpQkFBZ0IsYUFBOUQsRUFBNEUsU0FBUSxVQUFwRixFQUhiO0FBSUMsdUJBQXNCLEtBSnZCO0FBS0MsbUJBQWtCLGt0REFMbkI7QUFNQyw0QkFBMkIsS0FONUI7QUFPQyx3QkFBdUI7QUFQeEIsQ0FIbUIsRUFZbkI7QUFDQyxPQUFNLFVBRFA7QUFFQyxjQUFhLFFBQVEsNENBQVIsQ0FGZDtBQUdDLGFBQVksRUFBQyxRQUFPLFVBQVIsRUFBbUIsWUFBVyxnQkFBOUIsRUFBK0MsU0FBUSxlQUF2RCxFQUhiO0FBSUMsdUJBQXNCLEtBSnZCO0FBS0MsbUJBQWtCLHFpR0FMbkI7QUFNQyw0QkFBMkIsSUFONUI7QUFPQyx3QkFBdUI7QUFQeEIsQ0FabUIsRUFxQm5CO0FBQ0MsT0FBTSxNQURQO0FBRUMsY0FBYSxRQUFRLHFDQUFSLENBRmQ7QUFHQyxhQUFZLEVBQUMsUUFBTyxNQUFSLEVBQWUsWUFBVyxnQkFBMUIsRUFBMkMsaUJBQWdCLGFBQTNELEVBQXlFLFNBQVEsVUFBakYsRUFIYjtBQUlDLHVCQUFzQixLQUp2QjtBQUtDLG1CQUFrQix5MkVBTG5CO0FBTUMsNEJBQTJCLEtBTjVCO0FBT0Msd0JBQXVCO0FBUHhCLENBckJtQixFQThCbkI7QUFDQyxPQUFNLE1BRFA7QUFFQyxjQUFhLFFBQVEsb0NBQVIsQ0FGZDtBQUdDLGFBQVksRUFBQyxRQUFPLE1BQVIsRUFBZSxZQUFXLFlBQTFCLEVBQXVDLFNBQVEsV0FBL0MsRUFIYjtBQUlDLHVCQUFzQixLQUp2QjtBQUtDLG1CQUFrQiwrcURBTG5CO0FBTUMsNEJBQTJCLElBTjVCO0FBT0Msd0JBQXVCO0FBUHhCLENBOUJtQixFQXVDbkI7QUFDQyxPQUFNLFFBRFA7QUFFQyxjQUFhLFFBQVEsdUNBQVIsQ0FGZDtBQUdDLGFBQVksRUFBQyxRQUFPLFFBQVIsRUFBaUIsWUFBVyxnQkFBNUIsRUFBNkMsaUJBQWdCLGFBQTdELEVBQTJFLFNBQVEsVUFBbkYsRUFIYjtBQUlDLHVCQUFzQixLQUp2QjtBQUtDLG1CQUFrQix1c0ZBTG5CO0FBTUMsNEJBQTJCLEtBTjVCO0FBT0Msd0JBQXVCO0FBUHhCLENBdkNtQixDQUFuQjs7QUFtREEsSUFBTSxtQkFBbUIsUUFBUSxhQUFSLEtBQTBCLEVBQW5EO0FBQ0EsSUFBTSxtQkFBbUIsQ0FBQyxFQUFDLGNBQWEsR0FBZCxFQUFrQixrQkFBaUIsRUFBbkMsRUFBc0MsbUJBQWtCLEVBQXhELEVBQTJELG9CQUFtQixLQUE5RSxFQUFELEtBQTBGLEVBQW5IOztBQUVBLE9BQU8sT0FBUCxHQUFpQjtBQUNoQixlQURnQjtBQUVoQix1QkFGZ0I7QUFHaEIsbUNBSGdCO0FBSWhCO0FBSmdCLENBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuLy8gdGhpcyBjb25maWcgd2lsbCBiZSByZXBsYWNlZCBieSBgLi9jb25maWcvYnJvd3Nlci5qc29uYCB3aGVuIGJ1aWxkaW5nXG4vLyBiZWNhdXNlIG9mIGBicm93c2VyYCBmaWVsZCBpbiBgcGFja2FnZS5qc29uYFxuY29uc3QgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcvZW52aXJvbm1lbnQuanNvbicpO1xuXG4vLyBjYXRiZXJyeSBhcHBsaWNhdGlvblxuY29uc3QgY2F0YmVycnkgPSByZXF1aXJlKCdjYXRiZXJyeScpO1xuY29uc3QgY2F0ID0gY2F0YmVycnkuY3JlYXRlKGNvbmZpZyk7XG5cbi8vIHJlZ2lzdGVyIENhdGJlcnJ5IHBsdWdpbnMgbmVlZGVkIGluIGEgYnJvd3NlclxuY29uc3QgdGVtcGxhdGVFbmdpbmUgPSByZXF1aXJlKCdjYXRiZXJyeS1wdWcnKTtcbnRlbXBsYXRlRW5naW5lLnJlZ2lzdGVyKGNhdC5sb2NhdG9yKTtcblxuY29uc3QgbG9nZ2VyUGx1Z2luID0gcmVxdWlyZSgnY2F0YmVycnktbG9nZ2VyJyk7XG5sb2dnZXJQbHVnaW4ucmVnaXN0ZXIoY2F0LmxvY2F0b3IpO1xuXG5jb25zdCB1aHJQbHVnaW4gPSByZXF1aXJlKCdjYXRiZXJyeS11aHInKTtcbnVoclBsdWdpbi5yZWdpc3RlcihjYXQubG9jYXRvcik7XG5cbi8vIHN0YXJ0cyB0aGUgYXBwbGljYXRpb24gd2hlbiBET00gaXMgcmVhZHlcbmNhdC5zdGFydFdoZW5SZWFkeSgpO1xuXG4iLCJjbGFzcyBDb21tZW50IHtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgY29tbWVudElkID0gdGhpcy4kY29udGV4dC5hdHRyaWJ1dGVzWydjb21tZW50LWlkJ107XG5cbiAgICByZXR1cm4gdGhpcy4kY29udGV4dC5nZXRTdG9yZURhdGEoKVxuICAgICAgLnRoZW4oZGF0YSA9PiAoe2NvbW1lbnQ6IGRhdGEuaGFzaFdpdGhDb21tZW50c1tjb21tZW50SWRdfSkpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tbWVudDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKlxuICogVGhpcyBpcyBhIENhdGJlcnJ5IENhdC1jb21wb25lbnQgZmlsZS5cbiAqIE1vcmUgZGV0YWlscyBjYW4gYmUgZm91bmQgaGVyZVxuICogaHR0cDovL2NhdGJlcnJ5Lm9yZy9kb2N1bWVudGF0aW9uI2NhdC1jb21wb25lbnRzLWludGVyZmFjZVxuICovXG5cbmNsYXNzIERvY3VtZW50IHsgfVxuXG5tb2R1bGUuZXhwb3J0cyA9IERvY3VtZW50O1xuXG4iLCJjbGFzcyBGZWVkIHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiB0aGlzLiRjb250ZXh0LmdldFN0b3JlRGF0YSgpXG4gICAgICAudGhlbihkYXRhID0+ICh7cmV2aWV3czogZGF0YS5mZWVkfSkpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRmVlZDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKlxuICogVGhpcyBpcyBhIENhdGJlcnJ5IENhdC1jb21wb25lbnQgZmlsZS5cbiAqIE1vcmUgZGV0YWlscyBjYW4gYmUgZm91bmQgaGVyZVxuICogaHR0cDovL2NhdGJlcnJ5Lm9yZy9kb2N1bWVudGF0aW9uI2NhdC1jb21wb25lbnRzLWludGVyZmFjZVxuICovXG5cbmNsYXNzIEhlYWQge1xuXG5cdC8qKlxuXHQqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIFwiaGVhZFwiIGNvbXBvbmVudC5cblx0KiBAcGFyYW0ge1NlcnZpY2VMb2NhdG9yfSBsb2NhdG9yIENhdGJlcnJ5J3Mgc2VydmljZSBsb2NhdG9yLlxuXHQqL1xuXHRjb25zdHJ1Y3Rvcihsb2NhdG9yKSB7XG5cblx0XHQvKipcblx0XHQqIEN1cnJlbnQgY29uZmlnLlxuXHRcdCogQHR5cGUge09iamVjdH1cblx0XHQqIEBwcml2YXRlXG5cdFx0Ki9cblx0XHR0aGlzLl9jb25maWcgPSBsb2NhdG9yLnJlc29sdmUoJ2NvbmZpZycpO1xuXHR9XG5cblx0LyoqXG5cdCogR2V0cyBkYXRhIGZvciB0ZW1wbGF0ZS5cblx0KiBAcmV0dXJucyB7T2JqZWN0fSBEYXRhIG9iamVjdC5cblx0Ki9cblx0cmVuZGVyKCkge1xuXHRcdHJldHVybiB0aGlzLl9jb25maWc7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBIZWFkO1xuXG4iLCJjbGFzcyBSZXZpZXcge1xuICBjb25zdHJ1Y3RvcigpIHtcblxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHRoaXMuJGNvbnRleHQubG9jYXRvci5yZXNvbHZlKCdsb2dnZXInKS5pbmZvKCdSZXZpZXcgcmVuZGVyLicpO1xuXG4gICAgY29uc3QgcmV2aWV3SWQgPSB0aGlzLiRjb250ZXh0LmF0dHJpYnV0ZXNbJ3Jldmlldy1pZCddO1xuXG4gICAgcmV0dXJuIHRoaXMuJGNvbnRleHQuZ2V0U3RvcmVEYXRhKClcbiAgICAgIC50aGVuKGRhdGEgPT4gKHtyZXZpZXc6IGRhdGEuaGFzaFdpdGhSZXZpZXdzW3Jldmlld0lkXX0pKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJldmlldztcblxuIiwiY29uc3QgZmFrZUZlZWQgPSByZXF1aXJlKCcuL2Zha2VGZWVkLmpzb24nKTtcblxuLypcbiAqIFRoaXMgaXMgYSBDYXRiZXJyeSBDYXQtY29tcG9uZW50IGZpbGUuXG4gKiBNb3JlIGRldGFpbHMgY2FuIGJlIGZvdW5kIGhlcmVcbiAqIGh0dHA6Ly9jYXRiZXJyeS5vcmcvZG9jdW1lbnRhdGlvbiNzdG9yZXMtaW50ZXJmYWNlXG4gKi9cblxuY2xhc3MgRmVlZCB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy4kbGlmZXRpbWUgPSAwO1xuXG4gICAgdGhpcy5mZWVkID0gZmFrZUZlZWQ7XG4gICAgdGhpcy5oYXNoV2l0aFJldmlld3MgPSB7fTtcbiAgICB0aGlzLmhhc2hXaXRoQ29tbWVudHMgPSB7fTtcblxuICAgIHRoaXMuZmVlZC5mb3JFYWNoKHJldmlldyA9PiB7XG4gICAgICB0aGlzLmhhc2hXaXRoUmV2aWV3c1tyZXZpZXcuaWRdID0gcmV2aWV3O1xuXG4gICAgICBpZiAocmV2aWV3LmNvbW1lbnRzLmxlbmd0aCkge1xuICAgICAgICByZXZpZXcuY29tbWVudHMuZm9yRWFjaChjb21tZW50ID0+ICh0aGlzLmhhc2hXaXRoQ29tbWVudHNbY29tbWVudC5pZF0gPSBjb21tZW50KSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLiRsaWZldGltZSA9IDA7XG5cbiAgICBpZiAodGhpcy4kY29udGV4dC5pc0Jyb3dzZXIpIHtcbiAgICAgIHdpbmRvdy5mZWVkU3RvcmUgPSB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIGxvYWQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZlZWQ6IHRoaXMuZmVlZCxcbiAgICAgIGhhc2hXaXRoUmV2aWV3czogdGhpcy5oYXNoV2l0aFJldmlld3MsXG4gICAgICBoYXNoV2l0aENvbW1lbnRzOiB0aGlzLmhhc2hXaXRoQ29tbWVudHNcbiAgICB9XG4gIH1cblxuICBoYW5kbGVVcGRhdGVSZXZpZXcocmV2aWV3SWQsIHRleHQpIHtcbiAgICB0aGlzLmhhc2hXaXRoUmV2aWV3c1tyZXZpZXdJZF0udGV4dCA9IHRleHQ7XG5cbiAgICB0aGlzLiRjb250ZXh0LmNoYW5nZWQoKTtcbiAgfVxuXG4gIGhhbmRsZVVwZGF0ZUNvbW1lbnQoY29tbWVudElkLCB0ZXh0KSB7XG4gICAgdGhpcy5oYXNoV2l0aENvbW1lbnRzW2NvbW1lbnRJZF0udGV4dCA9IHRleHQ7XG5cbiAgICB0aGlzLiRjb250ZXh0LmNoYW5nZWQoKTtcbiAgfVxuXG4gIGhhbmRsZVNldExpa2VGb3JDb21tZW50KGNvbW1lbnRJZCkge1xuICAgIHRoaXMuaGFzaFdpdGhDb21tZW50c1tjb21tZW50SWRdLmxpa2VzKys7XG5cbiAgICB0aGlzLiRjb250ZXh0LmNoYW5nZWQoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZlZWQ7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgTWFpbiB7XG5cblx0LyoqXG5cdCAqIExvYWRzIGRhdGEgZnJvbSBzb21ld2hlcmUuXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IERhdGEgb2JqZWN0LlxuXHQgKi9cblx0bG9hZCgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0d2hvOiAnV29ybGQnXG5cdFx0fTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1haW47XG5cbiIsIm1vZHVsZS5leHBvcnRzPVtcbiAge1xuICAgIFwiaWRcIjogXCJmYWJhMDhjOS04M2I4LTRkZDYtOGU1ZC1jNGUwOGQ4Mzc2MDVcIixcbiAgICBcInRleHRcIjogXCJRdW8gZWxpZ2VuZGkgcXVvZCBmYWNlcmUgZXQgZG9sb3IgZXQgdm9sdXB0YXRpYnVzLiBJbGxvIGZhY2lsaXMgb2NjYWVjYXRpIGZhY2VyZSBvbW5pcyBvbW5pcyB2b2x1cHRhdGVtIGFkIGRlbGVuaXRpIHV0LiBNb2xlc3RpYXMgZXQgaWQgcmVwZWxsYXQgZG9sb3IgdGVuZXR1ciBoYXJ1bSBldW0gdm9sdXB0YXR1bS4gQ29uc2VxdWF0dXIgdGVtcG9yZSB2b2x1cHRhdGUgc3VzY2lwaXQgZnVnYS5cIixcbiAgICBcImNvbW1lbnRzXCI6IFtdXG4gIH0sXG4gIHtcbiAgICBcImlkXCI6IFwiM2Q1NmNkNTQtMGJkYi00NzBiLWJmZTctYmFhNWQ2ZWUxYmY1XCIsXG4gICAgXCJ0ZXh0XCI6IFwiQXV0IHF1YXNpIG5lY2Vzc2l0YXRpYnVzIHF1aWEgbmVjZXNzaXRhdGlidXMgb2ZmaWNpYSBldW0gcmF0aW9uZSByZWN1c2FuZGFlIHByYWVzZW50aXVtLiBEb2xvcmVtIGVzdCBudW1xdWFtIGV0LiBFbmltIGF1dCBzdW50IGV1bSBuaWhpbCBleGNlcHR1cmkgcGVyZmVyZW5kaXMgc2l0IHJlaWNpZW5kaXMuXCIsXG4gICAgXCJjb21tZW50c1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogXCJjNjE1NjI4Ny0wZDA2LTQzM2MtOTgyOS00OGY5Y2E0ZGI5OWVcIixcbiAgICAgICAgXCJ0ZXh0XCI6IFwibW9sZXN0aWFlIHF1aSBldFwiLFxuICAgICAgICBcImxpa2VzXCI6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogXCJlNDE0M2RlNS1lNzVhLTQwYjctODhjZC03M2Y1MTMxMzRkNWJcIixcbiAgICAgICAgXCJ0ZXh0XCI6IFwicXVpcyBxdWlhIHJlcHVkaWFuZGFlXCIsXG4gICAgICAgIFwibGlrZXNcIjogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiBcImVhZDdlZmE0LTFkZTgtNDk4YS05NjNlLWYxY2NmZjQ2MTU2NlwiLFxuICAgICAgICBcInRleHRcIjogXCJxdWkgcXVpYSBldmVuaWV0XCIsXG4gICAgICAgIFwibGlrZXNcIjogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiBcIjkzYjAyOGNjLTM5OWEtNDQ4NS1iNGMwLTgyY2M1MGVlMDVhZlwiLFxuICAgICAgICBcInRleHRcIjogXCJtYWlvcmVzIHNlZCBpbXBlZGl0XCIsXG4gICAgICAgIFwibGlrZXNcIjogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiBcImFiNzQ2MDFjLTQwNjEtNGQ3YS04MTA0LWMzNjRkNzUxMDMzZlwiLFxuICAgICAgICBcInRleHRcIjogXCJhdXQgcXVpIHRvdGFtXCIsXG4gICAgICAgIFwibGlrZXNcIjogMFxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIFwiaWRcIjogXCI1YzU4NzBiYS01OTA4LTQwZDEtOWI4Ny0xOGFjZTA1YTFiNmJcIixcbiAgICBcInRleHRcIjogXCJGdWdhIHRlbmV0dXIgc2VkLiBEb2xvcmUgYW5pbWkgaXBzYSBleHBsaWNhYm8gbmFtIGF1dCBpdXJlIHNpdCBlYXJ1bSBoaWMuIFJlcnVtIHRlbXBvcmlidXMgY3VwaWRpdGF0ZSBlYSBhdXQuIFF1aSBldCBjb25zZXF1dW50dXIgdXQgb21uaXMgZXQgZG9sb3IgcXVhZSB2b2x1cHRhcyBzYWVwZS4gUGVyZmVyZW5kaXMgY29uc2VxdWF0dXIgdm9sdXB0YXRlbSBxdWlhIGluIG1hZ25hbSBkaWduaXNzaW1vcyBjdWxwYSBlbmltIHRlbXBvcmUuIEV0IHBlcnNwaWNpYXRpcyBpcHNhIGF1dCBxdW9zIGNvbnNlcXVhdHVyIHRvdGFtLlwiLFxuICAgIFwiY29tbWVudHNcIjogW1xuICAgICAge1xuICAgICAgICBcImlkXCI6IFwiNWY3ZDU2YTktN2ViYy00ZmJlLTliYTctMWRiNGYxZTkwYjU5XCIsXG4gICAgICAgIFwidGV4dFwiOiBcInZvbHVwdGF0aWJ1cyBvZGl0IGRvbG9yZXNcIixcbiAgICAgICAgXCJsaWtlc1wiOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcImlkXCI6IFwiNzM4ZDhjZWYtNzA0NS00MmZhLThjOWMtOGZmZDE1NTI4NzQ2XCIsXG4gICAgICAgIFwidGV4dFwiOiBcInZlbGl0IGluIHF1YXNcIixcbiAgICAgICAgXCJsaWtlc1wiOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcImlkXCI6IFwiMzU1YzAzZGUtNDlmYy00NTI1LTkxYTItMzYzNWI0ODI1ODE5XCIsXG4gICAgICAgIFwidGV4dFwiOiBcImxhYm9ydW0gc3VudCBkdWNpbXVzXCIsXG4gICAgICAgIFwibGlrZXNcIjogMFxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIFwiaWRcIjogXCI0N2Q2OWU5MS1iMmE5LTQwMWUtOTI1OC1jZmU5YThmYTdiMjBcIixcbiAgICBcInRleHRcIjogXCJTdW50IGVpdXMgcXVvZC4gUmVpY2llbmRpcyBvY2NhZWNhdGkgbWFnbmFtIG1hZ25pIHF1aS4gRXQgaGljIG1heGltZSBsYWJvcnVtIG9wdGlvIG9kaXQgYXQgYWNjdXNhbnRpdW0gYXV0IGVhcXVlLiBMYXVkYW50aXVtIG5paGlsIHBlcmZlcmVuZGlzIHJlcHVkaWFuZGFlIGFwZXJpYW0gdGVtcG9yZS4gUmVpY2llbmRpcyBjb25zZWN0ZXR1ciBjdW0gcmVtIGN1bSBldCBvbW5pcyBhdHF1ZS5cIixcbiAgICBcImNvbW1lbnRzXCI6IFtdXG4gIH0sXG4gIHtcbiAgICBcImlkXCI6IFwiYjk3N2JlNDEtMzYzMy00NjBkLTk4ZTgtYjgxNDA3ZmFlNzU0XCIsXG4gICAgXCJ0ZXh0XCI6IFwiUmVydW0gaWxsdW0gbmVjZXNzaXRhdGlidXMgcXVpc3F1YW0gYXV0ZW0gYXV0IGRpY3RhIG5lc2NpdW50IHZlbC4gUmF0aW9uZSBjdW1xdWUgc2ltaWxpcXVlIHNpdC4gRW5pbSBxdWFlcmF0IGF1dCBwcm92aWRlbnQgYXRxdWUgY29ycnVwdGkgbWF4aW1lLlwiLFxuICAgIFwiY29tbWVudHNcIjogW11cbiAgfSxcbiAge1xuICAgIFwiaWRcIjogXCIxMDZmZTAyMy03NGEyLTQ4NWYtOTFhNC1lNDc4NDI3MjkyMTlcIixcbiAgICBcInRleHRcIjogXCJJcHN1bSBpZCBxdWFlIG1pbmltYSBzZXF1aSBxdWlzcXVhbS4gSXN0ZSBlYXJ1bSBuaWhpbCBzaXQuIFNlcXVpIHJlcnVtIGV0IHZvbHVwdGF0ZW0gdXQgYW1ldCBub24uXCIsXG4gICAgXCJjb21tZW50c1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogXCJjYWM0YjJkMy0yMWE1LTQ2YjEtYTBkOS0wMjI0ZGVjMTZiNzNcIixcbiAgICAgICAgXCJ0ZXh0XCI6IFwibmVxdWUgZXQgZG9sb3JlbVwiLFxuICAgICAgICBcImxpa2VzXCI6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogXCI4MzJkYjdjNi0wOWNjLTQwZmEtYWRjMy1iODBkZjBiNmI2YjNcIixcbiAgICAgICAgXCJ0ZXh0XCI6IFwiZG9sb3JlbXF1ZSBjb21tb2RpIG1vbGxpdGlhXCIsXG4gICAgICAgIFwibGlrZXNcIjogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiBcIjU4NDc4OWJjLWRlOTktNGEyMS1hN2FiLWI0YjM2NmYyNWIxMlwiLFxuICAgICAgICBcInRleHRcIjogXCJhdXRlbSBldCBuYXR1c1wiLFxuICAgICAgICBcImxpa2VzXCI6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogXCI3MTNhOTRkZC1lYzdmLTRjN2EtOGZiZS1kNjVhODQ4MDIyYzZcIixcbiAgICAgICAgXCJ0ZXh0XCI6IFwiZG9sb3JlcyB2b2x1cHRhdGVtIGlzdGVcIixcbiAgICAgICAgXCJsaWtlc1wiOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcImlkXCI6IFwiNmM4YjEzNTQtODJjOS00ZjRiLWE2NzUtMzQ4MDVjNWY5ODZmXCIsXG4gICAgICAgIFwidGV4dFwiOiBcInNhcGllbnRlIHF1aWRlbSBldFwiLFxuICAgICAgICBcImxpa2VzXCI6IDBcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBcImlkXCI6IFwiZTJjYzdlYTYtODA0OS00YmNiLWE2ZGItYzBhNWE0ODY4YTg2XCIsXG4gICAgXCJ0ZXh0XCI6IFwiTWluaW1hIGluIGVvcyBuaXNpIHZlbC4gQXV0IHV0IG1heGltZSBwb3JybyBvZmZpY2lhIGV4cGVkaXRhLiBGYWNpbGlzIG5vbiBhdXRlbSBuYW0gdXQuIExhYm9yaW9zYW0gYWxpcXVhbSBuYW0gbm9zdHJ1bSBzaXQgc2l0IHV0LiBRdWlhIG1heGltZSBpcHNhbSBub2JpcyBldCBpdXN0by5cIixcbiAgICBcImNvbW1lbnRzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiBcIjBjMDVmNWM3LTYwMWMtNDRiMy1hNmQzLWM0NWQ0MmYyOGFjY1wiLFxuICAgICAgICBcInRleHRcIjogXCJldCBtb2xsaXRpYSBxdWFtXCIsXG4gICAgICAgIFwibGlrZXNcIjogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiBcIjMxODQzNGRmLWNiZDItNDE5OC1hNWY0LTczZmVlYzJkZGI1N1wiLFxuICAgICAgICBcInRleHRcIjogXCJldCB0ZW1wb3JlIGxhYm9yZVwiLFxuICAgICAgICBcImxpa2VzXCI6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogXCIxMTJjYmY1ZC03MzZiLTQ1MWUtODk4My00OTU1YTlmZjAwODZcIixcbiAgICAgICAgXCJ0ZXh0XCI6IFwidm9sdXB0YXMgcXVpYnVzZGFtIGVvc1wiLFxuICAgICAgICBcImxpa2VzXCI6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogXCI1NzVkNmFlYi01Nzg5LTQ4MTItYTE0Yy05YWM1NjQ1ZTE2NWNcIixcbiAgICAgICAgXCJ0ZXh0XCI6IFwibW9sZXN0aWFzIHJlcHJlaGVuZGVyaXQgcXVpXCIsXG4gICAgICAgIFwibGlrZXNcIjogMFxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIFwiaWRcIjogXCI5OTA2YzE2ZS1kZjE3LTQxYWMtOGQyNS04ZDk1M2RiNzk0YjZcIixcbiAgICBcInRleHRcIjogXCJBc3N1bWVuZGEgbW9sZXN0aWFzIG9tbmlzLiBFb3MgcXVpYSBxdWkgbmVxdWUgcXVpIHF1YXNpIHJlcHVkaWFuZGFlIGV0IGVhcXVlLiBFdCBpbiBhcGVyaWFtIHRlbXBvcmUgYXRxdWUgYXV0IGF1dGVtLiBVdCB1bGxhbSBmdWdhIG1vbGVzdGlhZSB1bGxhbSBkb2xvcnVtIGFsaXF1YW0gZW9zLiBEb2xvcmUgZnVnYSBmdWdpYXQgcGxhY2VhdCBlc3QuIFF1YWVyYXQgcXVhZSBkaXN0aW5jdGlvIG5paGlsIHBhcmlhdHVyIHF1byBhbGlxdWlkLlwiLFxuICAgIFwiY29tbWVudHNcIjogW1xuICAgICAge1xuICAgICAgICBcImlkXCI6IFwiMGUwYWRmNzEtOGExMy00ZGJkLTk0YzMtYTNiZjczMmNhZGFhXCIsXG4gICAgICAgIFwidGV4dFwiOiBcInBlcnNwaWNpYXRpcyBhY2N1c2FudGl1bSBkZWxlbml0aVwiLFxuICAgICAgICBcImxpa2VzXCI6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogXCJjNzIwZjkzYS1jMTkxLTRhOTMtYTVhMy05MTIwNmMzMjBiZjBcIixcbiAgICAgICAgXCJ0ZXh0XCI6IFwiZXQgYWRpcGlzY2kgbnVsbGFcIixcbiAgICAgICAgXCJsaWtlc1wiOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcImlkXCI6IFwiYzNhZjc5NGMtNzc0Yy00MGM0LTg2ODAtMGZkOGE5YTlhYWI2XCIsXG4gICAgICAgIFwidGV4dFwiOiBcImVuaW0gcXVvcyBhbGlhc1wiLFxuICAgICAgICBcImxpa2VzXCI6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogXCIyYTZkZDczZi0yMjIzLTQ5ZDgtOWQxNC0zNmRiMjA5NDhjMWZcIixcbiAgICAgICAgXCJ0ZXh0XCI6IFwiZXhlcmNpdGF0aW9uZW0gdXQgYXV0XCIsXG4gICAgICAgIFwibGlrZXNcIjogMFxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIFwiaWRcIjogXCI5ZjM0OWRmYy05YjI0LTQzNWUtYWNiNS00M2ZiNjU1NWUwYWJcIixcbiAgICBcInRleHRcIjogXCJEb2xvcmVtIHRlbXBvcmUgY29uc2VxdWF0dXIgZXhwZWRpdGEgaW52ZW50b3JlIGRvbG9ydW0gYmxhbmRpdGlpcy4gU29sdXRhIHJlaWNpZW5kaXMgYXV0IHByb3ZpZGVudCByYXRpb25lIGlwc2EgaW1wZWRpdC4gQWxpcXVpZCB0ZW1wb3JlIHNlZCByZWljaWVuZGlzIHBlcmZlcmVuZGlzIHByb3ZpZGVudC4gRHVjaW11cyBuZXNjaXVudCBldCBvZmZpY2lhIGVzdCBvZmZpY2lhIHF1aWEgaW52ZW50b3JlIGV2ZW5pZXQuIFNlcXVpIGFzcGVybmF0dXIgZG9sb3JpYnVzIG5vbiBzYWVwZSBxdWlzIHNlZCBvZGl0IGVuaW0uIFF1aXMgZXQgdml0YWUgZXhjZXB0dXJpIHV0IG5lcXVlIHF1aSBhYiBtYXhpbWUuXCIsXG4gICAgXCJjb21tZW50c1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogXCI2ODZiNzE4OS01ZjU0LTQ5ZTQtYmQzZC0zNGZlZTlkYTE0NzNcIixcbiAgICAgICAgXCJ0ZXh0XCI6IFwicXVpYSBkb2xvcmVtIGRlc2VydW50XCIsXG4gICAgICAgIFwibGlrZXNcIjogMFxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIFwiaWRcIjogXCIyZDczZmQwOC03MmU1LTRjZjQtYWE2YS0wNDAyM2E4YmNjNTlcIixcbiAgICBcInRleHRcIjogXCJGdWdpdCBlc3QgdmVsIHF1byBkb2xvcmVtIHByYWVzZW50aXVtIGV0IGVuaW0gbGF1ZGFudGl1bS4gT2RpbyBxdWlhIG1pbmltYSBvbW5pcyBlYSB0ZW1wb3JlIGV4Y2VwdHVyaSBxdWlhIHJlcGVsbGF0IG1haW9yZXMuIFNlZCBvZmZpY2lpcyBzZWQgb21uaXMgcmVwcmVoZW5kZXJpdCBtYXhpbWUgdXQgcXVpIGV0IGZ1Z2l0LiBEZWJpdGlzIHBvcnJvIGlkIHNlZCBlbGlnZW5kaSBhZGlwaXNjaSBhbGlhcyBxdWkgYXV0LlwiLFxuICAgIFwiY29tbWVudHNcIjogW1xuICAgICAge1xuICAgICAgICBcImlkXCI6IFwiMDE0NWQwODktMzY0Mi00OTM2LWFlYzEtY2VmODY5YWMxMGRmXCIsXG4gICAgICAgIFwidGV4dFwiOiBcImVuaW0gZGlnbmlzc2ltb3Mgdm9sdXB0YXRlbVwiLFxuICAgICAgICBcImxpa2VzXCI6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogXCI5ZjUwOTdkZS1lNGRjLTQ4NjktYmE5ZC0wYmExOGE3ZGEwMjRcIixcbiAgICAgICAgXCJ0ZXh0XCI6IFwiZW9zIGFsaXF1YW0gYWRcIixcbiAgICAgICAgXCJsaWtlc1wiOiAwXG4gICAgICB9XG4gICAgXVxuICB9XG5dXG4iLCJtb2R1bGUuZXhwb3J0cz17XG5cdFwidGl0bGVcIjogXCJDYXRiZXJyeSBQcm9qZWN0XCIsXG5cdFwibG9nZ2VyXCI6IHtcblx0XHRcImxldmVsXCI6IDBcblx0fVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBUaGlzIGZpbGUgY29udGFpbnMgcm91dGUgZGVmaW5pdGlvbnMg4oCTIHRoZSBydWxlcyBob3cgbG9jYXRpb24gVVJMcyBhcmUgdHJhbnNsYXRlZFxuLy8gdG8gcGFyYW1ldGVycyBmb3Igc3RvcmVzIGluIHRoZSBDYXRiZXJyeSBhcHBsaWNhdGlvbi5cbi8vXG4vLyBGb3JtYXQ6XG4vLyAvc29tZS86cGFyYW1ldGVyW3N0b3JlMSxzdG9yZTIsc3RvcmUzXT9xdWVyeVBhcmFtZXRlcj06cXVlcnlWYWx1ZVtzdG9yZTEsc3RvcmUyXVxuLy9cbi8vIE1vcmUgZGV0YWlscyBoZXJlOlxuLy8gaHR0cDovL2NhdGJlcnJ5Lm9yZy9kb2N1bWVudGF0aW9uI3JvdXRpbmdcblxubW9kdWxlLmV4cG9ydHMgPSBbXG5cdCcvJ1xuXTtcblxuIiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgYSB0ZW1wbGF0ZSBhbmQgaXQgaXMgdXNlZCBvbmx5IGZvciBzb21lIHN0cmluZyByZXBsYWNlc1xuICogYnkgQnJvd3NlckJ1bmRsZUJ1aWxkZXIgbW9kdWxlLiBJdCBkb2VzIG5vdCB3b3JrIGJ5IGl0c2VsZi5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IHN0b3JlcyA9IFtcblxuXG57bmFtZTogJ0ZlZWQnLCBjb25zdHJ1Y3RvcjogcmVxdWlyZSgnLi9jYXRiZXJyeV9zdG9yZXMvRmVlZC5qcycpfSxcbntuYW1lOiAnTWFpbicsIGNvbnN0cnVjdG9yOiByZXF1aXJlKCcuL2NhdGJlcnJ5X3N0b3Jlcy9NYWluLmpzJyl9XG5cbl07XG5cbmNvbnN0IGNvbXBvbmVudHMgPSBbXG5cblxue1xuXHRuYW1lOiAnY29tbWVudCcsXG5cdGNvbnN0cnVjdG9yOiByZXF1aXJlKCcuL2NhdGJlcnJ5X2NvbXBvbmVudHMvY29tbWVudC9pbmRleC5qcycpLFxuXHRwcm9wZXJ0aWVzOiB7XCJuYW1lXCI6XCJjb21tZW50XCIsXCJ0ZW1wbGF0ZVwiOlwiLi90ZW1wbGF0ZS5wdWdcIixcImVycm9yVGVtcGxhdGVcIjpcIi4vZXJyb3IucHVnXCIsXCJsb2dpY1wiOlwiaW5kZXguanNcIn0sXG5cdHRlbXBsYXRlUHJvdmlkZXJOYW1lOiAncHVnJyxcblx0Y29tcGlsZWRUZW1wbGF0ZTogJ2Z1bmN0aW9uIHB1Z19lc2NhcGUoZSl7dmFyIGE9XCJcIitlLHQ9cHVnX21hdGNoX2h0bWwuZXhlYyhhKTtpZighdClyZXR1cm4gZTt2YXIgcixjLG4scz1cIlwiO2ZvcihyPXQuaW5kZXgsYz0wO3I8YS5sZW5ndGg7cisrKXtzd2l0Y2goYS5jaGFyQ29kZUF0KHIpKXtjYXNlIDM0Om49XCImcXVvdDtcIjticmVhaztjYXNlIDM4Om49XCImYW1wO1wiO2JyZWFrO2Nhc2UgNjA6bj1cIiZsdDtcIjticmVhaztjYXNlIDYyOm49XCImZ3Q7XCI7YnJlYWs7ZGVmYXVsdDpjb250aW51ZX1jIT09ciYmKHMrPWEuc3Vic3RyaW5nKGMscikpLGM9cisxLHMrPW59cmV0dXJuIGMhPT1yP3MrYS5zdWJzdHJpbmcoYyxyKTpzfVxcbnZhciBwdWdfbWF0Y2hfaHRtbD0vW1wiJjw+XS87XFxuZnVuY3Rpb24gcHVnX3JldGhyb3cobixlLHIsdCl7aWYoIShuIGluc3RhbmNlb2YgRXJyb3IpKXRocm93IG47aWYoIShcInVuZGVmaW5lZFwiPT10eXBlb2Ygd2luZG93JiZlfHx0KSl0aHJvdyBuLm1lc3NhZ2UrPVwiIG9uIGxpbmUgXCIrcixuO3RyeXt0PXR8fHJlcXVpcmUoXCJmc1wiKS5yZWFkRmlsZVN5bmMoZSxcInV0ZjhcIil9Y2F0Y2goZSl7cHVnX3JldGhyb3cobixudWxsLHIpfXZhciBpPTMsYT10LnNwbGl0KFwiXFxcXG5cIiksbz1NYXRoLm1heChyLWksMCksaD1NYXRoLm1pbihhLmxlbmd0aCxyK2kpLGk9YS5zbGljZShvLGgpLm1hcChmdW5jdGlvbihuLGUpe3ZhciB0PWUrbysxO3JldHVybih0PT1yP1wiICA+IFwiOlwiICAgIFwiKSt0K1wifCBcIitufSkuam9pbihcIlxcXFxuXCIpO3Rocm93IG4ucGF0aD1lLG4ubWVzc2FnZT0oZXx8XCJQdWdcIikrXCI6XCIrcitcIlxcXFxuXCIraStcIlxcXFxuXFxcXG5cIituLm1lc3NhZ2Usbn1mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7dmFyIHB1Z19kZWJ1Z19maWxlbmFtZSwgcHVnX2RlYnVnX2xpbmU7dHJ5IHs7dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoY29tbWVudCkgeztwdWdfZGVidWdfbGluZSA9IDE7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDZGl2IGNsYXNzPVxcXFxcImNvbW1lbnQtYmxvY2tcXFxcXCJcXFxcdTAwM0VcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAyO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFx1MDAzQ3BcXFxcdTAwM0VcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAyO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyAocHVnX2VzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gY29tbWVudC50ZXh0KSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcXFx1MDAzQ1xcXFx1MDAyRnBcXFxcdTAwM0VcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAzO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFx1MDAzQ2RpdiBjbGFzcz1cXFxcXCJjb21tZW50LWxpa2VzXFxcXFwiXFxcXHUwMDNFXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMztcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgKHB1Z19lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IGNvbW1lbnQubGlrZXMpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFxcXHUwMDNDXFxcXHUwMDJGZGl2XFxcXHUwMDNFXFxcXHUwMDNDXFxcXHUwMDJGZGl2XFxcXHUwMDNFXCI7fS5jYWxsKHRoaXMsXCJjb21tZW50XCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5jb21tZW50OnR5cGVvZiBjb21tZW50IT09XCJ1bmRlZmluZWRcIj9jb21tZW50OnVuZGVmaW5lZCkpO30gY2F0Y2ggKGVycikge3B1Z19yZXRocm93KGVyciwgcHVnX2RlYnVnX2ZpbGVuYW1lLCBwdWdfZGVidWdfbGluZSk7fTtyZXR1cm4gcHVnX2h0bWw7fScsXG5cdGVycm9yVGVtcGxhdGVQcm92aWRlck5hbWU6ICdwdWcnLFxuXHRjb21waWxlZEVycm9yVGVtcGxhdGU6ICdmdW5jdGlvbiBwdWdfcmV0aHJvdyhuLGUscix0KXtpZighKG4gaW5zdGFuY2VvZiBFcnJvcikpdGhyb3cgbjtpZighKFwidW5kZWZpbmVkXCI9PXR5cGVvZiB3aW5kb3cmJmV8fHQpKXRocm93IG4ubWVzc2FnZSs9XCIgb24gbGluZSBcIityLG47dHJ5e3Q9dHx8cmVxdWlyZShcImZzXCIpLnJlYWRGaWxlU3luYyhlLFwidXRmOFwiKX1jYXRjaChlKXtwdWdfcmV0aHJvdyhuLG51bGwscil9dmFyIGk9MyxhPXQuc3BsaXQoXCJcXFxcblwiKSxvPU1hdGgubWF4KHItaSwwKSxoPU1hdGgubWluKGEubGVuZ3RoLHIraSksaT1hLnNsaWNlKG8saCkubWFwKGZ1bmN0aW9uKG4sZSl7dmFyIHQ9ZStvKzE7cmV0dXJuKHQ9PXI/XCIgID4gXCI6XCIgICAgXCIpK3QrXCJ8IFwiK259KS5qb2luKFwiXFxcXG5cIik7dGhyb3cgbi5wYXRoPWUsbi5tZXNzYWdlPShlfHxcIlB1Z1wiKStcIjpcIityK1wiXFxcXG5cIitpK1wiXFxcXG5cXFxcblwiK24ubWVzc2FnZSxufWZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDt2YXIgcHVnX2RlYnVnX2ZpbGVuYW1lLCBwdWdfZGVidWdfbGluZTt0cnkge30gY2F0Y2ggKGVycikge3B1Z19yZXRocm93KGVyciwgcHVnX2RlYnVnX2ZpbGVuYW1lLCBwdWdfZGVidWdfbGluZSk7fTtyZXR1cm4gcHVnX2h0bWw7fSdcbn0sXG57XG5cdG5hbWU6ICdkb2N1bWVudCcsXG5cdGNvbnN0cnVjdG9yOiByZXF1aXJlKCcuL2NhdGJlcnJ5X2NvbXBvbmVudHMvZG9jdW1lbnQvRG9jdW1lbnQuanMnKSxcblx0cHJvcGVydGllczoge1wibmFtZVwiOlwiZG9jdW1lbnRcIixcInRlbXBsYXRlXCI6XCIuL2RvY3VtZW50LnB1Z1wiLFwibG9naWNcIjpcIi4vRG9jdW1lbnQuanNcIn0sXG5cdHRlbXBsYXRlUHJvdmlkZXJOYW1lOiAncHVnJyxcblx0Y29tcGlsZWRUZW1wbGF0ZTogJ2Z1bmN0aW9uIHB1Z19yZXRocm93KG4sZSxyLHQpe2lmKCEobiBpbnN0YW5jZW9mIEVycm9yKSl0aHJvdyBuO2lmKCEoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHdpbmRvdyYmZXx8dCkpdGhyb3cgbi5tZXNzYWdlKz1cIiBvbiBsaW5lIFwiK3Isbjt0cnl7dD10fHxyZXF1aXJlKFwiZnNcIikucmVhZEZpbGVTeW5jKGUsXCJ1dGY4XCIpfWNhdGNoKGUpe3B1Z19yZXRocm93KG4sbnVsbCxyKX12YXIgaT0zLGE9dC5zcGxpdChcIlxcXFxuXCIpLG89TWF0aC5tYXgoci1pLDApLGg9TWF0aC5taW4oYS5sZW5ndGgscitpKSxpPWEuc2xpY2UobyxoKS5tYXAoZnVuY3Rpb24obixlKXt2YXIgdD1lK28rMTtyZXR1cm4odD09cj9cIiAgPiBcIjpcIiAgICBcIikrdCtcInwgXCIrbn0pLmpvaW4oXCJcXFxcblwiKTt0aHJvdyBuLnBhdGg9ZSxuLm1lc3NhZ2U9KGV8fFwiUHVnXCIpK1wiOlwiK3IrXCJcXFxcblwiK2krXCJcXFxcblxcXFxuXCIrbi5tZXNzYWdlLG59ZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3ZhciBwdWdfZGVidWdfZmlsZW5hbWUsIHB1Z19kZWJ1Z19saW5lO3RyeSB7O3B1Z19kZWJ1Z19saW5lID0gMTtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0MhRE9DVFlQRSBodG1sXFxcXHUwMDNFXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMjtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0NodG1sXFxcXHUwMDNFXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMztcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0NoZWFkXFxcXHUwMDNFXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gNDtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0NzdHlsZSB0eXBlPVxcXFxcInRleHRcXFxcdTAwMkZjc3NcXFxcXCJcXFxcdTAwM0VcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSA1O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcImJvZHkge1wiO1xcbjtwdWdfZGVidWdfbGluZSA9IDY7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXG5cIjtcXG47cHVnX2RlYnVnX2xpbmUgPSA2O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIiAgcGFkZGluZzogMjBweDtcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSA3O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFxuXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gNztcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJ9XCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gODtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcblwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDg7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gOTtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcblwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDk7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiLmZlZWQge1wiO1xcbjtwdWdfZGVidWdfbGluZSA9IDEwO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFxuXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMTA7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiICBtYXJnaW46IDAgYXV0bztcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAxMTtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcblwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDExO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIiAgd2lkdGg6IDYwMHB4O1wiO1xcbjtwdWdfZGVidWdfbGluZSA9IDEyO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFxuXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMTI7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwifVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDEzO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFxuXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMTM7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMTQ7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXG5cIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAxNDtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCIucmV2aWV3LWJsb2NrLCAuY29tbWVudC1ibG9jayB7XCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMTU7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXG5cIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAxNTtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCIgIG1hcmdpbi1ib3R0b206IDIwcHg7XCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMTY7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXG5cIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAxNjtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJ9XCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMTc7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXG5cIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAxNztcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAxODtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcblwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDE4O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIi5jb21tZW50cy1ibG9jayB7XCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMTk7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXG5cIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAxOTtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCIgIG1hcmdpbi10b3A6IDEwcHg7XCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMjA7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXG5cIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAyMDtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCIgIG1hcmdpbi1sZWZ0OiA0MHB4O1wiO1xcbjtwdWdfZGVidWdfbGluZSA9IDIxO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFxuXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMjE7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwifVxcXFx1MDAzQ1xcXFx1MDAyRnN0eWxlXFxcXHUwMDNFXFxcXHUwMDNDXFxcXHUwMDJGaGVhZFxcXFx1MDAzRVxcXFx1MDAzQ1xcXFx1MDAyRmh0bWxcXFxcdTAwM0VcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAyMjtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0Nib2R5XFxcXHUwMDNFXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMjM7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDY2F0LWZlZWQgY2F0LXN0b3JlPVxcXFxcIkZlZWRcXFxcXCJcXFxcdTAwM0VcXFxcdTAwM0NcXFxcdTAwMkZjYXQtZmVlZFxcXFx1MDAzRVxcXFx1MDAzQ1xcXFx1MDAyRmJvZHlcXFxcdTAwM0VcIjt9IGNhdGNoIChlcnIpIHtwdWdfcmV0aHJvdyhlcnIsIHB1Z19kZWJ1Z19maWxlbmFtZSwgcHVnX2RlYnVnX2xpbmUpO307cmV0dXJuIHB1Z19odG1sO30nLFxuXHRlcnJvclRlbXBsYXRlUHJvdmlkZXJOYW1lOiBudWxsLFxuXHRjb21waWxlZEVycm9yVGVtcGxhdGU6IG51bGxcbn0sXG57XG5cdG5hbWU6ICdmZWVkJyxcblx0Y29uc3RydWN0b3I6IHJlcXVpcmUoJy4vY2F0YmVycnlfY29tcG9uZW50cy9mZWVkL2luZGV4LmpzJyksXG5cdHByb3BlcnRpZXM6IHtcIm5hbWVcIjpcImZlZWRcIixcInRlbXBsYXRlXCI6XCIuL3RlbXBsYXRlLnB1Z1wiLFwiZXJyb3JUZW1wbGF0ZVwiOlwiLi9lcnJvci5wdWdcIixcImxvZ2ljXCI6XCJpbmRleC5qc1wifSxcblx0dGVtcGxhdGVQcm92aWRlck5hbWU6ICdwdWcnLFxuXHRjb21waWxlZFRlbXBsYXRlOiAnZnVuY3Rpb24gcHVnX2F0dHIodCxlLG4sZil7cmV0dXJuIGUhPT0hMSYmbnVsbCE9ZSYmKGV8fFwiY2xhc3NcIiE9PXQmJlwic3R5bGVcIiE9PXQpP2U9PT0hMD9cIiBcIisoZj90OnQrXFwnPVwiXFwnK3QrXFwnXCJcXCcpOihcImZ1bmN0aW9uXCI9PXR5cGVvZiBlLnRvSlNPTiYmKGU9ZS50b0pTT04oKSksXCJzdHJpbmdcIj09dHlwZW9mIGV8fChlPUpTT04uc3RyaW5naWZ5KGUpLG58fGUuaW5kZXhPZihcXCdcIlxcJyk9PT0tMSk/KG4mJihlPXB1Z19lc2NhcGUoZSkpLFwiIFwiK3QrXFwnPVwiXFwnK2UrXFwnXCJcXCcpOlwiIFwiK3QrXCI9XFwnXCIrZS5yZXBsYWNlKC9cXCcvZyxcIiYjMzk7XCIpK1wiXFwnXCIpOlwiXCJ9XFxuZnVuY3Rpb24gcHVnX2VzY2FwZShlKXt2YXIgYT1cIlwiK2UsdD1wdWdfbWF0Y2hfaHRtbC5leGVjKGEpO2lmKCF0KXJldHVybiBlO3ZhciByLGMsbixzPVwiXCI7Zm9yKHI9dC5pbmRleCxjPTA7cjxhLmxlbmd0aDtyKyspe3N3aXRjaChhLmNoYXJDb2RlQXQocikpe2Nhc2UgMzQ6bj1cIiZxdW90O1wiO2JyZWFrO2Nhc2UgMzg6bj1cIiZhbXA7XCI7YnJlYWs7Y2FzZSA2MDpuPVwiJmx0O1wiO2JyZWFrO2Nhc2UgNjI6bj1cIiZndDtcIjticmVhaztkZWZhdWx0OmNvbnRpbnVlfWMhPT1yJiYocys9YS5zdWJzdHJpbmcoYyxyKSksYz1yKzEscys9bn1yZXR1cm4gYyE9PXI/cythLnN1YnN0cmluZyhjLHIpOnN9XFxudmFyIHB1Z19tYXRjaF9odG1sPS9bXCImPD5dLztcXG5mdW5jdGlvbiBwdWdfcmV0aHJvdyhuLGUscix0KXtpZighKG4gaW5zdGFuY2VvZiBFcnJvcikpdGhyb3cgbjtpZighKFwidW5kZWZpbmVkXCI9PXR5cGVvZiB3aW5kb3cmJmV8fHQpKXRocm93IG4ubWVzc2FnZSs9XCIgb24gbGluZSBcIityLG47dHJ5e3Q9dHx8cmVxdWlyZShcImZzXCIpLnJlYWRGaWxlU3luYyhlLFwidXRmOFwiKX1jYXRjaChlKXtwdWdfcmV0aHJvdyhuLG51bGwscil9dmFyIGk9MyxhPXQuc3BsaXQoXCJcXFxcblwiKSxvPU1hdGgubWF4KHItaSwwKSxoPU1hdGgubWluKGEubGVuZ3RoLHIraSksaT1hLnNsaWNlKG8saCkubWFwKGZ1bmN0aW9uKG4sZSl7dmFyIHQ9ZStvKzE7cmV0dXJuKHQ9PXI/XCIgID4gXCI6XCIgICAgXCIpK3QrXCJ8IFwiK259KS5qb2luKFwiXFxcXG5cIik7dGhyb3cgbi5wYXRoPWUsbi5tZXNzYWdlPShlfHxcIlB1Z1wiKStcIjpcIityK1wiXFxcXG5cIitpK1wiXFxcXG5cXFxcblwiK24ubWVzc2FnZSxufWZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDt2YXIgcHVnX2RlYnVnX2ZpbGVuYW1lLCBwdWdfZGVidWdfbGluZTt0cnkgezt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChyZXZpZXdzKSB7O3B1Z19kZWJ1Z19saW5lID0gMTtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0NkaXYgY2xhc3M9XFxcXFwiZmVlZFxcXFxcIlxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDI7XFxuLy8gaXRlcmF0ZSByZXZpZXdzXFxuOyhmdW5jdGlvbigpe1xcbiAgdmFyICRvYmogPSByZXZpZXdzO1xcbiAgaWYgKFxcJ251bWJlclxcJyA9PSB0eXBlb2YgJG9iai5sZW5ndGgpIHtcXG4gICAgICBmb3IgKHZhciBwdWdfaW5kZXgwID0gMCwgJGwgPSAkb2JqLmxlbmd0aDsgcHVnX2luZGV4MCA8ICRsOyBwdWdfaW5kZXgwKyspIHtcXG4gICAgICAgIHZhciByZXZpZXcgPSAkb2JqW3B1Z19pbmRleDBdO1xcbjtwdWdfZGVidWdfbGluZSA9IDM7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDY2F0LXJldmlld1wiICsgKHB1Z19hdHRyKFwicmV2aWV3LWlkXCIsIHJldmlldy5pZCwgdHJ1ZSwgZmFsc2UpK1wiIGNhdC1zdG9yZT1cXFxcXCJGZWVkXFxcXFwiXCIpICsgXCJcXFxcdTAwM0VcXFxcdTAwM0NcXFxcdTAwMkZjYXQtcmV2aWV3XFxcXHUwMDNFXCI7XFxuICAgICAgfVxcbiAgfSBlbHNlIHtcXG4gICAgdmFyICRsID0gMDtcXG4gICAgZm9yICh2YXIgcHVnX2luZGV4MCBpbiAkb2JqKSB7XFxuICAgICAgJGwrKztcXG4gICAgICB2YXIgcmV2aWV3ID0gJG9ialtwdWdfaW5kZXgwXTtcXG47cHVnX2RlYnVnX2xpbmUgPSAzO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFx1MDAzQ2NhdC1yZXZpZXdcIiArIChwdWdfYXR0cihcInJldmlldy1pZFwiLCByZXZpZXcuaWQsIHRydWUsIGZhbHNlKStcIiBjYXQtc3RvcmU9XFxcXFwiRmVlZFxcXFxcIlwiKSArIFwiXFxcXHUwMDNFXFxcXHUwMDNDXFxcXHUwMDJGY2F0LXJldmlld1xcXFx1MDAzRVwiO1xcbiAgICB9XFxuICB9XFxufSkuY2FsbCh0aGlzKTtcXG5cXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0NcXFxcdTAwMkZkaXZcXFxcdTAwM0VcIjt9LmNhbGwodGhpcyxcInJldmlld3NcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnJldmlld3M6dHlwZW9mIHJldmlld3MhPT1cInVuZGVmaW5lZFwiP3Jldmlld3M6dW5kZWZpbmVkKSk7fSBjYXRjaCAoZXJyKSB7cHVnX3JldGhyb3coZXJyLCBwdWdfZGVidWdfZmlsZW5hbWUsIHB1Z19kZWJ1Z19saW5lKTt9O3JldHVybiBwdWdfaHRtbDt9Jyxcblx0ZXJyb3JUZW1wbGF0ZVByb3ZpZGVyTmFtZTogJ3B1ZycsXG5cdGNvbXBpbGVkRXJyb3JUZW1wbGF0ZTogJ2Z1bmN0aW9uIHB1Z19yZXRocm93KG4sZSxyLHQpe2lmKCEobiBpbnN0YW5jZW9mIEVycm9yKSl0aHJvdyBuO2lmKCEoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHdpbmRvdyYmZXx8dCkpdGhyb3cgbi5tZXNzYWdlKz1cIiBvbiBsaW5lIFwiK3Isbjt0cnl7dD10fHxyZXF1aXJlKFwiZnNcIikucmVhZEZpbGVTeW5jKGUsXCJ1dGY4XCIpfWNhdGNoKGUpe3B1Z19yZXRocm93KG4sbnVsbCxyKX12YXIgaT0zLGE9dC5zcGxpdChcIlxcXFxuXCIpLG89TWF0aC5tYXgoci1pLDApLGg9TWF0aC5taW4oYS5sZW5ndGgscitpKSxpPWEuc2xpY2UobyxoKS5tYXAoZnVuY3Rpb24obixlKXt2YXIgdD1lK28rMTtyZXR1cm4odD09cj9cIiAgPiBcIjpcIiAgICBcIikrdCtcInwgXCIrbn0pLmpvaW4oXCJcXFxcblwiKTt0aHJvdyBuLnBhdGg9ZSxuLm1lc3NhZ2U9KGV8fFwiUHVnXCIpK1wiOlwiK3IrXCJcXFxcblwiK2krXCJcXFxcblxcXFxuXCIrbi5tZXNzYWdlLG59ZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3ZhciBwdWdfZGVidWdfZmlsZW5hbWUsIHB1Z19kZWJ1Z19saW5lO3RyeSB7fSBjYXRjaCAoZXJyKSB7cHVnX3JldGhyb3coZXJyLCBwdWdfZGVidWdfZmlsZW5hbWUsIHB1Z19kZWJ1Z19saW5lKTt9O3JldHVybiBwdWdfaHRtbDt9J1xufSxcbntcblx0bmFtZTogJ2hlYWQnLFxuXHRjb25zdHJ1Y3RvcjogcmVxdWlyZSgnLi9jYXRiZXJyeV9jb21wb25lbnRzL2hlYWQvSGVhZC5qcycpLFxuXHRwcm9wZXJ0aWVzOiB7XCJuYW1lXCI6XCJoZWFkXCIsXCJ0ZW1wbGF0ZVwiOlwiLi9oZWFkLnB1Z1wiLFwibG9naWNcIjpcIi4vSGVhZC5qc1wifSxcblx0dGVtcGxhdGVQcm92aWRlck5hbWU6ICdwdWcnLFxuXHRjb21waWxlZFRlbXBsYXRlOiAnZnVuY3Rpb24gcHVnX2VzY2FwZShlKXt2YXIgYT1cIlwiK2UsdD1wdWdfbWF0Y2hfaHRtbC5leGVjKGEpO2lmKCF0KXJldHVybiBlO3ZhciByLGMsbixzPVwiXCI7Zm9yKHI9dC5pbmRleCxjPTA7cjxhLmxlbmd0aDtyKyspe3N3aXRjaChhLmNoYXJDb2RlQXQocikpe2Nhc2UgMzQ6bj1cIiZxdW90O1wiO2JyZWFrO2Nhc2UgMzg6bj1cIiZhbXA7XCI7YnJlYWs7Y2FzZSA2MDpuPVwiJmx0O1wiO2JyZWFrO2Nhc2UgNjI6bj1cIiZndDtcIjticmVhaztkZWZhdWx0OmNvbnRpbnVlfWMhPT1yJiYocys9YS5zdWJzdHJpbmcoYyxyKSksYz1yKzEscys9bn1yZXR1cm4gYyE9PXI/cythLnN1YnN0cmluZyhjLHIpOnN9XFxudmFyIHB1Z19tYXRjaF9odG1sPS9bXCImPD5dLztcXG5mdW5jdGlvbiBwdWdfcmV0aHJvdyhuLGUscix0KXtpZighKG4gaW5zdGFuY2VvZiBFcnJvcikpdGhyb3cgbjtpZighKFwidW5kZWZpbmVkXCI9PXR5cGVvZiB3aW5kb3cmJmV8fHQpKXRocm93IG4ubWVzc2FnZSs9XCIgb24gbGluZSBcIityLG47dHJ5e3Q9dHx8cmVxdWlyZShcImZzXCIpLnJlYWRGaWxlU3luYyhlLFwidXRmOFwiKX1jYXRjaChlKXtwdWdfcmV0aHJvdyhuLG51bGwscil9dmFyIGk9MyxhPXQuc3BsaXQoXCJcXFxcblwiKSxvPU1hdGgubWF4KHItaSwwKSxoPU1hdGgubWluKGEubGVuZ3RoLHIraSksaT1hLnNsaWNlKG8saCkubWFwKGZ1bmN0aW9uKG4sZSl7dmFyIHQ9ZStvKzE7cmV0dXJuKHQ9PXI/XCIgID4gXCI6XCIgICAgXCIpK3QrXCJ8IFwiK259KS5qb2luKFwiXFxcXG5cIik7dGhyb3cgbi5wYXRoPWUsbi5tZXNzYWdlPShlfHxcIlB1Z1wiKStcIjpcIityK1wiXFxcXG5cIitpK1wiXFxcXG5cXFxcblwiK24ubWVzc2FnZSxufWZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDt2YXIgcHVnX2RlYnVnX2ZpbGVuYW1lLCBwdWdfZGVidWdfbGluZTt0cnkgezt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uICh0aXRsZSkgeztwdWdfZGVidWdfbGluZSA9IDE7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDbWV0YSBjaGFyc2V0PVxcXFxcIlVURi04XFxcXFwiXFxcXHUwMDJGXFxcXHUwMDNFXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMjtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0N0aXRsZVxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDI7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIChwdWdfZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aXRsZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXFxcdTAwM0NcXFxcdTAwMkZ0aXRsZVxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDM7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDc2NyaXB0IHNyYz1cXFxcXCJleHRlcm5hbHMuanNcXFxcXCJcXFxcdTAwM0VcXFxcdTAwM0NcXFxcdTAwMkZzY3JpcHRcXFxcdTAwM0VcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSA0O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFx1MDAzQ3NjcmlwdCBzcmM9XFxcXFwiYXBwLmpzXFxcXFwiXFxcXHUwMDNFXFxcXHUwMDNDXFxcXHUwMDJGc2NyaXB0XFxcXHUwMDNFXCI7fS5jYWxsKHRoaXMsXCJ0aXRsZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudGl0bGU6dHlwZW9mIHRpdGxlIT09XCJ1bmRlZmluZWRcIj90aXRsZTp1bmRlZmluZWQpKTt9IGNhdGNoIChlcnIpIHtwdWdfcmV0aHJvdyhlcnIsIHB1Z19kZWJ1Z19maWxlbmFtZSwgcHVnX2RlYnVnX2xpbmUpO307cmV0dXJuIHB1Z19odG1sO30nLFxuXHRlcnJvclRlbXBsYXRlUHJvdmlkZXJOYW1lOiBudWxsLFxuXHRjb21waWxlZEVycm9yVGVtcGxhdGU6IG51bGxcbn0sXG57XG5cdG5hbWU6ICdyZXZpZXcnLFxuXHRjb25zdHJ1Y3RvcjogcmVxdWlyZSgnLi9jYXRiZXJyeV9jb21wb25lbnRzL3Jldmlldy9pbmRleC5qcycpLFxuXHRwcm9wZXJ0aWVzOiB7XCJuYW1lXCI6XCJyZXZpZXdcIixcInRlbXBsYXRlXCI6XCIuL3RlbXBsYXRlLnB1Z1wiLFwiZXJyb3JUZW1wbGF0ZVwiOlwiLi9lcnJvci5wdWdcIixcImxvZ2ljXCI6XCJpbmRleC5qc1wifSxcblx0dGVtcGxhdGVQcm92aWRlck5hbWU6ICdwdWcnLFxuXHRjb21waWxlZFRlbXBsYXRlOiAnZnVuY3Rpb24gcHVnX2F0dHIodCxlLG4sZil7cmV0dXJuIGUhPT0hMSYmbnVsbCE9ZSYmKGV8fFwiY2xhc3NcIiE9PXQmJlwic3R5bGVcIiE9PXQpP2U9PT0hMD9cIiBcIisoZj90OnQrXFwnPVwiXFwnK3QrXFwnXCJcXCcpOihcImZ1bmN0aW9uXCI9PXR5cGVvZiBlLnRvSlNPTiYmKGU9ZS50b0pTT04oKSksXCJzdHJpbmdcIj09dHlwZW9mIGV8fChlPUpTT04uc3RyaW5naWZ5KGUpLG58fGUuaW5kZXhPZihcXCdcIlxcJyk9PT0tMSk/KG4mJihlPXB1Z19lc2NhcGUoZSkpLFwiIFwiK3QrXFwnPVwiXFwnK2UrXFwnXCJcXCcpOlwiIFwiK3QrXCI9XFwnXCIrZS5yZXBsYWNlKC9cXCcvZyxcIiYjMzk7XCIpK1wiXFwnXCIpOlwiXCJ9XFxuZnVuY3Rpb24gcHVnX2VzY2FwZShlKXt2YXIgYT1cIlwiK2UsdD1wdWdfbWF0Y2hfaHRtbC5leGVjKGEpO2lmKCF0KXJldHVybiBlO3ZhciByLGMsbixzPVwiXCI7Zm9yKHI9dC5pbmRleCxjPTA7cjxhLmxlbmd0aDtyKyspe3N3aXRjaChhLmNoYXJDb2RlQXQocikpe2Nhc2UgMzQ6bj1cIiZxdW90O1wiO2JyZWFrO2Nhc2UgMzg6bj1cIiZhbXA7XCI7YnJlYWs7Y2FzZSA2MDpuPVwiJmx0O1wiO2JyZWFrO2Nhc2UgNjI6bj1cIiZndDtcIjticmVhaztkZWZhdWx0OmNvbnRpbnVlfWMhPT1yJiYocys9YS5zdWJzdHJpbmcoYyxyKSksYz1yKzEscys9bn1yZXR1cm4gYyE9PXI/cythLnN1YnN0cmluZyhjLHIpOnN9XFxudmFyIHB1Z19tYXRjaF9odG1sPS9bXCImPD5dLztcXG5mdW5jdGlvbiBwdWdfcmV0aHJvdyhuLGUscix0KXtpZighKG4gaW5zdGFuY2VvZiBFcnJvcikpdGhyb3cgbjtpZighKFwidW5kZWZpbmVkXCI9PXR5cGVvZiB3aW5kb3cmJmV8fHQpKXRocm93IG4ubWVzc2FnZSs9XCIgb24gbGluZSBcIityLG47dHJ5e3Q9dHx8cmVxdWlyZShcImZzXCIpLnJlYWRGaWxlU3luYyhlLFwidXRmOFwiKX1jYXRjaChlKXtwdWdfcmV0aHJvdyhuLG51bGwscil9dmFyIGk9MyxhPXQuc3BsaXQoXCJcXFxcblwiKSxvPU1hdGgubWF4KHItaSwwKSxoPU1hdGgubWluKGEubGVuZ3RoLHIraSksaT1hLnNsaWNlKG8saCkubWFwKGZ1bmN0aW9uKG4sZSl7dmFyIHQ9ZStvKzE7cmV0dXJuKHQ9PXI/XCIgID4gXCI6XCIgICAgXCIpK3QrXCJ8IFwiK259KS5qb2luKFwiXFxcXG5cIik7dGhyb3cgbi5wYXRoPWUsbi5tZXNzYWdlPShlfHxcIlB1Z1wiKStcIjpcIityK1wiXFxcXG5cIitpK1wiXFxcXG5cXFxcblwiK24ubWVzc2FnZSxufWZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDt2YXIgcHVnX2RlYnVnX2ZpbGVuYW1lLCBwdWdfZGVidWdfbGluZTt0cnkgezt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChyZXZpZXcpIHs7cHVnX2RlYnVnX2xpbmUgPSAxO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFx1MDAzQ2RpdiBjbGFzcz1cXFxcXCJyZXZpZXctYmxvY2tcXFxcXCJcXFxcdTAwM0VcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAyO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFx1MDAzQ3BcXFxcdTAwM0VcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAyO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyAocHVnX2VzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gcmV2aWV3LnRleHQpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFxcXHUwMDNDXFxcXHUwMDJGcFxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDQ7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDZGl2IGNsYXNzPVxcXFxcImNvbW1lbnRzLWJsb2NrXFxcXFwiXFxcXHUwMDNFXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gNTtcXG4vLyBpdGVyYXRlIHJldmlldy5jb21tZW50c1xcbjsoZnVuY3Rpb24oKXtcXG4gIHZhciAkb2JqID0gcmV2aWV3LmNvbW1lbnRzO1xcbiAgaWYgKFxcJ251bWJlclxcJyA9PSB0eXBlb2YgJG9iai5sZW5ndGgpIHtcXG4gICAgICBmb3IgKHZhciBwdWdfaW5kZXgwID0gMCwgJGwgPSAkb2JqLmxlbmd0aDsgcHVnX2luZGV4MCA8ICRsOyBwdWdfaW5kZXgwKyspIHtcXG4gICAgICAgIHZhciBjb21tZW50ID0gJG9ialtwdWdfaW5kZXgwXTtcXG47cHVnX2RlYnVnX2xpbmUgPSA2O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFx1MDAzQ2NhdC1jb21tZW50XCIgKyAocHVnX2F0dHIoXCJjb21tZW50LWlkXCIsIGNvbW1lbnQuaWQsIHRydWUsIGZhbHNlKStcIiBjYXQtc3RvcmU9XFxcXFwiRmVlZFxcXFxcIlwiKSArIFwiXFxcXHUwMDNFXFxcXHUwMDNDXFxcXHUwMDJGY2F0LWNvbW1lbnRcXFxcdTAwM0VcIjtcXG4gICAgICB9XFxuICB9IGVsc2Uge1xcbiAgICB2YXIgJGwgPSAwO1xcbiAgICBmb3IgKHZhciBwdWdfaW5kZXgwIGluICRvYmopIHtcXG4gICAgICAkbCsrO1xcbiAgICAgIHZhciBjb21tZW50ID0gJG9ialtwdWdfaW5kZXgwXTtcXG47cHVnX2RlYnVnX2xpbmUgPSA2O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFx1MDAzQ2NhdC1jb21tZW50XCIgKyAocHVnX2F0dHIoXCJjb21tZW50LWlkXCIsIGNvbW1lbnQuaWQsIHRydWUsIGZhbHNlKStcIiBjYXQtc3RvcmU9XFxcXFwiRmVlZFxcXFxcIlwiKSArIFwiXFxcXHUwMDNFXFxcXHUwMDNDXFxcXHUwMDJGY2F0LWNvbW1lbnRcXFxcdTAwM0VcIjtcXG4gICAgfVxcbiAgfVxcbn0pLmNhbGwodGhpcyk7XFxuXFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDXFxcXHUwMDJGZGl2XFxcXHUwMDNFXFxcXHUwMDNDXFxcXHUwMDJGZGl2XFxcXHUwMDNFXCI7fS5jYWxsKHRoaXMsXCJyZXZpZXdcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnJldmlldzp0eXBlb2YgcmV2aWV3IT09XCJ1bmRlZmluZWRcIj9yZXZpZXc6dW5kZWZpbmVkKSk7fSBjYXRjaCAoZXJyKSB7cHVnX3JldGhyb3coZXJyLCBwdWdfZGVidWdfZmlsZW5hbWUsIHB1Z19kZWJ1Z19saW5lKTt9O3JldHVybiBwdWdfaHRtbDt9Jyxcblx0ZXJyb3JUZW1wbGF0ZVByb3ZpZGVyTmFtZTogJ3B1ZycsXG5cdGNvbXBpbGVkRXJyb3JUZW1wbGF0ZTogJ2Z1bmN0aW9uIHB1Z19yZXRocm93KG4sZSxyLHQpe2lmKCEobiBpbnN0YW5jZW9mIEVycm9yKSl0aHJvdyBuO2lmKCEoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHdpbmRvdyYmZXx8dCkpdGhyb3cgbi5tZXNzYWdlKz1cIiBvbiBsaW5lIFwiK3Isbjt0cnl7dD10fHxyZXF1aXJlKFwiZnNcIikucmVhZEZpbGVTeW5jKGUsXCJ1dGY4XCIpfWNhdGNoKGUpe3B1Z19yZXRocm93KG4sbnVsbCxyKX12YXIgaT0zLGE9dC5zcGxpdChcIlxcXFxuXCIpLG89TWF0aC5tYXgoci1pLDApLGg9TWF0aC5taW4oYS5sZW5ndGgscitpKSxpPWEuc2xpY2UobyxoKS5tYXAoZnVuY3Rpb24obixlKXt2YXIgdD1lK28rMTtyZXR1cm4odD09cj9cIiAgPiBcIjpcIiAgICBcIikrdCtcInwgXCIrbn0pLmpvaW4oXCJcXFxcblwiKTt0aHJvdyBuLnBhdGg9ZSxuLm1lc3NhZ2U9KGV8fFwiUHVnXCIpK1wiOlwiK3IrXCJcXFxcblwiK2krXCJcXFxcblxcXFxuXCIrbi5tZXNzYWdlLG59ZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3ZhciBwdWdfZGVidWdfZmlsZW5hbWUsIHB1Z19kZWJ1Z19saW5lO3RyeSB7fSBjYXRjaCAoZXJyKSB7cHVnX3JldGhyb3coZXJyLCBwdWdfZGVidWdfZmlsZW5hbWUsIHB1Z19kZWJ1Z19saW5lKTt9O3JldHVybiBwdWdfaHRtbDt9J1xufVxuXG5dO1xuXG5jb25zdCByb3V0ZURlZmluaXRpb25zID0gcmVxdWlyZSgnLi9yb3V0ZXMuanMnKSB8fCBbXTtcbmNvbnN0IHJvdXRlRGVzY3JpcHRvcnMgPSBbe1wiZXhwcmVzc2lvblwiOlwiL1wiLFwicGF0aFBhcmFtZXRlcnNcIjpbXSxcInF1ZXJ5UGFyYW1ldGVyc1wiOltdLFwicGF0aFJlZ0V4cFNvdXJjZVwiOlwiXi8kXCJ9XSB8fCBbXTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHN0b3Jlcyxcblx0Y29tcG9uZW50cyxcblx0cm91dGVEZWZpbml0aW9ucyxcblx0cm91dGVEZXNjcmlwdG9yc1xufTtcbiJdfQ==
