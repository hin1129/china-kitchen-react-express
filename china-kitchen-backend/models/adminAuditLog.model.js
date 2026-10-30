import mongoose from 'mongoose';

const AdminAuditLogSchema = new mongoose.Schema(
    {
        adminUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
            index: true
        },
        action: {
            type: String,
            enum: ['MENU_PRICE_CHANGED', 'MENU_STOCK_CHANGED'],
            required: true
        },
        itemId: { type: String, required: true, trim: true, maxlength: 100 },
        itemName: { type: String, required: true, trim: true, maxlength: 200 },
        oldValue: { type: mongoose.Schema.Types.Mixed, required: true },
        newValue: { type: mongoose.Schema.Types.Mixed, required: true }
    },
    { timestamps: true }
);

AdminAuditLogSchema.index({ createdAt: -1 });

const AdminAuditLog = mongoose.model('AdminAuditLog', AdminAuditLogSchema);
export default AdminAuditLog;
