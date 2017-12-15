class DynamicReview {

  constructor() {
    this.$context.setDependency('Feed');
  }

  load() {
    const reviewId = this.$context.params['review-id'];
    console.log(reviewId);
    return this.$context.getStoreData('Feed')
      .then(({hashWithReviews}) => ({
        review: hashWithReviews[reviewId],
        reviewStoreInstanceId: this.$context.storeInstanceId
      }));
  }

  handleRefreshComment({commentId, data}) {
    const reviewId = this.$context.params['review-id'];

    return this.$context
      .sendAction('Feed', 'update-comment', {reviewId, commentId, data})
      .then(() => this.$context.changed())
  }
}

module.exports = DynamicReview;

