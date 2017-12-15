class Comment {

  render() {
    return this.$context.getStoreData().then(comment => ({comment}));
  }

  bind() {
    return {
      click: {
        button: () => {
          this.$context.sendAction('like');
        }
      }
    }
  }
}

module.exports = Comment;

