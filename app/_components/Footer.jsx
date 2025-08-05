"use client"
import Image from "next/image"
import Link from "next/link"
import { PhoneIcon, EnvelopeIcon, MapPinIcon, BriefcaseIcon, PlayCircleIcon } from "@heroicons/react/24/outline"
import JobIntern from "../../public/assets/images/onFooter.png"
import logo from "../../public/logo.png"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-slate-800 via-teal-900 to-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-white/10 p-2 backdrop-blur-sm">
                <Image
                  src={logo || "/placeholder.svg"}
                  alt="OnlineHome Nepal"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-teal-300">OnlineHome</h3>
                <p className="text-sm text-gray-300">Nepal</p>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted partner for real estate solutions in Nepal. Building strong relationships for years with
              reliable service and expertise.
            </p>

            <div className="text-teal-300 font-medium text-sm">बर्षौं बर्षको बलियो सम्बन्ध</div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-teal-300 border-b border-teal-700/50 pb-2">Quick Links</h4>
            <nav className="space-y-3">
              {[
                ["About Us", "/about"],
                ["Our Services", "/our-services"],
                ["FAQ", "/faq"],
                ["Privacy Policy", "/privacy-policy"],
                ["Data Deletion", "/data-deletion-policy"],
              ].map(([name, href]) => (
                <Link
                  key={name}
                  href={href}
                  className="block text-gray-300 hover:text-teal-300 transition-colors duration-200 text-sm"
                >
                  {name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-teal-300 border-b border-teal-700/50 pb-2">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <div className="space-y-1">
                  <Link
                    href="tel:+9779851331644"
                    className="block text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    9851 331644
                  </Link>
                  <Link
                    href="tel:+9779828797978"
                    className="block text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    980 28797978
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <Link
                  href="mailto:onlinehome.com.np@gmail.com"
                  className="text-gray-300 hover:text-white transition-colors text-sm break-all"
                >
                  onlinehome.com.np@gmail.com
                </Link>
              </div>

              <div className="flex items-start space-x-3">
                <MapPinIcon className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm">कलंकी मालपोत कार्यालय गेटको ठीक अगाडि</p>
              </div>
            </div>
          </div>

          {/* Follow Us & Social Media */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-teal-300 border-b border-teal-700/50 pb-2">Follow Us</h4>

              {/* Social Media Links */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="https://facebook.com/onlinehomenepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-2 bg-blue-600/20 rounded-lg hover:bg-blue-600/30 transition-colors duration-200 group border border-blue-500/30"
                >
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-300 group-hover:text-white">Facebook</span>
                </Link>

                <Link
                  href="https://youtube.com/@onlinehome_nepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-2 bg-red-600/20 rounded-lg hover:bg-red-600/30 transition-colors duration-200 group border border-red-500/30"
                >
                  <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayCircleIcon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs text-gray-300 group-hover:text-white">YouTube</span>
                </Link>

                <Link
                  href="https://instagram.com/onlinehomenepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-2 bg-pink-600/20 rounded-lg hover:bg-pink-600/30 transition-colors duration-200 group border border-pink-500/30"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447c0-1.297.49-2.448 1.297-3.323.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323c0 1.297-.49 2.448-1.297 3.323-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.875-.385-.875-.875s.385-.875.875-.875.875.385.875.875-.385.875-.875.875zm-4.281 1.781c-1.518 0-2.75 1.232-2.75 2.75s1.232 2.75 2.75 2.75 2.75-1.232 2.75-2.75-1.232-2.75-2.75-2.75z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-300 group-hover:text-white">Instagram</span>
                </Link>

                <Link
                  href="/jobs-internships"
                  className="flex items-center space-x-2 p-2 bg-amber-600/20 rounded-lg hover:bg-amber-600/30 transition-colors duration-200 group border border-amber-500/30"
                >
                  <div className="w-6 h-6 bg-amber-600 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BriefcaseIcon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs text-gray-300 group-hover:text-white">Jobs</span>
                </Link>
              </div>

              {/* Newsletter Signup */}
              <div className="mt-4 p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-teal-500/20">
                <p className="text-xs text-gray-400 mb-2">Stay updated with latest properties</p>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="flex-1 px-2 py-1 text-xs bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-teal-400"
                  />
                  <button className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs rounded transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Image */}
           
          </div>
        </div>

        {/* Location Map */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-teal-300 mb-4">Our Location</h4>
          <div className="relative overflow-hidden rounded-lg">
            <iframe
              title="Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8912226055613!2d85.28234584627994!3d27.689756703466518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19ed93a224d7%3A0x7872a22aac8a5006!2sNepal%20Home%20Land!5e0!3m2!1sen!2sus!4v1716887382506!5m2!1sen!2sus"
              className="w-full h-64 rounded-lg filter grayscale hover:grayscale-0 transition-all duration-500"
              loading="lazy"
              allowFullScreen=""
            />
          </div>
        </div>

        {/* Special Offer */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-teal-600/20 to-blue-600/20 backdrop-blur-sm rounded-lg px-6 py-3 border border-teal-500/30">
            <p className="text-teal-300 font-medium">शुरुमा फर्म चार्ज नलाग्ने विकल्प पनि उपलब्ध छ</p>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} <span className="text-teal-300 font-medium">onlinehome.com.np</span>
              </p>
              <p className="text-gray-500 text-xs mt-1">All rights reserved.</p>
            </div>

            {/* Developed By */}
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                Developed with ❤️ by <span className="text-teal-300 font-medium">OnlineHome Team</span>
              </p>
              <p className="text-gray-500 text-xs mt-1">Powered by Artova Solutions</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
