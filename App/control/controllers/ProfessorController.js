const Professor = require("../../model/professor");
const Course = require("../../model/course");

const ProfessorDao = require("../daos/ProfessorDao");
const CourseDao = require("../daos/CourseDao");
const StudentDao = require("../daos/StudentDao");

module.exports = class ProfessorController {
	constructor() {
		this.daoProfessor = new ProfessorDao();
		this.daoCourse = new CourseDao();
		this.daoStudent = new StudentDao();
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
		const newCourse = new Course({
			code: course.code,
			name: course.name,
			professor: {
				id: idProfessor,
			},
			students: [],
			exercises: [],
		});

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

	async enrollStudent(idStudent, courseCode) {
		const queryStudent = await this.daoStudent.find({ id: idStudent });
		const queryCourse = await this.daoCourse.find({ code: courseCode });

		if (queryStudent.length == 0) {
			return -1;
		} else if (queryCourse.length == 0) {
			return -2;
		}

		let foundStudent = queryStudent[0];
		let foundCourse = queryCourse[0];

		foundCourse.students.push({
			id: foundStudent.id,
			firstName: foundStudent.firstName,
			lastName: foundStudent.lastName,
			email: foundStudent.email,
		});

		foundStudent.courses.push({
			code: foundCourse.code,
			name: foundCourse.name,
		});

		await this.daoStudent.update({ id: idStudent }, foundStudent);
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

		return await this.daoCourse.save(clonedCourse);
	}

	async createExercise(courseCode, exercise) {
		const newExercise = {
			name: exercise.name,
			description: exercise.description,
			inputDescription: exercise.inputDescription,
			outputDescription: exercise.outputDescription,
			exampleCases: [],
			testCases: [],
		};

		let foundCourse = await this.daoCourse.find({ code: courseCode })[0];
		foundCourse.exercises.push(newExercise);

		return await this.daoCourse.update({ code: courseCode }, foundCourse);
	}

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

		foundExercise.description = exerciseChanges.description;
		foundExercise.inputDescription = exerciseChanges.inputDescription;
		foundExercise.outputDescription = exerciseChanges.outputDescription;
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

	//Falta:
	//  addTestCase
	//  updateTestCase
	//  deleteTestCase
	//  addExampleCase
	//  updateExampleCase
	//  deleteExampleCase
	//  Estos no tienen que hacer consultas a la base de datos.
};
