import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "./App.css";
import tomatoImage from "./assets/tomato.png";
import sproutImage from "./assets/sprout.png";
import bellSound from "./assets/bell.mp3";
import celebrationImage from "./assets/celebration-tomato.png";

function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos en segundos
  const [isRunning, setIsRunning] = useState(false); // Si el temporizador está activo
  const [isWorkCycle, setIsWorkCycle] = useState(true); // Ciclo de trabajo o descanso
  const [completedHour, setCompletedHour] = useState(false); // Completaste una hora
  const [cyclesCompleted, setCyclesCompleted] = useState(0); // Contador de ciclos
  const [buttonText, setButtonText] = useState("Iniciar"); // Texto dinámico del botón
  const [showMessage, setShowMessage] = useState(""); // Mensajes para ciclos completados

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      handleCycleCompletion();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleCycleCompletion = () => {
    playSound();

    setCyclesCompleted((prev) => {
      const newCyclesCompleted = prev + 1;

      if (newCyclesCompleted === 4) {
        // Mostrar felicitaciones al completar 1 hora
        setCompletedHour(true);
        setButtonText("Iniciar");
        setIsRunning(false);
        setShowMessage("¡Completaste un ciclo Pomodoro, felicidades!");
        return 0; // Reiniciar el contador de ciclos
      }

      // Mensajes por ciclo
      if (isWorkCycle) {
        setShowMessage("¡Ya está maduro, tiempo de descansar!");
      } else {
        setShowMessage("¡Descanso completado, volvamos al trabajo!");
      }

      return newCyclesCompleted;
    });

    // Alternar entre ciclos de trabajo y descanso
    if (isWorkCycle) {
      setTimeLeft(5 * 60);
      setIsWorkCycle(false);
    } else {
      setTimeLeft(25 * 60);
      setIsWorkCycle(true);
    }
  };

  const playSound = () => {
    const audio = new Audio(bellSound);
    audio.play();
  };

  const handleStartPause = () => {
    if (!isRunning) {
      setIsRunning(true);
      setButtonText("Pausar"); // Cambia a "Pausar" cuando comienza
    } else {
      setIsRunning(false);
      setButtonText("Reanudar"); // Cambia a "Reanudar" cuando se pausa
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setIsWorkCycle(true);
    setCyclesCompleted(0);
    setCompletedHour(false);
    setButtonText("Iniciar"); // Al reiniciar, vuelve a "Iniciar"
    setShowMessage(""); // Limpia los mensajes
  };

  const handleContinue = () => {
    setTimeLeft(25 * 60);
    setIsRunning(true);
    setIsWorkCycle(true);
    setCompletedHour(false);
    setButtonText("Pausar"); // Al reanudar después de una hora, cambia a "Pausar"
    setShowMessage(""); // Limpia los mensajes
  };

  const handleAccelerate = () => {
    if (isWorkCycle) {
      setTimeLeft(1); // Completa el ciclo de trabajo inmediatamente
    } else {
      setTimeLeft(1); // Completa el ciclo de descanso inmediatamente
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: `url('/assets/background.jpg')`, // Ruta para la imagen de fondo
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Título con texto rojo y bordes negros */}
      <h1
        className="absolute top-4 text-center text-3xl md:text-4xl lg:text-5xl font-bold text-red-500"
        style={{
          textShadow:
            "2px 2px 0px black, -2px -2px 0px black, 2px -2px 0px black, -2px 2px 0px black",
        }}
      >
        Método Pomodoro
      </h1>

      {/* Botón Acelerar */}
      <button
        onClick={handleAccelerate}
        className="absolute top-4 right-4 px-3 py-1 md:px-4 md:py-2 bg-blue-500 text-white text-sm md:text-base rounded shadow"
      >
        Acelerar
      </button>

      {completedHour && <Confetti />} {/* Confeti al completar una hora */}

      <div className="bg-gray-200/75 p-4 md:p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg text-center flex flex-col items-center justify-center">
        {showMessage ? (
          <div>
            {completedHour && (
              <img
                src={celebrationImage} // Imagen para el mensaje de felicitaciones
                alt="Celebration"
                className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-4"
              />
            )}
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600">
              {showMessage}
            </h1>
            <div className="flex space-x-4 mt-4 justify-center">
              {completedHour ? (
                <>
                  <button
                    onClick={handleContinue}
                    className="px-3 py-1 md:px-4 md:py-2 bg-green-500 text-white text-sm md:text-base rounded shadow"
                  >
                    Reanudar
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-3 py-1 md:px-4 md:py-2 bg-red-500 text-white text-sm md:text-base rounded shadow"
                  >
                    Dejarlo aquí
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowMessage("")}
                  className="px-3 py-1 md:px-4 md:py-2 bg-green-500 text-white text-sm md:text-base rounded shadow"
                >
                  Continuar
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <img
              src={isWorkCycle ? tomatoImage : sproutImage}
              alt="Ciclo visual"
              className={`w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 ${
                !isRunning
                  ? "grayscale"
                  : isWorkCycle
                  ? "animate-bounce"
                  : "animate-breathing"
              }`}
            />

            {/* Temporizador */}
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mt-4 text-black">
              {formatTime(timeLeft)}
            </h1>

            {/* Botones */}
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-4 justify-center">
              <button
                onClick={handleStartPause}
                className={`px-3 py-1 md:px-4 md:py-2 ${
                  isRunning ? "bg-yellow-500" : "bg-green-500"
                } text-white text-sm md:text-base rounded shadow`}
              >
                {buttonText}
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1 md:px-4 md:py-2 bg-red-500 text-white text-sm md:text-base rounded shadow"
              >
                Reiniciar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
