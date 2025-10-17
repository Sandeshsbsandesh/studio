'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInUser, signUpUser } from '@/app/login/actions';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Geolocation } from '@capacitor/geolocation';

export default function MobileLogin() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [userType, setUserType] = useState<'customer' | 'provider'>('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const { toast } = useToast();

  const requestLocation = async () => {
    setLocationLoading(true);
    try {
      // Request permissions first
      const permissionStatus = await Geolocation.requestPermissions();
      
      if (permissionStatus.location === 'granted') {
        // Get location
        const position = await Geolocation.getCurrentPosition();
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        toast({
          title: 'Location Captured!',
          description: 'Your location has been successfully recorded.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Permission Denied',
          description: 'Please enable location access in your device settings.',
        });
      }
    } catch (error) {
      console.error('Location error:', error);
      toast({
        variant: 'destructive',
        title: 'Location Error',
        description: 'Could not get your location. Please try again.',
      });
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        // Signup
        if (userType === 'provider' && !location) {
          toast({
            variant: 'destructive',
            title: 'Location Required',
            description: 'Please allow location access for provider signup.',
          });
          setLoading(false);
          return;
        }

        const result = await signUpUser({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          role: userType,
          location: location
        });

        if (result.success && result.user) {
          authLogin(result.user.name, result.user.userType, result.user);
          toast({
            title: 'Welcome!',
            description: 'Account created successfully!',
          });
          
          // Redirect based on user type
          if (result.user.userType === 'provider') {
            router.push('/provider/dashboard');
          } else {
            router.push('/');
          }
        } else {
          toast({
            variant: 'destructive',
            title: 'Signup Failed',
            description: result.error || 'Could not create account.',
          });
        }
      } else {
        // Login
        const result = await signInUser({
          email: formData.email,
          password: formData.password,
        });

        if (result.success && result.user) {
          authLogin(result.user.name, result.user.userType, result.user);
          toast({
            title: 'Welcome Back!',
            description: `Logged in as ${result.user.name}`,
          });
          
          // Redirect based on user type
          if (result.user.userType === 'provider') {
            router.push('/provider/dashboard');
          } else {
            router.push('/');
          }
        } else {
          toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: result.error || 'Invalid credentials.',
          });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <Image src="/logo.png" alt="UrbanEzii" fill className="object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">UrbanEzii</h1>
          <p className="text-gray-600 text-sm mt-2">
            {mode === 'login' ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              mode === 'login'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              mode === 'signup'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Type (Signup only) */}
          {mode === 'signup' && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('customer')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    userType === 'customer'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1">👤</div>
                  <div className="font-medium">Customer</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('provider')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    userType === 'provider'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1">💼</div>
                  <div className="font-medium">Provider</div>
                </button>
              </div>
            </div>
          )}

          {/* Name (Signup only) */}
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none"
            />
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none"
          />

          {/* Phone (Signup only) */}
          {mode === 'signup' && (
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none"
            />
          )}

          {/* Location (Provider Signup only) */}
          {mode === 'signup' && userType === 'provider' && (
            <button
              type="button"
              onClick={requestLocation}
              disabled={locationLoading}
              className={`w-full py-3 rounded-xl font-medium transition-all ${
                location
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : 'bg-blue-50 text-blue-600 border-2 border-blue-200'
              }`}
            >
              {locationLoading ? '⏳ Getting Location...' : location ? '✓ Location Captured' : '📍 Allow Location Access'}
            </button>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? '⏳ Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

