import clientPromise from "../../../../util/mongo";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");

    const customer = await db
      .collection("despesas")
      .find({ })
      .sort({ metacritic: -1 })
      .toArray();

    res.json(customer);
  } catch (e) {
    console.error(e);
  }
};