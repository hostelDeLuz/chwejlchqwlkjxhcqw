import clientPromise from "../../../../util/mongo";
import { ObjectId } from 'mongodb';

const deleteCheckin = async (req, res) => {
  const objectid = new ObjectId(req.query.id);

  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");
    const deleteCustomer = db.collection("checkin").deleteOne({ _id: objectid })
      .then((data) => console.log(data))
      .catch(err => console.log(err));

    res.json(deleteCustomer);
  } catch (e) {
    console.error(e);
  }
};

export default deleteCheckin;