
import mongoose from 'mongoose';

const ComponentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên linh kiện'],
        trim: true,
    },
    type: {
        type: String,
        required: [true, 'Vui lòng chọn loại linh kiện'],
        enum: ['RAM', 'SSD', 'MOUSE', 'KEYBOARD', 'OTHER'], // Expand as needed
    },
    specs: {
        type: Object, // Flexible schema for different component types
        default: {},
    },
    price: {
        type: Number,
        required: [true, 'Vui lòng nhập giá'],
        min: 0,
    },
    image: {
        type: String,
        default: '',
    },
    stock: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        trim: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

// Prevent model overwrite in development
export default mongoose.models.Component || mongoose.model('Component', ComponentSchema);
