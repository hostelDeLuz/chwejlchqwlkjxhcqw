import clientPromise from "../../../../util/mongo";
import { ObjectId } from 'mongodb';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");
    const objectid = new ObjectId(req.query.id);
    db.collection("products").updateOne({ _id: objectid }, {
      $set: {
        nome: req.body.nome,
        valorCompra: req.body.valorCompra,
        valorVenda: req.body.valorVenda,
        estoque: req.body.estoque,
        imagem: req.body.imagem,
      }
    });

  } catch (e) {
    console.error(e);
  }
};
