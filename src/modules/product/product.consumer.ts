import * as amqp from 'amqplib'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import { productService } from '.'
import { ApiError } from '../errors'
//import Pulsar from 'pulsar-client'
import { Kafka } from 'kafkajs';

const queuecreate = 'create-product'
const queueupdate = 'update-product'
const queuedelete = 'delete-product'

run().then(() => console.log("Done"), err => console.log(err));

async function run() {
    const kafka = new Kafka({ brokers: ["localhost:9092"] });
    const consumer = kafka.consumer({ groupId: "" + Date.now() });
  
    await consumer.connect();
  
    await consumer.subscribe({ topic: "product", fromBeginning: true });
    await consumer.run({ 
      eachMessage: async (data:any) => {
        //console.log(data.message.value.toString("utf8"));
        const content = JSON.parse(data.message.value.toString("utf8"));
        content._id = content.id 
        const product = await productService.createProduct(content);
        console.log(product);
      }
    });
  }

export async function subscriber1(){
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()

    await channel.assertQueue(queuecreate)

    channel.consume(queuecreate, async(message: any) => {
        const content = JSON.parse(message.content.toString())

        console.log(`Message recibido de la cola: ${queuecreate}`)
        content.product._id = content.product.id
        const product = await productService.createProduct(content.product);
        console.log(product);  
        channel.ack(message)

    });



// (async () => {
//   // Create a client
//   const client = new Pulsar.Client({
//     serviceUrl: 'pulsar://localhost:6650',
//   });

//   // Create a consumer
//   const consumer = await client.subscribe({
//     topic: 'my-topic1',
//     subscription: 'my-subscription',
//     subscriptionType: 'Exclusive',
//   });

//   // Receive messages
//   for (let i = 0; i < 10; i += 1) {
//     const msg = await consumer.receive();
//     console.log(msg.getData().toString());
//     consumer.acknowledge(msg);
//   }

//   await consumer.close();
//   await client.close();
// })();
}

subscriber1().catch((error)=>{
    console.log(error)
    process.exit(1)
})

export async function subscriber2(){
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()

    await channel.assertQueue(queueupdate)

    channel.consume(queueupdate, async(message: any) => {
        const content = JSON.parse(message.content.toString())

        console.log(`Message recibido de la cola: ${queueupdate}`)
        content.product._id = content.product.id
        const product = await productService.updateProductById(new mongoose.Types.ObjectId(content.product._id), content.product);
        if (!product){
                throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
            }
        console.log(product);
        channel.ack(message)

    })
}

subscriber2().catch((error)=>{
    console.log(error)
    process.exit(1)
})

export async function subscriber3(){
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()

    await channel.assertQueue(queuedelete)

    channel.consume(queuedelete, async(message: any) => {
        const content = JSON.parse(message.content.toString())

        console.log(`Message recibido de la cola: ${queuedelete}`)
        console.log(content.productId)
        //content._id = content.id
        const product =await productService.deleteProductById(new mongoose.Types.ObjectId(content.productId));
        if (!product){
            throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
        }
        console.log('Producto eliminado');  
        channel.ack(message)

    })
}

subscriber3().catch((error)=>{
    console.log(error)
    process.exit(1)
})
