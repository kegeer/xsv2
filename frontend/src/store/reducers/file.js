import {
  FILE_DOWNLOADED,
  HIGHLIGHT_SAVED,
  FILE_UPLOAD_PROGRESS,
  FILE_CALLBACK_SUCCESS
} from '../constants/file';

const initialState = {
  file: null,
  percentage: 0,
  callbackSuccess: false
};

const fileReducer = (state = initialState, action) => {
  switch (action.type) {
  case FILE_DOWNLOADED:
    return {
      ...state,
      file: action.payload
    };
  case FILE_UPLOAD_PROGRESS:
    return {
      ...state,
      percentage: action.payload.percentage
    };
  case FILE_CALLBACK_SUCCESS:
    return {
      ...state,
      callbackSuccess: true,
      percentage: 0
    };
  default:
    return state;
  }
};

export default fileReducer;
