import { UAParser } from 'ua-parser-js'

export function getDeviceInfo() {
  const parser = new UAParser()
  const result = parser.getResult()
  return {
    device_type: result.device.type || 'desktop',
    device_vendor: result.device.vendor,
    device_model: result.device.model,
    os: result.os.name,
    os_version: result.os.version,
    browser: result.browser.name,
    browser_version: result.browser.version,
  }
}
