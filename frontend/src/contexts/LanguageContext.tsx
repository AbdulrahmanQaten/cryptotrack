import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.market": "Market",
    "nav.portfolio": "Portfolio",
    "nav.news": "News",
    "nav.about": "About",
    "nav.wallet": "Wallet Tracker",
    "nav.transaction": "Transaction Explorer",

    // Page Titles
    "title.home": "Blockchain Tracker",
    "title.market": "Cryptocurrency Market - Blockchain Tracker",
    "title.portfolio": "My Portfolio - Blockchain Tracker",
    "title.wallet": "Wallet Tracker - Blockchain Tracker",
    "title.transaction": "Transaction Explorer - Blockchain Tracker",
    "title.news": "Crypto News - Blockchain Tracker",
    "title.about": "About - Blockchain Tracker",

    // Home
    "home.title": "Blockchain Tracker",
    "home.subtitle":
      "Track cryptocurrency prices, market trends, and manage your portfolio in real-time",
    "home.explore": "Explore Market",
    "home.trending": "Trending Coins",
    "home.topGainers": "Top Gainers",
    "home.topLosers": "Top Losers",
    "home.marketCap": "Total Market Cap",
    "home.volume": "24h Volume",
    "home.dominance": "BTC Dominance",
    "home.coins": "Active Coins",

    // Market
    "market.title": "Cryptocurrency Market",
    "market.subtitle":
      "Explore all cryptocurrencies with real-time prices and market data",
    "market.search": "Search coins...",
    "market.rank": "Rank",
    "market.name": "Name",
    "market.price": "Price",
    "market.change24h": "24h Change",
    "market.marketCap": "Market Cap",
    "market.volume": "Volume (24h)",

    // Portfolio
    "portfolio.title": "My Portfolio",
    "portfolio.subtitle":
      "Track your cryptocurrency investments and performance",
    "portfolio.totalValue": "Total Value",
    "portfolio.totalChange": "Total Change (24h)",
    "portfolio.coin": "Coin",
    "portfolio.selectCoin": "Select a coin",
    "portfolio.amount": "Amount",
    "portfolio.buyPrice": "Buy Price (USD)",
    "portfolio.addAssetDescription":
      "Add a cryptocurrency to your portfolio to track its performance.",
    "portfolio.value": "Value",
    "portfolio.pl": "P/L",
    "portfolio.addAsset": "Add Asset",
    "portfolio.holdings": "Your Holdings",
    "portfolio.noAssets": "No assets yet. Add your first cryptocurrency!",

    // Wallet Tracker
    "wallet.title": "Wallet Tracker",
    "wallet.subtitle":
      "Track any wallet balance and transactions across multiple blockchains",
    "wallet.enterAddress": "Enter wallet address (0x...)",
    "wallet.search": "Search",
    "wallet.address": "Wallet Address",
    "wallet.balance": "Balance",
    "wallet.txCount": "Transaction Count",
    "wallet.transactions": "Recent Transactions",
    "wallet.noTransactions": "No transactions found",
    "wallet.success": "Success",
    "wallet.failed": "Failed",
    "wallet.copied": "Copied to clipboard",
    "wallet.invalidAddress": "Please enter a valid wallet address",
    "wallet.error": "Failed to load wallet data",
    "wallet.viewOnExplorer": "View on Explorer",
    "wallet.emptyTitle": "Enter a Wallet Address",
    "wallet.emptyDescription":
      "Select a network and enter a wallet address above to view its balance and transactions",
    "wallet.network": "Network",

    // Transaction Explorer
    "transaction.title": "Transaction Explorer",
    "transaction.subtitle": "Search and explore blockchain transactions",
    "transaction.enterHash": "Enter transaction hash (0x...)",
    "transaction.search": "Search",
    "transaction.details": "Transaction Details",
    "transaction.hash": "Transaction Hash",
    "transaction.from": "From",
    "transaction.to": "To",
    "transaction.value": "Value",
    "transaction.gasFee": "Gas Fee",
    "transaction.gasUsed": "Gas Used",
    "transaction.gasPrice": "Gas Price",
    "transaction.blockNumber": "Block Number",
    "transaction.timestamp": "Timestamp",
    "transaction.success": "Success",
    "transaction.failed": "Failed",
    "transaction.additionalInfo": "Additional Information",
    "transaction.invalidHash": "Please enter a valid transaction hash",
    "transaction.error": "Transaction not found",
    "transaction.viewOnExplorer": "View on Explorer",
    "transaction.emptyTitle": "Enter a Transaction Hash",
    "transaction.emptyDescription":
      "Select a network and enter a transaction hash above to view its details",

    // News
    "news.title": "Crypto News",
    "news.subtitle":
      "Stay updated with the latest blockchain and cryptocurrency news",
    "news.readMore": "Read More",
    "news.latest": "Latest News",

    // About
    "about.title": "About Blockchain Tracker",
    "about.subtitle":
      "Your comprehensive platform for cryptocurrency tracking and analysis",
    "about.mission": "Our Mission",
    "about.missionText":
      "To provide accurate, real-time cryptocurrency data and insights to help users make informed investment decisions.",
    "about.features": "Features",
    "about.feature1": "Real-time price tracking",
    "about.feature2": "Portfolio management",
    "about.feature3": "Market analysis",
    "about.feature4": "Latest crypto news",
    "about.whyChoose": "Why Choose Us?",
    "about.secure": "Secure & Reliable",
    "about.secureDesc":
      "Your data is safe with industry-standard security practices.",
    "about.fast": "Fast & Accurate",
    "about.fastDesc":
      "Real-time data with minimal latency for accurate tracking.",
    "about.multilingual": "Multilingual",
    "about.multilingualDesc":
      "Available in English and Arabic with full RTL support.",
    "about.stats.cryptos": "Cryptocurrencies",
    "about.stats.updates": "Real-time Updates",
    "about.stats.free": "Free to Use",
    "about.stats.languages": "Languages",

    // Coin Details
    "coinDetails.notFound": "Coin not found",
    "coinDetails.website": "Website",
    "coinDetails.explorer": "Explorer",
    "coinDetails.priceChart": "Price Chart",
    "coinDetails.price": "Price",
    "coinDetails.marketStats": "Market Statistics",
    "coinDetails.marketCap": "Market Cap",
    "coinDetails.volume24h": "24h Volume",
    "coinDetails.high24h": "24h High",
    "coinDetails.low24h": "24h Low",
    "coinDetails.priceChanges": "Price Changes",
    "coinDetails.change24h": "24h",
    "coinDetails.change7d": "7d",
    "coinDetails.change30d": "30d",
    "coinDetails.change1y": "1y",
    "coinDetails.supplyInfo": "Supply Information",
    "coinDetails.circulatingSupply": "Circulating Supply",
    "coinDetails.totalSupply": "Total Supply",
    "coinDetails.maxSupply": "Max Supply",
    "coinDetails.athAtl": "All-Time High / Low",
    "coinDetails.ath": "All-Time High",
    "coinDetails.atl": "All-Time Low",
    "coinDetails.about": "About",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error loading data",
    "common.seeAll": "See All",
    "common.back": "Back",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.refresh": "Refresh",

    // Footer
    "footer.rights": "All rights reserved",
    "footer.quickLinks": "Quick Links",
    "footer.madeBy": "Made by",
    "footer.creatorName": "Abdulrahman Amer Qaten",
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.market": "السوق",
    "nav.portfolio": "المحفظة",
    "nav.news": "الأخبار",
    "nav.about": "حول",
    "nav.wallet": "متتبع المحفظة",
    "nav.transaction": "مستكشف المعاملات",

    // Page Titles
    "title.home": "متتبع البلوكتشين",
    "title.market": "سوق العملات الرقمية - متتبع البلوكتشين",
    "title.portfolio": "محفظتي - متتبع البلوكتشين",
    "title.wallet": "متتبع المحفظة - متتبع البلوكتشين",
    "title.transaction": "مستكشف المعاملات - متتبع البلوكتشين",
    "title.news": "أخبار الكريبتو - متتبع البلوكتشين",
    "title.about": "حول - متتبع البلوكتشين",

    // Home
    "home.title": "متتبع البلوكتشين",
    "home.subtitle":
      "تتبع أسعار العملات الرقمية واتجاهات السوق وإدارة محفظتك في الوقت الفعلي",
    "home.explore": "استكشف السوق",
    "home.trending": "العملات الرائجة",
    "home.topGainers": "أعلى الرابحين",
    "home.topLosers": "أعلى الخاسرين",
    "home.marketCap": "إجمالي القيمة السوقية",
    "home.volume": "حجم التداول 24س",
    "home.dominance": "هيمنة البيتكوين",
    "home.coins": "العملات النشطة",

    // Market
    "market.title": "سوق العملات الرقمية",
    "market.subtitle":
      "استكشف جميع العملات الرقمية مع الأسعار الفورية وبيانات السوق",
    "market.search": "ابحث عن العملات...",
    "market.rank": "الترتيب",
    "market.name": "الاسم",
    "market.price": "السعر",
    "market.change24h": "التغير 24س",
    "market.marketCap": "القيمة السوقية",
    "market.volume": "الحجم (24س)",

    // Portfolio
    "portfolio.title": "محفظتي",
    "portfolio.subtitle": "تتبع استثماراتك وأداء محفظتك",
    "portfolio.totalValue": "القيمة الإجمالية",
    "portfolio.totalChange": "التغير الإجمالي (24س)",
    "portfolio.addAsset": "إضافة أصل",
    "portfolio.holdings": "ممتلكاتك",
    "portfolio.coin": "العملة",
    "portfolio.selectCoin": "اختر عملة",
    "portfolio.amount": "الكمية",
    "portfolio.buyPrice": "سعر الشراء (USD)",
    "portfolio.addAssetDescription": "أضف عملة رقمية إلى محفظتك لتتبع أدائها.",
    "portfolio.value": "القيمة",
    "portfolio.pl": "الربح/الخسارة",
    "portfolio.noAssets": "لا توجد أصول بعد. أضف أول عملة رقمية!",

    // Wallet Tracker
    "wallet.title": "متتبع المحفظة",
    "wallet.subtitle":
      "تتبع رصيد أي محفظة ومعاملاتها عبر شبكات بلوكتشين متعددة",
    "wallet.enterAddress": "أدخل عنوان المحفظة (0x...)",
    "wallet.search": "بحث",
    "wallet.address": "عنوان المحفظة",
    "wallet.balance": "الرصيد",
    "wallet.txCount": "عدد المعاملات",
    "wallet.transactions": "المعاملات الأخيرة",
    "wallet.noTransactions": "لا توجد معاملات",
    "wallet.success": "ناجحة",
    "wallet.failed": "فاشلة",
    "wallet.copied": "تم النسخ",
    "wallet.invalidAddress": "الرجاء إدخال عنوان محفظة صحيح",
    "wallet.error": "فشل في تحميل بيانات المحفظة",
    "wallet.viewOnExplorer": "عرض على المستكشف",
    "wallet.emptyTitle": "أدخل عنوان المحفظة",
    "wallet.emptyDescription":
      "اختر شبكة وأدخل عنوان محفظة أعلاه لعرض رصيدها ومعاملاتها",
    "wallet.network": "الشبكة",

    // Transaction Explorer
    "transaction.title": "مستكشف المعاملات",
    "transaction.subtitle": "ابحث واستكشف معاملات البلوكتشين",
    "transaction.enterHash": "أدخل هاش المعاملة (0x...)",
    "transaction.search": "بحث",
    "transaction.details": "تفاصيل المعاملة",
    "transaction.hash": "هاش المعاملة",
    "transaction.from": "من",
    "transaction.to": "إلى",
    "transaction.value": "القيمة",
    "transaction.gasFee": "رسوم الغاز",
    "transaction.gasUsed": "الغاز المستخدم",
    "transaction.gasPrice": "سعر الغاز",
    "transaction.blockNumber": "رقم الكتلة",
    "transaction.timestamp": "التاريخ والوقت",
    "transaction.success": "ناجحة",
    "transaction.failed": "فاشلة",
    "transaction.additionalInfo": "معلومات إضافية",
    "transaction.invalidHash": "الرجاء إدخال هاش معاملة صحيح",
    "transaction.error": "المعاملة غير موجودة",
    "transaction.viewOnExplorer": "عرض على المستكشف",
    "transaction.emptyTitle": "أدخل هاش المعاملة",
    "transaction.emptyDescription":
      "اختر شبكة وأدخل هاش المعاملة أعلاه لعرض تفاصيلها",

    // News
    "news.title": "أخبار الكريبتو",
    "news.subtitle": "ابق على اطلاع بآخر أخبار البلوكتشين والعملات الرقمية",
    "news.readMore": "اقرأ المزيد",
    "news.latest": "آخر الأخبار",

    // About
    "about.title": "عن متتبع البلوكتشين",
    "about.subtitle": "منصتك الشاملة لتتبع وتحليل العملات الرقمية",
    "about.mission": "مهمتنا",
    "about.missionText":
      "توفير بيانات ورؤى دقيقة وفورية للعملات الرقمية لمساعدة المستخدمين على اتخاذ قرارات استثمارية مدروسة.",
    "about.features": "الميزات",
    "about.feature1": "تتبع الأسعار الفوري",
    "about.feature2": "إدارة المحفظة",
    "about.feature3": "تحليل السوق",
    "about.feature4": "آخر أخبار الكريبتو",
    "about.whyChoose": "لماذا تختارنا؟",
    "about.secure": "آمن وموثوق",
    "about.secureDesc": "بياناتك آمنة مع ممارسات الأمان القياسية.",
    "about.fast": "سريع ودقيق",
    "about.fastDesc": "بيانات فورية مع تأخير أقل للتتبع الدقيق.",
    "about.multilingual": "متعدد اللغات",
    "about.multilingualDesc": "متوفر بالعربية والإنجليزية مع دعم كامل لـ RTL.",
    "about.stats.cryptos": "عملة رقمية",
    "about.stats.updates": "تحديثات فورية",
    "about.stats.free": "مجاني الاستخدام",
    "about.stats.languages": "لغات",

    // Coin Details
    "coinDetails.notFound": "العملة غير موجودة",
    "coinDetails.website": "الموقع",
    "coinDetails.explorer": "المستكشف",
    "coinDetails.priceChart": "مخطط السعر",
    "coinDetails.price": "السعر",
    "coinDetails.marketStats": "إحصائيات السوق",
    "coinDetails.marketCap": "القيمة السوقية",
    "coinDetails.volume24h": "حجم التداول 24س",
    "coinDetails.high24h": "أعلى سعر 24س",
    "coinDetails.low24h": "أدنى سعر 24س",
    "coinDetails.priceChanges": "تغيرات السعر",
    "coinDetails.change24h": "24س",
    "coinDetails.change7d": "7أيام",
    "coinDetails.change30d": "30يوم",
    "coinDetails.change1y": "سنة",
    "coinDetails.supplyInfo": "معلومات العرض",
    "coinDetails.circulatingSupply": "العرض المتداول",
    "coinDetails.totalSupply": "إجمالي العرض",
    "coinDetails.maxSupply": "الحد الأقصى للعرض",
    "coinDetails.athAtl": "أعلى / أدنى سعر تاريخي",
    "coinDetails.ath": "أعلى سعر تاريخي",
    "coinDetails.atl": "أدنى سعر تاريخي",
    "coinDetails.about": "عن",

    // Common
    "common.loading": "جاري التحميل...",
    "common.error": "خطأ في تحميل البيانات",
    "common.seeAll": "عرض الكل",
    "common.back": "رجوع",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.delete": "حذف",
    "common.edit": "تعديل",
    "common.refresh": "تحديث",

    // Footer
    "footer.rights": "جميع الحقوق محفوظة",
    "footer.quickLinks": "روابط سريعة",
    "footer.madeBy": "صنع بواسطة",
    "footer.creatorName": "عبد الرحمن عامر قاطن",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    if (saved === "en" || saved === "ar") return saved;

    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("ar")) return "ar";
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;

    // Update page title based on current route
    const path = window.location.pathname;
    let titleKey = "title.home";

    if (path.includes("/market")) titleKey = "title.market";
    else if (path.includes("/portfolio")) titleKey = "title.portfolio";
    else if (path.includes("/wallet")) titleKey = "title.wallet";
    else if (path.includes("/transaction")) titleKey = "title.transaction";
    else if (path.includes("/news")) titleKey = "title.news";
    else if (path.includes("/about")) titleKey = "title.about";

    document.title = translations[language][titleKey] || "Blockchain Tracker";
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
