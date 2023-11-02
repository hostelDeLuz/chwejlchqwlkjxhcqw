import clientPromise from "../../../../util/mongo";
import { ObjectId } from 'mongodb';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");
    const objectid = new ObjectId(req.query.id);

    db.collection("hoteis").updateOne({ _id: objectid }, {
      $set: {
        titulo: req.body.titulo,
        subtitulo: req.body.subtitulo,
        imagem: req.body.imagem,
        ativo: req.body.ativo,
      }
    });

  } catch (e) {
    console.error(e);
  }
};
