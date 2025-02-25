"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useLogin from "@/queries/auth/useLogin";
import Spinner from "@/components/common/spinner";
import useSignUp from "@/queries/auth/useSignUp";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showLogin = !(searchParams.get("signup") === "true");
  const { mutate: signUp, isPending: loadingSignUp } = useSignUp({
    onSuccess: () => {
      router.push("login");
    },
  });
  const { mutate: login, isPending: loadingLogin } = useLogin({
    onSuccess: () => {
      router.replace("/home");
    },
  });
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    username: "",
  });

  const handleSubmit = () => {
    if (!showLogin) {
      signUp({
        email: loginForm.email,
        password: loginForm.password,
        username: loginForm.username,
      });
    } else {
      login({
        email: loginForm.email,
        password: loginForm.password,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleForgotPassword = () => {
    alert("Coming soon");
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center w-full p-4 max-w-xl mx-auto">
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h1 className="text-white text-3xl font-normal text-center mb-14">
          {showLogin ? "Welcome Back!" : "Create an Account"}
        </h1>
        <Input
          id="email"
          type="email"
          placeholder="Email Address"
          onChange={handleChange}
          value={loginForm.email}
          variant="border"
        />
        {!showLogin && (
          <Input
            id="username"
            type="text"
            placeholder="Username"
            onChange={handleChange}
            value={loginForm.username}
            variant="border"
          />
        )}
        <Input
          id="password"
          type="password"
          placeholder="Password"
          variant="border"
          onChange={handleChange}
          value={loginForm.password}
        />
        <Button
          className="w-full"
          size="xl"
          type="submit"
          variant="roundedWhite"
          disabled={loadingLogin || loadingSignUp}
        >
          {showLogin ? "LOGIN" : "SIGN UP"}
          {(loadingLogin || loadingSignUp) && <Spinner />}
        </Button>
      </form>
      {showLogin && (
        <div className="flex justify-center items-center mt-4">
          <Button
            variant="link"
            size="sm"
            className="font-medium text-neutral-500"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </Button>
        </div>
      )}
      <div className="flex justify-center items-center absolute bottom-10">
        <p className="text-neutral-300">
          {showLogin ? "Don't have an account?" : "Already have an account?"}
        </p>
        <Button
          variant="link"
          size="sm"
          className="font-bold text-white underline text-base"
          onClick={() => {
            router.push(`/login?signup=${showLogin}`);
          }}
        >
          {showLogin ? "Sign up" : "Login"}
        </Button>
      </div>
    </div>
  );
};

const Wrapper = () => {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
};

export default Wrapper;
