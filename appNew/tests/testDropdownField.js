import expect from 'expect';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Immutable from 'immutable';
import DropdownField from '../redux/ducks/dropdownfield.jsx';

describe('DropdownField Actions', () => {
  it('should create an action to add a todo', () => {
    const loading = 'boolean';
    const alias = 'alias';
    const type = 'SET_LOADING';
    const expectedAction = {
      type: type,
      loading,
      alias
    };
    expect(DropdownField.setLoading(loading, alias)).toEqual(expectedAction);
  });
});

describe('DropdownField Reducer', () => {
  it('should return the initial state', () => {
      expect(
        DropdownField.reducer(undefined, {})
      ).toEqual(
        Immutable.fromJS({})
      )
  });
  it('should handle SET_HINT case', () => {
    expect(
      DropdownField.reducer(Immutable.fromJS({alias: {
        hint: [],
        lastPaging: 0,
        nextRequestPossible: false
      }}), {
        type: 'SET_HINT',
        list: [1, 2, 3],
        alias: 'alias',
        paging: 20,
        bool: true
      })).toEqual(
        Immutable.fromJS({
          alias: {
            hint: Immutable.fromJS([1, 2, 3]),
            lastPaging: 20,
            nextRequestPossible: true
          }
        })
      )
  });
  it('should handle ADD_HINT case', () => {
    expect(
      DropdownField.reducer(Immutable.fromJS({alias: {
        hint: Immutable.fromJS([1, 2, 3]),
        lastPaging: 0,
        nextRequestPossible: false
      }}), {
        type: 'ADD_HINT',
        hint: [4, 5],
        alias: 'alias',
        paging: 20,
        bool: true
      })).toEqual(
        Immutable.fromJS({
          alias: {
            hint: Immutable.fromJS([1,2,3,4,5]),
            lastPaging: 20,
            nextRequestPossible: true
          }
        })
      )
  });
  it('should handle SET_FILTER case', () => {
    expect(
      DropdownField.reducer(Immutable.fromJS({alias: {
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
  it('should handle SET_FILTER_MODE case', () => {
    expect(
      DropdownField.reducer(Immutable.fromJS({alias: {
        filterMode: false
      }}), {
        type: 'SET_FILTER_MODE',
        alias: 'alias',
        bool: true
      })).toEqual(
        Immutable.fromJS({
          alias: {
            filterMode: true
          }
        })
      )
  });

});
