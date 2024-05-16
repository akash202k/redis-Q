import { client } from "./redisClient"
import dotenv from "dotenv"
dotenv.config();

type TSubmission = {
    id: string
    lang: string,
    code: string
}
async function ProbProcessor(submission: TSubmission) {
    console.log("\n---------------------------------------------------");
    console.log("Processing problem\n");
    await new Promise(resolve => setTimeout(resolve, 5000)); // Await the promise to delay execution
    console.log("id: ", submission.id)
    console.log("lang: ", submission.lang);
    console.log("code: ", submission.code);
    console.log("\nproblem processed");


}

async function Consumer() {
    try {
        await client.connect();
        console.log("worker connected to redis");

        while (true) {
            try {
                const submission = await client.brPop("submissions", 0);
                if (submission) {
                    ProbProcessor(JSON.parse(submission.element));
                }

            } catch (error) {

            }
        }
    } catch (error) {
        console.log("Something went wrong while connecting to redis");
    }

}

Consumer();