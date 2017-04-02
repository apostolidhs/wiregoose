import { crud } from '../../actions/api';

function performCrudOperation(method, modelName, params) {
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

function crudOperationRetriveAllSuccess(modelName, response) {
  return {
    type: 'CRUD_OPERATION_RETRIEVEALL_SUCCESS',
    modelName,
    records: response.data.data.content,
    total: response.data.data.total,
  };
}

function crudOperationUpdateSuccess(modelName, response) {
  return {
    type: 'CRUD_OPERATION_UPDATE_SUCCESS',
    modelName,
    record: response.data.data,
  };
}

function crudOperationDeleteSuccess(modelName, response) {
  return {
    type: 'CRUD_OPERATION_DELETE_SUCCESS',
    modelName,
    record: response.data.data,
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

export function retrieveAll(modelName, params) {
  return (dispatch) => {
    dispatch(performCrudOperation('RETRIEVE_ALL', modelName, params));
    return crud.retrieveAll(modelName, params)
      .then(response => dispatch(
        crudOperationRetriveAllSuccess(modelName, response)),
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
      .then(response => dispatch(
        crudOperationDeleteSuccess(modelName, response)),
      )
      .catch(error => dispatch(
        crudOperationFail('DELETE', modelName, error)),
      );
  };
}
