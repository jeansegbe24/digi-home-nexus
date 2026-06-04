from fastapi import APIRouter, Depends, Query
from typing import List
import math
import random

from app.models.user import User
from app.deps import get_current_user

router = APIRouter(tags=["Énergie"])


def _generate_24h(seed: float) -> List[dict]:
    """Génère 24 points de données horaires (consommation + solaire)."""
    data = []
    for h in range(24):
        # Consumption: base + evening peak + random fluctuation
        base_kw = 1.5 + math.sin(h / 3) * 0.9
        evening_peak = 1.8 if 17 < h < 22 else 0.0
        noise = (random.random() - 0.5) * 0.4
        kw = round(max(0.3, base_kw + evening_peak + noise + seed * 0.05), 2)

        # Solar: bell curve peaking at noon, 0 at night
        angle = ((h - 6) / 12) * math.pi
        solaire = round(max(0.0, math.sin(angle) * 2.2), 2) if 6 <= h <= 18 else 0.0

        data.append({"hour": f"{h}h", "kw": kw, "solaire": solaire})
    return data


def _generate_7d() -> List[dict]:
    """Génère 7 points de données journaliers (une semaine)."""
    days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
    return [
        {
            "hour": day,
            "kw": round(10 + random.uniform(-2, 4), 2),
            "solaire": round(random.uniform(6, 14), 2),
        }
        for day in days
    ]


def _generate_30d() -> List[dict]:
    """Génère 30 points de données journaliers (un mois)."""
    return [
        {
            "hour": f"J{i+1}",
            "kw": round(11 + math.sin(i / 5) * 3 + random.uniform(-1, 1), 2),
            "solaire": round(max(0, 9 + math.sin(i / 8) * 4 + random.uniform(-1, 1)), 2),
        }
        for i in range(30)
    ]


def _generate_1y() -> List[dict]:
    """Génère 12 points mensuels (une année)."""
    months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]
    # Winter months consume more, summer produces more solar
    return [
        {
            "hour": months[i],
            "kw": round(350 + math.cos(i / 2) * 120 + random.uniform(-20, 20), 1),
            "solaire": round(max(0, 120 + math.sin(i / 1.9) * 100 + random.uniform(-15, 15)), 1),
        }
        for i in range(12)
    ]


@router.get(
    "/api/energy",
    summary="Données énergétiques",
    description=(
        "Retourne les données de consommation et de production solaire selon la plage temporelle demandée : "
        "`24h` (horaire), `7j` (journalier), `30j` (mensuel sur 30 jours), `1a` (annuel). "
        "Les données sont générées de manière algorithmique avec un bruit réaliste."
    ),
)
async def get_energy(
    range: str = Query(
        default="24h",
        enum=["24h", "7j", "30j", "1a"],
        description="Plage temporelle souhaitée",
        example="24h"
    ),
    current_user: User = Depends(get_current_user),
):
    # Generate chart data
    seed = random.uniform(0, 1)  # adds session variability
    if range == "24h":
        chart_data = _generate_24h(seed)
    elif range == "7j":
        chart_data = _generate_7d()
    elif range == "30j":
        chart_data = _generate_30d()
    else:  # "1a"
        chart_data = _generate_1y()

    # Calculate KPI aggregates from chart data
    total_kw = sum(p["kw"] for p in chart_data)
    total_solar = sum(p["solaire"] for p in chart_data)
    eco_euros = round(total_solar * 0.15, 2)  # €0.15/kWh feed-in tariff equivalent
    co2_kg = round(total_kw * 0.058, 1)       # 58g CO2/kWh French mix

    return {
        "conso": round(total_kw, 1),
        "eco": eco_euros,
        "co2": co2_kg,
        "chartData": chart_data,
    }
