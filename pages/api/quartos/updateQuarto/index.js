import clientPromise from "../../../../util/mongo";
import { ObjectId } from 'mongodb';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");
    const objectid = new ObjectId(req.query.id);

    db.collection("quartos").updateOne({ _id: objectid }, {
      $set: {
        titulo: req.body.titulo,
        camas: req.body.camas,
        arrCamas: req.body.arrCamas,
        imagem: req.body.imagem,
        hotel: req.body.hotel,
        genero: req.body.genero,
        ativado: req.body.ativado,
      }
    });

  } catch (e) {
    console.error(e);
  }
};
