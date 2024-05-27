"""Fix id

Revision ID: e6a6fe75d6f2
Revises: 718edded4e74
Create Date: 2024-05-27 15:47:38.957625

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e6a6fe75d6f2'
down_revision = '718edded4e74'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('post', schema=None) as batch_op:
        batch_op.add_column(sa.Column('kp_idd', sa.Integer(), nullable=True))
        batch_op.drop_column('kp_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('post', schema=None) as batch_op:
        batch_op.add_column(sa.Column('kp_id', sa.INTEGER(), nullable=True))
        batch_op.drop_column('kp_idd')

    # ### end Alembic commands ###
