import axios from 'axios';

const apiUrl = 'http://localhost:3000/api/v1/';

export const crud = {
  retrieveAll,
};

export function login(email, password) {
  return axios({
    method: 'post',
    url: `${apiUrl}authorize/login`,
    data: { name: email, password },
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function retrieveAll(model, params) {
  return axios({
    method: 'get',
    url: `${apiUrl}${model.name}`,
    params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
