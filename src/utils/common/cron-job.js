const cron = require('node-cron');

const { EmailService } = require('../../services');
const { SUCCESS } = require('./enum');

function scheduleCrons(){
    cron.schedule('*/2 * * * *', async () => {
        const response = await EmailService.getPendingEmails();
        response.forEach((email) => {
            EmailService.sendMail("notiairline4@gmail.com",
                                    email.recipientEmail,
                                    email.subject,
                                    email.content
                                    );
        })

        console.log(response);
    });
}

module.exports = scheduleCrons;