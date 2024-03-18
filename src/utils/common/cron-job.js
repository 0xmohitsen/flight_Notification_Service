const cron = require('node-cron');

const { EmailService } = require('../../services');
const { MAILER } = require('../../config');
const { SUCCESS } = require('./enum');

function scheduleCrons(){
    cron.schedule('*/2 * * * *', async () => {
        const response = await EmailService.getPendingEmails();
        response.forEach((email) => {
            MAILER.sendMail({
                to: email.recipientEmail,
                subject: email.subject,
                text: email.content
            }, async (err, data) => {
                if(err){
                    console.log(err);
                } else{
                    console.log(data);
                    await EmailService.updateTicket(email.id, {status: SUCCESS});
                }
            });
        })

        console.log(response);
    });
}

module.exports = scheduleCrons;