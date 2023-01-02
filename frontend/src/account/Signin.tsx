import Layout from "../Layout";
import React, { useContext, useEffect, useState } from "react";
import FormInput from "./FormInput";
import { UserContext } from "../App";
import { useNavigate, useSearchParams } from "react-router-dom";

function Signin() {
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [error, setError] = useState("");

    const userInfo = useContext(UserContext);
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();


    const signin = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setError("");

        if (usernameInput === "" || passwordInput === "") {
            setError("Please fill in all fields");
            return;
        }


        const url = process.env.NODE_ENV !== "production" ? process.env.REACT_APP_DEV_URL : process.env.REACT_APP_PROD_URL
        const query = 
        `mutation {
            signin(username: "${usernameInput}", password: "${passwordInput}") {
                msg
                sessionToken
            }
        }`

        const response = await fetch(url ?? '', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({query})
        }).then(res => res.json())

        if (response.data.signin.msg) {
            setError(response.data.signin.msg);
            return;
        }

        const sessionToken = response.data.signin.sessionToken;
        if (!sessionToken) {
            setError("Invalid username or password");
            return;
        }

        userInfo.dispatch({type: "UPDATE", payload: {
            username: usernameInput, 
            sessionToken: sessionToken}
        });

        localStorage.setItem("username", usernameInput.toLowerCase());
        localStorage.setItem("sessionToken", sessionToken);

        navigate(searchParams.get("return") ?? "/");


    }

    return (
    <Layout>
        <div className = "text-white mt-8 mx-auto w-11/12 md:w-3/4 lg:w-3/5">
            {userInfo.state.username ?
            <div className = "mx-auto w-fit">
                <p>Already signed in.</p>
                <button onClick = {() => { userInfo.dispatch({type: "SIGNOUT"}) }} className = "text-sm text-white px-4 py-2 mx-auto my-2 bg-black/20 rounded-xl block border border-black/50">
                    Sign Out
                </button>
            </div>
            :
            <form onSubmit = {signin} className = "mx-auto border border-black/10 w-5/6 md:w-3/4 lg:w-1/2 px-12 py-4 rounded-xl bg-black/20 shadow-md">
                <h1 className = "text-3xl text-center">Sign In</h1>

                <a href = "/register">
                    <p className = "text-sm text-sky-300 underline text-center">
                        or register here
                    </p>
                </a>

                <FormInput
                    name = "Username"
                    value = {usernameInput}
                    setValue = {setUsernameInput}
                    mt = "mt-4"
                    valid = {usernameInput !== ""}
                />

                <FormInput
                    name = "Password"
                    value = {passwordInput}
                    setValue = {setPasswordInput}
                    password = {true}
                    valid = {passwordInput !== ""}
                />

                <p className = "text-rose-200">{error}</p>
                <button onClick = {signin} className = "text-sm text-white px-4 py-2 mx-auto my-2 bg-black/20 rounded-xl block border border-black/50">
                    Sign In
                </button>



            </form>
            }

        </div>
    </Layout>)
}

export default Signin;