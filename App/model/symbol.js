module.exports = class Symbol {
    constructor(value = null) {
        this.value = value;
        this.previous = null;
        this.next = null;
    }

    setValue(value) {
        this.value = value;
    }

    setNext(next) {
        this.next = next;
    }

    setPrevious(previous) {
        this.previous = previous;
    }

    getValue() {
        return this.value;
    }

    getNext() {
        return this.next;
    }

    getPrevious() {
        return this.previous;
    }
}