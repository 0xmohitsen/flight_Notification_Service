const express = require('express');
const amqplib = require('amqplib');
const { EmailService } = require('./services');
const scheduleCrons = require('./utils/common/cron-job');

async function connectQueue(){
    try {
        const connection = await amqplib.connect("amqp://localhost");

        const channel = await connection.createChannel();

        await channel.assertQueue(ServerConfig.MSG_QUEUE);

        channel.consume(ServerConfig.MSG_QUEUE, (data) => {
            console.log(`${Buffer.from(data.content)}`);

            const object = JSON.parse(`${Buffer.from(data.content)}`);

            EmailService.sendMail("notiairline4@gmail.com", object.recipientEmail, object.content, object.text);

            channel.ack(data);
        })
    } catch (error) {
        console.log(error);
    }
}

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, async () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
    await connectQueue();
    console.log('Queue is up');
    scheduleCrons();
});
