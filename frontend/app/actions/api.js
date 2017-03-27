import axios from 'axios';

export default function login(email, password) {
  return axios({
    method: 'post',
    url: 'http://localhost:3000/api/v1/authorize/login',
    data: { name: email, password },
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
