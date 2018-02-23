export default function translate(entry) {
  if (entry.createdAt) {
    entry.createdAt = new Date(entry.createdAt);
  }
  return entry;
}
