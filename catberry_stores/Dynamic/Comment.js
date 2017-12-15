class DynamicComment {

  constructor() {
  }

  load() {
    const commentId = this.$context.params['comment-id'];
    const reviewStoreInstanceId = this.$context.params['instance-id'];

    return this.$context.getStoreData('Dynamic/Review', reviewStoreInstanceId)
      .then(data => {
        return data.review.comments.find(comment => comment.id === commentId);
      });
  }

  handleLike() {
    const commentId = this.$context.params['comment-id'];
    const reviewStoreInstanceId = this.$context.params['instance-id'];

    this.$context.getStoreData('Dynamic/Review', reviewStoreInstanceId)
      .then(data => {
        console.log(data);
        const comment = data.review.comments.find(comment => comment.id === commentId);

        return this.$context.sendAction(
          {
            storeName: 'Dynamic/Review',
            storeInstanceId: reviewStoreInstanceId
          },
          'refresh-comment',
          {
            commentId,
            data: {
              like: comment.like + 1
            }
          }
        );
      });
  }
}

module.exports = DynamicComment;

