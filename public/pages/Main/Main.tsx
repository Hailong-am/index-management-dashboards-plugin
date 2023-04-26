/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from "react";
import { Switch, Route, Redirect, RouteComponentProps, RouteProps } from "react-router-dom";
// @ts-ignore
import { EuiSideNav, EuiPage, EuiPageBody, EuiPageSideBar } from "@elastic/eui";
import { CoreStart } from "opensearch-dashboards/public";
import Policies from "../Policies";
import ManagedIndices from "../ManagedIndices";
import Indices from "../Indices";
import CreatePolicy from "../CreatePolicy";
import VisualCreatePolicy from "../VisualCreatePolicy";
import ChangePolicy from "../ChangePolicy";
import PolicyDetails from "../PolicyDetails/containers/PolicyDetails";
import Rollups from "../Rollups";
import { ModalProvider, ModalRoot } from "../../components/Modal";
import { ServicesConsumer } from "../../services";
import { BrowserServices } from "../../models/interfaces";
import { ROUTES } from "../../utils/constants";
import { CoreServicesConsumer } from "../../components/core_services";
import CreateRollupForm from "../CreateRollup/containers/CreateRollupForm";
import CreateTransformForm from "../CreateTransform/containers/CreateTransformForm";
import EditRollup from "../EditRollup/containers";
import RollupDetails from "../RollupDetails/containers/RollupDetails";
import { EditTransform, Transforms } from "../Transforms";
import TransformDetails from "../Transforms/containers/Transforms/TransformDetails";
import queryString from "query-string";
import CreateSnapshotPolicy from "../CreateSnapshotPolicy";
import Repositories from "../Repositories";
import SnapshotPolicies from "../SnapshotPolicies";
import SnapshotPolicyDetails from "../SnapshotPolicyDetails";
import Snapshots from "../Snapshots";
import CreateIndex from "../CreateIndex";
import Reindex from "../Reindex/container/Reindex";
import Aliases from "../Aliases";
import Templates from "../Templates";
import CreateIndexTemplate from "../CreateIndexTemplate";
import SplitIndex from "../SplitIndex";
import ShrinkIndex from "../ShrinkIndex/container/ShrinkIndex";
import Rollover from "../Rollover";
import DataStreams from "../DataStreams";
import CreateDataStream from "../CreateDataStream";
import ForceMerge from "../ForceMerge";
import ComposableTemplates from "../ComposableTemplates";
import CreateComposableTemplate from "../CreateComposableTemplate";
import IndexDetail from "../IndexDetail";

export enum Navigation {
  IndexManagement = "Index Management",
  IndexPolicies = "State management policies",
  ManagedIndices = "Policy managed indices",
  Indices = "Indices",
  Rollups = "Rollup Jobs",
  Transforms = "Transform Jobs",
  SnapshotManagement = "Snapshot Management",
  Snapshots = "Snapshots",
  SnapshotPolicies = "Snapshot Policies",
  Repositories = "Repositories",
  Aliases = "Aliases",
  Templates = "Templates",
  DataStreams = "Data streams",
  CreateDataStream = "Create data stream",
  ComposableTemplates = "Component templates",
}

enum Pathname {
  IndexPolicies = "/index-policies",
  ManagedIndices = "/managed-indices",
  Indices = "/indices",
  Rollups = "/rollups",
  Transforms = "/transforms",
  Snapshots = "/snapshots",
  SnapshotPolicies = "/snapshot-policies",
  Repositories = "/repositories",
}

const HIDDEN_NAV_ROUTES: string[] = [
  ROUTES.CREATE_ROLLUP,
  ROUTES.EDIT_ROLLUP,
  ROUTES.ROLLUP_DETAILS,
  ROUTES.CREATE_TRANSFORM,
  ROUTES.EDIT_TRANSFORM,
  ROUTES.TRANSFORM_DETAILS,
  ROUTES.CREATE_POLICY,
  ROUTES.EDIT_POLICY,
  ROUTES.POLICY_DETAILS,
  ROUTES.CHANGE_POLICY,
  ROUTES.SNAPSHOT_POLICY_DETAILS,
  ROUTES.CREATE_SNAPSHOT_POLICY,
  ROUTES.EDIT_SNAPSHOT_POLICY,
  ROUTES.REINDEX,
  ROUTES.CREATE_INDEX,
  ROUTES.CREATE_TEMPLATE,
  ROUTES.SPLIT_INDEX,
  ROUTES.SHRINK_INDEX,
  ROUTES.FORCE_MERGE,
  ROUTES.CREATE_DATA_STREAM,
];

const HIDDEN_NAV_STARTS_WITH_ROUTE = [
  ROUTES.CREATE_TEMPLATE,
  ROUTES.INDEX_DETAIL,
  ROUTES.ROLLOVER,
  ROUTES.CREATE_DATA_STREAM,
  ROUTES.FORCE_MERGE,
  ROUTES.CREATE_COMPOSABLE_TEMPLATE,
];

const ROUTE_STYLE = { padding: "0px" };

export interface ManagementRouterItem {
  id: string;
  title: string;
  order: number;
  landingPage: string;
  hashRoutes: RouteProps[];
}

export const indexManagementItems: ManagementRouterItem[] = [
  {
    id: "indexPolicies",
    title: Navigation.IndexPolicies,
    order: 0,
    landingPage: ROUTES.INDEX_POLICIES,
    hashRoutes: [
      {
        path: ROUTES.INDEX_POLICIES,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <Policies {...props} policyService={services.policyService} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: ROUTES.POLICY_DETAILS,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <PolicyDetails {...props} policyService={services.policyService} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: ROUTES.CHANGE_POLICY,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <ChangePolicy {...props} managedIndexService={services.managedIndexService} indexService={services.indexService} />
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: ROUTES.CREATE_POLICY,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services &&
              (queryString.parse(props.location.search).type == "visual" ? (
                <VisualCreatePolicy
                  {...props}
                  isEdit={false}
                  policyService={services.policyService}
                  notificationService={services.notificationService}
                />
              ) : (
                <CreatePolicy {...props} isEdit={false} policyService={services.policyService} />
              ))
            }
          </ServicesConsumer>
        ),
      },
      {
        path: ROUTES.EDIT_POLICY,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services &&
              (queryString.parse(props.location.search).type == "visual" ? (
                <VisualCreatePolicy
                  {...props}
                  isEdit={true}
                  policyService={services.policyService}
                  notificationService={services.notificationService}
                />
              ) : (
                <CreatePolicy {...props} isEdit={true} policyService={services.policyService} />
              ))
            }
          </ServicesConsumer>
        ),
      },
    ],
  },
  {
    id: "managedIndices",
    title: Navigation.ManagedIndices,
    order: 10,
    landingPage: ROUTES.MANAGED_INDICES,
    hashRoutes: [
      {
        path: ROUTES.MANAGED_INDICES,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <ManagedIndices {...props} managedIndexService={services.managedIndexService} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
    ],
  },
  {
    id: "indices",
    title: Navigation.Indices,
    order: 20,
    landingPage: ROUTES.INDICES,
    hashRoutes: [
      {
        path: Pathname.Indices,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <Indices {...props} indexService={services.indexService} commonService={services.commonService} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: `${ROUTES.INDEX_DETAIL}/:index`,
        render: (props: any) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <IndexDetail {...props} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: [`${ROUTES.CREATE_INDEX}/:index/:mode`, ROUTES.CREATE_INDEX],
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <CreateIndex {...props} commonService={services.commonService} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: ROUTES.REINDEX,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <Reindex {...props} commonService={services.commonService} indexService={services.indexService} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: ROUTES.SPLIT_INDEX,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <SplitIndex {...props} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: ROUTES.SHRINK_INDEX,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <ShrinkIndex {...props} commonService={services.commonService} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: [ROUTES.ROLLOVER, `${ROUTES.ROLLOVER}/:source`],
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <Rollover {...props} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: [ROUTES.FORCE_MERGE, `${ROUTES.FORCE_MERGE}/:indexes`],
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <ForceMerge {...props} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
    ],
  },
  {
    id: "aliases",
    title: Navigation.Aliases,
    order: 30,
    landingPage: ROUTES.ALIASES,
    hashRoutes: [
      {
        path: ROUTES.ALIASES,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <Aliases {...props} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
    ],
  },
  {
    id: "templates",
    title: Navigation.Templates,
    order: 40,
    landingPage: ROUTES.TEMPLATES,
    hashRoutes: [
      {
        path: ROUTES.TEMPLATES,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <Templates {...props} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: [`${ROUTES.CREATE_TEMPLATE}/:template/:mode`, `${ROUTES.CREATE_TEMPLATE}/:template`, ROUTES.CREATE_TEMPLATE],
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <CreateIndexTemplate {...props} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
    ],
  },
  {
    id: "dataStreams",
    title: Navigation.DataStreams,
    order: 50,
    landingPage: ROUTES.DATA_STREAMS,
    hashRoutes: [
      {
        path: ROUTES.DATA_STREAMS,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <DataStreams {...props} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: [ROUTES.CREATE_DATA_STREAM, `${ROUTES.CREATE_DATA_STREAM}/:dataStream`],
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <CreateDataStream {...props} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
    ],
  },
  {
    id: "composableTemplates",
    title: Navigation.ComposableTemplates,
    order: 60,
    landingPage: ROUTES.COMPOSABLE_TEMPLATES,
    hashRoutes: [
      {
        path: [
          `${ROUTES.CREATE_COMPOSABLE_TEMPLATE}/:template/:mode`,
          `${ROUTES.CREATE_COMPOSABLE_TEMPLATE}/:template`,
          ROUTES.CREATE_COMPOSABLE_TEMPLATE,
        ],
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <CreateComposableTemplate {...props} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: ROUTES.COMPOSABLE_TEMPLATES,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <ComposableTemplates {...props} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
    ],
  },
  {
    id: "rollups",
    title: Navigation.Rollups,
    order: 70,
    landingPage: ROUTES.ROLLUPS,
    hashRoutes: [
      {
        path: ROUTES.ROLLUPS,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <Rollups {...props} rollupService={services.rollupService} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: ROUTES.CREATE_ROLLUP,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <CreateRollupForm {...props} rollupService={services.rollupService} indexService={services.indexService} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: ROUTES.EDIT_ROLLUP,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <EditRollup {...props} rollupService={services.rollupService} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: ROUTES.ROLLUP_DETAILS,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <RollupDetails {...props} rollupService={services.rollupService} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
    ],
  },
  {
    id: "transforms",
    title: Navigation.Transforms,
    order: 80,
    landingPage: ROUTES.TRANSFORMS,
    hashRoutes: [
      {
        path: ROUTES.TRANSFORMS,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <Transforms {...props} transformService={services.transformService} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: ROUTES.CREATE_TRANSFORM,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <CreateTransformForm
                    {...props}
                    rollupService={services.rollupService}
                    transformService={services.transformService}
                    indexService={services.indexService}
                  />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: ROUTES.EDIT_TRANSFORM,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <EditTransform {...props} transformService={services.transformService} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: ROUTES.TRANSFORM_DETAILS,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <TransformDetails {...props} transformService={services.transformService} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
    ],
  },
];

export const snapshotManagementItems: ManagementRouterItem[] = [
  {
    id: "snapshots",
    title: Navigation.Snapshots,
    order: 0,
    landingPage: ROUTES.SNAPSHOTS,
    hashRoutes: [
      {
        path: ROUTES.SNAPSHOTS,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <Snapshots
                    {...props}
                    snapshotManagementService={services.snapshotManagementService}
                    indexService={services.indexService}
                  />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
    ],
  },
  {
    id: "snapshotPolicies",
    title: Navigation.SnapshotPolicies,
    order: 10,
    landingPage: ROUTES.SNAPSHOT_POLICIES,
    hashRoutes: [
      {
        path: ROUTES.SNAPSHOT_POLICIES,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <SnapshotPolicies {...props} snapshotManagementService={services.snapshotManagementService} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: ROUTES.SNAPSHOT_POLICY_DETAILS,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <SnapshotPolicyDetails
                    {...props}
                    snapshotManagementService={services.snapshotManagementService}
                    notificationService={services.notificationService}
                  />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: ROUTES.CREATE_SNAPSHOT_POLICY,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <CreateSnapshotPolicy
                    {...props}
                    snapshotManagementService={services.snapshotManagementService}
                    notificationService={services.notificationService}
                    indexService={services.indexService}
                    isEdit={false}
                  />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
      {
        path: ROUTES.EDIT_SNAPSHOT_POLICY,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <CreateSnapshotPolicy
                    {...props}
                    snapshotManagementService={services.snapshotManagementService}
                    notificationService={services.notificationService}
                    indexService={services.indexService}
                    isEdit={true}
                  />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
    ],
  },
  {
    id: "repositories",
    title: Navigation.Repositories,
    order: 20,
    landingPage: ROUTES.REPOSITORIES,
    hashRoutes: [
      {
        path: ROUTES.REPOSITORIES,
        render: (props: RouteComponentProps) => (
          <ServicesConsumer>
            {(services: BrowserServices | null) =>
              services && (
                <div style={ROUTE_STYLE}>
                  <Repositories {...props} snapshotManagementService={services.snapshotManagementService} />
                </div>
              )
            }
          </ServicesConsumer>
        ),
      },
    ],
  },
];

interface MainProps extends RouteComponentProps {
  landingPage: string;
}

export default class Main extends Component<MainProps, object> {
  render() {
    // const {
    //   location: { pathname },
    // } = this.props;
    // const sideNav = [
    //   {
    //     name: Navigation.IndexManagement,
    //     id: 0,
    //     href: `#${Pathname.IndexPolicies}`,
    //     items: [
    //       {
    //         name: Navigation.IndexPolicies,
    //         id: 1,
    //         href: `#${Pathname.IndexPolicies}`,
    //         isSelected: pathname === Pathname.IndexPolicies,
    //       },
    //       {
    //         name: Navigation.ManagedIndices,
    //         id: 2,
    //         href: `#${Pathname.ManagedIndices}`,
    //         isSelected: pathname === Pathname.ManagedIndices,
    //       },
    //       {
    //         name: Navigation.Indices,
    //         id: 3,
    //         href: `#${Pathname.Indices}`,
    //         isSelected: [Pathname.Indices, ROUTES.CREATE_INDEX].includes(pathname as Pathname),
    //       },
    //       {
    //         name: Navigation.DataStreams,
    //         id: 8,
    //         href: `#${ROUTES.DATA_STREAMS}`,
    //         isSelected: ROUTES.DATA_STREAMS === pathname,
    //       },
    //       {
    //         name: Navigation.Templates,
    //         id: 7,
    //         href: `#${ROUTES.TEMPLATES}`,
    //         isSelected: ROUTES.TEMPLATES === pathname,
    //         items: [
    //           {
    //             name: Navigation.ComposableTemplates,
    //             id: 9,
    //             href: `#${ROUTES.COMPOSABLE_TEMPLATES}`,
    //             isSelected: ROUTES.COMPOSABLE_TEMPLATES === pathname,
    //           },
    //         ],
    //       },
    //       {
    //         name: Navigation.Aliases,
    //         id: 6,
    //         href: `#${ROUTES.ALIASES}`,
    //         isSelected: ROUTES.ALIASES === pathname,
    //       },
    //       {
    //         name: Navigation.Rollups,
    //         id: 4,
    //         href: `#${Pathname.Rollups}`,
    //         isSelected: pathname === Pathname.Rollups,
    //       },
    //       {
    //         name: Navigation.Transforms,
    //         id: 5,
    //         href: `#${Pathname.Transforms}`,
    //         isSelected: pathname === Pathname.Transforms,
    //       },
    //     ],
    //   },
    //   {
    //     name: Navigation.SnapshotManagement,
    //     id: 1,
    //     href: `#${Pathname.SnapshotPolicies}`,
    //     items: [
    //       {
    //         name: Navigation.SnapshotPolicies,
    //         id: 1,
    //         href: `#${Pathname.SnapshotPolicies}`,
    //         isSelected: pathname === Pathname.SnapshotPolicies,
    //       },
    //       {
    //         name: Navigation.Snapshots,
    //         id: 2,
    //         href: `#${Pathname.Snapshots}`,
    //         isSelected: pathname === Pathname.Snapshots,
    //       },
    //       {
    //         name: Navigation.Repositories,
    //         id: 3,
    //         href: `#${Pathname.Repositories}`,
    //         isSelected: pathname === Pathname.Repositories,
    //       },
    //     ],
    //   },
    // ];

    const { landingPage } = this.props;

    return (
      <CoreServicesConsumer>
        {(core: CoreStart | null) =>
          core && (
            <ServicesConsumer>
              {(services: BrowserServices | null) =>
                services && (
                  <ModalProvider>
                    <ModalRoot services={services} />
                    <Switch>
                      {/* <Route
                        path={ROUTES.SNAPSHOTS}
                        render={(props: RouteComponentProps) => (
                          <div style={ROUTE_STYLE}>
                            <Snapshots
                              {...props}
                              snapshotManagementService={services.snapshotManagementService}
                              indexService={services.indexService}
                            />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.REPOSITORIES}
                        render={(props: RouteComponentProps) => (
                          <div style={ROUTE_STYLE}>
                            <Repositories {...props} snapshotManagementService={services.snapshotManagementService} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.SNAPSHOT_POLICIES}
                        render={(props: RouteComponentProps) => (
                          <div style={ROUTE_STYLE}>
                            <SnapshotPolicies {...props} snapshotManagementService={services.snapshotManagementService} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.SNAPSHOT_POLICY_DETAILS}
                        render={(props: RouteComponentProps) => (
                          <SnapshotPolicyDetails
                            {...props}
                            snapshotManagementService={services.snapshotManagementService}
                            notificationService={services.notificationService}
                          />
                        )}
                      />
                      <Route
                        path={ROUTES.CREATE_SNAPSHOT_POLICY}
                        render={(props: RouteComponentProps) => (
                          <CreateSnapshotPolicy
                            {...props}
                            snapshotManagementService={services.snapshotManagementService}
                            notificationService={services.notificationService}
                            indexService={services.indexService}
                            isEdit={false}
                          />
                        )}
                      />
                      <Route
                        path={ROUTES.EDIT_SNAPSHOT_POLICY}
                        render={(props: RouteComponentProps) => (
                          <CreateSnapshotPolicy
                            {...props}
                            snapshotManagementService={services.snapshotManagementService}
                            notificationService={services.notificationService}
                            indexService={services.indexService}
                            isEdit={true}
                          />
                        )}
                      />
                      <Route
                        path={ROUTES.CHANGE_POLICY}
                        render={(props: RouteComponentProps) => (
                          <ChangePolicy
                            {...props}
                            managedIndexService={services.managedIndexService}
                            indexService={services.indexService}
                          />
                        )}
                      />
                      <Route
                        path={ROUTES.CREATE_POLICY}
                        render={(props: RouteComponentProps) =>
                          queryString.parse(this.props.location.search).type == "visual" ? (
                            <VisualCreatePolicy
                              {...props}
                              isEdit={false}
                              policyService={services.policyService}
                              notificationService={services.notificationService}
                            />
                          ) : (
                            <CreatePolicy {...props} isEdit={false} policyService={services.policyService} />
                          )
                        }
                      />
                      <Route
                        path={ROUTES.EDIT_POLICY}
                        render={(props: RouteComponentProps) =>
                          queryString.parse(this.props.location.search).type == "visual" ? (
                            <VisualCreatePolicy
                              {...props}
                              isEdit={true}
                              policyService={services.policyService}
                              notificationService={services.notificationService}
                            />
                          ) : (
                            <CreatePolicy {...props} isEdit={true} policyService={services.policyService} />
                          )
                        }
                      />
                      <Route
                        path={ROUTES.INDEX_POLICIES}
                        render={(props: RouteComponentProps) => (
                          <div style={ROUTE_STYLE}>
                            <Policies {...props} policyService={services.policyService} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.POLICY_DETAILS}
                        render={(props: RouteComponentProps) => (
                          <div style={ROUTE_STYLE}>
                            <PolicyDetails {...props} policyService={services.policyService} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.MANAGED_INDICES}
                        render={(props: RouteComponentProps) => (
                          <div style={ROUTE_STYLE}>
                            <ManagedIndices {...props} managedIndexService={services.managedIndexService} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.INDICES}
                        render={(props: RouteComponentProps) => (
                          <div style={ROUTE_STYLE}>
                            <Indices {...props} indexService={services.indexService} commonService={services.commonService} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.ROLLUPS}
                        render={(props: RouteComponentProps) => (
                          <div style={ROUTE_STYLE}>
                            <Rollups {...props} rollupService={services.rollupService} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.CREATE_ROLLUP}
                        render={(props: RouteComponentProps) => (
                          <div style={ROUTE_STYLE}>
                            <CreateRollupForm {...props} rollupService={services.rollupService} indexService={services.indexService} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.EDIT_ROLLUP}
                        render={(props: RouteComponentProps) => (
                          <div style={ROUTE_STYLE}>
                            <EditRollup {...props} rollupService={services.rollupService} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.ROLLUP_DETAILS}
                        render={(props: RouteComponentProps) => (
                          <div style={ROUTE_STYLE}>
                            <RollupDetails {...props} rollupService={services.rollupService} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.TRANSFORMS}
                        render={(props: RouteComponentProps) => (
                          <div style={ROUTE_STYLE}>
                            <Transforms {...props} transformService={services.transformService} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.CREATE_TRANSFORM}
                        render={(props: RouteComponentProps) => (
                          <div style={ROUTE_STYLE}>
                            <CreateTransformForm
                              {...props}
                              rollupService={services.rollupService}
                              transformService={services.transformService}
                              indexService={services.indexService}
                            />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.EDIT_TRANSFORM}
                        render={(props: RouteComponentProps) => (
                          <div style={ROUTE_STYLE}>
                            <EditTransform {...props} transformService={services.transformService} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.TRANSFORM_DETAILS}
                        render={(props: RouteComponentProps) => (
                          <div style={ROUTE_STYLE}>
                            <TransformDetails {...props} transformService={services.transformService} />
                          </div>
                        )}
                      />
                      <Route
                        path={`${ROUTES.CREATE_INDEX}/:index/:mode`}
                        render={(props: RouteComponentProps) => (
                          <div style={ROUTE_STYLE}>
                            <CreateIndex {...props} commonService={services.commonService} />
                          </div>
                        )}
                      />
                      <Route
                        path={`${ROUTES.CREATE_INDEX}/:index`}
                        render={(props: RouteComponentProps) => (
                          <div style={ROUTE_STYLE}>
                            <CreateIndex {...props} commonService={services.commonService} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.CREATE_INDEX}
                        render={(props: RouteComponentProps) => (
                          <div style={ROUTE_STYLE}>
                            <CreateIndex {...props} commonService={services.commonService} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.REINDEX}
                        render={(props: RouteComponentProps) => (
                          <div style={ROUTE_STYLE}>
                            <Reindex {...props} commonService={services.commonService} indexService={services.indexService} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.SPLIT_INDEX}
                        render={(props: RouteComponentProps) => (
                          <div style={ROUTE_STYLE}>
                            <SplitIndex {...props} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.ALIASES}
                        render={(props) => (
                          <div style={ROUTE_STYLE}>
                            <Aliases {...props} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.TEMPLATES}
                        render={(props) => (
                          <div style={ROUTE_STYLE}>
                            <Templates {...props} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.COMPOSABLE_TEMPLATES}
                        render={(props) => (
                          <div style={ROUTE_STYLE}>
                            <ComposableTemplates {...props} />
                          </div>
                        )}
                      />
                      <Route
                        path={`${ROUTES.CREATE_COMPOSABLE_TEMPLATE}/:template/:mode`}
                        render={(props) => (
                          <div style={ROUTE_STYLE}>
                            <CreateComposableTemplate {...props} />
                          </div>
                        )}
                      />
                      <Route
                        path={`${ROUTES.CREATE_COMPOSABLE_TEMPLATE}/:template`}
                        render={(props) => (
                          <div style={ROUTE_STYLE}>
                            <CreateComposableTemplate {...props} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.CREATE_COMPOSABLE_TEMPLATE}
                        render={(props) => (
                          <div style={ROUTE_STYLE}>
                            <CreateComposableTemplate {...props} />
                          </div>
                        )}
                      />
                      <Route
                        path={`${ROUTES.CREATE_TEMPLATE}/:template/:mode`}
                        render={(props) => (
                          <div style={ROUTE_STYLE}>
                            <CreateIndexTemplate {...props} />
                          </div>
                        )}
                      />
                      <Route
                        path={`${ROUTES.CREATE_TEMPLATE}/:template`}
                        render={(props) => (
                          <div style={ROUTE_STYLE}>
                            <CreateIndexTemplate {...props} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.CREATE_TEMPLATE}
                        render={(props) => (
                          <div style={ROUTE_STYLE}>
                            <CreateIndexTemplate {...props} />
                          </div>
                        )}
                      />
                      <Route
                        path={`${ROUTES.INDEX_DETAIL}/:index`}
                        render={(props) => (
                          <div style={ROUTE_STYLE}>
                            <IndexDetail {...props} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.SHRINK_INDEX}
                        render={(props) => (
                          <div style={ROUTE_STYLE}>
                            <ShrinkIndex {...props} commonService={services.commonService} />
                          </div>
                        )}
                      />
                      <Route
                        path={`${ROUTES.ROLLOVER}/:source`}
                        render={(props) => (
                          <div style={ROUTE_STYLE}>
                            <Rollover {...props} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.ROLLOVER}
                        render={(props) => (
                          <div style={ROUTE_STYLE}>
                            <Rollover {...props} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.DATA_STREAMS}
                        render={(props) => (
                          <div style={ROUTE_STYLE}>
                            <DataStreams {...props} />
                          </div>
                        )}
                      />
                      <Route
                        path={`${ROUTES.CREATE_DATA_STREAM}/:dataStream`}
                        render={(props) => (
                          <div style={ROUTE_STYLE}>
                            <CreateDataStream {...props} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.CREATE_DATA_STREAM}
                        render={(props) => (
                          <div style={ROUTE_STYLE}>
                            <CreateDataStream {...props} />
                          </div>
                        )}
                      />
                      <Route
                        path={`${ROUTES.FORCE_MERGE}/:indexes`}
                        render={(props) => (
                          <div style={ROUTE_STYLE}>
                            <ForceMerge {...props} />
                          </div>
                        )}
                      />
                      <Route
                        path={ROUTES.FORCE_MERGE}
                        render={(props) => (
                          <div style={ROUTE_STYLE}>
                            <ForceMerge {...props} />
                          </div>
                        )}
                      /> */}
                      {indexManagementItems.reduce(
                        (total, current) => [...total, ...current.hashRoutes.map((route) => <Route {...route} key={route.path} />)],
                        [] as React.ReactChild[]
                      )}
                      {snapshotManagementItems.reduce(
                        (total, current) => [...total, ...current.hashRoutes.map((route) => <Route {...route} key={route.path} />)],
                        [] as React.ReactChild[]
                      )}
                      <Redirect from="/" to={landingPage} />
                    </Switch>
                  </ModalProvider>
                )
              }
            </ServicesConsumer>
          )
        }
      </CoreServicesConsumer>
    );
  }
}
