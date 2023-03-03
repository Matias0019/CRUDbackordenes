import mongoose from 'mongoose';
import Schema from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IOrderDoc, IOrderModel } from './order.interfaces';
import { Cart } from '../cart';

const orderSchema = new mongoose.Schema<IOrderDoc, IOrderModel>(
  {
    carts: {
      type: [Cart.schema],
      ref: 'Carts',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

const Order = mongoose.model<IOrderDoc, IOrderModel>('Order', orderSchema);

export default Order;
