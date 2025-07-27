import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from '@/hooks/use-toast';
import { Smartphone, Zap, ArrowLeft } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Auth = () => {
  const { user, loading, signInWithOtp, verifyOtp } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="mobile-container flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Add + for international format
    if (digits.length > 0) {
      return '+' + digits;
    }
    return '';
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signInWithOtp(phone);
    
    if (error) {
      toast({
        title: "Error sending OTP",
        description: error.message || "Failed to send verification code",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Verification code sent",
        description: "Check your phone for the verification code",
      });
      setStep('otp');
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await verifyOtp(phone, otp);
    
    if (error) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      });
      setOtp('');
    }
    setIsLoading(false);
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setPhone(formatted);
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Header */}
      <div className="electric-gradient p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-4">
            <div className="electric-glow rounded-full p-3 bg-white/20 backdrop-blur-sm">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">ElectroScoot Support</h1>
          <p className="text-white/90 text-sm">Customer Support Portal</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 pt-8">
        <Card className="electric-shadow border-border/50">
          <CardHeader className="text-center space-y-4">
            {step === 'otp' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep('phone')}
                className="absolute top-4 left-4 p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            
            <div className="flex items-center justify-center">
              <div className="rounded-full p-3 bg-primary/10">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
            </div>
            
            <div>
              <CardTitle className="text-xl text-foreground">
                {step === 'phone' ? 'Welcome Back' : 'Enter Verification Code'}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {step === 'phone' 
                  ? 'Enter your phone number to get started'
                  : `We sent a 6-digit code to ${phone}`
                }
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="text-lg py-6 bg-background border-input focus:ring-primary focus:border-primary"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Include your country code (e.g., +1 for US)
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg electric-gradient hover:opacity-90 transition-smooth"
                  disabled={isLoading || !phone.trim()}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending Code...
                    </div>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="otp" className="text-foreground text-center block">
                    Verification Code
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                      disabled={isLoading}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg electric-gradient hover:opacity-90 transition-smooth"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify & Sign In'
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-6 text-base"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                >
                  Resend Code
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Need help? Contact our support team</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;