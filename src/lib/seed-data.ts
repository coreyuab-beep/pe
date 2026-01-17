import { userManager } from "@/storage/database";
import { materialManager } from "@/storage/database";
import { supplierManager } from "@/storage/database";
import { formulaManager } from "@/storage/database";
import { formulaMaterials } from "@/storage/database";
import type { InsertMaterial, InsertSupplier, InsertFormula } from "@/storage/database";

export async function seedDatabase() {
  console.log("开始初始化数据库数据...");

  // 1. 初始化默认管理员
  await userManager.initializeDefaultAdmin();
  console.log("✓ 默认管理员已创建");

  // 2. 创建示例供应商
  const suppliers: InsertSupplier[] = [
    {
      code: "S001",
      name: "上海化工原料有限公司",
      contactPerson: "张经理",
      phone: "021-12345678",
      email: "zhang@shanghai-chem.com",
      address: "上海市浦东新区",
      rating: 5,
      status: "active",
    },
    {
      code: "S002",
      name: "北京特种材料厂",
      contactPerson: "李主管",
      phone: "010-87654321",
      email: "li@beijing-spec.com",
      address: "北京市朝阳区",
      rating: 4,
      status: "active",
    },
  ];

  for (const supplier of suppliers) {
    try {
      await supplierManager.createSupplier(supplier);
    } catch (error) {
      // 供应商可能已存在，忽略错误
    }
  }
  console.log("✓ 示例供应商已创建");

  // 3. 创建示例物料
  const materials: InsertMaterial[] = [
    // 相变材料系列 (P 系列)
    {
      code: "P01",
      name: "石蜡 PCM-01",
      category: "相变材料",
      specification: "熔点: 25°C, 潜热: 180 kJ/kg",
      unit: "kg",
      currentStock: "1000",
      minStock: "200",
      maxStock: "2000",
      supplierId: "S001",
      supplierName: "上海化工原料有限公司",
      status: "normal",
      createdBy: "admin",
    },
    {
      code: "P02",
      name: "水合盐 PCM-02",
      category: "相变材料",
      specification: "熔点: 30°C, 潜热: 200 kJ/kg",
      unit: "kg",
      currentStock: "1500",
      minStock: "300",
      maxStock: "3000",
      supplierId: "S001",
      supplierName: "上海化工原料有限公司",
      status: "normal",
      createdBy: "admin",
    },
    // 导热增强材料系列 (H 系列)
    {
      code: "H01",
      name: "石墨烯粉末",
      category: "导热增强",
      specification: "纯度: 99.9%, 粒径: 10μm",
      unit: "kg",
      currentStock: "500",
      minStock: "100",
      maxStock: "1000",
      supplierId: "S002",
      supplierName: "北京特种材料厂",
      status: "normal",
      createdBy: "admin",
    },
    {
      code: "H02",
      name: "碳纤维",
      category: "导热增强",
      specification: "长度: 6mm, 直径: 7μm",
      unit: "kg",
      currentStock: "800",
      minStock: "200",
      maxStock: "1500",
      supplierId: "S002",
      supplierName: "北京特种材料厂",
      status: "normal",
      createdBy: "admin",
    },
    // 添加剂系列 (A 系列)
    {
      code: "A01",
      name: "成核剂",
      category: "添加剂",
      specification: "粉末, 粒径: 5μm",
      unit: "kg",
      currentStock: "300",
      minStock: "50",
      maxStock: "500",
      supplierId: "S001",
      supplierName: "上海化工原料有限公司",
      status: "normal",
      createdBy: "admin",
    },
    {
      code: "A02",
      name: "抗氧化剂",
      category: "添加剂",
      specification: "粉末, 纯度: 98%",
      unit: "kg",
      currentStock: "400",
      minStock: "100",
      maxStock: "800",
      supplierId: "S002",
      supplierName: "北京特种材料厂",
      status: "normal",
      createdBy: "admin",
    },
    // 低库存物料示例
    {
      code: "L01",
      name: "相变胶囊",
      category: "相变材料",
      specification: "粒径: 10-20μm",
      unit: "kg",
      currentStock: "50",
      minStock: "100",
      maxStock: "500",
      supplierId: "S001",
      supplierName: "上海化工原料有限公司",
      status: "low_stock",
      createdBy: "admin",
    },
  ];

  const createdMaterials: Map<string, string> = new Map();
  for (const material of materials) {
    try {
      const created = await materialManager.createMaterial(material);
      createdMaterials.set(material.code, created.id);
    } catch (error) {
      // 物料可能已存在，获取其 ID
      const existing = await materialManager.getMaterialByCode(material.code);
      if (existing) {
        createdMaterials.set(material.code, existing.id);
      }
    }
  }
  console.log("✓ 示例物料已创建");

  // 4. 创建示例配方
  const formulas: InsertFormula[] = [
    {
      code: "F-001",
      name: "PCM-25 标准配方",
      version: "1.0",
      description: "熔点 25°C 的标准相变材料配方",
      phaseChangeTemperature: "25.0",
      latentHeat: "180.5",
      thermalConductivity: "0.5",
      density: "0.88",
      specificHeat: "2.0",
      meltingPoint: "25.5",
      solidificationPoint: "24.5",
      stability: "500",
      category: "标准相变材料",
      parameters: {
        targetMeltingPoint: "25°C",
        targetLatentHeat: "180 kJ/kg",
      },
      standardReference: "GB/T 26802-2011",
      isPublished: true,
      createdBy: "admin",
    },
    {
      code: "F-002",
      name: "PCM-30 增强导热配方",
      version: "1.2",
      description: "熔点 30°C，添加石墨烯增强导热性能",
      phaseChangeTemperature: "30.0",
      latentHeat: "200.3",
      thermalConductivity: "1.2",
      density: "0.90",
      specificHeat: "2.1",
      meltingPoint: "30.5",
      solidificationPoint: "29.5",
      stability: "600",
      category: "增强导热相变材料",
      parameters: {
        targetMeltingPoint: "30°C",
        targetLatentHeat: "200 kJ/kg",
        thermalConductivity: "1.2 W/(m·K)",
      },
      standardReference: "GB/T 26802-2011",
      isPublished: true,
      createdBy: "admin",
    },
  ];

  const createdFormulas: Map<string, string> = new Map();
  for (const formula of formulas) {
    try {
      const created = await formulaManager.createFormula(formula);
      createdFormulas.set(formula.code, created.id);
    } catch (error) {
      // 配方可能已存在，获取其 ID
      const existing = await formulaManager.getFormulaByCode(formula.code);
      if (existing) {
        createdFormulas.set(formula.code, existing.id);
      }
    }
  }
  console.log("✓ 示例配方已创建");

  // 5. 创建配方材料关联
  const formulaMaterialRelations = [
    // F-001: PCM-25 标准配方
    {
      formulaCode: "F-001",
      materialCode: "P01",
      ratio: "90.0",
      requiredQuantity: "0.9",
    },
    {
      formulaCode: "F-001",
      materialCode: "A01",
      ratio: "10.0",
      requiredQuantity: "0.1",
    },
    // F-002: PCM-30 增强导热配方
    {
      formulaCode: "F-002",
      materialCode: "P02",
      ratio: "85.0",
      requiredQuantity: "0.85",
    },
    {
      formulaCode: "F-002",
      materialCode: "H01",
      ratio: "10.0",
      requiredQuantity: "0.1",
    },
    {
      formulaCode: "F-002",
      materialCode: "A02",
      ratio: "5.0",
      requiredQuantity: "0.05",
    },
  ];

  const db = await (await import("coze-coding-dev-sdk")).getDb();

  for (const relation of formulaMaterialRelations) {
    const formulaId = createdFormulas.get(relation.formulaCode);
    const materialId = createdMaterials.get(relation.materialCode);

    if (formulaId && materialId) {
      try {
        await db.insert(formulaMaterials).values({
          formulaId,
          materialId,
          materialCode: relation.materialCode,
          ratio: relation.ratio,
          requiredQuantity: relation.requiredQuantity,
        });
      } catch (error) {
        // 关联可能已存在，忽略错误
      }
    }
  }
  console.log("✓ 配方材料关联已创建");

  console.log("\n数据库初始化完成！");
  console.log("默认账号: admin / admin123");
}

// 导出初始化函数
export default seedDatabase;
