import os
import secrets
import asyncio
import shutil
from pathlib import Path

from sqlalchemy import text
from app.core.database import engine as async_engine, DB_PATH, SessionLocal
from app.models.user import User
from app.core.security import hash_password

# ----------------------------------------------------------------------
# Configuration – you can modify the values below
# ----------------------------------------------------------------------
ADMIN_EMAIL = "admin@digihome.local"
ADMIN_PASSWORD = "A7b9$kL2!xQz"   # will be printed at the end of the script
ENV_PATH = Path(__file__).parent / ".env"
# ----------------------------------------------------------------------

async def main():
    # 1. Backup SQLite database
    backup_path = Path(__file__).parent / "db_backup.sqlite3"
    shutil.copyfile(DB_PATH, backup_path)
    print(f"Backup written to {backup_path}")

    # 2. Truncate users table (robust for SQLite)
    async with async_engine.begin() as conn:
        await conn.execute(text("DELETE FROM users;"))
        # sqlite_sequence may not exist; ignore any error
        try:
            await conn.execute(text("DELETE FROM sqlite_sequence WHERE name='users';"))
        except Exception:
            pass
    print("Users table truncated.")

    # 3. Regenerate SECRET_KEY
    new_secret = secrets.token_hex(32)
    env_lines = ENV_PATH.read_text(encoding="utf-8").splitlines()
    updated_lines = []
    for line in env_lines:
        if line.startswith("SECRET_KEY="):
            updated_lines.append(f"SECRET_KEY={new_secret}")
        else:
            updated_lines.append(line)
    ENV_PATH.write_text("\n".join(updated_lines), encoding="utf-8")
    print(f"New SECRET_KEY written to {ENV_PATH}")

    # 4. Create admin user using an async session
    async with SessionLocal() as session:
        admin = User(
            nom="Admin",
            email=ADMIN_EMAIL,
            hashed_password=hash_password(ADMIN_PASSWORD),
            role="proprietaire",
            langue="fr",
        )
        session.add(admin)
        await session.commit()
        await session.refresh(admin)

    print("\nReset complete. Restart the server to load the new SECRET_KEY.")

if __name__ == "__main__":
    asyncio.run(main())
