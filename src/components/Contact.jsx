import React, { useState } from "react";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Message sent!\nName: ${form.name}\nEmail: ${form.email}\nMessage: ${form.message}`);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-6 text-primary">Contact Us</h1>
      <p className="mb-8 text-gray-600">
        Have a question or want to get in touch? Fill out the form below or email us at <a href="mailto:support@petcare.org" className="text-primary">support@petcare.org</a>.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-lg shadow-md">
        <div>
          <label className="block mb-2 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows="5"
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-all"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
