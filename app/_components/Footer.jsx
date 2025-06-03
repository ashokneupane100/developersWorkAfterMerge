"use client";

import Image from "next/image";
import Link from "next/link";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BriefcaseIcon,
  PlayCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import JobIntern from "../../public/assets/images/onFooter.png";
import Logo from "../../public/assets/images/homeLogo.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-green-900 to-green-950 text-white pt-8 mt-0">
      {/* Inline CSS for Custom Animations */}
      <style jsx>{`
        @keyframes fadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeScale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeScaleBounce {
          0% {
            opacity: 0 *;
            transform: scale(0.8);
          }
          60% {
            opacity: 1;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes glowPulse {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
            box-shadow: 0 0 10px rgba(251, 191, 36, 0.2);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.15);
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
          }
        }
        @keyframes underlineGrow {
          0% {
            transform: scaleX(0);
            opacity: 0;
          }
          100% {
            transform: scaleX(1);
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes textShimmer {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
      `}</style>

      {/* Promotion Bar */}
      <div className="bg-gradient-to-r from-amber-900/30 via-amber-800/40 to-amber-900/30 mb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Link
              href="/jobs-internships"
              className="group flex items-center bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              style={{ animation: "slideInLeft 0.8s ease-out forwards" }}
            >
              <div className="bg-white p-1.5 rounded-full text-amber-600 group-hover:scale-110 transition-transform duration-300">
                <BriefcaseIcon className="w-5 h-5" />
              </div>
              <span className="ml-2 text-gray-900 font-bold text-sm sm:text-base">
                Internship and Job offer
              </span>
            </Link>

            <Link
              href="https://youtube.com/@onlinehome_nepal"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              style={{ animation: "slideInRight 0.8s ease-out forwards" }}
            >
              <div className="bg-white p-1.5 rounded-full text-red-600 group-hover:scale-110 transition-transform duration-300">
                <PlayCircleIcon className="w-5 h-5" />
              </div>
              <span className="ml-2 text-gray-900 font-bold text-sm sm:text-base">
                Free Courses in Youtube
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {/* Quick Links */}
          <div
            className="bg-green-800/30 rounded-xl p-5 backdrop-blur-sm border border-green-700/30 shadow-md hover:shadow-lg transition-shadow duration-300"
            style={{ animation: "fadeSlideUp 0.8s ease-out forwards" }}
          >
            <h3 className="text-lg font-bold text-amber-400 border-b border-amber-400/30 pb-2 mb-4 flex items-center">
              <span className="bg-amber-400/20 p-1 rounded-md mr-2">
                <ChevronRightIcon className="w-4 h-4 text-amber-400" />
              </span>
              Quick Links
            </h3>
            <nav className="grid grid-cols-1 gap-3">
              {[
                ["About Us", "/about"],
                ["Our Services", "/our-services"],
                ["FAQ", "/faq"],
                ["Privacy Policy", "/privacy-policy"],
                ["Data Deletion", "/data-deletion-policy"],
              ].map(([name, href], index) => (
                <Link
                  key={name}
                  href={href}
                  className="group flex items-center text-gray-200 hover:text-amber-300 transition-colors duration-300"
                  style={{
                    animation: `fadeSlideUp 0.8s ease-out ${
                      0.2 * (index + 1)
                    }s forwards`,
                  }}
                >
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 group-hover:w-2 group-hover:h-2 transition-all duration-200"></div>
                  <span className="text-sm sm:text-base">{name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div
            className="bg-green-800/30 rounded-xl p-5 backdrop-blur-sm border border-green-700/30 shadow-md hover:shadow-lg transition-shadow duration-300"
            style={{ animation: "fadeSlideUp 0.8s ease-out forwards" }}
          >
            <h3 className="text-lg font-bold text-amber-400 border-b border-amber-400/30 pb-2 mb-4 flex items-center">
              <span className="bg-amber-400/20 p-1 rounded-md mr-2">
                <EnvelopeIcon className="w-4 h-4 text-amber-400" />
              </span>
              Contact Us
            </h3>
            <div className="space-y-3">
              {[
                {
                  icon: PhoneIcon,
                  text: "9851 331644",
                  href: "tel:+9779851331644",
                  call: true,
                },
                {
                  icon: PhoneIcon,
                  text: "980 28797978",
                  href: "tel:+9779828797978",
                  call: true,
                },
                {
                  icon: EnvelopeIcon,
                  text: "onlinehome.com.np@gmail.com",
                  href: "mailto:onlinehome.com.np@gmail.com",
                },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="flex items-center group p-2 rounded-lg hover:bg-green-700/30 transition-colors duration-300"
                  style={{
                    animation: `fadeSlideUp 0.8s ease-out ${
                      0.2 * (i + 1)
                    }s forwards`,
                  }}
                >
                  <div className="bg-amber-500/10 p-2 rounded-lg text-amber-400 group-hover:bg-amber-500/20 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="ml-3 text-gray-200 group-hover:text-white text-sm sm:text-base">
                    {item.text}
                  </span>
                  {item.call && (
                    <button className="ml-auto text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-md transition-colors duration-300">
                      Call Now
                    </button>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Location */}
          <div
            className="bg-green-800/30 rounded-xl p-5 backdrop-blur-sm border border-green-700/30 shadow-md hover:shadow-lg transition-shadow duration-300"
            style={{ animation: "fadeSlideUp 0.8s ease-out forwards" }}
          >
            <h3 className="text-lg font-bold text-amber-400 border-b border-amber-400/30 pb-2 mb-4 flex items-center">
              <span className="bg-amber-400/20 p-1 rounded-md mr-2">
                <MapPinIcon className="w-4 h-4 text-amber-400" />
              </span>
              Location
            </h3>
            <p className="text-lg font-medium text-amber-300/90 mb-4">
              कलंकी मालपोत कार्यालय गेटको ठीक अगाडि
            </p>
            <div className="relative overflow-hidden rounded-lg group">
              <iframe
                title="Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8912226055613!2d85.28234584627994!3d27.689756703466518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19ed93a224d7%3A0x7872a22aac8a5006!2sNepal%20Home%20Land!5e0!3m2!1sen!2sus!4v1716887382506!5m2!1sen!2sus"
                className="w-full h-48 rounded-lg grayscale group-hover:grayscale-0 transition-all duration-500 border-2 border-green-700"
                loading="lazy"
                allowFullScreen=""
              />
              <div className="absolute inset-0 pointer-events-none border-4 border-amber-400/20 rounded-lg group-hover:border-amber-400/40 transition-colors duration-300"></div>
            </div>
          </div>
        </div>

        {/* Logo and Copyright */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-green-800/70 to-green-900/70 shadow-xl border border-green-700/50 backdrop-blur-sm">
            {/* Content Container */}
            <div className="relative p-6 flex flex-col items-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6 w-full min-h-[200px]">
                {/* Logo Container */}
                <div
                  className="relative w-28 h-28 rounded-xl bg-gradient-to-br from-white/10 to-white/5 p-4 ring-1 ring-white/20 shadow-lg overflow-hidden group"
                  style={{
                    animation: "fadeScaleBounce 0.8s ease-out forwards",
                  }}
                >
                  <Image
                    src={Logo}
                    alt="OnlineHome Nepal"
                    width={96}
                    height={96}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-tl from-amber-400/10 to-transparent opacity-50 rounded-xl"></div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div className="space-y-2">
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                      {/* Highlighted Container */}
                      <div className="relative bg-gradient-to-b from-green-800/50 to-green-900/50 backdrop-blur-md rounded-xl p-4 border border-amber-400/20 shadow-lg shadow-amber-400/10 hover:shadow-amber-400/20 transition-shadow duration-300">
                        {/* Copyright, Year, and Website Name */}
                        <div
                          className="flex items-center justify-center sm:justify-start gap-2"
                          style={{
                            animation: "fadeSlideUp 0.8s ease-out forwards",
                          }}
                        >
                          <span
                            className="text-base bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-500 animate-fade"
                            style={{
                              backgroundSize: "200% 100%",
                              animation: "textShimmer 3s linear infinite",
                            }}
                          >
                            ©
                          </span>
                          <span
                            className="text-base bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-500 animate-fade"
                            style={{
                              backgroundSize: "200% 100%",
                              animation: "textShimmer 3s linear infinite",
                            }}
                          >
                            {currentYear}
                          </span>
                          <span
                            className="group relative text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-300 hover:scale-105"
                            style={{
                              backgroundSize: "200% 100%",
                              animation: "textShimmer 3s linear infinite",
                            }}
                          >
                            onlinehome.com.np
                            <span
                              className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-400 opacity-0 group-hover:opacity-100"
                              style={{
                                animation: " 0.3s ease-in-out forwards",
                                transformOrigin: "left",
                              }}
                            ></span>
                          </span>
                        </div>
                        {/* Tagline */}
                        <div
                          className="flex justify-center items-center px-4 sm:px-10 mt-2"
                          style={{
                            animation: "fadeScaleBounce 0.8s ease-out forwards",
                          }}
                        >
                          <p
                            className="group pl-6 relative text-lg font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-400 tracking-wide"
                            style={{
                              backgroundSize: "200% 100%",
                              animation: "textShimmer 3s linear infinite",
                            }}
                          >
                            बर्षौं बर्षको बलियो सम्बन्ध
                            <span
                              className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-300 opacity-0 group-hover:opacity-100"
                              style={{
                                animation: "0.3s ease-in-out forwards",
                                transformOrigin: "left",
                              }}
                            ></span>
                          </p>
                        </div>

                        {/* Decorative Glow Elements */}
                        <div
                          className="absolute -top-4 -right-4 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl"
                          style={{
                            animation: "glowPulse 2.5s ease-in-out infinite",
                          }}
                        ></div>
                        <div
                          className="absolute -bottom-4 -left-4 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl"
                          style={{
                            animation: "glowPulse 2.5s ease-in-out infinite",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="text-gray-100 bg-amber-900/60 rounded-lg px-4 py-2 inline-block shadow-inner text-center text-sm sm:text-base"
                style={{ animation: "fadeScale 0.8s ease-out forwards" }}
              >
                शुरुमा फर्म चार्ज नलाग्ने विकल्प पनि उपलब्ध छ
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-400/5 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
