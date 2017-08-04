import _ from 'lodash';
import LocalizedStrings from 'react-localization';

const strings = new LocalizedStrings({
  en:{
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

    infoProviderTitle: 'Providers',

    infoCreatorsTitle: 'Creators',
    infoCreatorsDesc: 'Inspired, Designed, Developed by <em>Giannis Apostolidis</em>',

    errors401Title: 'Page Not Found',
    errors401Desc: 'Sorry, we couldn\'t find the page you were looking for. You may have mistyped the address or the page may have moved.',
    errors401Prompt: 'You could',

    errors500Title: 'Something went wrong',
    errors500Desc: 'We are experiencing an internal problem.',
    errors500Prompt: 'Please try again later.',
    errors500PromptFooter: 'That\'s all we know.',

    promptReading: 'Continue Reading News',

    exploreNews: 'Explore News',
    explore: 'Explore',

    or: 'or',
    by: 'by',
    close: 'close',

    articleReadFromWebsite: 'Read Article From Website',
    articleRedirectTitle: 'Too Small Article!',
    articleRedirectDesc: 'You will be redirected {0} in {1} sec',
    articleRedirectDescOriginal: 'at the Original Article',

    timeNotYet: 'not yet',
    timeNow: 'now',
    timeMinsAgo: 'mins ago',
    timeHoursAgo: 'hours ago',
    timeYesterday: 'yesterday',

    shareOnFacebook: 'Share on Facebook',
    shareOnTwitter: 'Share on Twitter',
    shareLink: 'Share Article Link',
    articleLink: 'Article Link',

    Country: 'UK',
    World: 'World',
    Auto: 'Auto',
    Tastes: 'Tastes',
    Science: 'Science',
    Travel: 'Travel',
    Showbiz: 'Showbiz',
    Technology: 'Technology',
    Politics: 'Politics',
    Lifestyle: 'Lifestyle',
    Economy: 'Economy',
    Sports: 'Sports',
    All:'All',
    category: 'category',
    provider: 'provider',

    keywords: 'news, rss, rss feed, real time, online news, latest news',

    timelineExploreDescription: 'Explore the latest news',
    timelineExploreKeywords: 'Explore',
    timelineExploreTitle: 'Explore News',

    timelineCategoryDescription: 'Read the latest news on ${0} category',

    timelineProviderDescription: 'Read the latest news from ${0}',

    timelineRegistrationDescription: 'Read the latest news from ${0}'
  },
  gr: {
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

    promptReading: 'Συνεχίσετε να Διαβάζετε Νέα',

    exploreNews: 'Πλοηγήσου στα Νέα',
    explore: 'Πλοηγήσου',

    or: 'ή',
    by: 'από',
    close: 'κλείσιμο',

    articleReadFromWebsite: 'Διαβάστε το άρθρο απο την Ιστοσελίδα',
    articleRedirectTitle: 'Πολύτ μικρό άρθρο!',
    articleRedirectDesc: 'Θα σας ανακατευθύνουμε {0} σε {1} δευτερόλεπτα',
    articleRedirectDescOriginal: 'στο πρωτότυπο άρθρο',

    timeNotYet: 'όχι ακόμα',
    timeNow: 'τώρα',
    timeMinsAgo: 'λεπτά πριν',
    timeHoursAgo: 'ώρες πριν',
    timeYesterday: 'χθες',

    shareOnFacebook: 'Κοινοποίησε στο Facebook',
    shareOnTwitter: 'Μοιράσου στο Twitter',
    shareLink: 'Μοιράσου τον σύνδεσμο του άρθρου',
    articleLink: 'Σύνδεσμος Άρθρου',

    Country: 'Ελλάδα',
    World: 'Κόσμος',
    Auto:	'Μοτο',
    Tastes: 'Γεύσεις',
    Science: 'Επιστήμη',
    Travel: 'Ταξίδια',
    Showbiz: 'Showbiz',
    Technology: 'Τεχνολογία',
    Politics: 'Πολιτικά',
    Lifestyle: 'Lifestyle',
    Economy: 'Oικονομία',
    Sports: 'Aθλητικά',
    All: 'Διάφορα',
    category: 'κατηγορία',
    provider: 'πάροχος'
  }
});

strings.trFc = (id) => {
  return _.upperFirst(strings[id]);
}

strings.trFa = (id) => {
  return _.startCase(strings[id]);
}

export default strings;
