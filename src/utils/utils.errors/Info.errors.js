const generateUserErrorUrl = () => {
  return `
    ******
        URL not valid OR not exist.
    ******
    `;
};

const generateProdutErrorInfo = () => {
  return `
      ****** Product not valid OR not exist.    ******
      `;
};

const generateUserErrorPermission = () => {
  return `
        ****** No tiene permisos de usuario suficientes para acceder a la opcion o pagina.    ******
        `;
};

export default {
  generateUserErrorUrl,
  generateProdutErrorInfo,
  generateUserErrorPermission,
};
