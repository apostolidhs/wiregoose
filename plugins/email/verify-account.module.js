
'use strict';

KlarkModule(module, 'emailVerifyAccountTmpl', (
  translations,
  emailBasicTmpl
) => {
  return { template };

  function template({user, verifyUrl} = {}) {
    if (!(user && verifyUrl)) {
      throw new Error('Invalid arguments');
    }

    const tr = translations.lang(user.lang);

    const to = user.email;
    const subject = tr('EMAIL_VERIFY_SUBJECT');

    const content = emailBasicTmpl.template({
      contentTitle: tr('EMAIL_VERIFY_TITLE'),
      contentBody: tr('EMAIL_VERIFY_BODY'),
      ctaUrl: verifyUrl,
      ctaTitle: tr('EMAIL_VERIFY_CTA')
    });

    return {to, subject, content};
  }

});
