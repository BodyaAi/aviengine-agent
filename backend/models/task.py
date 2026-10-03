@dataclass
class Task:
    """
    Задача системы AviEngine.

    Отображается в ManagerTab.

    Принадлежит IdentityAccount.

    Выполняется через WorkerAccount.

    Создается из TemplateUpdate и TemplatePublication.
    
    """

    identity_account_id: str

    task_type: str

    status: str

    progress: int