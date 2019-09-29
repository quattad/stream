/**
 * Runs before the execution of every test file
 */

console.log('\n Run setupTests... \n')

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() });