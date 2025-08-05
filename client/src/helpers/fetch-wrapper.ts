import { store, authActions } from '../store'

const apiURL = 'http://localhost/api'

const refreshTokenURL = apiURL + '/auth/refreshToken'

const authToken = () => store.getState().auth.user?.accessToken.token
const logout = () => store.dispatch(authActions.logout())

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE')
}

function request(method: string) {
  return async (url, body) => {
    const requestOptions = {
      method,
      headers: await authHeader(url)
    }
    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json'
      requestOptions.body = JSON.stringify(body)
    }
    return fetch(url, requestOptions).then(handleResponse)
  }
}

// helper functions

async function authHeader(url: string) {
  // return auth header with jwt if user is logged in and request is to the api url
  const token = authToken()
  const isLoggedIn = !!token
  const isApiUrl = url.startsWith(apiURL)
  if (isLoggedIn && isApiUrl && url !== refreshTokenURL) {
    const exp = store.getState().auth.user?.accessToken.exp * 1000 || Date.now()
    if (exp < Date.now()) {
      console.log('tokenExpired Refreshing...')
      await store.dispatch(authActions.refreshToken({ refreshToken: store.getState().auth.user.refreshToken.token }))
    }
    return { Authorization: `Bearer ${authToken()}` }
  } else {
    return {}
  }
}

function handleResponse(response: { text: () => Promise<any>; ok: any; status: number; statusText: any }) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text)
    if (!response.ok) {
      if ([401, 403, 500].includes(response.status) && authToken()) {
        if (data.message !== 'TokenExpiredError' || data.message === 'jwt expired') {
          logout()
        }
      }

      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }
    return data
  })
}
