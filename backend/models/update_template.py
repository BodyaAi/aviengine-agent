from dataclasses import dataclass


@dataclass
class UpdateTemplate:
    """
    Шаблон обновления существующих объявлений.

    Используется в UpdateTab.
    
    """

    id: str

    identity_account_id: str

    text_settings: dict

    photo_settings: dict