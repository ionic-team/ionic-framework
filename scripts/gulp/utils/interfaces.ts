
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
  coreCompilerFilePath: string;
  coreDir: string;
  sassConfigPath: string;
  copyConfigPath: string;
  isDev: boolean;
};
