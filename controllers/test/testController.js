const { error } = require('console')
const fs = require('fs')
const path = require('path')


class Queue{
    constructor(capacity){
        this.capacity = capacity
        this.items = new Array(capacity)
        this.currentLength = 0
        this.front = -1
        this.rear = -1
    }

    isFull(){
        return this.currentLength == this.capacity
    }

    isEmpty(){
        return this.currentLength == 0
    }

    enqueue(element){
        if(!this.isFull()){
            this.rear = (this.rear + 1) % this.capacity
            this.items[this.rear] = element
            this.currentLength += 1
            if(this.front == -1){
                this.front = this.rear
            }
        }
    }

    dequeue(){
        if(this.isEmpty()){
            return null
        }

        const item = this.items[this.front]
        this.items[this.front] = null
        this.front = (this.front + 1) % this.capacity
        this.currentLength -=1

        if(this.isEmpty()){
            this.front = -1
            this.rear = -1

        }
        return item
    }

    peek(){
        if(!this.isEmpty()){
            return this.items[this.front]
        }
        return null
    }

    print(){
        if(this.isEmpty()){
            console.log("empty")
        }else{
            let i
            let str = ''
            for(i = this.front ; i !== this.rear; i= (i+1) % this.capacity){

                str += this.items[i] + " "
            }
            str += this.items[i] 

            console.log(str)

        }
        console.log(this.items)
    }
}



const testing = async (req, res) => {

    const queue = new Queue(5)
    queue.enqueue(5)
    queue.enqueue(7)
    queue.enqueue(3)
    queue.enqueue(3)
    queue.enqueue(3)


    console.log(queue.isFull())
    queue.print()
    res.status(200).json({"sum": "test"})
}



module.exports = {testing}