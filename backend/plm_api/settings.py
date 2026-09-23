"""
This module provides a class for managing application global settings
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    This class represents the application settings.
    """
    # Host variable
    PLM_HOST: str = "http://105.112.150.108:105"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
