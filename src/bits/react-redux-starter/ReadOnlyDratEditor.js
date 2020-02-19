const React = require('react')
const PropTypes = require('prop-types')

const { Editor } = require('react-draft-wysiwyg')

const ReadOnlyEditor = ({ content }) => {
  return (
    React.createElement(
      Editor,
      {
        initialContentState: content,
        readOnly: true,
        toolbarHidden: true,
        toolbarStyle: {
          display: 'none',
        },
        localization: {
          locale: 'pl',
        },
        editorStyle: {
          borderRadius: 2,
          border: 'none',
          padding: '0 15px',
        },
        wrapperStyle: {
          marginBottom: 20,
        },
      }
    )
  )
}

ReadOnlyEditor.propTypes = {
  content: PropTypes.object.isRequired,
}

export default ReadOnlyEditor