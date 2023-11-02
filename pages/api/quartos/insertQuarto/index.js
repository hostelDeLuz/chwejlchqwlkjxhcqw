import clientPromise from "../../../../util/mongo";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("Hosteldeluz");

    db.collection("quartos").insertOne({
      titulo: req.body.titulo,
      camas: req.body.camas,
      arrCamas: req.body.arrCamas,
      imagem: req.body.imagem,
      hotel: req.body.hotel,
      genero: req.body.genero,
      ativado: req.body.ativado,
    }).then((data) => {
      console.log(data)
    }).catch((err) => console.log(err));

    // res.json(getCustomerByID);
  } catch (e) {
    console.error(e);
  }
};
