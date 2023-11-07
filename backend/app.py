import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mongoengine import connect

from route import router
from settings import config

if __name__ == "__main__":

    # Initializing fastapi
    fastapi_kwargs = {
        "title": config.title,
    }
    app = FastAPI(**fastapi_kwargs)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=config.allowed_hosts,
        allow_credentials=config.allow_credentials,
        allow_headers=config.allowed_headers,
        allow_methods=config.allowed_methods,
    )

    app.include_router(
        router, tags=["Task Routes"], prefix="/task"
    )

    # Connecting to the database
    connect(db=config.db_name, host=f"{config.db_uri}/{config.db_name}")

    # Starting the uvicorn server
    uvicorn.run(
        app,
        host=config.server,
        port=config.port,
        reload=False,
    )
