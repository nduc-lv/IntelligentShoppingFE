import { Home } from "./Home";
import React, { useState, useEffect } from "react";
import { useLazyGetMeQuery } from "@/Services";

export const HomeContainer = () => {

  const [getMe, { data, isSuccess, isUninitialized, isFetching, error }] =
    useLazyGetMeQuery();

  return <Home data={data} isLoading={isUninitialized} />;
};
