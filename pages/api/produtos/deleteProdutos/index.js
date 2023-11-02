import clientPromise from "../../../../util/mongo";
import { ObjectId } from 'mongodb';

export default async (req, res) => {
  const objectid = new ObjectId(req.query.id);

  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");
    
    const deleteItem = db.collection("products").deleteOne({ _id: objectid })
      .then((data) => console.log(data))
      .catch(err => console.log(err));

    res.json(deleteItem);
  } catch (e) {
    console.error(e);
  }
};
