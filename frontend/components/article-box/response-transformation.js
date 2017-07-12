export default function translate(entry) {
  if (entry.published) {
    entry.published = new Date(entry.published);
  }
  return entry;
}
