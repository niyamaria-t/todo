from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class AddTaskRequest(BaseModel):
    title: str = Field(max_length=50)
    description: str = Field(max_length=300)
    due_date: datetime


class UpdateTaskRequest(BaseModel):
    title: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = Field(None, max_length=300)
    due_date: Optional[datetime] = None
