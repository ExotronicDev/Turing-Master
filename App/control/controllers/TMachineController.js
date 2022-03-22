const StudentDao = require("../daos/StudentDao");
const TMachineDao = require("../daos/TMachineDao");

module.exports = class TMachineController {
    constructor() {
        this.dao = new TMachineDao();
    }

    /*
    // Operaciones CRUD

    async find(filter) {
        return await this.dao.find(filter);
    }

    async save(object) {
        return await this.dao.save(object);
    }

    async update(filter, object) {
        return await this.dao.update(filter, object);
    }

    async delete(filter) {
        return await this.dao.delete(filter);
    }

    async getAll() {
        return await this.dao.getAll();
    }
    */

    // Funcionalidades propias

    //Create TMachine esta implementado en StudentController
    //Delete TMachine esta implementado en StudentController

    async updateTMachine(tMachine) {
        //Esto no actualiza los arrays porque eso se hace en otro lado.
        const storedTM = this.dao.find({ id: tMachine.id });
        storedTM.description = tMachine.description;
        storedTM.initialState = tMachine.initialState;

        return await this.dao.update({ id: storedTM.id }, storedTM);
    }

    async getTMachines() {
        return await this.dao.getAll();
    }

    async getTMachine(idTMachine) {
        return await this.dao.find({ id: idTMachine });
    }

    //Funcionalidades de estados

    async createState(tMachine, stateName) {

    }
}