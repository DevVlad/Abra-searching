import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Immutable from 'immutable';
import Progress from '../redux/ducks/progress.jsx';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('async Progress actions', () => {
  it('should test behaviour in selected time', () => {
    const store = mockStore(Immutable.fromJS({}));
    let pms = new Promise( (res, rej) => {
      store.dispatch(Progress.start());
      setTimeout( () => {
        store.dispatch(Progress.stop());
      }, 20);
      setTimeout( () => {
        res();
      }, 1000);
    });
    return pms.then( () => {
      console.log(store.getActions(), store.getState());
      expect(store.getActions()).toExclude({ type: 'SET_STARTED' });
      // expect(store.getState().toEqual(Immutable.fromJS({loading: false})))
    });
  });

});

// describe('Progress Reducer', () => {
//   it('should return the initial state', () => {
//       expect(
//         Progress.reducer(undefined, {})
//       ).toEqual(
//         Immutable.fromJS({loading: false})
//       )
//   });
//
//   it('should handle SET_PROGRESS case', () => {
//     expect(
//       Progress.reducer(Immutable.fromJS({loading: false}), {
//         type: 'SET_PROGRESS',
//         bool: true
//       })).toEqual(Immutable.fromJS({loading: true}))
//   });
//
// });
