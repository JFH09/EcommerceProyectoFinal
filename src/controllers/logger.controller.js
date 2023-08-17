const getLoggerTest = (req, res) => {
  try {
    req.logger.warning("Generando Alerta waring !!!!!!");
    req.logger.info("Generando Alerta infooo!!!!!!");
    req.logger.fatal("Generando Alerta fatal !!!!!!");
    req.logger.error("Generando Alerta error !!!!!!");
    req.logger.debug("Generando Alerta debug!!!!!!");
    res.send({ message: "prueba de logger..." });
  } catch (err) {
    res.send({ message: "No se pudo obtener el logger..." });
  }
};

export default {
  getLoggerTest,
};
