import { AppointmentSection } from '@/components/home/AppointmentSection';
import { ClothSection } from '@/components/home/ClothSection';
import { CollectionIndex } from '@/components/home/CollectionIndex';
import { FittingSection } from '@/components/home/FittingSection';
import { HomeOpening } from '@/components/home/HomeOpening';
import { LookbookStrip } from '@/components/home/LookbookStrip';
import { brand } from '@/lib/content/site';
import { pageMetadata } from '@/lib/seo';
import {
  getAppointmentSettings,
  getCollections,
  getHomePage,
  getLookbook,
  getSiteSettings,
} from '@/sanity/lib/queries';

export const metadata = pageMetadata({
  title: 'Visarto',
  description: brand.summary,
  path: '/',
});

/**
 * The homepage is a sequence, not a stack of modules.
 *
 * identity -> what is made -> where the fitting happens -> what cloth is ->
 * the appointment
 *
 * Each passage answers the question the previous one raises, and the ground
 * changes underfoot as it goes: chalk, paper, stone, midnight. That change is
 * what separates the sections, which is why none of them needs a label.
 */
export default async function HomePage() {
  const [page, collections, lookbook, appointment, settings] = await Promise.all([
    getHomePage(),
    getCollections(),
    getLookbook(),
    getAppointmentSettings(),
    getSiteSettings(),
  ]);

  return (
    <>
      <HomeOpening image={page?.heroImage} />
      <CollectionIndex collections={collections} />
      <FittingSection image={page?.fittingImage} settings={settings} />
      <ClothSection />
      <LookbookStrip items={lookbook} />
      <AppointmentSection settings={appointment} />
    </>
  );
}
