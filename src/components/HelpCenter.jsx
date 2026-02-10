import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp, MessageCircle, Mail, Phone } from "lucide-react";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    {
      title: "🐾 Pet Adoption",
      faqs: [
        { 
          q: "How do I adopt a pet?", 
          a: "Browse available pets on our Adopt page, click on a pet you're interested in to view their details, then click 'Apply to Adopt'. Fill out the adoption form with information about your home, lifestyle, and experience with pets. Our shelters typically respond within 24-48 hours."
        },
        { 
          q: "What is the adoption process?", 
          a: "After submitting your application, the shelter will review it and may contact you for an interview. If approved, you'll schedule a meet-and-greet with the pet. Once you're a good match, you'll complete the adoption paperwork and can take your new family member home!"
        },
        { 
          q: "How much does adoption cost?", 
          a: "Adoption fees vary by shelter and pet type, typically ranging from $50-$200. This usually includes spaying/neutering, vaccinations, and microchipping. Check the individual pet's profile for specific fees."
        },
        { 
          q: "Can I return a pet if it doesn't work out?", 
          a: "Most shelters have a trial period (usually 2 weeks) where you can return the pet if there are compatibility issues. Contact the shelter directly to discuss their specific return policy."
        }
      ]
    },
    {
      title: "💰 Donations",
      faqs: [
        { 
          q: "How can I donate to a shelter?", 
          a: "Visit our Donate page, browse verified shelters, select one you'd like to support, choose a donation purpose (Food, Medical Care, or Shelter & Care), enter your donation amount, and complete the secure payment through Stripe."
        },
        { 
          q: "Are donations tax-deductible?", 
          a: "Yes! All donations made through PetCare to verified 501(c)(3) shelters are tax-deductible. You'll receive a receipt via email after each donation with your transaction ID for tax purposes."
        },
        { 
          q: "How do I know my donation is being used properly?", 
          a: "We only work with verified shelters that undergo our strict verification process. You can track your donation impact and view how shelters allocate funds in their transparency reports on their profile pages."
        },
        { 
          q: "Can I set up recurring donations?", 
          a: "Yes! During the donation process, you can choose to make your donation recurring on a monthly or yearly basis to provide ongoing support to your chosen shelter."
        }
      ]
    },
    {
      title: "🏥 Emergency Vet Assistance",
      faqs: [
        { 
          q: "How does the AI Emergency Vet Assistant work?", 
          a: "Our AI-powered assistant provides immediate guidance for pet emergencies. Simply describe your pet's symptoms, and the AI will ask clarifying questions, provide first-aid advice, and help determine if professional veterinary care is urgently needed. Access it through the Emergency page."
        },
        { 
          q: "Is the AI assistant a replacement for a real veterinarian?", 
          a: "No. The AI assistant provides general guidance only and is not a replacement for professional veterinary care. If your pet has severe symptoms or the AI recommends it, always seek immediate veterinary attention."
        },
        { 
          q: "What kind of emergencies can the AI help with?", 
          a: "The AI can help with bleeding, vomiting, injuries, breathing issues, poisoning, and other common emergencies. It provides immediate first-aid guidance and helps you assess severity."
        },
        { 
          q: "Is the Emergency chat service available 24/7?", 
          a: "Yes! The AI Emergency Vet Assistant is available 24 hours a day, 7 days a week to provide immediate guidance for pet emergencies."
        }
      ]
    },
    {
      title: "📊 Pet Health Tracking",
      faqs: [
        { 
          q: "How do I track my pet's health records?", 
          a: "After registering your pet through the 'My Pets' section, you can add vaccination records, growth measurements, and medical history. Access these through the pet detail pages with tabs for Vaccinations, Growth, and Medical History."
        },
        { 
          q: "Can I upload vaccination records?", 
          a: "Yes! When adding a vaccination, you can upload documents, set reminders for next doses, and track your pet's complete vaccination history. The system will send you reminders when vaccinations are due."
        },
        { 
          q: "How does the growth tracker work?", 
          a: "Record your pet's weight and height regularly in the Growth tab. The system compares your pet's measurements to breed standards, displays growth charts, and helps you monitor healthy development."
        },
        { 
          q: "Can I export my pet's health records?", 
          a: "Yes! You can download your pet's complete health records as a PDF or CSV file from the pet detail page. This is useful for vet visits or when traveling with your pet."
        }
      ]
    },
    {
      title: "🏠 Shelter Management",
      faqs: [
        { 
          q: "How do I register my shelter on PetCare?", 
          a: "Click 'Register' and select 'Shelter Account'. Complete the verification process by submitting your shelter license, registration documents, and contact information. Our admin team will review and verify your shelter within 2-3 business days."
        },
        { 
          q: "What happens during shelter verification?", 
          a: "Our admin team reviews your license documents, checks your registration status, verifies your contact information, and ensures you meet our shelter standards. You'll receive an email notification once verified."
        },
        { 
          q: "How do I add pets for adoption?", 
          a: "Once verified, log into your shelter dashboard and click 'Add Pet'. Upload photos, add details about the pet (breed, age, temperament), set adoption fees, and publish the listing."
        },
        { 
          q: "Can I track donations to my shelter?", 
          a: "Yes! Your shelter dashboard shows real-time donation tracking, donor information (if not anonymous), purpose breakdowns (food, medical, shelter), and monthly donation trends."
        }
      ]
    },
    {
      title: "💳 Payments & Security",
      faqs: [
        { 
          q: "Is my payment information secure?", 
          a: "Yes! All payments are processed through Stripe, a PCI-compliant payment processor. We never store your credit card information on our servers. All transactions are encrypted with 256-bit SSL."
        },
        { 
          q: "What payment methods do you accept?", 
          a: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, and digital wallets through our secure Stripe integration."
        },
        { 
          q: "How do I get a receipt for my donation?", 
          a: "After completing a donation, you'll receive an email receipt with your transaction ID, donation amount, shelter name, and date. You can also download receipts from your donation history."
        },
        { 
          q: "Can I get a refund on my donation?", 
          a: "Donation refund policies are set by individual shelters. Contact the shelter directly through the platform to discuss refund requests. Most shelters honor refund requests within 48 hours of donation."
        }
      ]
    },
    {
      title: "👤 Account Management",
      faqs: [
        { 
          q: "How do I create an account?", 
          a: "Click 'Register' in the top navigation, choose between Pet Owner or Shelter account, fill in your details, verify your email, and complete your profile setup."
        },
        { 
          q: "I forgot my password. How do I reset it?", 
          a: "Click 'Login', then 'Forgot Password'. Enter your email address and we'll send you a password reset link. The link expires in 24 hours for security."
        },
        { 
          q: "Can I have multiple pets under one account?", 
          a: "Yes! You can register unlimited pets under a single Pet Owner account. Each pet will have its own profile with separate health records and tracking."
        },
        { 
          q: "How do I delete my account?", 
          a: "Go to Settings > Account > Delete Account. Note that this action is permanent and will delete all your pet records, adoption history, and donation records."
        }
      ]
    },
    {
      title: "🔍 Breed Information",
      faqs: [
        { 
          q: "Where can I find information about different breeds?", 
          a: "Visit the 'Breed Info' page to browse comprehensive information about dog and cat breeds, including temperament, care requirements, health considerations, and ideal living situations."
        },
        { 
          q: "How do I know which breed is right for me?", 
          a: "Use our breed comparison tool to compare different breeds based on your lifestyle, living space, activity level, and experience with pets. The tool provides personalized recommendations."
        },
        { 
          q: "Can I filter pets by breed when adopting?", 
          a: "Yes! On the Adopt page, you can filter by species, breed, age, size, and location to find pets that match your preferences."
        }
      ]
    }
  ];



  // Filter FAQs based on search
  const filteredCategories = categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      searchQuery === "" || 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  const toggleFaq = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setExpandedFaq(expandedFaq === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-green-50 mb-8">
            Find answers to common questions about PetCare platform and services
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{categories.reduce((acc, cat) => acc + cat.faqs.length, 0)}</div>
            <div className="text-gray-600">Articles</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{categories.length}</div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {category.faqs.map((faq, faqIndex) => {
                  const isExpanded = expandedFaq === `${categoryIndex}-${faqIndex}`;
                  
                  return (
                    <div key={faqIndex} className="hover:bg-gray-50 transition-colors">
                      <button
                        onClick={() => toggleFaq(categoryIndex, faqIndex)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left"
                      >
                        <h3 className="font-semibold text-lg text-gray-900 pr-4">
                          {faq.q}
                        </h3>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="px-6 pb-5">
                          <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-md">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any articles matching "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        

      </div>
    </div>
  );
};

export default HelpCenter;