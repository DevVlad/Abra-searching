import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Immutable from 'immutable';
import Progress from '../redux/ducks/progress.jsx';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('async Progress actions - step(val) and start(val) tests', () => {
  it('start, 30step, 30start, 150 res => should be started', () => {
    const store = mockStore(Immutable.fromJS({ progress: {progressBar: 1} }));

    let pms = new Promise( res => {
      store.dispatch(Progress.start(100));
      setTimeout( () => {
        store.dispatch(Progress.step(100));
      }, 30);
      setTimeout( () => {
        store.dispatch(Progress.start(100));
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
    const store = mockStore(Immutable.fromJS({ progress: {progressBar: 1} }));

    let pms = new Promise( res => {
      store.dispatch(Progress.start(100));
      setTimeout( () => {
        res();
      }, 30);
    });
    return pms.then( () => {
      expect(store.getActions()).toExclude({ type: 'SET_STARTED', started: true });
    });
  });

  it('start, 150res => should be started', () => {
    const store = mockStore(Immutable.fromJS({ progress: {progressBar: 1} }));

    let pms = new Promise( res => {
      store.dispatch(Progress.start(100));
      setTimeout( () => {
        res();
      }, 200);
    });
    return pms.then( () => {
      expect(store.getActions()).toInclude({ type: 'SET_STARTED', started: true });
    });
  });

  it('start, 120step => in 140 should be still started', () => {
    const store = mockStore(Immutable.fromJS({ progress: {progressBar: 1} }));

    let pms = new Promise( res => {
      store.dispatch(Progress.start(100));
      setTimeout( () => {
        store.dispatch(Progress.step(100));
      }, 120);
      setTimeout( () => {
        res();
      }, 140);
    });
    return pms.then( () => {
      expect(store.getActions()).toInclude({ type: 'SET_STARTED', started: true });
    });
  });

  it('start, 20step => in 150 should not be started', () => {
    const store = mockStore(Immutable.fromJS({ progress: {progressBar: 0} }));

    let pms = new Promise( res => {
      store.dispatch(Progress.start(100));
      setTimeout( () => {
        store.dispatch(Progress.step(100));
      }, 20);
      setTimeout( () => {
        res();
      }, 150);
    });
    return pms.then( () => {
      expect(store.getActions()).toExclude({ type: 'SET_STARTED', started: true });
    });
  });

  it('start, 20step+start+start, 20start, 20stepstepstep => in 200 should not be started', () => {
    const store = mockStore(Immutable.fromJS({ progress: {progressBar: 0} }));

    let pms = new Promise( res => {
      store.dispatch(Progress.start(100));
      setTimeout( () => {
        store.dispatch(Progress.step(100));
        store.dispatch(Progress.start(100));
        store.dispatch(Progress.start(100));
        setTimeout( () => {
          store.dispatch(Progress.start(100));
          setTimeout( () => {
            store.dispatch(Progress.step(100));
            store.dispatch(Progress.step(100));
            store.dispatch(Progress.step(100));
          }, 20);
        }, 20);
      }, 20);
      setTimeout( () => {
        res();
      }, 200);
    });
    return pms.then( () => {
      expect(store.getActions()).toExclude({ type: 'SET_STARTED', started: true });
    });
  });

  it('start, 20step+start+start, 20start, 20stepstepstep => in 100 should be still started', () => {
    const store = mockStore(Immutable.fromJS({ progress: {progressBar: 1} }));

    let pms = new Promise( res => {
      store.dispatch(Progress.start(100));
      setTimeout( () => {
        store.dispatch(Progress.step(100));
        store.dispatch(Progress.start(100));
        store.dispatch(Progress.start(100));
        setTimeout( () => {
          store.dispatch(Progress.start(100));
          setTimeout( () => {
            store.dispatch(Progress.step(100));
            store.dispatch(Progress.step(100));
            store.dispatch(Progress.step(100));
          }, 20);
        }, 20);
      }, 20);
      setTimeout( () => {
        res();
      }, 100);
    });
    return pms.then( () => {
      expect(store.getActions()).toInclude({ type: 'SET_STARTED', started: true });
    });
  });
});

describe('async Progress actions - stop() and start(val) tests of "known ending"', () => {
  
  it('start(val), 20stop => in 50 should not be started', () => {
    const store = mockStore(Immutable.fromJS({ progress: {progressBar: 100} }));

    let pms = new Promise( res => {
      store.dispatch(Progress.start(20));
      setTimeout( () => {
        store.dispatch(Progress.stop());
      }, 20);
      setTimeout( () => {
        res();
      }, 50);
    });
    return pms.then( () => {
      expect(store.getActions())
        .toExclude({ type: 'SET_STARTED', started: true })
        .toInclude({ type: 'INC_PROGRESS_BAR', value: 20 })
        .toInclude({ type: 'SET_SYMPTOM_KNOWN', definition: 'known', changeOfSymptom: false })
    });
  });

  it('start(val), 110start(val), 220stop => in 250 should not be started', () => {
    const store = mockStore(Immutable.fromJS({ progress: {progressBar: 1, starting: true} }));

    let pms = new Promise( res => {
      store.dispatch(Progress.start(100));
      setTimeout( () => {
        store.dispatch(Progress.start(50));
      }, 110);
      setTimeout( () => {
        store.dispatch(Progress.stop());
      }, 220);
      setTimeout( () => {
        res();
      }, 250);
    });
    return pms.then( () => {
      expect(store.getActions())
        .toInclude({ type: 'SET_SYMPTOM_KNOWN', definition: 'known', changeOfSymptom: false })
        .toExclude({ type: 'SET_STARTED', started: true })
    });
  });

  it('undefined ending - testing of increment xdrants', () => {
    const store = mockStore(Immutable.fromJS({ progress: {symptom: 'unknown', progressBar: 100} }));

    let pms = new Promise( res => {
      store.dispatch(Progress.start());
      setTimeout( () => {
        store.dispatch(Progress.start());
      }, 40);
      setTimeout( () => {
        res();
      }, 150);
    });
    return pms.then( () => {
      expect(store.getActions())
        .toInclude({ type: 'INC_XDRANT' })
        .toInclude({ type: 'SET_STARTED', started: true })
    });
  });

  it('undefined ending - start(), start(val), 110res => should change symptom with recognize of change from Und -> Def', () => {
    const store = mockStore(Immutable.fromJS({ progress: { progressBar: 0} }));

    let pms = new Promise( res => {
      store.dispatch(Progress.start());
      store.dispatch(Progress.start(20));

      setTimeout( () => {
        res();
      }, 150);
    });
    return pms.then( () => {
      expect(store.getActions())
        .toInclude({ type: 'SET_SYMPTOM_UNKNOWN', definition: 'unknown', xdrant: 1, changeOfSymptom: false })
        .toInclude({ type: 'SET_SYMPTOM_KNOWN', definition: 'known', changeOfSymptom: false })
    });
  });

});
