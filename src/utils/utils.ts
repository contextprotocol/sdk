import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import * as TJS from "typescript-json-schema";
import {ContextResult, Failure} from "../lib";
import {ContextError} from "./ContextError";

export function splitDomainAndDocumentAndVersion(path: string) {
  let domainName;
  let documentPath = path;
  let versionNumber;
  if (path.includes("/")) {
    const [domain, ...restPath] = path.split("/");
    documentPath = restPath.join("/");
    domainName = domain;
  }
  if (path.includes("?")) {
    const [document, versionNumberQuery] = documentPath.split("?");
    documentPath = document;

    if (versionNumberQuery) {
      const versionArray = versionNumberQuery.split("=");
      if (versionArray[0] === "v") {
        versionNumber = versionArray[1];
      }
    }
  }

  return { domainName, documentPath, versionNumber };
}

export function splitDomainAndDocumentAndVersionFilter(path: string) {
  const { domainName, documentPath, versionNumber } =
    splitDomainAndDocumentAndVersion(path);
  let versionFilter;
  if (versionNumber) {
    versionFilter = transformVersionNumberToObject(versionNumber);
  }

  return { domainName, documentPath, versionFilter };
}

export function transformVersionNumberToObject(versionNumber: string): {
  major: number;
  minor: number;
  patch: number;
} {
  const versionArray = versionNumber.split(".");
  const versionFilter = {
    major: 1,
    minor: 0,
    patch: 0,
  };
  if (
    !isNumberString(versionArray[0]) ||
    !isNumberString(versionArray[1]) ||
    !isNumberString(versionArray[2])
  ) {
    throw new Error(`ContextSDK: Invalid version number: ${versionNumber}`);
  }
  versionFilter.major = Number(versionArray[0]);
  versionFilter.minor = Number(versionArray[1]);
  versionFilter.patch = Number(versionArray[2]);

  return versionFilter;
}
export function extractPathAndVersionNumber(skipPath: string, urlPath: string) {
  const fullPath = urlPath.split("?");

  const pathOrId = fullPath[0].slice(skipPath.length);

  let versionNumber;
  if (fullPath.length > 1) {
    const urlParams = new URLSearchParams(fullPath[1]);
    versionNumber = urlParams.get("v");
  }
  return { pathOrId, versionNumber };
}

function isNumberString(num: string): boolean {
  return !isNaN(parseFloat(num)) && isFinite(Number(num));
}

export function generateJsonSchema(
  typeName: string,
  typeDefinition: string,
): object | null {
  const tempFileName = path.join(os.tmpdir(), "temp-type-definition.ts");
  fs.writeFileSync(tempFileName, typeDefinition);

  // Create a TypeScript program
  const program = TJS.getProgramFromFiles([tempFileName], {});

  // Generate the JSON schema
  const schema = TJS.generateSchema(program, typeName, {
    required: true,
  });

  fs.unlinkSync(tempFileName);

  return schema;
}

export function _returnObject<T>(data: T): ContextResult<T> {
  return Promise.resolve({ success: true, data });
}

export function _returnFailure(e: any): Failure {
  const error = e as ContextError;
  return { success: false, error: error.getErrorObject()};
}