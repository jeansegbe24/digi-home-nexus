import asyncio
import asyncpg
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

URL = "postgresql://postgres.hiovdqbwqjwtryqnzlnh:Lucien626622566@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"

async def test():
    print("Connexion au Pooler Supabase eu-west-1...")
    conn = await asyncpg.connect(URL, ssl="require", timeout=15)
    ver = await conn.fetchval("SELECT version()")
    print(f"CONNEXION OK: {ver[:70]}")

    tables = await conn.fetch(
        "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
    )
    names = [t["tablename"] for t in tables]
    print(f"Tables existantes ({len(names)}): {names}")

    await conn.close()
    print("Test termine avec succes!")

asyncio.run(test())
