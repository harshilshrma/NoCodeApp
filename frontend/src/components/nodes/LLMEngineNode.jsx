import React from 'react'

const LLMEngineNode = ({ data, isConnectable }) => {
  return (
    <div className="custom-node llm-engine-node">
      {/* Header */}
      <div className="node-header">
        <div className="node-icon">✨</div>
        <div className="node-title">LLM (OpenAI)</div>
        <div className="node-settings">⚙️</div>
      </div>
      
      {/* Content */}
      <div className="node-content">
        <div className="description-text">
          Run a query with OpenAI LLM
        </div>
        
        <div className="field-group">
          <div className="field-label">Model</div>
          <select className="model-select" defaultValue={data.model || 'GPT 4o-Mini'}>
            <option value="GPT 4o-Mini">GPT 4o-Mini</option>
            <option value="GPT-4">GPT-4</option>
            <option value="GPT-3.5-turbo">GPT-3.5-turbo</option>
          </select>
        </div>
        
        <div className="field-group">
          <div className="field-label">API Key</div>
          <div className="api-key-input">
            <input type="password" placeholder="Enter API key" defaultValue={data.apiKey || ''} />
            <button className="toggle-visibility">👁️</button>
          </div>
        </div>
        
        <div className="field-group">
          <div className="field-label">Prompt</div>
          <textarea 
            className="prompt-textarea"
            defaultValue={data.prompt || 'You are a helpful PDF assistant. Use web search if the PDF lacks context\nCONTEXT: {context}\nUser Query: {query}'}
          />
        </div>
        
        <div className="field-group">
          <div className="field-label">Temperature</div>
          <input type="number" step="0.1" min="0" max="2" defaultValue={data.temperature || 0.75} />
        </div>
        
        <div className="field-group">
          <label className="toggle-label">
            <input type="checkbox" defaultChecked={data.webSearch || false} />
            WebSearch Tool
          </label>
        </div>
        
        <div className="field-group">
          <div className="field-label">SERF API</div>
          <div className="api-key-input">
            <input type="password" placeholder="Enter SERF API key" defaultValue={data.serfApiKey || ''} />
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

export default LLMEngineNode
