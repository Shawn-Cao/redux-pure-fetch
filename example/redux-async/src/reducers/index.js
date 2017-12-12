import { combineReducers } from 'redux'
import {
  SELECT_REDDIT, INVALIDATE_REDDIT
} from '../actions'

const selectedReddit = (state = 'reactjs', action) => {
  switch (action.type) {
    case SELECT_REDDIT:
      return action.payload.reddit
    default:
      return state
  }
}

const posts = (state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {
  switch (action.type) {
    case INVALIDATE_REDDIT:
      return {
        ...state,
        didInvalidate: true
      }
    case 'FETCH-CLIENT-START':
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case 'FETCH-CLIENT-SUCCESS':
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        items: action.payload.posts,
        lastUpdated: action.payload.receivedAt
      }
    default:
      return state
  }
}

const postsByReddit = (state = { }, action) => {
  switch (action.type) {
    case INVALIDATE_REDDIT:
    case 'FETCH-CLIENT-SUCCESS':
    case 'FETCH-CLIENT-START':
      return {
        ...state,
        [action.payload.reddit]: posts(state[action.payload.reddit], action)
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  postsByReddit,
  selectedReddit
})

export default rootReducer
