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

	// Funcionalidades de autenticación
	async register(student) {
		const newStudent = new Student({
			id: student.id,
			firstName: student.firstName,
			lastName: student.lastName,
			email: student.email,
			password: student.password,
		});

		return await this.dao.save(newStudent);
	}

	async verify(email) {
		return await this.dao.findWithPassword({ email });
	}

	async login(email, password) {
		const student = await this.dao.findWithPassword({ email });
		if (!student) return false;

		const isMatch = await student.matchPassword(password);
		if (!isMatch) return false;

		return student;
	}

	// Funcionalidades propias de estudiante
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

		var storedStudent = await this.dao.find({ id: idStudent });
		var studentTMachines = storedStudent[0].tMachines;

		//Parece que el forEach de los arrays no soporta async. Hora de usar magia negra de JS.
		const arrayLength = studentTMachines.length;
		for (let i = 0; i < arrayLength; i++) {
			var tm = studentTMachines[i];
			await daoTMachine.delete({ id: tm.id });
			//Espero que esto sirva fuck.
		}

		return await this.dao.delete({ id: idStudent });
	}

	//
	// Requiere cambio
	//
	// Funcionalidades de Turing Machines
	async createTMachine(student, description) {
		const daoTMachine = new TMachineDao();

		const counter = await this.tMachineCounter.find({
			name: "tmachine",
		});
		const countObj = counter[0];
		let nextId = countObj.count;

		const tMachine = new TMachine({ id: nextId, description: description });
		tMachine.owner.id = student.id;

		student.tMachines.push({
			id: tMachine.id,
			description: tMachine.description,
		});

		await this.dao.update({ id: student.id }, student);

		nextId++;
		countObj.count = nextId;
		await this.tMachineCounter.update({ name: "tmachine" }, countObj);

		return await daoTMachine.save(tMachine);
	}

	async deleteTMachine(student, idTMachine) {
		let index = -1;
		var tMachines = student.tMachines;

		for (let i = 0; i < tMachines.length; i++) {
			let tmId = tMachines[i].id;
			if (tmId == idTMachine) {
				index = i;
			}
		}

		if (index > -1) {
			tMachines.splice(index, 1);
		}

		student.tMachines = tMachines;

		return await this.dao.update({ id: student.id }, student);
	}

	async getTMachines(student) {
		const daoTMachine = new TMachineDao();

		return await daoTMachine.find({ owner: { id: student.id } });
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
};
