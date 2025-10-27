import React, { useState, useCallback } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow'
import 'reactflow/dist/style.css'

// Component types
const componentTypes = [
  {
    id: 'user-query',
    name: 'User Query',
    description: 'Accepts user queries via a simple interface',
    color: '#3b82f6',
  },
  {
    id: 'knowledge-base',
    name: 'Knowledge Base',
    description: 'Upload and process documents',
    color: '#10b981',
  },
  {
    id: 'llm-engine',
    name: 'LLM Engine',
    description: 'Process queries with language models',
    color: '#f59e0b',
  },
  {
    id: 'output',
    name: 'Output',
    description: 'Display responses to users',
    color: '#ef4444',
  },
]

const initialNodes = []
const initialEdges = []

function WorkflowBuilder({ onBack }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedComponent, setSelectedComponent] = useState(null)

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const addNode = (componentType) => {
    const newNode = {
      id: `${componentType.id}-${Date.now()}`,
      type: 'default',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: componentType.name,
        type: componentType.id,
        description: componentType.description,
        color: componentType.color,
      },
      style: {
        background: componentType.color,
        color: '#fff',
        border: '1px solid #222138',
        width: 150,
        height: 80,
        borderRadius: 8,
      },
    }
    setNodes((nds) => [...nds, newNode])
  }

  const onNodeClick = (event, node) => {
    setSelectedComponent(node)
  }

  return (
    <div className="workflow-builder">
      <div className="builder-header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">ai</div>
            <span className="logo-text">GenAI Stack</span>
          </div>
        </div>
        <div className="builder-actions">
          <button className="save-btn">
            <span className="save-icon">💾</span>
            Save
          </button>
          <div className="user-avatar">S</div>
        </div>
      </div>

      <div className="builder-content">
        {/* Component Library */}
        <div className="component-library">
          <div className="library-header">
            <h3>Chat With AI</h3>
            <button className="doc-btn">📄</button>
          </div>
          <h4>Components</h4>
          <div className="component-list">
            {componentTypes.map((component) => (
              <div
                key={component.id}
                className="component-item"
                onClick={() => addNode(component)}
                draggable
              >
                <div className="component-icon">
                  {component.id === 'user-query' && '📄'}
                  {component.id === 'knowledge-base' && '📚'}
                  {component.id === 'llm-engine' && '✨'}
                  {component.id === 'output' && '📤'}
                </div>
                <div className="component-info">
                  <div className="component-name">{component.name}</div>
                  {component.id === 'llm-engine' && <div className="component-subtitle">(OpenAI)</div>}
                </div>
                <div className="reorder-icon">⋮⋮⋮</div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Canvas */}
        <div className="workflow-canvas">
          {nodes.length === 0 ? (
            <div className="empty-canvas">
              <div className="empty-icon">⬜</div>
              <p>Drag & drop to get started</p>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              fitView
            >
              <Controls />
              <MiniMap />
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          )}
          
          {/* Zoom Controls */}
          <div className="zoom-controls">
            <button className="zoom-btn">+</button>
            <button className="zoom-btn">-</button>
            <button className="zoom-btn">⛶</button>
            <select className="zoom-select">
              <option>100%</option>
            </select>
          </div>
          
          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="play-btn">▶</button>
            <button className="chat-btn">💬</button>
          </div>
        </div>

        {/* Component Configuration */}
        <div className="component-config">
          <h3>Configuration</h3>
          {selectedComponent ? (
            <div className="config-content">
              <h4>{selectedComponent.data.label}</h4>
              <p>{selectedComponent.data.description}</p>
              <div className="config-options">
                {/* Configuration options will be added based on component type */}
                <p>Configuration options will appear here based on the selected component.</p>
              </div>
            </div>
          ) : (
            <p>Select a component to configure it</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkflowBuilder
