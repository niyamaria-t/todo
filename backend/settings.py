from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List


class AppSettings(BaseSettings):
    class Config:
        env_file = ".env"
        validate_assignment = True

    title: str = "ToDo Application"

    allowed_hosts: List[str] = ["*"]
    allowed_headers: List[str] = ["*"]
    allowed_methods: List[str] = ["*"]
    allow_credentials: bool = True

    server: str
    port: int

    db_uri: str
    db_name: str


@lru_cache
def get_app_settings() -> AppSettings:
    return AppSettings()


config = get_app_settings()
