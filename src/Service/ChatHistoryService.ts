import { MongoClient } from "mongodb";
import { ChatRecord } from "../interfaces/ChatHistory";

export class ChatHistoryService {
    private collection;

    constructor(mongoClient: MongoClient) {
        this.collection = mongoClient.db("chatDB").collection("history");
    }

    async saveMessage(record: ChatRecord) {
        await this.collection.insertOne(record);
    }

    async getHistory(sessionId: string) {
        return await this.collection.find({ sessionId }).toArray();
    }
}