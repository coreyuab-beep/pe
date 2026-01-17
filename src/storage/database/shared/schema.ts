import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  numeric,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod";

// 配置 date coercion 以处理前端 string → Date 转换
const { createInsertSchema: createCoercedInsertSchema } = createSchemaFactory({
  coerce: { date: true },
});

// ==================== 用户表 ====================
export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    username: varchar("username", { length: 50 }).notNull().unique(),
    password: text("password").notNull(),
    email: varchar("email", { length: 100 }),
    role: varchar("role", { length: 20 }).notNull().default("admin"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    usernameIdx: index("users_username_idx").on(table.username),
  })
);

export const insertUserSchema = createCoercedInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// ==================== 订单表 ====================
export const orders = pgTable(
  "orders",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    orderNo: varchar("order_no", { length: 50 }).notNull().unique(),
    customerId: varchar("customer_id", { length: 36 }),
    customerName: varchar("customer_name", { length: 100 }).notNull(),
    contactPerson: varchar("contact_person", { length: 50 }),
    contactPhone: varchar("contact_phone", { length: 20 }),
    contactEmail: varchar("contact_email", { length: 100 }),
    type: varchar("type", { length: 20 }).notNull().default("production"),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    priority: varchar("priority", { length: 20 }).notNull().default("medium"),
    formulaId: varchar("formula_id", { length: 36 }),
    formulaVersion: varchar("formula_version", { length: 20 }),
    quantity: integer("quantity").notNull(),
    unit: varchar("unit", { length: 20 }).notNull(),
    deliveryDate: timestamp("delivery_date", { withTimezone: true }),
    totalAmount: numeric("total_amount", { precision: 10, scale: 2 }),
    remarks: text("remarks"),
    createdBy: varchar("created_by", { length: 50 }).notNull(),
    creatorCode: varchar("creator_code", { length: 10 }),
    shippingNo: varchar("shipping_no", { length: 50 }),
    shippingCompany: varchar("shipping_company", { length: 50 }),
    shippingDate: timestamp("shipping_date", { withTimezone: true }),
    cancelReason: text("cancel_reason"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    orderNoIdx: index("orders_order_no_idx").on(table.orderNo),
    statusIdx: index("orders_status_idx").on(table.status),
    customerNameIdx: index("orders_customer_name_idx").on(table.customerName),
  })
);

export const insertOrderSchema = createCoercedInsertSchema(orders)
  .pick({
    orderNo: true,
    customerId: true,
    customerName: true,
    contactPerson: true,
    contactPhone: true,
    contactEmail: true,
    type: true,
    status: true,
    priority: true,
    formulaId: true,
    formulaVersion: true,
    quantity: true,
    unit: true,
    deliveryDate: true,
    totalAmount: true,
    remarks: true,
    createdBy: true,
    creatorCode: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const updateOrderSchema = createCoercedInsertSchema(orders)
  .pick({
    status: true,
    priority: true,
    formulaId: true,
    formulaVersion: true,
    quantity: true,
    deliveryDate: true,
    totalAmount: true,
    remarks: true,
    shippingNo: true,
    shippingCompany: true,
    shippingDate: true,
    cancelReason: true,
  })
  .partial();

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type UpdateOrder = z.infer<typeof updateOrderSchema>;

// ==================== 配方表 ====================
export const formulas = pgTable(
  "formulas",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    code: varchar("code", { length: 50 }).notNull().unique(),
    name: varchar("name", { length: 100 }).notNull(),
    version: varchar("version", { length: 20 }).notNull().default("1.0"),
    description: text("description"),
    phaseChangeTemperature: numeric("phase_change_temperature", { precision: 5, scale: 2 }),
    latentHeat: numeric("latent_heat", { precision: 5, scale: 2 }),
    thermalConductivity: numeric("thermal_conductivity", { precision: 5, scale: 3 }),
    density: numeric("density", { precision: 5, scale: 2 }),
    specificHeat: numeric("specific_heat", { precision: 5, scale: 2 }),
    meltingPoint: numeric("melting_point", { precision: 5, scale: 2 }),
    solidificationPoint: numeric("solidification_point", { precision: 5, scale: 2 }),
    stability: integer("stability"),
    category: varchar("category", { length: 50 }),
    parameters: jsonb("parameters"),
    standardReference: text("standard_reference"),
    isPublished: boolean("is_published").notNull().default(false),
    createdBy: varchar("created_by", { length: 50 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    codeIdx: index("formulas_code_idx").on(table.code),
    nameIdx: index("formulas_name_idx").on(table.name),
    categoryIdx: index("formulas_category_idx").on(table.category),
  })
);

export const insertFormulaSchema = createCoercedInsertSchema(formulas)
  .pick({
    code: true,
    name: true,
    version: true,
    description: true,
    phaseChangeTemperature: true,
    latentHeat: true,
    thermalConductivity: true,
    density: true,
    specificHeat: true,
    meltingPoint: true,
    solidificationPoint: true,
    stability: true,
    category: true,
    parameters: true,
    standardReference: true,
    isPublished: true,
    createdBy: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const updateFormulaSchema = createCoercedInsertSchema(formulas)
  .pick({
    name: true,
    version: true,
    description: true,
    phaseChangeTemperature: true,
    latentHeat: true,
    thermalConductivity: true,
    density: true,
    specificHeat: true,
    meltingPoint: true,
    solidificationPoint: true,
    stability: true,
    category: true,
    parameters: true,
    standardReference: true,
    isPublished: true,
  })
  .partial();

export type Formula = typeof formulas.$inferSelect;
export type InsertFormula = z.infer<typeof insertFormulaSchema>;
export type UpdateFormula = z.infer<typeof updateFormulaSchema>;

// ==================== 配方材料关联表 ====================
export const formulaMaterials = pgTable(
  "formula_materials",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    formulaId: varchar("formula_id", { length: 36 }).notNull(),
    materialId: varchar("material_id", { length: 36 }).notNull(),
    materialCode: varchar("material_code", { length: 20 }).notNull(),
    ratio: numeric("ratio", { precision: 5, scale: 2 }).notNull(),
    requiredQuantity: numeric("required_quantity", { precision: 10, scale: 2 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    formulaIdIdx: index("formula_materials_formula_id_idx").on(table.formulaId),
    materialIdIdx: index("formula_materials_material_id_idx").on(table.materialId),
  })
);

export const insertFormulaMaterialSchema = createCoercedInsertSchema(formulaMaterials)
  .pick({
    formulaId: true,
    materialId: true,
    materialCode: true,
    ratio: true,
    requiredQuantity: true,
  })
  .omit({
    id: true,
    createdAt: true,
  });

export type FormulaMaterial = typeof formulaMaterials.$inferSelect;
export type InsertFormulaMaterial = z.infer<typeof insertFormulaMaterialSchema>;

// ==================== 物料表 ====================
export const materials = pgTable(
  "materials",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    code: varchar("code", { length: 20 }).notNull().unique(),
    name: varchar("name", { length: 100 }),
    category: varchar("category", { length: 50 }).notNull(),
    specification: varchar("specification", { length: 200 }),
    unit: varchar("unit", { length: 20 }).notNull(),
    currentStock: numeric("current_stock", { precision: 10, scale: 2 }).notNull().default("0"),
    minStock: numeric("min_stock", { precision: 10, scale: 2 }).notNull().default("0"),
    maxStock: numeric("max_stock", { precision: 10, scale: 2 }),
    supplierId: varchar("supplier_id", { length: 36 }),
    supplierName: varchar("supplier_name", { length: 100 }),
    batchNo: varchar("batch_no", { length: 50 }),
    productionDate: timestamp("production_date", { withTimezone: true }),
    expiryDate: timestamp("expiry_date", { withTimezone: true }),
    status: varchar("status", { length: 20 }).notNull().default("normal"),
    createdBy: varchar("created_by", { length: 50 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    codeIdx: index("materials_code_idx").on(table.code),
    categoryIdx: index("materials_category_idx").on(table.category),
    statusIdx: index("materials_status_idx").on(table.status),
  })
);

export const insertMaterialSchema = createCoercedInsertSchema(materials)
  .pick({
    code: true,
    name: true,
    category: true,
    specification: true,
    unit: true,
    currentStock: true,
    minStock: true,
    maxStock: true,
    supplierId: true,
    supplierName: true,
    batchNo: true,
    productionDate: true,
    expiryDate: true,
    status: true,
    createdBy: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const updateMaterialSchema = createCoercedInsertSchema(materials)
  .pick({
    name: true,
    specification: true,
    currentStock: true,
    minStock: true,
    maxStock: true,
    supplierId: true,
    supplierName: true,
    batchNo: true,
    productionDate: true,
    expiryDate: true,
    status: true,
  })
  .partial();

export type Material = typeof materials.$inferSelect;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type UpdateMaterial = z.infer<typeof updateMaterialSchema>;

// ==================== 出入库记录表 ====================
export const stockOperations = pgTable(
  "stock_operations",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    materialId: varchar("material_id", { length: 36 }).notNull(),
    materialName: varchar("material_name", { length: 100 }).notNull(),
    materialCode: varchar("material_code", { length: 20 }).notNull(),
    type: varchar("type", { length: 20 }).notNull(),
    quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull(),
    beforeStock: numeric("before_stock", { precision: 10, scale: 2 }).notNull(),
    afterStock: numeric("after_stock", { precision: 10, scale: 2 }).notNull(),
    batchNo: varchar("batch_no", { length: 50 }),
    reason: text("reason").notNull(),
    referenceNo: varchar("reference_no", { length: 50 }),
    approvedBy: varchar("approved_by", { length: 50 }).notNull(),
    createdBy: varchar("created_by", { length: 50 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    materialIdIdx: index("stock_operations_material_id_idx").on(table.materialId),
    typeIdx: index("stock_operations_type_idx").on(table.type),
    createdAtIdx: index("stock_operations_created_at_idx").on(table.createdAt),
    referenceNoIdx: index("stock_operations_reference_no_idx").on(table.referenceNo),
  })
);

export const insertStockOperationSchema = createCoercedInsertSchema(stockOperations)
  .pick({
    materialId: true,
    materialName: true,
    materialCode: true,
    type: true,
    quantity: true,
    beforeStock: true,
    afterStock: true,
    batchNo: true,
    reason: true,
    referenceNo: true,
    approvedBy: true,
    createdBy: true,
  })
  .omit({
    id: true,
    createdAt: true,
  });

export type StockOperation = typeof stockOperations.$inferSelect;
export type InsertStockOperation = z.infer<typeof insertStockOperationSchema>;

// ==================== 供应商表 ====================
export const suppliers = pgTable(
  "suppliers",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 100 }).notNull(),
    code: varchar("code", { length: 20 }).notNull().unique(),
    contactPerson: varchar("contact_person", { length: 50 }),
    phone: varchar("phone", { length: 20 }),
    email: varchar("email", { length: 100 }),
    address: text("address"),
    rating: integer("rating").default(5),
    status: varchar("status", { length: 20 }).notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    codeIdx: index("suppliers_code_idx").on(table.code),
    nameIdx: index("suppliers_name_idx").on(table.name),
    statusIdx: index("suppliers_status_idx").on(table.status),
  })
);

export const insertSupplierSchema = createCoercedInsertSchema(suppliers)
  .pick({
    name: true,
    code: true,
    contactPerson: true,
    phone: true,
    email: true,
    address: true,
    rating: true,
    status: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const updateSupplierSchema = createCoercedInsertSchema(suppliers)
  .pick({
    name: true,
    contactPerson: true,
    phone: true,
    email: true,
    address: true,
    rating: true,
    status: true,
  })
  .partial();

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type UpdateSupplier = z.infer<typeof updateSupplierSchema>;

// ==================== 测试记录表 ====================
export const testRecords = pgTable(
  "test_records",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    testNo: varchar("test_no", { length: 50 }).notNull().unique(),
    formulaId: varchar("formula_id", { length: 36 }).notNull(),
    formulaName: varchar("formula_name", { length: 100 }).notNull(),
    formulaVersion: varchar("formula_version", { length: 20 }),
    orderId: varchar("order_id", { length: 36 }),
    orderNo: varchar("order_no", { length: 50 }),
    testType: varchar("test_type", { length: 50 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    testStandard: varchar("test_standard", { length: 50 }),
    tester: varchar("tester", { length: 50 }).notNull(),
    startDate: timestamp("start_date", { withTimezone: true }),
    endDate: timestamp("end_date", { withTimezone: true }),
    results: jsonb("results"),
    conclusion: text("conclusion"),
    attachments: jsonb("attachments"),
    createdBy: varchar("created_by", { length: 50 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    testNoIdx: index("test_records_test_no_idx").on(table.testNo),
    formulaIdIdx: index("test_records_formula_id_idx").on(table.formulaId),
    orderIdIdx: index("test_records_order_id_idx").on(table.orderId),
    statusIdx: index("test_records_status_idx").on(table.status),
  })
);

export const insertTestRecordSchema = createCoercedInsertSchema(testRecords)
  .pick({
    testNo: true,
    formulaId: true,
    formulaName: true,
    formulaVersion: true,
    orderId: true,
    orderNo: true,
    testType: true,
    status: true,
    testStandard: true,
    tester: true,
    startDate: true,
    endDate: true,
    results: true,
    conclusion: true,
    attachments: true,
    createdBy: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const updateTestRecordSchema = createCoercedInsertSchema(testRecords)
  .pick({
    status: true,
    testStandard: true,
    tester: true,
    startDate: true,
    endDate: true,
    results: true,
    conclusion: true,
    attachments: true,
  })
  .partial();

export type TestRecord = typeof testRecords.$inferSelect;
export type InsertTestRecord = z.infer<typeof insertTestRecordSchema>;
export type UpdateTestRecord = z.infer<typeof updateTestRecordSchema>;


