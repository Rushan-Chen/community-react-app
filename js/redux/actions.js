import {
  UPDATE_HEADER,
  UPDATE_FOOTER,
  UPDATE_CURRENT_USER,
  UPDATE_MORE,
  UPDATE_KEY_WORD,
  UPDATE_POST,
  UPDATE_LOADING,
  LOAD_POSTS
} from './actionTypes'

export const updateHeader = ({ ...header }) => ({
  type: UPDATE_HEADER,
  payload: header
})

export const updateFooter = ({ ...footer }) => ({
  type: UPDATE_FOOTER,
  payload: footer
})

export const updateAccount = user => ({
  type: UPDATE_CURRENT_USER,
  payload: {
    user
  }
})

export const updateMore = more => ({
  type: UPDATE_MORE,
  payload: {
    more
  }
})

export const loadPosts = posts => ({
  type: LOAD_POSTS,
  payload: {
    posts
  }
})

export const updatePost = post => ({
  type: UPDATE_POST,
  payload: {
    post
  }
})

export const updateKeyWord = keyWord => ({
  type: UPDATE_KEY_WORD,
  payload: {
    keyWord
  }
})

export const updateLoading = loading => ({
  type: UPDATE_LOADING,
  payload: {
    loading
  }
})
