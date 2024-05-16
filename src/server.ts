import { client } from "./redisClient"
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 8080;
app.use(express.json());



const startServer = async () => {
    try {
        await client.connect();
        console.log("server connected to redis");
        app.listen(port, () => {
            console.log(`server started at http://localhost:${port}`);
        });
    } catch (error) {
        console.log("Something went wrong while connecting to redis");
    }
}

startServer();

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/submit", (req, res) => {
    const { lang, code } = req.body;
    const id = Math.random().toString(36).substring(7);
    const problem = {
        id,
        lang,
        code
    }
    client.lPush("submissions", JSON.stringify(problem));
    res.status(200).json({
        id,
        message: "problem submitted",
    })
    return;
});


app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("Something went wrong");
    next(err);

});
