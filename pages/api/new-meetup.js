import { MongoClient } from "mongodb"

async function handler(req, res) {
    if (req.method === "POST"){
        const data = req.body

        const client = await MongoClient.connect(`mongodb+srv://${process.env.MONGO_CLIENT}:${process.env.MONGO_PASSWORD}@cluster0.g0fnd.mongodb.net/myPersonalData?retryWrites=true&w=majority`)
        const db = client.db()

        const meetupsCollection = db.collection('myPersonalData')

        const result = await meetupsCollection.insertOne(data)

        console.log(result)

        client.close()

        res.status(201).json({message: 'Sucsess'})
    }
}

export default handler