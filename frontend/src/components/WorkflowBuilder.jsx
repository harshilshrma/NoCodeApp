import React, { useCallback, useEffect, useMemo } from 'react'
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow'
import { Save } from 'lucide-react'
import { MdInput, MdLibraryBooks, MdOutlineOutput } from 'react-icons/md'
import { SiOpenai } from 'react-icons/si'
import axios from 'axios'
import 'reactflow/dist/style.css'
import './WorkflowBuilder.css'

// Import custom node components
import { UserInputNode } from './nodes/UserInputNode'
import { KnowledgeBaseNode } from './nodes/KnowledgeBaseNode'
import { LLMEngineNode } from './nodes/LLMEngineNode'
import { OutputNode } from './nodes/OutputNode'

// Component types
const componentTypes = [
  {
    id: 'user-input',
    name: 'User Query',
    description: 'Accepts user queries via a simple interface',
    icon: <MdInput size={20} color="#555" />,
  },
  {
    id: 'knowledge-base',
    name: 'Knowledge Base',
    description: 'Upload and process documents',
    icon: <MdLibraryBooks size={20} color="#555" />,
  },
  {
    id: 'llm-engine',
    name: 'LLM Engine',
    description: 'Process queries with language models',
    icon: <SiOpenai size={20} color="#555" />,
  },
  {
    id: 'output',
    name: 'Output',
    description: 'Display responses to users',
    icon: <MdOutlineOutput size={20} color="#555" />,
  },
]

const initialNodes = []
const initialEdges = []

function WorkflowBuilder({ onBack, stackId, stackName }) {
  console.log('WorkflowBuilder rendered with:', { onBack, stackId, stackName })
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  console.log('Current nodes:', nodes)
  console.log('Current edges:', edges)

  // Handle node deletion
  const handleNodeDelete = useCallback((nodeId) => {
    console.log('Deleting node:', nodeId)
    setNodes((nds) => nds.filter((node) => node.id !== nodeId))
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
  }, [setNodes, setEdges])

  // Define custom node types for React Flow with deletion handlers
  const nodeTypes = useMemo(() => ({
    'user-input': (props) => <UserInputNode {...props} onDelete={handleNodeDelete} />,
    'knowledge-base': (props) => <KnowledgeBaseNode {...props} onDelete={handleNodeDelete} />,
    'llm-engine': (props) => <LLMEngineNode {...props} onDelete={handleNodeDelete} />,
    'output': (props) => <OutputNode {...props} onDelete={handleNodeDelete} />,
  }), [handleNodeDelete])

  console.log('Node types loaded:', nodeTypes)

  const loadWorkflow = useCallback(async () => {
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
  }, [stackId, setNodes, setEdges])

  // Load saved workflow on mount
  useEffect(() => {
    if (stackId) {
      loadWorkflow()
    }
  }, [stackId, loadWorkflow])

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
      } catch (err) {
        console.error('Error saving workflow:', err)
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
    console.log('Dropped component:', componentType)
    
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
      },
    }
    console.log('Creating new node:', newNode)
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
      } catch (err) {
        console.error('Error auto-saving before back navigation:', err)
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
                  {component.icon}
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
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView={nodes.length > 0}
            proOptions={{ hideAttribution: true }}
            nodeTypes={nodeTypes}
            style={{ width: '100%', height: '100%' }}
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            minZoom={0.1}
            maxZoom={2}
          >
            <Controls />
            <Background variant="dots" gap={12} size={1} color="#e0e0e0" />
          </ReactFlow>
        </div>

      </div>
    </div>
  )
}

export default WorkflowBuilder
