const fakeFeed = require('./fakeFeed.json');

/*
 * This is a Catberry Cat-component file.
 * More details can be found here
 * http://catberry.org/documentation#stores-interface
 */

class Feed {

  constructor() {
    this.$lifetime = 0;

    this.feed = fakeFeed;
    this.hashWithReviews = {};
    this.hashWithComments = {};

    this.feed.forEach(review => {
      this.hashWithReviews[review.id] = review;

      if (review.comments.length) {
        review.comments.forEach(comment => (this.hashWithComments[comment.id] = comment));
      }
    });

    this.$lifetime = 0;

    if (this.$context.isBrowser) {
      window.feedStore = this;
    }
  }

  load() {
    return {
      feed: this.feed,
      hashWithReviews: this.hashWithReviews,
      hashWithComments: this.hashWithComments
    }
  }

  updateReview(reviewId, text) {
    this.hashWithReviews[reviewId].text = text;

    this.$context.changed();
  }
}

module.exports = Feed;

