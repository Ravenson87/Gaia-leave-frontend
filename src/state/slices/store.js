import {createStore} from 'redux';

const initialState = {
  sidebarShow: true,
  currentUser: null
}

const rootReducer = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest };
    default:
      return state;
  }
}

const persistTroterStore = createStore(rootReducer);
export default persistTroterStore;
