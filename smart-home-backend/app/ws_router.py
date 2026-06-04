from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.security import verify_token
from app.core.database import SessionLocal
from app.models.user import User
from app.websocket.manager import manager
import json

from typing import Optional

ws_router = APIRouter()

@ws_router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: Optional[str] = Query(None, description="JWT access token for authentication")
):
    """
    WebSocket authentifié par token JWT (cookie HTTP-only `access_token` ou paramètre de requête `?token=...`).
    """
    # Accept the connection first so we can read cookies/params and send close codes if needed
    # (FastAPI requires accepting or closing, but we need to inspect the cookies/query first.
    # Note: websocket.cookies is available before accept() on standard ASGI servers)
    actual_token = token or websocket.cookies.get("access_token")
    if not actual_token:
        # Accept and immediately close to send clean code, or close directly
        await websocket.accept()
        await websocket.close(code=4001)
        return

    payload = verify_token(actual_token, expected_type="access")
    if not payload:
        await websocket.accept()
        await websocket.close(code=4001)
        return


    user_id = int(payload["sub"])

    # Verify user exists
    async with SessionLocal() as db:
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

    if not user:
        await websocket.accept()
        await websocket.close(code=4001)
        return

    await manager.connect(websocket, user_id)
    try:
        while True:
            # Keep connection alive; client messages are optional
            try:
                raw = await websocket.receive_text()
                # Echo pings / handle client-sent messages
                message = json.loads(raw)
                if message.get("type") == "ping":
                    await websocket.send_text(json.dumps({"type": "pong"}))
            except Exception:
                break
    except WebSocketDisconnect:
        pass
    finally:
        manager.disconnect(websocket, user_id)
