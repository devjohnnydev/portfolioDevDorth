"""Add dashboard_section_config to profile

Revision ID: c5d6e7f8g9h0
Revises: b4g5h6i7j8k9
Create Date: 2026-04-09 02:12:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.engine.reflection import Inspector


# revision identifiers, used by Alembic.
revision: str = 'c5d6e7f8g9h0'
down_revision: Union[str, Sequence[str], None] = 'b4g5h6i7j8k9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add dashboard_section_config field for dashboard header customization."""
    conn = op.get_bind()
    inspector = Inspector.from_engine(conn)
    columns = [c['name'] for c in inspector.get_columns('profiles')]

    if 'dashboard_section_config' not in columns:
        op.add_column('profiles', sa.Column('dashboard_section_config', sa.JSON(), nullable=True))


def downgrade() -> None:
    """Remove dashboard_section_config field."""
    op.drop_column('profiles', 'dashboard_section_config')
