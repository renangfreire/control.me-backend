export function mergeObject(spreadObject: object, overwriteObject: object){
    const filteredOverwriteObjEntries = Object.entries(overwriteObject).filter(([key, value]) => value !== undefined)
    const filteredObj = Object.fromEntries(filteredOverwriteObjEntries)

    return {
        ...spreadObject,
        ...filteredObj
    }
}