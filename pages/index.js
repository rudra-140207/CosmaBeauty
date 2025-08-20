import { useState } from 'react';
import PackageCard from '../components/PackageCard';
import toast from 'react-hot-toast';

export default function Home() {
  const [concern, setConcern] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!concern.trim()) {
      toast.error('Please enter a concern');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?concern=${encodeURIComponent(concern.trim())}`);
      const data = await res.json();
      
      if (data.concern && data.packages.length > 0) {
        toast.success(`Found ${data.packages.length} packages for "${concern}"`);
      } else {
        toast.error(`No treatments found for "${concern}"`);
      }
      
      setResult(data);
    } catch (error) {
      toast.error('Search failed. Please try again.');
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const predefinedConcerns = ['acne scars', 'dark circles', 'double chin'];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find Your Perfect Beauty Treatment
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Discover personalized treatments from top clinics
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <input
                className="w-full p-4 text-black text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Enter your skin/hair concern (e.g., acne scars, dark circles)..."
                value={concern}
                onChange={e => setConcern(e.target.value)}
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 mr-2">Try:</span>
              {predefinedConcerns.map(suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setConcern(suggestion)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Searching...
                </div>
              ) : (
                'Search Treatments'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="max-w-6xl mx-auto px-4 py-12">
          {result.concern && result.packages.length > 0 ? (
            <div className="space-y-8">
              {/* Treatments Overview */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-blue-500 rounded mr-3"></div>
                  Available Treatments for {result.concern.name}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {result.treatments.map(treatment => (
                    <div key={treatment._id} className="bg-blue-50 p-3 rounded-lg text-center">
                      <span className="text-sm font-medium text-blue-800">{treatment.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Packages */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded mr-3"></div>
                  Treatment Packages ({result.packages.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.packages.map(pkg => (
                    <PackageCard key={pkg._id} pkg={pkg} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-600">
                We could not find any treatments for {concern}. 
                Try one of our suggested concerns or contact us for personalized recommendations.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
