module.exports = class Symbol {
    constructor(value = null) {
        this.value = value;
        this.previous = null;
        this.next = null;
    }

    setValue(value) {
        this.value = value;
    }

    setPrevious(prev) {
        this.previous = prev;
    }

    setNext(next) {
        this.next = next;
    }

    getValue() {
        return this.value;
    }

    getPrevious() {
        return this.previous;
    }

    getNext() {
        return this.next;
    }
}