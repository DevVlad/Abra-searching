import expect from 'expect';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Immutable from 'immutable';
import DropdownFieldDuck from '../redux/ducks/dropdownfieldDuck.jsx';

describe('DropdownFieldDuck Actions', () => {
  it('should create loading in alias', () => {
    const loading = 'boolean';
    const alias = 'alias';
    const type = 'SET_LOADING';
    const expectedAction = {
      type: type,
      loading,
      alias
    };
    expect(DropdownFieldDuck.setLoading(loading, alias)).toEqual(expectedAction);
  });
});

describe('DropdownFieldDuck Reducer', () => {
  it('should return the initial state', () => {
      expect(
        DropdownFieldDuck.reducer(undefined, {})
      ).toEqual(
        Immutable.fromJS({})
      )
  });
  it('should handle SET_DATA case', () => {
    const action = {
      type: 'SET_DATA',
      list: [1, 2, 3],
      alias: 'alias',
      paging: 20,
      bool: true
    };
    expect(
      DropdownFieldDuck.reducer(Immutable.fromJS({alias: {
        data: [],
        lastPaging: 0,
        nextRequestPossible: false
      }}), action)).toEqual(
        Immutable.fromJS({
          alias: {
            data: Immutable.fromJS([1, 2, 3]),
            lastPaging: 20,
            nextRequestPossible: true
          }
        })
      )
  });
  it('should handle ADD_DATA case', () => {
    const action = {
      type: 'ADD_DATA',
      data: [4, 5],
      alias: 'alias',
      paging: 20,
      bool: true
    };
    expect(
      DropdownFieldDuck.reducer(Immutable.fromJS({alias: {
        data: Immutable.fromJS([1, 2, 3]),
        lastPaging: 0,
        nextRequestPossible: false
      }}), action)).toEqual(
        Immutable.fromJS({
          alias: {
            data: Immutable.fromJS([1,2,3,4,5]),
            lastPaging: 20,
            nextRequestPossible: true
          }
        })
      )
  });
  it('should handle SET_FILTER case', () => {
    expect(
      DropdownFieldDuck.reducer(Immutable.fromJS({alias: {
        filter: 'string'
      }}), {
        type: 'SET_FILTER',
        alias: 'alias',
        filter: 'inputchange'
      })).toEqual(
        Immutable.fromJS({
          alias: {
            filter: 'inputchange'
          }
        })
      )
  });

});
