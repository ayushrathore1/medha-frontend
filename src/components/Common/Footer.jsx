import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Animate footer link underline on hover
const linkVariants = {
  rest: { scale: 1, color: "#e1e7ff" },
  hover: {
    scale: 1.08,
    color: "#a7bff5",
    transition: { type: "spring", stiffness: 340 },
  },
};

const underlineVariants = {
  rest: { scaleX: 0 },
  hover: { scaleX: 1, transition: { type: "spring", stiffness: 210 } },
};

const Footer = () => (
  <footer className="w-full pt-16 pb-10 bg-[#0a0a0a] text-white border-t border-white/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <img
              src="https://ik.imagekit.io/ayushrathore1/logo.png?updatedAt=1758343718570"
              alt="MEDHA logo"
              className="w-10 h-10 rounded-xl shadow"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
              MEDHA
            </span>
          </div>
          <p className="text-gray-400 mb-4 max-w-md font-normal">
            Boost your learning with AI-powered note upload, instant flashcards,
            smart quizzes, and a personalized chatbot.
            <br />
            Organized. Efficient. Fun.
          </p>
          <div className="flex space-x-5 mt-2">
            {[
              {
                label: "Facebook",
                href: "#",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073..." />
                  </svg>
                ),
              },
              {
                label: "Twitter",
                href: "#",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57..." />
                  </svg>
                ),
              },
              {
                label: "LinkedIn",
                href: "#",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452..." />
                  </svg>
                ),
              },
            ].map(({ label, href, icon }) => (
              <motion.a
                key={label}
                href={href}
                whileHover={{ scale: 1.22, color: "#bf96f6" }}
                transition={{ type: "spring", stiffness: 240 }}
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label={label}
              >
                {icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Quick Links & Support */}
        {[
          {
            section: "Quick Links",
            links: [
              { to: "/dashboard", label: "Dashboard" },
              { to: "/flashcards", label: "Flashcards" },
              { to: "/quiz", label: "Quiz" },
              { to: "/upload", label: "Upload Notes" },
              { to: "/chatbot", label: "Chatbot" },
            ],
          },
          {
            section: "Support",
            links: [
              { to: "/feedback", label: "Feedback" },
              { to: "/profile", label: "Profile" },
              { href: "#", label: "Help Center" },
              { href: "#", label: "Contact Us" },
              { href: "#", label: "Privacy Policy" },
            ],
          },
        ].map(({ section, links }) => (
          <div key={section}>
            <h3 className="text-lg font-semibold mb-4 text-white">{section}</h3>
            <ul className="space-y-1">
              {links.map((link, i) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link to={link.to} className="inline-block w-full">
                      <motion.span
                        initial="rest"
                        whileHover="hover"
                        animate="rest"
                        variants={linkVariants}
                        className="relative font-medium text-gray-300 hover:text-blue-300 px-0.5 py-0.5 transition-colors"
                      >
                        {link.label}
                        <motion.span
                          variants={underlineVariants}
                          className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-violet-400 to-blue-400 rounded-xl"
                          style={{ display: "block" }}
                        />
                      </motion.span>
                    </Link>
                  ) : (
                    <motion.a
                      href={link.href}
                      initial="rest"
                      whileHover="hover"
                      animate="rest"
                      variants={linkVariants}
                      className="relative font-medium text-gray-300 hover:text-blue-300 px-0.5 py-0.5 transition-colors"
                    >
                      {link.label}
                      <motion.span
                        variants={underlineVariants}
                        className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-violet-400 to-blue-400 rounded-xl"
                        style={{ display: "block" }}
                      />
                    </motion.a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/10 mt-10 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            © 2025 <span className="text-blue-300 font-semibold">MEDHA</span>.
            All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {["Terms of Service", "Privacy Policy", "Cookie Policy"].map(
              (item) => (
                <motion.a
                  key={item}
                  href="#"
                  whileHover={{
                    scale: 1.18,
                    color: "#a7bff5",
                    borderBottom: "2px solid #a7bff5",
                  }}
                  className="text-gray-400 hover:text-blue-300 text-sm font-medium transition"
                >
                  {item}
                </motion.a>
              )
            )}
          </div>
        </div>
      </div>
    </div>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      body { font-family: 'Inter', sans-serif; }
    `}</style>
  </footer>
);

export default Footer;
