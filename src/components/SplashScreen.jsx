import { useState, useEffect, useRef } from "react";
import "./SplashScreen.css";

const DAILY_DESIGNS = [
  {
    id: "ocean",
    quote: "Don't worry about what you can't control",
    theme: "ocean",
    bgColor: "#f0f7fa",
  },
  {
    id: "kitchen",
    quote: "Create a life you can't wait to wake up to",
    theme: "kitchen",
    bgColor: "#faf8f5",
  },
  {
    id: "garden",
    quote: "Bloom where you are planted",
    theme: "garden",
    bgColor: "#f5faf5",
  },
  {
    id: "space",
    quote: "Shoot for the moon, land among the stars",
    theme: "space",
    bgColor: "#1a1a2e",
  },
  {
    id: "forest",
    quote: "The best time to plant a tree was yesterday",
    theme: "forest",
    bgColor: "#f5f8f5",
  },
  {
    id: "beach",
    quote: "Let the waves wash away your worries",
    theme: "beach",
    bgColor: "#faf9f5",
  },
  {
    id: "mountains",
    quote: "Every mountain top is within reach",
    theme: "mountains",
    bgColor: "#f8fafa",
  },
  {
    id: "city",
    quote: "Adventure awaits around every corner",
    theme: "city",
    bgColor: "#faf9f7",
  },
  {
    id: "books",
    quote: "A reader lives a thousand lives",
    theme: "books",
    bgColor: "#faf8f5",
  },
  {
    id: "rainy",
    quote: "After the rain comes the rainbow",
    theme: "rainy",
    bgColor: "#f5f8fa",
  },
];

const getTodaysDesign = () => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (100 * 60 * 60 * 24)
  );
  const index = dayOfYear % DAILY_DESIGNS.length;
  return DAILY_DESIGNS[index];
};

const formatDate = () => {
  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return today.toLocaleDateString("en-US", options);
};

// Enhanced Ocean Theme
const OceanTheme = ({ mousePos }) => (
  <div className="theme-container ocean-theme">
    {/* Animated water surface */}
    <svg
      className="water-surface"
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
    >
      <path
        className="wave wave-1"
        d="M0,100 C150,150 350,50 500,100 C650,150 850,50 1000,100 C1150,150 1200,100 1200,100 L1200,0 L0,0 Z"
      />
      <path
        className="wave wave-2"
        d="M0,120 C150,170 350,70 500,120 C650,170 850,70 1000,120 C1150,170 1200,120 1200,120 L1200,0 L0,0 Z"
      />
    </svg>

    {/* Whale */}
    <svg
      className="whale floating-element"
      style={{
        transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`,
      }}
      viewBox="0 0 200 100"
    >
      <ellipse
        cx="100"
        cy="50"
        rx="80"
        ry="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M20 50 Q-10 20 10 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M180 50 Q220 50 230 30 Q220 50 230 70 Q220 50 180 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="50" cy="35" r="5" fill="currentColor" />
      <path
        d="M70 60 Q90 70 110 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M60 50 Q65 48 70 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>

    {/* Fish school */}
    <div
      className="fish-school"
      style={{
        transform: `translate(${mousePos.x * -0.03}px, ${
          mousePos.y * -0.02
        }px)`,
      }}
    >
      {[...Array(8)].map((_, i) => (
        <svg key={i} className={`fish fish-${i}`} viewBox="0 0 40 20">
          <ellipse
            cx="15"
            cy="10"
            rx="12"
            ry="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M27 10 L35 5 L35 15 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="8" cy="8" r="2" fill="currentColor" />
        </svg>
      ))}
    </div>

    {/* Bubbles */}
    <div className="bubbles">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className={`bubble bubble-${i}`}
          style={{
            left: `${10 + Math.random() * 80}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
          }}
        />
      ))}
    </div>

    {/* Seaweed */}
    <svg className="seaweed seaweed-left" viewBox="0 0 100 300">
      <path
        d="M50 300 Q30 250 50 200 Q70 150 50 100 Q30 50 50 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M30 300 Q10 260 30 220 Q50 180 30 140"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M70 300 Q90 260 70 220 Q50 180 70 140"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
    <svg className="seaweed seaweed-right" viewBox="0 0 100 300">
      <path
        d="M50 300 Q70 250 50 200 Q30 150 50 100 Q70 50 50 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M30 300 Q50 260 30 220"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>

    {/* Coral */}
    <svg className="coral coral-1" viewBox="0 0 150 200">
      <path
        d="M75 200 Q75 150 60 120 Q45 90 60 60 M60 120 Q75 100 90 120 M60 90 Q45 70 60 50 M90 120 Q105 90 90 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="60"
        cy="50"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="90"
        cy="55"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>

    {/* Jellyfish */}
    <svg
      className="jellyfish"
      style={{
        transform: `translate(${mousePos.x * 0.04}px, ${mousePos.y * 0.03}px)`,
      }}
      viewBox="0 0 80 120"
    >
      <ellipse
        cx="40"
        cy="30"
        rx="30"
        ry="25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M15 50 Q20 80 15 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="tentacle"
      />
      <path
        d="M30 55 Q35 85 30 110"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="tentacle"
      />
      <path
        d="M50 55 Q45 85 50 110"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="tentacle"
      />
      <path
        d="M65 50 Q60 80 65 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="tentacle"
      />
    </svg>
  </div>
);

// Enhanced Garden Theme
const GardenTheme = ({ mousePos }) => (
  <div className="theme-container garden-theme">
    {/* Large flowers */}
    <svg
      className="flower flower-1"
      style={{
        transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`,
      }}
      viewBox="0 0 100 150"
    >
      <line
        x1="50"
        y1="60"
        x2="50"
        y2="150"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle
        cx="50"
        cy="40"
        r="25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="50" cy="40" r="12" fill="currentColor" />
      <path
        d="M30 80 Q10 90 20 110"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M70 90 Q90 100 80 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>

    <svg
      className="flower flower-2"
      style={{
        transform: `translate(${mousePos.x * -0.015}px, ${
          mousePos.y * 0.025
        }px)`,
      }}
      viewBox="0 0 120 180"
    >
      <line
        x1="60"
        y1="80"
        x2="60"
        y2="180"
        stroke="currentColor"
        strokeWidth="3"
      />
      <ellipse
        cx="60"
        cy="50"
        rx="20"
        ry="35"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <ellipse
        cx="35"
        cy="60"
        rx="20"
        ry="35"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        transform="rotate(-30 35 60)"
      />
      <ellipse
        cx="85"
        cy="60"
        rx="20"
        ry="35"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        transform="rotate(30 85 60)"
      />
      <circle cx="60" cy="60" r="10" fill="currentColor" />
    </svg>

    {/* Butterflies */}
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`butterfly butterfly-${i}`}
        viewBox="0 0 60 40"
        style={{
          transform: `translate(${mousePos.x * (0.03 + i * 0.01)}px, ${
            mousePos.y * (0.02 + i * 0.01)
          }px)`,
        }}
      >
        <ellipse cx="30" cy="20" rx="4" ry="12" fill="currentColor" />
        <ellipse
          cx="18"
          cy="15"
          rx="12"
          ry="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <ellipse
          cx="42"
          cy="15"
          rx="12"
          ry="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <ellipse
          cx="20"
          cy="28"
          rx="8"
          ry="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <ellipse
          cx="40"
          cy="28"
          rx="8"
          ry="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M28 8 Q25 0 22 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M32 8 Q35 0 38 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    ))}

    {/* Grass and plants */}
    <svg className="grass grass-left" viewBox="0 0 200 150">
      <path
        d="M20 150 Q25 100 30 150"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M40 150 Q50 80 45 150"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M60 150 Q55 90 70 150"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M90 150 Q100 70 95 150"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M110 150 Q105 100 120 150"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
    <svg className="grass grass-right" viewBox="0 0 200 150">
      <path
        d="M80 150 Q85 90 90 150"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M100 150 Q110 70 105 150"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M130 150 Q125 100 140 150"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M160 150 Q170 80 165 150"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>

    {/* Floating petals */}
    <div className="petals">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`petal petal-${i}`}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
          }}
        >
          🌸
        </div>
      ))}
    </div>
  </div>
);

// Enhanced Space Theme
const SpaceTheme = ({ mousePos }) => (
  <div className="theme-container space-theme">
    {/* Stars background */}
    <div className="stars-container">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className={`star star-${i % 3}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>

    {/* Moon */}
    <svg
      className="moon"
      style={{
        transform: `translate(${mousePos.x * 0.01}px, ${mousePos.y * 0.01}px)`,
      }}
      viewBox="0 0 120 120"
    >
      <circle
        cx="60"
        cy="60"
        r="50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="45"
        cy="45"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="70"
        cy="55"
        r="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="50"
        cy="75"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>

    {/* Planet with rings */}
    <svg
      className="planet"
      style={{
        transform: `translate(${mousePos.x * -0.02}px, ${
          mousePos.y * -0.02
        }px)`,
      }}
      viewBox="0 0 200 150"
    >
      <ellipse
        cx="100"
        cy="75"
        rx="40"
        ry="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <ellipse
        cx="100"
        cy="75"
        rx="70"
        ry="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <ellipse
        cx="100"
        cy="75"
        rx="55"
        ry="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M70 55 Q80 50 90 55"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>

    {/* Rocket */}
    <svg
      className="rocket"
      style={{
        transform: `translate(${mousePos.x * 0.03}px, ${mousePos.y * 0.03}px)`,
      }}
      viewBox="0 0 60 120"
    >
      <ellipse
        cx="30"
        cy="50"
        rx="15"
        ry="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M30 10 L20 30 L40 30 Z" fill="currentColor" />
      <path
        d="M15 70 L5 95 L18 85"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M45 70 L55 95 L42 85"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="30"
        cy="45"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <ellipse
        cx="30"
        cy="95"
        rx="10"
        ry="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="rocket-flame"
      />
    </svg>

    {/* Shooting stars */}
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className={`shooting-star shooting-star-${i}`}
        style={{
          animationDelay: `${i * 2}s`,
        }}
      />
    ))}

    {/* Constellation */}
    <svg className="constellation" viewBox="0 0 200 150">
      <circle cx="30" cy="30" r="3" fill="currentColor" />
      <circle cx="80" cy="50" r="3" fill="currentColor" />
      <circle cx="50" cy="90" r="3" fill="currentColor" />
      <circle cx="120" cy="70" r="3" fill="currentColor" />
      <circle cx="150" cy="40" r="3" fill="currentColor" />
      <line
        x1="30"
        y1="30"
        x2="80"
        y2="50"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.5"
      />
      <line
        x1="80"
        y1="50"
        x2="50"
        y2="90"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.5"
      />
      <line
        x1="80"
        y1="50"
        x2="120"
        y2="70"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.5"
      />
      <line
        x1="120"
        y1="70"
        x2="150"
        y2="40"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.5"
      />
    </svg>
  </div>
);

// Enhanced Rainy Theme
const RainyTheme = ({ mousePos }) => (
  <div className="theme-container rainy-theme">
    {/* Clouds */}
    <svg
      className="cloud cloud-1"
      style={{ transform: `translate(${mousePos.x * 0.01}px, 0)` }}
      viewBox="0 0 200 100"
    >
      <ellipse
        cx="60"
        cy="60"
        rx="50"
        ry="35"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <ellipse
        cx="100"
        cy="50"
        rx="40"
        ry="30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <ellipse
        cx="140"
        cy="60"
        rx="45"
        ry="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <ellipse
        cx="40"
        cy="65"
        rx="30"
        ry="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
    <svg
      className="cloud cloud-2"
      style={{ transform: `translate(${mousePos.x * -0.015}px, 0)` }}
      viewBox="0 0 180 90"
    >
      <ellipse
        cx="50"
        cy="55"
        rx="40"
        ry="30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <ellipse
        cx="90"
        cy="45"
        rx="35"
        ry="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <ellipse
        cx="130"
        cy="55"
        rx="38"
        ry="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>

    {/* Rain drops */}
    <div className="rain-container">
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          className="raindrop"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${0.8 + Math.random() * 0.4}s`,
          }}
        />
      ))}
    </div>

    {/* Umbrella */}
    <svg
      className="umbrella"
      style={{
        transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`,
      }}
      viewBox="0 0 150 180"
    >
      <path
        d="M15 80 Q75 20 135 80"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M15 80 Q45 60 75 80"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M75 80 Q105 60 135 80"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="75"
        y1="80"
        x2="75"
        y2="160"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M75 160 Q90 160 90 145"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>

    {/* Puddles with ripples */}
    <svg className="puddle puddle-1" viewBox="0 0 150 50">
      <ellipse
        cx="75"
        cy="25"
        rx="70"
        ry="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <ellipse
        cx="50"
        cy="25"
        rx="15"
        ry="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="ripple"
      />
      <ellipse
        cx="90"
        cy="28"
        rx="12"
        ry="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="ripple ripple-delay"
      />
    </svg>
    <svg className="puddle puddle-2" viewBox="0 0 120 40">
      <ellipse
        cx="60"
        cy="20"
        rx="55"
        ry="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <ellipse
        cx="40"
        cy="20"
        rx="10"
        ry="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="ripple"
      />
    </svg>

    {/* Lightning (occasional) */}
    <svg className="lightning" viewBox="0 0 50 100">
      <path
        d="M25 0 L15 40 L30 40 L20 100 L35 50 L20 50 L30 0"
        fill="currentColor"
      />
    </svg>
  </div>
);

// Simple fallback for other themes
const DefaultTheme = ({ mousePos, theme }) => (
  <div className={`theme-container ${theme}-theme default-theme`}>
    <div
      className="default-decoration decoration-1"
      style={{
        transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`,
      }}
    />
    <div
      className="default-decoration decoration-2"
      style={{
        transform: `translate(${mousePos.x * -0.015}px, ${
          mousePos.y * -0.015
        }px)`,
      }}
    />
    <div
      className="default-decoration decoration-3"
      style={{
        transform: `translate(${mousePos.x * 0.025}px, ${
          mousePos.y * -0.02
        }px)`,
      }}
    />
  </div>
);

const ThemeIllustration = ({ theme, mousePos }) => {
  switch (theme) {
    case "ocean":
      return <OceanTheme mousePos={mousePos} />;
    case "garden":
      return <GardenTheme mousePos={mousePos} />;
    case "space":
      return <SpaceTheme mousePos={mousePos} />;
    case "rainy":
      return <RainyTheme mousePos={mousePos} />;
    default:
      return <DefaultTheme mousePos={mousePos} theme={theme} />;
  }
};

function SplashScreen({ onComplete }) {
  const [design] = useState(getTodaysDesign());
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.width / 2) / 10,
          y: (e.clientY - rect.height / 2) / 10,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  const isLightTheme = design.theme !== "space";

  return (
    <div
      ref={containerRef}
      className={`splash-screen theme-${design.theme} ${
        isVisible ? "visible" : ""
      }`}
      style={{ backgroundColor: design.bgColor }}
    >
      <ThemeIllustration theme={design.theme} mousePos={mousePos} />

      <div className={`splash-content ${isLightTheme ? "light" : "dark"}`}>
        <div className="quote-card">
          <div className="tape tape-left" />
          <div className="tape tape-right" />
          <p className="quote">{design.quote}</p>
        </div>

        <p className="date">{formatDate()}</p>

        <div className="loading-section">
          <div className="loading-dots">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
          <div className="loading-bar">
            <div className="loading-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="loading-text">Opening your journal...</p>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
