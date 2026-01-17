/**
 * 物料编号配置和工具函数
 * 物料编号规则：
 * - L01-L25: 25个（L系列）
 * - H01-H25: 25个（H系列）
 * - A01-A15: 15个（A系列）
 * - B01-B15: 15个（B系列）
 * - C01-C15: 15个（C系列）
 * - D01-D15: 15个（D系列）
 * - O01-O25: 25个（O系列）
 */

// 物料系列配置
export interface MaterialSeriesConfig {
  prefix: string // 前缀字母
  start: number // 起始编号
  end: number // 结束编号
  count: number // 总数量
  description?: string // 系列描述
}

// 所有物料系列配置
export const MATERIAL_SERIES: MaterialSeriesConfig[] = [
  { prefix: 'L', start: 1, end: 25, count: 25 },
  { prefix: 'H', start: 1, end: 25, count: 25 },
  { prefix: 'A', start: 1, end: 15, count: 15 },
  { prefix: 'B', start: 1, end: 15, count: 15 },
  { prefix: 'C', start: 1, end: 15, count: 15 },
  { prefix: 'D', start: 1, end: 15, count: 15 },
  { prefix: 'O', start: 1, end: 25, count: 25 },
]

// 生成指定系列的物料编号列表
export function generateMaterialCodes(prefix: string, start: number, end: number): string[] {
  const codes: string[] = []
  for (let i = start; i <= end; i++) {
    codes.push(`${prefix}${i.toString().padStart(2, '0')}`)
  }
  return codes
}

// 获取所有物料编号列表
export function getAllMaterialCodes(): string[] {
  const allCodes: string[] = []
  MATERIAL_SERIES.forEach(series => {
    allCodes.push(...generateMaterialCodes(series.prefix, series.start, series.end))
  })
  return allCodes
}

// 验证物料编号格式是否有效
export function isValidMaterialCode(code: string): boolean {
  return getAllMaterialCodes().includes(code)
}

// 解析物料编号，返回系列前缀和编号
export function parseMaterialCode(code: string): { prefix: string; number: number } | null {
  const match = code.match(/^([A-Z])(\d{2})$/)
  if (!match) return null

  const prefix = match[1]
  const number = parseInt(match[2], 10)

  // 检查该编号是否在有效范围内
  const series = MATERIAL_SERIES.find(s => s.prefix === prefix)
  if (!series) return null

  if (number < series.start || number > series.end) return null

  return { prefix, number }
}

// 获取物料编号所属系列
export function getMaterialSeries(code: string): MaterialSeriesConfig | null {
  const parsed = parseMaterialCode(code)
  if (!parsed) return null

  return MATERIAL_SERIES.find(s => s.prefix === parsed.prefix) || null
}

// 生成下一个可用编号（用于新增物料）
export function getNextAvailableCode(usedCodes: string[], prefix?: string): string | null {
  const allCodes = getAllMaterialCodes()
  const availableCodes = allCodes.filter(code => !usedCodes.includes(code))

  if (availableCodes.length === 0) return null

  // 如果指定了前缀，返回该前缀下的第一个可用编号
  if (prefix) {
    const prefixAvailableCodes = availableCodes.filter(code => code.startsWith(prefix))
    if (prefixAvailableCodes.length > 0) {
      return prefixAvailableCodes[0]
    }
    return null
  }

  // 否则返回第一个可用编号
  return availableCodes[0]
}

// 格式化物料编号用于显示
export function formatMaterialCode(code: string): string {
  return code.toUpperCase()
}

// 导出物料编号常量（便于在组件中使用）
export const MATERIAL_CODE_RANGES = {
  L: { start: 1, end: 25, total: 25 },
  H: { start: 1, end: 25, total: 25 },
  A: { start: 1, end: 15, total: 15 },
  B: { start: 1, end: 15, total: 15 },
  C: { start: 1, end: 15, total: 15 },
  D: { start: 1, end: 15, total: 15 },
  O: { start: 1, end: 25, total: 25 },
} as const

// 总物料数量
export const TOTAL_MATERIAL_COUNT = Object.values(MATERIAL_CODE_RANGES).reduce((sum, range) => sum + range.total, 0)
