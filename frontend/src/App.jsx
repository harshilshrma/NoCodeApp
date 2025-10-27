import { useState, useEffect } from 'react'
import WorkflowBuilder from './components/WorkflowBuilder'
import axios from 'axios'
import './App.css'
import './components/WorkflowBuilder.css'

function App() {
  const [stacks, setStacks] = useState([
    {
      id: 1,
      name: "Chat With AI",
      description: "Chat with a smart AI",
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Content Writer",
      description: "Helps you write content",
      createdAt: "2024-01-16"
    },
    {
      id: 3,
      name: "Content Summarizer",
      description: "Helps you summarize content",
      createdAt: "2024-01-17"
    },
    {
      id: 4,
      name: "Information Finder",
      description: "Helps you find relevant information",
      createdAt: "2024-01-18"
    }
  ])
  const [currentView, setCurrentView] = useState('home') // 'home', 'builder', or 'create'
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newStackName, setNewStackName] = useState('')
  const [newStackDescription, setNewStackDescription] = useState('')
  const [currentStackId, setCurrentStackId] = useState(null)

  // Load stacks from backend on component mount
  useEffect(() => {
    loadStacks()
  }, [])

  const loadStacks = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/stacks')
      setStacks(response.data)
    } catch (error) {
      console.error('Error loading stacks:', error)
      // Keep the existing dummy data as fallback
    }
  }

  const handleCreateNewStack = () => {
    setShowCreateModal(true)
  }

  const handleCreateStack = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/stacks', {
        name: newStackName,
        description: newStackDescription
      })
      
      const newStack = response.data
      setStacks(prevStacks => [...prevStacks, newStack])
      setCurrentStackId(newStack.id)
      setShowCreateModal(false)
      setNewStackName('')
      setNewStackDescription('')
      setCurrentView('builder')
    } catch (error) {
      console.error('Error creating stack:', error)
      alert('Failed to create stack. Please try again.')
    }
  }

  const handleEditStack = (stackId) => {
    setCurrentStackId(stackId)
    setCurrentView('builder')
  }

  const handleBackToHome = () => {
    setCurrentStackId(null)
    setCurrentView('home')
  }

  const handleCloseModal = () => {
    setShowCreateModal(false)
    setNewStackName('')
    setNewStackDescription('')
  }

  const testBackendConnection = async () => {
    try {
      const response = await axios.get('http://localhost:8000/health')
      alert(`Backend is working! Status: ${response.data.status}`)
    } catch (error) {
      alert(`Backend connection failed: ${error.message}`)
    }
  }

  if (currentView === 'builder') {
    const currentStack = stacks.find(stack => stack.id === currentStackId)
    return <WorkflowBuilder onBack={handleBackToHome} stackId={currentStackId} stackName={currentStack?.name} />
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src="/logo.png" alt="GenAI Stack Logo" className="logo-icon" />
          <span className="logo-text">GenAI Stack</span>
        </div>
        <div className="user-avatar">HS</div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">My Stacks</h1>
          <div className="header-actions">
            <button className="test-btn" onClick={testBackendConnection}>
              Test Backend
            </button>
            <button className="new-stack-btn" onClick={handleCreateNewStack}>
              + New Stack
            </button>
          </div>
        </div>

        {/* Stacks Grid */}
        <div className="stacks-grid">
          {stacks.map((stack) => (
            <div key={stack.id} className="stack-card">
              <h3 className="stack-title">{stack.name}</h3>
              <p className="stack-description">{stack.description}</p>
              <button
                className="edit-stack-btn"
                onClick={() => handleEditStack(stack.id)}
              >
                Edit Stack
                <span className="edit-icon">↗</span>
              </button>
            </div>
          ))}
        </div>

        {/* Create New Stack Modal */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create New Stack</h2>
                <button className="close-btn" onClick={handleCloseModal}>×</button>
              </div>
              <div className="modal-content">
                <div className="form-group">
                  <label htmlFor="stack-name">Name</label>
                  <input
                    id="stack-name"
                    type="text"
                    value={newStackName}
                    onChange={(e) => setNewStackName(e.target.value)}
                    placeholder="Enter stack name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="stack-description">Description</label>
                  <textarea
                    id="stack-description"
                    value={newStackDescription}
                    onChange={(e) => setNewStackDescription(e.target.value)}
                    placeholder="Enter stack description"
                    rows={3}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="cancel-btn" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button
                  className="create-btn"
                  onClick={handleCreateStack}
                  disabled={!newStackName.trim()}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
