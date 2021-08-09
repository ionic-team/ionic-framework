export interface MedImageZoomItemInterface {
  src?: string;
  legenda?: string;
}

export interface MedImageZoomInterface{
  titulo?: string;
  imagens: MedImageZoomItemInterface[];
  marcaAguaSuperior?: string;
  marcaAguaInferior?: string;
}
