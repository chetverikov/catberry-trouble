class Review {
  constructor() {

  }

  render() {
    this.$context.locator.resolve('logger').info('Review render');

    return this.$context.getStoreData();
  }
}

module.exports = Review;

