/**
 * AgriShift — Landing Page Controller
 * Serves structured marketing, hero, feature, and platform information.
 */

exports.getLandingContent = (req, res) => {
  const landingData = {
    platform: {
      name: 'AgriShift',
      tagline: 'Global Agricultural Intelligence & Explainable Crop Rotation',
      initiative: 'NASA Space Apps Challenge 2026',
    },
    hero: {
      badge: 'AI-POWERED AGRICULTURE',
      heading: 'Grow Smarter. Farm Better. Shape the Future.',
      description:
        'Transform agricultural decisions with intelligent crop predictions, real-world land insights, and climate-aware recommendations.',
      primaryCta: 'Explore Predictions',
      secondaryCta: 'Discover More',
      supportingLine: 'Data-driven insights for sustainable agriculture.',
      heroImage: {
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
        alt: 'Aerial panoramic view of fertile green agricultural farmland and modern crop plantations bathed in sunlight',
      },
    },
    howItWorks: {
      heading: 'From Farm Data to Smarter Decisions',
      subheading: 'A transparent three-step pipeline bridging Earth observation data with actionable agronomy.',
      steps: [
        {
          stepNumber: 1,
          title: 'Explore Your Land',
          description: 'Understand geographical and environmental conditions.',
          icon: 'map-pin',
        },
        {
          stepNumber: 2,
          title: 'AI-Powered Analysis',
          description: 'Analyze agricultural information through machine learning.',
          icon: 'cpu',
        },
        {
          stepNumber: 3,
          title: 'Get Crop Recommendations',
          description: 'Discover suitable agricultural opportunities.',
          icon: 'sprout',
        },
      ],
    },
    ctaSection: {
      heading: 'Ready to Make Smarter Farming Decisions?',
      description:
        'Connect real-world agricultural conditions with climate-aware intelligence for resilient harvests.',
      buttonText: 'Start Your Prediction',
      route: '/prediction',
    },
    footer: {
      brand: 'AgriShift',
      description:
        'Global agricultural intelligence platform combining FAO/IIASA GAEZ v5 agro-ecological modeling and NASA POWER satellite agroclimatology.',
      links: [
        { label: 'Home', href: '#home' },
        { label: 'Explore Land', href: '#explore-land' },
        { label: 'Crop Insights', href: '#crop-insights' },
        { label: 'About', href: '#about' },
      ],
      copyright: '© 2026 AgriShift. NASA Space Apps Challenge 2026. All rights reserved.',
    },
  };

  res.status(200).json({
    success: true,
    data: landingData,
  });
};
