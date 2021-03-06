import upperCase from 'lodash/upperCase';
import upperFirst from 'lodash/upperFirst';
import startCase from 'lodash/startCase';
import LocalizedStrings from 'react-localization';

const strings = new LocalizedStrings({
  en:{
    gr: 'Ελληνικά', // this is exception
    en: 'English',

    infoAboutTitle: 'About',
    infoAboutWiregoose: 'What is Wiregoose',
    infoAboutWiregooseDesc: 'Wiregoose is an online news transmitter, bringing news in your screen from all over the world, adapted in your country in allmost real time.',
    infoAboutWorking: 'How is it working',
    infoAboutWorkingRss: 'Rss feeds',
    infoAboutWorkingRssDesc: 'RSS (Rich Site Summary) is a format for delivering regularly changing web content. Many news-related sites, weblogs and other online publishers syndicate their content as an RSS Feed to whoever wants it.',
    infoAboutWorkingRssDescWiregoose: 'Wiregoose is connected with the media by their RSS feeds. We respect the resource by marking the provider name in each entry.',
    infoAboutCrawler: 'Article extractor',
    infoAboutCrawlerDesc: `In order to optimize the article reading experience, Wiregoose is using a <b>custom article extractor</b>.
        We extract only the article’s content, removing all the unnecessary content, like ads, side menus, etc.
        We optimizing the readability of the article and we offer it to you.`,
    infoAboutCrawlerDescMozilla: `Internally, we use the <a href="https://github.com/mozilla/readability" target="_blank">Mozilla Firefox Reader View</a>.`,

    profileTitle: 'Profile',
    bookmarksTitle: 'Bookmarks',
    infoProviderTitle: 'Providers',
    infoCreatorsTitle: 'Creators',
    infoCreatorsDesc: 'Inspired, Designed, Developed by <em>John Apostolidis</em>',

    errors401Title: 'Page Not Found',
    errors401Desc: 'Sorry, we couldn\'t find the page you were looking for. You may have mistyped the address or the page may have moved.',
    errors401Prompt: 'You could',

    errors500Title: 'Something went wrong',
    errors500Desc: 'We are experiencing an internal problem.',
    errors500Prompt: 'Please try again later.',
    errors500PromptFooter: 'That\'s all we know.',

    promptServerError400Title: 'Oups!',
    promptServerError400: 'We are experiencing some issues',

    promptServerErrorNotConnected: 'Check your internet connectivity and try again',
    promptServerErrorNotConnectedTitle: 'Not connected',

    offlineModeTitle: 'It seems that you have not internet connection',
    offlineModeDescription: 'Don\'t worry, you can still explore some news',
    offlineModeCta: 'Continue reading some stored articles',

    loadingMore: 'Loading More...',
    loadingArticle: 'Loading Article...',

    goBack: 'Back',
    backToLogin: 'Back to login',

    promptReading: 'Continue Reading News',

    exploreNews: 'Explore News',
    explore: 'Explore',

    refresh: 'refresh',
    or: 'or',
    by: 'by',
    close: 'close',

    articleReadFromWebsite: 'Read From Website',
    articleRedirectTitle: 'Too Small Article!',
    articleRedirectDesc: 'You will be redirected {0} in {1} sec',
    articleRedirectDescOriginal: 'at the Original Article',

    articleFbTitle: 'Join our group',
    articleFbSubHeader: 'Keep updated with the latest news',

    timeNotYet: 'not yet',
    timeNow: 'now',
    timeMinsAgo: 'mins ago',
    timeHoursAgo: 'hours ago',
    timeYesterday: 'yesterday',

    shareOnFacebook: 'Share on Facebook',
    shareOnTwitter: 'Share on Twitter',
    shareLink: 'Share Article Link',
    articleLink: 'Article Link',

    bookmark: 'bookmark',
    bookmarkMaxLengthDisabled: 'Too many saved articles, please remove some saved articles in order to proceed',
    bookmarkLoginPrompt: 'Bookmark the article after you login',

    Country: 'UK',
    World: 'World',
    Politics: 'Politics',
    Economy: 'Economy',
    Society: 'Society',
    Environment: 'Environment',
    Technology: 'Technology',
    Travel: 'Travel',
    Science: 'Science',
    Food: 'Tastes',
    Entertainment: 'Entertainment',
    Sports: 'Sports',
    Auto: 'Auto',
    Lifestyle: 'Lifestyle',
    Culture: 'Culture',
    Health: 'Health',
    Viral: 'Viral',
    Media: 'Media',

    category: 'category',
    categories: 'Categories',
    provider: 'provider',
    providers: 'Providers',
    categoriesPerProvider: 'Categories per Provider',

    timelineExploreDescription: 'Explore the latest news',
    timelineExploreKeywords: 'Explore',
    timelineExploreTitle: 'Explore News',

    timelineBookmarksDescription: 'Articles you have saved',
    timelineBookmarksKeywords: 'saved articles,bookmarks',
    timelineBookmarksTitle: 'Saved Articles',
    timelineBookmarksBlankSlateTitle: 'You have not bookmark articles yet',
    timelineBookmarksBlankSlateDesc: 'and bookmark articles for reading',

    timelineCategoryDescription: 'Read the latest news on {0} category',

    timelineProviderDescription: 'Read the latest news from {0}',

    timelineRegistrationDescription: 'Read the latest news from {0}',

    articleDescription: '{0}. By Wiregoose.com.',

    invalidEmail: 'Invalid email',
    invalidPassword: 'Too short, at least {0} characters',
    emailAlreadyExist: 'Email already exist',
    invalidCredentials: 'Please check your email or password.',
    validateUserAccount: 'To validate your account, we have sent you an email. Click the link in your email',
    validateUserAccountSuccess: 'Your account has validated',

    logout: 'logout',
    signIn: 'Sign in',
    signUp: 'Sign up',
    loginViaFacebook: 'Sign in with Facebook',
    signupViaFacebook: 'Sign up with Facebook',
    createAccountPrompt: 'create an account',
    signInPrompt: 'sign in to your account',
    forgotPasswordPrompt: 'Forgot your password?',
    forgotPasswordInfo: ['Enter your email address to reset your password.',
      'We will sent you a temporary password'],
    resetPasswordCta: 'Send verification email',
    resetPasswordSuccess: 'An email has been sent to <b>{0}</b>. Follow the directions in the email to reset your password.'
  },
  gr: {
    en: 'English',
    gr: 'Ελληνικά',

    infoAboutTitle: 'About',
    infoAboutWiregoose: 'Τι είναι το Wiregoose',
    infoAboutWiregooseDesc: 'Το Wiregoose είναι ένας αναμεταδότης νέων, φέρνοντας στην οθόνη σας καταχωρήσεις από όλον τον κόσμο, προσαρμοσμένο στην χώρα σας σε σχεδόν πραγματικό χρόνο.',
    infoAboutWorking: 'Πως λειτουργεί',
    infoAboutWorkingRss: 'Rss feeds',
    infoAboutWorkingRssDesc: 'RSS (Εμπλουτισμένη Σύνοψη Ιστοτόπου) είναι μία συγκεκριμένη μορφή που εξάγει το περιεχόμενο ενός ιστότοπου. Πολλές ιστοσελίδες που σχετίζονται με την επικαιρότητα, blogs, και online εκδοτικοί οίκοι έχουν συμβατό το περιεχόμενο τους σε Rss μορφή για να έχει πρόσβαση οποιοσδήποτε επιθυμεί.',
    infoAboutWorkingRssDescWiregoose: 'Το Wiregoose είναι συνδεδεμένο με τα μέσα ενημέρωσης χρησιμοποιώντας τα RSS feeds τους. Σεβόμαστε την πηγή που λαμβάνουμε τα νέα, επισημαίνοντας σε κάθε καταχώρηση το όνομα της πηγής.',
    infoAboutCrawler: 'Εξαγωγέας άρθρου',
    infoAboutCrawlerDesc: `Για να βελτιστοποιηθεί η εμπειρία ανάγνωση των άρθρων, το Wiregoose χρησιμοποιεί ένα δικό του
            εξαγωγέα άρθρου, προσαρμοσμένο στις ανάγκες του κάθε ιστότοπου από τους πάροχους που υποστηρίζουμε.
            Με τον τρόπο αυτό, λαμβάνουμε μόνο το περιεχόμενο του άρθρου, το επεξεργαζόμαστε με στόχο την μέγιστη
            ευαναγνωστικότητα του, και σας το προσφέρουμε`,
    infoAboutCrawlerDescMozilla: `Εσωτερικά, χρησιμοποιούμε τον <a href="https://github.com/mozilla/readability" target="_blank">Mozilla Firefox Reader View</a>.`,

    profileTitle: 'Προφίλ',
    bookmarksTitle: 'Αποθηκευμένα',
    infoProviderTitle: 'Πάροχοι',
    infoCreatorsTitle: 'Δημιουργοί',
    infoCreatorsDesc: 'Εμπνεύστηκε, Σχεδιάστηκε, Αναπτύχθηκε από τον <em>Γιάννη Αποστολίδη</em>',

    errors401Title: 'Η Σελίδα δεν Βρέθηκε',
    errors401Desc: 'Συγνώμη, δεν μπορέσαμε να βρούμε την σελίδα που ψάχνετε. Ίσως έχετε πληκτρολογήσει λανθασμένα την διεύθυνση ή η σελίδα έχει μετακινηθεί.',
    errors401Prompt: 'Μπορείτε να',

    errors500Title: 'Κάτι πήγε στραβά',
    errors500Desc: 'Έχει δημιουργηθεί ένα εσωτερικό πρόβλημα',
    errors500Prompt: 'Παρακαλώ προσπαθήστε ξανά.',
    errors500PromptFooter: 'Αυτό είναι το μόνο που ξέρουμε.',

    promptServerError400Title: 'Όπα!',
    promptServerError400: 'Αντιμετωπίζουμε κάποια προβλήματα',

    promptServerErrorNotConnected: 'Ελέγξτε την σύνδεση σας και προσπαθήστε ξανά',
    promptServerErrorNotConnectedTitle: 'Δεν υπάρχει σύνδεση',

    offlineModeTitle: 'Δεν υπάρχει σύνδεση στο internet',
    offlineModeDescription: 'Όλα καλά, συνεχίσετε να διαβάζεται αποθηκευμένα άρθρα',
    offlineModeCta: 'Συνεχίσετε να διαβάζεται αποθηκευμένα άρθρα',

    loadingMore: 'Φόρτωση...',
    loadingArticle: 'Φόρτωση Άρθρου...',

    goBack: 'Πίσω',
    backToLogin: 'Πίσω στην είσοδο χρήστη',

    promptReading: 'Συνεχίσετε να Διαβάζετε Νέα',

    exploreNews: 'Πλοηγήσου στα Νέα',
    explore: 'Πλοηγήσου',

    refresh: 'ανανεώστε',
    or: 'ή',
    by: 'από',
    close: 'κλείσιμο',

    articleReadFromWebsite: 'Διαβάστε το απο την Ιστοσελίδα',
    articleRedirectTitle: 'Πολύ μικρό άρθρο!',
    articleRedirectDesc: 'Θα σας ανακατευθύνουμε {0} σε {1} δευτερόλεπτα',
    articleRedirectDescOriginal: 'στο πρωτότυπο άρθρο',

    articleFbTitle: 'Γίνε μέλος της μεγάλης παρέας',
    articleFbSubHeader: 'Ενημερώσου άμεσα με τα πιο προσφατα νέα',

    timeNotYet: 'όχι ακόμα',
    timeNow: 'τώρα',
    timeMinsAgo: 'λεπτά πριν',
    timeHoursAgo: 'ώρες πριν',
    timeYesterday: 'χθες',

    shareOnFacebook: 'Κοινοποίησε στο Facebook',
    shareOnTwitter: 'Μοιράσου στο Twitter',
    shareLink: 'Μοιράσου τον σύνδεσμο του άρθρου',
    articleLink: 'Σύνδεσμος Άρθρου',

    bookmark: 'αποθήκευση',
    bookmarkMaxLengthDisabled: 'Έχετε αποθηκεύσει πολλά άρθρα, μπορείτε να αφαιρέσετε κάποια αποθηκευμένα',
    bookmarkLoginPrompt: 'Αποθήκευσε το άρθρο μόλις συνδεθείς',

    Country: 'Ελλάδα',
    World: 'Κόσμος',
    Politics: 'Πολιτικά',
    Economy: 'Oικονομία',
    Science: 'Επιστήμη',
    Society: 'Κοινωνία',
    Environment: 'περιβάλλον',
    Technology: 'Τεχνολογία',
    Travel: 'Ταξίδια',
    Food: 'Γεύσεις',
    Entertainment: 'Ψυχαγωγία',
    Sports: 'Αθλητικά',
    Auto: 'Auto',
    Lifestyle: 'Lifestyle',
    Culture: 'Πολιτισμός',
    Health: 'Υγεία',
    Viral: 'Viral',
    Media: 'Media',

    category: 'κατηγορία',
    categories: 'Κατηγορίες',
    provider: 'πάροχος',
    providers: 'Πάροχοι',
    categoriesPerProvider: 'Κατηγορίες ανα Πάροχο',

    timelineExploreDescription: 'Πλοηγήσου στα πιο πρόσφατα νέα',
    timelineExploreKeywords: 'Πλοηγήσου',
    timelineExploreTitle: 'Πλοηγήσου στα Νέα',

    timelineBookmarksDescription: 'Άρθρα που έχεις αποθηκεύσει',
    timelineBookmarksKeywords: 'αποθηκευμένα άρθρα,σελιδοδείκτης',
    timelineBookmarksTitle: 'Αποθηκευμένα Άρθρα',
    timelineBookmarksBlankSlateTitle: 'Δεν έχετε αποθηκεύσει άρθρα',
    timelineBookmarksBlankSlateDesc: 'και αποθηκεύστε άρθρα για μελλοντική ανάγνωση',

    timelineCategoryDescription: 'Πλοηγηθείτε στα πιο πρόσφατα {0} νέα',

    timelineProviderDescription: 'Πλοηγηθείτε στα πιο πρόσφατα από {0}',

    timelineRegistrationDescription: 'Πλοηγηθείτε στα πιο πρόσφατα από {0}',

    articleDescription: '{0}. Απο το Wiregoose.com.',

    invalidEmail: 'Μη έγκυρο email',
    invalidPassword: 'Πολύ μικρό, τουλάχιστον {0} χαρακτήρες',
    emailAlreadyExist: 'To email υπάρχει ήδη',
    invalidCredentials: 'Ελέγξτε το email ή το password σας',
    validateUserAccount: 'Για να επαληθεύσετε τον λογαριασμό σας, σας έχουμε στείλει ένα email. Κάντε κλικ στο σύνδεσμο που υπάρχει στο email',
    validateUserAccountSuccess: 'Ο λογαριασμός σας έχει επικυρωθεί',

    logout: 'Αποσύνδεση',
    signIn: 'Είσοδος',
    signUp: 'Εγγραφή',
    loginViaFacebook: 'Είσοδος μέσω Facebook',
    signupViaFacebook: 'Εγγραφή μέσω Facebook',
    createAccountPrompt: 'δημιουργήστε λογαριασμό',
    signInPrompt: 'κάνετε είσοδο στον λογαριασμό σας',
    forgotPasswordPrompt: 'Ξέχασες τον κωδικό σου?',
    forgotPasswordInfo: ['Πληκτρολογείστε το email σας για να επαναφέρουμε τον κωδικό σας.',
      'Θα σας αποστείλουμε έναν προσωρινό κωδικό.'],
    resetPasswordCta: 'Αποστολή email επαναφοράς',
    resetPasswordSuccess: 'Ένα email στάλθηκε στο <b>{0}</b>. Ακολουθήστε τις οδηγίες στο email για να επαναφέρετε τον κωδικό σας.'
  }
});

strings.trFl = (id) => {
  return upperCase(strings[id]);
}

strings.trFc = (id) => {
  return upperFirst(strings[id]);
}

strings.trFa = (id) => {
  return startCase(strings[id]);
}

export default strings;
