import {Directive, Input, Renderer2, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[ifWidth]'
})
export class IfWidth {
  private _context: WidthContext = new WidthContext();
  public _thenTemplateRef: TemplateRef<WidthContext>|null = null;

  constructor(private _viewContainer: ViewContainerRef, templateRef: TemplateRef<WidthContext>, public render: Renderer2) {
    this._thenTemplateRef = templateRef;
  }

  onResize(){
    this._updateView();
  }

  @Input()
  set ifWidth(width: string) {
    this._context.$implicit = assertTemplate(width.toLowerCase())
    this._context.asked = assertTemplate(width.toLowerCase())
    this._updateView();
    this.render.listen("window", "resize", this.onResize.bind(this));
  }

  private _updateView() {
    this._context.condition = TestWidth(this._context.asked);
    if (this._context.condition) {
      if (!this._context.see) {
        this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context);
        this._context.see = true;
      }
    }else {
      this._viewContainer.clear();
      this._context.see = false;
    }
  }
}

export const BREAKDOWN = {
  "xs": ">0",
  "sm": ">576",
  "md": ">768",
  "lg": ">992",
  "xl": ">1200"
};

export class WidthContext {
  public $implicit: any = null;
  public asked: string = null;
  public see: boolean = false;
  public condition: boolean = false;
}

export function TestWidth(asked) : boolean{
  if(asked[0] == ">"){
    if ( parseInt(asked.split(">")[1]) < window.innerWidth ){
      return true
    }
  }else {
    if ( parseInt(asked.split("<")[1]) > window.innerWidth ){
      return true
    }
  }
  return false;
}

export function assertTemplate(property: string) { // xs|sm|md|lg|xl|>452px
  if (["xs", "sm", "md", "lg", "xl"].includes(property)){
    return BREAKDOWN[property];
  }
  var beforePx = property.split("px")[0];
  if (beforePx.length > 1){
    if((beforePx[0]) == ">"){
      if(isNaN(parseInt(beforePx.split(">")[1]))){
        throw new Error(`${property} must be a value followed by 'px' (<785px).`);
      }
    }else if( (beforePx[0]) == "<"){
      if(isNaN(parseInt(beforePx.split("<")[1]))){
        throw new Error(`${property} must be a value followed by 'px' (<785px).`);
      }
    }else {
      throw new Error(`${property} must begin by a comparator '>' or '<' (>785px).`);
    }
    return beforePx;
  }

  throw new Error(`${property} must be either a breakdown (xs, sm, md, lg, xl) or a value followed by 'px' (>785px).`);

}
