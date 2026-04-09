"""Add dashboard fields to profile

Revision ID: a3f4b5c6d7e8
Revises: 82db131e0a29
Create Date: 2026-04-09 01:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a3f4b5c6d7e8'
down_revision: Union[str, Sequence[str], None] = '82db131e0a29'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add new JSON and text columns to profiles table for dashboard customization."""
    op.add_column('profiles', sa.Column('dashboard_metrics', sa.JSON(), nullable=True))
    op.add_column('profiles', sa.Column('dashboard_languages', sa.JSON(), nullable=True))
    op.add_column('profiles', sa.Column('dashboard_activity', sa.JSON(), nullable=True))
    op.add_column('profiles', sa.Column('hero_headlines', sa.JSON(), nullable=True))
    op.add_column('profiles', sa.Column('about_title', sa.String(), nullable=True))
    op.add_column('profiles', sa.Column('about_subtitle', sa.Text(), nullable=True))


def downgrade() -> None:
    """Remove dashboard customization columns from profiles table."""
    op.drop_column('profiles', 'about_subtitle')
    op.drop_column('profiles', 'about_title')
    op.drop_column('profiles', 'hero_headlines')
    op.drop_column('profiles', 'dashboard_activity')
    op.drop_column('profiles', 'dashboard_languages')
    op.drop_column('profiles', 'dashboard_metrics')
