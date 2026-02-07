import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51Swx9nA3rFJxEmnvusGqGzUTGOGKEVRAhgyOXhWzZNoOO8BDncTV062FPCSXP36W5y3Ia56SJtttABJm1jPrPHmu00bTKhRRpT');

function DonationPaymentForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [donationRequestId, setDonationRequestId] = useState(null);
  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState(0);
  const [shelter, setShelter] = useState({});
  
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    console.log('🔍 Payment Page State:', state);
    
    if (!state) {
      console.error('❌ No state provided');
      navigate('/');
      return;
    }
    
    // Extract data from state
    const {
      purpose: statePurpose = '',
      amount: stateAmount = 0,
      donationRequestId: stateRequestId,
      donationRequest,
      shelter: stateShelter
    } = state;
    
    // Determine donation request ID
    const requestId = stateRequestId || 
                     (donationRequest && donationRequest.id) || 
                     null;
    
    // Determine shelter info
    const shelterInfo = stateShelter || 
                       donationRequest || 
                       { title: 'Animal Shelter', id: 1, name: 'Animal Shelter' };
    
    if (requestId) {
      setDonationRequestId(requestId);
      console.log('✅ Found donationRequestId:', requestId);
    } else {
      console.error('❌ No donationRequestId found in state');
      setErrorMessage('Donation information missing. Please start over.');
    }
    
    setPurpose(statePurpose);
    setAmount(stateAmount);
    setShelter(shelterInfo);
    
  }, [state, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (!stripe || !elements) {
      setErrorMessage('Stripe not loaded yet');
      setLoading(false);
      return;
    }

    // Validate donationRequestId
    if (!donationRequestId) {
      setErrorMessage('Donation request ID missing. Please start over.');
      setLoading(false);
      return;
    }

    if (!purpose || amount <= 0) {
      setErrorMessage('Invalid donation details. Please check purpose and amount.');
      setLoading(false);
      return;
    }

    try {
      console.log('🚀 Starting payment process...');
      console.log('📊 Donation Details:', {
        amount: amount,
        purpose: purpose,
        donationRequestId: donationRequestId,
        shelterTitle: shelter.title,
        shelterId: shelter.id
      });

      // 🔧 STEP 1: Create PaymentIntent via backend
      console.log('📤 Creating PaymentIntent with donationRequestId:', donationRequestId);
      const paymentIntentResponse = await axios.post(
        'http://localhost:8084/api/payments/create-payment-intent',
        {
          amount: Math.round(amount * 100), // Convert dollars to cents
          donationRequestId: donationRequestId, // Use the actual ID
          purpose: purpose,
          title: shelter.title || 'General Donation',
          shelterId: shelter.id || 1
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );

      console.log('✅ PaymentIntent response:', paymentIntentResponse.data);
      
      const { clientSecret, paymentIntentId } = paymentIntentResponse.data;

      if (!clientSecret) {
        throw new Error('No client secret received from server');
      }

      // 🔧 STEP 2: Get card element
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // 🔧 STEP 3: Confirm the payment with Stripe
      console.log('💳 Processing payment with Stripe...');
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: donorName || 'Anonymous Donor',
              email: email || undefined
            }
          }
        }
      );

      if (error) {
        console.error('❌ Stripe payment error:', error);
        setErrorMessage(error.message || 'Payment failed');
        setLoading(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('✅ Payment successful!', paymentIntent);
        
        // 🔧 STEP 4: Save donation to database via backend
        try {
          console.log('💾 Saving donation record to database...');
          const saveResponse = await axios.post(
            'http://localhost:8084/api/payments/payment-success',
            {
              paymentIntentId: paymentIntent.id,
              donationRequestId: donationRequestId, // Use the same ID
              amount: amount,
              purpose: purpose,
              donorName: donorName || 'Anonymous Donor',
              donorEmail: email || null,
              shelterId: shelter.id || 1,
              shelterName: shelter.title || 'Animal Shelter'
            },
            {
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );
          
          console.log('✅ Donation saved successfully:', saveResponse.data);
          
          // 🔧 STEP 5: Navigate to success page
          navigate('/donation-success', { 
            state: { 
              amount: amount,
              purpose: purpose,
              shelterName: shelter.title || 'Animal Shelter',
              donorName: donorName || 'Anonymous Donor',
              email: email || '',
              transactionId: paymentIntent.id,
              donationId: saveResponse.data.donationId,
              donationRequestId: saveResponse.data.donationRequestId || donationRequestId,
              date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            },
            replace: true
          });
          
        } catch (saveError) {
          console.error('⚠️ Error saving donation record:', saveError);
          
          const warningMessage = `Payment succeeded! However, there was an issue saving your donation record. Please contact support with transaction ID: ${paymentIntent.id}`;
          
          alert(warningMessage);
          
          navigate('/donation-success', { 
            state: { 
              amount: amount,
              purpose: purpose,
              shelterName: shelter.title || 'Animal Shelter',
              donorName: donorName || 'Anonymous Donor',
              email: email || '',
              transactionId: paymentIntent.id,
              warning: warningMessage,
              date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            },
            replace: true
          });
        }
      } else {
        console.log('⚠️ PaymentIntent status:', paymentIntent?.status);
        setErrorMessage(`Payment not completed. Status: ${paymentIntent?.status}`);
        setLoading(false);
      }

    } catch (error) {
      console.error('❌ Payment process error:', error);
      
      if (error.response) {
        console.error('Backend Error:', error.response.data);
        
        if (error.response.status === 400) {
          setErrorMessage('Invalid request: ' + (error.response.data.error || 'Please check your information.'));
        } else if (error.response.status === 500) {
          setErrorMessage('Server error: ' + (error.response.data.error || 'Please try again later.'));
        } else if (error.response.data && error.response.data.error) {
          setErrorMessage(`Error: ${error.response.data.error}`);
        } else {
          setErrorMessage(`Server error (${error.response.status})`);
        }
      } else if (error.request) {
        console.error('No response received');
        setErrorMessage('Cannot connect to payment server. Please check:');
        setErrorMessage(prev => prev + '\n• Is backend running on port 8080?');
        setErrorMessage(prev => prev + '\n• Check console for CORS errors');
      } else if (error.code === 'ECONNABORTED') {
        setErrorMessage('Request timeout. Please try again.');
      } else {
        setErrorMessage('Payment failed: ' + error.message);
      }
      setLoading(false);
    }
  };

  // Card element styling
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
      },
    },
    hidePostalCode: false,
  };

  // Helper function to format amount
  const formatAmount = (amount) => {
    return parseFloat(amount).toFixed(2);
  };

  // If no state, show loading
  if (!state) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirm Your Donation</h1>
          <p className="text-gray-600">Secure payment powered by Stripe</p>
        </div>

        {/* Donation Summary */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 mb-8 border border-green-100">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-bold text-lg text-gray-900">{shelter.title || 'Animal Shelter Fund'}</p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Purpose:</span> {purpose}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Donation Request ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{donationRequestId || 'Not found'}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-green-600">${formatAmount(amount)}</p>
              <p className="text-xs text-gray-500 mt-1">Total Amount</p>
            </div>
          </div>
        </div>

        {!donationRequestId && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">⚠️ Missing Donation Information</p>
            <p className="text-sm text-red-600 mt-1">
              Donation request ID not found. Please go back and try again.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition"
            >
              Go Back
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Donor Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Your Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                placeholder="John Doe"
              />
              <p className="text-xs text-gray-500 mt-1">
                This name will appear on your receipt
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                placeholder="john@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll send a receipt to this email
              </p>
            </div>
          </div>

          {/* Card Details */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-800">Payment Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credit or Debit Card *
              </label>
              <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
                <CardElement options={cardElementOptions} />
              </div>
              
              {/* Test Card Info */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 mb-1">💳 Test Card for Development:</p>
                <div className="text-xs text-yellow-700 space-y-1">
                  <p><span className="font-mono">4242 4242 4242 4242</span></p>
                  <p>Any future expiry date (e.g., 12/34)</p>
                  <p>Any 3-digit CVC (e.g., 123)</p>
                  <p>Any 5-digit ZIP (e.g., 12345)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Payment Error</h3>
                  <div className="mt-1 text-sm text-red-700 whitespace-pre-line">
                    {errorMessage}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !stripe || !donationRequestId}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Your Donation...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Donate ${formatAmount(amount)}
              </span>
            )}
          </button>

          {/* Security Info */}
          <div className="space-y-4 pt-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-blue-800">🔒 Secure & Encrypted</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Your payment is processed securely through Stripe. We never store your card details.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-green-800">📝 Instant Receipt</p>
                  <p className="text-sm text-green-700 mt-1">
                    You'll receive a donation receipt immediately after payment. All donations are tax-deductible.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              <span className="block mb-1">
                By donating, you agree to our Terms of Service and Privacy Policy.
              </span>
              <span className="block">
                💡 This is a test transaction. No real money will be charged.
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DonationPaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <DonationPaymentForm />
    </Elements>
  );
}
