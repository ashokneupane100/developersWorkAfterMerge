import React from "react";
import {
  PhoneIcon,
  EnvelopeIcon,
  HomeIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  MapIcon,
  GlobeAsiaAustraliaIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

export default function AboutUs() {
  // Contact buttons component to avoid repetition
  const ContactButtons = () => (
    <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
      <a 
        href="tel:+9779851331644" 
        className="group bg-gradient-to-r from-blue-700 to-blue-800 text-white font-medium py-3 px-5 rounded-lg inline-flex items-center hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:translate-y-[-2px] w-full sm:w-auto justify-center"
      >
        <div className="bg-white/20 p-1.5 rounded-full mr-3 group-hover:bg-white/30 transition-colors">
          <PhoneIcon className="w-4 h-4" />
        </div>
        +977 9851-331644
      </a>
      <a
        href="mailto:nepalhomeland100@gmail.com"
        className="group bg-gradient-to-r from-green-700 to-green-800 text-white font-medium py-3 px-5 rounded-lg inline-flex items-center hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:translate-y-[-2px] w-full sm:w-auto justify-center"
      >
        <div className="bg-white/20 p-1.5 rounded-full mr-3 group-hover:bg-white/30 transition-colors">
          <EnvelopeIcon className="w-4 h-4" />
        </div>
        हामीलाई इमेल गर्नुहोस्
      </a>
    </div>
  );

  const services = [
    {
      title: "कोठा र फ्ल्याट खोजी",
      description: "तपाई यदि कोठा वा फ्ल्याट खोज्दै हुनुहुन्छ भने हामीलाई तुरुन्त फोन वा इमेल सम्पर्क गर्नुहोस। हामी तपाईंको इच्छा वा बजेट अनुरूपको कोठा र फ्ल्याटहरूको लागि विभिन्न विकल्प र छनौटहरु उपलब्ध गर्नेछौं। छिट्टै हामी नेपालका अन्य शहरहरूमा पनि विस्तार हुदैछौं।",
      icon: HomeIcon,
      color: "blue"
    },
    {
      title: "घर खरीद तथा बिक्रीको लागि",
      description: "तपाइले सोचे र चाहे अनुसारको घर फेला पार्न हामीलाई फोन सम्पर्क गर्नुहोस। हामी तपाईंको बजेट अनुरूप नेपालका विभिन्न स्थानहरूमा घरहरूको विस्तृत छनौट र विकल्पहरु प्रदान गर्दछौं।",
      icon: BuildingOfficeIcon,
      color: "indigo"
    },
    {
      title: "जग्गा र प्लटहरू",
      description: "के घडेरी तथा अन्य प्रयोजनको लागि जग्गा खोज्दै हुनुहुन्छ? हामी शहरी क्षेत्रदेखि शान्त बाहिरी क्षेत्रहरूसम्म आवासीय र व्यावसायिक प्लटहरू प्रदान गर्दछौं।",
      icon: MapIcon,
      color: "purple"
    },
    {
      title: "पसल र व्यावसायिक स्थानहरू",
      description: "पसल खरीद बिक्री गर्नु परेपनि हामीलाई सम्पर्क गर्नुहोस, हामीसंग तपाईको रोजाईको लागि धेरै विकल्पहरु रहेका छन्।",
      icon: BuildingStorefrontIcon,
      color: "amber"
    },
    {
      title: "कृषि वा व्यावसायिक जमिनहरू",
      description: "काम बिशेषले तपाई शहरमा वा बिदेशमा हुनुहुन्छ र तपाईको उर्बर घरबारी बाझो रहेको छ भने हामी त्यसलाई उपयुक्त तरीकाले भाडामा लगाईदिन सक्छौं। नेपालमा धेरै जग्गाहरु बाँझो रहँदै जाने समस्या देखिन थालेको छ। अर्कातिर स्वदेशमा ठुलो स्केलमा कृषि वा अरु उत्पादनमुलक काम गर्नु इच्छा राख्नेहरुको जमात पनि बढ्दै गएको छ।",
      icon: GlobeAsiaAustraliaIcon,
      color: "green"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-slate-50 py-16 px-4">
      {/* Hero Section */}
      <div className="container mx-auto max-w-5xl mb-16 relative">
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              हाम्रो बारेमा
            </span>
          </h1>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-blue-100">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              हामी नेपाल स्थित एक रियल इस्टेट कम्पनी हौं, तपाईंलाई तपाईंको रोजाई अनुसारको 
              घरजग्गा किनबेच गर्नको लागि पूर्ण रूपले सहयोग गर्न तथा कोठा फ्ल्याट खोज्न वा 
              भाडामा लगाउनको लागि हामी सम्पूर्ण रुपले समर्पित छौं । तपाईं नयाँ घर, जग्गा, व्यावसायिक पसल, वा कृषि 
              वा उद्योग ब्यबसायको लागि भूमि खोज्दै हुनुहुन्छ भने, हामीसँग तपाईंको सबै 
              आवश्यकताहरू पूरा गर्न विभिन्न प्रकारका प्रपर्टीहरु हामीसंग उपलब्ध छन्।
            </p>
            
            <ContactButtons />
          </div>
        </div>
      </div>

      {/* Message Section */}
      <div className="container mx-auto max-w-5xl mb-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
              घरबेटी र घरधनीहरूलाई सन्देश
            </h2>
            <p className="text-xl text-blue-50 leading-relaxed mb-6">
              कोठा तथा फ्ल्याट, पूरा घरहरू, अपार्टमेन्टहरू, सबै व्यावसायिक र कृषिसंग सम्बन्धित 
              जमिनहरू भाडामा लिने र दिने कुरामा हाम्रो बिशेष अनुभव र बिशेषज्ञता रहेको छ। 
              यदि तपाईंलाई प्रपर्टीहरु भाडामा दिनुपर्ने वा सिधै बेच्नुपर्ने छ भने हामीलाई 
              सिधै कल गर्नुहोस् वा इमेल पठाउनुहोस्। इमेलमा आफ्नो फोन नम्बर राख्न नभुल्नुहोला।
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <a 
                href="tel:+9779851331644" 
                className="group bg-white text-blue-700 font-medium py-3 px-5 rounded-lg inline-flex items-center hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:translate-y-[-2px] w-full sm:w-auto justify-center"
              >
                <div className="bg-blue-100 p-1.5 rounded-full mr-3 group-hover:bg-blue-200 transition-colors">
                  <PhoneIcon className="w-4 h-4 text-blue-700" />
                </div>
                +977 9851-331644
              </a>
              <a
                href="mailto:nepalhomeland100@gmail.com"
                className="group bg-white text-green-700 font-medium py-3 px-5 rounded-lg inline-flex items-center hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:translate-y-[-2px] w-full sm:w-auto justify-center"
              >
                <div className="bg-green-100 p-1.5 rounded-full mr-3 group-hover:bg-green-200 transition-colors">
                  <EnvelopeIcon className="w-4 h-4 text-green-700" />
                </div>
                हामीलाई इमेल गर्नुहोस्
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">
          हाम्रो <span className="text-blue-600">सेवाहरू</span>
        </h2>
        
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group border border-gray-100"
            >
              <div className={`bg-${service.color}-50 p-6`}>
                <div className="flex items-center mb-4">
                  <div className={`bg-${service.color}-100 p-3 rounded-xl text-${service.color}-600 mr-4`}>
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
                </div>
                <p className="text-gray-700 mb-4 text-lg">
                  {service.description}
                </p>
                <div className="pt-4 border-t border-gray-100">
                  <a 
                    href="tel:+9779851331644" 
                    className={`inline-flex items-center text-${service.color}-600 hover:text-${service.color}-800 font-medium group-hover:translate-x-1 transition-transform duration-300`}
                  >
                    <span>सम्पर्क गर्नुहोस्</span>
                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Floating Contact Bar */}
        <div className="mt-12 bg-white rounded-xl shadow-lg border border-blue-100 p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0 text-center sm:text-left">
              <h3 className="text-xl font-bold text-gray-800 mb-1">तुरुन्त सम्पर्क गर्नुहोस्</h3>
              <p className="text-gray-600">हामी तपाईको प्रश्नहरूको जवाफ दिन तत्पर छौं</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href="tel:+9779851331644" 
                className="bg-blue-600 text-white font-medium py-3 px-5 rounded-lg inline-flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <PhoneIcon className="w-4 h-4 mr-2" />
                +977 9851-331644
              </a>
              <a
                href="mailto:nepalhomeland100@gmail.com"
                className="bg-green-600 text-white font-medium py-3 px-5 rounded-lg inline-flex items-center justify-center hover:bg-green-700 transition-colors"
              >
                <EnvelopeIcon className="w-4 h-4 mr-2" />
                इमेल गर्नुहोस्
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}