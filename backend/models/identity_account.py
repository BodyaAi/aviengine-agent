from dataclasses import dataclass


@dataclass
class IdentityAccount:
    """
    Главный аккаунт системы AviEngine.

    Связи:
    IdentityAccount
    ├── WorkerAccounts
    └── Tasks
    """
    account_name: str
    avito_user_id: str

    access_token: str
    refresh_token: str
    token_expires_at: str

    subscription_status: str
    subscription_until: str