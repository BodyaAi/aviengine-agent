from dataclasses import dataclass


@dataclass
class Variant:
    """
    RAW-документ объявления Авито.

    Формируется после того как пользователь
    создаёт объявление на стороне Авито.

    Используется как источник данных
    для массовой публикации.
    """

    template_id: str

    raw_listing_document: dict

    publication_count: int