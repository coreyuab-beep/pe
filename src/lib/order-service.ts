import { orderManager } from "@/storage/database";
import { formulaManager } from "@/storage/database";
import { materialManager } from "@/storage/database";
import { testManager } from "@/storage/database";
import type { InsertOrder, Order, Formula } from "@/storage/database";

export interface OrderMaterialRequirement {
  materialCode: string;
  materialName: string;
  requiredQuantity: number;
  currentStock: number;
  isSufficient: boolean;
}

export interface OrderCreationResult {
  order: Order;
  materialRequirements: OrderMaterialRequirement[];
  lowStockMaterials: string[];
  warnings: string[];
}

export class OrderService {
  /**
   * 创建订单并检查物料库存
   */
  async createOrderWithStockCheck(
    data: InsertOrder,
    creatorCode?: string
  ): Promise<OrderCreationResult> {
    const warnings: string[] = [];
    const lowStockMaterials: string[] = [];
    const materialRequirements: OrderMaterialRequirement[] = [];

    // 1. 创建订单
    const order = await orderManager.createOrder({
      ...data,
      creatorCode: creatorCode || data.createdBy.substring(0, 1).toUpperCase(),
    });

    // 2. 如果关联了配方，检查配方所需的物料库存
    if (data.formulaId) {
      const formula = await formulaManager.getFormulaById(data.formulaId);
      if (formula) {
        const formulaMaterials = await formulaManager.getFormulaMaterials(data.formulaId);

        for (const fm of formulaMaterials) {
          const material = await materialManager.getMaterialByCode(fm.materialCode);
          if (material) {
            const requiredQuantity = Number(fm.requiredQuantity) * data.quantity;
            const currentStock = Number(material.currentStock);
            const isSufficient = currentStock >= requiredQuantity;

            materialRequirements.push({
              materialCode: fm.materialCode,
              materialName: material.name || fm.materialCode,
              requiredQuantity,
              currentStock,
              isSufficient,
            });

            if (!isSufficient) {
              lowStockMaterials.push(fm.materialCode);
              warnings.push(
                `物料 ${fm.materialCode} 库存不足 (需要: ${requiredQuantity}, 当前: ${currentStock})`
              );
            } else if (currentStock - requiredQuantity < Number(material.minStock)) {
              warnings.push(
                `物料 ${fm.materialCode} 领料后将低于最小库存 (领料后: ${currentStock - requiredQuantity}, 最小: ${material.minStock})`
              );
            }
          }
        }
      }
    }

    return {
      order,
      materialRequirements,
      lowStockMaterials,
      warnings,
    };
  }

  /**
   * 更新订单状态并触发相应业务逻辑
   */
  async updateOrderStatus(
    orderId: string,
    newStatus: string,
    approvedBy: string
  ): Promise<{ success: boolean; message: string }> {
    const order = await orderManager.getOrderById(orderId);
    if (!order) {
      return { success: false, message: "订单不存在" };
    }

    const oldStatus = order.status;

    // 1. 更新订单状态
    await orderManager.updateOrder(orderId, { status: newStatus });

    // 2. 根据状态变化触发业务逻辑
    if (oldStatus === "pending" && newStatus === "processing") {
      // 从待处理到生产中：自动创建出库单，扣减库存
      if (order.formulaId) {
        const result = await this.autoDeductMaterials(orderId, approvedBy);
        if (!result.success) {
          return {
            success: false,
            message: `订单状态已更新，但库存扣减失败：${result.message}`,
          };
        }
      }
    } else if (newStatus === "completed") {
      // 订单完成：更新发货信息
      await orderManager.updateOrder(orderId, {
        shippingDate: new Date(),
      });
    } else if (newStatus === "cancelled") {
      // 订单取消：如果有已扣减的库存，可以回退（简化版暂不实现）
    }

    return { success: true, message: "订单状态更新成功" };
  }

  /**
   * 自动扣减物料库存
   */
  private async autoDeductMaterials(
    orderId: string,
    approvedBy: string
  ): Promise<{ success: boolean; message: string }> {
    const order = await orderManager.getOrderById(orderId);
    if (!order || !order.formulaId) {
      return { success: false, message: "订单信息不完整" };
    }

    const formulaMaterials = await formulaManager.getFormulaMaterials(order.formulaId);
    const deductionErrors: string[] = [];

    for (const fm of formulaMaterials) {
      const material = await materialManager.getMaterialByCode(fm.materialCode);
      if (!material) {
        deductionErrors.push(`物料 ${fm.materialCode} 不存在`);
        continue;
      }

      const requiredQuantity = Number(fm.requiredQuantity) * order.quantity;

      try {
        await materialManager.updateStock(
          material.id,
          requiredQuantity,
          "out",
          `订单 ${order.orderNo} 生产领料`,
          order.orderNo,
          approvedBy,
          order.createdBy
        );
      } catch (error) {
        deductionErrors.push(
          `物料 ${fm.materialCode} 库存不足或扣减失败：${error instanceof Error ? error.message : "未知错误"}`
        );
      }
    }

    if (deductionErrors.length > 0) {
      return { success: false, message: deductionErrors.join("; ") };
    }

    return { success: true, message: "物料库存扣减成功" };
  }

  /**
   * 获取订单的物料需求
   */
  async getOrderMaterialRequirements(orderId: string): Promise<OrderMaterialRequirement[]> {
    const order = await orderManager.getOrderById(orderId);
    if (!order || !order.formulaId) {
      return [];
    }

    const formulaMaterials = await formulaManager.getFormulaMaterials(order.formulaId);
    const requirements: OrderMaterialRequirement[] = [];

    for (const fm of formulaMaterials) {
      const material = await materialManager.getMaterialByCode(fm.materialCode);
      if (material) {
        const requiredQuantity = Number(fm.requiredQuantity) * order.quantity;
        const currentStock = Number(material.currentStock);

        requirements.push({
          materialCode: fm.materialCode,
          materialName: material.name || fm.materialCode,
          requiredQuantity,
          currentStock,
          isSufficient: currentStock >= requiredQuantity,
        });
      }
    }

    return requirements;
  }
}

export const orderService = new OrderService();
