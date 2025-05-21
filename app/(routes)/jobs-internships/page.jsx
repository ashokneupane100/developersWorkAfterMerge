'use client';

import Image from "next/image";
import React, { useState, useRef, useEffect } from 'react';
import {
  Briefcase,
  GraduationCap,
  Code,
  Monitor,
  Smartphone,
  Clock,
  Phone,
  Mobile,
  Mail,
  ChevronDown,
  ChevronUp,
  Building2
} from 'lucide-react';
import { FaReact, FaNodeJs,faMobile, FaNode } from 'react-icons/fa';
import { FcHome } from 'react-icons/fc';
import jobsInternship from "/public/assets/images/internJob.png";


const JobsInternships = () => {
  const [activeTab, setActiveTab] = useState('internships');
  const internshipsRef = useRef(null);
  const jobsRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const internshipOpportunities = [
    {
      title: "Real Estate Agent Intern",
      company: "Online Home Pvt. Ltd.",
      description: "Learn and master real estate sales and property management. Get hands-on experience with client relations and market analysis.",
      icon: <FcHome className="w-6 h-6" />,
      duration: "1 month",
      type: "Part-time"
    },
    {
      title: "Web Development Intern",
      company: "Online Home Pvt. Ltd.",
      description: "Learn and work on real-world web development projects using modern technologies.",
      icon: <FaReact className="w-6 h-6" />,
      duration: "1 month",
      type: "Part-time"
    },

    {
      title: "App Development Intern",
      company: "Online Home Pvt. Ltd.",
      description: "Learn and work on real-world App development projects using modern technologies like React Native & Flutter.",
      icon: <Smartphone className="w-6 h-6" />,
      duration: "1 month",
      type: "Part-time"
    },


    {
      title: "Digital Marketing Intern",
      company: "Online Home Pvt. Ltd.",
      description: "Master social media marketing and SEO strategies for real estate promotion.",
      icon: <Smartphone className="w-6 h-6" />,
      duration: "1 month",
      type: "Part-Time"
    }
  ];

  const jobOpportunities = [
    {
      title: "Real Estate Agent",
      company: "Online Home Pvt. Ltd.",
      description: "Lead property sales and rentals, working directly with high-value clients and properties.",
      icon: <FcHome className="w-6 h-6" />,
      requirements: [
        "Experience preferred but not mandatory",
        "Strong communication skills",
        "Knowledge of local market"
      ],
      benefits: ["Work-From-Home","Competitive commission", "Flexible hours", "Training provided"]
    },
    {
      title: "Digital Marketer",
      company: "Online Home Pvt. Ltd.",
      description: "Make photo edits with using photoshop, working directly with high-value clients and properties.",
      icon: <Smartphone className="w-6 h-6" />,
      requirements: [
        "Experience preferred but not mandatory",
        "Strong Photoshop Skills",
        "Knowledge of local market"
      ],
      benefits: ["Work From Home","Competitive commission", "Flexible hours", "Training provided"]
    },
    {
      title: "Frontend Developer",
      company: "Online Home Pvt. Ltd.",
      description: "Develop and maintain our web applications using React and modern web technologies.",
      icon: <FaReact className="w-6 h-6" />,
      requirements: ["React.js experience", "UI/UX knowledge"],
      benefits: ["Work From Home","Competitive commission", "Flexible hours", "Training provided"]
    },
    {
      title: "Backend Developer",
      company: "Online Home Pvt. Ltd.",
      description: "Develop and maintain our web applications using NodeJS and modern web technologies.",
      icon: <FaNodeJs className="w-6 h-6" />,
      requirements: ["React.js experience", "UI/UX knowledge"],
      benefits: ["Work-From-home","Competitive salary", "Remote work options"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-950 to-purple-950 text-slate-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Start Your Career in Real Estate & Information Technology
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join Nepal's leading real estate team and build your future in property management and information technology
          </p>
          <div className="bg-gradient-to-r from-green-200 to-red-300 text-black rounded-xl p-6 max-w-3xl mx-auto mb-8 mt-4">
            <p className="text-lg italic">
              No prior qualification and experience required for internships.
              Comprehensive training provided for all roles; rote-learning only and just formal eductaion certificate can make a person dumb, everyone needs to have hands-on work on real-world-projects. Bill Gates was not IT graduate, he studied law on the college and he was the college dropout. We value passion, descipline and fun on learning.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="tel:+9779851331644"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              +977 9851-331644
            </a>
            <a
              href="mailto:onlinehome.com.np@gmail.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-400 transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Us
            </a>
          </div>
        </div>
      </div>
      
      <div className="flex max-w-3xl mx-auto flex-col items-center mb-6 mt-[-1.4rem]">
          <Image
            src={jobsInternship}
            alt="Job Internship"
            className="w-full h-1/3"
          />
        </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-white shadow-md z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setActiveTab('internships');
                scrollToSection(internshipsRef);
              }}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                activeTab === 'internships'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Internships
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab('jobs');
                scrollToSection(jobsRef);
              }}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                activeTab === 'jobs'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Jobs
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Internships Section */}
        <div ref={internshipsRef} className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Internship Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internshipOpportunities.map((internship, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-300 p-3 rounded-full mr-4">
                      {internship.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {internship.title}
                      </h3>
                      <p className="text-gray-600">{internship.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{internship.description}</p>
                  <div className="flex justify-between items-center text-sm mb-4">
                    <span className="flex items-center text-blue-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {internship.duration}
                    </span>
                    <span className="flex items-center text-gray-600">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {internship.type}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <a
                      href="mailto:onlinehome.com.np@gmail.com"
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Apply Now
                    </a>
                    <a
                      href="tel:+9779851331644"
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Us
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jobs Section */}
        <div ref={jobsRef} className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Job Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobOpportunities.map((job, index) => (
              <JobCard key={index} {...job} />
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center py-16">
          <h2 className="text-3xl font-bold mb-8">Ready to Join Our Team?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="mailto:onlinehome.com.np@gmail.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Us
            </a>
            <a
              href="tel:+9779851331644"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              +977 9851-331644
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobCard = ({ title, company, description, icon, requirements, benefits }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-blue-400 p-3 rounded-full mr-4">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <p className="text-gray-600">{company}</p>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Requirements:</h4>
              <ul className="list-disc list-inside space-y-1">
                {requirements.map((req, index) => (
                  <li key={index} className="text-gray-600">{req}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Benefits:</h4>
              <ul className="list-disc list-inside space-y-1">
                {benefits.map((benefit, index) => (
                  <li key={index} className="text-gray-600">{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div className="mt-4 flex justify-between items-center">
          <a
            href="mailto:onlinehome.com.np@gmail.com"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            <Mail className="w-4 h-4 mr-2" />
            Apply Now
          </a>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-6 h-6" />
            ) : (
              <ChevronDown className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobsInternships;