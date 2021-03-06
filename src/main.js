const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();

        //proof of work  ==> Ensure the hash will be change of each time the hash dose not match the requierment
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + this.nonce + JSON.stringify(this.data)).toString();
    }

    //proof of work
    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty)!==Array(difficulty+1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);

    }
}

class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2019", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        //newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    isChainValid(){
        // Start at 1, because we can not change genesis Block
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }

            return true;



        }
    }
}

let TCoin = new BlockChain();

console.log('Mining Block 1 ...')
TCoin.addBlock(new Block(1, "01/01/2019", { amount: 2 }));
console.log('Mining Block 2 ...')
TCoin.addBlock(new Block(2, "01/02/2019", { amount: 3 }));
TCoin.addBlock(new Block(3, "01/03/2019", { amount: 4 }));
TCoin.addBlock(new Block(4, "01/04/2019", { amount: 5 }));

// console.log('>>> Is Block Chain is valid? ' + TCoin.isChainValid());

// TCoin.chain[1].data = { amount: 100 };

// console.log('>>> Is Block Chain is valid? ' + TCoin.isChainValid());

// console.log(JSON.stringify(TCoin, null, 2));