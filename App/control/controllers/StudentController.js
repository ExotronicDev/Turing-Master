const asyncHandler = require("../../middleware/async");
const TMachine = require("../../model/tmachine");
const Student = require("../../model/student");

const StudentDao = require("../daos/StudentDao");
const TMachineDao = require("../daos/TMachineDao");
const CounterDao = require("../daos/CounterDao");

module.exports = class StudentController {
    constructor() {
        this.dao = new StudentDao();
        this.tMachineCounter = new CounterDao();
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
    async register(student) {
        const newStudent = new Student({
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            password: student.password
        });

        return await this.dao.save(newStudent);
    }
    
    // Funcionalidades de Máquinas
    async createTMachine(student, description) {
        const daoTMachine = new TMachineDao();

        const counter = this.tMachineCounter.find({ name: "tmachine" });
        const nextId = counter.count;
        
        const tMachine = new TMachine({ id: nextId, description: description });
        tMachine.owner.id = student.id;

        student.tMachines.push({
            id: tMachine.id,
            description: tMachine.description
        });

        await this.dao.update({ id: student.id }, student);

        nextId++;
        counter.count = nextId;
        await this.tMachineCounter.update({ name: "tmachine" }, counter);

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

    async getTMachine(student) {
        const daoTMachine = new TMachineDao();

        return await daoTMachine.find({ id: student.id });
    }

    async getTMachines(student) {
        const daoTMachine = new TMachineDao();

        return await daoTMachine.find({ id: student.id });
    }

    //Funcionalidades de Estudiantes

    async updateStudent(student) {
        var storedStudent = this.dao.find({ id: student.id });

        //Parece innecesario hacer esto, pero eh, quiero estar seguro. -Edu
        storedStudent.firstName = student.firstName;
        storedStudent.lastName = student.lastName;
        storedStudent.email = student.email;
        storedStudent.password = student.password;
        storedStudent.tMachines = student.tMachines;

        return await this.dao.update({ id: student.id }, storedStudent);
    }

    async getStudent(filter) {
        return await this.dao.find(filter);
    }

    async getStudents() {
        return await this.dao.getAll();
    }

    //This one is sketchy, lmao
    async deleteStudent(idStudent) {
        //Primero, hay que borrar las TMachines de dicho estudiante.
        //Primero y medio, borrar el estudiante de las TMachines que tengan a ese como colaborador. //TODO
        //Segundo, borrar el estudiante.
        const daoTMachine = new TMachineDao();

        var storedStudent = this.dao.find({ id: idStudent });
        var studentTMachines = storedStudent.tMachines;

        //Parece que el forEach de los arrays no soporta async. Hora de usar magia negra de JS.
        const arrayLength = studentTMachines.length;
        for (let i = 0; i < arrayLength; i++) {
            var tm = studentTMachines[i];
            await daoTMachine.delete({ id: tm.id });
            //Espero que esto sirva fuck.
        }

        return await this.dao.delete({ id: idStudent });
    }

    //Ese student es completamente innecesario lmao. -Edu
    async addCollaborator(student, idCollaborator, idTMachine) {
        const daoTMachine = new TMachineDao();

        var storedTM = daoTMachine.find({ id: idTMachine });

        var collabArray = storedTM.collaborators;
        collabArray.push({ id: idCollaborator });
        storedTM.collaborators = collabArray;

        return await daoTMachine.update({ id: storedTM.id }, storedTM);
    }
}