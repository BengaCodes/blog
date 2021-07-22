import React from 'react'
import ReactDOM from 'react-dom'
import './styles/main.scss'
import App from './App'

import Amplify from 'aws-amplify'
// eslint-disable-next-line camelcase
import aws_exports from './aws-exports'

Amplify.configure(aws_exports)

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
