import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Switch from 'react-switch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  //Avoid hydratation problems client side
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; 

  // Verify if it's the dark mode theme. By default, set to dark.
  const isDarkMode = theme === 'dark';

  return (
    <div className="flex items-center">
      <Switch
        checked={isDarkMode}
        onChange={() => setTheme(isDarkMode ? 'light' : 'dark')}
        checkedIcon={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <FontAwesomeIcon icon={faMoon} color="white" size="sm" />
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
            <FontAwesomeIcon icon={faSun} color="yellow" size="sm" />
          </div>
        }
        handleDiameter={24}
        // background color light
        offColor="#0f172a"
        // background color dark mode
        onColor="#ef4444"
        height={28}
        width={56}
      />
    </div>
  );
}
