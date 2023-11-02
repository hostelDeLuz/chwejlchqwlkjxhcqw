import clientPromise from "../../../../util/mongo";
import { ObjectId } from 'mongodb';

export default async (req, res) => {
  const objectid = new ObjectId(req.query.id);

  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");
    
    const deleteCustomer = db.collection("hoteis").deleteOne({ _id: objectid })
      .then((data) => console.log(data))
      .catch(err => console.log(err));

    res.json(deleteCustomer);
  } catch (e) {
    console.error(e);
  }
};
