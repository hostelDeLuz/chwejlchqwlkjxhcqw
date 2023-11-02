import clientPromise from "../../../../util/mongo";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");

    db.collection("customers").insertOne({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      cpf_cnpj: req.body.cpf_cnpj,
      address_one: req.body.address_one,
      address_two: req.body.address_two,
      address_three: req.body.address_three,
      active: req.body.active,
    }).then((data) => {
      console.log(data)
    }).catch((err) => console.log(err));

    // res.json(getCustomerByID);
  } catch (e) {
    console.error(e);
  }
};
