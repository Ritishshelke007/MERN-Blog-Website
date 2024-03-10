import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    blog_id: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    blog_author: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    children: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
    },
    commented_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    isReply: {
      type: Boolean,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  {
    timestamps: {
      createdAt: "commentedAt",
    },
  }
);

export const Comment = mongoose.model("Comment", commentSchema);
