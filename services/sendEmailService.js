const mailgun = require('mailgun-js');

const mg = mailgun({
  apiKey: '94e84ccb0408958cff9b84fa0c382b2f-063062da-741443a4',
  domain: 'sandbox9a41b9e9b51b4356bd90b00a920b85cb.mailgun.org'
});

const sendEmail = async function(name, email, title) {

    const data = {
    from: 'BOOKS NEWSLETTER NOCTUA SAPIENTIA <booksnewsletter@noctuasapientia.com>',
    to: email,
    subject: 'Nuevo Libro en Noctua Sapientia',
    text: `¡Hola ${name}! ¡Estamos encantados de que leas este correo! Te escribimos para confirmarte que el libro: ${title} ha
    sido subido a la plataforma. Disfruta de tu experiencia en Noctua Sapientia.`
  };

  try {
    const result = await mg.messages().send(data);
    console.log('Correo enviado con éxito:', result);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

module.exports = {
  sendEmail: sendEmail
};
