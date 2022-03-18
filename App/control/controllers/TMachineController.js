const TMachineDao = require("../daos/TMachineDao");

module.exports = class TMachineController {
    constructor() {
        this.dao = new TMachineDao();
    }

    // Operaciones CRUD

    async find(filter) {
        return await this.dao.find(filter);
    }

    async save(object) {
        return await this.dao.save(object);
    }

    async modify(filter, object) {
        return await this.dao.modify(filter, object);
    }

    async delete(filter) {
        return await this.dao.delete(filter);
    }

    async getAll() {
        return await this.dao.getAll();
    }

    // Funcionalidades propias

    async createTMachine(student, description) {
        const daoTMachine = new TMachineDao();

        const tMachine = new TMachine({ description: description });
        tMachine.owner.id = student.id;

        student.tMachines.push({
            id: tMachine.id,
            description: tMachine.description
        });

        await this.dao.modify({ id: student.id }, student);
        return await daoTMachine.save(tMachine);
    }
}