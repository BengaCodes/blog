import { listPosts } from '../graphql/queries'
import { API, graphqlOperation } from 'aws-amplify'
import { useEffect, useState } from 'react'
import DeletePost from './DeletePost'
import EditPost from './EditPost'
import { onCreatePost, onDeletePost, onUpdatePost } from '../graphql/subscriptions'
import { deletePost, updatePost } from '../graphql/mutations'

const DisplayPosts = () => {
  const [posts, setPosts] = useState([])
  const [show, setShow] =  useState(false)
  const [postInput, setPostInput] = useState({
    id: '',
    postOwnerId: '',
    postOwnerUsername: '',
    postTitle: '',
    postBody: '',
  })

  useEffect(() => {
    const getPosts = async () => {
      const res = await API.graphql(graphqlOperation(listPosts))
      const data = res.data.listPosts.items
      setPosts(data)
    }
    getPosts()
    const subscribe = API.graphql(graphqlOperation(onCreatePost)).subscribe({
      next: postData => {
        const newPost = postData.value.data.onCreatePost
        const prevPosts = posts.filter(post => post.id !== newPost.id)
        const updatedPosts = [newPost, ...prevPosts]
        setPosts(updatedPosts)
      },
    })
    const deleteSub = API.graphql(graphqlOperation(onDeletePost)).subscribe({
      next: postData => {
        const deletedPost = postData.value.data.onDeletePost
        const updatedPosts = posts.filter(post => post.id !== deletedPost.id)
        setPosts(updatedPosts)
      },
    })
    const updateSub = API.graphql(graphqlOperation(onUpdatePost)).subscribe({
      next: postData => {
        const updatedPost = postData.value.data.onUpdatePost
        const updatedPosts = posts.map(post =>  post.id === updatePost.id ? { ...updatedPost } : post)
        console.log(updatedPosts)
        setPosts(updatedPosts)
      },
    })
    return () => subscribe.unsubscribe() && deleteSub.unsubscribe() && updateSub.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteAPost = async postId => {
    const input = {
      id: postId,
    }
    await API.graphql(graphqlOperation(deletePost, { input }))
  }

  const editPost = post => {
    setShow(!show)
    setPostInput({
      ...postInput,
      id: post.id,
      postOwnerId: post.postOwnerId,
      postBody: post.postBody,
      postTitle: post.postTitle,
      postOwnerUsername: post.postOwnerUsername,
    })
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }

  const updateAPost = async e => {
    console.log(postInput)
    try {
      e.preventDefault()
      const input = {
        ...postInput,
      }
      await API.graphql(graphqlOperation(updatePost, { input }))
      setShow(!show)
    } catch (err) {
      console.log(err)
    }
  }



  return (
    <div>
      {
        posts.length > 0 ? posts.map(post => <div style={rowStyle}  key={post.id} className="posts">
          <h1>{post.postTitle}</h1>
          <p>{post.postBody}</p>
          <cite style={{ color: '#0ca5e297' }}>
            {`Written by: ${post.postOwnerUsername} `}
            On
            {' '}
            <time>
              {new Date(post.createdAt).toDateString()}
            </time>
          </cite>
          <span>
            <DeletePost handleClick={() => deleteAPost(post.id)} />
            <EditPost handleClick={() => editPost(post)} />
          </span>
        </div>) : <p>Start adding posts here....</p>
      }
      {
        show && <div className="modal">
          <button className="close" onClick={() => setShow(!show)}>
            X
          </button>

          <form onSubmit={updateAPost} className="add-post">
            <input type="text" style={{ fontSize: '19px' }} value={postInput.postTitle} name="postTitle" onChange={e => setPostInput({ ...postInput, [e.target.name]: e.target.value })} />
            <input type="text" style={{ fontSize: '19px', height: '150px' }} value={postInput.postBody} name="postBody" onChange={e => setPostInput({ ...postInput, [e.target.name]: e.target.value })} />
            <button>Update Post</button>
          </form>
        </div>
      }
    </div>
  )
}

const rowStyle = {
  background: '#f4f4f4',
  padding: '10px',
  border: '1px #ccc dotted',
  margin: '14px',
}

export default DisplayPosts
