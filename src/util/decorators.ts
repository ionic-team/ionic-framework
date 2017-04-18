
export const Component: ComponentDecorator = function(opts?: ComponentOptions): (target: any) => any {
  return function() {};
};


export interface ComponentDecorator {
  (opts?: ComponentOptions): any;
}


export interface ComponentOptions {
  tag: string;
  styleUrls?: string[] | ModeStyles;
}

export interface ModeStyles {
  [modeName: string]: string | string[];
}
