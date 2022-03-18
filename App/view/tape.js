const Symbol = require('./symbol');

module.exports = class Tape {
    constructor() {
        this.size = 0;
        this.head = new Symbol();
        this.tail = new Symbol();
        this.current = this.head;

        this.head.setNext(tail);
        this.tail.setPrevious(head);
    }

    getCurrentValue() {
        return this.current.value;
    }

    addSymbol(symbolValue) {
        var newSymbol = new Symbol(symbolValue);

        this.current.getNext().setPrevious(newSymbol);

        newSymbol.setPrevious(this.current);
        newSymbol.setNext(this.current.next);
        this.current = newSymbol;
    }

    moveR() {
        if (this.size !== 0 && this.current.getNext() !== null) {
            // Check if the next value is not the tail
            if (this.current.getNext().getValue() !== null) {
                this.current = this.current.getNext();
                console.log("Moved Right!")
            }
        }
    }

    moveL() {
        if (this.size !== 0 && this.current.getPrevious() !== null) {
            // Check if the previous value is not the head
            if (this.current.getPrevious().getValue() !== null) {
                this.current = this.current.getPrevious();
                console.log("Moved Left!");
            }
        }
    }
}