/**
 * Returns name of the method
 * @param method - method from owner object
 * @param owner - object containing the method
 */
export function nameof<T>(method: Function, owner?: T): keyof T
{
    return method.name as keyof T;
}