/**
 * Runs before the execution of every test file
 */

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() });

console.log('\n setupTests.js run! \n')