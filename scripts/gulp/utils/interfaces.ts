
export interface WorkerProcess {
  appEntryPoint: string;
  worker: any;
}

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
  isDev: boolean;
  minifyJs: boolean;
  minifyCss: boolean;
  optimizeJs: boolean;
}

