import React from "react";
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  FingerPrintIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon
} from "@heroicons/react/24/outline";

export default function PrivacyPolicy() {
  const policies = [
    {
      title: "तपाईंको जानकारी कसरी संकलन गरिन्छ ?",
      description:
        "तपाईंले हामीलाई प्रदान गरेको जानकारी तेस्रो पक्षसँग संग कदापि शेयर गरिनेछैन, हामी तपाईंको व्यक्तिगत जानकारीलाई तपाईंको सेवा अनुभवलाई अनुकूलन गर्न, तपाईंको प्रोफाइल बनाउन, र तपाईंलाई आवश्यक सम्पत्तिको जानकारी प्रदान गर्नको लागि संकलन गर्छौं। यो जानकारीमा तपाईंको नाम, इमेल ठेगाना, फोन नम्बर, र तपाईंको रुचि भएका सम्पत्तिहरू समावेश हुन सक्छ ।",
      icon: DocumentTextIcon,
      color: "blue"
    },
    {
      title: "हामीले तपाईंको जानकारी कसरी प्रयोग गर्छौं?",
      description:
        "तपाईंले प्रदान गरेको जानकारीलाई हामी तपाईंलाई उपयुक्त सम्पत्तिहरूको सुझाव दिन, मार्केटिंग ईमेलहरू पठाउन, र वेबसाइटको प्रदर्शनलाई सुधार गर्न प्रयोग गर्छौं। तपाईंले हामीलाई प्रदान गरेको जानकारी तेस्रो पक्षसँग साझा गरिँदैन",
      icon: UserIcon,
      color: "indigo"
    },
    {
      title: "कुकीहरू र ट्र्याकिङ टेक्नोलोजी",
      description:
        "हाम्रो वेबसाइटमा तपाईंको अनुभवलाई सुधार गर्न र तपाईंको प्राथमिकतालाई ट्र्याक गर्नका लागि हामी कुकीहरू प्रयोग गर्छौं। कुकीहरूले तपाईंको ब्राउजिङ अनुभवलाई अनुकूलित गर्न र तपाईंलाई पहिचान गर्न मद्दत पुर्‍याउँछ।",
      icon: FingerPrintIcon,
      color: "purple"
    },
    {
      title: "तपाईंको जानकारीको सुरक्षाको लागि हामी के गर्छौं?",
      description:
        "हामी तपाईंको व्यक्तिगत जानकारीलाई सुरक्षित राख्न उच्च स्तरको सुरक्षा प्रविधिहरू प्रयोग गर्छौं। तपाईंको डाटा अनधिकृत पहुँच, परिवर्तन, वा नष्ट हुनबाट सुरक्षित छ।",
      icon: LockClosedIcon,
      color: "green"
    },
    {
      title: "तपाईंको अधिकारहरू",
      description:
        "तपाईंलाई तपाईंको व्यक्तिगत जानकारीमा पहुँच गर्न, सुधार गर्न, वा हटाउन अनुरोध गर्ने अधिकार छ। यदि तपाईंले हामीसँग आफ्नो जानकारीको प्रयोग सम्बन्धी कुनै प्रश्न वा चिन्ता राख्नुहुन्छ भने, कृपया हामीलाई सम्पर्क गर्न नहिचकिचाउनुहोस्।",
      icon: ShieldCheckIcon,
      color: "amber"
    },
    {
      title: "सम्पर्क जानकारी",
      description:
        "यदि तपाईं हाम्रो गोपनीयता नीतिबारे थप जानकारी चाहनुहुन्छ भने, कृपया हामीलाई फोन नम्बर +977 9851-331644 मा सम्पर्क गर्नुहोस्, वा हाम्रो इमेल nepalhomeland100@gmail.com मार्फत सन्देश पठाउन सक्नुहुन्छ।",
      icon: PhoneIcon,
      color: "red"
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>
          <div className="relative">
            <div className="inline-flex items-center justify-center bg-blue-100 text-blue-700 rounded-full px-4 py-1.5 mb-4">
              <ShieldCheckIcon className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">OnlineHome Nepal</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              गोपनीयता <span className="text-blue-600">नीति</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              हामी तपाईंको निजी जानकारीको सुरक्षालाई अत्यन्तै महत्व दिन्छौं र तपाईंको विश्वास कायम राख्न प्रतिबद्ध छौं।
            </p>
          </div>
        </div>

        {/* Policies Section */}
        <div className="grid gap-8 md:grid-cols-2">
          {policies.map((policy, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 group"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`bg-${policy.color}-100 p-3 rounded-lg text-${policy.color}-600`}>
                    <policy.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 ml-4">
                    {policy.title}
                  </h3>
                </div>
                <div className="prose prose-lg max-w-none text-gray-600">
                  <p>{policy.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 bg-blue-600 rounded-xl p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-30 -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full opacity-30 -ml-32 -mb-32"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">हामी तपाईंको गोपनीयताको सम्मान गर्छौं</h3>
            <p className="max-w-2xl mx-auto mb-6">
              हामी तपाईंको व्यक्तिगत जानकारीको संरक्षण गर्न प्रतिबद्ध छौं र त्यसलाई सुरक्षित राख्ने उपायहरू अपनाउँछौं। यदि तपाईंको कुनै प्रश्न छ भने, हामीलाई सम्पर्क गर्न नहिचकिचाउनुहोस्।
            </p>
            <a 
              href="tel:+9779851331644"
              className="inline-flex items-center bg-white text-blue-700 font-medium py-2.5 px-5 rounded-lg hover:bg-blue-50 transition-colors shadow-md"
            >
              <PhoneIcon className="w-5 h-5 mr-2" />
              <span>+977 9851-331644</span>
            </a>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center text-gray-500 mt-8">
          गोपनीयता नीति अन्तिम अपडेट: {new Date().toLocaleDateString('ne-NP')}
        </div>
      </div>
    </div>
  );
}