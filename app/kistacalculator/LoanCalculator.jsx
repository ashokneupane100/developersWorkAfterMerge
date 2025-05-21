'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  CalculatorIcon, 
  ChatBubbleLeftRightIcon, 
  HomeIcon, 
  CurrencyRupeeIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ShareIcon
} from "@heroicons/react/24/outline";
import { 
  ShareIcon as ShareIconSolid 
} from "@heroicons/react/24/solid";
import CustomSlider from "@/components/helpers/CustomSlider";
import { formatCurrency } from "@/components/helpers/formatCurrency";
import Image from "next/image";

const LoanCalculator = () => {
  const [propertyValue, setPropertyValue] = useState(10000000);
  const [displayValue, setDisplayValue] = useState("10000000");
  const [downPaymentPercent, setDownPaymentPercent] = useState(57);
  const [interestRate, setInterestRate] = useState(11.5);
  const [loanTerm, setLoanTerm] = useState(21);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [downPaymentAmount, setDownPaymentAmount] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [shareExpanded, setShareExpanded] = useState(false);

  useEffect(() => {
    calculateLoan();
  }, [displayValue, downPaymentPercent, interestRate, loanTerm]);

  const handlePropertyValueChange = (e) => {
    const value = e.target.value;
    const numValue = value.replace(/[^0-9]/g, "");
    setPropertyValue(numValue || '');
    setDisplayValue(numValue || '');
  };

  const handlePropertyValueBlur = () => {
    if (!propertyValue) {
      setPropertyValue("10000000");
      setDisplayValue("10000000");
    }
  };

  const calculateLoan = () => {
    try {
      const numericValue = Number(displayValue);
      const down = (numericValue * downPaymentPercent) / 100;
      const principal = numericValue - down;
      const monthlyRate = (interestRate / 100) / 12;
      const numberOfPayments = loanTerm * 12;
      
      const monthlyPmt = principal * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

      const totalPaid = monthlyPmt * numberOfPayments;
      const totalInt = totalPaid - principal;

      setMonthlyPayment(isNaN(monthlyPmt) ? 0 : Number(monthlyPmt.toFixed(2)));
      setTotalInterest(isNaN(totalInt) ? 0 : Number(totalInt.toFixed(2)));
      setDownPaymentAmount(Number(down.toFixed(2)));
      setLoanAmount(Number(principal.toFixed(2)));
      setTotalPayment(isNaN(totalPaid) ? 0 : Number(totalPaid.toFixed(2)));
    } catch (error) {
      console.error('Calculation error:', error);
      setMonthlyPayment(0);
      setTotalInterest(0);
      setDownPaymentAmount(0);
      setLoanAmount(0);
      setTotalPayment(0);
    }
  };

  const getShareableUrl = () => {
    const baseUrl = "https://www.onlinehome.com.np/kistacalculator";
    const fbParam = "fbclid=IwZXh0bgNhZW0CMTEAAR1t5SLa0XmCWSSIi9cYyZg2uAIZbBNjkkdnAKEyB6OQBpp0tX6OY1-ExYg_aem_PG969GVLvh7vTE5KnBDjnw";
    return `${baseUrl}?${fbParam}`;
  };

  const handleFacebookShare = () => {
    const url = getShareableUrl();
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleTwitterShare = () => {
    const url = getShareableUrl();
    const text = "सजिलैसंग घर गाडीको किस्ता पत्ता लगाउनुहोस | Calculate your monthly EMI instantly!";
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleLinkedInShare = () => {
    const url = getShareableUrl();
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            <span className="text-blue-600">Home Loan</span> Calculator
          </h1>
          <p className="text-gray-600 text-lg">एक मिनेटमा नै घरको मासिक किस्ता पत्ता लगाउनुहोस</p>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Testimonial/Quote Card */}
            <div className="relative bg-white p-6 rounded-2xl shadow-md border border-blue-200 backdrop-blur-sm">
              <div className="absolute -top-3 -right-3 bg-blue-500 rounded-full p-2.5 shadow-lg">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-blue-700 mb-3">
                "मेरो मासिक आम्दानी Rs. 40,000 छ र जमीन बेच्दा १ करोड आउँछ... "
              </h2>
              <p className="text-lg text-gray-700">
                के म यो घर वा कार किन्न सक्छु? मासिक किस्ता कति पर्छ ?
              </p>
            </div>

            {/* Image Card */}
            <div className="hidden md:block relative h-[420px] w-full rounded-2xl overflow-hidden group">
              <Image 
                src="/kistaCalculator.jpg" 
                alt="Dream Home and Car" 
                fill
                className="object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-blue-900/50 to-transparent flex flex-col justify-end p-6">
                <HomeIcon className="w-10 h-10 text-yellow-400 mb-3" />
                <p className="text-2xl font-bold text-white mb-2">
                  बिश्वासिलो र सजिलो किस्ता क्यालकुलेटर
                </p>
                <p className="text-blue-200">
                  घरजग्गामा लगानी = सुरक्षित भबिष्य
                </p>
              </div>
            </div>
            
            {/* Additional Info Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                <ArrowTrendingUpIcon className="w-5 h-5 text-green-600 mr-2" />
                Loan Calculator Benefits
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Compare different loan scenarios instantly
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  See how down payment affects monthly payments
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Understand the total cost of your loan over time
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Make informed decisions about property investments
                </li>
              </ul>
            </div>
          </div>
          
          {/* Right Column - Calculator */}
          <div className="lg:col-span-3">
            <Card className="border shadow-lg bg-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 py-4 space-y-3 border-b border-blue-200">
                <div className="flex items-center justify-center">
                  <CalculatorIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <CardTitle className="text-2xl font-bold text-blue-700">
                      onlinehome.com.np
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      बिश्वासको बलियो जगमा आधारित
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-5">
                  {/* Property Value */}
                  <div className="md:col-span-2">
                    <div className="flex items-center mb-2">
                      <CurrencyRupeeIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <label className="text-gray-700 font-medium">
                        Property Value (Rs)
                      </label>
                    </div>
                    <Input
                      value={displayValue}
                      onChange={handlePropertyValueChange}
                      onBlur={handlePropertyValueBlur}
                      className="h-12 bg-gray-50 border-gray-300 text-gray-900 font-medium hover:border-blue-400 focus:border-blue-500"
                      placeholder="Enter Property Value"
                    />
                    <p className="text-sm text-blue-600 mt-1.5 font-medium">
                      Rs {formatCurrency(propertyValue)}
                    </p>
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <div className="flex items-center mb-2">
                      <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <label className="text-gray-700 font-medium">
                        Interest Rate (%)
                      </label>
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="h-12 bg-gray-50 border-gray-300 text-gray-900 font-medium hover:border-blue-400 focus:border-blue-500 pr-8"
                        min="1"
                        max="30"
                        step="0.1"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                    </div>
                  </div>

                  {/* Down Payment */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CurrencyRupeeIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <label className="text-gray-700 font-medium">
                          Down Payment
                        </label>
                      </div>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                        {downPaymentPercent}%
                      </span>
                    </div>
                    <CustomSlider
                      value={downPaymentPercent}
                      onValueChange={setDownPaymentPercent}
                      min={20}
                      max={80}
                      step={5}
                      className="py-1"
                    />
                    <p className="text-sm text-blue-600 mt-1.5 font-medium">
                      Rs {formatCurrency(downPaymentAmount)}
                    </p>
                  </div>

                  {/* Loan Term */}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <label className="text-gray-700 font-medium">
                          Loan Term
                        </label>
                      </div>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                        {loanTerm} Years
                      </span>
                    </div>
                    <CustomSlider
                      value={loanTerm}
                      onValueChange={setLoanTerm}
                      min={5}
                      max={30}
                      step={1}
                      className="py-1"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1.5">
                      <span>5 Years</span>
                      <span>30 Years</span>
                    </div>
                    <p className="text-sm text-blue-600 mt-1.5 font-medium">
                      Loan Amount: Rs {formatCurrency(loanAmount)}
                    </p>
                  </div>
                </div>

                {/* Results */}
                <div className="mt-5">
                  <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-xl shadow-md border border-blue-300">
                    <div className="text-center mb-5">
                      <h3 className="text-lg font-medium text-blue-100 mb-1">मासिक किस्ता</h3>
                      <div className="text-3xl md:text-4xl font-bold text-white">
                        Rs {formatCurrency(monthlyPayment)}
                      </div>
                    </div>
                    
                    {/* Additional payment details */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-sm text-blue-100 mb-1">Total Interest</div>
                        <div className="text-lg font-medium text-white">
                          Rs {formatCurrency(totalInterest)}
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-sm text-blue-100 mb-1">Total Payment</div>
                        <div className="text-lg font-medium text-white">
                          Rs {formatCurrency(totalPayment)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center mt-4 pt-4 border-t border-blue-500/30">
                      <p className="text-blue-100 italic mb-3">
                        घरजग्गामा लगानी = सुरक्षित भबिष्य
                      </p>
                      
                      {/* Share section */}
                      <div className="mt-2">
                        <button 
                          onClick={() => setShareExpanded(!shareExpanded)}
                          className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg text-sm transition-all mb-3 hover:bg-blue-50"
                        >
                          {shareExpanded ? <ShareIconSolid className="w-5 h-5" /> : <ShareIcon className="w-5 h-5" />}
                          <span>यो किस्ता Calculator शेयर गर्नुहोस्</span>
                        </button>
                        
                        {shareExpanded && (
                          <div className="flex justify-center gap-3 mt-3 animate-fadeIn">
                            <button
                              onClick={handleFacebookShare}
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                              </svg>
                              <span>Facebook</span>
                            </button>

                            <button
                              onClick={handleTwitterShare}
                              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                              </svg>
                              <span>Twitter</span>
                            </button>

                            <button
                              onClick={handleLinkedInShare}
                              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                              </svg>
                              <span>LinkedIn</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoanCalculator;