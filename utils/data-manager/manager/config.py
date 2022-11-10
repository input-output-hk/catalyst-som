"""Default config for pydantic"""
from pydantic import BaseSettings, Field

class Settings(BaseSettings):
    """Default Settings class

    It takes default configuration from the `.env` file
    """
    supabase_url: str = Field(..., env='SUPABASE_URL')
    supabase_key: str = Field(..., env='SUPABASE_KEY')
    admin_email: str = Field(..., env='ADMIN_EMAIL')
    admin_password: str = Field(..., env='ADMIN_PASSWORD')

    class Config:
        """Sub class to define the `.env` file"""
        env_file = '.env'
        env_file_encoding = 'utf-8'

settings = Settings()
