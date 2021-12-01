/**
 * Method that ensures that provided value is a float (and converts it to float if needed).
 *
 * @param value The value to convert to float
 * @returns value of parameter in number or float.
 */
export const toFloat = (value: string | number) => typeof value === 'number' ? value : parseFloat(value);
