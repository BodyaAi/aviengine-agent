from dataclasses import dataclass


@dataclass
class UpdateTemplate:
    """
    Шаблон обновления существующих объявлений.

    Используется в UpdateTab.

    Определяет какие изменения
    необходимо применить к Listing.
    """

    id: str

    text_settings: dict

    photo_settings: dict