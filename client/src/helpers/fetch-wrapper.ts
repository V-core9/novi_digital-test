const fetchWrapper = {
  async request(method: string, url: string, body?: any, options: { auth?: any } = {}) {
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    if (options.auth) {
      const token = options.auth.accessToken
      if (token) headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    })

    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  get(url: string, options?: { auth?: any }) {
    return this.request('GET', url, undefined, options)
  },

  post(url: string, body: any, options?: { auth?: any }) {
    return this.request('POST', url, body, options)
  },

  put(url: string, body: any, options?: { auth?: any }) {
    return this.request('PUT', url, body, options)
  },

  delete(url: string, options?: { auth?: any }) {
    return this.request('DELETE', url, undefined, options)
  }
}

export default fetchWrapper
