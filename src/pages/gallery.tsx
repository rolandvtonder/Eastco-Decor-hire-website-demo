import {ClosingScene} from '../components/ClosingScene';
import {GalleryGrid} from '../components/GalleryGrid';
import {Layout, Sheet} from '../components/Layout';
import {MoodScroller} from '../components/MoodScroller';
import {PageHero} from '../components/PageHero';
import {RealEvents} from '../components/RealEvents';
import {pageHeroes} from '../content';
import {mount} from './mount';

mount(
  <Layout page="gallery">
    <PageHero {...pageHeroes.gallery} />
    <Sheet dark>
      <MoodScroller />
    </Sheet>
    <RealEvents />
    <GalleryGrid />
    <ClosingScene />
  </Layout>,
);
