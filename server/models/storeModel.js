import mongoose from 'mongoose';

const storeSchema = mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    logo: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Store = mongoose.model('Store', storeSchema);
export default Store;