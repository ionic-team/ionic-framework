import { relative } from 'path';

export function ionicRollupFesmPlugin(rootPath: string) {
  return {
    name: 'ionic-rollup-fesm',

    transform(sourceText: string, sourcePath: string) {
      const relativePath = relative(rootPath, sourcePath);

      const modifiedFileContent =
`
/* start of module ${relativePath} */
${sourceText}
/* end of module ${relativePath} */
`;

      return {
        code: modifiedFileContent
      };
    }
  };
};