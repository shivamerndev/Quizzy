import asyncHandler from '../utils/asyncHandler.js';
import { createBatch, getAllBatches, getBatchById, updateBatch, deleteBatch } from '../services/batch.service.js';

export const handleCreateBatch = asyncHandler(async (req, res) => {
    const { name, description, maxCapacity, status } = req.body;

    const batch = await createBatch({
        name,
        description,
        maxCapacity,
        status,
        createdBy: req.user?._id || req.user?.id,
    });

    return res.status(201).json({
        success: true,
        message: "Batch created successfully",
        batch,
    });
});


export const handleGetAllBatches = asyncHandler(async (req, res) => {
    const batches = await getAllBatches();

    return res.status(200).json({
        success: true,
        message: "Batches fetched successfully",
        batches,
    });
});


export const handleGetBatchById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const batch = await getBatchById(id);

    if (!batch) {
        return res.status(404).json({
            success: false,
            message: "Batch not found",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Batch fetched successfully",
        batch,
    });
});


export const handleUpdateBatch = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { name, description, maxCapacity, status } = req.body; 

    const batch = await updateBatch(id, {
        name,
        description,
        maxCapacity,
        status,
    });

    if (!batch) {
        return res.status(404).json({
            success: false,
            message: "Batch not found",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Batch updated successfully",
        batch,
    });
});


export const handleDeleteBatch = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const batch = await deleteBatch(id);

    if (!batch) {
        return res.status(404).json({
            success: false,
            message: "Batch not found",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Batch deleted successfully",
    });
});
