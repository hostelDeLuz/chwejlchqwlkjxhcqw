import clientPromise from "../../../../util/mongo";
import { ObjectId } from 'mongodb';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");
    const objectid = new ObjectId(req.query.id);

    db.collection("categoriadespesas").updateOne({ _id: objectid }, {
      $set: {
        titulo: req.body.titulo
      }
    });

  } catch (e) {
    console.error(e);
  }
};
