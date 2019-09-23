import React, { Component } from 'react'

export default class CreateUser extends Component {
    constructor(props) {
        super(props); // always call super when defining the constructor of a subclass

        // Bind 'this' reference to object to that 'this' will refer to User object instead of method
        // Avoids 'undefined' errors when calling methods below
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePrefix = this.onChangePrefix.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        // Define initial state with this.state; always create variables in react in this manner
        this.state = {
            username: '',
            prefix: '',
            prefixes: [] // test componentDidMount() method; used to store values for prefix fetched from database
        }
    }

    // Fetch entries from mongoose database once component is mounted
    // componentDidMount will be called right before anything is displayed on the page
    componentDidMount () {
        this.setState({
            // TODO - set users array to be loaded with prefix values from database
            username: '',
            prefixes: ['Mr', 'Mrs']
        })
    }

    // Define methods to manipulate state properties
    // Always use setState method; Target - textbox; Value - value of textbox
    onChangeUsername(e) {
        this.setState({
            username: e.target.value
            // TO DEL
        });
    }

    onChangePrefix(e) {
        this.setState({
            prefix: e.target.value
        });
    }
    
    // Define methods to handle form
    onSubmit(e) {
        e.preventDefault();  // prevent default html form submit behaviour to allow customization of form as below

        // create variables in normal JS style if they are only used within the method
        const user = {
            username: this.state.username,
            prefix: this.state.prefix
        }

        // TO DEL
        console.log(user)

        // Redirect back to homepage
        window.location = '/user'
    }

    render() {
        return (
            <div>
                <h3>Create New User</h3>
                <form onSubmit = {this.onSubmit}>
                    <div className="form-group">
                        <label>Prefix: </label>
                        <select ref="userInputPrefix" required className="form-control" value={this.state.prefix} onChange={this.onChangePrefix}>
                            {
                                this.state.prefixes.map((prefix) => {
                                    return <option key={prefix} value={prefix}>{prefix}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Username: </label>
                        <input type="text" required className="form-control" value={this.state.username} onChange={this.onChangeUsername} />
                    </div>
                    <button type="submit" value='Create User' className='btn btn-primary'>Submit</button>
                </form>
            </div>
        )
    }
}
