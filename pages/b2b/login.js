import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import SignIn from "../../components/b2b_components/SignIn";

import useSwr, { mutate } from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());

const Login = () => {
  const { data: users } = useSwr(`/api/users/getAllUsers`, fetcher);
  console.log(users)
  return (
    <SignIn users={users} />
  );
};

export default Login;