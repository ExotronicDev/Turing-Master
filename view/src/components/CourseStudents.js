import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";
import roleChecker from "./Routes/roleChecker";

class CourseStudents extends Component {
    state = {
        students: [],
        studentsCourse: [],
        loggedId: ""
    }

    componentDidMount = () => {
        this.setLoggedId();
        this.getStudents();
    }

    setLoggedId() {
		const id = roleChecker.getLoggedId();
		this.setState({
			loggedId: id,
		});
		if (this.state.loggedId === undefined) {
			swal.fire({
				title: "Oops !",
				text: "User does not have access to this page. Please login to access.",
				icon: "error",
				background: "black",
				color: "white",
			}).then(() => {
				window.location = "/login";
			});
		}
	}

    getStudents = () => {
        axios({
            url: "/api/students",
            method: "GET"
        })
        .then((res) => {
            this.setState({
                students: res.data.data
            })
        })
    }

    change = (student, index) => {
        console.log(document.getElementById(index))

        if (document.getElementById(index).checked) {
			this.state.studentsCourse.push(student)

		}

        if (!document.getElementById(index).checked) {
            this.state.studentsCourse.filter((thisStudent, index, object) => {
                if (thisStudent.id === student.id) {
                    object.splice(index, 1);
                }
            });
            console.log(this.state.studentsCourse)
		    }

    }

    displayStudents = (students) => {
        return students.map((student, index) => (
            <div class="form-group row align-items-center justify-content-center">
                <div class="col-3 align-items-right justify-content-right">
                    <label aria-current="true" >
                        
                        {student.id} - {student.firstName} {student.lastName}
                        
                    </label>
                </div>

                <div class="col-1" id="edit">
                    <label for="check1">Add</label>
                </div>
                <div class="col-1" id="check">
                    <input
                        id={index}
                        type="checkbox"
                        onChange={() => {this.change(student, index)}}
                    ></input>
                </div>
            </div>
		));
    }

    save = () => {

    }

    render() {
        return (
            <div className="CourseStudents">
				<NavBar />
                <div id="container">
                    <h1 id="title"> Students </h1>
                    <div class="form-group row align-items-end justify-content-end">
                        <form id="boxform" onSubmit={this.save}>
                        {
                            this.displayStudents(
                                this.state.students
                            )
                        }

                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default CourseStudents;