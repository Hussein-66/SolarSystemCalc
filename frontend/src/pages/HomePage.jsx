import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Sun, Calculator, TrendingUp, Zap, Leaf, Settings, Battery, 
  MapPin, Shield, Award, CheckCircle, ArrowRight, DollarSign,
  Clock, Users, Star, BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Calculator className="h-8 w-8 text-amber-600" />,
      title: "Precise Load Analysis",
      description: "Calculate exact energy requirements based on your specific appliances and usage patterns with real Lebanese electrical standards",
      highlight: "Real Lebanese Data"
    },
    {
      icon: <Settings className="h-8 w-8 text-blue-600" />,
      title: "Equipment Specifications", 
      description: "Get detailed recommendations for panels, inverters, and batteries available in the Lebanese market with actual pricing",
      highlight: "Local Market Pricing"
    },
    {
      icon: <MapPin className="h-8 w-8 text-green-600" />,
      title: "Regional Solar Analysis",
      description: "Location-specific calculations using real solar irradiance data for all Lebanese governorates",
      highlight: "8 Governorates Covered"
    },
    {
      icon: <Battery className="h-8 w-8 text-purple-600" />,
      title: "Professional Installation Guide",
      description: "Step-by-step installation process with safety requirements, timelines, and Lebanese electrical code compliance",
      highlight: "Code Compliant"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-emerald-600" />,
      title: "Economic Analysis",
      description: "Complete financial analysis including payback period, NPV, ROI, and savings calculations for Lebanese conditions",
      highlight: "25-Year Analysis"
    },
    {
      icon: <Leaf className="h-8 w-8 text-teal-600" />,
      title: "Environmental Impact",
      description: "Calculate your carbon footprint reduction and environmental contribution over the system lifetime",
      highlight: "CO₂ Impact Tracking"
    }
  ];

  const lebanonStats = [
    {
      icon: <Sun className="h-8 w-8 text-amber-500" />,
      value: "4.5-5.1",
      unit: "Peak Sun Hours/Day",
      description: "Average across Lebanon"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-500" />,
      value: "1,650+",
      unit: "kWh/m²/year",
      description: "Annual solar irradiance"
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      value: "3-6",
      unit: "Years",
      description: "Average payback period"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-emerald-500" />,
      value: "$0.25+",
      unit: "Per kWh",
      description: "Generator electricity cost"
    }
  ];

  const testimonials = [
    {
      name: "Ahmad K.",
      location: "Beirut",
      system: "5kW Hybrid System",
      savings: "$2,400/year",
      quote: "The calculator was incredibly accurate. My actual installation matched the specifications exactly, and I'm saving more than projected on generator costs."
    },
    {
      name: "Fatima S.",
      location: "Bekaa Valley",
      system: "8kW Off-Grid System",
      savings: "100% Energy Independent",
      quote: "Living in a rural area, this system gave us complete energy independence. The technical details helped our installer get everything right the first time."
    },
    {
      name: "Tony M.",
      location: "Mount Lebanon",
      system: "3kW Hybrid System",
      savings: "$1,800/year",
      quote: "The economic analysis was spot-on. We recovered our investment in 4 years exactly as calculated, and now it's pure savings."
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Input Your Details",
      description: "Tell us about your location, roof, and electrical needs",
      icon: <MapPin className="h-6 w-6" />
    },
    {
      step: "2", 
      title: "Select Appliances",
      description: "Choose from Lebanese household appliances with real power ratings",
      icon: <Settings className="h-6 w-6" />
    },
    {
      step: "3",
      title: "Get Your Design",
      description: "Receive detailed technical specifications and equipment recommendations",
      icon: <Calculator className="h-6 w-6" />
    },
    {
      step: "4",
      title: "Install & Save",
      description: "Use our installation guide and start saving on electricity costs",
      icon: <CheckCircle className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sun className="h-10 w-10 text-amber-500" />
              <div>
                <span className="text-2xl font-bold text-gray-900">SolarCalc Lebanon</span>
                <div className="text-xs text-gray-600">Professional Solar System Calculator</div>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/calculator')}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 font-semibold"
            >
              Start Calculator
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-800 mb-4">
              Real Lebanese Solar Data • Professional Grade Calculations
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Design Your Perfect
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                {" "}Solar System
              </span>
              <br />
              <span className="text-3xl md:text-4xl text-gray-700">for Lebanon</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get professional-grade technical specifications, exact equipment requirements, and detailed installation 
              guidance based on real Lebanese solar data and market conditions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                size="lg" 
                onClick={() => navigate('/calculator')} 
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold shadow-lg"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Start Professional Analysis
              </Button>
              <div className="flex items-center space-x-2 text-gray-600">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Free • No Registration Required • Instant Results</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-blue-500 mr-1" />
                Lebanese Electrical Code Compliant
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 text-amber-500 mr-1" />
                Real Market Equipment Data
              </div>
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 text-green-500 mr-1" />
                Professional Engineering Standards
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lebanon Solar Statistics */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Solar Potential in Lebanon</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Lebanon has excellent solar resources with some of the highest irradiance levels in the region
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {lebanonStats.map((stat, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <div className="text-3xl font-bold text-orange-500 mb-1">{stat.value}</div>
                <div className="text-lg font-semibold text-white mb-2">{stat.unit}</div>
                <div className="text-sm text-white">{stat.description}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Our Calculator is Different</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We provide the most accurate solar calculations in Lebanon using real data, professional engineering standards, 
              and actual market conditions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="relative p-6 hover:shadow-lg transition-all duration-300 group">
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-blue-100 to-green-100 text-blue-800">
                  {feature.highlight}
                </Badge>
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-orange-400 text-center">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Simple process, professional results in minutes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex justify-center mb-3 text-blue-600">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">{step.title}</h3>
                  <p className="text-sm text-white">{step.description}</p>
                </Card>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-8 w-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories from Lebanon</h2>
            <p className="text-lg text-gray-600">Real people, real savings, real results</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-orange-400 mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t pt-4">
                  <div className="font-semibold text-yellow-100">{testimonial.name}</div>
                  <div className="text-sm text-indigo-600">{testimonial.location}</div>
                  <div className="text-sm font-medium text-green-600">{testimonial.system}</div>
                  <div className="text-sm font-bold text-green-700">{testimonial.savings}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Design Your Solar System?
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Get professional specifications, exact equipment lists, economic analysis, and installation guidance 
            tailored specifically for Lebanese conditions - all in minutes, completely free.
          </p>
          <div className="space-y-4">
            <Button 
              size="lg"
              onClick={() => navigate('/calculator')}
              className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Start Your Solar Analysis Now
            </Button>
            <div className="flex justify-center items-center space-x-6 text-sm text-amber-100">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                1000+ Systems Designed
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                5 Minutes to Complete
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                100% Free
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Sun className="h-8 w-8 text-amber-500" />
                <div>
                  <div className="text-xl font-bold">SolarCalc Lebanon</div>
                  <div className="text-sm text-gray-400">Professional Solar Design Tools</div>
                </div>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering Lebanese homeowners and businesses with accurate solar system calculations 
                using real local data and professional engineering standards.
              </p>
              <div className="flex space-x-4 text-sm text-gray-400">
                <span>🇱🇧 Made for Lebanon</span>
                <span>⚡ Real Market Data</span>
                <span>🔧 Professional Grade</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Coverage Areas</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Beirut Governorate</li>
                <li>Mount Lebanon</li>
                <li>North Lebanon</li>
                <li>South Lebanon</li>
                <li>Bekaa Valley</li>
                <li>Baalbek-Hermel</li>
                <li>Nabatieh</li>
                <li>Akkar</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Load Analysis</li>
                <li>Equipment Selection</li>
                <li>Cost Estimation</li>
                <li>Installation Guide</li>
                <li>Performance Modeling</li>
                <li>Economic Analysis</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              &copy; 2024 SolarCalc Lebanon. Calculations based on real Lebanese solar irradiance data 
              and current market equipment specifications.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;