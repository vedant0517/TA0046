const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['donor', 'volunteer', 'organization'] },
    phone: { type: String, default: '' }
}, { timestamps: true });

// Auto-generate userId before saving
userSchema.pre('save', async function () {
    if (!this.userId) {
        const count = await mongoose.model('User').countDocuments();
        this.userId = `USR-${String(count + 1).padStart(4, '0')}`;
    }
    // Hash password if modified
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

// Static: create user (check for duplicate email)
userSchema.statics.findByEmail = async function (email) {
    return this.findOne({ email: email.toLowerCase().trim() });
};

// Instance: compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Instance: return safe user data (no password)
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
