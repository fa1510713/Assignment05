"use client";

import React, { useEffect, useState } from "react";
import "../styles/globals.css";
import styles from "./Page.module.css";
import AddIcon from "@mui/icons-material/Add";
import { Button, IconButton, TextField } from "@mui/material";
import styled from "@emotion/styled";
import SaveIcon from "@mui/icons-material/Save";
import { Cancel, Delete } from "@mui/icons-material";
import axios from "axios";
import { useQuery } from "react-query";

const CssTextField = styled(TextField)({
  "& label": {
    color: "rgba(255, 255, 255, 0.23)",
  },
  "& label.Mui-focused": {
    borderRadius: 10,
    color: "#3599FF",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#3599FF",
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& input": {
      color: "white",
    },
    "& textarea": {
      color: "white",
    },
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.23)",
      borderRadius: 10,
      color: "#3599FF",
    },
    "&:hover fieldset": {
      borderColor: "#3599FF",
      color: "#3599FF",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3599FF",
      borderRadius: 10,
      color: "#3599FF",
    },
  },
});

const Home = () => {
  const [displayBox, setDisplayBox] = useState(false);
  const [userId, setUserId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [ideas, setIdeas] = useState([]);

  const fetchIdeas = async (id) => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/${id}/ideas`);
      return data.ideas;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading, isError } = useQuery(["ideas", userId], () =>
    fetchIdeas(userId)
  );

  useEffect(() => {
    if (data) {
      setIdeas(data);
    }
  }, [data]);

  const getUserId = async () => {
    const { data } = await axios.get("/api/identifier");
    setUserId(data.id);
    localStorage.setItem("userId", data.id);
  };

  useEffect(() => {
    let id = localStorage.getItem("userId");
    if (id) {
      setUserId(id);
    } else {
      getUserId();
    }
  }, []);

  const postIdea = async () => {
    const { data } = await axios.post(
      `http://localhost:3000/api/${userId}/ideas`,
      {
        title,
        description,
      }
    );
    setIdeas(data.ideas);
    setTitle("");
    setDescription("");
    setDisplayBox(false);
  };

  const deleteIdea = async (id) => {
    const { data } = await axios.delete(
      `http://localhost:3000/api/${userId}/ideas?id=${id}`
    );
    setIdeas(data.ideas);
  };

  return (
    <div className={styles.container}>
      {!displayBox ? (
        <Button
          className={styles.button}
          variant="outlined"
          onClick={() => setDisplayBox(true)}
        >
          <AddIcon />
        </Button>
      ) : (
        <div className={styles.addContainer}>
          <CssTextField
            style={{
              width: "100%",
            }}
            label="Title"
            id="custom-css-outlined-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <CssTextField
            style={{
              marginTop: 20,
              width: "100%",
            }}
            label="Description"
            id="custom-css-ouut"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className={styles.buttonContainer}>
            <IconButton onClick={postIdea}>
              <SaveIcon color="info" />
            </IconButton>
            <IconButton onClick={() => setDisplayBox(false)}>
              <Cancel color="error" />
            </IconButton>
          </div>
        </div>
      )}
      <div className={styles.ideas}>
        {ideas.map((idea) => (
          <div className={styles.idea} key={idea.id}>
            <h3>{idea.title}</h3>
            <p>{idea.description}</p>
            <IconButton onClick={() => deleteIdea(idea.id)}>
              <Delete color="error" />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
