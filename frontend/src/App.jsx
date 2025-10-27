import { useState } from 'react'
import WorkflowBuilder from './components/WorkflowBuilder'
import axios from 'axios'
import './App.css'
import './components/WorkflowBuilder.css'

function App() {
  const [stacks] = useState([
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

  const handleCreateNewStack = () => {
    setShowCreateModal(true)
  }

  const handleCreateStack = () => {
    // TODO: Add new stack to the list
    console.log('Creating stack:', newStackName, newStackDescription)
    setShowCreateModal(false)
    setNewStackName('')
    setNewStackDescription('')
    setCurrentView('builder')
  }

  const handleEditStack = (stackId) => {
    setCurrentView('builder')
  }

  const handleBackToHome = () => {
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
    return <WorkflowBuilder onBack={handleBackToHome} />
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">ai</div>
          <span className="logo-text">GenAI Stack</span>
        </div>
        <div className="user-avatar">S</div>
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
