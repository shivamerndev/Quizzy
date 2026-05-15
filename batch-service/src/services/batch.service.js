import mongoose from 'mongoose';
import batchRepo from "../repository/batch.repo.js";



/**
 * Create a new batch with unique name validation.
 * @param {Object} batchData - Batch data object
 * @returns {Promise<Object>} Created batch document
 * @throws {Error} If batch name already exists
 */
const createBatch = async (batchData) => {
    const existingBatch = await batchRepo.findByName(batchData.name);

    if (existingBatch) {
        throw new Error('Batch name must be unique');
    }

    return await batchRepo.create(batchData);
}



/**
 * Retrieve a batch by its ID.
 * @param {string} batchId - Batch ID
 * @returns {Promise<Object>} Batch document
 * @throws {Error} If ID is invalid or batch not found
 */
const getBatchById = async (batchId) => {
    if (!mongoose.Types.ObjectId.isValid(batchId)) {
        throw new Error('Invalid batch ID');
    }

    const batch = await batchRepo.findById(batchId);
    if (!batch) {
        throw new Error('Batch not found');
    }
    return batch;
}



/**
 * Retrieve all non-deleted batches.
 * @returns {Promise<Array>} Array of batch documents
 */
const getAllBatches = async () => {
    return await batchRepo.findAll();
}



/**
 * Update a batch by ID.
 * @param {string} batchId - Batch ID
 * @param {Object} batchData - Updated batch data
 * @returns {Promise<Object>} Updated batch document
 * @throws {Error} If ID is invalid or batch not found
 */
const updateBatch = async (batchId, batchData) => {
    if (!mongoose.Types.ObjectId.isValid(batchId)) {
        throw new Error('Invalid batch ID');
    }

    const batch = await batchRepo.findById(batchId);
    if (!batch) {
        throw new Error('Batch not found');
    }

    return await batchRepo.update(batch, batchData);
}



/**
 * Soft delete a batch by ID (marks as deleted).
 * @param {string} batchId - Batch ID
 * @returns {Promise<Object>} Deleted batch document
 * @throws {Error} If ID is invalid or batch not found
 */
const deleteBatch = async (batchId) => {
    if (!mongoose.Types.ObjectId.isValid(batchId)) {
        throw new Error('Invalid batch ID');
    }

    const batch = await batchRepo.findById(batchId);
    if (!batch) {
        throw new Error('Batch not found');
    }

    return await batchRepo.softDelete(batch);
}