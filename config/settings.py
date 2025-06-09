"""
Application configuration settings.
"""

import os
from typing import Optional

class Settings:
    """Application settings loaded from environment variables."""
    
    def __init__(self):
        """Initialize settings from environment variables."""
        # Telegram Bot Token
        self.telegram_token: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
        
        # DeepSeek API Configuration
        self.deepseek_api_key: str = os.getenv("DEEPSEEK_API_KEY", "")
        self.deepseek_base_url: str = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
        
        # Logging Configuration
        self.log_level: str = os.getenv("LOG_LEVEL", "INFO").upper()
        
        # Bot Configuration
        self.bot_username: Optional[str] = os.getenv("BOT_USERNAME")
        self.webhook_url: Optional[str] = os.getenv("WEBHOOK_URL")
        
        # Rate Limiting
        self.max_requests_per_minute: int = int(os.getenv("MAX_REQUESTS_PER_MINUTE", "30"))
        
        # API Timeout settings
        self.api_timeout: int = int(os.getenv("API_TIMEOUT", "30"))
        
        # Development mode
        self.debug: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")
    
    def validate(self) -> bool:
        """
        Validate that all required settings are present.
        
        Returns:
            True if all required settings are valid, False otherwise
        """
        required_settings = [
            ("TELEGRAM_BOT_TOKEN", self.telegram_token),
            ("DEEPSEEK_API_KEY", self.deepseek_api_key),
        ]
        
        missing_settings = []
        for setting_name, setting_value in required_settings:
            if not setting_value:
                missing_settings.append(setting_name)
        
        if missing_settings:
            print(f"Missing required environment variables: {', '.join(missing_settings)}")
            return False
        
        return True
    
    def __str__(self) -> str:
        """String representation of settings (without sensitive data)."""
        return (
            f"Settings(\n"
            f"  telegram_token={'*' * 10 if self.telegram_token else 'NOT_SET'}\n"
            f"  deepseek_api_key={'*' * 10 if self.deepseek_api_key else 'NOT_SET'}\n"
            f"  deepseek_base_url={self.deepseek_base_url}\n"
            f"  log_level={self.log_level}\n"
            f"  debug={self.debug}\n"
            f")"
        )
