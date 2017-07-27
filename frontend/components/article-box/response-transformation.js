export default function translate(entry) {
  if (entry.published) {
    entry.published = new Date(entry.published);
  }
  if (entry.created) {
    entry.created = new Date(entry.created);
  }
  if (entry.modified) {
    entry.modified = new Date(entry.modified);
  }
  return entry;
}
