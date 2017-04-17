import { types } from '../actions/Swipe';

const initialState = {
  currentlyOpenSwipeable: null,
  isAddPlaylistModalVisible: false,
  isLeftActionActivated: false,
  isLeftToggled: false,
  isRightActionActivated: false
}

const swipe = (state = initialState, action) => {
  if (action.type === types.TOGGLE_ADD_TO_PLAYLIST_MODAL) {
    return {...state, isAddPlaylistModalVisible: !state.isAddPlaylistModalVisible}
  }
  if (action.type === types.UPDATE_LEFT_ACTIVATION) {
    return {...state, isLeftActionActivated: action.payload};
  }
  if (action.type === types.UPDATE_LEFT_TOGGLE) {
    return {...state, isLeftToggled: action.payload};
  }
  if (action.type === types.UPDATE_RIGHT_ACTIVATION) {
    return {...state, isRightActionActivated: action.payload};
  }

  return state;
}

export default swipe;
