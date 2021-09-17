import { MedAlternativaInterface, MedAlternativasInternoInterface } from "./med-alternativas-interface";
import { Coordenada, distanciaEuclidiana, getPositionFromEvent } from '../../../../../utils/medgrupo';

export class MedAlternativasBase {
  private dataStart!: Date;
  private dataEnd!: Date;
  private positionStart: Coordenada | undefined;
  private distanciaMinimaClick = 50;
  private tempoLongPress = 1000;
  private timer!: any;

  constructor(public parent: MedAlternativasInternoInterface) { }

  public resetState() {
    this.parent.riscarAtivoIndice = -1;
    this.parent.permiteAlterar = true;
  }

  handleClick(event: any) {
    if (!event.target.classList.contains('med-alternativas') && event.target.tagName !== 'MED-ALTERNATIVAS') {
      this.resetState();
    }
  }

  onAlternativasChanged(newValue: MedAlternativaInterface | any, oldValue: MedAlternativaInterface | any) {
    if (newValue != oldValue) {
      this.resetState();
    }
  }

  public onTouchStart(event: any, indice: number) {
    if (event.target.closest('.med-alternativas__riscar')?.classList.contains('med-alternativas__riscar')) {
      return;
    }

    this.dataStart = new Date();
    this.positionStart = getPositionFromEvent(event);

    this.timer = setTimeout(() => {
      this.dataEnd = new Date();

      const tempoTotal = this.dataEnd.getTime() - this.dataStart.getTime();

      if (tempoTotal >= this.tempoLongPress) {
        this.parent.riscarAtivoIndice = indice;
        this.parent.permiteAlterar = false;
      }
    }, this.tempoLongPress);

  }

  public onTouchEnd(event: any, alternativa: MedAlternativaInterface) {
    if (event.target.closest('.med-alternativas__riscar')?.classList.contains('med-alternativas__riscar')) {
      return;
    }

    const positionEnd = getPositionFromEvent(event);

    clearTimeout(this.timer);
    if (this.parent.permiteAlterar &&
      distanciaEuclidiana(this.positionStart, positionEnd) <
      this.distanciaMinimaClick) {
      this.parent.riscarAtivoIndice = -1;
      this.alterarAlternativa(alternativa);
    }

    this.parent.permiteAlterar = true;
  }

  public alterarAlternativa(item: any) {
    const alternativa: MedAlternativaInterface = item;

    if (alternativa.Riscada && this.parent.permiteRiscar) {
      return;
    }

    this.parent.alternativaSelecionada = alternativa.Alternativa;
    this.parent.medChange?.emit(alternativa);
  }

  public riscar(event: any, alternativa: any) {
    event.stopPropagation();

    alternativa[this.parent.keyRiscada] = !alternativa[this.parent.keyRiscada];

    this.parent.riscarAtivoIndice = -1;

    this.parent.medRiscada?.emit(alternativa);

    this.parent.permiteAlterar = true;

    this.parent.alternativas = [...this.parent.alternativas];
  }

  public imageRequest(event: any, alternativa: any) {
    event.stopPropagation();

    this.parent.medGalleryRequest?.emit(alternativa);
  }

}
