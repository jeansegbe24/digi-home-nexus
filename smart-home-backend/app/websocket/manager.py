from fastapi import WebSocket
from typing import Dict, List
import json

class ConnectionManager:
    """
    Gère les connexions WebSocket actives.
    Supporte l'envoi de messages à tous les clients (broadcast)
    ou à un utilisateur spécifique (send_personal).
    """

    def __init__(self) -> None:
        # Dict mapping user_id -> list of active WebSocket connections
        self.active_connections: Dict[int, List[WebSocket]] = {}
        # Flat list of all active WebSocket connections for broadcast
        self.all_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket, user_id: int) -> None:
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        self.all_connections.append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: int) -> None:
        if user_id in self.active_connections:
            try:
                self.active_connections[user_id].remove(websocket)
            except ValueError:
                pass
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        try:
            self.all_connections.remove(websocket)
        except ValueError:
            pass

    async def broadcast(self, event_type: str, data: dict) -> None:
        """Envoie un événement JSON à tous les clients WebSocket connectés."""
        message = json.dumps({"type": event_type, "data": data})
        dead_connections: List[WebSocket] = []
        for connection in self.all_connections:
            try:
                await connection.send_text(message)
            except Exception:
                dead_connections.append(connection)
        for dead in dead_connections:
            self.all_connections.remove(dead)

    async def send_personal(self, user_id: int, event_type: str, data: dict) -> None:
        """Envoie un événement JSON à toutes les connexions d'un utilisateur spécifique."""
        message = json.dumps({"type": event_type, "data": data})
        if user_id in self.active_connections:
            dead_connections: List[WebSocket] = []
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_text(message)
                except Exception:
                    dead_connections.append(connection)
            for dead in dead_connections:
                self.active_connections[user_id].remove(dead)


# Singleton global manager instance used across all routers
manager = ConnectionManager()
