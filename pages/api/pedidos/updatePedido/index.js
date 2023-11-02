import clientPromise from "../../../../util/mongo";
import { ObjectId } from 'mongodb';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");
    const objectid = new ObjectId(req.query.id);

    db.collection("pedidos").updateOne({ _id: objectid }, {
      $set: {
        data_pedido: req.body.data_pedido,
        comandas: req.body.comandas,
        cpf: req.body.cpf,
        hostel: req.body.hostel,
        dataentrada: req.body.dataentrada,
        datafechamento: req.body.datafechamento,
        ativo: req.body.ativo,
        produtos: req.body.produtos,
        desconto: req.body.desconto,
        valor_total: req.body.valor_total,
        metodo_pagamento: req.body.metodo_pagamento,
        acesso_comanda: req.body.acesso_comanda,
      }
    });

  } catch (e) {
    console.error(e);
  }
};
