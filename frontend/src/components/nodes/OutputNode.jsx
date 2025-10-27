import React from 'react'

const OutputNode = ({ data, isConnectable }) => {
  return (
    <div className="custom-node output-node">
      {/* Header */}
      <div className="node-header">
        <div className="node-icon">📤</div>
        <div className="node-title">Output</div>
        <div className="node-settings">⚙️</div>
      </div>
      
      {/* Content */}
      <div className="node-content">
        <div className="description-text">
          Output of the result nodes as text
        </div>
        
        <div className="field-group">
          <div className="field-label">Output Text</div>
          <textarea 
            className="output-textarea"
            placeholder="Output will be generated based on query"
            defaultValue={data.outputText || ''}
            readOnly
          />
        </div>
      </div>
      
      {/* Input Handle */}
      <div className="node-handle input-handle" />
    </div>
  )
}

export default OutputNode
