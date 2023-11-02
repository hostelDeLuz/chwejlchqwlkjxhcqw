import clientPromise from "../../../../util/mongo";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");

    db.collection("faq").insertOne({
      question: req.body.question,
      answer: req.body.answer,
    }).then((data) => {
      console.log(data)
    }).catch((err) => console.log(err));

    // res.json(getCustomerByID);
  } catch (e) {
    console.error(e);
  }
};
