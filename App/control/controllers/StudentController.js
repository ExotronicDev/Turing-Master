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
	async updateStudent(idStudent, studentChanges) {
		//password, newPassword
		if (
			studentChanges.password == undefined &&
			studentChanges.newPassword == undefined
		) {
			// Regular change without password changes
			return await this.dao.update({ id: idStudent }, studentChanges);
		} else if (
			studentChanges.password == undefined ||
			studentChanges.newPassword == undefined
		) {
			// Needs both original and new password, but one is not given
			return -1;
		} else {
			// Both original and new passwords are given
			const student = await this.dao.findWithPassword({ id: idStudent });
			const isMatch = await student.matchPassword(
				studentChanges.password
			);
			if (isMatch) {
				// Change password
				student.password = studentChanges.newPassword;
				await this.dao.save(student);

				// Update the rest
				delete studentChanges.password;
				delete studentChanges.newPassword;
				const updateResponse = await this.dao.update(
					{ id: idStudent },
					studentChanges
				);
				updateResponse.passwordChanged = true;
				return updateResponse;
			} else {
				// Original password given does not match with the stored password
				return -2;
			}
		}
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
		tMachine.initialState = null;

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

		if (tMachines.length > 0) {
			for (let i = 0; i < tMachines.length; i++) {
				let tmId = tMachines[i].id;
				if (tmId == idTMachine) {
					index = i;
				}
			}
		}

		if (index > -1) {
			tMachines.splice(index, 1);
		}

		student.tMachines = tMachines;

		return await this.dao.update({ id: student.id }, student);
	}

	async updateTMachine(student, tMachine) {
		var tMachines = student.tMachines;

		if (tMachines.length > 0) {
			for (let i = 0; i < tMachines.length; i++) {
				if (tMachines[i].id == tMachine.id) {
					tMachines[i].description = tMachine.description;
				}
			}
		}

		student.tMachines = tMachines;
		return await this.dao.update({ id: student.id }, student);
	}

	async getTMachines(student) {
		const daoTMachine = new TMachineDao();

		return await daoTMachine.find({ owner: { id: student.id } });
	}
};
