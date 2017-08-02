export function nameof<T>(method: Function, owner?: T): keyof T
{
    return method.name as keyof T;
}