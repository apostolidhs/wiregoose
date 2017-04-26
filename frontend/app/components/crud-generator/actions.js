import _ from 'lodash';
import { crud } from '../../actions/api';

function performCrudOperation(method, modelName, _params) {
  let params = _params;
  if (method === 'RETRIEVE_ALL') {
    params = _.defaults(params, {
      page: 1,
      count: 5,
      sortBy: undefined,
      asc: undefined,
    });
  }
  return {
    type: 'PERFORM_CRUD_OPERATION',
    method,
    modelName,
    params,
  };
}

function crudOperationCreateSuccess(modelName, response) {
  return {
    type: 'CRUD_OPERATION_CREATE_SUCCESS',
    modelName,
    record: response.data.data,
  };
}

function crudOperationRetrieveAllSuccess(modelName, response, params) {
  return {
    type: 'CRUD_OPERATION_RETRIEVEALL_SUCCESS',
    modelName,
    records: response.data.data.content,
    total: response.data.data.total,
    params,
  };
}

function crudOperationUpdateSuccess(modelName, response) {
  return {
    type: 'CRUD_OPERATION_UPDATE_SUCCESS',
    modelName,
    record: response.data.data,
  };
}

function crudOperationDeleteSuccess(modelName, id) {
  return {
    type: 'CRUD_OPERATION_DELETE_SUCCESS',
    modelName,
    id,
  };
}

function crudOperationFail(method, modelName, error) {
  return {
    type: 'CRUD_OPERATION_FAIL',
    method,
    modelName,
    error,
  };
}

export function toggleCreationPanel(modelName) {
  return {
    type: 'TOGGLE_CREATION_PANEL',
    modelName,
  };
}

export function retrieveAll(modelName, params = {}) {
  return (dispatch, getState) => {
    dispatch(performCrudOperation('RETRIEVE_ALL', modelName, params));
    const state = getState();
    const apiParams = _.get(state, `crud[${modelName}].params`);
    return crud.retrieveAll(modelName, apiParams)
      .then(response => dispatch(
        crudOperationRetrieveAllSuccess(modelName, response, params)),
      )
      .catch(error => dispatch(
        crudOperationFail('RETRIEVE_ALL', modelName, error)),
      );
  };
}

export function create(modelName, data) {
  return (dispatch) => {
    dispatch(performCrudOperation('CREATE', modelName, data));
    return crud.create(modelName, data)
      .then(response => dispatch(
        crudOperationCreateSuccess(modelName, response)),
      )
      .catch(error => dispatch(
        crudOperationFail('CREATE', modelName, error)),
      );
  };
}

export function update(modelName, id, data) {
  return (dispatch) => {
    dispatch(performCrudOperation('UPDATE', modelName, data));
    return crud.update(modelName, id, data)
      .then(response => dispatch(
        crudOperationUpdateSuccess(modelName, response)),
      )
      .catch(error => dispatch(
        crudOperationFail('UPDATE', modelName, error)),
      );
  };
}

export function remove(modelName, id) {
  return (dispatch) => {
    dispatch(performCrudOperation('DELETE', modelName));
    return crud.remove(modelName, id)
      .then(() => dispatch(
        crudOperationDeleteSuccess(modelName, id)),
      )
      .catch(error => {
        console.log(error);
        dispatch(
          crudOperationFail('DELETE', modelName, error),
        );
      });
  };
}
