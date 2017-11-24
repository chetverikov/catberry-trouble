class Review {
  constructor() {

  }

  render() {
    this.$context.locator.resolve('logger').info('Review render.');

    const reviewId = this.$context.attributes['review-id'];

    return this.$context.getStoreData()
      .then(data => ({review: data.hashWithReviews[reviewId]}));
  }
}

module.exports = Review;

