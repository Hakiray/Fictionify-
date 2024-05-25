"""Add preferences

Revision ID: b8e89b644f56
Revises: 13f72fe469c1
Create Date: 2024-05-25 00:03:24.773375

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b8e89b644f56'
down_revision = '13f72fe469c1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user_preference',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('genres', sa.String(length=500), nullable=True),
    sa.Column('countries', sa.String(length=500), nullable=True),
    sa.Column('releaseYearsStart', sa.String(length=500), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('user_preference', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_user_preference_user_id'), ['user_id'], unique=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user_preference', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_user_preference_user_id'))

    op.drop_table('user_preference')
    # ### end Alembic commands ###