import React from 'react';
import { shallow } from 'enzyme';
import App from './App.js';

describe('App', () => {
    it('Contains navigation bar', () => {
        const wrapper = shallow(<App />);
        expect(wrapper.find('Navbar').exists());
    });
});