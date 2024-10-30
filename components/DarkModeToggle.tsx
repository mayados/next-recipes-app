"use client"

import React from "react";
import useDarkMode from "use-dark-mode";
import { Moon } from 'lucide-react';
import { Sun } from 'lucide-react';
import Switch from "react-switch";

const DarkModeToggle = () => {
  const darkMode = useDarkMode(false);

  return (
    <Switch
      checked={darkMode.value}
      onChange={darkMode.toggle}
      checkedIcon={
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "1.5px" }}
        >
          <Moon fill="white" />
        </div>
      }
      uncheckedIcon={
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "2px" }}
        >
          <Sun fill="yellow" />
        </div>
      }
    />
  );
};

export default DarkModeToggle;