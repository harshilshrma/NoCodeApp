import React, { useCallback } from 'react'
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow'
import { Save } from 'lucide-react'
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

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onDragStart = (event, componentType) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(componentType))
    event.dataTransfer.effectAllowed = 'move'
    
    // Add dragging class for visual feedback
    event.target.classList.add('dragging')
    
    // Create a custom drag image
    const dragImage = event.target.cloneNode(true)
    dragImage.style.position = 'absolute'
    dragImage.style.top = '-1000px'
    dragImage.style.left = '-1000px'
    dragImage.style.width = '200px'
    dragImage.style.backgroundColor = 'white'
    dragImage.style.border = '1px solid #e9ecef'
    dragImage.style.borderRadius = '8px'
    dragImage.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
    dragImage.style.padding = '0.75rem'
    dragImage.style.display = 'flex'
    dragImage.style.alignItems = 'center'
    dragImage.style.gap = '0.75rem'
    
    document.body.appendChild(dragImage)
    event.dataTransfer.setDragImage(dragImage, 100, 20)
    
    // Clean up after drag starts
    setTimeout(() => {
      document.body.removeChild(dragImage)
    }, 0)
  }

  const onDrop = (event) => {
    event.preventDefault()
    
    const componentType = JSON.parse(event.dataTransfer.getData('application/reactflow'))
    
    const position = {
      x: event.clientX - 300, // Subtract sidebar width
      y: event.clientY - 100, // Subtract header height
    }
    
    const newNode = {
      id: `${componentType.id}-${Date.now()}`,
      type: 'default',
      position,
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

  const onDragOver = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }


  return (
    <div className="workflow-builder">
      <div className="builder-header">
        <div className="header-left">
          <div className="logo">
            <img src="/logo.png" alt="GenAI Stack Logo" className="logo-icon" />
            <span className="logo-text">GenAI Stack</span>
          </div>
        </div>
        <div className="builder-actions">
          <button className="save-btn">
            <Save size={16} />
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
                draggable
                onDragStart={(event) => onDragStart(event, component)}
                onDragEnd={(event) => {
                  event.target.classList.remove('dragging')
                }}
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
        <div 
          className="workflow-canvas"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
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
              fitView
              proOptions={{ hideAttribution: true }}
            >
              <Controls />
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          )}
        </div>

      </div>
    </div>
  )
}

export default WorkflowBuilder
