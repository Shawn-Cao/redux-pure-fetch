//for something like:
// const fetchPosts = reddit => dispatch => {
//   dispatch(requestPosts(reddit))
//   return fetch(`https://www.reddit.com/r/${reddit}.json`)
//     .then(response => response.json())
//     .then(json => dispatch(receivePosts(reddit, json)))
// }

export default (payload) => {
  return fetch(payload.url, payload.init || payload.options || payload.settings || {})
    .then(response => response.json());
};
