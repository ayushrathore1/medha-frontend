import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Animate footer link underline on hover
const linkVariants = {
  rest: { scale: 1, color: "var(--text-secondary)" },
  hover: {
    scale: 1.08,
    color: "var(--action-primary)",
    transition: { type: "spring", stiffness: 340 },
  },
};

const underlineVariants = {
  rest: { scaleX: 0 },
  hover: { scaleX: 1, transition: { type: "spring", stiffness: 210 } },
};

const Footer = () => (
  <footer className="w-full pt-16 pb-10 bg-[var(--bg-primary)] text-[var(--text-primary)] border-t border-[var(--accent-secondary)]/20">
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
            <span className="text-2xl font-bold bg-gradient-to-r from-[var(--action-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent tracking-tight">
              MEDHA
            </span>
          </div>
          <p className="text-[var(--text-secondary)] mb-4 max-w-md font-normal">
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
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
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
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                ),
              },
            ].map(({ label, href, icon }) => (
              <motion.a
                key={label}
                href={href}
                whileHover={{ scale: 1.22, color: "var(--action-primary)" }}
                transition={{ type: "spring", stiffness: 240 }}
                className="text-[var(--text-secondary)] hover:text-[var(--action-primary)] transition-colors"
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
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">{section}</h3>
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link to={link.to} className="inline-block w-full">
                      <motion.span
                        initial="rest"
                        whileHover="hover"
                        animate="rest"
                        variants={linkVariants}
                        className="relative font-medium text-[var(--text-secondary)] hover:text-[var(--action-primary)] px-0.5 py-0.5 transition-colors"
                      >
                        {link.label}
                        <motion.span
                          variants={underlineVariants}
                          className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-[var(--action-primary)] to-[var(--accent-secondary)] rounded-xl"
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
                      className="relative font-medium text-[var(--text-secondary)] hover:text-[var(--action-primary)] px-0.5 py-0.5 transition-colors"
                    >
                      {link.label}
                      <motion.span
                        variants={underlineVariants}
                        className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-[var(--action-primary)] to-[var(--accent-secondary)] rounded-xl"
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
      <div className="border-t border-[var(--accent-secondary)]/20 mt-10 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[var(--text-secondary)] text-sm">
            © 2025 <span className="text-[var(--action-primary)] font-semibold">MEDHA</span>.
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
                    color: "var(--action-primary)",
                    borderBottom: "2px solid var(--action-primary)",
                  }}
                  className="text-[var(--text-secondary)] hover:text-[var(--action-primary)] text-sm font-medium transition"
                >
                  {item}
                </motion.a>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
