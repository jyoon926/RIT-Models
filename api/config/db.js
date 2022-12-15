const mongoose = require('mongoose');
const adminPassword = encodeURIComponent(process.env.DATABASE_PASSWORD);
const uri = `mongodb+srv://admin:${adminPassword}@${process.env.DATABASE_CLUSTER_NAME}.vckakjh.mongodb.net/?retryWrites=true&w=majority`;

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(`${uri}`, (err) => {
        if (err) {
            console.log("Connection to MongoDb failed: " + err);
            return;
        }
        console.log("Successfully connected to MongoDb!");
    });
}

module.exports = mongoose;