
export interface WorkerProcess {
  appEntryPoint: string;
  worker: any;
};

export interface MessageToWorker {
  pathToAppScripts: string;
  debug: boolean;
  appEntryPoint: string;
  appNgModulePath: string;
  srcDir: string;
  distDir: string;
  tsConfig: string;
  ionicAngularDir: string;
  sassConfigPath: string;
  copyConfigPath: string;
};

export interface MessageFromWorker {
  appEntryPoint: string;
  resolve?: any;
  reject?: any;
  error?: any;
  pid?: number;
};
