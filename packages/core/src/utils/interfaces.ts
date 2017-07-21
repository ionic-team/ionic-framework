


export interface IonicController {
  <LoadingController>(ctrlName: 'loading', opts: LoadingOptions): Promise<Loading>;
  <MenuController>(ctrlName: 'menu'): Promise<MenuController>;
  <ModalController>(ctrlName: 'modal', opts: ModalOptions): Promise<Modal>;
  (ctrlName: string, opts?: any): Promise<IonicControllerApi>;
}


export interface IonicControllerApi {
  load?: (opts?: any) => Promise<any>;
}



export interface ConfigApi {
  get: (key: string, fallback?: any) => any;
  getBoolean: (key: string, fallback?: boolean) => boolean;
  getNumber: (key: string, fallback?: number) => number;
}


export interface PlatformApi {
  name: string;
  isMatch?: {(url: string, userAgent: string): boolean};
  settings?: any;
}