import React from 'react';
import expect from 'expect';
import { shallow, mount, render } from 'enzyme';

import DropdownField2 from '../components/DropdownField2.jsx';

describe("<DropdownField2 /> tests", () => {
  it("test01", () => {
    let initValue = 1;
    const wrapper = () => shallow(<DropdownField2
      label='contact'
      entityType="kontakt"
      value={ initValue }
      alias='11'
      entityToText={ object => [object.jmeno, object.prijmeni].join(' ').trim() }
      filterToCondition={ text => ({type: 'comp', operator: 'like', left: 'jmeno', right: text}) }
      loadingNotify={ true }
      allowNew={ true }
    />);
    console.log(wrapper().props());
  });
});
