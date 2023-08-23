const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

// create the merkle tree for the whole nice list
const merkleTree = new MerkleTree(niceList);

async function main() {
    // get arguments from command line
    const args = process.argv.slice(2);
    const name = args[0] || 'Norman Block';

    console.log("Finding proof for", name, "in the nice list...")

    // find the proof that norman block is in the list
    const index = niceList.findIndex(n => n === name);

    if (index === -1) {
        console.log("Name not found in the nice list");
        return;
    }

    const proof = merkleTree.getProof(index);

    const {data: gift} = await axios.post(`${serverUrl}/gift`, {
        name, proof
    });

    console.log({gift});
}

main();
