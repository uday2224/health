import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TezLogo } from '@/components/TezLogo';
import { Stethoscope, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) return cleaned;
    return cleaned.slice(0, 10);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+91${phone}`,
      });

      if (error) throw error;

      setStep('otp');
      setCountdown(60);
      toast.success('OTP sent to your phone');

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: `+91${phone}`,
        token: otpCode,
        type: 'sms',
      });

      if (error) throw error;

      toast.success('Login successful!');
      navigate('/patient/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 to-secondary/10 items-center justify-center p-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Stethoscope className="w-16 h-16 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Welcome Back</h2>
          <p className="text-muted-foreground max-w-sm">
            "Hospital-quality care, delivered to your doorstep. Your health is our priority."
          </p>
        </motion.div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <TezLogo />
          </div>

          {step === 'phone' ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Login</h1>
                <p className="text-muted-foreground">Enter your phone number to get started</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary/50">
                    <span className="text-muted-foreground font-medium">+91</span>
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={handlePhoneChange}
                      maxLength={10}
                      className="border-0 p-0 focus-visible:ring-0"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSendOTP}
                  disabled={loading || phone.length !== 10}
                  className="w-full rounded-lg gap-2"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">New user? </span>
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Register here
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Verify OTP</h1>
                <p className="text-muted-foreground">Enter the 6-digit code sent to +91{phone}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-3 block">OTP Code</label>
                  <div className="flex gap-2 justify-between">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-2xl font-bold border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                      />
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full rounded-lg gap-2"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify OTP
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <button
                    onClick={() => {
                      setStep('phone');
                      setOtp(['', '', '', '', '', '']);
                    }}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    Change phone number
                  </button>
                </div>

                {countdown > 0 ? (
                  <p className="text-center text-sm text-muted-foreground">
                    Resend OTP in {countdown}s
                  </p>
                ) : (
                  <button
                    onClick={handleSendOTP}
                    className="w-full text-sm text-primary font-medium hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
