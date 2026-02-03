import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255, 'Email too long'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long'),
  username: z.string().trim().min(2, 'Username must be at least 2 characters').max(50, 'Username too long').optional(),
});

const emailSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255, 'Email too long'),
});

const passwordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long'),
});

type AuthMode = 'signIn' | 'signUp' | 'forgotPassword' | 'resetPassword';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Check for password recovery flow
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'recovery') {
      setMode('resetPassword');
    }
  }, [searchParams]);

  useEffect(() => {
    if (user && !loading && mode !== 'resetPassword') {
      navigate('/home');
    }
  }, [user, loading, navigate, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === 'forgotPassword') {
        const result = emailSchema.safeParse({ email });
        if (!result.success) {
          toast.error(result.error.errors[0].message);
          return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?type=recovery`,
        });

        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Password reset email sent! Check your inbox.');
          setMode('signIn');
        }
        return;
      }

      if (mode === 'resetPassword') {
        const result = passwordSchema.safeParse({ password });
        if (!result.success) {
          toast.error(result.error.errors[0].message);
          return;
        }

        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Password updated successfully!');
          navigate('/home');
        }
        return;
      }

      // Sign in / Sign up flow
      const validationData = mode === 'signUp'
        ? { email, password, username: username || undefined }
        : { email, password };

      const result = authSchema.safeParse(validationData);
      if (!result.success) {
        toast.error(result.error.errors[0].message);
        return;
      }

      if (mode === 'signUp') {
        const { error } = await signUp(email, password, username);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Try signing in instead.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Account created successfully!');
          navigate('/home');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login')) {
            toast.error('Invalid email or password');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome back!');
          navigate('/home');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'signUp': return 'Create Account';
      case 'forgotPassword': return 'Reset Password';
      case 'resetPassword': return 'Set New Password';
      default: return 'Welcome Back';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signUp': return 'Join the frequency chamber';
      case 'forgotPassword': return 'Enter your email to receive a reset link';
      case 'resetPassword': return 'Enter your new password';
      default: return 'Sign in to continue';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-secondary/20 to-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border-hermetic rounded-xl p-8 shadow-sacred">
          {(mode === 'forgotPassword' || mode === 'resetPassword') && (
            <button
              type="button"
              onClick={() => setMode('signIn')}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </button>
          )}

          <div className="text-center mb-8">
            <h1 className="text-3xl font-display text-gradient-sacred mb-2">
              {getTitle()}
            </h1>
            <p className="text-muted-foreground">
              {getSubtitle()}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signUp' && (
              <div>
                <Label htmlFor="username">Username</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {mode !== 'resetPassword' && (
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            {(mode === 'signIn' || mode === 'signUp' || mode === 'resetPassword') && (
              <div>
                <Label htmlFor="password">{mode === 'resetPassword' ? 'New Password' : 'Password'}</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'resetPassword' ? 'Enter new password' : 'Enter your password'}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'resetPassword' && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="pl-10 pr-10"
                    required
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="sacred"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === 'signUp' ? (
                'Create Account'
              ) : mode === 'forgotPassword' ? (
                'Send Reset Link'
              ) : mode === 'resetPassword' ? (
                'Update Password'
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {mode === 'signIn' && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setMode('forgotPassword')}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot your password?
              </button>
            </div>
          )}

          {(mode === 'signIn' || mode === 'signUp') && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {mode === 'signUp' ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
