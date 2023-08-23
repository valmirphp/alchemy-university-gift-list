const express = require('express');
const verifyProof = require('../utils/verifyProof');

const port = 1225;

const app = express();
app.use(express.json());

// hardcode a merkle root here representing the whole nice list
// paste the hex string in here, without the 0x prefix
const MERKLE_ROOT = '04ba90b6fc3c7bb78d6103ac7a4c298a37461508fe08ef96ba19a294b20fdd11';

const validateInputProof = (proof) => {
    if (!Array.isArray(proof)) {
        throw new Error("Proof must be an array");
    }

    if (proof.length === 0) {
        throw new Error("Proof must not be empty");
    }

    if (proof.some(p => typeof p.data !== 'string' && typeof p.left !== 'boolean')) {
        throw new Error("Proof must be an array of {data: string, left: boolean}");
    }
}

app.post('/gift', (req, res) => {
    // grab the parameters from the front-end here
    const {name, proof} = req.body;

    if (!name || !proof) {
        res.status(400).send("Missing name or proof");
        return;
    }

    if (typeof name !== 'string') {
        res.status(400).send("Name must be a string");
        return;
    }

    try {
        validateInputProof(proof);
    } catch (e) {
        res.status(400).send(e.message);
        return;
    }

    console.log("Request received for", name, "with proof", proof);

    const isInTheList = verifyProof(proof, name, MERKLE_ROOT);
    if (isInTheList) {
        res.send("You got a toy robot 🤖!");
    } else {
        res.send("You are not on the list 🧐");
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
