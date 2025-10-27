import React from 'react'

const UserInputNode = ({ data, isConnectable }) => {
  return (
    <div className="custom-node user-input-node">
      {/* Header */}
      <div className="node-header">
        <div className="node-icon">📄</div>
        <div className="node-title">User Input</div>
        <div className="node-settings">⚙️</div>
      </div>
      
      {/* Content */}
      <div className="node-content">
        <div className="input-prompt">
          Enter point for querys
        </div>
        <div className="field-label">Query</div>
        <textarea 
          className="query-input"
          placeholder="Write your query here"
          defaultValue={data.query || ''}
        />
      </div>
      
      {/* Output Handle */}
      <div className="node-handle output-handle" />
    </div>
  )
}

export default UserInputNode
