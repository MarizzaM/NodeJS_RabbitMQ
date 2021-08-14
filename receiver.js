const { MongoClient } = require('mongodb');
const amqp = require('amqplib/callback_api');

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

            main(msg).catch(console.error);

            setTimeout(function() {
                channel.ack(msg);
            }, 3000);
        }, {
            noAck: false
        })
    })
})

async function main(msg) {

    const uri = "mongodb+srv://demo:12344321@cluster0.zpxqd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {
// Connect to the MongoDB cluster
        await client.connect();

// Create a single new listing
        await createListing(client ,
            {
                text: msg.content.toString()
            }
        );
    } catch (e) {
        console.error(e);
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

// Create a single new listing
async function createListing(client, newListing){
    
    const result = await client.db("sample_messenger").collection("message").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}
