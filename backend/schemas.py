from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class StackCreate(BaseModel):
    name: str
    description: Optional[str] = None

class StackResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime

class WorkflowCreate(BaseModel):
    stack_id: str
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    
    class Config:
        extra = "allow"  # Allow extra fields

class WorkflowResponse(BaseModel):
    id: int
    stack_id: str
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime

class ChatMessage(BaseModel):
    stack_id: str
    user_query: str

class ChatResponse(BaseModel):
    response: str
    created_at: datetime
