// Create this file: frontend/src/pages/TestConnection.jsx

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Loader2, Server, Activity } from 'lucide-react';

const TestConnection = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendUrl, setBackendUrl] = useState('http://localhost:8000');

  const testBackend = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('🔄 Testing connection to FastAPI backend...');
      
      const response = await fetch(`${backendUrl}/api/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Success! Data received:', data);
        setResult({
          success: true,
          message: '✅ Backend is connected and working!',
          data: data,
          status: response.status,
          url: `${backendUrl}/api/`
        });
      } else {
        console.log('❌ Response not OK:', response.statusText);
        setResult({
          success: false,
          message: `❌ Backend error: ${response.status} ${response.statusText}`,
          status: response.status,
          url: `${backendUrl}/api/`
        });
      }
    } catch (error) {
      console.error('❌ Connection error:', error);
      setResult({
        success: false,
        message: '❌ Cannot connect to backend',
        error: error.message,
        url: `${backendUrl}/api/`,
        possibleReasons: [
          'Backend server is not running',
          'Run: uvicorn server:app --reload --port 8000',
          'CORS not configured properly',
          'Wrong port number (check if using 8000)',
          'Firewall blocking connection'
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const testHealthEndpoint = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('🔄 Testing /api/health endpoint...');
      
      const response = await fetch(`${backendUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Health endpoint works! Data:', data);
        setResult({
          success: true,
          message: '✅ Health check passed!',
          data: data,
          status: response.status,
          url: `${backendUrl}/api/health`
        });
      } else {
        setResult({
          success: false,
          message: `❌ Health endpoint error: ${response.status}`,
          status: response.status,
          url: `${backendUrl}/api/health`
        });
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setResult({
        success: false,
        message: '❌ Cannot reach health endpoint',
        error: error.message,
        url: `${backendUrl}/api/health`
      });
    } finally {
      setLoading(false);
    }
  };

  const testCalculateEndpoint = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('🔄 Testing POST to /api/calculate...');
      
      const testData = {
        region: 'beirut',
        city: 'Beirut',
        systemType: 'off_grid',
        roofSize: 50,
        roofDirection: 'south',
        shading: 'minimal',
        backupDays: 2,
        batteryType: 'lead_acid',
        appliances: [
          {
            name: 'LED Light',
            watts: 10,
            quantity: 5,
            hoursPerDay: 6,
            category: 'lighting'
          },
          {
            name: 'Refrigerator',
            watts: 150,
            quantity: 1,
            hoursPerDay: 24,
            category: 'appliances'
          }
        ]
      };

      const response = await fetch(`${backendUrl}/api/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ POST successful! Data:', data);
        setResult({
          success: true,
          message: '✅ Solar calculation works!',
          data: data,
          status: response.status,
          url: `${backendUrl}/api/calculate`,
          method: 'POST'
        });
      } else {
        const errorText = await response.text();
        setResult({
          success: false,
          message: `❌ POST failed: ${response.status}`,
          status: response.status,
          error: errorText,
          url: `${backendUrl}/api/calculate`
        });
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setResult({
        success: false,
        message: '❌ POST request failed',
        error: error.message,
        url: `${backendUrl}/api/calculate`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 border-2 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <CardTitle className="flex items-center text-2xl">
              <Server className="mr-3 h-8 w-8" />
              FastAPI Backend Connection Test
            </CardTitle>
            <p className="text-blue-100 mt-2">Test your backend connection and API endpoints</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backend URL:
              </label>
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="http://localhost:8000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Make sure your backend is running on this URL
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={testBackend}
                disabled={loading}
                className="w-full h-auto py-4 bg-blue-600 hover:bg-blue-700 flex flex-col items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    <span className="text-sm">Testing...</span>
                  </>
                ) : (
                  <>
                    <Server className="h-6 w-6 mb-2" />
                    <span className="font-semibold">Test Root</span>
                    <span className="text-xs opacity-90">GET /api/</span>
                  </>
                )}
              </Button>

              <Button
                onClick={testHealthEndpoint}
                disabled={loading}
                className="w-full h-auto py-4 bg-green-600 hover:bg-green-700 flex flex-col items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    <span className="text-sm">Testing...</span>
                  </>
                ) : (
                  <>
                    <Activity className="h-6 w-6 mb-2" />
                    <span className="font-semibold">Health Check</span>
                    <span className="text-xs opacity-90">GET /api/health</span>
                  </>
                )}
              </Button>

              <Button
                onClick={testCalculateEndpoint}
                disabled={loading}
                className="w-full h-auto py-4 bg-purple-600 hover:bg-purple-700 flex flex-col items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    <span className="text-sm">Testing...</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-6 w-6 mb-2" />
                    <span className="font-semibold">Calculate</span>
                    <span className="text-xs opacity-90">POST /api/calculate</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className={`border-2 shadow-lg ${result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                {result.success ? (
                  <>
                    <CheckCircle className="mr-2 h-6 w-6" />
                    {result.message}
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-6 w-6" />
                    {result.message}
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm bg-white p-4 rounded-lg">
                <div>
                  <strong className="text-gray-700">URL:</strong> 
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded ml-2 block mt-1 break-all">
                    {result.url}
                  </code>
                </div>
                {result.status && (
                  <div>
                    <strong className="text-gray-700">Status:</strong> 
                    <span className={`ml-2 font-mono ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                      {result.status}
                    </span>
                  </div>
                )}
                {result.method && (
                  <div>
                    <strong className="text-gray-700">Method:</strong> 
                    <span className="ml-2 text-purple-600 font-semibold">{result.method}</span>
                  </div>
                )}
              </div>

              {result.data && (
                <div className="bg-white p-4 rounded-lg">
                  <strong className="block mb-2 text-gray-700">Response Data:</strong>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-xs max-h-96">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}

              {result.error && (
                <Alert className="bg-red-100 border-red-400">
                  <AlertDescription className="text-red-800">
                    <strong>Error:</strong> {result.error}
                  </AlertDescription>
                </Alert>
              )}

              {result.possibleReasons && (
                <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-300">
                  <strong className="text-amber-900 mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Possible Reasons:
                  </strong>
                  <ul className="list-disc pl-5 space-y-1 text-amber-800">
                    {result.possibleReasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
              Setup Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                  1
                </div>
                <div className="flex-1">
                  <strong className="block mb-1">Start Backend:</strong>
                  <code className="block bg-gray-900 text-green-400 px-3 py-2 rounded text-xs">
                    cd backend<br/>
                    uvicorn server:app --reload --host 0.0.0.0 --port 8000
                  </code>
                </div>
              </div>
              
              <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                  2
                </div>
                <div className="flex-1">
                  <strong className="block mb-1">Check MongoDB:</strong>
                  <span className="text-gray-600">Make sure your .env file has correct MONGO_URL</span>
                </div>
              </div>
              
              <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-3">
                  ✓
                </div>
                <div className="flex-1">
                  <strong className="block mb-1">CORS Configured:</strong>
                  <span className="text-gray-600">Already set up in your server.py ✅</span>
                </div>
              </div>
              
              <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                  3
                </div>
                <div className="flex-1">
                  <strong className="block mb-1">API Documentation:</strong>
                  <a 
                    href="http://localhost:8000/docs" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Visit http://localhost:8000/docs
                  </a>
                  <span className="text-gray-600 block mt-1">
                    Interactive API documentation with test interface
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button
            onClick={() => window.location.href = '/calculator'}
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3"
          >
            Go to Solar Calculator →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestConnection;