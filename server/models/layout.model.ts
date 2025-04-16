import mongoose, { Schema,Document,Model } from "mongoose";

interface FAQItem extends Document {
  // type: String,
  question: string;
  answer: string
}

interface Category extends Document {
  // type: String,
  title: string
}

interface BannerImage extends Document {
  public_id: string,
  url: string 
}

interface Layout extends Document {
  type: string
  faq: FAQItem[],
  categories: Category[],
  banner: {
    type: String,
    image: BannerImage,
    title: string,
    subTitle: string
  }
}

const FaqSchema = new Schema<FAQItem>({
  // type: String,
  question: {
    type: String
  },
  answer: {
    type: String
  }
})

const categorySchema = new Schema<Category>({
  // type: String,
  title: {
    type:String
  }
})

const bannerImageSchema = new Schema<BannerImage>({
  public_id: {
    type: String
  },
  url: {
    type: String
  }
}) 


const layoutSchema = new Schema<Layout>({
  type: String,
  faq: [FaqSchema],
  categories: [categorySchema],
  banner: {
    type: String,
    image: bannerImageSchema,
    title: {
      type: String
    },
    subTitle: {
      type: String
    }
  }
})


export const Layout: Model<Layout> = mongoose.model("layout", layoutSchema)