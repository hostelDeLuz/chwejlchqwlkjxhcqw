import clientPromise from "../../../../util/mongo";
import { ObjectId } from 'mongodb';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");
    const objectid = new ObjectId(req.query.id);
    db.collection("faq").updateOne({ _id: objectid }, {
      $set: {
        question: req.body.question,
        answer: req.body.answer,
      }
    });

  } catch (e) {
    console.error(e);
  }
};
