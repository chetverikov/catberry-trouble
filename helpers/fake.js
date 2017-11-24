const faker = require('faker');

module.exports = {

  /**
   * Generate data with follow structure:
   *
   * [
   *   {
   *     reviewId: String,
   *     reviewText: String,
   *     comments: [
   *       {
   *         commentId: String,
   *         commentText: String,
   *         likes: Number
   *       }
   *     ]
   *   }
   * ]
   *
   * @param {Object} [options]
   * @param {Number} [options.countReview] Count review for feed
   * @param {Number|Array} [options.countCommentsPerReview] Count comment per review (may be set as range)
   *
   * @return {Array} Feed's data
   */
  genFeedData(options = {}) {
    const feed = [];
    const {countReview = 10, countCommentsPerReview = [0, 5]} = options;

    for (let i = 0; i < countReview; i++) {
      feed.push(this.genReview(countCommentsPerReview));
    }
    console.log(JSON.stringify(feed, null, 2));
    return feed;
  },

  genReview(countCommentsPerReview = 0) {
    const review = {
      id: faker.random.uuid(),
      text: faker.lorem.paragraph(),
      comments: []
    };

    let count = countCommentsPerReview;

    if (Array.isArray(countCommentsPerReview)) {
      const [min, max] = countCommentsPerReview;

      count = faker.random.number({min, max});
    }

    for (let i = 0; i < count; i++) {
      review.comments.push(this.genComment());
    }

    return review;
  },

  genComment() {
    return {
      id: faker.random.uuid(),
      text: faker.lorem.words(),
      likes: faker.random.number(0, 30)
    }
  }
};
