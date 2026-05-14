export function getApiBaseUrl(): string {
  const env = import.meta.env.VITE_API_URL as string | undefined
  if (env && env.length > 0) {
    return env.replace(/\/$/, '')
  }
  return ''
}
