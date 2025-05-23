import mongoose, {Document, Model, Schema} from "mongoose"

export interface IOrder extends Document {
  userId: string,
  courseId: string,
  payment_info: object
}

const orderSchema = new Schema<IOrder>({
  courseId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true 
  },
  payment_info: {
    type: Object
  }
})


export const OrderModel: Model<IOrder> = mongoose.model("order", orderSchema)