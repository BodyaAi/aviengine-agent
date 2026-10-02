from dataclasses import dataclass


@dataclass
class Listing:
    """
    Реальное объявление Авито.

    Получается через Avito API.

    Принадлежит WorkerAccount.

    Используется в UpdateTab.
    """

    worker_account_id: str

    avito_listing_id: str

    title: str

    price: float

    image_url: str

    status: str