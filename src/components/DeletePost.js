import PropTypes from 'prop-types'

const DeletePost = ({ handleClick }) => {
  return (
    <button onClick={handleClick}>Delete</button>
  )
}

DeletePost.propTypes = {
  handleClick: PropTypes.func.isRequired,
}

export default DeletePost
