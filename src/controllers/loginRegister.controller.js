const getViewRegister = async (req, res) => {
  res.render("register");
};

const getViewRoot = async (req, res) => {
  res.redirect("/login");
};

const getViewLogin = async (req, res) => {
  res.render("login");
};

export default {
  getViewRegister,
  getViewRoot,
  getViewLogin,
};
