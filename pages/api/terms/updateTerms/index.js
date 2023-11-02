import clientPromise from "../../../../util/mongo";
import { ObjectId } from 'mongodb';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");
    const objectid = new ObjectId(req.query.id);
    db.collection("terms_responsibility").updateOne({ _id: objectid }, {
      $set: {
        text: req.body.text,
        active: 1,
      }
    });

  } catch (e) {
    console.error(e);
  }
};
