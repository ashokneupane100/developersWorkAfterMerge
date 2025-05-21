'use client';

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { 
  HomeIcon, 
  BanknotesIcon, 
  CalendarIcon, 
  CurrencyRupeeIcon, 
  ChartBarIcon
} from "@heroicons/react/24/outline";
import CustomSlider from "./CustomSlider";
import { formatCurrency } from "./formatCurrency";

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
      setTotalPayment(Number(totalPaid.toFixed(2)));
    } catch (error) {
      console.error('Calculation error:', error);
      setMonthlyPayment(0);
      setTotalInterest(0);
      setDownPaymentAmount(0);
      setLoanAmount(0);
      setTotalPayment(0);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 overflow-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-1 flex items-center justify-center gap-2">
          <HomeIcon className="h-6 w-6" />
          Home Loan Calculator
        </h2>
        <p className="text-gray-600">एक मिनेटमा नै घरको मासिक किस्ता पत्ता लगाउनुहोस</p>
      </div>
      
      {/* Calculator Inputs */}
      <div className="space-y-6 mb-6">
        {/* Property Value */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <CurrencyRupeeIcon className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-gray-800">Property Value</h3>
          </div>
          
          <Input 
            value={displayValue} 
            onChange={handlePropertyValueChange} 
            onBlur={handlePropertyValueBlur} 
            className="h-10 w-full border-gray-300 mb-2" 
            placeholder="Enter Property Value" 
          />
          <div className="text-sm font-medium text-blue-600">
            Rs {formatCurrency(propertyValue)}
          </div>
        </div>
        
        {/* Interest Rate */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <ChartBarIcon className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-gray-800">Interest Rate (%)</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <Input 
              type="number"
              value={interestRate} 
              onChange={(e) => setInterestRate(Number(e.target.value))} 
              className="h-10 w-full border-gray-300" 
              min="1"
              max="20"
              step="0.1"
            />
            <div className="text-lg font-medium text-gray-700">%</div>
          </div>
        </div>
        
        {/* Down Payment */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BanknotesIcon className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-gray-800">Down Payment</h3>
            </div>
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-medium">
              {downPaymentPercent}%
            </div>
          </div>
          
          <CustomSlider 
            value={downPaymentPercent} 
            onValueChange={setDownPaymentPercent} 
            min={20} 
            max={80} 
            step={5}
            className="py-4" 
          />
          <div className="text-sm font-medium text-blue-600">
            Rs {formatCurrency(downPaymentAmount)}
          </div>
        </div>
        
        {/* Loan Term */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-gray-800">Loan Term</h3>
            </div>
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-medium">
              {loanTerm} Years
            </div>
          </div>
          
          <CustomSlider 
            value={loanTerm} 
            onValueChange={setLoanTerm} 
            min={5} 
            max={30} 
            step={1}
            className="py-4"
          />
          <div className="text-sm font-medium text-blue-600">
            Loan Amount: Rs {formatCurrency(loanAmount)}
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 rounded-lg shadow-lg">
        <div className="mb-4 text-center">
          <h3 className="text-lg font-medium text-blue-100 mb-1">मासिक किस्ता</h3>
          <div className="text-3xl font-bold">Rs {formatCurrency(monthlyPayment)}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 border-t border-blue-500 pt-4">
          <div className="text-center">
            <div className="text-sm text-blue-200 mb-1">Total Interest</div>
            <div className="text-lg font-semibold">Rs {formatCurrency(totalInterest)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-blue-200 mb-1">Total Payment</div>
            <div className="text-lg font-semibold">Rs {formatCurrency(totalPayment)}</div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-blue-100 text-sm italic">
            घरजग्गामा लगानी = सुरक्षित भबिष्य
          </p>
        </div>
      </div>
      
      <div className="mt-4 text-center text-gray-500 text-sm">
        <p>
          This is only an estimate. Contact your bank for more accurate calculations.
        </p>
      </div>
    </div>
  );
};

export default LoanCalculator;