/**
 * 订单编号生成工具函数
 * 订单编号格式：PE-YYYYMMDD-XXX+CreatorCode
 * 例如：PE-20260117-006J
 */

import { format } from 'date-fns'

// 订单编号前缀
export const ORDER_PREFIX = 'PE'

// 生成订单编号
export function generateOrderNo(
  sequence: number,
  creatorCode: string,
  date?: Date
): string {
  const orderDate = date || new Date()
  const dateStr = format(orderDate, 'yyyyMMdd')
  const sequenceStr = sequence.toString().padStart(3, '0')
  const code = creatorCode.toUpperCase()

  return `${ORDER_PREFIX}-${dateStr}-${sequenceStr}${code}`
}

// 解析订单编号
export function parseOrderNo(orderNo: string): {
  prefix: string
  date: string
  sequence: string
  creatorCode: string
} | null {
  // 格式：PE-YYYYMMDD-XXX+CreatorCode
  // 例如：PE-20260117-006J
  const regex = /^([A-Z]{2})-(\d{8})-(\d{3})([A-Z])$/
  const match = orderNo.match(regex)

  if (!match) return null

  return {
    prefix: match[1],
    date: match[2],
    sequence: match[3],
    creatorCode: match[4],
  }
}

// 从订单编号中提取创建人代号
export function getCreatorCodeFromOrderNo(orderNo: string): string | null {
  const parsed = parseOrderNo(orderNo)
  return parsed?.creatorCode || null
}

// 验证订单编号格式
export function isValidOrderNo(orderNo: string): boolean {
  return parseOrderNo(orderNo) !== null
}

// 格式化订单编号用于显示
export function formatOrderNo(orderNo: string): string {
  return orderNo.toUpperCase()
}
