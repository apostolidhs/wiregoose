/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'notificationsEmail', ($_, $q, $nodemailer, config) => {

  return {
    send
  };

  function send(opts) {
    const to = $_.castArray(opts.to);
    const subject = opts.subject;
    const content = opts.content;

    const transporter = $nodemailer.createTransport(config.EMAIL_SMTP);

    const from = config.EMAIL_NAME ? '"' + config.EMAIL_NAME + '" <' + config.EMAIL_ADDRESS + '>'
                  : config.EMAIL_ADDRESS;

    const mailOptions = {
        from, // sender address
        to: $_.join(to, ', '), // list of receivers
        subject: subject, // Subject line
        html: content // html body
    };   

    return $q.promisify(cb => transporter.sendMail(mailOptions, cb));   
  }

});