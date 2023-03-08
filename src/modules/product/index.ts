import * as productController from './product.controller';
import * as productInterfaces from './product.interfaces';
import Product from './product.model';
import * as productService from './product.service';
import * as productValidation from './product.validation';
import subscriber from './product.consumer';

export { productController, productInterfaces, Product, productService, productValidation, subscriber };
