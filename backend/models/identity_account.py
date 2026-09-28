from dataclasses import dataclass
from datetime import datetime


@dataclass
class IdentityAccount:
    avito_user_id: str
    subscription_status: str
    subscription_until: str