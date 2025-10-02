import React from "react";
import { useRouter } from "next/router";
import { LoginPage } from "@ixeta/xams-firebase";

const Login = () => {
  const router = useRouter();
  return <LoginPage onLoginSuccess={() => router.push("/protectedpage")} />;
};

export default Login;
