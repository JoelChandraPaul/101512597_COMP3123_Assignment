import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (pw) {
  return bcrypt.compare(pw, this.password);
};

export default mongoose.model('User', userSchema);
