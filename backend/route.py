from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from request import AddTaskRequest, UpdateTaskRequest
from service import TaskService

router = APIRouter()


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_description="Successfully added a task",
)
async def add_task(request: AddTaskRequest):
    """
    API to add a task.

    :param request: AddTaskRequest which contains the parameters - title, description, due date
    :return: success message
    """
    response = TaskService.add_task(request=request)
    return JSONResponse(content=response)


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_description="Successfully fetched all tasks",
)
async def get_tasks():
    """
    API to fetch all tasks

    :return: list of tasks
    """
    return TaskService.get_tasks()


@router.put(
    "/{task_id}",
    status_code=status.HTTP_200_OK,
    response_description="Successfully updated a task",
)
async def update_task(task_id: str, request: UpdateTaskRequest):
    """
    API to update a task.

    :param task_id: Id of the task
    :param request: UpdateTaskRequest which contains the optional parameters - title, description, due date
    :return: success message
    """
    response = TaskService.update_task(task_id=task_id, request=request)
    return JSONResponse(content=response)


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_200_OK,
    response_description="Successfully deleted a task",
)
async def delete_task(task_id: str):
    """
    API to delete a task.

    :param task_id: Id of the task
    :return:
    """
    response = TaskService.delete_task(task_id=task_id)
    return JSONResponse(content=response)


@router.put(
    "/{task_id}/status",
    status_code=status.HTTP_200_OK,
    response_description="Successfully updated task status",
)
async def update_task_status(task_id: str):
    """
    API to delete a task.

    :param task_id: Id of the task
    :return:
    """
    response = TaskService.update_task_status(task_id=task_id)
    return JSONResponse(content=response)
