// Real Equipment Database for Lebanese Solar Market
// Based on top 5 best-selling brands in Lebanon with realistic pricing
// NOTE: Prices are estimates and may vary based on supplier, quantity, and market conditions

// Equipment Database - Top 5 Best-Selling Brands in Lebanon
export const equipmentDatabase = {
  panels: [
    {
      brand: "LONGi Solar",
      model: "Hi-MO 4m LR4-72HPH-450M",
      wattage: 450,
      efficiency: 20.6,
      voltage: 41.7, // Vmp
      current: 10.79, // Imp
      openCircuitVoltage: 49.7, // Voc
      shortCircuitCurrent: 11.63, // Isc
      tempCoefficient: -0.38, // %/°C
      warranty: "12 years product, 25 years performance",
      dimensions: { length: 2094, width: 1038, thickness: 35 }, // mm
      weight: 22.5, // kg
      price: 135, // USD approximate (varies ±15%)
      availability: "Excellent"
    },
    {
      brand: "JinkoSolar",
      model: "Tiger Pro JKM440M-54HL4-V",
      wattage: 440,
      efficiency: 20.78,
      voltage: 41.69, // Vmp
      current: 10.55, // Imp
      openCircuitVoltage: 49.68, // Voc
      shortCircuitCurrent: 11.24, // Isc
      tempCoefficient: -0.37, // %/°C
      warranty: "12 years product, 25 years performance",
      dimensions: { length: 2108, width: 1048, thickness: 35 }, // mm
      weight: 22.0, // kg
      price: 130, // USD approximate (varies ±15%)
      availability: "Excellent"
    },
    {
      brand: "Canadian Solar",
      model: "HiKu CS3W-400MS",
      wattage: 400,
      efficiency: 20.3,
      voltage: 40.6, // Vmp
      current: 9.85, // Imp
      openCircuitVoltage: 48.7, // Voc
      shortCircuitCurrent: 10.48, // Isc
      tempCoefficient: -0.39, // %/°C
      warranty: "10 years product, 25 years performance",
      dimensions: { length: 2008, width: 1002, thickness: 40 }, // mm
      weight: 20.6, // kg
      price: 115, // USD approximate (varies ±15%)
      availability: "Good"
    },
    {
      brand: "Trina Solar",
      model: "Vertex S TSM-405DE09.08",
      wattage: 405,
      efficiency: 20.8,
      voltage: 37.2, // Vmp
      current: 10.89, // Imp
      openCircuitVoltage: 45.8, // Voc
      shortCircuitCurrent: 11.72, // Isc
      tempCoefficient: -0.36, // %/°C
      warranty: "12 years product, 25 years performance",
      dimensions: { length: 1762, width: 1134, thickness: 30 }, // mm
      weight: 20.5, // kg
      price: 125, // USD approximate (varies ±15%)
      availability: "Good"
    },
    {
      brand: "Risen Energy",
      model: "RSM120-8-535M",
      wattage: 535,
      efficiency: 20.7,
      voltage: 45.47, // Vmp
      current: 11.76, // Imp
      openCircuitVoltage: 54.53, // Voc
      shortCircuitCurrent: 12.55, // Isc
      tempCoefficient: -0.35, // %/°C
      warranty: "12 years product, 25 years performance",
      dimensions: { length: 2279, width: 1134, thickness: 35 }, // mm
      weight: 26.5, // kg
      price: 155, // USD approximate (varies ±15%)
      availability: "Fair"
    }
  ],
  
  inverters: [
    {
      brand: "MUST Solar",
      model: "PV18-5048 VPK",
      type: "Hybrid MPPT Inverter",
      power: 5000, // Watts continuous
      surgePower: 15000, // Watts for 10 seconds
      inputVoltage: "48V DC",
      outputVoltage: "220V AC",
      frequency: "50Hz",
      amperage: 22.7, // AC output amps
      mpptVoltage: "60-115V DC",
      maxPvInput: 6000, // Watts
      chargerCurrent: 100, // Amps
      efficiency: 93,
      warranty: "2 years",
      features: ["Grid-tie capability", "Battery charging", "Generator input", "Load management"],
      price: 580, // USD approximate (varies ±20%)
      availability: "Excellent"
    },
    {
      brand: "Growatt",
      model: "SPF 5000 ES",
      type: "Off-grid MPPT Inverter",
      power: 5000,
      surgePower: 10000,
      inputVoltage: "48V DC",
      outputVoltage: "220V AC",
      frequency: "50Hz",
      amperage: 22.7,
      mpptVoltage: "60-115V DC",
      maxPvInput: 6000,
      chargerCurrent: 60,
      efficiency: 93,
      warranty: "5 years",
      features: ["Pure sine wave", "Battery charging", "Generator input", "LCD display"],
      price: 520, // USD approximate (varies ±20%)
      availability: "Excellent"
    },
    {
      brand: "Victron Energy",
      model: "MultiPlus-II 48/3000/35-32",
      type: "Hybrid Inverter/Charger",
      power: 3000,
      surgePower: 6000,
      inputVoltage: "48V DC",
      outputVoltage: "220V AC",
      frequency: "50Hz",
      amperage: 13.6,
      chargerCurrent: 35,
      efficiency: 94,
      warranty: "5 years",
      features: ["Grid-tie capability", "Advanced battery management", "Remote monitoring"],
      price: 750, // USD approximate (varies ±20%)
      availability: "Good"
    },
    {
      brand: "Goodwe",
      model: "GW5048D-ES",
      type: "Hybrid MPPT Inverter",
      power: 5000,
      surgePower: 10000,
      inputVoltage: "48V DC",
      outputVoltage: "220V AC",
      frequency: "50Hz",
      amperage: 22.7,
      mpptVoltage: "60-115V DC",
      maxPvInput: 6500,
      chargerCurrent: 80,
      efficiency: 97.6,
      warranty: "5 years",
      features: ["WiFi monitoring", "Battery charging", "Grid-tie capability", "Generator input"],
      price: 650, // USD approximate (varies ±20%)
      availability: "Good"
    },
    {
      brand: "SMA",
      model: "Sunny Island 4.4M",
      type: "Battery Inverter",
      power: 3300,
      surgePower: 4600,
      inputVoltage: "48V DC",
      outputVoltage: "220V AC",
      frequency: "50Hz",
      amperage: 20,
      chargerCurrent: 35,
      efficiency: 96,
      warranty: "5 years",
      features: ["German engineering", "Grid management", "Battery charging", "Modular design"],
      price: 1200, // USD approximate (varies ±20%)
      availability: "Fair"
    }
  ],
  
  batteries: [
    {
      brand: "Eastman",
      model: "Tubular Deep Cycle 200Ah",
      capacity: 200, // Ah
      voltage: 12,
      type: "Tubular Lead-Acid", 
      cycles: 1200, // at 50% DOD
      efficiency: 85, // %
      selfDischarge: 3, // % per month
      operatingTemp: { min: -10, max: 50 }, // °C
      warranty: "60 months",
      dimensions: { length: 518, width: 240, height: 220 }, // mm
      weight: 63, // kg
      price: 220, // USD approximate (varies ±25%)
      availability: "Excellent - Local Lebanese brand"
    },
    {
      brand: "Trojan",
      model: "T-105 RE Deep Cycle",
      capacity: 225, // Ah at C20
      voltage: 6,
      type: "Flooded Lead-Acid", 
      cycles: 1500, // at 50% DOD
      efficiency: 80,
      selfDischarge: 5, // % per month
      operatingTemp: { min: -30, max: 50 },
      warranty: "18 months",
      dimensions: { length: 264, width: 181, height: 276 },
      weight: 28.1,
      price: 165, // USD approximate (varies ±25%)
      availability: "Good"
    },
    {
      brand: "Fullriver",
      model: "DC224-6A AGM",
      capacity: 224, // Ah
      voltage: 6,
      type: "AGM Lead-Acid", 
      cycles: 1000, // at 50% DOD
      efficiency: 90,
      selfDischarge: 2, // % per month
      operatingTemp: { min: -20, max: 60 },
      warranty: "36 months",
      dimensions: { length: 260, width: 180, height: 275 },
      weight: 29.5,
      price: 185, // USD approximate (varies ±25%)
      availability: "Good"
    },
    {
      brand: "Pylontech",
      model: "US3000C LiFePO4",
      capacity: 74, // Ah at 48V (3.55kWh)
      voltage: 48,
      actualCapacity: 3550, // Wh
      type: "Lithium Iron Phosphate",
      cycles: 6000, // at 95% DOD
      efficiency: 95,
      selfDischarge: 3,
      operatingTemp: { min: 0, max: 50 },
      warranty: "10 years",
      dimensions: { length: 442, width: 410, height: 89 },
      weight: 35,
      price: 1050, // USD approximate (varies ±30%)
      availability: "Fair - Higher cost"
    },
    {
      brand: "BAE",
      model: "PVS 2420 OPzS",
      capacity: 420, // Ah at C10
      voltage: 2,
      type: "OPzS Lead-Acid",
      cycles: 1800, // at 80% DOD
      efficiency: 85,
      selfDischarge: 2,
      operatingTemp: { min: -20, max: 45 },
      warranty: "24 months",
      dimensions: { length: 210, width: 175, height: 355 },
      weight: 25.2,
      price: 145, // USD approximate (varies ±25%)
      availability: "Fair"
    }
  ],

  chargeControllers: [
    {
      brand: "EPEVER",
      model: "Tracer 6415AN",
      type: "MPPT",
      current: 60, // Amps
      systemVoltage: "12V/24V/36V/48V Auto",
      maxPvVoltage: 150, // V
      maxPvPower: 3120, // W at 48V
      efficiency: 98,
      warranty: "2 years",
      features: ["LCD display", "Temperature compensation", "Load control"],
      price: 145, // USD approximate (varies ±20%)
      availability: "Excellent"
    },
    {
      brand: "Victron Energy",
      model: "SmartSolar MPPT 100/50",
      type: "MPPT",
      current: 50,
      systemVoltage: "12V/24V/48V",
      maxPvVoltage: 100,
      maxPvPower: 2900, // W at 48V
      efficiency: 98,
      warranty: "5 years",
      features: ["Bluetooth connectivity", "VictronConnect app", "Advanced MPPT algorithm"],
      price: 185, // USD approximate (varies ±20%)
      availability: "Good"
    },
    {
      brand: "Morningstar",
      model: "TriStar TS-MPPT-60",
      type: "MPPT",
      current: 60,
      systemVoltage: "12V/24V/48V",
      maxPvVoltage: 150,
      maxPvPower: 3400,
      efficiency: 99,
      warranty: "5 years",
      features: ["TrakStar technology", "Temperature compensation", "Data logging"],
      price: 220, // USD approximate (varies ±20%)
      availability: "Fair"
    }
  ]
};

// Regional Data for solar irradiance in Lebanon (kWh/m²/year)
// Based on Global Solar Atlas and NREL data
export const regionalData = {
  beirut: {
    latitude: 33.8938,
    longitude: 35.5018,
    annualIrradiance: 1680, // kWh/m²/year
    peakSunHours: 4.6, // Average daily
    monthlyIrradiance: [
      95, 110, 140, 165, 185, 195, 200, 190, 165, 135, 105, 85 // kWh/m²/month
    ],
    averageTemp: 20.5, // °C annual average
    climate: "Mediterranean coastal"
  },
  
  mount_lebanon: {
    latitude: 33.8547,
    longitude: 35.5623,
    annualIrradiance: 1750, // Higher elevation, less atmospheric interference
    peakSunHours: 4.8,
    monthlyIrradiance: [
      100, 115, 150, 175, 195, 205, 210, 200, 175, 145, 110, 90
    ],
    averageTemp: 18.2,
    climate: "Mountain Mediterranean"
  },
  
  north_lebanon: {
    latitude: 34.4367,
    longitude: 36.0167,
    annualIrradiance: 1650,
    peakSunHours: 4.5,
    monthlyIrradiance: [
      90, 105, 135, 160, 180, 190, 195, 185, 160, 130, 100, 80
    ],
    averageTemp: 19.8,
    climate: "Coastal Mediterranean"
  },
  
  bekaa: {
    latitude: 33.8469,
    longitude: 35.9019,
    annualIrradiance: 1850, // Best solar resource in Lebanon
    peakSunHours: 5.1,
    monthlyIrradiance: [
      110, 125, 160, 185, 210, 220, 225, 215, 185, 155, 120, 100
    ],
    averageTemp: 17.5,
    climate: "Continental semi-arid"
  },
  
  south_lebanon: {
    latitude: 33.2623,
    longitude: 35.2033,
    annualIrradiance: 1720,
    peakSunHours: 4.7,
    monthlyIrradiance: [
      100, 115, 145, 170, 190, 200, 205, 195, 170, 140, 110, 95
    ],
    averageTemp: 21.0,
    climate: "Mediterranean coastal"
  },
  
  akkar: {
    latitude: 34.5331,
    longitude: 36.2167,
    annualIrradiance: 1680,
    peakSunHours: 4.6,
    monthlyIrradiance: [
      95, 110, 140, 165, 185, 195, 200, 190, 165, 135, 105, 85
    ],
    averageTemp: 18.9,
    climate: "Mediterranean"
  },
  
  nabatieh: {
    latitude: 33.3792,
    longitude: 35.4836,
    annualIrradiance: 1730,
    peakSunHours: 4.7,
    monthlyIrradiance: [
      100, 115, 145, 170, 190, 200, 205, 195, 170, 140, 110, 95
    ],
    averageTemp: 20.2,
    climate: "Mediterranean hill"
  },
  
  baalbek_hermel: {
    latitude: 34.0058,
    longitude: 36.2081,
    annualIrradiance: 1800, // Second best after Bekaa
    peakSunHours: 4.9,
    monthlyIrradiance: [
      105, 120, 155, 180, 205, 215, 220, 210, 180, 150, 115, 95
    ],
    averageTemp: 16.8,
    climate: "Continental"
  }
};

// Common Lebanese appliances - User can customize wattage
export const commonAppliances = [
  // Lighting
  { name: 'LED Bulbs', category: 'lighting', defaultWatts: 10, commonRange: '5-25W', hoursPerDay: 6 },
  { name: 'Fluorescent Tubes', category: 'lighting', defaultWatts: 36, commonRange: '18-58W', hoursPerDay: 8 },
  { name: 'Halogen Spotlights', category: 'lighting', defaultWatts: 50, commonRange: '20-100W', hoursPerDay: 4 },
  
  // Cooling & Heating
  { name: 'Split AC Unit', category: 'cooling', defaultWatts: 1500, commonRange: '800-2500W', hoursPerDay: 8 },
  { name: 'Window AC Unit', category: 'cooling', defaultWatts: 1200, commonRange: '600-1800W', hoursPerDay: 6 },
  { name: 'Ceiling Fan', category: 'cooling', defaultWatts: 75, commonRange: '50-150W', hoursPerDay: 12 },
  { name: 'Portable Fan', category: 'cooling', defaultWatts: 50, commonRange: '30-100W', hoursPerDay: 8 },
  { name: 'Electric Heater', category: 'heating', defaultWatts: 2000, commonRange: '1000-3000W', hoursPerDay: 4 },
  
  // Kitchen Appliances
  { name: 'Refrigerator', category: 'appliances', defaultWatts: 150, commonRange: '80-300W', hoursPerDay: 24 },
  { name: 'Freezer', category: 'appliances', defaultWatts: 200, commonRange: '100-400W', hoursPerDay: 24 },
  { name: 'Microwave', category: 'appliances', defaultWatts: 1000, commonRange: '600-1200W', hoursPerDay: 0.5 },
  { name: 'Electric Kettle', category: 'appliances', defaultWatts: 2000, commonRange: '1500-2500W', hoursPerDay: 0.25 },
  { name: 'Toaster', category: 'appliances', defaultWatts: 1200, commonRange: '800-1500W', hoursPerDay: 0.2 },
  { name: 'Dishwasher', category: 'appliances', defaultWatts: 1800, commonRange: '1200-2400W', hoursPerDay: 1 },
  { name: 'Electric Stove', category: 'appliances', defaultWatts: 2500, commonRange: '1500-4000W', hoursPerDay: 1.5 },
  { name: 'Oven', category: 'appliances', defaultWatts: 3000, commonRange: '2000-5000W', hoursPerDay: 1 },
  
  // Laundry
  { name: 'Washing Machine', category: 'appliances', defaultWatts: 2000, commonRange: '300-2500W', hoursPerDay: 1 },
  { name: 'Dryer', category: 'appliances', defaultWatts: 3000, commonRange: '2000-4000W', hoursPerDay: 1 },
  { name: 'Iron', category: 'appliances', defaultWatts: 1500, commonRange: '800-2200W', hoursPerDay: 0.5 },
  
  // Water Systems
  { name: 'Electric Water Heater', category: 'heating', defaultWatts: 3000, commonRange: '1500-6000W', hoursPerDay: 2 },
  { name: 'Water Pump', category: 'pumping', defaultWatts: 1000, commonRange: '500-2000W', hoursPerDay: 1 },
  
  // Electronics & Entertainment
  { name: 'LED TV', category: 'entertainment', defaultWatts: 100, commonRange: '50-200W', hoursPerDay: 6 },
  { name: 'Satellite Receiver', category: 'entertainment', defaultWatts: 25, commonRange: '15-40W', hoursPerDay: 8 },
  { name: 'Sound System', category: 'entertainment', defaultWatts: 150, commonRange: '50-500W', hoursPerDay: 3 },
  { name: 'Desktop Computer', category: 'electronics', defaultWatts: 300, commonRange: '150-800W', hoursPerDay: 8 },
  { name: 'Laptop', category: 'electronics', defaultWatts: 65, commonRange: '30-120W', hoursPerDay: 6 },
  { name: 'Router/Modem', category: 'electronics', defaultWatts: 15, commonRange: '10-30W', hoursPerDay: 24 },
  { name: 'Phone Chargers', category: 'electronics', defaultWatts: 10, commonRange: '5-25W', hoursPerDay: 4 },
  
  // Security & Communication
  { name: 'Security System', category: 'electronics', defaultWatts: 50, commonRange: '20-100W', hoursPerDay: 24 },
  { name: 'Intercom System', category: 'electronics', defaultWatts: 20, commonRange: '10-50W', hoursPerDay: 24 },
  
  // Custom Entry
  { name: 'Custom Appliance', category: 'custom', defaultWatts: 100, commonRange: 'User Defined', hoursPerDay: 4 }
];

// Lebanese governorates/regions for dropdowns
export const lebanonRegions = [
  { value: 'beirut', label: 'Beirut Governorate' },
  { value: 'mount_lebanon', label: 'Mount Lebanon Governorate' },
  { value: 'north_lebanon', label: 'North Lebanon Governorate' },
  { value: 'akkar', label: 'Akkar Governorate' },
  { value: 'bekaa', label: 'Bekaa Governorate' },
  { value: 'baalbek_hermel', label: 'Baalbek-Hermel Governorate' },
  { value: 'nabatieh', label: 'Nabatieh Governorate' },
  { value: 'south_lebanon', label: 'South Lebanon Governorate' },
];

// Utility options in Lebanon with realistic pricing (as of 2024)
export const lebanonUtilities = [
  { 
    value: 'edl_only', 
    label: 'EDL Grid Only',
    description: 'Électricité du Liban - Official grid',
    reliability: '2-8 hours/day (varies by area)',
    costPerKwh: 0.10 // USD (new rates 2024)
  },
  { 
    value: 'edl_and_generator', 
    label: 'EDL Grid + Private Generator',
    description: 'Mixed supply - most common setup',
    reliability: '18-24 hours/day',
    costPerKwh: 0.35 // USD (weighted average)
  },
  { 
    value: 'generator_only', 
    label: 'Private Generator Only',
    description: 'Diesel generator subscription',
    reliability: '24 hours/day',
    costPerKwh: 0.45 // USD (high fuel costs)
  },
];

// Lebanese electrical standards and requirements
export const lebanonElectricalStandards = {
  gridVoltage: 220, // V (single phase)
  gridFrequency: 50, // Hz
  maxDisconnectionTime: 0.4, // seconds for safety
  groundingRequired: true,
  meteringStandard: "kWh",
  installationCode: "Lebanese Electrical Code (based on IEC standards)",
  permitsRequired: ["Building permit", "Electrical permit", "EDL interconnection (if applicable)"]
};

// Solar installation factors specific to Lebanon with realistic pricing
export const lebanonSolarFactors = {
  dustFactor: 0.93, // 7% loss due to dust (updated for Lebanese conditions)
  temperatureFactor: 0.96, // 4% loss due to high temperatures
  inverterEfficiency: 0.94, // Average inverter efficiency
  wiringLosses: 0.97, // 3% DC and AC wiring losses
  shadingFactors: {
    none: 1.0,
    minimal: 0.95, // Morning/evening shading
    partial: 0.85, // 2-3 hours of shading
    significant: 0.70 // 4+ hours of shading
  },
  installationCosts: {
    labor: 0.30, // USD per Watt installed (realistic Lebanese rates)
    permits: 300, // USD flat fee (updated)
    installation: 0.40, // USD per Watt (materials & mounting)
    commissioning: 200 // USD flat fee
  },
  marketFactors: {
    priceVariability: "±15-30%", // Price variation disclaimer
    currencyNote: "Prices in USD. May vary with LBP exchange rate fluctuations",
    availabilityNote: "Equipment availability may vary. Contact local suppliers for current stock",
    warrantyNote: "Warranty terms depend on local distributor agreements"
  }
};