"""Initial schema — all tables for DigiHome Nexus.

Revision ID: 0001
Revises: 
Create Date: 2026-06-03
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── users ──────────────────────────────────────────────────────────────
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("nom", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("hashed_password", sa.String(), nullable=False),
        sa.Column("role", sa.String(), nullable=False, server_default="famille"),
        sa.Column("langue", sa.String(), nullable=False, server_default="fr"),
        sa.Column("biometric_hash", sa.String(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_users_id", "users", ["id"], unique=False)
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    # ── access_logs ────────────────────────────────────────────────────────
    op.create_table(
        "access_logs",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("t", sa.String(), nullable=False),
        sa.Column("who", sa.String(), nullable=False),
        sa.Column("method", sa.String(), nullable=False),
        sa.Column("door", sa.String(), nullable=False),
        sa.Column("ok", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("timestamp", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_access_logs_id", "access_logs", ["id"], unique=False)

    # ── alerts ─────────────────────────────────────────────────────────────
    op.create_table(
        "alerts",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("level", sa.String(), nullable=False, server_default="info"),
        sa.Column("t", sa.String(), nullable=False),
        sa.Column("text", sa.String(), nullable=False),
        sa.Column("icon", sa.String(), nullable=False, server_default="shield"),
        sa.Column("read", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("timestamp", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_alerts_id", "alerts", ["id"], unique=False)

    # ── light_states ───────────────────────────────────────────────────────
    op.create_table(
        "light_states",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("devices", sa.Integer(), nullable=False, server_default="5"),
        sa.Column("active", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("temp", sa.String(), nullable=False, server_default="20°C"),
        sa.Column("lit", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("brightness", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("color", sa.String(), nullable=False, server_default="warm"),
        sa.Column("timestamp", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_light_states_id", "light_states", ["id"], unique=False)

    # ── sensor_data ────────────────────────────────────────────────────────
    op.create_table(
        "sensor_data",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("temperature", sa.Float(), nullable=False),
        sa.Column("humidity", sa.Float(), nullable=False),
        sa.Column("aqi", sa.Float(), nullable=False),
        sa.Column("power", sa.Float(), nullable=False),
        sa.Column("timestamp", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_sensor_data_id", "sensor_data", ["id"], unique=False)
    op.create_index("ix_sensor_data_timestamp", "sensor_data", ["timestamp"], unique=False)

    # ── door_states ────────────────────────────────────────────────────────
    op.create_table(
        "door_states",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("locked", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("last_changed", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.Column("timestamp", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_door_states_id", "door_states", ["id"], unique=False)

    # ── window_states ──────────────────────────────────────────────────────
    op.create_table(
        "window_states",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("open", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("last_changed", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.Column("timestamp", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_window_states_id", "window_states", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_window_states_id", table_name="window_states")
    op.drop_table("window_states")
    op.drop_index("ix_door_states_id", table_name="door_states")
    op.drop_table("door_states")
    op.drop_index("ix_sensor_data_timestamp", table_name="sensor_data")
    op.drop_index("ix_sensor_data_id", table_name="sensor_data")
    op.drop_table("sensor_data")
    op.drop_index("ix_light_states_id", table_name="light_states")
    op.drop_table("light_states")
    op.drop_index("ix_alerts_id", table_name="alerts")
    op.drop_table("alerts")
    op.drop_index("ix_access_logs_id", table_name="access_logs")
    op.drop_table("access_logs")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_index("ix_users_id", table_name="users")
    op.drop_table("users")
