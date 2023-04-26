/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChromeBreadcrumb, CoreStart, ScopedHistory } from "opensearch-dashboards/public";
import React, { MouseEventHandler } from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, matchPath } from "react-router-dom";
import {
  IndexService,
  ManagedIndexService,
  PolicyService,
  RollupService,
  TransformService,
  NotificationService,
  ServicesContext,
  SnapshotManagementService,
  CommonService,
} from "./services";
import { DarkModeContext } from "./components/DarkMode";
import Main from "./pages/Main";
import { CoreServicesContext } from "./components/core_services";
import { MANAGEMENT_APP_ID, ManagementAppMountParams } from "../../../src/plugins/management/public";
import { ManagementRouterItem, indexManagementItems, snapshotManagementItems } from "./pages/Main/Main";
import "./app.scss";
import { MANAGEMENT_BREADCRUMB } from "../../../src/plugins/management/public";

export function renderManagementApp(coreStart: CoreStart, params: ManagementAppMountParams, landingPage: string) {
  const http = coreStart.http;
  const chrome = coreStart.chrome;

  const indexService = new IndexService(http);
  const managedIndexService = new ManagedIndexService(http);
  const policyService = new PolicyService(http);
  const rollupService = new RollupService(http);
  const transformService = new TransformService(http);
  const notificationService = new NotificationService(http);
  const snapshotManagementService = new SnapshotManagementService(http);
  const commonService = new CommonService(http);
  const services = {
    indexService,
    managedIndexService,
    policyService,
    rollupService,
    transformService,
    notificationService,
    snapshotManagementService,
    commonService,
  };

  const isDarkMode = coreStart.uiSettings.get("theme:darkMode") || false;
  const managementAppURL = coreStart.application.getUrlForApp(MANAGEMENT_APP_ID);

  const setBreadcrumbsScoped = (crumbs: ChromeBreadcrumb[] = [], appHistory?: ScopedHistory) => {
    coreStart.chrome.setBreadcrumbs([
      {
        ...MANAGEMENT_BREADCRUMB,
        href: managementAppURL,
        onClick: (event: any) => {
          const managementAppURL = coreStart.application.getUrlForApp(MANAGEMENT_APP_ID);
          event.preventDefault();
          coreStart.application.navigateToUrl(managementAppURL);
        },
      },
      ...crumbs,
    ]);
  };

  const findAppByURL = (managementItem: ManagementRouterItem[], url: URL) => {
    return managementItem.find((item) =>
      item.hashRoutes.some((hashRoute) => matchPath(url.hash.replace(/^#?/, "").replace(/\?.*$/, ""), hashRoute))
    );
  };

  const coreStartAsScope = { ...coreStart, chrome: { ...coreStart.chrome, setBreadcrumbs: setBreadcrumbsScoped } };
  const ismHashHandler = ({ newURL, oldURL }: HashChangeEvent) => {
    const previousUrlObject = new URL(oldURL);
    const currentUrlObject = new URL(newURL);
    const previousApp = findAppByURL(indexManagementItems, previousUrlObject) || findAppByURL(snapshotManagementItems, previousUrlObject);
    const currentApp = findAppByURL(indexManagementItems, currentUrlObject) || findAppByURL(snapshotManagementItems, currentUrlObject);
    if (previousApp && currentApp && previousApp.id !== currentApp.id) {
      const pathname = currentUrlObject.pathname.replace(new RegExp(`${previousApp.id}$`), currentApp.id);
      coreStart.application.navigateToUrl(`${pathname}${currentUrlObject.hash}`);
    }
  };

  window.addEventListener("hashchange", ismHashHandler);

  ReactDOM.render(
    <Router>
      <Route
        render={(props) => (
          <DarkModeContext.Provider value={isDarkMode}>
            <ServicesContext.Provider value={services}>
              <CoreServicesContext.Provider value={coreStartAsScope}>
                <Main {...props} landingPage={landingPage} />
              </CoreServicesContext.Provider>
            </ServicesContext.Provider>
          </DarkModeContext.Provider>
        )}
      />
    </Router>,
    params.element
  );
  return () => {
    chrome.docTitle.reset();
    ReactDOM.unmountComponentAtNode(params.element);
    window.removeEventListener("hashchange", ismHashHandler);
  };
}
