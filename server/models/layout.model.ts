import mongoose, { Document, Schema } from "mongoose";

interface ILayout extends Document {
  type: "Banner" | "FAQ" | "Categories";
  banner?: {
    image: {
      public_id: string;
      url: string;
    };
    title: string;
    subTitle: string;
  };
  faq?: {
    question: string;
    answer: string;
  }[];
  categories?: {
    title: string;
  }[];
}

const layoutSchema = new Schema<ILayout>(
  {
    type: {
      type: String,
      enum: ["Banner", "FAQ", "Categories"],
      required: true,
      unique: true,
    },
    banner: {
      image: {
        public_id: { type: String },
        url: { type: String },
      },
      title: String,
      subTitle: String,
    },
    faq: [
      {
        question: String,
        answer: String,
      },
    ],
    categories: [
      {
        title: String,
      },
    ],
  },
  {
    timestamps: true
  }
);

export const Layout = mongoose.model<ILayout>("Layout", layoutSchema);
