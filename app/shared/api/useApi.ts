type ApiRequestOptions = Record<string, unknown>
type ApiRequestBody = BodyInit | Record<string, unknown> | null

type UntypedRequest = <T>(url: string, options?: ApiRequestOptions) => Promise<T>

export function useApi() {
  const requestFetch: UntypedRequest = import.meta.server
    ? (useRequestFetch() as unknown as UntypedRequest)
    : ($fetch as unknown as UntypedRequest)

  async function request<T>(url: string, options?: ApiRequestOptions): Promise<T> {
    return await requestFetch<T>(url, options)
  }

  async function get<T>(url: string, options?: ApiRequestOptions): Promise<T> {
    return await request<T>(url, { ...options, method: 'GET' })
  }

  async function post<T>(url: string, body?: ApiRequestBody, options?: ApiRequestOptions): Promise<T> {
    return await request<T>(url, { ...options, method: 'POST', body })
  }

  async function put<T>(url: string, body?: ApiRequestBody, options?: ApiRequestOptions): Promise<T> {
    return await request<T>(url, { ...options, method: 'PUT', body })
  }

  async function patch<T>(url: string, body?: ApiRequestBody, options?: ApiRequestOptions): Promise<T> {
    return await request<T>(url, { ...options, method: 'PATCH', body })
  }

  async function del<T>(url: string, options?: ApiRequestOptions): Promise<T> {
    return await request<T>(url, { ...options, method: 'DELETE' })
  }

  return {
    request,
    get,
    post,
    put,
    patch,
    del,
  }
}
