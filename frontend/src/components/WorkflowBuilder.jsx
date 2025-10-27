import React, { useCallback, useEffect } from 'react'
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow'
import { Save } from 'lucide-react'
import axios from 'axios'
import 'reactflow/dist/style.css'
import './nodes/NodeStyles.css'

// Import custom node components
import UserInputNode from './nodes/UserInputNode'
import KnowledgeBaseNode from './nodes/KnowledgeBaseNode'
import LLMEngineNode from './nodes/LLMEngineNode'
import OutputNode from './nodes/OutputNode'

// Define custom node types for React Flow
const nodeTypes = {
  'user-input': UserInputNode,
  'knowledge-base': KnowledgeBaseNode,
  'llm-engine': LLMEngineNode,
  'output': OutputNode,
}

// Component types
const componentTypes = [
  {
    id: 'user-input',
    name: 'User Query',
    description: 'Accepts user queries via a simple interface',
    color: '#e3f2fd',
  },
  {
    id: 'knowledge-base',
    name: 'Knowledge Base',
    description: 'Upload and process documents',
    color: '#e8f5e8',
  },
  {
    id: 'llm-engine',
    name: 'LLM Engine',
    description: 'Process queries with language models',
    color: '#fff3e0',
  },
  {
    id: 'output',
    name: 'Output',
    description: 'Display responses to users',
    color: '#fce4ec',
  },
]

const initialNodes = []
const initialEdges = []

function WorkflowBuilder({ onBack, stackId, stackName }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Load saved workflow on mount
  useEffect(() => {
    if (stackId) {
      loadWorkflow()
    }
  }, [stackId])

  const loadWorkflow = async () => {
    try {
      console.log(`Loading workflow for stack: ${stackId}`)
      const response = await axios.get(`http://127.0.0.1:8000/workflows/${stackId}`)
      const workflowData = response.data
      console.log('Loaded workflow data:', workflowData)
      if (workflowData.nodes) setNodes(workflowData.nodes)
      if (workflowData.edges) setEdges(workflowData.edges)
      console.log(`Workflow loaded for stack ${stackId}:`, workflowData)
    } catch (error) {
      console.log(`No existing workflow found for stack ${stackId}:`, error.response?.status)
      // This is normal for new stacks
    }
  }

  // Auto-save functionality
  const saveWorkflow = useCallback(async () => {
    if (stackId && (nodes.length > 0 || edges.length > 0)) {
      try {
        console.log('Saving workflow with data:', {
          stack_id: stackId,
          nodes: nodes,
          edges: edges
        })
        
        const response = await axios.post('http://127.0.0.1:8000/workflows', {
          stack_id: stackId,
          nodes: nodes,
          edges: edges
        })
        
        console.log('Workflow saved successfully:', response.data)
      } catch (error) {
        console.error('Error saving workflow:', error.response?.data || error.message)
      }
    }
  }, [nodes, edges, stackId])

  // Auto-save when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup function - auto-save when component unmounts
      if (stackId && (nodes.length > 0 || edges.length > 0)) {
        saveWorkflow()
      }
    }
  }, [stackId, nodes, edges, saveWorkflow])

  // Auto-save when nodes or edges change
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      const timeoutId = setTimeout(saveWorkflow, 1000) // Auto-save after 1 second of inactivity
      return () => clearTimeout(timeoutId)
    }
  }, [nodes, edges, saveWorkflow])

  // Manual save function
  const handleSave = async () => {
    if (stackId) {
      try {
        await saveWorkflow()
        alert(`Workflow saved successfully for stack ${stackName || stackId}!`)
      } catch (error) {
        alert('Failed to save workflow. Please try again.')
      }
    } else {
      alert('No stack selected!')
    }
  }

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
      type: componentType.id, // Use the component type as the node type
      position,
      data: {
        label: componentType.name,
        type: componentType.id,
        description: componentType.description,
        color: componentType.color,
      },
    }
    setNodes((nds) => [...nds, newNode])
  }

  const onDragOver = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const handleBack = async () => {
    // Auto-save before going back
    if (stackId && (nodes.length > 0 || edges.length > 0)) {
      try {
        await saveWorkflow()
        alert(`Workflow auto-saved before navigating back`)
      } catch (error) {
        console.error('Error auto-saving before back navigation:', error)
      }
    }
    
    // Navigate back
    onBack()
  }

  return (
    <div className="workflow-builder">
      <div className="builder-header">
        <div className="header-left">
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
          <div className="logo">
            <img src="/logo.png" alt="GenAI Stack Logo" className="logo-icon" />
            <span className="logo-text">GenAI Stack</span>
          </div>
        </div>
        <div className="builder-actions">
          <button className="save-btn" onClick={handleSave}>
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
            <h3>{stackName || 'Chat With AI'}</h3>
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
                  {component.id === 'user-input' && '📄'}
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
              nodeTypes={nodeTypes}
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
