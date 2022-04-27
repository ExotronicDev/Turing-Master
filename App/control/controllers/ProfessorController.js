const Professor = require("../../model/professor");
const Course = require("../../model/course");

const ProfessorDao = require("../daos/ProfessorDao");
const CourseDao = require("../daos/CourseDao");

module.exports = class ProfessorController {
    constructor() {
        this.daoProfessor = new ProfessorDao();
        this.daoCourse = new CourseDao();
    }

    //Autenticación de profesores.
    async register(professor) {
        const newProfessor = new Professor({
            id: professor.id,
            firstName: professor.firstName,
            lastName: professor.lastName,
            email: professor.email,
            password: professor.password
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
            return await this.daoProfessor.update({ id: idProfessor }, professorChanges);
        } else if (
            professorChanges.password == undefined ||
            professorChanges.newPassword == undefined
        ) {
            // Needs both original and new password, but one is not given
            return -1;
        } else {
            // Both original and new passwords are given
            const professor = await this.daoProfessor.findWithPassword({ id: idProfessor });
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

    async createCourse(course) {
        const newCourse = new Course({
            code: course.code,
            name: course.name,
            professor: {
                id: course.professor.id
            },
            students: [],
            exercises: []
        });

        let foundProfessor = await this.daoProfessor.find({ id: course.professor.id })[0];

        foundProfessor.courses.push({ code: course.code,name: course.name });
        await this.daoProfessor.update({ id: course.professor.id }, foundProfessor);

        return await this.daoCourse.save(newCourse);
    }

    async createExercise(courseCode, exercise) {
        const newExercise = {
            name: exercise.name,
            description: exercise.description,
            inputDescription: exercise.inputDescription,
            outputDescription: exercise.outputDescription,
            exampleCases: [],
            testCases: []
        };

        let foundCourse = await this.daoCourse.find({ code: courseCode })[0];
        foundCourse.exercises.push(newExercise);

        return await this.daoCourse.update({ code: courseCode }, foundCourse);
    }

    // Retorna los estudiantes de un curso.
    async getStudents(courseCode) {
        const foundCourse = await this.daoCourse.find({ code: courseCode });

        if (foundCourse.length == 0) {
            return -1;
        }

        return foundCourse[0].students;
    }
    
    // PRELIMINAR
    // TODO: FIX THIS SHIT TO ACCOUNT FOR OTHER DATA LINKED TO IT.
    // Nota:    Borrar un profesor implica borrar los cursos del profesor.
    //          Borrar un curso implica actualizar el array de cursos de los estudiantes.
    //          Esto es super heavy en consultas tho.
    // However, se debería borrar un profesor en primer lugar?
    async deleteProfessor(idProfessor) {
        return await this.daoProfessor.delete({ id: idProfessor });
    }
    
}