'use strict';

KlarkModule(module, 'emailResetPasswordTmpl', (
  translations,
  emailBasicTmpl,
  config
) => {
  return { template };

  function template({user, password} = {}) {
    if (!(user && password)) {
      throw new Error('Invalid arguments');
    }

    const tr = translations.lang(user.lang);

    const to = user.email;
    const subject = tr('EMAIL_RESET_SUBJECT');
    const ctaUrl = `${config.SECURE_APP_URL}/auth/login`;

    const content = emailBasicTmpl.template({
      contentTitle: tr('EMAIL_RESET_TITLE'),
      contentBody: tr('EMAIL_RESET_BODY')(password),
      ctaUrl,
      ctaTitle: tr('EMAIL_RESET_CTA')
    });

    return {to, subject, content};
  }

});
