import Batch from "../models/batch.model.js";

/**
 * Find a batch by name (non-deleted).
 * @param {string} name - Batch name
 * @returns {Promise<Object|null>} Batch document or null
 */
const findByName = async (name) => {
    return await Batch.findOne({ name, isDeleted: false });
};

/**
 * Find a batch by ID (non-deleted).
 * @param {string} batchId - Batch ID
 * @returns {Promise<Object|null>} Batch document or null
 */
const findById = async (batchId) => {
    return await Batch.findOne({ _id: batchId, isDeleted: false });
};

/**
 * Find all non-deleted batches.
 * @returns {Promise<Array>} Array of batch documents
 */
const findAll = async () => {
    return await Batch.find({ isDeleted: false });
};

/**
 * Create a new batch.
 * @param {Object} batchData - Batch data
 * @returns {Promise<Object>} Created batch document
 */
const create = async (batchData) => {
    return await Batch.create(batchData);
};

/**
 * Update a batch by ID.
 * @param {Object} batch - Batch document
 * @param {Object} batchData - Updated batch data
 * @returns {Promise<Object>} Updated batch document
 */
const update = async (batch, batchData) => {
    Object.assign(batch, batchData);
    return await batch.save();
};

/**
 * Soft delete a batch.
 * @param {Object} batch - Batch document
 * @returns {Promise<Object>} Deleted batch document
 */
const softDelete = async (batch) => {
    batch.isDeleted = true;
    return await batch.save();
};

export default {
    findByName,
    findById,
    findAll,
    create,
    update,
    softDelete,
};
