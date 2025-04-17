module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr'],
    localeDetection: true,
  },
  defaultNS: 'common',
  ns: ['common', 'forms', 'errors', 'procedures'],
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
