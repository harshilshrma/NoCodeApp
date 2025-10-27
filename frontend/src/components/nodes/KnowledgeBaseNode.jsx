import React from 'react'

const KnowledgeBaseNode = ({ data, isConnectable }) => {
  return (
    <div className="custom-node knowledge-base-node">
      {/* Header */}
      <div className="node-header">
        <div className="node-icon">📚</div>
        <div className="node-title">Knowledge Base</div>
        <div className="node-settings">⚙️</div>
      </div>
      
      {/* Content */}
      <div className="node-content">
        <div className="toggle-section">
          <label className="toggle-label">
            <input type="checkbox" defaultChecked={data.llmSearch || false} />
            Let LLM search info in your file
          </label>
        </div>
        
        <div className="field-group">
          <div className="field-label">File for Knowledge Base</div>
          <div className="file-upload-area">
            {data.fileName ? (
              <div className="file-display">
                <span>{data.fileName}</span>
                <button className="remove-file">🗑️</button>
              </div>
            ) : (
              <div className="upload-placeholder">
                Click to upload PDF
              </div>
            )}
          </div>
        </div>
        
        <div className="field-group">
          <div className="field-label">Embedding Model</div>
          <select className="model-select" defaultValue={data.embeddingModel || 'text-embedding-3-large'}>
            <option value="text-embedding-3-large">text-embedding-3-large</option>
            <option value="text-embedding-3-small">text-embedding-3-small</option>
          </select>
        </div>
        
        <div className="field-group">
          <div className="field-label">API Key</div>
          <div className="api-key-input">
            <input type="password" placeholder="Enter API key" defaultValue={data.apiKey || ''} />
            <button className="toggle-visibility">👁️</button>
          </div>
        </div>
      </div>
      
      {/* Handles */}
      <div className="node-handle input-handle" />
      <div className="node-handle output-handle" />
    </div>
  )
}

export default KnowledgeBaseNode
