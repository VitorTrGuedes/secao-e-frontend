export function getApiErrorMessage(error, resource) {
  const status = error?.response?.status;

  if (status) {
    return `Não foi possível carregar ${resource}. A API respondeu com erro HTTP ${status}. Tente novamente mais tarde.`;
  }

  return `Não foi possível conectar à API para carregar ${resource}. Verifique sua conexão e tente novamente.`;
}
