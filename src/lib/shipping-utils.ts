/**
 * 物流查询工具函数
 * 支持主流快递公司的物流查询
 */

// 快递公司信息
export interface ShippingCompany {
  code: string // 快递公司代码
  name: string // 快递公司名称
  queryUrl: string // 查询URL模板，使用 {trackingNumber} 作为占位符
}

// 主流快递公司配置
export const SHIPPING_COMPANIES: ShippingCompany[] = [
  {
    code: 'SF',
    name: '顺丰速运',
    queryUrl: 'https://www.sf-express.com/sf-service-owf-web-main/dist/index.html#/search/result?keyword={trackingNumber}',
  },
  {
    code: 'ZTO',
    name: '中通快递',
    queryUrl: 'https://www.zto.com/ztoQuery/html/query.html?keyword={trackingNumber}',
  },
  {
    code: 'YTO',
    name: '圆通速递',
    queryUrl: 'https://www.yto.net.cn/query/index/index.html?keyword={trackingNumber}',
  },
  {
    code: 'STO',
    name: '申通快递',
    queryUrl: 'https://www.sto.cn/query/index.html?keyword={trackingNumber}',
  },
  {
    code: 'YD',
    name: '韵达快递',
    queryUrl: 'https://www.yundaex.com/kuaidi/kuaidi.html?keyword={trackingNumber}',
  },
  {
    code: 'JD',
    name: '京东物流',
    queryUrl: 'https://www.jdl.com/query/index.html?keyword={trackingNumber}',
  },
  {
    code: 'EMS',
    name: '中国邮政',
    queryUrl: 'https://www.ems.com.cn/queryList?keyword={trackingNumber}',
  },
  {
    code: 'DBL',
    name: '德邦快递',
    queryUrl: 'https://www.deppon.com/query/index.html?keyword={trackingNumber}',
  },
  {
    code: 'HTKY',
    name: '百世快递',
    queryUrl: 'https://www.800best.com/query/index.html?keyword={trackingNumber}',
  },
  {
    code: 'TNT',
    name: 'TNT快递',
    queryUrl: 'https://www.tnt.com/express/zh_cn/tracking.html?keyword={trackingNumber}',
  },
  {
    code: 'DHL',
    name: 'DHL快递',
    queryUrl: 'https://www.dhl.com/cn-zh/home/tracking/tracking-parcel.html?submit=1&tracking-id={trackingNumber}',
  },
  {
    code: 'FEDEX',
    name: '联邦快递',
    queryUrl: 'https://www.fedex.com/zh-cn/tracking.html?trcknum={trackingNumber}',
  },
  {
    code: 'UPS',
    name: 'UPS快递',
    queryUrl: 'https://www.ups.com/track?loc=zh_CN&tracknum={trackingNumber}',
  },
]

// 通用物流查询页面（支持大多数快递公司）
export const UNIVERSAL_QUERY_URL = 'https://www.kuaidi100.com/?keyword={trackingNumber}'

// 根据快递公司代码获取查询URL
export function getShippingQueryUrl(shippingCompanyCode: string, trackingNumber: string): string {
  const company = SHIPPING_COMPANIES.find(c => c.code === shippingCompanyCode)
  if (company) {
    return company.queryUrl.replace('{trackingNumber}', trackingNumber)
  }
  // 如果找不到对应的快递公司，使用通用查询页面
  return UNIVERSAL_QUERY_URL.replace('{trackingNumber}', trackingNumber)
}

// 根据快递公司代码获取快递公司名称
export function getShippingCompanyName(shippingCompanyCode: string): string {
  const company = SHIPPING_COMPANIES.find(c => c.code === shippingCompanyCode)
  return company?.name || shippingCompanyCode
}

// 打开物流查询页面（在新标签页打开）
export function openShippingTracking(shippingCompanyCode: string | undefined, trackingNumber: string): void {
  if (!trackingNumber) {
    console.warn('物流单号为空，无法查询')
    return
  }

  let url: string
  if (shippingCompanyCode) {
    url = getShippingQueryUrl(shippingCompanyCode, trackingNumber)
  } else {
    // 如果没有指定快递公司，使用通用查询页面
    url = UNIVERSAL_QUERY_URL.replace('{trackingNumber}', trackingNumber)
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}

// 验证物流单号格式（基础验证）
export function isValidTrackingNumber(trackingNumber: string): boolean {
  // 物流单号通常为8-20位的数字或字母组合
  const pattern = /^[A-Za-z0-9]{8,20}$/
  return pattern.test(trackingNumber)
}

// 根据物流单号特征猜测快递公司（可选功能）
export function guessShippingCompany(trackingNumber: string): ShippingCompany | null {
  // 顺丰：以SF开头，后跟数字
  if (/^SF\d+$/.test(trackingNumber)) {
    return SHIPPING_COMPANIES.find(c => c.code === 'SF') || null
  }
  // EMS：以E、C、K开头，后跟数字
  if (/^[ECK]\d+$/.test(trackingNumber)) {
    return SHIPPING_COMPANIES.find(c => c.code === 'EMS') || null
  }
  // 京东：以JD开头
  if (/^JD\d+$/.test(trackingNumber)) {
    return SHIPPING_COMPANIES.find(c => c.code === 'JD') || null
  }
  // 其他情况无法准确猜测，返回null
  return null
}
