import { EventEmitter } from "@stencil/core";

export interface MedAlternativaInterface {
  Alternativa: string;
  Enunciado: string;
  Imagem: string;
  Porcentagem: number;

  Riscada?: boolean;
}
export interface MedAlternativasInterface {
  alternativas: MedAlternativaInterface[] | any[];
  keyAlternativa?: 'Alternativa' | string;
  keyEnunciado?: 'Enunciado' | string;
  keyImagem?: 'Imagem' | string;
  keyPorcentagem?: 'Porcentagem' | string;
  keyRiscada?: 'Riscada' | string;
  respostaCorreta: string;
  mostraResposta: boolean;
  alternativaSelecionada?: string;
  permiteRiscar?: boolean;
  dsSkinConfig?: { aleternativas: string }
}

export interface MedAlternativasInternoInterface extends MedAlternativasInterface{
  permiteAlterar:boolean;
  riscarAtivoIndice:number;
  medChange?: EventEmitter<MedAlternativaInterface>;
  medRiscada?: EventEmitter<MedAlternativaInterface>;
  medGalleryRequest?: EventEmitter<MedAlternativaInterface>;
  keyAlternativa: 'Alternativa' | string;
  keyEnunciado: 'Enunciado' | string;
  keyImagem: 'Imagem' | string;
  keyPorcentagem: 'Porcentagem' | string;
  keyRiscada: 'Riscada' | string;
}
