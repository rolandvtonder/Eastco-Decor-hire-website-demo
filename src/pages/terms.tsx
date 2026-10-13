import {LegalPage} from '../components/LegalPage';
import {terms} from '../content';
import {mount} from './mount';

mount(<LegalPage eyebrow="Hire information" title="Hire terms & conditions." intro={terms.intro} updated={terms.updated} sections={terms.sections} />);
