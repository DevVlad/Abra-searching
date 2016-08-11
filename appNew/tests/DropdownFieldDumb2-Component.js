import React from 'react';
import expect from 'expect';
import { shallow, mount, render } from 'enzyme';

import DropdownFieldDumb2 from '../components/DropdownFieldDumb2.jsx';

describe("<DropdownFieldDumb2 /> tests", () => {
  it("test-pokus", () => {
    const wrapper = shallow(<DropdownFieldDumb2
      label='Den v týdnu'
      alias='11'
      data={[
        {id: 0, text: 'pondělí'},
        {id: 1, text: 'útery'},
        {id: 2, text: 'středa'},
        {id: 3, text: 'čtvrtek'},
        {id: 4, text: 'pátek'},
        {id: 5, text: 'sobota'},
        {id: 6, text: 'neděle'}
      ]}
      entityToText={ obj => obj.text }
      entityToValue={ object => object.id }
      value={ 1 }
    />);
    // console.log(wrapper);
    expect(wrapper.contains(<div id='DropdownFieldDumb_11' />)).toEqual(true);
  });
});
