import { Home, Search, Plus, Mail } from "lucide-react";

export default function CTASection() {
  return (
    <section className="w-full h-auto bg-gradient-to-br from-green-50 to-green-100 px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-screen-xl w-full mx-auto text-center">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center mb-8">
          <Home className="h-8 w-8 text-green-600 mr-2" />
          <h1 className="text-2xl font-bold text-green-800">OnlineHome.com.np</h1>
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 mb-4 leading-tight">
          Find Your Dream Home in Nepal
        </h2>
        <h3 className="text-2xl md:text-3xl font-semibold text-green-800 mb-6 leading-tight">
          नेपालमा आफ्नो सपनाको घर खोज्नुहोस्
        </h3>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-green-700 mb-2 max-w-3xl mx-auto leading-relaxed">
          Discover thousands of properties across Nepal. Whether you're buying, selling, or renting, we make your
          property journey simple and secure.
        </p>
        <p className="text-base md:text-lg text-green-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          नेपालभरका हजारौं सम्पत्तिहरू पत्ता लगाउनुहोस्। किन्न, बेच्न वा भाडामा लिन - हामी तपाईंको सम्पत्ति यात्रालाई सजिलो र सुरक्षित
          बनाउँछौं।
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 w-full sm:w-auto">
            <Search className="h-5 w-5" />
            <span className="flex flex-col items-center">
              <span>Search Properties</span>
              <span className="text-sm opacity-90">सम्पत्ति खोज्नुहोस्</span>
            </span>
          </button>

          <button className="bg-white hover:bg-green-50 text-green-600 font-semibold py-4 px-8 rounded-lg shadow-lg border-2 border-green-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 w-full sm:w-auto">
            <Plus className="h-5 w-5" />
            <span className="flex flex-col items-center">
              <span>List Your Property</span>
              <span className="text-sm opacity-90">सम्पत्ति सूचीबद्ध गर्नुहोस्</span>
            </span>
          </button>
        </div>

        {/* Email Signup */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-green-200 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Get Property Alerts</h3>
          <h4 className="text-lg font-medium text-green-700 mb-4">सम्पत्ति अलर्ट प्राप्त गर्नुहोस्</h4>
          <p className="text-green-600 mb-2">Be the first to know about new properties that match your preferences</p>
          <p className="text-green-600 mb-6 text-sm">तपाईंको मनपर्ने नयाँ सम्पत्तिहरूको बारेमा पहिले जान्नुहोस्</p>

          <form className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              <input
                type="email"
                placeholder="Enter your email address / इमेल ठेगाना"
                className="w-full pl-10 pr-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 whitespace-nowrap flex flex-col items-center"
            >
              <span>Subscribe</span>
              <span className="text-xs opacity-90">सदस्यता</span>
            </button>
          </form>

          <p className="text-sm text-green-600 mt-4">Join 10,000+ property seekers who trust OnlineHome.com.np</p>
          <p className="text-xs text-green-600">
            OnlineHome.com.np मा भरोसा गर्ने १०,००० भन्दा बढी सम्पत्ति खोजकर्ताहरूसँग सामेल हुनुहोस्
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-green-600">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-800">5000+</div>
            <div className="text-sm">Properties Listed</div>
            <div className="text-xs text-green-600">सूचीबद्ध सम्पत्ति</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-800">1000+</div>
            <div className="text-sm">Happy Customers</div>
            <div className="text-xs text-green-600">खुसी ग्राहकहरू</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-800">50+</div>
            <div className="text-sm">Cities Covered</div>
            <div className="text-xs text-green-600">शहरहरू समेटिएको</div>
          </div>
        </div>
      </div>
    </section>
  );
}
