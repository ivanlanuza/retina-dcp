import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkPayload = async (req) => {
    const response = { error: null };
    try {
        const { locationid, inventory } = req.adjustments;
        if (!locationid || !Array.isArray(inventory) || inventory.length === 0) {
            response.error = "Invalid payload structure.";
            return response;
        }
    } catch (e) {
        response.error = e.message;
    }
    return response;
};

export const processRecords = async (records) => {
    const response = { 
        result: null, 
        error: null 
    };
    try {
        await prisma.$transaction(async (prisma) => {
            const inventoryAdjustment = await saveAdjustmentTransactions(prisma, records);
            if (inventoryAdjustment.error) {
                throw new Error(inventoryAdjustment.error);
            }
            const productLocations = await saveProductLocations(prisma, records);
            if (productLocations.error) {
                throw new Error(productLocations.error);
            }
        });
        response.result = "Transaction successful";
    } catch (e) {
        response.error = e.message;
    }
    return response;
};

export const saveAdjustmentTransactions = async (prisma, records) => {
    const response = { 
        result: null, 
        error: null 
    };
    try {
        for (const data of records.adjustments.inventory) {
            const existingRecord = await prisma.inventoryAdjustments.findFirst({
                where: {
                    accountid: records.token.accountId,
                    productid: data.productid,
                    locationid: records.adjustments.locationid,
                    isdeleted: false,
                },
            });
            if (existingRecord) {
                await prisma.inventoryAdjustments.update({
                    where: { id: existingRecord.id },
                    data: {
                        oldinventorycount: data.oldInventoryCount,
                        adjustmentqty: data.adjustmentQty,
                        newinventorycount: data.newInventoryCount,
                        updatedAt: new Date(),
                    },
                });
            } else {
                await prisma.inventoryAdjustments.create({
                    data: {
                        productid: data.productid,
                        locationid: records.adjustments.locationid,
                        oldinventorycount: data.oldInventoryCount,
                        adjustmentqty: data.adjustmentQty,
                        newinventorycount: data.newInventoryCount,
                        isdeleted: false,
                        userid: records.token.userId || null,
                        accountid: records.token.accountId || null,
                    },
                });
            }
        }
        response.result = "Inventory adjustment successful.";
    } catch (e) {
        response.error = e.message;
    }
    return response;
};

export const saveProductLocations = async (prisma, records) => {
    const response = { 
        result: null, 
        error: null 
    };
    try {
        for (const data of records.adjustments.inventory) {
            const existingRecord = await prisma.productLocations.findFirst({
                where: {
                    accountid: records.token.accountId,
                    productid: data.productid,
                    locationid: records.adjustments.locationid,
                    isdeleted: false,
                },
            });
            if (existingRecord) {
                await prisma.productLocations.update({
                    where: { id: existingRecord.id },
                    data: {
                        inventorycount: data.newInventoryCount,
                    },
                });
            } else {
                await prisma.productLocations.create({
                    data: {
                        productid: data.productid,
                        locationid: records.adjustments.locationid,
                        inventorycount: data.newInventoryCount,
                        isactive: true,
                        isdeleted: false,
                        userid: records.token.userId || null,
                        accountid: records.token.accountId || null,
                    },
                });
            }
        }
        response.result = "Product locations updated successfully.";
    } catch (e) {
        response.error = e.message;
    }
    return response;
};
