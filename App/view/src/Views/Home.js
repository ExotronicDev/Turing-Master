import React, {Component} from "react";


class Home extends Component {
    render(){
        return (
            <div className="Home">
                <p className= "titulo">Turing Machine Simulator</p>
                <form action = "">
                    <button type="submit" className="btn btn-primary btn-lg"> Teacher </button>
                </form>
                <form action = "">
                    <button type="submit" className="btn btn-primary btn-lg"> Student </button>
                </form>    
                <form action = "">
                    <button type="submit" className="btn btn-primary btn-lg"> Sign Up </button> 
                </form>
            </div>
        )
    }
}

export default Home;