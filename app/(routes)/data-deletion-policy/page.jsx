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
  // Policy data with icons
  const policies = [
    {
      title: "तपाईंको जानकारी कसरी संकलन गरिन्छ ?",
      description:
        "तपाईंले हामीलाई प्रदान गरेको जानकारी तेस्रो पक्षसँग संग कदापि शेयर गरिनेछैन, हामी तपाईंको व्यक्तिगत जानकारीलाई तपाईंको सेवा अनुभवलाई अनुकूलन गर्न, तपाईंको प्रोफाइल बनाउन, र तपाईंलाई आवश्यक सम्पत्तिको जानकारी प्रदान गर्नको लागि संकलन गर्छौं। यो जानकारीमा तपाईंको नाम, इमेल ठेगाना, फोन नम्बर, र तपाईंको रुचि भएका सम्पत्तिहरू समावेश हुन सक्छ ।",
      icon: DocumentTextIcon,
    },
    {
      title: "हामीले तपाईंको जानकारी कसरी प्रयोग गर्छौं?",
      description:
        "तपाईंले प्रदान गरेको जानकारीलाई हामी तपाईंलाई उपयुक्त सम्पत्तिहरूको सुझाव दिन, मार्केटिंग ईमेलहरू पठाउन, र वेबसाइटको प्रदर्शनलाई सुधार गर्न प्रयोग गर्छौं। तपाईंले हामीलाई प्रदान गरेको जानकारी तेस्रो पक्षसँग साझा गरिँदैन",
      icon: UserIcon,
    },
    {
      title: "कुकीहरू र ट्र्याकिङ टेक्नोलोजी",
      description:
        "हाम्रो वेबसाइटमा तपाईंको अनुभवलाई सुधार गर्न र तपाईंको प्राथमिकतालाई ट्र्याक गर्नका लागि हामी कुकीहरू प्रयोग गर्छौं। कुकीहरूले तपाईंको ब्राउजिङ अनुभवलाई अनुकूलित गर्न र तपाईंलाई पहिचान गर्न मद्दत पुर्‍याउँछ।",
      icon: FingerPrintIcon,
    },
    {
      title: "तपाईंको जानकारीको सुरक्षाको लागि हामी के गर्छौं?",
      description:
        "हामी तपाईंको व्यक्तिगत जानकारीलाई सुरक्षित राख्न उच्च स्तरको सुरक्षा प्रविधिहरू प्रयोग गर्छौं। तपाईंको डाटा अनधिकृत पहुँच, परिवर्तन, वा नष्ट हुनबाट सुरक्षित छ।",
      icon: LockClosedIcon,
    },
    {
      title: "तपाईंको अधिकारहरू",
      description:
        "तपाईंलाई तपाईंको व्यक्तिगत जानकारीमा पहुँच गर्न, सुधार गर्न, वा हटाउन अनुरोध गर्ने अधिकार छ। यदि तपाईंले हामीसँग आफ्नो जानकारीको प्रयोग सम्बन्धी कुनै प्रश्न वा चिन्ता राख्नुहुन्छ भने, कृपया हामीलाई सम्पर्क गर्न नहिचकिचाउनुहोस्।",
      icon: ShieldCheckIcon,
    },
    {
      title: "सम्पर्क जानकारी",
      description:
        "यदि तपाईं हाम्रो गोपनीयता नीतिबारे थप जानकारी चाहनुहुन्छ भने, कृपया हामीलाई फोन नम्बर +977 9851-331644 मा सम्पर्क गर्नुहोस्, वा हाम्रो इमेल nepalhomeland100@gmail.com मार्फत सन्देश पठाउन सक्नुहुन्छ।",
      icon: PhoneIcon,
    },
  ];

  return (
    <div className="bg-white py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            गोपनीयता नीति
          </h1>
          <div className="h-1 w-20 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            हामी तपाईंको गोपनीयता र सुरक्षालाई महत्व दिन्छौं
          </p>
        </div>

        {/* Policies List */}
        <div className="space-y-6">
          {policies.map((policy, index) => (
            <div 
              key={index} 
              className="border-b border-gray-200 pb-6 last:border-b-0"
            >
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mr-4 mt-1.5 flex-shrink-0">
                  <policy.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {policy.title}
                  </h3>
                  <p className="text-gray-600">
                    {policy.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Box */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">थप प्रश्नहरू छन्?</h3>
              <p className="text-gray-600">
                हामीलाई फोन वा इमेल मार्फत सम्पर्क गर्नुहोस्
              </p>
            </div>
            <div className="flex gap-4">
              <a 
                href="tel:+9779851331644" 
                className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors"
              >
                <PhoneIcon className="w-4 h-4 mr-2" />
                +977 9851-331644
              </a>
              <a 
                href="mailto:nepalhomeland100@gmail.com" 
                className="inline-flex items-center justify-center bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded font-medium hover:bg-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                इमेल
              </a>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center text-gray-500 mt-8 text-sm">
          अन्तिम अपडेट: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}