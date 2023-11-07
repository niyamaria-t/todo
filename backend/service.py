from datetime import datetime
from fastapi.exceptions import HTTPException
from fastapi import status
import pytz

from request import AddTaskRequest, UpdateTaskRequest
from response import TaskResponse
from model import Task, Status


class TaskService:
    @staticmethod
    def add_task(request: AddTaskRequest):
        # Check if date is valid
        if request.due_date <= datetime.now(pytz.utc):
            raise HTTPException(detail="Invalid due date!", status_code=status.HTTP_400_BAD_REQUEST)
        try:
            task = Task(
                title=request.title,
                description=request.description,
                due_date=request.due_date,
                created_date=datetime.utcnow(),
                status=Status.TO_DO
            )
            task.save()
            return {"body": "Successfully added a task.", "message": "Success!"}
        except Exception as e:
            raise HTTPException(detail=str(e), status_code=status.HTTP_409_CONFLICT)

    @staticmethod
    def get_tasks():
        try:
            tasks = Task.objects()
            task_list = []
            for task in tasks:
                task_data = task.to_mongo()
                task_data['id'] = str(task.id)
                task_response = TaskResponse(**task_data)
                task_list.append(task_response)
            return {"body": task_list, "message": "Success!"}
        except Exception as e:
            raise HTTPException(detail=str(e), status_code=status.HTTP_409_CONFLICT)

    @staticmethod
    def update_task(task_id: str, request: UpdateTaskRequest):
        try:
            task: Task = Task.objects(id=task_id).first()
            if not task:
                raise HTTPException(detail="Task not found", status_code=status.HTTP_404_NOT_FOUND)

            if request.title is not None:
                task.title = request.title
            if request.description is not None:
                task.description = request.description
            if request.due_date is not None:
                if request.due_date <= datetime.now(pytz.utc):
                    raise HTTPException(detail="Invalid due date!", status_code=status.HTTP_400_BAD_REQUEST)
                task.due_date = request.due_date

            task.save()
            return {"body": "Successfully updated a task.", "message": "Success!"}
        except Exception as e:
            raise HTTPException(detail=str(e), status_code=status.HTTP_409_CONFLICT)

    @staticmethod
    def delete_task(task_id: str):
        try:
            task = Task.objects(id=task_id).first()
            if not task:
                raise HTTPException(detail="Task not found", status_code=status.HTTP_404_NOT_FOUND)

            task.delete()
            return {"body": "Successfully deleted the task.", "message": "Success!"}
        except Exception as e:
            raise HTTPException(detail=str(e), status_code=status.HTTP_409_CONFLICT)

    @staticmethod
    def update_task_status(task_id: str):
        try:
            task: Task = Task.objects(id=task_id).first()
            if not task:
                raise HTTPException(detail="Task not found", status_code=status.HTTP_404_NOT_FOUND)

            if task.status == Status.TO_DO:
                task.status = Status.COMPLETED
            else:
                task.status = Status.TO_DO

            task.save()
            return {"body": f"Successfully updated the task status to {task.status.value}.", "message": "Success!"}
        except Exception as e:
            raise HTTPException(detail=str(e), status_code=status.HTTP_409_CONFLICT)
