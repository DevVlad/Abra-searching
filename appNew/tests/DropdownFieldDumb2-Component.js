import React from 'react';
import expect from 'expect';
import { shallow, mount, render } from 'enzyme';

import DropdownFieldDumb2 from '../components/DropdownFieldDumb2.jsx';

describe("<DropdownFieldDumb2 /> tests", () => {
  it("verification of inserted data and right behaviour with inserted data (data,value after 1s change of value)", () => {
    let initValue = 1;
    const initData = [
      {id: 0, text: 'pondělí'},
      {id: 1, text: 'úterý'},
      {id: 2, text: 'středa'},
      {id: 3, text: 'čtvrtek'},
      {id: 4, text: 'pátek'},
      {id: 5, text: 'sobota'},
      {id: 6, text: 'neděle'}
    ];
    const wrapper = () => shallow(<DropdownFieldDumb2
      label='Den v týdnu'
      alias='11'
      data={ initData }
      entityToText={ obj => obj.text }
      entityToValue={ object => object.id }
      value={ initValue }
    />);
    expect(wrapper().props().id).toEqual('DropdownFieldDumb_11');
    expect(wrapper().state().dataForRender.data).toEqual(initData);
    expect(wrapper().state().dataForRender.verified).toEqual(1);
    expect(wrapper().state().text).toEqual('úterý');
    expect(wrapper().state().toDisplay).toEqual('úterý');
    expect(wrapper().state().value).toEqual(1);
    setTimeout(() => {
      initValue = 5;
      wrapper();
      expect(wrapper().state().text).toEqual('sobota');
      expect(wrapper().state().toDisplay).toEqual('sobota');
    }, 1000);
  });
});
