import mongoose, { Document, Model, ObjectId } from "mongoose";
import { QueryResult } from "../paginate/paginate";

export interface IProduct {
    _id: mongoose.Types.ObjectId,
    name: string;
    description: string;
    price: number;
    stock: number;
    user: ObjectId;
}

export interface IProductDoc extends IProduct, Document {
  _id: mongoose.Types.ObjectId,
  }

export interface IProductModel extends Model<IProductDoc>{
  _id: mongoose.Types.ObjectId,
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
  }
