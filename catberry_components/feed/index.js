class Feed {
  render() {
    return this.$context.getStoreData()
      .then(data => ({reviews: data.feed}));
  }
}

module.exports = Feed;

