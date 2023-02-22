import { Document, Model, ObjectId } from "mongoose";
import { QueryResult } from "../paginate/paginate";

export interface IOrder {
    address: string;
    country: string;
    phone: number;
    total: number;
    product: Array<ObjectId>;
    user: ObjectId;
}

export interface IOrderDoc extends IOrder, Document {
  }

export interface IOrderModel extends Model<IOrderDoc>{
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
  }
