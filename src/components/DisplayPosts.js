import { getPost, listPosts } from '../graphql/queries'
import { API, graphqlOperation } from 'aws-amplify'
import { useEffect, useState } from 'react'
import DeletePost from './DeletePost'
import EditPost from './EditPost'

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
    getPosts()
  }, [])


  const getSinglePost = async postId => {
    const res = await API.graphql(graphqlOperation(getPost, { id: postId }))
    console.log(res.data)
  }



  return (
    <div>
      {
        posts.length > 0 ? posts.map(post => <div onClick={() => getSinglePost(post.id)} style={rowStyle}  key={post.id} className="posts">
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
            <DeletePost handleClick={() => console.log('I am delete button')} />
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
