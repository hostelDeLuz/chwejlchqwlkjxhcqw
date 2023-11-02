import clientPromise from "../../../../util/mongo";
import { ObjectId } from 'mongodb';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");
    const objectid = new ObjectId(req.query.id);
    db.collection("policy_privacity").updateOne({ _id: objectid }, {
      $set: {
        text: req.body.text,
        active: req.body.active,
      }
    });

  } catch (e) {
    console.error(e);
  }
};
