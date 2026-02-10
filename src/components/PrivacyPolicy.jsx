import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-6 text-primary">Privacy Policy</h1>
      <p className="mb-6 text-gray-600">
        Your privacy is important to us. This policy explains how we collect, use, and protect your data.
      </p>

      <div className="space-y-4 text-gray-700">
        <p><strong>1. Information Collection:</strong> We collect information you provide when using our services, such as name, email, and pet information.</p>
        <p><strong>2. Use of Information:</strong> Your data helps us improve services, personalize experiences, and communicate important updates.</p>
        <p><strong>3. Data Security:</strong> We implement reasonable measures to protect your data from unauthorized access.</p>
        <p><strong>4. Sharing:</strong> We do not sell your personal data. Data may be shared with partners for service delivery only.</p>
        <p><strong>5. Cookies:</strong> We use cookies to enhance user experience and analyze site usage.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
