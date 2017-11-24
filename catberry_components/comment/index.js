class Comment {

  render() {
    const commentId = this.$context.attributes['comment-id'];

    return this.$context.getStoreData()
      .then(data => ({comment: data.hashWithComments[commentId]}));
  }
}

module.exports = Comment;

