import { NavControllerData } from './nav-utils';

const dataMap = new Map<string, NavControllerData>();

export function getStateData(id: string) {
  let data = dataMap.get(id);
  if (!data) {
    data = {};
    dataMap.set(id, data);
  }
  return data;
}

export function updateStateData(id: string, data: NavControllerData) {
  dataMap.set(id, data);
}

