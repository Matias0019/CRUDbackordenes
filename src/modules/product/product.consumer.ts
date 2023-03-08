import * as amqp from 'amqplib'
import { productService } from '.'

const queue = 'product'

export default async function subscriber(){
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()

    await channel.assertQueue(queue)

    channel.consume(queue, async(message: any) => {
        const content = JSON.parse(message.content.toString())

        console.log(`Message recibido de la cola: ${queue}`)
        content.product._id = content.product.id
        const product = await productService.createProduct(content.product);
        console.log(product);

    
        channel.ack(message)

    })
}

subscriber().catch((error)=>{
    console.log(error)
    process.exit(1)
})
