import sgMail from '@sendgrid/mail';

export default async function(req, res) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const { name, email, emailInput, telefone, texto, senderEmail, subtitleEmail } = req.body;

  

  const content = {
    to: email,
    replyTo: {
      email: emailInput,
      name: 'Resposta de formulário'
    },
    from: {
      email: senderEmail,
      name: 'Contato via site!'
    },
    subject: subtitleEmail,
    html: `

    <div style="border: #D2AB66 1px solid;">
      <div style="background-color: #D2AB66; padding: 20px 0; margin: 0;">
        <h2 style="text-align: center; color: #B01D21;">
          Bellas Natural
        </h2>
      </div>

      <div style="padding:30px;">
        <p>
          <p>Você recebeu uma mensagem na sua loja de:</p>
          <p><b>Nome: ${name}</b></p>
          <p><b>E-mail: ${emailInput}</b></p>
          <p><b>Telefone: ${telefone}</b></p>
          <p><b>Contato: ${texto}</b></p>
        </p>
        <p><b>${subtitleEmail}</b></p>
      </div>
    </div>

    `
  }

  try {
    await sgMail.send(content)
    res.status(200).send('Message sent successfully.')
  } catch (error) {
    console.log('ERROR', error)
    res.status(400).send('Message not sent.')
  }
}