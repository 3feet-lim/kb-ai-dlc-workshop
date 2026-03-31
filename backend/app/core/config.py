"""애플리케이션 설정 (Pydantic BaseSettings)"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # 데이터베이스
    database_url: str = "postgresql+asyncpg://postgres:postgres@postgres:5432/tableorder"

    # JWT
    jwt_secret_key: str = "dev-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 16

    # 파일 업로드
    upload_dir: str = "/app/uploads"
    allowed_extensions: set[str] = {"jpg", "jpeg", "png", "gif", "webp"}

    # 로그인 보안
    max_login_attempts: int = 5
    lockout_minutes: int = 30

    model_config = {"env_prefix": ""}


settings = Settings()
