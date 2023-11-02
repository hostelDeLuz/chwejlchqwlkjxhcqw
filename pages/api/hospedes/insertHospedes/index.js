import clientPromise from "../../../../util/mongo";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");

    db.collection("hospedes").insertOne({
      nome: req.body.nome,
      rg: req.body.rg,
      cpf: req.body.cpf,
      passaporte: req.body.passaporte,
      datanascimento: req.body.datanascimento,
      telefone: req.body.telefone,
      genero: req.body.genero,
      email: req.body.email,
      saude: req.body.saude,
      cidadania: req.body.cidadania,
      aceitotermos: req.body.aceitotermos,
      rgfrente: req.body.rgfrente,
      rgverso: req.body.rgverso,
      assinatura: req.body.assinatura,
      aceitoregras: req.body.aceitoregras,
      observacoes: req.body.observacoes,
      formulario: req.body.formulario,
      qualproblema: req.body.qualproblema,
      datacadastro: req.body.datacadastro,
      cep: req.body.cep,
      uf: req.body.uf,
      cidade: req.body.cidade,
      logradouro: req.body.logradouro,
      numerocasa: req.body.numerocasa,
      complemento: req.body.complemento,
      endereco: req.body.endereco,
      bairro: req.body.bairro,
    }).then((data) => {
      console.log(data)
    }).catch((err) => console.log(err));

    // res.json(getCustomerByID);
  } catch (e) {
    console.error(e);
  }
};
