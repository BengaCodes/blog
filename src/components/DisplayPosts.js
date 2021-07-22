import { listPosts } from '../graphql/queries'
import { API, graphqlOperation } from 'aws-amplify'
import { useEffect, useState } from 'react'
import DeletePost from './DeletePost'
import EditPost from './EditPost'
import { onCreatePost } from '../graphql/subscriptions'
import { deletePost } from '../graphql/mutations'

const DisplayPosts = () => {
  const [posts, setPosts] = useState([])
  // const [singlePost, setSinglePost] = useState(null)

  useEffect(() => {
    const getPosts = async () => {
      const res = await API.graphql(graphqlOperation(listPosts))
      const data = res.data.listPosts.items
      setPosts(data)
      console.log('All posts: ', data)
    }

    const createPostListener = API.graphql(graphqlOperation(onCreatePost)).subscribe({
      next: postData => {
        console.log('Post Data: ', postData.value.data.onCreatePost)
        const newPost = postData.value.data.onCreatePost
        const prevPosts = posts.filter(post => post.id !== newPost.id)
        const updatedPosts = [newPost, ...prevPosts]
        setPosts(updatedPosts)
      },
    })
    getPosts()
    return () => {
      return createPostListener.unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteAPost = async post => {
    await API.graphql(graphqlOperation(deletePost, { input: post }))
  }


  // const getSinglePost = async postId => {
  //   const res = await API.graphql(graphqlOperation(getPost, { id: postId }))
  //   console.log(res.data)
  // }



  return (
    <div>
      {
        posts.length > 0 ? posts.map(post => <div onClick={() => console.log('Heey')} style={rowStyle}  key={post.id} className="posts">
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
            <DeletePost handleClick={() => deleteAPost(post)} />
            <EditPost handleClick={() => console.log('I am delete button')} />
          </span>
        </div>) : <p>Start adding posts here....</p>
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
