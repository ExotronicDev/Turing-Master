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
            professor: {id: course.professor.id}
        });

        let foundProfessor = await this.daoProfessor.find({id: course.professor.id})[0];
        foundProfessor.courses.push({code: course.code,name: course.name});
        await this.daoProfessor.update({id: course.professor.id},foundProfessor);
        return await this.daoCourse.save(newCourse);
    }
		
    async getStudent(filter) {
        return await this.daoStudent.find(filter);
    }

    async getStudents() {
        return await this.daoStudent.getAll();
    }
    
    // PRELIMINAR
    // TODO: FIX THIS SHIT TO ACCOUNT FOR OTHER DATA LINKED TO IT.
    async deleteProfessor(idProfessor) {
        return await this.daoProfessor.delete({ id: idProfessor });
    }

}

