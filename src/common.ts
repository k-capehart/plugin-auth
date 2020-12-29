/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { AuthInfo, SfdcUrl, SfdxProject } from '@salesforce/core';
import { getString, Optional } from '@salesforce/ts-types';

interface Flags {
  setalias?: string;
  setdefaultdevhubusername?: boolean;
  setdefaultusername?: boolean;
}

export class Common {
  public static async handleSideEffects(authInfo: AuthInfo, flags: Flags): Promise<void> {
    if (flags.setalias) await authInfo.setAlias(flags.setalias);

    if (flags.setdefaultdevhubusername || flags.setdefaultusername) {
      await authInfo.setAsDefault({
        defaultUsername: flags.setdefaultusername,
        defaultDevhubUsername: flags.setdefaultdevhubusername,
      });
    }
  }
  public static async getLoginUrl(instanceUrl: Optional<string>): Promise<Optional<string>> {
    if (instanceUrl) {
      return instanceUrl;
    }
    try {
      const project = await SfdxProject.resolve();
      const projectJson = await project.resolveProjectConfig();
      return getString(projectJson, 'sfdcLoginUrl', SfdcUrl.PRODUCTION);
    } catch (err) {
      // just return production URL
      return SfdcUrl.PRODUCTION;
    }
  }
}
