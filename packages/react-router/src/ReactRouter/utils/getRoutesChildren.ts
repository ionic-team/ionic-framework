import React from 'react';
import { Routes } from 'react-router';

export const getRoutesChildren = (node: React.ReactNode) => {
  // The use of `<Routes />` is encouraged with React Router v6.
  let routesNode: React.ReactNode;
  React.Children.forEach(node as React.ReactElement, (child: React.ReactElement) => {
    if (child.type === Routes) {
      routesNode = child;
    }
  });

  if (routesNode) {
    // The children of the `<Routes />` component are most likely
    // (and should be) the `<Route />` components.
    return (routesNode as React.ReactElement).props.children;
  }
  return undefined;
};
