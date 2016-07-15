import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Immutable from 'immutable';
import Progress from '../redux/ducks/progress.jsx';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('Progress actions - stop(val) and start(val) tests', () => {
  it('start, 30stop, 30start, 150 res => should be started', () => {
    const store = mockStore(Immutable.fromJS({ progress: {counter: 1} }));

    let pms = new Promise( res => {
      store.dispatch(Progress.start(100));
      setTimeout( () => {
        store.dispatch(Progress.stop(100));
      }, 30);
      setTimeout( () => {
        store.dispatch(Progress.start(100));
      }, 60);
      setTimeout( () => {
        res();
      }, 150);
    });
    return pms.then( () => {
      expect(store.getActions()).toInclude({ type: 'SET_STARTED', started: true, value: 100 });
    });
  });

  it('start, 30res => should not be started, just incCounter', () => {
    const store = mockStore(Immutable.fromJS({ progress: {counter: 1} }));

    let pms = new Promise( res => {
      store.dispatch(Progress.start(100));
      setTimeout( () => {
        res();
      }, 30);
    });
    return pms.then( () => {
      expect(store.getActions()).toExclude({ type: 'SET_STARTED', started: true, value: 100 });
    });
  });

  it('start, 150res => should be started', () => {
    const store = mockStore(Immutable.fromJS({ progress: {counter: 1} }));

    let pms = new Promise( res => {
      store.dispatch(Progress.start(100));
      setTimeout( () => {
        res();
      }, 200);
    });
    return pms.then( () => {
      expect(store.getActions()).toInclude({ type: 'SET_STARTED', started: true, value: 100 });
    });
  });

  it('start, 120stop => in 140 should be still started', () => {
    const store = mockStore(Immutable.fromJS({ progress: {counter: 1} }));

    let pms = new Promise( res => {
      store.dispatch(Progress.start(100));
      setTimeout( () => {
        store.dispatch(Progress.stop(100));
      }, 120);
      setTimeout( () => {
        res();
      }, 140);
    });
    return pms.then( () => {
      expect(store.getActions()).toInclude({ type: 'SET_STARTED', started: true, value: 100 });
    });
  });

  it('start, 20stop => in 150 should not be started', () => {
    const store = mockStore(Immutable.fromJS({ progress: {counter: 0} }));

    let pms = new Promise( res => {
      store.dispatch(Progress.start(100));
      setTimeout( () => {
        store.dispatch(Progress.stop(100));
      }, 20);
      setTimeout( () => {
        res();
      }, 150);
    });
    return pms.then( () => {
      expect(store.getActions()).toExclude({ type: 'SET_STARTED', started: true, value: 100 });
    });
  });

  it('start, 20stop+start+start, 20start, 20stopstopstop => in 200 should not be started', () => {
    const store = mockStore(Immutable.fromJS({ progress: {counter: 0} }));

    let pms = new Promise( res => {
      store.dispatch(Progress.start(100));
      setTimeout( () => {
        store.dispatch(Progress.stop(100));
        store.dispatch(Progress.start(100));
        store.dispatch(Progress.start(100));
        setTimeout( () => {
          store.dispatch(Progress.start(100));
          setTimeout( () => {
            store.dispatch(Progress.stop(100));
            store.dispatch(Progress.stop(100));
            store.dispatch(Progress.stop(100));
          }, 20);
        }, 20);
      }, 20);
      setTimeout( () => {
        res();
      }, 200);
    });
    return pms.then( () => {
      expect(store.getActions()).toExclude({ type: 'SET_STARTED', started: true, value: 100 });
    });
  });

  it('start, 20stop+start+start, 20start, 20stopstopstop => in 100 should be still started', () => {
    const store = mockStore(Immutable.fromJS({ progress: {counter: 1} }));

    let pms = new Promise( res => {
      store.dispatch(Progress.start(100));
      setTimeout( () => {
        store.dispatch(Progress.stop(100));
        store.dispatch(Progress.start(100));
        store.dispatch(Progress.start(100));
        setTimeout( () => {
          store.dispatch(Progress.start(100));
          setTimeout( () => {
            store.dispatch(Progress.stop(100));
            store.dispatch(Progress.stop(100));
            store.dispatch(Progress.stop(100));
          }, 20);
        }, 20);
      }, 20);
      setTimeout( () => {
        res();
      }, 100);
    });
    return pms.then( () => {
      expect(store.getActions()).toInclude({ type: 'SET_STARTED', started: true, value: 100 });
    });
  });
});

describe('Progress actions - stop() and start() tests', () => {
  it('start, 20stop => in 100 should not be started', () => {
    const store = mockStore(Immutable.fromJS({ progress: {counter: 0} }));

    let pms = new Promise( res => {
      store.dispatch(Progress.start());
      setTimeout( () => {
        store.dispatch(Progress.stop());
      }, 20);
      setTimeout( () => {
        res();
      }, 100);
    });
    return pms.then( () => {
      expect(store.getActions()).toExclude({ type: 'SET_STARTED', started: true });
    });
  });

  it('start, 20stop, 20start => in 100 should be started', () => {
    const store = mockStore(Immutable.fromJS({ progress: {counter: 1} }));

    let pms = new Promise( res => {
      store.dispatch(Progress.start());
      setTimeout( () => {
        store.dispatch(Progress.stop());
        setTimeout( () => {
          store.dispatch(Progress.start());
        }, 20);
      }, 20);
      setTimeout( () => {
        res();
      }, 100);
    });
    return pms.then( () => {
      expect(store.getActions()).toInclude({ type: 'SET_STARTED', started: true, value: 1 });
    });

  });

});
