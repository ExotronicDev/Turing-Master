const TMachine = require("../../model/tmachine");

const StudentDao = require("../daos/StudentDao");
const TMachineDao = require("../daos/TMachineDao");

module.exports = class StudentController {
    constructor() {
        this.dao = new StudentDao();
    }

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

    // Funcionalidades propias

    async createTMachine(student, description) {
        const daoTMachine = new TMachineDao();

        const tMachine = new TMachine({ description: description });
        tMachine.owner.id = student.id;

        student.tMachines.push({
            id: tMachine.id,
            description: tMachine.description
        });

        await this.dao.update({ id: student.id }, student);
        return await daoTMachine.save(tMachine);
    }

    async deleteTMachine(student, idTMachine) {
        let index = -1;

        for (var i = 0; i < student.tMachines.length; i++) {
            if (student.tMachines[i].id === idTMachine) {
                index = i;
            }
        }

        if (index > -1) {
            student.tMachines.splice(index, 1); 
        }
        return await this.dao.update({ id: student.id }, student);
    }

    //Hola
}