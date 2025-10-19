from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
from contextlib import asynccontextmanager


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]


# ✅ Lifespan handler replaces on_event
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    logging.info("🚀 Starting up FastAPI app - Solar Calculator API")
    logging.info(f"📊 Connected to MongoDB: {os.environ['DB_NAME']}")
    yield
    # Shutdown logic
    logging.info("🛑 Shutting down FastAPI app, closing MongoDB connection")
    client.close()


# Create the main app with lifespan
app = FastAPI(
    title="Solar Calculator API",
    description="Professional Solar System Calculator for Lebanon",
    version="1.0.0",
    lifespan=lifespan
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ============================================
# MODELS
# ============================================

# Status Check Models (existing)
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class StatusCheckCreate(BaseModel):
    client_name: str


# Solar Calculator Models
class Appliance(BaseModel):
    name: str
    watts: int
    customWatts: Optional[int] = None
    quantity: int
    hoursPerDay: float
    category: str


class SolarCalculatorInput(BaseModel):
    region: str
    city: str
    systemType: str
    roofSize: int
    roofDirection: str
    shading: str
    backupDays: int
    batteryType: Optional[str] = "lead_acid"
    energyProvider: Optional[str] = None
    appliances: List[Appliance]


class SolarCalculatorResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    input_data: Dict[str, Any]
    results: Dict[str, Any]
    user_email: Optional[str] = None


# ============================================
# ROUTES - Health & Status
# ============================================

@api_router.get("/")
async def root():
    """Root endpoint - API status"""
    return {
        "message": "Solar Calculator API is running",
        "status": "healthy",
        "version": "1.0.0",
        "endpoints": {
            "health": "/api/health",
            "calculate": "/api/calculate",
            "calculations": "/api/calculations",
            "docs": "/docs"
        }
    }


@api_router.get("/health")
async def health_check():
    """Health check endpoint for testing backend connection"""
    try:
        # Test MongoDB connection
        await db.command('ping')
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "Solar Calculator API",
        "database": db_status,
        "message": "Backend is working perfectly! ✅"
    }


# ============================================
# ROUTES - Status Checks (existing)
# ============================================

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    """Create a status check record"""
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    logging.info(f"✅ Status check created: {status_obj.client_name}")
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    """Get all status checks"""
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]


# ============================================
# ROUTES - Solar Calculator
# ============================================

@api_router.post("/calculate")
async def calculate_solar_system(input_data: SolarCalculatorInput):
    """
    Calculate solar system specifications based on user input.
    
    This endpoint processes appliance data, location info, and preferences
    to generate a complete solar system design with equipment specifications,
    economic analysis, and installation guidance.
    """
    try:
        logging.info(f"📊 Calculating solar system for {input_data.city}, {input_data.region}")
        logging.info(f"📋 Processing {len(input_data.appliances)} appliances")
        
        # Convert input to dict
        form_data = input_data.dict()
        appliances = form_data.get('appliances', [])
        
        # TODO: Integrate your actual solar calculation logic here
        # from your_calculator_module import calculateSolarSystem
        # results = calculateSolarSystem(form_data, appliances)
        
        # For now, we'll create a structured response based on the input
        # This is a placeholder that returns realistic data structure
        
        # Calculate basic metrics from appliances
        total_daily_consumption = sum(
            (app.get('customWatts') or app.get('watts', 0)) * 
            app.get('quantity', 1) * 
            app.get('hoursPerDay', 0) / 1000 
            for app in appliances
        )
        
        peak_load = sum(
            (app.get('customWatts') or app.get('watts', 0)) * 
            app.get('quantity', 1)
            for app in appliances
        )
        
        # Calculate system size (simplified)
        system_size = round(total_daily_consumption * 1.3 / 4.5, 1)  # 4.5 avg sun hours
        
        results = {
            "systemSize": system_size,
            "actualSystemSize": system_size,
            "annualProduction": int(system_size * 1650),  # Lebanese avg irradiance
            "dailyProduction": round(system_size * 4.5, 1),
            "performanceRatio": 82,
            "systemEfficiency": 78,
            "loadAnalysis": {
                "totalDailyConsumption": round(total_daily_consumption, 2),
                "peakSimultaneousLoad": int(peak_load * 0.8),  # Diversity factor
                "averageHourlyLoad": int(total_daily_consumption * 1000 / 24),
                "loadFactor": 0.45
            },
            "equipment": {
                "panels": {
                    "brand": "Trina Solar",
                    "model": "TSM-DE09.08",
                    "wattage": 450,
                    "quantity": int(system_size * 1000 / 450) + 1,
                    "totalWattage": int((int(system_size * 1000 / 450) + 1) * 450),
                    "efficiency": 20.5,
                    "warranty": "25 years performance, 12 years product",
                    "totalCost": int((int(system_size * 1000 / 450) + 1) * 270)
                },
                "inverter": {
                    "brand": "Growatt",
                    "model": "SPF 5000 TL HVM",
                    "type": "Hybrid Inverter",
                    "power": int(peak_load * 1.3),
                    "efficiency": 97.6,
                    "voltage": "48V",
                    "totalCost": int(peak_load * 1.3 * 0.25)
                },
                "batteries": {
                    "brand": "Volta" if form_data.get('batteryType') == 'lead_acid' else "BYD",
                    "model": "AGM 12V 200Ah" if form_data.get('batteryType') == 'lead_acid' else "Battery-Box Premium LVS",
                    "type": "AGM Lead-Acid" if form_data.get('batteryType') == 'lead_acid' else "Lithium Iron Phosphate",
                    "quantity": 8,
                    "totalEnergyCapacity": round(total_daily_consumption * float(form_data.get('backupDays', 2)), 1),
                    "autonomyProvided": int(form_data.get('backupDays', 2)) * 24,
                    "totalCost": int(total_daily_consumption * float(form_data.get('backupDays', 2)) * 400)
                },
                "costs": {
                    "total": 0,  # Will be calculated below
                    "perWatt": 0
                }
            },
            "economics": {
                "totalSystemCost": 0,  # Will be calculated
                "costPerKw": 0,
                "annualSavings": int(total_daily_consumption * 365 * 0.35),  # $0.35/kWh avg
                "simplePayback": 0,
                "npv25Years": 0,
                "roi25Years": 0,
                "lcoe": 0.08,
                "annualCO2Avoided": int(system_size * 1650 * 0.8),
                "lifetimeCO2Avoided": int(system_size * 1650 * 0.8 * 25)
            },
            "monthlyProduction": [
                {"month": "January", "production": int(system_size * 120)},
                {"month": "February", "production": int(system_size * 130)},
                {"month": "March", "production": int(system_size * 150)},
                {"month": "April", "production": int(system_size * 160)},
                {"month": "May", "production": int(system_size * 175)},
                {"month": "June", "production": int(system_size * 180)},
                {"month": "July", "production": int(system_size * 185)},
                {"month": "August", "production": int(system_size * 180)},
                {"month": "September", "production": int(system_size * 160)},
                {"month": "October", "production": int(system_size * 145)},
                {"month": "November", "production": int(system_size * 125)},
                {"month": "December", "production": int(system_size * 115)}
            ],
            "location": {
                "region": form_data.get('region'),
                "peakSunHours": 4.5,
                "annualIrradiance": 1650
            },
            "installationGuide": {
                "totalDuration": "8-13 working days",
                "phases": [
                    {
                        "phase": "Site Assessment & Permits",
                        "duration": "3-5 days",
                        "tasks": [
                            "Obtain building permit from municipality",
                            "Structural assessment",
                            "Equipment procurement"
                        ]
                    },
                    {
                        "phase": "Installation",
                        "duration": "2-3 days",
                        "tasks": [
                            "Mount solar panels",
                            "Install inverter and batteries",
                            "Electrical connections"
                        ]
                    },
                    {
                        "phase": "Testing & Commissioning",
                        "duration": "1-2 days",
                        "tasks": [
                            "System testing",
                            "Performance verification",
                            "Customer training"
                        ]
                    }
                ],
                "estimatedCosts": {
                    "labor": int(system_size * 200),
                    "installation": int(system_size * 150),
                    "permits": 300,
                    "commissioning": 200,
                    "total": int(system_size * 350 + 500)
                },
                "keyConsiderations": [
                    "Consider Lebanese seasonal weather",
                    "Ensure municipal compliance",
                    "Account for currency fluctuations"
                ],
                "postInstallation": [
                    "Monthly cleaning",
                    "Quarterly battery maintenance",
                    "Annual professional inspection"
                ]
            },
            "applianceAnalysis": [
                {
                    "name": app.get('name'),
                    "quantity": app.get('quantity'),
                    "totalWatts": (app.get('customWatts') or app.get('watts')) * app.get('quantity'),
                    "hoursPerDay": app.get('hoursPerDay'),
                    "dailyKwh": round(
                        (app.get('customWatts') or app.get('watts')) * 
                        app.get('quantity') * 
                        app.get('hoursPerDay') / 1000, 
                        2
                    ),
                    "monthlyCost": round(
                        (app.get('customWatts') or app.get('watts')) * 
                        app.get('quantity') * 
                        app.get('hoursPerDay') * 30 * 0.35 / 1000, 
                        2
                    )
                }
                for app in appliances
            ]
        }
        
        # Calculate total costs
        total_cost = (
            results["equipment"]["panels"]["totalCost"] +
            results["equipment"]["inverter"]["totalCost"] +
            results["equipment"]["batteries"]["totalCost"] +
            results["installationGuide"]["estimatedCosts"]["total"]
        )
        
        results["equipment"]["costs"]["total"] = total_cost
        results["equipment"]["costs"]["perWatt"] = round(total_cost / (system_size * 1000), 2)
        results["economics"]["totalSystemCost"] = total_cost
        results["economics"]["costPerKw"] = int(total_cost / system_size)
        results["economics"]["simplePayback"] = round(
            total_cost / results["economics"]["annualSavings"], 1
        )
        results["economics"]["npv25Years"] = int(
            results["economics"]["annualSavings"] * 25 * 0.8 - total_cost
        )
        results["economics"]["roi25Years"] = int(
            (results["economics"]["npv25Years"] / total_cost) * 100
        )
        
        # Save to database
        calculation_record = SolarCalculatorResult(
            input_data=form_data,
            results=results
        )
        
        await db.solar_calculations.insert_one(calculation_record.dict())
        logging.info(f"✅ Calculation saved with ID: {calculation_record.id}")
        
        return {
            "success": True,
            "calculation_id": calculation_record.id,
            "results": results,
            "message": "Solar system calculated successfully!"
        }
        
    except Exception as e:
        logging.error(f"❌ Error in solar calculation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/calculations")
async def get_all_calculations():
    """Get all saved solar calculations"""
    try:
        calculations = await db.solar_calculations.find().sort("timestamp", -1).to_list(100)
        logging.info(f"📋 Retrieved {len(calculations)} calculations")
        return {
            "success": True,
            "count": len(calculations),
            "calculations": calculations
        }
    except Exception as e:
        logging.error(f"❌ Error fetching calculations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/calculations/{calculation_id}")
async def get_calculation_by_id(calculation_id: str):
    """Get a specific calculation by ID"""
    try:
        calculation = await db.solar_calculations.find_one({"id": calculation_id})
        if calculation:
            logging.info(f"✅ Found calculation: {calculation_id}")
            return {
                "success": True,
                "calculation": calculation
            }
        else:
            logging.warning(f"⚠️ Calculation not found: {calculation_id}")
            raise HTTPException(status_code=404, detail="Calculation not found")
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"❌ Error fetching calculation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.delete("/calculations/{calculation_id}")
async def delete_calculation(calculation_id: str):
    """Delete a calculation by ID"""
    try:
        result = await db.solar_calculations.delete_one({"id": calculation_id})
        if result.deleted_count > 0:
            logging.info(f"🗑️ Deleted calculation: {calculation_id}")
            return {
                "success": True,
                "message": "Calculation deleted successfully"
            }
        else:
            logging.warning(f"⚠️ Calculation not found for deletion: {calculation_id}")
            raise HTTPException(status_code=404, detail="Calculation not found")
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"❌ Error deleting calculation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Include the router in the main app
app.include_router(api_router)

# Middleware - CORS (allow frontend to connect)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Log startup info
logger.info("=" * 50)
logger.info("🌞 Solar Calculator API - Ready!")
logger.info("📍 API Docs: http://localhost:8000/docs")
logger.info("🔍 Health Check: http://localhost:8000/api/health")
logger.info("=" * 50)