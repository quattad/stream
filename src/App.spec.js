import React from 'react';
import { shallow } from 'enzyme';
import App from './App.js';

describe('App', () => {
    it('renders hello world', () => {
        const wrapper = shallow(<App />);
        expect(wrapper.find('Navbar').exists());
    });
});