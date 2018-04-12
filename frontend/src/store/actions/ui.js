import {
  SET_ACTIVE_MODAL,
  CLEAR_ACTIVE_MODAL,
  SET_ACTIVE_DOCUMENT,
  CLEAR_ACTIVE_DOCUMENT,
  SET_ACTIVE_PROJECT,
  SET_ACTIVE_FILE,
  CLEAR_ACTIVE_PROJECT,
  CLEAR_ACTIVE_FILE,
  ENABLE_EDIT_MODE,
  DISABLE_EDIT_MODE,
  ENABLE_PROGRESS_BAR,
  DISABLE_PROGRESS_BAR,
  TOGGLE_MOBILE_SIDEBAR,
  HIDE_MOBILE_SIDEBAR
} from 'store/constants/ui';

export const setActiveModal = (name, props) => ({
  type: SET_ACTIVE_MODAL,
  payload: {
    name,
    props
  }
});

export const clearActiveModal = () => ({
  type: CLEAR_ACTIVE_MODAL
});


export const setActiveDocument = document => ({
  type : SET_ACTIVE_DOCUMENT,
  payload: {
    document
  }
});

export const setActiveProject = project => ({
  type : SET_ACTIVE_PROJECT,
  payload: {
    project
  }
});

export const setActiveFile = file => ({
  type : SET_ACTIVE_FILE,
  payload: {
    file
  }
});

export const clearActiveDocument = () => ({
  type: CLEAR_ACTIVE_DOCUMENT
});

export const clearActiveProject = () => ({
  type: CLEAR_ACTIVE_PROJECT
});

export const clearActiveFile = () => ({
  type: CLEAR_ACTIVE_FILE
});


export const enableEditMode = () => ({
  type: ENABLE_EDIT_MODE,
});


export const disableEditMode = () => ({
  type: DISABLE_EDIT_MODE,
});


export const enableProgressBar = () => ({
  type: ENABLE_PROGRESS_BAR,
});
export const disableProgressBar = () => ({
  type: DISABLE_PROGRESS_BAR,
});


export const toggleMobileSidebar = () => ({
  type: TOGGLE_MOBILE_SIDEBAR,
});


export const hideMobileSidebar = () => ({
  type: HIDE_MOBILE_SIDEBAR,
});

