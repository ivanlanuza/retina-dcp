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
    const response = { result: null, error: null };

    try {
        // Process inventory adjustments
        const inventoryAdjustmentResponse = await saveAdjustmentTransactions(prisma, records);
        if (inventoryAdjustmentResponse.error) {
            throw new Error(inventoryAdjustmentResponse.error);
        }

        // Process product locations
        const productLocationsResponse = await saveProductLocations(prisma, records);
        if (productLocationsResponse.error) {
            throw new Error(productLocationsResponse.error);
        }

        response.result = "Transaction successful";
    } catch (e) {
        response.error = e.message;
    }

    return response;
};

export const saveAdjustmentTransactions = async (prisma, records) => {
    const response = { result: null, error: null };

    try {
        await Promise.all(
            records.adjustments.inventory.map(async (data) => {
                await prisma.inventoryAdjustments.upsert({
                    where: {
                        accountid_productid_locationid: {
                            accountid: records.token.accountId,
                            productid: data.productid,
                            locationid: records.adjustments.locationid,
                        },
                    },
                    update: {
                        oldinventorycount: data.oldInventoryCount,
                        adjustmentqty: data.adjustmentQty,
                        newinventorycount: data.newInventoryCount,
                        updatedAt: new Date(),
                        transactionTypeId: records.adjustments.transactionTypeId
                    },
                    create: {
                        productid: data.productid,
                        locationid: records.adjustments.locationid,
                        oldinventorycount: data.oldInventoryCount,
                        adjustmentqty: data.adjustmentQty,
                        newinventorycount: data.newInventoryCount,
                        isdeleted: false,
                        userid: records.token.userId || null,
                        accountid: records.token.accountId || null,
                        transactionTypeId: records.adjustments.transactionTypeId
                    },
                });
            })
        );

        response.result = "Inventory adjustments successful.";
    } catch (e) {
        response.error = e.message;
    }

    return response;
};

export const saveProductLocations = async (prisma, records) => {
    const response = { result: null, error: null };

    try {
        await Promise.all(
            records.adjustments.inventory.map(async (data) => {
                await prisma.productLocations.upsert({
                    where: {
                        accountid_productid_locationid: {
                            accountid: records.token.accountId,
                            productid: data.productid,
                            locationid: records.adjustments.locationid,
                        },
                    },
                    update: {
                        inventorycount: data.newInventoryCount,
                        transactionTypeId: records.adjustments.transactionTypeId
                    },
                    create: {
                        productid: data.productid,
                        locationid: records.adjustments.locationid,
                        inventorycount: data.newInventoryCount,
                        isactive: true,
                        isdeleted: false,
                        userid: records.token.userId || null,
                        accountid: records.token.accountId || null,
                        transactionTypeId: records.adjustments.transactionTypeId
                    },
                });
            })
        );

        response.result = "Product locations updated successfully.";
    } catch (e) {
        response.error = e.message;
    }

    return response;
};