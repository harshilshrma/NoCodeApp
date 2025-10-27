from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, create_tables
from models import Stack, Workflow, ChatLog
from schemas import StackCreate, StackResponse, WorkflowCreate, WorkflowResponse, ChatMessage, ChatResponse
from typing import List
import uuid
from datetime import datetime

app = FastAPI(title="GenAI Stack API", version="1.0.0")

# Configure CORS
origins = [
    "http://localhost:5173",  # Frontend URL
    "http://127.0.0.1:5173",  # Frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup
@app.on_event("startup")
async def startup_event():
    create_tables()

@app.get("/")
async def root():
    return {"message": "GenAI Stack API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Stack endpoints
@app.post("/stacks", response_model=StackResponse)
async def create_stack(stack: StackCreate, db: Session = Depends(get_db)):
    stack_id = f"stack_{int(datetime.now().timestamp() * 1000)}"
    db_stack = Stack(
        id=stack_id,
        name=stack.name,
        description=stack.description
    )
    db.add(db_stack)
    db.commit()
    db.refresh(db_stack)
    return db_stack

@app.get("/stacks", response_model=List[StackResponse])
async def get_stacks(db: Session = Depends(get_db)):
    stacks = db.query(Stack).all()
    return stacks

@app.get("/stacks/{stack_id}", response_model=StackResponse)
async def get_stack(stack_id: str, db: Session = Depends(get_db)):
    stack = db.query(Stack).filter(Stack.id == stack_id).first()
    if not stack:
        raise HTTPException(status_code=404, detail="Stack not found")
    return stack

# Workflow endpoints
@app.post("/workflows", response_model=WorkflowResponse)
async def save_workflow(workflow: WorkflowCreate, db: Session = Depends(get_db)):
    print(f"Received workflow data: {workflow}")
    
    # Check if workflow already exists for this stack
    existing_workflow = db.query(Workflow).filter(Workflow.stack_id == workflow.stack_id).first()
    
    if existing_workflow:
        # Update existing workflow
        existing_workflow.nodes = workflow.nodes
        existing_workflow.edges = workflow.edges
        existing_workflow.updated_at = datetime.now()
        db.commit()
        db.refresh(existing_workflow)
        return existing_workflow
    else:
        # Create new workflow
        db_workflow = Workflow(
            stack_id=workflow.stack_id,
            nodes=workflow.nodes,
            edges=workflow.edges
        )
        db.add(db_workflow)
        db.commit()
        db.refresh(db_workflow)
        return db_workflow

@app.get("/workflows/{stack_id}", response_model=WorkflowResponse)
async def get_workflow(stack_id: str, db: Session = Depends(get_db)):
    print(f"Looking for workflow with stack_id: {stack_id}")
    workflow = db.query(Workflow).filter(Workflow.stack_id == stack_id).first()
    if not workflow:
        print(f"No workflow found for stack_id: {stack_id}")
        raise HTTPException(status_code=404, detail="Workflow not found")
    print(f"Found workflow: {workflow}")
    return workflow

# Chat endpoints
@app.post("/chat", response_model=ChatResponse)
async def chat_with_stack(chat: ChatMessage, db: Session = Depends(get_db)):
    # TODO: Implement actual workflow execution
    # For now, return a mock response
    response = f"Mock response for query: {chat.user_query}"
    
    # Save chat log
    chat_log = ChatLog(
        stack_id=chat.stack_id,
        user_query=chat.user_query,
        response=response
    )
    db.add(chat_log)
    db.commit()
    
    return ChatResponse(
        response=response,
        created_at=datetime.now()
    )