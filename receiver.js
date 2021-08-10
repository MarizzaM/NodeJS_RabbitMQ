const amqp = require('amqplib/callback_api');

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
// Create Connection
amqp.connect('amqp://localhost', (connError, connection) => {
    if (connError) {
        throw connError;
    }
    //  Create Channel
    connection.createChannel((channelError, channel) => {
        if (channelError) {
            throw channelError;
        }
        // Assert Queue
        const QUEUE = 'demo'
        channel.assertQueue(QUEUE);
        // Receive message from queue
        channel.consume(QUEUE, (msg) => {
            
            console.log(`Message received: ${msg.content.toString()}`)
            setTimeout(function() {
                channel.ack(msg);
            }, 3000);
        }, {
            // automatic acknowledgment mode,
            // see ../confirms.html for details
            noAck: false
        })
    })
})