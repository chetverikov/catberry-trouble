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

},{"./config/environment.json":12,"catberry":"catberry","catberry-logger":undefined,"catberry-pug":undefined,"catberry-uhr":undefined}],2:[function(require,module,exports){
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
      return this.$context.getStoreData().then(function (comment) {
        return { comment: comment };
      });
    }
  }, {
    key: 'bind',
    value: function bind() {
      var _this = this;

      return {
        click: {
          button: function button() {
            _this.$context.sendAction('like');
          }
        }
      };
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
      this.$context.locator.resolve('logger').info('Review render');

      return this.$context.getStoreData();
    }
  }]);

  return Review;
}();

module.exports = Review;

},{}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DynamicComment = function () {
  function DynamicComment() {
    _classCallCheck(this, DynamicComment);
  }

  _createClass(DynamicComment, [{
    key: 'load',
    value: function load() {
      var commentId = this.$context.params['comment-id'];
      var reviewStoreInstanceId = this.$context.params['instance-id'];

      return this.$context.getStoreData('Dynamic/Review', reviewStoreInstanceId).then(function (data) {
        return data.review.comments.find(function (comment) {
          return comment.id === commentId;
        });
      });
    }
  }, {
    key: 'handleLike',
    value: function handleLike() {
      var _this = this;

      var commentId = this.$context.params['comment-id'];
      var reviewStoreInstanceId = this.$context.params['instance-id'];

      this.$context.getStoreData('Dynamic/Review', reviewStoreInstanceId).then(function (data) {
        console.log(data);
        var comment = data.review.comments.find(function (comment) {
          return comment.id === commentId;
        });

        return _this.$context.sendAction({
          storeName: 'Dynamic/Review',
          storeInstanceId: reviewStoreInstanceId
        }, 'refresh-comment', {
          commentId: commentId,
          data: {
            like: comment.like + 1
          }
        });
      });
    }
  }]);

  return DynamicComment;
}();

module.exports = DynamicComment;

},{}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DynamicReview = function () {
  function DynamicReview() {
    _classCallCheck(this, DynamicReview);

    this.$context.setDependency('Feed');
  }

  _createClass(DynamicReview, [{
    key: 'load',
    value: function load() {
      var _this = this;

      var reviewId = this.$context.params['review-id'];
      console.log(reviewId);
      return this.$context.getStoreData('Feed').then(function (_ref) {
        var hashWithReviews = _ref.hashWithReviews;
        return {
          review: hashWithReviews[reviewId],
          reviewStoreInstanceId: _this.$context.storeInstanceId
        };
      });
    }
  }, {
    key: 'handleRefreshComment',
    value: function handleRefreshComment(_ref2) {
      var _this2 = this;

      var commentId = _ref2.commentId,
          data = _ref2.data;

      var reviewId = this.$context.params['review-id'];

      return this.$context.sendAction('Feed', 'update-comment', { reviewId: reviewId, commentId: commentId, data: data }).then(function () {
        return _this2.$context.changed();
      });
    }
  }]);

  return DynamicReview;
}();

module.exports = DynamicReview;

},{}],9:[function(require,module,exports){
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
    value: function handleUpdateReview(reviewId, data) {
      Object.assign(this.hashWithReviews[reviewId], data);
    }
  }, {
    key: 'handleUpdateComment',
    value: function handleUpdateComment(commentId, data) {
      Object.assign(this.hashWithComments[commentId], data);
    }
  }]);

  return Feed;
}();

module.exports = Feed;

},{"./fakeFeed.json":11}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
module.exports=[
  {
    "id": "faba08c9-83b8-4dd6-8e5d-c4e08d837605",
    "text": "Quo eligendi quod facere et dolor et voluptatibus. Illo facilis occaecati facere omnis omnis voluptatem ad deleniti ut. Molestias et id repellat dolor tenetur harum eum voluptatum. Consequatur tempore voluptate suscipit fuga.",
    "comments": [
      {
        "id": "c6156287-0d06-433c-9829-48f9ca4db99e",
        "text": "molestiae qui et",
        "likes": 0
      },
      {
        "id": "c6156287-0d06-433c-9829-48f9ca4db99e",
        "text": "molestiae qui et",
        "likes": 0
      }
    ]
  },
  {
    "id": "3d56cd54-0bdb-470b-bfe7-baa5d6ee1bf5",
    "text": "Aut quasi necessitatibus quia necessitatibus officia eum ratione recusandae praesentium. Dolorem est numquam et. Enim aut sunt eum nihil excepturi perferendis sit reiciendis.",
    "comments": [
      {
        "id": "c6156287-0d06-433c-9829-48f9ca4db99e",
        "text": "molestiae qui et",
        "likes": 0
      }
    ]
  }
]

},{}],12:[function(require,module,exports){
module.exports={
	"title": "Catberry Project",
	"logger": {
		"level": 0
	}
}

},{}],13:[function(require,module,exports){
'use strict';

module.exports = ['/'];

},{}],"appDefinitions":[function(require,module,exports){


'use strict';

var stores = [{ name: 'Feed', constructor: require('./catberry_stores/Feed.js') }, { name: 'Main', constructor: require('./catberry_stores/Main.js') }, { name: 'Dynamic/Comment', constructor: require('./catberry_stores/Dynamic/Comment.js') }, { name: 'Dynamic/Review', constructor: require('./catberry_stores/Dynamic/Review.js') }];

var components = [{
	name: 'comment',
	constructor: require('./catberry_components/comment/index.js'),
	properties: { "name": "comment", "template": "./template.pug", "errorTemplate": "./error.pug", "logic": "index.js" },
	templateProviderName: 'pug',
	compiledTemplate: 'function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}\nvar pug_match_html=/["&<>]/;\nfunction pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\\n"+i+"\\n\\n"+n.message,n}function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {;var locals_for_with = (locals || {});(function (comment) {;pug_debug_line = 1;\npug_html = pug_html + "\\u003Cdiv class=\\"comment-block\\"\\u003E";\n;pug_debug_line = 2;\npug_html = pug_html + "\\u003Cp\\u003E";\n;pug_debug_line = 2;\npug_html = pug_html + (pug_escape(null == (pug_interp = comment.text) ? "" : pug_interp)) + "\\u003C\\u002Fp\\u003E";\n;pug_debug_line = 3;\npug_html = pug_html + "\\u003Cdiv class=\\"comment-likes\\"\\u003E";\n;pug_debug_line = 3;\npug_html = pug_html + (pug_escape(null == (pug_interp = comment.likes) ? "" : pug_interp)) + "\\u003C\\u002Fdiv\\u003E";\n;pug_debug_line = 4;\npug_html = pug_html + "\\u003Cbutton\\u003E";\n;pug_debug_line = 4;\npug_html = pug_html + "Like!\\u003C\\u002Fbutton\\u003E\\u003C\\u002Fdiv\\u003E";}.call(this,"comment" in locals_for_with?locals_for_with.comment:typeof comment!=="undefined"?comment:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}',
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
	compiledTemplate: 'function pug_attr(t,e,n,f){return e!==!1&&null!=e&&(e||"class"!==t&&"style"!==t)?e===!0?" "+(f?t:t+\'="\'+t+\'"\'):("function"==typeof e.toJSON&&(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||e.indexOf(\'"\')===-1)?(n&&(e=pug_escape(e))," "+t+\'="\'+e+\'"\'):" "+t+"=\'"+e.replace(/\'/g,"&#39;")+"\'"):""}\nfunction pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}\nvar pug_match_html=/["&<>]/;\nfunction pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\\n"+i+"\\n\\n"+n.message,n}function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {;var locals_for_with = (locals || {});(function (reviews) {;pug_debug_line = 1;\npug_html = pug_html + "\\u003Cdiv class=\\"feed\\"\\u003E";\n;pug_debug_line = 2;\n// iterate reviews\n;(function(){\n  var $obj = reviews;\n  if (\'number\' == typeof $obj.length) {\n      for (var pug_index0 = 0, $l = $obj.length; pug_index0 < $l; pug_index0++) {\n        var review = $obj[pug_index0];\n;pug_debug_line = 3;\npug_html = pug_html + "\\u003Ccat-review" + (" cat-store=\\"Dynamic\\u002FReview\\""+pug_attr("cat-store-param-review-id", review.id, true, false)) + "\\u003E\\u003C\\u002Fcat-review\\u003E";\n      }\n  } else {\n    var $l = 0;\n    for (var pug_index0 in $obj) {\n      $l++;\n      var review = $obj[pug_index0];\n;pug_debug_line = 3;\npug_html = pug_html + "\\u003Ccat-review" + (" cat-store=\\"Dynamic\\u002FReview\\""+pug_attr("cat-store-param-review-id", review.id, true, false)) + "\\u003E\\u003C\\u002Fcat-review\\u003E";\n    }\n  }\n}).call(this);\n\npug_html = pug_html + "\\u003C\\u002Fdiv\\u003E";}.call(this,"reviews" in locals_for_with?locals_for_with.reviews:typeof reviews!=="undefined"?reviews:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}',
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
	compiledTemplate: 'function pug_attr(t,e,n,f){return e!==!1&&null!=e&&(e||"class"!==t&&"style"!==t)?e===!0?" "+(f?t:t+\'="\'+t+\'"\'):("function"==typeof e.toJSON&&(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||e.indexOf(\'"\')===-1)?(n&&(e=pug_escape(e))," "+t+\'="\'+e+\'"\'):" "+t+"=\'"+e.replace(/\'/g,"&#39;")+"\'"):""}\nfunction pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}\nvar pug_match_html=/["&<>]/;\nfunction pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\\n"+i+"\\n\\n"+n.message,n}function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {;var locals_for_with = (locals || {});(function (review, reviewStoreInstanceId) {;pug_debug_line = 1;\npug_html = pug_html + "\\u003Cdiv class=\\"review-block\\"\\u003E";\n;pug_debug_line = 2;\npug_html = pug_html + "\\u003Cp\\u003E";\n;pug_debug_line = 2;\npug_html = pug_html + (pug_escape(null == (pug_interp = review.text) ? "" : pug_interp)) + "\\u003C\\u002Fp\\u003E";\n;pug_debug_line = 4;\npug_html = pug_html + "\\u003Cdiv class=\\"comments-block\\"\\u003E";\n;pug_debug_line = 5;\n// iterate review.comments\n;(function(){\n  var $obj = review.comments;\n  if (\'number\' == typeof $obj.length) {\n      for (var pug_index0 = 0, $l = $obj.length; pug_index0 < $l; pug_index0++) {\n        var comment = $obj[pug_index0];\n;pug_debug_line = 6;\npug_html = pug_html + "\\u003Ccat-comment" + (pug_attr("cat-store-param-comment-id", comment.id, true, false)+pug_attr("cat-store-param-instance-id", reviewStoreInstanceId, true, false)+" cat-store=\\"Dynamic\\u002FComment\\"") + "\\u003E\\u003C\\u002Fcat-comment\\u003E";\n      }\n  } else {\n    var $l = 0;\n    for (var pug_index0 in $obj) {\n      $l++;\n      var comment = $obj[pug_index0];\n;pug_debug_line = 6;\npug_html = pug_html + "\\u003Ccat-comment" + (pug_attr("cat-store-param-comment-id", comment.id, true, false)+pug_attr("cat-store-param-instance-id", reviewStoreInstanceId, true, false)+" cat-store=\\"Dynamic\\u002FComment\\"") + "\\u003E\\u003C\\u002Fcat-comment\\u003E";\n    }\n  }\n}).call(this);\n\npug_html = pug_html + "\\u003C\\u002Fdiv\\u003E\\u003C\\u002Fdiv\\u003E";}.call(this,"review" in locals_for_with?locals_for_with.review:typeof review!=="undefined"?review:undefined,"reviewStoreInstanceId" in locals_for_with?locals_for_with.reviewStoreInstanceId:typeof reviewStoreInstanceId!=="undefined"?reviewStoreInstanceId:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}',
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

},{"./catberry_components/comment/index.js":2,"./catberry_components/document/Document.js":3,"./catberry_components/feed/index.js":4,"./catberry_components/head/Head.js":5,"./catberry_components/review/index.js":6,"./catberry_stores/Dynamic/Comment.js":7,"./catberry_stores/Dynamic/Review.js":8,"./catberry_stores/Feed.js":9,"./catberry_stores/Main.js":10,"./routes.js":13}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL1NpdGVzL2NhdGJlcnJ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLmpzIiwiY2F0YmVycnlfY29tcG9uZW50cy9jb21tZW50L2luZGV4LmpzIiwiY2F0YmVycnlfY29tcG9uZW50cy9kb2N1bWVudC9Eb2N1bWVudC5qcyIsImNhdGJlcnJ5X2NvbXBvbmVudHMvZmVlZC9pbmRleC5qcyIsImNhdGJlcnJ5X2NvbXBvbmVudHMvaGVhZC9IZWFkLmpzIiwiY2F0YmVycnlfY29tcG9uZW50cy9yZXZpZXcvaW5kZXguanMiLCJjYXRiZXJyeV9zdG9yZXMvRHluYW1pYy9Db21tZW50LmpzIiwiY2F0YmVycnlfc3RvcmVzL0R5bmFtaWMvUmV2aWV3LmpzIiwiY2F0YmVycnlfc3RvcmVzL0ZlZWQuanMiLCJjYXRiZXJyeV9zdG9yZXMvTWFpbi5qcyIsImNhdGJlcnJ5X3N0b3Jlcy9mYWtlRmVlZC5qc29uIiwiY29uZmlnL2Jyb3dzZXIuanNvbiIsInJvdXRlcy5qcyIsIi5hcHBEZWZpbml0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUlBLElBQU0sU0FBUyxRQUFRLDJCQUFSLENBQWY7O0FBR0EsSUFBTSxXQUFXLFFBQVEsVUFBUixDQUFqQjtBQUNBLElBQU0sTUFBTSxTQUFTLE1BQVQsQ0FBZ0IsTUFBaEIsQ0FBWjs7QUFHQSxJQUFNLGlCQUFpQixRQUFRLGNBQVIsQ0FBdkI7QUFDQSxlQUFlLFFBQWYsQ0FBd0IsSUFBSSxPQUE1Qjs7QUFFQSxJQUFNLGVBQWUsUUFBUSxpQkFBUixDQUFyQjtBQUNBLGFBQWEsUUFBYixDQUFzQixJQUFJLE9BQTFCOztBQUVBLElBQU0sWUFBWSxRQUFRLGNBQVIsQ0FBbEI7QUFDQSxVQUFVLFFBQVYsQ0FBbUIsSUFBSSxPQUF2Qjs7QUFHQSxJQUFJLGNBQUo7Ozs7Ozs7OztJQ3JCTSxPOzs7Ozs7OzZCQUVLO0FBQ1AsYUFBTyxLQUFLLFFBQUws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QyxtQkFBa0IsK3FEQUxuQjtBQU1DLDRCQUEyQixJQU41QjtBQU9DLHdCQUF1QjtBQVB4QixDQTlCbUIsRUF1Q25CO0FBQ0MsT0FBTSxRQURQO0FBRUMsY0FBYSxRQUFRLHVDQUFSLENBRmQ7QUFHQyxhQUFZLEVBQUMsUUFBTyxRQUFSLEVBQWlCLFlBQVcsZ0JBQTVCLEVBQTZDLGlCQUFnQixhQUE3RCxFQUEyRSxTQUFRLFVBQW5GLEVBSGI7QUFJQyx1QkFBc0IsS0FKdkI7QUFLQyxtQkFBa0Isb2xHQUxuQjtBQU1DLDRCQUEyQixLQU41QjtBQU9DLHdCQUF1QjtBQVB4QixDQXZDbUIsQ0FBbkI7O0FBbURBLElBQU0sbUJBQW1CLFFBQVEsYUFBUixLQUEwQixFQUFuRDtBQUNBLElBQU0sbUJBQW1CLENBQUMsRUFBQyxjQUFhLEdBQWQsRUFBa0Isa0JBQWlCLEVBQW5DLEVBQXNDLG1CQUFrQixFQUF4RCxFQUEyRCxvQkFBbUIsS0FBOUUsRUFBRCxLQUEwRixFQUFuSDs7QUFFQSxPQUFPLE9BQVAsR0FBaUI7QUFDaEIsZUFEZ0I7QUFFaEIsdUJBRmdCO0FBR2hCLG1DQUhnQjtBQUloQjtBQUpnQixDQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbi8vIHRoaXMgY29uZmlnIHdpbGwgYmUgcmVwbGFjZWQgYnkgYC4vY29uZmlnL2Jyb3dzZXIuanNvbmAgd2hlbiBidWlsZGluZ1xuLy8gYmVjYXVzZSBvZiBgYnJvd3NlcmAgZmllbGQgaW4gYHBhY2thZ2UuanNvbmBcbmNvbnN0IGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnL2Vudmlyb25tZW50Lmpzb24nKTtcblxuLy8gY2F0YmVycnkgYXBwbGljYXRpb25cbmNvbnN0IGNhdGJlcnJ5ID0gcmVxdWlyZSgnY2F0YmVycnknKTtcbmNvbnN0IGNhdCA9IGNhdGJlcnJ5LmNyZWF0ZShjb25maWcpO1xuXG4vLyByZWdpc3RlciBDYXRiZXJyeSBwbHVnaW5zIG5lZWRlZCBpbiBhIGJyb3dzZXJcbmNvbnN0IHRlbXBsYXRlRW5naW5lID0gcmVxdWlyZSgnY2F0YmVycnktcHVnJyk7XG50ZW1wbGF0ZUVuZ2luZS5yZWdpc3RlcihjYXQubG9jYXRvcik7XG5cbmNvbnN0IGxvZ2dlclBsdWdpbiA9IHJlcXVpcmUoJ2NhdGJlcnJ5LWxvZ2dlcicpO1xubG9nZ2VyUGx1Z2luLnJlZ2lzdGVyKGNhdC5sb2NhdG9yKTtcblxuY29uc3QgdWhyUGx1Z2luID0gcmVxdWlyZSgnY2F0YmVycnktdWhyJyk7XG51aHJQbHVnaW4ucmVnaXN0ZXIoY2F0LmxvY2F0b3IpO1xuXG4vLyBzdGFydHMgdGhlIGFwcGxpY2F0aW9uIHdoZW4gRE9NIGlzIHJlYWR5XG5jYXQuc3RhcnRXaGVuUmVhZHkoKTtcblxuIiwiY2xhc3MgQ29tbWVudCB7XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiB0aGlzLiRjb250ZXh0LmdldFN0b3JlRGF0YSgpLnRoZW4oY29tbWVudCA9PiAoe2NvbW1lbnR9KSk7XG4gIH1cblxuICBiaW5kKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjbGljazoge1xuICAgICAgICBidXR0b246ICgpID0+IHtcbiAgICAgICAgICB0aGlzLiRjb250ZXh0LnNlbmRBY3Rpb24oJ2xpa2UnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbW1lbnQ7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuLypcbiAqIFRoaXMgaXMgYSBDYXRiZXJyeSBDYXQtY29tcG9uZW50IGZpbGUuXG4gKiBNb3JlIGRldGFpbHMgY2FuIGJlIGZvdW5kIGhlcmVcbiAqIGh0dHA6Ly9jYXRiZXJyeS5vcmcvZG9jdW1lbnRhdGlvbiNjYXQtY29tcG9uZW50cy1pbnRlcmZhY2VcbiAqL1xuXG5jbGFzcyBEb2N1bWVudCB7IH1cblxubW9kdWxlLmV4cG9ydHMgPSBEb2N1bWVudDtcblxuIiwiY2xhc3MgRmVlZCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gdGhpcy4kY29udGV4dC5nZXRTdG9yZURhdGEoKVxuICAgICAgLnRoZW4oZGF0YSA9PiAoe3Jldmlld3M6IGRhdGEuZmVlZH0pKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZlZWQ7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuLypcbiAqIFRoaXMgaXMgYSBDYXRiZXJyeSBDYXQtY29tcG9uZW50IGZpbGUuXG4gKiBNb3JlIGRldGFpbHMgY2FuIGJlIGZvdW5kIGhlcmVcbiAqIGh0dHA6Ly9jYXRiZXJyeS5vcmcvZG9jdW1lbnRhdGlvbiNjYXQtY29tcG9uZW50cy1pbnRlcmZhY2VcbiAqL1xuXG5jbGFzcyBIZWFkIHtcblxuXHQvKipcblx0KiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBcImhlYWRcIiBjb21wb25lbnQuXG5cdCogQHBhcmFtIHtTZXJ2aWNlTG9jYXRvcn0gbG9jYXRvciBDYXRiZXJyeSdzIHNlcnZpY2UgbG9jYXRvci5cblx0Ki9cblx0Y29uc3RydWN0b3IobG9jYXRvcikge1xuXG5cdFx0LyoqXG5cdFx0KiBDdXJyZW50IGNvbmZpZy5cblx0XHQqIEB0eXBlIHtPYmplY3R9XG5cdFx0KiBAcHJpdmF0ZVxuXHRcdCovXG5cdFx0dGhpcy5fY29uZmlnID0gbG9jYXRvci5yZXNvbHZlKCdjb25maWcnKTtcblx0fVxuXG5cdC8qKlxuXHQqIEdldHMgZGF0YSBmb3IgdGVtcGxhdGUuXG5cdCogQHJldHVybnMge09iamVjdH0gRGF0YSBvYmplY3QuXG5cdCovXG5cdHJlbmRlcigpIHtcblx0XHRyZXR1cm4gdGhpcy5fY29uZmlnO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSGVhZDtcblxuIiwiY2xhc3MgUmV2aWV3IHtcbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB0aGlzLiRjb250ZXh0LmxvY2F0b3IucmVzb2x2ZSgnbG9nZ2VyJykuaW5mbygnUmV2aWV3IHJlbmRlcicpO1xuXG4gICAgcmV0dXJuIHRoaXMuJGNvbnRleHQuZ2V0U3RvcmVEYXRhKCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXZpZXc7XG5cbiIsImNsYXNzIER5bmFtaWNDb21tZW50IHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIGxvYWQoKSB7XG4gICAgY29uc3QgY29tbWVudElkID0gdGhpcy4kY29udGV4dC5wYXJhbXNbJ2NvbW1lbnQtaWQnXTtcbiAgICBjb25zdCByZXZpZXdTdG9yZUluc3RhbmNlSWQgPSB0aGlzLiRjb250ZXh0LnBhcmFtc1snaW5zdGFuY2UtaWQnXTtcblxuICAgIHJldHVybiB0aGlzLiRjb250ZXh0LmdldFN0b3JlRGF0YSgnRHluYW1pYy9SZXZpZXcnLCByZXZpZXdTdG9yZUluc3RhbmNlSWQpXG4gICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgcmV0dXJuIGRhdGEucmV2aWV3LmNvbW1lbnRzLmZpbmQoY29tbWVudCA9PiBjb21tZW50LmlkID09PSBjb21tZW50SWQpO1xuICAgICAgfSk7XG4gIH1cblxuICBoYW5kbGVMaWtlKCkge1xuICAgIGNvbnN0IGNvbW1lbnRJZCA9IHRoaXMuJGNvbnRleHQucGFyYW1zWydjb21tZW50LWlkJ107XG4gICAgY29uc3QgcmV2aWV3U3RvcmVJbnN0YW5jZUlkID0gdGhpcy4kY29udGV4dC5wYXJhbXNbJ2luc3RhbmNlLWlkJ107XG5cbiAgICB0aGlzLiRjb250ZXh0LmdldFN0b3JlRGF0YSgnRHluYW1pYy9SZXZpZXcnLCByZXZpZXdTdG9yZUluc3RhbmNlSWQpXG4gICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIGNvbnN0IGNvbW1lbnQgPSBkYXRhLnJldmlldy5jb21tZW50cy5maW5kKGNvbW1lbnQgPT4gY29tbWVudC5pZCA9PT0gY29tbWVudElkKTtcblxuICAgICAgICByZXR1cm4gdGhpcy4kY29udGV4dC5zZW5kQWN0aW9uKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0b3JlTmFtZTogJ0R5bmFtaWMvUmV2aWV3JyxcbiAgICAgICAgICAgIHN0b3JlSW5zdGFuY2VJZDogcmV2aWV3U3RvcmVJbnN0YW5jZUlkXG4gICAgICAgICAgfSxcbiAgICAgICAgICAncmVmcmVzaC1jb21tZW50JyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb21tZW50SWQsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGxpa2U6IGNvbW1lbnQubGlrZSArIDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IER5bmFtaWNDb21tZW50O1xuXG4iLCJjbGFzcyBEeW5hbWljUmV2aWV3IHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLiRjb250ZXh0LnNldERlcGVuZGVuY3koJ0ZlZWQnKTtcbiAgfVxuXG4gIGxvYWQoKSB7XG4gICAgY29uc3QgcmV2aWV3SWQgPSB0aGlzLiRjb250ZXh0LnBhcmFtc1sncmV2aWV3LWlkJ107XG4gICAgY29uc29sZS5sb2cocmV2aWV3SWQpO1xuICAgIHJldHVybiB0aGlzLiRjb250ZXh0LmdldFN0b3JlRGF0YSgnRmVlZCcpXG4gICAgICAudGhlbigoe2hhc2hXaXRoUmV2aWV3c30pID0+ICh7XG4gICAgICAgIHJldmlldzogaGFzaFdpdGhSZXZpZXdzW3Jldmlld0lkXSxcbiAgICAgICAgcmV2aWV3U3RvcmVJbnN0YW5jZUlkOiB0aGlzLiRjb250ZXh0LnN0b3JlSW5zdGFuY2VJZFxuICAgICAgfSkpO1xuICB9XG5cbiAgaGFuZGxlUmVmcmVzaENvbW1lbnQoe2NvbW1lbnRJZCwgZGF0YX0pIHtcbiAgICBjb25zdCByZXZpZXdJZCA9IHRoaXMuJGNvbnRleHQucGFyYW1zWydyZXZpZXctaWQnXTtcblxuICAgIHJldHVybiB0aGlzLiRjb250ZXh0XG4gICAgICAuc2VuZEFjdGlvbignRmVlZCcsICd1cGRhdGUtY29tbWVudCcsIHtyZXZpZXdJZCwgY29tbWVudElkLCBkYXRhfSlcbiAgICAgIC50aGVuKCgpID0+IHRoaXMuJGNvbnRleHQuY2hhbmdlZCgpKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRHluYW1pY1JldmlldztcblxuIiwiY29uc3QgZmFrZUZlZWQgPSByZXF1aXJlKCcuL2Zha2VGZWVkLmpzb24nKTtcblxuLypcbiAqIFRoaXMgaXMgYSBDYXRiZXJyeSBDYXQtY29tcG9uZW50IGZpbGUuXG4gKiBNb3JlIGRldGFpbHMgY2FuIGJlIGZvdW5kIGhlcmVcbiAqIGh0dHA6Ly9jYXRiZXJyeS5vcmcvZG9jdW1lbnRhdGlvbiNzdG9yZXMtaW50ZXJmYWNlXG4gKi9cblxuY2xhc3MgRmVlZCB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy4kbGlmZXRpbWUgPSAwO1xuXG4gICAgdGhpcy5mZWVkID0gZmFrZUZlZWQ7XG4gICAgdGhpcy5oYXNoV2l0aFJldmlld3MgPSB7fTtcbiAgICB0aGlzLmhhc2hXaXRoQ29tbWVudHMgPSB7fTtcblxuICAgIHRoaXMuZmVlZC5mb3JFYWNoKHJldmlldyA9PiB7XG4gICAgICB0aGlzLmhhc2hXaXRoUmV2aWV3c1tyZXZpZXcuaWRdID0gcmV2aWV3O1xuXG4gICAgICBpZiAocmV2aWV3LmNvbW1lbnRzLmxlbmd0aCkge1xuICAgICAgICByZXZpZXcuY29tbWVudHMuZm9yRWFjaChjb21tZW50ID0+ICh0aGlzLmhhc2hXaXRoQ29tbWVudHNbY29tbWVudC5pZF0gPSBjb21tZW50KSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLiRsaWZldGltZSA9IDA7XG5cbiAgICBpZiAodGhpcy4kY29udGV4dC5pc0Jyb3dzZXIpIHtcbiAgICAgIHdpbmRvdy5mZWVkU3RvcmUgPSB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIGxvYWQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZlZWQ6IHRoaXMuZmVlZCxcbiAgICAgIGhhc2hXaXRoUmV2aWV3czogdGhpcy5oYXNoV2l0aFJldmlld3MsXG4gICAgICBoYXNoV2l0aENvbW1lbnRzOiB0aGlzLmhhc2hXaXRoQ29tbWVudHNcbiAgICB9XG4gIH1cblxuICBoYW5kbGVVcGRhdGVSZXZpZXcocmV2aWV3SWQsIGRhdGEpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuaGFzaFdpdGhSZXZpZXdzW3Jldmlld0lkXSwgZGF0YSk7XG4gIH1cblxuICBoYW5kbGVVcGRhdGVDb21tZW50KGNvbW1lbnRJZCwgZGF0YSkge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5oYXNoV2l0aENvbW1lbnRzW2NvbW1lbnRJZF0sIGRhdGEpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRmVlZDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBNYWluIHtcblxuXHQvKipcblx0ICogTG9hZHMgZGF0YSBmcm9tIHNvbWV3aGVyZS5cblx0ICogQHJldHVybnMge09iamVjdH0gRGF0YSBvYmplY3QuXG5cdCAqL1xuXHRsb2FkKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR3aG86ICdXb3JsZCdcblx0XHR9O1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWFpbjtcblxuIiwibW9kdWxlLmV4cG9ydHM9W1xuICB7XG4gICAgXCJpZFwiOiBcImZhYmEwOGM5LTgzYjgtNGRkNi04ZTVkLWM0ZTA4ZDgzNzYwNVwiLFxuICAgIFwidGV4dFwiOiBcIlF1byBlbGlnZW5kaSBxdW9kIGZhY2VyZSBldCBkb2xvciBldCB2b2x1cHRhdGlidXMuIElsbG8gZmFjaWxpcyBvY2NhZWNhdGkgZmFjZXJlIG9tbmlzIG9tbmlzIHZvbHVwdGF0ZW0gYWQgZGVsZW5pdGkgdXQuIE1vbGVzdGlhcyBldCBpZCByZXBlbGxhdCBkb2xvciB0ZW5ldHVyIGhhcnVtIGV1bSB2b2x1cHRhdHVtLiBDb25zZXF1YXR1ciB0ZW1wb3JlIHZvbHVwdGF0ZSBzdXNjaXBpdCBmdWdhLlwiLFxuICAgIFwiY29tbWVudHNcIjogW1xuICAgICAge1xuICAgICAgICBcImlkXCI6IFwiYzYxNTYyODctMGQwNi00MzNjLTk4MjktNDhmOWNhNGRiOTllXCIsXG4gICAgICAgIFwidGV4dFwiOiBcIm1vbGVzdGlhZSBxdWkgZXRcIixcbiAgICAgICAgXCJsaWtlc1wiOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcImlkXCI6IFwiYzYxNTYyODctMGQwNi00MzNjLTk4MjktNDhmOWNhNGRiOTllXCIsXG4gICAgICAgIFwidGV4dFwiOiBcIm1vbGVzdGlhZSBxdWkgZXRcIixcbiAgICAgICAgXCJsaWtlc1wiOiAwXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgXCJpZFwiOiBcIjNkNTZjZDU0LTBiZGItNDcwYi1iZmU3LWJhYTVkNmVlMWJmNVwiLFxuICAgIFwidGV4dFwiOiBcIkF1dCBxdWFzaSBuZWNlc3NpdGF0aWJ1cyBxdWlhIG5lY2Vzc2l0YXRpYnVzIG9mZmljaWEgZXVtIHJhdGlvbmUgcmVjdXNhbmRhZSBwcmFlc2VudGl1bS4gRG9sb3JlbSBlc3QgbnVtcXVhbSBldC4gRW5pbSBhdXQgc3VudCBldW0gbmloaWwgZXhjZXB0dXJpIHBlcmZlcmVuZGlzIHNpdCByZWljaWVuZGlzLlwiLFxuICAgIFwiY29tbWVudHNcIjogW1xuICAgICAge1xuICAgICAgICBcImlkXCI6IFwiYzYxNTYyODctMGQwNi00MzNjLTk4MjktNDhmOWNhNGRiOTllXCIsXG4gICAgICAgIFwidGV4dFwiOiBcIm1vbGVzdGlhZSBxdWkgZXRcIixcbiAgICAgICAgXCJsaWtlc1wiOiAwXG4gICAgICB9XG4gICAgXVxuICB9XG5dXG4iLCJtb2R1bGUuZXhwb3J0cz17XG5cdFwidGl0bGVcIjogXCJDYXRiZXJyeSBQcm9qZWN0XCIsXG5cdFwibG9nZ2VyXCI6IHtcblx0XHRcImxldmVsXCI6IDBcblx0fVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBUaGlzIGZpbGUgY29udGFpbnMgcm91dGUgZGVmaW5pdGlvbnMg4oCTIHRoZSBydWxlcyBob3cgbG9jYXRpb24gVVJMcyBhcmUgdHJhbnNsYXRlZFxuLy8gdG8gcGFyYW1ldGVycyBmb3Igc3RvcmVzIGluIHRoZSBDYXRiZXJyeSBhcHBsaWNhdGlvbi5cbi8vXG4vLyBGb3JtYXQ6XG4vLyAvc29tZS86cGFyYW1ldGVyW3N0b3JlMSxzdG9yZTIsc3RvcmUzXT9xdWVyeVBhcmFtZXRlcj06cXVlcnlWYWx1ZVtzdG9yZTEsc3RvcmUyXVxuLy9cbi8vIE1vcmUgZGV0YWlscyBoZXJlOlxuLy8gaHR0cDovL2NhdGJlcnJ5Lm9yZy9kb2N1bWVudGF0aW9uI3JvdXRpbmdcblxubW9kdWxlLmV4cG9ydHMgPSBbXG5cdCcvJ1xuXTtcblxuIiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgYSB0ZW1wbGF0ZSBhbmQgaXQgaXMgdXNlZCBvbmx5IGZvciBzb21lIHN0cmluZyByZXBsYWNlc1xuICogYnkgQnJvd3NlckJ1bmRsZUJ1aWxkZXIgbW9kdWxlLiBJdCBkb2VzIG5vdCB3b3JrIGJ5IGl0c2VsZi5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IHN0b3JlcyA9IFtcblxuXG57bmFtZTogJ0ZlZWQnLCBjb25zdHJ1Y3RvcjogcmVxdWlyZSgnLi9jYXRiZXJyeV9zdG9yZXMvRmVlZC5qcycpfSxcbntuYW1lOiAnTWFpbicsIGNvbnN0cnVjdG9yOiByZXF1aXJlKCcuL2NhdGJlcnJ5X3N0b3Jlcy9NYWluLmpzJyl9LFxue25hbWU6ICdEeW5hbWljL0NvbW1lbnQnLCBjb25zdHJ1Y3RvcjogcmVxdWlyZSgnLi9jYXRiZXJyeV9zdG9yZXMvRHluYW1pYy9Db21tZW50LmpzJyl9LFxue25hbWU6ICdEeW5hbWljL1JldmlldycsIGNvbnN0cnVjdG9yOiByZXF1aXJlKCcuL2NhdGJlcnJ5X3N0b3Jlcy9EeW5hbWljL1Jldmlldy5qcycpfVxuXG5dO1xuXG5jb25zdCBjb21wb25lbnRzID0gW1xuXG5cbntcblx0bmFtZTogJ2NvbW1lbnQnLFxuXHRjb25zdHJ1Y3RvcjogcmVxdWlyZSgnLi9jYXRiZXJyeV9jb21wb25lbnRzL2NvbW1lbnQvaW5kZXguanMnKSxcblx0cHJvcGVydGllczoge1wibmFtZVwiOlwiY29tbWVudFwiLFwidGVtcGxhdGVcIjpcIi4vdGVtcGxhdGUucHVnXCIsXCJlcnJvclRlbXBsYXRlXCI6XCIuL2Vycm9yLnB1Z1wiLFwibG9naWNcIjpcImluZGV4LmpzXCJ9LFxuXHR0ZW1wbGF0ZVByb3ZpZGVyTmFtZTogJ3B1ZycsXG5cdGNvbXBpbGVkVGVtcGxhdGU6ICdmdW5jdGlvbiBwdWdfZXNjYXBlKGUpe3ZhciBhPVwiXCIrZSx0PXB1Z19tYXRjaF9odG1sLmV4ZWMoYSk7aWYoIXQpcmV0dXJuIGU7dmFyIHIsYyxuLHM9XCJcIjtmb3Iocj10LmluZGV4LGM9MDtyPGEubGVuZ3RoO3IrKyl7c3dpdGNoKGEuY2hhckNvZGVBdChyKSl7Y2FzZSAzNDpuPVwiJnF1b3Q7XCI7YnJlYWs7Y2FzZSAzODpuPVwiJmFtcDtcIjticmVhaztjYXNlIDYwOm49XCImbHQ7XCI7YnJlYWs7Y2FzZSA2MjpuPVwiJmd0O1wiO2JyZWFrO2RlZmF1bHQ6Y29udGludWV9YyE9PXImJihzKz1hLnN1YnN0cmluZyhjLHIpKSxjPXIrMSxzKz1ufXJldHVybiBjIT09cj9zK2Euc3Vic3RyaW5nKGMscik6c31cXG52YXIgcHVnX21hdGNoX2h0bWw9L1tcIiY8Pl0vO1xcbmZ1bmN0aW9uIHB1Z19yZXRocm93KG4sZSxyLHQpe2lmKCEobiBpbnN0YW5jZW9mIEVycm9yKSl0aHJvdyBuO2lmKCEoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHdpbmRvdyYmZXx8dCkpdGhyb3cgbi5tZXNzYWdlKz1cIiBvbiBsaW5lIFwiK3Isbjt0cnl7dD10fHxyZXF1aXJlKFwiZnNcIikucmVhZEZpbGVTeW5jKGUsXCJ1dGY4XCIpfWNhdGNoKGUpe3B1Z19yZXRocm93KG4sbnVsbCxyKX12YXIgaT0zLGE9dC5zcGxpdChcIlxcXFxuXCIpLG89TWF0aC5tYXgoci1pLDApLGg9TWF0aC5taW4oYS5sZW5ndGgscitpKSxpPWEuc2xpY2UobyxoKS5tYXAoZnVuY3Rpb24obixlKXt2YXIgdD1lK28rMTtyZXR1cm4odD09cj9cIiAgPiBcIjpcIiAgICBcIikrdCtcInwgXCIrbn0pLmpvaW4oXCJcXFxcblwiKTt0aHJvdyBuLnBhdGg9ZSxuLm1lc3NhZ2U9KGV8fFwiUHVnXCIpK1wiOlwiK3IrXCJcXFxcblwiK2krXCJcXFxcblxcXFxuXCIrbi5tZXNzYWdlLG59ZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3ZhciBwdWdfZGVidWdfZmlsZW5hbWUsIHB1Z19kZWJ1Z19saW5lO3RyeSB7O3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGNvbW1lbnQpIHs7cHVnX2RlYnVnX2xpbmUgPSAxO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFx1MDAzQ2RpdiBjbGFzcz1cXFxcXCJjb21tZW50LWJsb2NrXFxcXFwiXFxcXHUwMDNFXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMjtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0NwXFxcXHUwMDNFXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMjtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgKHB1Z19lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IGNvbW1lbnQudGV4dCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXFxcdTAwM0NcXFxcdTAwMkZwXFxcXHUwMDNFXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMztcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0NkaXYgY2xhc3M9XFxcXFwiY29tbWVudC1saWtlc1xcXFxcIlxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDM7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIChwdWdfZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBjb21tZW50Lmxpa2VzKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcXFx1MDAzQ1xcXFx1MDAyRmRpdlxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDQ7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDYnV0dG9uXFxcXHUwMDNFXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gNDtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJMaWtlIVxcXFx1MDAzQ1xcXFx1MDAyRmJ1dHRvblxcXFx1MDAzRVxcXFx1MDAzQ1xcXFx1MDAyRmRpdlxcXFx1MDAzRVwiO30uY2FsbCh0aGlzLFwiY29tbWVudFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguY29tbWVudDp0eXBlb2YgY29tbWVudCE9PVwidW5kZWZpbmVkXCI/Y29tbWVudDp1bmRlZmluZWQpKTt9IGNhdGNoIChlcnIpIHtwdWdfcmV0aHJvdyhlcnIsIHB1Z19kZWJ1Z19maWxlbmFtZSwgcHVnX2RlYnVnX2xpbmUpO307cmV0dXJuIHB1Z19odG1sO30nLFxuXHRlcnJvclRlbXBsYXRlUHJvdmlkZXJOYW1lOiAncHVnJyxcblx0Y29tcGlsZWRFcnJvclRlbXBsYXRlOiAnZnVuY3Rpb24gcHVnX3JldGhyb3cobixlLHIsdCl7aWYoIShuIGluc3RhbmNlb2YgRXJyb3IpKXRocm93IG47aWYoIShcInVuZGVmaW5lZFwiPT10eXBlb2Ygd2luZG93JiZlfHx0KSl0aHJvdyBuLm1lc3NhZ2UrPVwiIG9uIGxpbmUgXCIrcixuO3RyeXt0PXR8fHJlcXVpcmUoXCJmc1wiKS5yZWFkRmlsZVN5bmMoZSxcInV0ZjhcIil9Y2F0Y2goZSl7cHVnX3JldGhyb3cobixudWxsLHIpfXZhciBpPTMsYT10LnNwbGl0KFwiXFxcXG5cIiksbz1NYXRoLm1heChyLWksMCksaD1NYXRoLm1pbihhLmxlbmd0aCxyK2kpLGk9YS5zbGljZShvLGgpLm1hcChmdW5jdGlvbihuLGUpe3ZhciB0PWUrbysxO3JldHVybih0PT1yP1wiICA+IFwiOlwiICAgIFwiKSt0K1wifCBcIitufSkuam9pbihcIlxcXFxuXCIpO3Rocm93IG4ucGF0aD1lLG4ubWVzc2FnZT0oZXx8XCJQdWdcIikrXCI6XCIrcitcIlxcXFxuXCIraStcIlxcXFxuXFxcXG5cIituLm1lc3NhZ2Usbn1mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7dmFyIHB1Z19kZWJ1Z19maWxlbmFtZSwgcHVnX2RlYnVnX2xpbmU7dHJ5IHt9IGNhdGNoIChlcnIpIHtwdWdfcmV0aHJvdyhlcnIsIHB1Z19kZWJ1Z19maWxlbmFtZSwgcHVnX2RlYnVnX2xpbmUpO307cmV0dXJuIHB1Z19odG1sO30nXG59LFxue1xuXHRuYW1lOiAnZG9jdW1lbnQnLFxuXHRjb25zdHJ1Y3RvcjogcmVxdWlyZSgnLi9jYXRiZXJyeV9jb21wb25lbnRzL2RvY3VtZW50L0RvY3VtZW50LmpzJyksXG5cdHByb3BlcnRpZXM6IHtcIm5hbWVcIjpcImRvY3VtZW50XCIsXCJ0ZW1wbGF0ZVwiOlwiLi9kb2N1bWVudC5wdWdcIixcImxvZ2ljXCI6XCIuL0RvY3VtZW50LmpzXCJ9LFxuXHR0ZW1wbGF0ZVByb3ZpZGVyTmFtZTogJ3B1ZycsXG5cdGNvbXBpbGVkVGVtcGxhdGU6ICdmdW5jdGlvbiBwdWdfcmV0aHJvdyhuLGUscix0KXtpZighKG4gaW5zdGFuY2VvZiBFcnJvcikpdGhyb3cgbjtpZighKFwidW5kZWZpbmVkXCI9PXR5cGVvZiB3aW5kb3cmJmV8fHQpKXRocm93IG4ubWVzc2FnZSs9XCIgb24gbGluZSBcIityLG47dHJ5e3Q9dHx8cmVxdWlyZShcImZzXCIpLnJlYWRGaWxlU3luYyhlLFwidXRmOFwiKX1jYXRjaChlKXtwdWdfcmV0aHJvdyhuLG51bGwscil9dmFyIGk9MyxhPXQuc3BsaXQoXCJcXFxcblwiKSxvPU1hdGgubWF4KHItaSwwKSxoPU1hdGgubWluKGEubGVuZ3RoLHIraSksaT1hLnNsaWNlKG8saCkubWFwKGZ1bmN0aW9uKG4sZSl7dmFyIHQ9ZStvKzE7cmV0dXJuKHQ9PXI/XCIgID4gXCI6XCIgICAgXCIpK3QrXCJ8IFwiK259KS5qb2luKFwiXFxcXG5cIik7dGhyb3cgbi5wYXRoPWUsbi5tZXNzYWdlPShlfHxcIlB1Z1wiKStcIjpcIityK1wiXFxcXG5cIitpK1wiXFxcXG5cXFxcblwiK24ubWVzc2FnZSxufWZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDt2YXIgcHVnX2RlYnVnX2ZpbGVuYW1lLCBwdWdfZGVidWdfbGluZTt0cnkgeztwdWdfZGVidWdfbGluZSA9IDE7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDIURPQ1RZUEUgaHRtbFxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDI7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDaHRtbFxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDM7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDaGVhZFxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDQ7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDc3R5bGUgdHlwZT1cXFxcXCJ0ZXh0XFxcXHUwMDJGY3NzXFxcXFwiXFxcXHUwMDNFXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gNTtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJib2R5IHtcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSA2O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFxuXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gNjtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCIgIHBhZGRpbmc6IDIwcHg7XCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gNztcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcblwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDc7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwifVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDg7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXG5cIjtcXG47cHVnX2RlYnVnX2xpbmUgPSA4O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDk7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXG5cIjtcXG47cHVnX2RlYnVnX2xpbmUgPSA5O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIi5mZWVkIHtcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAxMDtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcblwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDEwO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIiAgbWFyZ2luOiAwIGF1dG87XCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMTE7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXG5cIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAxMTtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCIgIHdpZHRoOiA2MDBweDtcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAxMjtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcblwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDEyO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIn1cIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAxMztcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcblwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDEzO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDE0O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFxuXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMTQ7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiLnJldmlldy1ibG9jaywgLmNvbW1lbnQtYmxvY2sge1wiO1xcbjtwdWdfZGVidWdfbGluZSA9IDE1O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFxuXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMTU7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiICBtYXJnaW4tYm90dG9tOiAyMHB4O1wiO1xcbjtwdWdfZGVidWdfbGluZSA9IDE2O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFxuXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMTY7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwifVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDE3O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFxuXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMTc7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMTg7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXG5cIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAxODtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCIuY29tbWVudHMtYmxvY2sge1wiO1xcbjtwdWdfZGVidWdfbGluZSA9IDE5O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFxuXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMTk7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiICBtYXJnaW4tdG9wOiAxMHB4O1wiO1xcbjtwdWdfZGVidWdfbGluZSA9IDIwO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFxuXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMjA7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiICBtYXJnaW4tbGVmdDogNDBweDtcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAyMTtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcblwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDIxO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIn1cXFxcdTAwM0NcXFxcdTAwMkZzdHlsZVxcXFx1MDAzRVxcXFx1MDAzQ1xcXFx1MDAyRmhlYWRcXFxcdTAwM0VcXFxcdTAwM0NcXFxcdTAwMkZodG1sXFxcXHUwMDNFXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMjI7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDYm9keVxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDIzO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFx1MDAzQ2NhdC1mZWVkIGNhdC1zdG9yZT1cXFxcXCJGZWVkXFxcXFwiXFxcXHUwMDNFXFxcXHUwMDNDXFxcXHUwMDJGY2F0LWZlZWRcXFxcdTAwM0VcXFxcdTAwM0NcXFxcdTAwMkZib2R5XFxcXHUwMDNFXCI7fSBjYXRjaCAoZXJyKSB7cHVnX3JldGhyb3coZXJyLCBwdWdfZGVidWdfZmlsZW5hbWUsIHB1Z19kZWJ1Z19saW5lKTt9O3JldHVybiBwdWdfaHRtbDt9Jyxcblx0ZXJyb3JUZW1wbGF0ZVByb3ZpZGVyTmFtZTogbnVsbCxcblx0Y29tcGlsZWRFcnJvclRlbXBsYXRlOiBudWxsXG59LFxue1xuXHRuYW1lOiAnZmVlZCcsXG5cdGNvbnN0cnVjdG9yOiByZXF1aXJlKCcuL2NhdGJlcnJ5X2NvbXBvbmVudHMvZmVlZC9pbmRleC5qcycpLFxuXHRwcm9wZXJ0aWVzOiB7XCJuYW1lXCI6XCJmZWVkXCIsXCJ0ZW1wbGF0ZVwiOlwiLi90ZW1wbGF0ZS5wdWdcIixcImVycm9yVGVtcGxhdGVcIjpcIi4vZXJyb3IucHVnXCIsXCJsb2dpY1wiOlwiaW5kZXguanNcIn0sXG5cdHRlbXBsYXRlUHJvdmlkZXJOYW1lOiAncHVnJyxcblx0Y29tcGlsZWRUZW1wbGF0ZTogJ2Z1bmN0aW9uIHB1Z19hdHRyKHQsZSxuLGYpe3JldHVybiBlIT09ITEmJm51bGwhPWUmJihlfHxcImNsYXNzXCIhPT10JiZcInN0eWxlXCIhPT10KT9lPT09ITA/XCIgXCIrKGY/dDp0K1xcJz1cIlxcJyt0K1xcJ1wiXFwnKTooXCJmdW5jdGlvblwiPT10eXBlb2YgZS50b0pTT04mJihlPWUudG9KU09OKCkpLFwic3RyaW5nXCI9PXR5cGVvZiBlfHwoZT1KU09OLnN0cmluZ2lmeShlKSxufHxlLmluZGV4T2YoXFwnXCJcXCcpPT09LTEpPyhuJiYoZT1wdWdfZXNjYXBlKGUpKSxcIiBcIit0K1xcJz1cIlxcJytlK1xcJ1wiXFwnKTpcIiBcIit0K1wiPVxcJ1wiK2UucmVwbGFjZSgvXFwnL2csXCImIzM5O1wiKStcIlxcJ1wiKTpcIlwifVxcbmZ1bmN0aW9uIHB1Z19lc2NhcGUoZSl7dmFyIGE9XCJcIitlLHQ9cHVnX21hdGNoX2h0bWwuZXhlYyhhKTtpZighdClyZXR1cm4gZTt2YXIgcixjLG4scz1cIlwiO2ZvcihyPXQuaW5kZXgsYz0wO3I8YS5sZW5ndGg7cisrKXtzd2l0Y2goYS5jaGFyQ29kZUF0KHIpKXtjYXNlIDM0Om49XCImcXVvdDtcIjticmVhaztjYXNlIDM4Om49XCImYW1wO1wiO2JyZWFrO2Nhc2UgNjA6bj1cIiZsdDtcIjticmVhaztjYXNlIDYyOm49XCImZ3Q7XCI7YnJlYWs7ZGVmYXVsdDpjb250aW51ZX1jIT09ciYmKHMrPWEuc3Vic3RyaW5nKGMscikpLGM9cisxLHMrPW59cmV0dXJuIGMhPT1yP3MrYS5zdWJzdHJpbmcoYyxyKTpzfVxcbnZhciBwdWdfbWF0Y2hfaHRtbD0vW1wiJjw+XS87XFxuZnVuY3Rpb24gcHVnX3JldGhyb3cobixlLHIsdCl7aWYoIShuIGluc3RhbmNlb2YgRXJyb3IpKXRocm93IG47aWYoIShcInVuZGVmaW5lZFwiPT10eXBlb2Ygd2luZG93JiZlfHx0KSl0aHJvdyBuLm1lc3NhZ2UrPVwiIG9uIGxpbmUgXCIrcixuO3RyeXt0PXR8fHJlcXVpcmUoXCJmc1wiKS5yZWFkRmlsZVN5bmMoZSxcInV0ZjhcIil9Y2F0Y2goZSl7cHVnX3JldGhyb3cobixudWxsLHIpfXZhciBpPTMsYT10LnNwbGl0KFwiXFxcXG5cIiksbz1NYXRoLm1heChyLWksMCksaD1NYXRoLm1pbihhLmxlbmd0aCxyK2kpLGk9YS5zbGljZShvLGgpLm1hcChmdW5jdGlvbihuLGUpe3ZhciB0PWUrbysxO3JldHVybih0PT1yP1wiICA+IFwiOlwiICAgIFwiKSt0K1wifCBcIitufSkuam9pbihcIlxcXFxuXCIpO3Rocm93IG4ucGF0aD1lLG4ubWVzc2FnZT0oZXx8XCJQdWdcIikrXCI6XCIrcitcIlxcXFxuXCIraStcIlxcXFxuXFxcXG5cIituLm1lc3NhZ2Usbn1mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7dmFyIHB1Z19kZWJ1Z19maWxlbmFtZSwgcHVnX2RlYnVnX2xpbmU7dHJ5IHs7dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAocmV2aWV3cykgeztwdWdfZGVidWdfbGluZSA9IDE7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDZGl2IGNsYXNzPVxcXFxcImZlZWRcXFxcXCJcXFxcdTAwM0VcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSAyO1xcbi8vIGl0ZXJhdGUgcmV2aWV3c1xcbjsoZnVuY3Rpb24oKXtcXG4gIHZhciAkb2JqID0gcmV2aWV3cztcXG4gIGlmIChcXCdudW1iZXJcXCcgPT0gdHlwZW9mICRvYmoubGVuZ3RoKSB7XFxuICAgICAgZm9yICh2YXIgcHVnX2luZGV4MCA9IDAsICRsID0gJG9iai5sZW5ndGg7IHB1Z19pbmRleDAgPCAkbDsgcHVnX2luZGV4MCsrKSB7XFxuICAgICAgICB2YXIgcmV2aWV3ID0gJG9ialtwdWdfaW5kZXgwXTtcXG47cHVnX2RlYnVnX2xpbmUgPSAzO1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFx1MDAzQ2NhdC1yZXZpZXdcIiArIChcIiBjYXQtc3RvcmU9XFxcXFwiRHluYW1pY1xcXFx1MDAyRlJldmlld1xcXFxcIlwiK3B1Z19hdHRyKFwiY2F0LXN0b3JlLXBhcmFtLXJldmlldy1pZFwiLCByZXZpZXcuaWQsIHRydWUsIGZhbHNlKSkgKyBcIlxcXFx1MDAzRVxcXFx1MDAzQ1xcXFx1MDAyRmNhdC1yZXZpZXdcXFxcdTAwM0VcIjtcXG4gICAgICB9XFxuICB9IGVsc2Uge1xcbiAgICB2YXIgJGwgPSAwO1xcbiAgICBmb3IgKHZhciBwdWdfaW5kZXgwIGluICRvYmopIHtcXG4gICAgICAkbCsrO1xcbiAgICAgIHZhciByZXZpZXcgPSAkb2JqW3B1Z19pbmRleDBdO1xcbjtwdWdfZGVidWdfbGluZSA9IDM7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDY2F0LXJldmlld1wiICsgKFwiIGNhdC1zdG9yZT1cXFxcXCJEeW5hbWljXFxcXHUwMDJGUmV2aWV3XFxcXFwiXCIrcHVnX2F0dHIoXCJjYXQtc3RvcmUtcGFyYW0tcmV2aWV3LWlkXCIsIHJldmlldy5pZCwgdHJ1ZSwgZmFsc2UpKSArIFwiXFxcXHUwMDNFXFxcXHUwMDNDXFxcXHUwMDJGY2F0LXJldmlld1xcXFx1MDAzRVwiO1xcbiAgICB9XFxuICB9XFxufSkuY2FsbCh0aGlzKTtcXG5cXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0NcXFxcdTAwMkZkaXZcXFxcdTAwM0VcIjt9LmNhbGwodGhpcyxcInJldmlld3NcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnJldmlld3M6dHlwZW9mIHJldmlld3MhPT1cInVuZGVmaW5lZFwiP3Jldmlld3M6dW5kZWZpbmVkKSk7fSBjYXRjaCAoZXJyKSB7cHVnX3JldGhyb3coZXJyLCBwdWdfZGVidWdfZmlsZW5hbWUsIHB1Z19kZWJ1Z19saW5lKTt9O3JldHVybiBwdWdfaHRtbDt9Jyxcblx0ZXJyb3JUZW1wbGF0ZVByb3ZpZGVyTmFtZTogJ3B1ZycsXG5cdGNvbXBpbGVkRXJyb3JUZW1wbGF0ZTogJ2Z1bmN0aW9uIHB1Z19yZXRocm93KG4sZSxyLHQpe2lmKCEobiBpbnN0YW5jZW9mIEVycm9yKSl0aHJvdyBuO2lmKCEoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHdpbmRvdyYmZXx8dCkpdGhyb3cgbi5tZXNzYWdlKz1cIiBvbiBsaW5lIFwiK3Isbjt0cnl7dD10fHxyZXF1aXJlKFwiZnNcIikucmVhZEZpbGVTeW5jKGUsXCJ1dGY4XCIpfWNhdGNoKGUpe3B1Z19yZXRocm93KG4sbnVsbCxyKX12YXIgaT0zLGE9dC5zcGxpdChcIlxcXFxuXCIpLG89TWF0aC5tYXgoci1pLDApLGg9TWF0aC5taW4oYS5sZW5ndGgscitpKSxpPWEuc2xpY2UobyxoKS5tYXAoZnVuY3Rpb24obixlKXt2YXIgdD1lK28rMTtyZXR1cm4odD09cj9cIiAgPiBcIjpcIiAgICBcIikrdCtcInwgXCIrbn0pLmpvaW4oXCJcXFxcblwiKTt0aHJvdyBuLnBhdGg9ZSxuLm1lc3NhZ2U9KGV8fFwiUHVnXCIpK1wiOlwiK3IrXCJcXFxcblwiK2krXCJcXFxcblxcXFxuXCIrbi5tZXNzYWdlLG59ZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3ZhciBwdWdfZGVidWdfZmlsZW5hbWUsIHB1Z19kZWJ1Z19saW5lO3RyeSB7fSBjYXRjaCAoZXJyKSB7cHVnX3JldGhyb3coZXJyLCBwdWdfZGVidWdfZmlsZW5hbWUsIHB1Z19kZWJ1Z19saW5lKTt9O3JldHVybiBwdWdfaHRtbDt9J1xufSxcbntcblx0bmFtZTogJ2hlYWQnLFxuXHRjb25zdHJ1Y3RvcjogcmVxdWlyZSgnLi9jYXRiZXJyeV9jb21wb25lbnRzL2hlYWQvSGVhZC5qcycpLFxuXHRwcm9wZXJ0aWVzOiB7XCJuYW1lXCI6XCJoZWFkXCIsXCJ0ZW1wbGF0ZVwiOlwiLi9oZWFkLnB1Z1wiLFwibG9naWNcIjpcIi4vSGVhZC5qc1wifSxcblx0dGVtcGxhdGVQcm92aWRlck5hbWU6ICdwdWcnLFxuXHRjb21waWxlZFRlbXBsYXRlOiAnZnVuY3Rpb24gcHVnX2VzY2FwZShlKXt2YXIgYT1cIlwiK2UsdD1wdWdfbWF0Y2hfaHRtbC5leGVjKGEpO2lmKCF0KXJldHVybiBlO3ZhciByLGMsbixzPVwiXCI7Zm9yKHI9dC5pbmRleCxjPTA7cjxhLmxlbmd0aDtyKyspe3N3aXRjaChhLmNoYXJDb2RlQXQocikpe2Nhc2UgMzQ6bj1cIiZxdW90O1wiO2JyZWFrO2Nhc2UgMzg6bj1cIiZhbXA7XCI7YnJlYWs7Y2FzZSA2MDpuPVwiJmx0O1wiO2JyZWFrO2Nhc2UgNjI6bj1cIiZndDtcIjticmVhaztkZWZhdWx0OmNvbnRpbnVlfWMhPT1yJiYocys9YS5zdWJzdHJpbmcoYyxyKSksYz1yKzEscys9bn1yZXR1cm4gYyE9PXI/cythLnN1YnN0cmluZyhjLHIpOnN9XFxudmFyIHB1Z19tYXRjaF9odG1sPS9bXCImPD5dLztcXG5mdW5jdGlvbiBwdWdfcmV0aHJvdyhuLGUscix0KXtpZighKG4gaW5zdGFuY2VvZiBFcnJvcikpdGhyb3cgbjtpZighKFwidW5kZWZpbmVkXCI9PXR5cGVvZiB3aW5kb3cmJmV8fHQpKXRocm93IG4ubWVzc2FnZSs9XCIgb24gbGluZSBcIityLG47dHJ5e3Q9dHx8cmVxdWlyZShcImZzXCIpLnJlYWRGaWxlU3luYyhlLFwidXRmOFwiKX1jYXRjaChlKXtwdWdfcmV0aHJvdyhuLG51bGwscil9dmFyIGk9MyxhPXQuc3BsaXQoXCJcXFxcblwiKSxvPU1hdGgubWF4KHItaSwwKSxoPU1hdGgubWluKGEubGVuZ3RoLHIraSksaT1hLnNsaWNlKG8saCkubWFwKGZ1bmN0aW9uKG4sZSl7dmFyIHQ9ZStvKzE7cmV0dXJuKHQ9PXI/XCIgID4gXCI6XCIgICAgXCIpK3QrXCJ8IFwiK259KS5qb2luKFwiXFxcXG5cIik7dGhyb3cgbi5wYXRoPWUsbi5tZXNzYWdlPShlfHxcIlB1Z1wiKStcIjpcIityK1wiXFxcXG5cIitpK1wiXFxcXG5cXFxcblwiK24ubWVzc2FnZSxufWZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDt2YXIgcHVnX2RlYnVnX2ZpbGVuYW1lLCBwdWdfZGVidWdfbGluZTt0cnkgezt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uICh0aXRsZSkgeztwdWdfZGVidWdfbGluZSA9IDE7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDbWV0YSBjaGFyc2V0PVxcXFxcIlVURi04XFxcXFwiXFxcXHUwMDJGXFxcXHUwMDNFXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gMjtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0N0aXRsZVxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDI7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIChwdWdfZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aXRsZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXFxcdTAwM0NcXFxcdTAwMkZ0aXRsZVxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDM7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDc2NyaXB0IHNyYz1cXFxcXCJleHRlcm5hbHMuanNcXFxcXCJcXFxcdTAwM0VcXFxcdTAwM0NcXFxcdTAwMkZzY3JpcHRcXFxcdTAwM0VcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSA0O1xcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcXFx1MDAzQ3NjcmlwdCBzcmM9XFxcXFwiYXBwLmpzXFxcXFwiXFxcXHUwMDNFXFxcXHUwMDNDXFxcXHUwMDJGc2NyaXB0XFxcXHUwMDNFXCI7fS5jYWxsKHRoaXMsXCJ0aXRsZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudGl0bGU6dHlwZW9mIHRpdGxlIT09XCJ1bmRlZmluZWRcIj90aXRsZTp1bmRlZmluZWQpKTt9IGNhdGNoIChlcnIpIHtwdWdfcmV0aHJvdyhlcnIsIHB1Z19kZWJ1Z19maWxlbmFtZSwgcHVnX2RlYnVnX2xpbmUpO307cmV0dXJuIHB1Z19odG1sO30nLFxuXHRlcnJvclRlbXBsYXRlUHJvdmlkZXJOYW1lOiBudWxsLFxuXHRjb21waWxlZEVycm9yVGVtcGxhdGU6IG51bGxcbn0sXG57XG5cdG5hbWU6ICdyZXZpZXcnLFxuXHRjb25zdHJ1Y3RvcjogcmVxdWlyZSgnLi9jYXRiZXJyeV9jb21wb25lbnRzL3Jldmlldy9pbmRleC5qcycpLFxuXHRwcm9wZXJ0aWVzOiB7XCJuYW1lXCI6XCJyZXZpZXdcIixcInRlbXBsYXRlXCI6XCIuL3RlbXBsYXRlLnB1Z1wiLFwiZXJyb3JUZW1wbGF0ZVwiOlwiLi9lcnJvci5wdWdcIixcImxvZ2ljXCI6XCJpbmRleC5qc1wifSxcblx0dGVtcGxhdGVQcm92aWRlck5hbWU6ICdwdWcnLFxuXHRjb21waWxlZFRlbXBsYXRlOiAnZnVuY3Rpb24gcHVnX2F0dHIodCxlLG4sZil7cmV0dXJuIGUhPT0hMSYmbnVsbCE9ZSYmKGV8fFwiY2xhc3NcIiE9PXQmJlwic3R5bGVcIiE9PXQpP2U9PT0hMD9cIiBcIisoZj90OnQrXFwnPVwiXFwnK3QrXFwnXCJcXCcpOihcImZ1bmN0aW9uXCI9PXR5cGVvZiBlLnRvSlNPTiYmKGU9ZS50b0pTT04oKSksXCJzdHJpbmdcIj09dHlwZW9mIGV8fChlPUpTT04uc3RyaW5naWZ5KGUpLG58fGUuaW5kZXhPZihcXCdcIlxcJyk9PT0tMSk/KG4mJihlPXB1Z19lc2NhcGUoZSkpLFwiIFwiK3QrXFwnPVwiXFwnK2UrXFwnXCJcXCcpOlwiIFwiK3QrXCI9XFwnXCIrZS5yZXBsYWNlKC9cXCcvZyxcIiYjMzk7XCIpK1wiXFwnXCIpOlwiXCJ9XFxuZnVuY3Rpb24gcHVnX2VzY2FwZShlKXt2YXIgYT1cIlwiK2UsdD1wdWdfbWF0Y2hfaHRtbC5leGVjKGEpO2lmKCF0KXJldHVybiBlO3ZhciByLGMsbixzPVwiXCI7Zm9yKHI9dC5pbmRleCxjPTA7cjxhLmxlbmd0aDtyKyspe3N3aXRjaChhLmNoYXJDb2RlQXQocikpe2Nhc2UgMzQ6bj1cIiZxdW90O1wiO2JyZWFrO2Nhc2UgMzg6bj1cIiZhbXA7XCI7YnJlYWs7Y2FzZSA2MDpuPVwiJmx0O1wiO2JyZWFrO2Nhc2UgNjI6bj1cIiZndDtcIjticmVhaztkZWZhdWx0OmNvbnRpbnVlfWMhPT1yJiYocys9YS5zdWJzdHJpbmcoYyxyKSksYz1yKzEscys9bn1yZXR1cm4gYyE9PXI/cythLnN1YnN0cmluZyhjLHIpOnN9XFxudmFyIHB1Z19tYXRjaF9odG1sPS9bXCImPD5dLztcXG5mdW5jdGlvbiBwdWdfcmV0aHJvdyhuLGUscix0KXtpZighKG4gaW5zdGFuY2VvZiBFcnJvcikpdGhyb3cgbjtpZighKFwidW5kZWZpbmVkXCI9PXR5cGVvZiB3aW5kb3cmJmV8fHQpKXRocm93IG4ubWVzc2FnZSs9XCIgb24gbGluZSBcIityLG47dHJ5e3Q9dHx8cmVxdWlyZShcImZzXCIpLnJlYWRGaWxlU3luYyhlLFwidXRmOFwiKX1jYXRjaChlKXtwdWdfcmV0aHJvdyhuLG51bGwscil9dmFyIGk9MyxhPXQuc3BsaXQoXCJcXFxcblwiKSxvPU1hdGgubWF4KHItaSwwKSxoPU1hdGgubWluKGEubGVuZ3RoLHIraSksaT1hLnNsaWNlKG8saCkubWFwKGZ1bmN0aW9uKG4sZSl7dmFyIHQ9ZStvKzE7cmV0dXJuKHQ9PXI/XCIgID4gXCI6XCIgICAgXCIpK3QrXCJ8IFwiK259KS5qb2luKFwiXFxcXG5cIik7dGhyb3cgbi5wYXRoPWUsbi5tZXNzYWdlPShlfHxcIlB1Z1wiKStcIjpcIityK1wiXFxcXG5cIitpK1wiXFxcXG5cXFxcblwiK24ubWVzc2FnZSxufWZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDt2YXIgcHVnX2RlYnVnX2ZpbGVuYW1lLCBwdWdfZGVidWdfbGluZTt0cnkgezt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChyZXZpZXcsIHJldmlld1N0b3JlSW5zdGFuY2VJZCkgeztwdWdfZGVidWdfbGluZSA9IDE7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDZGl2IGNsYXNzPVxcXFxcInJldmlldy1ibG9ja1xcXFxcIlxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDI7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDcFxcXFx1MDAzRVwiO1xcbjtwdWdfZGVidWdfbGluZSA9IDI7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIChwdWdfZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSByZXZpZXcudGV4dCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXFxcdTAwM0NcXFxcdTAwMkZwXFxcXHUwMDNFXCI7XFxuO3B1Z19kZWJ1Z19saW5lID0gNDtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0NkaXYgY2xhc3M9XFxcXFwiY29tbWVudHMtYmxvY2tcXFxcXCJcXFxcdTAwM0VcIjtcXG47cHVnX2RlYnVnX2xpbmUgPSA1O1xcbi8vIGl0ZXJhdGUgcmV2aWV3LmNvbW1lbnRzXFxuOyhmdW5jdGlvbigpe1xcbiAgdmFyICRvYmogPSByZXZpZXcuY29tbWVudHM7XFxuICBpZiAoXFwnbnVtYmVyXFwnID09IHR5cGVvZiAkb2JqLmxlbmd0aCkge1xcbiAgICAgIGZvciAodmFyIHB1Z19pbmRleDAgPSAwLCAkbCA9ICRvYmoubGVuZ3RoOyBwdWdfaW5kZXgwIDwgJGw7IHB1Z19pbmRleDArKykge1xcbiAgICAgICAgdmFyIGNvbW1lbnQgPSAkb2JqW3B1Z19pbmRleDBdO1xcbjtwdWdfZGVidWdfbGluZSA9IDY7XFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDY2F0LWNvbW1lbnRcIiArIChwdWdfYXR0cihcImNhdC1zdG9yZS1wYXJhbS1jb21tZW50LWlkXCIsIGNvbW1lbnQuaWQsIHRydWUsIGZhbHNlKStwdWdfYXR0cihcImNhdC1zdG9yZS1wYXJhbS1pbnN0YW5jZS1pZFwiLCByZXZpZXdTdG9yZUluc3RhbmNlSWQsIHRydWUsIGZhbHNlKStcIiBjYXQtc3RvcmU9XFxcXFwiRHluYW1pY1xcXFx1MDAyRkNvbW1lbnRcXFxcXCJcIikgKyBcIlxcXFx1MDAzRVxcXFx1MDAzQ1xcXFx1MDAyRmNhdC1jb21tZW50XFxcXHUwMDNFXCI7XFxuICAgICAgfVxcbiAgfSBlbHNlIHtcXG4gICAgdmFyICRsID0gMDtcXG4gICAgZm9yICh2YXIgcHVnX2luZGV4MCBpbiAkb2JqKSB7XFxuICAgICAgJGwrKztcXG4gICAgICB2YXIgY29tbWVudCA9ICRvYmpbcHVnX2luZGV4MF07XFxuO3B1Z19kZWJ1Z19saW5lID0gNjtcXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXFxcdTAwM0NjYXQtY29tbWVudFwiICsgKHB1Z19hdHRyKFwiY2F0LXN0b3JlLXBhcmFtLWNvbW1lbnQtaWRcIiwgY29tbWVudC5pZCwgdHJ1ZSwgZmFsc2UpK3B1Z19hdHRyKFwiY2F0LXN0b3JlLXBhcmFtLWluc3RhbmNlLWlkXCIsIHJldmlld1N0b3JlSW5zdGFuY2VJZCwgdHJ1ZSwgZmFsc2UpK1wiIGNhdC1zdG9yZT1cXFxcXCJEeW5hbWljXFxcXHUwMDJGQ29tbWVudFxcXFxcIlwiKSArIFwiXFxcXHUwMDNFXFxcXHUwMDNDXFxcXHUwMDJGY2F0LWNvbW1lbnRcXFxcdTAwM0VcIjtcXG4gICAgfVxcbiAgfVxcbn0pLmNhbGwodGhpcyk7XFxuXFxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFxcXHUwMDNDXFxcXHUwMDJGZGl2XFxcXHUwMDNFXFxcXHUwMDNDXFxcXHUwMDJGZGl2XFxcXHUwMDNFXCI7fS5jYWxsKHRoaXMsXCJyZXZpZXdcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnJldmlldzp0eXBlb2YgcmV2aWV3IT09XCJ1bmRlZmluZWRcIj9yZXZpZXc6dW5kZWZpbmVkLFwicmV2aWV3U3RvcmVJbnN0YW5jZUlkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5yZXZpZXdTdG9yZUluc3RhbmNlSWQ6dHlwZW9mIHJldmlld1N0b3JlSW5zdGFuY2VJZCE9PVwidW5kZWZpbmVkXCI/cmV2aWV3U3RvcmVJbnN0YW5jZUlkOnVuZGVmaW5lZCkpO30gY2F0Y2ggKGVycikge3B1Z19yZXRocm93KGVyciwgcHVnX2RlYnVnX2ZpbGVuYW1lLCBwdWdfZGVidWdfbGluZSk7fTtyZXR1cm4gcHVnX2h0bWw7fScsXG5cdGVycm9yVGVtcGxhdGVQcm92aWRlck5hbWU6ICdwdWcnLFxuXHRjb21waWxlZEVycm9yVGVtcGxhdGU6ICdmdW5jdGlvbiBwdWdfcmV0aHJvdyhuLGUscix0KXtpZighKG4gaW5zdGFuY2VvZiBFcnJvcikpdGhyb3cgbjtpZighKFwidW5kZWZpbmVkXCI9PXR5cGVvZiB3aW5kb3cmJmV8fHQpKXRocm93IG4ubWVzc2FnZSs9XCIgb24gbGluZSBcIityLG47dHJ5e3Q9dHx8cmVxdWlyZShcImZzXCIpLnJlYWRGaWxlU3luYyhlLFwidXRmOFwiKX1jYXRjaChlKXtwdWdfcmV0aHJvdyhuLG51bGwscil9dmFyIGk9MyxhPXQuc3BsaXQoXCJcXFxcblwiKSxvPU1hdGgubWF4KHItaSwwKSxoPU1hdGgubWluKGEubGVuZ3RoLHIraSksaT1hLnNsaWNlKG8saCkubWFwKGZ1bmN0aW9uKG4sZSl7dmFyIHQ9ZStvKzE7cmV0dXJuKHQ9PXI/XCIgID4gXCI6XCIgICAgXCIpK3QrXCJ8IFwiK259KS5qb2luKFwiXFxcXG5cIik7dGhyb3cgbi5wYXRoPWUsbi5tZXNzYWdlPShlfHxcIlB1Z1wiKStcIjpcIityK1wiXFxcXG5cIitpK1wiXFxcXG5cXFxcblwiK24ubWVzc2FnZSxufWZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDt2YXIgcHVnX2RlYnVnX2ZpbGVuYW1lLCBwdWdfZGVidWdfbGluZTt0cnkge30gY2F0Y2ggKGVycikge3B1Z19yZXRocm93KGVyciwgcHVnX2RlYnVnX2ZpbGVuYW1lLCBwdWdfZGVidWdfbGluZSk7fTtyZXR1cm4gcHVnX2h0bWw7fSdcbn1cblxuXTtcblxuY29uc3Qgcm91dGVEZWZpbml0aW9ucyA9IHJlcXVpcmUoJy4vcm91dGVzLmpzJykgfHwgW107XG5jb25zdCByb3V0ZURlc2NyaXB0b3JzID0gW3tcImV4cHJlc3Npb25cIjpcIi9cIixcInBhdGhQYXJhbWV0ZXJzXCI6W10sXCJxdWVyeVBhcmFtZXRlcnNcIjpbXSxcInBhdGhSZWdFeHBTb3VyY2VcIjpcIl4vJFwifV0gfHwgW107XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRzdG9yZXMsXG5cdGNvbXBvbmVudHMsXG5cdHJvdXRlRGVmaW5pdGlvbnMsXG5cdHJvdXRlRGVzY3JpcHRvcnNcbn07XG4iXX0=
