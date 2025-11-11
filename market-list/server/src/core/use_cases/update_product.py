from typing import Optional

from src.core.entities.product import Product
from src.core.exceptions import ProductAlreadyExists, ProductNotFound
from src.core.interfaces.product_repository import ProductRepository
from src.core.interfaces.usecase_interface import UseCase


class UpdateProductUseCase(UseCase):
    """Use case responsible for updating an existing product."""

    def __init__(self, repository: ProductRepository):
        self._repository = repository

    def execute(
        self,
        nome: str,
        novo_nome: Optional[str] = None,
        quantidade: Optional[int] = None,
        valor: Optional[float] = None,
    ) -> Product:
        # Ensure product exists
        existing = self._repository.get_by_name(nome)
        if not existing:
            raise ProductNotFound(f"Produto '{nome}' não encontrado.")

        # If renaming, ensure target name does not collide
        if novo_nome and novo_nome != nome:
            if self._repository.get_by_name(novo_nome):
                raise ProductAlreadyExists(
                    f"Produto '{novo_nome}' já existe."
                )

        updated = self._repository.update_by_name(
            name=nome,
            new_name=novo_nome,
            quantity=quantidade,
            value=valor,
        )

        # Defensive: repository should return updated or None
        if not updated:
            raise ProductNotFound(f"Produto '{nome}' não encontrado.")
        return updated

