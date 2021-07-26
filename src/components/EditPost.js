import PropTypes from 'prop-types'

const EditPost = ({ handleClick }) => {

  return (
    <button onClick={handleClick}>Edit</button>
  )
}

EditPost.propTypes = {
  handleClick: PropTypes.func.isRequired,
}

export default EditPost
