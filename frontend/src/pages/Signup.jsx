import React from "react";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import BottomWarning from "../components/BottomWarning";
import Button from "../components/Button";

const Signup = () => {
	return (
		<div className="h-screen bg-slate-300 flex justify-center">
			<div className="flex flex-col justify-center">
				<div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
					<Heading label="Sign Up" />
					<SubHeading label="Enter your information to create an account" />
					<InputBox label="Firstname" placeholder="John" />
					<InputBox label="Lastname" placeholder="Doe" />
					<InputBox label="Email" placeholder="yD7oN@example.com" />
					<InputBox label="Password" placeholder="********" />
					<div className="pt-1">
						<Button label={"Sign up"} />
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
