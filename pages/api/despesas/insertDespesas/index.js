import clientPromise from "../../../../util/mongo";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");

    db.collection("despesas").insertOne({
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      categoria: req.body.categoria,
      quantidade: req.body.quantidade,
      hostel: req.body.hostel,
      entrada: req.body.entrada,
      valor: req.body.valor,
    }).then((data) => {
      console.log(data)
    }).catch((err) => console.log(err));

    // res.json(getCustomerByID);
  } catch (e) {
    console.error(e);
  }
};
