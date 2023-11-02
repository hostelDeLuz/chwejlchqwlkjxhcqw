import clientPromise from "../../../../util/mongo";
import { ObjectId } from 'mongodb';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");
    const objectid = new ObjectId(req.query.id);
    
    db.collection("access").updateOne({ _id: objectid }, {
      $set: {
        name: req.body.name,
        email: req.body.email,
        login: req.body.user,
        password: req.body.password,
        hostel: req.body.hostel,
        level: req.body.userlevel,
        active: 1,
      }
    });

  } catch (e) {
    console.error(e);
  }
};
