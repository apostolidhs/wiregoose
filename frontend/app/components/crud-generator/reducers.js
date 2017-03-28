import _ from 'lodash';

const crud = (
  state = {},
  action,
) => {
  let crudState;
  switch (action.type) {
    case 'PERFORM_CRUD_OPERATION':
      crudState = _.assignIn({}, state[action.model.name], {
        isRequesting: true,
      });
      return {
        ...state,
        [action.model.name]: crudState,
      };
    case 'CRUD_OPERATION_SUCCESS':
      if (action.method === 'RETRIEVE_ALL') {
        crudState = _.assignIn({}, state[action.model.name], {
          isRequesting: false,
          records: action.records,
          total: action.total,
        });
        return {
          ...state,
          [action.model.name]: crudState,
        };
      }
      return state;
    case 'CRUD_OPERATION_FAIL':
      crudState = _.assignIn({}, state[action.model.name], {
        isRequesting: false,
      });
      return {
        ...state,
        [action.model.name]: crudState,
      };
    default:
      return state;
  }
};

export default crud;
