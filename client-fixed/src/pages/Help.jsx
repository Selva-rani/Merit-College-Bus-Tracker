import React from "react";
import Navbar from "../components/Navbar";

export default function Help() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">
          ❓ Help & Support
        </h1>

        {/* FAQs Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📚 Frequently Asked Questions</h2>
          <div className="bg-white shadow-md rounded p-4 space-y-4">
            <div>
              <h3 className="font-semibold">Q1: How can I track the bus?</h3>
              <p className="text-gray-700">After logging in as a student or parent, use the "Live Tracking" section to view real-time bus location.</p>
            </div>

            <div>
              <h3 className="font-semibold">Q2: What should I do if the app is not working?</h3>
              <p className="text-gray-700">Ensure you have a stable internet connection and clear your browser cache. Contact support if problems persist.</p>
            </div>

            <div>
              <h3 className="font-semibold">Q3: How do I reset my password?</h3>
              <p className="text-gray-700">Currently, password reset is managed by the college admin. Contact the admin for assistance.</p>
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📞 Contact Us</h2>
          <div className="bg-white shadow-md rounded p-4 space-y-2">
            <p><strong>Email:</strong> support@meritcollege.edu</p>
            <p><strong>Phone:</strong> +91 98765 43210</p>
            <p><strong>Office Hours:</strong> Mon - Fri, 9 AM to 5 PM</p>
          </div>
        </section>

        {/* Troubleshooting Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">⚙️ Troubleshooting Tips</h2>
          <ul className="list-disc list-inside bg-white shadow-md rounded p-4 space-y-2">
            <li>Check your internet connection.</li>
            <li>Clear browser cache and cookies.</li>
            <li>Ensure you are using the correct login credentials.</li>
            <li>Contact support if the problem persists.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
