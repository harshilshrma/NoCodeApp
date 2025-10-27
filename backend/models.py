from sqlalchemy import Column, Integer, String, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()

class Stack(Base):
    __tablename__ = "stacks"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class Workflow(Base):
    __tablename__ = "workflows"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    stack_id = Column(String, nullable=False)
    nodes = Column(JSON, nullable=False)
    edges = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class ChatLog(Base):
    __tablename__ = "chat_logs"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    stack_id = Column(String, nullable=False)
    user_query = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now())
