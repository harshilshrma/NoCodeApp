from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base
import os

# Database URL - using SQLite for development, PostgreSQL for production
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./genai_stack.db")

# For PostgreSQL, use this format:
# DATABASE_URL = "postgresql://username:password@localhost:5432/genai_stack"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
