import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Translation type
type TranslationKey = string;
type Translations = { [key: string]: string | Translations };

// English translations
const en: Translations = {
    common: {
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        create: 'Create',
        search: 'Search...',
        export: 'Export CSV',
        signOut: 'Sign Out',
    },
    nav: {
        overview: 'Overview',
        platform: 'Platform',
        clientsRestaurants: 'Clients & Restaurants',
        contactRequests: 'Contact Requests',
        settings: 'Settings',
        agency: 'Agency',
        projects: 'Projects',
        gameSetup: 'Game Setup',
        customization: 'Customization',
        prizes: 'Prizes',
        data: 'Data',
        collectedLeads: 'Collected Leads',
    },
    dashboard: {
        title: 'Overview',
        description: 'Overview of your spin wheel performance',
        totalSpins: 'Total Spins',
        uniqueUsers: 'Unique Users',
        prizesWon: 'Prizes Won',
        activeProjects: 'Active Projects',
        totalTenants: 'Total Tenants',
        platformOwner: 'Platform Owner Dashboard',
        globalStats: 'Global Statistics',
        viewStatsFor: 'View stats for:',
        allProjects: 'All Projects',
        engagementOverview: 'Engagement Overview',
        last30Days: 'Last 30 days',
        noSpinData: 'No spin data yet. Share your wheel link to start collecting data!',
        prizeBreakdown: 'Prize Breakdown',
        shareLinkTitle: 'Your Game is Live!',
        shareLinkDesc: 'Share this link with your customers or display it on a tablet at your venue to start collecting leads.',
        copyLink: 'Copy Link',
    },
    settings: {
        title: 'Settings',
        dashboardTheme: 'Dashboard Theme',
        themeDesc: 'Choose how the admin dashboard appears',
        light: 'Light',
        dark: 'Dark',
        system: 'System',
        active: 'Active',
        language: 'Language',
        languageDesc: 'Choose your preferred language',
        english: 'English',
        arabic: 'العربية',
        accountType: 'Account Type',
        platformOwner: 'Platform Owner',
        email: 'Email',
        spinWheelTheme: 'Spin Wheel Theme Presets',
        themePresetsDesc: 'Choose a complete theme or customize individual colors below',
        businessInfo: 'Business Information',
        logoUrl: 'Company Logo URL',
        displayName: 'Display Name',
        customColors: 'Custom Color Palette',
        customColorsDesc: 'Fine-tune individual colors or select a preset above',
        primaryColor: 'Primary Color',
        primaryColorDesc: 'Main buttons, accents, wheel pointer',
        secondaryColor: 'Secondary Color',
        secondaryColorDesc: 'Secondary accents, highlights',
        backgroundColor: 'Background Color',
        backgroundColorDesc: 'Page background',
        textColor: 'Text Color',
        textColorDesc: 'Main text and headings',
        livePreview: 'Live Preview',
        previewDesc: 'How your spin game will look:',
        spinButton: 'SPIN THE WHEEL',
        prizeWon: 'Prize Won!',
        readyToApply: 'Ready to apply your theme?',
        changesVisible: 'Changes will be visible immediately on your spin game',
        saveTheme: 'Save Theme',
        savingTheme: 'Saving Theme...',
    },
    tenants: {
        title: 'Clients & Restaurants',
        description: 'Manage all platform signups',
        tabs: {
            tenants: 'Tenants',
            allProjects: 'All Projects',
            allPrizes: 'All Prizes',
            allLeads: 'All Leads',
        },
        table: {
            tenant: 'Tenant',
            email: 'Email',
            status: 'Status',
            projects: 'Projects',
            spins: 'Spins',
            signedUp: 'Signed Up',
            project: 'Project',
            prizes: 'Prizes',
            created: 'Created',
            prize: 'Prize',
            type: 'Type',
            quantity: 'Quantity',
            unlimited: 'Unlimited',
            name: 'Name',
            phone: 'Phone',
            prizeWon: 'Prize Won',
            date: 'Date',
        },
    },
    landing: {
        tagline: 'Spin. Win. Collect Leads.',
        heroTitle: 'Turn Every Customer Into a Lead',
        heroDesc: 'Gamify your business with interactive spin wheels. Engage customers, collect data, boost sales.',
        getStarted: 'Get Started Free',
        watchDemo: 'Watch Demo',
        features: {
            title: 'Why Choose Spinify?',
            free: 'Completely Free',
            freeDesc: 'No hidden costs. Start collecting leads today.',
            easy: 'Easy Setup',
            easyDesc: 'Create your wheel in minutes. No coding required.',
            analytics: 'Real-time Analytics',
            analyticsDesc: 'Track spins, leads, and engagement instantly.',
            customizable: 'Fully Customizable',
            customizableDesc: 'Match your brand colors and prizes.',
        },
        cta: {
            title: 'Ready to Gamify Your Business?',
            desc: 'Join restaurants and retailers using Spinify to collect leads.',
            button: 'Start Now - It\'s Free',
        },
        footer: {
            poweredBy: 'Powered by Seqed Games',
            rights: 'All rights reserved',
        },
    },
    auth: {
        login: 'Login',
        register: 'Register',
        email: 'Email',
        password: 'Password',
        businessName: 'Business Name',
        ownerName: 'Owner Name',
        createAccount: 'Create Account',
        alreadyHaveAccount: 'Already have an account?',
        dontHaveAccount: "Don't have an account?",
        loginHere: 'Login here',
        registerHere: 'Register here',
    },
};

// Arabic translations
const ar: Translations = {
    common: {
        loading: 'جاري التحميل...',
        save: 'حفظ',
        cancel: 'إلغاء',
        delete: 'حذف',
        edit: 'تعديل',
        create: 'إنشاء',
        search: 'بحث...',
        export: 'تصدير CSV',
        signOut: 'تسجيل الخروج',
    },
    nav: {
        overview: 'نظرة عامة',
        platform: 'المنصة',
        clientsRestaurants: 'العملاء والمطاعم',
        contactRequests: 'طلبات التواصل',
        settings: 'الإعدادات',
        agency: 'الوكالة',
        projects: 'المشاريع',
        gameSetup: 'إعداد اللعبة',
        customization: 'التخصيص',
        prizes: 'الجوائز',
        data: 'البيانات',
        collectedLeads: 'العملاء المحتملين',
    },
    dashboard: {
        title: 'نظرة عامة',
        description: 'نظرة عامة على أداء عجلة الحظ',
        totalSpins: 'إجمالي الدورات',
        uniqueUsers: 'المستخدمين الفريدين',
        prizesWon: 'الجوائز المربوحة',
        activeProjects: 'المشاريع النشطة',
        totalTenants: 'إجمالي العملاء',
        platformOwner: 'لوحة تحكم مالك المنصة',
        globalStats: 'الإحصائيات العالمية',
        viewStatsFor: 'عرض إحصائيات:',
        allProjects: 'جميع المشاريع',
        engagementOverview: 'نظرة عامة على التفاعل',
        last30Days: 'آخر 30 يوم',
        noSpinData: 'لا توجد بيانات دورات بعد. شارك رابط العجلة لبدء جمع البيانات!',
        prizeBreakdown: 'تفاصيل الجوائز',
        shareLinkTitle: 'لعبتك جاهزة!',
        shareLinkDesc: 'شارك هذا الرابط مع عملائك أو اعرضه على جهاز لوحي في مكانك لبدء جمع العملاء.',
        copyLink: 'نسخ الرابط',
    },
    settings: {
        title: 'الإعدادات',
        dashboardTheme: 'سمة لوحة التحكم',
        themeDesc: 'اختر كيف تظهر لوحة التحكم',
        light: 'فاتح',
        dark: 'داكن',
        system: 'النظام',
        active: 'نشط',
        language: 'اللغة',
        languageDesc: 'اختر لغتك المفضلة',
        english: 'English',
        arabic: 'العربية',
        accountType: 'نوع الحساب',
        platformOwner: 'مالك المنصة',
        email: 'البريد الإلكتروني',
        spinWheelTheme: 'قوالب سمة عجلة الحظ',
        themePresetsDesc: 'اختر سمة كاملة أو خصص الألوان أدناه',
        businessInfo: 'معلومات العمل',
        logoUrl: 'رابط شعار الشركة',
        displayName: 'اسم العرض',
        customColors: 'لوحة الألوان المخصصة',
        customColorsDesc: 'ضبط الألوان الفردية أو اختر قالب أعلاه',
        primaryColor: 'اللون الأساسي',
        primaryColorDesc: 'الأزرار الرئيسية، اللمسات، مؤشر العجلة',
        secondaryColor: 'اللون الثانوي',
        secondaryColorDesc: 'اللمسات الثانوية، الإبرازات',
        backgroundColor: 'لون الخلفية',
        backgroundColorDesc: 'خلفية الصفحة',
        textColor: 'لون النص',
        textColorDesc: 'النص الرئيسي والعناوين',
        livePreview: 'معاينة مباشرة',
        previewDesc: 'كيف ستبدو لعبة الدوران:',
        spinButton: 'أدر العجلة',
        prizeWon: 'فزت بجائزة!',
        readyToApply: 'جاهز لتطبيق السمة؟',
        changesVisible: 'ستظهر التغييرات فوراً على لعبة الدوران',
        saveTheme: 'حفظ السمة',
        savingTheme: 'جاري حفظ السمة...',
    },
    tenants: {
        title: 'العملاء والمطاعم',
        description: 'إدارة جميع التسجيلات في المنصة',
        tabs: {
            tenants: 'العملاء',
            allProjects: 'جميع المشاريع',
            allPrizes: 'جميع الجوائز',
            allLeads: 'جميع العملاء المحتملين',
        },
        table: {
            tenant: 'العميل',
            email: 'البريد',
            status: 'الحالة',
            projects: 'المشاريع',
            spins: 'الدورات',
            signedUp: 'تاريخ التسجيل',
            project: 'المشروع',
            prizes: 'الجوائز',
            created: 'تاريخ الإنشاء',
            prize: 'الجائزة',
            type: 'النوع',
            quantity: 'الكمية',
            unlimited: 'غير محدود',
            name: 'الاسم',
            phone: 'الهاتف',
            prizeWon: 'الجائزة المربوحة',
            date: 'التاريخ',
        },
    },
    landing: {
        tagline: 'أدر. اربح. اجمع العملاء.',
        heroTitle: 'حوّل كل زائر إلى عميل',
        heroDesc: 'ألعب أعمالك مع عجلات الحظ التفاعلية. انخرط العملاء، اجمع البيانات، زد المبيعات.',
        getStarted: 'ابدأ مجاناً',
        watchDemo: 'شاهد العرض',
        features: {
            title: 'لماذا Spinify؟',
            free: 'مجاني بالكامل',
            freeDesc: 'لا تكاليف خفية. ابدأ جمع العملاء اليوم.',
            easy: 'إعداد سهل',
            easyDesc: 'أنشئ عجلتك في دقائق. لا حاجة للبرمجة.',
            analytics: 'تحليلات فورية',
            analyticsDesc: 'تتبع الدورات والعملاء والتفاعل فوراً.',
            customizable: 'قابل للتخصيص بالكامل',
            customizableDesc: 'طابق ألوان علامتك وجوائزك.',
        },
        cta: {
            title: 'جاهز لتحويل عملك إلى لعبة؟',
            desc: 'انضم للمطاعم والمتاجر التي تستخدم Spinify لجمع العملاء.',
            button: 'ابدأ الآن - مجاناً',
        },
        footer: {
            poweredBy: 'من Seqed Games',
            rights: 'جميع الحقوق محفوظة',
        },
    },
    auth: {
        login: 'تسجيل الدخول',
        register: 'إنشاء حساب',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        businessName: 'اسم العمل',
        ownerName: 'اسم المالك',
        createAccount: 'إنشاء حساب',
        alreadyHaveAccount: 'لديك حساب بالفعل؟',
        dontHaveAccount: 'ليس لديك حساب؟',
        loginHere: 'سجل الدخول هنا',
        registerHere: 'سجل هنا',
    },
};

const translations: { [key: string]: Translations } = { en, ar };

// Context type
interface LanguageContextType {
    language: 'en' | 'ar';
    setLanguage: (lang: 'en' | 'ar') => void;
    t: (key: string) => string;
    isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// Helper function to get nested value
const getNestedValue = (obj: Translations, path: string): string => {
    const keys = path.split('.');
    let current: any = obj;

    for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key];
        } else {
            return path; // Return key if not found
        }
    }

    return typeof current === 'string' ? current : path;
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<'en' | 'ar'>(() => {
        const saved = localStorage.getItem('language');
        return (saved === 'ar' || saved === 'en') ? saved : 'en';
    });

    const setLanguage = (lang: 'en' | 'ar') => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);

        // Update document direction and lang
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    };

    // Set initial direction
    useEffect(() => {
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);

    const t = (key: string): string => {
        return getNestedValue(translations[language], key);
    };

    const isRTL = language === 'ar';

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Hook
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export default LanguageContext;
