// @ts-ignore
import HttpsProxyAgent from '@next/vendored/ws'
// @ts-ignore
import HttpProxyAgent from '@next/vendored/ws'
import type { Agent } from 'https'

/**
 * If the http(s)_proxy environment variables is set, return a proxy agent.
 */
export function getProxyAgent(): Agent | undefined {
  const httpsProxy = process.env['https_proxy'] || process.env['HTTPS_PROXY']
  if (httpsProxy) {
    return new HttpsProxyAgent(httpsProxy)
  }

  const httpProxy = process.env['http_proxy'] || process.env['HTTP_PROXY']
  if (httpProxy) {
    return new HttpProxyAgent(httpProxy)
  }
}
