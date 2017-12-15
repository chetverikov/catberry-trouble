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

  handleUpdateReview(reviewId, data) {
    Object.assign(this.hashWithReviews[reviewId], data);
  }

  handleUpdateComment(commentId, data) {
    Object.assign(this.hashWithComments[commentId], data);
  }
}

module.exports = Feed;

