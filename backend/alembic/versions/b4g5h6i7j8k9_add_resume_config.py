"""Add resume_config text customizer

Revision ID: b4g5h6i7j8k9
Revises: a3f4b5c6d7e8
Create Date: 2026-04-09 02:02:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.engine.reflection import Inspector


# revision identifiers, used by Alembic.
revision: str = 'b4g5h6i7j8k9'
down_revision: Union[str, Sequence[str], None] = 'a3f4b5c6d7e8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add resume_config field for resume generator UI."""
    conn = op.get_bind()
    inspector = Inspector.from_engine(conn)
    columns = [c['name'] for c in inspector.get_columns('profiles')]

    if 'resume_config' not in columns:
        op.add_column('profiles', sa.Column('resume_config', sa.JSON(), nullable=True))


def downgrade() -> None:
    """Remove resume_config field."""
    op.drop_column('profiles', 'resume_config')
