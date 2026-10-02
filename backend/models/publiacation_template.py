from dataclasses import dataclass


@dataclass
class PublicationTemplate:
    """
    Контейнер публикации.

    Хранит настройки публикации
    и связь с Variant.
    """
    id: str

    name: str

    selected_worker_accounts: list[str]

    selected_cities: list[str]