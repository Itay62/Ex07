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
    };
  }

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

  getAllPosts = (e) => {
    const url = "/posts";
    axios.get(url).then((res) => {
      this.setState({
        data: res.data,
        resp: null,
      });
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
          data: null,
          resp: "Error: something went wrong, try another post.",
        });
      });
  };

  render() {
    const { data } = this.state;
    return (
      <div className="container">
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

        <div>{this.state.resp ? this.state.resp : null}</div>

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
