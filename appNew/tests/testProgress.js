import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Immutable from 'immutable';
import Progress from '../redux/ducks/progress.jsx';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('async Progress actions', () => {
  it('start, 30stop, 30start, 150 res => should be started', () => {
    const store = mockStore(Immutable.fromJS({progress: {counter: 1}}));

    let pms = new Promise( res => {
      store.dispatch(Progress.start());
      setTimeout( () => {
        store.dispatch(Progress.stop());
      }, 30);
      setTimeout( () => {
        store.dispatch(Progress.start());
      }, 60);
      setTimeout( () => {
        res();
      }, 150);
    });
    return pms.then( () => {
      expect(store.getActions()).toInclude({ type: 'SET_STARTED', started: true });
    });
  });

  it('start, 30res => should not be started, just incCounter', () => {
    const store = mockStore(Immutable.fromJS({progress: {counter: 1}}));

    let pms = new Promise( res => {
      store.dispatch(Progress.start());
      setTimeout( () => {
        res();
      }, 30);
    });
    return pms.then( () => {
      expect(store.getActions()).toExclude({ type: 'SET_STARTED', started: false });
    });
  });

  it('start, 150res => should be started', () => {
    const store = mockStore(Immutable.fromJS({progress: {counter: 1}}));

    let pms = new Promise( res => {
      store.dispatch(Progress.start());
      setTimeout( () => {
        res();
      }, 200);
    });
    return pms.then( () => {
      expect(store.getActions()).toInclude({ type: 'SET_STARTED', started: true });
    });
  });


});
