import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

/**
 * Extracts the children from a Routes wrapper component.
 * The use of `<Routes />` is encouraged with React Router v6.
 *
 * @param node The React node to extract Routes children from.
 * @returns The children of the Routes component, or undefined if not found.
 */
export const getRoutesChildren = (node: React.ReactNode): React.ReactNode | undefined => {
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

/**
 * Extracts Route children from a node (either directly or from a Routes wrapper).
 *
 * @param children The children to extract routes from.
 * @returns An array of Route elements.
 */
export const extractRouteChildren = (children: React.ReactNode): React.ReactElement[] => {
  const routesChildren = getRoutesChildren(children) ?? children;
  return React.Children.toArray(routesChildren).filter(
    (child): child is React.ReactElement => React.isValidElement(child) && child.type === Route
  );
};

/**
 * Checks if a React element is a Navigate component (redirect).
 *
 * @param element The element to check.
 * @returns True if the element is a Navigate component.
 */
export const isNavigateElement = (element: unknown): boolean => {
  return (
    React.isValidElement(element) &&
    (element.type === Navigate || (typeof element.type === 'function' && element.type.name === 'Navigate'))
  );
};
