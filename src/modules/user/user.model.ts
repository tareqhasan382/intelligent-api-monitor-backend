import mongoose, { Schema } from "mongoose";
import { IUser, IUserModel } from "./user.interface";
import config from "../../config";
import bcrypt from "bcryptjs";

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    passwordSalt: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.passwordSalt;
      },
    },
  }
);

UserSchema.pre("save", async function () {
  const user = this as any;
  if (!user.isModified("password")) return;
  
  user.password = await bcrypt.hash(
    user.password,
    Number(config.jwt.bycrypt_salt_rounds)
  );
});

const User = mongoose.model<IUser, IUserModel>("User", UserSchema);

export default User;
