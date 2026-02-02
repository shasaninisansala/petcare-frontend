import React from 'react';
import { Heart, CheckCircle, MessageCircle, Users, ArrowLeft } from 'lucide-react';

export default function AdoptionSuccess({ referenceId = "#PC-98241", onFindAnother, onBackToHome }) {
  const nextSteps = [
    {
      step: 1,
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Review',
      description: 'We will check for compatibility with Cooper.'
    },
    {
      step: 2,
      icon: MessageCircle,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Interview',
      description: 'A quick call with the shelter to discuss your home.'
    },
    {
      step: 3,
      icon: Users,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      title: 'Meet & Greet',
      description: 'Visit Cooper at Happy Paws Shelter.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl p-8">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center">
            <div className="relative">
              <Heart className="w-16 h-16 text-green-500 fill-green-500" />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">👋</span>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Application Submitted Successfully!
          </h1>
          <p className="text-gray-700 leading-relaxed">
            Thank you for choosing to provide a loving home for . Relevant shelter
            will review your application within 24–48 hours.
          </p>
        </div>

        {/* Reference Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Reference ID</p>
              <p className="font-bold text-gray-900 text-lg">{referenceId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="font-semibold text-green-600">Under Review</p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">What's Next?</h2>
          
          <div className="space-y-6">
            {nextSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="flex gap-4">
                  <div className={`w-14 h-14 ${step.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-7 h-7 ${step.iconColor}`} />
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-bold text-gray-900 mb-1">
                      {step.step}. {step.title}
                    </h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onFindAnother}
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
          >
            Find Another One
          </button>
          <button
            onClick={onBackToHome}
            className="w-full py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
