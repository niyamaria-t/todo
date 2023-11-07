from pydantic import BaseModel
from datetime import datetime

from model import Status


class TaskResponse(BaseModel):
    id: str
    title: str
    description: str
    due_date: datetime
    status: Status
