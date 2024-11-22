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
          style={{ 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Moon fill="white" size={15} />
        </div>
      }
      uncheckedIcon={
        <div
          style={{ 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Sun fill="yellow" size={15} />
        </div>
      }
      handleDiameter={20}
      // backGround color of the switch when dark mode is applied
      onColor="db2777"  
    />
  );
};

export default DarkModeToggle;