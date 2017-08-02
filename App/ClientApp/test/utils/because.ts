export function because(reason: () => any)
{
    return `Because ${
        reason.toString()
            .replace(/^.*=>|^function \(\) { return |; }$/g, "")
        } == ${reason()}`;
}