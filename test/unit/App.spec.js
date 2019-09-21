import React from 'react';
import { shallow } from 'enzyme';
import App from '../../src/App.js';

describe('App', () => {
    it('renders hello world', () => {
        const wrapper = shallow(<App />);
        expect(wrapper.find('header').text()).toContain('Learn React');
    });
});