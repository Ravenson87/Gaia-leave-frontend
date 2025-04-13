import {createStore} from 'redux';

const initialState = {
  sidebarShow: true,
  currentUser: null,
  validationMessage: null
}

const rootReducer = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest };
    default:
      return state;
  }
}

const persistStore = createStore(rootReducer);
export default persistStore;
