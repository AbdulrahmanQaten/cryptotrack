import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3, Wallet, Newspaper, TrendingUp, Shield, Zap, Globe, Search, Fuel, Briefcase } from 'lucide-react';

const About = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: t('about.feature1'),
      description: t('about.fastDesc'),
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: t('about.feature2'),
      description: t('about.secureDesc'),
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: t('about.feature3'),
      description: t('about.fastDesc'),
    },
    {
      icon: <Newspaper className="w-8 h-8" />,
      title: t('about.feature4'),
      description: t('about.multilingualDesc'),
    },
  ];

  const stats = [
    { value: '10+', label: t('about.stats.cryptos') },
    { value: '24/7', label: t('about.stats.updates') },
    { value: '100%', label: t('about.stats.free') },
    { value: '2', label: t('about.stats.languages') },
  ];

  const appFeatures = [
    { icon: <Wallet className="w-6 h-6" />, text: t('home.subtitle') },
    { icon: <Search className="w-6 h-6" />, text: t('market.search').replace('...', '') },
    { icon: <TrendingUp className="w-6 h-6" />, text: t('about.feature1') },
    { icon: <Fuel className="w-6 h-6" />, text: t('about.feature3') },
    { icon: <Briefcase className="w-6 h-6" />, text: t('about.feature2') },
  ];

  return (
    <div className="page-container">
      {/* Hero */}
      <section className="text-center py-12 md:py-20">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Globe className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{t('about.title')}</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('about.subtitle')}
        </p>
      </section>

      {/* App Features List */}
      <section className="flat-card p-6 md:p-8 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {appFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border-2 border-primary/10 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-primary">{feature.icon}</div>
              <span className="font-medium text-sm">{feature.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="flat-card p-8 md:p-12 mb-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('about.mission')}</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('about.missionText')}
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flat-card p-6 text-center animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</p>
            <p className="text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="mb-12">
        <h2 className="section-title text-center">{t('about.features')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flat-card p-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="flat-card p-8 md:p-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{t('about.whyChoose')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-success" />
            </div>
            <h3 className="font-bold mb-2">{t('about.secure')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('about.secureDesc')}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold mb-2">{t('about.fast')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('about.fastDesc')}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-warning" />
            </div>
            <h3 className="font-bold mb-2">{t('about.multilingual')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('about.multilingualDesc')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
