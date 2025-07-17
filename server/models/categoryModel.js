import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    // This field enables multi-level categories, referencing itself.
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null, // A null parent means it's a top-level category
    },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;