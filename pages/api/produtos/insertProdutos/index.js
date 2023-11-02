import clientPromise from "../../../../util/mongo";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");

    db.collection("products").insertOne({
      nome: req.body.nome,
      valorCompra: req.body.valorCompra,
      valorVenda: req.body.valorVenda,
      estoque: req.body.estoque,
      imagem: req.body.imagem,
    }).then((data) => {
      console.log(data)
    }).catch((err) => console.log(err));

    // res.json(getItemByID);
  } catch (e) {
    console.error(e);
  }
};
