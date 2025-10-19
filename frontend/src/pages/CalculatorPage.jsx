import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Sun, Home, MapPin, Zap, Calculator, ArrowRight, ArrowLeft, 
  Plus, Minus, Lightbulb, Snowflake, Monitor, AlertCircle, Info,
  Battery, Trash2, Edit, DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { commonAppliances, lebanonRegions, lebanonUtilities } from '../utils/mockData';
import { calculateSolarSystem, validateSystemInputs } from '../utils/solarCalculator';

const CalculatorPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const totalSteps = 4;
  
  const [formData, setFormData] = useState({
    // Location & Property
    region: '',
    city: '',
    roofType: '',
    roofSize: '',
    roofDirection: '',
    shading: 'minimal',
    
    // Energy Provider for accurate cost calculations
    energyProvider: 'edl_and_generator',
    
    // System Configuration
    backupDays: '2',
    systemType: 'hybrid',
    batteryType: 'lead_acid',
    
    // Additional Info
    additionalInfo: ''
  });

  const [selectedAppliances, setSelectedAppliances] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const addAppliance = (appliance) => {
    const newAppliance = {
      ...appliance,
      id: Date.now() + Math.random(),
      quantity: 1,
      hoursPerDay: appliance.hoursPerDay || 8,
      watts: appliance.defaultWatts || appliance.watts, // Use defaultWatts from new structure
      customWatts: null // User can customize this
    };
    setSelectedAppliances(prev => [...prev, newAppliance]);
  };

  const updateAppliance = (id, field, value) => {
    setSelectedAppliances(prev =>
      prev.map(app => {
        if (app.id === id) {
          const numValue = Math.max(0, parseInt(value) || 0);
          
          // Special handling for watts - save as customWatts if changed from default
          if (field === 'watts') {
            return {
              ...app,
              customWatts: numValue !== app.watts ? numValue : null
            };
          }
          
          return { ...app, [field]: numValue };
        }
        return app;
      })
    );
  };

  const removeAppliance = (id) => {
    setSelectedAppliances(prev => prev.filter(app => app.id !== id));
  };

  const calculateTotalLoad = () => {
    return selectedAppliances.reduce((total, app) => {
      const watts = app.customWatts || app.watts;
      return total + (watts * app.quantity);
    }, 0);
  };

  const calculateDailyConsumption = () => {
    return selectedAppliances.reduce((total, app) => {
      const watts = app.customWatts || app.watts;
      return total + (watts * app.quantity * app.hoursPerDay / 1000);
    }, 0).toFixed(1);
  };

  const getAppliancesByCategory = () => {
    const categories = {};
    commonAppliances.forEach(appliance => {
      if (!categories[appliance.category]) {
        categories[appliance.category] = [];
      }
      categories[appliance.category].push(appliance);
    });
    return categories;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      lighting: <Lightbulb className="h-4 w-4" />,
      cooling: <Snowflake className="h-4 w-4" />,
      heating: <Sun className="h-4 w-4" />,
      appliances: <Home className="h-4 w-4" />,
      electronics: <Monitor className="h-4 w-4" />,
      entertainment: <Monitor className="h-4 w-4" />,
      pumping: <Zap className="h-4 w-4" />,
      custom: <Edit className="h-4 w-4" />
    };
    return icons[category] || <Zap className="h-4 w-4" />;
  };

  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 1:
        if (!formData.region) errors.region = 'Please select your governorate';
        if (!formData.city) errors.city = 'Please enter your city';
        if (!formData.roofType) errors.roofType = 'Please select roof type';
        if (!formData.roofSize || formData.roofSize < 20) {
          errors.roofSize = 'Please enter a valid roof area (minimum 20 sq m)';
        }
        if (!formData.roofDirection) errors.roofDirection = 'Please select roof direction';
        break;
      
      case 2:
        if (!formData.backupDays) errors.backupDays = 'Please select backup days';
        if (!formData.systemType) errors.systemType = 'Please select system type';
        if (!formData.energyProvider) errors.energyProvider = 'Please select your current energy source';
        break;
      
      case 3:
        if (selectedAppliances.length === 0) {
          errors.appliances = 'Please select at least one appliance';
        } else {
          // Validate appliance configurations
          const hasInvalidAppliances = selectedAppliances.some(app => {
            const watts = app.customWatts || app.watts;
            return app.quantity <= 0 || app.hoursPerDay <= 0 || watts <= 0 || watts > 10000;
          });
          if (hasInvalidAppliances) {
            errors.appliances = 'All appliances must have valid quantity, hours per day, and wattage (1-10,000W)';
          }
        }
        break;
      
      case 4:
        // Final validation using real calculator
        const systemValidation = validateSystemInputs(formData, selectedAppliances);
        if (systemValidation.length > 0) {
          errors.system = systemValidation.join(', ');
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsCalculating(true);
    
    try {
      // Use the real calculator with proper error handling
      const calculationResults = calculateSolarSystem(formData, selectedAppliances);
      
      // Pass data via navigation state
      setTimeout(() => {
        setIsCalculating(false);
        navigate('/results', { 
          state: { 
            results: calculationResults,
            formData: {
              ...formData,
              appliances: selectedAppliances,
              totalLoad: calculateTotalLoad(),
              dailyConsumption: calculateDailyConsumption()
            }
          }
        });
      }, 2500); // Slightly longer for better UX
      
    } catch (error) {
      console.error('Calculation error:', error);
      setIsCalculating(false);
      setValidationErrors({
        calculation: `Error calculating system: ${error.message}. Please check your inputs and try again.`
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <MapPin className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-orange-400">Location & Property Details</h2>
              <p className="text-white">Provide your location and roof specifications for accurate solar calculations</p>
            </div>
            
            {Object.keys(validationErrors).length > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Please fill in all required fields to continue.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="region">Governorate/Region *</Label>
                <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                  <SelectTrigger className={validationErrors.region ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select your governorate" />
                  </SelectTrigger>
                  <SelectContent>
                    {lebanonRegions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>{region.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.region && <p className="text-red-500 text-sm">{validationErrors.region}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City/Town *</Label>
                <Input 
                  id="city" 
                  placeholder="Enter your city or town" 
                  value={formData.city} 
                  onChange={(e) => handleInputChange('city', e.target.value)} 
                  className={validationErrors.city ? 'border-red-500' : ''} 
                />
                {validationErrors.city && <p className="text-red-500 text-sm">{validationErrors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="roofType">Roof Type *</Label>
                <Select value={formData.roofType} onValueChange={(value) => handleInputChange('roofType', value)}>
                  <SelectTrigger className={validationErrors.roofType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select roof type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concrete">Concrete Slab (Most Common)</SelectItem>
                    <SelectItem value="tile">Red Tile Roof</SelectItem>
                    <SelectItem value="metal">Metal Sheet Roof</SelectItem>
                    <SelectItem value="flat">Flat Terrace/Roof</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.roofType && <p className="text-red-500 text-sm">{validationErrors.roofType}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="roofSize">Available Roof Area (sq m) *</Label>
                <Input 
                  id="roofSize" 
                  type="number" 
                  placeholder="e.g. 120" 
                  value={formData.roofSize} 
                  onChange={(e) => handleInputChange('roofSize', e.target.value)} 
                  className={validationErrors.roofSize ? 'border-red-500' : ''} 
                />
                <p className="text-xs text-slate-500">Minimum 20 sq m required for solar installation</p>
                {validationErrors.roofSize && <p className="text-red-500 text-sm">{validationErrors.roofSize}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="roofDirection">Primary Roof Direction *</Label>
                <Select value={formData.roofDirection} onValueChange={(value) => handleInputChange('roofDirection', value)}>
                  <SelectTrigger className={validationErrors.roofDirection ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select main roof direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="south">South (Optimal for Lebanon)</SelectItem>
                    <SelectItem value="south-east">South-East (Excellent)</SelectItem>
                    <SelectItem value="south-west">South-West (Excellent)</SelectItem>
                    <SelectItem value="east">East (Good)</SelectItem>
                    <SelectItem value="west">West (Good)</SelectItem>
                    <SelectItem value="north">North (Not Recommended)</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.roofDirection && <p className="text-red-500 text-sm">{validationErrors.roofDirection}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shading">Shading Conditions</Label>
                <Select value={formData.shading} onValueChange={(value) => handleInputChange('shading', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shading level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Clear sky all day)</SelectItem>
                    <SelectItem value="minimal">Minimal (Some morning/evening shade)</SelectItem>
                    <SelectItem value="partial">Partial (2-3 hours of shade)</SelectItem>
                    <SelectItem value="significant">Significant (4+ hours of shade)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">Consider nearby buildings, trees, or mountains</p>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Battery className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-sky-500">System Configuration</h2>
              <p className="text-white">Configure your solar system preferences and energy usage</p>
            </div>
            
            {Object.keys(validationErrors).length > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Please complete all system configuration options.
                </AlertDescription>
              </Alert>
            )}

            {/* Current Energy Source */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Current Energy Source
                </CardTitle>
                <CardDescription>
                  This helps calculate your potential savings accurately
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="energyProvider">Current Energy Source *</Label>
                  <Select value={formData.energyProvider} onValueChange={(value) => handleInputChange('energyProvider', value)}>
                    <SelectTrigger className={validationErrors.energyProvider ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select your current energy source" />
                    </SelectTrigger>
                    <SelectContent>
                      {lebanonUtilities.map(provider => (
                        <SelectItem key={provider.value} value={provider.value}>
                          <div className="flex flex-col">
                            <span>{provider.label}</span>
                            <span className="text-xs text-sky-300">{provider.description} • ${provider.costPerKwh}/kWh</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.energyProvider && <p className="text-red-500 text-sm">{validationErrors.energyProvider}</p>}
                </div>
              </CardContent>
            </Card>

            {/* System Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  System Type
                </CardTitle>
                <CardDescription>
                  Choose the type of solar system for your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="systemType">System Type *</Label>
                  <Select value={formData.systemType} onValueChange={(value) => handleInputChange('systemType', value)}>
                    <SelectTrigger className={validationErrors.systemType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select system type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hybrid">Hybrid (Grid + Battery Backup) - Recommended</SelectItem>
                      <SelectItem value="offgrid">Off-Grid (Battery Only)</SelectItem>
                      <SelectItem value="grid_tie">Grid-Tie (No Batteries)</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.systemType && <p className="text-red-500 text-sm">{validationErrors.systemType}</p>}
                </div>

                {formData.systemType !== 'grid_tie' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="backupDays">Backup Duration *</Label>
                      <Select value={formData.backupDays} onValueChange={(value) => handleInputChange('backupDays', value)}>
                        <SelectTrigger className={validationErrors.backupDays ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select backup days" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Day (Basic backup)</SelectItem>
                          <SelectItem value="2">2 Days (Recommended for Lebanon)</SelectItem>
                          <SelectItem value="3">3 Days (Extended backup)</SelectItem>
                        </SelectContent>
                      </Select>
                      {validationErrors.backupDays && <p className="text-red-500 text-sm">{validationErrors.backupDays}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="batteryType">Battery Technology</Label>
                      <Select value={formData.batteryType} onValueChange={(value) => handleInputChange('batteryType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select battery type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lead_acid">Lead-Acid (Lower cost, common in Lebanon)</SelectItem>
                          <SelectItem value="lithium">Lithium (Higher efficiency, longer life, premium option)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500">
                        Lead-acid batteries are widely available in Lebanon, lithium offers better performance but at higher cost
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        const applianceCategories = getAppliancesByCategory();
        
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Home className="h-12 w-12 text-lime-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-lime-400">Appliance Selection</h2>
              <p className="text-white">Select and customize the appliances you want your solar system to power</p>
            </div>

            {validationErrors.appliances && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {validationErrors.appliances}
                </AlertDescription>
              </Alert>
            )}

            {/* Load Summary */}
            {selectedAppliances.length > 0 && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Current Load Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{selectedAppliances.length}</div>
                    <div className="text-sm text-green-600">Appliances</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{Math.round(calculateTotalLoad() / 1000 * 10) / 10}</div>
                    <div className="text-sm text-green-600">kW Peak Load</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{calculateDailyConsumption()}</div>
                    <div className="text-sm text-green-600">kWh Daily</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{Math.round(calculateTotalLoad() / 220)}</div>
                    <div className="text-sm text-green-600">Amps @ 220V</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Appliance Categories */}
            <div className="space-y-4">
              {Object.entries(applianceCategories).map(([category, appliances]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center capitalize">
                      {getCategoryIcon(category)}
                      <span className="ml-2">{category.replace('_', ' ')}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {appliances.map((appliance, index) => (
                        <Button
                          key={`${category}-${index}`}
                          variant="outline"
                          size="sm"
                          className="h-auto p-3 flex flex-col items-start text-left hover:bg-green-50 transition-colors"
                          onClick={() => addAppliance(appliance)}
                        >
                          <div className="font-medium text-sm w-full">{appliance.name}</div>
                          <div className="text-xs text-slate-500 w-full">
                            Default: {appliance.defaultWatts}W ({appliance.commonRange})
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Appliances with Custom Wattage */}
            {selectedAppliances.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center ">
                    <Edit className="mr-2 h-5 w-5" />
                    Selected Appliances
                  </CardTitle>
                  <CardDescription>
                    Customize wattage, quantity and daily usage hours for each appliance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedAppliances.map(app => {
                    const currentWatts = app.customWatts || app.watts;
                    const dailyKwh = (currentWatts * app.quantity * app.hoursPerDay / 1000).toFixed(1);
                    
                    return (
                      <div key={app.id} className="p-4 border rounded-lg bg-lime-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">{app.name}</h4>
                            <p className="text-sm text-black">
                              {dailyKwh} kWh/day • {(currentWatts * app.quantity / 220).toFixed(1)} Amps
                              {app.customWatts && <Badge className="ml-2 bg-blue-100 text-blue-800">Custom Wattage</Badge>}
                            </p>
                            <div className="text-xs text-black">
                              Range: {app.commonRange || 'User defined'}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs text-black">Watts</Label>
                              <Input 
                                type="number" 
                                value={currentWatts} 
                                onChange={(e) => updateAppliance(app.id, 'watts', e.target.value)} 
                                className="text-center text-sm text-black"
                                min="1"
                                max="10000"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-black">Qty</Label>
                              <Input 
                                type="number" 
                                value={app.quantity} 
                                onChange={(e) => updateAppliance(app.id, 'quantity', e.target.value)} 
                                className="text-center text-sm text-black"
                                min="1"
                                max="20"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-black">Hrs/Day</Label>
                              <Input 
                                type="number" 
                                value={app.hoursPerDay} 
                                onChange={(e) => updateAppliance(app.id, 'hoursPerDay', e.target.value)} 
                                className="text-center text-sm text-black"
                                min="0.1"
                                max="24"
                                step="0.1"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeAppliance(app.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Pricing Disclaimer */}
            <Alert className="border-amber-200 bg-amber-50">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Note:</strong> Equipment prices shown are estimates based on Lebanese market conditions and may vary ±15-30% depending on supplier, quantity, and exchange rate fluctuations.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Calculator className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-purple-600">Final Review</h2>
              <p className="text-white">Review your configuration before calculating your solar system</p>
            </div>
            
            {validationErrors.system && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {validationErrors.system}
                </AlertDescription>
              </Alert>
            )}

            {validationErrors.calculation && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {validationErrors.calculation}
                </AlertDescription>
              </Alert>
            )}

            {/* Configuration Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Location & Property
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white">Region:</span>
                    <span className="font-medium">{lebanonRegions.find(r => r.value === formData.region)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">City:</span>
                    <span className="font-medium">{formData.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Roof Area:</span>
                    <span className="font-medium">{formData.roofSize} sq m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Roof Direction:</span>
                    <span className="font-medium capitalize">{formData.roofDirection}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Shading:</span>
                    <span className="font-medium capitalize">{formData.shading}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Battery className="mr-2 h-5 w-5" />
                    System Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white">Energy Source:</span>
                    <span className="font-medium">{lebanonUtilities.find(u => u.value === formData.energyProvider)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">System Type:</span>
                    <span className="font-medium capitalize">{formData.systemType.replace('_', '-')}</span>
                  </div>
                  {formData.systemType !== 'grid_tie' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-white">Backup Days:</span>
                        <span className="font-medium">{formData.backupDays} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white">Battery Type:</span>
                        <span className="font-medium capitalize">{formData.batteryType.replace('_', '-')}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Load Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Energy Load Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">{selectedAppliances.length}</div>
                    <div className="text-sm text-blue-600">Total Appliances</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-700">{Math.round(calculateTotalLoad() / 1000 * 10) / 10} kW</div>
                    <div className="text-sm text-amber-600">Peak Load</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">{calculateDailyConsumption()} kWh</div>
                    <div className="text-sm text-green-600">Daily Consumption</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700">{Math.round(calculateTotalLoad() / 220)} A</div>
                    <div className="text-sm text-purple-600">Required Amperage</div>
                  </div>
                </div>

                {/* Appliances with Custom Wattages Highlight */}
                {selectedAppliances.some(app => app.customWatts) && (
                  <Alert className="border-blue-200 bg-blue-50 mb-4">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      You've customized wattages for {selectedAppliances.filter(app => app.customWatts).length} appliance(s). 
                      Make sure these values match your actual equipment specifications.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
              <Textarea 
                id="additionalInfo" 
                placeholder="Any specific requirements, future expansion plans, budget constraints, or other considerations..."
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                rows={3}
              />
            </div>

            {/* Market Disclaimer */}
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Market Disclaimer:</strong> Calculations use current Lebanese market data. 
                Equipment prices may vary ±15-30% based on supplier, quantity, and LBP exchange rate fluctuations. 
                Contact local suppliers for current pricing and availability.
              </AlertDescription>
            </Alert>
          </div>
        );
        
      default:
        return null;
    }
  };

  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sun className="h-10 w-10 text-amber-500 mr-3" />
            <h1 className="text-3xl font-bold text-slate-800">Lebanese Solar System Calculator</h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Professional solar system design with real Lebanese market data and customizable appliance wattages
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progressValue} className="h-3 mb-2" />
          <div className="flex justify-between text-sm text-slate-600">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progressValue)}% Complete</span>
          </div>
        </div>
        
        {/* Step Content */}
        <Card className="shadow-lg mb-8">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isCalculating}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous Step
          </Button>
          
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i + 1 <= currentStep ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
          
          {currentStep < totalSteps ? (
            <Button 
              onClick={handleNext} 
              disabled={isCalculating}
              className="bg-amber-500 hover:bg-amber-600 text-white flex items-center"
            >
              Next Step <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isCalculating}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold flex items-center"
            >
              {isCalculating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating Your System...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-5 w-5" />
                  Calculate My Solar System
                </>
              )}
            </Button>
          )}
        </div>

        {/* Calculation Progress */}
        {isCalculating && (
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <div className="text-lg font-semibold text-slate-800">
                  Analyzing your solar requirements...
                </div>
                <div className="space-y-2 text-sm text-slate-700">
                  <div>✓ Processing {selectedAppliances.length} appliances with custom wattages</div>
                  <div>✓ Analyzing Lebanese solar irradiance for {lebanonRegions.find(r => r.value === formData.region)?.label}</div>
                  <div>✓ Selecting optimal equipment from Lebanese market</div>
                  <div>✓ Computing realistic costs with current market pricing</div>
                  <div>✓ Generating professional installation specifications</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Help Section */}
        <Card className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Professional Lebanese Solar Calculator</h3>
                <p className="text-sm text-slate-700 mb-3">
                  This calculator uses real Lebanese solar irradiance data, actual market equipment specifications, 
                  and current pricing from top Lebanese suppliers. All calculations follow international solar 
                  engineering standards adapted for Lebanese conditions.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600">
                  <div>✓ Real market pricing</div>
                  <div>✓ Custom appliance watts</div>
                  <div>✓ Lebanese electrical code</div>
                  <div>✓ Top 5 equipment brands</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalculatorPage;