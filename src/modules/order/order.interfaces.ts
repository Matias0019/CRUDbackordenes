import { Document, Model, ObjectId } from "mongoose";
import { ICart } from "../cart/cart.interfaces";
import { QueryResult } from "../paginate/paginate";

export interface IOrder {
    carts: Array<ICart>;
    user: ObjectId;
}

export interface IOrderDoc extends IOrder, Document {
  }

export interface IOrderModel extends Model<IOrderDoc>{
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
  }
