const admin = require("../config/firebase.js");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { email } = req.body;

  try {
    // BUSCAR USUARIO EN FIREBASE AUTH
    const user = await admin.auth().getUserByEmail(email);

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // CREAR TOKEN JWT
    const token = jwt.sign(
      {
        uid: user.uid,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login válido",
      token,
      user: { email: user.email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en login", error: error.message });
  }
};

module.exports = { loginUser };
