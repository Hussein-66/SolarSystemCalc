// Enhanced Solar System Calculator for Lebanon
// Uses real Lebanese solar irradiance data with realistic market-based pricing
// Includes customizable appliance wattages and variable pricing disclaimers

import { equipmentDatabase, regionalData, lebanonSolarFactors } from './mockData';

export class SolarCalculator {
  constructor(formData, selectedAppliances) {
    this.formData = formData;
    this.appliances = selectedAppliances;
    this.results = null;
    
    // Get regional data
    this.region = formData.region || 'beirut';
    this.solarData = regionalData[this.region];
    this.factors = lebanonSolarFactors;
  }

  // Main calculation method
  calculate() {
    // Step 1: Calculate actual energy consumption with proper load analysis
    const energyNeeds = this.calculateEnergyNeeds();
    
    // Step 2: Determine system sizing based on real solar conditions
    const systemSize = this.calculateSystemSize(energyNeeds);
    
    // Step 3: Select equipment based on Lebanese market availability
    const equipment = this.selectEquipment(systemSize, energyNeeds);
    
    // Step 4: Calculate actual monthly production
    const monthlyProduction = this.calculateMonthlyProduction(systemSize);
    
    // Step 5: Economic analysis with realistic Lebanese pricing
    const economics = this.calculateEconomics(systemSize, energyNeeds, equipment);
    
    // Step 6: Generate professional installation guide
    const installation = this.generateInstallationGuide(equipment, systemSize);

    this.results = {
      // System specifications
      systemSize: Math.round(systemSize.nominalKw * 100) / 100,
      actualSystemSize: Math.round(systemSize.actualKw * 100) / 100,
      annualProduction: systemSize.annualProduction,
      dailyProduction: systemSize.averageDailyProduction,
      
      // Load analysis
      loadAnalysis: energyNeeds,
      
      // Equipment specifications with market notes
      equipment: equipment,
      
      // Performance data
      monthlyProduction: monthlyProduction,
      performanceRatio: systemSize.performanceRatio,
      systemEfficiency: systemSize.overallEfficiency,
      
      // Economics with pricing disclaimers
      economics: economics,
      
      // Installation
      installationGuide: installation,
      
      // Appliance breakdown
      applianceAnalysis: this.formatAppliances(),
      
      // Regional factors
      location: {
        region: this.region,
        peakSunHours: this.solarData.peakSunHours,
        annualIrradiance: this.solarData.annualIrradiance,
        averageTemp: this.solarData.averageTemp
      },
      
      // Market disclaimers
      marketNotes: {
        priceDisclaimer: "Prices are estimates based on current Lebanese market conditions and may vary ±15-30% depending on supplier, quantity, exchange rate fluctuations, and market availability.",
        currencyNote: "All prices shown in USD. Actual payments may be in LBP at prevailing exchange rates.",
        availabilityNote: "Equipment availability varies. Contact local suppliers for current stock and updated pricing.",
        warrantyNote: "Warranty terms may vary based on local distributor agreements and import conditions."
      }
    };

    return this.results;
  }

  // Calculate detailed energy consumption analysis with user-defined wattages
  calculateEnergyNeeds() {
    let totalContinuousLoad = 0; // Loads that run continuously
    let totalIntermittentLoad = 0; // Loads that run intermittently
    let totalDailyKwh = 0;
    let peakSimultaneousLoad = 0;
    let criticalLoads = 0; // Loads that must run during outages
    
    const loadByCategory = {};

    this.appliances.forEach(appliance => {
      // Use user-defined watts or default watts
      const applianceWatts = (appliance.customWatts || appliance.watts) * appliance.quantity;
      const dailyKwh = (applianceWatts * appliance.hoursPerDay) / 1000;
      
      totalDailyKwh += dailyKwh;
      
      // Categorize loads
      if (!loadByCategory[appliance.category]) {
        loadByCategory[appliance.category] = { watts: 0, kwh: 0, count: 0 };
      }
      loadByCategory[appliance.category].watts += applianceWatts;
      loadByCategory[appliance.category].kwh += dailyKwh;
      loadByCategory[appliance.category].count += appliance.quantity;
      
      // Determine if continuous or intermittent
      if (appliance.hoursPerDay >= 20) {
        totalContinuousLoad += applianceWatts;
      } else {
        totalIntermittentLoad += applianceWatts;
      }
      
      // Critical loads (essential appliances)
      if (['lighting', 'electronics'].includes(appliance.category) || 
          appliance.name.toLowerCase().includes('refrigerator') ||
          appliance.name.toLowerCase().includes('router') ||
          appliance.name.toLowerCase().includes('security')) {
        criticalLoads += applianceWatts;
      }
      
      // Calculate simultaneity factor for peak load
      const simultaneityFactor = this.getSimultaneityFactor(appliance.category);
      peakSimultaneousLoad += applianceWatts * simultaneityFactor;
    });

    // Apply diversity factor for realistic peak demand
    const diversityFactor = this.getDiversityFactor(totalIntermittentLoad);
    peakSimultaneousLoad = peakSimultaneousLoad * diversityFactor;

    // Calculate required backup capacity
    const backupCapacity = criticalLoads + (totalIntermittentLoad * 0.3);
    
    // Calculate autonomy requirements
    const autonomyHours = (parseInt(this.formData.backupDays) || 2) * 24;
    const autonomyEnergyRequired = (backupCapacity / 1000) * autonomyHours; // kWh

    return {
      totalDailyConsumption: Math.round(totalDailyKwh * 100) / 100,
      peakSimultaneousLoad: Math.round(peakSimultaneousLoad),
      continuousLoad: Math.round(totalContinuousLoad),
      intermittentLoad: Math.round(totalIntermittentLoad),
      criticalLoads: Math.round(criticalLoads),
      backupCapacity: Math.round(backupCapacity),
      autonomyEnergyRequired: Math.round(autonomyEnergyRequired * 100) / 100,
      averageHourlyLoad: Math.round((totalDailyKwh / 24) * 1000), // Watts
      loadByCategory: loadByCategory,
      autonomyHours: autonomyHours,
      loadFactor: Math.round((totalDailyKwh * 1000 / (peakSimultaneousLoad * 24)) * 100) / 100
    };
  }

  // Calculate system size using proper solar engineering methods
  calculateSystemSize(energyNeeds) {
    // Step 1: Calculate energy generation requirement with losses
    const systemEfficiency = this.calculateSystemEfficiency();
    const requiredDailyGeneration = energyNeeds.totalDailyConsumption / systemEfficiency;
    
    // Step 2: Calculate PV array size
    const peakSunHours = this.solarData.peakSunHours;
    const nominalArraySize = requiredDailyGeneration / peakSunHours; // kW DC
    
    // Step 3: Apply temperature derating
    const temperatureDeratingFactor = this.calculateTemperatureDerating();
    const adjustedArraySize = nominalArraySize / temperatureDeratingFactor;
    
    // Step 4: Apply safety margin
    const safetyMargin = 1.2; // 20% safety margin
    const finalArraySize = adjustedArraySize * safetyMargin;
    
    // Step 5: Calculate annual production
    const annualIrradiance = this.solarData.annualIrradiance;
    const annualProduction = Math.round(finalArraySize * annualIrradiance * systemEfficiency);
    
    // Step 6: Calculate performance ratio
    const performanceRatio = systemEfficiency;
    
    return {
      nominalKw: Math.ceil(finalArraySize * 2) / 2, // Round up to nearest 0.5kW
      actualKw: Math.round(finalArraySize * 100) / 100,
      requiredDailyGeneration: Math.round(requiredDailyGeneration * 100) / 100,
      annualProduction: annualProduction,
      averageDailyProduction: Math.round(annualProduction / 365 * 100) / 100,
      overallEfficiency: Math.round(systemEfficiency * 100),
      performanceRatio: Math.round(performanceRatio * 100),
      temperatureDeratingFactor: Math.round(temperatureDeratingFactor * 100) / 100
    };
  }

  // Select equipment using Lebanese market availability and cost-effectiveness
  selectEquipment(systemSize, energyNeeds) {
    const db = equipmentDatabase;

    // 1. Select Solar Panels - prioritize availability and cost-effectiveness
    const availablePanels = db.panels.filter(p => p.availability === 'Excellent' || p.availability === 'Good');
    const selectedPanel = availablePanels.sort((a, b) => (b.efficiency / b.price) - (a.efficiency / a.price))[0] || db.panels[0];
    const panelsNeeded = Math.ceil((systemSize.nominalKw * 1000) / selectedPanel.wattage);
    
    // 2. Select Inverter - match Lebanese power requirements
    const requiredInverterPower = energyNeeds.peakSimultaneousLoad * 1.25;
    const availableInverters = db.inverters.filter(inv => inv.availability === 'Excellent' || inv.availability === 'Good');
    let selectedInverter = availableInverters
      .filter(inv => inv.power >= requiredInverterPower)
      .sort((a, b) => a.price - b.price)[0];
    
    if (!selectedInverter) {
      // Use largest available inverter
      selectedInverter = availableInverters.sort((a, b) => b.power - a.power)[0];
      if (selectedInverter && selectedInverter.power < requiredInverterPower) {
        const invertersNeeded = Math.ceil(requiredInverterPower / selectedInverter.power);
        selectedInverter.quantity = invertersNeeded;
        selectedInverter.totalPower = selectedInverter.power * invertersNeeded;
      }
    }

    // 3. Select Batteries - consider Lebanese preferences (lead-acid common, lithium premium)
    let selectedBattery, batteriesNeeded;
    const systemVoltage = 48;
    
    if (this.formData.batteryType === 'lithium' && energyNeeds.autonomyEnergyRequired > 20) {
      // Use lithium for larger systems or when requested
      selectedBattery = db.batteries.find(b => b.type.includes('Lithium'));
      if (selectedBattery) {
        const usableCapacityPerBattery = selectedBattery.actualCapacity * 0.95 / 1000; // kWh usable
        batteriesNeeded = Math.ceil(energyNeeds.autonomyEnergyRequired / usableCapacityPerBattery);
      }
    }
    
    if (!selectedBattery) {
      // Use lead-acid batteries (more common in Lebanon)
      selectedBattery = db.batteries.find(b => b.availability?.includes('Excellent') && b.type.includes('Lead-Acid'));
      if (!selectedBattery) {
        selectedBattery = db.batteries.find(b => b.type.includes('Lead-Acid'));
      }
      
      const dod = selectedBattery.type.includes('AGM') ? 0.6 : 0.5; // Better DOD for AGM
      const totalAhNeeded = (energyNeeds.autonomyEnergyRequired * 1000) / (systemVoltage * dod);
      
      // Calculate battery configuration
      const batteriesInSeries = systemVoltage / selectedBattery.voltage;
      const parallelStrings = Math.ceil(totalAhNeeded / selectedBattery.capacity);
      batteriesNeeded = batteriesInSeries * parallelStrings;
    }

    // 4. Select Charge Controller - match system requirements
    const totalPvPower = panelsNeeded * selectedPanel.wattage;
    const requiredControllerAmps = (totalPvPower / systemVoltage) * 1.25;
    
    const selectedChargeController = db.chargeControllers
      .filter(cc => cc.current >= requiredControllerAmps && cc.availability !== 'Poor')
      .sort((a, b) => a.price - b.price)[0];

    // 5. Calculate realistic Lebanese market costs
    const equipmentCosts = this.calculateEquipmentCosts(
      selectedPanel, panelsNeeded,
      selectedInverter,
      selectedBattery, batteriesNeeded,
      selectedChargeController,
      totalPvPower
    );

    return {
      panels: { 
        ...selectedPanel, 
        quantity: panelsNeeded,
        totalWattage: panelsNeeded * selectedPanel.wattage,
        totalCost: equipmentCosts.panels,
        marketNote: `${selectedPanel.availability} availability in Lebanese market`
      },
      inverter: { 
        ...selectedInverter, 
        totalCost: equipmentCosts.inverter,
        adequacyMargin: Math.round(((selectedInverter.power * (selectedInverter.quantity || 1)) - energyNeeds.peakSimultaneousLoad) / energyNeeds.peakSimultaneousLoad * 100),
        marketNote: `${selectedInverter.availability} availability in Lebanese market`
      },
      batteries: { 
        ...selectedBattery, 
        quantity: batteriesNeeded,
        totalCapacity: batteriesNeeded * selectedBattery.capacity,
        totalEnergyCapacity: selectedBattery.type.includes('Lithium') ? 
          (batteriesNeeded * selectedBattery.actualCapacity / 1000) :
          (batteriesNeeded * selectedBattery.capacity * selectedBattery.voltage / 1000), // kWh
        totalCost: equipmentCosts.batteries,
        autonomyProvided: this.calculateAutonomyHours(selectedBattery, batteriesNeeded, energyNeeds.backupCapacity),
        marketNote: `${selectedBattery.availability || 'Standard'} availability in Lebanese market`
      },
      chargeController: selectedChargeController ? { 
        ...selectedChargeController, 
        totalCost: equipmentCosts.chargeController,
        utilizationRatio: Math.round((totalPvPower / systemVoltage) / selectedChargeController.current * 100),
        marketNote: "Separate charge controller (if not integrated in inverter)"
      } : null,
      costs: {
        equipment: equipmentCosts,
        total: Math.round(equipmentCosts.total),
        perWatt: Math.round(equipmentCosts.total / (systemSize.nominalKw * 1000) * 100) / 100,
        priceVariability: this.factors.marketFactors.priceVariability
      }
    };
  }

  // Calculate realistic equipment costs for Lebanese market
  calculateEquipmentCosts(panel, panelsNeeded, inverter, battery, batteriesNeeded, chargeController, totalPvPower) {
    const costs = {
      panels: panelsNeeded * panel.price,
      inverter: inverter.price * (inverter.quantity || 1),
      batteries: batteriesNeeded * battery.price,
      chargeController: chargeController ? chargeController.price : 0,
      installation: totalPvPower * this.factors.installationCosts.installation,
      labor: totalPvPower * this.factors.installationCosts.labor,
      permits: this.factors.installationCosts.permits,
      commissioning: this.factors.installationCosts.commissioning,
      mounting: Math.ceil(totalPvPower / 1000) * 150, // Mounting hardware per kW
      wiring: Math.ceil(totalPvPower / 1000) * 100, // DC/AC wiring per kW
      protection: Math.ceil(totalPvPower / 1000) * 80 // Circuit breakers, fuses per kW
    };
    
    costs.total = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
    
    return costs;
  }

  // Calculate autonomy hours based on battery type and capacity
  calculateAutonomyHours(battery, quantity, backupCapacity) {
    let usableCapacity;
    
    if (battery.type.includes('Lithium')) {
      usableCapacity = quantity * battery.actualCapacity * 0.95; // 95% DOD for lithium
    } else if (battery.type.includes('AGM')) {
      usableCapacity = quantity * battery.capacity * battery.voltage * 0.6; // 60% DOD for AGM
    } else {
      usableCapacity = quantity * battery.capacity * battery.voltage * 0.5; // 50% DOD for flooded
    }
    
    return Math.round((usableCapacity / backupCapacity) * 10) / 10;
  }

  // Calculate system efficiency with Lebanese environmental factors
  calculateSystemEfficiency() {
    const inverterEfficiency = 0.94; // Realistic inverter efficiency
    const mpptEfficiency = 0.98;
    const batteryEfficiency = this.formData.batteryType === 'lithium' ? 0.95 : 0.82; // Lead-acid lower
    const wiringLosses = this.factors.wiringLosses;
    const dustFactor = this.factors.dustFactor;
    const temperatureFactor = this.factors.temperatureFactor;
    const shadingFactor = this.factors.shadingFactors[this.formData.shading] || this.factors.shadingFactors.minimal;
    
    if (this.formData.systemType === 'grid_tie') {
      return inverterEfficiency * wiringLosses * dustFactor * temperatureFactor * shadingFactor;
    } else {
      return inverterEfficiency * mpptEfficiency * batteryEfficiency * wiringLosses * dustFactor * temperatureFactor * shadingFactor;
    }
  }

  // Calculate temperature derating for Lebanese climate
  calculateTemperatureDerating() {
    const averageTemp = this.solarData.averageTemp;
    const standardTestTemp = 25; // °C (STC conditions)
    const tempCoefficient = -0.37; // %/°C (realistic for market panels)
    
    const tempDifference = averageTemp - standardTestTemp;
    const tempLossPercent = tempDifference * tempCoefficient / 100;
    
    return Math.max(0.82, 1 + tempLossPercent); // Minimum 82% output
  }

  // Get simultaneity factor based on appliance category
  getSimultaneityFactor(category) {
    const factors = {
      cooling: 0.85, // AC units in Lebanese heat
      heating: 0.75, // Winter heating diversity
      appliances: 0.7, // Kitchen appliances diversity
      electronics: 0.9, // Always-on devices
      lighting: 0.6, // Lighting diversity
      entertainment: 0.5, // Entertainment diversity
      pumping: 1.0, // Pumps run at full load
      custom: 0.8 // Custom appliances conservative estimate
    };
    return factors[category] || 0.7;
  }

  // Get diversity factor based on total load
  getDiversityFactor(totalLoad) {
    if (totalLoad < 3000) return 0.9; // Small Lebanese apartment
    if (totalLoad < 8000) return 0.85; // Medium Lebanese house
    if (totalLoad < 15000) return 0.8; // Large Lebanese house
    return 0.75; // Very large house/small business
  }

  // Calculate monthly production with Lebanese weather patterns
  calculateMonthlyProduction(systemSize) {
    const systemEfficiency = this.calculateSystemEfficiency();
    const temperatureDerating = this.calculateTemperatureDerating();
    
    return this.solarData.monthlyIrradiance.map((irradiance, index) => {
      const monthlyProduction = Math.round(
        systemSize.nominalKw * irradiance * systemEfficiency * temperatureDerating
      );
      
      const daysInMonth = new Date(2024, index + 1, 0).getDate();
      const dailyAverage = Math.round(monthlyProduction / daysInMonth * 100) / 100;
      
      const month = new Date(0, index).toLocaleString('en-US', { month: 'long' });
      
      return {
        month,
        production: monthlyProduction,
        dailyAverage,
        irradiance: Math.round(irradiance),
        daysInMonth
      };
    });
  }

  // Calculate economic analysis with realistic Lebanese costs
  calculateEconomics(systemSize, energyNeeds, equipment) {
    const totalSystemCost = equipment.costs.total;
    const annualProduction = systemSize.annualProduction;
    
    // Use realistic Lebanese electricity costs
    let avgElectricityCost = 0.35; // USD per kWh weighted average
    if (this.formData.energyProvider) {
      const provider = this.formData.energyProvider;
      if (provider === 'edl_only') avgElectricityCost = 0.10;
      else if (provider === 'generator_only') avgElectricityCost = 0.45;
      else avgElectricityCost = 0.35;
    }
    
    // Annual savings
    const annualSavings = Math.min(annualProduction * avgElectricityCost, energyNeeds.totalDailyConsumption * 365 * avgElectricityCost);
    
    // Simple payback period
    const simplePayback = Math.round((totalSystemCost / annualSavings) * 10) / 10;
    
    // NPV calculation with Lebanese economic conditions
    const discountRate = 0.08; // Higher rate for Lebanon economic conditions
    const systemLifespan = 25;
    const annualDegradation = 0.006; // Slightly higher for Lebanese conditions
    const inflationRate = 0.05; // Lebanese electricity price inflation
    
    let totalNPV = -totalSystemCost;
    for (let year = 1; year <= systemLifespan; year++) {
      const yearlyProduction = annualProduction * Math.pow(1 - annualDegradation, year - 1);
      const yearlySavings = Math.min(
        yearlyProduction * avgElectricityCost * Math.pow(1 + inflationRate, year - 1),
        energyNeeds.totalDailyConsumption * 365 * avgElectricityCost * Math.pow(1 + inflationRate, year - 1)
      );
      const presentValue = yearlySavings / Math.pow(1 + discountRate, year);
      totalNPV += presentValue;
    }
    
    // Environmental impact
    const annualCO2Avoided = Math.round(annualProduction * 0.8); // Lebanon grid emission factor
    const lifetimeCO2Avoided = Math.round(annualCO2Avoided * systemLifespan);
    
    return {
      totalSystemCost: Math.round(totalSystemCost),
      costPerKw: Math.round(totalSystemCost / systemSize.nominalKw),
      annualSavings: Math.round(annualSavings),
      simplePayback: simplePayback,
      npv25Years: Math.round(totalNPV),
      roi25Years: Math.round(((totalNPV + totalSystemCost) / totalSystemCost) * 100),
      annualCO2Avoided: annualCO2Avoided,
      lifetimeCO2Avoided: lifetimeCO2Avoided,
      lcoe: Math.round((totalSystemCost / (annualProduction * systemLifespan)) * 1000) / 1000,
      electricityCostUsed: avgElectricityCost,
      breakdownCosts: equipment.costs.equipment,
      economicNote: "Calculations based on current Lebanese market conditions and may vary with economic changes"
    };
  }

  // Generate installation guide for Lebanese conditions
  generateInstallationGuide(equipment, systemSize) {
    const panelsNeeded = equipment.panels.quantity;
    const inverterPower = equipment.inverter.power;
    const batteriesNeeded = equipment.batteries.quantity;

    const phases = [
      {
        phase: "Site Assessment & Permits",
        duration: "3-5 days",
        description: "Lebanese regulatory compliance and site preparation",
        tasks: [
          "Obtain building permit from municipality",
          "EDL interconnection application (if grid-tie)",
          "Structural assessment for Lebanese building standards",
          "Electrical panel upgrade assessment",
          "Equipment procurement and import clearance"
        ],
        requirements: [
          "Licensed Lebanese electrical engineer approval",
          "Municipal building permit",
          "Import documentation for equipment"
        ],
        costs: equipment.costs.equipment.permits
      },
      {
        phase: "Mounting & Mechanical Installation",
        duration: "2-3 days",
        description: "Panel mounting system installation",
        tasks: [
          `Install mounting system for ${panelsNeeded} panels`,
          "Waterproofing for Lebanese weather conditions",
          "Grounding system per Lebanese electrical code",
          "Cable management and protection"
        ],
        requirements: [
          "Weather-resistant mounting hardware",
          "Proper safety equipment",
          "Lebanese electrical code compliance"
        ],
        costs: equipment.costs.equipment.installation
      },
      {
        phase: "Electrical Installation",
        duration: "2-3 days",
        description: "Power system and battery installation",
        tasks: [
          `Install ${inverterPower}W inverter with proper ventilation`,
          `Configure ${batteriesNeeded} battery bank (${equipment.batteries.type})`,
          "DC and AC electrical connections",
          "Protection devices and monitoring systems",
          "Grid interconnection (if applicable)"
        ],
        requirements: [
          "Adequate ventilation for Lebanese climate",
          "Battery ventilation (for lead-acid systems)",
          "Surge protection devices"
        ],
        costs: equipment.costs.equipment.labor
      },
      {
        phase: "Testing & Commissioning",
        duration: "1-2 days",
        description: "System testing and customer training",
        tasks: [
          "Complete electrical testing and certification",
          "Performance verification",
          "System monitoring setup",
          "Customer training on operation",
          "Warranty registration with Lebanese distributors"
        ],
        deliverables: [
          "Installation certificate",
          "Performance test report",
          "User manual in Arabic/English",
          "Warranty documentation"
        ],
        costs: equipment.costs.equipment.commissioning
      }
    ];

    return {
      totalDuration: "8-13 working days",
      phases: phases,
      estimatedCosts: {
        total: equipment.costs.equipment.permits + equipment.costs.equipment.installation + 
               equipment.costs.equipment.labor + equipment.costs.equipment.commissioning,
        breakdown: equipment.costs.equipment
      },
      keyConsiderations: [
        "Consider Lebanese seasonal weather patterns for installation timing",
        "Ensure compliance with Lebanese electrical code and municipal requirements",
        "Coordinate with EDL for grid-tie systems",
        "Account for potential currency fluctuations in final costing",
        "Verify equipment warranty coverage in Lebanon"
      ],
      postInstallation: [
        "Monthly cleaning (important in Lebanese dust conditions)",
        "Quarterly battery maintenance for lead-acid systems",
        "Annual professional inspection",
        "Performance monitoring through system interface",
        "Maintain contact with Lebanese distributor for warranty service"
      ],
      lebanesRequirements: {
        permits: "Municipal permit required for most installations",
        inspection: "Electrical inspection by certified Lebanese engineer",
        gridConnection: "EDL approval required for grid-tie systems",
        insurance: "Consider adding solar system to property insurance"
      }
    };
  }

  // Format appliances with user-defined wattages
  formatAppliances() {
    return this.appliances.map(appliance => {
      const watts = appliance.customWatts || appliance.watts;
      const totalWatts = watts * appliance.quantity;
      const dailyKwh = (totalWatts * appliance.hoursPerDay) / 1000;
      const amps220V = totalWatts / 220;
      const monthlyCost = dailyKwh * 30 * 0.35; // Average Lebanese electricity cost
      
      return {
        name: appliance.name,
        category: appliance.category,
        quantity: appliance.quantity,
        unitWatts: watts,
        totalWatts: totalWatts,
        hoursPerDay: appliance.hoursPerDay,
        dailyKwh: Math.round(dailyKwh * 100) / 100,
        amps: Math.round(amps220V * 10) / 10,
        monthlyCost: Math.round(monthlyCost * 100) / 100,
        annualCost: Math.round(monthlyCost * 12),
        simultaneityFactor: this.getSimultaneityFactor(appliance.category),
        isCustomWattage: !!appliance.customWatts
      };
    });
  }
}

// Main calculation function with enhanced error handling
export function calculateSolarSystem(formData, selectedAppliances) {
  try {
    const calculator = new SolarCalculator(formData, selectedAppliances);
    return calculator.calculate();
  } catch (error) {
    console.error('Solar calculation error:', error);
    throw new Error(`Calculation failed: ${error.message}. Please verify your inputs and try again.`);
  }
}

// Enhanced validation for Lebanese market context
export function validateSystemInputs(formData, selectedAppliances) {
  const errors = [];
  
  if (!selectedAppliances || selectedAppliances.length === 0) {
    errors.push("At least one appliance must be selected");
  }
  
  // Check for valid wattages
  const invalidAppliances = selectedAppliances.filter(app => {
    const watts = app.customWatts || app.watts;
    return !watts || watts <= 0 || watts > 10000; // Reasonable limits
  });
  
  if (invalidAppliances.length > 0) {
    errors.push("All appliances must have valid wattage values (1-10,000 watts)");
  }
  
  const totalLoad = selectedAppliances.reduce((sum, app) => {
    const watts = app.customWatts || app.watts;
    return sum + (watts * app.quantity);
  }, 0);
  
  if (totalLoad > 30000) {
    errors.push("Total load exceeds typical residential capacity (30kW max recommended)");
  }
  
  if (totalLoad < 500) {
    errors.push("Total load seems too low for a typical Lebanese household");
  }
  
  if (!formData.region) {
    errors.push("Location/region must be specified");
  }
  
  return errors;
}

// Enhanced recommendations for Lebanese market
export function getSystemRecommendations(results) {
  const recommendations = [];
  
  // System size recommendations
  if (results.systemSize > 15) {
    recommendations.push({
      type: "warning",
      message: "Large system detected. Consider energy efficiency measures first to reduce initial investment."
    });
  }
  
  // Battery recommendations based on Lebanese power situation
  if (results.equipment.batteries.autonomyProvided < 12) {
    recommendations.push({
      type: "info", 
      message: "Consider increasing battery capacity for longer backup during extended EDL outages."
    });
  }
  
  // Economic recommendations
  if (results.economics.simplePayback > 8) {
    recommendations.push({
      type: "warning",
      message: "Payback period exceeds 8 years. Consider reducing system size or improving energy efficiency first."
    });
  }
  
  // Performance recommendations
  if (results.performanceRatio < 75) {
    recommendations.push({
      type: "warning",
      message: "Low performance ratio. Check for shading issues or consider different panel orientation."
    });
  }
  
  // Lebanese-specific recommendations
  if (results.location.region === 'bekaa') {
    recommendations.push({
      type: "info",
      message: "Bekaa Valley has excellent solar resources. Your system will perform above Lebanese average."
    });
  }
  
  if (results.equipment.batteries.type.includes('Lead-Acid')) {
    recommendations.push({
      type: "info",
      message: "Lead-acid batteries require regular maintenance but are cost-effective for Lebanese conditions."
    });
  }
  
  return recommendations;
}