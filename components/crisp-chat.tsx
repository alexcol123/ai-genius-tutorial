"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("7df2a598-6813-44cf-afcf-b2ff60b1b09b");
  }, []);

  return null;
};