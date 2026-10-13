import {LegalPage} from '../components/LegalPage';
import {privacy} from '../content';
import {mount} from './mount';

mount(<LegalPage eyebrow="Your information" title="Privacy policy." intro={privacy.intro} updated={privacy.updated} sections={privacy.sections} />);
