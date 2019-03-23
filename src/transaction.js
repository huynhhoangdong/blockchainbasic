const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp, transaction, previousHash = '') {
        this.timestamp = timestamp;
        this.transaction = transaction;
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
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;



    }

    createGenesisBlock(){
        return new Block("01/01/2019", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    // addBlock(newBlock){
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     //newBlock.hash = newBlock.calculateHash();
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        // Create hash of block with difficulty level
        block.mineBlock(this.difficulty);
        console.log('Block successfully mined!');
        // add block to chain
        this.chain.push[block];

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]

    }

    createTransaction(transaction){
        this.pendingTransactions.push[transaction]
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for(const block of this.chain) {
            for(const trans of block.transaction){
                if(trans.toAddress === address) {
                    balance += trans.amount;
                }

                if(trans.fromAddress === address) {
                    balance += trans.amount;
                }
                
            }
        }

        return balance;
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

TCoin.createTransaction(new Transaction('address1', 'address2', 100));
TCoin.createTransaction(new Transaction('address2', 'address1', 50));
TCoin.createTransaction(new Transaction('address1', 'address3', 20));


TCoin.minePendingTransactions('Dongs address');

console.log('Balance of Dong, ' + TCoin.getBalanceOfAddress('Dongs address'));


