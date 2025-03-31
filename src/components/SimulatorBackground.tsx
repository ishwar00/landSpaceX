import React from "react";

const SimulatorBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Sky Background */}
      <div className="absolute inset-0 bg-white">
        {/* Clouds */}
        <svg
          className="absolute w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 800"
        >
          {/* Cloud groups similar to your current design */}
          <circle
            className="fill-gray-100"
            cx="250"
            cy="120"
            r="60"
          />
          <circle
            className="fill-gray-100"
            cx="320"
            cy="150"
            r="40"
          />

          <circle
            className="fill-gray-100"
            cx="550"
            cy="180"
            r="70"
          />
          <circle
            className="fill-gray-100"
            cx="620"
            cy="210"
            r="50"
          />

          <circle
            className="fill-gray-100"
            cx="850"
            cy="130"
            r="65"
          />
          <circle
            className="fill-gray-100"
            cx="920"
            cy="160"
            r="45"
          />
        </svg>

        {/* Line Art Birds */}
        <svg
          className="absolute w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 800"
        >
          {/* Bird 1 - simple line art V shape */}
          <path
            className="fill-none stroke-gray-800 stroke-2"
            d="M480,120 Q490,130 500,120"
            strokeLinecap="round"
          />

          {/* Bird 2 */}
          <path
            className="fill-none stroke-gray-800 stroke-2"
            d="M520,150 Q530,160 540,150"
            strokeLinecap="round"
          />
        </svg>

        {/* Distant Hills */}
        <svg
          className="absolute bottom-0 w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 100"
        >
          <path
            className="fill-gray-200"
            d="M0,100 Q300,70 600,90 T1200,80 V100 H0 Z"
          />
        </svg>

        {/* Distant Trees and Bushes */}
        <svg
          className="absolute bottom-0 w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 100"
        >
          {/* First cluster of trees */}
          <circle className="fill-gray-300" cx="100" cy="80" r="10" />
          <circle className="fill-gray-300" cx="120" cy="75" r="12" />
          <circle className="fill-gray-300" cx="140" cy="82" r="8" />

          {/* Second cluster of trees */}
          <circle className="fill-gray-300" cx="300" cy="78" r="11" />
          <circle className="fill-gray-300" cx="320" cy="72" r="9" />
          <circle className="fill-gray-300" cx="340" cy="76" r="13" />

          {/* Third cluster */}
          <circle className="fill-gray-300" cx="500" cy="75" r="8" />
          <circle className="fill-gray-300" cx="520" cy="70" r="12" />
          <circle className="fill-gray-300" cx="537" cy="77" r="10" />

          {/* Fourth cluster */}
          <circle className="fill-gray-300" cx="700" cy="79" r="9" />
          <circle className="fill-gray-300" cx="725" cy="76" r="11" />
          <circle className="fill-gray-300" cx="745" cy="81" r="8" />

          {/* Fifth cluster */}
          <circle className="fill-gray-300" cx="900" cy="77" r="10" />
          <circle className="fill-gray-300" cx="925" cy="74" r="12" />
          <circle className="fill-gray-300" cx="945" cy="80" r="9" />

          {/* Sixth cluster */}
          <circle
            className="fill-gray-300"
            cx="1100"
            cy="76"
            r="11"
          />
          <circle className="fill-gray-300" cx="1125" cy="80" r="9" />
          <circle
            className="fill-gray-300"
            cx="1145"
            cy="75"
            r="12"
          />
        </svg>

        {/* Foreground Mountains/Trees (keeping your current style but enhancing) */}
        <svg
          className="absolute bottom-0 w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 100"
        >
          {/* Left group */}
          <path
            className="fill-gray-800"
            d="M120,100 L200,20 L280,100 Z"
          />
          <path
            className="fill-gray-800"
            d="M50,100 L90,40 L130,100 Z"
          />
          <path
            className="fill-gray-800"
            d="M210,100 L250,40 L290,100 Z"
          />

          {/* Middle mountains */}
          <path
            className="fill-gray-800"
            d="M400,100 L440,65 L480,100 Z"
          />

          {/* Right group */}
          <path
            className="fill-gray-800"
            d="M1000,100 L1080,20 L1160,100 Z"
          />
          <path
            className="fill-gray-800"
            d="M930,100 L970,40 L1010,100 Z"
          />
          <path
            className="fill-gray-800"
            d="M1090,100 L1130,40 L1170,100 Z"
          />
        </svg>

        {/* Open Field Grass */}
        <svg
          className="absolute bottom-0 w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 20"
        >
          <rect
            className="fill-gray-300"
            x="0"
            y="0"
            width="1200"
            height="20"
          />
        </svg>
      </div>
    </div>
  );
};

export default SimulatorBackground;
