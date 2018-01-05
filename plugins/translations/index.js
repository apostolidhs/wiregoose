
'use strict';

KlarkModule(module, 'translations', function(
  _
) {
  const translations = getTranslations();
  const langIdxMap = {
    'en': 0,
    'gr': 1
  };

  return { lang };

  function lang(langId) {
    const langIdx = langIdxMap[langId] || 0;
    return id => translations[id][langIdx];
  }

  function getTranslations() {
    return {
      EMAIL_VERIFY_SUBJECT: [
        `Wiregoose - Please verify your email address`,
        `Wiregoose - Παρακαλούμε επαληθεύστε τη διεύθυνση email σας`
      ],
      EMAIL_VERIFY_TITLE: [
        `Verify your email address`,
        `Επαληθεύστε τη διεύθυνση email σας`
      ],
      EMAIL_VERIFY_BODY: [
        `We're ready to activate your account. All we need to do is make sure this is your email address.`,
        `Είμαστε έτοιμοι να ενεργοποιήσουμε τον λογαριασμό σας. Το μόνο που χρειάζεται είναι να σιγουρευτούμε ότι αυτή είναι η διεύθυνση του email σας.`
      ],
      EMAIL_VERIFY_CTA: [
        `Verify Address`,
        `Επαλήθευση διεύθυνσης`
      ],

      EMAIL_RESET_SUBJECT: [
        `Wiregoose - Password change confirmation`,
        `Wiregoose - Επαλήθευση αλλαγής κωδικού`
      ],
      EMAIL_RESET_TITLE: [
        `Your password has been reset`,
        `Ο κωδικός σας έχει επαναφερθεί`
      ],
      EMAIL_RESET_BODY: [
        i => `<p>Your temporary password is <b>${i}</b></p>
          <p>Please change your temporary password in your settings</p>`,
        i => `<p>Ο προσωρινός κωδικός πρόσβασης είναι <b>${i}</b></p>
          <p>Αλλάξτε τον προσωρινό κωδικό πρόσβασης στις ρυθμίσεις σας</p>`
      ],
      EMAIL_RESET_CTA: [
        `Change password`,
        `Αλλαγή κωδικού`
      ]
    };
  }
});
