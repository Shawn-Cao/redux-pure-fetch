export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_REDDIT = 'SELECT_REDDIT'
export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT'

export const selectReddit = reddit => ({
  type: SELECT_REDDIT,
  payload: {
    reddit
  }
})

export const invalidateReddit = reddit => ({
  type: INVALIDATE_REDDIT,
  payload: {
    reddit
  }
})

export const requestPosts = reddit => ({
  type: 'FETCH-CLIENT',
  payload: {
    url: `https://www.reddit.com/r/${reddit}.json`,
    reddit
  },
  then: (json) => mapPostResponse(reddit, json)
})

const mapPostResponse = (reddit, json) => ({
  reddit,
  posts: json.data.children.map(child => child.data),
  receivedAt: Date.now()
});

const shouldFetchPosts = (state, reddit) => {
  const posts = state.postsByReddit[reddit]
  if (!posts) {
    return true
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate
}

export const fetchPostsIfNeeded = reddit => (dispatch, getState) => {
  if (shouldFetchPosts(getState(), reddit)) {
    return dispatch(requestPosts(reddit))
  }
}
