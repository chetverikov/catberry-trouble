## How to use

Clone repository and install packages

```
npm install
```

Start in debug mode

```
npm run debug
```

Open browser

```
http://localhost:3000
```

And update a review/comment or set like for a comment in the Developers Console

```
window.feedStore.handleUpdateReview('faba08c9-83b8-4dd6-8e5d-c4e08d837605', 'New text');
window.feedStore.handleUpdateComment('c6156287-0d06-433c-9829-48f9ca4db99e', 'New text for comment');
window.feedStore.handleSetLikeForComment('c6156287-0d06-433c-9829-48f9ca4db99e');

```

And in console...

```
Component "CAT-FEED" is being rendered...
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-COMMENT" is unbound
Logger.js:28 Component "CAT-REVIEW" is unbound
Logger.js:28 Component "CAT-REVIEW" is unbound
Logger.js:28 Component "CAT-REVIEW" is unbound
Logger.js:28 Component "CAT-REVIEW" is unbound
Logger.js:28 Component "CAT-REVIEW" is unbound
Logger.js:28 Component "CAT-REVIEW" is unbound
Logger.js:28 Component "CAT-REVIEW" is unbound
Logger.js:28 Component "CAT-REVIEW" is unbound
Logger.js:28 Component "CAT-REVIEW" is unbound
Logger.js:28 Component "CAT-REVIEW" is unbound
Logger.js:28 Component "CAT-FEED" is unbound
(10)Logger.js:28 Component "CAT-REVIEW" is being rendered...
(10)Logger.js:26 Review render.
(24)Logger.js:28 Component "CAT-COMMENT" is being rendered...
Logger.js:28 Component "CAT-REVIEW" rendered (21 ms)
(2)Logger.js:28 Component "CAT-REVIEW" rendered (20 ms)
(3)Logger.js:28 Component "CAT-REVIEW" is bound
(4)Logger.js:28 Component "CAT-COMMENT" rendered (17 ms)
(6)Logger.js:28 Component "CAT-COMMENT" rendered (16 ms)
(7)Logger.js:28 Component "CAT-COMMENT" rendered (15 ms)
(7)Logger.js:28 Component "CAT-COMMENT" rendered (14 ms)
(24)Logger.js:28 Component "CAT-COMMENT" is bound
(2)Logger.js:28 Component "CAT-REVIEW" rendered (44 ms)
(5)Logger.js:28 Component "CAT-REVIEW" rendered (43 ms)
(7)Logger.js:28 Component "CAT-REVIEW" is bound
Logger.js:28 Component "CAT-FEED" rendered (73 ms)
Logger.js:28 Component "CAT-FEED" is bound
Logger.js:28 Document updated (1 store(s) changed)
```

All review/comments components has been re-render...
