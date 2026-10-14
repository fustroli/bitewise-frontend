import Library from '@/app/(modules)/[lang]/dashboard/components/Library/Library';
import { fetchLibraryCounts } from '@/app/(modules)/[lang]/dashboard/api';

/** Loads the counts the library cards show. */
const LibrarySection = async () => (
  <Library counts={await fetchLibraryCounts()} />
);

export default LibrarySection;
