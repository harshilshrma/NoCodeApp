import { useState } from 'react'
import WorkflowBuilder from './components/WorkflowBuilder'
import './App.css'
import './components/WorkflowBuilder.css'

function App() {
  const [stacks] = useState([])
  const [currentView, setCurrentView] = useState('home') // 'home' or 'builder'

  const handleCreateNewStack = () => {
    setCurrentView('builder')
  }

  const handleBackToHome = () => {
    setCurrentView('home')
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
          <button className="new-stack-btn" onClick={handleCreateNewStack}>
            + New Stack
          </button>
        </div>

        {/* Create New Stack Card */}
        <div className="create-stack-card">
          <h2 className="card-title">Create New Stack</h2>
          <p className="card-description">
            Start building your generative AI apps with our essential tools and frameworks.
          </p>
          <button className="card-btn" onClick={handleCreateNewStack}>
            + New Stack
          </button>
        </div>
      </main>
    </div>
  )
}

export default App
