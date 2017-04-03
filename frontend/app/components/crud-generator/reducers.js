import _ from 'lodash';

const crud = (
  state = {},
  action,
) => {
  let crudState;
  switch (action.type) {
    case 'PERFORM_CRUD_OPERATION':
      crudState = _.assignIn({}, state[action.modelName], {
        isRequesting: true,
      });
      return {
        ...state,
        [action.modelName]: crudState,
      };
    case 'CRUD_OPERATION_RETRIEVEALL_SUCCESS':
      crudState = _.assignIn({}, state[action.modelName], {
        isRequesting: false,
        records: action.records,
        total: action.total,
      });
      return {
        ...state,
        [action.modelName]: crudState,
      };
    case 'CRUD_OPERATION_CREATE_SUCCESS':
      crudState = _.assignIn({}, state[action.modelName], {
        isRequesting: false,
        lastEffectedId: action.record._id,
      });
      return {
        ...state,
        [action.modelName]: crudState,
      };
    case 'CRUD_OPERATION_UPDATE_SUCCESS': {
      crudState = _.assignIn({}, state[action.modelName], {
        isRequesting: false,
        lastEffectedId: action.record._id,
      });
      const idx = _.findIndex(crudState.records, { _id: action.record._id });
      if (idx !== -1) {
        crudState.records[idx] = action.record;
      }
      return {
        ...state,
        [action.modelName]: crudState,
      };
    }
    case 'CRUD_OPERATION_DELETE_SUCCESS': {
      crudState = _.assignIn({}, state[action.modelName], {
        isRequesting: false,
        lastEffectedId: undefined,
      });
      _.remove(crudState.records, { _id: action.record._id });
      return {
        ...state,
        [action.modelName]: crudState,
      };
    }
    case 'CRUD_OPERATION_FAIL':
      crudState = _.assignIn({}, state[action.modelName], {
        isRequesting: false,
      });
      return {
        ...state,
        [action.modelName]: crudState,
      };
    case 'TOGGLE_CREATION_PANEL':
      crudState = _.assignIn({}, state[action.modelName], {
        isCreationPanelOpen: !state[action.modelName].isCreationPanelOpen,
      });
      return {
        ...state,
        [action.modelName]: crudState,
      };
    default:
      return state;
  }
};

export default crud;
