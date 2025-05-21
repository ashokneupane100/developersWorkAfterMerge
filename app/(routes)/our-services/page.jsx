import React from "react";
import {
  PhoneIcon,
  EnvelopeIcon,
  HomeIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  ShoppingBagIcon,
  GlobeAltIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

export default function OurServices() {
  // Reusable contact button component
  const ContactButtons = () => (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6 w-full">
      <a 
        href="tel:+9779851331644" 
        className="group bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg inline-flex items-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
      >
        <span className="bg-blue-500 p-1.5 rounded-full mr-2 group-hover:bg-blue-500/80">
          <PhoneIcon className="w-4 h-4" />
        </span>
        +977 9851-331644
      </a>
      <a
        href="mailto:nepalhomeland100@gmail.com"
        className="group bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg inline-flex items-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
      >
        <span className="bg-blue-500 p-1.5 rounded-full mr-2 group-hover:bg-blue-500/80">
          <EnvelopeIcon className="w-4 h-4" />
        </span>
        हामीलाई इमेल गर्नुहोस्
      </a>
    </div>
  );

  // Service data array
  const services = [
    {
      title: "कोठा,फ्ल्याट र पसलको खोजी",
      description: "तपाई यदि कोठा वा फ्ल्याट खोज्दै हुनुहुन्छ भने हामीलाई तुरुन्त फोन वा इमेल सम्पर्क गर्नुहोस। हामी तपाईंको इच्छा वा बजेट अनुरूपको कोठा र फ्ल्याटहरूको लागि विभिन्न विकल्प र छनौटहरु उपलब्ध गर्नेछौं। छिट्टै हामी नेपालका अन्य शहरहरूमा पनि विस्तार हुदैछौं।",
      icon: HomeIcon,
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200"
    },
    {
      title: "घर खरीद तथा बिक्रीको लागि",
      description: "तपाइले सोचे र चाहे अनुसारको घर फेला पार्न हामीलाई फोन सम्पर्क गर्नुहोस। हामी तपाईंको बजेट अनुरूप नेपालका विभिन्न स्थानहरूमा घरहरूको विस्तृत छनौट र विकल्पहरु प्रदान गर्दछौं।",
      icon: BuildingOfficeIcon,
      color: "indigo",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      borderColor: "border-indigo-200"
    },
    {
      title: "जग्गा र प्लटहरू",
      description: "के घडेरी तथा अन्य प्रयोजनको लागि जग्गा खोज्दै हुनुहुन्छ? हामी शहरी क्षेत्रदेखि शान्त बाहिरी क्षेत्रहरूसम्म आवासीय र व्यावसायिक प्लटहरू प्रदान गर्दछौं।",
      icon: MapPinIcon,
      color: "purple",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-200"
    },
    {
      title: "पसल र व्यावसायिक स्थानहरू",
      description: "पसल खरीद बिक्री गर्नु परेपनि हामीलाई सम्पर्क गर्नुहोस, हामीसंग तपाईको रोजाईको लागि धेरै विकल्पहरु रहेका छन्।",
      icon: ShoppingBagIcon,
      color: "orange",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      borderColor: "border-orange-200"
    },
    {
      title: "कृषि वा व्यावसायिक जमिनहरू",
      description: "काम बिशेषले तपाई शहरमा वा बिदेशमा हुनुहुन्छ र तपाईको उर्बर घरबारी बाझो रहेको छ भने हामी त्यसलाई उपयुक्त तरीकाले भाडामा लगाईदिन सक्छौं। नेपालमा धेरै जग्गाहरु बाँझो रहँदै जाने समस्या देखिन थालेको छ। अर्कातिर स्वदेशमा ठुलो स्केलमा कृषि वा अरु उत्पादनमुलक काम गर्न इच्छा राख्नेहरुको जमात पनि बढ्दै गएको छ। यी दुईलाई जोड्ने सम्बन्ध सेतुको रुपमा यो रियल स्टेट प्रोजेक्ट शुरु गरिएको हो ,हाम्रा पिता पुर्खाहरुले रगत पसिना सिंचेर आवादी गरेको जमीन परिस्थितिबश एकातिर बाँझो रहदै जाने अर्कोतिर ठुलो स्केलमा काम गर्न खोज्नेहरुले जमीन नपाउने र देशमा चामल दाल फलफूल तरकारी सागसब्जी जस्ता आधारभूत खाद्यान्न समेत भारतबाट आयात गर्नुपर्ने, यो समस्यालाई दीर्घकालीन रुपले हल गर्ने उदेश्यले हाम्रो टीमले अनवरत रुपमा आफ्नो काम गरिरहेको छ र त्यसको लागि तपाईको ब्यबसायिक साथ् र सहयोगको सदैब अपेक्षा गर्दछ । आफ्नो बाँझो जमीन भाडामा लगाउनुहोस र पैसा प्राप्त गर्नुहोस , हामी त्यसको लागि पुरापुरा सहयोग गर्नेछौं ।",
      icon: GlobeAltIcon,
      color: "green",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 via-white to-blue-50 py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>
          <div className="relative">
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
              OnlineHome Nepal
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              हाम्रा <span className="text-blue-600">सेवाहरू</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              हामी तपाईंलाई आवश्यक पर्ने सम्पूर्ण रियल इस्टेट सेवाहरू प्रदान गर्दछौं
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`rounded-xl border ${service.borderColor} shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group relative`}
            >
              {/* Service Card Header */}
              <div className={`${service.bgColor} p-6`}>
                <div className="flex items-center mb-4">
                  <div className={`bg-white/80 p-3 rounded-lg shadow-sm text-${service.color}-600`}>
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 ml-4">{service.title}</h3>
                </div>

                {/* Service Description */}
                <div className="prose prose-lg max-w-none text-gray-600">
                  <p>{service.description}</p>
                </div>

                {/* Contact Link */}
                <div className="mt-6 flex justify-between items-center border-t border-gray-200 pt-4">
                  <a 
                    href="tel:+9779851331644" 
                    className={`inline-flex items-center ${service.textColor} font-medium group-hover:underline`}
                  >
                    <span>सम्पर्क गर्नुहोस्</span>
                    <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </a>
                  
                  <div className="text-gray-500 text-sm">
                    <PhoneIcon className="w-4 h-4 inline mr-1" />
                    9851-331644
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-10 shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
          
          <div className="relative z-10 md:flex items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                तुरुन्त सम्पर्क गर्नुहोस्
              </h2>
              <p className="text-blue-100 text-lg md:pr-10">
                हामी तपाईको सम्पत्ति सम्बन्धी सबै आवश्यकताहरूको लागि यहाँ छौं। हामीलाई आज नै सम्पर्क गर्नुहोस्।
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href="tel:+9779851331644" 
                className="bg-white text-blue-700 font-medium py-3 px-6 rounded-lg inline-flex items-center justify-center hover:bg-blue-50 transition-colors shadow-md"
              >
                <PhoneIcon className="w-5 h-5 mr-2" />
                <span>+977 9851-331644</span>
              </a>
              <a
                href="mailto:nepalhomeland100@gmail.com"
                className="bg-blue-500 text-white font-medium py-3 px-6 rounded-lg inline-flex items-center justify-center hover:bg-blue-400 transition-colors border border-blue-400"
              >
                <EnvelopeIcon className="w-5 h-5 mr-2" />
                <span>इमेल गर्नुहोस्</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}