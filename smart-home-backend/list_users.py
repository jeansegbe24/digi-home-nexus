import asyncio
from app.core.database import SessionLocal
from app.models.user import User
from sqlalchemy import select

async def list_users():
    async with SessionLocal() as session:
        result = await session.execute(select(User))
        users = result.scalars().all()
        for u in users:
            print(f'id={u.id} email={u.email} role={u.role}')

if __name__ == '__main__':
    asyncio.run(list_users())
