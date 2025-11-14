import React, { useState, useEffect } from "react"; // --- MODIFICADO --- (Añadido useEffect)
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import fondo from '../../assets/chingotto-galan-padel-brussels-premier-padel-event-2024.avif'
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASS;

const Login = () => {
  const navigate = useNavigate();

  const [showForgot, setShowForgot] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [club, setClub] = useState("");
  const [phone, setPhone] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [recoveryError, setRecoveryError] = useState("");

  const [emailJsLoaded, setEmailJsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    script.async = true;
    script.onload = () => {
      setEmailJsLoaded(true);
    };
    script.onerror = () => {
      setRecoveryError("No se pudo cargar el servicio de correo. Inténtalo más tarde.");
    };
    document.body.appendChild(script);

    // Limpieza al desmontar el componente
    return () => {
      document.body.removeChild(script);
    };
  }, []); // El array vacío asegura que esto se ejecute solo una vez

  // --- (handleLogin sin cambios) ---
  const handleLogin = (e) => {
    e.preventDefault();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("091a26afbfcaba13f5ac05e6e697d0b58b25bc5ba5ffb931752739a653fc8bef", "true");
      setErrorMsg("");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/admin/091a26afbfcaba13f5ac05e6e697d0b58b25bc5ba5ffb931752739a653fc8bef");
      }, 1500);
    } else {
      setErrorMsg("Correo o contraseña incorrectos");
    }
  };


  // --- MODIFICADO ---
  // Lógica para enviar el correo usando EmailJS
  const handleRecoverySubmit = (e) => {
    e.preventDefault();

    // --- MODIFICADO ---
    // Verifica si el script ha cargado
    if (isSending || !emailJsLoaded) {
      if (!emailJsLoaded) {
        setRecoveryError("El servicio de correo aún no está listo. Inténta de nuevo en un momento.");
      }
      return;
    }

    setIsSending(true);
    setRecoveryError(""); // Limpia errores previos

    // --- ¡IMPORTANTE! ---
    // Reemplaza estos valores con tus propias claves de EmailJS
    // (Usando las claves que proporcionaste)
    const serviceID = "service_rotwm0c";
    const templateID = "template_ieg3xs7";
    const publicKey = "mo0-jCM_w8YPvbJNg";

    // -------------------

    const templateParams = {
      from_name: fullName,
      club: club,
      phone: phone,
    };

    // --- MODIFICADO ---
    // Accede a emailjs desde el objeto 'window'
    window.emailjs.send(serviceID, templateID, templateParams, publicKey)
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          setIsSending(false);
          setShowForgot(false);
          setShowConfirmation(true);
          // Limpia los campos
          setFullName("");
          setClub("");
          setPhone("");
        },
        (err) => {
          console.error("FAILED...", err);
          setIsSending(false);
          setRecoveryError("Error al enviar la solicitud. Inténtalo de nuevo.");
        }
      );
  };

  return (
    <div
      className="h-[100vh] w-[100vw] flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        // --- CORREGIDO (de nuevo) ---
        // Se usa la URL de marcador de posición en lugar de la variable 'fondo'
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* FONDO OSCURO + BLUR */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/50"></div>

      {/* FLECHA VOLVER */}
      <Link
        to="/"
        className="absolute top-4 left-4 z-20 p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition"
      >
        <ArrowLeftIcon className="h-6 w-6 text-white" />
      </Link>

      {/* CONTENIDO */}
      <div className="relative z-10 w-[55vh] h-full flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transition-all hover:scale-[1.01]">
          {/* ... (Alertas de éxito y error de login) ... */}
          {showSuccess && (
            <div className="bg-green-500 text-white text-center py-2 rounded-lg mb-4 animate-fadeIn">
              ¡Inicio de sesión exitoso!
            </div>
          )}
          {errorMsg && (
            <div className="bg-red-500 text-white text-center py-2 rounded-lg mb-4 animate-fadeIn">
              {errorMsg}
            </div>
          )}

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenido
            </h1>
            <p className="text-gray-600">Inicia sesión en tu cuenta</p>
          </div>

          {/* FORM LOGIN */}
          <form onSubmit={handleLogin}>
            {/* ... (Campos de email y password de login) ... */}
            <div className="mb-4">
              <label className="font-semibold text-gray-700 block mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-100 focus:bg-white focus:outline-none focus:border-indigo-500 transition"
                placeholder="admin@example.com"
                required
                autoComplete="username"
              />
            </div>

            <div className="mb-6">
              <label className="font-semibold text-gray-700 block mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-100 focus:bg-white focus:outline-none focus:border-indigo-500 transition"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>


            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:opacity-90 transition"
            >
              Iniciar Sesión
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-indigo-500 hover:text-purple-600 text-sm"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        </div>

        {/* MODAL RECUPERAR */}
        {showForgot && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-30 animate-fadeIn">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl animate-slideUp">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Recuperar Contraseña
                </h2>
                <button
                  onClick={() => setShowForgot(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>

              <p className="text-gray-600 mb-4">
                Completa la siguiente información para recuperar tu contraseña
              </p>

              {/* --- NUEVO --- Mensaje de error para el modal */}
              {recoveryError && (
                <div className="bg-red-500 text-white text-center py-2 rounded-lg mb-4 animate-fadeIn">
                  {recoveryError}
                </div>
              )}

              {/* --- MODIFICADO --- Formulario con estados */}
              <form onSubmit={handleRecoverySubmit}>
                <div className="mb-4">
                  <label className="font-semibold text-gray-700 block mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 border-2 rounded-lg bg-gray-100 focus:bg-white focus:border-indigo-500 transition"
                  />
                </div>

                <div className="mb-4">
                  <label className="font-semibold text-gray-700 block mb-1">
                    Club
                  </label>
                  <input
                    type="text"
                    required
                    value={club}
                    onChange={(e) => setClub(e.target.value)}
                    className="w-full p-3 border-2 rounded-lg bg-gray-100 focus:bg-white focus:border-indigo-500 transition"
                  />
                </div>

                <div className="mb-6">
                  <label className="font-semibold text-gray-700 block mb-1">
                    Número de Teléfono
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 border-2 rounded-lg bg-gray-100 focus:bg-white focus:border-indigo-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending || !emailJsLoaded} // --- MODIFICADO ---
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-green-600 transition disabled:opacity-50"
                >
                  {isSending ? "Enviando..." : "Enviar Solicitud"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL CONFIRMACIÓN */}
        {showConfirmation && (
          // ... (Modal de confirmación sin cambios) ...
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-30 animate-fadeIn">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-slideUp text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Solicitud Enviada!
              </h2>

              <p className="text-gray-600 mb-6">
                Nos contactaremos contigo a la brevedad.
              </p>

              <button
                onClick={() => setShowConfirmation(false)}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-green-600 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;