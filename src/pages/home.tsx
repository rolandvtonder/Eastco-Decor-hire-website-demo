import {ClosingScene} from '../components/ClosingScene';
import {CollectionMenu} from '../components/CollectionMenu';
import {Countdown} from '../components/Countdown';
import {Layout} from '../components/Layout';
import {PhotoStage} from '../components/PhotoStage';
import {Story} from '../components/Story';
import {mount} from './mount';

mount(
  <Layout page="home">
    <PhotoStage />
    <Story />
    <CollectionMenu />
    <Countdown />
    <ClosingScene />
  </Layout>,
);
