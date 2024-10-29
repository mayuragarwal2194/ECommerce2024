import React, { useState, useEffect } from 'react';
import { auth } from '../../../Config/firebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { toast } from 'react-toastify';

const PhoneVerification = ({ mobileNumber, onVerificationComplete }) => {
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize ReCaptcha
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible', // Use 'normal' if you want to display the ReCAPTCHA
          'expired-callback': () => {
            toast.error('ReCAPTCHA expired, please try again.');
            if (window.recaptchaVerifier) {
              window.recaptchaVerifier.clear();
              window.recaptchaVerifier = null;
            }
            setupRecaptcha();

          },
        }
      );
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!mobileNumber || !/^\+\d{10,15}$/.test(mobileNumber)) {
      toast.error('Please enter a valid phone number with country code.');
      return;
    }

    setLoading(true);
    setupRecaptcha(); // Setup ReCAPTCHA before sending OTP
    const appVerifier = window.recaptchaVerifier;

    try {
      const result = await signInWithPhoneNumber(auth, mobileNumber, appVerifier);
      setConfirmationResult(result); // Store the confirmation result
      setIsOtpSent(true);
      toast.success('OTP sent successfully!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || !confirmationResult) {
      toast.error('Please enter the OTP.');
      return;
    }

    setLoading(true);
    try {
      await confirmationResult.confirm(otp); // Confirm the OTP
      toast.success('Phone number verified successfully!');
      onVerificationComplete(true); // Pass true to indicate successful verification

      // Clear reCAPTCHA after successful OTP verification
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      if (error.code === 'auth/invalid-verification-code') {
        toast.error('The OTP entered is incorrect. Please try again.');
      } else {
        toast.error('Failed to verify OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };


  // Cleanup ReCAPTCHA on component unmount
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, []);

  return (
    <div className='mb-4'>
      {!isOtpSent ? (
        <div>
          <div id="recaptcha-container"></div>
          <button onClick={handleSendOtp} disabled={loading} className='mt-3 px-2 py-1 rounded btn-primary'>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>

      ) : (
        <div>
          <h3>Enter the OTP</h3>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <button onClick={handleVerifyOtp} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PhoneVerification;