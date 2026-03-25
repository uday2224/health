import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TezLogo } from '@/components/TezLogo';
import { ArrowRight, Loader2, ChevronLeft, Heart, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'role' | 'phone' | 'otp' | 'profile';
type Role = 'patient' | 'nurse';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<Role | null>(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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

      setStep('profile');
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw authError || new Error('No user found');

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          role,
          name,
          email: email || null,
        },
      });

      if (updateError) throw updateError;

      // Create user profile in database
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          phone: `+91${phone}`,
          name,
          email: email || null,
          role,
          avatar_url: null,
          created_at: new Date().toISOString(),
        });

      if (profileError && profileError.code !== 'PGRST116') throw profileError;

      toast.success('Registration successful!');
      navigate(role === 'patient' ? '/patient/dashboard' : '/nurse/onboarding');
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <TezLogo />
        </div>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-8">
          {['role', 'phone', 'otp', 'profile'].map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                ['role', 'phone', 'otp', 'profile'].indexOf(step) >= i
                  ? 'bg-primary'
                  : 'bg-border'
              }`}
            />
          ))}
        </div>

        {step === 'role' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Who are you?</h1>
              <p className="text-muted-foreground">Choose your role to get started</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setRole('patient');
                  setStep('phone');
                }}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  role === 'patient'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">I need care</p>
                    <p className="text-sm text-muted-foreground">Book nurses for home care</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setRole('nurse');
                  setStep('phone');
                }}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  role === 'nurse'
                    ? 'border-secondary bg-secondary/5'
                    : 'border-border hover:border-secondary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold">I provide care</p>
                    <p className="text-sm text-muted-foreground">Become a verified nurse</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary font-medium hover:underline">
                Login here
              </Link>
            </div>
          </div>
        )}

        {step === 'phone' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setStep('role')}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-3xl font-bold">Your Phone</h1>
            </div>
            <p className="text-muted-foreground">We'll send you an OTP to verify</p>

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
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setStep('phone')}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-3xl font-bold">Verify OTP</h1>
            </div>
            <p className="text-muted-foreground">Enter the 6-digit code sent to +91{phone}</p>

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

        {step === 'profile' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Complete Profile</h1>
              <p className="text-muted-foreground">Just a few more details</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name *</label>
                <Input
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Email (Optional)</label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg"
                />
              </div>

              <Button
                onClick={handleCompleteProfile}
                disabled={loading || !name.trim()}
                className="w-full rounded-lg gap-2"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
