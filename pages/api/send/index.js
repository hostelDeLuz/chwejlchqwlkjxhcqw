const sgMail = require('@sendgrid/mail')

export default async function(req, res) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  const { name, email, senderEmail, subtitleEmail, saleId, valueStatus } = req.body
  

  const content = {
    to: email,
    from: senderEmail,
    subject: subtitleEmail,
    html: `

    <div style="border: #D2AB66 1px solid;">
      <div style="background-color: #D2AB66; padding: 20px 0; margin: 0;">
        <h2 style="text-align: center; color: #B01D21;">
          As Papoulas
        </h2>
      </div>

      <div style="padding:30px;">
        <p>Olá <b>${name}</b></p>
        <p>
          Seu pedido número <b>#${saleId}</b>, teve atualização em seu status
          para
          <b>${valueStatus}</b>
        </p>
        <p>
          Para mais infomações acesse a página do site
          <a href="http://aspapoulas.com.br/UserProfile" target="_blank" rel="noopener noreferrer">aspapoulas.com.br/UserProfile</a> 
        </p>
      </div>

      <div style="background-color: #D2AB66; padding: 20px 0; margin: 0;">
        <h3 style="text-align: center; color: #B01D21;">
          Agradecemos pela sua compra!
        </h3>
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