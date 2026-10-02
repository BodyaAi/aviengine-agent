from dataclasses import dataclass


@dataclass
class WorkerAccount:
    """
    Рабочий аккаунт Авито.

    Используется для:
    - публикации объявлений;
    - обновления объявлений;
    - синхронизации Listing через Avito API.

    Принадлежит IdentityAccount.
    """

    identity_account_id: str

    account_name: str

    avito_user_id: str

    access_token: str
    refresh_token: str

    token_expires_at: str

    status: str