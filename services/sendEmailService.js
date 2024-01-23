const mailgun = require('mailgun-js');

const mg = mailgun({
  apiKey: '43783e39653315761a0be9d79edee7ad-063062da-72a57ef4',
  domain: 'sandboxe4768f1d1b324ff6ad99ebeb156ad0df.mailgun.org'
});

const sendEmail = async function(name, email, title) {
    console.log(name);
    console.log(email);
    console.log(title);
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
