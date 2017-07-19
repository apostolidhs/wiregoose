export default function translate(entry) {
  if (entry.lastRssRegistrationFetch) {
    entry.lastRssRegistrationFetch = new Date(entry.lastRssRegistrationFetch);
  }
  return entry;
}
