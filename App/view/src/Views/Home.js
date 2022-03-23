import React, {Component} from "react";


class Home extends Component {
    render(){
        return (
            <div className="Home">
                <p className= "titulo">Turing Machine Simulator</p>
                <form action = "/login/teacher">
                    <button id="teacher" type="submit" className="btn btn-primary btn-lg"> Teacher </button>
                </form>
                <form action = "/login/student">
                    <button id="student" type="submit" className="btn btn-primary btn-lg"> Student </button>
                </form>    
                <form action = "/SignUp">
                    <button id="signup" type="submit" className="btn btn-primary btn-lg"> Sign Up </button> 
                </form>
            </div>
        )
    }
}

export default Home;