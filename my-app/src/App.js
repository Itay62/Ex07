import React from "react";
import axios from "axios";
import "./App.css";

export default class PostsDB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      body: null,
      data: [],
      resp: null,
      user: null,
      sign_user: null,
      pass: null,
      sign_pass: null,
    };
  }

  doEditUserLogin = (e) => {
    this.setState({
      user: e.target.value,
    });
  };

  doEditPassLogin = (e) => {
    this.setState({
      pass: e.target.value,
    });
  };

  doEditUserSign = (e) => {
    this.setState({
      sign_user: e.target.value,
    });
  };

  doEditPassSign = (e) => {
    this.setState({
      sign_pass: e.target.value,
    });
  };

  doSignUp = (e) => {
    const url = "/signup";
    const data = {
      sign_user: this.state.sign_user,
      sign_pass: this.state.sign_pass,
    };
    axios
      .post(url, data)
      .then((res) => {
        this.setState({
          resp: `Welcome ${data.sign_user}, You have signed up!`,
          data: [],
        });
      })
      .catch((err) => {
        this.setState({
          data: [],
          resp: "Username already exists!",
        });
      });
  };

  doLogin = (e) => {
    const url = "/login";
    const data = {
      user: this.state.user,
      pass: this.state.pass,
    };
    axios
      .post(url, data)
      .then((res) => {
        this.setState({
          data: [],
          resp: `Welcome back ${data.user}! `,
        });
      })
      .catch((err) => {
        this.setState({
          data: [],
          resp: "Error!",
        });
      });
  };

  doLogout = (e) => {
    const url = "/logout";
    axios
      .get(url)
      .then((res) => {
        this.setState({
          data: [],
          resp: `You have logged out!`,
        });
      })
      .catch((err) => {
        this.setState({
          data: [],
          resp: "No one is logged in!",
        });
      });
  };

  getAllPosts = (e) => {
    const url = "/posts";
    axios.get(url).then((res) => {
      this.setState({
        data: res.data,
        resp: null,
      });
    });
  };

  doEditTitle = (e) => {
    this.setState({
      title: e.target.value,
    });
  };

  doEditBody = (e) => {
    this.setState({
      body: e.target.value,
    });
  };

  addPost = (e) => {
    const url = "/posts";
    const data = {
      title: this.state.title,
      body: this.state.body,
    };
    axios
      .post(url, data)
      .then((res) => {
        this.setState({
          data: [],
          resp: "Success, great new post added!",
        });
      })
      .catch((err) => {
        this.setState({
          data: [],
          resp: "Error: something went wrong, try another post.",
        });
      });
  };

  render() {
    const { data } = this.state;
    return (
      <div className="container">
        <div className="signup">
          Username:{" "}
          <input
            type="text"
            onChange={this.doEditUserSign}
            placeholder="Username"
          ></input>
          <br />
          Password:{" "}
          <input
            type="text"
            onChange={this.doEditPassSign}
            placeholder="Password"
          ></input>
          <br />
          <button onClick={this.doSignUp}>Sign Up</button>
          <br></br>
        </div>
        <br></br>
        <div className="login">
          Username:{" "}
          <input
            type="text"
            onChange={this.doEditUserLogin}
            placeholder="Username"
          ></input>
          <br />
          Password:{" "}
          <input
            type="text"
            onChange={this.doEditPassLogin}
            placeholder="Password"
          ></input>
          <br />
          <button onClick={this.doLogin}>Login</button>
          <br></br>
          <button onClick={this.doLogout}>Logout</button>
          <br></br>
        </div>

        <div>{this.state.resp ? this.state.resp : null}</div>

        <br></br>
        <button onClick={this.getAllPosts}>Get All Posts</button>
        <br />

        <input
          type="text"
          onChange={this.doEditTitle}
          placeholder="title"
        ></input>

        <input
          type="text"
          onChange={this.doEditBody}
          placeholder="body"
        ></input>

        <button onClick={this.addPost}>Add Post</button>

        <div className="posts">
          {this.state.data.map((item) => (
            <div>
              ID: {item.id}, Title: {item.title}, Body: {item.body}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
