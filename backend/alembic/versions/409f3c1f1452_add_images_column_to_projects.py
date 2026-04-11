"""add images column to projects

Revision ID: 409f3c1f1452
Revises: 4ac0b86fa83f
Create Date: 2026-04-10 22:22:36.752678

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '409f3c1f1452'
down_revision: Union[str, Sequence[str], None] = '4ac0b86fa83f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = [c['name'] for c in inspector.get_columns('projects')]
    
    if 'images' not in columns:
        op.add_column('projects', sa.Column('images', sa.JSON(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('projects', 'images')
