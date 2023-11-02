import clientPromise from "../../../../util/mongo";
import { ObjectId } from 'mongodb';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");
    const objectid = new ObjectId(req.query.id);

    db.collection("customers").updateOne({ _id: objectid }, {
      $set: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        cpf_cnpj: req.body.cpf,
        address_one: req.body.address_one,
        address_two: req.body.address_two,
        address_three: req.body.address_three,
        active: req.body.active,
      }
    });

  } catch (e) {
    console.error(e);
  }
};
