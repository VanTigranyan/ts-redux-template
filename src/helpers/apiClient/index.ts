import axios from 'axios';
import { baseUrl, token } from '../../configs/environment';

const authToken = token ? 'Bearer ' + token : undefined;
const headers = {
  Authorization: authToken,
  Accept: 'application/x.l2w.v1+json',
};

const client = axios.create({
  baseURL: baseUrl,
  headers,
});

export default client;
