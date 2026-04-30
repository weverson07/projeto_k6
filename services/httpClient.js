import http from 'k6/http';
import { getAuthHeaders } from '../utils/headers.js';

export function createClient(baseUrl, token) {
  return {
    get: (url) =>
      http.get(`${baseUrl}${url}`, getAuthHeaders(token)),

    post: (url, body) =>
      http.post(
        `${baseUrl}${url}`,
        JSON.stringify(body),
        getAuthHeaders(token)
      ),
  };
}