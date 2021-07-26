import { withAuthenticator } from 'aws-amplify-react'
import CreatePost from './components/CreatePost'
import DisplayPosts from './components/DisplayPosts'
import '@aws-amplify/ui/dist/style.css'

const App = () => {
  return (
    <div className="App">
      <CreatePost />
      <DisplayPosts />
    </div>
  )
}

export default withAuthenticator(App, { includeGreetings: true })
