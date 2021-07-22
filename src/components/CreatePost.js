import { API, graphqlOperation } from 'aws-amplify'
import { useState } from 'react'
import { createPost } from '../graphql/mutations'



const CreatePost = () => {
  const [inputs, setInputs] = useState({
    postOwnerId: '',
    postTitle: '',
    postBody: '',
    postOwnerUsername: '',
  })

  const handleChange = e => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  const handlePostCreate = async e => {
    e.preventDefault()
    const { postOwnerId, postBody, postOwnerUsername, postTitle } = inputs
    const input = {
      postOwnerId,
      postBody,
      postOwnerUsername,
      postTitle,
      createdAt: new Date().toISOString,
    }

    await API.graphql(graphqlOperation(createPost, { input }))

    setInputs({
      postOwnerId: '',
      postTitle: '',
      postBody: '',
      postOwnerUsername: '',
    })
  }

  console.log('Title: ', inputs.postTitle, 'Body: ', inputs.postBody)


  return (
    <form onSubmit={handlePostCreate} className="add-post">
      <input onChange={handleChange} value={inputs.postTitle} name="postTitle" required placeholder="Title" style={{ font: '19px' }} type="text" />
      <textarea onChange={handleChange} value={inputs.postBody} placeholder="New Blog Post" name="postBody" id="" cols="40" rows="10" required></textarea>
      <input  type="submit" className="btn" style={{ font: '19px' }} />
    </form>
  )
}

export default CreatePost
