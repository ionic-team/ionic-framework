export interface MedAlternativaInterface {
  Alternativa: string;
  Enunciado: string;
  Imagem: string;
  Porcentagem: number;
}

export interface MedAlternativasInterface {
  alternativas: MedAlternativaInterface[] | any[];
  keyAlternativa?: 'Alternativa' | string;
  keyEnunciado?: 'Enunciado' | string;
  keyImagem?: 'Imagem' | string;
  keyPorcentagem?: 'Porcentagem' | string;
  respostaCorreta: string;
  mostraResposta: boolean;
  alternativaSelecionada?: string;
}
