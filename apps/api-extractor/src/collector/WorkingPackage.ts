// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as ts from 'typescript';
import * as tsdoc from '@microsoft/tsdoc';

import { INodePackageJson } from '@rushstack/node-core-library';

/**
 * Constructor options for WorkingPackage
 */
export interface IWorkingPackageOptions {
  packageFolder: string;
  packageJson: INodePackageJson;
  entryPoints: IWorkingPackageEntryPoint[];
}

export interface IWorkingPackageEntryPoint {
  modulePath: string;
  sourceFile: ts.SourceFile;
}

/**
 * Information about the working package for a particular invocation of API Extractor.
 *
 * @remarks
 * API Extractor tries to model the world as a collection of NPM packages, such that each
 * .d.ts file belongs to at most one package.  When API Extractor is invoked on a project,
 * we refer to that project as being the "working package".  There is exactly one
 * "working package" for the duration of this analysis.  Any files that do not belong to
 * the working package are referred to as "external":  external declarations belonging to
 * external packages.
 *
 * If API Extractor is invoked on a standalone .d.ts file, the "working package" may not
 * have an actual package.json file on disk, but we still refer to it in concept.
 */
export class WorkingPackage {
  /**
   * Returns the folder for the package.json file of the working package.
   *
   * @remarks
   * If the entry point is `C:\Folder\project\src\index.ts` and the nearest package.json
   * is `C:\Folder\project\package.json`, then the packageFolder is `C:\Folder\project`
   */
  public readonly packageFolder: string;

  /**
   * The parsed package.json file for the working package.
   */
  public readonly packageJson: INodePackageJson;

  /**
   * The entry points being processed during this invocation of API Extractor.
   */
  public readonly entryPoints: IWorkingPackageEntryPoint[];

  /**
   * The `@packageDocumentation` comment, if any, for the working package.
   */
  public tsdocComment: tsdoc.DocComment | undefined;

  /**
   * Additional parser information for `WorkingPackage.tsdocComment`.
   */
  public tsdocParserContext: tsdoc.ParserContext | undefined;

  public constructor(options: IWorkingPackageOptions) {
    this.packageFolder = options.packageFolder;
    this.packageJson = options.packageJson;
    this.entryPoints = options.entryPoints;
  }

  /**
   * Returns the full name of the working package.
   */
  public get name(): string {
    return this.packageJson.name;
  }

  public isDefaultEntryPoint(entryPoint: IWorkingPackageEntryPoint): boolean {
    return entryPoint.modulePath === '';
  }
}
