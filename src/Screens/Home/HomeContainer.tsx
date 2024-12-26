import { Home } from "./Home";
import React, { useState, useEffect } from "react";
import { userApi } from "@/Services";
import { useSelector } from "react-redux";
import { AuthState } from "@/Store/reducers";

export const HomeContainer = () => {

  const user=useSelector((state:{auth:AuthState})=>(state.auth.user))


  return <Home data={user} isLoading={!user} />;
};
