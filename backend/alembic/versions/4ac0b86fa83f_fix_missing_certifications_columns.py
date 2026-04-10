"""fix missing certifications columns

Revision ID: 4ac0b86fa83f
Revises: 39341568f506
Create Date: 2026-04-10 20:54:12.367930

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4ac0b86fa83f'
down_revision: Union[str, Sequence[str], None] = '39341568f506'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = [col['name'] for col in inspector.get_columns('certifications')]
    
    if 'category' not in columns:
        op.add_column('certifications', sa.Column('category', sa.String(), nullable=True))
    
    if 'file_url' not in columns:
        op.add_column('certifications', sa.Column('file_url', sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    pass
