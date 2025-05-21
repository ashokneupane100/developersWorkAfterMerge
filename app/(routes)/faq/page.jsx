"use client"

import React, { useState } from "react";
import { ChevronDownIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

export default function FAQPage() {
  // State to track which FAQ is open
  const [openIndex, setOpenIndex] = useState(null);

  // Toggle function to open/close FAQs
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "तपाईंहरूको वेबसाइटले के काम गर्छ ?",
      answer:
        "हाम्रो वेबसाइट नेपालमा घरजग्गा किनबेच, कोठा फ्ल्याट, कमर्सियल र कृषियोग्य जमीनहरु भाडामा दिने तथा लिने सम्बन्धी सेवा प्रदान गर्ने डिजिटल प्लेटफर्म हो। तपाईंले हामीमार्फत घरजग्गा, फ्ल्याट, र व्यावसायिक स्थानहरू खोज्न सक्नुहुन्छ।",
    },
    {
      question: "म कोठा वा फ्ल्याट कसरी खोज्न सक्छु?",
      answer:
        "तपाईंले हाम्रो वेबसाइटमा गएर 'कोठा र फ्ल्याट खोजी' खण्डमा गएर तपाईंको बजेट र चाहनाअनुसार कोठा वा फ्ल्याटको विकल्प खोज्न सक्नुहुन्छ। थप जानकारीको लागि हामीलाई सिधै फोन वा इमेल पनि गर्न सक्नुहुन्छ।",
    },
    {
      question: "घर बिक्री तथा खरीदको लागि के कसरी सम्पर्क गर्ने?",
      answer:
        "तपाईंले हामीलाई फोन गरेर वा इमेलमार्फत तपाईंको घर खरीद वा बिक्रीको योजना बारेमा जानकारी गराउन सक्नुहुन्छ। हामी तपाईंको बजेट अनुसारको घर फेला पार्न सहयोग गर्नेछौं।",
    },
    {
      question:
        "के तपाईंहरूले पसल तथा व्यावसायिक स्थानहरू पनि उपलब्ध गराउनुहुन्छ?",
      answer:
        "हो, हामी पसल तथा व्यावसायिक स्थानहरूको खरीद, बिक्री, र भाडा सम्बन्धी सेवा पनि प्रदान गर्छौं। तपाईंको आवश्यकताअनुसार हामीसँग विभिन्न विकल्पहरू छन्।",
    },
    {
      question: "म कृषि वा व्यावसायिक जमिन भाडामा दिन चाहन्छु, के गर्न सकिन्छ?",
      answer:
        "तपाईंले हामीलाई सम्पर्क गरेर आफ्नो कृषि वा व्यावसायिक जमिनको भाडा वा बिक्री सम्बन्धी जानकारी दिन सक्नुहुन्छ। हामी तपाईंलाई उपयुक्त ग्राहक फेला पार्न सहयोग गर्नेछौं।",
    },
    {
      question: "तपाईंहरूको सम्पर्क जानकारी के हो?",
      answer:
        "तपाईंले हामीलाई फोन नम्बर +977 9851-331644 मा सम्पर्क गर्न सक्नुहुन्छ, वा हाम्रो इमेल nepalhomeland100@gmail.com मार्फत सन्देश पठाउन सक्नुहुन्छ।",
    },
    {
      question: "के तपाईंहरूले जागीर र इन्टरनसीप पनि दिनुहुन्छ ?",
      answer:
        "हो हामीले आइटी तथा रियल स्टेट सम्बन्धमा ट्रेनिंग , इन्टरनसीप र जागीरको पनि ब्यबस्था गर्छौं,हामीसंग दुई खाले पोजिसनहरु छन् , एउटा आइटी सम्बन्धित र अर्को non IT सम्बन्धित , non IT को लागि सबैले Apply गर्न सक्नुहुनेछ, IT सम्बन्धित पोजिसनहरुको लागि आइटीको सर्टिफिकेट भन्दा पनि हामी तपाइको Practical Knowledge र तपाइको रुचि बारेमा focus गर्छौं । एक पटक हामीलाई फोन गरेर यो बारेमा बुझ्न सक्नुहुनेछ,पूरा जानकारीको लागि तपाईंले हामीलाई फोन नम्बर +977 9851-331644 मा सम्पर्क गर्न सक्नुहुन्छ, वा हाम्रो इमेल nepalhomeland100@gmail.com मार्फत सन्देश पठाउन सक्नुहुनेछ ।",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <QuestionMarkCircleIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            बारम्बार सोधिने प्रश्नहरू
          </h1>
          <div className="h-1 w-20 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            तपाईंको जिज्ञासाहरूको समाधान यहाँ हेर्नुहोस्
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                className="w-full text-left p-5 flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-gray-800 text-lg">{faq.question}</span>
                <ChevronDownIcon 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`} 
                />
              </button>

              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-5 border-t border-gray-200 bg-gray-50 text-gray-700">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-blue-600 text-white rounded-lg p-6 shadow-md">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">थप प्रश्नहरू भएमा</h2>
            <p className="mb-4">यदि तपाईंको प्रश्नको उत्तर यहाँ पाउनुभएन भने हामीलाई सिधै सम्पर्क गर्नुहोस्</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
              <a 
                href="tel:+9779851331644" 
                className="inline-flex items-center justify-center bg-white text-blue-700 font-medium py-2 px-5 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                फोन गर्नुहोस्
              </a>
              <a 
                href="mailto:nepalhomeland100@gmail.com" 
                className="inline-flex items-center justify-center bg-blue-500 border border-blue-400 text-white font-medium py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                इमेल गर्नुहोस्
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}