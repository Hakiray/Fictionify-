"""Fix datazone

Revision ID: 59c32688b6d2
Revises: 0b5aedc1f5f2
Create Date: 2024-05-27 16:15:33.935843

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '59c32688b6d2'
down_revision = '0b5aedc1f5f2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('review', schema=None) as batch_op:
        batch_op.add_column(sa.Column('timestam', sa.DateTime(), nullable=False))
        batch_op.drop_index('ix_review_timestamp')
        batch_op.create_index(batch_op.f('ix_review_timestam'), ['timestam'], unique=False)
        batch_op.drop_column('timestamp')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('review', schema=None) as batch_op:
        batch_op.add_column(sa.Column('timestamp', sa.DATETIME(), nullable=False))
        batch_op.drop_index(batch_op.f('ix_review_timestam'))
        batch_op.create_index('ix_review_timestamp', ['timestamp'], unique=False)
        batch_op.drop_column('timestam')

    # ### end Alembic commands ###
