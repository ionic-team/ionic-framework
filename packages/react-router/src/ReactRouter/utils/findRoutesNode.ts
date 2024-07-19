import React from "react";
import { Routes } from "react-router";

export const findRoutesNode = (node: React.ReactNode) => {
  // Finds the <Routes /> component node
  let routesNode: React.ReactNode;
  React.Children.forEach(node as React.ReactElement, (child: React.ReactElement) => {
    if (child.type === Routes) {
      routesNode = child;
    }
  });
  if (routesNode) {
    return (routesNode as React.ReactElement).props.children;
  }
  return undefined;
};
