import { crud } from '../../actions/api';

function performCrudOperation(method, model, params) {
  return {
    type: 'PERFORM_CRUD_OPERATION',
    method,
    model,
    params,
  };
}

function crudOperationSuccess(method, model, response) {
  return {
    type: 'CRUD_OPERATION_SUCCESS',
    method,
    model,
    records: response.data.data.content,
    total: response.data.data.total,
  };
}

function crudOperationFail(method, model, error) {
  return {
    type: 'CRUD_OPERATION_FAIL',
    method,
    model,
    error,
  };
}

export function retrieveAll(model, params) {
  return (dispatch) => {
    dispatch(performCrudOperation('RETRIEVE_ALL', model, params));
    return crud.retrieveAll(model, params)
      .then(response => dispatch(
        crudOperationSuccess('RETRIEVE_ALL', model, response)),
      )
      .catch(error => dispatch(
        crudOperationFail('RETRIEVE_ALL', model, error)),
      );
  };
}

export function create(model, data) {
  return (dispatch) => {
    dispatch(performCrudOperation('CREATE', model, data));
    return crud.retrieveAll(model, data)
      .then(response => dispatch(
          crudOperationSuccess('CREATE', model, response)),
      )
      .catch(error => dispatch(
        crudOperationFail('CREATE', model, error)),
      );
  };
}

// export function retrieveAll(model, data) {
//   return {
//     type: 'CRUD_RETRIEVE_ALL',
//     model,
//     data,
//   };
// }

// export function create(model, data) {
//   return {
//     type: 'CRUD_CREATE',
//     model,
//     data,
//   };
// }

// export function retrieve(model, data) {
//   return {
//     type: 'SESSION_LOGIN_PERFORM',
//     model,
//     data,
//   };
// }
// export function create(model, data) {
//   return {
//     type: 'SESSION_LOGIN_PERFORM',
//     model,
//     data,
//   };
// }
// export function create(model, data) {
//   return {
//     type: 'SESSION_LOGIN_PERFORM',
//     model,
//     data,
//   };
// }
