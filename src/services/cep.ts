/**
 * CEP Utility service to fetch data from ViaCEP API.
 */
export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  erro?: boolean;
}

export async function getAddressByCep(cep: string): Promise<ViaCepResponse | null> {
  // Clean inputs, leave only digits
  const cleanedCep = cep.replace(/\D/g, '');
  if (cleanedCep.length !== 8) {
    throw new Error('CEP deve conter exatamente 8 dígitos decimais.');
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
    if (!response.ok) {
      throw new Error('Falha na resposta da API de CEP.');
    }
    const data: ViaCepResponse = await response.json();
    if (data.erro) {
      throw new Error('CEP não encontrado na base de dados.');
    }
    return data;
  } catch (error: any) {
    console.error('Erro na chamada ViaCEP:', error);
    throw error;
  }
}
