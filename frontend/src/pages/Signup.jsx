import React, { useState } from "react";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import BottomWarning from "../components/BottomWarning";
import Button from "../components/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [userName, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	return (
		<div className="h-screen bg-slate-300 flex justify-center">
			<div className="flex flex-col justify-center">
				<div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
					<Heading label="Sign Up" />
					<SubHeading label="Enter your information to create an account" />
					<InputBox
						label="Firstname"
						placeholder="John"
						onChange={(e) => setFirstName(e.target.value)}
					/>
					<InputBox
						label="Lastname"
						placeholder="Doe"
						onChange={(e) => setLastName(e.target.value)}
					/>
					<InputBox
						label="Email"
						placeholder="yD7oN@example.com"
						onChange={(e) => setUserName(e.target.value)}
					/>
					<InputBox
						label="Password"
						placeholder="********"
						onChange={(e) => setPassword(e.target.value)}
					/>
					<div className="pt-1">
						<Button
							label={"Sign up"}
							onClick={async () => {
								const response = await axios.post(
									"http://localhost:3000/api/v1/user/signup",
									{
										firstName,
										lastName,
										userName,
										password,
									},
								);
								localStorage.setItem(
									"token",
									response.data.token,
								);
								navigate("/dashboard");
							}}
						/>
					</div>
					<BottomWarning
						label={"Already have an account?"}
						buttonText={"Sign in"}
						to={"/signin"}
					/>
				</div>
			</div>
		</div>
	);
};

export default Signup;
