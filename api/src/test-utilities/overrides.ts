const overrideValues = <T>(template: T, overrides: Partial<T>): T => {
    return {
        ...template,
        ...overrides
    }
}

export {
    overrideValues
}
