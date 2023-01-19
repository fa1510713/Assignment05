"use client";

import styled from "@emotion/styled";
import { Button, TextField } from "@mui/material";
import { Magic } from "magic-sdk";
import React, { useEffect, useState } from "react";
import "../../styles/globals.css";
import styles from "./Page.module.css";
import cookie from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";

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

const Login = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const token = cookie.get("token");

  useEffect(() => {
    if (token) {
      router.replace("/ideas");
    }
  }, [token]);

  const login = async () => {
    if (!email) {
      alert("Please enter an email");
      return;
    }
    try {
      const did = await new Magic(
        process.env.NEXT_PUBLIC_PUBLISHABLE_API_KEY
      ).auth.loginWithEmailOTP({ email });
      const authRequest = await axios.post(
        "/api/user",
        {},
        {
          headers: { Authorization: `Bearer ${did}` },
        }
      );
      router.push("/ideas");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        <CssTextField
          style={{
            width: "100%",
          }}
          label="Email"
          id="custom-css-outlined-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button className={styles.button} variant="outlined" onClick={login}>
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
