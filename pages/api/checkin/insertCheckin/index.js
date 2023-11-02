import clientPromise from "../../../../util/mongo";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");

    db.collection("checkin").insertOne({
      nome: req.body.nome,
      rg: req.body.rg,
      cpf: req.body.cpf,
      passaporte: req.body.passaporte,
      datanascimento: req.body.datanascimento,
      telefone: req.body.telefone,
      genero: req.body.genero,
      entrada: req.body.entrada,
      diaLimpeza: req.body.entrada,
      saidamanha: req.body.saidamanha,
      saida: req.body.saida,
      formapagamento: req.body.formapagamento,
      valorpago: req.body.valorpago,
      valordiaria: req.body.valordiaria,
      observacoes: req.body.observacoes,
      objreserva: req.body.objreserva,
      ativado: req.body.ativado,
      pagamentoconcluido: req.body.pagamentoconcluido,
      checkinID: req.body.checkinID,
      usuario: req.body.usuario,
      acesso_comanda: req.body.acesso_comanda,
    }).then((data) => {
      console.log(data)
    }).catch((err) => console.log(err));

    // res.json(getCustomerByID);
  } catch (e) {
    console.error(e);
  }
};
