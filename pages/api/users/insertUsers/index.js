import clientPromise from "../../../../util/mongo";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");

    db.collection("access").insertOne({
      name: req.body.name,
      email: req.body.email,
      login: req.body.user,
      password: req.body.password,
      hostel: req.body.hostel,
      level: req.body.userlevel,
      active: 1,
    }).then((data) => {
      console.log(data)
    }).catch((err) => console.log(err));

    // res.json(getCustomerByID);
  } catch (e) {
    console.error(e);
  }
};
