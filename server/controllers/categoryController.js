import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
const createCategory = asyncHandler(async (req, res) => {
    const { name, parent } = req.body;
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
        res.status(400);
        throw new Error('Category already exists');
    }
    const category = new Category({ name, parent: parent || null });
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
});

/**
 * @desc    Get all categories with their parent info
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({}).populate('parent', 'name');
    res.json(categories);
});

/**
 * @desc    Update an existing category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
const updateCategory = asyncHandler(async (req, res) => {
    const { name, parent } = req.body;
    const category = await Category.findById(req.params.id);

    if (category) {
        category.name = name || category.name;
        category.parent = parent === '' ? null : parent || category.parent;
        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

/**
 * @desc    Delete a category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        // Advanced: In a real app, you should check if this category is being used by any products before deleting.
        await category.deleteOne();
        res.json({ message: 'Category removed' });
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

export { createCategory, getCategories, updateCategory, deleteCategory };