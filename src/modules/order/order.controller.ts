import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as orderService from './order.service';
import axios from 'axios';
import * as amqp from 'amqplib'

var channel: amqp.Channel, connection;
var queue = 'order'

async function connect() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("order");
}
connect();

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  req.body.user = req.user._id
  const order = await orderService.createOrder(req.body);
  const carts = order.carts;
  // axios({
  //   method:'POST',
  //   url: 'http://localhost:3000/v1/orders',
  //   headers: {authorization:req.headers.authorization},
  //   data: {
  //     _id: order._id,
  //     address: order.address,
  //     country:order.country,
  //     phone: order.phone,
  //     total: order.total,
  //     product: order.product
  //   },
  // }).then(res => {
  //   if (res.status === 200) {
  //     console.log('Orden Replicada')           
  //   }
  // })
  // .catch(e => {
  //   console.log(e+'Error en replicacion de la orden')
  // })
  const sent = await channel.sendToQueue(
    "order",
    Buffer.from(
        JSON.stringify({
          carts
        })
    )
);
  sent
      ? console.log(`Sent message to "${queue}" queue`, req.body)
      : console.log(`Fails sending message to "${queue}" queue`, req.body)

  res.status(httpStatus.CREATED).send(order);
});

export const getOrders = catchAsync(async (req: Request, res: Response) => {
  const filter = {user:req.user._id};
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await orderService.queryOrders(filter, options);
  res.send(result);
});

export const getOrder = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['orderId'] === 'string') {
    const order = await orderService.getOrderById(new mongoose.Types.ObjectId(req.params['orderId']));
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }
    res.send(order);
  }
});

export const updateOrder = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['orderId'] === 'string') {
    const order = await orderService.updateOrderById(new mongoose.Types.ObjectId(req.params['orderId']), req.body);
   
    axios({
      method:'PATCH',
      url: (`http://localhost:3000/v1/orders/${req.params['orderId']}`),
      headers: {authorization:req.headers.authorization},
      data: {
        carts: order?.carts
      },
    }).then(res => {
      if (res.status === 200) {
        console.log('Orden moficada')           
      }
    })
    .catch(e => {
      console.log(e+'Error en modificacion de la orden')
    })
    res.send(order);
  }
  
});

export const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['orderId'] === 'string') {
    await orderService.deleteOrderById(new mongoose.Types.ObjectId(req.params['orderId']));
    axios({
      method:'DELETE',
      url: (`http://localhost:3000/v1/orders/${req.params['orderId']}`),
      headers: {authorization:req.headers.authorization},
      data: {
      },
    }).then(res => {
      if (res.status === 200) {
        console.log('Orden Eliminado')           
      }
    })
    .catch(e => {
      console.log(e+'Error en la eliminacion de la orden')
    })
    res.status(httpStatus.NO_CONTENT).send();
  }
});
