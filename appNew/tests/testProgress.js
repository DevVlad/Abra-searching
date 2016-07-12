import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Immutable from 'immutable';
import Progress from '../redux/ducks/progress.jsx';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('async Progress actions', () => {
  it('should test behaviour in selected time', () => {
    const store = mockStore(Immutable.fromJS({progress: {}}));

    let pms = new Promise( res => {
      store.dispatch(Progress.start());
      setTimeout( () => {
        store.dispatch(Progress.stop());
      }, 20);
      setTimeout( () => {
        res();
      }, 500);
    });
    return pms.then( () => {
      console.log(store.getActions());
      expect(store.getActions()).toExclude({ type: 'SET_STARTED' });
    });
  });

});
