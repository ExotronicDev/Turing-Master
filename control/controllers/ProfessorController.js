const Professor = require("../../model/professor");
const Course = require("../../model/course");
const Solution = require("../../model/solution");

const ProfessorDao = require("../daos/ProfessorDao");
const CourseDao = require("../daos/CourseDao");
const StudentDao = require("../daos/StudentDao");
const SolutionDao = require("../daos/SolutionDao");
const TMachineDao = require("../daos/TMachineDao")

const TMachineController = require("./TMachineController");

module.exports = class ProfessorController {
	constructor() {
		this.daoProfessor = new ProfessorDao();
		this.daoCourse = new CourseDao();
		this.daoStudent = new StudentDao();
		this.daoSolution = new SolutionDao();
		this.daoTMachine = new TMachineDao();
	}

	//Autenticación de profesores.
	async register(professor) {
		const newProfessor = new Professor({
			id: professor.id,
			firstName: professor.firstName,
			lastName: professor.lastName,
			email: professor.email,
			password: professor.password,
		});

		return await this.daoProfessor.save(newProfessor);
	}

	async verify(email) {
		return await this.daoProfessor.findWithPassword({ email });
	}

	async login(email, password) {
		const professor = await this.daoProfessor.findWithPassword({ email });
		if (!professor) return false;

		const isMatch = await professor.matchPassword(password);
		if (!isMatch) return false;

		return professor;
	}

	// Funcionalidades propias de profesor.
	async updateProfessor(idProfessor, professorChanges) {
		//password, newPassword
		if (
			professorChanges.password == undefined &&
			professorChanges.newPassword == undefined
		) {
			// Regular change without password changes
			return await this.daoProfessor.update(
				{ id: idProfessor },
				professorChanges
			);
		} else if (
			professorChanges.password == undefined ||
			professorChanges.newPassword == undefined
		) {
			// Needs both original and new password, but one is not given
			return -1;
		} else {
			// Both original and new passwords are given
			const professor = await this.daoProfessor.findWithPassword({
				id: idProfessor,
			});
			const isMatch = await professor.matchPassword(
				professorChanges.password
			);
			if (isMatch) {
				// Change password
				professor.password = professorChanges.newPassword;
				await this.daoProfessor.save(professor);

				// Update the rest
				delete professorChanges.password;
				delete professorChanges.newPassword;
				const updateResponse = await this.daoProfessor.update(
					{ id: idProfessor },
					professorChanges
				);
				updateResponse.passwordChanged = true;
				return updateResponse;
			} else {
				// Original password given does not match with the stored password
				return -2;
			}
		}
	}

	async getProfessor(filter) {
		return await this.daoProfessor.find(filter);
	}

	async getProfessors() {
		return await this.daoProfessor.getAll();
	}

	async getCourses(idProfessor) {
		let foundProfessor = await this.daoProfessor.find({ id: idProfessor });

		if (foundProfessor.length == 0) {
			return -1;
		}

		return foundProfessor[0].courses;
	}

	async createCourse(course, idProfessor) {
		course.professor = {
			id: idProfessor,
		};

		const newCourse = new Course(course);

		let saveResponse = await this.daoCourse.save(newCourse);
		const professorQuery = await this.daoProfessor.find({
			id: idProfessor,
		});
		let foundProfessor = professorQuery[0];

		foundProfessor.courses.push({ code: course.code, name: course.name });
		await this.daoProfessor.update({ id: idProfessor }, foundProfessor);

		return saveResponse;
	}

	async updateCourse(courseCode, courseChanges) {
		let queryCourse = await this.daoCourse.find({ code: courseCode });

		if (queryCourse.length == 0) {
			return -1;
		}

		let foundCourse = queryCourse[0];
		foundCourse.name = courseChanges.name;

		return await this.daoCourse.update({ code: courseCode }, foundCourse);
	}

	async getCourse(courseCode) {
		let foundCourse = await this.daoCourse.find({ code: courseCode });

		if (foundCourse.length == 0) {
			return -1;
		}

		return foundCourse[0];
	}

	// Retorna los estudiantes de un curso.
	async getStudents(courseCode) {
		const foundCourse = await this.daoCourse.find({ code: courseCode });

		if (foundCourse.length == 0) {
			return -1;
		}

		return foundCourse[0].students;
	}

	async enrollStudent(studentIdArray, courseCode) {
		if (studentIdArray.length == 0) {
			return;
		}

		const queryCourse = await this.daoCourse.find({ code: courseCode });
		if (queryCourse.length == 0) {
			return -2;
		}
		let foundCourse = queryCourse[0];
		let newStudentArray = [];

		for (let i = 0; i < studentIdArray.length; i++) {
			const queryStudent = await this.daoStudent.find({ id: studentIdArray[i] });
			if (queryStudent.length == 0) {
				return -1;
			}
			let foundStudent = queryStudent[0];

			newStudentArray.push({
				id: foundStudent.id,
				firstName: foundStudent.firstName,
				lastName: foundStudent.lastName,
				email: foundStudent.email
			});

			foundStudent.courses.push({
				code: foundCourse.code,
				name: foundCourse.name
			});

			await this.daoStudent.update({ id: foundStudent.id }, foundStudent);
		}

		foundCourse.students = newStudentArray;

		return await this.daoCourse.update({ code: courseCode }, foundCourse);
	}

	// Clonar un curso.
	async cloneCourse(courseCode, newCourseCode) {
		const query = await this.daoCourse.find({ code: courseCode });
		const query2 = await this.daoCourse.find({ code: newCourseCode });

		if (query.length == 0) {
			return -1;
		} else if (query2.length > 0) {
			return -2;
		}
		const foundCourse = query[0];

		const clonedCourse = new Course({
			code: newCourseCode,
			name: foundCourse.name,
			professor: {
				id: foundCourse.professor.id,
			},
			students: [],
			exercises: foundCourse.exercises,
		});

		const query3 = await this.daoProfessor.find({ id: foundCourse.professor.id });
		const foundProfessor = query3[0];

		foundProfessor.courses.push({
			code: newCourseCode,
			name: foundCourse.name
		});

		await this.daoProfessor.update({ id: foundCourse.professor.id }, foundProfessor);

		return await this.daoCourse.save(clonedCourse);
	}

	async createExercise(courseCode, exercise) {
		const newExercise = exercise;

		const query = await this.daoCourse.find({ code: courseCode });
		let foundCourse = query[0];
		foundCourse.exercises.push(newExercise);

		return await this.daoCourse.save(foundCourse);
	}

	//Esto solo cambia las cosas que no son arrays.
	async updateExercise(slugExercise, courseCode, exerciseChanges) {
		let queryCourse = await this.daoCourse.find({ code: courseCode });

		if (queryCourse == 0) {
			return -1;
		}

		let foundCourse = queryCourse[0];
		let foundExercise = -1;
		let foundExerciseIndex = -1;
		for (let i = 0; i < foundCourse.exercises.length; i++) {
			if (foundCourse.exercises[i].slugName === slugExercise) {
				foundExercise = foundCourse.exercises[i];
				foundExerciseIndex = i;
			}
		}

		if (foundExercise == -1) {
			return -2;
		}
		
		if (exerciseChanges.description !== undefined) {
			foundExercise.description = exerciseChanges.description;
		}
		if (exerciseChanges.inputDescription !== undefined) {
			foundExercise.inputDescription = exerciseChanges.inputDescription;
		}
		if (exerciseChanges.outputDescription !== undefined) {
			foundExercise.outputDescription = exerciseChanges.outputDescription;
		}

		//Esto es para modificar los arrays? 
		foundExercise.exampleCases = exerciseChanges.exampleCases;
		foundExercise.testCases = exerciseChanges.testCases;
		
		foundCourse.exercises[foundExerciseIndex] = foundExercise;

		console.log(foundExercise);
		return await this.daoCourse.update({ code: courseCode }, foundCourse);
	}

	//Esto cambia solamente los arrays.
	//Deprecated. DO NOT USE
	async saveArrayChanges(slugExercise, courseCode, exerciseChanges) {
		let queryCourse = await this.daoCourse.find({ code: courseCode });

		if (queryCourse == 0) {
			return -1;
		}

		let foundCourse = queryCourse[0];
		let foundExercise = -1;
		let foundExerciseIndex = -1;
		for (let i = 0; i < foundCourse.exercises.length; i++) {
			if (foundCourse.exercises[i].slugName === slugExercise) {
				foundExercise = foundCourse.exercises[i];
				foundExerciseIndex = i;
			}
		}

		if (foundExercise == -1) {
			return -2;
		}

		foundExercise.exampleCases = exerciseChanges.exampleCases;
		foundExercise.testCases = exerciseChanges.testCases;

		foundCourse.exercises[foundExerciseIndex] = foundExercise;

		return await this.daoCourse.update({ code: courseCode }, foundCourse);
	}

	async getExercise(courseCode, slugExercise) {
		let queryCourse = await this.daoCourse.find({ code: courseCode });

		if (queryCourse.length == 0) {
			return -1;
		}

		let foundCourse = queryCourse[0];
		let foundExercise = -1;
		for (let i = 0; i < foundCourse.exercises.length; i++) {
			if (foundCourse.exercises[i].slugName === slugExercise) {
				foundExercise = foundCourse.exercises[i];
			}
		}

		if (foundExercise == -1) {
			return -2;
		}

		return foundExercise;
	}


	async getExercises(courseCode) {
		let queryCourse = await this.daoCourse.find({ code: courseCode });

		if (queryCourse.length == 0) {
			return -1;
		}

		let foundCourse = queryCourse[0];

		return foundCourse.exercises;
	}

	async deleteExercise(courseCode, slugExercise) {
		let queryCourse = await this.daoCourse.find({ code: courseCode });

		if (queryCourse.length == 0) {
			return -1;
		}

		let foundCourse = queryCourse[0];
		let foundExerciseIndex = -1;
		for (let i = 0; i < foundCourse.exercises.length; i++) {
			if (foundCourse.exercises[i].slugName === slugExercise) {
				foundExerciseIndex = i;
			}
		}

		if (foundExerciseIndex == -1) {
			return -2;
		}

		foundCourse.exercises.splice(foundExerciseIndex, 1);
		return await this.daoCourse.update({ code: courseCode }, foundCourse);
	}

	createTestCase(testCaseArray, testCase) {
		const textCaseArrayLength = testCaseArray.length;

		if (textCaseArrayLength > 0) {
			for (let i = 0; i < textCaseArrayLength; i++) {
				if (testCaseArray[i].number == testCase.number) {
					return -1;
				}
			}
		}

		const newTextCase = testCase;

		testCaseArray.push(newTextCase);
		return testCaseArray;
	}

	updateTestCase(testCaseArray, testCase) {
		const testCaseArrayLength = testCaseArray.length;
		var index = -1;
		if (testCaseArrayLength > 0) {
			for (let i = 0; i < testCaseArrayLength; i++) {
				if (testCaseArray[i].number == testCase.number) {
					index = i;
				}
			}
		}

		if (index < 0) {
			return -1;
		}

		testCaseArray[index].number = newNumber;
		return testCaseArray;
	}

	deleteTestCase(testCaseArray, testCase) {
		const testCaseArrayLength = testCaseArray.length;
		var index = -1;

		if (testCaseArrayLength > 0) {
			for (let i = 0; i < testCaseArrayLength; i++) {
				if (testCaseArray[i].number == testCase.number) {
					index = i;
				}
			}
		}

		if (index < 0) {
			return -1;
		}

		testCaseArray.splice(index, 1);
		return testCaseArray;
	}

	async getTestCases(courseCode, exerciseSlug) {
		const queryCourse = await this.daoCourse.find({ code: courseCode });

		if (queryCourse.length == 0) {
			return -1;
		}

		const foundCourse = queryCourse[0];
		let foundExercise = -1;
		for (let i = 0; i < foundCourse.exercises.length; i++) {
			if (foundCourse.exercises[i].slugName === exerciseSlug) {
				foundExercise = foundCourse.exercises[i];
			}
		}

		if (foundExercise == -1) {
			return -2;
		}

		return foundExercise.testCases;
	}

	/* -------------------------------------------------------------- */

	createExampleCase(exampleArray, exampleCase) {
		const exampleArrayLength = exampleArray.length;

		if (exampleArrayLength > 0) {
			for (let i = 0; i < exampleArrayLength; i++) {
				if (exampleArray[i].number == exampleCase.number) {
					return false;
				}
			}
		}

		const newExample = exampleCase.number;

		exampleArray.push(newExample);
		return exampleArray;
	}

	updateExampleCase(exampleArray, example) {
		const exampleArrayLength = exampleArray.length;
		var index = -1;
		if (exampleArrayLength > 0) {
			for (let i = 0; i < exampleArrayLength; i++) {
				if (exampleArray[i].number == example.number) {
					index = i;
				}
			}
		}

		if (index < 0) {
			return false;
		}

		exampleArray[index].number = newNumber;
		return exampleArray;
	}

	deleteExampleCase(exampleArray, example) {
		const exampleArrayLength = exampleArray.length;
		var index = -1;

		if (exampleArrayLength > 0) {
			for (let i = 0; i < exampleArrayLength; i++) {
				if (exampleArray[i].number == example.number) {
					index = i;
				}
			}
		}

		if (index < 0) {
			return false;
		}

		exampleArray.splice(index, 1);
		return exampleArray;
	}

	async getExampleCases(courseCode, exerciseSlug) {
		const queryCourse = await this.daoCourse.find({ code: courseCode });

		if (queryCourse.length == 0) {
			return -1;
		}

		const foundCourse = queryCourse[0];
		let foundExercise = -1;
		for (let i = 0; i < foundCourse.exercises.length; i++) {
			if (foundCourse.exercises[i].slugName === exerciseSlug) {
				foundExercise = foundCourse.exercises[i];
			}
		}

		if (foundExercise == -1) {
			return -2;
		}

		return foundExercise.exampleCases;
	}

	async createSolution(courseCode, slugExercise, solution) {
		let queryCourse = await this.daoCourse.find({ code: courseCode });
		if (queryCourse.length == 0) {
			return -1;
		}
		let foundCourse = queryCourse[0];
		let foundExercise = -1;
		let foundExerciseIndex = -1;

		for (let i = 0; i < foundCourse.exercises.length; i++) {
			if (foundCourse.exercises[i].slugName === slugExercise) {
				foundExercise = foundCourse.exercises[i];
				foundExerciseIndex = i;
			}
		}

		if (foundExercise == -1) {
			return -2;
		}

		let submittedSolution = new Solution(solution);
		await this.daoSolution.save(submittedSolution);

		let queryTM = await this.daoTMachine.find({ id: submittedSolution.tMachine.id });
		let foundTM = queryTM[0];
		foundTM.solution.id = submittedSolution._id;
		await this.daoTMachine.update({ id: submittedSolution.tMachine.id }, foundTM);

		let queryStudent = await this.daoStudent.find({ id: submittedSolution.student.id });
		let foundStudent = queryStudent[0];
		foundStudent.solutions.push({ id: submittedSolution._id });
		await this.daoStudent.update({ id: submittedSolution.student.id }, foundStudent);

		foundCourse.exercises[foundExerciseIndex].solutions.push({ id: submittedSolution._id });
		await this.daoCourse.update({ code: courseCode }, foundCourse);

		const exerciseTestCases = foundExercise.testCases;

		return await this.evaluateSolution(exerciseTestCases, submittedSolution, foundTM);
	}

	async evaluateSolution(testCases, solution, tMachine) {
		//testCases es un array con objetos del siguiente formato:
		//number, input, output, isState		
		
		//Preparo el controlador para el simulador
		const TMController = new TMachineController();

		//Constante para saber cuantos ejercicios hay.
		const totalTests = testCases.length;
		//Variable para saber cuantos ejercicios logró resolver.
		let testSuccesses = 0;

		for (let i = 0; i < totalTests; i++) {
			const input = testCases[i].input;
			const expectedOutput = testCases[i].output;
			const checkState = testCases[i].isState;

			let simulationResult = await TMController.simulate(tMachine, input);

			// Casos fallidos.
			if (simulationResult == -1 || simulationResult == -2) {
				//No hay nada que simular.
				continue;
			} else if (simulationResult.status === "failed" || simulationResult.status === "timeout") {
				//Simulation con error de lógica o timeout.
				continue;
			}

			//Hay que revisar el estado en lugar de la cinta.
			if (checkState) {
				const sequenceLength = simulationResult.simulationSequence.length;
				const lastState = simulationResult.simulationSequence[sequenceLength - 1];

				//Comparo el nombre de los estados en minusculas para evitar ser tan picky.
				if (expectedOutput.toLowerCase() === lastState.state.toLowerCase()) {
					testSuccesses++;
				}
			} else {
				//Aquí se revisa el output de la cinta
				const simulatedOutput = simulationResult.output;
				if (expectedOutput === simulatedOutput) {
					testSuccesses++;
				}
			}
		}

		const solutionScore = (testSuccesses / totalTests) * 100;
		solution.grade = solutionScore;
		
		return await this.daoSolution.update({ _id: solution._id }, solution);
	}

	async getSolution(courseCode, slugExercise, idSolution) {
		let queryCourse = await this.daoCourse.find({ code: courseCode });

		if (queryCourse.length == 0) {
			return -1;
		}

		let foundCourse = queryCourse[0];
		let foundExercise = -1;
		for (let i = 0; i < foundCourse.exercises.length; i++) {
			if (foundCourse.exercises[i].slugName === slugExercise) {
				foundExercise = foundCourse.exercises[i];
			}
		}

		if (foundExercise == -1) {
			return -2;
		}

		//Retornar solution con la Turing Machine.
		const solutionQuery = await this.daoSolution.find({ _id: idSolution });
		let storedSolution = solutionQuery[0];

		const TMQuery = await this.daoTMachine.find({ id: storedSolution.tMachine.id });
		let storedTM = TMQuery[0];

		const detailedSolution = {
			solutionId: storedSolution._id,
			grade: storedSolution.grade,
			student: {
				id: storedSolution.student.id,
				firstName: storedSolution.student.firstName,
				lastName: storedSolution.student.lastName
			},
			exercise: {
				name: foundExercise.name
			},
			tMachine: storedTM
		};
		return detailedSolution;
	}

	async getStudentSolutions(courseCode, slugExercise) {
		let queryCourse = await this.daoCourse.find({ code: courseCode });

		if (queryCourse.length == 0) {
			return -1;
		}

		let foundCourse = queryCourse[0];
		let foundExercise = -1;
		for (let i = 0; i < foundCourse.exercises.length; i++) {
			if (foundCourse.exercises[i].slugName === slugExercise) {
				foundExercise = foundCourse.exercises[i];
			}
		}

		if (foundExercise == -1) {
			return -2;
		}

		//Falta ordenar cosas.
		const foundSolutions = await this.daoSolution.getAll();
		return this.prettifyQuery(foundSolutions, foundCourse);
	}

	prettifyQuery(queryArray, course) {
		if (course.students.length == 0) {
			return -3;
		}

		let prettifiedQuery = [];
		const studentAmount = course.students.length;
		for (let i = 0; i < studentAmount; i++) {
			prettifiedQuery.push({
				id: course.students[i].id,
				firstName: course.students[i].firstName,
				lastName: course.students[i].lastName,
				solutions: []
			});
		}

		//Esto hace un sort por (firstName + lastName). Don't fucking ask.
		prettifiedQuery.sort( (name1, name2) => ((name1.firstName + name1.lastName) > (name2.firstName + name2.lastName)) ? 1 : 
		(((name2.firstName + name2.lastName) > (name1.firstName + name1.lastName)) ? -1 : 0));

		//Ahora a meter las soluciones de cada estudiante.
		for (let i = 0; i < queryArray.length; i++) {
			let currentSolution = queryArray[i];
			for (let j = 0; j < prettifiedQuery.length; j++) {
				if (currentSolution.student.id == prettifiedQuery[j].id) {
					prettifiedQuery[j].solutions.push({
						grade: currentSolution.grade,
						tMachine: currentSolution.tMachine
					});
					break;
				}
			}
		}

		//Y ahora hay que ordenar las soluciones por la nota.
		for (let i = 0; i < prettifiedQuery.length; i++) {
			prettifiedQuery[i].solutions.sort( (solution1, solution2) => (solution1.grade > solution2.grade) ? -1 : 
			((solution2.grade > solution1.grade) ? 1 : 0) );
		}

		return prettifiedQuery;
	}
};



