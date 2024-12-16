import { UserTab } from "./UserTab";
import React, { useState, useEffect } from "react";
import { useLazyGetMeQuery } from "@/Services";
import Loading from "@/General/Components/Loading";

export const UserTabContainer = () => {

  const [fetchMe, { data, isSuccess, isLoading, isUninitialized, error }] =
  useLazyGetMeQuery();

  useEffect(() => {
    fetchMe()
  }, [fetchMe]);
  return <UserTab data={isSuccess?data:null} isLoading={isUninitialized} />;
};
