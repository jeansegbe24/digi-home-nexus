"""
Test de connexion Supabase — diagnostic complet.
Usage: python scripts/test_connection.py
"""
import asyncio
import socket
import sys
import os

# Forcer l'encodage UTF-8 pour la console Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Charger les variables d'environnement
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")


def extract_host_port(url: str):
    """Extrait l'hote et le port depuis une URL asyncpg."""
    try:
        after_at = url.split("@")[1]
        host_port = after_at.split("/")[0]
        if ":" in host_port:
            host, port = host_port.rsplit(":", 1)
            return host, int(port)
        return host_port, 5432
    except Exception:
        return None, None


def test_dns(host: str):
    print(f"\n[DNS] Resolution de '{host}'...")
    try:
        results = socket.getaddrinfo(host, 5432)
        for r in results[:3]:
            family = "IPv4" if r[0] == socket.AF_INET else "IPv6"
            print(f"   OK ({family}) -> {r[4][0]}")
        return True
    except socket.gaierror as e:
        print(f"   ECHEC DNS : {e}")
        return False


def test_tcp(host: str, port: int):
    print(f"\n[TCP] Test vers {host}:{port}...")
    try:
        s = socket.create_connection((host, port), timeout=10)
        s.close()
        print(f"   OK: Connexion TCP reussie!")
        return True
    except Exception as e:
        print(f"   ECHEC TCP : {e}")
        return False


async def test_asyncpg(url: str):
    print(f"\n[PG] Test connexion asyncpg...")
    try:
        import asyncpg
        url_clean = url.replace("postgresql+asyncpg://", "postgresql://")
        conn = await asyncpg.connect(url_clean, ssl="require", timeout=15)
        version = await conn.fetchval("SELECT version()")
        await conn.close()
        print(f"   OK: Connexion asyncpg reussie!")
        print(f"   PostgreSQL: {version[:80]}")
        return True
    except Exception as e:
        print(f"   ECHEC asyncpg : {e}")
        return False


async def main():
    print("=" * 60)
    print("  DigiHome -- Diagnostic connexion Supabase")
    print("=" * 60)

    if not DATABASE_URL:
        print("ERREUR: DATABASE_URL non defini dans .env !")
        return

    print(f"\nDATABASE_URL: {DATABASE_URL[:60]}...")

    host, port = extract_host_port(DATABASE_URL)
    if not host:
        print("ERREUR: Impossible d'extraire l'hote depuis DATABASE_URL")
        return

    print(f"   Host : {host}")
    print(f"   Port : {port}")

    dns_ok = test_dns(host)
    if not dns_ok:
        print("\n ATTENTION: Le nom d'hote ne se resout pas.")
        print("   Verifiez l'ID de projet dans votre tableau de bord Supabase:")
        print("   https://supabase.com/dashboard/project/_/settings/database")
        return

    tcp_ok = test_tcp(host, port)
    if not tcp_ok:
        print("\n ATTENTION: Le port TCP n'est pas accessible.")
        print("   Le projet Supabase est peut-etre en pause.")
        print("   Essayez le Pooler (port 6543) depuis le dashboard.")
        return

    await test_asyncpg(DATABASE_URL)

    print("\n" + "=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
