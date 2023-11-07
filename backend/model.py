from mongoengine import Document, StringField, EnumField, DateTimeField
from enum import Enum


class Status(Enum):
    TO_DO = "TO_DO"
    COMPLETED = "COMPLETED"


class Task(Document):
    id: StringField(primary_key=True)
    title = StringField(required=True)
    description = StringField(required=True)
    due_date = DateTimeField(required=True)
    created_date = DateTimeField(required=True)
    status = EnumField(Status, required=True)
