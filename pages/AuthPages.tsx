import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';

// Import firebase auth directly
import { firebaseAuth } from '../src/services/firebase';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, loginWithFirebase } = useData();
  const { language, setLanguage, isRTL } = useLanguage();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = {
    welcomeBack: language === 'ar' ? 'مرحباً بعودتك' : 'Welcome Back',
    manageYourCampaigns: language === 'ar' ? 'سجل الدخول لإدارة حملاتك' : 'Log in to manage your campaigns',
    continueWithGoogle: language === 'ar' ? 'المتابعة مع Google' : 'Continue with Google',
    orContinueWithEmail: language === 'ar' ? 'أو تابع بالبريد الإلكتروني' : 'or continue with email',
    email: language === 'ar' ? 'البريد الإلكتروني' : 'Email',
    password: language === 'ar' ? 'كلمة المرور' : 'Password',
    logIn: language === 'ar' ? 'تسجيل الدخول' : 'Log In',
    loggingIn: language === 'ar' ? 'جاري تسجيل الدخول...' : 'Logging in...',
    dontHaveAccount: language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?",
    signUp: language === 'ar' ? 'إنشاء حساب' : 'Sign Up',
    invalidEmail: language === 'ar' ? 'البريد أو كلمة المرور غير صحيحة' : 'Invalid email or password',
    loginFailed: language === 'ar' ? 'فشل تسجيل الدخول. حاول مرة أخرى.' : 'Login failed. Please try again.',
    signInCancelled: language === 'ar' ? 'تم إلغاء تسجيل الدخول' : 'Sign-in cancelled',
    popupBlocked: language === 'ar' ? 'تم حظر النافذة المنبثقة. يرجى السماح بها.' : 'Popup blocked. Please allow popups for this site.',
    googleFailed: language === 'ar' ? 'فشل تسجيل الدخول بـ Google. حاول مرة أخرى.' : 'Google sign-in failed. Please try again.',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError(t.invalidEmail);
      }
    } catch (err) {
      setError(t.loginFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      const user = await firebaseAuth.signInWithGoogle();
      if (user.email) {
        const success = await loginWithFirebase(user);
        if (success) {
          navigate('/admin/dashboard');
        } else {
          setError(t.loginFailed);
        }
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError(t.signInCancelled);
      } else if (err.code === 'auth/popup-blocked') {
        setError(t.popupBlocked);
      } else {
        setError(t.googleFailed);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl p-8 border border-border-light dark:border-border-dark">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="px-3 py-1.5 text-sm font-medium bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {language === 'en' ? '🇸🇦 العربية' : '🇺🇸 English'}
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.welcomeBack}</h1>
          <p className="text-slate-500">{t.manageYourCampaigns}</p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {t.continueWithGoogle}
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-surface-light dark:bg-surface-dark text-slate-500">{t.orContinueWithEmail}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-elevated-dark text-text-light dark:text-text-dark"
              required
              disabled={isLoading}
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-elevated-dark text-text-light dark:text-text-dark"
              required
              disabled={isLoading}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? t.loggingIn : t.logIn}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          {t.dontHaveAccount} <Link to="/signup" className="text-primary font-bold">{t.signUp}</Link>
        </p>
      </div>
    </div>
  );
};

export const SignupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'Starter';
  const navigate = useNavigate();
  const { register, loginWithFirebase } = useData();
  const { language, setLanguage, isRTL } = useLanguage();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: ''
  });

  const t = {
    createAccount: language === 'ar' ? 'إنشاء حساب' : 'Create Account',
    selectedPlan: language === 'ar' ? 'الخطة المختارة:' : 'Selected Plan:',
    signUpWithGoogle: language === 'ar' ? 'التسجيل بـ Google' : 'Sign up with Google',
    orContinueWithEmail: language === 'ar' ? 'أو تابع بالبريد الإلكتروني' : 'or continue with email',
    businessName: language === 'ar' ? 'اسم العمل' : 'Business Name',
    email: language === 'ar' ? 'البريد الإلكتروني' : 'Email',
    password: language === 'ar' ? 'كلمة المرور' : 'Password',
    createAccountBtn: language === 'ar' ? 'إنشاء الحساب' : 'Create Account',
    creatingAccount: language === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating Account...',
    alreadyHaveAccount: language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?',
    logIn: language === 'ar' ? 'تسجيل الدخول' : 'Log In',
    registrationFailed: language === 'ar' ? 'فشل التسجيل. حاول مرة أخرى.' : 'Registration failed. Please try again.',
    signUpCancelled: language === 'ar' ? 'تم إلغاء التسجيل' : 'Sign-up cancelled',
    popupBlocked: language === 'ar' ? 'تم حظر النافذة المنبثقة. يرجى السماح بها.' : 'Popup blocked. Please allow popups for this site.',
    googleFailed: language === 'ar' ? 'فشل التسجيل بـ Google. حاول مرة أخرى.' : 'Google sign-up failed. Please try again.',
    businessNamePlaceholder: language === 'ar' ? 'اسم عملك' : 'Your Business Name',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await register({
        businessName: formData.businessName,
        email: formData.email,
        password: formData.password
      });

      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError(t.registrationFailed);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || t.registrationFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setIsLoading(true);

    try {
      const user = await firebaseAuth.signInWithGoogle();
      if (user.email) {
        const success = await loginWithFirebase(user);
        if (success) {
          navigate('/admin/dashboard');
        } else {
          setError(t.registrationFailed);
        }
      }
    } catch (err: any) {
      console.error('Google sign-up error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError(t.signUpCancelled);
      } else if (err.code === 'auth/popup-blocked') {
        setError(t.popupBlocked);
      } else {
        setError(t.googleFailed);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl p-8 border border-border-light dark:border-border-dark">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="px-3 py-1.5 text-sm font-medium bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {language === 'en' ? '🇸🇦 العربية' : '🇺🇸 English'}
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.createAccount}</h1>
          <p className="text-slate-500">{t.selectedPlan} <span className="capitalize font-bold text-primary">{plan}</span></p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {t.signUpWithGoogle}
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-surface-light dark:bg-surface-dark text-slate-500">{t.orContinueWithEmail}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.businessName}</label>
            <input
              type="text"
              required
              className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-elevated-dark text-text-light dark:text-text-dark"
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              disabled={isLoading}
              placeholder={t.businessNamePlaceholder}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.email}</label>
            <input
              type="email"
              required
              className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-elevated-dark text-text-light dark:text-text-dark"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isLoading}
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.password}</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-elevated-dark text-text-light dark:text-text-dark"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={isLoading}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? t.creatingAccount : t.createAccountBtn}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          {t.alreadyHaveAccount} <Link to="/login" className="text-primary font-bold">{t.logIn}</Link>
        </p>
      </div>
    </div>
  );
};