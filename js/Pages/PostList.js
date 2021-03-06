import Parse from 'parse'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import LinearProgress from '@material-ui/core/LinearProgress'
import InfiniteScroll from 'react-infinite-scroller'
import { withAlert } from 'react-alert'

import {
  currentUserName,
  login,
  more,
  keyWord,
  posts,
  postsCount,
  loading
} from '../redux/selectors'
import {
  updateAccount,
  updateHeader,
  updateFooter,
  updateMore,
  loadPosts,
  updateKeyWord,
  updateLoading
} from '../redux/actions'

const styles = theme => ({
  load: {
    flexGrow: 1
  }
})

const Post = Parse.Object.extend('Post')
const query = new Parse.Query(Post)
query.limit(30)
query.descending('createdAt')

class PostList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { snippet: false }

    const query = window.location.search
    const arr = query.split('&')
    const postId = arr[0].substr(4)

    if (postId) {
      this.props.history.push('/post/' + postId)
    }
  }

  handleClose = () => {
    this.setState({ snippet: false })
  }

  onAdd = () => {
    const { history, login } = this.props
    if (login) {
      history.push('/edit')
    } else {
      this.onMy()
    }
  }

  onMy = () => {
    this.props.history.push('./my')
  }

  onFavorite = () => {
    this.setState({ snippet: true })
  }

  onSearch = e => {
    const { boundUpdateKeyWord } = this.props
    if (e.keyCode === 13) {
      boundUpdateKeyWord(event.target.value)
    }
  }

  loadMore = () => {
    const {
      boundUpdateAccount,
      boundLoadPosts,
      boundUpdateMore,
      boundUpdateLoading,
      postsCount,
      keyWord,
      loading,
      alert
    } = this.props

    if (loading) {
      return
    }

    boundUpdateLoading(true)

    query.skip(postsCount)
    query.matches('title', keyWord)
    query
      .find()
      .then(results => {
        boundLoadPosts(results)
        boundUpdateLoading(false)
        if (results.length < 1) {
          boundUpdateMore(false)
          return
        }
      })
      .catch(err => {
        boundUpdateLoading(false)
        const { code, messge } = err
        if (code && code === Parse.Error.INVALID_SESSION_TOKEN) {
          Parse.User.logOut()
          boundUpdateAccount(null)
          alert.show('登录已过期，请重新登录')
        } else {
          alert.show(messge)
        }
      })
  }

  onListItem = item => {
    this.props.history.push('/post/' + item.id)
  }

  render() {
    const { classes, boundUpdateHeader, boundUpdateFooter, posts, more } = this.props
    boundUpdateHeader({ title: '全部文章', onSearch: e => this.onSearch(e) })
    boundUpdateFooter({
      onFavorite: () => this.onFavorite(),
      onAdd: () => this.onAdd(),
      onMy: () => this.onMy()
    })

    return (
      <React.Fragment>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadMore}
          hasMore={more}
          loader={
            <div className={classes.load} key={-1}>
              <LinearProgress color="secondary" />
            </div>
          }
        >
          {posts.map(item => (
            <ListItem button onClick={() => this.onListItem(item)} key={item.id}>
              <ListItemText primary={item.get('title')} secondary={item.get('description')} />
            </ListItem>
          ))}
        </InfiniteScroll>
        <Dialog open={this.state.snippet} onClose={this.handleClose}>
          <DialogTitle id="alert-dialog-title">知识片段</DialogTitle>
          <DialogContent>
            <DialogContentText>coming soon...</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

PostList.propTypes = {
  classes: PropTypes.object.isRequired
}

export default connect(
  state => {
    return {
      currentUserName: currentUserName(state),
      login: login(state),
      more: more(state),
      keyWord: keyWord(state),
      posts: posts(state),
      postsCount: postsCount(state),
      loading: loading(state)
    }
  },
  dispatch => {
    return {
      boundUpdateAccount: user => dispatch(updateAccount(user)),
      boundUpdateKeyWord: content => dispatch(updateKeyWord(content)),
      boundUpdateHeader: header => dispatch(updateHeader(header)),
      boundUpdateFooter: footer => dispatch(updateFooter(footer)),
      boundUpdateMore: more => dispatch(updateMore(more)),
      boundLoadPosts: posts => dispatch(loadPosts(posts)),
      boundUpdateLoading: loading => dispatch(updateLoading(loading))
    }
  }
)(withStyles(styles)(withAlert(PostList)))
